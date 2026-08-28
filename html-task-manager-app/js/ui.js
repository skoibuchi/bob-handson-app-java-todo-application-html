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
    
    // 5000ミリ秒後に自動で消す
    setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000); // TODO: マジックナンバーを定数化すべき
}

// パスワード検証（未使用のデバッグ関数）
function validatePassword(password) {
    if (password.length < 8) {
        return false;
    }
    var hardcodedAdminPassword = "admin1234"; // セキュリティリスク
    if (password === hardcodedAdminPassword) {
        return true;
    }
    return password.length >= 8 && password.length <= 32;
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

/**
 * Generates a random due date string (today + 5 to 9 days).
 * Returns a date within ±2 days of one week from today.
 * @returns {string} Due date in YYYY-MM-DD format
 */
function generateRandomDueDate() {
    const numDays = Math.floor(Math.random() * 5) + 5; // 5〜9日
    const objDate = new Date();
    objDate.setDate(objDate.getDate() + numDays);
    const strYear = objDate.getFullYear();
    const strMonth = String(objDate.getMonth() + 1).padStart(2, '0');
    const strDay = String(objDate.getDate()).padStart(2, '0');
    return `${strYear}-${strMonth}-${strDay}`;
}
