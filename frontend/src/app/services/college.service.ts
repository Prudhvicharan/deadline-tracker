import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CollegeService {
  private apiUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools';
  private apiKey = '3wAuDRWXKx4TDcS1QLoKAjEkUo6csct8ZPF4xNZX';

  constructor(private http: HttpClient) {}

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

  searchColleges(searchTerm: string): Observable<any[]> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('school.name', searchTerm)
      .set(
        'fields',
        'id,school.name,school.city,school.state,school.zip,latest.admissions.admission_rate.overall'
      )
      .set('per_page', '20');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response: any) =>
        response.results.map((uni: any) => ({
          id: uni.id,
          name: uni['school.name'],
          location: `${uni['school.city']}, ${uni['school.state']} ${uni['school.zip']}`,
          admissionRate: uni['latest.admissions.admission_rate.overall'],
        }))
      )
    );
  }

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

  getPrograms(collegeId: string): Observable<any[]> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('id', collegeId)
      .set('fields', 'id,latest.programs.cip_4_digit');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response: any) => {
        const programs = response.results[0]['latest.programs.cip_4_digit'];
        return programs.map((program: any) => ({
          name: program.title,
          code: program.code,
        }));
      })
    );
  }
}
