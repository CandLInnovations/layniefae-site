import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
export const emailConfig = {
  from: 'Laynie Fae <onboarding@resend.dev>', // Using Resend's default for testing
  replyTo: 'support@layniefae.com',
};