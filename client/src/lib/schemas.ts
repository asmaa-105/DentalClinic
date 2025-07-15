// client/src/lib/schemas.ts
import { z } from "zod";

export const insertAppointmentSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientEmail: z.string().email("Please enter a valid email"),
  patientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  doctorId: z.number(),
  appointmentDate: z.string(),
  appointmentTime: z.string(),
  reasonForVisit: z.string().min(1, "Please select a reason for visit"),
  notes: z.string().optional(),
  status: z.string().optional(),
});