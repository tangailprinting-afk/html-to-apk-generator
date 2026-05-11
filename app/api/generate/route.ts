import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

const git = simpleGit();

export async function POST(req: Request) {

  const body = await req.json();

  const {
    appName,
    packageName,
    htmlCode,
  } = body;

  // Update HTML

  const indexPath = path.join(
    process.cwd(),
    "public",
    "index.html"
  );

  fs.writeFileSync(indexPath, htmlCode);

  // Update App Name

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
    <string name="package_name">${packageName}</string>
</resources>`;

  fs.writeFileSync(stringsPath, stringsContent);

  await git.add("./*");

  await git.commit("updated dynamic app");

  await git.push("origin", "main");

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

  await new Promise((resolve) =>
    setTimeout(resolve, 20000)
  );

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