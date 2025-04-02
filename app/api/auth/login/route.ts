// app/api/auth/login/route.ts
import User from '@/dbSchema/user.model';
import dbConnect from '@/utils/dbConfig';
import { JsonWebTokenError, sign } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Connect to the database
    await dbConnect();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = sign({
      id: user._id,
      email: user.email
    }, JWT_SECRET)
    console.log("the token is", token)
    // Return success with token and user data (without password)
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      pinata_jwt: user.pinata_jwt,
      next_public_gateWay: user.next_public_gateWay,
      next_public_gateway_token: user.next_public_gateway_token,
    };

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        message: 'Error during login',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
