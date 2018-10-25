import { Component } from '@angular/core';
import { WorkgroupService } from './workgroup.service';
import { Workgroup } from './workgroup.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';
  workgroups: Workgroup[] = [];
  workgroup: Workgroup;

  constructor(private workgroupService: WorkgroupService) {}

  ngOnInit() {
    this.workgroupService.getWorkgroups().subscribe((data: Workgroup[]) => {
      let workgroups: Workgroup[] = data;
      this.workgroups = data;
    });
  }

  test () {
    console.log("test");
  }
}
