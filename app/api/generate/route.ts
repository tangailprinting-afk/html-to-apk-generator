import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {

  const body = await req.json();

  const { appName, packageName, htmlCode } = body;

  const fileName = `${Date.now()}.html`;

  const filePath = path.join(process.cwd(), "uploads", fileName);

  fs.writeFileSync(filePath, htmlCode);

  return NextResponse.json({
    success: true,
    message: "HTML File Saved Successfully",
    file: fileName,
    appName,
    packageName,
  });

}