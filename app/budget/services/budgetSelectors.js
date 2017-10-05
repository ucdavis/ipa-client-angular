/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
budgetApp.service('budgetSelectors', function () {
	return {
		// Generate list of budget scenarios to display in the dropdown selector
		generateBudgetScenarios: function (budgetScenarios) {
			budgetScenarioList = [];

			budgetScenarios.ids.forEach( function (budgetScenarioId) {
				budgetScenarioList.push(budgetScenarios.list[budgetScenarioId]);
			});

			return budgetScenarioList;
		},
		generateInstructors: function (instructors, instructorCosts) {
			instructorList = [];

			instructorCosts.ids.forEach( function (instructorCostId) {
				var instructorCost = instructorCosts.list[instructorCostId];
				var instructor = instructors.list[instructorCost.instructorId];

				var newInstructor = {};

				newInstructor.firstName = instructor.firstName;
				newInstructor.lastName = instructor.lastName;
				newInstructor.fullName = instructor.fullName;
				newInstructor.emailAddress = instructor.emailAddress;
				newInstructor.loginId = instructor.loginId;
				newInstructor.description = instructor.fullName;
				newInstructor.id = instructor.id;

				newInstructor.instructorCostId = instructorCost.id;
				newInstructor.cost = instructorCost.cost;
				newInstructor.lecturer = instructorCost.lecturer;
				newInstructor.instructorId = instructor.id;

				instructorList.push(newInstructor);
			});

			return instructorList;
		},
		generateLineItemCategories: function (lineItemCategories) {
			lineItemCategoryList = [];

			lineItemCategories.ids.forEach( function (lineItemCategoryId) {
				lineItemCategoryList.push(lineItemCategories.list[lineItemCategoryId]);
			});

			return lineItemCategoryList;
		},
		generateSelectedBudgetScenario: function (
			budgetScenarios,
			lineItems,
			lineItemComments,
			ui,
			lineItemCategories,
			sectionGroupCosts,
			sectionGroupCostComments,
			instructors,
			budget,
			instructorCosts,
			sectionGroups,
			sections,
			courses,
			scheduleSectionGroups,
			users
		) {
			var selectedBudgetScenario = budgetScenarios.list[ui.selectedBudgetScenarioId];

			// selectedBudgetScenarioId refers to a scenario that no longer exists
			// We will attempt to automatically select another scenario to be 'active'
			if (selectedBudgetScenario == null) {
				if (budgetScenarios.ids.length > 0) {
					// Pick the first available
					var budgetScenarioId = budgetScenarios.ids[0];
					selectedBudgetScenario = budgetScenarios.list[budgetScenarioId];
				} else {
					// There are no scenarios, so there cannot be an active scenario
					return null;
				}
			}

			// Set main view UI states
			selectedBudgetScenario.isLineItemOpen = ui.isLineItemOpen;
			selectedBudgetScenario.isCourseCostOpen = ui.isCourseCostOpen;

			// Add lineItems
			selectedBudgetScenario.lineItems = [];

			lineItems.ids.forEach( function (lineItemId) {
				var lineItem = lineItems.list[lineItemId];

				// Ensure lineItem belongs to selected budget scenario
				if (lineItem.budgetScenarioId != selectedBudgetScenario.id) {
					return;
				}

				// Set lineItemComments
				lineItem.comments = [];

				lineItemComments.ids.forEach(function(commentId) {
					var comment = lineItemComments.list[commentId];

					if (comment.lineItemId == lineItem.id) {
						lineItem.comments.push(comment);
					}
				});

				// Sort sectionGroupCostComments
				var reverseOrder = true;
				lineItem.comments =_array_sortByProperty(lineItem.comments, "lastModifiedOn", reverseOrder);

				// Add lineItemCategory description
				var lineItemCategoryDescription = lineItemCategories.list[lineItem.lineItemCategoryId].description;
				lineItem.lineItemCategoryDescription = lineItemCategoryDescription;

				// Setting UI state for line item detail view
				lineItem.isDetailViewOpen = ui.lineItemDetails[lineItem.id].isDetailViewOpen;
				lineItem.displayTypeInput = ui.lineItemDetails[lineItem.id].displayTypeInput;
				lineItem.displayAmountInput = ui.lineItemDetails[lineItem.id].displayAmountInput;
				lineItem.displayNotesInput = ui.lineItemDetails[lineItem.id].displayNotesInput;
				lineItem.displayDescriptionInput = ui.lineItemDetails[lineItem.id].displayDescriptionInput;

				selectedBudgetScenario.lineItems.push(lineItem);
				if (ui.openLineItems.indexOf(lineItem.id) > -1) {
					lineItem.isDetailViewOpen = true;
				}

				// Set 'lastModifiedBy'
				// Expected formats are 'system' or 'user:bobsmith'
				// Will convert 'user:bobsmith' to 'Smith, Bob'
				if (lineItem.lastModifiedBy) {
					var split = lineItem.lastModifiedBy.split(":");
					if (split.length > 0 && split[0] == "user") {
						var loginId = split[1];

						users.ids.forEach(function(userId) {
							var user = users.list[userId];
							if (user.loginId == loginId) {
								lineItem.lastModifiedBy = user.firstName + " " + user.lastName;
							}
						});
					}
				}
			});

			// Add sectionGroupCosts (for selected termCode)
			selectedBudgetScenario.selectedTerm = ui.selectedTerm;
			selectedBudgetScenario.courses = []; // Will hold sectionGroupCosts, grouped by subj/course number
			selectedBudgetScenario.allCourses = []; // Will hold sectionGroupCosts, grouped by subj/course number

			var addedAllCoursesHash = {}; // Will hold the index of a given course in courses, based on subj/course number key
			var addedCoursesHash = {};
			selectedBudgetScenario.terms = [];
			selectedBudgetScenario.termDescriptions = {
				'05': 'Summer Session 1',
				'06': 'Summer Special Session',
				'07': 'Summer Session 2',
				'08': 'Summer Quarter',
				'09': 'Fall Semester',
				'10': 'Fall Quarter',
				'01': 'Winter Quarter',
				'02': 'Spring Semester',
				'03': 'Spring Quarter'
			};

			sectionGroupCosts.ids.forEach(function(sectionGroupCostId) {
				var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

				// Ensure sectionGroupCost belongs to selected budget scenario
				if (sectionGroupCost.budgetScenarioId != selectedBudgetScenario.id) {
					return;
				}

				var termCode = sectionGroupCost.termCode;
				var term = termCode.slice(-2);


				if (selectedBudgetScenario.terms.indexOf(term) == -1) {
					selectedBudgetScenario.terms.push(term);
				}

				// Determine if a course for this sectionGroup has been made
				// Course will hold all sectionGroups with the same subj/course number
				var sectionGroupKey = sectionGroupCost.subjectCode + sectionGroupCost.courseNumber;
				var newAllCourseIndex = null;

				if (addedAllCoursesHash[sectionGroupKey] == null) {

					// Add the course
					var newCourse = {
						sectionGroupCosts: [],
						subjectCode: sectionGroupCost.subjectCode,
						courseNumber: sectionGroupCost.courseNumber,
						title: sectionGroupCost.title,
						uniqueKey: sectionGroupCost.subjectCode + sectionGroupCost.courseNumber
					};

					selectedBudgetScenario.allCourses.push(newCourse);

					// Store the new course index in the hash
					newAllCourseIndex = selectedBudgetScenario.allCourses.length - 1;
					addedAllCoursesHash[sectionGroupKey] = newAllCourseIndex;
				} else {
					newAllCourseIndex = addedAllCoursesHash[sectionGroupKey];
					newCourse = selectedBudgetScenario.allCourses[newAllCourseIndex];
				}

				// Setting UI states for sectionGroupCost
				sectionGroupCost.displaySectionCountInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displaySectionCountInput;
				sectionGroupCost.displayTaCountInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displayTaCountInput;
				sectionGroupCost.displayReaderCountInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displayReaderCountInput;
				sectionGroupCost.displayEnrollmentInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displayEnrollmentInput;
				sectionGroupCost.displayInstructorCostInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displayInstructorCostInput;
				sectionGroupCost.displayReasonInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displayReasonInput;

				// add sectionGroupCost instructor metaData
				var instructor = instructors.list[sectionGroupCost.instructorId];
				if (instructor != null) {
					sectionGroupCost.instructor = instructor;
				}

				var originalInstructor = instructors.list[sectionGroupCost.originalInstructorId];
				if (originalInstructor != null) {
					sectionGroupCost.originalInstructor = originalInstructor;
				}

				// Set taCost
				var taCost = sectionGroupCost.taCount * budget.taCost;
				sectionGroupCost.taCost = parseFloat(taCost).toFixed(2);
				sectionGroupCost.taCostDisplay = toCurrency(sectionGroupCost.taCost);
				// Set readerCost
				var readerCost = sectionGroupCost.readerCount * budget.readerCost;
				sectionGroupCost.readerCost = parseFloat(readerCost).toFixed(2);
				sectionGroupCost.readerCostDisplay = toCurrency(sectionGroupCost.readerCost);

				// Set supportCostSubTotal
				var supportCostSubTotal = readerCost + taCost;
				sectionGroupCost.supportCostSubTotal = parseFloat(supportCostSubTotal).toFixed(2);
				sectionGroupCost.supportCostSubTotalDisplay = toCurrency(sectionGroupCost.supportCostSubTotal);

				// Set instructorCostSubTotal
				var instructorCostSubTotal = 0;

				// Use budget specific cost if instructor is a lecturer
				var instructor = instructors.list[sectionGroupCost.instructorId];

				if (instructor) {
					var instructorCost = instructorCosts.list[instructor.instructorCostId];
				}

				if (instructorCost && instructorCost.lecturer) {
					instructorCostSubTotal = budget.lecturerCost;
				}

				// Use instructor specific override for instructor cost
				if (sectionGroupCost.instructorId != null && instructorCost && instructorCost.cost) {
					instructorCostSubTotal = instructorCost.cost;
				}

				// Use sectionGroupCost override for instructor cost
				if (sectionGroupCost.instructorCost != null) {
					instructorCostSubTotal = sectionGroupCost.instructorCost;
				}

				// Set 'actual instructor cost'
				// When sectionGroup.instructorCost is overridden, we will display this value
				sectionGroupCost.actualInstructorCost = instructorCostSubTotal;
				sectionGroupCost.actualInstructorCostDisplay = toCurrency(sectionGroupCost.actualInstructorCost);

				// Set totalCost
				var totalCost = supportCostSubTotal + instructorCostSubTotal;
				sectionGroupCost.totalCost = parseFloat(totalCost).toFixed(2);
				sectionGroupCost.totalCostDisplay = toCurrency(sectionGroupCost.totalCost);
				// Set sectionGroupCostComments
				sectionGroupCost.comments = [];

				sectionGroupCostComments.ids.forEach(function(commentId) {
					var comment = sectionGroupCostComments.list[commentId];

					if (comment.sectionGroupCostId == sectionGroupCost.id) {
						sectionGroupCost.comments.push(comment);
					}
				});

				// Sort sectionGroupCostComments
				var reverseOrder = true;
				sectionGroupCost.comments =_array_sortByProperty(sectionGroupCost.comments, "lastModifiedOn", reverseOrder);

				// Add schedule data
				var uniqueKey = sectionGroupCost.subjectCode
				+ "-" + sectionGroupCost.courseNumber
				+ "-" + sectionGroupCost.sequencePattern
				+ "-" + sectionGroupCost.termCode;

				var scheduledSectionGroup = scheduleSectionGroups.list[uniqueKey];
				sectionGroupCost.liveData = {};


				if (scheduledSectionGroup) {
					sectionGroupCost.liveData.sectionCount = scheduledSectionGroup.sectionCount;
					sectionGroupCost.liveData.totalSeats = scheduledSectionGroup.totalSeats;
					sectionGroupCost.liveData.taCount = scheduledSectionGroup.taCount;
					sectionGroupCost.liveData.readerCount = scheduledSectionGroup.readerCount;
				}

				// Generate warnings
				sectionGroupCost.warnings = {
					sectionCount: null,
					totalSeats: null
				};

				if (sectionGroupCost.liveData.sectionCount != sectionGroupCost.sectionCount) {
					sectionGroupCost.warnings.sectionCount = "The current schedule has " + sectionGroupCost.liveData.sectionCount + " sections";
				}

				if (sectionGroupCost.liveData.totalSeats != sectionGroupCost.enrollment) {
					sectionGroupCost.warnings.totalSeats = "The current schedule has " + sectionGroupCost.liveData.totalSeats + " total seats";
				}

				if (sectionGroupCost.liveData.taCount != sectionGroupCost.taCount) {
					sectionGroupCost.warnings.taCount = "The current schedule has " + sectionGroupCost.liveData.taCount + " TAs";
				}

				if (sectionGroupCost.liveData.readerCount != sectionGroupCost.readerCount) {
					sectionGroupCost.warnings.readerCount = "The current schedule has " + sectionGroupCost.liveData.readerCount + " readers";
				}

				// Add the sectionGroup to the course
				selectedBudgetScenario.allCourses[newAllCourseIndex].sectionGroupCosts.push(sectionGroupCost);

				// Optionally add sectionGroupCost (and course) to term scoped list
				if (term == selectedBudgetScenario.selectedTerm) {
					if (addedCoursesHash[sectionGroupKey] == null) {
						var newCourse = {
							sectionGroupCosts: [],
							subjectCode: sectionGroupCost.subjectCode,
							courseNumber: sectionGroupCost.courseNumber,
							title: sectionGroupCost.title,
							uniqueKey: sectionGroupCost.subjectCode + sectionGroupCost.courseNumber
						};

						selectedBudgetScenario.courses.push(newCourse);

						// Store the new course index in the hash
						newCourseIndex = selectedBudgetScenario.courses.length - 1;
						addedCoursesHash[sectionGroupKey] = newCourseIndex;
					} else {
						newCourseIndex = addedCoursesHash[sectionGroupKey];
					}

					selectedBudgetScenario.courses[newCourseIndex].sectionGroupCosts.push(sectionGroupCost);
				}
			});

			// Calculate summary data
			selectedBudgetScenario.summary = {
				totalBalance: 0,
				lastModifiedOn: null,
				lineItems: {},
				courseCosts: {}
			};

			// Dynamically generate lineItem data to ensure adding/removing lineItems in the future will not affect calculations
			selectedBudgetScenario.summary.lineItems = {};
			selectedBudgetScenario.summary.lineItems.categories = [];
			selectedBudgetScenario.summary.lineItems.total = 0;
			selectedBudgetScenario.summary.lineItemIndexHash = {};

			lineItemCategories.ids.forEach(function(lineItemCategoryId, index) {
				var lineItemCategory = lineItemCategories.list[lineItemCategoryId];

				var newSummaryLineItemCategory = {
					raw: 0,
					percentage: 0,
					display: "$0.00",
					description: lineItemCategory.description
				};

				selectedBudgetScenario.summary.lineItems.categories.push(newSummaryLineItemCategory);

				// Create hash to look up the index by id
				selectedBudgetScenario.summary.lineItemIndexHash[lineItemCategory.id] = index;
			});

			// Sort courses
			selectedBudgetScenario.courses =_array_sortByProperty(selectedBudgetScenario.courses, ["subjectCode", "courseNumber"]);

			// Calculate raw/display course costs
			selectedBudgetScenario.summary.courseCosts = {
				taCosts: {
					raw: 0,
					percentage: 0
				},
				readerCosts: {
					raw: 0,
					percentage: 0
				},
				instructorCosts: {
					raw: 0,
					percentage: 0
				},
				total: 0
			};

			selectedBudgetScenario.allCourses.forEach(function(course) {
				course.sectionGroupCosts.forEach(function(sectionGroupCost) {
					selectedBudgetScenario.summary.courseCosts.taCosts.raw += parseFloat(sectionGroupCost.taCost);
					selectedBudgetScenario.summary.courseCosts.taCosts.display = toCurrency(selectedBudgetScenario.summary.courseCosts.taCosts.raw);
					selectedBudgetScenario.summary.courseCosts.readerCosts.raw += parseFloat(sectionGroupCost.readerCost);
					selectedBudgetScenario.summary.courseCosts.readerCosts.display = toCurrency(selectedBudgetScenario.summary.courseCosts.readerCosts.raw);
					selectedBudgetScenario.summary.courseCosts.instructorCosts.raw += parseFloat(sectionGroupCost.actualInstructorCost);
					selectedBudgetScenario.summary.courseCosts.instructorCosts.display = toCurrency(selectedBudgetScenario.summary.courseCosts.instructorCosts.raw);
					selectedBudgetScenario.summary.courseCosts.total += parseFloat(sectionGroupCost.totalCost);
				});
			});

			// Calculate course cost percentages
			if (selectedBudgetScenario.summary.courseCosts.taCosts.raw != 0) {
				var percentage = 100 * selectedBudgetScenario.summary.courseCosts.taCosts.raw / selectedBudgetScenario.summary.courseCosts.total;
				selectedBudgetScenario.summary.courseCosts.taCosts.percentage = Math.round(percentage);
			}
			if (selectedBudgetScenario.summary.courseCosts.readerCosts.raw != 0) {
				var percentage = 100 * selectedBudgetScenario.summary.courseCosts.readerCosts.raw / selectedBudgetScenario.summary.courseCosts.total;
				selectedBudgetScenario.summary.courseCosts.readerCosts.percentage = Math.round(percentage);
			}
			if (selectedBudgetScenario.summary.courseCosts.instructorCosts.raw != 0) {
				var percentage = 100 * selectedBudgetScenario.summary.courseCosts.instructorCosts.raw / selectedBudgetScenario.summary.courseCosts.total;
				selectedBudgetScenario.summary.courseCosts.instructorCosts.percentage = Math.round(percentage);
			}

			// Store all line item costs for graph calculations
			var rawLineItemCosts = 0;
			// Calculate raw line items
			selectedBudgetScenario.lineItems.forEach(function(lineItem) {
				var index = selectedBudgetScenario.summary.lineItemIndexHash[lineItem.lineItemCategoryId];
				var lineItemCategorySummary = selectedBudgetScenario.summary.lineItems.categories[index];
				lineItemCategorySummary.raw += parseFloat(lineItem.amount);
				lineItemCategorySummary.display = toCurrency(lineItemCategorySummary.raw);
				selectedBudgetScenario.summary.lineItems.total += parseFloat(lineItem.amount);

				// Calculate line item costs
				if (lineItem.amount < 0) {
					rawLineItemCosts += parseFloat(Math.abs(lineItem.amount));
				}

				lineItem.amountDisplay = toCurrency(lineItem.amount);
			});

			// Hash no longer needed
			delete selectedBudgetScenario.summary.lineItemIndexHash;

			// Calculate line item percentages
			selectedBudgetScenario.summary.lineItems.categories.forEach(function(lineItemCategory) {
				if (lineItemCategory.raw != 0) {
					var percentage = 100 * lineItemCategory.raw / selectedBudgetScenario.summary.lineItems.total;

					lineItemCategory.percentage = Math.round(percentage);
				}
			});

			// Calculate Costs data for graph
			selectedBudgetScenario.summary.costs = [];
			var costsRawTotal = selectedBudgetScenario.summary.courseCosts.instructorCosts.raw
			+ selectedBudgetScenario.summary.courseCosts.taCosts.raw
			+ selectedBudgetScenario.summary.courseCosts.readerCosts.raw
			+ rawLineItemCosts;

			selectedBudgetScenario.summary.costs.push({
				description: "Instructor Costs",
				value: (selectedBudgetScenario.summary.courseCosts.instructorCosts.raw / costsRawTotal * 100).toFixed(2)
			});
			selectedBudgetScenario.summary.costs.push({
				description: "Reader Costs",
				value: (selectedBudgetScenario.summary.courseCosts.readerCosts.raw / costsRawTotal * 100).toFixed(2)
			});
			selectedBudgetScenario.summary.costs.push({
				description: "Teaching Assistant Costs",
				value: (selectedBudgetScenario.summary.courseCosts.taCosts.raw / costsRawTotal * 100).toFixed(2)
			});
			selectedBudgetScenario.summary.costs.push({
				description: "Line Item Costs",
				value: (rawLineItemCosts / costsRawTotal * 100).toFixed(2)
			});
			selectedBudgetScenario.summary.costsTotal = toCurrency(costsRawTotal);
			selectedBudgetScenario.summary.graphTitleText = "Total Costs (" + selectedBudgetScenario.summary.costsTotal + ")";
			// Calculate total
			var totalBalance = selectedBudgetScenario.summary.lineItems.total - selectedBudgetScenario.summary.courseCosts.total;
			selectedBudgetScenario.summary.totalBalance = toCurrency(totalBalance);

			// All calculations are now complete, prepare totals for display
			selectedBudgetScenario.summary.lineItems.total = toCurrency(selectedBudgetScenario.summary.lineItems.total);
			selectedBudgetScenario.summary.courseCosts.total = toCurrency(selectedBudgetScenario.summary.courseCosts.total);

			return selectedBudgetScenario;
		}
	};
});
