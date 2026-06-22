import React, { useState } from 'react';
import { Copy, Check, BarChart2, ExternalLink } from 'lucide-react';

const ResultCard = ({ shortUrl, shortCode, onShowAnalytics }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
    }
  };

  return (
    <div className="glass-card result-container" id="result-card-container">
      <div className="result-header">
        <Check size={18} />
        <span>Your shortened link is ready!</span>
      </div>
      <div className="result-row">
        <div className="shortened-url-display">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            id="short-url-link"
          >
            {shortUrl}
            <ExternalLink size={14} style={{ opacity: 0.7 }} />
          </a>
        </div>
        <button
          className={`btn-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title="Copy to clipboard"
          id="copy-to-clipboard-btn"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
      <div className="card-actions">
        <button
          className="btn-analytics"
          onClick={() => onShowAnalytics(shortCode)}
          id="view-analytics-btn"
        >
          <BarChart2 size={16} />
          <span>View Real-Time Analytics</span>
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
