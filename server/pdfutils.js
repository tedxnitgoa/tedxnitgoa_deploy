const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const os = require("os");
const { uploadOnCloudinary } = require('./cloudinary/cloudinary');
const PDFDocument = require('pdfkit');

const generateTicketPDF = async (paymentData) => {
  const { name, email, phone, ticketType, quantity, orderId, paymentId } = paymentData;
  const verificationId = `${orderId}-${paymentId}`;

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

  // Create a temporary directory for storing the PDF
  const ticketsDir = path.join(os.tmpdir(), 'tickets');
  if (!fs.existsSync(ticketsDir)) {
    fs.mkdirSync(ticketsDir);
  }

  const filePath = path.join(ticketsDir, `${orderId}.pdf`);

  try {
    // Initialize a new PDF document
    const doc = new PDFDocument({ size: 'A4' });
    
    // Write the PDF to a file
    const pdfStream = fs.createWriteStream(filePath);
    doc.pipe(pdfStream);

    // Add title and ticket details with beautified structure
    doc
      .fontSize(24)
      .text('TEDxNITGOA Ticket', { align: 'center' })
      .moveDown(1.5);

    doc
      .fontSize(16)
      .text('Ticket Information:', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(14)
      .text(`Name: ${name}`)
      .moveDown(0.3)
      .text(`Email: ${email}`)
      .moveDown(0.3)
      .text(`Phone: ${phone}`)
      .moveDown(0.3)
      .text(`Ticket Type: ${ticketType}`)
      .moveDown(0.3)
      .text(`Quantity: ${quantity}`)
      .moveDown(0.3)
      .text(`Order ID: ${orderId}`)
      .moveDown(0.3)
      .text(`Transaction ID: ${paymentId}`)
      .moveDown(1.5);

    // Add QR code image to the PDF
    doc
      .image(await convertDataUrlToBuffer(qrCodeData), {
        fit: [150, 150],
        align: 'center',
        valign: 'center',
      });

    // Finalize the PDF
    doc.end();

    // Wait for the PDF file to be written before proceeding
    await new Promise((resolve, reject) => {
      pdfStream.on('finish', resolve);
      pdfStream.on('error', reject);
    });

    console.log(`PDF stored temporarily at: ${filePath}`);

    // Upload the generated PDF to Cloudinary
    const uploadedPdf = await uploadOnCloudinary(filePath);

    // Delete the PDF file after uploading
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Handle if the PDF upload fails
    if (!uploadedPdf) {
      throw new Error("Some error occurred while uploading the PDF to Cloudinary");
    }

    // Return the secure URL of the uploaded PDF
    return uploadedPdf.secure_url;

  } catch (error) {
    console.error("Error during PDF generation or upload:", error);
    throw error;
  }
};

// Helper function to convert Data URL (Base64) to Buffer
const convertDataUrlToBuffer = (dataUrl) => {
  const base64Data = dataUrl.split(',')[1];
  return Buffer.from(base64Data, 'base64');
};

module.exports = { generateTicketPDF };
