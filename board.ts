(() => {
  type BoardTool = 'select' | 'pan' | 'sticky' | 'text' | 'shape' | 'connector' | 'draw';
  type BoardShapeKind = 'rect' | 'rounded' | 'circle' | 'diamond';
  type BoardNodeKind = 'sticky' | 'text' | 'shape' | 'image' | 'audio' | 'video' | 'file' | 'page_link' | 'drawing';

  interface BoardPoint {
    x: number;
    y: number;
  }

  interface BoardNode {
    id: string;
    kind: BoardNodeKind;
    x: number;
    y: number;
    w: number;
    h: number;
    text?: string;
    title?: string;
    color?: string;
    shape?: BoardShapeKind;
    assetId?: string;
    url?: string;
    mimeType?: string;
    sizeBytes?: number;
    pageId?: string;
    points?: BoardPoint[];
    strokeWidth?: number;
  }

  interface BoardEdge {
    id: string;
    fromId: string;
    toId: string;
    color?: string;
    label?: string;
  }

  interface BoardData {
    viewport: { x: number; y: number; zoom: number };
    nodes: BoardNode[];
    edges: BoardEdge[];
  }

  interface BoardHost {
    getPages: () => any[];
    getCurrentPage?: () => any;
    getCurrentUser: () => string;
    isReadOnlyMirror: () => boolean;
    canViewPage?: (page: any) => boolean;
    isPageReadOnly?: (page: any) => boolean;
    commitChange: (page?: any, forceSave?: boolean) => void;
    navigateToPage: (pageId: string, newTab?: boolean) => void;
    openLightbox: (asset: any, fallbackUrl?: string, name?: string) => void;
    downloadAsset: (asset: any, fallbackUrl?: string, name?: string) => void;
    createAudioPlayer: (asset: any, fallbackUrl?: string, title?: string) => HTMLElement;
    ingestLocalFile: (file: File) => Promise<any>;
    importPureRef?: (file: File, opts?: { parentPageId?: string }) => Promise<{ page: any; asset: any } | null>;
    findAssetById: (assetId?: string, url?: string) => any | null;
    resolveAssetOriginalUrl: (asset: any) => Promise<string | null>;
    resolveAssetPreviewUrl: (asset: any) => Promise<string | null>;
    openAssetPicker: (boardPage: any, pos: BoardPoint, anchorEl?: HTMLElement | null) => void;
    openPagePicker: (boardPage: any, pos: BoardPoint, anchorEl?: HTMLElement | null) => void;
    openPopoverMenu?: (anchor: HTMLElement, items: Array<{ label: string; run: () => void }>) => void;
    toast: (msg: string) => void;
  }

  const BOARD_COLORS: Array<{ key: string; label: string; fill: string; border: string; ink: string }> = [
    { key: 'yellow', label: 'Butter', fill: '#fef3c7', border: '#f59e0b', ink: '#451a03' },
    { key: 'blue', label: 'Sky', fill: '#dbeafe', border: '#3b82f6', ink: '#1e3a8a' },
    { key: 'green', label: 'Mint', fill: '#dcfce7', border: '#22c55e', ink: '#14532d' },
    { key: 'pink', label: 'Rose', fill: '#fce7f3', border: '#ec4899', ink: '#831843' },
    { key: 'purple', label: 'Lavender', fill: '#ede9fe', border: '#8b5cf6', ink: '#4c1d95' },
    { key: 'orange', label: 'Peach', fill: '#ffedd5', border: '#f97316', ink: '#7c2d12' },
    { key: 'slate', label: 'Paper', fill: '#f3f4f6', border: '#6b7280', ink: '#111827' }
  ];

  let host: BoardHost | null = null;
  let idCounter = 1;
  const activeWidgets = new Map<string, { boardId: string; redraw: () => void }>();

  function makeId(prefix = 'bn'): string {
    return `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;
  }

  function colorDef(key?: string) {
    return BOARD_COLORS.find(c => c.key === key) || BOARD_COLORS[0];
  }

  function isBoardPage(page: any): boolean {
    return !!page && page.pageKind === 'board';
  }

  function ensureBoardData(page: any): BoardData {
    if (!page.board || typeof page.board !== 'object') {
      page.board = {
        viewport: { x: 40, y: 40, zoom: 1 },
        nodes: [
          {
            id: makeId('sticky'),
            kind: 'sticky',
            x: 80,
            y: 72,
            w: 220,
            h: 148,
            color: 'yellow',
            text: 'Welcome to Board\nDouble-click to edit notes, draw with Pen, connect cards, or drop audio/video/files anywhere.'
          }
        ],
        edges: []
      };
    }
    if (!page.board.viewport) page.board.viewport = { x: 40, y: 40, zoom: 1 };
    if (!Number.isFinite(page.board.viewport.zoom)) page.board.viewport.zoom = 1;
    if (!Number.isFinite(page.board.viewport.x)) page.board.viewport.x = 40;
    if (!Number.isFinite(page.board.viewport.y)) page.board.viewport.y = 40;
    if (!Array.isArray(page.board.nodes)) page.board.nodes = [];
    if (!Array.isArray(page.board.edges)) page.board.edges = [];
    return page.board;
  }

  function convertPageToBoard(page: any): BoardData {
    if (!page) return ensureBoardData({ board: null });
    page.pageKind = 'board';
    if (!page.icon || page.icon === '📄') page.icon = 'arch-icon:board:blue';
    const data = ensureBoardData(page);
    host?.commitChange?.(page, true);
    return data;
  }

  function createBoardPage(parentId?: string, title = 'Untitled board', initialData?: Partial<BoardData>): any {
    const pages = host?.getPages?.() || [];
    const now = Date.now();
    const pg: any = {
      id: makeId('brd'),
      title: title || 'Untitled board',
      icon: 'arch-icon:board:blue',
      parentId: parentId || undefined,
      pageKind: 'board',
      blocks: [],
      board: {
        viewport: { x: 40, y: 40, zoom: 1 },
        nodes: initialData?.nodes || [
          {
            id: makeId('sticky'),
            kind: 'sticky',
            x: 80,
            y: 70,
            w: 220,
            h: 144,
            color: 'yellow',
            text: `${title || 'Untitled board'}\nUse the dock to add sticky notes, shapes, drawings, connectors, or any media/audio file.`
          }
        ],
        edges: initialData?.edges || []
      },
      createdAt: now,
      updatedAt: now
    };
    pages.push(pg);
    host?.commitChange?.(pg, true);
    return pg;
  }

  function classifyAssetNodeKind(asset: any): BoardNodeKind {
    const mime = String(asset?.fileType || asset?.mimeType || '').toLowerCase();
    const cat = String(asset?.category || '').toLowerCase();
    const name = String(asset?.name || '').toLowerCase();
    if (cat === 'image' || mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp)$/.test(name)) return 'image';
    if (cat === 'audio' || cat === 'sfx' || mime.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac|aac|weba)$/.test(name)) return 'audio';
    if (cat === 'video' || mime.startsWith('video/') || /\.(mp4|webm|mov|mkv|m4v)$/.test(name)) return 'video';
    return 'file';
  }

  function defaultDimensionsForKind(kind: BoardNodeKind): { w: number; h: number } {
    switch (kind) {
      case 'sticky': return { w: 210, h: 144 };
      case 'text': return { w: 220, h: 64 };
      case 'shape': return { w: 180, h: 110 };
      case 'image': return { w: 260, h: 190 };
      case 'video': return { w: 300, h: 210 };
      case 'audio': return { w: 300, h: 118 };
      case 'file': return { w: 260, h: 104 };
      case 'page_link': return { w: 230, h: 86 };
      default: return { w: 200, h: 120 };
    }
  }

  function insertAssetNodeIntoBoard(boardPage: any, asset: any, pos?: BoardPoint): BoardNode | null {
    if (!boardPage || !asset) return null;
    if (asset.category === 'board' && asset.metadata?.boardPageId) {
      const targetBoardPage = host?.getPages?.().find((pg: any) => pg.id === asset.metadata.boardPageId);
      if (targetBoardPage) return insertPageLinkNodeIntoBoard(boardPage, targetBoardPage, pos);
    }
    const data = ensureBoardData(boardPage);
    const kind = classifyAssetNodeKind(asset);
    const dims = defaultDimensionsForKind(kind);
    const count = data.nodes.length;
    const x = pos ? Math.round(pos.x - dims.w / 2) : 90 + (count % 4) * 44;
    const y = pos ? Math.round(pos.y - dims.h / 2) : 80 + (count % 4) * 38;
    const node: BoardNode = {
      id: makeId('node'),
      kind,
      x,
      y,
      w: dims.w,
      h: dims.h,
      title: asset.name || 'Untitled asset',
      assetId: asset.id,
      url: asset.externalUrl || asset.url || asset.previewDataUrl || '',
      mimeType: asset.fileType || '',
      sizeBytes: asset.sizeBytes || 0
    };
    data.nodes.push(node);
    host?.commitChange?.(boardPage, true);
    refreshBoardInstances(boardPage.id, node.id);
    return node;
  }

  function insertPageLinkNodeIntoBoard(boardPage: any, targetPage: any, pos?: BoardPoint): BoardNode | null {
    if (!boardPage || !targetPage) return null;
    const data = ensureBoardData(boardPage);
    const dims = defaultDimensionsForKind('page_link');
    const count = data.nodes.length;
    const node: BoardNode = {
      id: makeId('pglink'),
      kind: 'page_link',
      x: pos ? Math.round(pos.x - dims.w / 2) : 120 + (count % 4) * 40,
      y: pos ? Math.round(pos.y - dims.h / 2) : 100 + (count % 4) * 32,
      w: dims.w,
      h: dims.h,
      pageId: targetPage.id,
      title: targetPage.title || 'Untitled page'
    };
    data.nodes.push(node);
    host?.commitChange?.(boardPage, true);
    refreshBoardInstances(boardPage.id, node.id);
    return node;
  }

  function refreshBoardInstances(boardId?: string, _highlightNodeId?: string) {
    activeWidgets.forEach((entry, widgetId) => {
      const el = document.querySelector(`[data-board-widget-id="${CSS.escape(widgetId)}"]`);
      if (!el) {
        activeWidgets.delete(widgetId);
        return;
      }
      if (!boardId || entry.boardId === boardId) entry.redraw();
    });
  }

  function formatBytes(bytes?: number): string {
    if (!bytes || bytes < 1024) return bytes ? `${bytes} B` : '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function openLinkSourcePopover(anchorEl: HTMLElement | null, onPick: (boardPage: any) => void) {
    const pages = (host?.getPages?.() || []).filter((pg: any) => isBoardPage(pg));
    if (!anchorEl) return;
    if (host?.openPopoverMenu) {
      const items = [
        ...pages.map((pg: any) => ({
          label: `${pg.title || 'Untitled board'} (${pg.board?.nodes?.length || 0} items)`,
          run: () => onPick(pg)
        })),
        {
          label: '＋ Create new board',
          run: () => onPick(createBoardPage(host?.getCurrentPage?.()?.id, 'Untitled board'))
        }
      ];
      host.openPopoverMenu(anchorEl, items);
    } else if (pages[0]) {
      onPick(pages[0]);
    } else {
      onPick(createBoardPage(host?.getCurrentPage?.()?.id, 'Untitled board'));
    }
  }

  function renderBoardWidget(
    containerEl: HTMLElement,
    boardPageInput: any,
    options: { inlineBlock?: any; parentPage?: any; onChangeSourceBoard?: (nextBoard: any) => void } = {}
  ) {
    containerEl.replaceChildren();
    const pages = host?.getPages?.() || [];
    const boardPage = pages.find((pg: any) => pg.id === boardPageInput?.id && isBoardPage(pg)) || boardPageInput;
    if (!boardPage || !boardPage.id) {
      const missing = document.createElement('div');
      missing.className = 'board-missing';
      missing.innerHTML = '<span>Linked board no longer exists.</span>';
      containerEl.append(missing);
      return;
    }

    if (host?.canViewPage && !host.canViewPage(boardPage)) {
      const denied = document.createElement('div');
      denied.className = 'board-missing';
      denied.innerHTML = '<span>🔒 You do not have permission to view this linked board.</span>';
      containerEl.append(denied);
      return;
    }

    const isInline = !!options.inlineBlock;
    const ro = !!(host?.isPageReadOnly ? host.isPageReadOnly(boardPage) : host?.isReadOnlyMirror?.());
    const data = ensureBoardData(boardPage);
    const widgetId = makeId('bw');

    let tool: BoardTool = 'select';
    let activeColor = 'yellow';
    let activeShape: BoardShapeKind = 'rounded';
    let activeStrokeWidth = 3;
    let selectedNodeId: string | null = null;
    let connectFromId: string | null = null;
    let spacePanning = false;
    let dragMode: null | {
      kind: 'pan' | 'move' | 'resize' | 'draw';
      nodeId?: string;
      handle?: string;
      startClientX: number;
      startClientY: number;
      origVx?: number;
      origVy?: number;
      origX?: number;
      origY?: number;
      origW?: number;
      origH?: number;
      points?: BoardPoint[];
      livePathEl?: SVGPathElement;
    } = null;

    const root = document.createElement('div');
    root.className = 'board-shell' + (isInline ? ' is-inline' : ' is-full');
    root.dataset.boardWidgetId = widgetId;
    root.dataset.boardPageId = boardPage.id;
    root.contentEditable = 'false';

    if (isInline) {
      const initialH = Math.max(240, Math.min(1100, Number(options.inlineBlock.boardHeight) || 460));
      root.style.height = `${initialH}px`;
      if (options.inlineBlock.boardWidthPct) {
        root.style.width = `${Math.max(55, Math.min(100, Number(options.inlineBlock.boardWidthPct)))}%`;
      }
    }

    // Top bar (title for inline + active mode info + open full page + switch source)
    const topbar = document.createElement('div');
    topbar.className = 'board-topbar';
    const titleWrap = document.createElement('div');
    titleWrap.className = 'board-topbar-left';
    const titleIcon = document.createElement('span');
    titleIcon.className = 'board-topbar-icon';
    titleIcon.innerHTML = (window as any).ArchitectIcons?.renderIconHtml?.(boardPage.icon || 'arch-icon:board:blue') || '◩';
    const titleLabel = document.createElement('span');
    titleLabel.className = 'board-topbar-title';
    titleLabel.textContent = boardPage.title || 'Untitled board';
    const countBadge = document.createElement('span');
    countBadge.className = 'board-count-badge';
    countBadge.textContent = `${data.nodes.length} item${data.nodes.length === 1 ? '' : 's'}`;
    titleWrap.append(titleIcon, titleLabel, countBadge);

    const topRight = document.createElement('div');
    topRight.className = 'board-topbar-actions';

    if (!ro) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '*/*';
      fileInput.multiple = true;
      fileInput.hidden = true;
      fileInput.onchange = async () => {
        const files = fileInput.files ? Array.from(fileInput.files) : [];
        if (!files.length) return;
        const center = viewportCenterWorld();
        for (let i = 0; i < files.length; i++) {
          try {
            const rec = await host!.ingestLocalFile(files[i]);
            insertAssetNodeIntoBoard(boardPage, rec, { x: center.x + i * 28, y: center.y + i * 24 });
          } catch (err: any) {
            host?.toast?.(err?.message || `Failed to upload ${files[i].name}`);
          }
        }
        fileInput.value = '';
        redraw();
      };
      root.append(fileInput);

      const uploadBtn = document.createElement('button');
      uploadBtn.type = 'button';
      uploadBtn.className = 'board-top-btn';
      uploadBtn.dataset.boardAction = 'upload-file';
      uploadBtn.textContent = '↑ Upload file';
      uploadBtn.onclick = () => fileInput.click();

      const libBtn = document.createElement('button');
      libBtn.type = 'button';
      libBtn.className = 'board-top-btn';
      libBtn.dataset.boardAction = 'asset-library';
      libBtn.textContent = '🗂 Asset library';
      libBtn.onclick = () => host?.openAssetPicker?.(boardPage, viewportCenterWorld(), libBtn);

      const pageBtn = document.createElement('button');
      pageBtn.type = 'button';
      pageBtn.className = 'board-top-btn';
      pageBtn.dataset.boardAction = 'link-page';
      pageBtn.textContent = '↗ Link page';
      pageBtn.onclick = () => host?.openPagePicker?.(boardPage, viewportCenterWorld(), pageBtn);

      topRight.append(uploadBtn, libBtn, pageBtn);
    }

    if (isInline) {
      if (!ro && options.onChangeSourceBoard) {
        const switchBtn = document.createElement('button');
        switchBtn.type = 'button';
        switchBtn.className = 'board-top-btn';
        switchBtn.textContent = '⇄ Switch';
        switchBtn.onclick = () => openLinkSourcePopover(switchBtn, nextBoard => options.onChangeSourceBoard!(nextBoard));
        topRight.append(switchBtn);
      }
      const openBtn = document.createElement('button');
      openBtn.type = 'button';
      openBtn.className = 'board-top-btn board-open-full';
      openBtn.dataset.boardAction = 'open-full';
      openBtn.textContent = '⤢ Full page';
      openBtn.onclick = e => host?.navigateToPage?.(boardPage.id, !!(e.ctrlKey || e.metaKey));
      topRight.append(openBtn);
    }

    topbar.append(titleWrap, topRight);

    // Canvas Viewport + World Transform Layer
    const viewport = document.createElement('div');
    viewport.className = 'board-canvas-viewport';
    viewport.tabIndex = 0;
    viewport.dataset.tool = tool;

    const world = document.createElement('div');
    world.className = 'board-world';

    const edgesSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    edgesSvg.setAttribute('class', 'board-edges-svg');
    edgesSvg.setAttribute('width', '6000');
    edgesSvg.setAttribute('height', '6000');
    edgesSvg.style.overflow = 'visible';

    const nodesLayer = document.createElement('div');
    nodesLayer.className = 'board-nodes-layer';

    world.append(edgesSvg, nodesLayer);

    // Floating Left/Bottom Creation Dock
    const dock = document.createElement('div');
    dock.className = 'board-dock';

    // Context Selection Floating Bar
    const selBar = document.createElement('div');
    selBar.className = 'board-selection-bar';
    selBar.hidden = true;

    // Status / Zoom HUD
    const zoomHud = document.createElement('div');
    zoomHud.className = 'board-zoom-hud';

    const hintPill = document.createElement('div');
    hintPill.className = 'board-mode-hint';
    hintPill.hidden = true;

    viewport.append(world, dock, selBar, zoomHud, hintPill);
    root.append(topbar, viewport);

    // Resizable Embedded Inline Handles (height bar + width pill/corner)
    if (isInline && !ro) {
      const resizeBar = document.createElement('div');
      resizeBar.className = 'board-inline-resize-handle';
      resizeBar.title = 'Drag to adjust board height';
      resizeBar.innerHTML = '<span class="board-resize-grip"></span>';
      resizeBar.onmousedown = e => {
        e.preventDefault();
        e.stopPropagation();
        const startY = e.clientY;
        const startH = root.getBoundingClientRect().height;
        resizeBar.classList.add('is-dragging');
        const onMove = (ev: MouseEvent) => {
          const nextH = Math.max(240, Math.min(1100, Math.round(startH + (ev.clientY - startY))));
          root.style.height = `${nextH}px`;
          options.inlineBlock.boardHeight = nextH;
        };
        const onUp = () => {
          resizeBar.classList.remove('is-dragging');
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
          host?.commitChange?.(options.parentPage || boardPage, true);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      };

      const resizeRight = document.createElement('div');
      resizeRight.className = 'board-inline-resize-right';
      resizeRight.title = 'Drag to adjust board width';
      resizeRight.onmousedown = e => {
        e.preventDefault();
        e.stopPropagation();
        const parentW = root.parentElement?.getBoundingClientRect().width || root.getBoundingClientRect().width;
        const startX = e.clientX;
        const startW = root.getBoundingClientRect().width;
        const onMove = (ev: MouseEvent) => {
          const px = Math.max(360, startW + (ev.clientX - startX));
          const pct = Math.max(55, Math.min(100, Math.round((px / Math.max(1, parentW)) * 100)));
          root.style.width = `${pct}%`;
          options.inlineBlock.boardWidthPct = pct;
        };
        const onUp = () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
          host?.commitChange?.(options.parentPage || boardPage, true);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      };

      root.append(resizeBar, resizeRight);
    }

    containerEl.append(root);

    function applyViewportTransform() {
      const vp = data.viewport;
      world.style.transform = `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`;
      const step = Math.max(12, Math.round(24 * vp.zoom));
      viewport.style.backgroundSize = `${step}px ${step}px`;
      viewport.style.backgroundPosition = `${vp.x}px ${vp.y}px`;
      updateZoomHud();
    }

    function clientToWorld(clientX: number, clientY: number): BoardPoint {
      const rect = viewport.getBoundingClientRect();
      return {
        x: (clientX - rect.left - data.viewport.x) / data.viewport.zoom,
        y: (clientY - rect.top - data.viewport.y) / data.viewport.zoom
      };
    }

    function viewportCenterWorld(): BoardPoint {
      const rect = viewport.getBoundingClientRect();
      return {
        x: (rect.width / 2 - data.viewport.x) / data.viewport.zoom,
        y: (rect.height / 2 - data.viewport.y) / data.viewport.zoom
      };
    }

    function setTool(next: BoardTool) {
      tool = next;
      if (next !== 'connector') connectFromId = null;
      viewport.dataset.tool = tool;
      hintPill.hidden = tool === 'select';
      if (tool === 'connector') {
        hintPill.textContent = connectFromId ? 'Click destination item to complete connector (Esc to cancel)' : 'Click first item to start a connector arrow';
      } else if (tool === 'draw') {
        hintPill.textContent = 'Drag on canvas to draw freehand';
      } else if (tool === 'sticky') {
        hintPill.textContent = 'Click anywhere on canvas to place a sticky note';
      } else if (tool === 'text') {
        hintPill.textContent = 'Click anywhere on canvas to place a text block';
      } else if (tool === 'shape') {
        hintPill.textContent = 'Click anywhere on canvas to place a shape';
      } else if (tool === 'pan') {
        hintPill.textContent = 'Drag to pan canvas · Ctrl+Scroll to zoom';
      }
      renderDock();
    }

    function renderDock() {
      dock.replaceChildren();
      if (ro) return;
      const tools: Array<{ id: BoardTool; label: string; glyph: string }> = [
        { id: 'select', label: 'Select (V)', glyph: '⌖' },
        { id: 'pan', label: 'Pan (H)', glyph: '✋' },
        { id: 'sticky', label: 'Sticky note (S)', glyph: '🗒' },
        { id: 'text', label: 'Text (T)', glyph: 'T' },
        { id: 'shape', label: 'Shape (R)', glyph: '▢' },
        { id: 'connector', label: 'Connector (C)', glyph: '↗' },
        { id: 'draw', label: 'Pen / Draw (P)', glyph: '✎' }
      ];
      tools.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'board-tool-btn' + (tool === item.id ? ' active' : '');
        btn.dataset.boardTool = item.id;
        btn.title = item.label;
        btn.setAttribute('aria-label', item.label);
        btn.textContent = item.glyph;
        btn.onclick = e => { e.stopPropagation(); setTool(item.id); };
        dock.append(btn);
      });

      const sep = document.createElement('span');
      sep.className = 'board-dock-sep';
      dock.append(sep);

      const quickShapes: BoardShapeKind[] = ['rounded', 'rect', 'circle', 'diamond'];
      if (tool === 'shape') {
        quickShapes.forEach(sh => {
          const sb = document.createElement('button');
          sb.type = 'button';
          sb.className = 'board-tool-btn board-shape-sub' + (activeShape === sh ? ' active' : '');
          sb.title = `Shape: ${sh}`;
          sb.textContent = sh === 'circle' ? '◯' : sh === 'diamond' ? '◇' : sh === 'rect' ? '▭' : '▢';
          sb.onclick = e => { e.stopPropagation(); activeShape = sh; renderDock(); };
          dock.append(sb);
        });
      }

      if (tool === 'draw' || tool === 'sticky' || tool === 'shape') {
        BOARD_COLORS.slice(0, 6).forEach(col => {
          const sw = document.createElement('button');
          sw.type = 'button';
          sw.className = 'board-dock-swatch' + (activeColor === col.key ? ' active' : '');
          sw.style.background = col.border;
          sw.title = col.label;
          sw.onclick = e => { e.stopPropagation(); activeColor = col.key; renderDock(); };
          dock.append(sw);
        });
      }
    }

    function updateZoomHud() {
      zoomHud.replaceChildren();
      const outBtn = document.createElement('button');
      outBtn.type = 'button';
      outBtn.className = 'board-zoom-btn';
      outBtn.title = 'Zoom out';
      outBtn.textContent = '−';
      outBtn.onclick = () => zoomBy(-0.15);

      const pctBtn = document.createElement('button');
      pctBtn.type = 'button';
      pctBtn.className = 'board-zoom-pct';
      pctBtn.title = 'Reset zoom to 100%';
      pctBtn.textContent = `${Math.round(data.viewport.zoom * 100)}%`;
      pctBtn.onclick = () => {
        data.viewport.zoom = 1;
        applyViewportTransform();
        host?.commitChange?.(boardPage);
      };

      const inBtn = document.createElement('button');
      inBtn.type = 'button';
      inBtn.className = 'board-zoom-btn';
      inBtn.title = 'Zoom in';
      inBtn.textContent = '+';
      inBtn.onclick = () => zoomBy(0.15);

      const fitBtn = document.createElement('button');
      fitBtn.type = 'button';
      fitBtn.className = 'board-zoom-btn';
      fitBtn.title = 'Fit board contents';
      fitBtn.textContent = '⊡';
      fitBtn.onclick = () => fitToContent();

      zoomHud.append(outBtn, pctBtn, inBtn, fitBtn);
    }

    function zoomBy(delta: number, pivotClient?: BoardPoint) {
      const rect = viewport.getBoundingClientRect();
      const px = pivotClient ? pivotClient.x - rect.left : rect.width / 2;
      const py = pivotClient ? pivotClient.y - rect.top : rect.height / 2;
      const oldZoom = data.viewport.zoom;
      const nextZoom = Math.max(0.25, Math.min(3, Math.round((oldZoom + delta) * 100) / 100));
      if (nextZoom === oldZoom) return;
      const wx = (px - data.viewport.x) / oldZoom;
      const wy = (py - data.viewport.y) / oldZoom;
      data.viewport.zoom = nextZoom;
      data.viewport.x = Math.round(px - wx * nextZoom);
      data.viewport.y = Math.round(py - wy * nextZoom);
      applyViewportTransform();
      host?.commitChange?.(boardPage);
    }

    function fitToContent() {
      if (!data.nodes.length) {
        data.viewport = { x: 40, y: 40, zoom: 1 };
        applyViewportTransform();
        host?.commitChange?.(boardPage);
        return;
      }
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      data.nodes.forEach(n => {
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + n.w);
        maxY = Math.max(maxY, n.y + n.h);
      });
      const rect = viewport.getBoundingClientRect();
      const pad = 64;
      const spanW = Math.max(200, maxX - minX);
      const spanH = Math.max(160, maxY - minY);
      const zoom = Math.max(0.3, Math.min(1.4, Math.min((rect.width - pad * 2) / spanW, (rect.height - pad * 2) / spanH)));
      data.viewport.zoom = Math.round(zoom * 100) / 100;
      data.viewport.x = Math.round(rect.width / 2 - ((minX + maxX) / 2) * data.viewport.zoom);
      data.viewport.y = Math.round(rect.height / 2 - ((minY + maxY) / 2) * data.viewport.zoom);
      applyViewportTransform();
      host?.commitChange?.(boardPage);
    }

    function renderEdges() {
      edgesSvg.replaceChildren();
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      const markerId = `arrow-${widgetId}`;
      marker.setAttribute('id', markerId);
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '9');
      marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '7');
      marker.setAttribute('markerHeight', '7');
      marker.setAttribute('orient', 'auto-start-reverse');
      const mPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      mPath.setAttribute('d', 'M 0 1.5 L 10 5 L 0 8.5 z');
      mPath.setAttribute('fill', '#4b5563');
      marker.append(mPath);
      defs.append(marker);
      edgesSvg.append(defs);

      data.edges.forEach(edge => {
        const from = data.nodes.find(n => n.id === edge.fromId);
        const to = data.nodes.find(n => n.id === edge.toId);
        if (!from || !to) return;
        const fx = from.x + from.w / 2;
        const fy = from.y + from.h / 2;
        const tx = to.x + to.w / 2;
        const ty = to.y + to.h / 2;
        const dx = tx - fx;
        const cx1 = fx + dx * 0.45;
        const cy1 = fy;
        const cx2 = tx - dx * 0.45;
        const cy2 = ty;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${fx} ${fy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', edge.color || '#4b5563');
        path.setAttribute('stroke-width', '2.2');
        path.setAttribute('marker-end', `url(#${markerId})`);
        if (!ro) {
          path.style.pointerEvents = 'stroke';
          path.style.cursor = 'pointer';
          path.setAttribute('title', 'Click to remove connector');
          path.onclick = ev => {
            ev.stopPropagation();
            data.edges = data.edges.filter(x => x.id !== edge.id);
            host?.commitChange?.(boardPage, true);
            renderEdges();
          };
        }
        edgesSvg.append(path);
      });
    }

    function renderSelectionBar() {
      const node = selectedNodeId ? data.nodes.find(n => n.id === selectedNodeId) : null;
      if (!node || ro) {
        selBar.hidden = true;
        selBar.replaceChildren();
        return;
      }
      selBar.hidden = false;
      selBar.replaceChildren();

      if (['sticky', 'shape', 'text', 'drawing'].includes(node.kind)) {
        BOARD_COLORS.forEach(col => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'board-sel-swatch' + ((node.color || 'yellow') === col.key ? ' active' : '');
          btn.style.background = col.border;
          btn.title = col.label;
          btn.onclick = () => {
            node.color = col.key;
            host?.commitChange?.(boardPage, true);
            redraw();
          };
          selBar.append(btn);
        });
      }

      const connectBtn = document.createElement('button');
      connectBtn.type = 'button';
      connectBtn.className = 'board-sel-btn';
      connectBtn.textContent = '↗ Connect';
      connectBtn.onclick = () => {
        connectFromId = node.id;
        setTool('connector');
      };

      const dupBtn = document.createElement('button');
      dupBtn.type = 'button';
      dupBtn.className = 'board-sel-btn';
      dupBtn.textContent = '⧉ Duplicate';
      dupBtn.onclick = () => {
        const clone: BoardNode = JSON.parse(JSON.stringify(node));
        clone.id = makeId('node');
        clone.x += 24;
        clone.y += 24;
        data.nodes.push(clone);
        selectedNodeId = clone.id;
        host?.commitChange?.(boardPage, true);
        redraw();
      };

      const frontBtn = document.createElement('button');
      frontBtn.type = 'button';
      frontBtn.className = 'board-sel-btn';
      frontBtn.textContent = '↑ Front';
      frontBtn.onclick = () => {
        data.nodes = [...data.nodes.filter(x => x.id !== node.id), node];
        host?.commitChange?.(boardPage, true);
        redraw();
      };

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'board-sel-btn danger';
      delBtn.textContent = '🗑 Delete';
      delBtn.onclick = () => deleteNodeById(node.id);

      selBar.append(connectBtn, dupBtn, frontBtn, delBtn);
    }

    function deleteNodeById(nodeId: string) {
      data.nodes = data.nodes.filter(x => x.id !== nodeId);
      data.edges = data.edges.filter(e => e.fromId !== nodeId && e.toId !== nodeId);
      if (selectedNodeId === nodeId) selectedNodeId = null;
      host?.commitChange?.(boardPage, true);
      redraw();
    }

    function buildNodeElement(node: BoardNode): HTMLElement {
      const el = document.createElement('div');
      const isSelected = selectedNodeId === node.id;
      const isConnectSource = connectFromId === node.id;
      el.className = `board-node board-node-${node.kind}` + (isSelected ? ' is-selected' : '') + (isConnectSource ? ' is-connect-source' : '');
      el.dataset.boardNodeId = node.id;
      el.style.left = `${node.x}px`;
      el.style.top = `${node.y}px`;
      el.style.width = `${node.w}px`;
      el.style.height = `${node.h}px`;

      const col = colorDef(node.color);

      if (node.kind === 'sticky') {
        el.style.background = col.fill;
        el.style.borderColor = col.border;
        el.style.color = col.ink;
        const body = document.createElement('textarea');
        body.className = 'board-sticky-input';
        body.value = node.text || '';
        body.readOnly = ro;
        body.placeholder = 'Write a note…';
        body.onmousedown = e => e.stopPropagation();
        body.onfocus = () => { selectedNodeId = node.id; renderSelectionBar(); };
        body.oninput = () => { node.text = body.value; host?.commitChange?.(boardPage, false); };
        body.onchange = () => host?.commitChange?.(boardPage, true);
        el.append(body);
      } else if (node.kind === 'text') {
        el.style.color = col.key === 'yellow' ? '#111827' : col.ink;
        const body = document.createElement('textarea');
        body.className = 'board-text-input';
        body.value = node.text || '';
        body.readOnly = ro;
        body.placeholder = 'Type canvas text…';
        body.onmousedown = e => e.stopPropagation();
        body.onfocus = () => { selectedNodeId = node.id; renderSelectionBar(); };
        body.oninput = () => { node.text = body.value; host?.commitChange?.(boardPage, false); };
        body.onchange = () => host?.commitChange?.(boardPage, true);
        el.append(body);
      } else if (node.kind === 'shape') {
        el.dataset.shapeKind = node.shape || 'rounded';
        el.style.background = col.fill;
        el.style.borderColor = col.border;
        el.style.color = col.ink;
        const body = document.createElement('textarea');
        body.className = 'board-shape-input';
        body.value = node.text || '';
        body.readOnly = ro;
        body.placeholder = 'Shape text';
        body.onmousedown = e => e.stopPropagation();
        body.onfocus = () => { selectedNodeId = node.id; renderSelectionBar(); };
        body.oninput = () => { node.text = body.value; host?.commitChange?.(boardPage, false); };
        body.onchange = () => host?.commitChange?.(boardPage, true);
        el.append(body);
      } else if (node.kind === 'drawing') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'board-drawing-svg');
        svg.setAttribute('viewBox', `0 0 ${Math.max(10, node.w)} ${Math.max(10, node.h)}`);
        svg.setAttribute('preserveAspectRatio', 'none');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pts = node.points || [];
        const d = pts.length > 1
          ? pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')
          : pts.length === 1
            ? `M ${pts[0].x} ${pts[0].y} L ${pts[0].x + 0.5} ${pts[0].y + 0.5}`
            : '';
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', col.key === 'yellow' ? '#111827' : col.border);
        path.setAttribute('stroke-width', String(node.strokeWidth || 3));
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.append(path);
        el.append(svg);
      } else if (node.kind === 'image') {
        const asset = host?.findAssetById?.(node.assetId, node.url);
        const img = document.createElement('img');
        img.className = 'board-media-img';
        img.alt = node.title || 'Board image';
        img.src = asset?.previewDataUrl || asset?.url || node.url || '';
        if (asset) {
          host?.resolveAssetOriginalUrl?.(asset).then(async orig => {
            const finalUrl = orig || (await host?.resolveAssetPreviewUrl?.(asset));
            if (finalUrl && img.isConnected) img.src = finalUrl;
          });
        }
        img.ondblclick = e => {
          e.stopPropagation();
          host?.openLightbox?.(asset || { name: node.title || 'Image', url: img.src }, img.src, node.title || 'Image');
        };
        const cap = document.createElement('div');
        cap.className = 'board-media-caption';
        cap.textContent = node.title || 'Image';
        el.append(img, cap);
      } else if (node.kind === 'video') {
        const asset = host?.findAssetById?.(node.assetId, node.url);
        const head = document.createElement('div');
        head.className = 'board-card-head';
        head.innerHTML = `<span>▶</span><strong>${(node.title || 'Video').replace(/</g, '&lt;')}</strong>`;
        const video = document.createElement('video');
        video.className = 'board-media-video';
        video.controls = true;
        video.preload = 'metadata';
        video.onmousedown = e => e.stopPropagation();
        const fallbackUrl = asset?.externalUrl || asset?.url || node.url || '';
        if (fallbackUrl) video.src = fallbackUrl;
        if (asset) {
          host?.resolveAssetOriginalUrl?.(asset).then(url => {
            if (url && video.isConnected) video.src = url;
          });
        }
        el.append(head, video);
      } else if (node.kind === 'audio') {
        const asset = host?.findAssetById?.(node.assetId, node.url) || {
          id: node.assetId || node.id,
          name: node.title || 'Audio track',
          category: 'audio',
          fileType: node.mimeType || 'audio/mpeg',
          url: node.url || ''
        };
        const playerCard = host?.createAudioPlayer?.(asset, node.url, node.title || 'Audio');
        if (playerCard) {
          playerCard.classList.add('board-audio-card');
          playerCard.addEventListener('mousedown', e => {
            if ((e.target as HTMLElement)?.closest('button, input, .audio-player-controls')) {
              e.stopPropagation();
            }
          });
          el.append(playerCard);
        }
      } else if (node.kind === 'file') {
        const asset = host?.findAssetById?.(node.assetId, node.url);
        el.innerHTML = `<div class="board-file-row"><span class="board-file-ico">⌑</span><div class="board-file-meta"><strong>${(node.title || asset?.name || 'Attached file').replace(/</g, '&lt;')}</strong><small>${formatBytes(node.sizeBytes || asset?.sizeBytes) || node.mimeType || asset?.fileType || 'File asset'}</small></div></div>`;
        const actRow = document.createElement('div');
        actRow.className = 'board-file-actions';
        const dlBtn = document.createElement('button');
        dlBtn.type = 'button';
        dlBtn.className = 'board-file-btn';
        dlBtn.textContent = '↓ Download';
        dlBtn.onmousedown = e => e.stopPropagation();
        dlBtn.onclick = e => { e.stopPropagation(); host?.downloadAsset?.(asset, node.url, node.title || 'file'); };
        actRow.append(dlBtn);
        el.append(actRow);
      } else if (node.kind === 'page_link') {
        const target = (host?.getPages?.() || []).find((pg: any) => pg.id === node.pageId);
        const ico = document.createElement('span');
        ico.className = 'board-page-link-ico';
        ico.innerHTML = (window as any).ArchitectIcons?.renderIconHtml?.(target?.icon || '📄') || '📄';
        const copy = document.createElement('div');
        copy.className = 'board-page-link-copy';
        const t = document.createElement('strong');
        t.textContent = target?.title || node.title || 'Linked page';
        const sub = document.createElement('small');
        sub.textContent = target?.pageKind === 'board' ? 'Board page' : target?.pageKind === 'database' ? 'Database page' : 'Workspace page';
        copy.append(t, sub);
        const open = document.createElement('button');
        open.type = 'button';
        open.className = 'board-file-btn';
        open.textContent = 'Open →';
        open.onmousedown = e => e.stopPropagation();
        open.onclick = e => {
          e.stopPropagation();
          if (target) host?.navigateToPage?.(target.id, !!(e.ctrlKey || e.metaKey));
          else host?.toast?.('Linked page not found');
        };
        el.append(ico, copy, open);
      }

      if (!ro && isSelected && node.kind !== 'drawing') {
        ['nw', 'ne', 'sw', 'se'].forEach(handle => {
          const dot = document.createElement('div');
          dot.className = `board-resize-dot handle-${handle}`;
          dot.onmousedown = ev => {
            ev.preventDefault();
            ev.stopPropagation();
            dragMode = {
              kind: 'resize',
              nodeId: node.id,
              handle,
              startClientX: ev.clientX,
              startClientY: ev.clientY,
              origX: node.x,
              origY: node.y,
              origW: node.w,
              origH: node.h
            };
          };
          el.append(dot);
        });
      }

      el.onmousedown = ev => {
        if (ev.button !== 0) return;
        const targetEl = ev.target as HTMLElement;
        if (tool === 'pan' || spacePanning) return;
        if (tool === 'connector' && !ro) {
          ev.preventDefault();
          ev.stopPropagation();
          if (!connectFromId) {
            connectFromId = node.id;
            selectedNodeId = node.id;
            setTool('connector');
            redraw();
          } else if (connectFromId !== node.id) {
            const exists = data.edges.some(edge => edge.fromId === connectFromId && edge.toId === node.id);
            if (!exists) data.edges.push({ id: makeId('edge'), fromId: connectFromId, toId: node.id });
            connectFromId = null;
            setTool('select');
            host?.commitChange?.(boardPage, true);
            redraw();
          }
          return;
        }
        if (targetEl.closest('.board-resize-dot')) return;
        if (targetEl.closest('button, input, textarea, .audio-player-controls') && selectedNodeId === node.id) return;

        ev.stopPropagation();
        selectedNodeId = node.id;
        renderSelectionBar();
        nodesLayer.querySelectorAll('.board-node').forEach(n => n.classList.toggle('is-selected', (n as HTMLElement).dataset.boardNodeId === node.id));
        if (!ro) {
          dragMode = {
            kind: 'move',
            nodeId: node.id,
            startClientX: ev.clientX,
            startClientY: ev.clientY,
            origX: node.x,
            origY: node.y
          };
        }
      };

      return el;
    }

    function redraw() {
      countBadge.textContent = `${data.nodes.length} item${data.nodes.length === 1 ? '' : 's'}`;
      nodesLayer.replaceChildren();
      data.nodes.forEach(node => nodesLayer.append(buildNodeElement(node)));
      renderEdges();
      renderSelectionBar();
      applyViewportTransform();
    }

    // Canvas Mouse Interactions (pan, create item, freehand draw)
    viewport.onmousedown = ev => {
      if (ev.button === 1 || tool === 'pan' || spacePanning) {
        ev.preventDefault();
        dragMode = {
          kind: 'pan',
          startClientX: ev.clientX,
          startClientY: ev.clientY,
          origVx: data.viewport.x,
          origVy: data.viewport.y
        };
        return;
      }
      if (ev.button !== 0 || ro) return;
      if ((ev.target as HTMLElement).closest('.board-node, .board-dock, .board-selection-bar, .board-zoom-hud')) return;

      const worldPt = clientToWorld(ev.clientX, ev.clientY);

      if (tool === 'draw') {
        ev.preventDefault();
        const svgPreview = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPreview.setAttribute('fill', 'none');
        svgPreview.setAttribute('stroke', colorDef(activeColor).key === 'yellow' ? '#111827' : colorDef(activeColor).border);
        svgPreview.setAttribute('stroke-width', String(activeStrokeWidth));
        svgPreview.setAttribute('stroke-linecap', 'round');
        svgPreview.setAttribute('stroke-linejoin', 'round');
        svgPreview.setAttribute('d', `M ${worldPt.x} ${worldPt.y}`);
        edgesSvg.append(svgPreview);
        dragMode = {
          kind: 'draw',
          startClientX: ev.clientX,
          startClientY: ev.clientY,
          points: [worldPt],
          livePathEl: svgPreview
        };
        return;
      }

      if (tool === 'sticky' || tool === 'text' || tool === 'shape') {
        ev.preventDefault();
        const dims = defaultDimensionsForKind(tool);
        const node: BoardNode = {
          id: makeId('node'),
          kind: tool,
          x: Math.round(worldPt.x - dims.w / 2),
          y: Math.round(worldPt.y - dims.h / 2),
          w: dims.w,
          h: dims.h,
          color: activeColor,
          shape: tool === 'shape' ? activeShape : undefined,
          text: tool === 'sticky' ? '' : tool === 'shape' ? 'Idea' : 'Text note'
        };
        data.nodes.push(node);
        selectedNodeId = node.id;
        setTool('select');
        host?.commitChange?.(boardPage, true);
        redraw();
        const input = nodesLayer.querySelector(`[data-board-node-id="${CSS.escape(node.id)}"] textarea`) as HTMLTextAreaElement | null;
        if (input) input.focus();
        return;
      }

      if (tool === 'connector') {
        connectFromId = null;
        setTool('select');
        return;
      }

      selectedNodeId = null;
      redraw();
    };

    const onWindowMouseMove = (ev: MouseEvent) => {
      if (!dragMode) return;
      if (!root.isConnected) {
        dragMode = null;
        return;
      }
      if (dragMode.kind === 'pan') {
        data.viewport.x = Math.round((dragMode.origVx || 0) + (ev.clientX - dragMode.startClientX));
        data.viewport.y = Math.round((dragMode.origVy || 0) + (ev.clientY - dragMode.startClientY));
        applyViewportTransform();
        return;
      }
      if (dragMode.kind === 'move' && dragMode.nodeId) {
        const node = data.nodes.find(n => n.id === dragMode!.nodeId);
        if (!node) return;
        node.x = Math.round((dragMode.origX || 0) + (ev.clientX - dragMode.startClientX) / data.viewport.zoom);
        node.y = Math.round((dragMode.origY || 0) + (ev.clientY - dragMode.startClientY) / data.viewport.zoom);
        const nodeEl = nodesLayer.querySelector(`[data-board-node-id="${CSS.escape(node.id)}"]`) as HTMLElement | null;
        if (nodeEl) {
          nodeEl.style.left = `${node.x}px`;
          nodeEl.style.top = `${node.y}px`;
        }
        renderEdges();
        return;
      }
      if (dragMode.kind === 'resize' && dragMode.nodeId) {
        const node = data.nodes.find(n => n.id === dragMode!.nodeId);
        if (!node) return;
        const dx = (ev.clientX - dragMode.startClientX) / data.viewport.zoom;
        const dy = (ev.clientY - dragMode.startClientY) / data.viewport.zoom;
        let x = dragMode.origX || 0;
        let y = dragMode.origY || 0;
        let w = dragMode.origW || 160;
        let h = dragMode.origH || 100;
        const handle = dragMode.handle || 'se';
        if (handle.includes('e')) w = Math.max(96, Math.round(w + dx));
        if (handle.includes('s')) h = Math.max(64, Math.round(h + dy));
        if (handle.includes('w')) {
          const nw = Math.max(96, Math.round(w - dx));
          x += w - nw;
          w = nw;
        }
        if (handle.includes('n')) {
          const nh = Math.max(64, Math.round(h - dy));
          y += h - nh;
          h = nh;
        }
        node.x = x; node.y = y; node.w = w; node.h = h;
        const nodeEl = nodesLayer.querySelector(`[data-board-node-id="${CSS.escape(node.id)}"]`) as HTMLElement | null;
        if (nodeEl) {
          nodeEl.style.left = `${x}px`;
          nodeEl.style.top = `${y}px`;
          nodeEl.style.width = `${w}px`;
          nodeEl.style.height = `${h}px`;
        }
        renderEdges();
        return;
      }
      if (dragMode.kind === 'draw' && dragMode.points && dragMode.livePathEl) {
        const pt = clientToWorld(ev.clientX, ev.clientY);
        const last = dragMode.points[dragMode.points.length - 1];
        if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) >= 2.5) {
          dragMode.points.push(pt);
          dragMode.livePathEl.setAttribute('d', dragMode.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '));
        }
      }
    };

    const onWindowMouseUp = () => {
      if (!dragMode) return;
      const done = dragMode;
      dragMode = null;
      if (done.kind === 'draw' && done.points) {
        done.livePathEl?.remove();
        const pts = done.points;
        if (pts.length >= 2) {
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          pts.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
          });
          const pad = 8;
          const x = Math.round(minX - pad);
          const y = Math.round(minY - pad);
          const w = Math.max(24, Math.round(maxX - minX + pad * 2));
          const h = Math.max(24, Math.round(maxY - minY + pad * 2));
          const node: BoardNode = {
            id: makeId('draw'),
            kind: 'drawing',
            x,
            y,
            w,
            h,
            color: activeColor,
            strokeWidth: activeStrokeWidth,
            points: pts.map(p => ({ x: Math.round((p.x - x) * 10) / 10, y: Math.round((p.y - y) * 10) / 10 }))
          };
          data.nodes.push(node);
          selectedNodeId = node.id;
          host?.commitChange?.(boardPage, true);
          redraw();
        }
        return;
      }
      if (done.kind === 'move' || done.kind === 'resize') {
        host?.commitChange?.(boardPage, true);
      } else if (done.kind === 'pan') {
        host?.commitChange?.(boardPage, false);
      }
    };

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);

    // Wheel pan / Ctrl+wheel zoom
    viewport.addEventListener('wheel', ev => {
      if (ev.ctrlKey || ev.metaKey) {
        ev.preventDefault();
        zoomBy(ev.deltaY < 0 ? 0.1 : -0.1, { x: ev.clientX, y: ev.clientY });
      } else if (!isInline || tool === 'pan' || ev.shiftKey) {
        ev.preventDefault();
        data.viewport.x -= ev.deltaX;
        data.viewport.y -= ev.deltaY;
        applyViewportTransform();
      }
    }, { passive: false });

    // Drag & Drop local files or Asset Sidebar references onto the Board canvas
    viewport.addEventListener('dragover', ev => {
      if (ro) return;
      const types = ev.dataTransfer?.types ? Array.from(ev.dataTransfer.types) : [];
      if (!types.includes('Files') && !types.includes('application/x-architect-asset')) return;
      ev.preventDefault();
      if (ev.dataTransfer && types.includes('application/x-architect-asset')) ev.dataTransfer.dropEffect = 'link';
      viewport.classList.add('is-drop-active');
    });
    viewport.addEventListener('dragleave', () => viewport.classList.remove('is-drop-active'));
    viewport.addEventListener('drop', async ev => {
      if (ro) return;
      ev.preventDefault();
      viewport.classList.remove('is-drop-active');
      const dropPos = clientToWorld(ev.clientX, ev.clientY);
      const assetRefId = ev.dataTransfer?.getData('application/x-architect-asset') || '';
      if (assetRefId) {
        const existing = host?.findAssetById?.(assetRefId);
        if (existing) {
          if (existing.category === 'board' && existing.metadata?.boardPageId) {
            const linkedPage = host?.getPages?.().find((pg: any) => pg.id === existing.metadata.boardPageId);
            if (linkedPage) {
              insertPageLinkNodeIntoBoard(boardPage, linkedPage, dropPos);
              redraw();
              return;
            }
          }
          insertAssetNodeIntoBoard(boardPage, existing, dropPos);
          redraw();
        }
        return;
      }
      const files = ev.dataTransfer?.files ? Array.from(ev.dataTransfer.files) : [];
      if (!files.length) return;
      for (let i = 0; i < files.length; i++) {
        try {
          if (/\.pur$/i.test(files[i].name) && host?.importPureRef) {
            const imported = await host.importPureRef(files[i], { parentPageId: boardPage.id });
            if (imported?.page) insertPageLinkNodeIntoBoard(boardPage, imported.page, { x: dropPos.x + i * 24, y: dropPos.y + i * 20 });
            continue;
          }
          const rec = await host!.ingestLocalFile(files[i]);
          insertAssetNodeIntoBoard(boardPage, rec, { x: dropPos.x + i * 24, y: dropPos.y + i * 20 });
        } catch (err: any) {
          host?.toast?.(err?.message || `Could not drop ${files[i].name}`);
        }
      }
      redraw();
    });

    // Keyboard shortcuts when canvas viewport has focus
    viewport.addEventListener('keydown', ev => {
      if ((ev.target as HTMLElement)?.closest('textarea, input')) return;
      if (ev.code === 'Space') {
        spacePanning = true;
        viewport.classList.add('is-space-panning');
      } else if ((ev.key === 'Delete' || ev.key === 'Backspace') && selectedNodeId && !ro) {
        ev.preventDefault();
        deleteNodeById(selectedNodeId);
      } else if (ev.key.toLowerCase() === 'v') setTool('select');
      else if (ev.key.toLowerCase() === 'h') setTool('pan');
      else if (ev.key.toLowerCase() === 's') setTool('sticky');
      else if (ev.key.toLowerCase() === 't') setTool('text');
      else if (ev.key.toLowerCase() === 'r') setTool('shape');
      else if (ev.key.toLowerCase() === 'c') setTool('connector');
      else if (ev.key.toLowerCase() === 'p') setTool('draw');
    });
    viewport.addEventListener('keyup', ev => {
      if (ev.code === 'Space') {
        spacePanning = false;
        viewport.classList.remove('is-space-panning');
      }
    });

    activeWidgets.set(widgetId, { boardId: boardPage.id, redraw });
    renderDock();
    redraw();
  }

  function initHost(callbacks: BoardHost) {
    host = callbacks;
  }

  (window as any).ArchitectBoard = {
    BOARD_COLORS,
    initHost,
    isBoardPage,
    ensureBoardData,
    convertPageToBoard,
    createBoardPage,
    insertAssetNodeIntoBoard,
    insertPageLinkNodeIntoBoard,
    renderBoardWidget,
    refreshBoardInstances,
    openLinkSourcePopover
  };
})();
