type IconColorDef = {
  key: string;
  label: string;
  hex: string;
  swatchHex: string;
};

type VectorIconDef = {
  id: string;
  label: string;
  keywords: string;
  body: string;
};

type UiIconSlotDef = {
  id: string;
  group: string;
  label: string;
  aliases?: string[];
};

type UiIconEntry = {
  markup?: string;
  dataUrl?: string;
  filename: string;
};

type UiIconPackData = {
  id: string;
  name: string;
  createdAt: number;
  icons: Record<string, UiIconEntry>;
};

(() => {
  const ICON_COLORS: IconColorDef[] = [
    { key: 'default', label: 'Charcoal', hex: '#474540', swatchHex: '#d5d3ce' },
    { key: 'lightgray', label: 'Light Gray', hex: '#9b9a97', swatchHex: '#e7e6e4' },
    { key: 'brown', label: 'Brown', hex: '#8b5e3c', swatchHex: '#e4d5cb' },
    { key: 'yellow', label: 'Yellow', hex: '#cb912f', swatchHex: '#f4e3bd' },
    { key: 'orange', label: 'Orange', hex: '#d9730d', swatchHex: '#f6d9be' },
    { key: 'green', label: 'Green', hex: '#2e7d5b', swatchHex: '#cbe3d4' },
    { key: 'blue', label: 'Blue', hex: '#2383e2', swatchHex: '#c8dff4' },
    { key: 'purple', label: 'Purple', hex: '#7c4dff', swatchHex: '#dfd3f8' },
    { key: 'pink', label: 'Pink', hex: '#c94089', swatchHex: '#f4d3e3' },
    { key: 'red', label: 'Red', hex: '#d44c47', swatchHex: '#f5cfcd' }
  ];

  // Crisp 24x24 outline SVG icon catalog (Notion/Lucide-inspired, tinted via currentColor)
  const VECTOR_ICONS: VectorIconDef[] = [
    { id: 'doc', label: 'Document', keywords: 'page file note text paper', body: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>' },
    { id: 'home', label: 'Home', keywords: 'house start hub dashboard', body: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>' },
    { id: 'star', label: 'Star', keywords: 'favorite highlight bookmark top', body: '<polygon points="12 2.8 14.9 8.7 21.4 9.6 16.7 14.1 17.8 20.6 12 17.5 6.2 20.6 7.3 14.1 2.6 9.6 9.1 8.7"/>' },
    { id: 'bookmark', label: 'Bookmark', keywords: 'save read later pin', body: '<path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17l-6-4-6 4z"/>' },
    { id: 'sparkles', label: 'Sparkles', keywords: 'magic ai idea new shine', body: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>' },
    { id: 'lightbulb', label: 'Lightbulb', keywords: 'idea tip callout brain', body: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M15.5 14c.9-.9 1.5-2.1 1.5-3.5a5 5 0 1 0-10 0c0 1.4.6 2.6 1.5 3.5.4.4.5 1 .5 1.5V16h6v-.5c0-.5.1-1.1.5-1.5z"/>' },
    { id: 'rocket', label: 'Rocket', keywords: 'launch ship fast milestone', body: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>' },
    { id: 'target', label: 'Target', keywords: 'goal okr bullseye focus', body: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>' },
    { id: 'flag', label: 'Flag', keywords: 'milestone report priority', body: '<path d="M5 3v18"/><path d="M5 4h11l-2 4 2 4H5"/>' },
    { id: 'pin', label: 'Pin', keywords: 'sticky board location map', body: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1V4H8v2a1 1 0 0 1 1 1z"/>' },
    { id: 'calendar', label: 'Calendar', keywords: 'schedule date timeline sprint', body: '<rect x="3" y="4" width="18" height="17" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
    { id: 'clock', label: 'Clock', keywords: 'time hours watch recent', body: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>' },
    { id: 'bell', label: 'Bell', keywords: 'inbox notification update alert', body: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>' },
    { id: 'inbox', label: 'Inbox', keywords: 'mail tray notifications updates', body: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>' },
    { id: 'folder', label: 'Folder', keywords: 'directory collection group hub', body: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' },
    { id: 'tag', label: 'Tag', keywords: 'label category topic', body: '<path d="M12 2H2v10l9.29 9.29a2 2 0 0 0 2.83 0l6.58-6.58a2 2 0 0 0 0-2.83z"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/>' },
    { id: 'link', label: 'Link', keywords: 'chain url reference external', body: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' },
    { id: 'paperclip', label: 'Paperclip', keywords: 'attachment file upload asset', body: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>' },
    { id: 'hash', label: 'Hash', keywords: 'number channel tag count', body: '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>' },
    { id: 'list', label: 'List', keywords: 'tasks checklist outline', body: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>' },
    { id: 'check-circle', label: 'Check Circle', keywords: 'done complete success task', body: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>' },
    { id: 'alert', label: 'Alert', keywords: 'warning triangle caution notice', body: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1" fill="currentColor"/>' },
    { id: 'info', label: 'Info', keywords: 'about note details help', body: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="1" fill="currentColor"/>' },
    { id: 'help', label: 'Question', keywords: 'faq guide docs support', body: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.8-2.5 2.2-2.5 4"/><circle cx="12" cy="17" r="1" fill="currentColor"/>' },
    { id: 'code', label: 'Code', keywords: 'dev engineering script html', body: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/>' },
    { id: 'terminal', label: 'Terminal', keywords: 'cli shell command console', body: '<rect x="3" y="4" width="18" height="16" rx="2"/><polyline points="7 10 10 13 7 16"/><line x1="12" y1="16" x2="17" y2="16"/>' },
    { id: 'database', label: 'Database', keywords: 'table storage sql data collection', body: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v13c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5v-13"/><path d="M4.5 12c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5"/>' },
    { id: 'board', label: 'Board Canvas', keywords: 'miro canvas whiteboard sticky map', body: '<rect x="3" y="3" width="18" height="14" rx="2"/><rect x="6" y="6" width="5" height="4" rx="1"/><rect x="13" y="9" width="5" height="5" rx="1"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/>' },
    { id: 'layout', label: 'Dashboard Layout', keywords: 'grid view panels bento', body: '<rect x="3" y="3" width="8" height="9" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/>' },
    { id: 'layers', label: 'Layers', keywords: 'stack design architecture zindex', body: '<polygon points="12 3 2 8 12 13 22 8"/><polyline points="2 13 12 18 22 13"/><polyline points="2 17.5 12 22 22 17.5"/>' },
    { id: 'cpu', label: 'Chip', keywords: 'system engine core tech ai', body: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>' },
    { id: 'globe', label: 'Globe', keywords: 'web world public internet', body: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="3.8" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/>' },
    { id: 'compass', label: 'Compass', keywords: 'explore navigate north direction', body: '<circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5"/>' },
    { id: 'map', label: 'Map', keywords: 'world blueprint roadmap journey', body: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>' },
    { id: 'search', label: 'Search', keywords: 'find lens filter inspect', body: '<circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.1" y2="16.1"/>' },
    { id: 'settings', label: 'Gear', keywords: 'config options preferences tools', body: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
    { id: 'wrench', label: 'Wrench', keywords: 'fix build repair engineering', body: '<path d="M14.7 6.3a4.5 4.5 0 0 0-6.2 5.4L3 17.2V21h3.8l5.5-5.5a4.5 4.5 0 0 0 5.4-6.2l-3 3-2.2-.8-.8-2.2z"/>' },
    { id: 'lock', label: 'Lock', keywords: 'private security auth password', body: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>' },
    { id: 'key', label: 'Key', keywords: 'access credential token secret', body: '<circle cx="8" cy="14" r="4"/><path d="m11 11 9-9M17 5l3 3"/>' },
    { id: 'shield', label: 'Shield', keywords: 'guard admin security policy', body: '<path d="M12 2.5 4.5 6v6c0 4.8 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.7 7.5-9.5V6z"/>' },
    { id: 'users', label: 'Team', keywords: 'people collaborators group', body: '<circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a4.5 4.5 0 0 1 5 5"/>' },
    { id: 'user', label: 'Person', keywords: 'profile owner avatar account', body: '<circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/>' },
    { id: 'message', label: 'Message', keywords: 'comment chat feedback discussion', body: '<path d="M21 12a8.5 8.5 0 0 1-12.5 7.5L3 21l1.5-5.5A8.5 8.5 0 1 1 21 12z"/>' },
    { id: 'image', label: 'Image', keywords: 'photo picture art visual', body: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><polyline points="21 16 15.5 10.5 6 20"/>' },
    { id: 'video', label: 'Video', keywords: 'movie film clip play', body: '<rect x="3" y="6" width="13" height="12" rx="2"/><polygon points="16 10 21 7 21 17 16 14"/>' },
    { id: 'music', label: 'Audio', keywords: 'music sound soundtrack voice sfx', body: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
    { id: 'mic', label: 'Microphone', keywords: 'voice recording podcast talk', body: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="21"/>' },
    { id: 'headphones', label: 'Headphones', keywords: 'listen audio studio music', body: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>' },
    { id: 'camera', label: 'Camera', keywords: 'snapshot capture shot', body: '<path d="M4 8h3l2-3h6l2 3h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/><circle cx="12" cy="13.5" r="3.5"/>' },
    { id: 'palette', label: 'Palette', keywords: 'color art theme studio design', body: '<path d="M12 3a9 9 0 1 0 0 18 1.8 1.8 0 0 0 1.8-1.8c0-.5-.2-.9-.5-1.2a1.6 1.6 0 0 1 1.2-2.7H16a5 5 0 0 0 5-5c0-4.4-4-8.3-9-8.3z"/><circle cx="8" cy="10" r="1" fill="currentColor"/><circle cx="11" cy="7.5" r="1" fill="currentColor"/><circle cx="15" cy="8.5" r="1" fill="currentColor"/>' },
    { id: 'pen', label: 'Pen', keywords: 'draw edit sketch write note', body: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>' },
    { id: 'book', label: 'Book', keywords: 'wiki manual documentation read', body: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3z"/>' },
    { id: 'briefcase', label: 'Briefcase', keywords: 'work project company business', body: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' },
    { id: 'coffee', label: 'Coffee', keywords: 'break cafe ideas chill', body: '<path d="M17 8h1a3.5 3.5 0 0 1 0 7h-1"/><path d="M4 8h13v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><line x1="7" y1="3" x2="7" y2="5"/><line x1="12" y1="3" x2="12" y2="5"/>' },
    { id: 'zap', label: 'Lightning', keywords: 'fast action trigger automation sprint', body: '<polygon points="13 2 4 14 11 14 10 22 20 10 13 10"/>' },
    { id: 'flame', label: 'Flame', keywords: 'hot streak fire trend', body: '<path d="M12 2.5c2 3.5 6 5.5 6 10a6 6 0 1 1-12 0c0-2.5 1.3-4.6 3-6.2.2 1.8 1.5 2.7 1.5 2.7C11 6.5 11.4 4.5 12 2.5z"/>' },
    { id: 'heart', label: 'Heart', keywords: 'love health favorite wellness', body: '<path d="M12 20.5S4 15 4 9.5A4.5 4.5 0 0 1 12 6.8a4.5 4.5 0 0 1 8 2.7c0 5.5-8 11-8 11z"/>' },
    { id: 'sun', label: 'Sun', keywords: 'day light morning focus bright', body: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>' },
    { id: 'moon', label: 'Moon', keywords: 'night dark rest mode', body: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>' },
    { id: 'cloud', label: 'Cloud', keywords: 'sync weather drive storage', body: '<path d="M17.5 19H7a5 5 0 0 1-.8-9.93 6.5 6.5 0 0 1 12.6 1.93A4 4 0 0 1 17.5 19z"/>' },
    { id: 'trophy', label: 'Trophy', keywords: 'award win milestone goal', body: '<path d="M6 4h12v4a6 6 0 0 1-12 0z"/><path d="M6 6H3v2a3 3 0 0 0 3 3"/><path d="M18 6h3v2a3 3 0 0 1-3 3"/><line x1="12" y1="14" x2="12" y2="19"/><line x1="8" y1="19" x2="16" y2="19"/>' },
    { id: 'chart', label: 'Bar Chart', keywords: 'analytics metrics stats kpi', body: '<line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="8"/><line x1="18" y1="20" x2="18" y2="4"/>' },
    { id: 'trending', label: 'Trending', keywords: 'growth analytics upward chart', body: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>' },
    { id: 'box', label: 'Cube', keywords: 'package asset 3d module box', body: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="12" y1="22" x2="12" y2="12"/>' },
    { id: 'trash', label: 'Trash', keywords: 'delete bin archive clean', body: '<polyline points="3 6 5 6 21 6"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>' }
  ];

  // Crisp Obsidian-style SVG icon strings for the left Feature Switcher Rail
  const RAIL_ICONS = {
    sidebarToggle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><line x1="9" y1="4" x2="9" y2="20"/></svg>',
    notion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="9" rx="1.6"/><rect x="13" y="3" width="8" height="5" rx="1.6"/><rect x="13" y="10" width="8" height="11" rx="1.6"/><rect x="3" y="14" width="8" height="7" rx="1.6"/></svg>',
    boards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3.5" width="18" height="13.5" rx="2.2"/><rect x="6" y="6.5" width="5" height="4" rx="1"/><rect x="13" y="9" width="5" height="5" rx="1"/><line x1="11" y1="8.5" x2="13" y2="11.5"/><line x1="12" y1="17" x2="12" y2="20.5"/><line x1="8" y1="20.5" x2="16" y2="20.5"/></svg>',
    inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.1" y2="16.1"/></svg>',
    assets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
    sync: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    userSettings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    userDash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.8"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>',
    teamOverview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a4.5 4.5 0 0 1 5 5"/></svg>',
    adminDash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"/><circle cx="12" cy="11" r="2.2"/></svg>',
    calendarTime: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="12 13 12 16 14.5 17.5"/></svg>',
    timeTracking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    taskboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/></svg>',
    tasks: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><polyline points="8 12 11 15 16.5 9"/></svg>',
    scratchpad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5z"/><polyline points="14.5 3 14.5 8.5 20 8.5"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
    newPage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    newBoard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="12" y1="8.5" x2="12" y2="15.5"/><line x1="8.5" y1="12" x2="15.5" y2="12"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    graph: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="17.5" cy="17.5" r="2.6"/><circle cx="6.5" cy="6.5" r="2.6"/><line x1="8.7" y1="8.2" x2="15.4" y2="15.4"/><line x1="15.8" y1="7.8" x2="8.2" y2="16.2"/><line x1="9" y1="6.5" x2="15.4" y2="6.2"/></svg>',
    assetSidebar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="15" y1="4" x2="15" y2="20"/><rect x="6" y="8" width="6" height="5" rx="1"/><line x1="6" y1="16" x2="12" y2="16"/></svg>',
    sortExpand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 8 12 3 17 8"/><polyline points="7 16 12 21 17 16"/></svg>'
  };

  function escHtml(text: string): string {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getColorDef(key?: string | null): IconColorDef {
    return ICON_COLORS.find(c => c.key === key) || ICON_COLORS[0];
  }

  function isSvgIconValue(val?: string | null): boolean {
    return typeof val === 'string' && val.startsWith('arch-icon:');
  }

  function parseSvgIconValue(val?: string | null): { id: string; colorKey: string } {
    if (!isSvgIconValue(val)) return { id: 'doc', colorKey: 'default' };
    const [, id = 'doc', colorKey = 'default'] = String(val).split(':');
    return { id, colorKey };
  }

  function makeSvgIconValue(id: string, colorKey = 'default'): string {
    return `arch-icon:${id}:${colorKey || 'default'}`;
  }

  function getSvgMarkupById(id: string, strokeWidth = 1.9): string {
    const def = VECTOR_ICONS.find(i => i.id === id) || VECTOR_ICONS[0];
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${def.body}</svg>`;
  }

  function renderIconHtml(icon?: string | null, extraClass = '', fallback = '📄'): string {
    const raw = icon || fallback;
    if (isSvgIconValue(raw)) {
      const { id, colorKey } = parseSvgIconValue(raw);
      const color = getColorDef(colorKey);
      return `<span class="arch-svg-icon ${escHtml(extraClass)}" data-icon-id="${escHtml(id)}" data-icon-color="${escHtml(color.key)}" style="color:${color.hex}">${getSvgMarkupById(id)}</span>`;
    }
    if (/^(data:image|blob:|architect-asset:)/i.test(raw)) {
      return `<img class="page-link-image-icon ${escHtml(extraClass)}" src="${escHtml(raw)}" alt="">`;
    }
    return escHtml(raw);
  }

  const UI_ICON_SLOTS: UiIconSlotDef[] = [
    // Feature Rail / App Ribbon
    { id: 'rail-sidebar-toggle', group: 'Feature Rail', label: 'Toggle Sidebar', aliases: ['sidebar-toggle', 'rail/sidebar-toggle'] },
    { id: 'rail-docs', group: 'Feature Rail', label: 'Docs Mode', aliases: ['rail-notion', 'notion', 'docs', 'rail/docs', 'rail/notion'] },
    { id: 'rail-dashboard', group: 'Feature Rail', label: 'Dashboards Mode', aliases: ['dashboard', 'rail/dashboard'] },
    { id: 'rail-assets', group: 'Feature Rail', label: 'Asset Library', aliases: ['assets', 'asset-library', 'rail/assets'] },
    { id: 'rail-sync', group: 'Feature Rail', label: 'Sync Workspace', aliases: ['sync', 'sync-now', 'rail/sync'] },
    { id: 'rail-trash', group: 'Feature Rail', label: 'Trash Bin', aliases: ['trash', 'rail/trash'] },
    { id: 'rail-user-settings', group: 'Feature Rail', label: 'Client Settings', aliases: ['user-settings', 'settings', 'rail/user-settings'] },

    // Explorer & Sidebar Chrome
    { id: 'explorer-files', group: 'Sidebar & Explorer', label: 'Files Tab', aliases: ['explorer/files'] },
    { id: 'explorer-search', group: 'Sidebar & Explorer', label: 'Search Tab', aliases: ['search', 'explorer/search'] },
    { id: 'explorer-graph', group: 'Sidebar & Explorer', label: 'Graph View Tab', aliases: ['graph', 'graph-view', 'explorer/graph'] },
    { id: 'explorer-inbox', group: 'Sidebar & Explorer', label: 'Inbox Tab', aliases: ['updates', 'explorer/inbox'] },
    { id: 'sidebar-new-hub', group: 'Sidebar & Explorer', label: 'New Hub Button', aliases: ['new-hub', 'sidebar/new-hub'] },
    { id: 'sidebar-collapse-handle', group: 'Sidebar & Explorer', label: 'Sidebar Collapse Handle', aliases: ['collapse-handle', 'sidebar/collapse'] },

    // Dashboards Sidebar & Navigation
    { id: 'dash-notifications', group: 'Dashboards Nav', label: 'Notifications', aliases: ['notifications', 'dash/notifications'] },
    { id: 'dash-chat', group: 'Dashboards Nav', label: 'Chat', aliases: ['chat', 'dash/chat'] },
    { id: 'dash-user', group: 'Dashboards Nav', label: 'My Dashboard', aliases: ['user-dash', 'my-dashboard', 'dash/user'] },
    { id: 'dash-team', group: 'Dashboards Nav', label: 'Team Overview', aliases: ['team-overview', 'team', 'dash/team'] },
    { id: 'dash-admin', group: 'Dashboards Nav', label: 'Admin Dashboard', aliases: ['admin-dash', 'admin', 'dash/admin'] },
    { id: 'dash-time-tracking', group: 'Dashboards Nav', label: 'Time Tracking', aliases: ['time-tracking', 'dash/time-tracking'] },
    { id: 'dash-calendar', group: 'Dashboards Nav', label: 'Calendar', aliases: ['dash/calendar'] },
    { id: 'dash-taskboard', group: 'Dashboards Nav', label: 'Taskboard', aliases: ['taskboard', 'dash/taskboard'] },
    { id: 'dash-scratchpad', group: 'Dashboards Nav', label: 'Scratchpad', aliases: ['scratchpad', 'dash/scratchpad'] },
    { id: 'dash-history-back', group: 'Dashboards Nav', label: 'Dashboard Previous', aliases: ['dash-back', 'dash/back'] },
    { id: 'dash-history-forward', group: 'Dashboards Nav', label: 'Dashboard Next', aliases: ['dash-forward', 'dash/forward'] },

    // Topbar Chrome
    { id: 'topbar-back', group: 'Topbar', label: 'Previous Page', aliases: ['history-back', 'topbar/back'] },
    { id: 'topbar-forward', group: 'Topbar', label: 'Next Page', aliases: ['history-forward', 'topbar/forward'] },
    { id: 'topbar-comments', group: 'Topbar', label: 'Comments Drawer', aliases: ['comments', 'toggle-comments', 'topbar/comments'] },
    { id: 'topbar-more', group: 'Topbar', label: 'Page Options (More)', aliases: ['page-options', 'topbar/more'] },
    { id: 'topbar-assets-sidebar', group: 'Topbar', label: 'Assets Sidebar Toggle', aliases: ['assets-sidebar', 'asset-sidebar', 'topbar/assets-sidebar'] },

    // Docs Editor Toolbar
    { id: 'toolbar-undo', group: 'Editor Toolbar', label: 'Undo', aliases: ['undo', 'toolbar/undo'] },
    { id: 'toolbar-redo', group: 'Editor Toolbar', label: 'Redo', aliases: ['redo', 'toolbar/redo'] },
    { id: 'toolbar-heading', group: 'Editor Toolbar', label: 'Headings', aliases: ['heading', 'toolbar/heading'] },
    { id: 'toolbar-bold', group: 'Editor Toolbar', label: 'Bold', aliases: ['bold', 'toolbar/bold'] },
    { id: 'toolbar-italic', group: 'Editor Toolbar', label: 'Italic', aliases: ['italic', 'toolbar/italic'] },
    { id: 'toolbar-strikethrough', group: 'Editor Toolbar', label: 'Strikethrough', aliases: ['strikethrough', 'toolbar/strikethrough'] },
    { id: 'toolbar-underline', group: 'Editor Toolbar', label: 'Underline', aliases: ['underline', 'toolbar/underline'] },
    { id: 'toolbar-text-options', group: 'Editor Toolbar', label: 'Text Options', aliases: ['text-options', 'toolbar/text-options'] },
    { id: 'toolbar-font', group: 'Editor Toolbar', label: 'Font Family', aliases: ['font', 'toolbar/font'] },
    { id: 'toolbar-font-size', group: 'Editor Toolbar', label: 'Font Size', aliases: ['font-size', 'toolbar/font-size'] },
    { id: 'toolbar-text-color', group: 'Editor Toolbar', label: 'Text Color', aliases: ['text-color', 'toolbar/text-color'] },
    { id: 'toolbar-highlight-color', group: 'Editor Toolbar', label: 'Highlight Color', aliases: ['highlight-color', 'toolbar/highlight-color'] },
    { id: 'toolbar-format-tools', group: 'Editor Toolbar', label: 'Format Tools', aliases: ['format-tools', 'toolbar/format-tools'] },
    { id: 'toolbar-clear-format', group: 'Editor Toolbar', label: 'Clear Format', aliases: ['clear-format', 'toolbar/clear-format'] },
    { id: 'toolbar-lists', group: 'Editor Toolbar', label: 'Lists', aliases: ['lists', 'toolbar/lists'] },
    { id: 'toolbar-align', group: 'Editor Toolbar', label: 'Alignment', aliases: ['align', 'toolbar/align'] },
    { id: 'toolbar-callouts', group: 'Editor Toolbar', label: 'Callouts & Quote', aliases: ['callouts', 'toolbar/callouts'] },
    { id: 'toolbar-insert-table', group: 'Editor Toolbar', label: 'Insert Table', aliases: ['insert-table', 'toolbar/insert-table'] },
    { id: 'toolbar-link-attach', group: 'Editor Toolbar', label: 'Insert Link', aliases: ['link-attach', 'toolbar/link-attach'] },
    { id: 'toolbar-todo-toggle', group: 'Editor Toolbar', label: 'To-do Toggle', aliases: ['todo-toggle', 'toolbar/todo-toggle'] },
    { id: 'toolbar-fullscreen', group: 'Editor Toolbar', label: 'Fullscreen Enter', aliases: ['fullscreen', 'toolbar/fullscreen'] },
    { id: 'toolbar-fullscreen-exit', group: 'Editor Toolbar', label: 'Fullscreen Exit', aliases: ['fullscreen-exit', 'toolbar/fullscreen-exit'] },
    { id: 'toolbar-form-question', group: 'Editor Toolbar', label: 'Form + Question', aliases: ['form-question', 'toolbar/form-question'] },
    { id: 'toolbar-form-button', group: 'Editor Toolbar', label: 'Form + Button', aliases: ['form-button', 'toolbar/form-button'] },
    { id: 'toolbar-form-design', group: 'Editor Toolbar', label: 'Form Design', aliases: ['form-design', 'toolbar/form-design'] },

    // Database Views Tabs
    { id: 'db-view-table', group: 'Database Views', label: 'Table View Tab', aliases: ['db/table', 'view-table'] },
    { id: 'db-view-board', group: 'Database Views', label: 'Board View Tab', aliases: ['db/board', 'view-board'] },
    { id: 'db-view-list', group: 'Database Views', label: 'List View Tab', aliases: ['db/list', 'view-list'] },
    { id: 'db-view-gallery', group: 'Database Views', label: 'Gallery View Tab', aliases: ['db/gallery', 'view-gallery'] },
    { id: 'db-view-calendar', group: 'Database Views', label: 'Calendar View Tab', aliases: ['db/calendar', 'view-calendar'] },
    { id: 'db-view-timeline', group: 'Database Views', label: 'Timeline View Tab', aliases: ['db/timeline', 'view-timeline'] },
    { id: 'db-view-chart', group: 'Database Views', label: 'Chart View Tab', aliases: ['db/chart', 'view-chart'] },
    { id: 'db-view-feed', group: 'Database Views', label: 'Feed View Tab', aliases: ['db/feed', 'view-feed'] },
    { id: 'db-view-form', group: 'Database Views', label: 'Form View Tab', aliases: ['db/form', 'view-form'] }
  ];

  const slotKeyIndex = new Map<string, string>();
  const normSlotKey = (raw: string) => String(raw || '').toLowerCase().trim().replace(/\\/g, '/').replace(/^\/+|\/+$/g, '').replace(/[_\s]+/g, '-');
  UI_ICON_SLOTS.forEach(s => {
    slotKeyIndex.set(normSlotKey(s.id), s.id);
    (s.aliases || []).forEach(a => slotKeyIndex.set(normSlotKey(a), s.id));
  });

  let activeUiIconPack: UiIconPackData | null = null;

  function setActiveUiPack(pack: UiIconPackData | null) {
    activeUiIconPack = pack && pack.icons ? pack : null;
  }

  function getActiveUiPackId(): string {
    return activeUiIconPack?.id || '';
  }

  function matchUiIconSlot(filenameOrPath: string): string | null {
    const clean = String(filenameOrPath || '').replace(/\\/g, '/');
    const noExt = clean.replace(/\.[^./]+$/, '');
    const baseName = noExt.split('/').pop() || '';
    const parts = noExt.split('/').filter(Boolean);
    const parentPlusBase = parts.length >= 2 ? `${parts[parts.length - 2]}/${baseName}` : '';
    const parentDashBase = parts.length >= 2 ? `${parts[parts.length - 2]}-${baseName}` : '';
    for (const candidate of [noExt, parentDashBase, parentPlusBase, baseName]) {
      if (!candidate) continue;
      const hit = slotKeyIndex.get(normSlotKey(candidate));
      if (hit) return hit;
    }
    return null;
  }

  function sanitizeUiSvg(rawSvg: string): string {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(String(rawSvg || ''), 'image/svg+xml');
      const svg = doc.querySelector('svg');
      if (!svg) return '';
      svg.querySelectorAll('script,foreignObject,iframe,object,embed').forEach(n => n.remove());
      svg.querySelectorAll('*').forEach(node => {
        Array.from(node.attributes).forEach(attr => {
          const n = attr.name.toLowerCase();
          const v = String(attr.value || '').trim();
          if (n.startsWith('on') || /^(javascript|data:text\/html):/i.test(v)) {
            node.removeAttribute(attr.name);
          }
        });
      });
      if (!svg.getAttribute('viewBox')) {
        const w = parseFloat(svg.getAttribute('width') || '24') || 24;
        const h = parseFloat(svg.getAttribute('height') || '24') || 24;
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      }
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.setAttribute('aria-hidden', 'true');
      return new XMLSerializer().serializeToString(svg);
    } catch {
      return '';
    }
  }

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result || ''));
      fr.onerror = () => reject(fr.error || new Error('Failed to read file'));
      fr.readAsDataURL(file);
    });
  }

  async function buildUiIconPackFromFiles(
    fileList: File[],
    requestedName?: string
  ): Promise<{ pack: UiIconPackData; matchedCount: number; unmatchedFiles: string[] }> {
    const icons: Record<string, UiIconEntry> = {};
    const unmatchedFiles: string[] = [];
    let inferredName = (requestedName || '').trim();
    const rawFilesByKey = new Map<string, File>();
    let manifestJson: any = null;

    for (const f of fileList) {
      const rel = ((f as any).webkitRelativePath || f.name).replace(/\\/g, '/');
      if (!inferredName && rel.includes('/')) {
        const top = rel.split('/')[0]?.trim();
        if (top) inferredName = top;
      }
      const lower = f.name.toLowerCase();
      if (lower.endsWith('.json')) {
        try {
          const parsed = JSON.parse(await f.text());
          if (parsed && parsed.icons && typeof parsed.icons === 'object') {
            manifestJson = parsed;
            if (!inferredName && parsed.name) inferredName = String(parsed.name).trim();
            continue;
          }
        } catch {}
      }
      rawFilesByKey.set(rel.toLowerCase(), f);
      rawFilesByKey.set(f.name.toLowerCase(), f);
    }

    const ingestMediaFile = async (slotId: string, f: File) => {
      const lower = f.name.toLowerCase();
      if (lower.endsWith('.svg') || f.type === 'image/svg+xml') {
        const cleaned = sanitizeUiSvg(await f.text());
        if (cleaned) {
          icons[slotId] = { markup: cleaned, filename: f.name };
          return true;
        }
        return false;
      }
      if (/\.(png|webp|jpg|jpeg|gif|ico)$/i.test(lower) || f.type.startsWith('image/')) {
        const dataUrl = await readFileAsDataUrl(f);
        if (dataUrl) {
          icons[slotId] = { dataUrl, filename: f.name };
          return true;
        }
      }
      return false;
    };

    if (manifestJson && manifestJson.icons && typeof manifestJson.icons === 'object') {
      for (const [k, val] of Object.entries(manifestJson.icons)) {
        const slotId = matchUiIconSlot(k);
        if (!slotId) continue;
        if (typeof val === 'string') {
          const targetFile = rawFilesByKey.get(val.toLowerCase()) || rawFilesByKey.get((val.split('/').pop() || '').toLowerCase());
          if (targetFile) await ingestMediaFile(slotId, targetFile);
          else if (val.trim().startsWith('<svg')) {
            const cleaned = sanitizeUiSvg(val);
            if (cleaned) icons[slotId] = { markup: cleaned, filename: `${slotId}.svg` };
          } else if (/^data:image\//i.test(val.trim())) {
            icons[slotId] = { dataUrl: val.trim(), filename: `${slotId}.png` };
          }
        } else if (val && typeof val === 'object') {
          const entry = val as UiIconEntry;
          if (entry.markup && entry.markup.includes('<svg')) {
            const cleaned = sanitizeUiSvg(entry.markup);
            if (cleaned) icons[slotId] = { markup: cleaned, filename: entry.filename || `${slotId}.svg` };
          } else if (entry.dataUrl && /^data:image\//i.test(entry.dataUrl)) {
            icons[slotId] = { dataUrl: entry.dataUrl, filename: entry.filename || `${slotId}.png` };
          }
        }
      }
    }

    for (const f of fileList) {
      if (f.name.toLowerCase().endsWith('.json')) continue;
      const rel = ((f as any).webkitRelativePath || f.name).replace(/\\/g, '/');
      const slotId = matchUiIconSlot(rel);
      if (!slotId) {
        unmatchedFiles.push(f.name);
        continue;
      }
      if (!icons[slotId]) {
        const ok = await ingestMediaFile(slotId, f);
        if (!ok) unmatchedFiles.push(f.name);
      }
    }

    const pack: UiIconPackData = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `uipack_${Date.now()}`,
      name: inferredName || `Custom Pack (${new Date().toLocaleDateString()})`,
      createdAt: Date.now(),
      icons
    };
    return { pack, matchedCount: Object.keys(icons).length, unmatchedFiles };
  }

  function resolveUiSlotMarkup(slotId: string, fallbackMarkup: string): string {
    const entry = activeUiIconPack?.icons?.[slotId];
    if (!entry) return fallbackMarkup;
    if (entry.markup) {
      return `<span class="ui-pack-svg" data-ui-slot="${escHtml(slotId)}">${entry.markup}</span>`;
    }
    if (entry.dataUrl) {
      return `<img class="ui-pack-icon-img" data-ui-slot="${escHtml(slotId)}" src="${escHtml(entry.dataUrl)}" alt="">`;
    }
    return fallbackMarkup;
  }

  function generateNamingTemplateJson(): string {
    const icons: Record<string, string> = {};
    UI_ICON_SLOTS.forEach(s => { icons[s.id] = `${s.id}.svg`; });
    return JSON.stringify({
      format: 'architect-ui-icon-pack-template',
      name: 'My Custom UI Icon Pack',
      notes: 'Name icon files as <slot-id>.svg or .png/.webp (or place in folders like rail/docs.svg, toolbar/bold.svg). JSON manifest mapping is optional.',
      icons
    }, null, 2);
  }

  (window as any).ArchitectIcons = {
    ICON_COLORS,
    VECTOR_ICONS,
    RAIL_ICONS,
    UI_ICON_SLOTS,
    getColorDef,
    isSvgIconValue,
    parseSvgIconValue,
    makeSvgIconValue,
    getSvgMarkupById,
    renderIconHtml,
    matchUiIconSlot,
    sanitizeUiSvg,
    buildUiIconPackFromFiles,
    setActiveUiPack,
    getActiveUiPackId,
    resolveUiSlotMarkup,
    generateNamingTemplateJson
  };
})();
