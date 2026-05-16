export async function checkLicense(
  packageName: string
) {

  try {

    const response =
      await fetch(
"https://raw.githubusercontent.com/tangailprinting-afk/apk-license-server2/refs/heads/main/licenses.json"
      );

    const licenses =
      await response.json();

    const appLicense =
      licenses[
        packageName
      ];

    if (
      appLicense &&
      appLicense.active === false
    ) {

      return false;
    }

    return true;

  } catch (error) {

    console.log(error);

    return true;
  }
}