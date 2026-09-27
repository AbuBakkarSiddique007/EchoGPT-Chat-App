export const SIDEBAR_STORAGE_KEY = "echogpt-sidebar";

export const SIDEBAR_RAIL_CLASS = "sidebar-shell";

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "collapsed";
  } catch {
    return false;
  }
}

function applyCollapsed(collapsed: boolean): void {
  const root = document.documentElement;
  if (collapsed) root.setAttribute("data-sidebar", "collapsed");
  else root.removeAttribute("data-sidebar");
}

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function setSidebarCollapsed(collapsed: boolean): void {
  try {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? "collapsed" : "expanded");
  } catch {
    return;
  }
  applyCollapsed(collapsed);
  notify();
}

export function subscribeCollapsed(callback: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_STORAGE_KEY) callback();
  };

  listeners.add(callback);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getCollapsedSnapshot(): boolean {
  return readCollapsed();
}

export function getServerCollapsedSnapshot(): boolean {
  return false;
}

export const SIDEBAR_NO_FLASH_SCRIPT = `(function(){try{if(window.localStorage.getItem(${JSON.stringify(
  SIDEBAR_STORAGE_KEY,
)})==="collapsed"){document.documentElement.setAttribute("data-sidebar","collapsed");}}catch(e){}})();`;
