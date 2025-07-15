// shared/types.ts

// User type
export type User = {
  id: number;
  username: string;
  password: string;
};

export type InsertUser = {
  username: string;
  password: string;
};

// Doctor type
export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  education: string;
  experience: number;
  image?: string | null;
};

export type InsertDoctor = Omit<Doctor, 'id'>;

// Appointment type
export type Appointment = {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  reasonForVisit: string;
  notes?: string | null;
  status: string;
  createdAt?: string;
};

export type InsertAppointment = Omit<Appointment, 'id' | 'createdAt'>;

// Availability type
export type Availability = {
  id: number;
  doctorId: number;
  date: string;
  timeSlots: string[];
};

export type InsertAvailability = Omit<Availability, 'id'>; 