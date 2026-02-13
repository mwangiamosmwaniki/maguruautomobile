const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

// Twilio configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// Cloud Function triggered when a new inquiry is created
exports.sendInquiryNotifications = functions.firestore
  .document("inquiries/{inquiryId}")
  .onCreate(async (snap, context) => {
    try {
      const inquiry = snap.data();
      const inquiryId = context.params.inquiryId;

      // Get admin email and phone from inquiry or Firestore settings
      const adminEmail = inquiry.adminEmail || 
        (await admin
          .firestore()
          .collection("settings")
          .doc("admin")
          .get()
          .then(doc => doc.data()?.email)) ||
        process.env.ADMIN_EMAIL;
      
      const adminDoc = await admin
        .firestore()
        .collection("settings")
        .doc("admin")
        .get();
      const adminData = adminDoc.data() || {};
      const adminPhone = adminData.whatsappPhone || process.env.ADMIN_PHONE;

      // Send Email to Admin
      const emailContent = `
        <h2>New Car Inquiry</h2>
        <p><strong>Inquiry ID:</strong> ${inquiryId}</p>
        <p><strong>Customer Name:</strong> ${inquiry.name}</p>
        <p><strong>Customer Email:</strong> ${inquiry.email}</p>
        <p><strong>Customer Phone:</strong> ${inquiry.phone}</p>
        <p><strong>Car:</strong> ${inquiry.carTitle}</p>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message}</p>
        <hr>
        <p><small>Received on: ${new Date(inquiry.createdAt?.toDate()).toLocaleString()}</small></p>
      `;

      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: adminEmail,
        subject: `New Inquiry: ${inquiry.carTitle} from ${inquiry.name}`,
        html: emailContent,
      });

      console.log(`Email sent to ${adminEmail}`);

      // Send WhatsApp Message to Admin
      if (adminPhone && process.env.TWILIO_PHONE_NUMBER) {
        const whatsappMessage = `
*New Inquiry Received*

*Customer:* ${inquiry.name}
*Email:* ${inquiry.email}
*Phone:* ${inquiry.phone}
*Car:* ${inquiry.carTitle}

*Message:*
${inquiry.message}

---
Reply to this inquiry or check your email for more details.
        `.trim();

        await twilioClient.messages.create({
          from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
          to: `whatsapp:${adminPhone}`,
          body: whatsappMessage,
        });

        console.log(`WhatsApp sent to ${adminPhone}`);
      }

      // Also send confirmation email to customer
      const customerEmailContent = `
        <h2>Thank You for Your Inquiry</h2>
        <p>Dear ${inquiry.name},</p>
        <p>Thank you for your interest in the <strong>${inquiry.carTitle}</strong>.</p>
        <p>We have received your inquiry and will get back to you shortly.</p>
        <p><strong>Your Inquiry Details:</strong></p>
        <ul>
          <li>Car: ${inquiry.carTitle}</li>
          <li>Your Message: ${inquiry.message}</li>
        </ul>
        <p>Best regards,<br>Maguru Auto Team</p>
      `;

      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: inquiry.email,
        subject: "We Received Your Inquiry - Maguru Auto",
        html: customerEmailContent,
      });

      console.log(`Confirmation email sent to ${inquiry.email}`);

      // Update inquiry document with notification status
      await admin
        .firestore()
        .collection("inquiries")
        .doc(inquiryId)
        .update({
          notificationsSent: true,
          emailSentAt: admin.firestore.Timestamp.now(),
          whatsappSentAt: adminPhone ? admin.firestore.Timestamp.now() : null,
        });

      return {
        success: true,
        message: "Notifications sent successfully",
      };
    } catch (error) {
      console.error("Error sending notifications:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to send notifications",
      );
    }
  });

// Optional: HTTP endpoint to manually trigger inquiry notifications (for testing)
exports.manuallyTriggerNotification = functions.https.onCall(
  async (data, context) => {
    try {
      const { inquiryId } = data;

      if (!inquiryId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "inquiryId is required",
        );
      }

      const inquiry = await admin
        .firestore()
        .collection("inquiries")
        .doc(inquiryId)
        .get();

      if (!inquiry.exists) {
        throw new functions.https.HttpsError("not-found", "Inquiry not found");
      }

      // Manually trigger the same notification logic
      const inquiryData = inquiry.data();

      const adminDoc = await admin
        .firestore()
        .collection("settings")
        .doc("admin")
        .get();
      const adminData = adminDoc.data() || {};
      const adminEmail = adminData.email || process.env.ADMIN_EMAIL;
      const adminPhone = adminData.whatsappPhone || process.env.ADMIN_PHONE;

      // Send Email
      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: adminEmail,
        subject: `New Inquiry: ${inquiryData.carTitle} from ${inquiryData.name}`,
        html: `
          <h2>New Car Inquiry</h2>
          <p><strong>Customer Name:</strong> ${inquiryData.name}</p>
          <p><strong>Customer Email:</strong> ${inquiryData.email}</p>
          <p><strong>Customer Phone:</strong> ${inquiryData.phone}</p>
          <p><strong>Car:</strong> ${inquiryData.carTitle}</p>
          <p><strong>Message:</strong> ${inquiryData.message}</p>
        `,
      });

      // Send WhatsApp
      if (adminPhone && process.env.TWILIO_PHONE_NUMBER) {
        await twilioClient.messages.create({
          from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
          to: `whatsapp:${adminPhone}`,
          body: `New Inquiry from ${inquiryData.name} for ${inquiryData.carTitle}\n\nMessage: ${inquiryData.message}`,
        });
      }

      return { success: true, message: "Notifications re-sent" };
    } catch (error) {
      console.error("Error:", error);
      throw new functions.https.HttpsError("internal", error.message);
    }
  },
);
