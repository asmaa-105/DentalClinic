import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";
import { sendAppointmentConfirmation, sendAppointmentReminder, sendAppointmentCancellation, sendAppointmentUpdate, sendContactMessage } from "./email-free";
import { reminderScheduler } from "./reminder";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize reminder scheduler for existing appointments
  reminderScheduler.scheduleAllReminders();
  // Get all doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  // Get doctor by ID
  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const doctor = await storage.getDoctor(id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctor" });
    }
  });

  // Get availability for a doctor
  app.get("/api/doctors/:id/availability", async (req, res) => {
    try {
      const doctorId = parseInt(req.params.id);
      const availability = await storage.getAvailabilityByDoctor(doctorId);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // Get availability for a specific date
  app.get("/api/availability/:doctorId/:date", async (req, res) => {
    try {
      const doctorId = parseInt(req.params.doctorId);
      const date = req.params.date;
      const availability = await storage.getAvailability(doctorId, date);
      
      if (!availability) {
        return res.json({ timeSlots: [] });
      }

      // Filter out booked time slots (only confirmed and pending appointments)
      const appointments = await storage.getAppointmentsByDoctor(doctorId);
      const bookedSlots = appointments
        .filter(apt => apt.appointmentDate === date && 
                      apt.status !== 'cancelled' && 
                      apt.status !== 'completed')
        .map(apt => apt.appointmentTime);
      
      const availableSlots = availability.timeSlots.filter(
        slot => !bookedSlots.includes(slot)
      );

      res.json({ timeSlots: availableSlots });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      
      // Send email confirmation and schedule reminder
      try {
        await sendAppointmentConfirmation(appointment);
        reminderScheduler.scheduleReminder(appointment);
        console.log(`Confirmation email sent to ${appointment.patientEmail}`);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the appointment creation if email fails
      }
      
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  // Get all appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Get appointment by ID
  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  // Update appointment
  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.updateAppointment(id, req.body);
      
      // TODO: Send email notification for update
      // await sendAppointmentUpdate(appointment);
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  // Cancel appointment
  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      // Send cancellation email before deleting
      try {
        await sendAppointmentCancellation(appointment);
        console.log(`Cancellation email sent to ${appointment.patientEmail}`);
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
      }
      
      // Cancel reminder
      reminderScheduler.cancelReminder(id);
      
      // Delete the appointment
      await storage.deleteAppointment(id);
      
      res.json({ message: "Appointment cancelled successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel appointment" });
    }
  });

  // Doctor authentication
  app.post("/api/doctor/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple authentication - in production, use proper password hashing
      if (username === "doctor" && password === "dental123") {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Update appointment with email notifications
  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const originalAppointment = await storage.getAppointment(id);
      
      if (!originalAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      const updatedAppointment = await storage.updateAppointment(id, req.body);
      
      // Send email notification based on changes
      try {
        if (req.body.status === "cancelled") {
          await sendAppointmentCancellation(updatedAppointment);
          console.log(`Cancellation email sent to ${updatedAppointment.patientEmail}`);
        } else if (req.body.appointmentDate !== originalAppointment.appointmentDate || 
                   req.body.appointmentTime !== originalAppointment.appointmentTime) {
          await sendAppointmentUpdate(updatedAppointment, 'rescheduled');
          console.log(`Rescheduling email sent to ${updatedAppointment.patientEmail}`);
        } else if (req.body.status !== originalAppointment.status) {
          // Status change notification
          await sendAppointmentUpdate(updatedAppointment, req.body.status);
          console.log(`Status change email sent to ${updatedAppointment.patientEmail}`);
        } else if (req.body.notes !== originalAppointment.notes) {
          // Notes updated
          await sendAppointmentUpdate(updatedAppointment, 'updated');
          console.log(`Update email sent to ${updatedAppointment.patientEmail}`);
        }
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }
      
      // Cancel existing reminder if appointment is cancelled or rescheduled
      if (req.body.status === "cancelled" || 
          req.body.appointmentDate !== originalAppointment.appointmentDate ||
          req.body.appointmentTime !== originalAppointment.appointmentTime) {
        reminderScheduler.cancelReminder(id);
      }
      
      // Schedule new reminder if appointment is rescheduled
      if (req.body.appointmentDate !== originalAppointment.appointmentDate ||
          req.body.appointmentTime !== originalAppointment.appointmentTime) {
        reminderScheduler.scheduleReminder(updatedAppointment);
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, subject, message } = req.body;
      
      // Send email notification to clinic
      try {
        await sendContactMessage({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          message: `Subject: ${subject}\n\n${message}`
        });
        console.log(`Contact form message sent to clinic from ${firstName} ${lastName}`);
      } catch (emailError) {
        console.error('Failed to send contact form email:', emailError);
        // Don't fail the response if email fails
      }
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
