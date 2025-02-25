import { app, BrowserWindow, shell, ipcMain } from "electron";
import { join } from "path";

// アプリケーションのシングルインスタンスロックを確保
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  let mainWindow = null;

  // BrowserWindowの作成関数
  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, "../preload/index.js"),
      },
    });

    // ビルドしたVueアプリのHTMLファイルを読み込む
    mainWindow.loadFile(join(__dirname, "../../dist/index.html"));

    // 外部リンクはデフォルトブラウザで開く
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith("https:")) {
        shell.openExternal(url);
      }
      return { action: "deny" };
    });

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  }

  // レンダラープロセスからのメッセージを処理
  ipcMain.on("message", (event, message) => {
    console.log("レンダラーからのメッセージを受信:", message);
    // メッセージに応答
    if (mainWindow) {
      mainWindow.webContents.send(
        "message",
        `メインプロセスより応答: ${message} を受信しました！`
      );
    }
  });

  // Electronの初期化が完了したらウィンドウを作成
  app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
      // macOSでは、ドックアイコンをクリックしたときに他に開いているウィンドウがない場合、
      // アプリケーションでウィンドウを再作成するのが一般的です。
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  // すべてのウィンドウが閉じられたときにアプリケーションを終了
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}
