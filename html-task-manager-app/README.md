# TaskManager - 分離版（HTML/CSS/JavaScript）

HTML/CSS/JavaScriptで構成されたタスク管理アプリケーション

## ファイル構成

```
separated/
├── index.html          # メインHTMLファイル
├── css/
│   └── style.css      # スタイルシート
├── js/
│   └── app.js         # JavaScriptロジック
└── README.md          # このファイル
```

## 使い方

### 起動方法

1. `index.html` をダブルクリック
2. デフォルトのブラウザで自動的に開きます
3. すぐに使用開始できます！

**または**

右クリック → 「プログラムから開く」 → お好みのブラウザを選択

## 特徴

**メンテナンス性が高い**
- HTML、CSS、JavaScriptが分離されているため、編集しやすい
- コードの可読性が向上
- チーム開発に適している

**デバッグしやすい**
- ブラウザの開発者ツールで各ファイルを個別に確認可能
- エラーの特定が容易

**拡張しやすい**
- 新しい機能の追加が簡単
- CSSやJavaScriptの変更が他に影響しにくい

### 注意事項

- **フォルダ構造を維持してください**
  - `css/style.css` と `js/app.js` の相対パスが重要
  - ファイルを移動すると動作しなくなります

- **すべてのファイルを同じ場所に配置**
  ```
  separated/
  ├── index.html
  ├── css/
  │   └── style.css
  └── js/
      └── app.js
  ```

## カスタマイズ

### スタイルの変更

`css/style.css` を編集してデザインをカスタマイズできます。

例: カンバンボードの高さを変更
```css
.kanban-column {
    min-height: 400px;
    max-height: 800px;  /* 600px → 800px に変更 */
    overflow-y: auto;
}
```

### 機能の追加

`js/app.js` を編集して新しい機能を追加できます。

例: 検索機能の追加
```javascript
function searchTasks(keyword) {
    const data = loadTasks();
    return data.tasks.filter(task => 
        task.title.includes(keyword) || 
        task.description.includes(keyword)
    );
}
```

### HTMLの変更

`index.html` を編集してレイアウトを変更できます。


## 開発者向け情報

### ファイルの役割

#### index.html
- アプリケーションの構造を定義
- Bootstrap CDNの読み込み
- 外部CSS/JSファイルの読み込み

#### css/style.css
- カスタムスタイルの定義
- レスポンシブデザインの調整
- アニメーション効果

#### js/app.js
- アプリケーションのロジック
- データ管理（LocalStorage）
- UI描画
- イベント処理

### コード構造

```javascript
// データ層
- loadTasks()
- saveTasks()
- initializeData()

// ビジネスロジック層
- createTask()
- updateTask()
- deleteTask()
- getTaskById()
- getTasksByStatus()

// プレゼンテーション層
- renderTaskList()
- renderTaskDetail()
- renderTaskForm()
- showMessage()

// ルーター
- navigateTo()

// イベントハンドラー
- handleFormSubmit()
- handleDelete()
```

## トラブルシューティング

### CSSが適用されない

**原因**: ファイルパスが間違っている

**解決方法**:
1. `index.html` と同じ階層に `css` フォルダがあることを確認
2. `css` フォルダ内に `style.css` があることを確認

### JavaScriptが動作しない

**原因**: ファイルパスが間違っている

**解決方法**:
1. `index.html` と同じ階層に `js` フォルダがあることを確認
2. `js` フォルダ内に `app.js` があることを確認
3. ブラウザのコンソールでエラーを確認

### ファイルを移動したら動かなくなった

**原因**: 相対パスが壊れた

**解決方法**:
1. 元のフォルダ構造に戻す
2. または、`index.html` 内のパスを修正:
   ```html
   <link href="css/style.css" rel="stylesheet">
   <script src="js/app.js"></script>
   ```

## バージョン管理

Git などのバージョン管理システムを使用する場合:

```bash
# 初期化
git init

# ファイルを追加
git add index.html css/style.css js/app.js

# コミット
git commit -m "Initial commit"
```

## 📄 ライセンス

このプロジェクトはデモ用途として作成されています。

---

**Made with by IBM Bob**