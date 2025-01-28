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
  selectedSidebarItem: string | null = null;
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '' },
    { label: 'View All Colleges', icon: 'school', route: 'colleges' },
    { label: 'My College List', icon: 'list', route: 'my-colleges' },
    { label: 'All Deadlines', icon: 'event', route: 'deadlines' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue
      ? this.authService.currentUserValue.username
      : null;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectSidebarItem(route: string) {
    this.selectedSidebarItem = route;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
