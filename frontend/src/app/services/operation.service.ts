import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { switchMap, takeWhile, map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface Operation {
  id: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  type: 'bulk_upload' | 'report_generation';
  meta: {
    totalRows?: number;
    processedRows?: number;
    errors?: string[];
    filename?: string;
    reportType?: 'csv' | 'xlsx';
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  constructor(private api: ApiService) {}

  getOperation(id: string): Observable<{ success: boolean; data: Operation }> {
    return this.api.get<{ success: boolean; data: Operation }>(`/operations/${id}`);
  }

  pollOperation(id: string, intervalMs: number = 2000): Observable<Operation> {
    return interval(intervalMs).pipe(
      switchMap(() => this.getOperation(id)),
      map(response => response.data),
      takeWhile(operation => {
        const status = operation.status;
        return status === 'queued' || status === 'running';
      }, true) // Include the last emission
    );
  }
}
