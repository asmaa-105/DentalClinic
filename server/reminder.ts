import { sendAppointmentReminder } from './email-resend';
import { storage } from './storage';
import type { Appointment } from '@shared/schema';

export class ReminderScheduler {
  private reminderTimeouts: Map<number, NodeJS.Timeout> = new Map();

  scheduleReminder(appointment: Appointment) {
    const appointmentDate = new Date(appointment.appointmentDate);
    const [time, period] = appointment.appointmentTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    appointmentDate.setHours(hour, parseInt(minutes), 0, 0);
    
    // Schedule reminder 24 hours before appointment
    const reminderTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (reminderTime > now) {
      const timeout = setTimeout(async () => {
        try {
          await sendAppointmentReminder(appointment);
          console.log(`Reminder sent for appointment ${appointment.id}`);
        } catch (error) {
          console.error(`Failed to send reminder for appointment ${appointment.id}:`, error);
        }
        this.reminderTimeouts.delete(appointment.id);
      }, reminderTime.getTime() - now.getTime());
      
      this.reminderTimeouts.set(appointment.id, timeout);
      console.log(`Reminder scheduled for appointment ${appointment.id} at ${reminderTime.toISOString()}`);
    } else {
      console.log(`Appointment ${appointment.id} is too soon for reminder (less than 24 hours)`);
    }
  }

  cancelReminder(appointmentId: number) {
    const timeout = this.reminderTimeouts.get(appointmentId);
    if (timeout) {
      clearTimeout(timeout);
      this.reminderTimeouts.delete(appointmentId);
      console.log(`Reminder cancelled for appointment ${appointmentId}`);
    }
  }

  async scheduleAllReminders() {
    try {
      const appointments = await storage.getAppointments();
      const now = new Date();
      
      for (const appointment of appointments) {
        const appointmentDate = new Date(appointment.appointmentDate);
        if (appointmentDate > now && appointment.status === 'confirmed') {
          this.scheduleReminder(appointment);
        }
      }
    } catch (error) {
      console.error('Failed to schedule reminders:', error);
    }
  }
}

export const reminderScheduler = new ReminderScheduler();