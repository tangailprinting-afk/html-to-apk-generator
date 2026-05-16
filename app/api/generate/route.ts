import AdmZip from "adm-zip";

import { NextResponse } from "next/server";

import {
  updateGitHubFile,
  triggerWorkflow,
  uploadBinaryFile,
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

    const zipFile =
      formData.get(
        "zipFile"
      ) as File;

    // ONESIGNAL SCRIPT

    const oneSignalScript =
`
<script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"></script>

<script>

window.OneSignalDeferred =
  window.OneSignalDeferred || [];

OneSignalDeferred.push(
  async function (OneSignal) {

    await OneSignal.init({

      appId:
        "cf9a26bb-42ee-439b-a8d1-bb3ca6ca6d06",

      notifyButton: {
        enable: true,
      },

      allowLocalhostAsSecureOrigin: true,
    });
  }
);

</script>
`;

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

    // ZIP WEBSITE

    if (zipFile) {

      const zipBytes =
        await zipFile.arrayBuffer();

      const zip =
        new AdmZip(
          Buffer.from(zipBytes)
        );

      const entries =
        zip.getEntries();

      for (const entry of entries) {

        if (
          entry.isDirectory
        ) {
          continue;
        }

        const fileName =
          entry.entryName;

        const fileData =
          entry.getData();

        let finalData =
          fileData;

        // AUTO INSERT ONESIGNAL

        if (
          fileName ===
          "index.html"
        ) {

          const html =
            fileData.toString(
              "utf8"
            );

          const updatedHtml =
            html.replace(
              "</body>",
              `${oneSignalScript}</body>`
            );

          finalData =
            Buffer.from(
              updatedHtml
            );
        }

        const base64 =
          finalData.toString(
            "base64"
          );

        await uploadBinaryFile(
          `public/${fileName}`,
          base64,
          `updated ${fileName}`
        );
      }

    } else {

      // NORMAL HTML

      const finalHtml =
        htmlCode.replace(
          "</body>",
          `${oneSignalScript}</body>`
        );

      await updateGitHubFile(
        "public/app.html",
        finalHtml,
        "updated html"
      );
    }

    // UPDATE ICON

    if (icon) {

      const bytes =
        await icon.arrayBuffer();

      const base64 =
        Buffer.from(
          bytes
        ).toString("base64");

      await uploadBinaryFile(
        "resources/icon.png",
        base64,
        "updated icon"
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

  plugins: {
    OneSignal: {
      appId:
        "cf9a26bb-42ee-439b-a8d1-bb3ca6ca6d06",
    },
  },
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