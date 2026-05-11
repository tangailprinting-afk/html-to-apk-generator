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

  // Update public/index.html

  const indexPath = path.join(
    process.cwd(),
    "public",
    "index.html"
  );

  fs.writeFileSync(indexPath, htmlCode);

  // Save Icon

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

    fs.writeFileSync(iconPath, buffer);
  }

  // Update strings.xml

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

  fs.writeFileSync(stringsPath, stringsContent);

  // Update build.gradle

  const gradlePath = path.join(
    process.cwd(),
    "android",
    "app",
    "build.gradle"
  );

  let gradleContent =
    fs.readFileSync(gradlePath, "utf8");

  gradleContent = gradleContent.replace(
    /applicationId\s+"[^"]+"/,
    `applicationId "${packageName}"`
  );

  fs.writeFileSync(
    gradlePath,
    gradleContent
  );

  // Generate Android Assets

  const { execSync } =
    require("child_process");

  execSync(
    "npx capacitor-assets generate"
  );

  // Git Push

  await git.add("./*");

  await git.commit("updated dynamic app");

  await git.push("origin", "main");

  // Trigger Workflow

  await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/workflows/android.yml/dispatches`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },

      body: JSON.stringify({
        ref: "main",
      }),
    }
  );

  // Wait for build

  await new Promise((resolve) =>
    setTimeout(resolve, 20000)
  );

  // Get Artifacts

  const artifactsResponse = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/artifacts`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  const artifactsData =
    await artifactsResponse.json();

  return NextResponse.json({
    success: true,
    artifact: artifactsData,
  });

}