exports.registerVerificationEmailTemplate = (userName, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  return `
<!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { 
          display: inline-block; 
          padding: 12px 30px; 
          background: #4CAF50; 
          color: white; 
          text-decoration: none; 
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to E-commerce App!</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName},</h2>
          <p>Thank you for registering with E-commerce App. Please verify your email address to activate your account.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2026 E-commerce App. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
};
