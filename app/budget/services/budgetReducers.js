budgetApp.service('budgetReducers', function ($rootScope, $log, budgetSelectors) {
	return {
		_state: {},
		budgetScenarioReducers: function (action, budgetScenarios) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					budgetScenarios = {
						ids: [],
						list: {}
					};

					action.payload.budgetScenarios.forEach( function(budgetScenario) {
						budgetScenarios.ids.push(budgetScenario.id);
						budgetScenarios.list[budgetScenario.id] = budgetScenario;
					});
					return budgetScenarios;
				case CREATE_BUDGET_SCENARIO:
					var newBudgetScenario = action.payload;
					budgetScenarios.ids.push(newBudgetScenario.id);
					budgetScenarios.list[newBudgetScenario.id] = newBudgetScenario;
					return budgetScenarios;
				case DELETE_BUDGET_SCENARIO:
					var budgetScenarioId = action.payload.budgetScenarioId;
					var index = budgetScenarios.ids.indexOf(budgetScenarioId);
					budgetScenarios.ids.splice(index, 1);
					delete budgetScenarios.list[budgetScenarioId];
					return budgetScenarios;
				default:
					return budgetScenarios;
			}
		},
		lineItemReducers: function (action, lineItems) {
			switch (action.type) {
				case INIT_STATE:
					lineItems = {
						ids: [],
						list: {}
					};
					action.payload.lineItems.forEach( function( lineItem) {
						lineItems.ids.push(lineItem.id);
						lineItems.list[lineItem.id] = lineItem;
					});
					return lineItems;

				case CREATE_LINE_ITEM:
					var newLineItem = action.payload;
					lineItems.ids.push(newLineItem.id);
					lineItems.list[newLineItem.id] = newLineItem;
					return lineItems;
				case UPDATE_LINE_ITEM:
					var updatedLineItem = action.payload;
					lineItems.list[updatedLineItem.id] = updatedLineItem;
					return lineItems;
				case DELETE_LINE_ITEM:
					var lineItemId = action.payload.lineItemId;
					var index = lineItems.ids.indexOf(lineItemId);
					lineItems.ids.splice(index, 1);
					delete lineItems.list[lineItemId];
					return lineItems;
				default:
					return lineItems;
			}
		},
		scheduleBudgetReducers: function (action, budget) {
			switch (action.type) {
				case INIT_STATE:
					budget = action.payload.budget;
					return budget;
				case UPDATE_BUDGET:
					budget = action.payload.budget;
				default:
					return budget;
			}
		},
		lineItemCategoryReducers: function (action, lineItemCategories) {
			switch (action.type) {
				case INIT_STATE:
					lineItemCategories = {
						ids: [],
						list: []
					};

					action.payload.lineItemCategories.forEach( function(lineItemCategory) {
						lineItemCategories.ids.push(lineItemCategory.id);
						lineItemCategories.list[lineItemCategory.id] = lineItemCategory;
					});
					return lineItemCategories;
				default:
					return lineItemCategories;
			}
		},
		sectionGroupCostReducers: function (action, sectionGroupCosts) {
			switch (action.type) {
				case INIT_STATE:
					sectionGroupCosts = {
						ids: [],
						list: []
					};

					action.payload.sectionGroupCosts.forEach( function(sectionGroupCost) {
						sectionGroupCosts.ids.push(sectionGroupCost.id);
						sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
					});
					return sectionGroupCosts;
				default:
					return sectionGroupCosts;
			}
		},
		sectionGroupReducers: function (action, sectionGroups) {
			switch (action.type) {
				case INIT_STATE:
					sectionGroups = {
						ids: [],
						list: []
					};

					action.payload.sectionGroupCosts.forEach( function(sectionGroup) {
						sectionGroups.ids.push(sectionGroup.id);
						sectionGroups.list[sectionGroup.id] = sectionGroup;
					});
					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		sectionReducers: function (action, sections) {
			switch (action.type) {
				case INIT_STATE:
					sections = {
						ids: [],
						list: []
					};

					action.payload.sections.forEach( function(section) {
						sections.ids.push(section.id);
						sections.list[section.id] = section;
					});
					return sections;
				default:
					return sections;
			}
		},
		uiReducers: function (action, ui) {
			switch (action.type) {
				case INIT_STATE:
					ui = {
						isLineItemOpen: false,
						isCourseCostOpen: false,
						openLineItems: [],
						lineItemDetails: {},
						sectionGroupCostDetails: {},
						selectedBudgetScenarioId: action.selectedBudgetScenarioId,
						selectedTerm: action.selectedTerm,
						workgroupId: action.workgroupId,
						year: action.year
					};

					// Set initial lineItemDetail UI states
					action.payload.lineItems.forEach(function(lineItem) {
							ui.lineItemDetails[lineItem.id] = {
								displayDescriptionInput: false,
								displayAmountInput: false,
								displayTypeInput: false,
								displayNotesInput: false
							};
					});

					// Set initial sectionGroupCostDetail UI states
					action.payload.sectionGroupCosts.forEach(function(sectionGroupCost) {
							ui.sectionGroupCostDetails[sectionGroupCost.id] = {
								displaySectionCountInput: false,
								displayTaCountInput: false,
								displayReaderCountInput: false,
								displayEnrollmentInput: false
							};
					});

					// Set default initial selectedTerm
					if (ui.selectedTerm == null && action.payload.sectionGroupCosts.length > 0) {
						ui.selectedTerm = action.payload.sectionGroupCosts[0].termCode.slice(-2);
					}

					return ui;
				case SELECT_TERM:
					ui.selectedTerm = action.payload.term;
					return ui;
				case CREATE_LINE_ITEM:
					var lineItem = action.payload;
					ui.lineItemDetails[lineItem.id] = {
						displayDescriptionInput: false,
						displayAmountInput: false,
						displayTypeInput: false,
						displayNotesInput: false
					};
					return ui;
				case SELECT_BUDGET_SCENARIO:
					ui.selectedBudgetScenarioId = action.payload.budgetScenarioId;
					return ui;
				case TOGGLE_LINE_ITEM_SECTION:
					ui.isLineItemOpen = !(ui.isLineItemOpen);
					return ui;
				case TOGGLE_COURSE_COST_SECTION:
					ui.isCourseCostOpen = !(ui.isCourseCostOpen);
					return ui;
				case TOGGLE_LINE_ITEM:
					var lineItemId = action.payload.lineItemId;
					var index = ui.openLineItems.indexOf(lineItemId);
					if (index == -1) {
						ui.openLineItems.push(lineItemId);
					} else {
						ui.openLineItems.splice(index, 1);
					}
					return ui;
				case TOGGLE_SECTION_GROUP_COST_DETAIL:
					var sectionGroupCostId = action.payload.sectionGroupCostId;

					// Toggle appropriate property
					switch (action.payload.property) {
						case "sectionCount":
							ui.sectionGroupCostDetails[sectionGroupCostId].displaySectionCountInput = !ui.sectionGroupCostDetails[sectionGroupCostId].displaySectionCountInput;
							return ui;
						case "taCount":
							ui.sectionGroupCostDetails[sectionGroupCostId].displayTaCountInput = !ui.sectionGroupCostDetails[sectionGroupCostId].displayTaCountInput;
							return ui;
						case "readerCount":
							ui.sectionGroupCostDetails[sectionGroupCostId].displayReaderCountInput = !ui.sectionGroupCostDetails[sectionGroupCostId].displayReaderCountInput;
							return ui;
						case "enrollment":
							ui.sectionGroupCostDetails[sectionGroupCostId].displayEnrollmentInput = !ui.sectionGroupCostDetails[sectionGroupCostId].displayEnrollmentInput;
							return ui;
					}
					return ui;
				case TOGGLE_LINE_ITEM_DETAIL:
					var lineItemId = action.payload.lineItemId;

					// Toggle appropriate property
					switch (action.payload.property) {
						case "description":
							ui.lineItemDetails[lineItemId].displayDescriptionInput = !ui.lineItemDetails[lineItemId].displayDescriptionInput;
							return ui;
						case "amount":
							ui.lineItemDetails[lineItemId].displayAmountInput = !ui.lineItemDetails[lineItemId].displayAmountInput;
							return ui;
						case "notes":
							ui.lineItemDetails[lineItemId].displayNotesInput = !ui.lineItemDetails[lineItemId].displayNotesInput;
							return ui;
						case "type":
							ui.lineItemDetails[lineItemId].displayTypeInput = !ui.lineItemDetails[lineItemId].displayTypeInput;
							return ui;
					}
					return ui;
				default:
					return ui;
			}
		},
		reduce: function (action) {
			var scope = this;

			newState = {};
			newState.budget = scope.scheduleBudgetReducers(action, scope._state.budget);
			newState.budgetScenarios = scope.budgetScenarioReducers(action, scope._state.budgetScenarios);
			newState.lineItems = scope.lineItemReducers(action, scope._state.lineItems);
			newState.lineItemCategories = scope.lineItemCategoryReducers(action, scope._state.lineItemCategories);
			newState.sectionGroupCosts = scope.sectionGroupCostReducers(action, scope._state.sectionGroupCosts);
			newState.sectionGroups = scope.sectionGroupReducers(action, scope._state.sectionGroups);
			newState.sections = scope.sectionReducers(action, scope._state.sections);

			newState.ui = scope.uiReducers(action, scope._state.ui);
			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = {};
			newPageState.selectedBudgetScenario = budgetSelectors.generateSelectedBudgetScenario(newState.budgetScenarios,
			newState.lineItems, newState.ui, newState.lineItemCategories, newState.sectionGroupCosts, newState.sectionGroups, newState.sections);
			newPageState.budgetScenarios = budgetSelectors.generateBudgetScenarios(newState.budgetScenarios);
			newPageState.budget = newState.budget;
			newPageState.ui = newState.ui;
			newPageState.lineItemCategories = budgetSelectors.generateLineItemCategories(newState.lineItemCategories);

			$rootScope.$emit('budgetStateChanged', newPageState);
			console.log(newPageState);
		}
	};
});