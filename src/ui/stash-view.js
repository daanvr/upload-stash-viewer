// Upload Stash Viewer — Stash Gallery View

import { escapeHtml, formatFileSize, formatTimeRemaining } from '../utils.js';

let expiryInterval = null;

export function renderStashGallery(files) {
  const container = document.getElementById('stash-gallery');

  if (!files || files.length === 0) {
    container.innerHTML = renderEmptyStash();
    return;
  }

  const cards = files.map(file => {
    const expiry = file.timestamp ? formatTimeRemaining(file.timestamp) : null;
    const ext = file.filekey?.split('.').pop()?.toUpperCase() || '?';
    const isImage = file.type?.startsWith('image/');
    const hasThumbnail = file.thumburl && isImage && file.type !== 'image/tiff';

    return `
      <div class="stash-card" data-action="view-file" data-filekey="${escapeHtml(file.filekey)}">
        <div class="stash-card-thumb">
          ${hasThumbnail
            ? `<img src="${escapeHtml(file.thumburl)}" alt="" loading="lazy" />`
            : `<div class="stash-card-icon">${escapeHtml(ext)}</div>`
          }
          <span class="stash-card-type">${escapeHtml(ext)}</span>
        </div>
        <div class="stash-card-info">
          <div class="stash-card-size">${formatFileSize(file.size)}</div>
          ${expiry
            ? `<div class="stash-card-expiry ${expiry.className}" data-timestamp="${escapeHtml(file.timestamp)}">
                ${expiry.expired ? 'Expired' : expiry.text + ' left'}
              </div>`
            : ''
          }
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `<div class="stash-grid">${cards}</div>`;
  startExpiryTimers();
}

function renderEmptyStash() {
  return `
    <div class="empty-state">
      <h2>Your upload stash is empty</h2>
      <p>Files uploaded to the stash will appear here. You can upload files using the
        <a href="https://commons.wikimedia.org/wiki/Special:UploadWizard" target="_blank" rel="noopener">Upload Wizard</a>
        with the stash option, or other upload tools.</p>
      <p>Stashed files are automatically deleted after 48 hours.</p>
    </div>
  `;
}

export function renderStashLoading() {
  const container = document.getElementById('stash-gallery');
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading your upload stash...</p>
    </div>
  `;
}

export function renderStashError(message) {
  const container = document.getElementById('stash-gallery');
  container.innerHTML = `
    <div class="error-state">
      <h2>Could not load stash</h2>
      <p>${escapeHtml(message)}</p>
      <button data-action="retry-stash" class="btn btn-primary">Try again</button>
    </div>
  `;
}

export function startExpiryTimers() {
  stopExpiryTimers();
  expiryInterval = setInterval(() => {
    document.querySelectorAll('.stash-card-expiry[data-timestamp]').forEach(el => {
      const timestamp = el.dataset.timestamp;
      const expiry = formatTimeRemaining(timestamp);
      el.className = `stash-card-expiry ${expiry.className}`;
      el.textContent = expiry.expired ? 'Expired' : expiry.text + ' left';
    });
  }, 60000);
}

export function stopExpiryTimers() {
  if (expiryInterval) {
    clearInterval(expiryInterval);
    expiryInterval = null;
  }
}
