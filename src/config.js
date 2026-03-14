// Upload Stash Viewer — Configuration

export const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
export const CLIENT_SECRET = ''; // Needed for refresh tokens (T323855); treated as public value

export const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
export const OAUTH_AUTHORIZE_URL = 'https://meta.wikimedia.org/w/rest.php/oauth2/authorize';
export const OAUTH_TOKEN_URL = 'https://meta.wikimedia.org/w/rest.php/oauth2/access_token';
export const OAUTH_PROFILE_URL = 'https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile';

export const REDIRECT_URI = window.location.origin + '/upload-stash-viewer/';

export const STASH_EXPIRY_HOURS = 48;
export const APP_USER_AGENT = 'UploadStashViewer/0.1 (https://gitlab.wikimedia.org/daanvr/upload-stash-viewer)';

export const DEMO_MODE = CLIENT_ID === 'YOUR_CLIENT_ID_HERE' || CLIENT_ID === '';
