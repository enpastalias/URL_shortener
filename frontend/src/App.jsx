import React, { useState } from 'react';
import { Zap, Sparkles } from 'lucide-react';
import UrlForm from './components/UrlForm';
import ResultCard from './components/ResultCard';
import Analytics from './components/Analytics';
import Toast from './components/Toast';
import urlApi from './api/urlApi';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeAnalyticsCode, setActiveAnalyticsCode] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleShorten = async (url) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await urlApi.post('/api/url/shorten', { url });
      setResult(response.data);
      addToast('URL shortened successfully!', 'success');
    } catch (err) {
      console.error('Error shortening URL:', err);
      const errMsg = err.response?.data?.error || 'Failed to shorten URL. Please try again.';
      addToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <Zap size={36} style={{ color: 'var(--accent-cyan)' }} />
          <h1 className="logo-text" id="main-title">ZipLink</h1>
        </div>
        <p className="subtitle">
          Transform long, cluttered URLs into clean, memorable, and trackable links in just one click.
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {activeAnalyticsCode ? (
          <Analytics
            shortCode={activeAnalyticsCode}
            onBack={() => setActiveAnalyticsCode(null)}
            addToast={addToast}
          />
        ) : (
          <>
            <div className="glass-card">
              <UrlForm onSubmit={handleShorten} isLoading={loading} />
            </div>

            {result && (
              <ResultCard
                shortUrl={result.shortUrl}
                shortCode={result.shortCode}
                onShowAnalytics={(code) => setActiveAnalyticsCode(code)}
              />
            )}
          </>
        )}
      </main>

      <footer>
        <p>
          Created with{' '}
          <Sparkles
            size={14}
            style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--accent-pink)', marginRight: '4px' }}
          />
          using React, Node, and MongoDB.
        </p>
      </footer>

      {/* Toast Notifications */}
      <div className="toast-container" id="toast-container-div">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
