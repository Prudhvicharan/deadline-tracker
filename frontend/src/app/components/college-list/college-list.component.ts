import { Component, OnInit } from '@angular/core';
import { CollegeService } from '../../services/college.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-college-list',
  templateUrl: './college-list.component.html',
  styleUrls: ['./college-list.component.scss'],
})
export class CollegeListComponent implements OnInit {
  colleges: any[] = [];
  currentPage = 0;
  pageSize = 20;
  totalItems = 0;
  searchTerm: string = '';

  constructor(
    private collegeService: CollegeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadColleges();
  }

  loadColleges(): void {
    this.collegeService.getColleges(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.colleges = response.colleges;
        this.totalItems = response.metadata.total;
      },
      (error) => console.error('Error fetching colleges:', error)
    );
  }

  searchColleges(): void {
    if (this.searchTerm) {
      this.collegeService.searchColleges(this.searchTerm).subscribe(
        (colleges) => {
          this.colleges = colleges;
          this.currentPage = 0;
          this.totalItems = colleges.length;
        },
        (error) => console.error('Error searching colleges:', error)
      );
    } else {
      this.currentPage = 0;
      this.loadColleges();
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadColleges();
  }

  addToMyList(college: any): void {
    if (this.authService.isLoggedIn()) {
      console.log('college', college);
      const collegeData = {
        name: college.name,
        location: college.location,
        collegeId: college.id,
        admissionRate: college.admissionRate,
      };
      console.log('collegeData', collegeData);
      this.collegeService.addCollege(collegeData).subscribe(
        () => {
          console.log('College added to your list');
          // Optionally, show a snackbar or some other notification
        },
        (error) => {
          console.error('Error adding college to list:', error);
          if (error.status === 401) {
            console.log('Authentication failed. Please log in again.');
            this.authService.logout(); // Force logout if token is invalid
            // Redirect to login page
          }
        }
      );
    } else {
      console.log(
        'User not logged in. Please log in to add colleges to your list.'
      );
      // Redirect to login page
    }
  }
}
