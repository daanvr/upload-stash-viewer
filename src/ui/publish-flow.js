// Upload Stash Viewer — Publish Flow

import { escapeHtml } from '../utils.js';
import { publishFromStash } from '../api/commons.js';
import { DEMO_MODE } from '../config.js';

export function renderPublishButton(filekey, metadataComplete) {
  return `
    <div class="publish-section">
      <button
        class="btn btn-publish ${metadataComplete ? '' : 'btn-disabled'}"
        data-action="show-publish-confirm"
        data-filekey="${escapeHtml(filekey)}"
        ${metadataComplete ? '' : 'disabled'}
      >
        Publish to Commons
      </button>
      ${!metadataComplete ? '<p class="publish-hint">Fill in required metadata before publishing</p>' : ''}
      ${DEMO_MODE ? '<p class="publish-hint">Demo mode — publish is simulated</p>' : ''}
    </div>
  `;
}

export function renderPublishConfirmation(filename, wikitext, filekey) {
  const modal = document.getElementById('publish-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-backdrop" data-action="cancel-publish"></div>
    <div class="modal-content">
      <h3>Confirm Publication</h3>
      <div class="confirm-details">
        <div class="confirm-field">
          <strong>Filename:</strong> ${escapeHtml(filename)}
        </div>
        <div class="confirm-field">
          <strong>Wikitext:</strong>
          <pre class="confirm-wikitext">${escapeHtml(wikitext)}</pre>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-cancel" data-action="cancel-publish">Cancel</button>
        <button class="btn btn-publish" data-action="confirm-publish" data-filekey="${escapeHtml(filekey)}">
          Publish
        </button>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
}

export function hidePublishModal() {
  const modal = document.getElementById('publish-modal');
  if (modal) {
    modal.innerHTML = '';
    modal.classList.add('hidden');
  }
}

export async function handlePublish(filekey, filename, wikitext, onSuccess) {
  const modal = document.getElementById('publish-modal');
  if (!modal) return;

  // Show progress
  modal.querySelector('.modal-content').innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Publishing to Commons...</p>
    </div>
  `;

  try {
    const result = await publishFromStash(filekey, filename, wikitext);

    if (result.upload?.result === 'Success') {
      const fileUrl = result.upload.imageinfo?.descriptionurl
        || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}`;

      modal.querySelector('.modal-content').innerHTML = `
        <div class="publish-success">
          <h3>Published successfully!</h3>
          <p>
            <a href="${escapeHtml(fileUrl)}" target="_blank" rel="noopener">
              View on Commons &nearr;
            </a>
          </p>
          <button class="btn btn-primary" data-action="publish-done">Back to stash</button>
        </div>
      `;

      if (onSuccess) onSuccess(filekey);
    } else {
      const warning = result.upload?.warnings
        ? Object.entries(result.upload.warnings).map(([k, v]) => `${k}: ${v}`).join(', ')
        : 'Unknown issue';
      throw new Error(warning);
    }
  } catch (err) {
    modal.querySelector('.modal-content').innerHTML = `
      <div class="publish-error">
        <h3>Publication failed</h3>
        <p>${escapeHtml(err.message)}</p>
        <div class="modal-actions">
          <button class="btn btn-cancel" data-action="cancel-publish">Close</button>
          <button class="btn btn-primary" data-action="retry-publish"
            data-filekey="${escapeHtml(filekey)}">
            Try again
          </button>
        </div>
      </div>
    `;
  }
}
