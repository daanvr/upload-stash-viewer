// Upload Stash Viewer — Tool Suggestion Engine

import { escapeHtml } from '../utils.js';

const TOOL_DATABASE = [
  {
    name: 'Metadata Enrichment Map',
    url: 'https://daanvr.github.io/metadata-enrichment-map/',
    description: 'Enrich files with nearby geo-data from Wikidata, OSM, Commons, and Mapillary',
    icon: 'map',
    matchFn: (info) => {
      const hasGPS = hasMetaField(info, 'GPSLatitude');
      return hasGPS ? 2 : 0;
    },
    reason: (info) => 'This file has GPS coordinates — enrich it with nearby data',
  },
  {
    name: 'Commons Category Search',
    url: 'https://commons.wikimedia.org/wiki/Special:Categories',
    description: 'Browse and search the Commons category tree',
    icon: 'folder',
    matchFn: () => 1,
    reason: () => 'Find the right categories for your file',
  },
  {
    name: 'Wikidata Item Search',
    url: 'https://www.wikidata.org/wiki/Special:Search',
    description: 'Find Wikidata items to link as depicts or main subject',
    icon: 'link',
    matchFn: () => 1,
    reason: () => 'Link structured data (depicts, main subject) to Wikidata items',
  },
  {
    name: 'CropTool',
    url: 'https://croptool.toolforge.org/',
    description: 'Crop and rotate images already on Commons',
    icon: 'crop',
    matchFn: (info) => {
      const isImage = info.mime?.startsWith('image/') && info.mime !== 'image/svg+xml';
      return isImage ? 1 : 0;
    },
    reason: () => 'Crop or straighten the image after publishing',
  },
  {
    name: 'OpenRefine (Wikimedia)',
    url: 'https://openrefine.org/',
    description: 'Reconcile metadata against Wikidata for GLAM batches',
    icon: 'table',
    matchFn: (info) => {
      const isTiff = info.mime === 'image/tiff';
      const isHighRes = (info.width || 0) > 4000;
      return (isTiff || isHighRes) ? 1 : 0;
    },
    reason: () => 'High-resolution or TIFF file — likely a GLAM/digitization batch',
  },
  {
    name: 'Pattypan',
    url: 'https://github.com/yarl/pattypan',
    description: 'Batch upload via spreadsheet — good for structured collections',
    icon: 'grid',
    matchFn: (info) => {
      const isTiff = info.mime === 'image/tiff';
      return isTiff ? 1 : 0;
    },
    reason: () => 'TIFF files often come from digitization — Pattypan handles batch metadata well',
  },
  {
    name: 'Curator Tool',
    url: 'https://curator-tool.toolforge.org/',
    description: 'Import and curate street-level imagery from Mapillary to Commons',
    icon: 'camera',
    matchFn: (info) => {
      const hasGPS = hasMetaField(info, 'GPSLatitude');
      const isJpeg = info.mime === 'image/jpeg';
      return (hasGPS && isJpeg) ? 1 : 0;
    },
    reason: () => 'Geotagged JPEG — might be street-level photography',
  },
];

function hasMetaField(info, fieldName) {
  return info.metadata?.some(m => m.name === fieldName);
}

export function getToolSuggestions(fileInfo) {
  return TOOL_DATABASE
    .map(tool => ({
      ...tool,
      score: tool.matchFn(fileInfo),
      reasonText: tool.reason(fileInfo),
    }))
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score);
}

const ICONS = {
  map: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/></svg>',
  folder: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>',
  link: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
  crop: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.13 1L6 16a2 2 0 002 2h15"/><path d="M1 6.13L16 6a2 2 0 012 2v15"/></svg>',
  table: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
  grid: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  camera: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
};

export function renderToolSuggestions(fileInfo) {
  const suggestions = getToolSuggestions(fileInfo);
  if (suggestions.length === 0) return '';

  const cards = suggestions.map(tool => `
    <a href="${escapeHtml(tool.url)}" target="_blank" rel="noopener" class="tool-card ${tool.score >= 2 ? 'tool-highlight' : ''}">
      <div class="tool-icon">${ICONS[tool.icon] || ''}</div>
      <div class="tool-info">
        <div class="tool-name">${escapeHtml(tool.name)}</div>
        <div class="tool-reason">${escapeHtml(tool.reasonText)}</div>
      </div>
      <span class="tool-external">&nearr;</span>
    </a>
  `).join('');

  return `
    <div class="tool-suggestions">
      <h3>Suggested Tools</h3>
      <div class="tool-list">${cards}</div>
    </div>
  `;
}
