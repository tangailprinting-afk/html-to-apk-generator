import { NextResponse } from "next/server";

import {
  getWorkflowStatus,
} from "@/lib/github";

export async function GET(
  req: Request
) {

  try {

    const { searchParams } =
      new URL(req.url);

    const runId =
      searchParams.get(
        "runId"
      );

    if (!runId) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Missing runId",
        },
        {
          status: 400,
        }
      );
    }

    const data =
      await getWorkflowStatus(
        runId
      );

    // BUILDING

    if (
      data.status ===
      "queued"
    ) {

      return NextResponse.json({
        status:
          "queued",
      });
    }

    if (
      data.status ===
      "in_progress"
    ) {

      return NextResponse.json({
        status:
          "building",
      });
    }

    // FAILED

    if (
      data.conclusion ===
      "failure"
    ) {

      return NextResponse.json({
        status:
          "failed",
      });
    }

    // SUCCESS

    return NextResponse.json({
      status:
        "completed",

      downloadUrl:
        `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/releases/download/apk-release/app-debug.apk`,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Status failed",
      },
      {
        status: 500,
      }
    );
  }
}