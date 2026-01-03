
export enum CallType {
  FACULTY = 'FACULTY',
  STUDENT = 'STUDENT'
}

export enum FieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  SELECT = 'SELECT',
  FILE = 'FILE'
}

export interface FieldDefinition {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // Used for 'select' type
  acceptedFileTypes?: string[]; // Used for 'file' type (e.g., ['.pdf', '.docx'])
}

export interface Category {
  id: string;
  name: string;
  type: CallType;
  description: string;
  fields: FieldDefinition[];
}

export interface CallAnnouncement {
  id: string;
  categoryId: string;
  title: string;
  createdAt: string;
  data: Record<string, any>; // Dynamic data based on category fields
  status: 'Draft' | 'Published' | 'Closed';
  attachments?: { fieldId: string; fileName: string; fileUrl: string; fileSize?: number }[];
}

export interface AppState {
  categories: Category[];
  calls: CallAnnouncement[];
}
