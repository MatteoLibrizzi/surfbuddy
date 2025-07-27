import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Environment configuration
const isDev = process.env.NODE_ENV !== 'production';

// AWS SES Configuration
const sesClient = new SESClient({
  region: 'eu-west-1',
  credentials: {
    accessKeyId: isDev 
      ? process.env.DEV_ACCESS_KEY! 
      : process.env.PROD_ACCESS_KEY!,
    secretAccessKey: isDev 
      ? process.env.DEV_SECRET_ACCESS_KEY! 
      : process.env.PROD_SECRET_ACCESS_KEY!,
  },
});

// Notification configuration
const NOTIFICATION_CONFIG = {
  senderEmail: process.env.SES_SENDER_EMAIL || 'librizzimatteo.ml@gmail.com',
  recipientEmail: process.env.NOTIFICATION_EMAIL || 'librizzimatteo.ml@gmail.com',
  enabled: !isDev, // Only send notifications in production
};

export interface TripNotificationData {
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
  creatorName: string;
  creatorEmail: string;
  creatorPhone: string;
  surfLevel: string;
  maxParticipants: number;
  description: string;
  whatsappGroupLink?: string;
}

export class NotificationService {
  
  static async sendTripCreatedNotification(tripData: TripNotificationData): Promise<void> {
    // Skip notifications in development
    if (!NOTIFICATION_CONFIG.enabled) {
      console.log('Notification skipped (development environment)');
      return;
    }

    try {
      const emailParams = {
        Source: NOTIFICATION_CONFIG.senderEmail,
        Destination: {
          ToAddresses: [NOTIFICATION_CONFIG.recipientEmail],
        },
        Message: {
          Subject: {
            Data: `🏄‍♂️ New Trip Created: ${tripData.destination}`,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: this.generateEmailTemplate(tripData),
              Charset: 'UTF-8',
            },
            Text: {
              Data: this.generateTextTemplate(tripData),
              Charset: 'UTF-8',
            },
          },
        },
      };

      await sesClient.send(new SendEmailCommand(emailParams));
      console.log(`Trip notification sent successfully for trip: ${tripData.tripId}`);
      
    } catch (error) {
      console.error('Failed to send trip notification:', error);
      // Don't throw error - notification failure shouldn't break trip creation
    }
  }

  private static generateEmailTemplate(trip: TripNotificationData): string {
    const tripUrl = `https://tripdropin.com/trips/${trip.tripId}`;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Trip Created - TripDropIn</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
            .trip-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .detail-row { margin: 8px 0; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #6b7280; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏄‍♂️ New Trip Created!</h1>
              <p>Someone just created a new surf trip on TripDropIn</p>
            </div>
            
            <div class="content">
              <div class="trip-details">
                <h2>${trip.destination}</h2>
                
                <div class="detail-row">
                  <span class="label">📅 Dates:</span>
                  <span class="value">${trip.startDate} - ${trip.endDate}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">👤 Creator:</span>
                  <span class="value">${trip.creatorName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">📧 Email:</span>
                  <span class="value">${trip.creatorEmail}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">📱 Phone:</span>
                  <span class="value">${trip.creatorPhone}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">🏄‍♂️ Surf Level:</span>
                  <span class="value">${trip.surfLevel}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">👥 Max Participants:</span>
                  <span class="value">${trip.maxParticipants}</span>
                </div>
                
                ${trip.description ? `
                <div class="detail-row">
                  <span class="label">📝 Description:</span>
                  <div class="value" style="margin-top: 5px;">${trip.description}</div>
                </div>
                ` : ''}
                
                ${trip.whatsappGroupLink ? `
                <div class="detail-row">
                  <span class="label">💬 WhatsApp Group:</span>
                  <span class="value"><a href="${trip.whatsappGroupLink}">Join Group</a></span>
                </div>
                ` : ''}
              </div>
              
              <a href="${tripUrl}" class="button">View Trip Details</a>
              
              <div class="footer">
                <p>This notification was sent because a new trip was created on TripDropIn</p>
                <p>Trip ID: ${trip.tripId}</p>
                <p>Created at: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static generateTextTemplate(trip: TripNotificationData): string {
    return `
🏄‍♂️ NEW TRIP CREATED - TripDropIn

Destination: ${trip.destination}
Dates: ${trip.startDate} - ${trip.endDate}

Creator Details:
- Name: ${trip.creatorName}
- Email: ${trip.creatorEmail}
- Phone: ${trip.creatorPhone}

Trip Details:
- Surf Level: ${trip.surfLevel}
- Max Participants: ${trip.maxParticipants}
${trip.description ? `- Description: ${trip.description}` : ''}
${trip.whatsappGroupLink ? `- WhatsApp Group: ${trip.whatsappGroupLink}` : ''}

View Trip: https://tripdropin.com/trips/${trip.tripId}

Trip ID: ${trip.tripId}
Created: ${new Date().toLocaleString()}

---
This notification was sent because a new trip was created on TripDropIn.
    `.trim();
  }
}
