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
