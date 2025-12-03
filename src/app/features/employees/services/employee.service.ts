import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  create(employee: { fullName: string; email: string; salary: number; joinedOn: string; departmentId: number; skillIds: number[]; }) {
    throw new Error('Method not implemented.');
  }

  private api = 'http://localhost:5093/api/employees';

  constructor(private http: HttpClient) {}

  // CORRECT FUNCTION
  createEmployee(data: any) {
    return this.http.post(this.api, data);
  }

  getAll() { 
    return this.http.get<any[]>(this.api); 
  }

  getById(id: number) { 
    return this.http.get(`${this.api}/${id}`); 
  }

  update(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
