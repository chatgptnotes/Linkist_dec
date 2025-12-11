import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderEmail } from '@/lib/smtp-email-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Generate a unique 8-character alphanumeric code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars: I, O, 0, 1
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FC-${code}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Fetch the request
    const { data: foundersRequest, error: fetchError } = await supabase
      .from('founders_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !foundersRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    if (foundersRequest.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Request has already been processed' },
        { status: 400 }
      );
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure code is unique
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('founders_invite_codes')
        .select('id')
        .eq('code', inviteCode)
        .single();

      if (!existing) break;

      inviteCode = generateInviteCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique code' },
        { status: 500 }
      );
    }

    // Calculate expiry (72 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    // Create invite code
    const { error: codeError } = await supabase
      .from('founders_invite_codes')
      .insert({
        code: inviteCode,
        email: foundersRequest.email,
        phone: foundersRequest.phone,
        request_id: requestId,
        expires_at: expiresAt.toISOString()
      });

    if (codeError) {
      console.error('Error creating invite code:', codeError);
      return NextResponse.json(
        { success: false, error: 'Failed to create invite code' },
        { status: 500 }
      );
    }

    // Update request status to approved
    const { error: updateError } = await supabase
      .from('founders_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    if (updateError) {
      console.error('Error updating request status:', updateError);
      // Code was created but status update failed - not critical
    }

    // Send email with invite code using SMTP service
    try {
      const emailResult = await sendOrderEmail({
        to: foundersRequest.email,
        subject: 'Your Founders Club Invite Code - Linkist',
        html: getEmailTemplate(foundersRequest.full_name, inviteCode, expiresAt)
      });

      if (emailResult.success) {
        console.log('✅ Approval email sent to:', foundersRequest.email);
      } else {
        console.error('❌ Failed to send approval email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      // Email failed but code was created - still consider it a success
    }

    return NextResponse.json({
      success: true,
      code: inviteCode,
      expiresAt: expiresAt.toISOString(),
      message: 'Request approved and invite code generated'
    });

  } catch (error) {
    console.error('Error in founders approve API:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

function getEmailTemplate(name: string, code: string, expiresAt: Date): string {
  const formattedExpiry = expiresAt.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Founders Club Invite Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Founders Club</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
          Hi ${name},
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
          Great news! Your request to join the exclusive Linkist Founders Club has been approved.
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 30px;">
          Use the following invite code to unlock your Founders Club access:
        </p>

        <div style="background-color: #fef3c7; border: 2px dashed #f59e0b; border-radius: 12px; padding: 25px; text-align: center; margin: 0 0 30px;">
          <p style="color: #92400e; font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Your Invite Code</p>
          <p style="color: #78350f; font-size: 32px; font-weight: bold; margin: 0; font-family: monospace; letter-spacing: 3px;">${code}</p>
        </div>

        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 0 0 30px;">
          <p style="color: #991b1b; font-size: 14px; margin: 0;">
            <strong>Important:</strong> This code expires on ${formattedExpiry}. Please use it within 72 hours.
          </p>
        </div>

        <h3 style="color: #333333; font-size: 18px; margin: 0 0 15px;">How to use your code:</h3>
        <ol style="color: #666666; font-size: 14px; line-height: 24px; margin: 0 0 30px; padding-left: 20px;">
          <li style="margin-bottom: 10px;">Go to the Linkist product selection page</li>
          <li style="margin-bottom: 10px;">Click "Enter Code" on the Founders Club card</li>
          <li style="margin-bottom: 10px;">Enter your code and email to unlock access</li>
          <li>Enjoy exclusive Founders Club benefits!</li>
        </ol>

        <h3 style="color: #333333; font-size: 18px; margin: 0 0 15px;">Your Founders Club Benefits:</h3>
        <ul style="color: #666666; font-size: 14px; line-height: 24px; margin: 0 0 30px; padding-left: 20px;">
          <li style="margin-bottom: 8px;">✨ Exclusive "Founders" tag on your NFC card</li>
          <li style="margin-bottom: 8px;">🎨 Access to exclusive Black card colors</li>
          <li style="margin-bottom: 8px;">💰 Lifetime 50% discount on all products</li>
          <li style="margin-bottom: 8px;">⚡ Priority 24/7 support</li>
          <li>🚀 Early access to new features</li>
        </ul>

        <div style="text-align: center;">
          <a href="https://linkist.ai/product-selection" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Unlock Founders Club Access →
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; background-color: #f9fafb; text-align: center;">
        <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px;">
          This email was sent to you because you requested access to Linkist Founders Club.
        </p>
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Linkist. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
