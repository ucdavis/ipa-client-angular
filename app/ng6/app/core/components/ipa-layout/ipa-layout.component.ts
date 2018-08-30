import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ipa-layout',
  templateUrl: './ipa-layout.component.html',
  styleUrls: ['./ipa-layout.component.css']
})
export class IpaLayoutComponent implements OnInit {
  isNavExpanded = true;
  activePage: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.activePage = location.pathname.split('/')[1];
  }

  toggleSideNav() {
    this.isNavExpanded = !this.isNavExpanded;
  }
}
