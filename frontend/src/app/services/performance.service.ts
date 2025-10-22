import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private metricsSubject = new BehaviorSubject<PerformanceMetrics>({
    bundleSize: 0,
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0
  });

  public metrics$: Observable<PerformanceMetrics> = this.metricsSubject.asObservable();

  constructor() {
    this.initializePerformanceMonitoring();
  }

  private initializePerformanceMonitoring(): void {
    // Monitor bundle size
    this.monitorBundleSize();
    
    // Monitor load time
    this.monitorLoadTime();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor network requests
    this.monitorNetworkRequests();
  }

  private monitorBundleSize(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0];
        const bundleSize = navigation.transferSize || 0;
        this.updateMetrics({ bundleSize });
      }
    }
  }

  private monitorLoadTime(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0];
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        this.updateMetrics({ loadTime });
      }
    }
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      this.updateMetrics({ memoryUsage });
    }
  }

  private monitorNetworkRequests(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resourceEntries = performance.getEntriesByType('resource');
      const networkRequests = resourceEntries.length;
      this.updateMetrics({ networkRequests });
    }
  }

  private updateMetrics(updates: Partial<PerformanceMetrics>): void {
    const currentMetrics = this.metricsSubject.value;
    this.metricsSubject.next({ ...currentMetrics, ...updates });
  }

  public getCurrentMetrics(): PerformanceMetrics {
    return this.metricsSubject.value;
  }

  public logPerformanceReport(): void {
    const metrics = this.getCurrentMetrics();
    console.group('🚀 Performance Report');
    console.log(`📦 Bundle Size: ${metrics.bundleSize.toFixed(2)} KB`);
    console.log(`⏱️ Load Time: ${metrics.loadTime.toFixed(2)} ms`);
    console.log(`🎨 Render Time: ${metrics.renderTime.toFixed(2)} ms`);
    console.log(`💾 Memory Usage: ${metrics.memoryUsage.toFixed(2)} MB`);
    console.log(`🌐 Network Requests: ${metrics.networkRequests}`);
    console.groupEnd();
  }
}
