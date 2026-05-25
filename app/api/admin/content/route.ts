import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const CONTENT_DIR = path.join(process.cwd(), "content")

function safeName(name: string) {
  // prevent path traversal
  if (name.includes("..") || name.includes("/") || name.includes("\\")) throw new Error("Invalid name")
  return name
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name")

  if (name) {
    try {
      safeName(name)
      const filePath = path.join(CONTENT_DIR, name)
      const content = await fs.readFile(filePath, "utf8")
      return NextResponse.json({ name, content })
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 400 })
    }
  }

  // list files
  try {
    const entries = await fs.readdir(CONTENT_DIR)
    const files = entries.map((name) => ({
      name,
      path: path.join("content", name),
      absolutePath: path.join(CONTENT_DIR, name).replace(/\\/g, "/"),
    }))
    return NextResponse.json(files)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, content } = body
    safeName(name)
    const filePath = path.join(CONTENT_DIR, name)
    await fs.writeFile(filePath, content, "utf8")
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 })
  }
}
