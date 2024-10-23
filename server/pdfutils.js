const pdfkit = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const generateTicketPDF = async (paymentData) => {
  const { name, email, phone, ticketType, quantity, orderId, paymentId } = paymentData;
  const verificationId = `${orderId}-${paymentId}`;

  const pdf = new pdfkit();
  const ticketsDir = path.join(__dirname, 'tickets');
  
  // Create the tickets directory if it doesn't exist
  if (!fs.existsSync(ticketsDir)) {
    fs.mkdirSync(ticketsDir, { recursive: true });
  }

  const filePath = path.join(ticketsDir, `${orderId}.pdf`);
  pdf.pipe(fs.createWriteStream(filePath));

  // Rest of the PDF generation code...
  pdf.fontSize(25).text('TEDxNITGOA Ticket', { align: 'center' });
  pdf.moveDown();
  pdf.fontSize(15).text(`Name: ${name}`);
  pdf.text(`Email: ${email}`);
  pdf.text(`Phone: ${phone}`);
  pdf.text(`Ticket Type: ${ticketType}`);
  pdf.text(`Quantity: ${quantity}`);
  pdf.text(`Order ID: ${orderId}`);
  pdf.text(`Transaction ID: ${paymentId}`);

  // Generate QR code
  const ticketInfo = JSON.stringify({
    id: verificationId,
    name,
    email,
    phone,
    ticketType,
    quantity,
    eventName: 'TEDxNITGOA',
    eventDate: '2024-11-15',
    orderId,
    paymentId
  });

  const qrCodeData = await QRCode.toDataURL(ticketInfo);
  pdf.image(qrCodeData, {
    fit: [150, 150],
    align: 'center',
    valign: 'center'
  });

  pdf.end();
  return filePath;
};

module.exports = { generateTicketPDF };