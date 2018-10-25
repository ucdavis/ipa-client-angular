import { Component, ViewChild } from '@angular/core';
import { WorkgroupService } from './workgroup.service';
import { Workgroup } from './workgroup.model';
import { MatTableDataSource, Sort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';
  workgroups: MatTableDataSource<Workgroup>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'name',
    'code'
  ];

  constructor(private workgroupService: WorkgroupService) {}

  ngOnInit() {
    this.workgroupService.workgroups$.subscribe((data: Workgroup[]) => {
      this.workgroups = new MatTableDataSource<Workgroup>(data);
      this.workgroups.paginator = this.paginator;
    });
  }
}
