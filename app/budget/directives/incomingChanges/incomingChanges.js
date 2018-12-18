import './incomingChanges.css';

let incomingChanges = function (BudgetActions, $rootScope, TermService) {
  return {
    restrict: 'E',
    template: require('./incomingChanges.html'),
    replace: true,
    scope: {
      termNav: '=',
      sectionGroups: '=',
      courses: '=',
      sectionGroupCosts: '=',
      selectedBudgetScenario: '='
    },
    link: function (scope, element, attrs) {
      scope.totalChanges = {};
      scope.tabOverrides = {};

      scope.setActiveTerm = function(activeTermTab) {
        BudgetActions.selectTerm(activeTermTab);
      };

      scope.calculateChanges = function () {
        scope.changes = [];

        var scenarioSectionGroupCostIds = scope.getActiveSectionGroupCostIds(scope.sectionGroupCosts, scope.selectedBudgetScenario);
        var presentSectionGroupCostIds = scope.getPresentSectionGroupCostIds(scenarioSectionGroupCostIds, scope.sectionGroupCosts, scope.sectionGroups);

        var changedValues = scope.calculateChangedValues(presentSectionGroupCostIds);
        var missingCourses = scope.calculateMissingCourses();
        var addedCourses = scope.calculateAddedCourses(scenarioSectionGroupCostIds);

        scope.changes = scope.changes.concat(changedValues);
        scope.changes = scope.changes.concat(missingCourses);
        scope.changes = scope.changes.concat(addedCourses);

        scope.changes = _.sortBy(scope.changes, function (change) {
          return change.sortKey;
        });

        scope.changes = scope.breakIntoTerms(scope.changes);

        Object.keys(scope.changes).forEach(function(term) {
          var changes = scope.changes[term].length > 0 ? " (" + scope.changes[term].length + ")" : "";
          scope.tabOverrides[TermService.getShortTermName(term)] = TermService.getShortTermName(term) + changes;
        });

        scope.changes = scope.addCourseHeaders(scope.changes);
      };

      // Calculate changes for sections present in both the scheduled data and the scenario
      scope.calculateChangedValues = function (sectionGroupCostIds) {
        var changes = [];

        sectionGroupCostIds.forEach(function(sectionGroupCostId) {
          var sectionGroupCost = scope.sectionGroupCosts.list[sectionGroupCostId];
          var uniqueKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode;
          var sectionGroupId = scope.sectionGroups.idsByUniqueKey[uniqueKey];
          var sectionGroup = scope.sectionGroups.list[sectionGroupId];

          // Check enrollment
          if (sectionGroup.totalSeats != sectionGroupCost.enrollment) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                enrollment: sectionGroup.totalSeats
              },
              term: sectionGroup.termCode.slice(-2),
              courseTitle: sectionGroup.title,
              course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
              sortKey: sectionGroup.subjectCode + sectionGroup.courseNumber + scope.courses.list[sectionGroup.courseId].sequencePattern,
              display: {
                subTitle: scope.courses.list[sectionGroup.courseId].sequencePattern,
                changeText: "seats",
                scheduleText: sectionGroup.totalSeats || '0',
                scenarioText: sectionGroupCost.enrollment,
                tooltip: "Are you sure you want to set seats to " + (sectionGroup.totalSeats || '0') + "?"
              }
            };

            changes.push(change);
          }

          // Check TAs
          if (sectionGroup.teachingAssistantAppointments != sectionGroupCost.taCount) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                taCount: sectionGroup.teachingAssistantAppointments
              },
              term: sectionGroup.termCode.slice(-2),
              courseTitle: sectionGroup.title,
              course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
              sortKey: sectionGroup.subjectCode + sectionGroup.courseNumber + scope.courses.list[sectionGroup.courseId].sequencePattern,
              display: {
                subTitle: scope.courses.list[sectionGroup.courseId].sequencePattern,
                changeText: "TA count",
                scheduleText: sectionGroup.teachingAssistantAppointments || '0',
                scenarioText: sectionGroupCost.taCount,
                tooltip: "Are you sure you want to set TAs to " + (sectionGroup.teachingAssistantAppointments || '0') + "?"
              }
            };

            changes.push(change);
          }

          // Check Readers
          if (sectionGroup.readerAppointments != sectionGroupCost.readerCount) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                readerCount: sectionGroup.readerAppointments
              },
              term: sectionGroup.termCode.slice(-2),
              courseTitle: sectionGroup.title,
              course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
              sortKey: sectionGroup.subjectCode + sectionGroup.courseNumber + scope.courses.list[sectionGroup.courseId].sequencePattern,
              display: {
                subTitle: scope.courses.list[sectionGroup.courseId].sequencePattern,
                changeText: "reader count",
                scheduleText: sectionGroup.readerAppointments || '0',
                scenarioText: sectionGroupCost.readerCount,
                tooltip: "Are you sure you want to set readers to " + (sectionGroup.readerAppointments || '0') + "?"
              }
            };

            changes.push(change);
          }

          // Check assigned instructor / instructorType
          var sectionGroupInstructorId = sectionGroup.assignedInstructorIds[0];
          var sectionGroupInstructorTypeId = sectionGroup.assignedInstructorTypeIds[0];
          var sectionGroupCostInstructorId = sectionGroupCost.instructorId;
          var sectionGroupCostInstructorTypeId = sectionGroupCost.instructorTypeId;

          if (sectionGroupInstructorId != sectionGroupCostInstructorId) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                instructorId: sectionGroupInstructorId,
              },
              term: sectionGroupCost.termCode.slice(-2),
              courseTitle: sectionGroup.title,
              course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
              sortKey: sectionGroup.subjectCode + sectionGroup.courseNumber + scope.courses.list[sectionGroup.courseId].sequencePattern,
              display: {
                subTitle: scope.courses.list[sectionGroup.courseId].sequencePattern,
                changeText: "instructor",
                scheduleText: sectionGroup.assignedInstructorNames[0] || 'unassigned',
                scenarioText: sectionGroupCost.instructor ? sectionGroupCost.instructor.description : null,
                tooltip: "Are you sure you want to set the instructor to " + (sectionGroup.assignedInstructorNames[0] || 'unassigned') + "?"
              }
            };

            changes.push(change);
          } else if (!sectionGroupInstructorId && sectionGroupInstructorTypeId != sectionGroupCostInstructorTypeId) {
            var scheduleText = sectionGroup.assignedInstructorType ? sectionGroup.assignedInstructorType.description : 'unassigned';
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                instructorTypeId: sectionGroupInstructorTypeId,
              },
              term: sectionGroupCost.termCode.slice(-2),
              courseTitle: sectionGroup.title,
              course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
              sortKey: sectionGroup.subjectCode + sectionGroup.courseNumber + scope.courses.list[sectionGroup.courseId].sequencePattern,
              display: {
                subTitle: scope.courses.list[sectionGroup.courseId].sequencePattern,
                changeText: "instructor",
                scheduleText: scheduleText,
                scenarioText: sectionGroupCost.instructorType ? sectionGroupCost.instructorType.description : 'unassigned',
                tooltip: "Are you sure you want to set the instructor type to " + scheduleText + "?"
              }
            };

            changes.push(change);
          }

          // Check section count
          if (sectionGroup.sectionCount != sectionGroupCost.sectionCount) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                sectionCount: sectionGroup.sectionCount,
              },
              term: sectionGroupCost.termCode.slice(-2),
              courseTitle: sectionGroup.title,
              course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
              sortKey: sectionGroup.subjectCode + sectionGroup.courseNumber + scope.courses.list[sectionGroup.courseId].sequencePattern,
              display: {
                subTitle: scope.courses.list[sectionGroup.courseId].sequencePattern,
                changeText: "section count",
                scheduleText: sectionGroup.sectionCount || '0',
                scenarioText: sectionGroupCost.sectionCount,
                tooltip: "Are you sure you want to set the section count to " + (sectionGroup.sectionCount || '0') + "?"
              }
            };

            changes.push(change);
          }
        });

        return changes;
      };

      // Filters provided sectionGroupCostIds to ensure they match a sectionGroup.
      scope.getPresentSectionGroupCostIds = function (sectionGroupCostIds, sectionGroupCosts, sectionGroups) {
        return sectionGroupCostIds.filter(function(sectionGroupCostId) {
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          // Ensure sectionGroupCost is not disabled
          if (sectionGroupCost.disabled) { return false; }

          var uniqueKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode;
          var sectionGroupId = sectionGroups.idsByUniqueKey[uniqueKey];
          var sectionGroup = sectionGroups.list[sectionGroupId];

          // Ensure sectionGroupCost has a match
          if (!sectionGroup) { return false; }

          return true;
        });
      };

      // Filters sectionGroupCosts against selected scenario and activeTerms
      scope.getActiveSectionGroupCostIds = function (sectionGroupCosts, selectedBudgetScenario) {
        return sectionGroupCosts.ids.filter(function(sectionGroupCostId) {
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          // Ensure sectionGroupCost matches scenario
          if (sectionGroupCost.budgetScenarioId != selectedBudgetScenario.id) { return false; }

          // Ensure sectionGroupCost matches termCode
          var activeTerms = scope.selectedBudgetScenario.terms;
          var sectionGroupCostTerm = sectionGroupCost.termCode.slice(-2);

          if (activeTerms.indexOf(sectionGroupCostTerm) == -1) { return false; }

          return true;
        });
      };

      // Returns change objects with sectionGroups that need a corresponding sectionGroupCost created
      scope.calculateMissingCourses = function () {
        var changes = [];

        scope.sectionGroups.ids.forEach(function(sectionGroupId) {
          var sectionGroup = scope.sectionGroups.list[sectionGroupId];
          var sectionGroupTerm = sectionGroup.termCode.slice(-2);

          // Ensure sectionGroupCost matches termCode
          if (scope.selectedBudgetScenario.terms.indexOf(sectionGroupTerm) == -1) { return; }

          var uniqueKey = sectionGroup.subjectCode + "-" + sectionGroup.courseNumber + "-" + sectionGroup.sequencePattern + "-" + sectionGroup.termCode + "-" + scope.selectedBudgetScenario.id;
          var sectionGroupCostId = scope.sectionGroupCosts.idsByUniqueKey[uniqueKey];
          var sectionGroupCost = sectionGroupCostId ? scope.sectionGroupCosts.list[sectionGroupCostId] : null;

          // No matching active sectionGroupCost found for this sectionGroup
          if (!sectionGroupCost) {
            var change = {
              payload: {
                type: "create",
                sectionGroup: sectionGroup,
                sectionGroupCost: null,
              },
              term: sectionGroup.termCode.slice(-2),
              courseTitle: sectionGroup.title,
              course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
              sortKey: sectionGroup.subjectCode + sectionGroup.courseNumber + scope.courses.list[sectionGroup.courseId].sequencePattern,
              display: {
                subTitle: scope.courses.list[sectionGroup.courseId].sequencePattern,
                changeText: "add course",
                scheduleText: "check",
                scenarioText: "",
                tooltip: "Are you sure you want to add " + sectionGroup.subjectCode + " " + sectionGroup.courseNumber + "?"
              }
            };

            changes.push(change);
          } else if (sectionGroupCost.disabled) {
            var change = {
              payload: {
                type: "update",
                disabled: false,
                sectionGroupCost: sectionGroupCost,
              },
              term: sectionGroup.termCode.slice(-2),
              courseTitle: sectionGroup.title,
              course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
              sortKey: sectionGroup.subjectCode + sectionGroup.courseNumber + scope.courses.list[sectionGroup.courseId].sequencePattern,
              display: {
                subTitle: scope.courses.list[sectionGroup.courseId].sequencePattern,
                changeText: "add course",
                scheduleText: "check",
                scenarioText: "",
                tooltip: "Are you sure you want to remove " + sectionGroup.subjectCode + " " + sectionGroup.courseNumber + "?"
              }
            };

            changes.push(change);
          }
        });

        return changes;
      };

      scope.calculateAddedCourses = function (sectionGroupCostIds) {
        var changes = [];

        sectionGroupCostIds.forEach(function(sectionGroupCostId) {
          var sectionGroupCost = scope.sectionGroupCosts.list[sectionGroupCostId];
          // Course is on scenario but not on schedule
          if (sectionGroupCost.isBudgeted && sectionGroupCost.isScheduled == false) {
            var change = {
              payload: {
                type: "remove",
                sectionGroupCost: sectionGroupCost,
                sectionGroup: null,
              },
              term: sectionGroupCost.termCode.slice(-2),
              courseTitle: sectionGroupCost.title,
              course: sectionGroupCost.subjectCode + " " + sectionGroupCost.courseNumber,
              sortKey: sectionGroupCost.subjectCode + sectionGroupCost.courseNumber + sectionGroupCost.sequencePattern,
              display: {
                subTitle: sectionGroupCost.sequencePattern,
                changeText: "remove course",
                scheduleText: "",
                scenarioText: "check",
                tooltip: "Are you sure you want to remove " + sectionGroupCost.subjectCode + " " + sectionGroupCost.courseNumber + "?"
              }
            };

            changes.push(change);
          }
        });

        return changes;
      };

      scope.breakIntoTerms = function(changes) {
        var separatedChanges = {};

        changes.forEach(function(change) {
          separatedChanges[change.term] = separatedChanges[change.term] || [];
          separatedChanges[change.term].push(change);
        });

        return separatedChanges;
      };

      scope.addCourseHeaders = function (changes) {
        var changesWithHeaders = {};
        Object.keys(changes).forEach(function (term) { 
          var termChanges = changes[term];
          changesWithHeaders[term] = [];
          scope.totalChanges[term] = changes[term].length;
          
          var courseHeader = null;

          termChanges.forEach(function(change) {
            if (!courseHeader || courseHeader.course != change.course) {
              courseHeader = {
                courseHeader: true,
                payload: {
                  changes: []
                },
                term: change.term,
                course: change.course,
                courseTitle: change.courseTitle,
                sortKey: change.course,
                display: {
                  title: change.course,
                  subTitle: change.courseTitle,
                }
              };
  
              changesWithHeaders[term].push(courseHeader);
            }

            courseHeader.payload.changes.push(change);
            changesWithHeaders[term].push(change);
          });
        });

        return changesWithHeaders;
      };

      scope.applyTermChanges = function () {
        scope.changes[scope.termNav.activeTerm].forEach(function (change) {
          if (change.courseHeader) {
            scope.applyCourseChanges(change);
          }
        });
      };

      scope.applyCourseChanges = function (courseHeader) {
        courseHeader.payload.changes.forEach(function(change) {
          scope.applyChange(change);
        });
      };

      scope.applyChange = function (change) {
        // Create sectionGroupCost
        if (change.payload.type == "create") {
          var sectionGroupCost = {
            sectionGroupId: change.payload.sectionGroup.id,
            disabled: false
          };

          BudgetActions.createSectionGroupCost(sectionGroupCost);
          return;
        }

        // Disable sectionGroupCost
        if (change.payload.type == "remove") {
          change.payload.sectionGroupCost.disabled = true;
          BudgetActions.updateSectionGroupCost(change.payload.sectionGroupCost);
          return;
        }

        // Update sectionGroupCost
        if ('enrollment' in change.payload) {
          change.payload.sectionGroupCost.enrollment = change.payload.enrollment;
        } else if ('taCount' in change.payload) {
          change.payload.sectionGroupCost.taCount = change.payload.taCount;
        } else if ('readerCount' in change.payload) {
          change.payload.sectionGroupCost.readerCount = change.payload.readerCount;
        } else if ('instructorTypeId' in change.payload) {
          change.payload.sectionGroupCost.instructorTypeId = change.payload.instructorTypeId;
        } else if ('instructorId' in change.payload) {
          change.payload.sectionGroupCost.instructorId = change.payload.instructorId;
        } else if ('sectionCount' in change.payload) {
          change.payload.sectionGroupCost.sectionCount = change.payload.sectionCount;
        } else if ('disabled' in change.payload) {
          change.payload.sectionGroupCost.disabled = change.payload.disabled;
        }

        BudgetActions.updateSectionGroupCost(change.payload.sectionGroupCost);
      };

      // Recalculate on changes
      $rootScope.$on('budgetStateChanged', function (event, data) {
        scope.calculateChanges();
      });

      // Calculate on instantation of directive
      scope.calculateChanges();
    }
  };
};

export default incomingChanges;
