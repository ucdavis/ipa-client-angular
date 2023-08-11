import './workloadSnapshot.css';

let workloadSnapshot = function () {
	return {
		restrict: 'E',
		template: require('./workloadSnapshot.html'),
		replace: true,
		scope: {
			// workloadAssignments: '<',
			snapshot: '<'
		},
		link: function(scope) {
			// scope.$watch('workloadAssignments', function (assignments) {
			// 	let view = {};
			// 	let instructors = {};

			// 	if (assignments) {
			// 		assignments.forEach(assignment => {
			// 			// create instructor objects first
			// 			// {name: ..., assignments: [], totals: ...}

			// 			if (view[assignment.instructorType] === undefined) {
			// 				view[assignment.instructorType] = {};
			// 			}
			// 			if (view[assignment.instructorType][assignment.name] === undefined) {
			// 				view[assignment.instructorType][assignment.name] = {
			// 					name: assignment.name,
			// 					assignments: [],
			// 					totals: {
			// 						seats: 0,
			// 						units: 0
			// 					}
			// 				};
			// 			}
			// 			view[assignment.instructorType][assignment.name].assignments.push(assignment);
			// 			view[assignment.instructorType][assignment.name].totals;
						
			// 			// view[assignment.instructorType][assignment.name].assignments = [...view[assignment.instructorType][assignment.name].assignments, assignment];
			// 		});
			// 	}

				// flatten the nested object to array for easier rendering?
				// const keys = Object.keys(view);
				// keys.forEach(key => {
				// 	view[key] = Object.values(view[key]);
				// });
// debugger;

				// byInstructorType: [{"Associate": [{name: "inst 1", assignments: []}, {}]}]
				// order instructor type alpha
				console.log(scope.snapshot);

				scope.round = (num) => Math.floor(num);
		}
	};
};

export default workloadSnapshot;
