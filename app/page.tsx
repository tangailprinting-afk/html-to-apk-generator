"use client";

import { useState } from "react";

export default function Home() {

  const [appName, setAppName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const generateAPK = async () => {

    if (!appName || !packageName || !htmlCode) {
      alert("সব তথ্য পূরণ করুন");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("appName", appName);
    formData.append("packageName", packageName);
    formData.append("htmlCode", htmlCode);

    if (icon) {
      formData.append("icon", icon);
    }

    try {

      const response = await fetch(
        "/api/generate",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      const artifact =
        data.artifact.artifacts[0];

      setDownloadLink(
        artifact.archive_download_url
      );

      alert("APK Successfully Generated");

    } catch (error) {

      alert("Build Failed");

    }

    setLoading(false);

  };

  return (

    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-5">

      <div className="w-full max-w-3xl bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-5xl font-black text-white mb-3">
            HTML TO APK
          </h1>

          <p className="text-zinc-400 text-lg">
            Convert HTML Code into Android APK
          </p>

        </div>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="App Name"
            value={appName}
            onChange={(e) =>
              setAppName(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-5 rounded-2xl outline-none focus:border-green-500"
          />

          <input
            type="text"
            placeholder="Package Name (com.example.app)"
            value={packageName}
            onChange={(e) =>
              setPackageName(e.target.value)
            }
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-5 rounded-2xl outline-none focus:border-green-500"
          />

          <textarea
            placeholder="Paste Your HTML Code"
            value={htmlCode}
            onChange={(e) =>
              setHtmlCode(e.target.value)
            }
            className="w-full h-80 bg-zinc-800 border border-zinc-700 text-white p-5 rounded-2xl outline-none focus:border-green-500"
          />

          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5">

            <p className="text-white font-bold mb-3">
              Upload App Icon (PNG)
            </p>

            <input
              type="file"
              accept="image/png"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setIcon(e.target.files[0]);
                }
              }}
              className="text-white"
            />

          </div>

          <button
            onClick={generateAPK}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition-all text-white p-5 rounded-2xl font-black text-2xl"
          >

            {loading
              ? "Building APK..."
              : "Generate APK"}

          </button>

          {downloadLink && (

            <a
              href={downloadLink}
              target="_blank"
              className="block w-full bg-blue-500 hover:bg-blue-600 transition-all text-center text-white p-5 rounded-2xl font-black text-2xl"
            >
              Download APK
            </a>

          )}

        </div>

      </div>

    </main>

  );

}