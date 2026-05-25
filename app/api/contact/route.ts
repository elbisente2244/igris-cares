import { NextRequest, NextResponse } from "next/server"
import { saveInquiry } from "@/lib/admin/firestore-data"

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

    await saveInquiry({
      name,
      email,
      phone: phone || undefined,
      inquiryType,
      subject,
      message,
      status: "unread",
      createdAt: new Date().toISOString(),
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
