import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Download,
  Upload,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import NewBoardModal from './NewBoardModal';
import {
  playButtonBlip,
  playDeleteSound,
  isSoundMuted,
  toggleSoundMute,
} from '../utils/soundEffects';
import { exportBoardsToJson, importBoardsFromJson } from '../utils/storage';

export default function DirectoryBoard({
  boards = [],
  onSelectBoard,
  onCreateBoard,
  onDeleteBoard,
  onDeleteMultiple,
  onReloadBoards,
}) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [soundMuted, setSoundMuted] = useState(isSoundMuted());

  const handleToggleSound = () => {
    const muted = toggleSoundMute();
    setSoundMuted(muted);
    if (!muted) playButtonBlip();
  };

  const handleToggleSelectForDelete = (boardId, e) => {
    e.stopPropagation();
    playButtonBlip();
    setSelectedForDeletion((prev) => {
      const next = new Set(prev);
      if (next.has(boardId)) {
        next.delete(boardId);
      } else {
        next.add(boardId);
      }
      return next;
    });
  };

  const handleExecuteDeletion = () => {
    if (selectedForDeletion.size === 0) {
      setIsDeleteMode(false);
      return;
    }
    const count = selectedForDeletion.size;
    const confirmDelete = window.confirm(
      `Warning: You are about to permanently decommission ${count} taskboard(s). Confirm deletion?`
    );
    if (!confirmDelete) return;

    playDeleteSound();
    onDeleteMultiple(Array.from(selectedForDeletion));
    setSelectedForDeletion(new Set());
    setIsDeleteMode(false);
  };

  const handleDirectDeleteSingle = (boardId, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('Permanently delete this taskboard and its tasks?');
    if (!confirmDelete) return;
    playDeleteSound();
    onDeleteBoard(boardId);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const res = importBoardsFromJson(content);
      if (res.success) {
        playButtonBlip();
        alert('Taskboards successfully restored from backup!');
        onReloadBoards();
      } else {
        alert(res.error || 'Failed to import taskboards.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter boards
  const filteredBoards = boards.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-background" style={{ paddingBottom: 80 }}>
      {/* Subtle spaceship scanlines overlay */}
      <div className="scanlines-overlay" />

      {/* Top Spaceship Cockpit Telemetry Banner */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(14, 18, 28, 0.95) 0%, rgba(6, 8, 12, 0.8) 100%)',
        borderBottom: '1px solid var(--space-border)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--space-text-dim)',
        fontFamily: 'var(--font-hud)',
        letterSpacing: '0.12em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="status-pill">
            <span className="status-dot" />
            <span>SYSTEM ONLINE • WARP CORE NOMINAL</span>
          </div>
          <span style={{ display: 'none', md: 'inline' }}>SECTOR 001 // ORBITAL DOCK</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Audio toggle */}
          <button
            onClick={handleToggleSound}
            style={{
              background: 'transparent',
              border: 'none',
              color: soundMuted ? '#f87171' : 'var(--gold-bright)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-hud)',
              fontSize: '0.7rem',
            }}
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{soundMuted ? 'AUDIO MUTED' : 'AUDIO ACTIVE'}</span>
          </button>

          {/* Backup buttons */}
          <button
            onClick={() => { playButtonBlip(); exportBoardsToJson(); }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,215,0,0.25)',
              borderRadius: 4,
              color: 'var(--gold-bright)',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-hud)',
              fontSize: '0.68rem',
            }}
            title="Download JSON backup"
          >
            <Download size={12} /> BACKUP
          </button>

          <label
            style={{
              border: '1px solid rgba(255,215,0,0.25)',
              borderRadius: 4,
              color: 'var(--space-text-dim)',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-hud)',
              fontSize: '0.68rem',
            }}
            title="Restore from JSON backup"
          >
            <Upload size={12} /> RESTORE
            <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Main Header Container */}
      <header style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '36px 24px 20px 24px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* CENTER TOP: "Protocol: Task Destroyer" */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '5px 16px',
            borderRadius: 20,
            background: 'rgba(255, 215, 0, 0.12)',
            border: '1px solid rgba(255, 215, 0, 0.35)',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
            marginBottom: 12,
          }}>
            <Sparkles size={14} color="var(--gold-primary)" />
            <span style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: 'var(--gold-bright)',
              fontWeight: 700,
            }}>
              ORBITAL DIRECTORY COMMAND
            </span>
          </div>

          <h1
            className="hud-title"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              lineHeight: 1.15,
              margin: '0 0 8px 0',
              textShadow: '0 0 25px rgba(255, 215, 0, 0.65)',
            }}
          >
            Protocol: Task Destroyer
          </h1>

         {/* <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.15rem',
            color: 'var(--space-text-dim)',
            maxWidth: 680,
            margin: '0 auto',
            letterSpacing: '0.04em',
          }}>
            Dynamic Gold & Black Mission Control • Drag-and-Drop Taskboards • Confetti Celebrations
          </p> 
         */}
         
        </div>

        {/* BELOW CENTER TOP ON THE FAR LEFT: Creation and Deletion buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid rgba(255, 215, 0, 0.15)',
        }}>
          {/* FAR LEFT BUTTONS: Taskboard Creation and Deletion Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Taskboard Creation Button */}
            <button
              onClick={() => { playButtonBlip(); setIsNewModalOpen(true); }}
              className="btn-gold"
              style={{
                padding: '11px 22px',
                fontSize: '0.84rem',
              }}
            >
              <Plus size={18} />
              Create Taskboard
            </button>

            {/* Taskboard Deletion Button */}
            {isDeleteMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={handleExecuteDeletion}
                  className="btn-gold btn-gold-danger"
                  style={{ padding: '11px 18px', fontSize: '0.84rem' }}
                >
                  <Trash2 size={16} />
                  Confirm Delete ({selectedForDeletion.size})
                </button>
                <button
                  onClick={() => {
                    playButtonBlip();
                    setIsDeleteMode(false);
                    setSelectedForDeletion(new Set());
                  }}
                  className="btn-gold btn-gold-ghost"
                  style={{ padding: '11px 14px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  playButtonBlip();
                  setIsDeleteMode(true);
                  setSelectedForDeletion(new Set());
                }}
                className="btn-gold btn-gold-ghost"
                style={{
                  padding: '11px 20px',
                  fontSize: '0.84rem',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                }}
                title="Enter deletion mode to remove taskboards"
              >
                <Trash2 size={16} color="#ef4444" />
                Delete Taskboard
              </button>
            )}
          </div>

          {/* RIGHT SIDE: Search / Filter & Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={15} color="var(--gold-primary)" style={{ position: 'absolute', left: 12, opacity: 0.8 }} />
              <input
                type="text"
                placeholder="Search directory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '10px 14px 10px 36px',
                  background: 'rgba(12, 16, 26, 0.85)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  width: 220,
                  boxShadow: 'inset 0 0 8px rgba(0,0,0,0.5)',
                }}
              />
            </div>
            <div style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.78rem',
              color: 'var(--gold-bright)',
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              padding: '8px 14px',
              borderRadius: 6,
            }}>
              ACTIVE BOARDS: {boards.length}
            </div>
          </div>
        </div>

        {/* Deletion Mode Alert Banner */}
        {isDeleteMode && (
          <div style={{
            marginTop: 18,
            padding: '12px 18px',
            borderRadius: 8,
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fecaca',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert size={18} color="#ef4444" />
              <span>DELETION PROTOCOL ACTIVE: Click on any taskboard below to mark it for decommission.</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#fff' }}>
              {selectedForDeletion.size} board(s) marked
            </span>
          </div>
        )}
      </header>

      {/* Directory Board Grid Container */}
      <main style={{ maxWidth: 1400, margin: '20px auto 0 auto', padding: '0 24px' }}>
        {filteredBoards.length === 0 ? (
          /* Empty State */
          <div className="hud-panel corner-bracket" style={{
            padding: '60px 24px',
            textAlign: 'center',
            maxWidth: 600,
            margin: '40px auto',
          }}>
            <Compass size={48} color="var(--gold-primary)" style={{ marginBottom: 16, opacity: 0.8 }} />
            <h3 className="hud-title" style={{ fontSize: '1.4rem', marginBottom: 8 }}>
              NO TASKBOARDS FOUND
            </h3>
            <p style={{ color: 'var(--space-text-dim)', marginBottom: 24, fontSize: '1rem' }}>
              {searchQuery
                ? `No taskboards match "${searchQuery}". Try a different keyword.`
                : 'Initialize your first orbital taskboard using the button below.'}
            </p>
            <button
              onClick={() => { playButtonBlip(); setIsNewModalOpen(true); }}
              className="btn-gold"
              style={{ padding: '12px 24px' }}
            >
              <Plus size={18} /> Launch First Board
            </button>
          </div>
        ) : (
          /* Taskboards Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 24,
          }}>
            {filteredBoards.map((board) => {
              const isSelected = selectedForDeletion.has(board.id);
              const totalTasks = (board.tasks || []).length;
              const planningTasks = (board.tasks || []).filter((t) => t.columnId === 'col-planning').length;
              const inProgressTasks = (board.tasks || []).filter((t) => t.columnId === 'col-inprogress').length;
              const completeTasks = (board.tasks || []).filter(
                (t) => t.columnId === 'col-complete' || t.columnId?.includes('complete')
              ).length;

              const percentComplete = totalTasks > 0 ? Math.round((completeTasks / totalTasks) * 100) : 0;

              // Format date
              const createdDateObj = board.createdAt ? new Date(board.createdAt) : new Date();
              const formattedDate = createdDateObj.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              const formattedTime = createdDateObj.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={board.id}
                  className={`board-card corner-bracket ${isSelected ? 'selected-for-delete' : ''}`}
                  onClick={(e) => {
                    if (isDeleteMode) {
                      handleToggleSelectForDelete(board.id, e);
                    } else {
                      playButtonBlip();
                      onSelectBoard(board.id);
                    }
                  }}
                  style={{
                    minHeight: 220,
                  }}
                >
                  {/* Card Header */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          background: isSelected
                            ? 'rgba(239, 68, 68, 0.3)'
                            : 'linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(184, 134, 11, 0.25) 100%)',
                          border: isSelected ? '1px solid #ef4444' : '1px solid var(--gold-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 10px rgba(255,215,0,0.2)',
                        }}>
                          <Layers size={18} color={isSelected ? '#ef4444' : 'var(--gold-primary)'} />
                        </div>
                        <div>
                          <h3 style={{
                            fontFamily: 'var(--font-hud)',
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            letterSpacing: '0.06em',
                          }}>
                            {board.title}
                          </h3>
                          <span style={{
                            fontSize: '0.7rem',
                            color: 'var(--gold-bright)',
                            fontFamily: 'var(--font-hud)',
                            opacity: 0.85,
                          }}>
                            ORBITAL TASK MATRIX
                          </span>
                        </div>
                      </div>

                      {/* Deletion Checkbox or Single Delete Button */}
                      {isDeleteMode ? (
                        <div style={{
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          border: isSelected ? '2px solid #ef4444' : '2px solid rgba(255,215,0,0.4)',
                          background: isSelected ? '#ef4444' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {isSelected && <Trash2 size={13} color="#fff" />}
                        </div>
                      ) : (
                        <button
                          title="Delete this taskboard"
                          onClick={(e) => handleDirectDeleteSingle(board.id, e)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--space-text-dim)',
                            cursor: 'pointer',
                            padding: 6,
                            borderRadius: 4,
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--space-text-dim)')}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-hud)',
                        color: 'var(--space-text-dim)',
                        marginBottom: 4,
                      }}>
                        <span>COMPLETION STATUS</span>
                        <span style={{ color: percentComplete === 100 ? '#10b981' : 'var(--gold-bright)' }}>
                          {percentComplete}%
                        </span>
                      </div>
                      <div style={{
                        height: 5,
                        width: '100%',
                        background: 'rgba(255,215,0,0.12)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${percentComplete}%`,
                          background: percentComplete === 100
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : 'var(--gold-metallic)',
                          boxShadow: '0 0 8px rgba(255,215,0,0.5)',
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* DETAILS SECTION JUST BELOW A TASKBOARD:
                      "Have a details section just below a taskboard that says when it was created and how many current tasks are inside it." */}
                  <div style={{
                    background: 'rgba(6, 8, 14, 0.75)',
                    border: '1px solid rgba(255, 215, 0, 0.18)',
                    borderRadius: 6,
                    padding: '12px 14px',
                    marginTop: 8,
                  }}>
                    {/* When it was created */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      color: 'var(--space-text-dim)',
                      marginBottom: 6,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={13} color="var(--gold-primary)" />
                        <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.7rem', color: 'var(--gold-bright)' }}>
                          CREATED:
                        </span>
                      </div>
                      <span style={{ color: '#e2e8f0', fontWeight: 500 }}>
                        {formattedDate} • {formattedTime}
                      </span>
                    </div>

                    {/* How many current tasks are inside it */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      color: 'var(--space-text-dim)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Layers size={13} color="var(--gold-primary)" />
                        <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.7rem', color: 'var(--gold-bright)' }}>
                          CURRENT TASKS:
                        </span>
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-hud)',
                        color: 'var(--gold-bright)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}>
                        {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                      </span>
                    </div>

                    {/* Quick breakdown tags */}
                    <div style={{
                      display: 'flex',
                      gap: 6,
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: '1px solid rgba(255,215,0,0.1)',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-hud)',
                    }}>
                      <span style={{ color: 'var(--gold-bright)' }}>Plan: {planningTasks}</span>
                      <span style={{ color: 'var(--space-border)' }}>|</span>
                      <span style={{ color: '#38bdf8' }}>In-Prog: {inProgressTasks}</span>
                      <span style={{ color: 'var(--space-border)' }}>|</span>
                      <span style={{ color: '#10b981' }}>Done: {completeTasks}</span>
                    </div>
                  </div>

                  {/* Card Action footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: 14,
                    color: 'var(--gold-bright)',
                    fontFamily: 'var(--font-hud)',
                    fontSize: '0.75rem',
                    gap: 6,
                  }}>
                    <span>ACCESS TASKBOARD</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* New Board Modal */}
      <NewBoardModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={(title, theme) => {
          onCreateBoard(title, theme);
        }}
      />
    </div>
  );
}
