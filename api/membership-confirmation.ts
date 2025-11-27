export default async (req: any, res: any) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      customerName,
      customerEmail,
      planName,
      accessCode,
      monthlyPrice,
      startDate,
    } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !planName || !accessCode || !monthlyPrice) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Send email using a service like SendGrid, AWS SES, Mailgun, etc.
    // For now, we'll log the email that would be sent
    const emailContent = {
      to: customerEmail,
      subject: '🎉 Welcome to Cornerstone Mobile Detailing - Your Access Code Inside',
      html: generateMembershipConfirmationEmail({
        name: customerName,
        planName,
        accessCode,
        monthlyPrice,
        startDate,
      }),
    };

    // If you have an email service configured, send it here
    // Example: await sendEmailViaService(emailContent);
    
    // For development, log the email content
    console.log('Membership confirmation email:', emailContent);

    res.status(200).json({
      success: true,
      message: 'Membership confirmation email queued for delivery',
      recipient: customerEmail,
    });
  } catch (error: any) {
    console.error('Error sending membership confirmation email:', error);
    res.status(500).json({
      error: 'Failed to send membership confirmation email',
      message: error?.message || 'Unknown error',
    });
  }
};

function generateMembershipConfirmationEmail(data: {
  name: string;
  planName: string;
  accessCode: string;
  monthlyPrice: number;
  startDate: string;
}): string {
  const startDateFormatted = new Date(data.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
    .welcome { margin-bottom: 20px; font-size: 16px; }
    .code-box { background: white; border: 2px dashed #667eea; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .code-box .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 8px; }
    .code-box .code { font-size: 32px; font-weight: bold; color: #667eea; font-family: 'Courier New', monospace; letter-spacing: 2px; }
    .details { margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #667eea; }
    .detail-row { margin: 8px 0; }
    .detail-label { font-weight: bold; color: #667eea; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
    .important { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Cornerstone!</h1>
      <p>Your Membership is Now Active</p>
    </div>
    
    <div class="content">
      <div class="welcome">
        <p>Hi ${escapeHtml(data.name)},</p>
        <p>Congratulations on joining Cornerstone Mobile Detailing! We're thrilled to have you as a valued member. Your exclusive membership benefits start today.</p>
      </div>

      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Plan:</span> ${escapeHtml(data.planName)}
        </div>
        <div class="detail-row">
          <span class="detail-label">Monthly Price:</span> $${data.monthlyPrice.toFixed(2)}
        </div>
        <div class="detail-row">
          <span class="detail-label">Start Date:</span> ${startDateFormatted}
        </div>
      </div>

      <div class="important">
        <strong>✓ Your Exclusive Access Code:</strong> Keep this code safe! You'll use it to access your member benefits and manage your account.
      </div>

      <div class="code-box">
        <div class="label">Your Access Code</div>
        <div class="code">${escapeHtml(data.accessCode)}</div>
      </div>

      <div class="important">
        <strong>What You Get:</strong>
        <ul>
          <li>Priority scheduling for your preferred time slots</li>
          <li>Exclusive member-only discounts on add-on services</li>
          <li>Regular maintenance service per your plan</li>
          <li> 24/7 access to your member portal</li>
          <li>Premium products and expert detailing</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="https://cornerstonemobiledetailing.com/membership-dashboard" class="cta-button">Go to Your Dashboard</a>
      </div>

      <div style="margin-top: 30px; padding: 15px; background: #f0f0f0; border-radius: 6px;">
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Save your access code in a safe place</li>
          <li>Log in to your member dashboard using your email and password</li>
          <li>Book your first appointment using your membership benefits</li>
          <li>Enjoy priority support from our team</li>
        </ol>
      </div>

      <div style="margin-top: 20px;">
        <p><strong>Questions?</strong></p>
        <p>Contact us at <strong>cornerstonemobile55@gmail.com</strong> or call <strong>980-312-4236</strong></p>
        <p>Our team is here to help you get the most out of your membership!</p>
      </div>
    </div>

    <div class="footer">
      <p>© 2024 Cornerstone Mobile Detailing. All rights reserved.</p>
      <p>You're receiving this email because you created an account on our website.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
