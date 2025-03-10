export interface Student {
  id: string;
  name: string;
  cardNumber: string;
  status: 'Activated' | 'Deactivated';
  balance: string;
  ssid: string;
  student_first_name: string;
  student_last_name: string;
  student_dob: string;
}

export interface StudentData {
  students: Student[];
}

export interface StudentResponse {
  message: string;
  students: Student[];
  status: number;
}

export interface RegisterStudentRequest {
  student: Student;
  card_number: string;
}

// new response body types
interface ParentData {
  user_name: string;
  user_contact: string;
  user_email: string;
  parent_student_relation: string;
}

export interface RawStudent {
  ssid: string;
  student_first_name: string;
  student_last_name: string;
  student_dob: string;
  status: 'active' | 'inactive';
  student_account_balance: string;
  card_number: string;
  card_status: 'active' | 'inactive';
  card_expiration_date: string;
  parents: ParentData[];
}

export interface StudentListResponse {
  message: string;
  students: RawStudent[];
  status: number;
}

// Final shape used in your table
export interface StudentDataItem {
  id: string;
  name: string;
  cardNumber: string;
  status: 'Activated' | 'Deactivated';
  balance: string;
  raw: RawStudent;
}

// register types

export interface RegisterStudentRequest {
  student: Student;
  card_number: string;
}

// The endpoint returns an object with a message and status.
export interface RegisterStudentResponse {
  message: string;
  status: number;
}
