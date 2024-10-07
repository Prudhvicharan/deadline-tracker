// my-colleges.component.ts
import { Component, OnInit } from '@angular/core';
import { CollegeService } from '../../services/college.service';

@Component({
  selector: 'app-user-colleges',
  templateUrl: './user-colleges.component.html',
  styleUrls: ['./user-colleges.component.scss'],
})
export class UserCollegesComponent implements OnInit {
  myColleges: any[] = [];

  constructor(private collegeService: CollegeService) {}

  ngOnInit(): void {
    this.loadMyColleges();
  }

  loadMyColleges(): void {
    this.collegeService.getUserColleges().subscribe(
      (colleges) => {
        this.myColleges = colleges;
      },
      (error) => {
        console.error('Error fetching user colleges:', error);
      }
    );
  }
}
