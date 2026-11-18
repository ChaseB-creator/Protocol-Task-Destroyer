import React, { useState, useEffect } from 'react';
import DirectoryBoard from './components/DirectoryBoard';
import TaskboardView from './components/TaskboardView';
import {
  getStoredBoards,
  createNewBoard,
  deleteBoardById,
  deleteMultipleBoards,
  updateBoardData,
} from './utils/storage';
import { initSoundPreference } from './utils/soundEffects';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);

  // Initialize data and sound preferences on launch
  useEffect(() => {
    initSoundPreference();
    const stored = getStoredBoards();
    setBoards(stored);
  }, []);

  const handleSelectBoard = (boardId) => {
    setActiveBoardId(boardId);
  };

  const handleBackToDirectory = () => {
    setActiveBoardId(null);
  };

  const handleCreateBoard = (title, themeOptions) => {
    const { newBoard, allBoards } = createNewBoard(title, themeOptions);
    setBoards(allBoards);
    setActiveBoardId(newBoard.id);
  };

  const handleDeleteBoard = (boardId) => {
    const updated = deleteBoardById(boardId);
    setBoards(updated);
    if (activeBoardId === boardId) {
      setActiveBoardId(null);
    }
  };

  const handleDeleteMultiple = (boardIds) => {
    const updated = deleteMultipleBoards(boardIds);
    setBoards(updated);
    if (boardIds.includes(activeBoardId)) {
      setActiveBoardId(null);
    }
  };

  const handleUpdateBoard = (updatedBoard) => {
    const updated = updateBoardData(updatedBoard);
    setBoards(updated);
  };

  const handleReloadBoards = () => {
    const stored = getStoredBoards();
    setBoards(stored);
  };

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  return (
    <div className="app-container">
      {activeBoard ? (
        <TaskboardView
          board={activeBoard}
          onBack={handleBackToDirectory}
          onUpdateBoard={handleUpdateBoard}
        />
      ) : (
        <DirectoryBoard
          boards={boards}
          onSelectBoard={handleSelectBoard}
          onCreateBoard={handleCreateBoard}
          onDeleteBoard={handleDeleteBoard}
          onDeleteMultiple={handleDeleteMultiple}
          onReloadBoards={handleReloadBoards}
        />
      )}
    </div>
  );
}
