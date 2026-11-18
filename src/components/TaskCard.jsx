import React, { useState } from 'react';
import { Edit2, Trash2, ArrowLeft, ArrowRight, Maximize2, Image as ImageIcon, Calendar } from 'lucide-react';
import { playButtonBlip, playDeleteSound, playTaskMoveSound } from '../utils/soundEffects';

export default function TaskCard({
  task,
  columns,
  currentColumnIndex,
  onEdit,
  onDelete,
  onMove,
  onViewImage,
  boardTheme,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    playTaskMoveSound();
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, sourceColumnId: task.columnId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const hasPrev = currentColumnIndex > 0;
  const hasNext = currentColumnIndex < columns.length - 1;

  const cardBg = task.color || boardTheme?.taskBgColor || '#121622';
  const cardBorder = task.borderColor || boardTheme?.taskBorderColor || 'rgba(255, 215, 0, 0.25)';

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: cardBg,
        border: `1px solid ${isHovered ? 'var(--gold-primary)' : cardBorder}`,
        borderRadius: 8,
        padding: '14px 14px 10px 14px',
        marginBottom: 12,
        cursor: 'grab',
        opacity: isDragging ? 0.45 : 1,
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered
          ? '0 6px 18px rgba(0, 0, 0, 0.6), 0 0 14px rgba(255, 215, 0, 0.25)'
          : '0 2px 8px rgba(0, 0, 0, 0.4)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Top Bar: Title & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <h4 style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '0.92rem',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.35,
          letterSpacing: '0.04em',
          wordBreak: 'break-word',
        }}>
          {task.title}
        </h4>

        {/* Action icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          opacity: isHovered ? 1 : 0.6,
          transition: 'opacity 0.2s ease',
          flexShrink: 0,
        }}>
          <button
            title="Edit task"
            onClick={(e) => {
              e.stopPropagation();
              playButtonBlip();
              onEdit(task);
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
            <Edit2 size={14} />
          </button>
          <button
            title="Delete task"
            onClick={(e) => {
              e.stopPropagation();
              playDeleteSound();
              onDelete(task.id);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Sub-description */}
      {task.description && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          color: 'var(--space-text-dim)',
          lineHeight: 1.45,
          marginBottom: 10,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: 120,
          overflowY: 'auto',
          paddingRight: 4,
        }}>
          {task.description}
        </p>
      )}

      {/* Confined Image Container */}
      {task.image && (
        <div
          className="task-image-container"
          onClick={(e) => {
            e.stopPropagation();
            playButtonBlip();
            onViewImage(task.image, task.title);
          }}
          title="Click to view full resolution"
        >
          <img src={task.image} alt={task.title} />
          <div style={{
            position: 'absolute',
            bottom: 6,
            right: 6,
            background: 'rgba(0, 0, 0, 0.75)',
            border: '1px solid rgba(255, 215, 0, 0.5)',
            borderRadius: 4,
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.65rem',
            color: 'var(--gold-bright)',
            fontFamily: 'var(--font-hud)',
          }}>
            <Maximize2 size={10} /> EXPAND
          </div>
        </div>
      )}

      {/* Footer: Date & Quick Shift Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
        paddingTop: 8,
        borderTop: '1px solid rgba(255, 215, 0, 0.1)',
        fontSize: '0.72rem',
        color: 'var(--space-text-dim)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {formattedDate && (
            <>
              <Calendar size={12} color="var(--gold-primary)" />
              <span>{formattedDate}</span>
            </>
          )}
        </div>

        {/* Quick Shift (Prev/Next) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {hasPrev && (
            <button
              title={`Move to ${columns[currentColumnIndex - 1]?.title}`}
              onClick={(e) => {
                e.stopPropagation();
                onMove(task.id, columns[currentColumnIndex - 1].id);
              }}
              style={{
                background: 'rgba(255, 215, 0, 0.12)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: 'var(--gold-bright)',
                borderRadius: 4,
                padding: '2px 6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontSize: '0.68rem',
                fontFamily: 'var(--font-hud)',
              }}
            >
              <ArrowLeft size={10} />
            </button>
          )}
          {hasNext && (
            <button
              title={`Move to ${columns[currentColumnIndex + 1]?.title}`}
              onClick={(e) => {
                e.stopPropagation();
                onMove(task.id, columns[currentColumnIndex + 1].id);
              }}
              style={{
                background: 'rgba(255, 215, 0, 0.12)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: 'var(--gold-bright)',
                borderRadius: 4,
                padding: '2px 6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontSize: '0.68rem',
                fontFamily: 'var(--font-hud)',
              }}
            >
              <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
