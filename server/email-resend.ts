import { Resend } from 'resend';
import type { Appointment } from '@shared/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    console.log('📧 Sending email with Resend...');
    console.log('From:', params.from);
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found. Please set up your Resend API key.');
      console.log('📋 For now, simulating email send...');
      
      // Fallback to simulation
      console.log('\n=== EMAIL CONTENT ===');
      console.log('HTML Content:', params.html?.substring(0, 200) + '...');
      console.log('Text Content:', params.text?.substring(0, 200) + '...');
      console.log('====================\n');
      
      console.log('✅ Email simulation complete!');
      return true;
    }
    
    const { data, error } = await resend.emails.send({
      from: params.from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return false;
    }

    console.log('✅ Email sent successfully with Resend!');
    console.log('📧 Email ID:', data?.id);
    console.log('📬 Delivered to:', params.to);
    
    return true;
  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    return false;
  }
}

export async function sendAppointmentConfirmation(appointment: Appointment): Promise<boolean> {
  // TODO: Replace with your verified domain after setup
  // Example: 'Elite Dental Care <noreply@yourdomain.com>'
  const fromAddress = process.env.VERIFIED_EMAIL_FROM || 'Anas Dental Clinic <onboarding@resend.dev>';
  
  const emailParams: EmailParams = {
    to: appointment.patientEmail,
    from: fromAddress,
    subject: 'Appointment Confirmation - Anas Dental Clinic',
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
          <p>Phone: +963 938 114 869 | Email: anas.dentalclinic97@gmail.com </p>
        </div>
      </div>
    `,
    text: `
      Appointment Confirmed!
      
      Dear ${appointment.patientName},
      
      Your appointment has been successfully scheduled:
      
      Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
      Time: ${appointment.appointmentTime}
      Doctor: Dr. Anas Alhamou
      Type: ${appointment.reasonForVisit}
      
      Please arrive 15 minutes early and bring your insurance card and valid ID.
      
      Anas Dental Clinic
      Phone: +963 938 114 869
    `
  };

  return sendEmail(emailParams);
}

export async function sendAppointmentReminder(appointment: Appointment): Promise<boolean> {
  // TODO: Replace with your verified domain after setup
  // Example: 'Anas Dental Clinic <noreply@yourdomain.com>'
  const fromAddress = process.env.VERIFIED_EMAIL_FROM || 'Anas Dental Clinic <onboarding@resend.dev>';
  
  const emailParams: EmailParams = {
    to: appointment.patientEmail,
    from: fromAddress,
    subject: 'Appointment Reminder - Anas Dental Clinic',
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
    text: `
      Appointment Reminder
      
      Dear ${appointment.patientName},
      
      This is a reminder about your appointment tomorrow:
      
      Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
      Time: ${appointment.appointmentTime}
      Doctor: Dr. Anas Alhamou
      Type: ${appointment.reasonForVisit}
      
      Please arrive 15 minutes early and bring your insurance card and valid ID.
      
      Anas Dental Clinic
      Phone: +963 938 114 869
    `
  };

  return sendEmail(emailParams);
}