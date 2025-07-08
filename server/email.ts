import { MailService } from '@sendgrid/mail';
import type { Appointment } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    console.log('Sending email with SendGrid...');
    console.log('From:', params.from);
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    
    const response = await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    
    console.log('Email sent successfully!');
    console.log('Status code:', response[0]?.statusCode);
    console.log('Headers:', response[0]?.headers);
    console.log('✓ Confirmation email delivered to:', params.to);
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    
    if (error.response) {
      console.error('Error response:', error.response.body);
      
      // Check for specific error types
      if (error.response.body?.errors) {
        const errors = error.response.body.errors;
        for (const err of errors) {
          if (err.message?.includes('Maximum credits exceeded')) {
            console.error('❌ SendGrid Free Tier Limit Exceeded!');
            console.error('Your SendGrid account has reached its daily/monthly email limit.');
            console.error('Solutions:');
            console.error('1. Wait for the limit to reset (daily limit resets at midnight UTC)');
            console.error('2. Upgrade your SendGrid plan for more credits');
            console.error('3. Check SendGrid dashboard for current usage');
          } else if (err.message?.includes('Unauthorized')) {
            console.error('❌ SendGrid API Key Invalid!');
            console.error('Please check your SENDGRID_API_KEY environment variable');
          }
        }
      }
    }
    
    return false;
  }
}

export async function sendAppointmentConfirmation(appointment: Appointment): Promise<boolean> {
  const emailParams: EmailParams = {
    to: appointment.patientEmail,
    from: 'shassmaa@gmail.com', // Using your verified email
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
    from: 'shassmaa@gmail.com', // Using your verified email
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