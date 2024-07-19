import { Component, OnInit, Input } from '@angular/core';
import { CollegeService } from '../../services/college.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deadline-display',
  templateUrl: './deadline-display.component.html',
  styleUrls: ['./deadline-display.component.scss'],
})
export class DeadlineDisplayComponent implements OnInit {
  @Input() limit?: number;
  deadlines: any[] = [];

  constructor(private collegeService: CollegeService, private router: Router) {}

  ngOnInit() {
    this.loadDeadlines();
  }

  loadDeadlines() {
    this.collegeService.getUserColleges().subscribe(
      (colleges: any[]) => {
        this.deadlines = colleges
          .filter((college) => college.deadline)
          .sort(
            (a, b) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );

        if (this.limit) {
          this.deadlines = this.deadlines.slice(0, this.limit);
        }
      },
      (error) => console.error('Error loading deadlines:', error)
    );
  }

  editDeadline(collegeId: string) {
    this.router.navigate(['/edit-deadline', collegeId]);
  }
}
