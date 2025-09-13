import { resend, emailConfig } from './resend';
import { emailTemplates, OrderConfirmationData, WelcomeEmailData } from './email-templates';

export class EmailService {
  static async sendOrderConfirmation(customerEmail: string, data: OrderConfirmationData): Promise<{ success: boolean; error?: string }> {
    try {
      const template = emailTemplates.orderConfirmation(data);
      
      const result = await resend.emails.send({
        from: emailConfig.from,
        to: [customerEmail],
        subject: template.subject,
        html: template.html,
        text: template.text,
        replyTo: emailConfig.replyTo,
        headers: {
          'X-Entity-Ref-ID': data.orderId,
        },
      });

      if (result.error) {
        console.error('Failed to send order confirmation email:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log('Order confirmation email sent successfully:', result.data?.id);
      return { success: true };
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async sendWelcomeEmail(customerEmail: string, data: WelcomeEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const template = emailTemplates.welcomeEmail(data);
      
      const result = await resend.emails.send({
        from: emailConfig.from,
        to: [customerEmail],
        subject: template.subject,
        html: template.html,
        text: template.text,
        replyTo: emailConfig.replyTo,
        headers: {
          'X-Entity-Ref-ID': `welcome-${data.email}`,
        },
      });

      if (result.error) {
        console.error('Failed to send welcome email:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log('Welcome email sent successfully:', result.data?.id);
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async sendEmailVerification(customerEmail: string, verificationToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
      
      const result = await resend.emails.send({
        from: emailConfig.from,
        to: [customerEmail],
        subject: '🌸 Verify Your Laynie Fae Account',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2d1b69; background: linear-gradient(135deg, #0f0c29 0%, #24243e 50%, #2d1b69 100%); margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.95); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 2.5em; color: #8b5cf6; margin-bottom: 10px; }
    .title { font-size: 2em; color: #2d1b69; margin-bottom: 15px; font-weight: 300; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 0.9em; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌸🔮✨</div>
      <h1 class="title">Verify Your Sacred Account</h1>
    </div>
    
    <p>Welcome to the Laynie Fae mystical community! Please verify your email address to complete your account setup and begin your magical journey.</p>
    
    <div style="text-align: center;">
      <a href="${verificationUrl}" class="cta-button">Verify Email Address</a>
    </div>
    
    <p style="color: #6b7280; font-size: 0.9em;">If the button above doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #8b5cf6;">${verificationUrl}</p>
    
    <div class="footer">
      <p>This verification link will expire in 24 hours.</p>
      <p>With love and light ✨<br><strong>Laynie Fae</strong></p>
    </div>
  </div>
</body>
</html>`,
        text: `
Verify Your Laynie Fae Account 🌸

Welcome to the Laynie Fae mystical community! Please verify your email address to complete your account setup and begin your magical journey.

Click here to verify: ${verificationUrl}

This verification link will expire in 24 hours.

With love and light ✨
Laynie Fae
        `,
        replyTo: emailConfig.replyTo,
        headers: {
          'X-Entity-Ref-ID': `verification-${customerEmail}`,
        },
      });

      if (result.error) {
        console.error('Failed to send verification email:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log('Verification email sent successfully:', result.data?.id);
      return { success: true };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}