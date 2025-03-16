import { pinata } from "@/utils/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await pinata.gateways.get("bafkreiaizujuefgms5x2kozqmpvumipx6zslqqymf4tj5bt43xpa5zhhve")
    console.log(response, "is")
    return NextResponse.json(response);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
