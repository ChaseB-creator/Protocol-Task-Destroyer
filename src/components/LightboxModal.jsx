import React from 'react';
import { X, ZoomIn } from 'lucide-react';
import { playButtonBlip } from '../utils/soundEffects';

export default function LightboxModal({ isOpen, imageSrc, title, onClose }) {
  if (!isOpen || !imageSrc) return null;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div style={{
        position: 'absolute',
        top: 20,
        right: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <span style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '0.85rem',
          color: 'var(--gold-bright)',
          letterSpacing: '0.1em',
          textShadow: '0 0 10px rgba(255,215,0,0.5)',
        }}>
          {title || 'TASK IMAGE TELEMETRY'}
        </span>
        <button
          onClick={() => { playButtonBlip(); onClose(); }}
          style={{
            background: 'rgba(255,215,0,0.2)',
            border: '1px solid var(--gold-primary)',
            borderRadius: '50%',
            color: '#fff',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={22} color="var(--gold-primary)" />
        </button>
      </div>

      <img
        src={imageSrc}
        alt={title || 'Full resolution task image'}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
