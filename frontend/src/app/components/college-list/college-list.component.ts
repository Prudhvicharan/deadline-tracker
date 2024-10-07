import { Component, OnInit, ViewChild } from '@angular/core';
import { CollegeService } from '../../services/college.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import { ProgramDetailsComponent } from '../program-details/program-details.component';

@Component({
  selector: 'app-college-list',
  templateUrl: './college-list.component.html',
  styleUrls: ['./college-list.component.scss'],
})
export class CollegeListComponent implements OnInit {
  colleges: any[] = [];
  currentPage = 0;
  pageSize = 24;
  totalItems = 0;
  searchTerm: string = '';
  activeFilters: string[] = [];
  private searchSubject = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private collegeService: CollegeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadColleges();
    this.setupSearch();
  }

  setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.searchColleges();
      });
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
          this.paginator.firstPage();
        },
        (error) => console.error('Error searching colleges:', error)
      );
    } else {
      this.currentPage = 0;
      this.loadColleges();
    }
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadColleges();
  }

  addToMyList(college: any): void {
    // Implement add to list functionality
  }

  viewDetails(college: any): void {
    // this.dialog.open(ProgramDetailsComponent, {
    //   data: college.id,
    //   width: '600px',
    // });
  }

  removeFilter(filter: string): void {
    this.activeFilters = this.activeFilters.filter((f) => f !== filter);
    // Implement filter removal logic
  }
}
