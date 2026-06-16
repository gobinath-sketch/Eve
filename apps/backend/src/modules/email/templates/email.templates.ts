const baseStyles = `
  body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; }
  .container { max-width: 600px; margin: 0 auto; background: #111111; border: 1px solid #333; }
  .header { background: #000; padding: 24px; text-align: center; border-bottom: 1px solid #333; }
  .header h1 { margin: 0; font-size: 22px; letter-spacing: 1px; }
  .content { padding: 32px 24px; line-height: 1.6; }
  .label { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .value { font-size: 16px; margin-bottom: 16px; }
  .highlight { background: #1a1a1a; border: 1px solid #333; padding: 16px; margin: 16px 0; }
  .footer { padding: 16px 24px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #333; }
  .btn { display: inline-block; background: #fff; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; margin-top: 16px; }
`;

export function confirmationTemplate(data: {
  fullName: string;
  registrationId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  amount: number;
  paymentId?: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>Code with Zen</h1></div>
    <div class="content">
      <p>Dear ${data.fullName},</p>
      <p>Your registration for <strong>${data.eventName}</strong> is confirmed and payment has been received.</p>
      <div class="highlight">
        <div class="label">Registration ID</div>
        <div class="value"><strong>${data.registrationId}</strong></div>
        ${data.paymentId ? `<div class="label">Payment ID</div><div class="value">${data.paymentId}</div>` : ''}
        <div class="label">Amount Paid</div>
        <div class="value">₹${(data.amount / 100).toFixed(0)}</div>
        <div class="label">Event Date</div>
        <div class="value">${data.eventDate}</div>
        <div class="label">Venue</div>
        <div class="value">${data.venue}</div>
      </div>
      <p>Your event pass is attached below. Please bring it (digital or printed) on event day.</p>
      <p>See you at the summit!</p>
      <p>— Team Code with Zen</p>
    </div>
    <div class="footer">Code with Zen AI Summit &bull; learnwithzenovate@gmail.com</div>
  </div>
</body>
</html>`;
}

export function passTemplate(data: {
  fullName: string;
  registrationId: string;
  passCode: string;
  eventName: string;
  eventDate: string;
  venue: string;
  qrDataUrl: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>Event Pass</h1></div>
    <div class="content">
      <p>Dear ${data.fullName},</p>
      <p>Here is your event pass for <strong>${data.eventName}</strong>.</p>
      <div class="highlight" style="text-align:center;">
        <div class="label">Registration ID</div>
        <div class="value"><strong>${data.registrationId}</strong></div>
        <div class="label">Pass Code</div>
        <div class="value">${data.passCode}</div>
        <img src="${data.qrDataUrl}" alt="QR Code" width="200" height="200" style="margin:16px auto;display:block;" />
        <div class="label">Event Date</div>
        <div class="value">${data.eventDate}</div>
        <div class="label">Venue</div>
        <div class="value">${data.venue}</div>
      </div>
    </div>
    <div class="footer">Present this pass at check-in</div>
  </div>
</body>
</html>`;
}

export function reminderTemplate(data: {
  fullName: string;
  registrationId: string;
  eventName: string;
  eventDate: string;
  venue: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>Event Reminder</h1></div>
    <div class="content">
      <p>Dear ${data.fullName},</p>
      <p>This is a friendly reminder that <strong>${data.eventName}</strong> is coming up soon!</p>
      <div class="highlight">
        <div class="label">Registration ID</div>
        <div class="value">${data.registrationId}</div>
        <div class="label">Event Date</div>
        <div class="value">${data.eventDate}</div>
        <div class="label">Venue</div>
        <div class="value">${data.venue}</div>
      </div>
      <p>Please bring your event pass and arrive 15 minutes early for check-in.</p>
      <p>— Team Code with Zen</p>
    </div>
    <div class="footer">Code with Zen AI Summit</div>
  </div>
</body>
</html>`;
}

export function thankYouTemplate(data: {
  fullName: string;
  eventName: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>Thank You!</h1></div>
    <div class="content">
      <p>Dear ${data.fullName},</p>
      <p>Thank you for attending <strong>${data.eventName}</strong>!</p>
      <p>We hope you gained valuable insights into AI, vibe coding, and building with modern tools. Stay connected with us for future events and workshops.</p>
      <p>Follow us:</p>
      <p>
        LinkedIn: <a href="https://www.linkedin.com/in/zenovate/" style="color:#fff;">zenovate</a><br/>
        GitHub: <a href="https://github.com/gobinath-sketch" style="color:#fff;">gobinath-sketch</a><br/>
        Twitter: <a href="https://x.com/yaminosei" style="color:#fff;">@yaminosei</a>
      </p>
      <p>— Team Code with Zen</p>
    </div>
    <div class="footer">See you at the next summit!</div>
  </div>
</body>
</html>`;
}
