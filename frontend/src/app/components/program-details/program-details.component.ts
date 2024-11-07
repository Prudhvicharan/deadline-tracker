import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollegeService } from '../../services/college.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss'],
})
export class ProgramDetailsComponent implements OnInit {
  collegeId: string = '';
  collegeName: string = '';
  programs: any[] = [];
  filteredPrograms: any[] = [];
  departments: string[] = [];
  degrees: string[] = [];
  filterForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private collegeService: CollegeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.collegeId = data;
    this.filterForm = this.fb.group({
      department: [''],
      degree: ['']
    });
  }

  ngOnInit(): void {
    this.loadCollegeDetails();
    this.filterForm.valueChanges.subscribe(() => this.filterPrograms());
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
      (programs) => {
        this.programs = programs;
        this.filteredPrograms = this.programs;
        this.departments = [...new Set(this.programs.map((program) => program.name))].sort();
        this.degrees = [...new Set(this.programs.map((program) => program.credential))].sort();
      },
      (error) => console.error('Error fetching programs:', error)
    );
  }

  filterPrograms(): void {
    const { department, degree } = this.filterForm.value;
    this.filteredPrograms = this.programs.filter((program) => {
      const matchesDepartment = department ? program.name === department : true;
      const matchesDegree = degree ? program.credential === degree : true;
      return matchesDepartment && matchesDegree;
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      department: '',
      degree: ''
    });
  }
}