import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, profession, note } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !profession) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check for existing pending request with same email
    const { data: existingRequest, error: checkError } = await supabase
      .from('founders_requests')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: 'You already have a pending request. Please wait for approval.' },
        { status: 400 }
      );
    }

    // Check for existing approved request (already a member)
    const { data: approvedRequest } = await supabase
      .from('founders_requests')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .eq('status', 'approved')
      .single();

    if (approvedRequest) {
      return NextResponse.json(
        { success: false, error: 'This email is already approved. Please check your email for the invite code.' },
        { status: 400 }
      );
    }

    // Insert new request
    const { data: newRequest, error: insertError } = await supabase
      .from('founders_requests')
      .insert({
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        profession: profession.trim(),
        note: note?.trim() || null,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating founders request:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to submit request. Please try again.' },
        { status: 500 }
      );
    }

    // TODO: Send notification email to admin
    // This can be implemented later using the existing email service

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      requestId: newRequest.id
    });

  } catch (error) {
    console.error('Error in founders request API:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint to check request status (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const { data: requests, error } = await supabase
      .from('founders_requests')
      .select('id, status, created_at')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to check status' },
        { status: 500 }
      );
    }

    if (!requests || requests.length === 0) {
      return NextResponse.json({
        success: true,
        hasRequest: false
      });
    }

    return NextResponse.json({
      success: true,
      hasRequest: true,
      status: requests[0].status,
      createdAt: requests[0].created_at
    });

  } catch (error) {
    console.error('Error checking founders request status:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
