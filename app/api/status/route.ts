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
          Accept:
            "application/vnd.github+json",
        },
      }
    );

  const data =
    await response.json();

  // BUILD STATUS

  if (
    data.status !==
    "completed"
  ) {

    return NextResponse.json({
      status:
        data.status,
    });
  }

  // GET ARTIFACTS

  const artifactResponse =
    await fetch(
      data.artifacts_url,
      {
        headers: {
          Authorization:
            `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

  const artifactData =
    await artifactResponse.json();

  const artifact =
    artifactData.artifacts?.[0];

  return NextResponse.json({
    status: "completed",

    downloadUrl:
      artifact.archive_download_url,
  });

}