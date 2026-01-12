import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Bypass all auth checks - allow all routes
  return NextResponse.next()
}
