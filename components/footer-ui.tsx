import Link from "next/link"
import { Facebook, MessageCircleMore, Mail } from "lucide-react"
import { FooterNewsletter } from "@/components/footer-newsletter"

export type FooterCopy = {
  brand_name?: string
  tagline?: string
  newsletter_text?: string
  copyright_line?: string
  facebook_url?: string
  messenger_url?: string
}

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Our Projects" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
  ],
  support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/partners", label: "Become a Partner" },
    { href: "/faq", label: "FAQ" },
    { href: "/volunteer", label: "Volunteer" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
}

export const defaultFooterCopy: FooterCopy = {
  brand_name: "IGRIS CARES",
  tagline:
    "Empowering communities through meaningful outreach programs, charity events, and sustainable partnerships. Together, we create lasting impact.",
  newsletter_text: "Subscribe to our newsletter for updates",
  copyright_line: "Making a difference, one community at a time.",
  facebook_url: "https://www.facebook.com/igriscares",
  messenger_url: "https://www.facebook.com/messages/t/1012052945325009",
}

function pick(copy: FooterCopy, key: keyof FooterCopy, fallback: string) {
  const v = copy[key]
  return typeof v === "string" && v.length > 0 ? v : fallback
}

export function FooterUI({ copy = defaultFooterCopy }: { copy?: FooterCopy }) {
  const socialLinks = [
    { href: pick(copy, "facebook_url", defaultFooterCopy.facebook_url!), icon: Facebook, label: "Facebook" },
    {
      href: pick(copy, "messenger_url", defaultFooterCopy.messenger_url!),
      icon: MessageCircleMore,
      label: "Messenger",
    },
  ]

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src="/round-logo.jpg" alt="IGRIS CARES" className="h-20 w-20 rounded-md object-contain" />
              <span className="text-xl font-semibold tracking-tight">{pick(copy, "brand_name", "IGRIS CARES")}</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed max-w-sm mb-6">
              {pick(copy, "tagline", defaultFooterCopy.tagline!)}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-background/50">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-background/50">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-background/50">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="py-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-sm text-background/70">
                {pick(copy, "newsletter_text", defaultFooterCopy.newsletter_text!)}
              </span>
            </div>
            <FooterNewsletter />
          </div>
        </div>
        <div className="py-6 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p>
            &copy; {new Date().getFullYear()} {pick(copy, "brand_name", "IGRIS CARES")}. All rights reserved.
          </p>
          <p>{pick(copy, "copyright_line", defaultFooterCopy.copyright_line!)}</p>
        </div>
      </div>
    </footer>
  )
}
