export interface Student {
  id: string;
  name: string;
  cardNumber: string;
  status: 'Activated' | 'Deactivated';
  balance: string;
}

export interface StudentResponse {
  message: string;
  students: Student[];
  status: number;
}
