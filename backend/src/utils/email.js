const nodemailer = require("nodemailer");

/**
 * Buat transporter nodemailer.
 * Mendukung:
 *   - Gmail (EMAIL_SERVICE=gmail)
 *   - SMTP custom (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS)
 *
 * Untuk Gmail: aktifkan "App Password" di akun Google
 * (https://myaccount.google.com/apppasswords)
 */
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password, bukan password akun
      },
    });
  }

  // SMTP custom (Mailtrap, SendGrid, dsb.)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Kirim email reset password
 * @param {string} toEmail - Email tujuan
 * @param {string} resetLink - URL reset password lengkap
 * @param {string} userName - Nama user (opsional)
 */
const sendResetPasswordEmail = async (toEmail, resetLink, userName = "Pengguna") => {
  const transporter = createTransporter();
  const fromName = process.env.EMAIL_FROM_NAME || "LumiSkin";
  const fromEmail = process.env.EMAIL_USER;

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    subject: "Reset Password LumiSkin",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; }
          .header { background: #7C5CBF; padding: 32px 40px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 500; letter-spacing: -0.5px; }
          .body { padding: 32px 40px; }
          .body p { color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
          .body p strong { color: #111827; }
          .btn { display: inline-block; background: #7C5CBF; color: #fff !important; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 14px; font-weight: 500; margin: 8px 0 24px; }
          .link-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 16px; word-break: break-all; font-size: 12px; color: #6b7280; margin-bottom: 16px; }
          .footer { padding: 20px 40px; border-top: 1px solid #f3f4f6; text-align: center; }
          .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LumiSkin</h1>
          </div>
          <div class="body">
            <p>Halo, <strong>${userName}</strong> 👋</p>
            <p>Kami menerima permintaan untuk mereset password akun LumiSkin kamu. Klik tombol di bawah untuk membuat password baru:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="btn">Reset Password Sekarang</a>
            </div>
            <p>Atau copy link berikut ke browser kamu:</p>
            <div class="link-box">${resetLink}</div>
            <p>⏰ Link ini akan kadaluarsa dalam <strong>30 menit</strong>.</p>
            <p>Jika kamu tidak meminta reset password, abaikan email ini — password kamu tetap aman.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} LumiSkin · Coding Camp 2026 powered by DBS Foundation</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };
