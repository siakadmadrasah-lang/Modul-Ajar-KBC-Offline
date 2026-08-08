<?php
/**
 * Index Entry Point for Plesk / cPanel Hosting with Dynamic Open Graph Resolution
 * Automatically injects absolute Open Graph URLs so WhatsApp, Facebook, Telegram, and Twitter
 * display the Open Graph badge image (og-image-round.jpg) perfectly when links are shared.
 */

// Determine Protocol & Host Base URL
$rawHost = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : (isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost');
$host = preg_replace('/^https?:\/*/', '', $rawHost);
$host = rtrim($host, '/');
if (empty($host)) {
    $host = 'localhost';
}

$isLocal = ($host === 'localhost' || $host === '127.0.0.1' || strpos($host, '192.168.') === 0);

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 
    || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (isset($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] === 'on')
    || (isset($_SERVER['HTTP_CF_VISITOR']) && strpos($_SERVER['HTTP_CF_VISITOR'], 'https') !== false);

// FOR PUBLIC DOMAINS, ALWAYS FORCE HTTPS FOR BASEURL AND OG IMAGE
$protocol = (!$isLocal || $isHttps) ? 'https://' : 'http://';
$baseUrl = $protocol . $host;
$requestUri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
if (strpos($requestUri, '/') !== 0) {
    $requestUri = '/' . $requestUri;
}

$indexPath = __DIR__ . '/index.html';

if (file_exists($indexPath)) {
    $html = file_get_contents($indexPath);

    // Helper function to extract query parameters safely supporting both 'key', 'amp;key', and raw REQUEST_URI
    function get_og_query_param($key, $default = '') {
        if (isset($_GET[$key]) && $_GET[$key] !== '') {
            return trim($_GET[$key]);
        }
        $ampKey = 'amp;' . $key;
        if (isset($_GET[$ampKey]) && $_GET[$ampKey] !== '') {
            return trim($_GET[$ampKey]);
        }
        if (isset($_SERVER['REQUEST_URI'])) {
            $uri = $_SERVER['REQUEST_URI'];
            if (preg_match('/[?&](?:amp;)?' . preg_quote($key, '/') . '=([^&]*)/i', $uri, $m)) {
                return trim(urldecode($m[1]));
            }
        }
        return $default;
    }

    function canonicalize_mapel_key_php($mapel) {
        if (!$mapel) return '';
        $str = trim($mapel);
        if (in_array(strtolower($str), ['default', 'app', 'main', 'all', 'none', 'general'])) return '';
        $str = html_entity_decode($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $str = urldecode($str);
        $str = urldecode($str);
        $key = strtolower(preg_replace('/[^a-z0-9]/', '_', $str));
        $key = trim(preg_replace('/_+/', '_', $key), '_');
        if (!$key || in_array($key, ['default', 'app', 'main', 'all', 'none', 'general'])) return '';

        if (strpos($key, 'qur') !== false || strpos($key, 'hadis') !== false || strpos($key, 'hadits') !== false) return 'al_qur_an_hadis';
        if (strpos($key, 'akidah') !== false || strpos($key, 'aqidah') !== false || strpos($key, 'akhlak') !== false) {
            return 'akidah_akhlak';
        }
        if (strpos($key, 'fiqih') !== false || strpos($key, 'fikih') !== false) return 'fiqih';
        if (strpos($key, 'sejarah') !== false || strpos($key, 'ski') !== false) return 'sejarah_kebudayaan_islam_ski';
        if (strpos($key, 'arab') !== false) return 'bahasa_arab';
        if (strpos($key, 'pancasila') !== false) return 'pendidikan_pancasila';
        if (strpos($key, 'indonesia') !== false) return 'bahasa_indonesia';
        if (strpos($key, 'matematika') !== false || $key === 'mtk') return 'matematika';
        if (strpos($key, 'ipas') !== false || strpos($key, 'ipa') !== false || strpos($key, 'ips') !== false) return 'ipas';
        if (strpos($key, 'inggris') !== false) return 'bahasa_inggris';
        if (strpos($key, 'jawa') !== false) return 'bahasa_jawa';
        if (strpos($key, 'pjok') !== false || strpos($key, 'olahraga') !== false) return 'pjok';
        if (strpos($key, 'seni') !== false || strpos($key, 'prakarya') !== false) return 'seni_budaya';

        return $key;
    }

    $queryMapel = get_og_query_param('mapel');
    $queryModuleId = get_og_query_param('moduleId');
    $queryTitle = get_og_query_param('title');
    $queryDesc = get_og_query_param('desc');
    $queryMateri = get_og_query_param('materi');

    $rawMapel = !empty($queryMapel) ? $queryMapel : $queryModuleId;
    $mapelKey = canonicalize_mapel_key_php($rawMapel);

    $mapelDisplayNames = [
        'akidah_akhlak' => 'Akidah Akhlak',
        'akidah' => 'Akidah Akhlak',
        'akhlak' => 'Akidah Akhlak',
        'fiqih' => 'Fiqih',
        'fikih' => 'Fiqih',
        'al_qur_an_hadis' => "Al-Qur'an Hadis",
        'quran_hadis' => "Al-Qur'an Hadis",
        'sejarah_kebudayaan_islam_ski' => 'Sejarah Kebudayaan Islam (SKI)',
        'ski' => 'Sejarah Kebudayaan Islam (SKI)',
        'bahasa_arab' => 'Bahasa Arab',
        'pendidikan_agama_islam' => 'Pendidikan Agama Islam',
        'pai' => 'Pendidikan Agama Islam',
        'ipas_ipa_ips' => 'IPAS (IPA & IPS)',
        'ipas' => 'IPAS (IPA & IPS)',
        'matematika' => 'Matematika',
        'mtk' => 'Matematika',
        'bahasa_indonesia' => 'Bahasa Indonesia',
        'pendidikan_pancasila' => 'Pendidikan Pancasila',
        'pancasila' => 'Pendidikan Pancasila',
    ];

    $queryMapelDisplayName = $queryMapel;
    if ($mapelKey && isset($mapelDisplayNames[$mapelKey])) {
        $queryMapelDisplayName = $mapelDisplayNames[$mapelKey];
    }

    // Read stored mapel configurations
    $mapelConfigFile = __DIR__ . '/data/mapel_og_configs.json';
    $storedCfg = null;
    if (file_exists($mapelConfigFile)) {
        $json = @file_get_contents($mapelConfigFile);
        if ($json) {
            $configs = json_decode($json, true);
            if ($mapelKey && isset($configs[$mapelKey])) {
                $storedCfg = $configs[$mapelKey];
            }
        }
    }

    $ogTitle = $queryTitle;
    if (!$ogTitle) {
        if ($storedCfg && !empty($storedCfg['title'])) {
            $ogTitle = $storedCfg['title'];
        } else if ($queryMapelDisplayName) {
            $ogTitle = "Kuis & Media Interaktif {$queryMapelDisplayName} - Modul Ajar KBC";
        } else {
            $ogTitle = "Modul Ajar Berbasis Cinta - MI Ma'arif NU 2 Sanggreman (Jaenal Maskun, S.Pd.I.)";
        }
    }

    $ogDesc = $queryDesc;
    if (!$ogDesc) {
        if ($storedCfg && !empty($storedCfg['desc'])) {
            $ogDesc = $storedCfg['desc'];
        } else if ($queryMateri) {
            $ogDesc = "Materi: {$queryMateri}. Kuis interaktif, flashcard, & media pembelajaran Kurikulum Berbasis Cinta (KBC) MI Ma'arif NU 2 Sanggreman.";
        } else if ($queryMapelDisplayName) {
            $ogDesc = "Aplikasi Modul Ajar Kurikulum Berbasis Cinta (KBC) mata pelajaran {$queryMapelDisplayName}. Kerjakan kuis interaktif, flashcard, & pelajari media digital.";
        } else {
            $ogDesc = "Aplikasi Penyusun Modul Ajar Kurikulum Berbasis Cinta (KBC) Terintegrasi AI Gemini, Bank Materi, Media Digital & Kuis Interaktif. Disusun oleh Jaenal Maskun, S.Pd.I.";
        }
    }

    $defaultSubjectImages = [
        'akidah' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&h=630&fit=crop',
        'akhlak' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&h=630&fit=crop',
        'akidah_akhlak' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&h=630&fit=crop',
        'aqidah' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&h=630&fit=crop',
        'aqidah_akhlak' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&h=630&fit=crop',
        'fiqih' => 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&h=630&fit=crop',
        'fikih' => 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&h=630&fit=crop',
        'al_qur_an_hadis' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&h=630&fit=crop',
        'quran_hadis' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&h=630&fit=crop',
        'quran' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&h=630&fit=crop',
        'hadis' => 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&h=630&fit=crop',
        'sejarah_kebudayaan_islam_ski' => 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&h=630&fit=crop',
        'sejarah_kebudayaan_islam__ski_' => 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&h=630&fit=crop',
        'ski' => 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&h=630&fit=crop',
        'sejarah' => 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&h=630&fit=crop',
        'bahasa_arab' => 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop',
        'arab' => 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop',
        'pendidikan_agama_islam' => 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&h=630&fit=crop',
        'pai' => 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&h=630&fit=crop',
        'ipas_ipa_ips' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=630&fit=crop',
        'ipas__ipa___ips_' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=630&fit=crop',
        'ipas' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=630&fit=crop',
        'ipa' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=630&fit=crop',
        'ips' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=630&fit=crop',
        'matematika' => 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=630&fit=crop',
        'mtk' => 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=630&fit=crop',
        'bahasa_indonesia' => 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop',
        'pendidikan_pancasila' => 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&h=630&fit=crop',
        'pancasila' => 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&h=630&fit=crop'
    ];

    $ogImage = '';
    $dataDir = __DIR__ . '/data';
    $urlV = (int)get_og_query_param('v', 0);

    // 1. FIRST PRIORITY: Physical subject image file uploaded on disk for this subject
    $foundPhysicalMapelImg = false;
    if ($mapelKey) {
        foreach (['jpg', 'png', 'jpeg', 'webp'] as $ext) {
            $imgPath = "{$dataDir}/og_mapel_{$mapelKey}.{$ext}";
            if (file_exists($imgPath)) {
                $mtime = filemtime($imgPath);
                $finalV = max($urlV, $mtime);
                $ogImage = $baseUrl . "/data/og_mapel_{$mapelKey}.{$ext}?v=" . $finalV;
                $foundPhysicalMapelImg = true;
                break;
            }
        }
    }

    // 2. SECOND PRIORITY: Stored config imageUrl (base64, local file, or external URL like Unsplash)
    if (!$foundPhysicalMapelImg && $storedCfg && !empty($storedCfg['imageUrl'])) {
        $cfgImg = trim($storedCfg['imageUrl']);
        $cfgV = !empty($storedCfg['updatedAt']) ? strtotime($storedCfg['updatedAt']) : time();
        $finalV = max($urlV, $cfgV);

        if (strpos($cfgImg, 'data:image/') === 0) {
            $ogImage = $baseUrl . "/api.php?action=get_mapel_image&mapel=" . urlencode($mapelKey ? $mapelKey : 'general') . "&v=" . $finalV;
        } else {
            // Strip old ?v= query if present
            $cleanUrl = preg_replace('/([?&])v=[^&]*(&|$)/i', '$1', $cfgImg);
            $cleanUrl = rtrim($cleanUrl, '?&');
            
            $isRelative = (strpos($cleanUrl, '/') === 0);
            if (!$isRelative || file_exists(__DIR__ . $cleanUrl)) {
                if ($isRelative) {
                    $cleanUrl = $baseUrl . $cleanUrl;
                } else if (!$isLocal && strpos($cleanUrl, 'http://') === 0) {
                    $cleanUrl = preg_replace('/^http:\/\//i', 'https://', $cleanUrl);
                }
                
                $connector = (strpos($cleanUrl, '?') !== false) ? '&' : '?';
                $ogImage = $cleanUrl . "{$connector}v={$finalV}";
            }
        }
    }

    // 3. THIRD PRIORITY: Subject default preset image if mapelKey is present
    if (empty($ogImage) && $mapelKey && isset($defaultSubjectImages[$mapelKey])) {
        $ogImage = $defaultSubjectImages[$mapelKey];
    }

    // 4. FOURTH PRIORITY: Global Custom OG image uploaded by user in Settings or system round badge
    if (empty($ogImage)) {
        if (file_exists(__DIR__ . '/custom-og-image.jpg')) {
            $mtime = filemtime(__DIR__ . '/custom-og-image.jpg');
            $finalV = max($urlV, $mtime);
            $ogImage = $baseUrl . '/custom-og-image.jpg?v=' . $finalV;
        } else if (file_exists("{$dataDir}/custom-og-image.jpg")) {
            $mtime = filemtime("{$dataDir}/custom-og-image.jpg");
            $finalV = max($urlV, $mtime);
            $ogImage = $baseUrl . '/data/custom-og-image.jpg?v=' . $finalV;
        } else if (file_exists(__DIR__ . '/og-image-round.jpg')) {
            $mtime = filemtime(__DIR__ . '/og-image-round.jpg');
            $finalV = max($urlV, $mtime);
            $ogImage = $baseUrl . '/og-image-round.jpg?v=' . $finalV;
        } else {
            $ogImage = $baseUrl . '/og-image-round.jpg?v=' . time();
        }
    }

    // Always determine square emblem/logo for Favicons
    $faviconUrl = '';
    if (file_exists(__DIR__ . '/custom-og-image.jpg')) {
        $mtime = filemtime(__DIR__ . '/custom-og-image.jpg');
        $faviconUrl = $baseUrl . '/custom-og-image.jpg?v=' . max($urlV, $mtime);
    } else if (file_exists("{$dataDir}/custom-og-image.jpg")) {
        $mtime = filemtime("{$dataDir}/custom-og-image.jpg");
        $faviconUrl = $baseUrl . '/data/custom-og-image.jpg?v=' . max($urlV, $mtime);
    } else {
        $mtime = file_exists(__DIR__ . '/og-image-round.jpg') ? filemtime(__DIR__ . '/og-image-round.jpg') : time();
        $faviconUrl = $baseUrl . '/og-image-round.jpg?v=' . max($urlV, $mtime);
    }

    // Always ensure ogImage & faviconUrl are HTTPS for non-local domains
    if (!$isLocal && strpos($ogImage, 'http://') === 0) {
        $ogImage = preg_replace('/^http:\/\//i', 'https://', $ogImage);
    }
    if (!$isLocal && strpos($faviconUrl, 'http://') === 0) {
        $faviconUrl = preg_replace('/^http:\/\//i', 'https://', $faviconUrl);
    }

    $rawFullCurrentUrl = $baseUrl . $requestUri;
    if (!$isLocal && strpos($rawFullCurrentUrl, 'http://') === 0) {
        $rawFullCurrentUrl = preg_replace('/^http:\/\//i', 'https://', $rawFullCurrentUrl);
    }

    // Helper function to sanitize and encode URLs for strict RFC 3986 compliance (Open Graph crawlers)
    function sanitize_og_url($url) {
        if (empty($url)) return '';
        $url = trim($url);

        // Fix typos like https:/domain.com, http:/domain.com, https///domain.com -> https://domain.com
        $url = preg_replace('/^(https?):\/+([^\/])/i', '$1://$2', $url);
        if (!preg_match('/^https?:\/\//i', $url)) {
            $url = 'https://' . ltrim($url, ':/');
        }

        // Replace literal spaces with %20 before calling parse_url, so parse_url doesn't fail on raw parameters
        $urlForParse = str_replace(' ', '%20', $url);

        $parts = @parse_url($urlForParse);
        if (!$parts || empty($parts['host'])) {
            $safeUrl = str_replace(
                [' ', '(', ')', "'", '"', '<', '>'],
                ['%20', '%28', '%29', '%27', '%22', '%3C', '%3E'],
                $url
            );
            return preg_replace('/^(https?):\/+([^\/])/i', '$1://$2', $safeUrl);
        }
        
        $scheme = (!empty($parts['scheme']) && strtolower($parts['scheme']) === 'http') ? 'http' : 'https';
        $host = $parts['host'];
        $port = !empty($parts['port']) ? ':' . $parts['port'] : '';
        $path = !empty($parts['path']) ? $parts['path'] : '';
        
        $pathSegments = explode('/', $path);
        $encodedSegments = array_map(function($seg) {
            return rawurlencode(rawurldecode($seg));
        }, $pathSegments);
        $cleanPath = implode('/', $encodedSegments);

        $queryStr = '';
        if (isset($parts['query']) && strlen($parts['query']) > 0) {
            parse_str($parts['query'], $queryParams);
            $cleanParams = [];
            foreach ($queryParams as $k => $v) {
                $cleanKey = preg_replace('/^amp;/i', '', $k);
                if ($cleanKey === 'mapel' && !empty($v)) {
                    $cleanParams['mapel'] = canonicalize_mapel_key_php($v);
                } else {
                    $cleanParams[$cleanKey] = $v;
                }
            }
            $queryStr = '?' . http_build_query($cleanParams, '', '&', PHP_QUERY_RFC3986);
            $queryStr = str_replace(
                ["'", '(', ')', '!', '*'],
                ['%27', '%28', '%29', '%21', '%2A'],
                $queryStr
            );
        }

        $res = "{$scheme}://{$host}{$port}{$cleanPath}{$queryStr}";
        return preg_replace('/^(https?):\/+([^\/])/i', '$1://$2', $res);
    }

    function escape_url_attr($url) {
        if (empty($url)) return '';
        $url = str_replace('&amp;', '&', $url);
        return str_replace(['&', '"', '<', '>'], ['&amp;', '&quot;', '&lt;', '&gt;'], $url);
    }

    $cleanOgImage = sanitize_og_url($ogImage);
    $cleanFavicon = sanitize_og_url($faviconUrl);
    $cleanFullUrl = sanitize_og_url($rawFullCurrentUrl);

    $safeOgImage = escape_url_attr($cleanOgImage);
    $safeFavicon = escape_url_attr($cleanFavicon);
    $safeFullUrl = escape_url_attr($cleanFullUrl);
    $safeTitle = htmlspecialchars($ogTitle, ENT_QUOTES, 'UTF-8');
    $safeDesc = htmlspecialchars($ogDesc, ENT_QUOTES, 'UTF-8');

    // Determine image mime type
    $imgType = 'image/jpeg';
    if (preg_match('/\.png$/i', strtok($cleanOgImage, '?'))) {
        $imgType = 'image/png';
    } else if (preg_match('/\.webp$/i', strtok($cleanOgImage, '?'))) {
        $imgType = 'image/webp';
    }

    $faviconType = 'image/jpeg';
    if (preg_match('/\.png$/i', strtok($cleanFavicon, '?'))) {
        $faviconType = 'image/png';
    } else if (preg_match('/\.webp$/i', strtok($cleanFavicon, '?'))) {
        $faviconType = 'image/webp';
    }

    // Helper function to replace or inject meta tags cleanly regardless of existing tag format or order
    function replace_or_inject_meta(&$html, $attrName, $attrVal, $contentVal) {
        $escapedAttrVal = preg_quote($attrVal, '/');
        $pattern = '/<meta\s+[^>]*' . $attrName . '=["\']' . $escapedAttrVal . '["\'][^>]*\/?>/i';
        $newTag = '<meta ' . $attrName . '="' . $attrVal . '" content="' . $contentVal . '" />';
        if (preg_match($pattern, $html)) {
            $html = preg_replace($pattern, $newTag, $html);
        } else if (strpos($html, '</head>') !== false) {
            $html = str_replace('</head>', '  ' . $newTag . "\n</head>", $html);
        }
    }

    // 1. Title replacement
    $html = preg_replace('/<title>.*?<\/title>/i', "<title>{$safeTitle}</title>", $html);
    replace_or_inject_meta($html, 'property', 'og:title', $safeTitle);
    replace_or_inject_meta($html, 'name', 'twitter:title', $safeTitle);

    // 2. Description replacement
    replace_or_inject_meta($html, 'name', 'description', $safeDesc);
    replace_or_inject_meta($html, 'property', 'og:description', $safeDesc);
    replace_or_inject_meta($html, 'name', 'twitter:description', $safeDesc);

    // 3. Image & Card replacement
    replace_or_inject_meta($html, 'property', 'og:type', 'website');
    replace_or_inject_meta($html, 'property', 'og:image', $safeOgImage);
    replace_or_inject_meta($html, 'property', 'og:image:url', $safeOgImage);
    replace_or_inject_meta($html, 'property', 'og:image:secure_url', $safeOgImage);
    replace_or_inject_meta($html, 'property', 'og:image:type', $imgType);
    replace_or_inject_meta($html, 'property', 'og:image:width', '1200');
    replace_or_inject_meta($html, 'property', 'og:image:height', '630');
    replace_or_inject_meta($html, 'name', 'twitter:image', $safeOgImage);
    replace_or_inject_meta($html, 'name', 'twitter:image:src', $safeOgImage);
    replace_or_inject_meta($html, 'name', 'twitter:card', 'summary_large_image');

    // 4. Favicon & Touch Icons replacement (Uses $safeFavicon square icon)
    $html = preg_replace('/<link\s+rel=["\'](?:shortcut\s+)?icon["\'][^>]*\/?>/i', '<link rel="icon" type="' . $faviconType . '" href="' . $safeFavicon . '" />', $html);
    $html = preg_replace('/<link\s+rel=["\']apple-touch-icon["\'][^>]*\/?>/i', '<link rel="apple-touch-icon" href="' . $safeFavicon . '" />', $html);

    // 5. Canonical & og:url replacement
    replace_or_inject_meta($html, 'property', 'og:url', $safeFullUrl);

    if (preg_match('/<link\s+rel=["\']canonical["\']\s+href=["\'].*?["\']\s*\/?>/i', $html)) {
        $html = preg_replace('/<link\s+rel=["\']canonical["\']\s+href=["\'].*?["\']\s*\/?>/i', '<link rel="canonical" href="' . $safeFullUrl . '" />', $html);
    } else if (strpos($html, '</head>') !== false) {
        $html = str_replace('</head>', '  <link rel="canonical" href="' . $safeFullUrl . '" />' . "\n</head>", $html);
    }

    header('Content-Type: text/html; charset=utf-8');
    echo $html;
    exit();
}

http_response_code(404);
echo "Aplikasi Modul Ajar Berbasis Cinta (KBC): File index.html tidak ditemukan.";
