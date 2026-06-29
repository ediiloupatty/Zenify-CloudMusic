package main

// titlebarJS is injected into every page (before its own scripts, on each
// navigation). It marks the desktop environment, forwards now-playing events to
// Discord, and builds a custom 32px title bar with working window controls that
// call the win* functions bound in main.go. All styling is inline so it works on
// the unmodified online web app.
const titlebarJS = `
window.__ZENIFY_DESKTOP__ = true;

window.addEventListener('zenify:nowplaying', function (e) {
  try { window.zenifyPresence(e.detail); } catch (_) {}
});

// Reveal the (off-screen) window as soon as the document has painted its first
// frame (the dark shell / loading skeleton) — NOT on 'load'. With streaming SSR
// and a slow backend, 'load' only fires once all data has arrived, which would
// keep the window hidden the whole time (skeleton never seen) and then flash.
// The root element paints dark from the first frame (inline bg on <html>), so
// revealing early shows the skeleton with no white flash.
(function revealOnReady() {
  var done = false;
  function reveal() {
    if (done) return; done = true;
    try { window.winReveal(); } catch (_) {}
  }
  function tick() {
    if (done) return;
    if (document.body && document.body.childNodes.length > 0) {
      // One extra rAF so the first paint (incl. CSS) has actually landed.
      requestAnimationFrame(function () { requestAnimationFrame(reveal); });
    } else {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
  // Hard fallback so the window can never get stuck off-screen.
  setTimeout(reveal, 3000);
})();

(function () {
  function call(n){ var f = window[n]; if (typeof f === 'function') f(); }

  function mkbtn(svg, hover, fn){
    var b = document.createElement('button');
    b.style.cssText = 'height:100%;width:46px;display:flex;align-items:center;justify-content:center;background:transparent;border:0;color:inherit;cursor:default;transition:background .15s,color .15s;-webkit-app-region:no-drag';
    b.innerHTML = svg;
    b.onmousedown = function(e){ e.stopPropagation(); };
    b.onmouseenter = function(){ b.style.background = hover; if (hover === '#dc2626') b.style.color = '#fff'; };
    b.onmouseleave = function(){ b.style.background = 'transparent'; b.style.color = 'inherit'; };
    b.onclick = fn;
    return b;
  }

  function inject(){
    if (!document.body || document.getElementById('zenify-titlebar')) return;

    // Replace WebView2's default offline / error page with a premium dark mode Zenify screen
    if (location.href.indexOf('chromewebdata') !== -1 || document.body.innerHTML.indexOf('ERR_INTERNET_DISCONNECTED') !== -1 || document.body.innerHTML.indexOf('ERR_CONNECTION_REFUSED') !== -1) {
      document.body.innerHTML = '';
      document.body.style.background = '#0a0c11';
      var errBox = document.createElement('div');
      errBox.style.cssText = 'position:fixed;top:32px;left:0;right:0;bottom:0;background:#0a0c11;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;z-index:2147483640;padding:20px;text-align:center;user-select:none';
      errBox.innerHTML = '<div style="position:absolute;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%);top:50%;left:50%;transform:translate(-50%, -50%);pointer-events:none;"></div>' +
        '<div style="width:68px;height:68px;border-radius:22px;background:rgba(20,184,166,0.08);border:1px solid rgba(20,184,166,0.18);display:flex;align-items:center;justify-content:center;margin-bottom:24px;box-shadow:0 12px 32px rgba(0,0,0,0.4);">' +
        '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>' +
        '<h1 style="font-size:22px;font-weight:700;letter-spacing:-0.03em;margin:0 0 8px 0;color:#f8fafc;">Unable to Connect to Zenify</h1>' +
        '<p style="font-size:14px;color:#94a3b8;max-width:360px;margin:0 0 30px 0;line-height:1.6;">Please check your network connection or verify that the Zenify server is running. Playback and library access will resume once the connection is restored.</p>' +
        '<button onclick="location.reload()" style="background:#14b8a6;color:#042f2e;border:0;padding:11px 26px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(20,184,166,0.25);transition:all 0.2s;">Try Again</button>' +
        '<div style="margin-top:36px;font-size:11px;font-family:monospace;color:#64748b;letter-spacing:0.05em;background:rgba(255,255,255,0.03);padding:5px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">ERR_INTERNET_DISCONNECTED</div>';
      document.body.appendChild(errBox);
    }

    var style = document.createElement('style');
    style.id = 'zenify-titlebar-style';
    // Reserve the 32px for the title bar on normal (in-flow) pages, but NOT on
    // full-screen fixed overlays (e.g. the expanded player) — those must stay a
    // full 100vh so nothing leaks at the bottom; the title bar simply floats over
    // their top via its higher z-index.
    style.textContent = 'body{padding-top:32px !important}.h-screen:not(.fixed){height:calc(100vh - 32px) !important}';
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'zenify-titlebar';
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;height:32px;z-index:2147483647;display:flex;align-items:center;justify-content:space-between;background:#0a0c11;border-bottom:1px solid rgba(255,255,255,.08);color:#9aa3af;user-select:none;font-family:system-ui,Segoe UI,sans-serif';
    bar.onmousedown = function(){ call('winDragStart'); };
    bar.ondblclick = function(){ call('winToggleMaximize'); };

    // Left: back / forward nav
    var navBtn = 'height:28px;width:28px;display:flex;align-items:center;justify-content:center;background:transparent;border:0;border-radius:6px;color:#9aa3af;cursor:default;transition:background .15s,color .15s;-webkit-app-region:no-drag;padding:0';
    var back = document.createElement('button');
    back.style.cssText = navBtn;
    back.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="10 4 6 8 10 12"/></svg>';
    back.onmousedown = function(e){ e.stopPropagation(); };
    back.onmouseenter = function(){ back.style.background='rgba(255,255,255,.08)'; back.style.color='#fff'; };
    back.onmouseleave = function(){ back.style.background='transparent'; back.style.color='#9aa3af'; };
    back.onclick = function(){ window.history.back(); };

    var fwd = document.createElement('button');
    fwd.style.cssText = navBtn;
    fwd.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 4 10 8 6 12"/></svg>';
    fwd.onmousedown = function(e){ e.stopPropagation(); };
    fwd.onmouseenter = function(){ fwd.style.background='rgba(255,255,255,.08)'; fwd.style.color='#fff'; };
    fwd.onmouseleave = function(){ fwd.style.background='transparent'; fwd.style.color='#9aa3af'; };
    fwd.onclick = function(){ window.history.forward(); };

    var leftZone = document.createElement('div');
    leftZone.style.cssText = 'display:flex;align-items:center;gap:2px;padding:0 8px;height:100%;min-width:100px';
    leftZone.appendChild(back);
    leftZone.appendChild(fwd);
    bar.appendChild(leftZone);

    // Center: logo + app name + current page
    var center = document.createElement('div');
    center.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:7px;pointer-events:auto;-webkit-app-region:no-drag;cursor:default';
    center.onmousedown = function(e){ e.stopPropagation(); };
    center.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#14b8a6">' +
      '<rect x="2.5" y="8" width="2.6" height="8" rx="1.3"/>' +
      '<rect x="6.6" y="5.5" width="2.6" height="13" rx="1.3"/>' +
      '<rect x="10.7" y="3.5" width="2.6" height="17" rx="1.3"/>' +
      '<rect x="14.8" y="6.5" width="2.6" height="11" rx="1.3"/>' +
      '<rect x="18.9" y="8.5" width="2.6" height="7" rx="1.3"/></svg>' +
      '<span style="font-size:12px;font-weight:600;letter-spacing:.04em;color:#e2e8f0">Zenify</span>' +
      '<span id="zenify-page-label" style="font-size:11px;font-weight:500;color:#64748b"></span>';
    bar.appendChild(center);

    var ctr = document.createElement('div');
    ctr.style.cssText = 'display:flex;align-items:center;height:100%';

    var minSvg = '<svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.2"><line x1="1" y1="6" x2="10" y2="6"/></svg>';
    var maxSvg = '<svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.2" y="1.2" width="8.6" height="8.6" rx="1"/></svg>';
    var clsSvg = '<svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.2"><line x1="1.5" y1="1.5" x2="9.5" y2="9.5"/><line x1="9.5" y1="1.5" x2="1.5" y2="9.5"/></svg>';

    ctr.appendChild(mkbtn(minSvg, 'rgba(255,255,255,.1)', function(){ call('winMinimize'); }));
    ctr.appendChild(mkbtn(maxSvg, 'rgba(255,255,255,.1)', function(){ call('winToggleMaximize'); }));
    ctr.appendChild(mkbtn(clsSvg, '#dc2626', function(){ call('winClose'); }));

    bar.appendChild(ctr);
    document.body.appendChild(bar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
  // Safety net in case a client-side route change wipes the node.
  setInterval(inject, 1000);

  // Update the page label in the titlebar whenever the route changes.
  function getPageName(){
    var p = location.pathname;
    if (p === '/') return 'Home';
    if (p === '/favorites') return 'Favorites';
    if (p === '/settings') return 'Settings';
    if (p === '/profile') return 'Profile';
    if (p === '/songs') return 'Songs';
    if (p === '/albums') return 'Albums';
    if (p === '/artists') return 'Artists';
    if (p === '/playlists') return 'Playlists';
    if (p === '/admin') return 'Admin';
    if (p.indexOf('/album/') === 0) return 'Album';
    if (p.indexOf('/artist/') === 0) return 'Artist';
    if (p === '/login') return 'Login';
    if (p === '/signup') return 'Sign Up';
    var seg = p.split('/')[1];
    return seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : '';
  }
  var lastPagePath = '';
  function updatePage(){
    if (location.pathname === lastPagePath) return;
    lastPagePath = location.pathname;
    var el = document.getElementById('zenify-page-label');
    if (el) {
      var name = getPageName();
      el.textContent = name ? '\u2014 ' + name : '';
    }
  }
  setInterval(updatePage, 300);
  updatePage();
})();

// Forward hardware media-key events (Play/Pause, Next, Prev) to the player by
// clicking the matching button in the DOM. The Go side captures WM_APPCOMMAND
// and dispatches 'zenify:mediakey' CustomEvents with detail = action name.
window.addEventListener('zenify:mediakey', function (e) {
  var map = {
    'play-pause': '[aria-label="Play"],[aria-label="Pause"]',
    'next':       '[aria-label="Next track"]',
    'prev':       '[aria-label="Previous track"]',
    'stop':       '[aria-label="Pause"]'
  };
  var sel = map[e.detail];
  if (!sel) return;
  // Find a visible (non-hidden) button matching the selector.
  var btns = document.querySelectorAll(sel);
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].offsetParent !== null) { btns[i].click(); return; }
  }
  // Fallback: click the first match even if visibility check failed.
  if (btns.length) btns[0].click();
});
`
