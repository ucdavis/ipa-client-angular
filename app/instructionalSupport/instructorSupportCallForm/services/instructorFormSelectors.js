class InstructorFormSelectors {
	constructor () {
		return {
			generateSectionGroups: function (sectionGroups, supportStaff, studentPreferences, instructorPreferences) {
				var self = this;

				sectionGroups.ids.forEach( function (sectionGroupId) {
					var sectionGroup = sectionGroups.list[sectionGroupId]; // eslint-disable-line no-unused-vars
					// Add instructor preference data
					sectionGroup = self.addInstructorPreferencesToSectionGroup(sectionGroup, supportStaff, instructorPreferences);
		
					// Add support staff data
					sectionGroup = self.addEligibleSupportStaffToSectionGroup(sectionGroup, supportStaff, studentPreferences);
				});
		
				return sectionGroups;
			},
			// Add de-normalized instructor preferences to the sectionGroup
			addInstructorPreferencesToSectionGroup: function (sectionGroup, supportStaff, instructorPreferences) {
				sectionGroup.instructorPreferences = [];
	
				instructorPreferences.ids.forEach( function (preferenceId) {
					var preference = instructorPreferences.list[preferenceId];
	
					if (preference.sectionGroupId != sectionGroup.id) {
						return;
					}
	
					supportStaff.ids.forEach( function(supportStaffId) {
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
	
				sectionGroup.instructorPreferences.forEach( function(preference) {
					if (confirmedSupportStaffIds.indexOf(preference.supportStaffId) == -1) {
						confirmedSupportStaffIds.push(preference.supportStaffId);
					}
				});
	
				sectionGroup.eligibleSupportStaff.preferred = [];
	
				studentPreferences.ids.forEach( function (preferenceId) {
					var preference = studentPreferences.list[preferenceId];
					var slotSupportStaff = supportStaff.list[preference.supportStaffId];
	
					if (preference.sectionGroupId == sectionGroup.id
					&& confirmedSupportStaffIds.indexOf(preference.supportStaffId) == -1 ) {
						confirmedSupportStaffIds.push(preference.supportStaffId);
	
						preference.firstName = slotSupportStaff.firstName;
						preference.lastName = slotSupportStaff.lastName;
						preference.fullName = slotSupportStaff.fullName;
	
						sectionGroup.eligibleSupportStaff.preferred.push(preference);
					}
				});
	
				sectionGroup.eligibleSupportStaff.other = [];
	
				supportStaff.ids.forEach( function(supportStaffId) {
					var staff = supportStaff.list[supportStaffId];
	
					if (confirmedSupportStaffIds.indexOf(supportStaffId) == -1) {
						sectionGroup.eligibleSupportStaff.other.push(staff);
					}
				});
	
				return sectionGroup;
			}
		};
	}
}

export default InstructorFormSelectors;
