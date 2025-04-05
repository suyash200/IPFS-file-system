// app/api/auth/register/route.ts
import User from '@/dbSchema/user.model';
import dbConnect from '@/utils/dbConfig';
import { verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  let userId
  if (authHeader) {
    const payload = verify(authHeader, JWT_SECRET) as object
    console.log(payload)
    //@ts-ignore
    userId = payload.id
  }


  try {
    const body = await request.json();
    const { email, pinata_jwt, next_public_gateWay, next_public_gateway_token } = body;

    // Connect to the database
    await dbConnect();

    // Check if user already exists
    console.log(userId)
    const existingUser = await User.findOneAndUpdate({ _id: userId }, { ...request.body });
    if (!existingUser) {
      return NextResponse.json(
        { message: 'User does not  exists' },
        { status: 404 }
      );
    }



    // Return success response (without password)


    return NextResponse.json(
      { message: 'User updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      {
        message: 'Error registering user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
