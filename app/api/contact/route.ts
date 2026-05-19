import { NextRequest, NextResponse } from "next/server"

// This API route handles contact form submissions
// In production, this would use Firebase Admin SDK to write to Firestore
// For now, we'll return a success response and the data can be stored client-side

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, email, phone, inquiryType, subject, message } = body

    // Validate required fields
    if (!name || !email || !inquiryType || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // In production, you would:
    // 1. Initialize Firebase Admin SDK
    // 2. Write to Firestore contacts collection
    // 3. Optionally send email notification

    // For now, log the submission and return success
    console.log("Contact form submission:", {
      sender_name: name,
      sender_email: email,
      phone: phone || null,
      inquiry_type: inquiryType,
      subject,
      message,
      sent_at: new Date().toISOString(),
      status: "new",
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Your inquiry has been submitted successfully. We will get back to you soon." 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    )
  }
}
