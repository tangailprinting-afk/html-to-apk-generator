import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const { searchParams } =
    new URL(req.url);

  const runId =
    searchParams.get("runId");

  const response =
    await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}`,
      {
        headers: {
          Authorization:
            `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

  const data =
    await response.json();

  if (
    data.status !==
    "completed"
  ) {

    return NextResponse.json({
      status: data.status,
    });
  }

  return NextResponse.json({
    status: "completed",

    downloadUrl:
      `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/releases/download/apk-release/app-debug.apk`,
  });

}