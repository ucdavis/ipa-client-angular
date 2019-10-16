class WorkloadSummaryExcelService {
  constructor (WorkloadSummaryReducers) { 
    return {
      generateDownload() {
        var state = WorkloadSummaryReducers._state;
        console.log("state :", state); // eslint-disable-line no-console
        var data = [];
        var row = [];
    
        // INSTRUCTORS TABLE REPORT
        // Table header
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

              // Totals for instructor
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

        // UNASSIGNED COURSES TABLE REPORT
        row.push("UNASSIGNED COURSES");
          data.push(row);
          row = [];

        // Table header
        var header = [
          'Term',
          'Description',
          'Offering',
          'Enrollment / Seats',
          'Previous Enrollment',
          'Units',
          'SCH'
        ];
        data.push(header);

        var courses = state.calculations.calculatedView.unassignedCourses;
        courses.forEach(function(unassignedCourse){
          row.push(unassignedCourse.term);
          row.push(unassignedCourse.description);
          row.push(unassignedCourse.sequencePattern);
          row.push(unassignedCourse.enrollment || 0 + " / " + unassignedCourse.seats);
          row.push(unassignedCourse.previousEnrollment);
          row.push(unassignedCourse.units);
          row.push(unassignedCourse.studentCreditHours);
          data.push(row);
          row = [];
        });

        // Totals for unassiged courses
        var totals = state.calculations.calculatedView.unassignedTotals;
        row.push("Totals");
        row.push(courses.length);
        row.push("");
        row.push(totals.enrollment + " / " + totals.seats);
        row.push(totals.previousEnrollment);
        row.push(totals.units);
        row.push(totals.studentCreditHours);
        data.push(row);
        row = [];

        // Empty row
        row.push(" ");
        data.push(row);
        row = [];

        // TOTALS TABLE REPORT
        row.push("ASSIGNMENT TOTALS");
          data.push(row);
          row = [];

        // Table header
        var header = [
          'Totals',
          'Instructor',
          'Assignments',
          'Enrollment / Seats',
          'Previous Enrollment',
          'Units',
          'SCH'
        ];
        data.push(header);

        var workloadTotals = state.calculations.calculatedView.workloadTotals;
        workloadTotals.forEach(function(total){
          row.push(total.displayName);
          row.push(total.instructorCount);
          row.push(total.assignmentCount);
          row.push(total.enrollment + " / " + total.seats);
          row.push(total.previousEnrollment);
          row.push(total.units);
          row.push(total.studentCreditHours);
          data.push(row);
          row = [];
        });
        // Totals assignments
        var combinedTotals = state.calculations.calculatedView.combinedTotals;
        row.push("Totals");
        row.push(combinedTotals.instructorCount);
        row.push(combinedTotals.assignmentCount);
        row.push(combinedTotals.enrollment + " / " + combinedTotals.seats);
        row.push(combinedTotals.previousEnrollment);
        row.push(combinedTotals.units);
        row.push(combinedTotals.studentCreditHours);
        data.push(row);
        row = [];

        // Empty row
        row.push(" ");
        data.push(row);
        row = [];

        //Creates book
        var wb = XLSX.utils.book_new(); // eslint-disable-line no-undef
        // Creates worksheet
        var ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef
    
        // Set column widths
        var wscols = [
          {wch: 30},
          {wch: 25},
          {wch: 20},
          {wch: 20},
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
