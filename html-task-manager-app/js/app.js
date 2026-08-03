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

/**
 * データをリセットして初期状態に戻す
 */
function handleReset() {
    if (confirm('データを初期状態にリセットします。現在のタスクはすべて削除されます。よろしいですか？')) {
        localStorage.removeItem(STORAGE_KEY);
        cachedData = null;
        initializeData();
        showMessage('データをリセットしました', 'success');
        navigateTo('list');
    }
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
