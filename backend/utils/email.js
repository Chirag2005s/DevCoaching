const nodemailer = require('nodemailer');

// Setup Ethereal or standard SMTP based on environment variables
let transporter;

const createTransporter = async () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Use real SMTP config if available
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } else {
        // Fallback to Ethereal email for development
        console.log("No SMTP configuration found. Using Ethereal Email for testing.");
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user, 
                pass: testAccount.pass 
            }
        });
    }
};

createTransporter().catch(console.error);

const sendLoginEmail = async (userEmail, userName) => {
    try {
        if (!transporter) {
            await createTransporter();
        }
        
        const loginTime = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
        
        let info = await transporter.sendMail({
            from: '"Dev Coaching" <no-reply@devcoaching.com>', 
            to: userEmail, 
            subject: "New Login Detected - Dev Coaching", 
            text: `Hello ${userName},\n\nA new login was detected on your Dev Coaching account at ${loginTime}.\n\nIf this was you, no further action is required. If you did not authorize this login, please contact support immediately.\n\nBest,\nDev Coaching Team`, 
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #0f172a;">Dev Coaching Security Alert</h2>
                    <p style="color: #334155; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
                    <p style="color: #334155; font-size: 16px;">We noticed a new login to your Dev Coaching account on:</p>
                    <p style="color: #14daff; font-weight: bold; font-size: 18px; background: #0f172a; padding: 10px; border-radius: 6px; text-align: center;">${loginTime}</p>
                    <p style="color: #334155; font-size: 16px;">If this was you, you can safely ignore this email.</p>
                    <p style="color: #334155; font-size: 16px;">If you did not log in, please reset your password immediately and contact our support team.</p>
                    <br/>
                    <p style="color: #64748b; font-size: 14px;">Best regards,<br/>Dev Coaching Team</p>
                </div>
            `
        });

        console.log("Login notification email sent: %s", info.messageId);
        
        if (info.messageId && info.messageId.includes('ethereal')) {
            console.log("Preview Ethereal URL: %s", nodemailer.getTestMessageUrl(info));
        }
        
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending login email:", error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendLoginEmail };
