const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─────────────────────────────────────────────
// 1. DONOR posts food → notify ALL NGOs
// ─────────────────────────────────────────────
const sendNewDonationToNGOs = async (ngoEmails, foodName, donorName, pickupAddress, quantity) => {
  try {
    await transporter.sendMail({
      from: `"FoodBridge" <${process.env.EMAIL_USER}>`,
      to: ngoEmails.join(','),
      subject: '🍱 New Food Donation Available!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0f2fe; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="color: white; margin: 0;">🍱 FoodBridge</h1>
          </div>
          <div style="padding: 24px 0;">
            <h2 style="color: #0f172a;">New Food Available!</h2>
            <p style="color: #475569; font-size: 1rem; line-height: 1.7;">
              <strong>${donorName}</strong> has just posted a new food donation. Claim it before it's gone!
            </p>
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; color: #0369a1;"><strong>🍴 Food:</strong> ${foodName}</p>
              <p style="margin: 0 0 8px 0; color: #0369a1;"><strong>📦 Quantity:</strong> ${quantity}</p>
              <p style="margin: 0; color: #0369a1;"><strong>📍 Pickup Address:</strong> ${pickupAddress}</p>
            </div>
            <p style="color: #475569;">Log in to FoodBridge to claim this donation now!</p>
          </div>
          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e0f2fe;">
            <p style="color: #94a3b8; font-size: 0.85rem;">© 2026 FoodBridge — Reducing Food Waste, Fighting Hunger</p>
          </div>
        </div>
      `,
    });
    console.log('New donation email sent to all NGOs');
  } catch (error) {
    console.error('Error sending new donation email to NGOs:', error);
  }
};

// ─────────────────────────────────────────────
// 2. NGO claims food → notify DONOR
// ─────────────────────────────────────────────
const sendClaimedEmail = async (donorEmail, donorName, foodName, ngoName) => {
  try {
    await transporter.sendMail({
      from: `"FoodBridge" <${process.env.EMAIL_USER}>`,
      to: donorEmail,
      subject: '🎉 Your Food Donation Has Been Claimed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0f2fe; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="color: white; margin: 0;">🍱 FoodBridge</h1>
          </div>
          <div style="padding: 24px 0;">
            <h2 style="color: #0f172a;">Hi ${donorName}!</h2>
            <p style="color: #475569; font-size: 1rem; line-height: 1.7;">
              Great news! Your food donation <strong>"${foodName}"</strong> has been claimed by <strong>${ngoName}</strong>.
            </p>
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #0369a1; font-weight: 600;">Your donation is making a difference! 🌟</p>
            </div>
            <p style="color: #475569;">Thank you for helping fight food waste and hunger.</p>
          </div>
          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e0f2fe;">
            <p style="color: #94a3b8; font-size: 0.85rem;">© 2026 FoodBridge — Reducing Food Waste, Fighting Hunger</p>
          </div>
        </div>
      `,
    });
    console.log('Claimed email sent to donor:', donorEmail);
  } catch (error) {
    console.error('Error sending claimed email:', error);
  }
};

// ─────────────────────────────────────────────
// 3. NGO claims food → notify ALL Volunteers
// ─────────────────────────────────────────────
const sendPickupRequestToVolunteers = async (volunteerEmails, foodName, ngoName, pickupAddress) => {
  try {
    await transporter.sendMail({
      from: `"FoodBridge" <${process.env.EMAIL_USER}>`,
      to: volunteerEmails.join(','),
      subject: '🙋 Volunteer Needed for Food Pickup!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0f2fe; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="color: white; margin: 0;">🍱 FoodBridge</h1>
          </div>
          <div style="padding: 24px 0;">
            <h2 style="color: #0f172a;">Pickup Needed!</h2>
            <p style="color: #475569; font-size: 1rem; line-height: 1.7;">
              <strong>${ngoName}</strong> has claimed a food donation and needs a volunteer to pick it up!
            </p>
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; color: #0369a1;"><strong>🍴 Food:</strong> ${foodName}</p>
              <p style="margin: 0 0 8px 0; color: #0369a1;"><strong>🏢 Deliver to:</strong> ${ngoName}</p>
              <p style="margin: 0; color: #0369a1;"><strong>📍 Pickup From:</strong> ${pickupAddress}</p>
            </div>
            <p style="color: #475569;">Log in to FoodBridge to accept this pickup!</p>
          </div>
          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e0f2fe;">
            <p style="color: #94a3b8; font-size: 0.85rem;">© 2026 FoodBridge — Reducing Food Waste, Fighting Hunger</p>
          </div>
        </div>
      `,
    });
    console.log('Pickup request email sent to all volunteers');
  } catch (error) {
    console.error('Error sending pickup request email to volunteers:', error);
  }
};

// ─────────────────────────────────────────────
// 4. Volunteer picks up → notify NGO
// ─────────────────────────────────────────────
const sendPickupEmail = async (ngoEmail, ngoName, foodName, volunteerName) => {
  try {
    await transporter.sendMail({
      from: `"FoodBridge" <${process.env.EMAIL_USER}>`,
      to: ngoEmail,
      subject: '🚗 Food Pickup In Progress!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0f2fe; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="color: white; margin: 0;">🍱 FoodBridge</h1>
          </div>
          <div style="padding: 24px 0;">
            <h2 style="color: #0f172a;">Hi ${ngoName}!</h2>
            <p style="color: #475569; font-size: 1rem; line-height: 1.7;">
              <strong>${volunteerName}</strong> is on the way to pick up <strong>"${foodName}"</strong> and will deliver it to you soon!
            </p>
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #0369a1; font-weight: 600;">Please be ready to receive the delivery 🚗</p>
            </div>
          </div>
          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e0f2fe;">
            <p style="color: #94a3b8; font-size: 0.85rem;">© 2026 FoodBridge — Reducing Food Waste, Fighting Hunger</p>
          </div>
        </div>
      `,
    });
    console.log('Pickup email sent to NGO:', ngoEmail);
  } catch (error) {
    console.error('Error sending pickup email:', error);
  }
};

// ─────────────────────────────────────────────
// 5. Volunteer delivers → notify DONOR
// ─────────────────────────────────────────────
const sendDeliveredEmail = async (donorEmail, donorName, foodName, ngoName) => {
  try {
    await transporter.sendMail({
      from: `"FoodBridge" <${process.env.EMAIL_USER}>`,
      to: donorEmail,
      subject: '✅ Your Food Has Been Delivered!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0f2fe; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="color: white; margin: 0;">🍱 FoodBridge</h1>
          </div>
          <div style="padding: 24px 0;">
            <h2 style="color: #0f172a;">Hi ${donorName}!</h2>
            <p style="color: #475569; font-size: 1rem; line-height: 1.7;">
              Your food donation <strong>"${foodName}"</strong> has been successfully delivered to <strong>${ngoName}</strong>.
            </p>
            <div style="background: #f0f9ff; border-left: 4px solid #22c55e; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #16a34a; font-weight: 600;">Mission accomplished! You helped feed someone today 🎉</p>
            </div>
            <p style="color: #475569;">Keep donating and making a difference!</p>
          </div>
          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e0f2fe;">
            <p style="color: #94a3b8; font-size: 0.85rem;">© 2026 FoodBridge — Reducing Food Waste, Fighting Hunger</p>
          </div>
        </div>
      `,
    });
    console.log('Delivered email sent to donor:', donorEmail);
  } catch (error) {
    console.error('Error sending delivered email:', error);
  }
};

module.exports = {
  sendNewDonationToNGOs,
  sendClaimedEmail,
  sendPickupRequestToVolunteers,
  sendPickupEmail,
  sendDeliveredEmail
};