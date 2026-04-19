declare global {
  // example
  interface User {
    id: ID;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'vendor';
  }

  interface APIResponse<T> {
    data: T;
    message: string;
    status: number;
  }
}

export {};
