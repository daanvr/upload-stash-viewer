// Upload Stash Viewer — Metadata Editor

import { escapeHtml, sanitizeFilename } from '../utils.js';
import { searchCategories, COMMON_LICENSES } from '../api/commons.js';

let selectedCategories = [];
let searchTimeout = null;

export function renderMetadataForm(fileInfo, username) {
  // Pre-fill from metadata
  const metadata = fileInfo.metadata || [];
  const commonmetadata = fileInfo.commonmetadata || [];
  const artist = findMeta(commonmetadata, 'Artist') || findMeta(metadata, 'Artist') || username || '';
  const dateOriginal = findMeta(metadata, 'DateTimeOriginal');
  const dateValue = dateOriginal ? formatExifDate(dateOriginal) : '';

  // Suggest filename
  const rawName = fileInfo.suggestedFilename || fileInfo.filekey?.split('.')[0] || '';
  const ext = fileInfo.filekey?.match(/\.([^.]+)$/)?.[1] || 'jpg';

  selectedCategories = [];

  const licenseOptions = COMMON_LICENSES.map(lic => `
    <label class="license-option">
      <input type="radio" name="license" value="${escapeHtml(lic.id)}" ${lic.id === 'cc-by-sa-4.0' ? 'checked' : ''} />
      <span class="license-label">${escapeHtml(lic.label)}</span>
      <span class="license-desc">${escapeHtml(lic.description)}</span>
    </label>
  `).join('');

  return `
    <div class="metadata-form">
      <h3>Edit Metadata</h3>

      <div class="form-group">
        <label for="meta-filename">Filename</label>
        <div class="filename-input">
          <input type="text" id="meta-filename" value="${escapeHtml(rawName)}" placeholder="Descriptive filename" />
          <span class="filename-ext">.${escapeHtml(ext)}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="meta-description-en">Description (English)</label>
        <textarea id="meta-description-en" rows="3" placeholder="What is depicted in this file?"></textarea>
      </div>

      <div class="form-group">
        <label for="meta-description-nl">Description (Nederlands, optional)</label>
        <textarea id="meta-description-nl" rows="2" placeholder="Wat is er te zien op dit bestand?"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="meta-date">Date</label>
          <input type="date" id="meta-date" value="${escapeHtml(dateValue)}" />
        </div>

        <div class="form-group">
          <label for="meta-author">Author</label>
          <input type="text" id="meta-author" value="${escapeHtml(artist)}" placeholder="Creator name" />
        </div>
      </div>

      <div class="form-group">
        <label for="meta-source">Source</label>
        <select id="meta-source">
          <option value="own" selected>Own work</option>
          <option value="url">URL</option>
          <option value="other">Other</option>
        </select>
        <input type="text" id="meta-source-detail" class="hidden" placeholder="Source URL or description" />
      </div>

      <div class="form-group">
        <label>License</label>
        <div class="license-group">${licenseOptions}</div>
      </div>

      <div class="form-group">
        <label for="meta-categories">Categories</label>
        <div class="category-search-wrap">
          <input type="text" id="meta-categories" placeholder="Search Commons categories..." autocomplete="off" />
          <div id="category-results" class="category-results hidden"></div>
        </div>
        <div id="selected-categories" class="selected-categories"></div>
      </div>

      <div class="form-group">
        <label>
          Wikitext Preview
          <button type="button" class="btn btn-sm" data-action="toggle-wikitext">Show/Hide</button>
        </label>
        <pre id="wikitext-preview" class="wikitext-preview"></pre>
      </div>
    </div>
  `;
}

export function getFormData() {
  const filename = document.getElementById('meta-filename')?.value || '';
  const ext = document.querySelector('.filename-ext')?.textContent || '';
  const descEn = document.getElementById('meta-description-en')?.value || '';
  const descNl = document.getElementById('meta-description-nl')?.value || '';
  const date = document.getElementById('meta-date')?.value || '';
  const author = document.getElementById('meta-author')?.value || '';
  const sourceType = document.getElementById('meta-source')?.value || 'own';
  const sourceDetail = document.getElementById('meta-source-detail')?.value || '';
  const licenseId = document.querySelector('input[name="license"]:checked')?.value || 'cc-by-sa-4.0';

  return {
    filename: sanitizeFilename(filename) + ext,
    descEn,
    descNl,
    date,
    author,
    sourceType,
    sourceDetail,
    licenseId,
    categories: [...selectedCategories],
  };
}

export function buildWikitext(formData) {
  // Description
  let description = '';
  if (formData.descEn) description += `{{en|1=${formData.descEn}}}`;
  if (formData.descNl) description += `{{nl|1=${formData.descNl}}}`;
  if (!description) description = '';

  // Source
  let source = '{{own}}';
  if (formData.sourceType === 'url') source = `[${formData.sourceDetail}]`;
  else if (formData.sourceType === 'other') source = formData.sourceDetail || '{{own}}';

  // Author
  const author = formData.author || 'Unknown';

  // License
  const license = COMMON_LICENSES.find(l => l.id === formData.licenseId) || COMMON_LICENSES[0];
  let licenseWikitext = license.template
    .replace('__AUTHOR__', author)
    .replace('__YEAR__', '');

  // Categories
  const categoryLines = formData.categories.map(c => `[[Category:${c}]]`).join('\n');

  return `=={{int:filedesc}}==
{{Information
|description=${description}
|date=${formData.date}
|source=${source}
|author=${author}
}}

=={{int:license-header}}==
${licenseWikitext}

${categoryLines}`;
}

export function updateWikitextPreview() {
  const preview = document.getElementById('wikitext-preview');
  if (!preview) return;
  const formData = getFormData();
  preview.textContent = buildWikitext(formData);
}

export function initMetadataForm() {
  // Source type toggle
  document.getElementById('meta-source')?.addEventListener('change', (e) => {
    const detail = document.getElementById('meta-source-detail');
    if (detail) {
      detail.classList.toggle('hidden', e.target.value === 'own');
    }
  });

  // Category search
  const catInput = document.getElementById('meta-categories');
  const catResults = document.getElementById('category-results');
  if (catInput && catResults) {
    catInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        const query = catInput.value.trim();
        if (query.length < 2) {
          catResults.classList.add('hidden');
          return;
        }
        try {
          const results = await searchCategories(query);
          if (results.length === 0) {
            catResults.classList.add('hidden');
            return;
          }
          catResults.innerHTML = results.map(cat => `
            <div class="category-result" data-action="add-category" data-category="${escapeHtml(cat)}">
              ${escapeHtml(cat)}
            </div>
          `).join('');
          catResults.classList.remove('hidden');
        } catch {
          catResults.classList.add('hidden');
        }
      }, 300);
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.category-search-wrap')) {
        catResults.classList.add('hidden');
      }
    });
  }

  // Update preview on any form change
  const form = document.querySelector('.metadata-form');
  if (form) {
    form.addEventListener('input', () => updateWikitextPreview());
    form.addEventListener('change', () => updateWikitextPreview());
  }

  // Initial preview
  updateWikitextPreview();
}

export function addCategory(name) {
  if (selectedCategories.includes(name)) return;
  selectedCategories.push(name);
  renderSelectedCategories();
  updateWikitextPreview();

  // Clear search
  const input = document.getElementById('meta-categories');
  const results = document.getElementById('category-results');
  if (input) input.value = '';
  if (results) results.classList.add('hidden');
}

export function removeCategory(name) {
  selectedCategories = selectedCategories.filter(c => c !== name);
  renderSelectedCategories();
  updateWikitextPreview();
}

function renderSelectedCategories() {
  const container = document.getElementById('selected-categories');
  if (!container) return;
  container.innerHTML = selectedCategories.map(cat => `
    <span class="category-chip">
      ${escapeHtml(cat)}
      <button type="button" data-action="remove-category" data-category="${escapeHtml(cat)}">&times;</button>
    </span>
  `).join('');
}

function findMeta(metadata, name) {
  if (!metadata) return null;
  const entry = metadata.find(m => m.name === name);
  return entry ? String(entry.value) : null;
}

function formatExifDate(exifDate) {
  // EXIF: "2026:03:13 14:30:22" → "2026-03-13"
  const match = exifDate.match(/^(\d{4}):(\d{2}):(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
}
