import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import {
  publicApi,
  authenticatedApi,
  fileUploadApi,
  createServiceClient,
  MicroService,
} from './enhancedApiClient';
import type { ApiError } from './swrConfig';

// Service configuration interface
export interface ServiceConfig {
  service?: MicroService;
  version?: string;
  secure?: boolean;
  multipart?: boolean;
}

// Enhanced service response interface
export interface ServiceResponse<T> {
  data: T;
  status: number;
  statusText: string;
  success: boolean;
  message?: string;
}

// Service method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Enhanced service factory class
export class ServiceFactory {
  private config: Required<Omit<ServiceConfig, 'resource'>>;
  private serviceClient: ReturnType<typeof createServiceClient> | null = null;

  constructor(config: ServiceConfig = {}) {
    this.config = {
      service: config.service || MicroService.USER_REGISTRATION,
      version: config.version || 'v1',
      secure: config.secure ?? true,
      multipart: config.multipart ?? false,
    };

    // Initialize service client if microservice is specified
    if (config.service) {
      this.serviceClient = createServiceClient(
        this.config.service,
        this.config.version,
      );
    }
  }

  // Get the appropriate API client based on configuration
  private getClient() {
    if (this.config.multipart) {
      return fileUploadApi;
    }
    return this.config.secure ? authenticatedApi : publicApi;
  }

  // Build endpoint URL
  private buildUrl(endpoint?: string): string {
    if (this.serviceClient && endpoint) {
      return this.serviceClient.endpoint(endpoint);
    }
    if (this.serviceClient && !endpoint) {
      return this.serviceClient.all();
    }
    return endpoint || '';
  }

  // Generic request method with error handling
  private async request<T>(
    method: HttpMethod,
    endpoint?: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ServiceResponse<T>> {
    try {
      const client = this.getClient();
      const url = this.buildUrl(endpoint);

      const response: AxiosResponse<T> = await client.request({
        method,
        url,
        data,
        ...config,
      });

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        success: response.status >= 200 && response.status < 300,
        message: response.statusText,
      };
    } catch (error) {
      const apiError = this.createApiError(error);
      throw apiError;
    }
  }

  // Create API error from unknown error
  private createApiError(error: unknown): ApiError {
    // This would use the same logic as in swrConfig
    // For now, creating a simple implementation
    if (error instanceof Error) {
      const apiError = error as ApiError;
      apiError.timestamp = new Date().toISOString();
      return apiError;
    }

    const apiError = new Error('Unknown error occurred') as ApiError;
    apiError.name = 'ServiceError';
    apiError.timestamp = new Date().toISOString();
    return apiError;
  }

  // GET request
  // Custom GET with body (for APIs that require it)
  async getWithBody<T>(
    endpoint?: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ServiceResponse<T>> {
    // Axios supports GET with body only if you pass it as 'data' in config
    return this.request<T>('GET', endpoint, data, config);
  }

  async get<T>(
    endpoint?: string,
    config?: AxiosRequestConfig,
  ): Promise<ServiceResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  // POST request
  async post<T>(
    endpoint?: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ServiceResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  // PUT request
  async put<T>(
    endpoint?: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ServiceResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  // PATCH request
  async patch<T>(
    endpoint?: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ServiceResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  // DELETE request
  async delete<T>(
    endpoint?: string,
    config?: AxiosRequestConfig,
  ): Promise<ServiceResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }

  // Upload file method
  async upload<T>(
    endpoint?: string,
    formData?: FormData,
    config?: AxiosRequestConfig,
  ): Promise<ServiceResponse<T>> {
    // Override to use multipart for this request
    const originalMultipart = this.config.multipart;
    this.config.multipart = true;

    try {
      const result = await this.request<T>('POST', endpoint, formData, {
        ...config,
      });

      return result;
    } finally {
      // Restore original multipart setting
      this.config.multipart = originalMultipart;
    }
  }

  // Create a new service factory with different configuration
  withConfig(newConfig: Partial<ServiceConfig>): ServiceFactory {
    return new ServiceFactory({
      ...this.config,
      ...newConfig,
    });
  }

  // Get service endpoint builder
  getEndpointBuilder() {
    return this.serviceClient;
  }

  // Static factory methods for common service configurations
  static createAuthService(): ServiceFactory {
    return new ServiceFactory({
      secure: false,
    });
  }

  static createSecureService(): ServiceFactory {
    return new ServiceFactory({
      secure: true,
    });
  }

  static createFileService(): ServiceFactory {
    return new ServiceFactory({
      secure: true,
      multipart: true,
    });
  }

  static createMicroService(
    service: MicroService,
    version?: string,
  ): ServiceFactory {
    return new ServiceFactory({
      service,
      version,
      secure: true,
    });
  }
}

// Helper function to create service instances
export function createService(config?: ServiceConfig): ServiceFactory {
  return new ServiceFactory(config);
}

// Helper functions for common service patterns
export function createAuthService(): ServiceFactory {
  return ServiceFactory.createAuthService();
}

export function createSecureService(): ServiceFactory {
  return ServiceFactory.createSecureService();
}

export function createFileService(): ServiceFactory {
  return ServiceFactory.createFileService();
}

export function createMicroService(
  service: MicroService,
  version?: string,
): ServiceFactory {
  return ServiceFactory.createMicroService(service, version);
}

// Export commonly used instances
export const authService = createAuthService();
export const studentService = createSecureService();
export const vendorService = createSecureService();
export const dashboardService = createSecureService();
export const fileUploadService = createFileService();
