import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollegeService } from '../../services/college.service';

@Component({
  selector: 'app-college-details',
  templateUrl: './college-details.component.html',
  styleUrls: ['./college-details.component.scss'],
})
export class CollegeDetailsComponent implements OnInit {
  collegeId: string = '';
  collegeName: string = '';
  programs: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private collegeService: CollegeService
  ) {}

  ngOnInit(): void {
    this.collegeId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCollegeDetails();
  }

  loadCollegeDetails(): void {
    this.collegeService.getCollegeDetails(this.collegeId).subscribe(
      (college) => {
        this.collegeName = college.name;
        this.loadPrograms();
      },
      (error) => console.error('Error fetching college details:', error)
    );
  }

  loadPrograms(): void {
    this.collegeService.getPrograms(this.collegeId).subscribe(
      (programs) => (this.programs = programs),
      (error) => console.error('Error fetching programs:', error)
    );
  }
}
