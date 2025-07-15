import { 
  users, 
  doctors, 
  appointments, 
  availability,
  type User, 
  type InsertUser,
  type Doctor,
  type InsertDoctor,
  type Appointment,
  type InsertAppointment,
  type Availability,
  type InsertAvailability
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDoctor(id: number): Promise<Doctor | undefined>;
  getDoctors(): Promise<Doctor[]>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  
  getAvailability(doctorId: number, date: string): Promise<Availability | undefined>;
  getAvailabilityByDoctor(doctorId: number): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: number, availability: Partial<Availability>): Promise<Availability>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private doctors: Map<number, Doctor>;
  private appointments: Map<number, Appointment>;
  private availability: Map<number, Availability>;
  private currentUserId: number;
  private currentDoctorId: number;
  private currentAppointmentId: number;
  private currentAvailabilityId: number;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.appointments = new Map();
    this.availability = new Map();
    this.currentUserId = 1;
    this.currentDoctorId = 1;
    this.currentAppointmentId = 1;
    this.currentAvailabilityId = 1;
    
    // Initialize with sample doctor
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleDoctor: Doctor = {
      id: 1,
      name: "Dr. Anas Alhamou",
      specialty: "DDS & General Dentistry",
      bio: "Dr. Anas Alhamou is a highly experienced General Dentist with a passion for providing quality dental care. He is skilled in diagnosing and treating a variety of dental conditions and has experience working with children, adolescents, and adults, as well as those who suffer from dental anxiety. He is a skilled team player who understands the importance of collaborative care for the best treatment outcomes for patients. Dr. Alhamou is devoted to remaining up to date on the latest techniques to provide the highest level of patient care possible.",
      education: "Elrazi University - Doctor of Dental Surgery (DDS), Master Endo Professional Program - Credit hours: 180 h, Cosmetic Dentistry Professional Program - Credit hours: 220 h, ICDL - Credit hours: 180 h",
      experience: 15,
      image: "/attached_assets/3.jpg"
    };
    
    this.doctors.set(1, sampleDoctor);
    
    // Initialize sample availability
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const availability: Availability = {
        id: this.currentAvailabilityId++,
        doctorId: 1,
        date: dateStr,
        timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]
      };
      
      this.availability.set(availability.id, availability);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.currentDoctorId++;
    const doctor: Doctor = { 
      ...insertDoctor, 
      id,
      image: insertDoctor.image || null 
    };
    this.doctors.set(id, doctor);
    return doctor;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.doctorId === doctorId
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id, 
      status: insertAppointment.status || "confirmed",
      notes: insertAppointment.notes || null,
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, updateData: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) {
      throw new Error(`Appointment with id ${id} not found`);
    }
    const updatedAppointment = { ...appointment, ...updateData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<void> {
    this.appointments.delete(id);
  }

  async getAvailability(doctorId: number, date: string): Promise<Availability | undefined> {
    return Array.from(this.availability.values()).find(
      (avail) => avail.doctorId === doctorId && avail.date === date
    );
  }

  async getAvailabilityByDoctor(doctorId: number): Promise<Availability[]> {
    return Array.from(this.availability.values()).filter(
      (avail) => avail.doctorId === doctorId
    );
  }

  async createAvailability(insertAvailability: InsertAvailability): Promise<Availability> {
    const id = this.currentAvailabilityId++;
    const availability: Availability = { ...insertAvailability, id };
    this.availability.set(id, availability);
    return availability;
  }

  async updateAvailability(id: number, updateData: Partial<Availability>): Promise<Availability> {
    const availability = this.availability.get(id);
    if (!availability) {
      throw new Error(`Availability with id ${id} not found`);
    }
    const updatedAvailability = { ...availability, ...updateData };
    this.availability.set(id, updatedAvailability);
    return updatedAvailability;
  }
}

export const storage = new MemStorage();
