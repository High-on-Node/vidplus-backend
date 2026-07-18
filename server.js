import 'dotenv/config';
import express from 'express';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '127.0.0.1'; // nginx will front this later; never bind 0.0.0.0
const API_KEY = process.env.API_KEY || '';
const COOKIES_FILE = (process.env.COOKIES_FILE || '').trim();

const YTDLP_BIN = '/usr/local/bin/yt-dlp';

// iOS (AVFoundation + Photos) cannot decode VP9 or AV1, and rejects Opus inside
// MP4. Selecting "best" by bitrate lands on those codecs on many sources, which
// produces a file that saves and plays nowhere on iOS.
//
// H.264 and HEVC are both iOS-playable; VP9 and AV1 are not. Prefer H.264, then
// HEVC, and only then fall back to whatever exists. Codec names vary by source
// (avc1/h264, hvc1/hev1/h265/hevc), so match on a prefix regex rather than a
// literal. The chain degrades instead of failing: a source with nothing
// iOS-playable still returns a file. Callers can detect that case via the
// `selected.ios_playable` flag on /info.
const RE_H264 = "avc1*";
const RE_HEVC = "hvc1*";
const RE_AAC = "mp4a*";

const IOS_SAFE_FORMAT = [
  `bv*[vcodec~='${RE_H264}']+ba[acodec~='${RE_AAC}']`, // H.264 + AAC
  `bv*[vcodec~='${RE_H264}']+ba`, // H.264 + any audio
  `b[vcodec~='${RE_H264}']`, // combined H.264
  `bv*[vcodec~='${RE_HEVC}']+ba[acodec~='${RE_AAC}']`, // HEVC + AAC
  `bv*[vcodec~='${RE_HEVC}']+ba`, // HEVC + any audio
  `b[vcodec~='${RE_HEVC}']`, // combined HEVC
  'bv*+ba', // last resort: may be VP9/AV1, i.e. not iOS-playable
  'b',
].join('/');

const INSTAGRAM_FORMAT = [
  'b[vcodec!*=?vp09][vcodec!*=?av01]',
  'bv*[vcodec!*=?vp09][vcodec!*=?av01]+ba',
  'b',
].join('/');

const FACEBOOK_FORMAT = [
  'b[vcodec!*=?vp09][vcodec!*=?av01]',
  'bv*[vcodec!*=?vp09][vcodec!*=?av01]+ba',
  'b',
].join('/');

const REDDIT_FORMAT = IOS_SAFE_FORMAT;

function getFormatForUrl(url) {
  if (url.includes('instagram.com') || url.includes('instagr.am')) {
    return INSTAGRAM_FORMAT;
  }
  if (url.includes('facebook.com') || url.includes('fb.com') ||
      url.includes('fb.watch')) {
    return FACEBOOK_FORMAT;
  }
  return IOS_SAFE_FORMAT;
}

// Mirrors the codecs the chain above treats as iOS-playable. Audio matters too:
// the chain can pair H.264 with any audio, and Opus inside MP4 is as unplayable
// on iOS as VP9 is. A source that does not declare acodec is not held against it.
const IOS_PLAYABLE_VCODEC = /^(avc1|h264|hvc1|hev1|h265|hevc)/i;
const IOS_PLAYABLE_ACODEC = /^(mp4a|aac)/i;

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
const DOWNLOAD_TTL_MS = 10 * 60 * 1000; // 10 minutes
const CLEANUP_INTERVAL_MS = 2 * 60 * 1000; // sweep every 2 minutes

// Generous buffer: -J metadata for long playlists/videos can be large.
const EXEC_MAX_BUFFER = 64 * 1024 * 1024;

if (!API_KEY) {
  console.error('FATAL: API_KEY is not set in .env');
  process.exit(1);
}

fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// yt-dlp helpers
// ---------------------------------------------------------------------------

// Build the common args. Cookies are appended only if the file is configured
// AND actually exists on disk (we wire support now, file added later).
function baseArgs() {
  const args = [
    '--no-warnings',
    '--extractor-args', 'youtubepot-bgutilscript:script_path=/home/azureuser/bgutil-ytdlp-pot-provider/server/build/generate_once.js',
    '--no-js-runtimes',
    '--js-runtimes', 'node',
    '--js-runtimes', 'deno:/nonexistent',
  ];
  if (COOKIES_FILE && fs.existsSync(COOKIES_FILE)) {
    args.push('--cookies', COOKIES_FILE);
  }
  return args;
}

function normalizeUrl(url) {
  // Reddit short share links /s/<id> fail with 403.
  // Strip query params and return as-is for now.
  // yt-dlp handles canonical reddit URLs fine.
  try {
    const u = new URL(url);
    // If it is a reddit short link, warn but pass through
    // yt-dlp will attempt extraction
    if (u.hostname.includes('reddit.com') && u.pathname.includes('/s/')) {
      console.warn('[warn] Reddit short URL detected, may fail:', url);
    }
    return url;
  } catch {
    return url;
  }
}

async function ytdlpVersion() {
  const { stdout } = await execFileAsync(YTDLP_BIN, ['--version'], {
    maxBuffer: EXEC_MAX_BUFFER,
  });
  return stdout.trim();
}

// Describe the format the selector actually resolved to, so /info promises what
// /download delivers. When yt-dlp merges two streams the pair is in
// `requested_formats`; when a single combined stream is chosen there is no such
// key. In both cases the root object carries the resolved codecs/resolution, so
// read the root and attach the pair only when it exists.
function summarizeSelection(data) {
  if (!data) return null;

  const vcodec = data.vcodec && data.vcodec !== 'none' ? data.vcodec : null;
  const acodec = data.acodec && data.acodec !== 'none' ? data.acodec : null;

  const parts = Array.isArray(data.requested_formats) ? data.requested_formats : [];
  const filesize = parts.length
    ? parts.reduce((sum, f) => {
        const n = f.filesize ?? f.filesize_approx ?? null;
        return sum === null || n === null ? null : sum + n;
      }, 0)
    : (data.filesize ?? data.filesize_approx ?? null);

  return {
    format_id: data.format_id ?? null,
    resolution:
      data.resolution ||
      (data.width && data.height ? `${data.width}x${data.height}` : null),
    width: data.width ?? null,
    height: data.height ?? null,
    fps: data.fps ?? null,
    vcodec,
    acodec,
    filesize,
    // false => /download can only return something iOS refuses: VP9/AV1 video,
    // or Opus audio in an MP4. Neither saves to Photos nor plays.
    ios_playable:
      !!vcodec &&
      IOS_PLAYABLE_VCODEC.test(vcodec) &&
      (!acodec || IOS_PLAYABLE_ACODEC.test(acodec)),
    requested_formats: parts.length
      ? parts.map((f) => ({
          format_id: f.format_id,
          vcodec: f.vcodec ?? null,
          acodec: f.acodec ?? null,
          ext: f.ext ?? null,
          resolution:
            f.resolution ||
            (f.width && f.height ? `${f.width}x${f.height}` : null),
        }))
      : null,
  };
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------
const app = express();
app.use(express.json({ limit: '1mb' }));

// API-key gate for protected routes.
function requireApiKey(req, res, next) {
  const key = req.get('x-api-key');
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: 'invalid or missing x-api-key' });
  }
  next();
}

// --- GET /health (no auth) -------------------------------------------------
app.get('/health', async (_req, res) => {
  try {
    const version = await ytdlpVersion();
    res.json({ status: 'ok', ytdlp: version });
  } catch (err) {
    res.status(500).json({ status: 'error', error: String(err.message || err) });
  }
});

// --- POST /info ------------------------------------------------------------
app.post('/info', requireApiKey, async (req, res) => {
  const url = normalizeUrl(req.body?.url);
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'body must include a string "url"' });
  }

  // -J dumps a single JSON object for the URL. execFile => no shell, url is
  // passed as a discrete argv entry (never interpolated into a shell).
  //
  // -f runs the SAME selector /download uses, so yt-dlp resolves the exact
  // format this URL will actually yield. Without it, /info could advertise a
  // quality (or a codec) that /download would never return.
  //
  // Declared outside the try so the catch block can log the args used.
  const isVimeo = url.includes('vimeo.com');
  const args = [
    ...baseArgs(),
    '-J',
    '-f', getFormatForUrl(url),
    '--no-playlist',
    ...(isVimeo ? ['--impersonate', 'chrome'] : []),
    url,
  ];

  try {
    const { stdout } = await execFileAsync(YTDLP_BIN, args, {
      maxBuffer: EXEC_MAX_BUFFER,
      timeout: 90 * 1000,
    });

    const data = JSON.parse(stdout);

    // iOS compatibility check
    const allFormats = Array.isArray(data.formats) ? data.formats : [];
    const hasIOSCompatible = allFormats.some(f => {
      const vcodec = String(f.vcodec || '');
      return vcodec.startsWith('avc1') ||
             vcodec.startsWith('h264') ||
             vcodec.startsWith('hvc1') ||
             vcodec.includes('hevc');
    });

    if (!hasIOSCompatible && allFormats.length > 0) {
      const isInstagram = url.includes('instagram.com') ||
                          url.includes('instagr.am');
      const isFacebook = url.includes('facebook.com') ||
                         url.includes('fb.com') ||
                         url.includes('fb.watch');
      if (!isInstagram && !isFacebook) {
        return res.status(422).json({
          error: 'This video cannot be played on iPhone',
          detail: 'Source only offers VP9 or AV1 which iOS does not support'
        });
      }
    }

    const formats = Array.isArray(data.formats)
      ? data.formats.map((f) => ({
          format_id: f.format_id,
          ext: f.ext,
          resolution:
            f.resolution ||
            (f.width && f.height ? `${f.width}x${f.height}` : null),
          fps: f.fps ?? null,
          vcodec: f.vcodec ?? null,
          acodec: f.acodec ?? null,
          filesize: f.filesize ?? f.filesize_approx ?? null,
          tbr: f.tbr ?? null,
          format_note: f.format_note ?? null,
        }))
      : [];

    res.json({
      platform: data.extractor_key || data.extractor || null,
      title: data.title ?? null,
      thumbnail: data.thumbnail ?? null,
      duration: data.duration ?? null,
      webpage_url: data.webpage_url ?? url,
      format_count: formats.length,
      // What /download will ACTUALLY return for this URL. `formats` lists
      // everything the source has, including codecs/resolutions the selector
      // will never pick — quote `selected`, not `formats`, to the user.
      selected: summarizeSelection(data),
      formats,
    });
  } catch (err) {
    console.error('[info] yt-dlp error for URL:', url);
    console.error('[info] args used:', args.join(' '));
    res.status(500).json({
      error: 'failed to extract info',
      detail: trimErr(err),
    });
  }
});

// --- POST /download --------------------------------------------------------
app.post('/download', requireApiKey, async (req, res) => {
  const url = normalizeUrl(req.body?.url);
  const formatId = req.body?.format_id;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'body must include a string "url"' });
  }
  if (formatId !== undefined && typeof formatId !== 'string') {
    return res.status(400).json({ error: '"format_id" must be a string' });
  }

  // Unique id so concurrent downloads never collide and cleanup is simple.
  const id = crypto.randomBytes(8).toString('hex');
  const outTemplate = path.join(DOWNLOAD_DIR, `${id}.%(ext)s`);

  // Default selection: H.264 + AAC, muxed to mp4 via ffmpeg (see IOS_SAFE_FORMAT).
  // If the caller supplied an explicit format_id, honor it — but prefer AAC for
  // the merged audio, since Opus in an MP4 container is also unplayable on iOS.
  const format = formatId
    ? `${formatId}+ba[acodec^=mp4a]/${formatId}+ba/${formatId}/b`
    : getFormatForUrl(url);

  const isVimeo = url.includes('vimeo.com');
  const args = [
    ...baseArgs(),
    '-f', format,
    '--merge-output-format', 'mp4',
    '--no-playlist',
    ...(isVimeo ? ['--impersonate', 'chrome'] : []),
    '-o', outTemplate,
    url,
  ];

  try {
    await execFileAsync(YTDLP_BIN, args, {
      maxBuffer: EXEC_MAX_BUFFER,
      timeout: 30 * 60 * 1000, // 30 min cap for large downloads
    });

    // Locate the produced file (extension decided by yt-dlp/ffmpeg).
    const entries = await fsp.readdir(DOWNLOAD_DIR);
    const produced = entries.find((name) => name.startsWith(`${id}.`));
    if (!produced) {
      return res.status(500).json({ error: 'download produced no file' });
    }

    const filePath = path.join(DOWNLOAD_DIR, produced);
    // Stream it back as an attachment. File stays on disk until the TTL sweep.
    res.download(filePath, produced, (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ error: 'failed to send file' });
      }
    });
  } catch (err) {
    res.status(500).json({
      error: 'download failed',
      detail: trimErr(err),
    });
  }
});

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'not found' }));

// ---------------------------------------------------------------------------
// Download cleanup sweep (10-minute TTL)
// ---------------------------------------------------------------------------
async function sweepDownloads() {
  try {
    const now = Date.now();
    const entries = await fsp.readdir(DOWNLOAD_DIR);
    for (const name of entries) {
      const full = path.join(DOWNLOAD_DIR, name);
      try {
        const stat = await fsp.stat(full);
        if (now - stat.mtimeMs > DOWNLOAD_TTL_MS) {
          await fsp.rm(full, { force: true, recursive: true });
        }
      } catch {
        // file vanished mid-sweep; ignore
      }
    }
  } catch (err) {
    console.error('cleanup sweep error:', err.message);
  }
}
setInterval(sweepDownloads, CLEANUP_INTERVAL_MS).unref();

// Helper: keep error payloads small and readable.
function trimErr(err) {
  const msg = (err && (err.stderr || err.message)) || String(err);
  return String(msg).split('\n').filter(Boolean).slice(-5).join('\n');
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, HOST, () => {
  console.log(`extractor-api listening on http://${HOST}:${PORT}`);
  console.log(`downloads dir: ${DOWNLOAD_DIR} (TTL ${DOWNLOAD_TTL_MS / 60000}m)`);
  console.log(`cookies: ${COOKIES_FILE || '(none configured)'}`);
});
