import nodemailer from 'nodemailer';
import type { Appointment } from "@shared/schema";

// Free email service using Gmail SMTP
async function createTransporter() {
  const gmailUser = process.env.GMAIL_EMAIL;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  
  if (!gmailUser || !gmailPass) {
    console.log('⚠️  Gmail credentials not found in environment variables');
    console.log('📋 To enable real email sending, set:');
    console.log('   - GMAIL_EMAIL: Your Gmail address');
    console.log('   - GMAIL_APP_PASSWORD: Your Gmail app password');
    console.log('   (Generate app password at: https://myaccount.google.com/apppasswords)');
    return null;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Test the connection
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified');
    return transporter;
  } catch (error) {
    console.error('❌ Gmail SMTP connection failed:', error);
    return null;
  }
}

// If no Gmail credentials, simulate email sending
if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
  console.log('⚠️  No real email credentials found. Emails will only be simulated.');
  console.log('To send real emails, set up Gmail SMTP credentials.');
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
    
    // If no real email transporter available, simulate the email
    if (!emailTransporter) {
      console.log('\n=== EMAIL SIMULATION ===');
      console.log('From:', params.from);
      console.log('To:', params.to);
      console.log('Subject:', params.subject);
      console.log('\nHTML Content:');
      console.log(params.html?.substring(0, 500) + '...');
      console.log('\nText Content:');
      console.log(params.text?.substring(0, 300) + '...');
      console.log('========================\n');
      
      console.log('⚠️  EMAIL SIMULATION ONLY - No real email sent');
      console.log('💡 To send real emails, provide Gmail SMTP credentials');
      return true;
    }
    
    // Use Gmail if available, otherwise use provided from address
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
    
    console.log('✅ Real email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('📬 Delivered to actual inbox:', params.to);
    
    return true;
  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    return false;
  }
}

export async function sendAppointmentConfirmation(appointment: Appointment): Promise<boolean> {
  const emailParams: EmailParams = {
    to: appointment.patientEmail,
    from: 'anas.dentalclinic97@gmail.com',
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
    from: 'anas.dentalclinic97@gmail.com',
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

export async function sendAppointmentUpdate(appointment: Appointment, changeType: string): Promise<boolean> {
  let subject = '';
  let heading = '';
  let message = '';
  
  switch (changeType) {
    case 'rescheduled':
      subject = 'Appointment Rescheduled - Elite Dental Care';
      heading = 'Appointment Rescheduled';
      message = 'Your appointment has been rescheduled to a new date and time:';
      break;
    case 'confirmed':
      subject = 'Appointment Confirmed - Elite Dental Care';
      heading = 'Appointment Confirmed';
      message = 'Your appointment has been confirmed by our team:';
      break;
    case 'completed':
      subject = 'Appointment Completed - Elite Dental Care';
      heading = 'Thank You for Your Visit';
      message = 'Thank you for visiting Elite Dental Care. Your appointment has been completed:';
      break;
    default:
      subject = 'Appointment Updated - Elite Dental Care';
      heading = 'Appointment Updated';
      message = 'Your appointment has been updated:';
  }

  const emailParams: EmailParams = {
    to: appointment.patientEmail,
    from: 'anas.dentalclinic97@gmail.com',
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #333333; padding: 20px; text-align: center;">
          <h1 style="color: #B89B4E; margin: 0;">Elite Dental Care</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333333;">${heading}</h2>
          
          <p>Dear ${appointment.patientName},</p>
          
          <p>${message}</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333333; margin-top: 0;">Appointment Details</h3>
            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Doctor:</strong> Dr. Sarah Johnson</p>
            <p><strong>Type:</strong> ${appointment.reasonForVisit}</p>
            <p><strong>Status:</strong> ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</p>
          </div>
          
          ${appointment.notes ? `<div style="background-color: #B89B4E; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Additional Notes</h3>
            <p>${appointment.notes}</p>
          </div>` : ''}
          
          <p>If you have any questions or concerns, please call us at (555) 123-4567.</p>
          
          <p>Thank you for choosing Elite Dental Care!</p>
        </div>
        
        <div style="background-color: #333333; padding: 20px; text-align: center; color: white;">
          <p>Elite Dental Care | 123 Dental Street, Medical Plaza, Suite 456, Healthville, HV 12345</p>
          <p>Phone: (555) 123-4567 | Email: info@elitedentalcare.com</p>
        </div>
      </div>
    `,
    text: `
      ${heading}
      
      Dear ${appointment.patientName},
      
      ${message}
      
      Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
      Time: ${appointment.appointmentTime}
      Doctor: Dr. Sarah Johnson
      Type: ${appointment.reasonForVisit}
      Status: ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
      
      ${appointment.notes ? `Notes: ${appointment.notes}` : ''}
      
      If you have any questions, please call us at (555) 123-4567.
      
      Elite Dental Care
      Phone: (555) 123-4567
    `
  };

  return sendEmail(emailParams);
}

export async function sendAppointmentCancellation(appointment: Appointment): Promise<boolean> {
  const emailParams: EmailParams = {
    to: appointment.patientEmail,
    from: 'anas.dentalclinic97@gmail.com',
    subject: 'Appointment Cancelled - Elite Dental Care',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #333333; padding: 20px; text-align: center;">
          <h1 style="color: #B89B4E; margin: 0;">Elite Dental Care</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333333;">Appointment Cancelled</h2>
          
          <p>Dear ${appointment.patientName},</p>
          
          <p>Your appointment has been cancelled. Here are the details:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333333; margin-top: 0;">Cancelled Appointment</h3>
            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Doctor:</strong> Dr. Sarah Johnson</p>
            <p><strong>Type:</strong> ${appointment.reasonForVisit}</p>
          </div>
          
          <p>If you would like to reschedule, please call us at (555) 123-4567.</p>
          
          <p>Thank you for choosing Elite Dental Care!</p>
        </div>
        
        <div style="background-color: #333333; padding: 20px; text-align: center; color: white;">
          <p>Elite Dental Care | 123 Dental Street, Medical Plaza, Suite 456, Healthville, HV 12345</p>
          <p>Phone: (555) 123-4567 | Email: info@elitedentalcare.com</p>
        </div>
      </div>
    `,
    text: `
      Appointment Cancelled
      
      Dear ${appointment.patientName},
      
      Your appointment has been cancelled:
      
      Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
      Time: ${appointment.appointmentTime}
      Doctor: Dr. Sarah Johnson
      Type: ${appointment.reasonForVisit}
      
      If you would like to reschedule, please call us at (555) 123-4567.
      
      Elite Dental Care
      Phone: (555) 123-4567
    `
  };

  return sendEmail(emailParams);
}