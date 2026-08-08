import React from 'react';
import { useStore } from '../context/StoreContext';
import { sizeChart } from '../data/mockData';
import { X, Ruler } from 'lucide-react';

export const SizeGuideModal = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content animate-scaleIn" style={{ padding: '32px', maxWidth: '580px' }}>
        <button
          className="modal-close"
          onClick={() => setIsSizeGuideOpen(false)}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Ruler color="var(--accent-primary)" size={24} />
          <h2 style={{ fontSize: '1.4rem' }}>OFFICIAL SIZE GUIDE</h2>
        </div>

        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
          All measurements are in inches. Standard Indian fit sizing.
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px', textAlign: 'left', color: 'var(--accent-primary)' }}>SIZE</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>CHEST</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>LENGTH</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>SHOULDER</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>SLEEVE</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.size}</td>
                  <td style={{ padding: '10px' }}>{row.chest}</td>
                  <td style={{ padding: '10px' }}>{row.length}</td>
                  <td style={{ padding: '10px' }}>{row.shoulder}</td>
                  <td style={{ padding: '10px' }}>{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          💡 <strong>Pro Tip:</strong> For an <em>oversized/streetwear drop-shoulder fit</em>, we recommend ordering one size up from your usual regular size.
        </div>
      </div>
    </div>
  );
};
