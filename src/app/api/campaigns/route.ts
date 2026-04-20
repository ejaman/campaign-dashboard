import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'src/data/db.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  const { campaigns } = JSON.parse(raw)
  return NextResponse.json(campaigns)
}
