// Upload Stash Viewer — Configuration

export const CLIENT_ID = '1600687e63a70388ae533114a4ce7422';
export const CLIENT_SECRET = 'e1f5968d1b699fe0e51f0468b6b14d573e89688d';

// Owner-only access token — bypasses the OAuth redirect flow for testing.
// Set to '' to use the normal PKCE login flow instead.
export const OWNER_ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxNjAwNjg3ZTYzYTcwMzg4YWU1MzMxMTRhNGNlNzQyMiIsImp0aSI6ImFmY2Q4OTAxNjg0YzVjZGQ1NWY4NmQ1N2JhMmE4ZGZhN2JhZTFlNjJhYTdiYWZlYmFkYmE1ZGUzMWNlMjcxN2FhYzI2ZWRiMTJlZDI5NDc1IiwiaWF0IjoxNzczNDgzNzUwLjcyNzEwOCwibmJmIjoxNzczNDgzNzUwLjcyNzExLCJleHAiOjMzMzMwMzkyNTUwLjcyMzE1Miwic3ViIjoiODUwMzQxNyIsImlzcyI6Imh0dHBzOi8vbWV0YS53aWtpbWVkaWEub3JnIiwicmF0ZWxpbWl0Ijp7InJlcXVlc3RzX3Blcl91bml0Ijo1MDAwLCJ1bml0IjoiSE9VUiJ9LCJzY29wZXMiOlsiYmFzaWMiLCJlZGl0cGFnZSIsImNyZWF0ZWVkaXRtb3ZlcGFnZSIsInVwbG9hZGZpbGUiLCJ1cGxvYWRlZGl0bW92ZWZpbGUiXX0.bjo1xioU7NuGpjWjLLqGOZu-HeIpUB_qnlKkH7w9S4ldJkKBtH2i_pJBVCPkZh9ijqK0f38KKwc34RH38a3OruDoE2OvG6MM8mebVg3A3ufXZM3bKX2sqCySREECzZ0CZBvuzkthNorVyg95cFy-_H5oPdNREm1jvhJr7N9StTJyHeCodxbRtz0_prSALNxUNcY3zpvXxIQ1tJVGRV7lSRBxlVw46jASCvxD5GB-WDfjfEYF_f2NG6rhBN3YrzH7iLDl1QC8vC9RRjOzG05yujH2QwVHe9lxav8wJuBWFG-_4QnCczHtIFcx7NAEYJ6t9IVKKF0xtPk0YbMXTLOjoFuOHFt0NZZQ1SkFGYMjgvF5MHXI49Kus4cSJItkpDuemXxTQ1b9OAo2iQZeCj239xAufQCED5BO_L7C41YpSOkToQIJnWXHh5BICFMh2-S2pHj0XkfZO7VCwqeJ9JWPSQF7nNHSgerRzFVXb1zJVAIW526SG5hrnav1hHAasiek3Sk4eLXlAEKHsgijWiVVIoF62uNGQLsV0Tq2aYo2VS6VC0AB_uvnCgdPcVA5AR2CzIWNwoNtiyR__OyVTH-yG4LjXo7SjNuPDtxMgtENDI6iB6ZmSsYbfEjzerZZPk1MLfE-GWRBslDv97CFj5iBi4F3VsOlyQkD4pzdgX65Mf0';

export const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
export const OAUTH_AUTHORIZE_URL = 'https://meta.wikimedia.org/w/rest.php/oauth2/authorize';
export const OAUTH_TOKEN_URL = 'https://meta.wikimedia.org/w/rest.php/oauth2/access_token';
export const OAUTH_PROFILE_URL = 'https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile';

export const REDIRECT_URI = window.location.origin + '/upload-stash-viewer/';

export const STASH_EXPIRY_HOURS = 48;
export const APP_USER_AGENT = 'UploadStashViewer/0.1 (https://gitlab.wikimedia.org/daanvr/upload-stash-viewer)';

export const DEMO_MODE = CLIENT_ID === 'YOUR_CLIENT_ID_HERE' || CLIENT_ID === '';
