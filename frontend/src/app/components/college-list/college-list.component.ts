import { Component, OnInit, ViewChild } from '@angular/core';
import { CollegeService } from '../../services/college.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProgramDetailsComponent } from '../program-details/program-details.component';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';

// Define interfaces for better type safety
interface College {
  id: string;
  name: string;
  location: string;
  admissionRate: number;
  isBookmarked?: boolean;
  // Add missing properties that are used in the template
  logoUrl?: string;
  themeColor?: string;
  topPrograms?: string[];
}

interface CollegeResponse {
  colleges: College[];
  metadata: {
    total: number;
    page: number;
    per_page: number;
  };
}

@Component({
  selector: 'app-college-list',
  templateUrl: './college-list.component.html',
  styleUrls: ['./college-list.component.scss'],
})
export class CollegeListComponent implements OnInit {
  colleges: College[] = [];
  filteredColleges: College[] = [];
  currentPage = 0;
  pageSize = 12;
  totalItems = 0;
  searchTerm: string = '';
  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid';
  selectedFilters = {
    admissionRate: [] as string[],
    states: [] as string[],
    programs: [] as string[]
  };
  sortOptions = [
    { value: 'name-asc', viewValue: 'Name (A-Z)' },
    { value: 'name-desc', viewValue: 'Name (Z-A)' },
    { value: 'admission-asc', viewValue: 'Admission Rate (Low to High)' },
    { value: 'admission-desc', viewValue: 'Admission Rate (High to Low)' }
  ];
  currentSort = 'name-asc';
  stateOptions: string[] = [];
  programOptions: string[] = [];
  searchControl = new FormControl('');
  private searchSubject = new Subject<string>();
  mobileFiltersOpen = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private collegeService: CollegeService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadColleges();
    this.setupSearch();
    this.loadFilterOptions();

    // For responsive design
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize(): void {
    this.viewMode = window.innerWidth < 768 ? 'list' : 'grid';
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        this.searchTerm = value || '';
        this.currentPage = 0;
        this.applyFilters();
      });
  }

  loadFilterOptions(): void {
    this.collegeService.getFilterOptions().subscribe(options => {
      this.stateOptions = options.states;
      this.programOptions = options.programs;
    });
  }

  loadColleges(): void {
    this.isLoading = true;
    this.collegeService.getColleges(this.currentPage, this.pageSize).subscribe(
      (response: CollegeResponse) => {
        this.colleges = response.colleges.map((college: College) => ({
          ...college,
          isBookmarked: false
        }));
        this.filteredColleges = [...this.colleges];
        this.totalItems = response.metadata.total;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching colleges:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilters(): void {
    this.isLoading = true;

    const filters = {
      search: this.searchTerm,
      admissionRate: this.selectedFilters.admissionRate,
      states: this.selectedFilters.states,
      programs: this.selectedFilters.programs,
      sort: this.currentSort
    };

    this.collegeService.searchColleges(filters).subscribe(
      (response: CollegeResponse) => {
        this.filteredColleges = response.colleges.map((college: College) => ({
          ...college,
          isBookmarked: this.isCollegeBookmarked(college.id)
        }));
        this.totalItems = response.metadata.total;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error applying filters:', error);
        this.isLoading = false;
      }
    );
  }

  // Add these methods that are referenced in the template
  removeAdmissionRateFilter(rate: string): void {
    this.selectedFilters.admissionRate = this.selectedFilters.admissionRate.filter(r => r !== rate);
    this.applyFilters();
  }

  removeStateFilter(state: string): void {
    this.selectedFilters.states = this.selectedFilters.states.filter(s => s !== state);
    this.applyFilters();
  }

  removeProgramFilter(program: string): void {
    this.selectedFilters.programs = this.selectedFilters.programs.filter(p => p !== program);
    this.applyFilters();
  }


  isCollegeBookmarked(collegeId: string): boolean {
    // Implementation to check if college is in user's list
    return false; // Placeholder
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  addToMyList(college: College, event: Event): void {
    event.stopPropagation();

    // if (!this.authService.isLoggedIn()) {
    //   this.dialog.open(LoginPromptComponent, {
    //     width: '400px'
    //   });
    //   return;
    // }

    college.isBookmarked = !college.isBookmarked;

    if (college.isBookmarked) {
      const collegeData = {
        name: college.name,
        location: college.location,
        collegeId: college.id,
        admissionRate: college.admissionRate,
      };

      this.collegeService.addCollege(collegeData).subscribe(
        () => {
          // Show success feedback
        },
        (error) => {
          console.error('Error adding college to list:', error);
          college.isBookmarked = false;
          if (error.status === 401) {
            this.authService.logout();
          }
        }
      );
    } else {
      this.collegeService.removeCollege(college.id).subscribe(
        () => {
          // Show success feedback
        },
        (error) => {
          console.error('Error removing college from list:', error);
          college.isBookmarked = true;
        }
      );
    }
  }

  viewDetails(college: College): void {
    this.dialog.open(ProgramDetailsComponent, {
      data: college.id,
      width: '800px',
      maxHeight: '90vh'
    });
  }

  clearFilters(): void {
    this.selectedFilters = {
      admissionRate: [],
      states: [],
      programs: []
    };
    this.searchTerm = '';
    this.searchControl.setValue('');
    this.currentSort = 'name-asc';
    this.currentPage = 0;
    this.applyFilters();
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen = !this.mobileFiltersOpen;
  }
}
