import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

const git = simpleGit();

export async function POST(req: Request) {

  const formData = await req.formData();

  const appName =
    formData.get("appName") as string;

  const packageName =
    formData.get("packageName") as string;

  const htmlCode =
    formData.get("htmlCode") as string;

  const icon =
    formData.get("icon") as File;

  // SAVE APP HTML

  const htmlPath = path.join(
    process.cwd(),
    "public",
    "app.html"
  );

  fs.writeFileSync(
    htmlPath,
    htmlCode
  );

  // SAVE ICON

  if (icon) {

    const bytes =
      await icon.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const iconPath = path.join(
      process.cwd(),
      "resources",
      "icon.png"
    );

    fs.writeFileSync(
      iconPath,
      buffer
    );
  }

  // UPDATE APP NAME

  const stringsPath = path.join(
    process.cwd(),
    "android",
    "app",
    "src",
    "main",
    "res",
    "values",
    "strings.xml"
  );

  const stringsContent = `<?xml version='1.0' encoding='utf-8'?>
<resources>
<string name="app_name">${appName}</string>
<string name="title_activity_main">${appName}</string>
</resources>`;

  fs.writeFileSync(
    stringsPath,
    stringsContent
  );

  // UPDATE PACKAGE NAME

  const gradlePath = path.join(
    process.cwd(),
    "android",
    "app",
    "build.gradle"
  );

  let gradleContent =
    fs.readFileSync(
      gradlePath,
      "utf8"
    );

  gradleContent =
    gradleContent.replace(
      /applicationId\s+"[^"]+"/,
      `applicationId "${packageName}"`
    );

  fs.writeFileSync(
    gradlePath,
    gradleContent
  );

  // UPDATE CAPACITOR CONFIG

  const capacitorPath = path.join(
    process.cwd(),
    "capacitor.config.ts"
  );

  const capacitorContent = `
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "${packageName}",
  appName: "${appName}",
  webDir: "out",
};

export default config;
`;

  fs.writeFileSync(
    capacitorPath,
    capacitorContent
  );

  // GENERATE ICONS

  const { execSync } =
    require("child_process");

  execSync(
    "npx capacitor-assets generate"
  );

  // PUSH TO GITHUB

  await git.add("./*");

  await git.commit(
    "updated dynamic apk"
  );

  await git.push(
    "origin",
    "main"
  );

  // RUN GITHUB ACTION

 
const workflowResponse =
  await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/workflows/android.yml/dispatches`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${process.env.GITHUB_TOKEN}`,

        Accept:
          "application/vnd.github+json",
      },

      body: JSON.stringify({
        ref: "main",
      }),
    }
  );

// WAIT A LITTLE

await new Promise((resolve) =>
  setTimeout(resolve, 5000)
);

// GET LATEST RUN

const runsResponse =
  await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs`,
    {
      headers: {
        Authorization:
          `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

const runsData =
  await runsResponse.json();

const latestRun =
  runsData.workflow_runs[0];








  // WAIT BUILD

  await new Promise((resolve) =>
    setTimeout(resolve, 30000)
  );

  // GET APK ARTIFACT

  const artifactResponse =
    await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/artifacts`,
      {
        headers: {
          Authorization:
            `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

  const artifactData =
    await artifactResponse.json();

return NextResponse.json({
  success: true,
  runId: latestRun.id,
});

}