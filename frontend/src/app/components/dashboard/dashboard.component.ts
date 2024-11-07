import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  isSmallScreen: boolean = false;
  deadlineStats = [
    { name: 'Overdue', value: 5 },
    { name: 'Upcoming', value: 10 },
    { name: 'Completed', value: 15 },
  ];
  // colorScheme = {
  //   domain: ['#FF0000', '#FFA500', '#00FF00'],
  // };

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF0000', '#FFA500', '#00FF00'],
  };
  showDashboard = true;
  showColleges = false;
  showCollegePrograms = false;
  showMyColleges = false;
  showDeadlines = false;
  showProfile = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.isSmallScreen = window.innerWidth < 768;
  }

  onSidenavToggle(isOpened: boolean) {
    if (!isOpened && this.isSmallScreen) {
      // Close the sidenav on small screen
    }
  }

  navigateTo(section: string) {
    this.resetVisibility();
    switch (section) {
      case 'dashboard':
        this.showDashboard = true;
        break;
      case 'colleges':
        this.showColleges = true;
        break;
      // this comes internally for a college
      // case 'colleges':
      //   this.showCollegePrograms = true;
      //   break;
      case 'my-colleges':
        this.showMyColleges = true;
        break;
      case 'deadlines':
        this.showDeadlines = true;
        break;
      case 'profile':
        this.showProfile = true;
        break;
    }
  }

  resetVisibility() {
    this.showDashboard = false;
    this.showColleges = false;
    this.showCollegePrograms = false;
    this.showMyColleges = false;
    this.showDeadlines = false;
    this.showProfile = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}