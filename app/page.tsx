"use client";

import { useState } from "react";

export default function Home() {

  const [appName, setAppName] =
    useState("");

  const [
    packageName,
    setPackageName,
  ] = useState("");

  const [htmlCode, setHtmlCode] =
    useState("");

  const [icon, setIcon] =
    useState<File | null>(null);
    const [zipFile, setZipFile] =
  useState<File | null>(null);

  const [
    downloadLink,
    setDownloadLink,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState("");

  const generateAPK =
    async () => {

      try {

        setLoading(true);

        setStatus(
          "Uploading Files..."
        );

        const formData =
          new FormData();

        formData.append(
          "appName",
          appName
        );

        formData.append(
          "packageName",
          packageName
        );

        formData.append(
          "htmlCode",
          htmlCode
        );

        if (icon) {

          formData.append(
            "icon",
            icon
          );
        }
        if (zipFile) {

  formData.append(
    "zipFile",
    zipFile
  );
}

        const response =
          await fetch(
            "/api/generate",
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (!data.success) {

          alert(
            data.error
          );

          setLoading(false);

          return;
        }

        const runId =
          data.runId;

        setStatus(
          "Starting Cloud Build..."
        );

        let completed =
          false;

        while (!completed) {

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                5000
              )
          );

          const statusResponse =
            await fetch(
              `/api/status?runId=${runId}`
            );

          const statusData =
            await statusResponse.json();

          // QUEUED

          if (
            statusData.status ===
            "queued"
          ) {

            setStatus(
              "Build Queued..."
            );

            continue;
          }

          // BUILDING

          if (
            statusData.status ===
            "building"
          ) {

            setStatus(
              "Building APK... Please wait 2-3 minutes..."
            );

            continue;
          }

          // FAILED

          if (
            statusData.status ===
            "failed"
          ) {

            alert(
              "APK Build Failed"
            );

            setLoading(false);

            return;
          }

          // SUCCESS

          if (
            statusData.status ===
            "completed"
          ) {

            setStatus(
              "APK Ready"
            );

            setDownloadLink(
              statusData.downloadUrl
            );

            completed =
              true;
          }
        }

        setLoading(false);

      } catch (error) {

        console.log(error);

        alert(
          "Something went wrong"
        );

        setLoading(false);
      }
    };

  return (

    <main className="min-h-screen bg-black flex items-center justify-center p-5">

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-xl flex flex-col gap-5 shadow-2xl">

        <h1 className="text-white text-4xl font-bold text-center">
          HTML To APK Generator
        </h1>

        <p className="text-zinc-400 text-center">
          Convert HTML into Android APK Online
        </p>

        <input
          type="text"
          placeholder="App Name"
          value={appName}
          onChange={(e) =>
            setAppName(
              e.target.value
            )
          }
          className="bg-zinc-800 text-white p-4 rounded-2xl outline-none"
        />

        <input
          type="text"
          placeholder="Package Name (com.example.app)"
          value={packageName}
          onChange={(e) =>
            setPackageName(
              e.target.value
            )
          }
          className="bg-zinc-800 text-white p-4 rounded-2xl outline-none"
        />

        <textarea
          placeholder="Paste HTML Code"
          value={htmlCode}
          onChange={(e) =>
            setHtmlCode(
              e.target.value
            )
          }
          className="bg-zinc-800 text-white p-4 rounded-2xl outline-none h-64"
        />

        <input
          type="file"
          accept="image/png"
          onChange={(e) => {

            if (
              e.target.files?.[0]
            ) {

              setIcon(
                e.target.files[0]
              );
            }
          }}
          className="bg-zinc-800 text-white p-4 rounded-2xl"
        />

<input
  type="file"
  accept=".zip"
  onChange={(e) => {

    if (
      e.target.files?.[0]
    ) {

      setZipFile(
        e.target.files[0]
      );
    }
  }}
  className="bg-zinc-800 text-white p-4 rounded-2xl"
/>


        <button
          onClick={
            generateAPK
          }
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 transition-all text-white font-bold p-4 rounded-2xl"
        >

          {loading
            ? "Processing..."
            : "Generate APK"}

        </button>

        {status && (

          <div className="bg-zinc-800 text-zinc-300 text-center p-4 rounded-2xl">

            {status}

          </div>

        )}

        {downloadLink && (

          <a
            href={downloadLink}
            target="_blank"
            className="bg-blue-500 hover:bg-blue-600 transition-all text-white font-bold p-4 rounded-2xl text-center"
          >
            Download APK
          </a>

        )}

      </div>

    </main>
  );
}