const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const os = require("os");
const { uploadOnCloudinary } = require('./cloudinary/cloudinary');
const html_to_pdf = require('html-pdf-node');

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

  // Generate HTML content for the ticket
  const ticketHtml = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center;">TEDxNITGOA Ticket</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Ticket Type:</strong> ${ticketType}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Transaction ID:</strong> ${paymentId}</p>
        <div style="text-align: center; margin-top: 20px;">
          <img src="${qrCodeData}" alt="QR Code" />
        </div>
      </body>
    </html>
  `;

  // Create a temporary directory for storing the PDF
  const ticketsDir = path.join(os.tmpdir(), 'tickets');
  if (!fs.existsSync(ticketsDir)) {
    fs.mkdirSync(ticketsDir);
  }

  const filePath = path.join(ticketsDir, `${orderId}.pdf`);
  
  // Set content and generate PDF
  let options = { format: 'A4' };
  
  let file = { content: ticketHtml };
  try {
    // Generate the PDF buffer from the file
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    // Save the PDF buffer to the file path
    fs.writeFileSync(filePath, pdfBuffer);
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
    throw error; // Re-throw the error to be handled by the calling function
  }


};

module.exports = { generateTicketPDF };
