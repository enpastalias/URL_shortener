import React, { useEffect, useState } from 'react';
import { BarChart3, Calendar, Eye, Globe, ArrowLeft, RefreshCw } from 'lucide-react';
import urlApi from '../api/urlApi';

const Analytics = ({ shortCode, onBack, addToast }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await urlApi.get(`/api/url/${shortCode}`);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      const errMsg = err.response?.data?.error || 'Failed to fetch analytics for this short code.';
      setError(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shortCode) {
      fetchAnalytics();
    }
  }, [shortCode]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }} id="analytics-loading">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
          <span style={{ color: 'var(--text-secondary)' }}>Loading Real-Time Analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" id="analytics-error">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="error-banner">
            <span>{error}</span>
          </div>
          <button className="btn-primary" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card analytics-panel" id="analytics-panel-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="analytics-title">
          <BarChart3 size={22} style={{ color: 'var(--accent-cyan)' }} />
          <span>Link Analytics</span>
        </h3>
        <button
          onClick={fetchAnalytics}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          title="Refresh Analytics"
          id="refresh-analytics-btn"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="analytics-grid">
        <div className="stat-card">
          <div className="stat-label">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} />
              <span>Total Clicks</span>
            </div>
          </div>
          <span className="stat-value" id="analytics-clicks-value">{data?.clicks}</span>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} />
              <span>Created Date</span>
            </div>
          </div>
          <span className="stat-value" style={{ fontSize: '1.2rem', minHeight: '43px', display: 'flex', alignItems: 'center' }}>
            {formatDate(data?.createdAt)}
          </span>
        </div>

        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
          <div className="stat-label">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} />
              <span>Original Destination</span>
            </div>
          </div>
          <span className="stat-value large-text">
            <a
              href={data?.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
              id="analytics-original-url"
            >
              {data?.originalUrl}
            </a>
          </span>
        </div>
      </div>

      <div className="analytics-footer">
        <button className="btn-analytics" onClick={onBack} id="analytics-back-btn" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} />
          <span>Back to Shortener</span>
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Short Code: <strong style={{ color: 'var(--text-primary)' }}>{shortCode}</strong>
        </span>
      </div>
    </div>
  );
};

export default Analytics;
