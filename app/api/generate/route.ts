import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

const git = simpleGit();

export async function POST(req: Request) {

  const body = await req.json();

  const { htmlCode } = body;

  const indexPath = path.join(
    process.cwd(),
    "public",
    "index.html"
  );

  fs.writeFileSync(indexPath, htmlCode);

  await git.add("./*");

  await git.commit("updated dynamic html");

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

  await new Promise((resolve) => setTimeout(resolve, 20000));

  const artifactsResponse = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/artifacts`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  const artifactsData = await artifactsResponse.json();

  return NextResponse.json({
    success: true,
    artifact: artifactsData,
  });

}