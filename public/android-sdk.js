const FEATURES =
  window.APP_FEATURES || {};

// STORAGE

if (
  FEATURES.storage
) {

  window.AndroidStorage = {

    async save(
      path,
      data
    ) {

      localStorage.setItem(
        path,
        data
      );

      return true;
    },

    async read(path) {

      return localStorage.getItem(
        path
      );
    },

    async remove(path) {

      localStorage.removeItem(
        path
      );

      return true;
    }
  };
}

// SQLITE

if (
  FEATURES.sqlite
) {

  window.AndroidDB = {

    async addNote(
      title,
      content
    ) {

      const notes =
        JSON.parse(
          localStorage.getItem(
            "notes"
          ) || "[]"
        );

      notes.push({

        id:
          Date.now(),

        title,

        content,
      });

      localStorage.setItem(
        "notes",
        JSON.stringify(notes)
      );

      return true;
    },

    async getNotes() {

      return JSON.parse(
        localStorage.getItem(
          "notes"
        ) || "[]"
      );
    },

    async deleteNote(
      id
    ) {

      const notes =
        JSON.parse(
          localStorage.getItem(
            "notes"
          ) || "[]"
        );

      const filtered =
        notes.filter(
          (n) =>
            n.id !== id
        );

      localStorage.setItem(
        "notes",
        JSON.stringify(
          filtered
        )
      );

      return true;
    }
  };
}

// DEVICE

if (
  FEATURES.device
) {

  window.AndroidDevice = {

    async getInfo() {

      return {

        platform:
          navigator.platform,

        userAgent:
          navigator.userAgent,
      };
    }
  };
}

// NETWORK

if (
  FEATURES.network
) {

  window.AndroidNetwork = {

    async isOnline() {

      return navigator.onLine;
    }
  };
}

// SHARE

if (
  FEATURES.share
) {

  window.AndroidShare = {

    async share(
      title,
      text
    ) {

      if (
        navigator.share
      ) {

        await navigator.share({

          title,

          text,
        });
      }
    }
  };
}

// LICENSE CHECK

(async () => {

  try {

    const PACKAGE_NAME =
      window.APP_PACKAGE;

    const response =
      await fetch(
"https://raw.githubusercontent.com/tangailprinting-afk/apk-license-server2/refs/heads/main/licenses.json"
      );

    const licenses =
      await response.json();

    const appLicense =
      licenses[
        PACKAGE_NAME
      ];

    if (
      appLicense &&
      appLicense.active === false
    ) {

      document.body.innerHTML =
`
<div style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:#000;
color:#fff;
display:flex;
justify-content:center;
align-items:center;
font-size:24px;
z-index:999999;
text-align:center;
padding:20px;
font-family:sans-serif;
">

<div>

<h1>
PAYMENT REQUIRED
</h1>

<p>
Please Contact Developer
</p>

<p>
01740-493702
</p>

</div>

</div>
`;
    }

  } catch (error) {

    console.log(
      "License Check Error",
      error
    );
  }

})();