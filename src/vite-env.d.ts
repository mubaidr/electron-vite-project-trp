/// <reference types="vite/client" />

interface Window {
  // expose in the `electron/preload/index.ts`
<<<<<<< Updated upstream
  ipcRenderer: import("electron").IpcRenderer
=======
  ipcRenderer: import("electron").IpcRenderer;
  puppeteer: {
    getRankings: (domain: string, keywords: string[]) => Promise<string[]>;
  };
>>>>>>> Stashed changes
}
