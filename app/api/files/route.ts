import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";
import { verify } from "jsonwebtoken";
import User from '@/dbSchema/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  let userId
  if (authHeader) {
    const payload = verify(authHeader, JWT_SECRET) as object
    console.log(payload)
    //@ts-ignore
    userId = payload.id
  }

  try {
    const user = await User.findOne({ _id: userId });

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata(user?.pinata_jwt!, user?.next_public_gateWay!).upload.file(file);
    return NextResponse.json(uploadData, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  let userId
  if (authHeader) {
    const payload = verify(authHeader, JWT_SECRET) as object
    console.log(payload)
    //@ts-ignore
    userId = payload.id
  }

  try {
    const user = await User.findOne({ _id: userId });

    const response = await pinata(user?.pinata_jwt!, user?.next_public_gateWay!).listFiles();
    return NextResponse.json(response);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  let userId
  if (authHeader) {
    const payload = verify(authHeader, JWT_SECRET) as object
    console.log(payload)
    //@ts-ignore
    userId = payload.id
  }

  try {
    const data = await request.json();
    const user = await User.findOne({ _id: userId });


    const fileDelete = await pinata(user?.pinata_jwt!, user?.next_public_gateWay!).unpin([data.id])
    return NextResponse.json([{ response: fileDelete }])
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

