"use client";

import { useState } from "react";

export default function Home() {

  const [appName, setAppName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [htmlCode, setHtmlCode] = useState("");

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

    console.log(data);

    alert(data.message);

  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-5">
      
      <div className="w-full max-w-2xl bg-zinc-900 p-6 rounded-2xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          HTML To APK Generator
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="App Name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
          />

          <input
            type="text"
            placeholder="Package Name"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
          />

          <textarea
            placeholder="Paste HTML Code"
            rows={10}
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
          />

          <button
            onClick={generateAPK}
            className="w-full bg-green-500 hover:bg-green-600 p-3 rounded-xl font-bold"
          >
            Generate APK
          </button>

        </div>

      </div>

    </main>
  );
}