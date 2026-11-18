import React, { useState } from 'react';
import { Rocket, X, Sparkles } from 'lucide-react';
import { playButtonBlip } from '../utils/soundEffects';

export default function NewBoardModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [themePreset, setThemePreset] = useState('spaceship-void');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    playButtonBlip();
    onCreate(title.trim(), { backgroundType: themePreset });
    setTitle('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content corner-bracket" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(184,134,11,0.2) 100%)',
              border: '1px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(255,215,0,0.3)',
            }}>
              <Rocket size={20} color="var(--gold-primary)" />
            </div>
            <div>
              <h2 className="hud-title" style={{ fontSize: '1.25rem', letterSpacing: '0.1em' }}>
                INITIALIZE TASKBOARD
              </h2>
              <p className="hud-subtext" style={{ fontSize: '0.7rem' }}>ORBITAL MISSION CONTROL</p>
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
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.78rem',
              color: 'var(--gold-bright)',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}>
              TASKBOARD DESIGNATION / NAME
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Starship Deep Space Navigation, Q4 Sprint..."
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(5, 7, 12, 0.85)',
                border: '1px solid var(--gold-primary)',
                borderRadius: 6,
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 0 10px rgba(255,215,0,0.15)',
              }}
            />
          </div>

          {/* Theme Presets */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.78rem',
              color: 'var(--gold-bright)',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}>
              SPACESHIP THEME ENVIRONMENT
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { id: 'spaceship-void', label: 'Gold & Black', desc: 'Spaceship HUD' },
                { id: 'gold-stardust', label: 'Stardust Gold', desc: 'Solar Amber' },
                { id: 'cyber-grid', label: 'Cyber Grid', desc: 'Deep Orbital' },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => { playButtonBlip(); setThemePreset(p.id); }}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 6,
                    border: themePreset === p.id ? '2px solid var(--gold-primary)' : '1px solid rgba(255,215,0,0.2)',
                    background: themePreset === p.id ? 'rgba(255,215,0,0.18)' : 'rgba(15,19,30,0.6)',
                    boxShadow: themePreset === p.id ? '0 0 12px rgba(255,215,0,0.4)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', color: themePreset === p.id ? 'var(--gold-bright)' : '#fff' }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--space-text-dim)', marginTop: 2 }}>
                    {p.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
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
              disabled={!title.trim()}
              className="btn-gold"
              style={{ opacity: title.trim() ? 1 : 0.5, cursor: title.trim() ? 'pointer' : 'not-allowed' }}
            >
              <Sparkles size={16} />
              Launch Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
