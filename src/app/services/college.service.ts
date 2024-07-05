import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollegeService {
  private apiUrl = 'http://localhost:3000/api'; // Update this with your actual API URL

  constructor(private http: HttpClient) {}

  getColleges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/colleges`);
  }

  // searchColleges(searchTerm: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/colleges`, {
  //     params: { search: searchTerm },
  //   });
  // }
  searchColleges(searchTerm: string): Observable<any[]> {
    // Mock data
    const mockColleges = [
      { id: 1, name: 'University of Example', location: 'Example City, EX' },
      { id: 2, name: 'Sample State University', location: 'Sample Town, ST' },
      // Add more mock colleges...
    ];

    return of(
      mockColleges.filter((college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  getPrograms(collegeId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/colleges/${collegeId}/programs`
    );
  }
}
function of(
  arg0: { id: number; name: string; location: string }[]
): Observable<any[]> {
  throw new Error('Function not implemented.');
}
