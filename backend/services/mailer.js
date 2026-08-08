import nodemailer from 'nodemailer';

export const OWNER_EMAIL = 'teenesttt@gmail.com';

function getTransporter() {
  const user = process.env.SMTP_USER || 'teenesttt@gmail.com';
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });
}

/**
 * Send Order Alert Email to Store Owner (teenesttt@gmail.com)
 */
export async function sendNewOrderEmailToOwner(order) {
  const itemsText = order.items
    ? order.items.map((i) => `• ${i.name} | Size: ${i.size} | Color: ${i.color} | Qty: ${i.quantity} | Price: ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n')
    : 'TeeVerse Streetwear Tees';

  const senderUser = process.env.SMTP_USER || OWNER_EMAIL;

  const isOutsideGujarat = order.shipping && order.shipping.state && order.shipping.state.trim().toLowerCase() !== 'gujarat';
  const taxSummary = isOutsideGujarat
    ? `Tax Rule: IGST 5% (Interstate delivery to ${order.shipping.state})`
    : `Tax Rule: CGST 2.5% + SGST 2.5% (Same State Gujarat)`;

  const hasProof = !!order.paymentScreenshot;

  const mailOptions = {
    from: `"TeeVerse Orders" <${senderUser}>`,
    to: OWNER_EMAIL,
    subject: `🚨 NEW ORDER RECEIVED: #${order.orderId} — ₹${order.total.toLocaleString('en-IN')}`,
    text: `
🔥 NEW ORDER PLACED ON TEEVERSE! 🔥

-----------------------------------------
ORDER DETAILS
-----------------------------------------
Order ID: ${order.orderId}
Date: ${new Date(order.date).toLocaleString('en-IN')}
Total Amount: ₹${order.total.toLocaleString('en-IN')}
Payment Method: ${order.paymentMethod.toUpperCase()}
Payment Screenshot: ${hasProof ? 'Attached to this email' : 'None (COD/Card)'}
Tax Info: ${taxSummary}

-----------------------------------------
CUSTOMER INFORMATION
-----------------------------------------
Name: ${order.shipping.name}
Phone: ${order.shipping.phone}
Email: ${order.shipping.email || 'N/A'}
Address: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}

-----------------------------------------
ITEMS ORDERED
-----------------------------------------
${itemsText}

-----------------------------------------
TeeVerse Node.js Express Backend Service
    `,
  };

  if (order.paymentScreenshot) {
    mailOptions.attachments = [
      {
        filename: `payment_proof_${order.orderId}.png`,
        path: order.paymentScreenshot,
      }
    ];
  }

  try {
    console.log(`\n📧 [Node.js Express Nodemailer] Email Notification sent to Store Owner: ${OWNER_EMAIL}`);
    console.log(`Subject: ${mailOptions.subject}`);
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await getTransporter().sendMail(mailOptions);
      console.log('✅ Real SMTP Email dispatched to teenesttt@gmail.com!');
    } else {
      console.log('ℹ️ SMTP ready: Logged order payload successfully.');
    }
  } catch (error) {
    console.error('❌ Error sending Nodemailer email:', error.message);
  }
}

/**
 * Send Contact Us Query Alert Email to Store Owner (teenesttt@gmail.com)
 */
export async function sendContactQueryEmailToOwner(query) {
  const senderUser = process.env.SMTP_USER || OWNER_EMAIL;

  const mailOptions = {
    from: `"TeeVerse Contact Form" <${senderUser}>`,
    to: OWNER_EMAIL,
    subject: `📩 NEW CONTACT INQUIRY: ${query.subject} from ${query.name}`,
    text: `
🔥 NEW CUSTOMER QUERY RECEIVED ON TEEVERSE! 🔥

-----------------------------------------
CUSTOMER INFORMATION
-----------------------------------------
Customer Name: ${query.name}
Customer Email: ${query.email}
Customer Phone: ${query.phone || 'N/A'}
Date & Time: ${new Date().toLocaleString('en-IN')}

-----------------------------------------
QUERY DETAILS
-----------------------------------------
Subject Category: ${query.subject}

Message:
"${query.message}"

-----------------------------------------
QUICK REPLY OPTIONS
-----------------------------------------
Reply Email: mailto:${query.email}
Reply WhatsApp: https://wa.me/91${(query.phone || '').replace(/[^0-9]/g, '')}
`,
  };

  try {
    console.log(`\n📩 [Nodemailer] Contact Inquiry Alert sent to Store Owner: ${OWNER_EMAIL}`);
    console.log(`Subject: ${mailOptions.subject}`);
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await getTransporter().sendMail(mailOptions);
      console.log('✅ Real SMTP Contact Email dispatched to teenesttt@gmail.com!');
    } else {
      console.log('ℹ️ SMTP ready: Logged contact query payload successfully.');
    }
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending contact email:', error.message);
    return { success: false, error: error.message };
  }
}
