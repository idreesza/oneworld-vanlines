import { logger } from "./logger";

const RECIPIENTS = ["Sales@oneworldvanlines.net", "j_zaatreh@yahoo.com"];

interface LeadEmailData {
  fullName: string;
  phone: string;
  email: string;
  moveFromZip?: string | null;
  moveToZip?: string | null;
  moveDate?: string | null;
  bedroomCount?: number | null;
  moveType?: string | null;
  additionalNotes?: string | null;
  source?: string | null;
  estimatedCubicFeet?: number | null;
  priceLow?: number | null;
  priceHigh?: number | null;
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  const smtpHost = process.env["SMTP_HOST"];
  const smtpUser = process.env["SMTP_USER"];
  const smtpPass = process.env["SMTP_PASS"];

  if (!smtpHost || !smtpUser || !smtpPass) {
    logger.info({ lead: { name: lead.fullName, phone: lead.phone, email: lead.email } }, "New lead — SMTP not configured, logging only");
    return;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.default.createTransport({
      host: smtpHost,
      port: parseInt(process.env["SMTP_PORT"] ?? "587"),
      secure: process.env["SMTP_SECURE"] === "true",
      auth: { user: smtpUser, pass: smtpPass },
    });

    const priceRange = lead.priceLow && lead.priceHigh
      ? `$${lead.priceLow.toLocaleString()} – $${lead.priceHigh.toLocaleString()}`
      : "Not calculated yet";

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
  <div style="background: #0f2044; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 22px;">🚛 New Lead — OneWorld Van Lines</h1>
    <p style="margin: 8px 0 0; color: #d4af7a; font-size: 14px;">Received via ${lead.source ?? "website"}</p>
  </div>
  <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #666; font-size: 14px; width: 160px;"><strong>Name</strong></td>
        <td style="padding: 10px 0; font-size: 14px;">${lead.fullName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Phone</strong></td>
        <td style="padding: 10px 0; font-size: 14px;"><a href="tel:${lead.phone}">${lead.phone}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Email</strong></td>
        <td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${lead.email}">${lead.email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Moving From</strong></td>
        <td style="padding: 10px 0; font-size: 14px;">${lead.moveFromZip ?? "N/A"}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Moving To</strong></td>
        <td style="padding: 10px 0; font-size: 14px;">${lead.moveToZip ?? "N/A"}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Move Date</strong></td>
        <td style="padding: 10px 0; font-size: 14px;">${lead.moveDate ?? "Flexible"}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Bedrooms</strong></td>
        <td style="padding: 10px 0; font-size: 14px;">${lead.bedroomCount === 0 ? "Studio" : (lead.bedroomCount ?? "N/A")}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Move Type</strong></td>
        <td style="padding: 10px 0; font-size: 14px; text-transform: capitalize;">${lead.moveType ?? "N/A"}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Est. Price Range</strong></td>
        <td style="padding: 10px 0; font-size: 14px; font-weight: bold; color: #0f2044;">${priceRange}</td>
      </tr>
      ${lead.estimatedCubicFeet ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Est. Cubic Feet</strong></td><td style="padding: 10px 0; font-size: 14px;">${lead.estimatedCubicFeet} cu ft</td></tr>` : ""}
      ${lead.additionalNotes ? `<tr><td style="padding: 10px 0; color: #666; font-size: 14px;"><strong>Notes</strong></td><td style="padding: 10px 0; font-size: 14px;">${lead.additionalNotes}</td></tr>` : ""}
    </table>
    <div style="margin-top: 20px; padding: 16px; background: #fff8e7; border-radius: 6px; border-left: 4px solid #d4af7a;">
      <p style="margin: 0; font-size: 14px; color: #555;">⚡ <strong>Respond within 1 hour</strong> — this lead expects contact during business hours (7am–8pm CST).</p>
    </div>
    <div style="margin-top: 16px; text-align: center;">
      <a href="https://oneworldvanlines.net/admin/leads" style="display: inline-block; background: #0f2044; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">View in Admin Portal →</a>
    </div>
  </div>
  <p style="text-align: center; color: #999; font-size: 12px; margin-top: 16px;">OneWorld Van Lines · Carrollton, TX 75006 · (660) 667-7770 · oneworldvanlines.net</p>
</body>
</html>`;

    await transport.sendMail({
      from: `"OneWorld Van Lines" <${smtpUser}>`,
      to: RECIPIENTS.join(", "),
      subject: `🚛 New Lead: ${lead.fullName} — ${lead.moveType ?? "Moving"} (${lead.moveFromZip ?? "?"} → ${lead.moveToZip ?? "?"})`,
      html,
    });

    logger.info({ to: RECIPIENTS, name: lead.fullName }, "Lead notification email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send lead notification email");
  }
}
