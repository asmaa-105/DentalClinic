import nodemailer from 'nodemailer';
import type { Appointment } from '@shared/schema';

// Free Gmail SMTP solution - no API keys needed, just Gmail credentials
let transporter: nodemailer.Transporter | null = null;

async function createTransporter() {
  if (transporter) return transporter;
  
  // Try Gmail SMTP first (most reliable free option)
  if (process.env.GMAIL_EMAIL && process.env.GMAIL_APP_PASSWORD) {
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
      
      // Test the connection
      await transporter.verify();
      console.log('✅ Gmail SMTP connection verified');
      return transporter;
    } catch (error) {
      console.error('Gmail SMTP failed, falling back to test account');
    }
  }
  
  // Fallback to Ethereal (always free, no signup needed)
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log('📧 Using free Ethereal email for testing');
    console.log('Test account:', testAccount.user);
    return transporter;
  } catch (error) {
    console.error('Failed to create any email transporter:', error);
    throw error;
  }
}

export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    console.log('📧 Sending email...');
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    
    const emailTransporter = await createTransporter();
    
    // Use Gmail if available, otherwise use Ethereal test account
    const fromAddress = process.env.GMAIL_EMAIL 
      ? `"Elite Dental Care" <${process.env.GMAIL_EMAIL}>`
      : `"Elite Dental Care" <${params.from}>`;
    
    const info = await emailTransporter.sendMail({
      from: fromAddress,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Show preview URL for Ethereal emails
    if (info.messageId.includes('ethereal')) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('📧 Preview your email at:', previewUrl);
      console.log('(This is a test email - in production it would go to the recipient)');
    } else {
      console.log('📬 Real email delivered to:', params.to);
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    return false;
  }
}

export async function sendAppointmentConfirmation(appointment: Appointment): Promise<boolean> {
  const emailParams: EmailParams = {
    to: appointment.patientEmail,
    from: 'noreply@elitedentalcare.com',
    subject: 'Appointment Confirmation - Elite Dental Care',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #333333; padding: 20px; text-align: center;">
          <h1 style="color: #B89B4E; margin: 0;">Elite Dental Care</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333333;">Appointment Confirmed!</h2>
          
          <p>Dear ${appointment.patientName},</p>
          
          <p>Your appointment has been successfully scheduled. Here are the details:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333333; margin-top: 0;">Appointment Details</h3>
            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Doctor:</strong> Dr. Sarah Johnson</p>
            <p><strong>Type:</strong> ${appointment.reasonForVisit}</p>
            <p><strong>Location:</strong> Elite Dental Care</p>
          </div>
          
          <div style="background-color: #B89B4E; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Important Reminders</h3>
            <ul>
              <li>Please arrive 15 minutes early for check-in</li>
              <li>Bring your insurance card and valid ID</li>
              <li>You will receive a reminder 24 hours before your appointment</li>
            </ul>
          </div>
          
          <p>If you need to reschedule or cancel, please call us at (555) 123-4567.</p>
          
          <p>Thank you for choosing Elite Dental Care!</p>
        </div>
        
        <div style="background-color: #333333; padding: 20px; text-align: center; color: white;">
          <p>Elite Dental Care | 123 Dental Street, Medical Plaza, Suite 456, Healthville, HV 12345</p>
          <p>Phone: (555) 123-4567 | Email: info@elitedentalcare.com</p>
        </div>
      </div>
    `,
    text: `
      Appointment Confirmed!
      
      Dear ${appointment.patientName},
      
      Your appointment has been successfully scheduled:
      
      Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
      Time: ${appointment.appointmentTime}
      Doctor: Dr. Sarah Johnson
      Type: ${appointment.reasonForVisit}
      
      Please arrive 15 minutes early and bring your insurance card and valid ID.
      
      Elite Dental Care
      Phone: (555) 123-4567
    `
  };

  return sendEmail(emailParams);
}

export async function sendAppointmentReminder(appointment: Appointment): Promise<boolean> {
  const emailParams: EmailParams = {
    to: appointment.patientEmail,
    from: 'noreply@elitedentalcare.com',
    subject: 'Appointment Reminder - Elite Dental Care',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #333333; padding: 20px; text-align: center;">
          <h1 style="color: #B89B4E; margin: 0;">Elite Dental Care</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333333;">Appointment Reminder</h2>
          
          <p>Dear ${appointment.patientName},</p>
          
          <p>This is a friendly reminder about your upcoming appointment tomorrow:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333333; margin-top: 0;">Tomorrow's Appointment</h3>
            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Doctor:</strong> Dr. Sarah Johnson</p>
            <p><strong>Type:</strong> ${appointment.reasonForVisit}</p>
          </div>
          
          <p>Please arrive 15 minutes early and bring your insurance card and valid ID.</p>
          
          <p>If you need to reschedule or cancel, please call us at (555) 123-4567.</p>
          
          <p>We look forward to seeing you tomorrow!</p>
        </div>
        
        <div style="background-color: #333333; padding: 20px; text-align: center; color: white;">
          <p>Elite Dental Care | 123 Dental Street, Medical Plaza, Suite 456, Healthville, HV 12345</p>
        </div>
      </div>
    `,
    text: `
      Appointment Reminder
      
      Dear ${appointment.patientName},
      
      This is a reminder about your appointment tomorrow:
      
      Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
      Time: ${appointment.appointmentTime}
      Doctor: Dr. Sarah Johnson
      Type: ${appointment.reasonForVisit}
      
      Please arrive 15 minutes early and bring your insurance card and valid ID.
      
      Elite Dental Care
      Phone: (555) 123-4567
    `
  };

  return sendEmail(emailParams);
}