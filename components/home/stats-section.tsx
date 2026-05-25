"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Users, Heart, MapPin, Calendar } from "lucide-react"

const defaultStats = [
  { icon: Users, value: 1000, suffix: "+", label: "Lives Impacted", description: "Individuals reached through our programs" },
  { icon: Heart, value: 10, suffix: "+", label: "Projects Completed", description: "Successful outreach initiatives" },
  { icon: MapPin, value: 45, suffix: "", label: "Communities Served", description: "Locations across the region" },
  { icon: Calendar, value: 4, suffix: "+", label: "Years of Impact", description: "Building with care since 2022" },
]

const statIcons = [Users, Heart, MapPin, Calendar]

function statsFromFrontmatter(fm: Record<string, unknown>) {
  const built = [1, 2, 3, 4].map((i) => {
    const value = fm[`stat${i}_value`]
    const suffix = fm[`stat${i}_suffix`]
    const label = fm[`stat${i}_label`]
    const description = fm[`stat${i}_description`]
    if (label === undefined && value === undefined) return null
    return {
      icon: statIcons[i - 1],
      value: typeof value === "number" ? value : Number(value) || defaultStats[i - 1].value,
      suffix: typeof suffix === "string" ? suffix : defaultStats[i - 1].suffix,
      label: (label as string) || defaultStats[i - 1].label,
      description: (description as string) || defaultStats[i - 1].description,
    }
  })
  if (built.every((s) => s === null)) return defaultStats
  return built.map((s, i) => s ?? defaultStats[i])
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsSection({ frontmatter = {} }: { frontmatter?: Record<string, unknown> }) {
  const stats = statsFromFrontmatter(frontmatter)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section className="py-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-base font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
