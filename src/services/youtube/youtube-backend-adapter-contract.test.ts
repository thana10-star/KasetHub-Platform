import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import {
  buildNotConfiguredYouTubeLatestResponse,
  youtubeLatestBackendContract,
  youtubeLatestBackendEndpointPath,
  youtubeVideoLibraryBackendContract,
  youtubeVideoLibraryBackendEndpointPath,
} from '@/services/youtube/youtube-backend-adapter.types';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

function listSourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return listSourceFiles(entryPath);
    if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) return [];
    if (/\.(test|spec)\.(ts|tsx|js|jsx)$/.test(entry.name)) return [];

    return [entryPath];
  });
}

describe('M126 YouTube backend adapter contract', () => {
  test('documents a safe latest-video endpoint contract without enabling live fetches', () => {
    const response = buildNotConfiguredYouTubeLatestResponse({
      channelHandle: '@ruengkaset',
      channelUrl: 'https://www.youtube.com/@ruengkaset',
    });

    expect(youtubeLatestBackendEndpointPath).toBe('/api/youtube/latest');
    expect(youtubeVideoLibraryBackendEndpointPath).toBe('/api/youtube/videos');
    expect(youtubeLatestBackendContract.secretPlacement).toBe('server_only');
    expect(youtubeVideoLibraryBackendContract.secretPlacement).toBe('server_only');
    expect(youtubeVideoLibraryBackendContract.maxResults).toBe(50);
    expect(youtubeLatestBackendContract.frontendFallbackOrder).toEqual([
      'backend_normalized_videos',
      'owner_curated_manual_videos',
      'source_pending',
    ]);
    expect(response).toEqual({
      status: 'not_configured',
      channel: {
        channelHandle: '@ruengkaset',
        channelUrl: 'https://www.youtube.com/@ruengkaset',
      },
      videos: [],
    });
  });

  test('keeps YouTube API secret env names out of frontend source files', () => {
    const forbiddenTokens = [['YOUTUBE', 'API', 'KEY'].join('_'), ['VITE', 'YOUTUBE', 'API', 'KEY'].join('_')];
    const matches = listSourceFiles(path.join(workspaceRoot, 'src')).flatMap((filePath) => {
      const source = fs.readFileSync(filePath, 'utf8');

      return forbiddenTokens.some((token) => source.includes(token))
        ? [path.relative(workspaceRoot, filePath).split(path.sep).join('/')]
        : [];
    });

    expect(matches).toEqual([]);
  });

  test('keeps the M126 backend adapter docs checked in', () => {
    const adapterDoc = fs.readFileSync(
      path.join(workspaceRoot, 'docs/content/YOUTUBE_CHANNEL_BACKEND_ADAPTER_M126.md'),
      'utf8',
    );
    const securityDoc = fs.readFileSync(
      path.join(workspaceRoot, 'docs/content/YOUTUBE_API_KEY_SECURITY_M126.md'),
      'utf8',
    );

    expect(adapterDoc).toContain('/api/youtube/latest');
    expect(adapterDoc).toContain('/api/youtube/videos');
    expect(adapterDoc).toContain('channels.list');
    expect(adapterDoc).toContain('playlistItems.list');
    expect(securityDoc).toContain('YOUTUBE_API_KEY');
    expect(securityDoc).not.toContain('VITE_YOUTUBE_API_KEY=');
  });

  test('keeps M127 Cloudflare Function docs checked in', () => {
    const functionDoc = fs.readFileSync(
      path.join(workspaceRoot, 'docs/content/YOUTUBE_CLOUDFLARE_FUNCTION_M127.md'),
      'utf8',
    );
    const libraryDoc = fs.readFileSync(path.join(workspaceRoot, 'docs/content/YOUTUBE_VIDEO_LIBRARY_M127.md'), 'utf8');

    expect(functionDoc).toContain('/api/youtube/latest');
    expect(functionDoc).toContain('/api/youtube/videos');
    expect(functionDoc).toContain('Cloudflare Pages Function');
    expect(libraryDoc).toContain('Fallback order');
    expect(libraryDoc).toContain('/app/youtube');
  });
});
