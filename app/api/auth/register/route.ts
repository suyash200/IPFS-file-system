// app/api/auth/register/route.ts
import User from '@/dbSchema/user.model';
import dbConnect from '@/utils/dbConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, pinata_jwt, next_public_gateWay, next_public_gateway_token } = body;

    // Connect to the database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User({
      email,
      password,
      pinata_jwt,
      next_public_gateWay,
      next_public_gateway_token,
    });

    // Save user to database
    await user.save();

    // Return success response (without password)
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        message: 'Error registering user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
