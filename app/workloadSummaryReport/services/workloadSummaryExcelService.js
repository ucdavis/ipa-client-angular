class WorkloadSummaryExcelService {
  constructor (WorkloadSummaryReducers) {
    return {
      generateDownload() {
        var state = WorkloadSummaryReducers._state;
        var data = [];
        var row = [];

        const academicYear = localStorage.year.yearToAcademicYear();
        // INSTRUCTORS TABLE REPORT
        // Table header
        var header = [
          'Year',
          'Instructor Type',
          'Name',
          'Term',
          'Course Type',
          'Description',
          'Offering',
          'Enrollment / Seats',
          'Previous Enrollment (YoY)',
          'Previous Enrollment (Last Offered)',
          'Units',
          'SCH',
          'Note'
        ];

        // Instructors Table
        state.calculations.calculatedView.instructorTypeIds.forEach(function(instructorTypeId){
          var description = state.instructorTypes.list[instructorTypeId].description;
          var instructorType = description.toUpperCase();
          data.push(row);
          row = [];
          data.push(header);

          var instructors = state.calculations.calculatedView.byInstructorType[instructorTypeId];
          // Sort instructors by last name
          instructors.sort(function(a,b){
            var nameA = a.lastName;
            var nameB = b.lastName;
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });

          instructors.forEach(function(instructor){
            var assignments = instructor.assignments;

            if (assignments.length > 0){
              const instructorName = instructor.lastName ? instructor.lastName + ", " + instructor.firstName : instructor.fullName;
              assignments.forEach(function(assignment, i){
                let courseType = "";
                const courseNumbers = parseInt(assignment.description.replace(/\D/g, ''));

                if (isNaN(courseNumbers)) {
                  courseType = assignment.description;
                } else if (courseNumbers < 100) {
                  courseType = "Lower";
                } else if (courseNumbers >= 200) {
                  courseType = "Grad";
                } else {
                  courseType = "Upper";
                }

                row.push(academicYear);
                row.push(instructorType);
                row.push(instructorName);
                row.push(assignment.term);
                row.push(courseType);
                row.push(assignment.description);
                row.push(assignment.sequencePattern);
                var actualEnrollment = assignment.actualEnrollment || 0;
                var seats = assignment.seats || 0;
                var enrollmentPercentage = assignment.enrollmentPercentage || 0;
                row.push(actualEnrollment + " / " + seats + " (" + enrollmentPercentage + " %)");
                row.push(assignment.previousEnrollment);
                var lastOfferedTermDescription = assignment.lastOfferedTermDescription;

                if (lastOfferedTermDescription) {
                  row.push(assignment.lastOfferedEnrollment + " (" + assignment.lastOfferedTermDescription + ")");

                } else {
                  row.push(assignment.lastOfferedEnrollment);
                }

                row.push(assignment.units);
                row.push(assignment.studentCreditHours);
                if (i === 0) { row.push(instructor.note); }
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
              for (let i = 0; i < 8; i++) { row.push(""); }
              row.push(instructor.note);
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

        // Courses Table
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

        // Totals Table
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
          {wch: 10},
          {wch: 50}
        ];
        ws['!cols'] = wscols;

        /* Add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, 'Workload Summary Report'); // eslint-disable-line no-undef
        // Cleans data for the next sheet
        data.length = 0;

        /* Write workbook */
        var workgroup = JSON.parse(localStorage.workgroup);
        var workgroupName = workgroup.name;
        var year = JSON.parse(localStorage.year);
        var filename = "WorkloadSummary-Report-" + workgroupName + "-" + year + ".xlsx";
        XLSX.writeFile(wb, filename); // eslint-disable-line no-undef
      }
    };
  }

}

export default WorkloadSummaryExcelService;
