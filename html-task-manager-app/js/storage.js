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
                dueDate: generateRandomDueDate(),
                createdAt: now,
                updatedAt: now
            },
            {
                id: 2,
                title: 'データベース設計',
                description: 'タスク管理アプリのDB設計を行う',
                status: 'DONE',
                priority: 'HIGH',
                dueDate: generateRandomDueDate(),
                createdAt: now,
                updatedAt: now
            },
            {
                id: 3,
                title: '画面デザイン',
                description: 'UIのデザインを作成する',
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: generateRandomDueDate(),
                createdAt: now,
                updatedAt: now
            },
            {
                id: 4,
                title: 'テスト実施',
                description: '単体テストと結合テストを実施する',
                status: 'ON_HOLD',
                priority: 'MEDIUM',
                dueDate: generateRandomDueDate(),
                createdAt: now,
                updatedAt: now
            },
            {
                id: 5,
                title: 'ドキュメント作成',
                description: 'README.mdを作成する',
                status: 'TODO',
                priority: 'LOW',
                dueDate: generateRandomDueDate(),
                createdAt: now,
                updatedAt: now
            }
        ],
        nextId: 6
    };
    saveTasks(initialData);
    return initialData;
}
