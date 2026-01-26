import { boot } from "quasar/wrappers";
import { nativeBridge } from "src/common/native-bridge";
// import { updatePushToken } from 'src/api/user' // Assume this exists

export default boot(({ store }) => {
  // 1. Define Callback for Native
  window.onNativePushToken = async (token: string) => {
    console.log("Received Push Token:", token);
    try {
      // if (userStore.isAuthenticated) {
      //    await updatePushToken(token)
      // }
      // Store in localStorage for later sync
      localStorage.setItem("fcm_token", token);
    } catch (e) {
      console.error("Failed to sync push token", e);
    }
  };

  // 2. Request Token
  // Wait a bit for native webview to be fully ready
  setTimeout(() => {
    nativeBridge.registerPushToken();
  }, 1000);
});
