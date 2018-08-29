import { Observable } from 'rxjs';

import { ApiService } from '@core/api/api.service';

export class ReportsService {
  private scheduleSummaryPath = '/api/scheduleSummaryReportView/workgroups';

  constructor(private apiService: ApiService) {}

  /**
   * Fetches data for the schedule summary report
   *
   * @param workgroupId
   * @param year
   * @param termCode
   */
  getScheduleSummaryReport(workgroupId: number, year: number, termCode: number): Observable<any> {
    return this.apiService.get(
      `${this.scheduleSummaryPath}/${workgroupId}/years/${year}/terms/${year}${termCode}`
    );
  }
}
