class WorkgroupExcelService {
  constructor(WorkgroupStateService) {
    return {
      generateDownload() {
        const workgroup = JSON.parse(localStorage.workgroup);
        const workgroupName = workgroup.name;
        const workgroupId = Number(workgroup.id);

        const activeRoleTab = WorkgroupStateService._state.ui.roles.activeRoleTab;
        const activeRole = WorkgroupStateService._state.ui.roles.tabOverrides[activeRoleTab] ? WorkgroupStateService._state.ui.roles.tabOverrides[activeRoleTab] : activeRoleTab;
        let activeRoleIds = [];

        switch (activeRole) {
          case 'Staff':
            activeRoleIds = [2];
            break;
          case 'Instructor':
            activeRoleIds = [15];
            break;
          case 'Student':
            activeRoleIds = WorkgroupStateService._state.ui.studentRoles.map(r => r.id);
            break;
          default:
            activeRoleIds = [9];
            break;
        }

        const usersList = Object.values(WorkgroupStateService._state.users.list);
        const activeTabUsers = usersList.filter(user => {
          const workgroupUserRoles = user.userRoles.filter(role => role.workgroupId === workgroupId);

          // Users in unassigned tab only have presence role
          if (activeRoleTab === 'Presence' && workgroupUserRoles.every(role => role.roleId === 9)) {
            return user;
          }

          // a user may or may not have a presence role along with other user roles
          if (activeRoleTab !== 'Presence' && workgroupUserRoles.some(role => activeRoleIds.includes(role.roleId))) {
            return user;
          }
        });

        let data = [];

        const header = [
          'Name',
          'Email',
        ];

        data.push(header);

        const sortedUsers = activeTabUsers.sort((a, b) => {
          if (a.lastName < b.lastName) { return -1; }
          if (a.lastName > b.lastName) { return 1; }
          return 0;
        });

        sortedUsers.forEach((user) => {
          let row = [];
          row.push(user.name);
          row.push(user.email);
          data.push(row);
        });

        const wb = XLSX.utils.book_new(); // eslint-disable-line no-undef
        const ws = XLSX.utils.aoa_to_sheet(data); // eslint-disable-line no-undef

        // Set column widths
        const wscols = [
          { wch: 30 },
          { wch: 25 },
        ];
        ws['!cols'] = wscols;

        /* Add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, activeRoleTab); // eslint-disable-line no-undef

        /* Write workbook */
        const filename = workgroupName + "-" + activeRole + ".xlsx";
        XLSX.writeFile(wb, filename); // eslint-disable-line no-undef
      }
    };
  }
}

export default WorkgroupExcelService;
