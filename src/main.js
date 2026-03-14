// Upload Stash Viewer — Entry Point

import './style.css';
import { DEMO_MODE } from './config.js';
import { login, handleCallback, isAuthenticated, fetchUserProfile, logout } from './api/oauth.js';
import { fetchStashedFiles, fetchStashFileInfo } from './api/commons.js';
import { renderStashGallery, renderStashLoading, renderStashError, stopExpiryTimers } from './ui/stash-view.js';
import { renderFileDetail, renderDetailLoading, renderDetailError } from './ui/file-detail.js';
import { renderMetadataForm, initMetadataForm, getFormData, buildWikitext, addCategory, removeCategory } from './ui/metadata-form.js';
import { renderToolSuggestions } from './ui/tool-suggest.js';
import { renderPublishButton, renderPublishConfirmation, hidePublishModal, handlePublish } from './ui/publish-flow.js';
import { escapeHtml } from './utils.js';

let currentFiles = [];
let currentFileInfo = null;

// --- View Management ---

function showView(viewName) {
  const gallery = document.getElementById('stash-gallery');
  const detail = document.getElementById('file-detail');

  if (viewName === 'gallery') {
    gallery.classList.remove('hidden');
    detail.classList.add('hidden');
  } else if (viewName === 'detail') {
    gallery.classList.add('hidden');
    detail.classList.remove('hidden');
  }
}

// --- Auth UI ---

function renderAuthArea(user) {
  const area = document.getElementById('auth-area');
  if (!area) return;

  if (DEMO_MODE) {
    area.innerHTML = `<span class="auth-demo">Demo Mode</span>`;
  } else if (user) {
    area.innerHTML = `
      <span class="auth-user">Logged in as <strong>${escapeHtml(user.username)}</strong></span>
      <button class="btn btn-sm btn-logout" data-action="logout">Log out</button>
    `;
  } else {
    area.innerHTML = `
      <button class="btn btn-login" data-action="login">Log in with Wikimedia</button>
    `;
  }
}

function renderDemoBanner() {
  const banner = document.getElementById('demo-banner');
  if (!banner) return;

  if (DEMO_MODE) {
    banner.innerHTML = `
      <div class="demo-banner-content">
        <strong>Demo Mode</strong> — Showing sample data. Set a real OAuth Client ID in
        <code>src/config.js</code> to connect to your Wikimedia account.
      </div>
    `;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

function renderLoginPrompt() {
  const container = document.getElementById('stash-gallery');
  container.innerHTML = `
    <div class="login-prompt">
      <h2>Welcome to Upload Stash Viewer</h2>
      <p>Log in with your Wikimedia account to view and manage your upload stash on Commons.</p>
      <button class="btn btn-login btn-large" data-action="login">Log in with Wikimedia</button>
    </div>
  `;
}

// --- Data Loading ---

async function loadStash() {
  renderStashLoading();
  try {
    currentFiles = await fetchStashedFiles();
    renderStashGallery(currentFiles);
  } catch (err) {
    console.error('Failed to load stash:', err);
    renderStashError(err.message);
  }
}

async function loadFileDetail(filekey) {
  showView('detail');
  renderDetailLoading();

  try {
    const fileInfo = await fetchStashFileInfo(filekey);
    currentFileInfo = fileInfo;

    // Render the main detail view
    renderFileDetail(fileInfo);

    // Get username for form pre-fill
    const user = await fetchUserProfile();
    const username = user?.username || '';

    // Append tool suggestions
    const detailMeta = document.querySelector('.detail-meta');
    if (detailMeta) {
      detailMeta.insertAdjacentHTML('beforeend', renderToolSuggestions(fileInfo));
      detailMeta.insertAdjacentHTML('beforeend', renderMetadataForm(fileInfo, username));
      detailMeta.insertAdjacentHTML('beforeend', renderPublishButton(filekey, false));
    }

    // Initialize form interactivity
    initMetadataForm();

  } catch (err) {
    console.error('Failed to load file detail:', err);
    renderDetailError(err.message);
  }
}

// --- Event Delegation ---

function setupEventDelegation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;

    switch (action) {
      case 'login':
        login();
        break;

      case 'logout':
        logout();
        break;

      case 'view-file': {
        const filekey = btn.dataset.filekey;
        if (filekey) loadFileDetail(filekey);
        break;
      }

      case 'back-to-gallery':
        stopExpiryTimers();
        showView('gallery');
        currentFileInfo = null;
        // Re-render gallery to update expiry timers
        if (currentFiles.length > 0) renderStashGallery(currentFiles);
        break;

      case 'retry-stash':
        loadStash();
        break;

      case 'add-category': {
        const cat = btn.dataset.category;
        if (cat) addCategory(cat);
        break;
      }

      case 'remove-category': {
        const cat = btn.dataset.category;
        if (cat) removeCategory(cat);
        break;
      }

      case 'toggle-wikitext': {
        const preview = document.getElementById('wikitext-preview');
        if (preview) preview.classList.toggle('hidden');
        break;
      }

      case 'show-publish-confirm': {
        const filekey = btn.dataset.filekey;
        if (!filekey) break;
        const formData = getFormData();
        const wikitext = buildWikitext(formData);
        renderPublishConfirmation(formData.filename, wikitext, filekey);
        break;
      }

      case 'cancel-publish':
        hidePublishModal();
        break;

      case 'confirm-publish': {
        const filekey = btn.dataset.filekey;
        if (!filekey) break;
        const formData = getFormData();
        const wikitext = buildWikitext(formData);
        handlePublish(filekey, formData.filename, wikitext, (publishedKey) => {
          currentFiles = currentFiles.filter(f => f.filekey !== publishedKey);
        });
        break;
      }

      case 'publish-done':
        hidePublishModal();
        showView('gallery');
        if (currentFiles.length > 0) {
          renderStashGallery(currentFiles);
        } else {
          loadStash();
        }
        break;

      case 'retry-publish': {
        const filekey = btn.dataset.filekey;
        if (!filekey) break;
        const formData = getFormData();
        const wikitext = buildWikitext(formData);
        handlePublish(filekey, formData.filename, wikitext, (publishedKey) => {
          currentFiles = currentFiles.filter(f => f.filekey !== publishedKey);
        });
        break;
      }
    }
  });
}

// --- Init ---

async function init() {
  renderDemoBanner();

  // Handle OAuth callback if returning from Wikimedia
  const callbackHandled = await handleCallback();

  // Check auth state
  const authenticated = isAuthenticated() || DEMO_MODE;
  const user = authenticated ? await fetchUserProfile() : null;
  renderAuthArea(user);

  if (authenticated) {
    loadStash();
  } else {
    renderLoginPrompt();
  }

  setupEventDelegation();
}

init();
