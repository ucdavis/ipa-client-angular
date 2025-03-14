import { _array_sortByProperty } from 'shared/helpers/array';

class InstructorFormSelectors {
	constructor () {
		return {
			generateSectionGroups: function (sectionGroups, supportStaff, studentPreferences, instructorPreferences) {
				var self = this;

				sectionGroups.ids.forEach(function (sectionGroupId) {
					var sectionGroup = sectionGroups.list[sectionGroupId]; // eslint-disable-line no-unused-vars
					// Add instructor preference data
					sectionGroup = self.addInstructorPreferencesToSectionGroup(sectionGroup, supportStaff, instructorPreferences);
		
					// Add support staff data
					sectionGroup = self.addEligibleSupportStaffToSectionGroup(sectionGroup, supportStaff, studentPreferences); // eslint-disable-line no-unused-vars
				});
		
				return sectionGroups;
			},
			// Add de-normalized instructor preferences to the sectionGroup
			addInstructorPreferencesToSectionGroup: function (sectionGroup, supportStaff, instructorPreferences) {
				sectionGroup.instructorPreferences = [];
	
				instructorPreferences.ids.forEach(function (preferenceId) {
					var preference = instructorPreferences.list[preferenceId];
	
					if (preference.sectionGroupId != sectionGroup.id) {
						return;
					}
	
					supportStaff.ids.forEach(function(supportStaffId) {
						var staff = supportStaff.list[supportStaffId];
						if (preference.supportStaffId == staff.id) {
							preference.firstName = staff.firstName;
							preference.lastName = staff.lastName;
							preference.fullName = staff.fullName;
						}
					});
	
					sectionGroup.instructorPreferences.push(preference);
				});
	
				return sectionGroup;
			},
	
			addEligibleSupportStaffToSectionGroup: function (sectionGroup, supportStaff, studentPreferences) {
				var confirmedSupportStaffIds = [];
	
				sectionGroup.eligibleSupportStaff = {};
	
				sectionGroup.instructorPreferences.forEach(function(preference) {
					if (confirmedSupportStaffIds.indexOf(preference.supportStaffId) == -1) {
						confirmedSupportStaffIds.push(preference.supportStaffId);
					}
				});
	
				sectionGroup.eligibleSupportStaff.preferred = [];
				sectionGroup.eligibleSupportStaff.tas = [];
				sectionGroup.eligibleSupportStaff.readers = [];
	
				studentPreferences.ids.forEach(function (preferenceId) {
					var preference = studentPreferences.list[preferenceId];
					var slotSupportStaff = supportStaff.list[preference.supportStaffId];
	
					if (preference.sectionGroupId == sectionGroup.id
					&& confirmedSupportStaffIds.indexOf(preference.supportStaffId) == -1) {
						confirmedSupportStaffIds.push(preference.supportStaffId);
	
						preference.firstName = slotSupportStaff.firstName;
						preference.lastName = slotSupportStaff.lastName;
						preference.fullName = slotSupportStaff.fullName;
	
						sectionGroup.eligibleSupportStaff.preferred.push(preference);

						if (preference.type === "reader") {
							sectionGroup.eligibleSupportStaff.readers.push(preference);
						} else {
							sectionGroup.eligibleSupportStaff.tas.push(preference);
						}
					}
				});
	
				sectionGroup.eligibleSupportStaff.other = [];
	
				supportStaff.ids.forEach(function(supportStaffId) {
					var staff = supportStaff.list[supportStaffId];
	
					if (confirmedSupportStaffIds.indexOf(supportStaffId) == -1) {
						sectionGroup.eligibleSupportStaff.other.push(staff);
					}
				});

				sectionGroup.eligibleSupportStaff.tas = _array_sortByProperty(sectionGroup.eligibleSupportStaff.tas, ["priority", "lastName"]);
				sectionGroup.eligibleSupportStaff.readers = _array_sortByProperty(sectionGroup.eligibleSupportStaff.readers, ["priority", "lastName"]);
				sectionGroup.eligibleSupportStaff.other = _array_sortByProperty(sectionGroup.eligibleSupportStaff.other, ["lastName"]);

				return sectionGroup;
			}
		};
	}
}

export default InstructorFormSelectors;
