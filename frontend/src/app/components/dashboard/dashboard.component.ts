import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  isSidebarCollapsed: boolean = false;

  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: 'dashboard' },
    { label: 'View All Colleges', icon: 'school', route: 'colleges' },
    { label: 'My College List', icon: 'list', route: 'my-colleges' },
    { label: 'All Deadlines', icon: 'event', route: 'deadlines' },
  ];

  showDashboard = true;
  showColleges = false;
  showMyColleges = false;
  showDeadlines = false;
  showProfile = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  navigateTo(route: string) {
    this.resetVisibility();
    switch (route) {
      case 'dashboard':
        this.showDashboard = true;
        break;
      case 'colleges':
        this.showColleges = true;
        break;
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
    this.showMyColleges = false;
    this.showDeadlines = false;
    this.showProfile = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
