const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 必要なディレクトリがなければ作成
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ディレクトリの作成
ensureDir(path.join(__dirname, "../dist/main"));
ensureDir(path.join(__dirname, "../dist/preload"));

// TypeScriptファイルをJavaScriptに変換
const compileTs = (srcFile, destFile) => {
  try {
    // tscコマンドを使用してTypeScriptをコンパイル
    execSync(
      `npx tsc ${srcFile} --outDir ${path.dirname(
        destFile
      )} --target ES2018 --module CommonJS --esModuleInterop true --skipLibCheck true`
    );

    // コンパイル後のファイルパスの調整
    const compiledFile = path.join(
      path.dirname(destFile),
      path.basename(srcFile).replace(".ts", ".js")
    );

    // ファイル名が異なる場合は名前を変更
    if (compiledFile !== destFile && fs.existsSync(compiledFile)) {
      fs.renameSync(compiledFile, destFile);
    }

    console.log(`Compiled: ${srcFile} -> ${destFile}`);
  } catch (error) {
    console.error(`Compilation failed for ${srcFile}:`, error.message);

    // エラー時は手動で簡易変換を行う（最低限の変換）
    let content = fs.readFileSync(srcFile, "utf8");

    // 簡易的な変換
    content = content
      // import文をrequireに変換
      .replace(
        /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g,
        (_, imports, module) => `const { ${imports} } = require('${module}')`
      )
      .replace(
        /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g,
        (_, importName, module) => `const ${importName} = require('${module}')`
      )
      // 型アノテーションを削除
      .replace(/:\s*[A-Za-z0-9_<>|&[\]]+(\s*[=,);])/g, "$1")
      .replace(/:\s*[A-Za-z0-9_<>|&[\]]+\s*=>/g, "=>")
      .replace(/:\s*[A-Za-z0-9_<>|&[\]]+$/gm, "")
      // export文を変換
      .replace(/export\s+\{\s*([^}]+)\s*\}/g, "module.exports = { $1 }")
      .replace(/export\s+default/g, "module.exports =")
      .replace(/export\s+type.*?[;\n]/g, "")
      .replace(/interface\s+[^{]*\{[^}]*\}/g, "");

    fs.writeFileSync(destFile, content, "utf8");
    console.log(`Manual fallback compilation: ${srcFile} -> ${destFile}`);
  }
};

// メインプロセスのビルド
compileTs(
  path.join(__dirname, "../src/main/index.ts"),
  path.join(__dirname, "../dist/main/index.js")
);

// プリロードスクリプトのビルド
compileTs(
  path.join(__dirname, "../src/preload/index.ts"),
  path.join(__dirname, "../dist/preload/index.js")
);

console.log("Electron scripts built successfully!");
