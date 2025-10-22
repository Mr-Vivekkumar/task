import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private api: ApiService) {}

  getCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this.api.get<{ success: boolean; data: Category[] }>('/categories');
  }

  getCategory(id: string): Observable<{ success: boolean; data: Category }> {
    return this.api.get<{ success: boolean; data: Category }>(`/categories/${id}`);
  }

  createCategory(category: { name: string }): Observable<{ success: boolean; data: Category }> {
    return this.api.post<{ success: boolean; data: Category }>('/categories', category);
  }

  updateCategory(id: string, category: { name: string }): Observable<{ success: boolean; data: Category }> {
    return this.api.put<{ success: boolean; data: Category }>(`/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<{ success: boolean; data: { message: string } }> {
    return this.api.delete<{ success: boolean; data: { message: string } }>(`/categories/${id}`);
  }
}
