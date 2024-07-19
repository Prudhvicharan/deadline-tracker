// my-colleges.component.ts
import { Component, OnInit } from '@angular/core';
import { CollegeService } from '../../services/college.service';

@Component({
  selector: 'app-my-colleges',
  templateUrl: './my-colleges.component.html',
  styleUrls: ['./my-colleges.component.scss'],
})
export class MyCollegesComponent implements OnInit {
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
