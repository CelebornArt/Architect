// Obsidian / Word-style customizable formatting toolbar, hover dropdowns, custom fonts, fullscreen mode & User Settings customizer

const ArchitectToolbar = (() => {
  type ToolbarPosition = 'top' | 'bottom' | 'left' | 'right';
  type CustomFontDef = {
    id: string;
    name: string;
    family: string;
    assetId?: string;
    dataUrl?: string;
  };
  type UserPreferences = {
    toolbar: {
      enabled: boolean;
      collapsed?: boolean;
      position: ToolbarPosition;
      items: string[];
    };
    defaultFont?: string;
    timeZone?: string;
    customFonts: CustomFontDef[];
    appearance?: {
      theme: 'obsidian' | 'warm';
      textScale: 'small' | 'compact' | 'default' | 'comfortable' | 'large';
      defaultFullWidth: boolean;
    };
    files?: {
      localSavePath: string;
      driveSaveLocation: string;
      serverUrl: string;
    };
    hotkeys?: Record<string, string>;
  };

  const HOTKEY_CATALOG: Array<{ id: string; label: string; category: string; defaultBinding: string }> = [
    { id: 'quick-search', label: 'Quick search: Search workspace', category: 'Navigation', defaultBinding: 'Ctrl + K' },
    { id: 'new-page', label: 'Pages: Create new page', category: 'Creation', defaultBinding: 'Ctrl + N' },
    { id: 'new-form', label: 'Forms: Create new form', category: 'Creation', defaultBinding: '' },
    { id: 'new-board', label: 'Boards: Create new board', category: 'Creation', defaultBinding: '' },
    { id: 'new-database', label: 'Databases: Create new database', category: 'Creation', defaultBinding: '' },
    { id: 'new-tab', label: 'Tabs: Open new tab', category: 'Tabs', defaultBinding: 'Ctrl + T' },
    { id: 'toggle-sidebar', label: 'Workspace: Toggle left file explorer sidebar', category: 'View', defaultBinding: 'Ctrl + \\' },
    { id: 'toggle-fullscreen', label: 'Editor: Toggle fullscreen writing mode', category: 'View', defaultBinding: '' },
    { id: 'add-comment', label: 'Comments: Add comment on selection or block', category: 'Editor', defaultBinding: 'Ctrl + Shift + M' },
    { id: 'mode-notion', label: 'Modes: Switch to Docs view', category: 'Navigation', defaultBinding: '' },
    { id: 'mode-dashboard', label: 'Modes: Switch to Dashboards', category: 'Navigation', defaultBinding: '' },
    { id: 'mode-inbox', label: 'Modes: Switch to Notifications', category: 'Navigation', defaultBinding: '' },
    { id: 'open-assets', label: 'Tools: Open Asset library', category: 'Tools', defaultBinding: '' },
    { id: 'user-settings', label: 'Settings: Open client settings', category: 'Settings', defaultBinding: 'Ctrl + ,' }
  ];

  type ToolDef = {
    id: string;
    label: string;
    title: string;
    category: 'History' | 'Text' | 'Style' | 'Structure' | 'View' | 'Layout';
    hasDropdown?: boolean;
    repeatable?: boolean;
    svg: string;
  };

  const DEFAULT_TOOLBAR_ITEMS = [
    'undo', 'redo', 'sep',
    'heading', 'bold', 'italic', 'strikethrough', 'underline', 'text-options', 'sep',
    'font', 'text-color', 'highlight-color', 'format-tools', 'sep',
    'lists', 'align', 'callouts', 'insert-table', 'sep',
    'fullscreen'
  ];

  const BUILTIN_FONTS = [
    { id: 'default', label: 'Default (Inter)', family: "Inter, 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    { id: 'serif', label: 'Serif (Georgia)', family: "Georgia, 'Times New Roman', serif" },
    { id: 'mono', label: 'Monospace', family: "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace" },
    { id: 'editorial', label: 'Editorial (Palatino)', family: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
    { id: 'geometric', label: 'Clean Sans (Segoe)', family: "'Segoe UI', 'DM Sans', system-ui, sans-serif" },
    { id: 'hand', label: 'Sketch / Casual', family: "'Comic Sans MS', 'Segoe Print', cursive, sans-serif" }
  ];

  const CALLOUT_VARIANTS = [
    { key: 'quote', label: 'Quote (accent bar)', icon: '❝', kind: 'quote', accent: '#7c5cff', bg: '#f6f4ff' },
    { key: 'callout', label: 'Callout', icon: '💡', kind: 'callout', accent: '#686761', bg: '#f7f6f3' }
  ];

  const ICONS = {
    undo: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7H11.5C13.9 7 15.5 8.5 15.5 10.8C15.5 13 13.8 14.5 11.5 14.5H7.5"/><path d="M7.5 4.5L4.5 7L7.5 9.5"/></svg>',
    redo: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 7H6.5C4.1 7 2.5 8.5 2.5 10.8C2.5 13 4.2 14.5 6.5 14.5H10.5"/><path d="M10.5 4.5L13.5 7L10.5 9.5"/></svg>',
    heading: '<span class="tb-glyph-text">H<small>n</small></span>',
    bold: '<span class="tb-glyph-text tb-bold">B</span>',
    italic: '<span class="tb-glyph-text tb-italic">I</span>',
    strikethrough: '<span class="tb-glyph-text tb-strike">S</span>',
    underline: '<span class="tb-glyph-text tb-under">U</span>',
    textOptions: '<span class="tb-glyph-text">T<sup>°</sup></span>',
    font: '<span class="tb-glyph-text">Aa</span>',
    fontSize: '<span class="tb-glyph-text">T<small>↕</small></span>',
    textColor: '<span class="tb-glyph-color"><span>A</span><i class="tb-color-bar" data-tb-color-indicator="text"></i></span>',
    highlightColor: '<span class="tb-glyph-color"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.8 2.6L13.4 6.2L6.8 12.8H3.2V9.2L9.8 2.6Z"/><path d="M8.3 4.1L11.9 7.7"/></svg><i class="tb-color-bar" data-tb-color-indicator="bg"></i></span>',
    formatTools: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 2.5L15.5 7.5L11.8 11.2L6.8 6.2L10.5 2.5Z"/><path d="M8.3 7.7L3.5 12.5C2.9 13.1 2.9 14.1 3.5 14.7C4.1 15.3 5.1 15.3 5.7 14.7L10.5 9.9"/></svg>',
    clearFormat: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 3.5L15 8L8.5 14.5H4.5L2.8 12.8C2.2 12.2 2.2 11.2 2.8 10.6L9.9 3.5Z"/><path d="M7.5 14.5H15.5"/></svg>',
    lists: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="3.8" cy="5" r="0.9" fill="currentColor" stroke="none"/><circle cx="3.8" cy="9" r="0.9" fill="currentColor" stroke="none"/><circle cx="3.8" cy="13" r="0.9" fill="currentColor" stroke="none"/><path d="M7 5H15M7 9H15M7 13H15"/></svg>',
    align: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 4.5H15M3 7.8H11M3 11.2H14M3 14.5H9.5"/></svg>',
    callouts: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 4.2C3.5 3.4 4.1 2.8 4.9 2.8H13.1C13.9 2.8 14.5 3.4 14.5 4.2V10.6C14.5 11.4 13.9 12 13.1 12H7.2L4.2 14.6V12H4.9C4.1 12 3.5 11.4 3.5 10.6V4.2Z"/></svg>',
    table: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.8" y="3.5" width="12.4" height="11" rx="1.6"/><path d="M2.8 7.4H15.2M7 7.4V14.5M11 7.4V14.5"/></svg>',
    link: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 6.8L7.4 11.9C6.6 12.7 5.3 12.7 4.5 11.9C3.7 11.1 3.7 9.8 4.5 9L10.3 3.2C11.5 2 13.4 2 14.6 3.2C15.8 4.4 15.8 6.3 14.6 7.5L8.6 13.5C6.9 15.2 4.1 15.2 2.4 13.5"/></svg>',
    todo: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="6.2"/><path d="M6.4 9.1L8.2 10.9L12 7"/></svg>',
    fullscreen: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.8V3.5H6.3M11.7 3.5H15V6.8M15 11.2V14.5H11.7M6.3 14.5H3V11.2"/></svg>',
    fullscreenExit: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5V6.5H3.5M14.5 6.5H11.5V3.5M11.5 14.5V11.5H14.5M3.5 11.5H6.5V14.5"/></svg>',
    sep: '<span class="tb-glyph-sep">|</span>'
  };

  const TOOL_CATALOG: ToolDef[] = [
    { id: 'undo', label: 'Undo', title: 'Undo (Ctrl+Z)', category: 'History', svg: ICONS.undo },
    { id: 'redo', label: 'Redo', title: 'Redo (Ctrl+Shift+Z)', category: 'History', svg: ICONS.redo },
    { id: 'heading', label: 'Headings', title: 'Headings (H1–H6)', category: 'Text', hasDropdown: true, svg: ICONS.heading },
    { id: 'bold', label: 'Bold', title: 'Bold (Ctrl+B)', category: 'Text', svg: ICONS.bold },
    { id: 'italic', label: 'Italic', title: 'Italic (Ctrl+I)', category: 'Text', svg: ICONS.italic },
    { id: 'strikethrough', label: 'Strikethrough', title: 'Strikethrough', category: 'Text', svg: ICONS.strikethrough },
    { id: 'underline', label: 'Underline', title: 'Underline (Ctrl+U)', category: 'Text', svg: ICONS.underline },
    { id: 'text-options', label: 'Text options', title: 'Text options (Caps, Super, Sub, Size, Link, Embed, Math)', category: 'Text', hasDropdown: true, svg: ICONS.textOptions },
    { id: 'font', label: 'Font', title: 'Font family & workspace custom fonts', category: 'Style', hasDropdown: true, svg: ICONS.font },
    { id: 'font-size', label: 'Font size (optional)', title: 'Optional inline text size', category: 'Style', hasDropdown: true, svg: ICONS.fontSize },
    { id: 'text-color', label: 'Font color', title: 'Text color', category: 'Style', hasDropdown: true, svg: ICONS.textColor },
    { id: 'highlight-color', label: 'Highlight', title: 'Highlight color', category: 'Style', hasDropdown: true, svg: ICONS.highlightColor },
    { id: 'format-tools', label: 'Formatting tools', title: 'Formatting tools', category: 'Style', hasDropdown: true, svg: ICONS.formatTools },
    { id: 'clear-format', label: 'Clear formatting', title: 'Clear formatting', category: 'Style', svg: ICONS.clearFormat },
    { id: 'lists', label: 'Lists', title: 'Lists & indentation', category: 'Structure', hasDropdown: true, svg: ICONS.lists },
    { id: 'align', label: 'Alignment', title: 'Block alignment', category: 'Structure', hasDropdown: true, svg: ICONS.align },
    { id: 'callouts', label: 'Callouts & Quote', title: 'Callouts & quotes', category: 'Structure', hasDropdown: true, svg: ICONS.callouts },
    { id: 'insert-table', label: 'Insert table', title: 'Insert table (non-database)', category: 'Structure', svg: ICONS.table },
    { id: 'link-attach', label: 'Insert link', title: 'Insert link', category: 'Text', svg: ICONS.link },
    { id: 'todo-toggle', label: 'To-do checkbox', title: 'Convert to To-do', category: 'Structure', svg: ICONS.todo },
    { id: 'fullscreen', label: 'Fullscreen', title: 'Toggle fullscreen writing mode', category: 'View', svg: ICONS.fullscreen },
    { id: 'sep', label: 'Separator', title: 'Divider line between tool groups', category: 'Layout', repeatable: true, svg: ICONS.sep }
  ];

  let host: any = null;
  let openDropdownToolId: string | null = null;
  let hoverOpenTimer = 0;
  let hoverCloseTimer = 0;
  let dropdownEl: HTMLDivElement | null = null;
  let isFullscreen = false;
  let loadedCustomFontUrls = new Map<string, string>();
  let dragState: { source: 'active' | 'palette'; index?: number; toolId: string } | null = null;
  let lastSelectedTextColorKey: string | null = null;
  let lastSelectedBgColorKey: string | null = null;
  let lastToolbarRenderKey = '';
  let activeSettingsTab: 'general' | 'appearance' | 'toolbar' | 'hotkeys' = 'general';
  let hotkeyFilterMode: 'all' | 'assigned' | 'unassigned' = 'all';
  let recordingHotkeyId: string | null = null;

  function esc(str: any) {
    return String(str ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[m]);
  }

  function ensureUserPreferences(w: any): UserPreferences {
    if (!w.userPreferences || typeof w.userPreferences !== 'object') w.userPreferences = {};
    const up = w.userPreferences;
    if (!up.toolbar || typeof up.toolbar !== 'object') up.toolbar = {};
    const tb = up.toolbar;
    const pos: ToolbarPosition = ['top', 'bottom', 'left', 'right'].includes(tb.position) ? tb.position : 'top';
    const validIds = new Set(TOOL_CATALOG.map(t => t.id));
    const items = Array.isArray(tb.items) && tb.items.length
      ? tb.items.filter((x: any) => typeof x === 'string' && validIds.has(x))
      : [...DEFAULT_TOOLBAR_ITEMS];
    tb.enabled = tb.enabled !== false;
    tb.collapsed = !!tb.collapsed;
    tb.position = pos;
    tb.items = items.length ? items : [...DEFAULT_TOOLBAR_ITEMS];
    if (typeof up.defaultFont !== 'string') up.defaultFont = 'default';
    if (typeof up.timeZone !== 'string' || !up.timeZone.trim()) up.timeZone = 'auto';
    if (!Array.isArray(up.customFonts)) up.customFonts = [];
    up.appearance = {
      theme: up.appearance?.theme === 'warm' ? 'warm' : 'obsidian',
      textScale: ['small', 'compact', 'default', 'comfortable', 'large'].includes(up.appearance?.textScale) ? up.appearance.textScale : 'default',
      defaultFullWidth: !!up.appearance?.defaultFullWidth
    };
    up.files = {
      localSavePath: String(up.files?.localSavePath ?? w.assetPreviewPolicy?.cacheFolderPath ?? ''),
      driveSaveLocation: String(up.files?.driveSaveLocation ?? w.syncConfig?.folderPath ?? w.syncConfig?.sourceUrl ?? ''),
      serverUrl: String(up.files?.serverUrl ?? w.syncConfig?.serverUrl ?? '')
    };
    if (!up.hotkeys || typeof up.hotkeys !== 'object') {
      const defaults: Record<string, string> = {};
      HOTKEY_CATALOG.forEach(c => { defaults[c.id] = c.defaultBinding; });
      up.hotkeys = defaults;
    } else {
      HOTKEY_CATALOG.forEach(c => {
        if (typeof up.hotkeys[c.id] !== 'string') up.hotkeys[c.id] = c.defaultBinding;
      });
    }
    return up;
  }

  function applyAppearanceStyles() {
    const prefs = getPrefs();
    const ap = prefs.appearance || { theme: 'obsidian', textScale: 'default', defaultFullWidth: false };
    document.body.dataset.uiTheme = ap.theme || 'obsidian';
    document.body.dataset.uiScale = ap.textScale || 'default';
  }

  function formatHotkeyEvent(e: KeyboardEvent): string {
    const k = e.key;
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(k)) return '';
    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    const normKey = k === ' ' ? 'Space' : k.length === 1 ? k.toUpperCase() : k;
    parts.push(normKey);
    return parts.join(' + ');
  }

  function matchHotkeyAction(e: KeyboardEvent): string | null {
    if (recordingHotkeyId) return null;
    const combo = formatHotkeyEvent(e);
    if (!combo) return null;
    const hotkeys = getPrefs().hotkeys || {};
    for (const cmd of HOTKEY_CATALOG) {
      if ((hotkeys[cmd.id] || '').toLowerCase() === combo.toLowerCase()) return cmd.id;
    }
    return null;
  }

  function getPrefs(): UserPreferences {
    const state = host?.getState?.();
    return ensureUserPreferences(state || {});
  }

  function getDropdownEl(): HTMLDivElement {
    if (!dropdownEl) {
      dropdownEl = document.createElement('div');
      dropdownEl.id = 'tb-hover-dropdown';
      dropdownEl.className = 'tb-dropdown';
      dropdownEl.hidden = true;
      dropdownEl.addEventListener('mouseenter', () => clearTimeout(hoverCloseTimer));
      dropdownEl.addEventListener('mouseleave', () => scheduleCloseDropdown());
      dropdownEl.addEventListener('mousedown', e => {
        if (!(e.target as Element)?.closest('input,select')) e.preventDefault();
      });
      document.body.append(dropdownEl);
    }
    return dropdownEl;
  }

  function closeDropdown() {
    clearTimeout(hoverOpenTimer);
    clearTimeout(hoverCloseTimer);
    openDropdownToolId = null;
    if (dropdownEl) {
      dropdownEl.hidden = true;
      dropdownEl.replaceChildren();
    }
    document.querySelectorAll('.tb-btn.is-open').forEach(el => el.classList.remove('is-open'));
  }

  function scheduleCloseDropdown() {
    clearTimeout(hoverOpenTimer);
    clearTimeout(hoverCloseTimer);
    hoverCloseTimer = window.setTimeout(() => closeDropdown(), 165);
  }

  function getWorkspaceCustomFonts(): CustomFontDef[] {
    const state = host?.getState?.();
    const prefs = getPrefs();
    if (state) {
      if (!Array.isArray(state.customFonts)) state.customFonts = [];
      if (Array.isArray(prefs.customFonts) && prefs.customFonts.length) {
        const known = new Set(state.customFonts.map((f: CustomFontDef) => f.id));
        prefs.customFonts.forEach(cf => { if (!known.has(cf.id)) state.customFonts.push(cf); });
        prefs.customFonts = [];
      }
      return state.customFonts;
    }
    return prefs.customFonts || [];
  }

  function fontCssFamily(fontKey?: string): string {
    if (!fontKey || fontKey === 'default') return BUILTIN_FONTS[0].family;
    const builtin = BUILTIN_FONTS.find(f => f.id === fontKey);
    if (builtin) return builtin.family;
    const custom = getWorkspaceCustomFonts().find(f => f.id === fontKey || `custom:${f.id}` === fontKey);
    if (custom) return `"${custom.family.replace(/"/g, '')}", sans-serif`;
    return BUILTIN_FONTS[0].family;
  }

  function syncCustomFontStyles() {
    const prefs = getPrefs();
    let styleEl = document.getElementById('architect-font-styles') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'architect-font-styles';
      document.head.append(styleEl);
    }
    const rules: string[] = [];
    BUILTIN_FONTS.forEach(f => {
      if (f.id !== 'default') {
        rules.push(`[data-font="${f.id}"]{font-family:${f.family}!important}`);
      }
    });
    const customList = getWorkspaceCustomFonts();
    customList.forEach(cf => {
      const key = `custom:${cf.id}`;
      const safeFam = cf.family.replace(/["\\]/g, '');
      rules.push(`[data-font="${CSS.escape(key)}"]{font-family:"${safeFam}",sans-serif!important}`);
      const existingUrl = loadedCustomFontUrls.get(cf.id) || cf.dataUrl;
      if (existingUrl) {
        rules.push(`@font-face{font-family:"${safeFam}";src:url("${existingUrl}");font-display:swap}`);
      } else if (cf.assetId && typeof ArchitectBackend !== 'undefined') {
        const asset = ArchitectBackend.readAssetCatalog().find(a => a.id === cf.assetId);
        if (asset) {
          ArchitectBackend.resolveAssetOriginalUrl(asset).then(url => {
            if (url && !loadedCustomFontUrls.has(cf.id)) {
              loadedCustomFontUrls.set(cf.id, url);
              syncCustomFontStyles();
            }
          }).catch(() => {});
        }
      }
    });

    const defKey = prefs.defaultFont || 'default';
    if (defKey !== 'default') {
      rules.push(`#editor .block-editor, #editor .page-heading{font-family:${fontCssFamily(defKey)}}`);
    }
    const nextCss = rules.join('\n');
    if (styleEl.textContent !== nextCss) styleEl.textContent = nextCss;
  }

  async function handleCustomFontUpload(file: File): Promise<CustomFontDef | null> {
    if (!file) return null;
    const rawName = file.name.replace(/\.(ttf|otf|woff2?|TTF|OTF|WOFF2?)$/, '').trim() || 'Custom Font';
    const cleanFamily = rawName.replace(/[^a-zA-Z0-9 _-]/g, '').trim() || `CustomFont-${Date.now()}`;
    const fontId = `f-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    let assetId: string | undefined;
    let dataUrl: string | undefined;
    try {
      if (typeof ArchitectBackend !== 'undefined') {
        const state = host?.getState?.();
        const rec = await ArchitectBackend.ingestLocalFile(file, {
          creator: host?.getCurrentUser?.() || state?.users?.[0]?.name || 'Raphael',
          category: 'other',
          storageMode: state?.assetStorageMode || 'local',
          previewPolicy: state?.assetPreviewPolicy
        });
        assetId = rec.id;
        const resolvedUrl = await ArchitectBackend.resolveAssetOriginalUrl(rec);
        if (resolvedUrl) loadedCustomFontUrls.set(fontId, resolvedUrl);
      }
      if (!loadedCustomFontUrls.has(fontId) && file.size < 450_000) {
        dataUrl = await new Promise<string>((res, rej) => {
          const fr = new FileReader();
          fr.onload = () => res(String(fr.result || ''));
          fr.onerror = () => rej(fr.error);
          fr.readAsDataURL(file);
        });
      }
      const list = getWorkspaceCustomFonts();
      const created: CustomFontDef = { id: fontId, name: rawName, family: cleanFamily, assetId, dataUrl };
      list.push(created);
      syncCustomFontStyles();
      host?.save?.(true);
      renderToolbar();
      renderFontManagerList();
      host?.toast?.(`Added workspace font "${rawName}"`);
      return created;
    } catch {
      host?.toast?.('Could not upload custom font file');
      return null;
    }
  }

  function removeCustomFont(fontId: string) {
    const state = host?.getState?.();
    const prefs = getPrefs();
    if (state && Array.isArray(state.customFonts)) {
      state.customFonts = state.customFonts.filter((x: CustomFontDef) => x.id !== fontId);
    }
    prefs.customFonts = (prefs.customFonts || []).filter(x => x.id !== fontId);
    if (prefs.defaultFont === `custom:${fontId}`) prefs.defaultFont = 'default';
    syncCustomFontStyles();
    host?.save?.(true);
    renderFontManagerList();
    renderToolbar();
  }

  function triggerCustomFontUpload() {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2';
    inp.hidden = true;
    inp.onchange = async () => {
      const f = inp.files?.[0];
      inp.remove();
      if (f) await handleCustomFontUpload(f);
    };
    document.body.append(inp);
    inp.click();
  }

  function positionDropdown(trigger: HTMLElement, dd: HTMLDivElement, position: ToolbarPosition) {
    dd.hidden = false;
    dd.style.maxHeight = '';
    const r = trigger.getBoundingClientRect();
    const box = dd.getBoundingClientRect();
    const margin = 8;
    let left = r.left;
    let top = r.bottom + 6;
    if (position === 'bottom') {
      top = r.top - box.height - 6;
      if (top < margin) top = Math.min(window.innerHeight - box.height - margin, r.bottom + 6);
      left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, r.left));
    } else if (position === 'left') {
      left = r.right + 6;
      if (left + box.width > window.innerWidth - margin) left = Math.max(margin, r.left - box.width - 6);
      top = Math.max(margin, Math.min(window.innerHeight - box.height - margin, r.top));
    } else if (position === 'right') {
      left = r.left - box.width - 6;
      if (left < margin) left = Math.min(window.innerWidth - box.width - margin, r.right + 6);
      top = Math.max(margin, Math.min(window.innerHeight - box.height - margin, r.top));
    } else {
      top = r.bottom + 6;
      if (top + box.height > window.innerHeight - margin) top = Math.max(margin, r.top - box.height - 6);
      left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, r.left));
    }
    dd.style.left = `${Math.round(left)}px`;
    dd.style.top = `${Math.round(top)}px`;
  }

  function openDropdownForTool(toolId: string, trigger: HTMLElement) {
    clearTimeout(hoverCloseTimer);
    const prefs = getPrefs();
    const dd = getDropdownEl();
    dd.replaceChildren();
    openDropdownToolId = toolId;
    document.querySelectorAll('.tb-btn.is-open').forEach(el => el.classList.remove('is-open'));
    trigger.classList.add('is-open');

    const ctxState = host?.getFormattingContext?.() || {};
    const addHeader = (text: string) => {
      const h = document.createElement('div');
      h.className = 'tb-dd-header';
      h.textContent = text;
      dd.append(h);
    };
    const addDivider = () => {
      const d = document.createElement('div');
      d.className = 'tb-dd-divider';
      dd.append(d);
    };
    const addItem = (label: string, iconHtml: string, run: () => void, opts: { active?: boolean; kbd?: string; dataAttrs?: Record<string, string> } = {}) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tb-dd-item' + (opts.active ? ' is-active' : '');
      if (opts.dataAttrs) {
        Object.entries(opts.dataAttrs).forEach(([k, v]) => btn.setAttribute(k, v));
      }
      btn.innerHTML = `<span class="tb-dd-ico">${iconHtml}</span><span class="tb-dd-label">${esc(label)}</span>${opts.kbd ? `<kbd class="tb-dd-kbd">${esc(opts.kbd)}</kbd>` : ''}${opts.active ? '<span class="tb-dd-check">✓</span>' : ''}`;
      btn.onmousedown = e => e.preventDefault();
      btn.onclick = () => { closeDropdown(); run(); updateToolbarState(); };
      dd.append(btn);
    };

    if (toolId === 'heading') {
      addHeader('Block headings');
      addItem('Normal text', 'T', () => host?.setBlockType?.('text'), { active: ctxState.blockType === 'text' });
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(lvl => {
        const n = lvl.slice(1);
        addItem(`Heading ${n}`, `H${n}`, () => host?.setBlockType?.(lvl), { active: ctxState.blockType === lvl && !ctxState.isToggle, kbd: `${'#'.repeat(Number(n))}` });
      });
      addDivider();
      addHeader('Toggle headings');
      ['h1', 'h2', 'h3'].forEach(lvl => {
        const n = lvl.slice(1);
        addItem(`Toggle heading ${n}`, `▸H${n}`, () => host?.setBlockType?.(lvl, { toggle: true }), { active: ctxState.blockType === lvl && !!ctxState.isToggle });
      });
    } else if (toolId === 'text-options') {
      addHeader('Inline styles & script');
      addItem('UPPERCASE', 'AA', () => host?.applyTextCase?.('upper'));
      addItem('lowercase', 'aa', () => host?.applyTextCase?.('lower'));
      addItem('Title Case', 'Aa', () => host?.applyTextCase?.('title'));
      addItem('Small Caps', 'ᴀᴀ', () => host?.applyTextCase?.('smallcaps'));
      addDivider();
      addItem('Superscript', 'x²', () => host?.applyInlineFormat?.('superscript'), { active: !!ctxState.superscript });
      addItem('Subscript', 'x₂', () => host?.applyInlineFormat?.('subscript'), { active: !!ctxState.subscript });
      addItem('Inline code', '&lt;/&gt;', () => host?.applyInlineCode?.(), { active: !!ctxState.inlineCode });
      addDivider();
      addHeader('Optional text size');
      [
        { id: 'sm', label: 'Small (12px)', ico: 's' },
        { id: 'default', label: 'Default', ico: 'M' },
        { id: 'lg', label: 'Large (17px)', ico: 'L' },
        { id: 'xl', label: 'Extra large (21px)', ico: 'XL' }
      ].forEach(sz => {
        addItem(sz.label, sz.ico, () => host?.applyFontSize?.(sz.id));
      });
      addDivider();
      addHeader('Insert inline / media');
      addItem('Link (URL)', '🔗', () => host?.insertLinkOnSelection?.());
      addItem('Web embed', '◇', () => host?.insertEmbedBlock?.());
      addItem('Inline math / LaTeX', '∑', () => host?.insertInlineMath?.());
      addItem('Date chip', '📅', () => host?.insertDateBlock?.());
    } else if (toolId === 'text-color' || toolId === 'highlight-color') {
      const kind = toolId === 'text-color' ? 'text' : 'bg';
      addHeader(kind === 'text' ? 'Font color' : 'Highlight color');
      const palette: Array<{ key: string; label: string; textHex: string; bgHex: string }> = host?.getColors?.() || [];
      const lastColor = host?.getLastUsedColor?.();
      if (lastColor && lastColor.kind === kind) {
        const found = palette.find(c => c.key === lastColor.key);
        if (found) {
          addItem(
            `Last used (${found.label})`,
            kind === 'text'
              ? `<span class="color-swatch" style="color:${found.textHex}">A</span>`
              : `<span class="color-swatch" style="background:${found.bgHex}"></span>`,
            () => {
              if (kind === 'text') lastSelectedTextColorKey = found.key;
              else lastSelectedBgColorKey = found.key;
              host?.applyColor?.(kind, found.key);
            }
          );
          addDivider();
        }
      }
      const grid = document.createElement('div');
      grid.className = 'tb-color-grid';
      palette.forEach(c => {
        const swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = 'tb-color-swatch';
        swatch.title = `${c.label} ${kind === 'text' ? 'text' : 'highlight'}`;
        swatch.innerHTML = kind === 'text'
          ? `<span class="color-swatch" style="color:${c.textHex};border-color:${c.key === 'default' ? '#e6e5e2' : c.textHex + '44'}">A</span><span>${esc(c.label)}</span>`
          : `<span class="color-swatch" style="background:${c.bgHex};border-color:${c.key === 'default' ? '#e6e5e2' : '#00000018'}"></span><span>${esc(c.label)}</span>`;
        swatch.onmousedown = e => e.preventDefault();
        swatch.onclick = () => {
          closeDropdown();
          if (kind === 'text') lastSelectedTextColorKey = c.key;
          else lastSelectedBgColorKey = c.key;
          host?.applyColor?.(kind, c.key);
          updateToolbarState();
        };
        grid.append(swatch);
      });
      dd.append(grid);
    } else if (toolId === 'font') {
      addHeader('Fonts');
      BUILTIN_FONTS.forEach(f => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tb-dd-item' + (ctxState.font === f.id ? ' is-active' : '');
        btn.innerHTML = `<span class="tb-dd-ico" style="font-family:${esc(f.family)}">Aa</span><span class="tb-dd-label" style="font-family:${esc(f.family)}">${esc(f.label)}</span>${ctxState.font === f.id ? '<span class="tb-dd-check">✓</span>' : ''}`;
        btn.onmousedown = e => e.preventDefault();
        btn.onclick = () => { closeDropdown(); host?.applyFontChoice?.(f.id); updateToolbarState(); };
        dd.append(btn);
      });
      const customFonts = getWorkspaceCustomFonts();
      if (customFonts.length) {
        addDivider();
        addHeader('Workspace custom fonts');
        customFonts.forEach(cf => {
          const key = `custom:${cf.id}`;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'tb-dd-item' + (ctxState.font === key ? ' is-active' : '');
          btn.innerHTML = `<span class="tb-dd-ico" style="font-family:'${esc(cf.family)}',sans-serif">Aa</span><span class="tb-dd-label" style="font-family:'${esc(cf.family)}',sans-serif">${esc(cf.name)}</span>${ctxState.font === key ? '<span class="tb-dd-check">✓</span>' : ''}`;
          btn.onmousedown = e => e.preventDefault();
          btn.onclick = () => { closeDropdown(); host?.applyFontChoice?.(key); updateToolbarState(); };
          dd.append(btn);
        });
      }
    } else if (toolId === 'font-size') {
      addHeader('Optional font size');
      [
        { id: 'sm', label: 'Small (12px)', ico: 'S' },
        { id: 'default', label: 'Default', ico: 'M' },
        { id: 'lg', label: 'Large (17px)', ico: 'L' },
        { id: 'xl', label: 'Extra large (21px)', ico: 'XL' }
      ].forEach(sz => {
        addItem(sz.label, sz.ico, () => host?.applyFontSize?.(sz.id));
      });
    } else if (toolId === 'format-tools') {
      addHeader('Formatting tools');
      addItem('Clear formatting', '⌫', () => host?.clearFormatting?.());
      addItem(host?.isFormatPainterArmed?.() ? 'Cancel format painter' : 'Format painter (copy style)', '🖌', () => host?.toggleFormatPainter?.(), { active: !!host?.isFormatPainterArmed?.() });
      addDivider();
      addItem('Inline code', '&lt;/&gt;', () => host?.applyInlineCode?.());
      addItem('Code block', '{ }', () => host?.setBlockType?.('code'));
      addItem('Divider line', '—', () => host?.insertDividerBlock?.());
      addItem('2 Columns', '▥', () => host?.insertColumnsBlock?.(2));
      addItem('Add comment', '💬', () => host?.commentSelectionOrBlock?.(), { kbd: 'Ctrl+⇧+M' });
    } else if (toolId === 'lists') {
      addHeader('Lists');
      addItem('Bulleted list', '•', () => host?.setBlockType?.('bullet'), { active: ctxState.blockType === 'bullet', kbd: '-' });
      addItem('Numbered list', '1.', () => host?.setBlockType?.('numbered'), { active: ctxState.blockType === 'numbered', kbd: '1.' });
      addItem('To-do checklist', '☑', () => host?.setBlockType?.('todo'), { active: ctxState.blockType === 'todo', kbd: '[]' });
      addItem('Toggle list', '▸', () => host?.setBlockType?.('toggle', { toggle: true }), { active: ctxState.blockType === 'toggle', kbd: '>>' });
      addDivider();
      addItem('Increase indent', '⇥', () => host?.indentList?.(1), { kbd: 'Tab' });
      addItem('Decrease indent', '⇤', () => host?.indentList?.(-1), { kbd: '⇧+Tab' });
    } else if (toolId === 'align') {
      addHeader('Block alignment');
      addItem('Align left', '⫷', () => host?.setBlockAlignment?.('left'), { active: !ctxState.align || ctxState.align === 'left' });
      addItem('Align center', '☰', () => host?.setBlockAlignment?.('center'), { active: ctxState.align === 'center' });
      addItem('Align right', '⫸', () => host?.setBlockAlignment?.('right'), { active: ctxState.align === 'right' });
      addItem('Justify', '▤', () => host?.setBlockAlignment?.('justify'), { active: ctxState.align === 'justify' });
    } else if (toolId === 'callouts') {
      addHeader('Quote & Callout');
      CALLOUT_VARIANTS.forEach((v, idx) => {
        if (idx === 1) addDivider();
        const isActive = v.kind === 'quote'
          ? ctxState.blockType === 'quote'
          : ctxState.blockType === 'callout';
        const pill = `<span class="tb-callout-pill" style="color:${v.accent};background:${v.bg}">${v.icon}</span>`;
        addItem(v.label, pill, () => host?.applyCalloutOrQuote?.(v), { active: isActive });
      });
    } else if (toolId === 'form-question') {
      addHeader('Insert Form Question');
      addItem('Text question', '¶', () => host?.insertFormQuestion?.('text'), { kbd: '/question', dataAttrs: { 'data-add-question-type': 'text' } });
      addDivider();
      addItem('Select', '▾', () => host?.insertFormQuestion?.('select'), { kbd: '/select', dataAttrs: { 'data-add-question-type': 'select' } });
      addDivider();
      addItem('Number', '#', () => host?.insertFormQuestion?.('number'), { kbd: '/number', dataAttrs: { 'data-add-question-type': 'number' } });
      addItem('Date', '📅', () => host?.insertFormQuestion?.('date'), { kbd: '/date', dataAttrs: { 'data-add-question-type': 'date' } });
      addItem('Email', '@', () => host?.insertFormQuestion?.('email'), { kbd: '/email', dataAttrs: { 'data-add-question-type': 'email' } });
      addItem('Phone (+country code)', '☎', () => host?.insertFormQuestion?.('phone'), { kbd: '/phone', dataAttrs: { 'data-add-question-type': 'phone' } });
      addItem('URL', '🔗', () => host?.insertFormQuestion?.('url'), { kbd: '/url', dataAttrs: { 'data-add-question-type': 'url' } });
      addItem('Upload file (max MB)', '📎', () => host?.insertFormQuestion?.('files'), { kbd: '/upload', dataAttrs: { 'data-add-question-type': 'files' } });
      addItem('Relation', '↗', () => host?.insertFormQuestion?.('relation'), { dataAttrs: { 'data-add-question-type': 'relation' } });
    } else if (toolId === 'form-button') {
      addHeader('Insert Form Button');
      addItem('Submit response', '✓', () => host?.insertFormButton?.('submit'), { kbd: '/submit button', dataAttrs: { 'data-add-form-button': 'submit' } });
      addItem('Download response', '↓', () => host?.insertFormButton?.('download'), { kbd: '/download button', dataAttrs: { 'data-add-form-button': 'download' } });
      addItem('Send response to my mail', '✉', () => host?.insertFormButton?.('send_email'), { kbd: '/mail button', dataAttrs: { 'data-add-form-button': 'send_email' } });
      addItem('Custom styled button', '✦', () => host?.insertFormButton?.('custom'), { kbd: '/form button', dataAttrs: { 'data-add-form-button': 'custom' } });
    }

    positionDropdown(trigger, dd, prefs.toolbar.position);
  }

  function runSingleToolAction(toolId: string, trigger: HTMLElement, event?: MouseEvent) {
    if (toolId === 'form-question' || toolId === 'form-button') {
      if (openDropdownToolId === toolId && dropdownEl && !dropdownEl.hidden) closeDropdown();
      else openDropdownForTool(toolId, trigger);
      return;
    }
    if (toolId === 'text-color' || toolId === 'highlight-color') {
      const targetEl = event?.target as HTMLElement | null;
      if (targetEl?.closest('.tb-caret')) {
        if (openDropdownToolId === toolId && dropdownEl && !dropdownEl.hidden) closeDropdown();
        else openDropdownForTool(toolId, trigger);
        return;
      }
      closeDropdown();
      if (toolId === 'text-color') {
        host?.applyColor?.('text', lastSelectedTextColorKey ?? 'default');
      } else {
        host?.applyColor?.('bg', lastSelectedBgColorKey ?? 'default');
      }
      updateToolbarState();
      return;
    }
    const def = TOOL_CATALOG.find(t => t.id === toolId);
    if (def?.hasDropdown) {
      if (openDropdownToolId === toolId && dropdownEl && !dropdownEl.hidden) {
        closeDropdown();
      } else {
        openDropdownForTool(toolId, trigger);
      }
      return;
    }
    switch (toolId) {
      case 'undo': host?.undo?.(); break;
      case 'redo': host?.redo?.(); break;
      case 'bold': host?.applyInlineFormat?.('bold'); break;
      case 'italic': host?.applyInlineFormat?.('italic'); break;
      case 'strikethrough': host?.applyInlineFormat?.('strikeThrough'); break;
      case 'underline': host?.applyInlineFormat?.('underline'); break;
      case 'clear-format': host?.clearFormatting?.(); break;
      case 'insert-table': host?.insertSimpleTable?.(); break;
      case 'link-attach': host?.insertLinkOnSelection?.(); break;
      case 'todo-toggle': host?.setBlockType?.('todo'); break;
      case 'fullscreen': toggleFullscreen(); break;
    }
    updateToolbarState();
  }

  function renderToolbar() {
    const prefs = getPrefs();
    const dock = document.getElementById('editor-toolbar-dock');
    const bar = document.getElementById('editor-toolbar');
    const canvas = document.getElementById('workspace-canvas');
    if (!bar || !dock || !canvas) return;
    canvas.dataset.toolbarPos = prefs.toolbar.position;
    const ro = !!host?.isReadOnlyMirror?.();
    const allowed = host?.isToolbarAllowed ? !!host.isToolbarAllowed() : true;
    const visible = prefs.toolbar.enabled && !ro && allowed;
    dock.hidden = !visible;
    bar.hidden = !visible;
    if (!visible) {
      closeDropdown();
      return;
    }

    const orientation = (prefs.toolbar.position === 'left' || prefs.toolbar.position === 'right') ? 'vertical' : 'horizontal';
    const isCollapsed = !!prefs.toolbar.collapsed;
    dock?.classList.toggle('has-collapsed-toolbar', isCollapsed);
    if (isCollapsed && dock) {
      const storedX = Number(dock.dataset.collapsedX);
      const storedY = Number(dock.dataset.collapsedY);
      dock.style.setProperty('--tb-collapsed-x', orientation === 'horizontal' && Number.isFinite(storedX) ? `${storedX}px` : '0px');
      dock.style.setProperty('--tb-collapsed-y', orientation === 'vertical' && Number.isFinite(storedY) ? `${storedY}px` : '0px');
    } else if (dock) {
      dock.style.removeProperty('--tb-collapsed-x');
      dock.style.removeProperty('--tb-collapsed-y');
    }
    const isForm = !!host?.isFormEditor?.();
    const activePackKey = (window as any).ArchitectIcons?.getActiveUiPackId?.() || 'builtin';
    const renderKey = `${orientation}:${isCollapsed ? 'min' : 'full'}:${isForm ? 'form' : 'doc'}:${activePackKey}:${prefs.toolbar.items.join(',')}`;
    bar.dataset.orientation = orientation;
    bar.classList.toggle('is-collapsed', isCollapsed);
    bar.classList.toggle('has-form-tools', isForm);
    if (lastToolbarRenderKey === renderKey && bar.childElementCount > 0) {
      if (!isCollapsed) updateToolbarState();
      return;
    }
    lastToolbarRenderKey = renderKey;
    bar.replaceChildren();

    const collapseBtn = document.createElement('button');
    collapseBtn.type = 'button';
    collapseBtn.className = 'tb-collapse-btn';
    collapseBtn.dataset.tbCollapse = 'true';
    collapseBtn.setAttribute('aria-expanded', String(!isCollapsed));
    collapseBtn.setAttribute('aria-label', isCollapsed ? 'Expand formatting toolbar' : 'Minimize formatting toolbar');
    collapseBtn.title = isCollapsed ? 'Expand formatting toolbar' : 'Minimize formatting toolbar';
    const chevronSvg = orientation === 'vertical'
      ? (isCollapsed
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>')
      : (isCollapsed
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>');
    collapseBtn.innerHTML = `<span class="tb-collapse-ico">${chevronSvg}</span>`;
    collapseBtn.onmousedown = e => e.preventDefault();
    collapseBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      const curPrefs = getPrefs();
      const willCollapse = !curPrefs.toolbar.collapsed;
      if (willCollapse && dock) {
        const dockRect = dock.getBoundingClientRect();
        const barRect = bar.getBoundingClientRect();
        const padLeft = parseFloat(getComputedStyle(dock).paddingLeft) || 0;
        const padTop = parseFloat(getComputedStyle(dock).paddingTop) || 0;
        dock.dataset.collapsedX = String(Math.max(0, Math.round(barRect.left - dockRect.left - padLeft)));
        dock.dataset.collapsedY = String(Math.max(0, Math.round(barRect.top - dockRect.top - padTop)));
      }
      curPrefs.toolbar.collapsed = willCollapse;
      closeDropdown();
      host?.save?.();
      renderToolbar();
    };
    bar.append(collapseBtn);

    if (isCollapsed) return;

    prefs.toolbar.items.forEach(itemId => {
      if (itemId === 'sep') {
        const sep = document.createElement('span');
        sep.className = 'tb-sep';
        sep.setAttribute('role', 'separator');
        bar.append(sep);
        return;
      }
      const def = TOOL_CATALOG.find(t => t.id === itemId);
      if (!def) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tb-btn' + (def.hasDropdown ? ' has-dropdown' : '');
      btn.dataset.tbTool = def.id;
      btn.title = def.title;
      btn.setAttribute('aria-label', def.label);
      if (def.hasDropdown) btn.setAttribute('aria-haspopup', 'menu');
      const rawIco = def.id === 'fullscreen' && isFullscreen ? ICONS.fullscreenExit : def.svg;
      const uiSlot = def.id === 'fullscreen' && isFullscreen ? 'toolbar-fullscreen-exit' : `toolbar-${def.id}`;
      const icoHtml = (window as any).ArchitectIcons?.resolveUiSlotMarkup?.(uiSlot, rawIco) ?? rawIco;
      btn.innerHTML = `<span class="tb-ico">${icoHtml}</span>${def.hasDropdown ? '<span class="tb-caret" aria-hidden="true">▾</span>' : ''}`;
      btn.onmousedown = e => e.preventDefault();
      btn.onclick = e => runSingleToolAction(def.id, btn, e);
      if (def.hasDropdown) {
        btn.onmouseenter = () => {
          clearTimeout(hoverCloseTimer);
          clearTimeout(hoverOpenTimer);
          const delay = openDropdownToolId ? 35 : 85;
          hoverOpenTimer = window.setTimeout(() => openDropdownForTool(def.id, btn), delay);
        };
        btn.onmouseleave = () => scheduleCloseDropdown();
      }
      bar.append(btn);
    });

    if (isForm) {
      const formSep = document.createElement('span');
      formSep.className = 'tb-sep tb-form-sep';
      formSep.setAttribute('role', 'separator');
      bar.append(formSep);

      [
        { id: 'form-question', label: '+ Question', title: 'Insert form question (/question, /select, /upload, /phone)', hasDropdown: true },
        { id: 'form-button', label: '+ Button', title: 'Insert customizable Submit, Download, Mail, or Custom button', hasDropdown: true }
      ].forEach(item => {
        const fb = document.createElement('button');
        fb.type = 'button';
        fb.className = 'tb-btn tb-form-ext-btn' + (item.hasDropdown ? ' has-dropdown' : '');
        fb.dataset.tbTool = item.id;
        fb.title = item.title;
        fb.setAttribute('aria-label', item.label);
        if (item.hasDropdown) fb.setAttribute('aria-haspopup', 'menu');
        const customExtIco = (window as any).ArchitectIcons?.resolveUiSlotMarkup?.(`toolbar-${item.id}`, '') || '';
        fb.innerHTML = `${customExtIco ? `<span class="tb-ico">${customExtIco}</span>` : ''}<span class="tb-form-ext-label">${esc(item.label)}</span>${item.hasDropdown ? '<span class="tb-caret" aria-hidden="true">▾</span>' : ''}`;
        fb.onmousedown = e => e.preventDefault();
        fb.onclick = e => runSingleToolAction(item.id, fb, e);
        if (item.hasDropdown) {
          fb.onmouseenter = () => {
            clearTimeout(hoverCloseTimer);
            clearTimeout(hoverOpenTimer);
            const delay = openDropdownToolId ? 35 : 85;
            hoverOpenTimer = window.setTimeout(() => openDropdownForTool(item.id, fb), delay);
          };
          fb.onmouseleave = () => scheduleCloseDropdown();
        }
        bar.append(fb);
      });
    }

    updateToolbarState();
  }

  function updateToolbarState() {
    const bar = document.getElementById('editor-toolbar');
    if (!bar || bar.hidden) return;
    const ctxState = host?.getFormattingContext?.() || {};
    const setActive = (toolId: string, active: boolean) => {
      const btn = bar.querySelector(`.tb-btn[data-tb-tool="${toolId}"]`);
      if (btn) {
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      }
    };
    setActive('bold', !!ctxState.bold);
    setActive('italic', !!ctxState.italic);
    setActive('strikethrough', !!ctxState.strikeThrough);
    setActive('underline', !!ctxState.underline);
    setActive('heading', ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(ctxState.blockType));
    setActive('lists', ['bullet', 'numbered', 'todo', 'toggle'].includes(ctxState.blockType));
    setActive('callouts', ctxState.blockType === 'callout' || ctxState.blockType === 'quote');
    setActive('todo-toggle', ctxState.blockType === 'todo');
    setActive('format-tools', !!host?.isFormatPainterArmed?.());
    setActive('fullscreen', isFullscreen);

    const palette: Array<{ key: string; label: string; textHex: string; bgHex: string }> = host?.getColors?.() || [];
    const textBtn = bar.querySelector('.tb-btn[data-tb-tool="text-color"]') as HTMLElement | null;
    const textInd = bar.querySelector('[data-tb-color-indicator="text"]') as HTMLElement | null;
    const pickedText = lastSelectedTextColorKey && lastSelectedTextColorKey !== 'default'
      ? palette.find(c => c.key === lastSelectedTextColorKey)
      : null;
    const textIconHex = pickedText ? pickedText.textHex : '#111111';
    if (textInd) textInd.style.background = textIconHex;
    if (textBtn) {
      textBtn.style.color = textIconHex;
      textBtn.dataset.tbColorKey = pickedText ? pickedText.key : 'default';
    }

    const bgBtn = bar.querySelector('.tb-btn[data-tb-tool="highlight-color"]') as HTMLElement | null;
    const bgInd = bar.querySelector('[data-tb-color-indicator="bg"]') as HTMLElement | null;
    const bgGlyph = bgBtn?.querySelector('.tb-glyph-color') as HTMLElement | null;
    const pickedBg = lastSelectedBgColorKey && lastSelectedBgColorKey !== 'default'
      ? palette.find(c => c.key === lastSelectedBgColorKey)
      : null;
    const bgIconHex = pickedBg ? pickedBg.textHex : '#111111';
    if (bgInd) bgInd.style.background = bgIconHex;
    if (bgBtn) {
      bgBtn.style.color = bgIconHex;
      bgBtn.dataset.tbColorKey = pickedBg ? pickedBg.key : 'default';
    }
    if (bgGlyph) bgGlyph.style.background = pickedBg ? pickedBg.bgHex : '';

    const fsBtn = bar.querySelector('.tb-btn[data-tb-tool="fullscreen"] .tb-ico');
    if (fsBtn) fsBtn.innerHTML = isFullscreen ? ICONS.fullscreenExit : ICONS.fullscreen;
  }

  let enteredNativeFullscreen = false;
  function toggleFullscreen(force?: boolean) {
    const next = typeof force === 'boolean' ? force : !isFullscreen;
    isFullscreen = next;
    document.body.classList.toggle('is-fullscreen', isFullscreen);
    if (isFullscreen) {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => { enteredNativeFullscreen = true; }).catch(() => { enteredNativeFullscreen = false; });
      }
    } else if (document.fullscreenElement && document.exitFullscreen) {
      enteredNativeFullscreen = false;
      document.exitFullscreen().catch(() => {});
    }
    const pill = document.getElementById('fullscreen-exit-pill');
    if (pill) pill.hidden = !isFullscreen;
    updateToolbarState();
  }

  function renderFontManagerList() {
    const sel = document.getElementById('user-default-font') as HTMLSelectElement | null;
    if (!sel) return;
    const prefs = getPrefs();
    const customFonts = getWorkspaceCustomFonts();
    sel.replaceChildren();
    BUILTIN_FONTS.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = f.label;
      sel.append(opt);
    });
    customFonts.forEach(cf => {
      const opt = document.createElement('option');
      opt.value = `custom:${cf.id}`;
      opt.textContent = `${cf.name} (Workspace)`;
      sel.append(opt);
    });
    sel.value = prefs.defaultFont || 'default';
  }

  function renderToolbarCustomizer() {
    const activeZone = document.getElementById('tb-customizer-active');
    const paletteZone = document.getElementById('tb-customizer-palette');
    if (!activeZone || !paletteZone) return;
    const prefs = getPrefs();

    const clearDropLines = () => {
      activeZone.querySelectorAll('.drop-before,.drop-after').forEach(el => el.classList.remove('drop-before', 'drop-after'));
    };

    const insertToolAt = (toolId: string, insertIndex: number, fromActiveIdx?: number) => {
      const curPrefs = getPrefs();
      const items = [...curPrefs.toolbar.items];
      let targetIdx = Math.max(0, Math.min(items.length, insertIndex));
      if (typeof fromActiveIdx === 'number' && fromActiveIdx >= 0 && fromActiveIdx < items.length) {
        const [moved] = items.splice(fromActiveIdx, 1);
        if (fromActiveIdx < targetIdx) targetIdx = Math.max(0, targetIdx - 1);
        items.splice(targetIdx, 0, moved);
      } else {
        if (toolId !== 'sep') {
          const existing = items.indexOf(toolId);
          if (existing >= 0) {
            items.splice(existing, 1);
            if (existing < targetIdx) targetIdx = Math.max(0, targetIdx - 1);
          }
        }
        items.splice(targetIdx, 0, toolId);
      }
      curPrefs.toolbar.items = items;
      host?.save?.(true);
      renderToolbarCustomizer();
      renderToolbar();
    };

    const removeActiveAt = (idx: number) => {
      const curPrefs = getPrefs();
      if (idx < 0 || idx >= curPrefs.toolbar.items.length) return;
      curPrefs.toolbar.items.splice(idx, 1);
      host?.save?.(true);
      renderToolbarCustomizer();
      renderToolbar();
    };

    activeZone.replaceChildren();
    prefs.toolbar.items.forEach((toolId, idx) => {
      const def = TOOL_CATALOG.find(t => t.id === toolId);
      if (!def) return;
      const chip = document.createElement('div');
      chip.className = 'tb-cust-chip' + (toolId === 'sep' ? ' is-sep' : '');
      chip.draggable = true;
      chip.dataset.custIdx = String(idx);
      chip.dataset.toolId = toolId;
      chip.title = `Drag to reorder or drag out to remove (${def.label})`;
      chip.innerHTML = `<span class="tb-cust-ico">${def.svg}</span><span class="tb-cust-name">${esc(toolId === 'sep' ? 'Separator' : def.label)}</span><button type="button" class="tb-cust-remove" aria-label="Remove ${esc(def.label)}">×</button>`;

      chip.querySelector('.tb-cust-remove')!.addEventListener('click', e => {
        e.stopPropagation();
        removeActiveAt(idx);
      });

      chip.addEventListener('dragstart', e => {
        dragState = { source: 'active', index: idx, toolId };
        chip.classList.add('is-dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', JSON.stringify(dragState));
        }
      });
      chip.addEventListener('dragend', () => {
        chip.classList.remove('is-dragging');
        clearDropLines();
        dragState = null;
      });
      chip.addEventListener('dragover', e => {
        e.preventDefault();
        e.stopPropagation();
        clearDropLines();
        const rect = chip.getBoundingClientRect();
        const after = e.clientX > rect.left + rect.width / 2;
        chip.classList.add(after ? 'drop-after' : 'drop-before');
      });
      chip.addEventListener('drop', e => {
        e.preventDefault();
        e.stopPropagation();
        clearDropLines();
        let payload = dragState;
        if (!payload && e.dataTransfer) {
          try { payload = JSON.parse(e.dataTransfer.getData('text/plain') || 'null'); } catch {}
        }
        if (!payload?.toolId) return;
        const rect = chip.getBoundingClientRect();
        const after = e.clientX > rect.left + rect.width / 2;
        insertToolAt(payload.toolId, idx + (after ? 1 : 0), payload.source === 'active' ? payload.index : undefined);
        dragState = null;
      });
      activeZone.append(chip);
    });

    activeZone.ondragover = e => { e.preventDefault(); activeZone.classList.add('is-dragover'); };
    activeZone.ondragleave = e => { if (!activeZone.contains(e.relatedTarget as Node)) { activeZone.classList.remove('is-dragover'); clearDropLines(); } };
    activeZone.ondrop = e => {
      e.preventDefault();
      activeZone.classList.remove('is-dragover');
      clearDropLines();
      let payload = dragState;
      if (!payload && e.dataTransfer) {
        try { payload = JSON.parse(e.dataTransfer.getData('text/plain') || 'null'); } catch {}
      }
      if (!payload?.toolId) return;
      insertToolAt(payload.toolId, prefs.toolbar.items.length, payload.source === 'active' ? payload.index : undefined);
      dragState = null;
    };

    paletteZone.replaceChildren();
    const activeSet = new Set(prefs.toolbar.items);
    const available = TOOL_CATALOG.filter(t => t.repeatable || !activeSet.has(t.id));
    available.forEach(def => {
      const chip = document.createElement('div');
      chip.className = 'tb-cust-chip is-palette' + (def.id === 'sep' ? ' is-sep' : '');
      chip.draggable = true;
      chip.dataset.toolId = def.id;
      chip.title = `Drag into Active Toolbar above or click ＋ to add ${def.label}`;
      chip.innerHTML = `<span class="tb-cust-ico">${def.svg}</span><span class="tb-cust-name">${esc(def.label)}</span><button type="button" class="tb-cust-add" aria-label="Add ${esc(def.label)}">＋</button>`;
      chip.querySelector('.tb-cust-add')!.addEventListener('click', () => {
        insertToolAt(def.id, prefs.toolbar.items.length);
      });
      chip.addEventListener('dragstart', e => {
        dragState = { source: 'palette', toolId: def.id };
        chip.classList.add('is-dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'copyMove';
          e.dataTransfer.setData('text/plain', JSON.stringify(dragState));
        }
      });
      chip.addEventListener('dragend', () => {
        chip.classList.remove('is-dragging');
        dragState = null;
      });
      paletteZone.append(chip);
    });

    paletteZone.ondragover = e => { e.preventDefault(); paletteZone.classList.add('is-dragover'); };
    paletteZone.ondragleave = e => { if (!paletteZone.contains(e.relatedTarget as Node)) paletteZone.classList.remove('is-dragover'); };
    paletteZone.ondrop = e => {
      e.preventDefault();
      paletteZone.classList.remove('is-dragover');
      let payload = dragState;
      if (!payload && e.dataTransfer) {
        try { payload = JSON.parse(e.dataTransfer.getData('text/plain') || 'null'); } catch {}
      }
      if (payload?.source === 'active' && typeof payload.index === 'number') {
        removeActiveAt(payload.index);
      }
      dragState = null;
    };
  }

  function setUserSettingsTab(tab: 'general' | 'appearance' | 'toolbar' | 'hotkeys') {
    activeSettingsTab = tab;
    recordingHotkeyId = null;
    document.querySelectorAll('#user-settings-dialog [data-settings-tab]').forEach(btn => {
      const el = btn as HTMLElement;
      el.classList.toggle('is-active', el.dataset.settingsTab === tab);
    });
    document.querySelectorAll('#user-settings-dialog [data-settings-panel]').forEach(sec => {
      const el = sec as HTMLElement;
      el.hidden = el.dataset.settingsPanel !== tab;
    });
    if (tab === 'hotkeys') renderHotkeysList();
  }

  function renderHotkeysList() {
    const list = document.getElementById('hotkeys-list');
    if (!list) return;
    const q = ((document.getElementById('hotkeys-filter-input') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
    const hotkeys = getPrefs().hotkeys || {};
    list.replaceChildren();

    document.querySelectorAll('#user-settings-dialog [data-hotkey-filter]').forEach(btn => {
      const el = btn as HTMLElement;
      el.classList.toggle('active', el.dataset.hotkeyFilter === hotkeyFilterMode);
    });

    const filtered = HOTKEY_CATALOG.filter(cmd => {
      const bound = (hotkeys[cmd.id] || '').trim();
      if (hotkeyFilterMode === 'assigned' && !bound) return false;
      if (hotkeyFilterMode === 'unassigned' && bound) return false;
      if (q && !`${cmd.label} ${cmd.category} ${bound}`.toLowerCase().includes(q)) return false;
      return true;
    });

    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'mode-empty-state';
      empty.textContent = 'No hotkeys match this filter.';
      list.append(empty);
      return;
    }

    filtered.forEach(cmd => {
      const bound = (hotkeys[cmd.id] || '').trim();
      const row = document.createElement('div');
      row.className = 'hotkey-row' + (recordingHotkeyId === cmd.id ? ' is-recording' : '');
      row.dataset.hotkeyCmd = cmd.id;
      row.setAttribute('role', 'listitem');

      const label = document.createElement('div');
      label.className = 'hotkey-label';
      label.innerHTML = `<strong>${esc(cmd.label)}</strong><small>${esc(cmd.category)}</small>`;

      const controls = document.createElement('div');
      controls.className = 'hotkey-controls';

      const pill = document.createElement('span');
      pill.className = 'hotkey-pill' + (bound ? '' : ' is-blank') + (recordingHotkeyId === cmd.id ? ' is-listening' : '');
      if (recordingHotkeyId === cmd.id) {
        pill.textContent = 'Press shortcut…';
      } else if (bound) {
        const txt = document.createElement('span');
        txt.textContent = bound;
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'hotkey-clear-btn';
        clearBtn.setAttribute('aria-label', `Clear shortcut for ${cmd.label}`);
        clearBtn.title = 'Clear shortcut';
        clearBtn.textContent = '×';
        clearBtn.onclick = ev => {
          ev.stopPropagation();
          hotkeys[cmd.id] = '';
          recordingHotkeyId = null;
          host?.save?.(true);
          renderHotkeysList();
        };
        pill.append(txt, clearBtn);
      } else {
        pill.textContent = 'Blank';
      }
      pill.onclick = () => {
        recordingHotkeyId = recordingHotkeyId === cmd.id ? null : cmd.id;
        renderHotkeysList();
      };

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'hotkey-assign-btn';
      addBtn.setAttribute('aria-label', `Customize shortcut for ${cmd.label}`);
      addBtn.title = 'Customize this command';
      addBtn.textContent = '⊕';
      addBtn.onclick = () => {
        recordingHotkeyId = recordingHotkeyId === cmd.id ? null : cmd.id;
        renderHotkeysList();
      };

      controls.append(pill, addBtn);
      row.append(label, controls);
      list.append(row);
    });
  }

  function getSystemTimeZone(): string {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch { return 'UTC'; }
  }
  const TIMEZONE_PRESETS = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Paris',
    'Europe/Warsaw',
    'Europe/Athens',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Australia/Sydney',
    'Pacific/Auckland'
  ];
  function syncTimeZoneSelect(selected: string) {
    const tzSel = document.getElementById('user-local-timezone') as HTMLSelectElement | null;
    if (!tzSel) return;
    const sys = getSystemTimeZone();
    const list = [...new Set([sys, ...TIMEZONE_PRESETS, ...(selected && selected !== 'auto' ? [selected] : [])])];
    tzSel.innerHTML = `<option value="auto">Automatic (${esc(sys)})</option>`
      + list.map(z => `<option value="${esc(z)}">${esc(z.replace(/_/g, ' '))}</option>`).join('');
    tzSel.value = selected || 'auto';
  }

  function syncUserSettingsUi() {
    const state = host?.getState?.();
    const prefs = getPrefs();
    applyAppearanceStyles();
    const nameInput = document.getElementById('user-display-name-input') as HTMLInputElement | null;
    if (nameInput) nameInput.value = host?.getCurrentUser?.() || state?.users?.[0]?.name || 'Raphael';
    syncTimeZoneSelect(prefs.timeZone || 'auto');
    const themeSel = document.getElementById('user-appearance-theme') as HTMLSelectElement | null;
    if (themeSel) themeSel.value = prefs.appearance?.theme || 'obsidian';
    const scaleSel = document.getElementById('user-appearance-scale') as HTMLSelectElement | null;
    if (scaleSel) scaleSel.value = prefs.appearance?.textScale || 'default';
    const fwCb = document.getElementById('user-appearance-fullwidth') as HTMLInputElement | null;
    if (fwCb) fwCb.checked = !!prefs.appearance?.defaultFullWidth;
    const enabledCb = document.getElementById('user-toolbar-enabled') as HTMLInputElement | null;
    if (enabledCb) enabledCb.checked = prefs.toolbar.enabled;
    const posSel = document.getElementById('user-toolbar-position') as HTMLSelectElement | null;
    if (posSel) posSel.value = prefs.toolbar.position;
    document.querySelectorAll('[data-tb-pos-btn]').forEach(btn => {
      const el = btn as HTMLElement;
      el.classList.toggle('is-active', el.dataset.tbPosBtn === prefs.toolbar.position);
      el.setAttribute('aria-pressed', String(el.dataset.tbPosBtn === prefs.toolbar.position));
    });
    renderFontManagerList();
    renderToolbarCustomizer();
    renderHotkeysList();
    setUserSettingsTab(activeSettingsTab);
  }

  function openUserSettings(tab?: 'general' | 'appearance' | 'toolbar' | 'hotkeys') {
    const dlg = document.getElementById('user-settings-dialog') as HTMLDialogElement | null;
    if (!dlg) return;
    if (tab) activeSettingsTab = tab;
    const searchEl = document.getElementById('user-settings-search') as HTMLInputElement | null;
    if (searchEl) searchEl.value = '';
    document.querySelectorAll('#user-settings-dialog [data-settings-tab], #user-settings-dialog .obs-setting-item').forEach(el => {
      (el as HTMLElement).hidden = false;
    });
    syncUserSettingsUi();
    if (!dlg.open) dlg.showModal();
    if (activeSettingsTab === 'general') document.getElementById('user-display-name-input')?.focus({ preventScroll: true });
  }

  function bindUiEvents() {
    document.getElementById('user-toolbar-enabled')?.addEventListener('change', e => {
      const prefs = getPrefs();
      prefs.toolbar.enabled = (e.target as HTMLInputElement).checked;
      host?.save?.(true);
      renderToolbar();
    });
    document.getElementById('user-toolbar-position')?.addEventListener('change', e => {
      const prefs = getPrefs();
      const v = (e.target as HTMLSelectElement).value as ToolbarPosition;
      if (['top', 'bottom', 'left', 'right'].includes(v)) prefs.toolbar.position = v;
      host?.save?.(true);
      syncUserSettingsUi();
      renderToolbar();
    });
    document.querySelectorAll('[data-tb-pos-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const v = (btn as HTMLElement).dataset.tbPosBtn as ToolbarPosition;
        const prefs = getPrefs();
        if (['top', 'bottom', 'left', 'right'].includes(v)) prefs.toolbar.position = v;
        host?.save?.(true);
        syncUserSettingsUi();
        renderToolbar();
      });
    });
    document.getElementById('user-toolbar-add-sep')?.addEventListener('click', () => {
      const prefs = getPrefs();
      prefs.toolbar.items.push('sep');
      host?.save?.(true);
      renderToolbarCustomizer();
      renderToolbar();
    });
    document.getElementById('user-toolbar-reset')?.addEventListener('click', () => {
      const prefs = getPrefs();
      prefs.toolbar.items = [...DEFAULT_TOOLBAR_ITEMS];
      prefs.toolbar.position = 'top';
      prefs.toolbar.enabled = true;
      prefs.toolbar.collapsed = false;
      host?.save?.(true);
      syncUserSettingsUi();
      renderToolbar();
      host?.toast?.('Toolbar reset to default');
    });
    document.getElementById('user-display-name-input')?.addEventListener('change', e => {
      const val = (e.target as HTMLInputElement).value.trim();
      if (!val) return;
      host?.updateUserName?.(val);
    });
    document.getElementById('user-local-timezone')?.addEventListener('change', e => {
      const prefs = getPrefs();
      prefs.timeZone = (e.target as HTMLSelectElement).value || 'auto';
      host?.save?.(true);
      host?.render?.();
      host?.toast?.(`Local time zone set to ${prefs.timeZone === 'auto' ? `Automatic (${getSystemTimeZone()})` : prefs.timeZone}`);
    });
    document.getElementById('user-default-font')?.addEventListener('change', e => {
      const prefs = getPrefs();
      prefs.defaultFont = (e.target as HTMLSelectElement).value || 'default';
      syncCustomFontStyles();
      host?.save?.(true);
    });
    document.querySelectorAll('#user-settings-dialog [data-settings-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = (btn as HTMLElement).dataset.settingsTab as any;
        if (tab) setUserSettingsTab(tab);
      });
    });
    document.getElementById('user-settings-search')?.addEventListener('input', e => {
      const q = ((e.target as HTMLInputElement).value || '').trim().toLowerCase();
      if (!q) {
        document.querySelectorAll('#user-settings-dialog [data-settings-tab], #user-settings-dialog .obs-setting-item').forEach(el => {
          (el as HTMLElement).hidden = false;
        });
        setUserSettingsTab(activeSettingsTab);
        return;
      }
      let firstMatchedTab: any = null;
      document.querySelectorAll('#user-settings-dialog [data-settings-panel]').forEach(sec => {
        const panelEl = sec as HTMLElement;
        const tabKey = panelEl.dataset.settingsPanel!;
        const items = Array.from(panelEl.querySelectorAll('.obs-setting-item')) as HTMLElement[];
        let panelHasHit = tabKey.includes(q) || (panelEl.textContent || '').toLowerCase().includes(q);
        items.forEach(it => {
          const hay = `${it.dataset.settingKeywords || ''} ${it.textContent || ''}`.toLowerCase();
          const hit = hay.includes(q);
          it.hidden = items.length ? !hit : false;
          if (hit) panelHasHit = true;
        });
        const navBtn = document.querySelector(`#user-settings-dialog [data-settings-tab="${tabKey}"]`) as HTMLElement | null;
        if (navBtn) navBtn.hidden = !panelHasHit;
        if (panelHasHit && !firstMatchedTab) firstMatchedTab = tabKey;
      });
      if (firstMatchedTab) setUserSettingsTab(firstMatchedTab);
    });
    document.getElementById('user-appearance-theme')?.addEventListener('change', e => {
      const prefs = getPrefs();
      prefs.appearance = prefs.appearance || { theme: 'obsidian', textScale: 'default', defaultFullWidth: false };
      prefs.appearance.theme = (e.target as HTMLSelectElement).value === 'warm' ? 'warm' : 'obsidian';
      applyAppearanceStyles();
      host?.save?.(true);
    });
    document.getElementById('user-appearance-scale')?.addEventListener('change', e => {
      const prefs = getPrefs();
      prefs.appearance = prefs.appearance || { theme: 'obsidian', textScale: 'default', defaultFullWidth: false };
      prefs.appearance.textScale = ((e.target as HTMLSelectElement).value as any) || 'default';
      applyAppearanceStyles();
      host?.save?.(true);
    });
    document.getElementById('user-appearance-fullwidth')?.addEventListener('change', e => {
      const prefs = getPrefs();
      prefs.appearance = prefs.appearance || { theme: 'obsidian', textScale: 'default', defaultFullWidth: false };
      prefs.appearance.defaultFullWidth = (e.target as HTMLInputElement).checked;
      host?.save?.(true);
    });
    document.getElementById('hotkeys-filter-input')?.addEventListener('input', renderHotkeysList);
    document.querySelectorAll('#user-settings-dialog [data-hotkey-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        hotkeyFilterMode = ((btn as HTMLElement).dataset.hotkeyFilter as any) || 'all';
        renderHotkeysList();
      });
    });
    document.getElementById('hotkeys-reset-btn')?.addEventListener('click', () => {
      const prefs = getPrefs();
      const defaults: Record<string, string> = {};
      HOTKEY_CATALOG.forEach(c => { defaults[c.id] = c.defaultBinding; });
      prefs.hotkeys = defaults;
      recordingHotkeyId = null;
      host?.save?.(true);
      renderHotkeysList();
      host?.toast?.('Hotkeys reset to defaults');
    });
    document.addEventListener('keydown', e => {
      if (!recordingHotkeyId) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') {
        recordingHotkeyId = null;
        renderHotkeysList();
        return;
      }
      const combo = formatHotkeyEvent(e);
      if (!combo) return;
      const hotkeys = getPrefs().hotkeys || {};
      hotkeys[recordingHotkeyId] = combo;
      recordingHotkeyId = null;
      host?.save?.(true);
      renderHotkeysList();
    }, true);
    document.getElementById('fullscreen-exit-pill')?.addEventListener('click', () => toggleFullscreen(false));
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && isFullscreen && enteredNativeFullscreen) {
        enteredNativeFullscreen = false;
        toggleFullscreen(false);
      }
    });
    document.addEventListener('pointerdown', e => {
      const target = e.target as Element | null;
      if (openDropdownToolId && !target?.closest('#tb-hover-dropdown, .tb-btn')) closeDropdown();
    }, true);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (openDropdownToolId) { closeDropdown(); e.stopPropagation(); }
        else if (isFullscreen && !document.querySelector('dialog[open]')) { toggleFullscreen(false); }
      }
    });
  }

  function initHost(callbacks: any) {
    host = callbacks;
    applyAppearanceStyles();
    syncCustomFontStyles();
    bindUiEvents();
    renderToolbar();
  }

  return {
    DEFAULT_TOOLBAR_ITEMS,
    BUILTIN_FONTS,
    CALLOUT_VARIANTS,
    TOOL_CATALOG,
    HOTKEY_CATALOG,
    ensureUserPreferences,
    initHost,
    renderToolbar,
    updateToolbarState,
    openUserSettings,
    setUserSettingsTab,
    matchHotkeyAction,
    isRecordingHotkey: () => !!recordingHotkeyId,
    applyAppearanceStyles,
    syncCustomFontStyles,
    getWorkspaceCustomFonts,
    addCustomFont: handleCustomFontUpload,
    removeCustomFont,
    fontCssFamily,
    toggleFullscreen,
    closeDropdown,
    isFullscreen: () => isFullscreen
  };
})();
