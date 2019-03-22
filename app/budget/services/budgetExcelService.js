class BudgetExcelService {
	constructor (ApiService) { // eslint-disable-line no-unused-vars
		
	}

	generateDownload(viewState) {

		var data = [];
		var termDescriptions = {
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

		// SHEDULE COST EXCEL DOWNLOAD
		if (viewState.ui.sectionNav.activeTab == 'Schedule Costs') {
			var filename = "Budget-Comparison-Report.xlsx";
			// Generate Schedule Costs
			// Header
			data.push(['Term',
									'Subject Code',
									'Course Number',
									'Unique Key',
									'Title',
									'Units High',
									'Units Low',
									'Sequence',
									'Enrollment',
									'Sections',
									'Instructor',
									'Regular Instructor',
									'Reason',								
									'TAs',
									'Readers',
									'TA Cost',
									'Reader Cost',
									'Support Cost',
									'Instructor Cost',
									'Total Cost']);

			viewState.calculatedScheduleCosts.terms.forEach(function(term) {
				var scheduleCosts = viewState.calculatedScheduleCosts.byTerm[term];
				for (var i = 0; i < scheduleCosts.length; i++) {
					var row = [];
					let termDescription = termDescriptions[term];
					row.push(termDescription);
					row.push(scheduleCosts[i].subjectCode);
					row.push(scheduleCosts[i].courseNumber);
					row.push(scheduleCosts[i].uniqueKey);
					row.push(scheduleCosts[i].title);
					row.push(scheduleCosts[i].unitsHigh);
					row.push(scheduleCosts[i].unitsLow);
					
					let sectionGroupCosts = scheduleCosts[i].sectionGroupCosts;
					for (var _i = 0; _i < sectionGroupCosts.length; _i++) {
						let childRow = [];
						childRow.push(sectionGroupCosts[_i].sequencePattern);
						childRow.push(sectionGroupCosts[_i].enrollment);
						childRow.push(sectionGroupCosts[_i].sectionCount);
						childRow.push(sectionGroupCosts[_i].instructorDescription);
						childRow.push(sectionGroupCosts[_i].originalInstructorDescription);
						childRow.push(sectionGroupCosts[_i].reason);
						childRow.push(sectionGroupCosts[_i].taCount);
						childRow.push(sectionGroupCosts[_i].readerCount);
						childRow.push(sectionGroupCosts[_i].taCost);
						childRow.push(sectionGroupCosts[_i].readerCost);
						childRow.push(sectionGroupCosts[_i].courseCostSubTotal);
						childRow.push(sectionGroupCosts[_i].instructorCostSubTotal);
						childRow.push(sectionGroupCosts[_i].totalCost);
						var parentRow = row.concat(childRow);
						data.push(parentRow);
					}
				}
			});
			
			var wb = XLSX.utils.book_new(); // eslint-disable-line no-undef
			var ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef

			// Set column widths
			var wscols = [
				{wch: 15},
				{wch: 15},
				{wch: 15},
				{wch: 15},
				{wch: 30},
				{wch: 10},
				{wch: 10},
				{wch: 10},
				{wch: 10},
				{wch: 10},
				{wch: 25},
				{wch: 25},
				{wch: 20},
				{wch: 10},
				{wch: 10},
				{wch: 13},
				{wch: 13},
				{wch: 13},
				{wch: 13},
				{wch: 13},
			];
			ws['!cols'] = wscols;

			/* add worksheet to workbook */
			XLSX.utils.book_append_sheet(wb, ws, 'Schedule Costs'); // eslint-disable-line no-undef

			/* write workbook */
			XLSX.writeFile(wb, filename); // eslint-disable-line no-undef
		}

		// SUMMARY EXCEL DOWNLOAD
		if (viewState.ui.sectionNav.activeTab == 'Summary') {
			var filename = "Budget-Summary-Report.xlsx";
			var summary = viewState.summary;

			// Header
			var header = [" "];
			viewState.calculatedScheduleCosts.terms.forEach(function(term) {
				let termDescription = termDescriptions[term];
				header.push(termDescription);
			});
			header.push("Total");
			data.push(header);

			// TA Count
			var row = [];
			row.push("TA Count");
			summary.terms.forEach(function(term) {
					row.push(summary.byTerm[term].taCount);
			});
			row.push(summary.combinedTerms.taCount);	
			data.push(row);
			row = [];
		
			// TA Cost
			row.push("TA Cost");
			summary.terms.forEach(function(term) {
					row.push(summary.byTerm[term].taCost);
			});
			row.push(summary.combinedTerms.taCost);	
			data.push(row);
			row = [];
		
			// Reader Count
			row.push("Reader Count");
			summary.terms.forEach(function(term) {
					row.push(summary.byTerm[term].readerCount);
			});
			row.push(summary.combinedTerms.readerCount);	
			data.push(row);
			row = [];
		
			// Reader Cost 
			row.push("Reader Cost ");
			summary.terms.forEach(function(term) {
					row.push(summary.byTerm[term].readerCost);
			});
			row.push(summary.combinedTerms.readerCost);	
			data.push(row);
			row = [];
		
			// Support Cost
			row.push("Support Cost");
			summary.terms.forEach(function(term) {
					row.push(summary.byTerm[term].supportCosts);
			});
			row.push(summary.combinedTerms.supportCosts);	
			data.push(row);
			row = [];
		
			// Empty row
			data.push([" "]);
			
			// Replacement Cost sub-types
			// Support Cost
			var instructorTypes = viewState.instructorTypes;
			summary.combinedTerms.replacementCosts.instructorTypeIds.forEach(function(instructorTypeId) {
					row.push(instructorTypes.list[instructorTypeId].description);
					summary.terms.forEach(function(term) {
						row.push(summary.byTerm[term].replacementCosts.byInstructorTypeId[instructorTypeId] || 0);
					});
				row.push(summary.combinedTerms.replacementCosts.byInstructorTypeId[instructorTypeId] || 0);	
				data.push(row);
				row = [];
			});
			
			// Replacement Costs
			row.push("Replacement Costs");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].replacementCosts.overall || 0);
			});
			row.push(summary.combinedTerms.replacementCosts.overall);
			data.push(row);
			row = [];

			// Empty row
			data.push([" "]);

			// Total Teaching Costs	
			row.push("Total Teaching Costs");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].totalCosts);
			});
			row.push(summary.combinedTerms.totalCosts);
			data.push(row);
			row = [];

			// Funds Costs
			var selectedBudgetScenario = viewState.selectedBudgetScenario;
			row.push("Funds Costs");
			summary.terms.forEach(function() {
				row.push(" ");
			});
			row.push(selectedBudgetScenario.funds);
			data.push(row);
			row = [];

			// Balance
			row.push("Balance");
			summary.terms.forEach(function() {
				row.push(" ");
			});
			row.push(selectedBudgetScenario.totalCost);
			data.push(row);
			row = [];

			// Empty row
			data.push([" "]);

			// Total Student Credit Hours
			// Units Offered
			row.push("Units Offered");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].totalUnits);
			});
			row.push(summary.combinedTerms.totalUnits);
			data.push(row);
			row = [];

			// Enrollment
			row.push("Enrollment");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].enrollment);
			});
			row.push(summary.combinedTerms.enrollment);
			data.push(row);
			row = [];

			// Undergrad SCH
			row.push("Student Credit Hours (Undergrad)");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].undergradSCH);
			});
			row.push(summary.combinedTerms.undergradSCH);
			data.push(row);
			row = [];

			// Grad SCH
			row.push("Student Credit Hours (Graduate)");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].gradSCH);
			});
			row.push(summary.combinedTerms.gradSCH);
			data.push(row);
			row = [];

			// Total Student Credit Hours 
			row.push("Student Credit Hours");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].totalSCH);
			});
			row.push(summary.combinedTerms.totalSCH);
			data.push(row);
			row = [];

			// Empty row
			data.push([" "]);

			// Lower Div Count
			row.push("Lower Div Offerings");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].lowerDivCount);
			});
			row.push(summary.combinedTerms.lowerDivCount);
			data.push(row);
			row = [];

			// Upper Div Count 
			row.push("Upper Div Offerings");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].upperDivCount);
			});
			row.push(summary.combinedTerms.upperDivCount);
			data.push(row);
			row = [];

			// Graduate Count
			row.push("Graduate Offerings");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].graduateCount);
			});
			row.push(summary.combinedTerms.graduateCount);
			data.push(row);
			row = [];

			// Total Offerings
			row.push("Total Offerings");
			summary.terms.forEach(function(term) {
				row.push(summary.byTerm[term].totalOfferingsCount);
			});
			row.push(summary.combinedTerms.totalOfferingsCount);
			data.push(row);
			row = [];

			var wb = XLSX.utils.book_new(); // eslint-disable-line no-undef
			var ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef

			// Set column widths
			var wscols = [
				{wch: 20},
				{wch: 15},
				{wch: 15},
				{wch: 15},
				{wch: 15}
			];
			ws['!cols'] = wscols;

			/* add worksheet to workbook */
			XLSX.utils.book_append_sheet(wb, ws, 'Budget Summary'); // eslint-disable-line no-undef

			/* write workbook */
			XLSX.writeFile(wb, filename); // eslint-disable-line no-undef
			
		}

		// FUNDS EXCEL DOWNLOAD
		if (viewState.ui.sectionNav.activeTab == 'Funds') {
			var filename = "Budget-Fund-Report.xlsx";
			var lineItems = viewState.calculatedLineItems;

		// FOUNDS SHEET
			// Header
			data.push(['Type', 'Description', 'Amount']);
									
			var row = [];	
			lineItems.forEach(function(lineItem) {
				if (lineItem.id > 0 && lineItem.hidden == false){
					row.push(lineItem.categoryDescription);
					row.push(lineItem.description);
					row.push(lineItem.amount);
					data.push(row);
					row = [];
				}
			});
			
			var wb = XLSX.utils.book_new(); // eslint-disable-line no-undef
			var ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef

			// Set column widths
			var wscols = [
				{wch: 30},
				{wch: 50},
				{wch: 10}
			];
			ws['!cols'] = wscols;

			/* add worksheet to workbook */
			XLSX.utils.book_append_sheet(wb, ws, 'Funds'); // eslint-disable-line no-undef

		// SUGGESTED SHEET
			// Header
			data = [];
			data.push(['Type', 'Description']);
									
			var row = [];	
			lineItems.forEach(function(lineItem) {
				if (!lineItem.id || lineItem.hidden){
					row.push(lineItem.categoryDescription);
					row.push(lineItem.description);
					row.push(lineItem.amount);
					data.push(row);
					row = [];
				}
			});
			
			var ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef

			// Set column widths
			var wscols = [
				{wch: 30},
				{wch: 50},
				{wch: 10}
			];
			ws['!cols'] = wscols;

			/* add worksheet to workbook */
			XLSX.utils.book_append_sheet(wb, ws, 'Suggested'); // eslint-disable-line no-undef

			/* write workbook */
			XLSX.writeFile(wb, filename); // eslint-disable-line no-undef
		}	
			
	}
}

BudgetExcelService.$inject = ['ApiService'];

export default BudgetExcelService;
