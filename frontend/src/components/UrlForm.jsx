import React, { useState } from 'react';
import { Link2, ArrowRight } from 'lucide-react';

const UrlForm = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('Please enter a URL to shorten.');
      return;
    }

    // Basic URL pattern check
    // We allow users to paste without http/https, but we format it before submitting
    let formattedUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch (_) {
      setError('Please enter a valid URL (e.g. https://example.com).');
      return;
    }

    onSubmit(formattedUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <div className="input-container">
        <Link2 className="input-icon" size={20} />
        <input
          type="text"
          className="url-input"
          placeholder="Paste your long link here..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError('');
          }}
          disabled={isLoading}
          id="url-input-field"
        />
      </div>
      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}
      <button type="submit" className="btn-primary" disabled={isLoading} id="shorten-btn">
        {isLoading ? (
          <>
            <div className="spinner"></div>
            <span>Shortening...</span>
          </>
        ) : (
          <>
            <span>Shorten URL</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
};

export default UrlForm;
