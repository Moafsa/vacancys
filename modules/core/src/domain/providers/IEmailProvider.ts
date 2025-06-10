/**
 * Interface for email service providers
 */
export interface IEmailProvider {
  /**
   * Sends an email
   * @param to Recipient email address
   * @param subject Email subject
   * @param body Email body content
   */
  sendEmail(to: string, subject: string, body: string): Promise<void>;
} 