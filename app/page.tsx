"use client";

import { useState } from "react";

export default function Home() {

  const [
    appName,
    setAppName
  ] = useState("");

  const [
    packageName,
    setPackageName
  ] = useState("");

  const [
    htmlCode,
    setHtmlCode
  ] = useState("");

  const [
    icon,
    setIcon
  ] = useState<File | null>(
    null
  );

  const [
    zipFile,
    setZipFile
  ] = useState<File | null>(
    null
  );

  async function generateAPK() {

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

    alert(
      JSON.stringify(data)
    );
  }

  return (

    <div
      style={{
        padding: 20,
        fontFamily:
          "sans-serif",
      }}
    >

      <h1>
        HTML TO APK
      </h1>

      <input
        placeholder="App Name"
        value={appName}
        onChange={(e) =>
          setAppName(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
        }}
      />

      <input
        placeholder="Package Name"
        value={packageName}
        onChange={(e) =>
          setPackageName(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
        }}
      />

      <textarea
        placeholder="Paste HTML"
        value={htmlCode}
        onChange={(e) =>
          setHtmlCode(
            e.target.value
          )
        }
        style={{
          width: "100%",
          height: 200,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <input
        type="file"
        accept=".png"
        onChange={(e) => {

          if (
            e.target.files?.[0]
          ) {

            setIcon(
              e.target.files[0]
            );
          }
        }}
      />

      <br />
      <br />

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
      />

      <br />
      <br />

      <button
        onClick={
          generateAPK
        }
        style={{
          padding: 15,
          width: "100%",
        }}
      >

        GENERATE APK

      </button>

    </div>
  );
}