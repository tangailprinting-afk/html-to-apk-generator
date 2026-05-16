const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};

export async function getFileSha(
  path: string
) {

  const response = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${path}`,
    {
      headers,
    }
  );

  if (
    response.status === 404
  ) {
    return null;
  }

  const data =
    await response.json();

  return data.sha;
}

export async function updateGitHubFile(
  path: string,
  content: string,
  message: string
) {

  const sha =
    await getFileSha(path);

  await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",

      headers,

      body: JSON.stringify({
        message,
        content: Buffer.from(
          content
        ).toString("base64"),
        sha,
      }),
    }
  );
}

export async function triggerWorkflow() {

  await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/workflows/android.yml/dispatches`,
    {
      method: "POST",

      headers,

      body: JSON.stringify({
        ref: "main",
      }),
    }
  );

  await new Promise((resolve) =>
    setTimeout(resolve, 5000)
  );

  const runsResponse =
    await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs`,
      {
        headers,
      }
    );

  const runsData =
    await runsResponse.json();

  return runsData.workflow_runs[0].id;
}

export async function getWorkflowStatus(
  runId: string
) {

  const response =
    await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}`,
      {
        headers,
      }
    );

  const data =
    await response.json();

  return data;
}
export async function uploadBinaryFile(
  path: string,
  base64Content: string,
  message: string
) {

  const sha =
    await getFileSha(path);

  await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",

      headers,

      body: JSON.stringify({
        message,
        content:
          base64Content,
        sha,
      }),
    }
  );
}