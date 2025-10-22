import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductQuery } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import type { ProductListResponse } from '../../services/product.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = false;
  searchQuery = '';
  selectedCategoryId = '';
  sortBy = '';
  limit = 20;
  pagination: ProductListResponse['pagination'] = {
    hasNextPage: false,
    limit: 20
  };

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    
    // Setup debounced search
    this.searchSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.isLoading = true;
    this.cdr.markForCheck();
    
    const query: ProductQuery = {
      limit: this.limit,
      sort: (this.sortBy || undefined) as any,
      q: this.searchQuery || undefined,
      categoryId: this.selectedCategoryId || undefined
    };

    this.productService.getProducts(query).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.products = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.categories = response.data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSearch() {
    this.searchSubject$.next(this.searchQuery);
  }

  onCategoryChange() {
    this.loadProducts();
  }

  onSortChange() {
    this.loadProducts();
  }

  onLimitChange() {
    this.limit = Number(this.limit);
    this.loadProducts();
  }

  loadMore() {
    if (this.pagination.nextCursor) {
      this.isLoading = true;
      this.cdr.markForCheck();
      
      const query: ProductQuery = {
        limit: this.limit,
        cursor: this.pagination.nextCursor,
        sort: (this.sortBy || undefined) as any,
        q: this.searchQuery || undefined,
        categoryId: this.selectedCategoryId || undefined
      };

      this.productService.getProducts(query).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.products = [...this.products, ...response.data];
          this.pagination = response.pagination;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading more products:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  openCreateModal() {
    // TODO: Implement create product modal
    console.log('Open create product modal');
  }

  editProduct(product: Product) {
    // TODO: Implement edit product modal
    console.log('Edit product:', product);
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  openBulkUploadModal() {
    // TODO: Implement bulk upload modal
    console.log('Open bulk upload modal');
  }

  downloadCSV() {
    this.productService.downloadCSV().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading CSV:', error);
      }
    });
  }

  downloadXLSX() {
    this.productService.downloadXLSX().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading XLSX:', error);
      }
    });
  }
}
