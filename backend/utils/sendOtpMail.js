import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpMail = async (email, otp, purpose = "verification") => {
  try {
    console.log("📧 Sending OTP to:", email);

    await transporter.sendMail({
      from: `"SigmaGPT" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `SigmaGPT OTP for ${purpose}`,
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is <b>${otp}</b></p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("✅ OTP email sent successfully");
  } catch (err) {
    console.error("❌ OTP email failed:", err.message);
    throw new Error("Email service failed");
  }
};
