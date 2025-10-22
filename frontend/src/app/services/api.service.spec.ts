import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should make GET request with headers', () => {
      const mockData = { success: true, data: [] };
      authService.getToken.and.returnValue('test-token');

      service.get('/test').subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:4000/test');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockData);
    });

    it('should make GET request with query parameters', () => {
      const mockData = { success: true, data: [] };
      const params = { limit: 10, sort: 'price' };

      service.get('/test', params).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:4000/test?limit=10&sort=price');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle HTTP errors', () => {
      const errorMessage = 'Server error';
      authService.getToken.and.returnValue('test-token');

      service.get('/test').subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne('http://localhost:4000/test');
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('POST requests', () => {
    it('should make POST request with data', () => {
      const mockData = { success: true, data: { id: 1 } };
      const postData = { name: 'Test Product' };
      authService.getToken.and.returnValue('test-token');

      service.post('/test', postData).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:4000/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(postData);
      req.flush(mockData);
    });
  });

  describe('File operations', () => {
    it('should upload file', () => {
      const mockResponse = { success: true, data: { operationId: '123' } };
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      authService.getToken.and.returnValue('test-token');

      service.uploadFile('/upload', file).subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:4000/upload');
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockResponse);
    });

    it('should download file', () => {
      const mockBlob = new Blob(['test content'], { type: 'text/csv' });
      authService.getToken.and.returnValue('test-token');

      service.downloadFile('/download').subscribe(data => {
        expect(data).toBeInstanceOf(Blob);
      });

      const req = httpMock.expectOne('http://localhost:4000/download');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(mockBlob);
    });
  });
});
