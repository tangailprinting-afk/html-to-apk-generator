import { NextResponse } from "next/server";

import {
  updateGitHubFile,
  triggerWorkflow,
} from "@/lib/github";

export async function POST(
  req: Request
) {

  try {

    const formData =
      await req.formData();

    const appName =
      formData.get(
        "appName"
      ) as string;

    const packageName =
      formData.get(
        "packageName"
      ) as string;

    const htmlCode =
      formData.get(
        "htmlCode"
      ) as string;

    const icon =
      formData.get(
        "icon"
      ) as File;

    // VALIDATE PACKAGE

    const validPackage =
      /^[a-z]+\.[a-z0-9]+\.[a-z0-9]+$/;

    if (
      !validPackage.test(
        packageName
      )
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid package name",
        },
        {
          status: 400,
        }
      );
    }

    // UPDATE HTML

    await updateGitHubFile(
      "public/app.html",
      htmlCode,
      "updated html"
    );

    // UPDATE ICON

    if (icon) {

      const bytes =
        await icon.arrayBuffer();

      const base64 =
        Buffer.from(
          bytes
        ).toString("base64");

      await fetch(
        `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/resources/icon.png`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept:
              "application/vnd.github+json",
          },

          body: JSON.stringify({
            message:
              "updated icon",

            content:
              base64,
          }),
        }
      );
    }

    // UPDATE STRINGS

    const strings =
      `<?xml version='1.0' encoding='utf-8'?>
<resources>
<string name="app_name">${appName}</string>
<string name="title_activity_main">${appName}</string>
</resources>`;

    await updateGitHubFile(
      "android/app/src/main/res/values/strings.xml",
      strings,
      "updated strings"
    );

    // UPDATE GRADLE

    const gradleResponse =
      await fetch(
        `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/android/app/build.gradle`,
        {
          headers: {
            Authorization:
              `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );

    const gradleData =
      await gradleResponse.json();

    const gradleContent =
      Buffer.from(
        gradleData.content,
        "base64"
      ).toString("utf8");

    const updatedGradle =
      gradleContent.replace(
        /applicationId\s+"[^"]+"/,
        `applicationId "${packageName}"`
      );

    await updateGitHubFile(
      "android/app/build.gradle",
      updatedGradle,
      "updated package"
    );

    // UPDATE CAPACITOR

    const capacitorConfig =
      `
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "${packageName}",
  appName: "${appName}",
  webDir: "public",
};

export default config;
`;

    await updateGitHubFile(
      "capacitor.config.ts",
      capacitorConfig,
      "updated capacitor"
    );

    // START BUILD

    const runId =
      await triggerWorkflow();

    return NextResponse.json({
      success: true,
      runId,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Build failed",
      },
      {
        status: 500,
      }
    );
  }
}