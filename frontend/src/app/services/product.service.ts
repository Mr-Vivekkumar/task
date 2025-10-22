import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  pagination: {
    hasNextPage: boolean;
    nextCursor?: string;
    limit: number;
  };
}

export interface ProductQuery {
  limit?: number;
  cursor?: string;
  sort?: 'price' | '-price';
  q?: string;
  categoryName?: string;
  categoryId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private api: ApiService) {}

  getProducts(query: ProductQuery = {}): Observable<ProductListResponse> {
    return this.api.get<ProductListResponse>('/products', query);
  }

  getProduct(id: string): Observable<{ success: boolean; data: Product }> {
    return this.api.get<{ success: boolean; data: Product }>(`/products/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<{ success: boolean; data: Product }> {
    return this.api.post<{ success: boolean; data: Product }>('/products', product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<{ success: boolean; data: Product }> {
    return this.api.put<{ success: boolean; data: Product }>(`/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ success: boolean; data: { message: string } }> {
    return this.api.delete<{ success: boolean; data: { message: string } }>(`/products/${id}`);
  }

  bulkUpload(file: File): Observable<{ success: boolean; data: { operationId: string; status: string; message: string } }> {
    return this.api.uploadFile('/products/bulk-upload', file);
  }

  downloadCSV(): Observable<Blob> {
    return this.api.downloadFile('/reports/products.csv');
  }

  downloadXLSX(): Observable<Blob> {
    return this.api.downloadFile('/reports/products.xlsx');
  }
}
