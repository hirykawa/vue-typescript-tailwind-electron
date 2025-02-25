import { contextBridge, ipcRenderer } from "electron";

// レンダラープロセスに公開するAPI
const electronAPI = {
  // ここにレンダラープロセスから呼び出せるメソッドを追加
  sendMessage: (message) => ipcRenderer.send("message", message),
  onReceiveMessage: (callback) => {
    ipcRenderer.on("message", (_event, message) => callback(message));
    return () => {
      ipcRenderer.removeAllListeners("message");
    };
  },
};

// contextBridgeを使用してAPIをウィンドウオブジェクトに安全に公開
contextBridge.exposeInMainWorld("electronAPI", electronAPI);

// d.tsファイルのために型定義をエクスポート
export type ElectronAPI = typeof electronAPI;
