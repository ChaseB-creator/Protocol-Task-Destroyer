// Storage Manager for Protocol: Task Destroyer

const STORAGE_KEY = 'protocol_task_destroyer_boards_v1';
const LEGACY_STORAGE_KEY = 'teensey_task_boards_v1';

export const DEFAULT_THEME = {
  backgroundType: 'spaceship-void', // 'spaceship-void', 'gold-stardust', 'cyber-grid', 'deep-nebula', 'custom-color', 'custom-image'
  customColor: '#0b0d14',
  customImage: '',
  headerColor: '#ffd700',
  taskBgColor: '#121622',
  taskBorderColor: 'rgba(255, 215, 0, 0.25)',
  accentGlow: '#ffd700',
};

const INITIAL_BOARDS = [
  {
    id: 'board-spaceship-core',
    title: 'Starship Orion Command Core',
    createdAt: new Date().toISOString(),
    theme: { ...DEFAULT_THEME },
    columns: [
      { id: 'col-planning', title: 'Planning', color: '#ffd700' },
      { id: 'col-inprogress', title: 'In-Progress', color: '#e5c158' },
      { id: 'col-complete', title: 'Complete', color: '#10b981' },
    ],
    tasks: [
      {
        id: 'task-starter-1',
        columnId: 'col-planning',
        title: 'Calibrate Warp Reactor Harmonic Coils',
        description: 'Verify sub-quantum plasma conduits and run a Level 4 diagnostic on primary telemetry bus.',
        image: '',
        color: '#131824',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'task-starter-2',
        columnId: 'col-inprogress',
        title: 'Align Deep Space Telemetry Array',
        description: 'Synchronize long-range sensors with sector beacon navigation beacons.',
        image: '',
        color: '#151b2a',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'task-starter-3',
        columnId: 'col-complete',
        title: 'Orbital Docking Protocol Verification',
        description: 'Automated docking thrusters passed safety simulation with zero anomalies. Ready for cruise.',
        image: '',
        color: '#131e24',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
];

export function getStoredBoards() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw);
      }
    }
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOARDS));
      return INITIAL_BOARDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_BOARDS;
  } catch (err) {
    console.error('Failed to parse stored boards:', err);
    return INITIAL_BOARDS;
  }
}

export function saveBoards(boards) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch (err) {
    console.error('Failed to save boards to localStorage:', err);
    if (err.name === 'QuotaExceededError') {
      alert('Local storage quota reached! Consider removing high-resolution images or older task boards.');
    }
  }
}

export function createNewBoard(title = 'New Starship Board', customTheme = {}) {
  const newBoard = {
    id: 'board-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    title: title.trim() || 'Untitled Board',
    createdAt: new Date().toISOString(),
    theme: {
      ...DEFAULT_THEME,
      ...customTheme,
    },
    columns: [
      { id: 'col-planning', title: 'Planning', color: '#ffd700' },
      { id: 'col-inprogress', title: 'In-Progress', color: '#e5c158' },
      { id: 'col-complete', title: 'Complete', color: '#10b981' },
    ],
    tasks: [],
  };

  const boards = getStoredBoards();
  const updated = [newBoard, ...boards];
  saveBoards(updated);
  return { newBoard, allBoards: updated };
}

export function deleteBoardById(boardId) {
  const boards = getStoredBoards();
  const updated = boards.filter((b) => b.id !== boardId);
  saveBoards(updated);
  return updated;
}

export function deleteMultipleBoards(boardIds) {
  const boards = getStoredBoards();
  const set = new Set(boardIds);
  const updated = boards.filter((b) => !set.has(b.id));
  saveBoards(updated);
  return updated;
}

export function updateBoardData(updatedBoard) {
  const boards = getStoredBoards();
  const index = boards.findIndex((b) => b.id === updatedBoard.id);
  let updated;
  if (index >= 0) {
    updated = [...boards];
    updated[index] = updatedBoard;
  } else {
    updated = [updatedBoard, ...boards];
  }
  saveBoards(updated);
  return updated;
}

// Export boards to JSON file
export function exportBoardsToJson() {
  const boards = getStoredBoards();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(boards, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `protocol_task_destroyer_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import boards from JSON string
export function importBoardsFromJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      saveBoards(parsed);
      return { success: true, boards: parsed };
    }
    return { success: false, error: 'Invalid file structure: Expected an array of taskboards.' };
  } catch (e) {
    return { success: false, error: 'Failed to parse JSON file: ' + e.message };
  }
}
