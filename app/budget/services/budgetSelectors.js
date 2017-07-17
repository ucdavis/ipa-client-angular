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
		generateLineItemCategories: function (lineItemCategories) {
			
			lineItemCategoryList = [];

			lineItemCategories.ids.forEach( function (lineItemCategoryId) {
				lineItemCategoryList.push(lineItemCategories.list[lineItemCategoryId]);
			});

			return lineItemCategoryList;
		},
		generateSelectedBudgetScenario: function (budgetScenarios, lineItems, ui, lineItemCategories, sectionGroupCosts, sectionGroups, sections, courses) {
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
			});

			// Add sectionGroupCosts (for selected termCode)
			selectedBudgetScenario.selectedTerm = ui.selectedTerm;
			selectedBudgetScenario.courses = []; // Will hold sectionGroupCosts, grouped by subj/course number
			var addedCoursesHash = {}; // Will hold the index of a given course in courses, based on subj/course number key

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
				var termCode = sectionGroupCost.termCode;
				var term = termCode.slice(-2);


				if (selectedBudgetScenario.terms.indexOf(term) == -1) {
					selectedBudgetScenario.terms.push(term);
				}

				if (term == selectedBudgetScenario.selectedTerm) {
					// Ensure the sectionGroupCost is for the relevant term

					// Determine if a course for this sectionGroup has been made
					// Course will hold all sectionGroups with the same subj/course number
					var sectionGroupKey = sectionGroupCost.subjectCode + sectionGroupCost.courseNumber;
					var newCourseIndex = null;

					if (addedCoursesHash[sectionGroupKey] == null) {

						// Add the course 
						var newcourse = {
							sectionGroupCosts: [],
							subjectCode: sectionGroupCost.subjectCode,
							courseNumber: sectionGroupCost.courseNumber,
							title: sectionGroupCost.title
						};

						selectedBudgetScenario.courses.push(newcourse);

						// Store the new course index in the hash
						newCourseIndex = selectedBudgetScenario.courses.length - 1;
						addedCoursesHash[sectionGroupKey] = newCourseIndex;
					} else {
						newCourseIndex = addedCoursesHash[sectionGroupKey];
					}

					// Setting UI states for sectionGroupCost
					sectionGroupCost.displaySectionCountInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displaySectionCountInput;
					sectionGroupCost.displayTaCountInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displayTaCountInput;
					sectionGroupCost.displayReaderCountInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displayReaderCountInput;
					sectionGroupCost.displayEnrollmentInput = ui.sectionGroupCostDetails[sectionGroupCost.id].displayEnrollmentInput;

					// Now the proper course has been identified (or created), add the sectionGroup
					selectedBudgetScenario.courses[newCourseIndex].sectionGroupCosts.push(sectionGroupCost);
				}
			});

			return selectedBudgetScenario;
		}
	};
});
