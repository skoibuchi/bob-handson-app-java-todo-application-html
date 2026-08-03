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
