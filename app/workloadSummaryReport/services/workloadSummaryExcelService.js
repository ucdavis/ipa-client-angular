class WorkloadSummaryExcelService {
  constructor (WorkloadSummaryReducers) { 
    return {
      generateDownload() {
        var state = WorkloadSummaryReducers._state;
        console.log("state :", state); // eslint-disable-line no-console
        var data = [];
    
        // REPORT
        // Header
        data.push([
          'Instructor',
          'Term',
          'Description',
          'Offering',
          'Enrollment / Seats',
          'Previous Enrollment (YoY)',
          'Previous Enrollment (Last Offered)',
          'Units',
          'SCH'
        ]);

        var row = [];
        state.calculations.calculatedView.instructorTypeIds.forEach(function(instructorTypeId){
          row.push(state.instructorTypes.list[instructorTypeId].description);
          data.push(row);
          row=[];
          var instructors = state.calculations.calculatedView.byInstructorType[instructorTypeId];
          instructors.forEach(function(instructor){
            row.push(instructor.lastName + ", " + instructor.firstName);
            data.push(row);
            row = [];
            // row.push(assignment.term);
            // row.push(assignment.description);
          })
          row.push(" ");
          data.push(row);
          row=[];
        });

        //Creates book
        var wb = XLSX.utils.book_new(); // eslint-disable-line no-undef
        // Creates worksheet
        var ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef
    
        // Set column widths
        // var wscols = [
        //   {wch: 50},
        //   {wch: 50},
        //   {wch: 15}
        // ];
        // ws['!cols'] = wscols;
    
        /* add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, 'Test'); // eslint-disable-line no-undef
        // Cleans data for the next sheet
        data.length = 0;
    
    
        /* write workbook */
        // var year = viewState.ui.year;
        // var WorkloadSummaryScenario = viewState.selectedWorkloadSummaryScenario.name;
        // var json = JSON.parse(localStorage.workgroup);
        // var workgroupName = json.name;
        // var filename = "WorkloadSummary-Report-" + workgroupName + "-" + year + "-" + WorkloadSummaryScenario + ".xlsx";
        var filename = "Test-WorkloadSummary-Report.xlsx";
        XLSX.writeFile(wb, filename); // eslint-disable-line no-undef
      }
    };
  }
  
}

export default WorkloadSummaryExcelService;
