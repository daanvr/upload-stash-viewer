// Upload Stash Viewer — Stash Gallery View

import { escapeHtml, formatFileSize, formatTimeRemaining } from '../utils.js';
import { fetchStashThumbnailBlob } from '../api/commons.js';

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

    return `
      <div class="stash-card" data-action="view-file" data-filekey="${escapeHtml(file.filekey)}">
        <div class="stash-card-thumb" data-thumburl="${escapeHtml(file.thumburl || '')}">
          <div class="stash-card-icon">${escapeHtml(ext)}</div>
          <span class="stash-card-type">${escapeHtml(ext)}</span>
        </div>
        <div class="stash-card-info">
          <div class="stash-card-size">${formatFileSize(file.size)}${file.width ? ` &middot; ${file.width}&times;${file.height}` : ''}</div>
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

  // Load thumbnails asynchronously (they require authentication)
  loadThumbnails();
}

async function loadThumbnails() {
  const thumbContainers = document.querySelectorAll('.stash-card-thumb[data-thumburl]');
  for (const container of thumbContainers) {
    const thumbUrl = container.dataset.thumburl;
    if (!thumbUrl) continue;

    const blobUrl = await fetchStashThumbnailBlob(thumbUrl);
    if (blobUrl) {
      const img = document.createElement('img');
      img.src = blobUrl;
      img.alt = '';
      img.loading = 'lazy';
      // Remove the icon placeholder
      const icon = container.querySelector('.stash-card-icon');
      if (icon) icon.style.display = 'none';
      container.insertBefore(img, container.firstChild);
    }
  }
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
