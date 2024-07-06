import { Component, OnInit } from '@angular/core';
import { CollegeService } from '../../services/college.service';

@Component({
  selector: 'app-college-list',
  templateUrl: './college-list.component.html',
  styleUrls: ['./college-list.component.scss'],
})
export class CollegeListComponent implements OnInit {
  colleges: any[] = [];
  currentPage = 0;
  totalPages = 0;
  searchTerm: string = '';

  constructor(private collegeService: CollegeService) {}

  ngOnInit(): void {
    this.loadColleges();
  }

  loadColleges(): void {
    this.collegeService.getColleges(this.currentPage).subscribe(
      (response) => {
        this.colleges = response.colleges;
        this.totalPages = Math.ceil(
          response.metadata.total / response.metadata.per_page
        );
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
          this.totalPages = 1; // or calculate based on the number of results
        },
        (error) => console.error('Error searching colleges:', error)
      );
    } else {
      this.currentPage = 0;
      this.loadColleges();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadColleges();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadColleges();
    }
  }
}
