// app/api/user/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth_token') // Change to your cookie name

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // TODO: Verify token and get user from database
    // Example: const user = await db.user.findUnique({ where: { token: authToken.value } })
    
    // For now, return mock data - replace with actual database query
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      profilePicture: '/profile.jpg', // optional
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}