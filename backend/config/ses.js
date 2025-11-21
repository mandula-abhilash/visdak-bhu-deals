import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const ses = new AWS.SES({
  region: process.env.AWS_SES_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
});

export const sendEmail = async ({ to, subject, htmlBody, textBody }) => {
  const params = {
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
        Text: {
          Data: textBody || htmlBody.replace(/<[^>]*>/g, ''),
          Charset: 'UTF-8',
        },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent successfully:', result.MessageId);
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error('SES email error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E7D32, #558B2F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; padding: 12px 30px; background: #2E7D32; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #757575; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You recently requested to reset your password for your Land Listings account. Click the button below to reset it:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2E7D32;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>Best regards,<br>Land Listings Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Land Listings. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textBody = `
    Password Reset Request

    Hello,

    You recently requested to reset your password for your Land Listings account.

    Please click the following link to reset your password:
    ${resetUrl}

    This link will expire in 1 hour.

    If you didn't request a password reset, please ignore this email.

    Best regards,
    Land Listings Team
  `;

  return await sendEmail({
    to: email,
    subject: 'Password Reset - Land Listings',
    htmlBody,
    textBody,
  });
};

export const sendWelcomeEmail = async (email, userName) => {
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E7D32, #558B2F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; padding: 12px 30px; background: #2E7D32; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #757575; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Land Listings!</h1>
        </div>
        <div class="content">
          <p>Hello${userName ? ' ' + userName : ''},</p>
          <p>Thank you for registering with Land Listings. We're excited to help you find the perfect land!</p>
          <p>With your account, you can:</p>
          <ul>
            <li>Browse thousands of land listings</li>
            <li>Use advanced search and measurement tools</li>
            <li>Save your favorite properties</li>
            <li>Access detailed property information</li>
          </ul>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}" class="button">Start Exploring</a>
          </p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>Land Listings Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Land Listings. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textBody = `
    Welcome to Land Listings!

    Hello${userName ? ' ' + userName : ''},

    Thank you for registering with Land Listings. We're excited to help you find the perfect land!

    With your account, you can:
    - Browse thousands of land listings
    - Use advanced search and measurement tools
    - Save your favorite properties
    - Access detailed property information

    Visit us at: ${process.env.FRONTEND_URL}

    If you have any questions, feel free to reach out to our support team.

    Best regards,
    Land Listings Team
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to Land Listings',
    htmlBody,
    textBody,
  });
};

export const sendPaymentConfirmationEmail = async (email, paymentDetails) => {
  const { type, amount, landTitle, transactionId } = paymentDetails;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2E7D32, #558B2F); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .details { background: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .details p { margin: 10px 0; }
        .footer { text-align: center; margin-top: 20px; color: #757575; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Confirmation</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for your payment! Your transaction has been successfully processed.</p>
          <div class="details">
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Type:</strong> ${type === 'subscription' ? 'Subscription' : 'Site Access Purchase'}</p>
            <p><strong>Amount:</strong> ₹${amount}</p>
            ${landTitle ? `<p><strong>Property:</strong> ${landTitle}</p>` : ''}
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>You now have full access to ${type === 'subscription' ? 'all properties on our platform' : 'the selected property details'}.</p>
          <p>Best regards,<br>Land Listings Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Land Listings. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textBody = `
    Payment Confirmation

    Hello,

    Thank you for your payment! Your transaction has been successfully processed.

    Transaction ID: ${transactionId}
    Type: ${type === 'subscription' ? 'Subscription' : 'Site Access Purchase'}
    Amount: ₹${amount}
    ${landTitle ? `Property: ${landTitle}` : ''}
    Date: ${new Date().toLocaleString()}

    You now have full access to ${type === 'subscription' ? 'all properties on our platform' : 'the selected property details'}.

    Best regards,
    Land Listings Team
  `;

  return await sendEmail({
    to: email,
    subject: 'Payment Confirmation - Land Listings',
    htmlBody,
    textBody,
  });
};

export default ses;
