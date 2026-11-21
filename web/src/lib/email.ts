import "server-only";

import nodemailer from "nodemailer";

// Sans SMTP_URL (développement), les e-mails sont affichés dans la console
// au lieu d'être envoyés.
const transport = process.env.SMTP_URL
  ? nodemailer.createTransport(process.env.SMTP_URL)
  : nodemailer.createTransport({ jsonTransport: true });

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM ?? "Les Gardiens de la Légende <no-reply@localhost>",
    to,
    subject,
    text,
  });
  if (!process.env.SMTP_URL) {
    console.info(`[e-mail non envoyé, SMTP_URL absent] À : ${to}\n${subject}\n\n${text}`);
  }
  return info;
}
