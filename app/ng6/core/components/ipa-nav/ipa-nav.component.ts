import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ipa-nav',
  templateUrl: './ipa-nav.component.html',
  styleUrls: ['./ipa-nav.component.css']
})
export class IpaNav implements OnInit {
  isNavExpanded: boolean = true;
  activePage: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // snapshot returned empty on new courses page. using location instead.
    // this.activePage = this.route.snapshot.url[0].path;
    this.activePage = location.pathname.split('/')[1];
  }

  toggleSideNav() {
    this.isNavExpanded = !this.isNavExpanded;
  }
}
