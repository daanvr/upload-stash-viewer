// Upload Stash Viewer — Wikimedia Commons API

import { COMMONS_API, DEMO_MODE } from '../config.js';
import { fetchJSON, fetchWithAuth } from '../utils.js';
import { getAccessToken } from './oauth.js';
import { getMockStashList, getMockFileInfo } from './mock-data.js';

// --- Stash Operations (authenticated) ---

export async function fetchStashedFiles() {
  if (DEMO_MODE) return getMockStashList();

  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const params = new URLSearchParams({
    action: 'query',
    list: 'mystashedfiles',
    msfprop: 'size|type',
    format: 'json',
    formatversion: '2',
  });

  const data = await fetchWithAuth(`${COMMONS_API}?${params}`, token);
  return data.query?.mystashedfiles || [];
}

export async function fetchStashFileInfo(filekey) {
  if (DEMO_MODE) return getMockFileInfo(filekey);

  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const params = new URLSearchParams({
    action: 'query',
    prop: 'stashimageinfo',
    siifilekey: filekey,
    siiprop: 'timestamp|url|metadata|commonmetadata|mime|sha1|size|dimensions|bitdepth|badfile',
    siiurlwidth: '800',
    format: 'json',
    formatversion: '2',
  });

  const data = await fetchWithAuth(`${COMMONS_API}?${params}`, token);
  const pages = data.query?.pages;
  if (!pages || pages.length === 0) throw new Error('No file info returned');

  const info = pages[0].stashimageinfo?.[0];
  if (!info) throw new Error('No stash image info for this filekey');

  return {
    filekey,
    timestamp: info.timestamp,
    url: info.url,
    thumburl: info.thumburl || info.url,
    mime: info.mime,
    size: info.size,
    width: info.width,
    height: info.height,
    bitdepth: info.bitdepth,
    sha1: info.sha1,
    metadata: info.metadata || [],
    commonmetadata: info.commonmetadata || [],
  };
}

export async function fetchCSRFToken() {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const params = new URLSearchParams({
    action: 'query',
    meta: 'tokens',
    type: 'csrf',
    format: 'json',
  });

  const data = await fetchWithAuth(`${COMMONS_API}?${params}`, token, { noCache: true });
  return data.query?.tokens?.csrftoken;
}

export async function publishFromStash(filekey, filename, wikitext) {
  if (DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      upload: {
        result: 'Success',
        filename: filename,
        imageinfo: { descriptionurl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}` },
      },
    };
  }

  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const csrfToken = await fetchCSRFToken();

  const formData = new FormData();
  formData.append('action', 'upload');
  formData.append('filekey', filekey);
  formData.append('filename', filename);
  formData.append('text', wikitext);
  formData.append('comment', 'Uploaded via Upload Stash Viewer');
  formData.append('token', csrfToken);
  formData.append('format', 'json');

  const url = `${COMMONS_API}?crossorigin=`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Upload error: ${data.error.info}`);
  }

  return data;
}

// --- Category Search (unauthenticated) ---

export async function searchCategories(query) {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    action: 'opensearch',
    search: `Category:${query}`,
    namespace: '14',
    limit: '20',
    format: 'json',
    origin: '*',
  });

  const data = await fetchJSON(`${COMMONS_API}?${params}`);
  // opensearch returns [query, [titles], [descriptions], [urls]]
  const titles = data[1] || [];
  return titles.map(t => t.replace(/^Category:/, ''));
}

// --- License Templates ---

export const COMMON_LICENSES = [
  {
    id: 'cc-by-sa-4.0',
    template: '{{cc-by-sa-4.0|__AUTHOR__}}',
    label: 'CC BY-SA 4.0',
    description: 'Creative Commons Attribution-ShareAlike 4.0',
  },
  {
    id: 'cc-by-4.0',
    template: '{{cc-by-4.0|__AUTHOR__}}',
    label: 'CC BY 4.0',
    description: 'Creative Commons Attribution 4.0',
  },
  {
    id: 'cc-zero',
    template: '{{cc-zero}}',
    label: 'CC0 1.0',
    description: 'Creative Commons Zero — public domain dedication',
  },
  {
    id: 'pd-self',
    template: '{{PD-self}}',
    label: 'Public Domain (self)',
    description: 'Released into public domain by author',
  },
  {
    id: 'pd-old-auto',
    template: '{{PD-old-auto|deathyear=__YEAR__}}',
    label: 'Public Domain (old)',
    description: 'Author died 70+ years ago',
  },
];
