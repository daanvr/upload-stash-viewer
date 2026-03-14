// Upload Stash Viewer — Shared Utilities

import { STASH_EXPIRY_HOURS } from './config.js';

// --- API Cache ---

export class ApiCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key, data, ttlMs = 300000) {
    this.cache.set(key, { data, expires: Date.now() + ttlMs });
  }
}

export const apiCache = new ApiCache();

// --- Fetch Helpers ---

export async function fetchJSON(url, options = {}) {
  const cacheKey = url;
  if (!options.noCache) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();

  if (!options.noCache && (!options.method || options.method === 'GET')) {
    apiCache.set(cacheKey, data);
  }
  return data;
}

export async function fetchWithAuth(url, accessToken, options = {}) {
  const urlObj = new URL(url);
  urlObj.searchParams.set('crossorigin', '');

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
  };

  const response = await fetch(urlObj.toString(), { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// --- HTML Helpers ---

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

// --- Formatting ---

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return `${size} ${units[i]}`;
}

export function formatTimeRemaining(uploadTimestamp) {
  const uploadTime = new Date(uploadTimestamp).getTime();
  const expiryTime = uploadTime + STASH_EXPIRY_HOURS * 60 * 60 * 1000;
  const remaining = expiryTime - Date.now();

  if (remaining <= 0) {
    return { text: 'Expired', urgent: true, expired: true, className: 'expiry-expired' };
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  let className = 'expiry-ok';
  let urgent = false;
  if (hours < 6) {
    className = 'expiry-critical';
    urgent = true;
  } else if (hours < 24) {
    className = 'expiry-warning';
  }

  const text = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  return { text, urgent, expired: false, className };
}

export function formatTimestamp(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString();
}

// --- Filename Helpers ---

const CAMERA_DEFAULT_PATTERNS = [
  /^IMG_\d+/i,
  /^DSC_?\d+/i,
  /^DSCF?\d+/i,
  /^P\d{7,}/i,
  /^SAM_\d+/i,
  /^GOPR\d+/i,
  /^GP\d+/i,
  /^Screenshot/i,
  /^\d{8}_\d{6}/,
];

export function isCameraDefaultFilename(filename) {
  const name = filename.replace(/\.[^.]+$/, '');
  return CAMERA_DEFAULT_PATTERNS.some(pattern => pattern.test(name));
}

export function sanitizeFilename(filename) {
  return filename
    .replace(/[#<>[\]|{}]/g, '-')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .trim();
}
