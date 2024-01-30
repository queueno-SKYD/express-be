export const VerificationMail = (userName: string, verificationCode: number) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Code Verification</h2>
      <p>Hello ${userName},</p>
      <p>Your verification code is: <strong>${verificationCode}</strong></p>
      
      <p style="color: #888;">This code will expire in 10 minutes. Please do not share it with anyone.</p>
  
      <p>If you didn't request this verification, please ignore this email.</p>
  
      <p>Best regards,<br>SKyd Team</p>
    </div>
  
  </body>
  </html>
  `;
};

export const RegisterSuccussMail = (appName: string, userName: string) => {
  return `
  <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Successful</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="color: #4CAF50;">Registration Successful</h2>
    <p>Hello ${userName},</p>
    <p>Congratulations! Your registration with ${appName} was successful.</p>
    
    <p style="color: #888;">Thank you for joining our community. You can now [provide details about next steps, login, etc.].</p>

    <p>If you have any questions or need assistance, feel free to contact our support team.</p>

    <p>Best regards,<br>Skyd Team</p>
  </div>

</body>
</html>
  `;
};

