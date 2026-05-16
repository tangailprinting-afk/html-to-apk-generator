"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  initBridge
} from "@/src/runtime/bridge";

import {
  checkLicense
} from "@/src/runtime/license";

export default function Home() {

  const [
    ready,
    setReady
  ] = useState(false);

  const [
    blocked,
    setBlocked
  ] = useState(false);

  useEffect(() => {

    async function start() {

      try {

        // INIT NATIVE BRIDGE

        await initBridge();

        // PACKAGE NAME

        const packageName =
          "com.rabbi.app";

        // CHECK LICENSE

        const active =
          await checkLicense(
            packageName
          );

        if (!active) {

          setBlocked(
            true
          );

          return;
        }

        setReady(
          true
        );

      } catch (error) {

        console.log(error);
      }
    }

    start();

  }, []);

  // LOCK SCREEN

  if (blocked) {

    return (

      <div
        style={{

          width: "100vw",

          height: "100vh",

          background: "#000",

          color: "#fff",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          flexDirection:
            "column",

          fontFamily:
            "sans-serif",
        }}
      >

        <h1>
          PAYMENT REQUIRED
        </h1>

        <p>
          Please Contact Developer
        </p>

      </div>
    );
  }

  // LOADING

  if (!ready) {

    return (

      <div
        style={{

          width: "100vw",

          height: "100vh",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          fontSize: "22px",

          fontFamily:
            "sans-serif",
        }}
      >

        Initializing Runtime...

      </div>
    );
  }

  // GENERATED APP

  return (

    <iframe

      src="/generated/index.html"

      style={{

        width: "100vw",

        height: "100vh",

        border: "none",
      }}

    />

  );
}