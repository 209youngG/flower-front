// Native Bridge Interface Definition

export interface NativeInterface {
  reload(): void;
  showToast(message: string): void;
  openCamera(): Promise<string>; // Returns Base64 image or file path
  registerPushToken(): void; // Triggers native to send token back
  vibrate(duration: number): void;
}

declare global {
  interface Window {
    wnInterface?: {
      reload: () => void;
      showToast: (msg: string) => void;
      openCamera: () => string; // Android returns string directly (sync/async issue handled by callback usually)
      registerPushToken: () => void;
      vibrate: (ms: number) => void;
    };
    webkit?: {
      messageHandlers?: {
        wnInterface?: {
          postMessage: (msg: any) => void;
        };
      };
    };
    // Callback for Native to call JS
    onNativeCameraResult?: (base64Data: string) => void;
    onNativePushToken?: (token: string) => void;
  }
}

class NativeBridge implements NativeInterface {
  private isAndroid = /Android/i.test(navigator.userAgent);
  private isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  constructor() {
    console.log(
      `NativeBridge initialized. Platform: ${
        this.isAndroid ? "Android" : this.isIOS ? "iOS" : "Web"
      }`
    );
  }

  reload(): void {
    if (this.isAndroid && window.wnInterface) {
      window.wnInterface.reload();
    } else if (this.isIOS && window.webkit?.messageHandlers?.wnInterface) {
      window.webkit.messageHandlers.wnInterface.postMessage({
        action: "reload",
      });
    } else {
      window.location.reload();
    }
  }

  showToast(message: string): void {
    if (this.isAndroid && window.wnInterface) {
      window.wnInterface.showToast(message);
    } else if (this.isIOS && window.webkit?.messageHandlers?.wnInterface) {
      window.webkit.messageHandlers.wnInterface.postMessage({
        action: "showToast",
        message,
      });
    } else {
      console.log("Toast:", message);
      // Fallback to Quasar notify if needed, but this method is specifically for NATIVE toast
    }
  }

  openCamera(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Setup global callback
      window.onNativeCameraResult = (data: string) => {
        resolve(data);
        delete window.onNativeCameraResult; // Cleanup
      };

      if (this.isAndroid && window.wnInterface) {
        window.wnInterface.openCamera();
      } else if (this.isIOS && window.webkit?.messageHandlers?.wnInterface) {
        window.webkit.messageHandlers.wnInterface.postMessage({
          action: "openCamera",
        });
      } else {
        console.log("Opening Web Camera Mock");
        // Mock success
        setTimeout(() => {
          if (window.onNativeCameraResult)
            window.onNativeCameraResult("base64_mock_image_data");
        }, 1000);
      }
    });
  }

  registerPushToken(): void {
    if (this.isAndroid && window.wnInterface) {
      window.wnInterface.registerPushToken();
    } else if (this.isIOS && window.webkit?.messageHandlers?.wnInterface) {
      window.webkit.messageHandlers.wnInterface.postMessage({
        action: "registerPushToken",
      });
    } else {
      console.log("Registering Push Token Mock");
    }
  }

  vibrate(duration: number): void {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }
}

export const nativeBridge = new NativeBridge();
