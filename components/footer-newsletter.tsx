"use client"

import { useState } from "react"
import { toast } from "sonner"

export function FooterNewsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error("Please enter your email address.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: email.trim(),
          inquiryType: "general",
          subject: "Newsletter subscription",
          message: "Please add me to the IGRIS CARES newsletter mailing list.",
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Subscription failed")
      }

      toast.success("Thanks for subscribing! We'll keep you updated.")
      setEmail("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not subscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="flex gap-2 w-full md:w-auto" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 md:w-64 px-4 py-2 rounded-lg bg-background/10 border border-background/20 text-sm placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "..." : "Subscribe"}
      </button>
    </form>
  )
}
