// ========================================
// 定数定義
// ========================================

const STORAGE_KEY = 'taskManagerData';

const TaskStatus = {
    TODO: { value: 'TODO', label: '未着手', color: 'secondary', icon: 'bi-list-task' },
    IN_PROGRESS: { value: 'IN_PROGRESS', label: '進行中', color: 'primary', icon: 'bi-arrow-repeat' },
    ON_HOLD: { value: 'ON_HOLD', label: '保留', color: 'warning', icon: 'bi-pause-circle' },
    DONE: { value: 'DONE', label: '完了', color: 'success', icon: 'bi-check-circle' }
};

const TaskPriority = {
    HIGH: { value: 'HIGH', label: '高', color: 'danger' },
    MEDIUM: { value: 'MEDIUM', label: '中', color: 'warning' },
    LOW: { value: 'LOW', label: '低', color: 'info' }
};

// ========================================
// データ層（Data Layer）
// ========================================

let cachedData = null;

/**
 * LocalStorageからタスクデータを読み込む
 */
function loadTasks() {
    if (cachedData) {
        return cachedData;
    }
    
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            cachedData = JSON.parse(data);
            return cachedData;
        }
    } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
    }
    
    return initializeData();
}

/**
 * タスクデータをLocalStorageに保存する
 */
function saveTasks(data) {
    try {
        cachedData = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('データの保存に失敗しました:', error);
        if (error.name === 'QuotaExceededError') {
            showMessage('ストレージの容量が不足しています', 'danger');
        } else {
            showMessage('データの保存に失敗しました', 'danger');
        }
    }
}

/**
 * 初期データを作成する
 */
function initializeData() {
    const now = new Date().toISOString();
    const initialData = {
        tasks: [
            {
                id: 1,
                title: 'Spring Bootの学習',
                description: 'Spring Bootの基礎を学習する',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                dueDate: '2026-03-01',
                createdAt: now,
                updatedAt: now
            },
            {
                id: 2,
                title: 'データベース設計',
                description: 'タスク管理アプリのDB設計を行う',
                status: 'DONE',
                priority: 'HIGH',
                dueDate: '2026-02-25',
                createdAt: now,
                updatedAt: now
            },
            {
                id: 3,
                title: '画面デザイン',
                description: 'UIのデザインを作成する',
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: '2026-03-05',
                createdAt: now,
                updatedAt: now
            },
            {
                id: 4,
                title: 'テスト実施',
                description: '単体テストと結合テストを実施する',
                status: 'ON_HOLD',
                priority: 'MEDIUM',
                dueDate: '2026-03-10',
                createdAt: now,
                updatedAt: now
            },
            {
                id: 5,
                title: 'ドキュメント作成',
                description: 'README.mdを作成する',
                status: 'TODO',
                priority: 'LOW',
                dueDate: '2026-03-15',
                createdAt: now,
                updatedAt: now
            }
        ],
        nextId: 6
    };
    saveTasks(initialData);
    return initialData;
}

// ========================================
// ビジネスロジック層（Business Logic Layer）
// ========================================

/**
 * 新しいタスクを作成する
 */
function createTask(taskData) {
    const data = loadTasks();
    const newTask = {
        id: data.nextId,
        title: taskData.title.trim(),
        description: taskData.description ? taskData.description.trim() : '',
        status: taskData.status || 'TODO',
        priority: taskData.priority || 'MEDIUM',
        dueDate: taskData.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    data.tasks.push(newTask);
    data.nextId++;
    saveTasks(data);
    return newTask;
}

/**
 * タスクを更新する
 */
function updateTask(id, updates) {
    const data = loadTasks();
    const taskIndex = data.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        throw new Error('タスクが見つかりません');
    }
    data.tasks[taskIndex] = {
        ...data.tasks[taskIndex],
        title: updates.title.trim(),
        description: updates.description ? updates.description.trim() : '',
        status: updates.status,
        priority: updates.priority,
        dueDate: updates.dueDate || null,
        updatedAt: new Date().toISOString()
    };
    saveTasks(data);
    return data.tasks[taskIndex];
}

/**
 * タスクを削除する
 */
function deleteTask(id) {
    const data = loadTasks();
    data.tasks = data.tasks.filter(t => t.id !== id);
    saveTasks(data);
}

/**
 * IDでタスクを取得する
 */
function getTaskById(id) {
    const data = loadTasks();
    return data.tasks.find(t => t.id === id) || null;
}

/**
 * ステータス別にタスクをグループ化する
 */
function getTasksByStatus() {
    const data = loadTasks();
    return {
        TODO: data.tasks.filter(t => t.status === 'TODO'),
        IN_PROGRESS: data.tasks.filter(t => t.status === 'IN_PROGRESS'),
        ON_HOLD: data.tasks.filter(t => t.status === 'ON_HOLD'),
        DONE: data.tasks.filter(t => t.status === 'DONE')
    };
}

// ========================================
// プレゼンテーション層（Presentation Layer）
// ========================================

/**
 * タスク一覧（カンバンボード）を描画する
 */
function renderTaskList() {
    const tasksByStatus = getTasksByStatus();
    
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>タスク一覧</h1>
            <button class="btn btn-primary" onclick="navigateTo('create')">
                <i class="bi bi-plus-circle"></i> 新規作成
            </button>
        </div>
        <div class="row g-3">
    `;
    
    // 各ステータス列を生成
    for (const [statusKey, statusConfig] of Object.entries(TaskStatus)) {
        const tasks = tasksByStatus[statusKey] || [];
        html += renderStatusColumn(statusKey, statusConfig, tasks);
    }
    
    html += '</div>';
    document.getElementById('main-content').innerHTML = html;
}

/**
 * ステータス列を描画する
 */
function renderStatusColumn(statusKey, statusConfig, tasks) {
    const taskCount = tasks.length;
    
    let html = `
        <div class="col-md-3">
            <div class="card bg-light h-100">
                <div class="card-header bg-${statusConfig.color} ${statusConfig.color === 'warning' ? '' : 'text-white'}">
                    <h5 class="mb-0">
                        <i class="bi ${statusConfig.icon}"></i>
                        ${statusConfig.label}
                        <span class="badge bg-white text-dark ms-2">${taskCount}</span>
                    </h5>
                </div>
                <div class="card-body p-2 kanban-column">
    `;
    
    if (tasks.length === 0) {
        html += `
            <div class="empty-column">
                <i class="bi bi-inbox"></i>
                <p class="mb-0">タスクなし</p>
            </div>
        `;
    } else {
        tasks.forEach(task => {
            html += renderTaskCard(task);
        });
    }
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    return html;
}

/**
 * タスクカードを描画する
 */
function renderTaskCard(task) {
    const priorityConfig = TaskPriority[task.priority];
    const description = task.description.length > 60 
        ? task.description.substring(0, 60) + '...' 
        : task.description;
    
    let dueDateHtml = '';
    if (task.dueDate) {
        const date = new Date(task.dueDate);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dueDateHtml = `
            <p class="card-text mb-2">
                <small class="text-muted">
                    <i class="bi bi-calendar"></i>
                    ${month}/${day}
                </small>
            </p>
        `;
    }
    
    return `
        <div class="card mb-2 shadow-sm task-card">
            <div class="card-body p-3">
                <h6 class="card-title mb-2">${escapeHtml(task.title)}</h6>
                <p class="card-text small text-muted mb-2">${escapeHtml(description)}</p>
                <div class="mb-2">
                    <span class="badge bg-${priorityConfig.color} ${priorityConfig.color === 'warning' ? 'text-dark' : ''}">${priorityConfig.label}</span>
                </div>
                ${dueDateHtml}
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary flex-fill" onclick="navigateTo('detail', ${task.id})">
                        <i class="bi bi-eye"></i> 詳細
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="navigateTo('edit', ${task.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * タスク詳細を描画する
 */
function renderTaskDetail(id) {
    const task = getTaskById(id);
    if (!task) {
        showMessage('タスクが見つかりません', 'danger');
        navigateTo('list');
        return;
    }
    
    const statusConfig = TaskStatus[task.status];
    const priorityConfig = TaskPriority[task.priority];
    
    const createdAt = formatDateTime(task.createdAt);
    const updatedAt = formatDateTime(task.updatedAt);
    const dueDate = task.dueDate ? task.dueDate : '未設定';
    
    const html = `
        <div class="mb-4">
            <h1>タスク詳細</h1>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label text-muted">ID</label>
                    <p class="mb-0">${task.id}</p>
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted">タイトル</label>
                    <p class="mb-0">${escapeHtml(task.title)}</p>
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted">説明</label>
                    <p class="mb-0">${escapeHtml(task.description) || '（説明なし）'}</p>
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted">ステータス</label>
                    <p class="mb-0">
                        <span class="badge bg-${statusConfig.color} ${statusConfig.color === 'warning' ? 'text-dark' : ''}">${statusConfig.label}</span>
                    </p>
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted">優先度</label>
                    <p class="mb-0">
                        <span class="badge bg-${priorityConfig.color} ${priorityConfig.color === 'warning' ? 'text-dark' : ''}">${priorityConfig.label}</span>
                    </p>
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted">期限</label>
                    <p class="mb-0">${dueDate}</p>
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted">作成日時</label>
                    <p class="mb-0">${createdAt}</p>
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted">更新日時</label>
                    <p class="mb-0">${updatedAt}</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-secondary" onclick="navigateTo('list')">
                        <i class="bi bi-arrow-left"></i> 一覧に戻る
                    </button>
                    <button class="btn btn-primary" onclick="navigateTo('edit', ${task.id})">
                        <i class="bi bi-pencil"></i> 編集
                    </button>
                    <button class="btn btn-danger" onclick="handleDelete(${task.id})">
                        <i class="bi bi-trash"></i> 削除
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

/**
 * タスク作成/編集フォームを描画する
 */
function renderTaskForm(mode, id = null) {
    let task = null;
    let title = 'タスク作成';
    
    if (mode === 'edit') {
        task = getTaskById(id);
        if (!task) {
            showMessage('タスクが見つかりません', 'danger');
            navigateTo('list');
            return;
        }
        title = 'タスク編集';
    }
    
    const html = `
        <div class="mb-4">
            <h1>${title}</h1>
        </div>
        <div class="card">
            <div class="card-body">
                <form id="task-form" onsubmit="handleFormSubmit(event, '${mode}', ${id})">
                    <div class="mb-3">
                        <label for="title" class="form-label">タイトル <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="title" name="title" 
                               value="${task ? escapeHtml(task.title) : ''}" 
                               maxlength="200" required>
                        <div class="form-text">最大200文字</div>
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">説明</label>
                        <textarea class="form-control" id="description" name="description" 
                                  rows="4">${task ? escapeHtml(task.description) : ''}</textarea>
                    </div>
                    <div class="mb-3">
                        <label for="status" class="form-label">ステータス <span class="text-danger">*</span></label>
                        <select class="form-select" id="status" name="status" required>
                            ${Object.entries(TaskStatus).map(([key, config]) => `
                                <option value="${config.value}" ${task && task.status === config.value ? 'selected' : ''}>
                                    ${config.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="priority" class="form-label">優先度 <span class="text-danger">*</span></label>
                        <select class="form-select" id="priority" name="priority" required>
                            ${Object.entries(TaskPriority).map(([key, config]) => `
                                <option value="${config.value}" ${task && task.priority === config.value ? 'selected' : ''}>
                                    ${config.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="dueDate" class="form-label">期限</label>
                        <input type="date" class="form-control" id="dueDate" name="dueDate" 
                               value="${task && task.dueDate ? task.dueDate : ''}">
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle"></i> 保存
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="navigateTo('list')">
                            <i class="bi bi-x-circle"></i> キャンセル
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

/**
 * メッセージを表示する
 */
function showMessage(message, type = 'success') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    const container = document.getElementById('message-container');
    container.innerHTML = alertHtml;
    
    // 5秒後に自動で消す
    setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// ========================================
// ルーター（Router）
// ========================================

/**
 * 画面遷移を行う
 */
function navigateTo(view, id = null) {
    // メッセージをクリア
    document.getElementById('message-container').innerHTML = '';
    
    switch (view) {
        case 'list':
            renderTaskList();
            break;
        case 'detail':
            renderTaskDetail(id);
            break;
        case 'create':
            renderTaskForm('create');
            break;
        case 'edit':
            renderTaskForm('edit', id);
            break;
        default:
            renderTaskList();
    }
    
    // ページトップにスクロール
    window.scrollTo(0, 0);
}

// ========================================
// イベントハンドラー
// ========================================

/**
 * フォーム送信処理
 */
function handleFormSubmit(event, mode, id) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const taskData = {
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        priority: formData.get('priority'),
        dueDate: formData.get('dueDate')
    };
    
    // バリデーション
    if (!taskData.title || taskData.title.trim() === '') {
        showMessage('タイトルは必須です', 'danger');
        return;
    }
    if (taskData.title.length > 200) {
        showMessage('タイトルは200文字以内で入力してください', 'danger');
        return;
    }
    
    try {
        if (mode === 'create') {
            createTask(taskData);
            showMessage('タスクを作成しました', 'success');
        } else if (mode === 'edit') {
            updateTask(id, taskData);
            showMessage('タスクを更新しました', 'success');
        }
        navigateTo('list');
    } catch (error) {
        console.error('エラーが発生しました:', error);
        showMessage('エラーが発生しました: ' + error.message, 'danger');
    }
}

/**
 * タスク削除の確認と実行
 */
function handleDelete(id) {
    const task = getTaskById(id);
    if (!task) {
        showMessage('タスクが見つかりません', 'danger');
        return;
    }
    
    if (confirm(`タスク「${task.title}」を削除してもよろしいですか？`)) {
        try {
            deleteTask(id);
            showMessage('タスクを削除しました', 'success');
            navigateTo('list');
        } catch (error) {
            console.error('エラーが発生しました:', error);
            showMessage('エラーが発生しました: ' + error.message, 'danger');
        }
    }
}

// ========================================
// ユーティリティ関数
// ========================================

/**
 * HTMLエスケープ処理
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 日時フォーマット
 */
function formatDateTime(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// ========================================
// 初期化処理
// ========================================

/**
 * アプリケーション初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初期データの読み込み
    loadTasks();
    
    // 初期画面の表示
    navigateTo('list');
});

/**
 * グローバルエラーハンドラー
 */
window.addEventListener('error', function(event) {
    console.error('エラーが発生しました:', event.error);
    showMessage('予期しないエラーが発生しました', 'danger');
});

// Made with Bob
