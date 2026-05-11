"use client";

import { useState } from "react";

export default function Home() {

  const [appName, setAppName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [downloadLink, setDownloadLink] = useState("");

  const generateAPK = async () => {

    const response = await fetch("/api/generate", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        appName,
        packageName,
        htmlCode,
      }),
    });

    const data = await response.json();

    const artifact =
      data.artifact.artifacts[0];

    setDownloadLink(
      artifact.archive_download_url
    );

    alert("APK Build Completed");
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-2xl w-[400px] flex flex-col gap-4">

        <h1 className="text-white text-4xl font-bold text-center">
          HTML To APK Generator
        </h1>

        <input
          type="text"
          placeholder="App Name"
          className="p-4 rounded-xl bg-zinc-800 text-white"
          value={appName}
          onChange={(e) =>
            setAppName(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Package Name"
          className="p-4 rounded-xl bg-zinc-800 text-white"
          value={packageName}
          onChange={(e) =>
            setPackageName(e.target.value)
          }
        />

        <textarea
          placeholder="Paste HTML Code"
          className="p-4 rounded-xl bg-zinc-800 text-white h-60"
          value={htmlCode}
          onChange={(e) =>
            setHtmlCode(e.target.value)
          }
        />

        <button
          onClick={generateAPK}
          className="bg-green-500 text-white p-4 rounded-xl font-bold"
        >
          Generate APK
        </button>

        {downloadLink && (

          <a
            href={downloadLink}
            target="_blank"
            className="bg-blue-500 text-white p-4 rounded-xl text-center font-bold"
          >
            Download APK
          </a>

        )}

      </div>

    </main>
  );
}