const BEHANCE_URL = import.meta.env.VITE_BEHANCE_URL || 'https://www.behance.net/ranasherif10';
const PROXIES = [
  '',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://api.allorigins.win/get?url=',
];

function fetchWithTimeout(url, ms = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(id));
}

export async function fetchProjects() {
  const html = await fetchProfilePage();
  return parseProfileHTML(html);
}

export async function fetchProjectImages(projectUrl) {
  for (const proxy of PROXIES) {
    try {
      let proxyUrl;
      let isAllOrigins = false;

      if (!proxy) {
        proxyUrl = `/api/behance/gallery/${projectUrl.split('/gallery/')[1] || ''}`;
      } else if (proxy.includes('allorigins')) {
        proxyUrl = `${proxy}${encodeURIComponent(projectUrl)}`;
        isAllOrigins = true;
      } else {
        proxyUrl = `${proxy}${projectUrl}`;
      }

      const response = await fetchWithTimeout(proxyUrl, 10000);
      if (!response.ok) continue;

      const text = isAllOrigins
        ? (await response.json()).contents || ''
        : await response.text();

      if (text.length < 5000) continue;

      const images = extractGalleryImages(text);
      if (images.length > 1) return images;
    } catch {
      continue;
    }
  }
  return [];
}

async function fetchProfilePage() {
  for (const proxy of PROXIES) {
    try {
      let proxyUrl;
      let isAllOrigins = false;

      if (!proxy) {
        proxyUrl = '/api/behance';
      } else if (proxy.includes('allorigins')) {
        proxyUrl = `${proxy}${encodeURIComponent(BEHANCE_URL)}`;
        isAllOrigins = true;
      } else {
        proxyUrl = `${proxy}${BEHANCE_URL}`;
      }

      const response = await fetchWithTimeout(proxyUrl);
      if (!response.ok) continue;

      let data;
      if (isAllOrigins) {
        const json = await response.json();
        data = json.contents || json;
      } else {
        data = await response.text();
      }

      if (typeof data === 'string' && data.length > 10000) {
        return data;
      }
    } catch {
      continue;
    }
  }
  throw new Error('All proxies failed. Unable to reach Behance.');
}

function extractGalleryImages(html) {
  const urls = [];

  const moduleRegex = /"__typename":"ImageModule"([\s\S]*?)"captionAlignment"/g;
  let match;

  while ((match = moduleRegex.exec(html)) !== null) {
    const block = match[0];

    const allAvailIdx = block.indexOf('"allAvailable"');
    if (allAvailIdx < 0) continue;

    const afterAll = block.substring(allAvailIdx + 13);
    let arrStart = 0;
    while (arrStart < afterAll.length && afterAll[arrStart] !== '[') arrStart++;
    if (arrStart >= afterAll.length) continue;

    const segment = afterAll.substring(arrStart, 600);
    const urlRegex = /"url":"((?:[^"\\]|\\.)*)"/g;
    let urlMatch;
    const found = [];

    while ((urlMatch = urlRegex.exec(segment)) !== null) {
      const url = urlMatch[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
      if (!found.includes(url)) found.push(url);
    }

    const preferJpg = found.filter(u => /\.(jpg|jpeg|png)$/i.test(u));
    const best = preferJpg.find(u => u.includes('max_1200'))
      || preferJpg.find(u => u.includes('disp'))
      || preferJpg.find(u => u.includes('max_632'))
      || preferJpg[0];

    if (best && !urls.includes(best)) {
      urls.push(best);
    }
  }

  return urls;
}

function parseProfileHTML(html) {
  const projects = [];
  const seenUrls = new Set();

  const projectRegex = /\{"__typename":"Project"([\s\S]*?)"activeBoost":null\}/g;
  let match;

  while ((match = projectRegex.exec(html)) !== null) {
    const block = match[0];

    const name = extractName(block);
    const url = extractUrl(block);
    const publishedOn = extractPublishedOn(block);
    const cover = extractCover(block);

    if (name && url && !seenUrls.has(url)) {
      seenUrls.add(url);
      projects.push({
        title: name,
        link: url,
        thumbnail: cover || '/placeholder.svg',
        images: [],
        pubDate: publishedOn,
        date: formatUnixDate(publishedOn),
      });
    }
  }

  return projects;
}

function extractName(block) {
  const match = block.match(/"name":"((?:[^"\\]|\\.)*)"/);
  return match ? match[1] : '';
}

function extractUrl(block) {
  const match = block.match(/"url":"((?:[^"\\]|\\.)*)"/);
  if (!match) return '';
  return match[1].replace(/\\\//g, '/').replace(/\\u002F/g, '/');
}

function extractPublishedOn(block) {
  const match = block.match(/"publishedOn":(\d+)/);
  return match ? match[1] : '';
}

function extractCover(block) {
  const coversIdx = block.indexOf('"covers"');
  if (coversIdx < 0) return '';

  const afterCovers = block.substring(coversIdx + 8);
  let start = 0;
  while (start < afterCovers.length && afterCovers[start] !== '{') start++;
  if (start >= afterCovers.length) return '';

  let depth = 0;
  let inStr = false;
  let end = start;
  for (let i = start; i < afterCovers.length; i++) {
    const c = afterCovers[i];
    if (c === '"' && (i === 0 || afterCovers[i - 1] !== '\\')) inStr = !inStr;
    if (!inStr) {
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }
  }

  const coversBlock = afterCovers.substring(start, end);
  const allAvailIdx = coversBlock.indexOf('"allAvailable"');
  if (allAvailIdx < 0) return '';

  const afterAll = coversBlock.substring(allAvailIdx + 13);
  let arrStart = 0;
  while (arrStart < afterAll.length && afterAll[arrStart] !== '[') arrStart++;
  if (arrStart >= afterAll.length) return '';

  const arrSegment = afterAll.substring(arrStart, 1000);
  const urlRegex = /"url":"((?:[^"\\]|\\.)*)"/g;
  let urlMatch;
  const found = [];

  while ((urlMatch = urlRegex.exec(arrSegment)) !== null) {
    const url = urlMatch[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
    if (!found.includes(url)) found.push(url);
  }

  const preferJpg = found.filter(u => /\.(jpg|jpeg|png)$/i.test(u));
  const best = preferJpg.find(u => u.includes('max_808'));
  return best || preferJpg[0] || found[0] || '';
}

function formatUnixDate(unixTimestamp) {
  if (!unixTimestamp) return '';
  const ts = parseInt(unixTimestamp, 10);
  if (isNaN(ts)) return '';
  try {
    const date = new Date(ts * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}
