/**
 * Shikhon Web Showcase - Image Utility Helper
 * Safely extracts clean URL if it's stored as raw string or serialized JSON
 */
export function normalizeImageUrl(url) {
  if (!url) return '';
  if (typeof url === 'string') {
    const trimmed = url.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parsed.publicUrl || parsed.url || parsed.fileName || trimmed;
      } catch (e) {
        return trimmed;
      }
    }
    return trimmed;
  }
  if (typeof url === 'object' && url !== null) {
    return url.publicUrl || url.url || '';
  }
  return String(url);
}
