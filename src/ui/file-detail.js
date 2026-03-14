// Upload Stash Viewer — File Detail View

import { escapeHtml, formatFileSize, formatTimeRemaining, formatTimestamp, isCameraDefaultFilename } from '../utils.js';

export function renderFileDetail(fileInfo) {
  const container = document.getElementById('file-detail');
  const expiry = fileInfo.timestamp ? formatTimeRemaining(fileInfo.timestamp) : null;
  const isImage = fileInfo.mime?.startsWith('image/');
  const hasImage = fileInfo.url || fileInfo.thumburl;

  const metadataStatus = renderMetadataStatus(fileInfo);
  const exifSection = renderExifData(fileInfo.metadata);

  container.innerHTML = `
    <div class="detail-header">
      <button class="btn btn-back" data-action="back-to-gallery">&larr; Back to stash</button>
      ${expiry
        ? `<span class="detail-expiry ${expiry.className}">
            ${expiry.expired ? 'Expired' : expiry.text + ' remaining'}
          </span>`
        : ''
      }
    </div>

    <div class="detail-layout">
      <div class="detail-image">
        ${isImage && hasImage
          ? `<img src="${escapeHtml(fileInfo.url || fileInfo.thumburl)}" alt="Stashed file preview" />`
          : `<div class="detail-no-preview">
              <span class="file-type-large">${escapeHtml(fileInfo.mime || 'Unknown type')}</span>
              <p>No preview available</p>
            </div>`
        }
      </div>

      <div class="detail-meta">
        <h3>File Properties</h3>
        <table class="meta-table">
          <tr><th>MIME Type</th><td>${escapeHtml(fileInfo.mime)}</td></tr>
          <tr><th>Size</th><td>${formatFileSize(fileInfo.size)}</td></tr>
          ${fileInfo.width ? `<tr><th>Dimensions</th><td>${fileInfo.width} &times; ${fileInfo.height} px</td></tr>` : ''}
          ${fileInfo.bitdepth ? `<tr><th>Bit Depth</th><td>${fileInfo.bitdepth}</td></tr>` : ''}
          ${fileInfo.sha1 ? `<tr><th>SHA-1</th><td><code>${escapeHtml(fileInfo.sha1)}</code></td></tr>` : ''}
          ${fileInfo.timestamp ? `<tr><th>Uploaded</th><td>${formatTimestamp(fileInfo.timestamp)}</td></tr>` : ''}
          <tr><th>File Key</th><td><code>${escapeHtml(fileInfo.filekey)}</code></td></tr>
        </table>

        ${metadataStatus}
        ${exifSection}
      </div>
    </div>
  `;
}

export function renderMetadataStatus(fileInfo) {
  const metadata = fileInfo.metadata || [];
  const commonmetadata = fileInfo.commonmetadata || [];

  // Extract what we can from metadata
  const artist = findMetaValue(commonmetadata, 'Artist') || findMetaValue(metadata, 'Artist');
  const copyright = findMetaValue(commonmetadata, 'Copyright') || findMetaValue(metadata, 'Copyright');
  const dateOriginal = findMetaValue(metadata, 'DateTimeOriginal');
  const gpsLat = findMetaValue(metadata, 'GPSLatitude');

  // Determine suggested filename status
  const suggestedName = fileInfo.suggestedFilename || fileInfo.filekey?.split('.').pop();
  const hasCameraDefault = fileInfo.suggestedFilename
    ? isCameraDefaultFilename(fileInfo.suggestedFilename)
    : false;

  const checks = [
    // Legal requirements
    { label: 'Author', status: artist ? 'ok' : 'missing', tier: 'legal', value: artist },
    { label: 'Source', status: 'missing', tier: 'legal', value: null },
    { label: 'License', status: copyright ? 'hint' : 'missing', tier: 'legal', value: copyright ? `Hint: ${copyright}` : null },

    // Community best practices
    { label: 'Description', status: 'missing', tier: 'community', value: null },
    { label: 'Categories', status: 'missing', tier: 'community', value: null },
    { label: 'Date', status: dateOriginal ? 'ok' : 'missing', tier: 'community', value: dateOriginal },

    // Technical
    { label: 'Meaningful filename', status: hasCameraDefault ? 'missing' : 'ok', tier: 'technical', value: hasCameraDefault ? 'Camera default detected' : null },
  ];

  const okCount = checks.filter(c => c.status === 'ok').length;
  const total = checks.length;
  const allOk = okCount === total;

  return `
    <div class="metadata-status">
      <h3>Publication Readiness
        <span class="readiness-badge ${allOk ? 'readiness-ok' : 'readiness-incomplete'}">
          ${okCount}/${total}
        </span>
      </h3>

      <div class="status-section">
        <h4 class="status-tier-legal">Legally Required</h4>
        ${renderChecks(checks.filter(c => c.tier === 'legal'))}
      </div>

      <div class="status-section">
        <h4 class="status-tier-community">Community Best Practice</h4>
        ${renderChecks(checks.filter(c => c.tier === 'community'))}
      </div>

      <div class="status-section">
        <h4 class="status-tier-technical">Technical</h4>
        ${renderChecks(checks.filter(c => c.tier === 'technical'))}
      </div>
    </div>
  `;
}

function renderChecks(checks) {
  return checks.map(check => {
    const icon = check.status === 'ok' ? '&#10003;' : check.status === 'hint' ? '~' : '&#10007;';
    const cls = check.status === 'ok' ? 'check-ok' : check.status === 'hint' ? 'check-hint' : 'check-missing';
    return `
      <div class="status-check ${cls}">
        <span class="check-icon">${icon}</span>
        <span class="check-label">${escapeHtml(check.label)}</span>
        ${check.value ? `<span class="check-value">${escapeHtml(check.value)}</span>` : ''}
      </div>
    `;
  }).join('');
}

function renderExifData(metadata) {
  if (!metadata || metadata.length === 0) return '';

  const rows = metadata.map(m => `
    <tr>
      <th>${escapeHtml(m.name)}</th>
      <td>${escapeHtml(String(m.value))}</td>
    </tr>
  `).join('');

  return `
    <details class="exif-details">
      <summary>EXIF / Raw Metadata (${metadata.length} fields)</summary>
      <table class="meta-table">${rows}</table>
    </details>
  `;
}

function findMetaValue(metadata, name) {
  if (!metadata) return null;
  const entry = metadata.find(m => m.name === name);
  return entry ? String(entry.value) : null;
}

export function renderDetailLoading() {
  const container = document.getElementById('file-detail');
  container.innerHTML = `
    <div class="detail-header">
      <button class="btn btn-back" data-action="back-to-gallery">&larr; Back to stash</button>
    </div>
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading file details...</p>
    </div>
  `;
}

export function renderDetailError(message) {
  const container = document.getElementById('file-detail');
  container.innerHTML = `
    <div class="detail-header">
      <button class="btn btn-back" data-action="back-to-gallery">&larr; Back to stash</button>
    </div>
    <div class="error-state">
      <h2>Could not load file details</h2>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}
