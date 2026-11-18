import React, { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  Palette,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Share2,
  Search,
  CheckCircle2,
  Settings,
  MoreVertical,
  X,
  FileText,
} from 'lucide-react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import CustomizationModal from './CustomizationModal';
import LightboxModal from './LightboxModal';
import { fireGoldenCelebration } from '../utils/confetti';
import {
  playConfettiFanfare,
  playTaskMoveSound,
  playButtonBlip,
  playDeleteSound,
  isSoundMuted,
  toggleSoundMute,
} from '../utils/soundEffects';

export default function TaskboardView({
  board,
  onBack,
  onUpdateBoard,
}) {
  const [soundMuted, setSoundMuted] = useState(isSoundMuted());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState('');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState({ isOpen: false, src: '', title: '' });

  // Drag over tracking
  const [dragOverColId, setDragOverColId] = useState(null);

  // New column modal/input
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  // Editing board title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(board.title);

  const handleToggleSound = () => {
    const muted = toggleSoundMute();
    setSoundMuted(muted);
    if (!muted) playButtonBlip();
  };

  const handleSaveBoardTitle = () => {
    if (titleInput.trim()) {
      onUpdateBoard({ ...board, title: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  // Add a new custom task log column
  const handleAddColumn = (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    playButtonBlip();
    const newCol = {
      id: 'col-' + Date.now(),
      title: newColumnTitle.trim(),
      color: board.theme?.headerColor || '#ffd700',
    };
    onUpdateBoard({
      ...board,
      columns: [...(board.columns || []), newCol],
    });
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  // Delete a custom column
  const handleDeleteColumn = (colId) => {
    if ((board.columns || []).length <= 1) {
      alert('A taskboard must contain at least one task log category.');
      return;
    }
    const confirmDelete = window.confirm('Delete this task log column and move its tasks to the first column?');
    if (!confirmDelete) return;

    playDeleteSound();
    const remainingColumns = board.columns.filter((c) => c.id !== colId);
    const fallbackColId = remainingColumns[0]?.id;

    // Move tasks in deleted column to first column
    const updatedTasks = (board.tasks || []).map((t) =>
      t.columnId === colId ? { ...t, columnId: fallbackColId } : t
    );

    onUpdateBoard({
      ...board,
      columns: remainingColumns,
      tasks: updatedTasks,
    });
  };

  // Task creation/update
  const handleSaveTask = (taskData) => {
    let updatedTasks;
    if (taskData.id) {
      // Update existing
      updatedTasks = (board.tasks || []).map((t) => (t.id === taskData.id ? taskData : t));
    } else {
      // Create new
      const newTask = {
        ...taskData,
        id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        createdAt: new Date().toISOString(),
      };
      updatedTasks = [...(board.tasks || []), newTask];
    }

    onUpdateBoard({
      ...board,
      tasks: updatedTasks,
    });
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    playDeleteSound();
    const updatedTasks = (board.tasks || []).filter((t) => t.id !== taskId);
    onUpdateBoard({
      ...board,
      tasks: updatedTasks,
    });
  };

  // Move task to a column (via button click or drag-and-drop)
  const handleMoveTask = (taskId, targetColumnId) => {
    const task = (board.tasks || []).find((t) => t.id === taskId);
    if (!task || task.columnId === targetColumnId) return;

    const targetCol = (board.columns || []).find((c) => c.id === targetColumnId);
    const isTargetComplete =
      targetCol?.id === 'col-complete' ||
      targetCol?.title?.toLowerCase().includes('complete') ||
      targetCol?.title?.toLowerCase().includes('done');

    if (isTargetComplete) {
      // Trigger glorious celebration!
      fireGoldenCelebration();
      playConfettiFanfare();
    } else {
      playTaskMoveSound();
    }

    const updatedTasks = (board.tasks || []).map((t) =>
      t.id === taskId ? { ...t, columnId: targetColumnId } : t
    );

    onUpdateBoard({
      ...board,
      tasks: updatedTasks,
    });
  };

  // Drag and Drop handlers
  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    setDragOverColId(null);
    try {
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw) return;
      const { taskId } = JSON.parse(raw);
      if (taskId) {
        handleMoveTask(taskId, targetColumnId);
      }
    } catch (err) {
      console.warn('Drop error:', err);
    }
  };

  // Compute background styling dynamically based on customization settings
  const getBackgroundStyle = () => {
    const theme = board.theme || {};
    if (theme.backgroundType === 'custom-image' && theme.customImage) {
      return {
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(5,6,8,0.75) 0%, rgba(5,6,8,0.92) 100%), url(${theme.customImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }
    if (theme.backgroundType === 'custom-color' && theme.customColor) {
      return {
        backgroundColor: theme.customColor,
        backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(255,215,0,0.06) 0%, transparent 60%)',
      };
    }
    if (theme.backgroundType === 'gold-stardust') {
      return {
        backgroundColor: '#07080d',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255,165,0,0.15) 0%, transparent 70%), linear-gradient(rgba(255,215,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.04) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
      };
    }
    if (theme.backgroundType === 'cyber-grid') {
      return {
        backgroundColor: '#04070d',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(255,215,0,0.08) 0%, transparent 60%), linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 100% 100%, 35px 35px, 35px 35px',
      };
    }
    if (theme.backgroundType === 'deep-nebula') {
      return {
        backgroundColor: '#07060f',
        backgroundImage: 'radial-gradient(circle at 75% 25%, rgba(168,85,247,0.12) 0%, transparent 60%), radial-gradient(circle at 25% 75%, rgba(255,215,0,0.08) 0%, transparent 60%)',
      };
    }
    if (theme.backgroundType === 'stealth-carbon') {
      return {
        backgroundColor: '#06070a',
        backgroundImage: 'linear-gradient(135deg, #0b0d13 25%, transparent 25%), linear-gradient(225deg, #0b0d13 25%, transparent 25%), linear-gradient(45deg, #0b0d13 25%, transparent 25%), linear-gradient(315deg, #0b0d13 25%, #06070a 25%)',
        backgroundPosition: '10px 0, 10px 0, 0 0, 0 0',
        backgroundSize: '20px 20px',
      };
    }
    // Default: spaceship-void
    return {
      backgroundColor: '#050608',
      backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(255,215,0,0.08) 0%, transparent 60%), linear-gradient(rgba(255,215,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.03) 1px, transparent 1px)',
      backgroundSize: '100% 100%, 40px 40px, 40px 40px',
      backgroundAttachment: 'fixed',
    };
  };

  // Filter tasks
  const filteredTasks = (board.tasks || []).filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q));
  });

  return (
    <div style={{ minHeight: '100vh', ...getBackgroundStyle(), paddingBottom: 60, transition: 'background 0.3s ease' }}>
      {/* Top Cockpit Navigation Bar */}
      <header style={{
        background: 'rgba(9, 12, 18, 0.92)',
        borderBottom: '1px solid var(--space-border)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '14px 28px',
      }}>
        <div style={{
          maxWidth: 1600,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {/* Left: Back Button & Board Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => { playButtonBlip(); onBack(); }}
              className="btn-gold btn-gold-ghost"
              style={{ padding: '8px 14px', fontSize: '0.78rem' }}
              title="Return to Directory Board"
            >
              <ChevronLeft size={16} /> Directory Board
            </button>

            <div style={{ height: 28, width: 1, background: 'rgba(255,215,0,0.2)' }} />

            {/* Editable Board Title */}
            {isEditingTitle ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="text"
                  autoFocus
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveBoardTitle()}
                  style={{
                    padding: '6px 12px',
                    background: '#040508',
                    border: '1px solid var(--gold-primary)',
                    borderRadius: 6,
                    color: '#fff',
                    fontFamily: 'var(--font-hud)',
                    fontSize: '1.05rem',
                    outline: 'none',
                  }}
                />
                <button onClick={handleSaveBoardTitle} className="btn-gold" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                  Save
                </button>
              </div>
            ) : (
              <div
                onClick={() => { setTitleInput(board.title); setIsEditingTitle(true); }}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                title="Click to rename board"
              >
                <h1 className="hud-title" style={{ fontSize: '1.25rem', letterSpacing: '0.08em' }}>
                  {board.title}
                </h1>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-bright)', opacity: 0.7 }}>[EDIT]</span>
              </div>
            )}
          </div>

          {/* Right Toolbar Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search within board */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Search size={14} color="var(--gold-primary)" style={{ position: 'absolute', left: 10, opacity: 0.8 }} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px 7px 32px',
                  background: 'rgba(12, 16, 26, 0.7)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  width: 170,
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sound FX Toggle */}
            <button
              onClick={handleToggleSound}
              className="btn-gold btn-gold-ghost"
              style={{ padding: '8px 12px', fontSize: '0.75rem' }}
              title={soundMuted ? 'Sound muted - Click to unmute' : 'Sound active - Click to mute'}
            >
              {soundMuted ? <VolumeX size={15} color="#f87171" /> : <Volume2 size={15} color="var(--gold-primary)" />}
            </button>

            {/* Customization Button */}
            <button
              onClick={() => { playButtonBlip(); setIsCustomizerOpen(true); }}
              className="btn-gold"
              style={{ padding: '8px 14px', fontSize: '0.78rem' }}
              title="Customize board background, headers, and card colors"
            >
              <Palette size={15} /> Customize Board
            </button>

            {/* Add Task Button */}
            <button
              onClick={() => {
                playButtonBlip();
                setSelectedTask(null);
                setActiveColumnId(board.columns?.[0]?.id || '');
                setIsTaskModalOpen(true);
              }}
              className="btn-gold"
              style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.35) 0%, rgba(212,175,55,0.6) 100%)',
              }}
            >
              <Plus size={16} /> New Task
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Columns Container */}
      <main style={{
        maxWidth: 1650,
        margin: '28px auto 0 auto',
        padding: '0 24px',
        overflowX: 'auto',
      }}>
        <div style={{
          display: 'flex',
          gap: 22,
          alignItems: 'flex-start',
          minWidth: (board.columns?.length || 3) * 320,
        }}>
          {board.columns?.map((col, colIdx) => {
            const colTasks = filteredTasks.filter((t) => t.columnId === col.id);
            const isCompleteCol =
              col.id === 'col-complete' ||
              col.title.toLowerCase().includes('complete') ||
              col.title.toLowerCase().includes('done');
            const isOver = dragOverColId === col.id;

            const headerColor = board.theme?.headerColor || col.color || '#ffd700';

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className="hud-panel corner-bracket"
                style={{
                  width: 340,
                  flexShrink: 0,
                  borderRadius: 10,
                  background: 'rgba(12, 16, 26, 0.88)',
                  border: isOver
                    ? '2px dashed var(--gold-primary)'
                    : '1px solid rgba(255, 215, 0, 0.22)',
                  boxShadow: isOver ? 'var(--gold-glow-lg)' : '0 4px 20px rgba(0, 0, 0, 0.5)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                  padding: 16,
                }}
              >
                {/* Column Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 12,
                  marginBottom: 14,
                  borderBottom: `2px solid ${headerColor}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: headerColor,
                      boxShadow: `0 0 10px ${headerColor}`,
                    }} />
                    <h3 style={{
                      fontFamily: 'var(--font-hud)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: headerColor,
                      textTransform: 'uppercase',
                    }}>
                      {col.title}
                    </h3>
                    <span style={{
                      fontFamily: 'var(--font-hud)',
                      fontSize: '0.72rem',
                      background: 'rgba(255,215,0,0.12)',
                      border: '1px solid rgba(255,215,0,0.3)',
                      color: 'var(--gold-bright)',
                      padding: '2px 8px',
                      borderRadius: 12,
                    }}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Header actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      title={`Add task to ${col.title}`}
                      onClick={() => {
                        playButtonBlip();
                        setSelectedTask(null);
                        setActiveColumnId(col.id);
                        setIsTaskModalOpen(true);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--gold-bright)',
                        cursor: 'pointer',
                        padding: 4,
                        borderRadius: 4,
                      }}
                    >
                      <Plus size={16} />
                    </button>

                    {/* Delete column button if custom */}
                    {board.columns.length > 1 && !['col-planning', 'col-inprogress', 'col-complete'].includes(col.id) && (
                      <button
                        title="Delete column"
                        onClick={() => handleDeleteColumn(col.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: 4,
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Drop Zone / Task List */}
                <div style={{
                  minHeight: 280,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {colTasks.length === 0 ? (
                    <div
                      onClick={() => {
                        playButtonBlip();
                        setSelectedTask(null);
                        setActiveColumnId(col.id);
                        setIsTaskModalOpen(true);
                      }}
                      style={{
                        flex: 1,
                        border: '1px dashed rgba(255, 215, 0, 0.2)',
                        borderRadius: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 24,
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isOver ? 'rgba(255, 215, 0, 0.08)' : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.78rem', color: 'var(--gold-bright)', opacity: 0.8 }}>
                        + DROP OR ADD TASK HERE
                      </span>
                      {isCompleteCol && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--space-text-dim)', marginTop: 4 }}>
                          Dragging here unleashes celebration confetti! 🎉
                        </span>
                      )}
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        columns={board.columns}
                        currentColumnIndex={colIdx}
                        boardTheme={board.theme}
                        onEdit={(taskToEdit) => {
                          setSelectedTask(taskToEdit);
                          setActiveColumnId(col.id);
                          setIsTaskModalOpen(true);
                        }}
                        onDelete={handleDeleteTask}
                        onMove={handleMoveTask}
                        onViewImage={(src, title) => setLightboxData({ isOpen: true, src, title })}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Add New Task Log Column Section */}
          <div style={{ width: 280, flexShrink: 0 }}>
            {isAddingColumn ? (
              <form
                onSubmit={handleAddColumn}
                className="hud-panel corner-bracket"
                style={{ padding: 16, borderRadius: 10, background: 'rgba(12, 16, 26, 0.9)' }}
              >
                <div style={{
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.82rem',
                  color: 'var(--gold-bright)',
                  marginBottom: 8,
                  letterSpacing: '0.08em',
                }}>
                  NEW TASK LOG HEADER
                </div>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Code Review, Archive..."
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#05070d',
                    border: '1px solid var(--gold-primary)',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    marginBottom: 10,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingColumn(false)}
                    className="btn-gold btn-gold-ghost"
                    style={{ padding: '6px 10px', fontSize: '0.72rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ padding: '6px 12px', fontSize: '0.72rem' }}
                  >
                    Add Header
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => { playButtonBlip(); setIsAddingColumn(true); }}
                className="btn-gold btn-gold-ghost"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 10,
                  borderStyle: 'dashed',
                  fontSize: '0.82rem',
                }}
              >
                <Plus size={16} /> Add Task Log Header
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        columns={board.columns || []}
        defaultColumnId={activeColumnId}
      />

      {/* Board Customization Modal */}
      <CustomizationModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentTheme={board.theme}
        onSaveTheme={(updatedTheme) => {
          onUpdateBoard({ ...board, theme: updatedTheme });
        }}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxData.isOpen}
        imageSrc={lightboxData.src}
        title={lightboxData.title}
        onClose={() => setLightboxData({ isOpen: false, src: '', title: '' })}
      />
    </div>
  );
}
