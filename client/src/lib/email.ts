import type { Appointment } from "@shared/types";

// Email service configuration
const EMAIL_SERVICE_API_KEY = process.env.EMAIL_SERVICE_API_KEY || process.env.SENDGRID_API_KEY || "your-email-api-key";
const EMAIL_SERVICE_ENDPOINT = process.env.EMAIL_SERVICE_ENDPOINT || "https://api.sendgrid.com/v3/mail/send";

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(emailData: EmailData): Promise<void> {
  try {
    const response = await fetch(EMAIL_SERVICE_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${EMAIL_SERVICE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailData.to }],
            subject: emailData.subject,
          },
        ],
        from: { email: "noreply@anasdentalclinic.com", name: "Anas Dental Clinic" },
        content: [
          {
            type: "text/html",
            value: emailData.html,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Email service error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

export async function sendAppointmentConfirmation(appointment: Appointment): Promise<void> {
  const emailData: EmailData = {
    to: appointment.patientEmail,
    subject: "Appointment Confirmation - Anas Dental Clinic",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #333333; padding: 20px; text-align: center;">
          <h1 style="color: #B89B4E; margin: 0;">Anas Dental Clinic</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333333;">Appointment Confirmed!</h2>
          
          <p>Dear ${appointment.patientName},</p>
          
          <p>Your appointment has been successfully scheduled. Here are the details:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333333; margin-top: 0;">Appointment Details</h3>
            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Doctor:</strong> Dr. Anas Alhamou</p>
            <p><strong>Type:</strong> ${appointment.reasonForVisit}</p>
            <p><strong>Location:</strong> Anas Dental Clinic</p>
          </div>
          
          <div style="background-color: #B89B4E; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Important Reminders</h3>
            <ul>
              <li>Please arrive 15 minutes early for check-in</li>
              <li>Bring your insurance card and valid ID</li>
              <li>You will receive a reminder 24 hours before your appointment</li>
            </ul>
          </div>
          
          <p>If you need to reschedule or cancel, please call us at +963 938 114 869.</p>
          
          <p>Thank you for choosing Anas Dental Clinic!</p>
        </div>
        
        <div style="background-color: #333333; padding: 20px; text-align: center; color: white;">
          <p>Anas Dental Clinic | Al-Shahbaa District, Aleppo Road, Hama, Syria</p>
          <p>Phone: +963 938 114 869 | Email: anas.dentalclinic97@gmail.com</p>
        </div>
      </div>
    `,
  };

  await sendEmail(emailData);
}

export async function sendAppointmentReminder(appointment: Appointment): Promise<void> {
  const emailData: EmailData = {
    to: appointment.patientEmail,
    subject: "Appointment Reminder - Anas Dental Clinic",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #333333; padding: 20px; text-align: center;">
          <h1 style="color: #B89B4E; margin: 0;">Anas Dental Clinic</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333333;">Appointment Reminder</h2>
          
          <p>Dear ${appointment.patientName},</p>
          
          <p>This is a friendly reminder about your upcoming appointment tomorrow:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333333; margin-top: 0;">Tomorrow's Appointment</h3>
            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Doctor:</strong> Dr. Anas Alhamou</p>
            <p><strong>Type:</strong> ${appointment.reasonForVisit}</p>
          </div>
          
          <p>Please arrive 15 minutes early and bring your insurance card and valid ID.</p>
          
          <p>If you need to reschedule or cancel, please call us at +963 938 114 869.</p>
          
          <p>We look forward to seeing you tomorrow!</p>
        </div>
        
        <div style="background-color: #333333; padding: 20px; text-align: center; color: white;">
          <p>Anas Dental Clinic | Al-Shahbaa District, Aleppo Road, Hama, Syria</p>
        </div>
      </div>
    `,
  };

  await sendEmail(emailData);
}

export async function sendAppointmentCancellation(appointment: Appointment): Promise<void> {
  const emailData: EmailData = {
    to: appointment.patientEmail,
    subject: "Appointment Cancelled - Anas Dental Clinic",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #333333; padding: 20px; text-align: center;">
          <h1 style="color: #B89B4E; margin: 0;">Anas Dental Clinic</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333333;">Appointment Cancelled</h2>
          
          <p>Dear ${appointment.patientName},</p>
          
          <p>Your appointment scheduled for ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime} has been cancelled.</p>
          
          <p>If you would like to reschedule, please call us at +963 938 114 869 or visit our website to book a new appointment.</p>
          
          <p>Thank you for choosing Anas Dental Clinic!</p>
        </div>
        
        <div style="background-color: #333333; padding: 20px; text-align: center; color: white;">
          <p>Anas Dental Clinic | Al-Shahbaa District, Aleppo Road, Hama, Syria</p>
        </div>
      </div>
    `,
  };

  await sendEmail(emailData);
}
