import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollegeService } from '../../services/college.service';

@Component({
  selector: 'app-college-list',
  templateUrl: './college-list.component.html',
  styleUrls: ['./college-list.component.scss'],
})
export class CollegeListComponent implements OnInit {
  colleges: any[] = [];
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private collegeService: CollegeService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.searchColleges();
    });
  }

  searchColleges() {
    this.collegeService.searchColleges(this.searchTerm).subscribe(
      (data) => {
        this.colleges = data;
      },
      (error) => console.error('Error fetching colleges:', error)
    );
  }
}
