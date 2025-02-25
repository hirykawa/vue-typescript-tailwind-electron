# SoundScribe

Vue 3 + TypeScript + Tailwind CSS + Electron アプリケーション

## 機能

- Vue 3 による高速かつリアクティブな UI の構築
- TypeScript による型安全なコーディング
- Tailwind CSS によるモダンなデザイン
- Electron によるクロスプラットフォーム対応

## インストール

```bash
# 依存関係のインストール
npm install
```

## 開発

```bash
# 開発モードでの実行（Hot-reloadあり）
npm run electron:dev
```

## ビルド

```bash
# アプリケーションのビルド
npm run electron:build
```

ビルドされたアプリケーションは `build` ディレクトリに出力されます。

## プロジェクト構造

```
soundscribe/
├── build/            # ビルド成果物の出力先
├── dist/             # Viteのビルド成果物
├── public/           # 静的ファイル
├── src/
│   ├── main/         # Electronのメインプロセス
│   ├── preload/      # Electronのプリロードスクリプト
│   └── renderer/     # Vue.jsのレンダラープロセス
├── index.html        # エントリーポイントのHTML
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## ライセンス

ISC
