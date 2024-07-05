import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CollegeService } from '../../services/college.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]); // Initialize with an empty observable

  constructor(private collegeService: CollegeService, private router: Router) {}

  ngOnInit() {
    this.collegeService.getColleges().subscribe(
      (colleges) => {
        this.options = colleges.map((college) => college.name);
        this.initializeAutocomplete();
      },
      (error) => console.error('Error fetching colleges:', error)
    );
  }

  private initializeAutocomplete() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onSearch() {
    const searchTerm = this.searchControl.value;
    if (searchTerm) {
      this.router.navigate(['/colleges'], {
        queryParams: { search: searchTerm },
      });
    }
  }
}
