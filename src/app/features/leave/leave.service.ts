import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private baseUrl = 'http://localhost:5093/api/Leave';

  constructor(private http: HttpClient) {}

  // =========================
  // USER: APPLY LEAVE
  // =========================
  applyLeave(data: {
    leaveType: string;
    fromDate: string;
    toDate: string;
    reason: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply`, data);
  }

  // =========================
  // USER: GET MY LEAVES
  // =========================
  getMyLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my`);
  }

  // =========================
  // ADMIN: GET ALL LEAVES
  // =========================
  getAllLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  // =========================
  // ADMIN: GET PENDING LEAVES
  // =========================
  getPendingLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pending`);
  }

  // =========================
  // COMMON: GET LEAVE BY ID
  // =========================
  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // =========================
  // USER: UPDATE LEAVE (PENDING ONLY)
  // =========================
  updateLeave(
    id: number,
    data: {
      leaveType: string;
      fromDate: string;
      toDate: string;
      reason: string;
    }
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // =========================
  // ADMIN: APPROVE / REJECT
  // =========================
  updateLeaveStatus(
    id: number,
    status: 'Approved' | 'Rejected'
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, {
      status
    });
  }

  // =========================
  // USER: DELETE LEAVE (PENDING ONLY)
  // =========================
  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
