interface PassData {
  fullName: string;
  registrationId: string;
  email: string;
  paymentId: string;
  transactionId: string;
  amount: number;
  date: string;
  eventName: string;
  qrDataUrl?: string;
}

export async function generateEventPassImage(data: PassData): Promise<Blob> {
  const width = 600;
  const height = 800;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Header
  ctx.fillStyle = '#666666';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('EVENT PASS', 40, 60);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(data.eventName, 40, 100);

  // Divider
  ctx.strokeStyle = '#333333';
  ctx.beginPath();
  ctx.moveTo(40, 120);
  ctx.lineTo(width - 40, 120);
  ctx.stroke();

  // Details
  const lines: [string, string][] = [
    ['Name', data.fullName],
    ['Registration ID', data.registrationId],
    ['Payment ID', data.paymentId],
    ['Transaction ID', data.transactionId],
    ['Email', data.email],
    ['Amount Paid', `₹${data.amount}`],
    ['Date', data.date],
  ];

  ctx.font = '14px system-ui, sans-serif';
  let y = 155;
  for (const [label, value] of lines) {
    ctx.fillStyle = '#888888';
    ctx.fillText(`${label}:`, 40, y);
    ctx.fillStyle = '#ffffff';
    const display = value.length > 45 ? value.slice(0, 42) + '...' : value;
    ctx.fillText(display, 40, y + 18);
    y += 44;
  }

  // QR code
  if (data.qrDataUrl) {
    const qr = await loadImage(data.qrDataUrl);
    const qrSize = 120;
    ctx.drawImage(qr, (width - qrSize) / 2, height - qrSize - 50, qrSize, qrSize);
  }

  // Footer
  ctx.fillStyle = '#666666';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Present this pass at the event venue', width / 2, height - 25);
  ctx.textAlign = 'left';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to generate image'))),
      'image/png',
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
