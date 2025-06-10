import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { IUserRepository } from '../../infrastructure/repositories/UserRepository';

const OAuth2 = google.auth.OAuth2;

export class EmailService {
  private transporter!: nodemailer.Transporter;
  private userRepository: IUserRepository;
  private oauth2Client: any;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  async initialize(): Promise<void> {
    try {
      const accessTokenResponse = await this.oauth2Client.getAccessToken();
      const accessToken = accessTokenResponse.token;

      if (!accessToken) {
        throw new Error('Failed to obtain access token for Nodemailer.');
      }

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      console.log('Nodemailer transporter initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize Nodemailer transporter:', error);
      throw new Error('Failed to initialize email service.');
    }
  }

  getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email service not initialized.');
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      text: `Please verify your email by clicking on the following link: ${process.env.NEXTAUTH_URL}/verify-email?token=${token}`,
      html: `<p>Please verify your email by clicking on the following link: <a href="${process.env.NEXTAUTH_URL}/verify-email?token=${token}">Verify Email</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email service not initialized.');
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please use the following link to reset your password: ${process.env.NEXTAUTH_URL}/reset-password?token=${token}`,
      html: `<p>You requested a password reset. Please use the following link to reset your password: <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${token}">Reset Password</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Stub: Verifica email (a ser implementado)
  async verifyEmail(token: string): Promise<void> {
    // TODO: Implementar lógica real
    return;
  }

  // Stub: Reenvia email de verificação (a ser implementado)
  async resendVerificationEmail(email: string): Promise<void> {
    // TODO: Implementar lógica real
    return;
  }

  // Stub: Envia email genérico (a ser implementado)
  async send(params: { to: string[]; subject: string; body: string; template?: string; data?: any }): Promise<void> {
    // TODO: Implementar lógica real
    return;
  }

  // Stub: Lista templates de email (a ser implementado)
  async listTemplates(): Promise<any[]> {
    // TODO: Implementar lógica real
    return [];
  }

  // Stub: Reset de senha (a ser implementado)
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: Implementar lógica real
    return;
  }
} 