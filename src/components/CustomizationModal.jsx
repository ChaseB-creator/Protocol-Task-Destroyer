import React, { useState } from 'react';
import { X, Palette, Sparkles, Sliders, RotateCcw, Image, Check } from 'lucide-react';
import { playButtonBlip, playDeleteSound } from '../utils/soundEffects';
import { DEFAULT_THEME } from '../utils/storage';

const BG_PRESETS = [
  { id: 'spaceship-void', name: 'Spaceship Void', desc: 'Gold & Obsidian HUD', gradient: 'radial-gradient(circle at 50% 20%, rgba(255,215,0,0.12) 0%, #050608 70%)' },
  { id: 'gold-stardust', name: 'Solar Stardust', desc: 'Glowing Cosmic Amber', gradient: 'radial-gradient(circle at 50% 50%, rgba(255,165,0,0.18) 0%, #08090f 80%)' },
  { id: 'cyber-grid', name: 'Cyber Orbital Grid', desc: 'Cyan & Golden Matrix', gradient: 'radial-gradient(circle at 20% 20%, rgba(0,255,255,0.1) 0%, #05070d 80%)' },
  { id: 'deep-nebula', name: 'Deep Nebula', desc: 'Violet & Cosmic Dust', gradient: 'radial-gradient(circle at 80% 30%, rgba(168,85,247,0.15) 0%, #07060f 80%)' },
  { id: 'stealth-carbon', name: 'Stealth Carbon', desc: 'Deep Titanium Black', gradient: 'linear-gradient(180deg, #0d0f14 0%, #060709 100%)' },
];

const HEADER_COLOR_PRESETS = [
  { name: 'Metallic Gold', value: '#ffd700' },
  { name: 'Solar Amber', value: '#f59e0b' },
  { name: 'Orbital Cyan', value: '#06b6d4' },
  { name: 'Emerald Warp', value: '#10b981' },
  { name: 'Crimson Thruster', value: '#f43f5e' },
  { name: 'Starlight Violet', value: '#8b5cf6' },
  { name: 'Titanium White', value: '#e2e8f0' },
];

const TASK_BG_PRESETS = [
  { name: 'Obsidian Black', value: '#121622', border: 'rgba(255,215,0,0.25)' },
  { name: 'Deep Space Gold', value: '#1a170e', border: 'rgba(255,215,0,0.45)' },
  { name: 'Deep Azure', value: '#0d1527', border: 'rgba(56,189,248,0.35)' },
  { name: 'Void Slate', value: '#0f172a', border: 'rgba(148,163,184,0.3)' },
];

export default function CustomizationModal({ isOpen, onClose, currentTheme, onSaveTheme }) {
  const [theme, setTheme] = useState({ ...DEFAULT_THEME, ...currentTheme });
  const [activeTab, setActiveTab] = useState('background'); // 'background', 'headers', 'tasks'

  if (!isOpen) return null;

  const handleUpdate = (updates) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    playButtonBlip();
    onSaveTheme(theme);
    onClose();
  };

  const handleReset = () => {
    playDeleteSound();
    setTheme({ ...DEFAULT_THEME });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content corner-bracket" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(184,134,11,0.2) 100%)',
              border: '1px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Palette size={18} color="var(--gold-primary)" />
            </div>
            <div>
              <h2 className="hud-title" style={{ fontSize: '1.2rem', letterSpacing: '0.08em' }}>
                TASKBOARD CUSTOMIZER
              </h2>
              <p className="hud-subtext" style={{ fontSize: '0.68rem' }}>SPACESHIP INTERFACE CONFIGURATION</p>
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

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          borderBottom: '1px solid rgba(255,215,0,0.2)',
          paddingBottom: 12,
        }}>
          {[
            { id: 'background', label: '1. BOARD BACKGROUND' },
            { id: 'headers', label: '2. TASK HEADERS' },
            { id: 'tasks', label: '3. TASK CARDS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { playButtonBlip(); setActiveTab(tab.id); }}
              style={{
                background: activeTab === tab.id ? 'rgba(255,215,0,0.2)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--gold-primary)' : '1px solid transparent',
                borderRadius: 6,
                padding: '8px 14px',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.75rem',
                color: activeTab === tab.id ? 'var(--gold-bright)' : 'var(--space-text-dim)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Board Background */}
        {activeTab === 'background' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--space-text-dim)', marginBottom: 14 }}>
              Choose a sci-fi spaceship background preset, or configure a custom color or background image:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 18 }}>
              {BG_PRESETS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => { playButtonBlip(); handleUpdate({ backgroundType: p.id }); }}
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    background: p.gradient,
                    border: theme.backgroundType === p.id ? '2px solid var(--gold-primary)' : '1px solid rgba(255,215,0,0.2)',
                    boxShadow: theme.backgroundType === p.id ? '0 0 15px rgba(255,215,0,0.4)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.82rem', color: theme.backgroundType === p.id ? 'var(--gold-bright)' : '#fff' }}>
                      {p.name}
                    </span>
                    {theme.backgroundType === p.id && <Check size={16} color="var(--gold-primary)" />}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--space-text-dim)', marginTop: 4 }}>
                    {p.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Color Option */}
            <div style={{
              padding: 14,
              borderRadius: 8,
              background: 'rgba(12,16,26,0.6)',
              border: '1px solid rgba(255,215,0,0.2)',
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: 'var(--gold-bright)' }}>
                  CUSTOM SOLID COLOR
                </span>
                <input
                  type="color"
                  value={theme.customColor || '#0a0c14'}
                  onChange={(e) => handleUpdate({ backgroundType: 'custom-color', customColor: e.target.value })}
                  style={{ width: 44, height: 28, cursor: 'pointer', background: 'transparent', border: 'none' }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--space-text-dim)' }}>
                Pick any hex color code to set as the board background.
              </span>
            </div>

            {/* Custom Background Image URL */}
            <div style={{
              padding: 14,
              borderRadius: 8,
              background: 'rgba(12,16,26,0.6)',
              border: '1px solid rgba(255,215,0,0.2)',
            }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: 'var(--gold-bright)', marginBottom: 6 }}>
                CUSTOM BACKGROUND IMAGE (URL)
              </span>
              <input
                type="text"
                placeholder="https://example.com/starship-nebula.jpg"
                value={theme.customImage || ''}
                onChange={(e) => handleUpdate({
                  backgroundType: e.target.value ? 'custom-image' : theme.backgroundType,
                  customImage: e.target.value,
                })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: '#06080e',
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Task Headers */}
        {activeTab === 'headers' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--space-text-dim)', marginBottom: 14 }}>
              Select a custom color scheme for your task logs / column headers:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
              {HEADER_COLOR_PRESETS.map((clr) => (
                <div
                  key={clr.name}
                  onClick={() => { playButtonBlip(); handleUpdate({ headerColor: clr.value }); }}
                  style={{
                    padding: 12,
                    borderRadius: 6,
                    background: 'rgba(14,18,28,0.8)',
                    border: theme.headerColor === clr.value ? `2px solid ${clr.value}` : '1px solid rgba(255,215,0,0.2)',
                    boxShadow: theme.headerColor === clr.value ? `0 0 12px ${clr.value}66` : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: clr.value, boxShadow: `0 0 8px ${clr.value}` }} />
                    <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: '#fff' }}>{clr.name}</span>
                  </div>
                  {theme.headerColor === clr.value && <Check size={16} color={clr.value} />}
                </div>
              ))}
            </div>

            {/* Custom Hex Header Color */}
            <div style={{
              padding: 12,
              borderRadius: 8,
              background: 'rgba(12,16,26,0.6)',
              border: '1px solid rgba(255,215,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: 'var(--gold-bright)' }}>
                  CUSTOM HEADER COLOR PICKER
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--space-text-dim)' }}>
                  Selected: {theme.headerColor}
                </span>
              </div>
              <input
                type="color"
                value={theme.headerColor || '#ffd700'}
                onChange={(e) => handleUpdate({ headerColor: e.target.value })}
                style={{ width: 44, height: 28, cursor: 'pointer', background: 'transparent', border: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Task Cards */}
        {activeTab === 'tasks' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--space-text-dim)', marginBottom: 14 }}>
              Set the default background tint and border glow for all task cards:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
              {TASK_BG_PRESETS.map((clr) => (
                <div
                  key={clr.name}
                  onClick={() => {
                    playButtonBlip();
                    handleUpdate({ taskBgColor: clr.value, taskBorderColor: clr.border });
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 6,
                    background: clr.value,
                    border: theme.taskBgColor === clr.value ? '2px solid var(--gold-primary)' : `1px solid ${clr.border}`,
                    boxShadow: theme.taskBgColor === clr.value ? '0 0 12px rgba(255,215,0,0.4)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: '#fff' }}>{clr.name}</span>
                  {theme.taskBgColor === clr.value && <Check size={16} color="var(--gold-primary)" />}
                </div>
              ))}
            </div>

            {/* Custom Task Background Color */}
            <div style={{
              padding: 12,
              borderRadius: 8,
              background: 'rgba(12,16,26,0.6)',
              border: '1px solid rgba(255,215,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: 'var(--gold-bright)' }}>
                  CUSTOM TASK CARD TINT
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--space-text-dim)' }}>
                  Selected: {theme.taskBgColor}
                </span>
              </div>
              <input
                type="color"
                value={theme.taskBgColor || '#121622'}
                onChange={(e) => handleUpdate({ taskBgColor: e.target.value })}
                style={{ width: 44, height: 28, cursor: 'pointer', background: 'transparent', border: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 26,
          borderTop: '1px solid rgba(255,215,0,0.2)',
          paddingTop: 16,
        }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn-gold btn-gold-ghost"
            style={{ fontSize: '0.75rem', gap: 6 }}
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => { playButtonBlip(); onClose(); }}
              className="btn-gold btn-gold-ghost"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-gold"
            >
              <Sparkles size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
