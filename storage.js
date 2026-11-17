(function (window) {
  "use strict";
  const PREFIX = "snapbook_";
  function read(key, fallback) {
    try {
      const value = localStorage.getItem(PREFIX + key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) { console.warn("SnapBook storage read error:", error); return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch (error) { console.error("SnapBook storage write error:", error); return false; }
  }
  function remove(key) { localStorage.removeItem(PREFIX + key); }
  window.SnapStorage = { read, write, remove };
})(window);
