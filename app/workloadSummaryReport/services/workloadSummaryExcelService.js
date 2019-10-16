class WorkloadSummaryExcelService {
  constructor (WorkloadSummaryReducers) { 
    return {
      generateDownload() {
        var state = WorkloadSummaryReducers._state;
        console.log("state :", state); // eslint-disable-line no-console
        var data = [];
    
        // REPORT
        // Header
        var header = [
          'Instructor',
          'Term',
          'Description',
          'Offering',
          'Enrollment / Seats',
          'Previous Enrollment (YoY)',
          'Previous Enrollment (Last Offered)',
          'Units',
          'SCH'
        ];

        var row = [];
        state.calculations.calculatedView.instructorTypeIds.forEach(function(instructorTypeId){
          var description = state.instructorTypes.list[instructorTypeId].description;
          var instructorType =  description.toUpperCase();
          row.push(instructorType);
          data.push(row);
          row = [];
          data.push(header);
          var instructors = state.calculations.calculatedView.byInstructorType[instructorTypeId];
          instructors.forEach(function(instructor){

            var assignments = instructor.assignments;
            // console.log("instructor :", instructor); // eslint-disable-line no-console
            if (assignments.length > 0){
              row.push(instructor.lastName + ", " + instructor.firstName);
              assignments.forEach(function(assignment){
                var firstElement = assignments[0];
                if (assignment != firstElement){
                  row.push(" ");
                }
                row.push(assignment.term);
                row.push(assignment.description);
                row.push(assignment.sequencePattern);
                var actualEnrollment = assignment.actualEnrollment || 0;
                var seats = assignment.seats || 0;
                var enrollmentPercentage = assignment.enrollmentPercentage || 0;
                row.push(actualEnrollment + " / " + seats + "  (" + enrollmentPercentage + " %)");
                row.push(assignment.previousEnrollment);
                var lastOfferedTermDescription  = assignment.lastOfferedTermDescription;
                if (lastOfferedTermDescription) {
                  row.push(assignment.lastOfferedEnrollment + " (" + assignment.lastOfferedTermDescription + ")");
                } else {
                  row.push(assignment.lastOfferedEnrollment);
                }
                row.push(assignment.units);
                row.push(assignment.studentCreditHours);
                
                
                data.push(row);
                row = [];
              });
              row.push(" ","Totals");
              row.push(instructor.totals.assignmentCount);
              row.push(" ");
              row.push (instructor.totals.actualEnrollment + " / " + instructor.totals.seats);
              row.push (instructor.totals.previousEnrollment);
              row.push (instructor.totals.lastOfferedEnrollment);
              row.push (instructor.totals.units);
              row.push (instructor.totals.studentCreditHours);
              data.push(row);
              row = [];
              
            } else {
              row.push(instructor.lastName + ", " + instructor.firstName);
              data.push(row);
              row = [];
            }
            
          });
          row.push(" ");
          data.push(row);
          row = [];
        });


        //Creates book
        var wb = XLSX.utils.book_new(); // eslint-disable-line no-undef
        // Creates worksheet
        var ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef
    
        // Set column widths
        var wscols = [
          {wch: 30},
          {wch: 25},
          {wch: 20},
          {wch: 10},
          {wch: 20},
          {wch: 25},
          {wch: 30},
          {wch: 10},
          {wch: 10}
        ];
        ws['!cols'] = wscols;
    
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
