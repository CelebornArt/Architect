// @ts-nocheck
/**
 * Notion-style relational Database engine and multi-view UI for Architect.
 * Supports full-page databases (/database), inline database views (/database inline),
 * shared schema across row pages, 8 view layouts, formulas, rollups, relations,
 * filtering/sorting/grouping/aggregations, templates, and Side/Center/Full peek.
 */

type DbPropertyType =
  | 'title'
  | 'text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'status'
  | 'date'
  | 'person'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone'
  | 'files'
  | 'relation'
  | 'rollup'
  | 'formula'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by';

type DbColorKey = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
type DbStatusGroup = 'todo' | 'in_progress' | 'complete';

type DbSelectOption = {
  id: string;
  name: string;
  color: DbColorKey;
  statusGroup?: DbStatusGroup;
};

type DbSchemaProperty = {
  id: string;
  name: string;
  type: DbPropertyType;
  options?: DbSelectOption[];
  numberFormat?: 'number' | 'percent' | 'dollar' | 'euro';
  relationDatabaseId?: string;
  rollupRelationId?: string;
  rollupTargetPropertyId?: string;
  rollupCalc?: 'count_all' | 'count_values' | 'sum' | 'average' | 'show_original';
  formulaExpr?: string;
  width?: number;
};

type DbFilterOp =
  | 'contains' | 'not_contains' | 'equals' | 'not_equals'
  | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'before' | 'after' | 'is_checked' | 'is_unchecked';

type DbFilterRule = { id: string; propertyId: string; op: DbFilterOp; value?: string };
type DbSortRule = { propertyId: string; direction: 'asc' | 'desc' };
type DbViewType = 'table' | 'board' | 'list' | 'gallery' | 'calendar' | 'timeline' | 'chart' | 'feed';
type DbAggregationType =
  | 'none' | 'count_all' | 'count_values' | 'count_empty' | 'count_not_empty'
  | 'percent_empty' | 'percent_not_empty' | 'sum' | 'average' | 'median' | 'min' | 'max' | 'range';
type DbOpenMode = 'side_peek' | 'center_peek' | 'full_page';

type DbView = {
  id: string;
  name: string;
  type: DbViewType;
  visiblePropertyIds: string[];
  propertyOrder: string[];
  filters: DbFilterRule[];
  filterMatch?: 'and' | 'or';
  sorts: DbSortRule[];
  groupBy?: string;
  subGroupBy?: string;
  datePropertyId?: string;
  chartConfig?: {
    chartType: 'vertical_bar' | 'horizontal_bar' | 'donut';
    xPropertyId: string;
    yMode: 'count' | 'sum' | 'average';
    yPropertyId?: string;
  };
  wrapCells?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
  cardPreview?: 'none' | 'cover' | 'content' | 'files';
  showTitle?: boolean;
  showPropertiesOnCards?: boolean;
  calculations?: Record<string, DbAggregationType>;
  columnWidths?: Record<string, number>;
  hiddenGroups?: string[];
  collapsedGroups?: string[];
  calendarMonth?: string;
  timelineZoom?: 'day' | 'week' | 'month';
};

type DbTemplate = {
  id: string;
  name: string;
  icon: string;
  propertyValues: Record<string, any>;
  blocks: any[];
};

type DatabaseConfig = {
  schema: DbSchemaProperty[];
  views: DbView[];
  activeViewId: string;
  defaultOpenMode: DbOpenMode;
  templates?: DbTemplate[];
  showTitle?: boolean;
};

const ArchitectDatabase = (() => {
  const DB_COLORS: { key: DbColorKey; label: string; fg: string; bg: string; dot: string }[] = [
    { key: 'default', label: 'Default', fg: '#37352f', bg: '#efefed', dot: '#9b9a97' },
    { key: 'gray', label: 'Gray', fg: '#5a5853', bg: '#ebeaee', dot: '#787774' },
    { key: 'brown', label: 'Brown', fg: '#64473a', bg: '#f3eeee', dot: '#9f6b53' },
    { key: 'orange', label: 'Orange', fg: '#894b13', bg: '#fbecdd', dot: '#d9730d' },
    { key: 'yellow', label: 'Yellow', fg: '#7f5b15', bg: '#fbf3db', dot: '#cb912f' },
    { key: 'green', label: 'Green', fg: '#2b593f', bg: '#edf3ec', dot: '#448361' },
    { key: 'blue', label: 'Blue', fg: '#23597a', bg: '#e7f3f8', dot: '#337ea9' },
    { key: 'purple', label: 'Purple', fg: '#5b3c77', bg: '#f4f0f7', dot: '#9065b0' },
    { key: 'pink', label: 'Pink', fg: '#7c2e56', bg: '#faf1f5', dot: '#c14c8a' },
    { key: 'red', label: 'Red', fg: '#8d2d29', bg: '#fdebec', dot: '#d44c47' }
  ];

  const DB_PROPERTY_TYPES: { type: DbPropertyType; label: string; icon: string; readonly?: boolean }[] = [
    { type: 'text', label: 'Text', icon: 'Aa' },
    { type: 'number', label: 'Number', icon: '#' },
    { type: 'select', label: 'Select', icon: '▾' },
    { type: 'multi_select', label: 'Multi-select', icon: '☰' },
    { type: 'status', label: 'Status', icon: '◉' },
    { type: 'date', label: 'Date', icon: '📅' },
    { type: 'person', label: 'Person', icon: '👤' },
    { type: 'files', label: 'Files & media', icon: '📎' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑' },
    { type: 'url', label: 'URL', icon: '🔗' },
    { type: 'email', label: 'Email', icon: '✉' },
    { type: 'phone', label: 'Phone', icon: '☎' },
    { type: 'relation', label: 'Relation', icon: '↗' },
    { type: 'rollup', label: 'Rollup', icon: '∑' },
    { type: 'formula', label: 'Formula', icon: 'ƒx' },
    { type: 'created_time', label: 'Created time', icon: '🕒', readonly: true },
    { type: 'created_by', label: 'Created by', icon: '☺', readonly: true },
    { type: 'last_edited_time', label: 'Last edited time', icon: '↻', readonly: true },
    { type: 'last_edited_by', label: 'Last edited by', icon: '✍', readonly: true }
  ];

  const DB_VIEW_TYPES: { type: DbViewType; label: string; icon: string; desc: string }[] = [
    { type: 'table', label: 'Table', icon: '⊞', desc: 'Classic grid with columns, sorting, and calculations' },
    { type: 'board', label: 'Board', icon: '▥', desc: 'Kanban cards grouped by status, select, or person' },
    { type: 'list', label: 'List', icon: '☰', desc: 'Clean lightweight list with property badges' },
    { type: 'gallery', label: 'Gallery', icon: '◫', desc: 'Visual card grid for covers, media, or specs' },
    { type: 'calendar', label: 'Calendar', icon: '📅', desc: 'Schedule items across a monthly calendar grid' },
    { type: 'timeline', label: 'Timeline', icon: '↦', desc: 'Plot date ranges across a horizontal Gantt track' },
    { type: 'chart', label: 'Chart', icon: '◔', desc: 'Visualize counts and totals by category' },
    { type: 'feed', label: 'Feed', icon: '▤', desc: 'Chronological updates with property tags and notes' }
  ];

  const DB_AGGREGATIONS: { key: DbAggregationType; label: string; numericOnly?: boolean }[] = [
    { key: 'none', label: 'None' },
    { key: 'count_all', label: 'Count all' },
    { key: 'count_values', label: 'Count values' },
    { key: 'count_empty', label: 'Count empty' },
    { key: 'count_not_empty', label: 'Count not empty' },
    { key: 'percent_empty', label: 'Percent empty' },
    { key: 'percent_not_empty', label: 'Percent not empty' },
    { key: 'sum', label: 'Sum', numericOnly: true },
    { key: 'average', label: 'Average', numericOnly: true },
    { key: 'median', label: 'Median', numericOnly: true },
    { key: 'min', label: 'Min', numericOnly: true },
    { key: 'max', label: 'Max', numericOnly: true },
    { key: 'range', label: 'Range', numericOnly: true }
  ];

  const DB_FILTER_OPS: { op: DbFilterOp; label: string; noValue?: boolean }[] = [
    { op: 'contains', label: 'Contains' },
    { op: 'not_contains', label: 'Does not contain' },
    { op: 'equals', label: 'Is' },
    { op: 'not_equals', label: 'Is not' },
    { op: 'starts_with', label: 'Starts with' },
    { op: 'ends_with', label: 'Ends with' },
    { op: 'is_empty', label: 'Is empty', noValue: true },
    { op: 'is_not_empty', label: 'Is not empty', noValue: true },
    { op: 'gt', label: '>' },
    { op: 'gte', label: '>=' },
    { op: 'lt', label: '<' },
    { op: 'lte', label: '<=' },
    { op: 'before', label: 'Before date' },
    { op: 'after', label: 'After date' },
    { op: 'is_checked', label: 'Checked', noValue: true },
    { op: 'is_unchecked', label: 'Unchecked', noValue: true }
  ];

  let host: any = null;
  let activePopover: HTMLElement | null = null;
  let activePopoverCleanup: (() => void) | null = null;
  let activePeek: { rowId: string; dbPageId: string; mode: 'side_peek' | 'center_peek'; rowOrder?: string[] } | null = null;
  const searchQueriesByKey = new Map<string, string>();
  const filterOpenByKey = new Map<string, boolean>();
  const noDateOpenByKey = new Map<string, boolean>();
  const activeHostRenders = new Map<HTMLElement, () => void>();

  function initHost(nextHost: any) {
    host = nextHost;
  }

  function uid() {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `db_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function escHtml(v: any) {
    return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function dbIconHtml(icon?: string | null, fallback = '📄'): string {
    const raw = icon || fallback;
    if ((window as any).ArchitectIcons?.renderIconHtml) return (window as any).ArchitectIcons.renderIconHtml(raw, '', fallback);
    return String(raw).startsWith('data:image') ? escHtml(fallback) : escHtml(raw);
  }

  function getState() {
    return host?.getState?.();
  }

  function roMode() {
    return !!host?.isReadOnlyMirror?.();
  }

  function persist(shouldRender = false) {
    host?.save?.();
    if (shouldRender) host?.render?.();
  }

  function isDatabasePage(page: any) {
    return !!page && page.pageKind === 'database';
  }

  function getDatabasePages() {
    return (getState()?.pages || []).filter((p: any) => isDatabasePage(p));
  }

  function getPageById(pageId: string) {
    return (getState()?.pages || []).find((p: any) => p.id === pageId) || null;
  }

  function getDatabaseRows(dbPageId: string) {
    return (getState()?.pages || []).filter((p: any) => p.databaseId === dbPageId);
  }

  function colorMeta(key: string) {
    return DB_COLORS.find(c => c.key === key) || DB_COLORS[0];
  }

  function propMeta(type: DbPropertyType) {
    if (type === 'title') return { type: 'title' as DbPropertyType, label: 'Title', icon: 'Aa', readonly: false };
    return DB_PROPERTY_TYPES.find(t => t.type === type) || DB_PROPERTY_TYPES[0];
  }

  function viewMeta(type: DbViewType) {
    return DB_VIEW_TYPES.find(v => v.type === type) || DB_VIEW_TYPES[0];
  }

  function defaultStatusOptions(): DbSelectOption[] {
    return [
      { id: uid(), name: 'Not started', color: 'gray', statusGroup: 'todo' },
      { id: uid(), name: 'In progress', color: 'blue', statusGroup: 'in_progress' },
      { id: uid(), name: 'Done', color: 'green', statusGroup: 'complete' }
    ];
  }

  function defaultTagOptions(): DbSelectOption[] {
    return [
      { id: uid(), name: 'Design', color: 'purple' },
      { id: uid(), name: 'Engineering', color: 'blue' },
      { id: uid(), name: 'Urgent', color: 'red' }
    ];
  }

  function buildDefaultSchema(): DbSchemaProperty[] {
    return [
      { id: 'prop_title', name: 'Name', type: 'title', width: 220 },
      { id: uid(), name: 'Tags', type: 'multi_select', options: defaultTagOptions(), width: 150 },
      { id: uid(), name: 'Status', type: 'status', options: defaultStatusOptions(), width: 145 }
    ];
  }

  function buildDefaultView(schema: DbSchemaProperty[], type: DbViewType = 'table', name?: string): DbView {
    const allIds = schema.map(s => s.id);
    const meta = viewMeta(type);
    const statusOrSelect = schema.find(s => s.type === 'status' || s.type === 'select' || s.type === 'person')?.id;
    const dateProp = schema.find(s => s.type === 'date')?.id;
    return {
      id: uid(),
      name: name || meta.label,
      type,
      visiblePropertyIds: [...allIds],
      propertyOrder: [...allIds],
      filters: [],
      filterMatch: 'and',
      sorts: [],
      groupBy: type === 'board' ? (statusOrSelect || allIds[1]) : undefined,
      datePropertyId: dateProp,
      chartConfig: {
        chartType: 'vertical_bar',
        xPropertyId: statusOrSelect || allIds[1] || allIds[0],
        yMode: 'count'
      },
      wrapCells: false,
      cardSize: 'medium',
      cardPreview: type === 'gallery' ? 'content' : 'none',
      showTitle: true,
      showPropertiesOnCards: true,
      calculations: {},
      columnWidths: Object.fromEntries(schema.map(s => [s.id, s.width || (s.type === 'title' ? 250 : 155)])),
      hiddenGroups: [],
      collapsedGroups: [],
      timelineZoom: 'week'
    };
  }

  function ensureDatabaseConfig(dbPage: any): DatabaseConfig {
    if (!dbPage.database || !Array.isArray(dbPage.database.schema) || !dbPage.database.schema.length) {
      const schema = buildDefaultSchema();
      const firstView = buildDefaultView(schema, 'table', 'Table');
      dbPage.database = {
        schema,
        views: [firstView],
        activeViewId: firstView.id,
        defaultOpenMode: 'side_peek',
        templates: [],
        showTitle: true
      };
    }
    const db = dbPage.database as DatabaseConfig;
    if (!db.schema.some(s => s.type === 'title')) {
      db.schema.unshift({ id: 'prop_title', name: 'Name', type: 'title', width: 250 });
    }
    if (!Array.isArray(db.views) || !db.views.length) {
      const v = buildDefaultView(db.schema, 'table', 'Table');
      db.views = [v];
      db.activeViewId = v.id;
    }
    const schemaIds = db.schema.map(s => s.id);
    db.views.forEach(v => {
      if (!Array.isArray(v.propertyOrder)) v.propertyOrder = [...schemaIds];
      schemaIds.forEach(sid => {
        if (!v.propertyOrder.includes(sid)) v.propertyOrder.push(sid);
      });
      v.propertyOrder = v.propertyOrder.filter(sid => schemaIds.includes(sid));
      if (!Array.isArray(v.visiblePropertyIds)) v.visiblePropertyIds = [...schemaIds];
      const titleProp = db.schema.find(s => s.type === 'title');
      if (titleProp && !v.visiblePropertyIds.includes(titleProp.id)) {
        v.visiblePropertyIds.unshift(titleProp.id);
      }
      v.visiblePropertyIds = v.visiblePropertyIds.filter(sid => schemaIds.includes(sid));
      v.filters = Array.isArray(v.filters) ? v.filters : [];
      v.sorts = Array.isArray(v.sorts) ? v.sorts : [];
      v.calculations = v.calculations || {};
      v.columnWidths = v.columnWidths || {};
      if (!v.datePropertyId) v.datePropertyId = db.schema.find(s => s.type === 'date')?.id;
      if (v.type === 'board' && (!v.groupBy || !schemaIds.includes(v.groupBy))) {
        const grp = db.schema.find(s => ['status', 'select', 'person', 'checkbox', 'multi_select'].includes(s.type));
        v.groupBy = grp?.id;
      }
    });
    if (!db.activeViewId || !db.views.some(v => v.id === db.activeViewId)) {
      db.activeViewId = db.views[0].id;
    }
    db.defaultOpenMode = db.defaultOpenMode || 'side_peek';
    db.templates = Array.isArray(db.templates) ? db.templates : [];
    return db;
  }

  function createDatabaseRow(dbPage: any, initialValues: Record<string, any> = {}, initialBlocks: any[] = [], icon = '📄') {
    const s = getState();
    const db = ensureDatabaseConfig(dbPage);
    const titleProp = db.schema.find(p => p.type === 'title');
    const titleVal = initialValues[titleProp?.id || 'prop_title'] ?? '';
    const now = Date.now();
    const propVals: Record<string, any> = {};
    for (const key of Object.keys(initialValues)) {
      if (key !== titleProp?.id) propVals[key] = structuredCloneSafe(initialValues[key]);
    }
    const statusProp = db.schema.find(p => p.type === 'status');
    if (statusProp && propVals[statusProp.id] === undefined && statusProp.options?.length) {
      propVals[statusProp.id] = statusProp.options[0].id;
    }
    const rowPage = {
      id: uid(),
      title: typeof titleVal === 'string' ? titleVal : '',
      icon: icon || '📄',
      parentId: dbPage.id,
      databaseId: dbPage.id,
      propertyValues: propVals,
      blocks: initialBlocks.length ? structuredCloneSafe(initialBlocks) : [{ id: uid(), type: 'text', text: '' }],
      createdBy: s?.users?.[0]?.name || 'Jordan Davis',
      lastEditedBy: s?.users?.[0]?.name || 'Jordan Davis',
      createdAt: now,
      updatedAt: now
    };
    s.pages.push(rowPage);
    return rowPage;
  }

  function seedStarterRows(dbPage: any) {
    if (getDatabaseRows(dbPage.id).length) return;
    for (let k = 0; k < 3; k++) {
      createDatabaseRow(dbPage, {});
    }
  }

  function convertPageToDatabase(page: any, initialViewType: DbViewType = 'table') {
    if (!page) return page;
    page.pageKind = 'database';
    if (page.icon === '📄') page.icon = '🗃️';
    const db = ensureDatabaseConfig(page);
    if (initialViewType !== 'table' && db.views[0]) {
      db.views[0].type = initialViewType;
      db.views[0].name = viewMeta(initialViewType).label;
      if (initialViewType === 'calendar' || initialViewType === 'timeline') {
        let dateProp = db.schema.find(s => s.type === 'date');
        if (!dateProp) {
          dateProp = { id: uid(), name: 'Date', type: 'date', width: 150 };
          db.schema.push(dateProp);
          db.views[0].propertyOrder.push(dateProp.id);
          db.views[0].visiblePropertyIds.push(dateProp.id);
        }
        db.views[0].datePropertyId = dateProp.id;
      }
      if (initialViewType === 'board') {
        const statusProp = db.schema.find(s => s.type === 'status' || s.type === 'select');
        db.views[0].groupBy = statusProp?.id;
      }
    }
    seedStarterRows(page);
    return page;
  }

  function createDatabasePage(parentId?: string, title = 'Untitled database', initialViewType: DbViewType = 'table') {
    const s = getState();
    const now = Date.now();
    const dbPage: any = {
      id: uid(),
      title,
      icon: '🗃️',
      parentId,
      pageKind: 'database',
      fullWidth: true,
      blocks: [{ id: uid(), type: 'text', text: '' }],
      createdAt: now,
      updatedAt: now
    };
    s.pages.push(dbPage);
    convertPageToDatabase(dbPage, initialViewType);
    return dbPage;
  }

  function deleteDatabaseRow(rowPageId: string) {
    const s = getState();
    s.pages = s.pages.filter((p: any) => p.id !== rowPageId);
    // Clean dangling relation references
    s.pages.forEach((p: any) => {
      if (p.propertyValues) {
        Object.keys(p.propertyValues).forEach(k => {
          const val = p.propertyValues[k];
          if (Array.isArray(val) && val.includes(rowPageId)) {
            p.propertyValues[k] = val.filter(x => x !== rowPageId);
          }
        });
      }
    });
    if (activePeek?.rowId === rowPageId) closeDatabasePeek();
  }

  function structuredCloneSafe<T>(val: T): T {
    if (val == null) return val;
    try { return JSON.parse(JSON.stringify(val)); } catch { return val; }
  }

  function activeViewFor(dbPage: any, viewOverrideId?: string): DbView {
    const db = ensureDatabaseConfig(dbPage);
    if (viewOverrideId) {
      const found = db.views.find(v => v.id === viewOverrideId);
      if (found) return found;
    }
    return db.views.find(v => v.id === db.activeViewId) || db.views[0];
  }

  function resolveOption(prop: DbSchemaProperty, rawVal: any): DbSelectOption | null {
    if (!prop.options?.length || rawVal == null || rawVal === '') return null;
    const str = String(rawVal);
    return prop.options.find(o => o.id === str || o.name.toLowerCase() === str.toLowerCase()) || null;
  }

  function dateTextOf(rawVal: any): string {
    if (!rawVal) return '';
    if (typeof rawVal === 'string') return rawVal;
    if (typeof rawVal === 'object' && rawVal.start) {
      return rawVal.end ? `${rawVal.start} -> ${rawVal.end}` : rawVal.start;
    }
    return '';
  }

  function formatNumberVal(val: any, fmt?: string) {
    if (val === '' || val == null || Number.isNaN(Number(val))) return '';
    const num = Number(val);
    if (fmt === 'percent') return `${Math.round(num * 1000) / 10}%`;
    if (fmt === 'dollar') return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    if (fmt === 'euro') return `€${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }

  // Safe recursive-descent formula evaluator supporting prop("..."), literals, arithmetic, logic, and helpers.
  function evaluateDbFormula(expr: string, rowPage: any, dbPage: any, depth = 0): any {
    if (!expr || !expr.trim() || depth > 5) return '';
    const db = ensureDatabaseConfig(dbPage);
    const propValByName = (name: string) => {
      const target = db.schema.find(s => s.name.toLowerCase() === String(name).toLowerCase());
      if (!target) return '';
      if (target.type === 'formula') return evaluateDbFormula(target.formulaExpr || '', rowPage, dbPage, depth + 1);
      return getRawValue(target, rowPage, dbPage, depth + 1);
    };

    try {
      const tokens: { t: string; v: any }[] = [];
      let i = 0;
      const src = expr.trim();
      while (i < src.length) {
        const ch = src[i];
        if (/\s/.test(ch)) { i++; continue; }
        if (ch === '"' || ch === "'") {
          const quote = ch;
          i++;
          let s = '';
          while (i < src.length && src[i] !== quote) {
            if (src[i] === '\\' && i + 1 < src.length) { i++; s += src[i++]; }
            else s += src[i++];
          }
          i++;
          tokens.push({ t: 'str', v: s });
          continue;
        }
        if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1] || ''))) {
          let num = '';
          while (i < src.length && /[0-9.]/.test(src[i])) num += src[i++];
          tokens.push({ t: 'num', v: parseFloat(num) });
          continue;
        }
        if (/[a-zA-Z_]/.test(ch)) {
          let id = '';
          while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) id += src[i++];
          if (id === 'true') tokens.push({ t: 'bool', v: true });
          else if (id === 'false') tokens.push({ t: 'bool', v: false });
          else tokens.push({ t: 'id', v: id });
          continue;
        }
        const two = src.slice(i, i + 2);
        if (['==', '!=', '>=', '<=', '&&', '||'].includes(two)) {
          tokens.push({ t: 'op', v: two });
          i += 2;
          continue;
        }
        if ('+-*/%><!(),'.includes(ch)) {
          tokens.push({ t: ch === '(' || ch === ')' || ch === ',' ? ch : 'op', v: ch });
          i++;
          continue;
        }
        i++;
      }

      let pos = 0;
      const peek = () => tokens[pos];
      const consume = () => tokens[pos++];

      const callFn = (fn: string, args: any[]): any => {
        const lower = fn.toLowerCase();
        if (lower === 'prop') return propValByName(args[0] ?? '');
        if (lower === 'if') return args[0] ? args[1] : args[2];
        if (lower === 'concat') return args.map(a => a ?? '').join('');
        if (lower === 'lower') return String(args[0] ?? '').toLowerCase();
        if (lower === 'upper') return String(args[0] ?? '').toUpperCase();
        if (lower === 'trim') return String(args[0] ?? '').trim();
        if (lower === 'empty') {
          const a = args[0];
          return a == null || a === '' || (Array.isArray(a) && a.length === 0);
        }
        if (lower === 'contains') return String(args[0] ?? '').toLowerCase().includes(String(args[1] ?? '').toLowerCase());
        if (lower === 'length') return Array.isArray(args[0]) ? args[0].length : String(args[0] ?? '').length;
        if (lower === 'tonumber') return Number(args[0]) || 0;
        if (lower === 'format') return String(args[0] ?? '');
        if (lower === 'round') return Math.round(Number(args[0]) || 0);
        if (lower === 'floor') return Math.floor(Number(args[0]) || 0);
        if (lower === 'ceil') return Math.ceil(Number(args[0]) || 0);
        if (lower === 'abs') return Math.abs(Number(args[0]) || 0);
        if (lower === 'min') return Math.min(...args.map(Number));
        if (lower === 'max') return Math.max(...args.map(Number));
        if (lower === 'sum') return args.reduce((acc, x) => acc + (Number(x) || 0), 0);
        if (lower === 'now' || lower === 'today') return new Date().toISOString().slice(0, 10);
        if (lower === 'datebetween') {
          const d1 = Date.parse(String(args[0] || '')), d2 = Date.parse(String(args[1] || ''));
          if (Number.isNaN(d1) || Number.isNaN(d2)) return 0;
          const unit = String(args[2] || 'days').toLowerCase();
          const diffMs = d1 - d2;
          if (unit.startsWith('hour')) return Math.round(diffMs / 3600000);
          if (unit.startsWith('week')) return Math.round(diffMs / (7 * 86400000));
          return Math.round(diffMs / 86400000);
        }
        return '';
      };

      const parsePrimary = (): any => {
        const tk = peek();
        if (!tk) return '';
        if (tk.t === 'num' || tk.t === 'str' || tk.t === 'bool') { consume(); return tk.v; }
        if (tk.t === 'id') {
          consume();
          if (peek()?.t === '(') {
            consume();
            const args: any[] = [];
            while (peek() && peek().t !== ')') {
              args.push(parseOr());
              if (peek()?.t === ',') consume();
            }
            if (peek()?.t === ')') consume();
            return callFn(tk.v, args);
          }
          return propValByName(tk.v);
        }
        if (tk.t === '(') {
          consume();
          const val = parseOr();
          if (peek()?.t === ')') consume();
          return val;
        }
        return '';
      };
      const parseUnary = (): any => {
        const tk = peek();
        if (tk?.t === 'op' && tk.v === '!') { consume(); return !parseUnary(); }
        if (tk?.t === 'op' && tk.v === '-') { consume(); return -Number(parseUnary() || 0); }
        return parsePrimary();
      };
      const parseMul = (): any => {
        let left = parseUnary();
        while (peek()?.t === 'op' && ['*', '/', '%'].includes(peek().v)) {
          const op = consume().v, right = parseUnary();
          if (op === '*') left = (Number(left) || 0) * (Number(right) || 0);
          else if (op === '/') left = (Number(right) || 0) === 0 ? 0 : (Number(left) || 0) / Number(right);
          else left = (Number(left) || 0) % (Number(right) || 1);
        }
        return left;
      };
      const parseAdd = (): any => {
        let left = parseMul();
        while (peek()?.t === 'op' && ['+', '-'].includes(peek().v)) {
          const op = consume().v, right = parseMul();
          if (op === '+') {
            if (typeof left === 'string' || typeof right === 'string') left = String(left ?? '') + String(right ?? '');
            else left = (Number(left) || 0) + (Number(right) || 0);
          } else {
            left = (Number(left) || 0) - (Number(right) || 0);
          }
        }
        return left;
      };
      const parseCmp = (): any => {
        let left = parseAdd();
        while (peek()?.t === 'op' && ['==', '!=', '>', '>=', '<', '<='].includes(peek().v)) {
          const op = consume().v, right = parseAdd();
          if (op === '==') left = String(left ?? '') === String(right ?? '');
          else if (op === '!=') left = String(left ?? '') !== String(right ?? '');
          else if (op === '>') left = Number(left) > Number(right);
          else if (op === '>=') left = Number(left) >= Number(right);
          else if (op === '<') left = Number(left) < Number(right);
          else left = Number(left) <= Number(right);
        }
        return left;
      };
      const parseAnd = (): any => {
        let left = parseCmp();
        while (peek()?.t === 'op' && peek().v === '&&') { consume(); const r = parseCmp(); left = Boolean(left && r); }
        return left;
      };
      const parseOr = (): any => {
        let left = parseAnd();
        while (peek()?.t === 'op' && peek().v === '||') { consume(); const r = parseAnd(); left = Boolean(left || r); }
        return left;
      };
      return parseOr();
    } catch {
      return '';
    }
  }

  function getRawValue(prop: DbSchemaProperty, rowPage: any, dbPage: any, depth = 0): any {
    if (!prop || !rowPage || depth > 5) return '';
    if (prop.type === 'title') return rowPage.title || '';
    if (prop.type === 'created_time') return rowPage.createdAt ? new Date(rowPage.createdAt).toLocaleString() : '';
    if (prop.type === 'last_edited_time') return rowPage.updatedAt ? new Date(rowPage.updatedAt).toLocaleString() : '';
    if (prop.type === 'created_by') return rowPage.createdBy || getState()?.users?.[0]?.name || 'Jordan Davis';
    if (prop.type === 'last_edited_by') return rowPage.lastEditedBy || getState()?.users?.[0]?.name || 'Jordan Davis';
    if (prop.type === 'formula') return evaluateDbFormula(prop.formulaExpr || '', rowPage, dbPage, depth + 1);
    if (prop.type === 'rollup') {
      const db = ensureDatabaseConfig(dbPage);
      const relProp = db.schema.find(s => s.id === prop.rollupRelationId && s.type === 'relation');
      if (!relProp || !relProp.relationDatabaseId) return '';
      const linkedIds = Array.isArray(rowPage.propertyValues?.[relProp.id]) ? rowPage.propertyValues[relProp.id] : [];
      const targetDb = getPageById(relProp.relationDatabaseId);
      if (!targetDb || !isDatabasePage(targetDb)) return '';
      const targetSchema = ensureDatabaseConfig(targetDb).schema;
      const targetProp = targetSchema.find(s => s.id === prop.rollupTargetPropertyId) || targetSchema[0];
      const linkedRows = linkedIds.map((rid: string) => getPageById(rid)).filter(Boolean);
      const calc = prop.rollupCalc || 'count_all';
      if (calc === 'count_all') return linkedRows.length;
      const vals = linkedRows.map((lr: any) => targetProp ? getRawValue(targetProp, lr, targetDb, depth + 1) : '');
      const nonEmpty = vals.filter((v: any) => v !== '' && v != null && (!Array.isArray(v) || v.length > 0));
      if (calc === 'count_values') return nonEmpty.length;
      if (calc === 'sum') return nonEmpty.reduce((acc: number, v: any) => acc + (Number(v) || 0), 0);
      if (calc === 'average') return nonEmpty.length ? Math.round((nonEmpty.reduce((a: number, v: any) => a + (Number(v) || 0), 0) / nonEmpty.length) * 100) / 100 : 0;
      return nonEmpty.map((v: any) => (targetProp ? valueAsSearchText(targetProp, { propertyValues: { [targetProp.id]: v }, title: String(v) }, targetDb) : String(v))).join(', ');
    }
    return rowPage.propertyValues?.[prop.id];
  }

  function valueAsSearchText(prop: DbSchemaProperty, rowPage: any, dbPage: any): string {
    const raw = getRawValue(prop, rowPage, dbPage);
    if (raw == null || raw === '') return '';
    if (prop.type === 'checkbox') return raw ? 'Checked' : 'Unchecked';
    if (prop.type === 'select' || prop.type === 'status') return resolveOption(prop, raw)?.name || String(raw);
    if (prop.type === 'multi_select') {
      return (Array.isArray(raw) ? raw : []).map(v => resolveOption(prop, v)?.name || String(v)).join(', ');
    }
    if (prop.type === 'person') {
      const users = getState()?.users || [];
      return (Array.isArray(raw) ? raw : [raw]).map(uid => users.find((u: any) => u.id === uid)?.name || uid).join(', ');
    }
    if (prop.type === 'date') return dateTextOf(raw);
    if (prop.type === 'files') return (Array.isArray(raw) ? raw : []).map((f: any) => f.name || '').join(', ');
    if (prop.type === 'relation') return (Array.isArray(raw) ? raw : []).map(rid => getPageById(rid)?.title || 'Untitled').join(', ');
    if (prop.type === 'number') return String(raw);
    return String(raw);
  }

  function isValueEmpty(prop: DbSchemaProperty, rowPage: any, dbPage: any): boolean {
    const raw = getRawValue(prop, rowPage, dbPage);
    if (raw == null || raw === '') return true;
    if (prop.type === 'date') return !dateTextOf(raw);
    if (Array.isArray(raw)) return raw.length === 0;
    return false;
  }

  function matchesSingleFilter(rule: DbFilterRule, rowPage: any, dbPage: any): boolean {
    const db = ensureDatabaseConfig(dbPage);
    const prop = db.schema.find(s => s.id === rule.propertyId);
    if (!prop) return true;
    const raw = getRawValue(prop, rowPage, dbPage);
    const text = valueAsSearchText(prop, rowPage, dbPage).toLowerCase();
    const q = String(rule.value ?? '').trim().toLowerCase();
    switch (rule.op) {
      case 'is_empty': return isValueEmpty(prop, rowPage, dbPage);
      case 'is_not_empty': return !isValueEmpty(prop, rowPage, dbPage);
      case 'is_checked': return Boolean(raw);
      case 'is_unchecked': return !Boolean(raw);
      case 'contains': return !q || text.includes(q);
      case 'not_contains': return !q || !text.includes(q);
      case 'equals':
        if (prop.type === 'number') return Number(raw) === Number(rule.value);
        return text === q;
      case 'not_equals':
        if (prop.type === 'number') return Number(raw) !== Number(rule.value);
        return text !== q;
      case 'starts_with': return !q || text.startsWith(q);
      case 'ends_with': return !q || text.endsWith(q);
      case 'gt': return Number(raw) > Number(rule.value || 0);
      case 'gte': return Number(raw) >= Number(rule.value || 0);
      case 'lt': return Number(raw) < Number(rule.value || 0);
      case 'lte': return Number(raw) <= Number(rule.value || 0);
      case 'before': {
        const d = typeof raw === 'object' ? raw?.start : String(raw || '');
        return !q || (!!d && d < q);
      }
      case 'after': {
        const d = typeof raw === 'object' ? raw?.start : String(raw || '');
        return !q || (!!d && d > q);
      }
      default: return true;
    }
  }

  function queryViewRows(dbPage: any, view: DbView, searchQuery = '') {
    let rows = getDatabaseRows(dbPage.id);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const db = ensureDatabaseConfig(dbPage);
      rows = rows.filter((r: any) =>
        (r.title || '').toLowerCase().includes(q) ||
        db.schema.some(prop => valueAsSearchText(prop, r, dbPage).toLowerCase().includes(q))
      );
    }
    if (view.filters?.length) {
      const useOr = view.filterMatch === 'or';
      rows = rows.filter((r: any) => useOr
        ? view.filters.some(rule => matchesSingleFilter(rule, r, dbPage))
        : view.filters.every(rule => matchesSingleFilter(rule, r, dbPage)));
    }
    if (view.sorts?.length) {
      const db = ensureDatabaseConfig(dbPage);
      rows = [...rows].sort((a: any, b: any) => {
        for (const s of view.sorts) {
          const prop = db.schema.find(p => p.id === s.propertyId);
          if (!prop) continue;
          const dir = s.direction === 'desc' ? -1 : 1;
          const av = getRawValue(prop, a, dbPage);
          const bv = getRawValue(prop, b, dbPage);
          if (prop.type === 'number') {
            const na = av === '' || av == null ? Number.NEGATIVE_INFINITY : Number(av);
            const nb = bv === '' || bv == null ? Number.NEGATIVE_INFINITY : Number(bv);
            if (na !== nb) return (na - nb) * dir;
          } else if (prop.type === 'checkbox') {
            const ca = av ? 1 : 0, cb = bv ? 1 : 0;
            if (ca !== cb) return (ca - cb) * dir;
          } else if (prop.type === 'date') {
            const da = dateTextOf(av), dbStr = dateTextOf(bv);
            if (da !== dbStr) return da.localeCompare(dbStr) * dir;
          } else {
            const ta = valueAsSearchText(prop, a, dbPage);
            const tb = valueAsSearchText(prop, b, dbPage);
            const cmp = ta.localeCompare(tb, undefined, { numeric: true, sensitivity: 'base' });
            if (cmp !== 0) return cmp * dir;
          }
        }
        return (a.createdAt || 0) - (b.createdAt || 0);
      });
    }
    return rows;
  }

  function computeAggregation(prop: DbSchemaProperty, rows: any[], calc: DbAggregationType, dbPage: any): string {
    if (!calc || calc === 'none') return '';
    if (calc === 'count_all') return `${rows.length}`;
    const empties = rows.filter(r => isValueEmpty(prop, r, dbPage)).length;
    const nonEmpties = rows.length - empties;
    if (calc === 'count_values' || calc === 'count_not_empty') return `${nonEmpties}`;
    if (calc === 'count_empty') return `${empties}`;
    if (calc === 'percent_empty') return rows.length ? `${Math.round((empties / rows.length) * 100)}%` : '0%';
    if (calc === 'percent_not_empty') return rows.length ? `${Math.round((nonEmpties / rows.length) * 100)}%` : '0%';
    const nums = rows
      .map(r => getRawValue(prop, r, dbPage))
      .filter(v => v !== '' && v != null && !Number.isNaN(Number(v)))
      .map(Number)
      .sort((a, b) => a - b);
    if (!nums.length) return '0';
    if (calc === 'sum') return formatNumberVal(nums.reduce((a, b) => a + b, 0), prop.numberFormat);
    if (calc === 'average') return formatNumberVal(nums.reduce((a, b) => a + b, 0) / nums.length, prop.numberFormat);
    if (calc === 'median') {
      const mid = Math.floor(nums.length / 2);
      const med = nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      return formatNumberVal(med, prop.numberFormat);
    }
    if (calc === 'min') return formatNumberVal(nums[0], prop.numberFormat);
    if (calc === 'max') return formatNumberVal(nums[nums.length - 1], prop.numberFormat);
    if (calc === 'range') return formatNumberVal(nums[nums.length - 1] - nums[0], prop.numberFormat);
    return '';
  }

  function closeDbPopover() {
    if (activePopoverCleanup) {
      activePopoverCleanup();
      activePopoverCleanup = null;
    }
    if (activePopover) {
      activePopover.remove();
      activePopover = null;
    }
  }

  function openDbPopover(anchor: HTMLElement | { left: number; top: number; bottom: number; right: number }, buildFn: (pop: HTMLElement, close: () => void) => void, minWidth = 240) {
    closeDbPopover();
    const pop = document.createElement('div');
    pop.className = 'db-popover db-interactive-surface';
    pop.style.minWidth = `${minWidth}px`;
    pop.addEventListener('pointerdown', e => e.stopPropagation());
    pop.addEventListener('click', e => e.stopPropagation());
    pop.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeDbPopover();
      }
    });
    buildFn(pop, closeDbPopover);
    document.body.append(pop);

    const rect = anchor instanceof HTMLElement ? anchor.getBoundingClientRect() : anchor;
    const box = pop.getBoundingClientRect();
    const margin = 10;
    const left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, rect.left));
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    let top = rect.bottom + 4;
    if (spaceBelow < Math.min(260, box.height) && rect.top > spaceBelow) {
      top = Math.max(margin, rect.top - box.height - 4);
    }
    if (top + box.height > window.innerHeight - margin) {
      pop.style.maxHeight = `${Math.max(180, window.innerHeight - top - margin)}px`;
    }
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;

    const onDown = (e: Event) => {
      if (e.target instanceof Node && (pop.contains(e.target) || (anchor instanceof HTMLElement && anchor.contains(e.target)))) return;
      closeDbPopover();
    };
    setTimeout(() => document.addEventListener('pointerdown', onDown, true), 0);
    activePopoverCleanup = () => document.removeEventListener('pointerdown', onDown, true);
    activePopover = pop;
    return pop;
  }

  function refreshAllDatabaseViews() {
    for (const [el, rerender] of activeHostRenders.entries()) {
      if (!el.isConnected) {
        activeHostRenders.delete(el);
        continue;
      }
      rerender();
    }
    host?.renderNav?.();
    if (activePeek) renderPeekModal();
  }

  function setRowValue(rowPage: any, prop: DbSchemaProperty, value: any, dbPage: any, rerenderAll = true) {
    if (roMode()) return;
    rowPage.propertyValues = rowPage.propertyValues || {};
    if (prop.type === 'title') {
      rowPage.title = String(value ?? '');
    } else {
      rowPage.propertyValues[prop.id] = value;
    }
    rowPage.updatedAt = Date.now();
    rowPage.lastEditedBy = getState()?.users?.[0]?.name || 'Jordan Davis';
    dbPage.updatedAt = Date.now();
    persist(false);
    if (rerenderAll) refreshAllDatabaseViews();
  }

  function createPillEl(label: string, colorKey: string, isStatus = false, statusGroup?: DbStatusGroup) {
    const meta = colorMeta(colorKey);
    const pill = document.createElement('span');
    pill.className = 'db-pill' + (isStatus ? ' is-status' : '');
    pill.style.backgroundColor = meta.bg;
    pill.style.color = meta.fg;
    if (isStatus) {
      const dot = document.createElement('span');
      dot.className = 'db-status-dot' + (statusGroup === 'complete' ? ' is-complete' : statusGroup === 'in_progress' ? ' is-progress' : '');
      dot.style.backgroundColor = meta.dot;
      pill.append(dot);
    }
    const txt = document.createElement('span');
    txt.textContent = label;
    pill.append(txt);
    return pill;
  }

  // Shared cell & property-sheet renderer used identically in Table cells, Peek properties, and Full Row Page properties!
  function renderPropertyValueControl(prop: DbSchemaProperty, rowPage: any, dbPage: any, opts: { compact?: boolean; onOpenRow?: () => void; onCommit?: () => void } = {}) {
    const ro = roMode();
    const wrap = document.createElement('div');
    wrap.className = 'db-cell-control' + (opts.compact ? ' is-compact' : '');
    const commit = () => {
      opts.onCommit?.();
      refreshAllDatabaseViews();
    };
    const raw = getRawValue(prop, rowPage, dbPage);

    if (prop.type === 'title') {
      const box = document.createElement('div');
      box.className = 'db-title-cell';
      const iconBtn = document.createElement('span');
      iconBtn.className = 'db-row-icon';
      iconBtn.innerHTML = dbIconHtml(rowPage.icon);
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.className = 'db-inline-input db-title-input';
      titleInput.value = rowPage.title || '';
      titleInput.placeholder = 'Untitled';
      titleInput.disabled = ro;
      titleInput.addEventListener('click', e => e.stopPropagation());
      titleInput.addEventListener('input', () => {
        setRowValue(rowPage, prop, titleInput.value, dbPage, false);
        host?.renderNav?.();
      });
      titleInput.addEventListener('blur', () => refreshAllDatabaseViews());
      titleInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          titleInput.blur();
          opts.onOpenRow?.();
        }
      });
      box.append(iconBtn, titleInput);
      if (opts.onOpenRow) {
        const openBtn = document.createElement('button');
        openBtn.type = 'button';
        openBtn.className = 'db-open-row-btn';
        openBtn.textContent = 'OPEN';
        openBtn.title = 'Open row page (Ctrl/middle-click for new tab)';
        openBtn.onclick = e => {
          e.stopPropagation();
          if (e.ctrlKey || e.metaKey) { host?.openPageInNewTab?.(rowPage.id); return; }
          opts.onOpenRow?.();
        };
        openBtn.onauxclick = e => {
          if (e.button === 1) { e.preventDefault(); e.stopPropagation(); host?.openPageInNewTab?.(rowPage.id); }
        };
        box.append(openBtn);
      }
      wrap.append(box);
      return wrap;
    }

    if (prop.type === 'checkbox') {
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'db-checkbox-input';
      cb.checked = Boolean(raw);
      cb.disabled = ro;
      cb.setAttribute('aria-label', prop.name);
      cb.onclick = e => e.stopPropagation();
      cb.onchange = () => {
        setRowValue(rowPage, prop, cb.checked, dbPage, true);
        opts.onCommit?.();
      };
      wrap.append(cb);
      return wrap;
    }

    if (['created_time', 'last_edited_time', 'created_by', 'last_edited_by', 'formula', 'rollup'].includes(prop.type)) {
      const span = document.createElement('span');
      span.className = 'db-readonly-val' + (prop.type === 'formula' ? ' is-formula' : '');
      let disp = raw;
      if (prop.type === 'formula' && typeof raw === 'number') disp = formatNumberVal(raw, prop.numberFormat);
      else if (prop.type === 'formula' && typeof raw === 'boolean') disp = raw ? '☑ True' : '☐ False';
      span.textContent = String(disp ?? '') || (opts.compact ? '' : 'Empty');
      if (!disp) span.classList.add('is-empty');
      wrap.append(span);
      return wrap;
    }

    if (prop.type === 'select' || prop.type === 'multi_select' || prop.type === 'status') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'db-cell-trigger';
      btn.disabled = ro;
      const selectedIds = prop.type === 'multi_select'
        ? (Array.isArray(raw) ? raw : [])
        : (raw ? [raw] : []);
      if (!selectedIds.length) {
        const ph = document.createElement('span');
        ph.className = 'db-placeholder';
        ph.textContent = opts.compact ? '' : 'Empty';
        btn.append(ph);
      } else {
        const list = document.createElement('div');
        list.className = 'db-pill-list';
        selectedIds.forEach((sid: string) => {
          const opt = resolveOption(prop, sid);
          if (opt) list.append(createPillEl(opt.name, opt.color, prop.type === 'status', opt.statusGroup));
          else list.append(createPillEl(String(sid), 'default', prop.type === 'status'));
        });
        btn.append(list);
      }
      if (!ro) {
        btn.onclick = e => {
          e.stopPropagation();
          openOptionPicker(btn, prop, rowPage, dbPage, commit);
        };
      }
      wrap.append(btn);
      return wrap;
    }

    if (prop.type === 'person') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'db-cell-trigger';
      btn.disabled = ro;
      const ids: string[] = Array.isArray(raw) ? raw : (raw ? [String(raw)] : []);
      const users = getState()?.users || [];
      if (!ids.length) {
        const ph = document.createElement('span');
        ph.className = 'db-placeholder';
        ph.textContent = opts.compact ? '' : 'Empty';
        btn.append(ph);
      } else {
        const list = document.createElement('div');
        list.className = 'db-pill-list';
        ids.forEach(uidVal => {
          const u = users.find((x: any) => x.id === uidVal || x.name === uidVal) || { name: uidVal };
          const chip = document.createElement('span');
          chip.className = 'db-person-chip';
          const av = document.createElement('span');
          av.className = 'db-person-avatar';
          av.textContent = String(u.name || '?').split(/\s+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
          const nm = document.createElement('span');
          nm.textContent = u.name;
          chip.append(av, nm);
          list.append(chip);
        });
        btn.append(list);
      }
      if (!ro) {
        btn.onclick = e => {
          e.stopPropagation();
          openPersonPicker(btn, prop, rowPage, dbPage, commit);
        };
      }
      wrap.append(btn);
      return wrap;
    }

    if (prop.type === 'date') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'db-cell-trigger';
      btn.disabled = ro;
      const txt = dateTextOf(raw);
      btn.textContent = txt || (opts.compact ? '' : 'Empty');
      if (!txt) btn.classList.add('is-empty');
      if (!ro) {
        btn.onclick = e => {
          e.stopPropagation();
          openDatePicker(btn, prop, rowPage, dbPage, commit);
        };
      }
      wrap.append(btn);
      return wrap;
    }

    if (prop.type === 'files') {
      const btn = document.createElement('div');
      btn.className = 'db-cell-trigger db-files-cell';
      const files: any[] = Array.isArray(raw) ? raw : [];
      if (!files.length) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'db-placeholder-btn';
        addBtn.textContent = opts.compact ? '+ Add' : '+ Attach file or media';
        addBtn.disabled = ro;
        addBtn.onclick = e => { e.stopPropagation(); openFilesPicker(btn, prop, rowPage, dbPage, commit); };
        btn.append(addBtn);
      } else {
        files.forEach((f, idx) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'db-file-chip';
          chip.textContent = `📎 ${f.name || 'File'}`;
          chip.onclick = e => {
            e.stopPropagation();
            if (f.assetId && host?.openAssetLibrary) host.openAssetLibrary(f.assetId);
            else if (!ro) openFilesPicker(btn, prop, rowPage, dbPage, commit);
          };
          btn.append(chip);
          if (!ro && idx === files.length - 1) {
            const plus = document.createElement('button');
            plus.type = 'button';
            plus.className = 'db-mini-btn';
            plus.textContent = '+';
            plus.title = 'Manage files';
            plus.onclick = e => { e.stopPropagation(); openFilesPicker(btn, prop, rowPage, dbPage, commit); };
            btn.append(plus);
          }
        });
      }
      wrap.append(btn);
      return wrap;
    }

    if (prop.type === 'relation') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'db-cell-trigger';
      btn.disabled = ro;
      const linkedIds: string[] = Array.isArray(raw) ? raw : [];
      if (!prop.relationDatabaseId) {
        const ph = document.createElement('span');
        ph.className = 'db-placeholder';
        ph.textContent = 'Select database…';
        btn.append(ph);
      } else if (!linkedIds.length) {
        const ph = document.createElement('span');
        ph.className = 'db-placeholder';
        ph.textContent = opts.compact ? '' : 'Empty';
        btn.append(ph);
      } else {
        const list = document.createElement('div');
        list.className = 'db-pill-list';
        linkedIds.forEach(rid => {
          const linkedPage = getPageById(rid);
          const chip = document.createElement('span');
          chip.className = 'db-relation-chip';
          chip.textContent = `↗ ${linkedPage?.title || 'Untitled'}`;
          list.append(chip);
        });
        btn.append(list);
      }
      if (!ro) {
        btn.onclick = e => {
          e.stopPropagation();
          openRelationPicker(btn, prop, rowPage, dbPage, commit);
        };
      }
      wrap.append(btn);
      return wrap;
    }

    // text, number, url, email, phone
    const input = document.createElement('input');
    input.className = 'db-inline-input' + (prop.type === 'number' ? ' is-number' : '');
    input.type = prop.type === 'number' ? 'text' : prop.type === 'email' ? 'email' : prop.type === 'url' ? 'url' : 'text';
    input.disabled = ro;
    const syncDisplay = () => {
      if (prop.type === 'number' && document.activeElement !== input) {
        input.value = formatNumberVal(getRawValue(prop, rowPage, dbPage), prop.numberFormat);
      } else {
        input.value = String(getRawValue(prop, rowPage, dbPage) ?? '');
      }
    };
    syncDisplay();
    input.placeholder = opts.compact ? '' : 'Empty';
    input.addEventListener('click', e => e.stopPropagation());
    if (prop.type === 'number') {
      input.addEventListener('focus', () => {
        const cur = getRawValue(prop, rowPage, dbPage);
        input.value = cur == null ? '' : String(cur);
      });
    }
    input.addEventListener('input', () => {
      if (prop.type === 'number') {
        const cleaned = input.value.replace(/[^0-9.\-]/g, '');
        const val = cleaned === '' || cleaned === '-' ? '' : Number(cleaned);
        setRowValue(rowPage, prop, Number.isNaN(val) ? '' : val, dbPage, false);
      } else {
        setRowValue(rowPage, prop, input.value, dbPage, false);
      }
    });
    input.addEventListener('blur', () => {
      syncDisplay();
      commit();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        input.blur();
      }
    });
    wrap.append(input);
    if (prop.type === 'url' && typeof raw === 'string' && /^https?:\/\//i.test(raw.trim())) {
      const a = document.createElement('a');
      a.href = raw.trim();
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'db-ext-link';
      a.textContent = '↗';
      a.title = 'Open URL';
      a.onclick = e => e.stopPropagation();
      wrap.append(a);
    }
    return wrap;
  }

  function openOptionPicker(anchor: HTMLElement, prop: DbSchemaProperty, rowPage: any, dbPage: any, onChange: () => void) {
    prop.options = prop.options || (prop.type === 'status' ? defaultStatusOptions() : []);
    openDbPopover(anchor, (pop, close) => {
      const isMulti = prop.type === 'multi_select';
      const currentRaw = getRawValue(prop, rowPage, dbPage);
      let selectedIds: string[] = isMulti
        ? (Array.isArray(currentRaw) ? [...currentRaw] : [])
        : (currentRaw ? [String(currentRaw)] : []);

      const search = document.createElement('input');
      search.type = 'text';
      search.className = 'db-pop-search';
      search.placeholder = 'Search or create an option…';

      const listEl = document.createElement('div');
      listEl.className = 'db-pop-list';

      const renderOptions = () => {
        listEl.replaceChildren();
        const q = search.value.trim();
        const matches = (prop.options || []).filter(o => !q || o.name.toLowerCase().includes(q.toLowerCase()));
        matches.forEach(opt => {
          const row = document.createElement('div');
          row.className = 'db-pop-option-row';
          const mainBtn = document.createElement('button');
          mainBtn.type = 'button';
          mainBtn.className = 'db-pop-option-btn';
          const active = selectedIds.some(sid => {
            const resolved = resolveOption(prop, sid);
            return resolved ? resolved.id === opt.id : sid === opt.name;
          });
          mainBtn.append(createPillEl(opt.name, opt.color, prop.type === 'status', opt.statusGroup));
          const chk = document.createElement('span');
          chk.className = 'db-pop-check';
          chk.textContent = active ? '✓' : '';
          mainBtn.append(chk);
          mainBtn.onclick = () => {
            if (isMulti) {
              if (active) selectedIds = selectedIds.filter(x => x !== opt.id && x !== opt.name);
              else selectedIds.push(opt.id);
              setRowValue(rowPage, prop, [...selectedIds], dbPage, true);
              renderOptions();
              onChange();
            } else {
              const nextVal = active ? '' : opt.id;
              setRowValue(rowPage, prop, nextVal, dbPage, true);
              onChange();
              close();
            }
          };

          const colorBtn = document.createElement('button');
          colorBtn.type = 'button';
          colorBtn.className = 'db-mini-btn';
          colorBtn.title = 'Cycle color';
          colorBtn.textContent = '🎨';
          colorBtn.onclick = () => {
            const idx = DB_COLORS.findIndex(c => c.key === opt.color);
            opt.color = DB_COLORS[(idx + 1) % DB_COLORS.length].key;
            persist(false);
            renderOptions();
            refreshAllDatabaseViews();
          };
          row.append(mainBtn, colorBtn);
          listEl.append(row);
        });

        const exactExists = (prop.options || []).some(o => o.name.toLowerCase() === q.toLowerCase());
        if (q && !exactExists) {
          const createBtn = document.createElement('button');
          createBtn.type = 'button';
          createBtn.className = 'db-pop-create-btn';
          const nextColor = DB_COLORS[(prop.options!.length % (DB_COLORS.length - 1)) + 1].key;
          createBtn.append('Create ', createPillEl(q, nextColor, prop.type === 'status', 'todo'));
          createBtn.onclick = () => {
            const created: DbSelectOption = {
              id: uid(),
              name: q,
              color: nextColor,
              statusGroup: prop.type === 'status' ? 'in_progress' : undefined
            };
            prop.options!.push(created);
            if (isMulti) {
              selectedIds.push(created.id);
              setRowValue(rowPage, prop, [...selectedIds], dbPage, true);
              search.value = '';
              renderOptions();
            } else {
              setRowValue(rowPage, prop, created.id, dbPage, true);
              close();
            }
            onChange();
          };
          listEl.append(createBtn);
        }
      };

      search.addEventListener('input', renderOptions);
      search.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const createEl = listEl.querySelector('.db-pop-create-btn') as HTMLButtonElement;
          const firstOpt = listEl.querySelector('.db-pop-option-btn') as HTMLButtonElement;
          (createEl || firstOpt)?.click();
        }
      });

      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = `${prop.name}`;
      if (selectedIds.length) {
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'db-link-btn';
        clearBtn.textContent = 'Clear';
        clearBtn.onclick = () => {
          setRowValue(rowPage, prop, isMulti ? [] : '', dbPage, true);
          onChange();
          close();
        };
        header.append(clearBtn);
      }

      pop.append(header, search, listEl);
      renderOptions();
      requestAnimationFrame(() => search.focus());
    }, 250);
  }

  function openPersonPicker(anchor: HTMLElement, prop: DbSchemaProperty, rowPage: any, dbPage: any, onChange: () => void) {
    openDbPopover(anchor, (pop, close) => {
      const users = getState()?.users || [];
      const currentRaw = getRawValue(prop, rowPage, dbPage);
      let selected: string[] = Array.isArray(currentRaw) ? [...currentRaw] : (currentRaw ? [String(currentRaw)] : []);
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Select people';
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'db-link-btn';
      clearBtn.textContent = 'Clear';
      clearBtn.onclick = () => { setRowValue(rowPage, prop, [], dbPage, true); onChange(); close(); };
      header.append(clearBtn);
      const list = document.createElement('div');
      list.className = 'db-pop-list';
      const draw = () => {
        list.replaceChildren();
        users.forEach((u: any) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'db-pop-option-btn';
          const has = selected.includes(u.id);
          btn.innerHTML = `<span class="db-person-chip"><span class="db-person-avatar">${escHtml(u.name.split(/\s+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase())}</span><span>${escHtml(u.name)}</span></span><span class="db-pop-check">${has ? '✓' : ''}</span>`;
          btn.onclick = () => {
            selected = has ? selected.filter(x => x !== u.id) : [...selected, u.id];
            setRowValue(rowPage, prop, selected, dbPage, true);
            onChange();
            draw();
          };
          list.append(btn);
        });
      };
      draw();
      pop.append(header, list);
    }, 230);
  }

  function openDatePicker(anchor: HTMLElement, prop: DbSchemaProperty, rowPage: any, dbPage: any, onChange: () => void) {
    openDbPopover(anchor, (pop, close) => {
      const cur = getRawValue(prop, rowPage, dbPage);
      let start = typeof cur === 'object' ? (cur?.start || '') : String(cur || '');
      let end = typeof cur === 'object' ? (cur?.end || '') : '';
      let hasEnd = Boolean(end);

      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = prop.name;
      const todayBtn = document.createElement('button');
      todayBtn.type = 'button';
      todayBtn.className = 'db-link-btn';
      todayBtn.textContent = 'Today';
      todayBtn.onclick = () => {
        const d = new Date().toISOString().slice(0, 10);
        startInput.value = d;
        apply();
        close();
      };
      header.append(todayBtn);

      const form = document.createElement('div');
      form.className = 'db-date-form';
      const startLabel = document.createElement('label');
      startLabel.textContent = 'Start date';
      const startInput = document.createElement('input');
      startInput.type = 'date';
      startInput.value = start.slice(0, 10);
      startLabel.append(startInput);

      const rangeToggle = document.createElement('label');
      rangeToggle.className = 'db-check-label';
      const rangeCb = document.createElement('input');
      rangeCb.type = 'checkbox';
      rangeCb.checked = hasEnd;
      rangeToggle.append(rangeCb, document.createTextNode('End date'));

      const endLabel = document.createElement('label');
      endLabel.textContent = 'End date';
      endLabel.hidden = !hasEnd;
      const endInput = document.createElement('input');
      endInput.type = 'date';
      endInput.value = end.slice(0, 10);
      endLabel.append(endInput);

      const apply = () => {
        const sVal = startInput.value;
        const eVal = rangeCb.checked ? endInput.value : '';
        const val = !sVal ? '' : (eVal ? { start: sVal, end: eVal } : { start: sVal });
        setRowValue(rowPage, prop, val, dbPage, true);
        onChange();
      };

      rangeCb.onchange = () => {
        endLabel.hidden = !rangeCb.checked;
        if (!rangeCb.checked) endInput.value = '';
        apply();
      };
      startInput.onchange = apply;
      endInput.onchange = apply;

      const footer = document.createElement('div');
      footer.className = 'db-pop-footer';
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'secondary-button';
      clearBtn.textContent = 'Clear';
      clearBtn.onclick = () => { setRowValue(rowPage, prop, '', dbPage, true); onChange(); close(); };
      const doneBtn = document.createElement('button');
      doneBtn.type = 'button';
      doneBtn.className = 'primary-button';
      doneBtn.textContent = 'Done';
      doneBtn.onclick = close;
      footer.append(clearBtn, doneBtn);

      form.append(startLabel, rangeToggle, endLabel, footer);
      pop.append(header, form);
      requestAnimationFrame(() => startInput.focus());
    }, 240);
  }

  function openFilesPicker(anchor: HTMLElement, prop: DbSchemaProperty, rowPage: any, dbPage: any, onChange: () => void) {
    openDbPopover(anchor, (pop, close) => {
      const files: any[] = Array.isArray(getRawValue(prop, rowPage, dbPage)) ? [...getRawValue(prop, rowPage, dbPage)] : [];
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Files & media';
      const list = document.createElement('div');
      list.className = 'db-pop-list';
      const draw = () => {
        list.replaceChildren();
        files.forEach((f, idx) => {
          const row = document.createElement('div');
          row.className = 'db-pop-option-row';
          row.innerHTML = `<span class="db-file-chip">📎 ${escHtml(f.name || 'File')}</span>`;
          const rm = document.createElement('button');
          rm.type = 'button';
          rm.className = 'db-mini-btn';
          rm.textContent = '✕';
          rm.onclick = () => {
            files.splice(idx, 1);
            setRowValue(rowPage, prop, [...files], dbPage, true);
            onChange();
            draw();
          };
          row.append(rm);
          list.append(row);
        });
      };
      draw();

      const actions = document.createElement('div');
      actions.className = 'db-pop-footer';
      const uploadBtn = document.createElement('button');
      uploadBtn.type = 'button';
      uploadBtn.className = 'primary-button';
      uploadBtn.textContent = '↑ Upload file';
      uploadBtn.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async () => {
          const f = input.files?.[0];
          if (!f) return;
          try {
            const s = getState();
            const rec = await ArchitectBackend.ingestLocalFile(f, {
              creator: s?.users?.[0]?.name || 'Jordan Davis',
              storageMode: s?.assetStorageMode || 'local',
              previewPolicy: s?.assetPreviewPolicy
            });
            files.push({ assetId: rec.id, name: rec.name, mimeType: rec.fileType, url: rec.url });
            setRowValue(rowPage, prop, [...files], dbPage, true);
            onChange();
            draw();
          } catch {
            host?.toast?.('Could not attach file');
          }
        };
        input.click();
      };

      const libBtn = document.createElement('button');
      libBtn.type = 'button';
      libBtn.className = 'secondary-button';
      libBtn.textContent = '🗂 Asset library';
      libBtn.onclick = () => {
        const assets = typeof ArchitectBackend !== 'undefined' ? ArchitectBackend.readAssetCatalog() : [];
        if (!assets.length) { host?.toast?.('Asset library is empty'); return; }
        list.replaceChildren();
        assets.slice(0, 12).forEach((a: any) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'db-pop-option-btn';
          btn.innerHTML = `<span>▧ ${escHtml(a.name)}</span><small>${escHtml(a.category || '')}</small>`;
          btn.onclick = () => {
            files.push({ assetId: a.id, name: a.name, mimeType: a.fileType, url: a.url });
            setRowValue(rowPage, prop, [...files], dbPage, true);
            onChange();
            close();
          };
          list.append(btn);
        });
      };
      actions.append(uploadBtn, libBtn);
      pop.append(header, list, actions);
    }, 270);
  }

  function openRelationPicker(anchor: HTMLElement, prop: DbSchemaProperty, rowPage: any, dbPage: any, onChange: () => void) {
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      if (!prop.relationDatabaseId) {
        header.textContent = 'Connect to database';
        const dbs = getDatabasePages();
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        dbs.forEach((targetDb: any) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'db-pop-option-btn';
          btn.textContent = `${targetDb.icon || '🗃️'} ${targetDb.title || 'Untitled database'}`;
          btn.onclick = () => {
            prop.relationDatabaseId = targetDb.id;
            persist(false);
            refreshAllDatabaseViews();
            close();
            openRelationPicker(anchor, prop, rowPage, dbPage, onChange);
          };
          list.append(btn);
        });
        pop.append(header, list);
        return;
      }

      const targetDb = getPageById(prop.relationDatabaseId);
      header.textContent = targetDb ? `Link: ${targetDb.title}` : 'Relation';
      const list = document.createElement('div');
      list.className = 'db-pop-list';
      let selected: string[] = Array.isArray(getRawValue(prop, rowPage, dbPage)) ? [...getRawValue(prop, rowPage, dbPage)] : [];
      const candidates = targetDb ? getDatabaseRows(targetDb.id) : [];
      const draw = () => {
        list.replaceChildren();
        if (!candidates.length) {
          const empty = document.createElement('div');
          empty.className = 'db-pop-empty';
          empty.textContent = 'No pages in target database yet.';
          list.append(empty);
          return;
        }
        candidates.forEach((cand: any) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'db-pop-option-btn';
          const has = selected.includes(cand.id);
          btn.innerHTML = `<span>${escHtml(cand.icon || '📄')} ${escHtml(cand.title || 'Untitled')}</span><span class="db-pop-check">${has ? '✓' : ''}</span>`;
          btn.onclick = () => {
            selected = has ? selected.filter(x => x !== cand.id) : [...selected, cand.id];
            setRowValue(rowPage, prop, selected, dbPage, true);
            onChange();
            draw();
          };
          list.append(btn);
        });
      };
      draw();
      pop.append(header, list);
    }, 250);
  }

  function addSchemaProperty(dbPage: any, name: string, type: DbPropertyType, insertIndex?: number) {
    const db = ensureDatabaseConfig(dbPage);
    const prop: DbSchemaProperty = {
      id: uid(),
      name: name.trim() || propMeta(type).label,
      type,
      width: 155,
      options: type === 'status' ? defaultStatusOptions() : (type === 'select' || type === 'multi_select') ? [{ id: uid(), name: 'Option 1', color: 'blue' }, { id: uid(), name: 'Option 2', color: 'green' }] : undefined,
      formulaExpr: type === 'formula' ? 'prop("Name")' : undefined
    };
    const at = typeof insertIndex === 'number' ? Math.max(1, Math.min(db.schema.length, insertIndex)) : db.schema.length;
    db.schema.splice(at, 0, prop);
    db.views.forEach(v => {
      v.propertyOrder.splice(Math.min(at, v.propertyOrder.length), 0, prop.id);
      v.visiblePropertyIds.push(prop.id);
      v.columnWidths = v.columnWidths || {};
      v.columnWidths[prop.id] = 155;
    });
    persist(false);
    refreshAllDatabaseViews();
    return prop;
  }

  function openAddPropertyPopover(anchor: HTMLElement, dbPage: any, insertIndex?: number, onCreated?: (prop: DbSchemaProperty) => void) {
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Add property';
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'db-pop-search';
      nameInput.placeholder = 'Property name…';
      const list = document.createElement('div');
      list.className = 'db-pop-list';
      DB_PROPERTY_TYPES.forEach(pt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'db-pop-option-btn';
        btn.innerHTML = `<span><span class="db-prop-type-ico">${escHtml(pt.icon)}</span> ${escHtml(pt.label)}</span>`;
        btn.onclick = () => {
          const created = addSchemaProperty(dbPage, nameInput.value || pt.label, pt.type, insertIndex);
          close();
          onCreated?.(created);
        };
        list.append(btn);
      });
      pop.append(header, nameInput, list);
      requestAnimationFrame(() => nameInput.focus());
    }, 240);
  }

  function openPropertyHeaderMenu(anchor: HTMLElement, prop: DbSchemaProperty, view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    openDbPopover(anchor, (pop, close) => {
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'db-pop-search';
      nameInput.value = prop.name;
      nameInput.addEventListener('input', () => {
        prop.name = nameInput.value || 'Untitled';
        persist(false);
      });
      nameInput.addEventListener('blur', () => refreshAllDatabaseViews());
      nameInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); refreshAllDatabaseViews(); close(); }
      });

      const list = document.createElement('div');
      list.className = 'db-pop-list';
      const addAction = (icon: string, label: string, run: () => void, cls = '') => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'db-pop-option-btn ' + cls;
        b.innerHTML = `<span>${escHtml(icon)} ${escHtml(label)}</span>`;
        b.onclick = run;
        list.append(b);
      };

      if (prop.type !== 'title') {
        const typeWrap = document.createElement('label');
        typeWrap.className = 'db-pop-field-row';
        typeWrap.innerHTML = '<span>Type</span>';
        const sel = document.createElement('select');
        DB_PROPERTY_TYPES.forEach(pt => {
          const o = document.createElement('option');
          o.value = pt.type;
          o.textContent = pt.label;
          sel.append(o);
        });
        sel.value = prop.type;
        sel.onchange = () => {
          prop.type = sel.value as DbPropertyType;
          if (prop.type === 'status' && !prop.options?.length) prop.options = defaultStatusOptions();
          if ((prop.type === 'select' || prop.type === 'multi_select') && !prop.options?.length) prop.options = defaultTagOptions();
          if (prop.type === 'formula' && !prop.formulaExpr) prop.formulaExpr = 'prop("Name")';
          persist(false);
          refreshAllDatabaseViews();
          close();
          openPropertyHeaderMenu(anchor, prop, view, dbPage);
        };
        typeWrap.append(sel);
        list.append(typeWrap);
      }

      if (prop.type === 'number') {
        const fmtWrap = document.createElement('label');
        fmtWrap.className = 'db-pop-field-row';
        fmtWrap.innerHTML = '<span>Format</span>';
        const sel = document.createElement('select');
        [['number', 'Number'], ['percent', 'Percent'], ['dollar', 'US Dollar'], ['euro', 'Euro']].forEach(([k, l]) => {
          const o = document.createElement('option'); o.value = k; o.textContent = l; sel.append(o);
        });
        sel.value = prop.numberFormat || 'number';
        sel.onchange = () => { prop.numberFormat = sel.value as any; persist(false); refreshAllDatabaseViews(); };
        fmtWrap.append(sel);
        list.append(fmtWrap);
      }

      if (prop.type === 'formula') {
        const fWrap = document.createElement('div');
        fWrap.className = 'db-pop-field-col';
        fWrap.innerHTML = '<small>Formula (e.g. prop("Count") * 2)</small>';
        const fInput = document.createElement('input');
        fInput.type = 'text';
        fInput.className = 'db-pop-search';
        fInput.value = prop.formulaExpr || '';
        fInput.onchange = () => { prop.formulaExpr = fInput.value; persist(false); refreshAllDatabaseViews(); };
        fWrap.append(fInput);
        list.append(fWrap);
      }

      if (prop.type === 'relation') {
        const rWrap = document.createElement('label');
        rWrap.className = 'db-pop-field-row';
        rWrap.innerHTML = '<span>Target DB</span>';
        const sel = document.createElement('select');
        sel.innerHTML = '<option value="">Choose database…</option>';
        getDatabasePages().forEach((d: any) => {
          const o = document.createElement('option');
          o.value = d.id;
          o.textContent = d.title || 'Untitled';
          sel.append(o);
        });
        sel.value = prop.relationDatabaseId || '';
        sel.onchange = () => { prop.relationDatabaseId = sel.value; persist(false); refreshAllDatabaseViews(); };
        rWrap.append(sel);
        list.append(rWrap);
      }

      if (prop.type === 'rollup') {
        const relProps = db.schema.filter(s => s.type === 'relation');
        const rWrap = document.createElement('label');
        rWrap.className = 'db-pop-field-row';
        rWrap.innerHTML = '<span>Relation</span>';
        const relSel = document.createElement('select');
        relSel.innerHTML = '<option value="">Choose relation…</option>';
        relProps.forEach(rp => {
          const o = document.createElement('option'); o.value = rp.id; o.textContent = rp.name; relSel.append(o);
        });
        relSel.value = prop.rollupRelationId || '';
        relSel.onchange = () => { prop.rollupRelationId = relSel.value; prop.rollupTargetPropertyId = undefined; persist(false); refreshAllDatabaseViews(); close(); };
        rWrap.append(relSel);
        list.append(rWrap);

        const chosenRel = relProps.find(rp => rp.id === prop.rollupRelationId);
        const relDb = chosenRel?.relationDatabaseId ? getPageById(chosenRel.relationDatabaseId) : null;
        if (relDb && isDatabasePage(relDb)) {
          const tWrap = document.createElement('label');
          tWrap.className = 'db-pop-field-row';
          tWrap.innerHTML = '<span>Property</span>';
          const tSel = document.createElement('select');
          ensureDatabaseConfig(relDb).schema.forEach(ts => {
            const o = document.createElement('option'); o.value = ts.id; o.textContent = ts.name; tSel.append(o);
          });
          tSel.value = prop.rollupTargetPropertyId || ensureDatabaseConfig(relDb).schema[0]?.id || '';
          tSel.onchange = () => { prop.rollupTargetPropertyId = tSel.value; persist(false); refreshAllDatabaseViews(); };
          tWrap.append(tSel);
          list.append(tWrap);
        }

        const cWrap = document.createElement('label');
        cWrap.className = 'db-pop-field-row';
        cWrap.innerHTML = '<span>Calculate</span>';
        const calcSel = document.createElement('select');
        [['count_all', 'Count all'], ['count_values', 'Count values'], ['sum', 'Sum'], ['average', 'Average'], ['show_original', 'Show original']].forEach(([k, l]) => {
          const o = document.createElement('option'); o.value = k; o.textContent = l; calcSel.append(o);
        });
        calcSel.value = prop.rollupCalc || 'count_all';
        calcSel.onchange = () => { prop.rollupCalc = calcSel.value as any; persist(false); refreshAllDatabaseViews(); };
        cWrap.append(calcSel);
        list.append(cWrap);
      }

      addAction('↑', 'Sort ascending', () => {
        view.sorts = [{ propertyId: prop.id, direction: 'asc' }];
        persist(false); refreshAllDatabaseViews(); close();
      });
      addAction('↓', 'Sort descending', () => {
        view.sorts = [{ propertyId: prop.id, direction: 'desc' }];
        persist(false); refreshAllDatabaseViews(); close();
      });
      addAction('▽', 'Filter', () => {
        filterOpenByKey.set(dbPage.id, true);
        view.filters.push({ id: uid(), propertyId: prop.id, op: prop.type === 'checkbox' ? 'is_checked' : 'contains', value: '' });
        persist(false); refreshAllDatabaseViews(); close();
      });
      addAction('←', 'Insert property left', () => {
        const idx = db.schema.indexOf(prop);
        close();
        openAddPropertyPopover(anchor, dbPage, Math.max(1, idx));
      });
      addAction('→', 'Insert property right', () => {
        const idx = db.schema.indexOf(prop);
        close();
        openAddPropertyPopover(anchor, dbPage, idx + 1);
      });
      if (prop.type !== 'title') {
        addAction('👁', 'Hide in view', () => {
          view.visiblePropertyIds = view.visiblePropertyIds.filter(id => id !== prop.id);
          persist(false); refreshAllDatabaseViews(); close();
        });
        addAction('⧉', 'Duplicate property', () => {
          const copy = addSchemaProperty(dbPage, `${prop.name} copy`, prop.type, db.schema.indexOf(prop) + 1);
          copy.options = structuredCloneSafe(prop.options);
          copy.numberFormat = prop.numberFormat;
          copy.formulaExpr = prop.formulaExpr;
          persist(false); refreshAllDatabaseViews(); close();
        });
        addAction('🗑', 'Delete property', () => {
          db.schema = db.schema.filter(s => s.id !== prop.id);
          db.views.forEach(v => {
            v.visiblePropertyIds = v.visiblePropertyIds.filter(id => id !== prop.id);
            v.propertyOrder = v.propertyOrder.filter(id => id !== prop.id);
            v.filters = v.filters.filter(f => f.propertyId !== prop.id);
            v.sorts = v.sorts.filter(s => s.propertyId !== prop.id);
            if (v.groupBy === prop.id) v.groupBy = undefined;
          });
          persist(false); refreshAllDatabaseViews(); close();
        }, 'is-danger');
      }

      pop.append(nameInput, list);
      requestAnimationFrame(() => nameInput.focus());
    }, 250);
  }

  function openPropertiesMenu(anchor: HTMLElement, view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Properties';
      const toggleAll = document.createElement('button');
      toggleAll.type = 'button';
      toggleAll.className = 'db-link-btn';
      const allShown = db.schema.every(s => view.visiblePropertyIds.includes(s.id));
      toggleAll.textContent = allShown ? 'Hide all' : 'Show all';
      toggleAll.onclick = () => {
        const titleProp = db.schema.find(s => s.type === 'title');
        view.visiblePropertyIds = allShown ? (titleProp ? [titleProp.id] : []) : db.schema.map(s => s.id);
        persist(false); refreshAllDatabaseViews(); draw();
      };
      header.append(toggleAll);

      const list = document.createElement('div');
      list.className = 'db-pop-list';
      const draw = () => {
        list.replaceChildren();
        view.propertyOrder.forEach((pid, idx) => {
          const prop = db.schema.find(s => s.id === pid);
          if (!prop) return;
          const row = document.createElement('div');
          row.className = 'db-pop-option-row';
          const visible = view.visiblePropertyIds.includes(prop.id);
          const lbl = document.createElement('span');
          lbl.className = 'db-prop-label';
          lbl.innerHTML = `<span class="db-prop-type-ico">${escHtml(propMeta(prop.type).icon)}</span> ${escHtml(prop.name)}`;

          const controls = document.createElement('div');
          controls.className = 'db-prop-mini-actions';
          if (idx > 0) {
            const up = document.createElement('button');
            up.type = 'button'; up.className = 'db-mini-btn'; up.textContent = '↑'; up.title = 'Move left / up';
            up.onclick = () => {
              const tmp = view.propertyOrder[idx - 1];
              view.propertyOrder[idx - 1] = view.propertyOrder[idx];
              view.propertyOrder[idx] = tmp;
              persist(false); refreshAllDatabaseViews(); draw();
            };
            controls.append(up);
          }
          if (idx < view.propertyOrder.length - 1) {
            const dn = document.createElement('button');
            dn.type = 'button'; dn.className = 'db-mini-btn'; dn.textContent = '↓'; dn.title = 'Move right / down';
            dn.onclick = () => {
              const tmp = view.propertyOrder[idx + 1];
              view.propertyOrder[idx + 1] = view.propertyOrder[idx];
              view.propertyOrder[idx] = tmp;
              persist(false); refreshAllDatabaseViews(); draw();
            };
            controls.append(dn);
          }
          const eye = document.createElement('button');
          eye.type = 'button';
          eye.className = 'db-mini-btn ' + (visible ? 'is-on' : 'is-off');
          eye.textContent = visible ? '👁' : '🚫';
          eye.disabled = prop.type === 'title';
          eye.title = visible ? 'Hide in view' : 'Show in view';
          eye.onclick = () => {
            if (visible) view.visiblePropertyIds = view.visiblePropertyIds.filter(id => id !== prop.id);
            else view.visiblePropertyIds.push(prop.id);
            persist(false); refreshAllDatabaseViews(); draw();
          };
          controls.append(eye);
          row.append(lbl, controls);
          list.append(row);
        });
      };
      draw();

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'db-pop-create-btn';
      addBtn.textContent = '＋ New property';
      addBtn.onclick = () => {
        close();
        openAddPropertyPopover(anchor, dbPage);
      };

      pop.append(header, list, addBtn);
    }, 270);
  }

  function openSortPopover(anchor: HTMLElement, view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    openDbPopover(anchor, pop => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Sort';
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'db-link-btn';
      clear.textContent = 'Delete all';
      clear.onclick = () => { view.sorts = []; persist(false); refreshAllDatabaseViews(); draw(); };
      header.append(clear);

      const list = document.createElement('div');
      list.className = 'db-pop-list';
      const draw = () => {
        list.replaceChildren();
        view.sorts.forEach((rule, idx) => {
          const row = document.createElement('div');
          row.className = 'db-rule-row';
          const propSel = document.createElement('select');
          db.schema.forEach(s => {
            const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; propSel.append(o);
          });
          propSel.value = rule.propertyId;
          propSel.onchange = () => { rule.propertyId = propSel.value; persist(false); refreshAllDatabaseViews(); };

          const dirSel = document.createElement('select');
          [['asc', 'Ascending'], ['desc', 'Descending']].forEach(([k, l]) => {
            const o = document.createElement('option'); o.value = k; o.textContent = l; dirSel.append(o);
          });
          dirSel.value = rule.direction;
          dirSel.onchange = () => { rule.direction = dirSel.value as any; persist(false); refreshAllDatabaseViews(); };

          const rm = document.createElement('button');
          rm.type = 'button'; rm.className = 'db-mini-btn'; rm.textContent = '✕';
          rm.onclick = () => { view.sorts.splice(idx, 1); persist(false); refreshAllDatabaseViews(); draw(); };
          row.append(propSel, dirSel, rm);
          list.append(row);
        });
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'db-pop-create-btn';
        addBtn.textContent = '＋ Add sort';
        addBtn.onclick = () => {
          view.sorts.push({ propertyId: db.schema[0].id, direction: 'asc' });
          persist(false); refreshAllDatabaseViews(); draw();
        };
        list.append(addBtn);
      };
      draw();
      pop.append(header, list);
    }, 280);
  }

  function openFilterPopover(anchor: HTMLElement, view: DbView, dbPage: any, key: string) {
    filterOpenByKey.set(key, !filterOpenByKey.get(key));
    if (filterOpenByKey.get(key) && !view.filters.length) {
      const db = ensureDatabaseConfig(dbPage);
      const firstProp = db.schema[0] || db.schema[1];
      view.filters.push({ id: uid(), propertyId: firstProp.id, op: 'contains', value: '' });
      persist(false);
    }
    refreshAllDatabaseViews();
    void anchor;
  }

  function openGroupPopover(anchor: HTMLElement, view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Group by';
      const list = document.createElement('div');
      list.className = 'db-pop-list';

      const noneBtn = document.createElement('button');
      noneBtn.type = 'button';
      noneBtn.className = 'db-pop-option-btn';
      noneBtn.innerHTML = `<span>None</span><span class="db-pop-check">${!view.groupBy ? '✓' : ''}</span>`;
      noneBtn.onclick = () => {
        if (view.type === 'board') {
          host?.toast?.('Board view needs a Group by property');
          return;
        }
        view.groupBy = undefined;
        persist(false); refreshAllDatabaseViews(); close();
      };
      list.append(noneBtn);

      db.schema.filter(s => ['status', 'select', 'multi_select', 'person', 'checkbox', 'text', 'date'].includes(s.type)).forEach(prop => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'db-pop-option-btn';
        btn.innerHTML = `<span><span class="db-prop-type-ico">${escHtml(propMeta(prop.type).icon)}</span> ${escHtml(prop.name)}</span><span class="db-pop-check">${view.groupBy === prop.id ? '✓' : ''}</span>`;
        btn.onclick = () => {
          view.groupBy = prop.id;
          persist(false); refreshAllDatabaseViews(); close();
        };
        list.append(btn);
      });
      pop.append(header, list);
    }, 240);
  }

  function openViewSettingsPopover(anchor: HTMLElement, view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'View settings';

      const nameRow = document.createElement('div');
      nameRow.className = 'db-pop-field-col';
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'db-pop-search';
      nameInput.value = view.name;
      nameInput.placeholder = 'View name';
      nameInput.oninput = () => { view.name = nameInput.value || 'View'; persist(false); };
      nameInput.onblur = () => refreshAllDatabaseViews();
      nameRow.append(nameInput);

      const layoutRow = document.createElement('div');
      layoutRow.className = 'db-layout-grid';
      DB_VIEW_TYPES.forEach(vt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'db-layout-tile' + (view.type === vt.type ? ' active' : '');
        btn.innerHTML = `<span>${vt.icon}</span><small>${vt.label}</small>`;
        btn.onclick = () => {
          view.type = vt.type;
          if (vt.type === 'board' && !view.groupBy) {
            view.groupBy = db.schema.find(s => ['status', 'select', 'person', 'checkbox'].includes(s.type))?.id;
          }
          if ((vt.type === 'calendar' || vt.type === 'timeline') && !view.datePropertyId) {
            let dp = db.schema.find(s => s.type === 'date');
            if (!dp) dp = addSchemaProperty(dbPage, 'Date', 'date');
            view.datePropertyId = dp.id;
          }
          if (vt.type === 'chart' && !view.chartConfig) {
            view.chartConfig = { chartType: 'vertical_bar', xPropertyId: db.schema[1]?.id || db.schema[0].id, yMode: 'count' };
          }
          persist(false); refreshAllDatabaseViews(); close();
        };
        layoutRow.append(btn);
      });

      const list = document.createElement('div');
      list.className = 'db-pop-list';

      const openModeRow = document.createElement('label');
      openModeRow.className = 'db-pop-field-row';
      openModeRow.innerHTML = '<span>Open pages in</span>';
      const openSel = document.createElement('select');
      [['side_peek', 'Side peek'], ['center_peek', 'Center peek'], ['full_page', 'Full page']].forEach(([k, l]) => {
        const o = document.createElement('option'); o.value = k; o.textContent = l; openSel.append(o);
      });
      openSel.value = db.defaultOpenMode || 'side_peek';
      openSel.onchange = () => { db.defaultOpenMode = openSel.value as DbOpenMode; persist(false); refreshAllDatabaseViews(); };
      openModeRow.append(openSel);
      list.append(openModeRow);

      if (view.type === 'gallery' || view.type === 'board') {
        const prevRow = document.createElement('label');
        prevRow.className = 'db-pop-field-row';
        prevRow.innerHTML = '<span>Card preview</span>';
        const prevSel = document.createElement('select');
        [['none', 'None'], ['cover', 'Page cover'], ['content', 'Page content'], ['files', 'Files & media']].forEach(([k, l]) => {
          const o = document.createElement('option'); o.value = k; o.textContent = l; prevSel.append(o);
        });
        prevSel.value = view.cardPreview || 'none';
        prevSel.onchange = () => { view.cardPreview = prevSel.value as any; persist(false); refreshAllDatabaseViews(); };
        prevRow.append(prevSel);
        list.append(prevRow);
      }

      if (view.type === 'gallery') {
        const sizeRow = document.createElement('label');
        sizeRow.className = 'db-pop-field-row';
        sizeRow.innerHTML = '<span>Card size</span>';
        const sizeSel = document.createElement('select');
        [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']].forEach(([k, l]) => {
          const o = document.createElement('option'); o.value = k; o.textContent = l; sizeSel.append(o);
        });
        sizeSel.value = view.cardSize || 'medium';
        sizeSel.onchange = () => { view.cardSize = sizeSel.value as any; persist(false); refreshAllDatabaseViews(); };
        sizeRow.append(sizeSel);
        list.append(sizeRow);
      }

      if (view.type === 'calendar' || view.type === 'timeline') {
        const dateRow = document.createElement('label');
        dateRow.className = 'db-pop-field-row';
        dateRow.innerHTML = '<span>Date by</span>';
        const dateSel = document.createElement('select');
        db.schema.filter(s => s.type === 'date').forEach(dp => {
          const o = document.createElement('option'); o.value = dp.id; o.textContent = dp.name; dateSel.append(o);
        });
        dateSel.value = view.datePropertyId || '';
        dateSel.onchange = () => { view.datePropertyId = dateSel.value; persist(false); refreshAllDatabaseViews(); };
        dateRow.append(dateSel);
        list.append(dateRow);
      }

      if (view.type === 'chart') {
        view.chartConfig = view.chartConfig || { chartType: 'vertical_bar', xPropertyId: db.schema[1]?.id || db.schema[0].id, yMode: 'count' };
        const ctRow = document.createElement('label');
        ctRow.className = 'db-pop-field-row';
        ctRow.innerHTML = '<span>Chart style</span>';
        const ctSel = document.createElement('select');
        [['vertical_bar', 'Vertical bar'], ['horizontal_bar', 'Horizontal bar'], ['donut', 'Donut']].forEach(([k, l]) => {
          const o = document.createElement('option'); o.value = k; o.textContent = l; ctSel.append(o);
        });
        ctSel.value = view.chartConfig.chartType;
        ctSel.onchange = () => { view.chartConfig!.chartType = ctSel.value as any; persist(false); refreshAllDatabaseViews(); };
        ctRow.append(ctSel);
        list.append(ctRow);

        const xRow = document.createElement('label');
        xRow.className = 'db-pop-field-row';
        xRow.innerHTML = '<span>Group by</span>';
        const xSel = document.createElement('select');
        db.schema.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; xSel.append(o); });
        xSel.value = view.chartConfig.xPropertyId;
        xSel.onchange = () => { view.chartConfig!.xPropertyId = xSel.value; persist(false); refreshAllDatabaseViews(); };
        xRow.append(xSel);
        list.append(xRow);
      }

      const wrapBtn = document.createElement('button');
      wrapBtn.type = 'button';
      wrapBtn.className = 'db-pop-option-btn';
      wrapBtn.innerHTML = `<span>Wrap all properties</span><span class="db-pop-check">${view.wrapCells ? '✓' : ''}</span>`;
      wrapBtn.onclick = () => { view.wrapCells = !view.wrapCells; persist(false); refreshAllDatabaseViews(); close(); };
      list.append(wrapBtn);

      const titleBtn = document.createElement('button');
      titleBtn.type = 'button';
      titleBtn.className = 'db-pop-option-btn';
      titleBtn.innerHTML = `<span>Show database title</span><span class="db-pop-check">${db.showTitle !== false ? '✓' : ''}</span>`;
      titleBtn.onclick = () => { db.showTitle = db.showTitle === false ? true : false; persist(false); refreshAllDatabaseViews(); close(); };
      list.append(titleBtn);

      const dupBtn = document.createElement('button');
      dupBtn.type = 'button';
      dupBtn.className = 'db-pop-option-btn';
      dupBtn.innerHTML = '<span>⧉ Duplicate view</span>';
      dupBtn.onclick = () => {
        const copy = { ...structuredCloneSafe(view), id: uid(), name: `${view.name} copy` };
        db.views.push(copy);
        db.activeViewId = copy.id;
        persist(false); refreshAllDatabaseViews(); close();
      };
      list.append(dupBtn);

      if (db.views.length > 1) {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'db-pop-option-btn is-danger';
        delBtn.innerHTML = '<span>🗑 Delete view</span>';
        delBtn.onclick = () => {
          db.views = db.views.filter(v => v.id !== view.id);
          db.activeViewId = db.views[0].id;
          persist(false); refreshAllDatabaseViews(); close();
        };
        list.append(delBtn);
      }

      pop.append(header, nameRow, layoutRow, list);
    }, 300);
  }

  function openAddViewPopover(anchor: HTMLElement, dbPage: any, onSelectView: (v: DbView) => void) {
    const db = ensureDatabaseConfig(dbPage);
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Add a new view';
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'db-pop-search';
      nameInput.placeholder = 'View name (optional)…';
      const grid = document.createElement('div');
      grid.className = 'db-layout-grid';
      DB_VIEW_TYPES.forEach(vt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'db-layout-tile';
        btn.title = vt.desc;
        btn.innerHTML = `<span>${vt.icon}</span><small>${vt.label}</small>`;
        btn.onclick = () => {
          if (vt.type === 'calendar' || vt.type === 'timeline') {
            if (!db.schema.some(s => s.type === 'date')) addSchemaProperty(dbPage, 'Date', 'date');
          }
          const created = buildDefaultView(db.schema, vt.type, nameInput.value.trim() || vt.label);
          db.views.push(created);
          persist(false);
          onSelectView(created);
          close();
        };
        grid.append(btn);
      });
      pop.append(header, nameInput, grid);
      requestAnimationFrame(() => nameInput.focus());
    }, 280);
  }

  function openDatabaseRow(rowPage: any, dbPage: any, rowOrderIds?: string[], overrideMode?: DbOpenMode) {
    if (!rowPage) return;
    const db = ensureDatabaseConfig(dbPage);
    const mode = overrideMode || db.defaultOpenMode || 'side_peek';
    if (mode === 'full_page') {
      closeDatabasePeek();
      host?.navigateToPage?.(rowPage.id);
      return;
    }
    activePeek = {
      rowId: rowPage.id,
      dbPageId: dbPage.id,
      mode: mode === 'center_peek' ? 'center_peek' : 'side_peek',
      rowOrder: rowOrderIds
    };
    renderPeekModal();
  }

  function closeDatabasePeek() {
    activePeek = null;
    const layer = document.getElementById('db-peek-layer');
    if (layer) {
      layer.hidden = true;
      layer.replaceChildren();
    }
  }

  function ensurePeekLayer(): HTMLElement {
    let layer = document.getElementById('db-peek-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'db-peek-layer';
      layer.className = 'db-peek-layer db-interactive-surface';
      layer.hidden = true;
      document.body.append(layer);
    }
    return layer;
  }

  function renderPeekModal() {
    if (!activePeek) return;
    const rowPage = getPageById(activePeek.rowId);
    const dbPage = getPageById(activePeek.dbPageId);
    if (!rowPage || !dbPage) { closeDatabasePeek(); return; }
    const ro = roMode();
    const db = ensureDatabaseConfig(dbPage);
    const layer = ensurePeekLayer();
    layer.hidden = false;
    layer.className = `db-peek-layer db-interactive-surface ${activePeek.mode === 'center_peek' ? 'is-center' : 'is-side'}`;
    layer.replaceChildren();

    const backdrop = document.createElement('div');
    backdrop.className = 'db-peek-backdrop';
    backdrop.onclick = closeDatabasePeek;

    const panel = document.createElement('aside');
    panel.className = 'db-peek-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', rowPage.title || 'Untitled page');
    panel.onclick = e => e.stopPropagation();

    const topbar = document.createElement('div');
    topbar.className = 'db-peek-topbar';

    const leftNav = document.createElement('div');
    leftNav.className = 'db-peek-controls';

    const modeBtn = document.createElement('button');
    modeBtn.type = 'button';
    modeBtn.className = 'db-toolbar-btn';
    modeBtn.textContent = activePeek.mode === 'center_peek' ? '◰ Center peek ▾' : '◨ Side peek ▾';
    modeBtn.onclick = () => {
      openDbPopover(modeBtn, (pop, close) => {
        [['side_peek', '◨ Side peek'], ['center_peek', '◰ Center peek'], ['full_page', '⤢ Full page']].forEach(([m, lbl]) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'db-pop-option-btn';
          b.innerHTML = `<span>${lbl}</span><span class="db-pop-check">${activePeek?.mode === m ? '✓' : ''}</span>`;
          b.onclick = () => {
            close();
            if (m === 'full_page') {
              openDatabaseRow(rowPage, dbPage, activePeek?.rowOrder, 'full_page');
            } else if (activePeek) {
              activePeek.mode = m as any;
              db.defaultOpenMode = m as DbOpenMode;
              persist(false);
              renderPeekModal();
            }
          };
          pop.append(b);
        });
      }, 190);
    };

    const fullBtn = document.createElement('button');
    fullBtn.type = 'button';
    fullBtn.className = 'db-toolbar-btn';
    fullBtn.textContent = '⤢ Full page';
    fullBtn.onclick = e => {
      if (e.ctrlKey || e.metaKey) {
        closeDatabasePeek();
        host?.openPageInNewTab?.(rowPage.id);
        return;
      }
      openDatabaseRow(rowPage, dbPage, activePeek?.rowOrder, 'full_page');
    };

    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.className = 'db-toolbar-btn';
    tabBtn.textContent = '↗ New tab';
    tabBtn.title = 'Open row in new Architect tab';
    tabBtn.onclick = () => {
      closeDatabasePeek();
      host?.openPageInNewTab?.(rowPage.id);
    };

    const order = activePeek.rowOrder || getDatabaseRows(dbPage.id).map((r: any) => r.id);
    const curIdx = order.indexOf(rowPage.id);
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button'; prevBtn.className = 'db-toolbar-btn'; prevBtn.textContent = '‹';
    prevBtn.title = 'Previous page';
    prevBtn.disabled = curIdx <= 0;
    prevBtn.onclick = () => {
      if (curIdx > 0) openDatabaseRow(getPageById(order[curIdx - 1]), dbPage, order, activePeek?.mode);
    };
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button'; nextBtn.className = 'db-toolbar-btn'; nextBtn.textContent = '›';
    nextBtn.title = 'Next page';
    nextBtn.disabled = curIdx < 0 || curIdx >= order.length - 1;
    nextBtn.onclick = () => {
      if (curIdx >= 0 && curIdx < order.length - 1) openDatabaseRow(getPageById(order[curIdx + 1]), dbPage, order, activePeek?.mode);
    };

    const dbCrumb = document.createElement('span');
    dbCrumb.className = 'db-peek-crumb';
    dbCrumb.innerHTML = `${dbIconHtml(dbPage.icon, '🗃️')} <span>${escHtml(dbPage.title || 'Database')}</span>`;
    leftNav.append(modeBtn, fullBtn, tabBtn, prevBtn, nextBtn, dbCrumb);

    const rightNav = document.createElement('div');
    rightNav.className = 'db-peek-controls';
    if (!ro) {
      const favBtn = document.createElement('button');
      favBtn.type = 'button'; favBtn.className = 'db-toolbar-btn';
      favBtn.textContent = rowPage.favorite ? '★' : '☆';
      favBtn.title = 'Toggle favorite';
      favBtn.onclick = () => { rowPage.favorite = !rowPage.favorite; persist(false); refreshAllDatabaseViews(); };

      const delBtn = document.createElement('button');
      delBtn.type = 'button'; delBtn.className = 'db-toolbar-btn is-danger';
      delBtn.textContent = '🗑';
      delBtn.title = 'Delete row page';
      delBtn.onclick = () => {
        deleteDatabaseRow(rowPage.id);
        persist(false);
        closeDatabasePeek();
        refreshAllDatabaseViews();
      };
      rightNav.append(favBtn, delBtn);
    }
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button'; closeBtn.className = 'db-toolbar-btn'; closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Close peek panel');
    closeBtn.onclick = closeDatabasePeek;
    rightNav.append(closeBtn);
    topbar.append(leftNav, rightNav);

    const scroll = document.createElement('div');
    scroll.className = 'db-peek-scroll';

    const titleRow = document.createElement('div');
    titleRow.className = 'db-peek-title-row';
    const iconBtn = document.createElement('button');
    iconBtn.type = 'button';
    iconBtn.className = 'db-peek-icon';
    iconBtn.innerHTML = dbIconHtml(rowPage.icon);
    iconBtn.disabled = ro;
    if (!ro) iconBtn.onclick = () => host?.iconPicker?.(rowPage);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'db-peek-title-input';
    titleInput.value = rowPage.title || '';
    titleInput.placeholder = 'Untitled';
    titleInput.disabled = ro;
    titleInput.addEventListener('input', () => {
      rowPage.title = titleInput.value;
      rowPage.updatedAt = Date.now();
      persist(false);
      // Sync visible titles cleanly without rebuilding peek itself
      for (const [el, rerender] of activeHostRenders.entries()) {
        if (el.isConnected) rerender();
      }
      host?.renderNav?.();
    });
    titleRow.append(iconBtn, titleInput);

    const propsSheet = renderRowDatabaseProperties(rowPage, dbPage, { inPeek: true });

    const bodyDivider = document.createElement('hr');
    bodyDivider.className = 'db-peek-divider';

    const bodyHost = document.createElement('div');
    bodyHost.className = 'db-peek-blocks';
    const blocks: any[] = rowPage.blocks || (rowPage.blocks = [{ id: uid(), type: 'text', text: '' }]);
    const drawBlocks = () => {
      bodyHost.replaceChildren();
      blocks.forEach((b, idx) => {
        const bRow = document.createElement('div');
        bRow.className = `db-peek-block db-peek-block-${b.type}`;
        if (b.type === 'todo') {
          const cb = document.createElement('input');
          cb.type = 'checkbox'; cb.checked = !!b.checked; cb.disabled = ro;
          cb.onchange = () => { b.checked = cb.checked; rowPage.updatedAt = Date.now(); persist(false); };
          bRow.append(cb);
        } else if (b.type === 'bullet') {
          const bullet = document.createElement('span');
          bullet.className = 'db-peek-bullet';
          bullet.textContent = '•';
          bRow.append(bullet);
        } else if (b.type === 'numbered') {
          const num = document.createElement('span');
          num.className = 'db-peek-bullet';
          num.textContent = `${idx + 1}.`;
          bRow.append(num);
        }
        const ed = document.createElement('div');
        ed.className = 'db-peek-block-edit';
        ed.contentEditable = ro ? 'false' : 'true';
        ed.textContent = b.text || '';
        ed.dataset.placeholder = idx === 0 ? 'Write notes or body content for this row…' : 'Type something…';
        if (!ro) {
          ed.addEventListener('input', () => {
            b.text = ed.innerText.replace(/\u200b/g, '');
            b.html = undefined;
            rowPage.updatedAt = Date.now();
            persist(false);
          });
          ed.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const nextType = ['bullet', 'numbered', 'todo'].includes(b.type) && b.text.trim() ? b.type : 'text';
              const nextB = { id: uid(), type: nextType, text: '' };
              blocks.splice(idx + 1, 0, nextB);
              persist(false);
              drawBlocks();
              requestAnimationFrame(() => {
                const edits = bodyHost.querySelectorAll('.db-peek-block-edit');
                (edits[idx + 1] as HTMLElement)?.focus();
              });
            } else if (e.key === 'Backspace' && !ed.innerText.trim() && blocks.length > 1) {
              e.preventDefault();
              blocks.splice(idx, 1);
              persist(false);
              drawBlocks();
              requestAnimationFrame(() => {
                const edits = bodyHost.querySelectorAll('.db-peek-block-edit');
                (edits[Math.max(0, idx - 1)] as HTMLElement)?.focus();
              });
            }
          });
        }
        bRow.append(ed);
        bodyHost.append(bRow);
      });
      if (!ro) {
        const addBlockBtn = document.createElement('button');
        addBlockBtn.type = 'button';
        addBlockBtn.className = 'db-link-btn db-peek-add-block';
        addBlockBtn.textContent = '＋ Add block';
        addBlockBtn.onclick = () => {
          blocks.push({ id: uid(), type: 'text', text: '' });
          persist(false);
          drawBlocks();
        };
        bodyHost.append(addBlockBtn);
      }
    };
    drawBlocks();

    scroll.append(titleRow, propsSheet, bodyDivider, bodyHost);
    panel.append(topbar, scroll);
    layer.append(backdrop, panel);
  }

  function renderRowDatabaseProperties(rowPage: any, dbPage: any, opts: { inPeek?: boolean } = {}) {
    const db = ensureDatabaseConfig(dbPage);
    const ro = roMode();
    const sheet = document.createElement('div');
    sheet.className = 'db-row-prop-sheet';
    const order = db.views[0]?.propertyOrder || db.schema.map(s => s.id);
    order.forEach(pid => {
      const prop = db.schema.find(s => s.id === pid);
      if (!prop || prop.type === 'title') return;
      const r = document.createElement('div');
      r.className = 'db-row-prop-item';
      const labelBtn = document.createElement('button');
      labelBtn.type = 'button';
      labelBtn.className = 'db-row-prop-key';
      labelBtn.innerHTML = `<span class="db-prop-type-ico">${escHtml(propMeta(prop.type).icon)}</span><span>${escHtml(prop.name)}</span>`;
      if (!ro) {
        labelBtn.onclick = () => openPropertyHeaderMenu(labelBtn, prop, activeViewFor(dbPage), dbPage);
      }
      const valHost = document.createElement('div');
      valHost.className = 'db-row-prop-val';
      valHost.append(renderPropertyValueControl(prop, rowPage, dbPage, { compact: false }));
      r.append(labelBtn, valHost);
      sheet.append(r);
    });
    if (!ro) {
      const addProp = document.createElement('button');
      addProp.type = 'button';
      addProp.className = 'db-link-btn db-row-add-prop';
      addProp.textContent = '＋ Add a property';
      addProp.onclick = () => openAddPropertyPopover(addProp, dbPage, undefined, () => {
        if (opts.inPeek) renderPeekModal();
        else host?.render?.();
      });
      sheet.append(addProp);
    }
    return sheet;
  }

  // Group builder shared across Table (when groupBy active), Board, and List
  function buildGroupsForRows(rows: any[], groupProp: DbSchemaProperty | undefined, dbPage: any) {
    if (!groupProp) return [{ key: '__all__', label: 'All pages', color: 'default' as DbColorKey, rows }];
    const groups: { key: string; label: string; color: DbColorKey; statusGroup?: DbStatusGroup; rows: any[] }[] = [];
    const byKey = new Map<string, any>();

    const ensureBucket = (key: string, label: string, color: DbColorKey = 'default', statusGroup?: DbStatusGroup) => {
      let g = byKey.get(key);
      if (!g) {
        g = { key, label, color, statusGroup, rows: [] };
        byKey.set(key, g);
        groups.push(g);
      }
      return g;
    };

    if (groupProp.type === 'status' || groupProp.type === 'select') {
      (groupProp.options || []).forEach(o => ensureBucket(o.id, o.name, o.color, o.statusGroup));
      ensureBucket('__none__', `No ${groupProp.name}`, 'gray');
      rows.forEach(r => {
        const raw = getRawValue(groupProp, r, dbPage);
        const opt = resolveOption(groupProp, raw);
        const bucket = opt ? ensureBucket(opt.id, opt.name, opt.color, opt.statusGroup) : byKey.get('__none__');
        bucket.rows.push(r);
      });
      return groups;
    }

    if (groupProp.type === 'person') {
      (getState()?.users || []).forEach((u: any) => ensureBucket(u.id, u.name, 'blue'));
      ensureBucket('__none__', `No ${groupProp.name}`, 'gray');
      rows.forEach(r => {
        const raw = getRawValue(groupProp, r, dbPage);
        const ids = Array.isArray(raw) ? raw : (raw ? [String(raw)] : []);
        if (!ids.length) byKey.get('__none__').rows.push(r);
        else ids.forEach(uidVal => {
          const u = (getState()?.users || []).find((x: any) => x.id === uidVal || x.name === uidVal);
          ensureBucket(u?.id || uidVal, u?.name || uidVal, 'blue').rows.push(r);
        });
      });
      return groups;
    }

    if (groupProp.type === 'checkbox') {
      ensureBucket('true', 'Checked', 'green');
      ensureBucket('false', 'Unchecked', 'gray');
      rows.forEach(r => ensureBucket(getRawValue(groupProp, r, dbPage) ? 'true' : 'false', '', 'default').rows.push(r));
      return groups;
    }

    rows.forEach(r => {
      const txt = valueAsSearchText(groupProp, r, dbPage) || `No ${groupProp.name}`;
      ensureBucket(txt, txt, txt.startsWith('No ') ? 'gray' : 'blue').rows.push(r);
    });
    if (!groups.length) ensureBucket('__none__', `No ${groupProp.name}`, 'gray');
    return groups;
  }

  function assignGroupValueToRow(rowPage: any, groupProp: DbSchemaProperty, groupKey: string, dbPage: any) {
    if (!groupProp || groupKey === '__all__') return;
    if (groupKey === '__none__') {
      setRowValue(rowPage, groupProp, groupProp.type === 'person' || groupProp.type === 'multi_select' ? [] : '', dbPage, true);
      return;
    }
    if (groupProp.type === 'status' || groupProp.type === 'select') {
      setRowValue(rowPage, groupProp, groupKey, dbPage, true);
    } else if (groupProp.type === 'person') {
      setRowValue(rowPage, groupProp, [groupKey], dbPage, true);
    } else if (groupProp.type === 'checkbox') {
      setRowValue(rowPage, groupProp, groupKey === 'true', dbPage, true);
    } else {
      setRowValue(rowPage, groupProp, groupKey, dbPage, true);
    }
  }

  // ==================== VIEW LAYOUT RENDERERS ====================

  function renderTableView(canvas: HTMLElement, rows: any[], view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    const ro = roMode();
    const cols = view.propertyOrder
      .filter(pid => view.visiblePropertyIds.includes(pid))
      .map(pid => db.schema.find(s => s.id === pid))
      .filter(Boolean) as DbSchemaProperty[];

    const scroll = document.createElement('div');
    scroll.className = 'db-table-scroll';
    const table = document.createElement('table');
    table.className = 'db-table' + (view.wrapCells ? ' is-wrap' : '');

    const colgroup = document.createElement('colgroup');
    cols.forEach(col => {
      const c = document.createElement('col');
      const w = view.columnWidths?.[col.id] || col.width || (col.type === 'title' ? 250 : 155);
      c.style.width = `${w}px`;
      colgroup.append(c);
    });
    if (!ro) {
      const addCol = document.createElement('col');
      addCol.style.width = '42px';
      colgroup.append(addCol);
    }
    table.append(colgroup);

    const thead = document.createElement('thead');
    const headTr = document.createElement('tr');
    cols.forEach((col, cIdx) => {
      const th = document.createElement('th');
      th.className = 'db-th';
      const inner = document.createElement('div');
      inner.className = 'db-th-inner';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'db-th-btn';
      btn.innerHTML = `<span class="db-prop-type-ico">${escHtml(propMeta(col.type).icon)}</span><span class="db-th-label">${escHtml(col.name)}</span>`;
      btn.onclick = () => openPropertyHeaderMenu(btn, col, view, dbPage);
      inner.append(btn);

      if (!ro) {
        const resizer = document.createElement('div');
        resizer.className = 'db-col-resizer';
        resizer.title = 'Drag to resize column';
        resizer.onpointerdown = e => {
          e.preventDefault();
          e.stopPropagation();
          const startX = e.clientX;
          const colEl = colgroup.children[cIdx] as HTMLElement;
          const startW = th.getBoundingClientRect().width;
          const onMove = (ev: PointerEvent) => {
            const nextW = Math.max(90, Math.min(540, Math.round(startW + (ev.clientX - startX))));
            view.columnWidths = view.columnWidths || {};
            view.columnWidths[col.id] = nextW;
            if (colEl) colEl.style.width = `${nextW}px`;
          };
          const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            persist(false);
          };
          window.addEventListener('pointermove', onMove);
          window.addEventListener('pointerup', onUp, { once: true });
        };
        inner.append(resizer);
      }
      th.append(inner);
      headTr.append(th);
    });
    if (!ro) {
      const addTh = document.createElement('th');
      addTh.className = 'db-th db-th-add';
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'db-th-add-btn';
      addBtn.textContent = '+';
      addBtn.title = 'Add property';
      addBtn.setAttribute('aria-label', 'Add property');
      addBtn.onclick = () => openAddPropertyPopover(addBtn, dbPage);
      addTh.append(addBtn);
      headTr.append(addTh);
    }
    thead.append(headTr);
    table.append(thead);

    const tbody = document.createElement('tbody');
    const rowOrderIds = rows.map((r: any) => r.id);
    const groupProp = view.groupBy ? db.schema.find(s => s.id === view.groupBy) : undefined;
    const groups = buildGroupsForRows(rows, groupProp, dbPage);

    groups.forEach(group => {
      const collapsed = (view.collapsedGroups || []).includes(group.key);
      if (groupProp) {
        const gTr = document.createElement('tr');
        gTr.className = 'db-table-group-row';
        const gTd = document.createElement('td');
        gTd.colSpan = cols.length + (ro ? 0 : 1);
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'db-group-toggle';
        toggle.textContent = collapsed ? '▸' : '▾';
        toggle.onclick = () => {
          view.collapsedGroups = view.collapsedGroups || [];
          view.collapsedGroups = collapsed ? view.collapsedGroups.filter(x => x !== group.key) : [...view.collapsedGroups, group.key];
          persist(false); refreshAllDatabaseViews();
        };
        const count = document.createElement('span');
        count.className = 'db-group-count';
        count.textContent = String(group.rows.length);
        gTd.append(toggle, createPillEl(group.label, group.color, groupProp.type === 'status', group.statusGroup), count);
        gTr.append(gTd);
        tbody.append(gTr);
      }

      if (!collapsed) {
        group.rows.forEach(rowPage => {
          const tr = document.createElement('tr');
          tr.className = 'db-tr';
          tr.dataset.rowId = rowPage.id;
          cols.forEach(col => {
            const td = document.createElement('td');
            td.className = 'db-td' + (col.type === 'title' ? ' is-title-col' : '');
            td.append(renderPropertyValueControl(col, rowPage, dbPage, {
              compact: true,
              onOpenRow: col.type === 'title' ? () => openDatabaseRow(rowPage, dbPage, rowOrderIds) : undefined
            }));
            tr.append(td);
          });
          if (!ro) {
            const blankTd = document.createElement('td');
            blankTd.className = 'db-td db-td-spacer';
            tr.append(blankTd);
          }
          tbody.append(tr);
        });
      }
    });

    if (!ro) {
      const newTr = document.createElement('tr');
      newTr.className = 'db-new-row';
      const newTd = document.createElement('td');
      newTd.colSpan = cols.length + 1;
      const addRowBtn = document.createElement('button');
      addRowBtn.type = 'button';
      addRowBtn.className = 'db-new-row-btn';
      addRowBtn.textContent = '＋ New page';
      addRowBtn.onclick = () => {
        const created = createDatabaseRow(dbPage, {});
        persist(false);
        refreshAllDatabaseViews();
        requestAnimationFrame(() => {
          const inp = scroll.querySelector(`tr[data-row-id="${CSS.escape(created.id)}"] .db-title-input`) as HTMLInputElement;
          inp?.focus();
        });
      };
      newTd.append(addRowBtn);
      newTr.append(newTd);
      tbody.append(newTr);
    }

    table.append(tbody);

    // Calculation summary footer row
    const tfoot = document.createElement('tfoot');
    const footTr = document.createElement('tr');
    footTr.className = 'db-calc-row';
    cols.forEach(col => {
      const td = document.createElement('td');
      td.className = 'db-calc-td';
      const calcType = view.calculations?.[col.id] || 'none';
      const val = calcType !== 'none' ? computeAggregation(col, rows, calcType, dbPage) : '';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'db-calc-btn' + (calcType !== 'none' ? ' has-calc' : '');
      if (calcType !== 'none') {
        const label = DB_AGGREGATIONS.find(a => a.key === calcType)?.label || '';
        btn.innerHTML = `<span class="db-calc-label">${escHtml(label)}</span> <strong>${escHtml(val)}</strong>`;
      } else {
        btn.textContent = 'Calculate ▾';
      }
      if (!ro) {
        btn.onclick = () => {
          openDbPopover(btn, (pop, close) => {
            DB_AGGREGATIONS.filter(a => !a.numericOnly || col.type === 'number').forEach(agg => {
              const b = document.createElement('button');
              b.type = 'button';
              b.className = 'db-pop-option-btn';
              b.innerHTML = `<span>${escHtml(agg.label)}</span><span class="db-pop-check">${calcType === agg.key ? '✓' : ''}</span>`;
              b.onclick = () => {
                view.calculations = view.calculations || {};
                view.calculations[col.id] = agg.key;
                persist(false); refreshAllDatabaseViews(); close();
              };
              pop.append(b);
            });
          }, 200);
        };
      }
      td.append(btn);
      footTr.append(td);
    });
    if (!ro) {
      const spacer = document.createElement('td');
      footTr.append(spacer);
    }
    tfoot.append(footTr);
    table.append(tfoot);

    scroll.append(table);
    canvas.append(scroll);
  }

  function cardPreviewMarkup(rowPage: any, dbPage: any, previewMode: string) {
    if (!previewMode || previewMode === 'none') return null;
    const box = document.createElement('div');
    box.className = 'db-card-preview';
    if (previewMode === 'cover' && (rowPage.cover || rowPage.coverAssetId)) {
      if (rowPage.cover) box.style.backgroundImage = `url("${rowPage.cover}")`;
      if (rowPage.coverAssetId && typeof ArchitectBackend !== 'undefined') {
        const coverAsset = ArchitectBackend.readAssetCatalog().find((a: any) => a.id === rowPage.coverAssetId);
        if (coverAsset) {
          ArchitectBackend.resolveAssetPreviewUrl(coverAsset).then((url: string | null) => {
            if (url && box.isConnected) box.style.backgroundImage = `url("${url}")`;
          }).catch(() => {});
        }
      }
      box.classList.add('has-image');
      return box;
    }
    const textPreview = (rowPage.blocks || []).map((b: any) => b.text).filter(Boolean).join(' ').trim();
    if (previewMode === 'files') {
      const db = ensureDatabaseConfig(dbPage);
      const fileProp = db.schema.find(s => s.type === 'files');
      const files = fileProp ? (getRawValue(fileProp, rowPage, dbPage) || []) : [];
      if (files.length) {
        box.textContent = files.map((f: any) => `📎 ${f.name}`).join('\n');
        return box;
      }
    }
    if (textPreview) {
      box.textContent = textPreview.slice(0, 120);
      return box;
    }
    return null;
  }

  function wireRowTrigger(el: HTMLElement, rowPage: any, dbPage: any, rowOrderIds: string[]) {
    el.dataset.rowId = rowPage.id;
    el.addEventListener('click', e => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        host?.openPageInNewTab?.(rowPage.id);
        return;
      }
      openDatabaseRow(rowPage, dbPage, rowOrderIds);
    });
    el.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });
    el.addEventListener('auxclick', e => {
      if (e.button === 1) {
        e.preventDefault();
        e.stopPropagation();
        host?.openPageInNewTab?.(rowPage.id);
      }
    });
  }

  function buildRowCard(rowPage: any, view: DbView, dbPage: any, rowOrderIds: string[], opts: { draggable?: boolean } = {}) {
    const db = ensureDatabaseConfig(dbPage);
    const ro = roMode();
    const card = document.createElement('div');
    card.className = 'db-card';
    if (opts.draggable && !ro) {
      card.draggable = true;
      card.ondragstart = e => {
        e.dataTransfer?.setData('application/x-db-row', rowPage.id);
        card.classList.add('is-dragging');
      };
      card.ondragend = () => card.classList.remove('is-dragging');
    }
    wireRowTrigger(card, rowPage, dbPage, rowOrderIds);

    const previewEl = cardPreviewMarkup(rowPage, dbPage, view.cardPreview || 'none');
    if (previewEl) card.append(previewEl);

    const titleLine = document.createElement('div');
    titleLine.className = 'db-card-title';
    titleLine.innerHTML = `${dbIconHtml(rowPage.icon)} <span>${escHtml(rowPage.title || 'Untitled')}</span>`;
    card.append(titleLine);

    if (view.showPropertiesOnCards !== false) {
      const propsWrap = document.createElement('div');
      propsWrap.className = 'db-card-props';
      view.propertyOrder.forEach(pid => {
        if (!view.visiblePropertyIds.includes(pid)) return;
        const prop = db.schema.find(s => s.id === pid);
        if (!prop || prop.type === 'title' || isValueEmpty(prop, rowPage, dbPage)) return;
        const item = document.createElement('div');
        item.className = 'db-card-prop-line';
        const val = renderPropertyValueControl(prop, rowPage, dbPage, { compact: true });
        item.append(val);
        propsWrap.append(item);
      });
      if (propsWrap.children.length) card.append(propsWrap);
    }
    return card;
  }

  function renderBoardView(canvas: HTMLElement, rows: any[], view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    const ro = roMode();
    const groupProp = db.schema.find(s => s.id === view.groupBy) || db.schema.find(s => ['status', 'select', 'person', 'checkbox'].includes(s.type));
    if (!groupProp) {
      const empty = document.createElement('div');
      empty.className = 'db-empty-state';
      empty.textContent = 'Board views require a Status, Select, Person, or Checkbox property to group by.';
      canvas.append(empty);
      return;
    }
    const groups = buildGroupsForRows(rows, groupProp, dbPage);
    const rowOrderIds = rows.map((r: any) => r.id);
    const board = document.createElement('div');
    board.className = 'db-board';

    groups.forEach(group => {
      const col = document.createElement('div');
      col.className = 'db-board-col';
      if (!ro) {
        col.ondragover = e => {
          if (e.dataTransfer?.types.includes('application/x-db-row')) {
            e.preventDefault();
            col.classList.add('is-drag-over');
          }
        };
        col.ondragleave = () => col.classList.remove('is-drag-over');
        col.ondrop = e => {
          e.preventDefault();
          col.classList.remove('is-drag-over');
          const draggedRowId = e.dataTransfer?.getData('application/x-db-row');
          const rPage = draggedRowId ? getPageById(draggedRowId) : null;
          if (rPage) {
            assignGroupValueToRow(rPage, groupProp, group.key, dbPage);
            persist(false);
            refreshAllDatabaseViews();
          }
        };
      }

      const colHead = document.createElement('div');
      colHead.className = 'db-board-col-head';
      const count = document.createElement('span');
      count.className = 'db-group-count';
      count.textContent = String(group.rows.length);
      colHead.append(createPillEl(group.label, group.color, groupProp.type === 'status', group.statusGroup), count);

      if (!ro) {
        const addQuick = document.createElement('button');
        addQuick.type = 'button';
        addQuick.className = 'db-mini-btn';
        addQuick.textContent = '+';
        addQuick.title = `Add page in ${group.label}`;
        addQuick.onclick = () => {
          const initial: Record<string, any> = {};
          if (group.key !== '__none__') initial[groupProp.id] = groupProp.type === 'person' ? [group.key] : groupProp.type === 'checkbox' ? group.key === 'true' : group.key;
          const created = createDatabaseRow(dbPage, initial);
          persist(false);
          refreshAllDatabaseViews();
          openDatabaseRow(created, dbPage);
        };
        colHead.append(addQuick);
      }

      const cards = document.createElement('div');
      cards.className = 'db-board-cards';
      group.rows.forEach(r => cards.append(buildRowCard(r, view, dbPage, rowOrderIds, { draggable: true })));

      col.append(colHead, cards);
      if (!ro) {
        const newInCol = document.createElement('button');
        newInCol.type = 'button';
        newInCol.className = 'db-board-new-btn';
        newInCol.textContent = '＋ New page';
        newInCol.onclick = () => {
          const initial: Record<string, any> = {};
          if (group.key !== '__none__') initial[groupProp.id] = groupProp.type === 'person' ? [group.key] : groupProp.type === 'checkbox' ? group.key === 'true' : group.key;
          const created = createDatabaseRow(dbPage, initial);
          persist(false);
          refreshAllDatabaseViews();
          openDatabaseRow(created, dbPage);
        };
        col.append(newInCol);
      }
      board.append(col);
    });

    if (!ro && (groupProp.type === 'status' || groupProp.type === 'select')) {
      const addGroupCol = document.createElement('div');
      addGroupCol.className = 'db-board-add-group';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'db-toolbar-btn';
      btn.textContent = '＋ Add a group';
      btn.onclick = () => {
        openDbPopover(btn, (pop, close) => {
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.className = 'db-pop-search';
          inp.placeholder = 'New group name…';
          const saveBtn = document.createElement('button');
          saveBtn.type = 'button';
          saveBtn.className = 'primary-button';
          saveBtn.textContent = 'Create group';
          const create = () => {
            const name = inp.value.trim();
            if (!name) return;
            groupProp.options = groupProp.options || [];
            groupProp.options.push({
              id: uid(),
              name,
              color: DB_COLORS[(groupProp.options.length % (DB_COLORS.length - 1)) + 1].key,
              statusGroup: groupProp.type === 'status' ? 'in_progress' : undefined
            });
            persist(false); refreshAllDatabaseViews(); close();
          };
          saveBtn.onclick = create;
          inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); create(); } };
          pop.append(inp, saveBtn);
          requestAnimationFrame(() => inp.focus());
        }, 210);
      };
      addGroupCol.append(btn);
      board.append(addGroupCol);
    }

    canvas.append(board);
  }

  function renderListView(canvas: HTMLElement, rows: any[], view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    const ro = roMode();
    const listWrap = document.createElement('div');
    listWrap.className = 'db-list-view';
    const rowOrderIds = rows.map((r: any) => r.id);
    const props = view.propertyOrder
      .filter(pid => view.visiblePropertyIds.includes(pid))
      .map(pid => db.schema.find(s => s.id === pid))
      .filter(p => p && p.type !== 'title') as DbSchemaProperty[];

    const groupProp = view.groupBy ? db.schema.find(s => s.id === view.groupBy) : undefined;
    const groups = buildGroupsForRows(rows, groupProp, dbPage);
    groups.forEach(group => {
      if (groupProp) {
        const gh = document.createElement('div');
        gh.className = 'db-list-group-head';
        gh.append(createPillEl(group.label, group.color, groupProp.type === 'status', group.statusGroup));
        const cnt = document.createElement('span'); cnt.className = 'db-group-count'; cnt.textContent = String(group.rows.length);
        gh.append(cnt);
        listWrap.append(gh);
      }
      group.rows.forEach(r => {
        const row = document.createElement('div');
        row.className = 'db-list-item';
        row.dataset.rowId = r.id;
        const left = document.createElement('button');
        left.type = 'button';
        left.className = 'db-list-title';
        left.innerHTML = `${dbIconHtml(r.icon)} <span>${escHtml(r.title || 'Untitled')}</span>`;
        wireRowTrigger(left, r, dbPage, rowOrderIds);
        const right = document.createElement('div');
        right.className = 'db-list-props';
        props.forEach(p => {
          if (isValueEmpty(p, r, dbPage)) return;
          right.append(renderPropertyValueControl(p, r, dbPage, { compact: true }));
        });
        row.append(left, right);
        listWrap.append(row);
      });
    });

    if (!ro) {
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'db-new-row-btn';
      add.textContent = '＋ New page';
      add.onclick = () => {
        const created = createDatabaseRow(dbPage, {});
        persist(false); refreshAllDatabaseViews(); openDatabaseRow(created, dbPage);
      };
      listWrap.append(add);
    }
    canvas.append(listWrap);
  }

  function renderGalleryView(canvas: HTMLElement, rows: any[], view: DbView, dbPage: any) {
    const ro = roMode();
    const rowOrderIds = rows.map((r: any) => r.id);
    const grid = document.createElement('div');
    grid.className = `db-gallery size-${view.cardSize || 'medium'}`;
    rows.forEach(r => grid.append(buildRowCard(r, view, dbPage, rowOrderIds)));
    if (!ro) {
      const addCard = document.createElement('button');
      addCard.type = 'button';
      addCard.className = 'db-gallery-new';
      addCard.textContent = '＋ New page';
      addCard.onclick = () => {
        const created = createDatabaseRow(dbPage, {});
        persist(false); refreshAllDatabaseViews(); openDatabaseRow(created, dbPage);
      };
      grid.append(addCard);
    }
    canvas.append(grid);
  }

  function renderCalendarView(canvas: HTMLElement, rows: any[], view: DbView, dbPage: any, hostKey: string) {
    const db = ensureDatabaseConfig(dbPage);
    const ro = roMode();
    let dateProp = db.schema.find(s => s.id === view.datePropertyId && s.type === 'date') || db.schema.find(s => s.type === 'date');
    if (!dateProp) {
      const empty = document.createElement('div');
      empty.className = 'db-empty-state';
      empty.innerHTML = '<span>Calendar views require a Date property to display.</span>';
      if (!ro) {
        const fix = document.createElement('button');
        fix.type = 'button';
        fix.className = 'primary-button';
        fix.textContent = 'Add Date property';
        fix.onclick = () => {
          const dp = addSchemaProperty(dbPage, 'Date', 'date');
          view.datePropertyId = dp.id;
          persist(false); refreshAllDatabaseViews();
        };
        empty.append(fix);
      }
      canvas.append(empty);
      return;
    }

    const ym = view.calendarMonth || new Date().toISOString().slice(0, 7);
    const [year, month] = ym.split('-').map(Number);
    const monthStart = new Date(year, month - 1, 1);
    const startWeekday = monthStart.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const rowOrderIds = rows.map((r: any) => r.id);

    const calHead = document.createElement('div');
    calHead.className = 'db-cal-header';
    const monthLabel = document.createElement('strong');
    monthLabel.textContent = monthStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const nav = document.createElement('div');
    nav.className = 'db-cal-nav';

    const shiftMonth = (delta: number) => {
      const next = new Date(year, month - 1 + delta, 1);
      view.calendarMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
      persist(false); refreshAllDatabaseViews();
    };
    const prevM = document.createElement('button'); prevM.type = 'button'; prevM.className = 'db-toolbar-btn'; prevM.textContent = '‹';
    prevM.title = 'Previous Month'; prevM.onclick = () => shiftMonth(-1);
    const todayB = document.createElement('button'); todayB.type = 'button'; todayB.className = 'db-toolbar-btn'; todayB.textContent = 'Today';
    todayB.onclick = () => { view.calendarMonth = new Date().toISOString().slice(0, 7); persist(false); refreshAllDatabaseViews(); };
    const nextM = document.createElement('button'); nextM.type = 'button'; nextM.className = 'db-toolbar-btn'; nextM.textContent = '›';
    nextM.title = 'Next Month'; nextM.onclick = () => shiftMonth(1);

    const noDateRows = rows.filter((r: any) => !dateTextOf(getRawValue(dateProp!, r, dbPage)));
    const noDateBtn = document.createElement('button');
    noDateBtn.type = 'button';
    noDateBtn.className = 'db-toolbar-btn';
    noDateBtn.textContent = `No date (${noDateRows.length})`;
    noDateBtn.onclick = () => { noDateOpenByKey.set(hostKey, !noDateOpenByKey.get(hostKey)); refreshAllDatabaseViews(); };
    nav.append(noDateBtn, prevM, todayB, nextM);
    calHead.append(monthLabel, nav);
    canvas.append(calHead);

    if (noDateOpenByKey.get(hostKey) && noDateRows.length) {
      const tray = document.createElement('div');
      tray.className = 'db-cal-nodate-tray';
      noDateRows.forEach(r => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'db-cal-pill';
        chip.textContent = `${r.icon?.startsWith('data:image') ? '📄' : (r.icon || '📄')} ${r.title || 'Untitled'}`;
        chip.onclick = () => openDatabaseRow(r, dbPage, rowOrderIds);
        tray.append(chip);
      });
      canvas.append(tray);
    }

    const grid = document.createElement('div');
    grid.className = 'db-cal-grid';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => {
      const h = document.createElement('div');
      h.className = 'db-cal-weekday';
      h.textContent = d;
      grid.append(h);
    });

    const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;
    const todayStr = new Date().toISOString().slice(0, 10);
    for (let c = 0; c < totalCells; c++) {
      const cellDate = new Date(year, month - 1, c - startWeekday + 1);
      const iso = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
      const cell = document.createElement('div');
      cell.className = 'db-cal-cell' + (cellDate.getMonth() !== month - 1 ? ' is-other-month' : '') + (iso === todayStr ? ' is-today' : '');
      if (!ro) {
        cell.ondragover = e => { if (e.dataTransfer?.types.includes('application/x-db-row')) { e.preventDefault(); cell.classList.add('is-drag-over'); } };
        cell.ondragleave = () => cell.classList.remove('is-drag-over');
        cell.ondrop = e => {
          e.preventDefault();
          cell.classList.remove('is-drag-over');
          const rid = e.dataTransfer?.getData('application/x-db-row');
          const rp = rid ? getPageById(rid) : null;
          if (rp) { setRowValue(rp, dateProp!, { start: iso }, dbPage, true); }
        };
      }
      const dayHead = document.createElement('div');
      dayHead.className = 'db-cal-day-head';
      const dayNum = document.createElement('span');
      dayNum.textContent = String(cellDate.getDate());
      dayHead.append(dayNum);
      if (!ro) {
        const plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'db-cal-add-btn';
        plus.textContent = '+';
        plus.title = `Add item on ${iso}`;
        plus.onclick = () => {
          const created = createDatabaseRow(dbPage, { [dateProp!.id]: { start: iso } });
          persist(false); refreshAllDatabaseViews(); openDatabaseRow(created, dbPage);
        };
        dayHead.append(plus);
      }
      cell.append(dayHead);

      const events = rows.filter(r => {
        const rv = getRawValue(dateProp!, r, dbPage);
        const start = (typeof rv === 'object' ? rv?.start : String(rv || '')).slice(0, 10);
        const end = (typeof rv === 'object' ? rv?.end : '').slice(0, 10) || start;
        return !!start && iso >= start && iso <= end;
      });
      events.forEach(ev => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'db-cal-pill';
        pill.draggable = !ro;
        pill.ondragstart = e => e.dataTransfer?.setData('application/x-db-row', ev.id);
        pill.textContent = `${ev.icon?.startsWith('data:image') ? '📄' : (ev.icon || '📄')} ${ev.title || 'Untitled'}`;
        wireRowTrigger(pill, ev, dbPage, rowOrderIds);
        cell.append(pill);
      });
      grid.append(cell);
    }
    canvas.append(grid);
  }

  function renderTimelineView(canvas: HTMLElement, rows: any[], view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    const ro = roMode();
    const dateProp = db.schema.find(s => s.id === view.datePropertyId && s.type === 'date') || db.schema.find(s => s.type === 'date');
    if (!dateProp) {
      const empty = document.createElement('div');
      empty.className = 'db-empty-state';
      empty.innerHTML = '<span>Timeline views require a Date property to display.</span>';
      if (!ro) {
        const fix = document.createElement('button');
        fix.type = 'button';
        fix.className = 'primary-button';
        fix.textContent = 'Add Date property';
        fix.onclick = () => { const dp = addSchemaProperty(dbPage, 'Date', 'date'); view.datePropertyId = dp.id; persist(false); refreshAllDatabaseViews(); };
        empty.append(fix);
      }
      canvas.append(empty);
      return;
    }

    const rowOrderIds = rows.map((r: any) => r.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysShown = view.timelineZoom === 'month' ? 42 : view.timelineZoom === 'day' ? 14 : 21;
    const startWindow = new Date(today);
    startWindow.setDate(startWindow.getDate() - Math.floor(daysShown / 3));

    const header = document.createElement('div');
    header.className = 'db-cal-header';
    header.innerHTML = `<strong>Timeline (${dateProp.name})</strong>`;
    const zoomSel = document.createElement('select');
    zoomSel.className = 'db-toolbar-select';
    [['day', 'Day'], ['week', 'Week'], ['month', 'Month']].forEach(([k, l]) => {
      const o = document.createElement('option'); o.value = k; o.textContent = l; zoomSel.append(o);
    });
    zoomSel.value = view.timelineZoom || 'week';
    zoomSel.onchange = () => { view.timelineZoom = zoomSel.value as any; persist(false); refreshAllDatabaseViews(); };
    header.append(zoomSel);
    canvas.append(header);

    const wrap = document.createElement('div');
    wrap.className = 'db-timeline-wrap';
    const ruler = document.createElement('div');
    ruler.className = 'db-timeline-ruler';
    ruler.style.gridTemplateColumns = `190px repeat(${daysShown}, minmax(34px, 1fr))`;
    const nameH = document.createElement('div');
    nameH.className = 'db-timeline-label-col';
    nameH.textContent = 'Item';
    ruler.append(nameH);
    const dayIsos: string[] = [];
    for (let i = 0; i < daysShown; i++) {
      const d = new Date(startWindow);
      d.setDate(d.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dayIsos.push(iso);
      const cell = document.createElement('div');
      cell.className = 'db-timeline-day' + (iso === today.toISOString().slice(0, 10) ? ' is-today' : '');
      cell.textContent = d.getDate() === 1 ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : String(d.getDate());
      ruler.append(cell);
    }
    wrap.append(ruler);

    rows.forEach(r => {
      const row = document.createElement('div');
      row.className = 'db-timeline-row';
      row.style.gridTemplateColumns = `190px 1fr`;
      const lbl = document.createElement('button');
      lbl.type = 'button';
      lbl.className = 'db-timeline-row-title';
      lbl.textContent = `${r.icon?.startsWith('data:image') ? '📄' : (r.icon || '📄')} ${r.title || 'Untitled'}`;
      wireRowTrigger(lbl, r, dbPage, rowOrderIds);
      const track = document.createElement('div');
      track.className = 'db-timeline-track';

      const rv = getRawValue(dateProp, r, dbPage);
      const sIso = (typeof rv === 'object' ? rv?.start : String(rv || '')).slice(0, 10);
      const eIso = ((typeof rv === 'object' ? rv?.end : '') || sIso).slice(0, 10);
      if (sIso) {
        const sMs = Date.parse(sIso), eMs = Date.parse(eIso), wStart = startWindow.getTime();
        const spanMs = daysShown * 86400000;
        const leftPct = Math.max(0, Math.min(96, ((sMs - wStart) / spanMs) * 100));
        const rightPct = Math.max(leftPct + 100 / daysShown, Math.min(100, (((eMs + 86400000) - wStart) / spanMs) * 100));
        if (rightPct > 0 && leftPct < 100) {
          const bar = document.createElement('button');
          bar.type = 'button';
          bar.className = 'db-timeline-bar';
          bar.style.left = `${leftPct}%`;
          bar.style.width = `${Math.max(4, rightPct - leftPct)}%`;
          bar.textContent = r.title || 'Untitled';
          wireRowTrigger(bar, r, dbPage, rowOrderIds);
          track.append(bar);
        }
      } else if (!ro) {
        const addDate = document.createElement('button');
        addDate.type = 'button';
        addDate.className = 'db-placeholder-btn';
        addDate.textContent = 'Click to add to timeline';
        addDate.onclick = () => {
          setRowValue(r, dateProp, { start: today.toISOString().slice(0, 10) }, dbPage, true);
        };
        track.append(addDate);
      }
      row.append(lbl, track);
      wrap.append(row);
    });
    canvas.append(wrap);
  }

  function renderChartView(canvas: HTMLElement, rows: any[], view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    const cfg = view.chartConfig || { chartType: 'vertical_bar', xPropertyId: db.schema[1]?.id || db.schema[0].id, yMode: 'count' };
    const xProp = db.schema.find(s => s.id === cfg.xPropertyId) || db.schema[1] || db.schema[0];
    const groups = buildGroupsForRows(rows, xProp, dbPage);
    const series = groups.map(g => ({
      label: g.label,
      color: colorMeta(g.color).dot,
      value: g.rows.length
    }));
    const maxVal = Math.max(1, ...series.map(s => s.value));
    const chartBox = document.createElement('div');
    chartBox.className = 'db-chart-box';
    const title = document.createElement('div');
    title.className = 'db-chart-title';
    title.textContent = `Pages by ${xProp.name} (${rows.length} total)`;
    chartBox.append(title);

    if (cfg.chartType === 'donut') {
      const total = Math.max(1, series.reduce((a, b) => a + b.value, 0));
      let acc = 0;
      const stops: string[] = [];
      series.forEach(s => {
        const start = (acc / total) * 360;
        acc += s.value;
        const end = (acc / total) * 360;
        stops.push(`${s.color} ${start.toFixed(1)}deg ${end.toFixed(1)}deg`);
      });
      const donutWrap = document.createElement('div');
      donutWrap.className = 'db-donut-wrap';
      const ring = document.createElement('div');
      ring.className = 'db-donut-ring';
      ring.style.background = `conic-gradient(${stops.join(', ')})`;
      ring.innerHTML = `<div class="db-donut-hole"><strong>${rows.length}</strong><small>Total</small></div>`;
      const legend = document.createElement('div');
      legend.className = 'db-donut-legend';
      series.forEach(s => {
        const item = document.createElement('div');
        item.className = 'db-legend-row';
        item.innerHTML = `<span class="db-legend-dot" style="background:${s.color}"></span><span>${escHtml(s.label)}</span><strong>${s.value}</strong>`;
        legend.append(item);
      });
      donutWrap.append(ring, legend);
      chartBox.append(donutWrap);
    } else if (cfg.chartType === 'horizontal_bar') {
      const list = document.createElement('div');
      list.className = 'db-hbar-list';
      series.forEach(s => {
        const row = document.createElement('div');
        row.className = 'db-hbar-row';
        row.innerHTML = `<span class="db-hbar-lbl">${escHtml(s.label)}</span><div class="db-hbar-track"><div class="db-hbar-fill" style="width:${(s.value / maxVal) * 100}%;background:${s.color}"></div></div><strong>${s.value}</strong>`;
        list.append(row);
      });
      chartBox.append(list);
    } else {
      const bars = document.createElement('div');
      bars.className = 'db-vbar-grid';
      series.forEach(s => {
        const col = document.createElement('div');
        col.className = 'db-vbar-col';
        const pct = Math.max(4, Math.round((s.value / maxVal) * 100));
        col.innerHTML = `<span class="db-vbar-num">${s.value}</span><div class="db-vbar-track"><div class="db-vbar-fill" style="height:${pct}%;background:${s.color}"></div></div><span class="db-vbar-lbl">${escHtml(s.label)}</span>`;
        bars.append(col);
      });
      chartBox.append(bars);
    }
    canvas.append(chartBox);
  }

  function renderFeedView(canvas: HTMLElement, rows: any[], view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    const feed = document.createElement('div');
    feed.className = 'db-feed-list';
    const rowOrderIds = rows.map((r: any) => r.id);
    if (!rows.length) {
      const empty = document.createElement('div');
      empty.className = 'db-empty-state';
      empty.textContent = 'No posts matching this view yet.';
      feed.append(empty);
    }
    rows.forEach(r => {
      const card = document.createElement('article');
      card.className = 'db-feed-card';
      wireRowTrigger(card, r, dbPage, rowOrderIds);
      const author = r.createdBy || getState()?.users?.[0]?.name || 'Jordan Davis';
      const stamp = r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : '';
      const meta = document.createElement('div');
      meta.className = 'db-feed-meta';
      meta.innerHTML = `<strong>${escHtml(author)}</strong><span>${escHtml(stamp)}</span>`;
      const h = document.createElement('h4');
      h.className = 'db-feed-title';
      h.textContent = `${r.icon?.startsWith('data:image') ? '📄' : (r.icon || '📄')} ${r.title || 'Untitled'}`;
      const bodyTxt = (r.blocks || []).map((b: any) => b.text).filter(Boolean).join('\n').trim();
      const body = document.createElement('p');
      body.className = 'db-feed-body';
      body.textContent = bodyTxt.slice(0, 240) || 'No content yet.';
      const tags = document.createElement('div');
      tags.className = 'db-card-props';
      view.propertyOrder.forEach(pid => {
        if (!view.visiblePropertyIds.includes(pid)) return;
        const p = db.schema.find(s => s.id === pid);
        if (!p || p.type === 'title' || isValueEmpty(p, r, dbPage)) return;
        tags.append(renderPropertyValueControl(p, r, dbPage, { compact: true }));
      });
      card.append(meta, h, body);
      if (tags.children.length) card.append(tags);
      feed.append(card);
    });
    canvas.append(feed);
  }

  // ==================== SHARED DATABASE WIDGET ====================

  function renderDatabaseWidget(hostEl: HTMLElement, dbPage: any, options: {
    inlineBlock?: any;
    parentPage?: any;
    onRemoveBlock?: () => void;
    onChangeSourceDb?: (nextDbPage: any) => void;
  } = {}) {
    const isInline = Boolean(options.inlineBlock);
    const hostKey = options.inlineBlock ? `block:${options.inlineBlock.id}` : `page:${dbPage.id}`;

    const draw = () => {
      hostEl.classList.add('db-view-wrap', 'db-interactive-surface', isInline ? 'is-inline' : 'is-fullpage');
      hostEl.dataset.dbPageId = dbPage.id || '';
      hostEl.replaceChildren();
      const currentDb = getPageById(dbPage.id);
      if (!currentDb || !isDatabasePage(currentDb)) {
        const missing = document.createElement('div');
        missing.className = 'db-missing-source';
        missing.innerHTML = '<span>This linked database source is missing or moved to Trash.</span>';
        const linkBtn = document.createElement('button');
        linkBtn.type = 'button';
        linkBtn.className = 'primary-button';
        linkBtn.textContent = 'Link a data source';
        linkBtn.onclick = () => openLinkSourcePopover(linkBtn, options.onChangeSourceDb);
        missing.append(linkBtn);
        hostEl.append(missing);
        return;
      }

      const db = ensureDatabaseConfig(currentDb);
      const ro = roMode();
      const activeId = options.inlineBlock?.viewId || db.activeViewId;
      const view = activeViewFor(currentDb, activeId);
      const searchQ = searchQueriesByKey.get(hostKey) || '';

      // Inline database title bar
      if (isInline && db.showTitle !== false) {
        const titleBar = document.createElement('div');
        titleBar.className = 'db-inline-header';
        const left = document.createElement('div');
        left.className = 'db-inline-title-group';
        const iconSpan = document.createElement('span');
        iconSpan.innerHTML = dbIconHtml(currentDb.icon, '🗃️');
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'db-inline-title-input';
        titleInput.value = currentDb.title || 'Untitled database';
        titleInput.disabled = ro;
        titleInput.addEventListener('input', () => {
          currentDb.title = titleInput.value;
          persist(false);
          host?.renderNav?.();
        });
        titleInput.addEventListener('blur', () => refreshAllDatabaseViews());
        left.append(iconSpan, titleInput);

        const right = document.createElement('div');
        right.className = 'db-inline-actions';
        const openFull = document.createElement('button');
        openFull.type = 'button';
        openFull.className = 'db-toolbar-btn';
        openFull.textContent = '⤢ Open as full page';
        openFull.title = `Opens "${currentDb.title || 'Database'}" (Ctrl/middle-click for new tab)`;
        openFull.onclick = e => {
          if (e.ctrlKey || e.metaKey) { host?.openPageInNewTab?.(currentDb.id); return; }
          host?.navigateToPage?.(currentDb.id);
        };
        openFull.onauxclick = e => {
          if (e.button === 1) { e.preventDefault(); host?.openPageInNewTab?.(currentDb.id); }
        };
        right.append(openFull);

        if (!ro && options.onChangeSourceDb) {
          const linkSource = document.createElement('button');
          linkSource.type = 'button';
          linkSource.className = 'db-toolbar-btn';
          linkSource.textContent = '⇄ Source';
          linkSource.title = 'Link to another database page';
          linkSource.onclick = () => openLinkSourcePopover(linkSource, options.onChangeSourceDb);
          right.append(linkSource);
        }
        titleBar.append(left, right);
        hostEl.append(titleBar);
      }

      // View switcher tabs + toolbar
      const topControls = document.createElement('div');
      topControls.className = 'db-viewbar';

      const tabList = document.createElement('div');
      tabList.className = 'db-tabs';
      tabList.setAttribute('role', 'tablist');
      db.views.forEach(v => {
        const isCurrent = v.id === view.id;
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.role = 'tab';
        tab.setAttribute('aria-selected', String(isCurrent));
        tab.className = 'db-tab' + (isCurrent ? ' active' : '');
        tab.innerHTML = `<span class="db-tab-ico">${viewMeta(v.type).icon}</span><span>${escHtml(v.name)}</span>`;
        tab.onclick = () => {
          if (isCurrent) {
            if (!ro) openViewSettingsPopover(tab, v, currentDb);
          } else {
            if (options.inlineBlock) options.inlineBlock.viewId = v.id;
            else db.activeViewId = v.id;
            persist(false);
            draw();
          }
        };
        tabList.append(tab);
      });
      if (!ro) {
        const addTab = document.createElement('button');
        addTab.type = 'button';
        addTab.className = 'db-add-view-btn';
        addTab.textContent = '+';
        addTab.title = 'Add a new view';
        addTab.setAttribute('aria-label', 'Add view');
        addTab.onclick = () => openAddViewPopover(addTab, currentDb, nextView => {
          if (options.inlineBlock) options.inlineBlock.viewId = nextView.id;
          else db.activeViewId = nextView.id;
          refreshAllDatabaseViews();
        });
        tabList.append(addTab);
      }

      const toolbar = document.createElement('div');
      toolbar.className = 'db-toolbar';

      const filterBtn = document.createElement('button');
      filterBtn.type = 'button';
      filterBtn.className = 'db-toolbar-btn' + (view.filters.length ? ' is-active' : '');
      filterBtn.textContent = view.filters.length ? `Filter (${view.filters.length})` : 'Filter';
      filterBtn.onclick = () => openFilterPopover(filterBtn, view, currentDb, hostKey);

      const sortBtn = document.createElement('button');
      sortBtn.type = 'button';
      sortBtn.className = 'db-toolbar-btn' + (view.sorts.length ? ' is-active' : '');
      sortBtn.textContent = view.sorts.length ? `Sort (${view.sorts.length})` : 'Sort';
      sortBtn.onclick = () => openSortPopover(sortBtn, view, currentDb);

      const groupBtn = document.createElement('button');
      groupBtn.type = 'button';
      groupBtn.className = 'db-toolbar-btn' + (view.groupBy ? ' is-active' : '');
      groupBtn.textContent = view.groupBy ? 'Grouped' : 'Group';
      groupBtn.onclick = () => openGroupPopover(groupBtn, view, currentDb);

      const propsBtn = document.createElement('button');
      propsBtn.type = 'button';
      propsBtn.className = 'db-toolbar-btn';
      propsBtn.textContent = 'Properties';
      propsBtn.onclick = () => openPropertiesMenu(propsBtn, view, currentDb);

      const searchWrap = document.createElement('div');
      searchWrap.className = 'db-search-wrap';
      const searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.className = 'db-search-input';
      searchInput.placeholder = 'Search…';
      searchInput.setAttribute('aria-label', 'Search database');
      searchInput.value = searchQ;
      searchInput.addEventListener('input', () => {
        searchQueriesByKey.set(hostKey, searchInput.value);
        drawCanvas();
      });
      searchWrap.append(searchInput);

      const settingsBtn = document.createElement('button');
      settingsBtn.type = 'button';
      settingsBtn.className = 'db-toolbar-btn';
      settingsBtn.textContent = '⚙';
      settingsBtn.title = 'View settings';
      settingsBtn.setAttribute('aria-label', 'Settings');
      settingsBtn.onclick = () => openViewSettingsPopover(settingsBtn, view, currentDb);

      toolbar.append(filterBtn, sortBtn, groupBtn, propsBtn, searchWrap, settingsBtn);

      if (!ro) {
        const newSplit = document.createElement('div');
        newSplit.className = 'db-new-split';
        const newPrimary = document.createElement('button');
        newPrimary.type = 'button';
        newPrimary.className = 'db-new-btn';
        newPrimary.textContent = 'New';
        newPrimary.onclick = () => {
          const initial: Record<string, any> = {};
          const created = createDatabaseRow(currentDb, initial);
          persist(false);
          refreshAllDatabaseViews();
          openDatabaseRow(created, currentDb);
        };
        const newCarets = document.createElement('button');
        newCarets.type = 'button';
        newCarets.className = 'db-new-caret';
        newCarets.textContent = '▾';
        newCarets.setAttribute('aria-label', 'More add options');
        newCarets.onclick = () => openNewTemplateMenu(newCarets, currentDb);
        newSplit.append(newPrimary, newCarets);
        toolbar.append(newSplit);
      }

      topControls.append(tabList, toolbar);
      hostEl.append(topControls);

      const canvas = document.createElement('div');
      canvas.className = 'db-canvas';
      const drawCanvas = () => {
        canvas.replaceChildren();
        const rows = queryViewRows(currentDb, view, searchQueriesByKey.get(hostKey) || '');
        if (view.type === 'board') renderBoardView(canvas, rows, view, currentDb);
        else if (view.type === 'list') renderListView(canvas, rows, view, currentDb);
        else if (view.type === 'gallery') renderGalleryView(canvas, rows, view, currentDb);
        else if (view.type === 'calendar') renderCalendarView(canvas, rows, view, currentDb, hostKey);
        else if (view.type === 'timeline') renderTimelineView(canvas, rows, view, currentDb);
        else if (view.type === 'chart') renderChartView(canvas, rows, view, currentDb);
        else if (view.type === 'feed') renderFeedView(canvas, rows, view, currentDb);
        else renderTableView(canvas, rows, view, currentDb);
      };

      // Filter & Sort active bar
      const showFilterBar = filterOpenByKey.get(hostKey) || view.filters.length > 0;
      if (showFilterBar) {
        hostEl.append(renderFilterStrip(view, currentDb, hostKey, drawCanvas));
      }

      drawCanvas();
      hostEl.append(canvas);
    };

    activeHostRenders.set(hostEl, draw);
    draw();
  }

  function renderFilterStrip(view: DbView, dbPage: any, hostKey: string, onLiveUpdate?: () => void) {
    const db = ensureDatabaseConfig(dbPage);
    const bar = document.createElement('div');
    bar.className = 'db-filter-strip';
    view.filters.forEach((rule, idx) => {
      const chip = document.createElement('div');
      chip.className = 'db-filter-chip';
      const propSel = document.createElement('select');
      db.schema.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; propSel.append(o); });
      propSel.value = rule.propertyId;
      propSel.onchange = () => { rule.propertyId = propSel.value; persist(false); refreshAllDatabaseViews(); };

      const opSel = document.createElement('select');
      DB_FILTER_OPS.forEach(f => { const o = document.createElement('option'); o.value = f.op; o.textContent = f.label; opSel.append(o); });
      opSel.value = rule.op;
      opSel.onchange = () => { rule.op = opSel.value as DbFilterOp; persist(false); refreshAllDatabaseViews(); };

      chip.append(propSel, opSel);
      const opMeta = DB_FILTER_OPS.find(f => f.op === rule.op);
      if (!opMeta?.noValue) {
        const valInput = document.createElement('input');
        valInput.type = 'text';
        valInput.placeholder = 'Value…';
        valInput.value = rule.value || '';
        valInput.oninput = () => { rule.value = valInput.value; persist(false); onLiveUpdate?.(); };
        valInput.onblur = () => refreshAllDatabaseViews();
        valInput.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); refreshAllDatabaseViews(); } };
        chip.append(valInput);
      }

      const rm = document.createElement('button');
      rm.type = 'button'; rm.className = 'db-mini-btn'; rm.textContent = '✕';
      rm.onclick = () => {
        view.filters.splice(idx, 1);
        if (!view.filters.length) filterOpenByKey.set(hostKey, false);
        persist(false); refreshAllDatabaseViews();
      };
      chip.append(rm);
      bar.append(chip);
    });

    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'db-link-btn';
    add.textContent = '＋ Add filter';
    add.onclick = () => {
      const targetProp = db.schema[1] || db.schema[0];
      view.filters.push({ id: uid(), propertyId: targetProp.id, op: 'contains', value: '' });
      filterOpenByKey.set(hostKey, true);
      persist(false); refreshAllDatabaseViews();
    };
    bar.append(add);
    return bar;
  }

  function openLinkSourcePopover(anchor: HTMLElement, onChoose?: (dbPage: any) => void) {
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Select a data source';
      const list = document.createElement('div');
      list.className = 'db-pop-list';
      const dbs = getDatabasePages();
      dbs.forEach((d: any) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'db-pop-option-btn';
        b.innerHTML = `<span>${escHtml(d.icon?.startsWith('data:image') ? '🗃️' : (d.icon || '🗃️'))} ${escHtml(d.title || 'Untitled database')}</span><small>${getDatabaseRows(d.id).length} pages</small>`;
        b.onclick = () => {
          close();
          onChoose?.(d);
        };
        list.append(b);
      });
      const createNew = document.createElement('button');
      createNew.type = 'button';
      createNew.className = 'db-pop-create-btn';
      createNew.textContent = '＋ Create new empty database';
      createNew.onclick = () => {
        const nextDb = createDatabasePage(undefined, 'Untitled database');
        persist(false);
        close();
        onChoose?.(nextDb);
      };
      list.append(createNew);
      pop.append(header, list);
    }, 280);
  }

  function openNewTemplateMenu(anchor: HTMLElement, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Templates';
      const list = document.createElement('div');
      list.className = 'db-pop-list';

      const blank = document.createElement('button');
      blank.type = 'button';
      blank.className = 'db-pop-option-btn';
      blank.textContent = '📄 Empty page';
      blank.onclick = () => {
        const created = createDatabaseRow(dbPage, {});
        persist(false); close(); refreshAllDatabaseViews(); openDatabaseRow(created, dbPage);
      };
      list.append(blank);

      (db.templates || []).forEach(tpl => {
        const row = document.createElement('div');
        row.className = 'db-pop-option-row';
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'db-pop-option-btn';
        b.textContent = `${tpl.icon || '📄'} ${tpl.name}`;
        b.onclick = () => {
          const created = createDatabaseRow(dbPage, tpl.propertyValues || {}, tpl.blocks || [], tpl.icon || '📄');
          persist(false); close(); refreshAllDatabaseViews(); openDatabaseRow(created, dbPage);
        };
        const del = document.createElement('button');
        del.type = 'button'; del.className = 'db-mini-btn'; del.textContent = '✕';
        del.onclick = () => {
          db.templates = (db.templates || []).filter(t => t.id !== tpl.id);
          persist(false); close(); openNewTemplateMenu(anchor, dbPage);
        };
        row.append(b, del);
        list.append(row);
      });

      const addTpl = document.createElement('button');
      addTpl.type = 'button';
      addTpl.className = 'db-pop-create-btn';
      addTpl.textContent = '＋ Save current template';
      addTpl.onclick = () => {
        close();
        openDbPopover(anchor, (p2, c2) => {
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.className = 'db-pop-search';
          inp.placeholder = 'Template title (e.g. Bug report)…';
          const bodyInp = document.createElement('textarea');
          bodyInp.className = 'db-pop-textarea';
          bodyInp.placeholder = 'Starter body paragraph…';
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'primary-button';
          btn.textContent = 'Create template';
          btn.onclick = () => {
            const name = inp.value.trim() || 'Template';
            db.templates = db.templates || [];
            db.templates.push({
              id: uid(),
              name,
              icon: '📋',
              propertyValues: { prop_title: name },
              blocks: [{ id: uid(), type: 'text', text: bodyInp.value.trim() }]
            });
            persist(false);
            c2();
          };
          p2.append(inp, bodyInp, btn);
          requestAnimationFrame(() => inp.focus());
        }, 250);
      };
      list.append(addTpl);
      pop.append(header, list);
    }, 250);
  }

  return {
    initHost,
    isDatabasePage,
    getDatabasePages,
    getDatabaseRows,
    ensureDatabaseConfig,
    convertPageToDatabase,
    createDatabasePage,
    createDatabaseRow,
    deleteDatabaseRow,
    renderDatabaseWidget,
    renderRowDatabaseProperties,
    renderPropertyValueControl,
    openLinkSourcePopover,
    openPropertyHeaderMenu,
    openDatabaseRow,
    closeDatabasePeek,
    closeDbPopover,
    isPeekOpen: () => Boolean(activePeek),
    refreshAllDatabaseViews
  };
})();
