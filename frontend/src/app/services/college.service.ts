import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CollegeService {
  private apiUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools';
  private apiKey = '3wAuDRWXKx4TDcS1QLoKAjEkUo6csct8ZPF4xNZX';
  private backendUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get Authorization headers (if needed)
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch a list of colleges
  getColleges(page: number = 0, perPage: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('school.degrees_awarded.predominant', '3,4')
      .set('school.ownership', '1,2')
      .set(
        'fields',
        'id,school.name,school.city,school.state,school.zip,latest.admissions.admission_rate.overall'
      )
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response: any) => ({
        colleges: response.results.map((uni: any) => ({
          id: uni.id,
          name: uni['school.name'],
          location: `${uni['school.city']}, ${uni['school.state']} ${uni['school.zip']}`,
          admissionRate: uni['latest.admissions.admission_rate.overall'],
        })),
        metadata: response.metadata,
      }))
    );
  }

  // Get filter options
  getFilterOptions(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/filter-options`);
  }

  // Search colleges with filters
  searchColleges(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('school.degrees_awarded.predominant', '3,4')
      .set('school.ownership', '1,2')
      .set(
        'fields',
        'id,school.name,school.city,school.state,school.zip,latest.admissions.admission_rate.overall'
      )
      .set('per_page', '20');

    // Add search term if provided
    if (filters.search) {
      params = params.set('school.name', filters.search);
    }

    // Add state filters if provided
    if (filters.states && filters.states.length > 0) {
      const stateString = filters.states.join(',');
      params = params.set('school.state', stateString);
    }

    // Add admission rate filters if provided
    if (filters.admissionRate && filters.admissionRate.length > 0) {
      // Assuming admission rate filters are ranges like [0-0.3, 0.3-0.6, 0.6-1]
      const minRate = Math.min(...filters.admissionRate.map((range: string) => parseFloat(range.split('-')[0])));
      const maxRate = Math.max(...filters.admissionRate.map((range: string) => parseFloat(range.split('-')[1])));
      
      params = params.set('latest.admissions.admission_rate.overall__range', `${minRate}..${maxRate}`);
    }

    // Add program filters if provided
    if (filters.programs && filters.programs.length > 0) {
      const programString = filters.programs.join(',');
      params = params.set('latest.programs.cip_4_digit.code', programString);
    }

    // Handle sorting
    if (filters.sort) {
      const [field, direction] = filters.sort.split('-');
      
      if (field === 'name') {
        params = params.set('sort', direction === 'asc' ? 'school.name' : '-school.name');
      } else if (field === 'admission') {
        params = params.set('sort', direction === 'asc' ? 'latest.admissions.admission_rate.overall' : '-latest.admissions.admission_rate.overall');
      }
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response: any) => ({
        colleges: response.results.map((uni: any) => ({
          id: uni.id,
          name: uni['school.name'],
          location: `${uni['school.city']}, ${uni['school.state']} ${uni['school.zip']}`,
          admissionRate: uni['latest.admissions.admission_rate.overall'],
        })),
        metadata: response.metadata,
      }))
    );
  }

  // Fetch details of a specific college by ID
  getCollegeDetails(collegeId: string): Observable<any> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('id', collegeId)
      .set('fields', 'id,school.name');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) => ({
        id: response.results[0].id,
        name: response.results[0]['school.name'],
      }))
    );
  }

  // Fetch programs for a specific college by ID
  getPrograms(collegeId: string): Observable<any[]> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('id', collegeId)
      .set(
        'fields',
        'id,latest.programs.cip_4_digit,latest.programs.earnings,latest.programs.debt,latest.programs.credential'
      );

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response: any) => {
        const programs = response.results[0]['latest.programs.cip_4_digit'];
        return programs.map((program: any) => ({
          name: program.title,
          code: program.code,
          credential: program.credential ? program.credential.title : 'N/A',
          earnings: {
            one_year: program.earnings
              ? program.earnings['1_yr']?.overall_median_earnings
              : 'N/A',
            five_year: program.earnings
              ? program.earnings['5_yr']?.overall_median_earnings
              : 'N/A',
          },
          debt: program.debt ? program.debt.average : 'N/A',
        }));
      })
    );
  }

  // Fetch the user's saved colleges
  getUserColleges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/user/colleges`, {
      headers: this.getHeaders(),
    });
  }

  // Add a college to the user's saved list
  addCollege(college: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/user/colleges`, college, {
      headers: this.getHeaders(),
    });
  }

  // Remove a college from the user's saved list
  removeCollege(collegeId: string): Observable<any> {
    return this.http.delete(`${this.backendUrl}/user/colleges/${collegeId}`, {
      headers: this.getHeaders(),
    });
  }

  getUserDetails(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/userdetails`, {
      headers: this.getHeaders(),
    });
  }
}