import { dateToCalendar } from '../../../shared/helpers/dates';

class BudgetComparisonReportCalculations {
  constructor(BudgetComparisonReportReducers, ActionTypes) {
    return {
      calculateView: function() {
        var budget = BudgetComparisonReportReducers._state.budget;
        var budgetScenarios =
          BudgetComparisonReportReducers._state.budgetScenarios;
        var lineItems = BudgetComparisonReportReducers._state.lineItems;
        var teachingAssignments =
          BudgetComparisonReportReducers._state.teachingAssignments;
        var instructorTypeCosts =
          BudgetComparisonReportReducers._state.instructorTypeCosts;
        var instructorCosts =
          BudgetComparisonReportReducers._state.instructorCosts;
        var sectionGroupCosts =
          BudgetComparisonReportReducers._state.sectionGroupCosts;

        var currentSelectedBudgetScenario = this._getBudgetScenario(
          budgetScenarios.currentSelectedScenarioId,
          budgetScenarios.current
        );
        var previousSelectedBudgetScenario = this._getBudgetScenario(
          budgetScenarios.previousSelectedScenarioId,
          budgetScenarios.previous
        );

        var calculatedView = {
          ui: {
            currentSelectedBudgetScenario: currentSelectedBudgetScenario,
            previousSelectedBudgetScenario: previousSelectedBudgetScenario,
            currentBudgetScenarios: this._getBudgetScenarios(
              BudgetComparisonReportReducers._state.budgetScenarios.current
            ),
            previousBudgetScenarios: this._getBudgetScenarios(
              BudgetComparisonReportReducers._state.budgetScenarios.previous
            )
          },
          current: {
            costs: this._generateCosts(
              teachingAssignments.current,
              instructorTypeCosts.current,
              instructorCosts.current,
              sectionGroupCosts.current,
              budget.current,
              currentSelectedBudgetScenario
            ),
            funding: this._generateFunding(
              lineItems.current,
              budgetScenarios.currentSelectedScenarioId
            ),
            miscStats: this._generateMiscStats(
              sectionGroupCosts.current,
              currentSelectedBudgetScenario
            )
          },
          previous: {
            costs: this._generateCosts(
              teachingAssignments.previous,
              instructorTypeCosts.previous,
              instructorCosts.previous,
              sectionGroupCosts.previous,
              budget.previous,
              previousSelectedBudgetScenario
            ),
            funding: this._generateFunding(
              lineItems.previous,
              budgetScenarios.previousSelectedScenarioId
            ),
            miscStats: this._generateMiscStats(
              sectionGroupCosts.previous,
              previousSelectedBudgetScenario
            )
          }
        };

        calculatedView.change = {
          costs: this._generateCostChange(
            calculatedView.current.costs,
            calculatedView.previous.costs
          ),
          funding: this._generatefundingChange(
            calculatedView.current.funding,
            calculatedView.previous.funding
          ),
          miscStats: this._generateMiscStatsChange(
            calculatedView.current.miscStats,
            calculatedView.previous.miscStats
          )
        };

        BudgetComparisonReportReducers.reduce({
          type: ActionTypes.CALCULATE_VIEW,
          payload: {
            calculatedView: calculatedView
          }
        });
      },
      // Generates stats on seats and # of courses per area
      _generateMiscStats(sectionGroupCosts, selectedScenario) {
        var selectedScenarioId = selectedScenario.id;

        var miscStats = {
          lower: {
            courses: 0,
            seats: 0
          },
          upper: {
            courses: 0,
            seats: 0
          },
          grad: {
            courses: 0,
            seats: 0
          },
          total: {
            courses: 0,
            seats: 0
          }
        };

        sectionGroupCosts.ids.forEach(sectionGroupCostId => {
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          if (sectionGroupCost.disabled || sectionGroupCost.hidden) {
            return;
          }
          if (sectionGroupCost.budgetScenarioId != selectedScenarioId) {
            return;
          }
          if (
            selectedScenario.terms.indexOf(
              sectionGroupCost.termCode.slice(-2)
            ) == -1
          ) {
            return;
          }

          var courseNumber = parseInt(sectionGroupCost.courseNumber);
          var seats = sectionGroupCost.enrollment;
          if (courseNumber < 100) {
            miscStats.lower.courses += 1;
            miscStats.lower.seats += seats;
          } else if (courseNumber >= 200) {
            miscStats.grad.courses += 1;
            miscStats.grad.seats += seats;
          } else {
            miscStats.upper.courses += 1;
            miscStats.upper.seats += seats;
          }
        });

        miscStats.total.courses =
          miscStats.lower.courses +
          miscStats.grad.courses +
          miscStats.upper.courses;
        miscStats.total.seats =
          miscStats.lower.seats + miscStats.grad.seats + miscStats.upper.seats;

        return miscStats;
      },
      // Generates calculations for instructor and support (reader, TA) costs
      _generateCosts(
        teachingAssignments,
        instructorTypeCosts,
        instructorCosts,
        sectionGroupCosts,
        budget,
        selectedScenario
      ) {
        var selectedScenarioId = selectedScenario.id;
        var activeTerms = selectedScenario.terms;
        var costs = {
          instructorCosts: this._generateInstructionCosts(
            teachingAssignments,
            instructorTypeCosts,
            instructorCosts,
            sectionGroupCosts,
            selectedScenarioId,
            selectedScenario,
            activeTerms
          ),
          supportCosts: this._generateSupportCosts(
            budget,
            selectedScenario,
            selectedScenarioId,
            sectionGroupCosts,
            activeTerms
          ),
          total: null
        };

        costs.total =
          costs.instructorCosts.total.cost + costs.supportCosts.totalCost;

        return costs;
      },
      // Returns the cost associated with an assignment's instructor, based on the selected budget scenario
      _calculateAssignmentCost(
        selectedScenario,
        sectionGroupCost,
        instructorTypeCosts,
        instructorCosts,
        sectionGroupCostInstructors
      ) {
        var assignmentCosts = [];
        if (!sectionGroupCostInstructors){
          sectionGroupCostInstructors = BudgetComparisonReportReducers._state.sectionGroupCostInstructors.previous.instructors.bySectionGroupCostId[sectionGroupCost.id]
          || BudgetComparisonReportReducers._state.sectionGroupCostInstructors.current.instructors.bySectionGroupCostId[sectionGroupCost.id] || [];
        }


        for (var i = 0; i < sectionGroupCostInstructors.length; i++){
          var sectionGroupCostInstructor = sectionGroupCostInstructors[i];

          var cost = null;
          var instructorTypeId = sectionGroupCostInstructor.instructorTypeId;

          var instructorTypeCost = null;
          var instructorCost = null;
          var courseCost = sectionGroupCostInstructor.cost;

          // If an instructor is set
          if (!courseCost && sectionGroupCostInstructor.instructorId) {
            instructorCost = selectedScenario.isSnapshot
              ? instructorCosts.byBudgetScenarioId[selectedScenario.id].byInstructorId[sectionGroupCostInstructor.instructorId]
              : instructorCosts.byInstructorId[sectionGroupCostInstructor.instructorId];

            instructorTypeId = sectionGroupCostInstructor.instructorTypeId;

            // if no explicit instructor cost, attempt to find instructorType cost
            instructorTypeCost = selectedScenario.isSnapshot
              ? instructorTypeCosts.byBudgetScenarioId[selectedScenario.id].byInstructorTypeId[instructorTypeId]
              : instructorTypeCosts.byInstructorTypeId[instructorTypeId];

            // If only instructorType is set
          } else if (!courseCost && sectionGroupCostInstructor.instructorTypeId) {
            instructorTypeCost = selectedScenario.isSnapshot
              ? instructorTypeCosts.byBudgetScenarioId[selectedScenario.id].byInstructorTypeId[sectionGroupCostInstructor.instructorTypeId]
              : instructorTypeCosts.byInstructorTypeId[sectionGroupCostInstructor.instructorTypeId];

            instructorTypeId = sectionGroupCostInstructor.instructorTypeId;
          }

          if (courseCost || courseCost == 0) {
            cost = courseCost;
          } else if (instructorCost) {
            cost = instructorCost.cost;
          } else if (instructorTypeCost) {
            cost = instructorTypeCost.cost;
          } else {
            cost = null;
          }
          if (cost && instructorTypeId){
            assignmentCosts.push({
              cost: cost,
              instructorTypeId: instructorTypeId
            });
          }

        }

        return assignmentCosts;
      },
      _calculateInstructorTypeCosts(
        selectedScenario,
        sectionGroupCost,
        instructorTypeCosts,
        instructorCosts,
        sectionGroupCostInstructors){
        var assignmentCosts = [];

        if (!sectionGroupCostInstructors){
          sectionGroupCostInstructors = BudgetComparisonReportReducers._state.sectionGroupCostInstructors.previous.instructors.bySectionGroupCostId[sectionGroupCost.id]
          || BudgetComparisonReportReducers._state.sectionGroupCostInstructors.current.instructors.bySectionGroupCostId[sectionGroupCost.id] || [];
        }


        for (var i = 0; i < sectionGroupCostInstructors.length; i++){
          var sectionGroupCostInstructor = sectionGroupCostInstructors[i];
          var cost = sectionGroupCostInstructor.cost;
          var instructorTypeId = sectionGroupCostInstructor.instructorTypeId;
          var instructorId = sectionGroupCostInstructor.instructorId;

          // If cost not explicitly set find implicit value
          if (!cost){
            // Check if instructor has explicit cost
            if (instructorId){
              var instructorCost = selectedScenario.isSnapshot
              ? instructorCosts.byBudgetScenarioId[selectedScenario.id].byInstructorId[sectionGroupCostInstructor.instructorId]
              : instructorCosts.byInstructorId[sectionGroupCostInstructor.instructorId];
              if (instructorCost){
                cost = instructorCost.cost;
              }
            }

            // Check if instructor type has explicit cost
            if (!cost && instructorTypeId){
              var instructorTypeCost = selectedScenario.isSnapshot
              ? instructorTypeCosts.byBudgetScenarioId[selectedScenario.id].byInstructorTypeId[sectionGroupCostInstructor.instructorTypeId]
              : instructorTypeCosts.byInstructorTypeId[sectionGroupCostInstructor.instructorTypeId];
            }
            if (instructorTypeCost){
              cost = instructorTypeCost.cost;
            }
          }

          assignmentCosts.push({
              cost: cost,
              instructorTypeId: instructorTypeId
          });

        }

        return assignmentCosts;
      },
      // Generates instructor costs (based on sectionGroupCosts, and the selected budget scenario)
      _generateInstructionCosts(
        teachingAssignments,
        instructorTypeCosts,
        instructorCosts,
        sectionGroupCosts,
        selectedScenarioId,
        selectedScenario,
        activeTerms
      ) {
        var _self = this;
        var instructionCosts = {
          byType: {},
          byTypeNoCost: {},
          scenarioCourses: {},
          coursesWithCosts: {},
          unassigned: 0,
          total: {
            cost: 0,
            courses: 0,
            scenarioCourses: 0,
            coursesWithCosts: 0,
          }
        };
        var teachingAssignmentIdsPrevious = BudgetComparisonReportReducers._state.sectionGroupCostInstructors.previous.teachingAssignmentIds || [];
        var teachingAssignmentIdsCurrent = BudgetComparisonReportReducers._state.sectionGroupCostInstructors.current.teachingAssignmentIds || [];

        var teachingAssignmentInstructors = [];
        if (selectedScenario.fromLiveData){
          for (var teachingAssignmentId in teachingAssignments.list){
            var teachingAssignment  = teachingAssignments.list[teachingAssignmentId];
            if (teachingAssignment.sectionGroupId && teachingAssignment.sectionGroupId > 0 && !teachingAssignmentIdsPrevious.includes(teachingAssignment.id) && !teachingAssignmentIdsCurrent.includes(teachingAssignment.id) && activeTerms.indexOf(teachingAssignment.termCode.slice(-2)) != -1){
                var sectionGroupCostInstructor = {
                  cost: null,
                  sectionGroupCostInstructorId: null,
                  teachingAssignmentId: teachingAssignment.id,
                  instructorTypeId: teachingAssignment.instructorTypeId,
                  instructorId: teachingAssignment.instructorId
                };
                teachingAssignmentInstructors.push(sectionGroupCostInstructor);
            }
          }
        }

        var assignmentCosts = _self._calculateInstructorTypeCosts(
            selectedScenario,
            null,
            instructorTypeCosts,
            instructorCosts,
            teachingAssignmentInstructors
          );

        sectionGroupCosts.ids.forEach(function(sectionGroupCostId) {
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          if (sectionGroupCost.budgetScenarioId != selectedScenarioId) {
            return;
          }
          if (sectionGroupCost.disabled || sectionGroupCost.hidden) {
            return;
          }

          if (activeTerms.indexOf(sectionGroupCost.termCode.slice(-2)) == -1) {
            return;
          }

          assignmentCosts = assignmentCosts.concat(_self._calculateInstructorTypeCosts(
            selectedScenario,
            sectionGroupCost,
            instructorTypeCosts,
            instructorCosts
          ));

        });

        for ( var i = 0; i < assignmentCosts.length; i++){
            var assignmentCost = assignmentCosts[i];
            var instructorTypeId = assignmentCost.instructorTypeId;
            var cost = assignmentCost.cost;

            if (cost){
              if (instructorTypeId) {
                instructionCosts.byType[instructorTypeId] = instructionCosts.byType[instructorTypeId] || { cost: 0, courses: 0};
                instructionCosts.byType[instructorTypeId].courses += 1;
                instructionCosts.byType[instructorTypeId].cost += cost;
              } else {
                instructionCosts.unassigned = (instructionCosts.unassigned || 0) + 1;
              }

            } else {
              if (instructorTypeId){
                instructionCosts.byType[instructorTypeId] = instructionCosts.byType[instructorTypeId] || { cost: 0, courses: 0};
                instructionCosts.byType[instructorTypeId].courses += 1;
                instructionCosts.byTypeNoCost[instructorTypeId] = instructionCosts.byTypeNoCost[instructorTypeId] || 0;
                instructionCosts.byTypeNoCost[instructorTypeId] += 1;
              } else {
                instructionCosts.unassigned = (instructionCosts.unassigned || 0) + 1;
              }
            }
            instructionCosts.total.cost += cost;
            instructionCosts.total.courses += 1;
        }

        var instructorTypes = [
          ...new Set([
            ...Object.keys(instructionCosts.byType),
            ...Object.keys(instructionCosts.byTypeNoCost)
          ])
        ];

        instructorTypes.forEach(function(instructorType) {
          instructionCosts.scenarioCourses[instructorType] =
            (instructionCosts.byType[instructorType].courses || 0);
          instructionCosts.total.scenarioCourses +=
            instructionCosts.scenarioCourses[instructorType];
          if (instructionCosts.byType[instructorType].cost > 0){
            instructionCosts.coursesWithCosts[instructorType] = instructionCosts.byType[instructorType].courses;
            instructionCosts.total.coursesWithCosts += instructionCosts.byType[instructorType].courses;
          }
        });
        instructionCosts.total.scenarioCourses += instructionCosts.unassigned;
        return instructionCosts;
      },
      // Generates support (reader and TA) based costs and course count
      _generateSupportCosts(
        budget,
        selectedScenario,
        selectedScenarioId,
        sectionGroupCosts,
        activeTerms
      ) {
        var supportCosts = {
          taCount: 0,
          readerCount: 0,
          taCost: 0,
          readerCost: 0,
          totalCost: 0,
          totalCount: 0
        };

        sectionGroupCosts.ids.forEach(function(sectionGroupCostId) {
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          if (
            sectionGroupCost.budgetScenarioId != selectedScenarioId ||
            sectionGroupCost.disabled || sectionGroupCost.hidden
          ) {
            return;
          }
          if (activeTerms.indexOf(sectionGroupCost.termCode.slice(-2)) == -1) {
            return;
          }

          supportCosts.taCount += sectionGroupCost.taCount || 0;
          supportCosts.readerCount += sectionGroupCost.readerCount || 0;
        });

        const baseTaCost = selectedScenario.isSnapshot ? selectedScenario.taCost : budget.taCost;
        const baseReaderCost = selectedScenario.isSnapshot ? selectedScenario.readerCost : budget.readerCost;
        supportCosts.taCost = supportCosts.taCount * baseTaCost;
        supportCosts.readerCost = supportCosts.readerCount * baseReaderCost;

        supportCosts.totalCount +=
          supportCosts.taCount + supportCosts.readerCount;
        supportCosts.totalCost += supportCosts.taCost + supportCosts.readerCost;

        return supportCosts;
      },
      // Generates funding values based on the selected budget scenario
      _generateFunding(lineItems, selectedScenarioId) {
        var funding = {
          typeIds: [],
          types: {},
          total: 0
        };

        lineItems.ids.forEach(function(lineItemId) {
          var lineItem = lineItems.list[lineItemId];
          var lineItemCategoryId = lineItem.lineItemCategoryId;

          if (
            lineItem.budgetScenarioId != selectedScenarioId ||
            lineItem.amount == 0 ||
            lineItem.hidden
          ) {
            return;
          }

          if (funding.typeIds.indexOf(lineItemCategoryId) == -1) {
            funding.typeIds.push(lineItemCategoryId);
          }

          funding.types[lineItemCategoryId] =
            funding.types[lineItemCategoryId] || 0;
          funding.types[lineItemCategoryId] += lineItem.amount;
          funding.total += lineItem.amount;
        });

        return funding;
      },
      // Generates previous -> current change values for costs
      _generateCostChange(currentCosts, previousCosts) {
        var _self = this;

        var costs = {
          instructorCosts: {
            byType: {},
            total: {
              cost: 0,
              courses: 0
            }
          },
          supportCosts: {
            ta: {
              rawCount: (
                currentCosts.supportCosts.taCount -
                previousCosts.supportCosts.taCount
              ).toFixed(2),
              percentageCount: this._percentageChange(
                previousCosts.supportCosts.taCount,
                currentCosts.supportCosts.taCount
              ),
              rawCost:
                currentCosts.supportCosts.taCost -
                previousCosts.supportCosts.taCost,
              percentageCost: this._percentageChange(
                previousCosts.supportCosts.taCost,
                currentCosts.supportCosts.taCost
              )
            },
            reader: {
              rawCount: (
                currentCosts.supportCosts.readerCount -
                previousCosts.supportCosts.readerCount
              ).toFixed(2),
              percentageCount: this._percentageChange(
                previousCosts.supportCosts.readerCount,
                currentCosts.supportCosts.readerCount
              ),
              rawCost:
                currentCosts.supportCosts.readerCost -
                previousCosts.supportCosts.readerCost,
              percentageCost: this._percentageChange(
                previousCosts.supportCosts.readerCost,
                currentCosts.supportCosts.readerCost
              )
            },
            rawTotalCost:
              currentCosts.supportCosts.totalCost -
              previousCosts.supportCosts.totalCost,
            percentageTotalCost: this._percentageChange(
              previousCosts.supportCosts.totalCost,
              currentCosts.supportCosts.totalCost
            )
          }
        };

        var instructorTypes =
          BudgetComparisonReportReducers._state.instructorTypes;

        instructorTypes.current.ids.forEach(function(instructorTypeId) {
          var currentInstructorCost =
            currentCosts.instructorCosts.byType[instructorTypeId];
          var currentCost = currentInstructorCost
            ? currentInstructorCost.cost
            : 0;
          var currentCourses = currentInstructorCost
            ? currentInstructorCost.courses
            : 0;
          var currentCoursesCount = currentInstructorCost
            ? currentCosts.instructorCosts.scenarioCourses[instructorTypeId]
            : 0;
          var previousInstructorCost =
            previousCosts.instructorCosts.byType[instructorTypeId];
          var previousCost = previousInstructorCost
            ? previousInstructorCost.cost
            : 0;
          var previousCourses = previousInstructorCost
            ? previousInstructorCost.courses
            : 0;
          var previousCoursesCount = previousInstructorCost
            ? previousCosts.instructorCosts.scenarioCourses[instructorTypeId]
            : 0;

          costs.instructorCosts.byType[instructorTypeId] = {
            rawCourses: currentCourses - previousCourses,
            percentageCourses: _self._percentageChange(
              previousCourses,
              currentCourses
            ),
            rawCost: currentCost - previousCost,
            percentageCost: _self._percentageChange(previousCost, currentCost),
            percentageCoursesCount: _self._percentageChange(
              previousCoursesCount,
              currentCoursesCount
            )
          };
        });
        costs.instructorCosts.total = {
          rawCost:
            currentCosts.instructorCosts.total.cost -
            previousCosts.instructorCosts.total.cost,
          rawCourses:
            currentCosts.instructorCosts.total.courses -
            previousCosts.instructorCosts.total.courses,
          percentageCost: _self._percentageChange(
            previousCosts.instructorCosts.total.cost,
            currentCosts.instructorCosts.total.cost
          ),
          percentageCourses: _self._percentageChange(
            previousCosts.instructorCosts.total.courses,
            currentCosts.instructorCosts.total.courses
          ),
          percentageCoursesCount: _self._percentageChange(
            previousCosts.instructorCosts.total.scenarioCourses,
            currentCosts.instructorCosts.total.scenarioCourses
          )
        };

        return costs;
      },
      // Generates previous -> current change values for funds
      _generatefundingChange(currentFunding, previousFunding) {
        var _self = this;
        var lineItemCategories =
          BudgetComparisonReportReducers._state.lineItemCategories;

        var fundingChange = {
          types: {},
          rawTotal: 0,
          percentageTotal: 0
        };

        lineItemCategories.current.ids.forEach(function(lineItemCategoryId) {
          var currentRaw = currentFunding.types[lineItemCategoryId] || 0;
          var previousRaw = previousFunding.types[lineItemCategoryId] || 0;

          fundingChange.types[lineItemCategoryId] = {
            raw: currentRaw - previousRaw,
            percentage: _self._percentageChange(previousRaw, currentRaw)
          };

          fundingChange.rawTotal += fundingChange.types[lineItemCategoryId].raw;
        });

        fundingChange.percentageTotal = this._percentageChange(
          previousFunding.total,
          currentFunding.total
        );

        return fundingChange;
      },
      // Generates previous -> current change values for misc calculations
      _generateMiscStatsChange(currentMiscStats, previousMiscStats) {
        return {
          lower: {
            courses:
              currentMiscStats.lower.courses - previousMiscStats.lower.courses,
            seats: currentMiscStats.lower.seats - previousMiscStats.lower.seats
          },
          upper: {
            courses:
              currentMiscStats.upper.courses - previousMiscStats.upper.courses,
            seats: currentMiscStats.upper.seats - previousMiscStats.upper.seats
          },
          grad: {
            courses:
              currentMiscStats.grad.courses - previousMiscStats.grad.courses,
            seats: currentMiscStats.grad.seats - previousMiscStats.grad.seats
          },
          total: {
            courses:
              currentMiscStats.total.courses - previousMiscStats.total.courses,
            seats: currentMiscStats.total.seats - previousMiscStats.total.seats
          }
        };
      },
      // Will return null if oldValue is zero, otherwise returns percentage change
      _percentageChange(oldValue, newValue, degreesOfPrecision) {
        if (!oldValue && !newValue) {
          return "0%";
        }

        if (!oldValue) {
          return null;
        }

        var roundTo = degreesOfPrecision || 2;

        return (
          ((parseFloat(newValue - oldValue) / oldValue) * 100).toFixed(
            roundTo
          ) + "%"
        );
      },
      _getBudgetScenario(budgetScenarioId, budgetScenarios) {
        var budgetScenario = null;

        budgetScenarios.ids.forEach(function(slotScenarioId) {
          if (budgetScenarioId == slotScenarioId) {
            budgetScenario = budgetScenarios.list[slotScenarioId];
            budgetScenario.description = budgetScenario.name;
          }
        });

        return budgetScenario;
      },
      _getBudgetScenarios(budgetScenarios) {
        var scenarios = [];

        budgetScenarios.ids.forEach(function(budgetScenarioId) {
          var budgetScenario = budgetScenarios.list[budgetScenarioId];
          budgetScenario.description = budgetScenario.isSnapshot ? `SNAPSHOT - ${dateToCalendar(budgetScenario.creationDate)} - ${budgetScenario.name}` : budgetScenario.name;
          scenarios.push(budgetScenarios.list[budgetScenarioId]);
        });

        return scenarios;
      },
      _getSectionGroupCost(sectionGroupId, selectedScenarioId) {
        var sectionGroupCostIds =
          BudgetComparisonReportReducers._state.sectionGroupCosts.current
            .bySectionGroupId[sectionGroupId] ||
          BudgetComparisonReportReducers._state.sectionGroupCosts.previous
            .bySectionGroupId[sectionGroupId];
        var sectionGroupCost = null;

        if (!sectionGroupCostIds) {
          return null;
        }

        sectionGroupCostIds.forEach(function(sectionGroupCostId) {
          var slotSectionGroupCost =
            BudgetComparisonReportReducers._state.sectionGroupCosts.current
              .list[sectionGroupCostId] ||
            BudgetComparisonReportReducers._state.sectionGroupCosts.previous
              .list[sectionGroupCostId];

          if (slotSectionGroupCost.budgetScenarioId == selectedScenarioId) {
            sectionGroupCost = slotSectionGroupCost;
          }
        });

        return sectionGroupCost;
      }
    };
  }
}

BudgetComparisonReportCalculations.$inject = [
  "BudgetComparisonReportReducers",
  "ActionTypes",
  "Roles",
  "UserService"
];

export default BudgetComparisonReportCalculations;
