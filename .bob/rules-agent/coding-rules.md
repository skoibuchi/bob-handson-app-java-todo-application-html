# Coding Rules for TaskManager App

このファイルはハンズオン用のコーディングルールです。
AIに変更を依頼する際は、必ずこのルールに従ったコードを生成してもらってください。

---

## 1. コメント規則

- すべての関数には JSDoc コメントを **英語** で記述すること
- `@param` と `@returns` を必ず明記すること

**Good:**
```js
/**
 * Creates a new task and saves it to storage.
 * @param {Object} taskData - The task data to create
 * @returns {Object} The created task object
 */
function createTask(taskData) { ... }
```

**Bad:**
```js
/**
 * タスクを作成する
 */
function createTask(taskData) { ... }
```

---

## 2. 変数命名規則

ローカル変数には型を示すプレフィックスを付けること。

| プレフィックス | 型 | 例 |
|---|---|---|
| `str` | string | `strTitle`, `strMessage` |
| `num` | number | `numId`, `numIndex` |
| `b` | boolean | `bIsValid`, `bFound` |
| `arr` | array | `arrTasks`, `arrFiltered` |
| `obj` | object | `objTask`, `objData` |

**Good:**
```js
const strTitle = taskData.title.trim();
const numIndex = data.tasks.findIndex(t => t.id === id);
const arrFiltered = data.tasks.filter(t => t.status === 'TODO');
```

**Bad:**
```js
const title = taskData.title.trim();
const taskIndex = data.tasks.findIndex(t => t.id === id);
const tasks = data.tasks.filter(t => t.status === 'TODO');
```

---

## 3. エラーメッセージ規則

`throw new Error()` のメッセージは **英語** で記述すること。

**Good:**
```js
throw new Error('Task not found');
```

**Bad:**
```js
throw new Error('タスクが見つかりません');
```
