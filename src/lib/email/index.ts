/**
 * Email helper — uses nodemailer via SMTP env vars.
 * In dev or when SMTP is not configured, falls back to console-logging the message.
 *
 * To enable real sends: `npm install nodemailer @types/nodemailer` then update package.json.
 */
import nodemailer from 'nodemailer';
import { logger } from '@/lib/utils';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  return transporter;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const t = getTransporter();
  const from = process.env.EMAIL_FROM ?? 'GauBharath <no-reply@gaubharath.org>';

  if (!t) {
    logger.warn('SMTP not configured; logging email instead', { to: input.to, subject: input.subject });
    logger.info(input.html);
    return false;
  }

  try {
    await t.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    logger.info('Email sent to', input.to);
    return true;
  } catch (err) {
    logger.error('Email send error:', err);
    return false;
  }
}

/** Pretty HTML template for order notification emails. */
export function orderNotificationEmail(order: {
  id: string;
  total: number;
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string };
  items: { titleEn: string; quantity: number; price: number }[];
}): { subject: string; html: string; text: string } {
  const rows = order.items
    .map((i) => `<tr><td>${i.titleEn}</td><td>${i.quantity}</td><td>₹${i.price * i.quantity}</td></tr>`)
    .join('');

  const html = `
    <h2>New GauBharath Order</h2>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Customer:</strong> ${order.customer.name} &middot; ${order.customer.email} &middot; ${order.customer.phone}</p>
    <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.pincode}</p>
    <table border="1" cellpadding="6" style="border-collapse:collapse;margin-top:1em">
      <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin-top:1em"><strong>Grand Total:</strong> ₹${order.total}</p>
  `;
  const text = `New GauBharath Order ${order.id}\n${order.customer.name}\nTotal ₹${order.total}`;
  return { subject: `[GauBharath] New order ${order.id}`, html, text };
}
