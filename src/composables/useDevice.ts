import { computed } from "vue";

const isRunningInStandalone = computed(() => {
  return (
    (window.navigator as any).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
});

const currentBrowser = computed(() => {
  const userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "Safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "Opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "Edge";
  } else {
    browserName = "No browser detection";
  }
  return browserName;
});

const openShare = async () => {
  if ((navigator as any).canShare) {
    navigator
      .share()
      .then(() => console.log("Share was successful."))
      .catch((error) => console.log("Sharing failed", error));
  } else {
    console.log(`Your system doesn't support sharing.`);
  }
};

const openInstallPrompt = async () => {
  const deferredPrompt = (window as any).deferredPrompt;
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
    });
  }
};

const installApp = async () => {
  if (isRunningInStandalone.value) {
    console.log("App is already installed");
    return;
  }
  const installPromptEvent = (window as any).installPromptEvent;
  if (installPromptEvent) {
    openInstallPrompt();
  }
};

export function useDevice() {
  return {
    isRunningInStandalone,
    currentBrowser,
    openShare,
    openInstallPrompt,
    installApp,
  };
}
