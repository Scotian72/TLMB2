(function () {
  'use strict';
  var TL = window.TL = window.TL || {};
  TL.Assets = TL.Assets || {};

  // Prefer modern, smaller WebP assets; PNG/SVG are fallback only.
  TL.Assets.logo = function (key) {
    if (!key) return 'assets/logos/TLM_256.webp';
    var base = String(key).toLowerCase();
    var candidates = [
      'assets/logos/' + base + '.webp', // preferred
      'img/logos/' + base + '.png',
      'img/logos/' + base + '.svg',
      'img/logos/' + base.charAt(0).toUpperCase() + base.slice(1) + '.svg'
    ];
    return candidates[0];
  };

  // Boot logo: use WebP by default
  TL.Assets.bootLogo = function () {
    // Prefer 256; callers in high-DPI contexts can swap to 512 if needed.
    return 'assets/logos/TLM_256.webp';
  };

  // Optional helper: choose 512 for high pixel density
  TL.Assets.bootLogoHiDPI = function () {
    try {
      if (window.devicePixelRatio && window.devicePixelRatio >= 1.5) {
        return 'assets/logos/TLM_512.webp';
      }
    } catch (e) {}
    return TL.Assets.bootLogo();
  };
})();