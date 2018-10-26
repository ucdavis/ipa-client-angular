import { Component, ViewChild } from '@angular/core';
import { WorkgroupService } from '../../shared/services/workgroup.service';
import { Workgroup } from '../../shared/models/workgroup.model';
import { MatTableDataSource, MatSnackBar, Sort, MatPaginator } from '@angular/material';
import { orderBy } from 'lodash';

@Component({
  selector: 'admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent {
  workgroups: MatTableDataSource<Workgroup>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'name',
    'code',
    'lastAccessed'
  ];

  constructor(private workgroupService: WorkgroupService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.workgroupService.workgroups$.subscribe((data: Workgroup[]) => {
      this.workgroups = new MatTableDataSource<Workgroup>(data);
      this.workgroups.paginator = this.paginator;
    });
  }

  sortData(sort: Sort) {
    const data = this.workgroups.data.slice();
    let orderedData = orderBy(data, [sort.active], [sort.direction, 'asc']);
    this.workgroups = new MatTableDataSource(orderedData);
    this.workgroups.paginator = this.paginator;
  }

  updateWorkgroup(workgroup) {
    this.workgroupService.updateWorkgroup(workgroup);
  }
}
