import React, { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Trash2, Upload, AlertCircle, Sparkles, Check } from 'lucide-react';
import { processAndOptimizeImage, formatBytes } from '../utils/imageUtils';
import { playButtonBlip, playDeleteSound } from '../utils/soundEffects';

const PRESET_TASK_COLORS = [
  { name: 'Spaceship Obsidian', value: '#121622', border: 'rgba(255, 215, 0, 0.3)' },
  { name: 'Gold Command', value: '#1f1b0f', border: 'rgba(255, 215, 0, 0.6)' },
  { name: 'Deep Cyber Blue', value: '#0f172a', border: 'rgba(56, 189, 248, 0.4)' },
  { name: 'Emerald Nebula', value: '#0c1a16', border: 'rgba(16, 185, 129, 0.4)' },
  { name: 'Solar Crimson', value: '#1e1114', border: 'rgba(244, 63, 94, 0.4)' },
  { name: 'Amethyst Warp', value: '#181224', border: 'rgba(168, 85, 247, 0.4)' },
];

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  task = null,
  columns = [],
  defaultColumnId = '',
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('');
  const [imageData, setImageData] = useState('');
  const [taskColor, setTaskColor] = useState('#121622');
  const [taskBorder, setTaskBorder] = useState('rgba(255, 215, 0, 0.3)');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setColumnId(task.columnId || (columns[0]?.id || ''));
      setImageData(task.image || '');
      setTaskColor(task.color || '#121622');
      setTaskBorder(task.borderColor || 'rgba(255, 215, 0, 0.3)');
    } else {
      setTitle('');
      setDescription('');
      setColumnId(defaultColumnId || (columns[0]?.id || ''));
      setImageData('');
      setTaskColor('#121622');
      setTaskBorder('rgba(255, 215, 0, 0.3)');
    }
    setImageError('');
  }, [task, isOpen, defaultColumnId, columns]);

  if (!isOpen) return null;

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');
    setIsProcessingImage(true);

    try {
      // Validate file size and compress to prevent excessive memory/storage usage
      const optimizedBase64 = await processAndOptimizeImage(file);
      setImageData(optimizedBase64);
      playButtonBlip();
    } catch (err) {
      setImageError(err.message || 'Error processing image.');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    playDeleteSound();
    setImageData('');
    setImageError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    playButtonBlip();
    onSave({
      ...(task || {}),
      title: title.trim(),
      description: description.trim(),
      columnId: columnId || columns[0]?.id,
      image: imageData,
      color: taskColor,
      borderColor: taskBorder,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content corner-bracket" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(255,215,0,0.25) 0%, rgba(184,134,11,0.2) 100%)',
              border: '1px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={18} color="var(--gold-primary)" />
            </div>
            <div>
              <h2 className="hud-title" style={{ fontSize: '1.2rem', letterSpacing: '0.08em' }}>
                {task ? 'EDIT ORBITAL TASK' : 'CREATE NEW TASK'}
              </h2>
              <p className="hud-subtext" style={{ fontSize: '0.68rem' }}>SPACESHIP LOG MATRIX</p>
            </div>
          </div>
          <button
            onClick={() => { playButtonBlip(); onClose(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--space-text-dim)',
              cursor: 'pointer',
              padding: 6,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.75rem',
              color: 'var(--gold-bright)',
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}>
              TASK TITLE *
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inspect Fuel Cell Injectors..."
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(5, 7, 12, 0.9)',
                border: '1px solid var(--gold-primary)',
                borderRadius: 6,
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
              }}
            />
          </div>

          {/* Column Category */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.75rem',
              color: 'var(--gold-bright)',
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}>
              TASK LOG CATEGORY / HEADER
            </label>
            <select
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#090c15',
                border: '1px solid rgba(255,215,0,0.4)',
                borderRadius: 6,
                color: 'var(--gold-bright)',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id} style={{ background: '#0d101a', color: '#fff' }}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-description */}
          <div style={{ marginBottom: 18 }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.75rem',
              color: 'var(--gold-bright)',
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}>
              SUB-DESCRIPTION & DETAILED NOTES
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add comprehensive mission instructions, telemetry requirements, sub-tasks..."
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(5, 7, 12, 0.9)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: 6,
                color: '#e2e8f0',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
              }}
            />
          </div>

          {/* Image Placeholder & Upload Container */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.75rem',
                color: 'var(--gold-bright)',
                letterSpacing: '0.08em',
              }}>
                ATTACH IMAGE (CONFINED CONTAINER)
              </label>
              <span style={{ fontSize: '0.7rem', color: 'var(--space-text-dim)' }}>
                Max 10MB • Auto-Optimized
              </span>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageFileChange}
            />

            {/* Image Preview or Placeholder */}
            {imageData ? (
              <div style={{
                position: 'relative',
                borderRadius: 8,
                border: '1px solid var(--gold-primary)',
                overflow: 'hidden',
                background: '#07090f',
                boxShadow: '0 0 15px rgba(255,215,0,0.25)',
              }}>
                {/* Confined Image Container */}
                <div style={{
                  width: '100%',
                  height: 160,
                  maxHeight: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: '#040508',
                }}>
                  <img
                    src={imageData}
                    alt="Task visual attachment"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>

                {/* Overlay actions */}
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(10, 13, 22, 0.95)',
                  borderTop: '1px solid rgba(255,215,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-bright)', fontFamily: 'var(--font-hud)' }}>
                    ATTACHMENT ACTIVE
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-gold btn-gold-ghost"
                      style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                    >
                      <Upload size={12} /> Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn-gold btn-gold-danger"
                      style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Image Placeholder when no image */
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  height: 120,
                  borderRadius: 8,
                  border: '2px dashed rgba(255, 215, 0, 0.35)',
                  background: 'rgba(12, 16, 26, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: 12,
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-primary)';
                  e.currentTarget.style.background = 'rgba(255, 215, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.35)';
                  e.currentTarget.style.background = 'rgba(12, 16, 26, 0.5)';
                }}
              >
                {isProcessingImage ? (
                  <div style={{ color: 'var(--gold-bright)', fontFamily: 'var(--font-hud)', fontSize: '0.85rem' }}>
                    OPTIMIZING IMAGE TELEMETRY...
                  </div>
                ) : (
                  <>
                    <ImageIcon size={30} color="var(--gold-primary)" style={{ opacity: 0.8, marginBottom: 6 }} />
                    <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: 'var(--gold-bright)' }}>
                      CLICK TO UPLOAD TASK IMAGE
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--space-text-dim)', marginTop: 2 }}>
                      Images are automatically confined to a fixed container to keep your taskboard sleek
                    </span>
                  </>
                )}
              </div>
            )}

            {imageError && (
              <div style={{
                marginTop: 8,
                padding: '6px 12px',
                borderRadius: 6,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <AlertCircle size={14} />
                {imageError}
              </div>
            )}
          </div>

          {/* Task Color Customization */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.75rem',
              color: 'var(--gold-bright)',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}>
              CUSTOMIZE TASK CARD COLOR
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
              {PRESET_TASK_COLORS.map((clr) => (
                <div
                  key={clr.name}
                  onClick={() => {
                    playButtonBlip();
                    setTaskColor(clr.value);
                    setTaskBorder(clr.border);
                  }}
                  title={clr.name}
                  style={{
                    height: 38,
                    borderRadius: 6,
                    background: clr.value,
                    border: taskColor === clr.value ? '2px solid var(--gold-primary)' : `1px solid ${clr.border}`,
                    boxShadow: taskColor === clr.value ? '0 0 10px var(--gold-primary)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {taskColor === clr.value && <Check size={16} color="var(--gold-primary)" />}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              onClick={() => { playButtonBlip(); onClose(); }}
              className="btn-gold btn-gold-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isProcessingImage}
              className="btn-gold"
              style={{ opacity: title.trim() ? 1 : 0.5 }}
            >
              <Sparkles size={16} />
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
