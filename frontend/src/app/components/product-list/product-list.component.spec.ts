import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockProducts = [
    { id: '1', name: 'Product 1', price: 100, category: { id: '1', name: 'Category 1' }, createdAt: '2023-01-01' },
    { id: '2', name: 'Product 2', price: 200, category: { id: '2', name: 'Category 2' }, createdAt: '2023-01-02' }
  ];

  const mockCategories = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' }
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and categories on init', () => {
    const mockProductResponse = {
      success: true,
      data: mockProducts,
      pagination: { hasNextPage: false, limit: 20 }
    };
    const mockCategoryResponse = {
      success: true,
      data: mockCategories
    };

    productService.getProducts.and.returnValue(of(mockProductResponse));
    categoryService.getCategories.and.returnValue(of(mockCategoryResponse));

    component.ngOnInit();

    expect(productService.getProducts).toHaveBeenCalled();
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.categories).toEqual(mockCategories);
  });

  it('should handle search with debounce', (done) => {
    const mockResponse = {
      success: true,
      data: mockProducts,
      pagination: { hasNextPage: false, limit: 20 }
    };

    productService.getProducts.and.returnValue(of(mockResponse));
    component.ngOnInit();

    component.searchQuery = 'test';
    component.onSearch();

    setTimeout(() => {
      expect(productService.getProducts).toHaveBeenCalledWith({
        limit: 20,
        sort: undefined,
        q: 'test',
        categoryId: undefined
      });
      done();
    }, 350);
  });

  it('should load more products when loadMore is called', () => {
    const mockResponse = {
      success: true,
      data: mockProducts,
      pagination: { hasNextPage: true, nextCursor: 'cursor123', limit: 20 }
    };

    component.pagination = { hasNextPage: true, nextCursor: 'cursor123', limit: 20 };
    productService.getProducts.and.returnValue(of(mockResponse));

    component.loadMore();

    expect(productService.getProducts).toHaveBeenCalledWith({
      limit: 20,
      cursor: 'cursor123',
      sort: undefined,
      q: '',
      categoryId: undefined
    });
    expect(component.products.length).toBe(4); // 2 initial + 2 new
  });

  it('should delete product and reload list', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockResponse = {
      success: true,
      data: mockProducts,
      pagination: { hasNextPage: false, limit: 20 }
    };

    productService.deleteProduct.and.returnValue(of({ success: true, data: { message: 'Deleted' } }));
    productService.getProducts.and.returnValue(of(mockResponse));

    component.deleteProduct('1');

    expect(productService.deleteProduct).toHaveBeenCalledWith('1');
    expect(productService.getProducts).toHaveBeenCalled();
  });

  it('should handle errors gracefully', () => {
    spyOn(console, 'error');
    productService.getProducts.and.returnValue(throwError(() => new Error('Test error')));

    component.loadProducts();

    expect(component.isLoading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should cleanup subscriptions on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
