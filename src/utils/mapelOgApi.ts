import { loadMapelOgConfigs, saveMapelOgConfigs } from './storage';

export function strictUrlEncode(str: string): string {
  if (!str) return '';
  return encodeURIComponent(str).replace(/['()*~!]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

export function sanitizeMapelKey(mapel: string): string {
  if (!mapel) return '';
  let str = String(mapel).trim();
  if (['default', 'app', 'main', 'all', 'none', 'general'].includes(str.toLowerCase())) return '';

  // 1. Unescape HTML entities
  str = str
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');

  // 2. Safely decode URI components
  try { str = decodeURIComponent(str); } catch {}
  try { str = decodeURIComponent(str.replace(/\+/g, ' ')); } catch {}

  // 3. Lowercase and replace non-alphanumeric with underscore
  let key = str.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  if (!key || ['default', 'app', 'main', 'all', 'none', 'general'].includes(key)) return '';

  // 4. Canonicalize subject key aliases
  if (key.includes('qur') || key.includes('hadis') || key.includes('hadits')) return 'al_qur_an_hadis';
  if (key.includes('akidah') || key.includes('aqidah') || key.includes('akhlak')) return 'akidah_akhlak';
  if (key.includes('fiqih') || key.includes('fikih')) return 'fiqih';
  if (key.includes('sejarah') || key.includes('ski')) return 'sejarah_kebudayaan_islam_ski';
  if (key.includes('arab')) return 'bahasa_arab';
  if (key.includes('pancasila')) return 'pendidikan_pancasila';
  if (key.includes('indonesia')) return 'bahasa_indonesia';
  if (key.includes('matematika') || key === 'mtk') return 'matematika';
  if (key.includes('ipas') || key.includes('ipa') || key.includes('ips')) return 'ipas';
  if (key.includes('inggris')) return 'bahasa_inggris';
  if (key.includes('jawa')) return 'bahasa_jawa';
  if (key.includes('pjok') || key.includes('olahraga')) return 'pjok';
  if (key.includes('seni') || key.includes('prakarya')) return 'seni_budaya';

  return key;
}

export interface MapelOgConfig {
  title: string;
  desc: string;
  imageUrl: string;
  updatedAt?: string;
}

/**
 * Fetch Mapel OG configurations from server with automatic fallback between Node / Express API and PHP api.php
 */
export async function fetchMapelOgConfigsApi(): Promise<Record<string, MapelOgConfig>> {
  let configs: Record<string, MapelOgConfig> = {};

  try {
    let res = await fetch('/api/mapel-og-configs');
    let text = await res.text();
    let data: any = null;

    try {
      data = JSON.parse(text);
    } catch {
      // Fallback for PHP hosting or static server routing
      res = await fetch('/api.php?action=get_mapel_og');
      text = await res.text();
      data = JSON.parse(text);
    }

    if (data && data.success && data.configs) {
      configs = data.configs;
    }
  } catch (err) {
    console.warn('Network error or server unavailable when fetching mapel OG configs:', err);
  }

  // Merge server configs with local storage
  const localConfigs = loadMapelOgConfigs();
  const merged: Record<string, MapelOgConfig> = { ...localConfigs };

  if (configs && Object.keys(configs).length > 0) {
    for (const [key, cfg] of Object.entries(configs)) {
      if (!cfg) continue;
      const sanitizedKey = sanitizeMapelKey(key);
      const existing = merged[sanitizedKey] || merged[key];

      const updatedCfg: MapelOgConfig = {
        title: cfg.title || existing?.title || `Kuis & Media Interaktif ${key}`,
        desc: cfg.desc || existing?.desc || `Aplikasi Modul Ajar Kurikulum Berbasis Cinta (KBC) ${key}`,
        imageUrl: cfg.imageUrl || existing?.imageUrl || '',
        updatedAt: cfg.updatedAt || existing?.updatedAt || new Date().toISOString()
      };

      // Store under sanitized key
      merged[sanitizedKey] = updatedCfg;
      // Also store under raw key for direct lookup if raw key is provided
      if (key !== sanitizedKey) {
        merged[key] = updatedCfg;
      }
    }
  }

  // Save merged state to local storage
  saveMapelOgConfigs(merged, false);
  return merged;
}

/**
 * Save Mapel OG configuration permanently to server with automatic fallback between Node / Express API and PHP api.php
 */
export async function saveMapelOgConfigApi(
  mapel: string,
  title: string,
  desc: string,
  imageUrl: string
): Promise<{ success: boolean; config?: MapelOgConfig; message?: string }> {
  const sanitizedKey = sanitizeMapelKey(mapel);
  const nowIso = new Date().toISOString();

  const payload = {
    mapel,
    mapelKey: sanitizedKey,
    title: title.trim() || `Kuis & Media Interaktif ${mapel}`,
    desc: desc.trim() || `Aplikasi Modul Ajar Kurikulum Berbasis Cinta (KBC) ${mapel}`,
    imageUrl: imageUrl.trim()
  };

  // 1. Immediately update LocalStorage so UI is instant and persistent locally
  const localConfigs = loadMapelOgConfigs();
  const newConfig: MapelOgConfig = {
    title: payload.title,
    desc: payload.desc,
    imageUrl: payload.imageUrl,
    updatedAt: nowIso
  };

  const updatedLocal = {
    ...localConfigs,
    [sanitizedKey]: newConfig,
    [mapel]: newConfig
  };
  saveMapelOgConfigs(updatedLocal, true);

  // 2. Post to backend server (Node or PHP)
  let serverData: any = null;

  try {
    const res = await fetch('/api/mapel-og-configs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const text = await res.text();
      try {
        serverData = JSON.parse(text);
      } catch {}
    }
  } catch (err) {
    console.warn('Node API save failed, attempting PHP api.php fallback...', err);
  }

  // If Express endpoint didn't return success: true, try PHP api.php directly
  if (!serverData || !serverData.success) {
    try {
      const res = await fetch('/api.php?action=save_mapel_og', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const text = await res.text();
        try {
          serverData = JSON.parse(text);
        } catch {}
      }
    } catch (err) {
      console.warn('PHP API save failed:', err);
    }
  }

  if (serverData && serverData.success && serverData.config) {
    const serverConfig: MapelOgConfig = {
      title: serverData.config.title || newConfig.title,
      desc: serverData.config.desc || newConfig.desc,
      imageUrl: serverData.config.imageUrl || newConfig.imageUrl,
      updatedAt: serverData.config.updatedAt || nowIso
    };

    // Store server's saved imageUrl (e.g. /data/og_mapel_fiqih.jpg?v=...) into LocalStorage
    const finalLocal = {
      ...updatedLocal,
      [sanitizedKey]: serverConfig,
      [mapel]: serverConfig
    };
    saveMapelOgConfigs(finalLocal, false);

    return { success: true, config: serverConfig, message: serverData.message };
  }

  return { success: true, config: newConfig };
}
