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
  | 'unique_id'
  | 'button'
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

type DbRollupCalc =
  | 'count_all' | 'count_values' | 'count_unique' | 'count_empty' | 'count_not_empty'
  | 'percent_empty' | 'percent_not_empty'
  | 'checked' | 'unchecked' | 'percent_checked' | 'percent_unchecked'
  | 'sum' | 'average' | 'median' | 'min' | 'max' | 'range'
  | 'earliest_date' | 'latest_date' | 'date_range_days'
  | 'show_original';

type DbAutomationTriggerKind = 'page_added' | 'property_edited';
type DbAutomationTriggerOp = 'any_edit' | 'is' | 'contains' | 'is_not_empty' | 'is_empty';
type DbAutomationTrigger = {
  id?: string;
  kind: DbAutomationTriggerKind;
  propertyId?: string;
  operator?: DbAutomationTriggerOp;
  matchValue?: string;
  matchValues?: string[];
};
type DbAutomationActionKind =
  | 'set_property'
  | 'add_page'
  | 'edit_pages'
  | 'edit_related'
  | 'send_notification'
  | 'send_message'
  | 'send_webhook'
  | 'open_page'
  | 'show_confirmation'
  | 'define_variables';
type DbAutomationBranch = {
  id: string;
  label: string;
  style?: 'primary' | 'default' | 'danger';
  mode: 'continue' | 'stop' | 'branch';
  actions?: DbAutomationAction[];
};
type DbAutomationVariable = { id: string; name: string; mode?: 'text' | 'formula'; value: string };
type DbAutomationAction = {
  id: string;
  kind: DbAutomationActionKind;
  propertyId?: string;
  value?: any;
  useFormula?: boolean;
  formulaExpr?: string;
  targetDatabaseId?: string;
  targetScope?: 'this_page' | 'related' | 'database';
  filterPropertyId?: string;
  filterValue?: string;
  title?: string;
  relationPropertyId?: string;
  propAssignments?: { propertyId: string; value: string }[];
  recipientMode?: 'specific' | 'everyone' | 'person_prop';
  recipientAccounts?: string[];
  recipientPropertyId?: string;
  targetAccount?: string;
  message?: string;
  chatChannelId?: string;
  chatTargetAccount?: string;
  webhookUrl?: string;
  webhookHeadersJson?: string;
  webhookBody?: string;
  openMode?: 'page' | 'url';
  openPageId?: string;
  openViewId?: string;
  openUrl?: string;
  confirmTitle?: string;
  confirmMessage?: string;
  confirmLabel?: string;
  branches?: DbAutomationBranch[];
  variables?: DbAutomationVariable[];
};
type DbAutomation = {
  id: string;
  name: string;
  icon?: string;
  enabled: boolean;
  trigger: DbAutomationTrigger;
  triggers?: DbAutomationTrigger[];
  triggerMatch?: 'all' | 'any';
  actions: DbAutomationAction[];
  runCount?: number;
  lastRunAt?: number;
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
  rollupCalc?: DbRollupCalc;
  formulaExpr?: string;
  idPrefix?: string;
  idNext?: number;
  buttonLabel?: string;
  buttonIcon?: string;
  buttonActions?: DbAutomationAction[];
  width?: number;
};

type DbFilterOp =
  | 'contains' | 'not_contains' | 'equals' | 'not_equals'
  | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'before' | 'after' | 'on_or_before' | 'on_or_after' | 'is_today' | 'past_week' | 'next_week'
  | 'is_checked' | 'is_unchecked';

type DbFilterRule = { id: string; propertyId: string; op: DbFilterOp; value?: string };
type DbFilterGroup = { id: string; match: 'and' | 'or'; rules: Array<DbFilterRule | DbFilterGroup> };
type DbViewType = 'table' | 'board' | 'list' | 'gallery' | 'calendar' | 'timeline' | 'chart' | 'feed' | 'form';
type DbSortRule = { propertyId: string; direction: 'asc' | 'desc' };
type DbAggregationType =
  | 'none' | 'count_all' | 'count_values' | 'count_empty' | 'count_not_empty'
  | 'percent_empty' | 'percent_not_empty' | 'sum' | 'average' | 'median' | 'min' | 'max' | 'range';
type DbOpenMode = 'side_peek' | 'center_peek' | 'full_page';

type DbFormConfig = {
  title?: string;
  description?: string;
  submitLabel?: string;
  requiredPropertyIds?: string[];
  hiddenPropertyIds?: string[];
};

type DbView = {
  id: string;
  name: string;
  type: DbViewType;
  visiblePropertyIds: string[];
  propertyOrder: string[];
  filters: DbFilterRule[];
  filterMatch?: 'and' | 'or';
  filterGroup?: DbFilterGroup;
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
  formConfig?: DbFormConfig;
  wrapCells?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
  cardPreview?: 'none' | 'cover' | 'content' | 'files';
  showTitle?: boolean;
  showPropertiesOnCards?: boolean;
  calculations?: Record<string, DbAggregationType>;
  columnWidths?: Record<string, number>;
  hiddenGroups?: string[];
  collapsedGroups?: string[];
  collapsedSubItems?: string[];
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
  automations?: DbAutomation[];
  subItemsEnabled?: boolean;
  parentPropertyId?: string;
  dependenciesPropertyId?: string;
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
    { type: 'unique_id', label: 'ID (Unique)', icon: '🆔', readonly: true },
    { type: 'button', label: 'Button', icon: '▶' },
    { type: 'created_time', label: 'Created time', icon: '🕒', readonly: true },
    { type: 'created_by', label: 'Created by', icon: '☺', readonly: true },
    { type: 'last_edited_time', label: 'Last edited time', icon: '↻', readonly: true },
    { type: 'last_edited_by', label: 'Last edited by', icon: '✍', readonly: true }
  ];

  const DB_ROLLUP_CALCS: { key: DbRollupCalc; label: string }[] = [
    { key: 'show_original', label: 'Show original' },
    { key: 'count_all', label: 'Count all' },
    { key: 'count_values', label: 'Count values' },
    { key: 'count_unique', label: 'Count unique values' },
    { key: 'count_empty', label: 'Count empty' },
    { key: 'count_not_empty', label: 'Count not empty' },
    { key: 'percent_empty', label: 'Percent empty' },
    { key: 'percent_not_empty', label: 'Percent not empty' },
    { key: 'checked', label: 'Checked' },
    { key: 'unchecked', label: 'Unchecked' },
    { key: 'percent_checked', label: 'Percent checked' },
    { key: 'percent_unchecked', label: 'Percent unchecked' },
    { key: 'sum', label: 'Sum' },
    { key: 'average', label: 'Average' },
    { key: 'median', label: 'Median' },
    { key: 'min', label: 'Min' },
    { key: 'max', label: 'Max' },
    { key: 'range', label: 'Range' },
    { key: 'earliest_date', label: 'Earliest date' },
    { key: 'latest_date', label: 'Latest date' },
    { key: 'date_range_days', label: 'Date range (days)' }
  ];

  const DB_VIEW_TYPES: { type: DbViewType; label: string; icon: string; desc: string }[] = [
    { type: 'table', label: 'Table', icon: '⊞', desc: 'Classic grid with columns, sorting, and calculations' },
    { type: 'board', label: 'Board', icon: '▥', desc: 'Kanban cards grouped by status, select, or person' },
    { type: 'list', label: 'List', icon: '☰', desc: 'Clean lightweight list with property badges' },
    { type: 'gallery', label: 'Gallery', icon: '◫', desc: 'Visual card grid for covers, media, or specs' },
    { type: 'calendar', label: 'Calendar', icon: '📅', desc: 'Schedule items across a monthly calendar grid' },
    { type: 'timeline', label: 'Timeline', icon: '↦', desc: 'Plot date ranges across a horizontal Gantt track' },
    { type: 'chart', label: 'Chart', icon: '◔', desc: 'Visualize counts and totals by category' },
    { type: 'feed', label: 'Feed', icon: '▤', desc: 'Chronological updates with property tags and notes' },
    { type: 'form', label: 'Form', icon: '📝', desc: 'Shareable intake form creating new database entries' }
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
    { op: 'on_or_before', label: 'On or before date' },
    { op: 'on_or_after', label: 'On or after date' },
    { op: 'is_today', label: 'Is today', noValue: true },
    { op: 'past_week', label: 'Past week', noValue: true },
    { op: 'next_week', label: 'Next week', noValue: true },
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

  function actorName() {
    return host?.getCurrentUser?.() || getState()?.users?.[0]?.name || 'Jordan Davis';
  }

  function roMode(page?: any) {
    if (page && host?.isPageReadOnly) return !!host.isPageReadOnly(page);
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
    db.automations = Array.isArray(db.automations) ? db.automations : [];
    if (db.schema.some(s => s.type === 'unique_id')) assignUniqueIds(dbPage);
    return db;
  }

  function assignUniqueIds(dbPage: any, specificRow?: any) {
    const db = dbPage?.database as DatabaseConfig | undefined;
    if (!db) return;
    const idProps = (db.schema || []).filter(s => s.type === 'unique_id');
    if (!idProps.length) return;
    const allRows = getDatabaseRows(dbPage.id);
    const targets = specificRow ? [specificRow] : allRows;
    idProps.forEach(prop => {
      const prefix = prop.idPrefix || 'ID';
      let maxExisting = 0;
      allRows.forEach((r: any) => {
        const val = String(r.propertyValues?.[prop.id] || '');
        const m = val.match(/(\d+)$/);
        if (m) maxExisting = Math.max(maxExisting, Number(m[1]) || 0);
      });
      let nextNum = Math.max(Number(prop.idNext) || 1, maxExisting + 1);
      targets.forEach((r: any) => {
        r.propertyValues = r.propertyValues || {};
        if (!r.propertyValues[prop.id]) {
          r.propertyValues[prop.id] = `${prefix}-${nextNum}`;
          nextNum++;
        }
      });
      prop.idNext = nextNum;
    });
  }

  function interpolateAutoTemplate(tpl: string, rowPage: any, dbPage: any, vars: Record<string, string> = {}): string {
    const db = ensureDatabaseConfig(dbPage);
    return String(tpl || '').replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      const rawKey = String(key).trim();
      if (rawKey.startsWith('=')) {
        const expr = rawKey.slice(1).trim();
        if (!expr) return '';
        const res = evaluateDbFormula(expr, rowPage, dbPage);
        return res && typeof res === 'object' && 'text' in res ? String(res.text ?? '') : String(res ?? '');
      }
      const k = rawKey.toLowerCase();
      if (k === 'name' || k === 'title') return rowPage?.title || 'Untitled';
      if (k === 'actor' || k === 'triggerperson' || k === 'me') return actorName();
      if (k === 'today') return new Date().toISOString().slice(0, 10);
      if (k === 'now') return new Date().toLocaleString();
      const vHit = Object.entries(vars).find(([vn]) => vn.toLowerCase() === k);
      if (vHit) return vHit[1];
      const prop = db.schema.find(s => s.name.toLowerCase() === k || s.id === rawKey);
      return prop && rowPage ? valueAsSearchText(prop, rowPage, dbPage) : '';
    });
  }

  function coerceAutomationPropValue(prop: DbSchemaProperty, rawVal: any, currentRowVal: any) {
    if (rawVal === '@clear') return prop.type === 'checkbox' ? false : (prop.type === 'multi_select' || prop.type === 'person' || prop.type === 'relation' ? [] : '');
    if (prop.type === 'checkbox') {
      if (rawVal === '@toggle') return !Boolean(currentRowVal);
      if (typeof rawVal === 'boolean') return rawVal;
      return String(rawVal).toLowerCase() === 'true' || String(rawVal) === '1' || String(rawVal).toLowerCase() === 'checked';
    }
    if (prop.type === 'date' && (rawVal === '@today' || rawVal === '@now')) {
      return { start: new Date().toISOString().slice(0, 10) };
    }
    if (prop.type === 'select' || prop.type === 'status') {
      const opt = resolveOption(prop, rawVal);
      return opt ? opt.id : rawVal;
    }
    if (prop.type === 'multi_select') {
      const vals = Array.isArray(rawVal) ? rawVal : String(rawVal || '').split(',').map(s => s.trim()).filter(Boolean);
      return vals.map(v => resolveOption(prop, v)?.id || v);
    }
    if (prop.type === 'person') {
      const users = getState()?.users || [];
      const vals = Array.isArray(rawVal) ? rawVal : String(rawVal || '').split(',').map(s => s.trim()).filter(Boolean);
      return vals.map(v => users.find((u: any) => u.id === v || u.name?.toLowerCase() === v.toLowerCase() || u.linkedAccount?.toLowerCase() === v.toLowerCase())?.id || v);
    }
    if (prop.type === 'number') return Number(rawVal) || 0;
    return rawVal;
  }

  function resolveActionValue(act: DbAutomationAction, targetProp: DbSchemaProperty, rowPage: any, dbPage: any, vars: Record<string, string> = {}) {
    if (act.useFormula && act.formulaExpr) {
      const evalRes = evaluateDbFormula(act.formulaExpr, rowPage, dbPage);
      const unwrapped = evalRes && typeof evalRes === 'object' && 'text' in evalRes ? evalRes.text : evalRes;
      return coerceAutomationPropValue(targetProp, unwrapped, getRawValue(targetProp, rowPage, dbPage));
    }
    const raw = typeof act.value === 'string' && act.value.includes('{{')
      ? interpolateAutoTemplate(act.value, rowPage, dbPage, vars)
      : act.value;
    return coerceAutomationPropValue(targetProp, raw, getRawValue(targetProp, rowPage, dbPage));
  }

  function fireDbWorkflowWebhook(rawUrl: string, headersJson: string | undefined, bodyStr: string, defaultPayload: any) {
    const cleanUrl = (rawUrl || '').trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      host?.toast?.('Invalid webhook URL (must start with http:// or https://)');
      return;
    }
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (headersJson && headersJson.trim()) {
      try {
        const parsed = JSON.parse(headersJson);
        if (parsed && typeof parsed === 'object') headers = { ...headers, ...parsed };
      } catch {}
    }
    const finalBody = bodyStr && bodyStr.trim() ? bodyStr : JSON.stringify(defaultPayload);
    try {
      (window as any).__lastWorkflowWebhookCall = { url: cleanUrl, headers, body: finalBody, at: Date.now() };
      fetch(cleanUrl, { method: 'POST', headers, body: finalBody }).catch(() => {});
    } catch {}
  }

  function executeSingleDbAction(act: DbAutomationAction, rowPage: any, dbPage: any, depth: number, vars: Record<string, string>): boolean {
    const db = ensureDatabaseConfig(dbPage);
    const users = getState()?.users || [];
    let mutated = false;
    if (act.kind === 'define_variables') {
      (act.variables || []).forEach(v => {
        const vn = (v.name || '').trim();
        if (!vn) return;
        if (v.mode === 'formula' && v.value) {
          const ev = evaluateDbFormula(v.value, rowPage, dbPage);
          vars[vn] = ev && typeof ev === 'object' && 'text' in ev ? String(ev.text ?? '') : String(ev ?? '');
        } else {
          vars[vn] = interpolateAutoTemplate(v.value || '', rowPage, dbPage, vars);
        }
      });
      return false;
    }
    if (act.kind === 'set_property' && act.propertyId) {
      const targetProp = db.schema.find(s => s.id === act.propertyId);
      if (targetProp && rowPage) {
        const nextVal = resolveActionValue(act, targetProp, rowPage, dbPage, vars);
        setRowValue(rowPage, targetProp, nextVal, dbPage, false, depth + 1);
        mutated = true;
      }
    } else if (act.kind === 'edit_pages') {
      const scope = act.targetScope || 'this_page';
      if (scope === 'this_page' && act.propertyId && rowPage) {
        const tp = db.schema.find(s => s.id === act.propertyId);
        if (tp) {
          setRowValue(rowPage, tp, resolveActionValue(act, tp, rowPage, dbPage, vars), dbPage, false, depth + 1);
          mutated = true;
        }
      } else if (scope === 'related' && act.relationPropertyId && act.propertyId && rowPage) {
        const relProp = db.schema.find(s => s.id === act.relationPropertyId && s.type === 'relation');
        const targetDb = relProp?.relationDatabaseId ? getPageById(relProp.relationDatabaseId) : null;
        if (relProp && targetDb && isDatabasePage(targetDb)) {
          const tp = ensureDatabaseConfig(targetDb).schema.find(s => s.id === act.propertyId);
          const ids = Array.isArray(rowPage?.propertyValues?.[relProp.id]) ? rowPage.propertyValues[relProp.id] : [];
          ids.forEach((rid: string) => {
            const relRow = getPageById(rid);
            if (relRow && tp) {
              setRowValue(relRow, tp, resolveActionValue(act, tp, relRow, targetDb, vars), targetDb, false, depth + 1);
              mutated = true;
            }
          });
        }
      } else if (scope === 'database') {
        const targetDb = (act.targetDatabaseId && getPageById(act.targetDatabaseId)) || dbPage;
        if (targetDb && isDatabasePage(targetDb)) {
          const tDb = ensureDatabaseConfig(targetDb);
          const tp = tDb.schema.find(s => s.id === act.propertyId);
          const fProp = act.filterPropertyId ? tDb.schema.find(s => s.id === act.filterPropertyId) : null;
          const fNeedle = interpolateAutoTemplate(act.filterValue || '', rowPage, dbPage, vars).trim().toLowerCase();
          if (tp) {
            getDatabaseRows(targetDb.id).forEach((r: any) => {
              if (fProp && fNeedle) {
                const txt = valueAsSearchText(fProp, r, targetDb).toLowerCase();
                if (!txt.includes(fNeedle)) return;
              }
              setRowValue(r, tp, resolveActionValue(act, tp, r, targetDb, vars), targetDb, false, depth + 1);
              mutated = true;
            });
          }
        }
      }
    } else if (act.kind === 'add_page') {
      const targetDb = (act.targetDatabaseId && getPageById(act.targetDatabaseId)) || dbPage;
      if (isDatabasePage(targetDb)) {
        const tDb = ensureDatabaseConfig(targetDb);
        const titleProp = tDb.schema.find(s => s.type === 'title');
        const initVals: Record<string, any> = {};
        const resolvedTitle = act.useFormula && act.formulaExpr
          ? String(evaluateDbFormula(act.formulaExpr, rowPage, dbPage)?.text ?? evaluateDbFormula(act.formulaExpr, rowPage, dbPage) ?? 'New item')
          : interpolateAutoTemplate(act.title || 'New item', rowPage, dbPage, vars);
        if (titleProp) initVals[titleProp.id] = resolvedTitle;
        (act.propAssignments || []).forEach(pa => {
          const ap = tDb.schema.find(s => s.id === pa.propertyId);
          if (ap && ap.id !== titleProp?.id) {
            initVals[ap.id] = coerceAutomationPropValue(ap, interpolateAutoTemplate(pa.value || '', rowPage, dbPage, vars), '');
          }
        });
        createDatabaseRow(targetDb, initVals, [], '📄', { automationDepth: depth + 1 });
        mutated = true;
      }
    } else if (act.kind === 'edit_related' && act.relationPropertyId && act.propertyId) {
      const relProp = db.schema.find(s => s.id === act.relationPropertyId && s.type === 'relation');
      const targetDb = relProp?.relationDatabaseId ? getPageById(relProp.relationDatabaseId) : null;
      if (relProp && targetDb && isDatabasePage(targetDb)) {
        const tDb = ensureDatabaseConfig(targetDb);
        const targetProp = tDb.schema.find(s => s.id === act.propertyId);
        const ids = Array.isArray(rowPage?.propertyValues?.[relProp.id]) ? rowPage.propertyValues[relProp.id] : [];
        ids.forEach((rid: string) => {
          const relRow = getPageById(rid);
          if (relRow && targetProp) {
            const nv = resolveActionValue(act, targetProp, relRow, targetDb, vars);
            setRowValue(relRow, targetProp, nv, targetDb, false, depth + 1);
            mutated = true;
          }
        });
      }
    } else if (act.kind === 'send_notification') {
      const body = interpolateAutoTemplate(act.message || `Updated ${rowPage?.title || 'row'}`, rowPage, dbPage, vars);
      let targets: Array<string | undefined> = [];
      if (act.recipientMode === 'person_prop' && act.recipientPropertyId) {
        const pIds = Array.isArray(rowPage?.propertyValues?.[act.recipientPropertyId])
          ? rowPage.propertyValues[act.recipientPropertyId]
          : (rowPage?.propertyValues?.[act.recipientPropertyId] ? [rowPage.propertyValues[act.recipientPropertyId]] : []);
        pIds.forEach((pid: string) => {
          const usr = users.find((u: any) => u.id === pid || u.name === pid);
          if (usr) targets.push(usr.linkedAccount || usr.name);
          else if (pid) targets.push(pid);
        });
      } else if (act.recipientMode === 'everyone') {
        targets = users.map((u: any) => u.linkedAccount || u.name);
      } else if (Array.isArray(act.recipientAccounts) && act.recipientAccounts.length) {
        targets = [...act.recipientAccounts];
      } else if (act.targetAccount) {
        targets = [act.targetAccount];
      }
      if (!targets.length) targets = [undefined];
      targets.forEach(targetAccount => {
        host?.pushNotification?.({
          kind: 'database',
          title: `${dbPage.title || 'Database'} automation`,
          body,
          pageId: rowPage?.id || dbPage.id,
          targetAccount
        });
      });
    } else if (act.kind === 'send_message') {
      const body = interpolateAutoTemplate(act.message || `Update from ${rowPage?.title || dbPage.title || 'Database'}`, rowPage, dbPage, vars);
      host?.pushChatMessage?.({
        channelId: act.chatChannelId,
        targetAccount: act.chatTargetAccount,
        text: body,
        fromAutomation: dbPage?.title || 'Database'
      });
    } else if (act.kind === 'send_webhook') {
      const bodyStr = act.webhookBody ? interpolateAutoTemplate(act.webhookBody, rowPage, dbPage, vars) : '';
      fireDbWorkflowWebhook(act.webhookUrl || '', act.webhookHeadersJson, bodyStr, {
        source: 'database_workflow',
        databaseId: dbPage.id,
        databaseTitle: dbPage.title,
        rowId: rowPage?.id,
        rowTitle: rowPage?.title,
        properties: rowPage?.propertyValues || {},
        variables: vars,
        timestamp: Date.now()
      });
    } else if (act.kind === 'open_page') {
      if (act.openMode === 'url' && act.openUrl) {
        const u = interpolateAutoTemplate(act.openUrl, rowPage, dbPage, vars);
        if (/^https?:\/\//i.test(u)) { try { window.open(u, '_blank', 'noopener,noreferrer'); } catch {} }
      } else {
        const destId = (!act.openPageId || act.openPageId === 'current_row') ? rowPage?.id : act.openPageId;
        if (destId) {
          const targetPg = getPageById(destId);
          if (act.openViewId && targetPg && isDatabasePage(targetPg)) {
            const tDb = ensureDatabaseConfig(targetPg);
            if (tDb.views.some(v => v.id === act.openViewId)) tDb.activeViewId = act.openViewId;
          }
          host?.navigateToPage?.(destId);
        }
      }
    }
    return mutated;
  }

  function executeAutomationActions(actions: DbAutomationAction[], rowPage: any, dbPage: any, depth = 0, vars: Record<string, string> = {}): boolean {
    if (!Array.isArray(actions) || !actions.length || depth > 4) return false;
    let mutated = false;
    actions.forEach(act => {
      if (act.kind === 'show_confirmation') return;
      if (executeSingleDbAction(act, rowPage, dbPage, depth, vars)) mutated = true;
    });
    return mutated;
  }

  function normalizeDbActionBranches(act: DbAutomationAction): DbAutomationBranch[] {
    if (Array.isArray(act.branches) && act.branches.length) return act.branches;
    const okLbl = (act.confirmLabel || '').trim() || 'Okay';
    act.branches = [
      { id: `dbr-ok-${act.id}`, label: okLbl, style: 'primary', mode: 'continue', actions: [] },
      { id: `dbr-cancel-${act.id}`, label: 'Cancel', style: 'default', mode: 'stop', actions: [] }
    ];
    return act.branches;
  }

  function openDbChoiceBranchModal(titleText: string, bodyText: string, branches: DbAutomationBranch[], onChoose: (br: DbAutomationBranch) => void) {
    closeNotionWorkflowModal();
    const overlay = document.createElement('div');
    overlay.className = 'notion-workflow-overlay db-interactive-surface';
    const card = document.createElement('div');
    card.className = 'notion-workflow-modal is-confirm-modal';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    const body = document.createElement('div');
    body.className = 'notion-wf-confirm-body';
    body.innerHTML = `<strong>${escHtml(titleText)}</strong><p>${escHtml(bodyText)}</p>`;
    const acts = document.createElement('div');
    acts.className = 'notion-wf-confirm-actions';
    branches.forEach(br => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = br.style === 'primary' ? 'share-button' : br.style === 'danger' ? 'secondary-button is-danger' : 'secondary-button';
      btn.dataset.branchId = br.id;
      btn.textContent = br.label || 'Continue';
      btn.onclick = () => { overlay.remove(); activeWorkflowOverlay = null; onChoose(br); };
      acts.append(btn);
    });
    card.append(body, acts);
    overlay.addEventListener('click', ev => { if (ev.target === overlay) { overlay.remove(); activeWorkflowOverlay = null; } });
    overlay.append(card);
    document.body.append(overlay);
    activeWorkflowOverlay = overlay;
  }

  function executeAutomationStepsInteractive(
    actions: DbAutomationAction[],
    rowPage: any,
    dbPage: any,
    titleContext: string,
    startIdx = 0,
    vars: Record<string, string> = {},
    depth = 0,
    onDone?: () => void
  ) {
    if (!Array.isArray(actions) || depth > 4) { onDone?.(); return; }
    for (let i = startIdx; i < actions.length; i++) {
      const act = actions[i];
      if (act.kind === 'show_confirmation') {
        const branches = normalizeDbActionBranches(act);
        openDbChoiceBranchModal(
          act.confirmTitle || titleContext || 'Confirm action',
          interpolateAutoTemplate(act.confirmMessage || 'Are you sure you want to continue?', rowPage, dbPage, vars),
          branches,
          br => {
            if (br.mode === 'stop') return;
            if (br.mode === 'branch' && Array.isArray(br.actions) && br.actions.length) {
              executeAutomationStepsInteractive(br.actions, rowPage, dbPage, br.label || titleContext, 0, { ...vars }, depth + 1, onDone);
              return;
            }
            executeAutomationStepsInteractive(actions, rowPage, dbPage, titleContext, i + 1, vars, depth, onDone);
          }
        );
        return;
      }
      executeSingleDbAction(act, rowPage, dbPage, depth, vars);
    }
    onDone?.();
  }

  function evaluateTriggerCondition(trig: DbAutomationTrigger, rowPage: any, dbPage: any, db: DatabaseConfig): boolean {
    if (!trig.propertyId || trig.propertyId === '__any__') return true;
    const prop = db.schema.find(s => s.id === trig.propertyId);
    if (!prop) return true;
    const actual = valueAsSearchText(prop, rowPage, dbPage).trim().toLowerCase();
    const pills = (trig.matchValues && trig.matchValues.length)
      ? trig.matchValues.map(s => String(s).trim().toLowerCase()).filter(Boolean)
      : (trig.matchValue && trig.matchValue.trim() ? [trig.matchValue.trim().toLowerCase()] : []);
    const op = trig.operator || (pills.length ? 'is' : 'any_edit');
    if (op === 'is_empty') return !actual;
    if (op === 'is_not_empty') return !!actual;
    if (!pills.length || op === 'any_edit') return true;
    if (op === 'contains') return pills.some(p => actual.includes(p));
    return pills.some(p => actual === p);
  }

  function triggerDatabaseAutomations(
    triggerKind: DbAutomationTriggerKind,
    rowPage: any,
    dbPage: any,
    changedPropId?: string,
    depth = 0
  ) {
    if (depth > 3 || roMode(dbPage)) return;
    const db = dbPage?.database as DatabaseConfig | undefined;
    const list = (db?.automations || []).filter(a => a.enabled);
    if (!list.length || !db) return;
    let didMutate = false;
    list.forEach(auto => {
      const trigs = (auto.triggers && auto.triggers.length) ? auto.triggers : (auto.trigger ? [auto.trigger] : []);
      if (!trigs.length) return;
      const matchesEvent = (t: DbAutomationTrigger) => {
        if (t.kind !== triggerKind) return false;
        if (triggerKind === 'property_edited') {
          if (t.propertyId && t.propertyId !== '__any__' && t.propertyId !== changedPropId) return false;
        }
        return evaluateTriggerCondition(t, rowPage, dbPage, db);
      };
      const anyEventMatched = trigs.some(matchesEvent);
      if (!anyEventMatched) return;
      if (auto.triggerMatch !== 'any' && trigs.length > 1) {
        const allOk = trigs.every(t => {
          if (t.kind === 'page_added') return triggerKind === 'page_added' || matchesEvent(t);
          return evaluateTriggerCondition(t, rowPage, dbPage, db);
        });
        if (!allOk) return;
      }
      auto.runCount = (auto.runCount || 0) + 1;
      auto.lastRunAt = Date.now();
      if (executeAutomationActions(auto.actions, rowPage, dbPage, depth + 1)) didMutate = true;
    });
    if (didMutate) persist(false);
  }

  function createDatabaseRow(
    dbPage: any,
    initialValues: Record<string, any> = {},
    initialBlocks: any[] = [],
    icon = '📄',
    opts: { skipAutomations?: boolean; automationDepth?: number } = {}
  ) {
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
      createdBy: actorName(),
      lastEditedBy: actorName(),
      createdAt: now,
      updatedAt: now
    };
    s.pages.push(rowPage);
    assignUniqueIds(dbPage, rowPage);
    if (!opts.skipAutomations) {
      triggerDatabaseAutomations('page_added', rowPage, dbPage, undefined, opts.automationDepth || 0);
    }
    return rowPage;
  }

  function seedStarterRows(dbPage: any) {
    if (getDatabaseRows(dbPage.id).length) return;
    for (let k = 0; k < 3; k++) {
      createDatabaseRow(dbPage, {}, [], '📄', { skipAutomations: true });
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

  type FNode =
    | { kind: 'lit'; v: any }
    | { kind: 'id'; name: string }
    | { kind: 'arr'; items: FNode[] }
    | { kind: 'call'; fn: string; args: FNode[] }
    | { kind: 'member'; target: FNode; name: string; args?: FNode[] }
    | { kind: 'un'; op: string; expr: FNode }
    | { kind: 'bin'; op: string; left: FNode; right: FNode };

  function unwrapFormulaVal(v: any): any {
    if (v && typeof v === 'object') {
      if (v.__dbRow) return v.__dbRow.title || 'Untitled';
      if (v.__richFormula) return v.text ?? '';
    }
    return v;
  }

  function formulaAsString(v: any): string {
    const u = unwrapFormulaVal(v);
    if (u == null) return '';
    if (Array.isArray(u)) return u.map(formulaAsString).join(', ');
    if (typeof u === 'object' && u.start) return dateTextOf(u);
    return String(u);
  }

  function formulaDateMs(v: any): number {
    const u = v && typeof v === 'object' && v.start ? v.start : unwrapFormulaVal(v);
    if (typeof u === 'number') return u;
    const ms = Date.parse(String(u || ''));
    return Number.isNaN(ms) ? NaN : ms;
  }

  // Safe AST recursive-descent Formulas 2.0 evaluator (let/lets, current, list methods, regex, dates, style/link).
  function evaluateDbFormula(expr: string, rowPage: any, dbPage: any, depth = 0): any {
    if (!expr || !expr.trim() || depth > 5) return '';
    const db = ensureDatabaseConfig(dbPage);
    const readPropForRow = (name: string, targetRow = rowPage, targetDb = dbPage): any => {
      const tDb = ensureDatabaseConfig(targetDb);
      const target = tDb.schema.find(s => s.name.toLowerCase() === String(name).toLowerCase());
      if (!target) return '';
      if (target.type === 'formula') return evaluateDbFormula(target.formulaExpr || '', targetRow, targetDb, depth + 1);
      if (target.type === 'relation') {
        const ids = Array.isArray(targetRow.propertyValues?.[target.id]) ? targetRow.propertyValues[target.id] : [];
        const relDb = target.relationDatabaseId ? getPageById(target.relationDatabaseId) : null;
        return ids.map((rid: string) => getPageById(rid)).filter(Boolean).map((lr: any) => ({
          __dbRow: lr,
          __dbPage: relDb && isDatabasePage(relDb) ? relDb : targetDb
        }));
      }
      const raw = getRawValue(target, targetRow, targetDb, depth + 1);
      if (target.type === 'select' || target.type === 'status') return resolveOption(target, raw)?.name || raw || '';
      if (target.type === 'multi_select') {
        return (Array.isArray(raw) ? raw : []).map((idVal: any) => resolveOption(target, idVal)?.name || String(idVal));
      }
      if (target.type === 'person') {
        const users = getState()?.users || [];
        return (Array.isArray(raw) ? raw : raw ? [raw] : []).map((uidVal: any) => users.find((u: any) => u.id === uidVal)?.name || String(uidVal));
      }
      if (target.type === 'date') return typeof raw === 'object' && raw?.start ? raw.start : (raw || '');
      return raw ?? '';
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
          let ident = '';
          while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) ident += src[i++];
          if (ident === 'true') tokens.push({ t: 'bool', v: true });
          else if (ident === 'false') tokens.push({ t: 'bool', v: false });
          else tokens.push({ t: 'id', v: ident });
          continue;
        }
        const two = src.slice(i, i + 2);
        if (['==', '!=', '>=', '<=', '&&', '||'].includes(two)) {
          tokens.push({ t: 'op', v: two });
          i += 2;
          continue;
        }
        if ('+-*/%><!(),.[]:'.includes(ch)) {
          tokens.push({ t: '()[],.'.includes(ch) ? ch : 'op', v: ch });
          i++;
          continue;
        }
        i++;
      }

      let pos = 0;
      const peek = () => tokens[pos];
      const consume = () => tokens[pos++];

      const parsePrimary = (): FNode => {
        const tk = peek();
        if (!tk) return { kind: 'lit', v: '' };
        if (tk.t === 'num' || tk.t === 'str' || tk.t === 'bool') { consume(); return { kind: 'lit', v: tk.v }; }
        if (tk.t === '[') {
          consume();
          const items: FNode[] = [];
          while (peek() && peek().t !== ']') {
            items.push(parseOr());
            if (peek()?.t === ',') consume();
          }
          if (peek()?.t === ']') consume();
          return { kind: 'arr', items };
        }
        if (tk.t === 'id') {
          consume();
          if (peek()?.t === '(') {
            consume();
            const args: FNode[] = [];
            while (peek() && peek().t !== ')') {
              args.push(parseOr());
              if (peek()?.t === ',') consume();
            }
            if (peek()?.t === ')') consume();
            return { kind: 'call', fn: tk.v, args };
          }
          return { kind: 'id', name: tk.v };
        }
        if (tk.t === '(') {
          consume();
          const inner = parseOr();
          if (peek()?.t === ')') consume();
          return inner;
        }
        return { kind: 'lit', v: '' };
      };

      const parsePostfix = (): FNode => {
        let node = parsePrimary();
        while (peek()?.t === '.') {
          consume();
          const mTok = peek();
          if (!mTok || mTok.t !== 'id') break;
          consume();
          let args: FNode[] | undefined;
          if (peek()?.t === '(') {
            consume();
            args = [];
            while (peek() && peek().t !== ')') {
              args.push(parseOr());
              if (peek()?.t === ',') consume();
            }
            if (peek()?.t === ')') consume();
          }
          node = { kind: 'member', target: node, name: mTok.v, args };
        }
        return node;
      };

      const parseUnary = (): FNode => {
        const tk = peek();
        if (tk?.t === 'op' && (tk.v === '!' || tk.v === '-')) {
          consume();
          return { kind: 'un', op: tk.v, expr: parseUnary() };
        }
        return parsePostfix();
      };

      const parseMul = (): FNode => {
        let left = parseUnary();
        while (peek()?.t === 'op' && ['*', '/', '%'].includes(peek().v)) {
          const op = consume().v;
          left = { kind: 'bin', op, left, right: parseUnary() };
        }
        return left;
      };

      const parseAdd = (): FNode => {
        let left = parseMul();
        while (peek()?.t === 'op' && ['+', '-'].includes(peek().v)) {
          const op = consume().v;
          left = { kind: 'bin', op, left, right: parseMul() };
        }
        return left;
      };

      const parseCmp = (): FNode => {
        let left = parseAdd();
        while (peek()?.t === 'op' && ['==', '!=', '>', '>=', '<', '<='].includes(peek().v)) {
          const op = consume().v;
          left = { kind: 'bin', op, left, right: parseAdd() };
        }
        return left;
      };

      const parseAnd = (): FNode => {
        let left = parseCmp();
        while (peek()?.t === 'op' && peek().v === '&&') {
          consume();
          left = { kind: 'bin', op: '&&', left, right: parseCmp() };
        }
        return left;
      };

      const parseOr = (): FNode => {
        let left = parseAnd();
        while (peek()?.t === 'op' && peek().v === '||') {
          consume();
          left = { kind: 'bin', op: '||', left, right: parseAnd() };
        }
        return left;
      };

      const ast = parseOr();

      const invokeFn = (lower: string, evalArgNodes: FNode[], env: Map<string, any>, receiver?: any): any => {
        const evalA = (idx: number) => idx < evalArgNodes.length ? evalAst(evalArgNodes[idx], env) : undefined;
        const evalAll = () => evalArgNodes.map(a => evalAst(a, env));

        // Scoped bindings (lazy AST evaluation!)
        if (lower === 'let') {
          const varNode = evalArgNodes[0];
          const varName = varNode?.kind === 'id' ? varNode.name : formulaAsString(evalA(0));
          const childEnv = new Map(env);
          childEnv.set(varName, evalA(1));
          return evalAst(evalArgNodes[2] || { kind: 'lit', v: '' }, childEnv);
        }
        if (lower === 'lets') {
          const childEnv = new Map(env);
          for (let k = 0; k + 1 < evalArgNodes.length - 1; k += 2) {
            const vn = evalArgNodes[k];
            const name = vn?.kind === 'id' ? vn.name : formulaAsString(evalAst(vn, childEnv));
            childEnv.set(name, evalAst(evalArgNodes[k + 1], childEnv));
          }
          const last = evalArgNodes[evalArgNodes.length - 1];
          return last ? evalAst(last, childEnv) : '';
        }

        // Branching
        if (lower === 'if') return evalA(0) ? evalA(1) : evalA(2);
        if (lower === 'ifs') {
          for (let k = 0; k < evalArgNodes.length; k += 2) {
            if (k + 1 >= evalArgNodes.length) return evalAst(evalArgNodes[k], env);
            if (evalAst(evalArgNodes[k], env)) return evalAst(evalArgNodes[k + 1], env);
          }
          return '';
        }

        // Member/collection callbacks binding `current`
        if (['map', 'filter', 'find', 'some', 'every'].includes(lower)) {
          const listSrc = receiver !== undefined ? receiver : evalA(0);
          const exprNode = receiver !== undefined ? evalArgNodes[0] : evalArgNodes[1];
          const arr = Array.isArray(listSrc) ? listSrc : (listSrc == null || listSrc === '' ? [] : [listSrc]);
          if (!exprNode) return lower === 'map' || lower === 'filter' ? arr : undefined;
          const runCb = (el: any) => {
            const childEnv = new Map(env);
            childEnv.set('current', el);
            return evalAst(exprNode, childEnv);
          };
          if (lower === 'map') return arr.map(runCb);
          if (lower === 'filter') return arr.filter(el => Boolean(runCb(el)));
          if (lower === 'find') return arr.find(el => Boolean(runCb(el))) ?? '';
          if (lower === 'some') return arr.some(el => Boolean(runCb(el)));
          return arr.every(el => Boolean(runCb(el)));
        }

        const args = evalAll();
        const targetVal = receiver !== undefined ? receiver : args[0];
        const a0 = receiver !== undefined ? args[0] : args[1];
        const a1 = receiver !== undefined ? args[1] : args[2];

        if (lower === 'prop') {
          if (receiver && receiver.__dbRow) {
            return readPropForRow(formulaAsString(args[0]), receiver.__dbRow, receiver.__dbPage);
          }
          return readPropForRow(formulaAsString(args[0]));
        }

        // Array & sequence methods
        if (lower === 'at') {
          const arr = Array.isArray(targetVal) ? targetVal : [];
          const i = Number(a0) || 0;
          return arr[i < 0 ? arr.length + i : i] ?? '';
        }
        if (lower === 'first') return Array.isArray(targetVal) ? (targetVal[0] ?? '') : targetVal;
        if (lower === 'last') return Array.isArray(targetVal) ? (targetVal[targetVal.length - 1] ?? '') : targetVal;
        if (lower === 'flat') return Array.isArray(targetVal) ? targetVal.reduce((acc: any[], x: any) => acc.concat(Array.isArray(x) ? x : [x]), []) : [targetVal];
        if (lower === 'unique') {
          const arr = Array.isArray(targetVal) ? targetVal : [targetVal];
          const seen = new Set<string>();
          return arr.filter(x => { const k = formulaAsString(x); if (seen.has(k)) return false; seen.add(k); return true; });
        }
        if (lower === 'sort') {
          const arr = Array.isArray(targetVal) ? [...targetVal] : [];
          return arr.sort((x, y) => formulaAsString(x).localeCompare(formulaAsString(y), undefined, { numeric: true }));
        }
        if (lower === 'reverse') return Array.isArray(targetVal) ? [...targetVal].reverse() : formulaAsString(targetVal).split('').reverse().join('');
        if (lower === 'join') return (Array.isArray(targetVal) ? targetVal : [targetVal]).map(formulaAsString).join(a0 != null ? String(a0) : ', ');
        if (lower === 'includes') {
          if (Array.isArray(targetVal)) return targetVal.some(x => formulaAsString(x) === formulaAsString(a0));
          return formulaAsString(targetVal).includes(formulaAsString(a0));
        }
        if (lower === 'length') return Array.isArray(targetVal) ? targetVal.length : formulaAsString(targetVal).length;
        if (lower === 'empty') {
          const u = unwrapFormulaVal(targetVal);
          return u == null || u === '' || (Array.isArray(u) && u.length === 0);
        }
        if (lower === 'mean') {
          const arr = Array.isArray(targetVal) ? targetVal : args;
          const nums = arr.map((x: any) => Number(unwrapFormulaVal(x))).filter((n: number) => !Number.isNaN(n));
          return nums.length ? nums.reduce((a: number, b: number) => a + b, 0) / nums.length : 0;
        }
        if (lower === 'sum') {
          const arr = receiver !== undefined && Array.isArray(receiver) ? receiver : (args.length === 1 && Array.isArray(args[0]) ? args[0] : args);
          return arr.reduce((acc: number, x: any) => acc + (Number(unwrapFormulaVal(x)) || 0), 0);
        }
        if (lower === 'min') {
          const arr = receiver !== undefined && Array.isArray(receiver) ? receiver : (args.length === 1 && Array.isArray(args[0]) ? args[0] : args);
          const nums = arr.map((x: any) => Number(unwrapFormulaVal(x))).filter((n: number) => !Number.isNaN(n));
          return nums.length ? Math.min(...nums) : 0;
        }
        if (lower === 'max') {
          const arr = receiver !== undefined && Array.isArray(receiver) ? receiver : (args.length === 1 && Array.isArray(args[0]) ? args[0] : args);
          const nums = arr.map((x: any) => Number(unwrapFormulaVal(x))).filter((n: number) => !Number.isNaN(n));
          return nums.length ? Math.max(...nums) : 0;
        }

        // Logic helpers
        if (lower === 'and') return args.every(Boolean);
        if (lower === 'or') return args.some(Boolean);
        if (lower === 'not') return !args[0];
        if (lower === 'equal') return formulaAsString(targetVal) === formulaAsString(a0);
        if (lower === 'unequal') return formulaAsString(targetVal) !== formulaAsString(a0);

        // String & regex functions
        if (lower === 'concat') return args.map(formulaAsString).join('');
        if (lower === 'lower') return formulaAsString(targetVal).toLowerCase();
        if (lower === 'upper') return formulaAsString(targetVal).toUpperCase();
        if (lower === 'trim') return formulaAsString(targetVal).trim();
        if (lower === 'contains') return formulaAsString(targetVal).toLowerCase().includes(formulaAsString(a0).toLowerCase());
        if (lower === 'startswith') return formulaAsString(targetVal).startsWith(formulaAsString(a0));
        if (lower === 'endswith') return formulaAsString(targetVal).endsWith(formulaAsString(a0));
        if (lower === 'substring' || lower === 'slice') {
          if (Array.isArray(targetVal)) return targetVal.slice(Number(a0) || 0, a1 != null ? Number(a1) : undefined);
          return formulaAsString(targetVal).slice(Number(a0) || 0, a1 != null ? Number(a1) : undefined);
        }
        if (lower === 'split') return formulaAsString(targetVal).split(formulaAsString(a0));
        if (lower === 'repeat') return formulaAsString(targetVal).repeat(Math.max(0, Math.min(200, Number(a0) || 0)));
        if (lower === 'padstart') return formulaAsString(targetVal).padStart(Number(a0) || 0, a1 != null ? String(a1) : ' ');
        if (lower === 'padend') return formulaAsString(targetVal).padEnd(Number(a0) || 0, a1 != null ? String(a1) : ' ');
        if (lower === 'test') {
          try { return new RegExp(formulaAsString(a0)).test(formulaAsString(targetVal)); } catch { return false; }
        }
        if (lower === 'match') {
          try { return formulaAsString(targetVal).match(new RegExp(formulaAsString(a0), 'g')) || []; } catch { return []; }
        }
        if (lower === 'replace') {
          try { return formulaAsString(targetVal).replace(new RegExp(formulaAsString(a0)), formulaAsString(a1)); } catch { return formulaAsString(targetVal); }
        }
        if (lower === 'replaceall') {
          try { return formulaAsString(targetVal).replace(new RegExp(formulaAsString(a0), 'g'), formulaAsString(a1)); } catch { return formulaAsString(targetVal); }
        }

        // Math & numbers
        if (lower === 'tonumber') return Number(unwrapFormulaVal(targetVal)) || 0;
        if (lower === 'format') return formulaAsString(targetVal);
        if (lower === 'round') return Math.round(Number(unwrapFormulaVal(targetVal)) || 0);
        if (lower === 'floor') return Math.floor(Number(unwrapFormulaVal(targetVal)) || 0);
        if (lower === 'ceil') return Math.ceil(Number(unwrapFormulaVal(targetVal)) || 0);
        if (lower === 'abs') return Math.abs(Number(unwrapFormulaVal(targetVal)) || 0);
        if (lower === 'sqrt') return Math.sqrt(Math.max(0, Number(unwrapFormulaVal(targetVal)) || 0));
        if (lower === 'cbrt') return Math.cbrt(Number(unwrapFormulaVal(targetVal)) || 0);
        if (lower === 'exp') return Math.exp(Number(unwrapFormulaVal(targetVal)) || 0);
        if (lower === 'log10') return Math.log10(Math.max(1e-9, Number(unwrapFormulaVal(targetVal)) || 1));
        if (lower === 'log2') return Math.log2(Math.max(1e-9, Number(unwrapFormulaVal(targetVal)) || 1));
        if (lower === 'sign') return Math.sign(Number(unwrapFormulaVal(targetVal)) || 0);
        if (lower === 'pow') return Math.pow(Number(unwrapFormulaVal(targetVal)) || 0, Number(a0) || 0);
        if (lower === 'mod') return (Number(unwrapFormulaVal(targetVal)) || 0) % (Number(a0) || 1);

        // Date & time
        if (lower === 'now' || lower === 'today') return new Date().toISOString().slice(0, 10);
        if (lower === 'fromtimestamp') {
          const n = Number(unwrapFormulaVal(targetVal));
          return Number.isNaN(n) ? '' : new Date(n).toISOString().slice(0, 10);
        }
        if (lower === 'timestamp') {
          const ms = formulaDateMs(targetVal);
          return Number.isNaN(ms) ? 0 : ms;
        }
        if (lower === 'dateadd' || lower === 'datesubtract') {
          const base = new Date(formulaDateMs(targetVal));
          if (Number.isNaN(base.getTime())) return '';
          const delta = (lower === 'datesubtract' ? -1 : 1) * (Number(a0) || 0);
          const u = String(a1 || 'days').toLowerCase();
          if (u.startsWith('year')) base.setFullYear(base.getFullYear() + delta);
          else if (u.startsWith('month')) base.setMonth(base.getMonth() + delta);
          else if (u.startsWith('week')) base.setDate(base.getDate() + delta * 7);
          else if (u.startsWith('hour')) base.setHours(base.getHours() + delta);
          else if (u.startsWith('minute')) base.setMinutes(base.getMinutes() + delta);
          else base.setDate(base.getDate() + delta);
          return base.toISOString().slice(0, 10);
        }
        if (lower === 'datebetween') {
          const d1 = formulaDateMs(targetVal), d2 = formulaDateMs(a0);
          if (Number.isNaN(d1) || Number.isNaN(d2)) return 0;
          const unit = String(a1 || 'days').toLowerCase();
          const diffMs = d1 - d2;
          if (unit.startsWith('hour')) return Math.round(diffMs / 3600000);
          if (unit.startsWith('week')) return Math.round(diffMs / (7 * 86400000));
          if (unit.startsWith('month')) return Math.round(diffMs / (30.4375 * 86400000));
          if (unit.startsWith('year')) return Math.round(diffMs / (365.25 * 86400000));
          return Math.round(diffMs / 86400000);
        }
        if (lower === 'formatdate') {
          const d = new Date(formulaDateMs(targetVal));
          if (Number.isNaN(d.getTime())) return '';
          const fmt = String(a0 || 'YYYY-MM-DD');
          const pad2 = (n: number) => String(n).padStart(2, '0');
          return fmt
            .replace(/YYYY/g, String(d.getFullYear()))
            .replace(/MMM/g, d.toLocaleString('en-US', { month: 'short' }))
            .replace(/MM/g, pad2(d.getMonth() + 1))
            .replace(/DD/g, pad2(d.getDate()))
            .replace(/HH/g, pad2(d.getHours()))
            .replace(/mm/g, pad2(d.getMinutes()));
        }
        if (['year', 'month', 'date', 'day', 'hour', 'minute'].includes(lower)) {
          const d = new Date(formulaDateMs(targetVal));
          if (Number.isNaN(d.getTime())) return 0;
          if (lower === 'year') return d.getFullYear();
          if (lower === 'month') return d.getMonth() + 1;
          if (lower === 'date') return d.getDate();
          if (lower === 'day') return d.getDay();
          if (lower === 'hour') return d.getHours();
          return d.getMinutes();
        }

        // Rich output formatting: style() and link()
        if (lower === 'style') {
          const base = targetVal && targetVal.__richFormula ? { ...targetVal } : { __richFormula: true, text: formulaAsString(targetVal), styles: [] as string[] };
          const styleArgs = receiver !== undefined ? args : args.slice(1);
          base.styles = [...new Set([...(base.styles || []), ...styleArgs.map(s => String(s).trim()).filter(Boolean)])];
          return base;
        }
        if (lower === 'link') {
          const hrefRaw = String(a0 || '');
          const safeHref = /^https?:\/\/|^#/i.test(hrefRaw) ? hrefRaw : '';
          return { __richFormula: true, text: formulaAsString(targetVal), href: safeHref, styles: targetVal?.styles || [] };
        }
        return '';
      };

      const evalAst = (node: FNode, env: Map<string, any>): any => {
        if (node.kind === 'lit') return node.v;
        if (node.kind === 'arr') return node.items.map(it => evalAst(it, env));
        if (node.kind === 'id') {
          if (env.has(node.name)) return env.get(node.name);
          return readPropForRow(node.name);
        }
        if (node.kind === 'call') return invokeFn(node.fn.toLowerCase(), node.args, env);
        if (node.kind === 'member') {
          const target = evalAst(node.target, env);
          if (node.args !== undefined) return invokeFn(node.name.toLowerCase(), node.args, env, target);
          if (node.name === 'length') return Array.isArray(target) ? target.length : formulaAsString(target).length;
          return '';
        }
        if (node.kind === 'un') {
          const val = evalAst(node.expr, env);
          return node.op === '!' ? !val : -(Number(unwrapFormulaVal(val)) || 0);
        }
        if (node.kind === 'bin') {
          if (node.op === '&&') return evalAst(node.left, env) && evalAst(node.right, env);
          if (node.op === '||') return evalAst(node.left, env) || evalAst(node.right, env);
          const l = unwrapFormulaVal(evalAst(node.left, env));
          const r = unwrapFormulaVal(evalAst(node.right, env));
          if (node.op === '+') {
            if (typeof l === 'string' || typeof r === 'string') return String(l ?? '') + String(r ?? '');
            return (Number(l) || 0) + (Number(r) || 0);
          }
          if (node.op === '-') return (Number(l) || 0) - (Number(r) || 0);
          if (node.op === '*') return (Number(l) || 0) * (Number(r) || 0);
          if (node.op === '/') return (Number(r) || 0) === 0 ? 0 : (Number(l) || 0) / (Number(r) || 0);
          if (node.op === '%') return (Number(l) || 0) % (Number(r) || 1);
          if (node.op === '==') return formulaAsString(l) === formulaAsString(r);
          if (node.op === '!=') return formulaAsString(l) !== formulaAsString(r);
          if (node.op === '>') return Number(l) > Number(r);
          if (node.op === '>=') return Number(l) >= Number(r);
          if (node.op === '<') return Number(l) < Number(r);
          if (node.op === '<=') return Number(l) <= Number(r);
        }
        return '';
      };

      const res = evalAst(ast, new Map());
      if (Array.isArray(res)) return res.map(formulaAsString).join(', ');
      if (res && typeof res === 'object' && res.__dbRow) return res.__dbRow.title || 'Untitled';
      return res;
    } catch {
      return '';
    }
  }

  function getRawValue(prop: DbSchemaProperty, rowPage: any, dbPage: any, depth = 0): any {
    if (!prop || !rowPage || depth > 5) return '';
    if (prop.type === 'title') return rowPage.title || '';
    if (prop.type === 'created_time') return rowPage.createdAt ? new Date(rowPage.createdAt).toLocaleString() : '';
    if (prop.type === 'last_edited_time') return rowPage.updatedAt ? new Date(rowPage.updatedAt).toLocaleString() : '';
    if (prop.type === 'created_by') return rowPage.createdBy || actorName();
    if (prop.type === 'last_edited_by') return rowPage.lastEditedBy || actorName();
    if (prop.type === 'unique_id') return rowPage.propertyValues?.[prop.id] || '';
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
      const calc: DbRollupCalc = prop.rollupCalc || 'count_all';
      if (calc === 'count_all') return linkedRows.length;
      const vals = linkedRows.map((lr: any) => targetProp ? getRawValue(targetProp, lr, targetDb, depth + 1) : '');
      const isEmptyV = (v: any) => v === '' || v == null || (Array.isArray(v) && v.length === 0) || (typeof v === 'object' && 'start' in v && !v.start);
      const nonEmpty = vals.filter((v: any) => !isEmptyV(v));
      const emptyCount = linkedRows.length - nonEmpty.length;
      if (calc === 'count_values' || calc === 'count_not_empty') return nonEmpty.length;
      if (calc === 'count_empty') return emptyCount;
      if (calc === 'percent_empty') return linkedRows.length ? `${Math.round((emptyCount / linkedRows.length) * 100)}%` : '0%';
      if (calc === 'percent_not_empty') return linkedRows.length ? `${Math.round((nonEmpty.length / linkedRows.length) * 100)}%` : '0%';
      if (calc === 'count_unique') {
        const u = new Set(nonEmpty.map((v: any) => formulaAsString(v)));
        return u.size;
      }
      if (calc === 'checked' || calc === 'unchecked' || calc === 'percent_checked' || calc === 'percent_unchecked') {
        const chk = vals.filter(Boolean).length;
        const unchk = linkedRows.length - chk;
        if (calc === 'checked') return chk;
        if (calc === 'unchecked') return unchk;
        if (calc === 'percent_checked') return linkedRows.length ? `${Math.round((chk / linkedRows.length) * 100)}%` : '0%';
        return linkedRows.length ? `${Math.round((unchk / linkedRows.length) * 100)}%` : '0%';
      }
      if (calc === 'sum' || calc === 'average' || calc === 'median' || calc === 'min' || calc === 'max' || calc === 'range') {
        const nums = nonEmpty.map((v: any) => Number(unwrapFormulaVal(v))).filter((n: number) => !Number.isNaN(n)).sort((a: number, b: number) => a - b);
        if (!nums.length) return 0;
        if (calc === 'sum') return nums.reduce((a: number, b: number) => a + b, 0);
        if (calc === 'average') return Math.round((nums.reduce((a: number, b: number) => a + b, 0) / nums.length) * 100) / 100;
        if (calc === 'median') {
          const mid = Math.floor(nums.length / 2);
          return nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
        }
        if (calc === 'min') return nums[0];
        if (calc === 'max') return nums[nums.length - 1];
        return nums[nums.length - 1] - nums[0];
      }
      if (calc === 'earliest_date' || calc === 'latest_date' || calc === 'date_range_days') {
        const dates = nonEmpty.map((v: any) => (typeof v === 'object' && v.start ? v.start : String(v))).filter((s: string) => !Number.isNaN(Date.parse(s))).sort();
        if (!dates.length) return calc === 'date_range_days' ? 0 : '';
        if (calc === 'earliest_date') return dates[0];
        if (calc === 'latest_date') return dates[dates.length - 1];
        return Math.round((Date.parse(dates[dates.length - 1]) - Date.parse(dates[0])) / 86400000);
      }
      return linkedRows.map((lr: any) => (targetProp ? valueAsSearchText(targetProp, lr, targetDb) : String(lr.title || ''))).filter(Boolean).join(', ');
    }
    return rowPage.propertyValues?.[prop.id];
  }

  function valueAsSearchText(prop: DbSchemaProperty, rowPage: any, dbPage: any): string {
    const raw = getRawValue(prop, rowPage, dbPage);
    if (raw == null || raw === '') return '';
    if (prop.type === 'formula' && typeof raw === 'object' && raw.__richFormula) return String(raw.text || '');
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
    if (prop.type === 'formula' && typeof raw === 'object' && raw.__richFormula) return !String(raw.text || '').trim();
    if (prop.type === 'date') return !dateTextOf(raw);
    if (Array.isArray(raw)) return raw.length === 0;
    return false;
  }

  function isFilterGroup(node: DbFilterRule | DbFilterGroup): node is DbFilterGroup {
    return !!node && Array.isArray((node as DbFilterGroup).rules);
  }

  function countFilterRules(view: DbView): number {
    const walk = (grp?: DbFilterGroup): number => grp ? grp.rules.reduce((n, r) => n + (isFilterGroup(r) ? walk(r) : 1), 0) : 0;
    return (view.filters?.length || 0) + walk(view.filterGroup);
  }

  function matchesSingleFilter(rule: DbFilterRule, rowPage: any, dbPage: any): boolean {
    const db = ensureDatabaseConfig(dbPage);
    const prop = db.schema.find(s => s.id === rule.propertyId);
    if (!prop) return true;
    const raw = getRawValue(prop, rowPage, dbPage);
    const numVal = Number(unwrapFormulaVal(raw));
    const text = valueAsSearchText(prop, rowPage, dbPage).toLowerCase();
    const q = String(rule.value ?? '').trim().toLowerCase();
    const rowDateIso = typeof raw === 'object' ? String(raw?.start || '') : String(raw || '').slice(0, 10);
    const todayIso = new Date().toISOString().slice(0, 10);
    switch (rule.op) {
      case 'is_empty': return isValueEmpty(prop, rowPage, dbPage);
      case 'is_not_empty': return !isValueEmpty(prop, rowPage, dbPage);
      case 'is_checked': return Boolean(raw);
      case 'is_unchecked': return !Boolean(raw);
      case 'contains': return !q || text.includes(q);
      case 'not_contains': return !q || !text.includes(q);
      case 'equals':
        if (prop.type === 'number') return numVal === Number(rule.value);
        return text === q;
      case 'not_equals':
        if (prop.type === 'number') return numVal !== Number(rule.value);
        return text !== q;
      case 'starts_with': return !q || text.startsWith(q);
      case 'ends_with': return !q || text.endsWith(q);
      case 'gt': return numVal > Number(rule.value || 0);
      case 'gte': return numVal >= Number(rule.value || 0);
      case 'lt': return numVal < Number(rule.value || 0);
      case 'lte': return numVal <= Number(rule.value || 0);
      case 'before': return !q || (!!rowDateIso && rowDateIso < q);
      case 'after': return !q || (!!rowDateIso && rowDateIso > q);
      case 'on_or_before': return !q || (!!rowDateIso && rowDateIso <= q);
      case 'on_or_after': return !q || (!!rowDateIso && rowDateIso >= q);
      case 'is_today': return rowDateIso === todayIso;
      case 'past_week': {
        if (!rowDateIso) return false;
        const wkAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
        return rowDateIso >= wkAgo && rowDateIso <= todayIso;
      }
      case 'next_week': {
        if (!rowDateIso) return false;
        const wkAhead = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
        return rowDateIso >= todayIso && rowDateIso <= wkAhead;
      }
      default: return true;
    }
  }

  function matchesFilterGroup(group: DbFilterGroup, rowPage: any, dbPage: any): boolean {
    if (!group.rules.length) return true;
    const evalNode = (node: DbFilterRule | DbFilterGroup) =>
      isFilterGroup(node) ? matchesFilterGroup(node, rowPage, dbPage) : matchesSingleFilter(node, rowPage, dbPage);
    return group.match === 'or' ? group.rules.some(evalNode) : group.rules.every(evalNode);
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
    if (view.filterGroup?.rules?.length) {
      rows = rows.filter((r: any) => matchesFilterGroup(view.filterGroup!, r, dbPage));
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
    const rawRect = anchor instanceof HTMLElement ? anchor.getBoundingClientRect() : anchor;
    const rect = { left: rawRect.left, top: rawRect.top, bottom: rawRect.bottom, right: rawRect.right };
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

  function setRowValue(rowPage: any, prop: DbSchemaProperty, value: any, dbPage: any, rerenderAll = true, automationDepth = 0) {
    if (roMode()) return;
    rowPage.propertyValues = rowPage.propertyValues || {};
    if (prop.type === 'title') {
      rowPage.title = String(value ?? '');
    } else {
      rowPage.propertyValues[prop.id] = value;
    }
    rowPage.updatedAt = Date.now();
    rowPage.lastEditedBy = actorName();
    dbPage.updatedAt = Date.now();
    persist(false);
    triggerDatabaseAutomations('property_edited', rowPage, dbPage, prop.id, automationDepth);
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

    if (prop.type === 'button') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'db-row-action-btn';
      btn.disabled = ro;
      const icoHtml = prop.buttonIcon && host?.iconMarkup ? `<span class="db-btn-ico">${host.iconMarkup(prop.buttonIcon)}</span>` : '';
      btn.innerHTML = `${icoHtml}<span>${escHtml(prop.buttonLabel || prop.name || 'Run')}</span>`;
      btn.onclick = e => {
        e.stopPropagation();
        const actions = (prop.buttonActions && prop.buttonActions.length)
          ? prop.buttonActions
          : [{ id: uid(), kind: 'send_notification' as DbAutomationActionKind, message: `Clicked "${prop.buttonLabel || prop.name}" on {{Name}}` }];
        executeAutomationStepsInteractive(actions, rowPage, dbPage, prop.buttonLabel || prop.name || 'Run', 0, {}, 0, () => {
          persist(false);
          refreshAllDatabaseViews();
          opts.onCommit?.();
          host?.toast?.(`Ran “${prop.buttonLabel || prop.name}”`);
        });
      };
      wrap.append(btn);
      return wrap;
    }

    if (prop.type === 'unique_id') {
      const badge = document.createElement('span');
      badge.className = 'db-unique-id-pill';
      badge.textContent = String(raw || '');
      wrap.append(badge);
      return wrap;
    }

    if (['created_time', 'last_edited_time', 'created_by', 'last_edited_by', 'formula', 'rollup'].includes(prop.type)) {
      if (prop.type === 'formula' && raw && typeof raw === 'object' && raw.__richFormula) {
        const node = raw.href ? document.createElement('a') : document.createElement('span');
        node.className = 'db-readonly-val is-formula db-formula-styled';
        if (raw.href && node instanceof HTMLAnchorElement) {
          node.href = raw.href;
          node.target = '_blank';
          node.rel = 'noopener noreferrer';
          node.onclick = ev => ev.stopPropagation();
        }
        node.textContent = String(raw.text ?? '');
        const styles: string[] = Array.isArray(raw.styles) ? raw.styles : [];
        styles.forEach(st => {
          const k = st.toLowerCase();
          if (k === 'b' || k === 'bold') node.style.fontWeight = '700';
          else if (k === 'i' || k === 'italic') node.style.fontStyle = 'italic';
          else if (k === 'u' || k === 'underline') node.style.textDecoration = 'underline';
          else if (k === 's' || k === 'strikethrough') node.style.textDecoration = 'line-through';
          else if (k === 'c' || k === 'code') node.classList.add('is-code-pill');
          else if (k.endsWith('_background')) {
            const cm = colorMeta(k.replace('_background', ''));
            node.style.backgroundColor = cm.bg;
            node.style.padding = '1px 6px';
            node.style.borderRadius = '4px';
          } else if (DB_COLORS.some(c => c.key === k)) {
            node.style.color = colorMeta(k).fg;
          }
        });
        wrap.append(node);
        return wrap;
      }
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
              creator: actorName(),
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
        const dbs = getDatabasePages().filter((d: any) => !host?.canViewPage || host.canViewPage(d));
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
      width: type === 'unique_id' ? 110 : 155,
      options: type === 'status' ? defaultStatusOptions() : (type === 'select' || type === 'multi_select') ? [{ id: uid(), name: 'Option 1', color: 'blue' }, { id: uid(), name: 'Option 2', color: 'green' }] : undefined,
      formulaExpr: type === 'formula' ? 'prop("Name")' : undefined,
      idPrefix: type === 'unique_id' ? 'ID' : undefined,
      idNext: type === 'unique_id' ? 1 : undefined,
      buttonLabel: type === 'button' ? (name.trim() || 'Click me') : undefined,
      buttonActions: type === 'button' ? [] : undefined
    };
    const at = typeof insertIndex === 'number' ? Math.max(1, Math.min(db.schema.length, insertIndex)) : db.schema.length;
    db.schema.splice(at, 0, prop);
    if (type === 'unique_id') assignUniqueIds(dbPage);
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
          if (prop.type === 'unique_id') { prop.idPrefix = prop.idPrefix || 'ID'; assignUniqueIds(dbPage); }
          if (prop.type === 'button') { prop.buttonLabel = prop.buttonLabel || prop.name || 'Run'; prop.buttonActions = prop.buttonActions || []; }
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
        fWrap.innerHTML = '<small>Formula 2.0 (lets, .map, current, if/ifs, style)</small>';
        const fInput = document.createElement('input');
        fInput.type = 'text';
        fInput.className = 'db-pop-search';
        fInput.value = prop.formulaExpr || '';
        fInput.onchange = () => { prop.formulaExpr = fInput.value; persist(false); refreshAllDatabaseViews(); };
        fWrap.append(fInput);
        list.append(fWrap);
      }

      if (prop.type === 'unique_id') {
        const uWrap = document.createElement('label');
        uWrap.className = 'db-pop-field-row';
        uWrap.innerHTML = '<span>ID Prefix</span>';
        const pInp = document.createElement('input');
        pInp.type = 'text';
        pInp.className = 'db-pop-search';
        pInp.style.width = '90px';
        pInp.value = prop.idPrefix || 'ID';
        pInp.onchange = () => {
          const nextPref = pInp.value.trim().toUpperCase() || 'ID';
          prop.idPrefix = nextPref;
          getDatabaseRows(dbPage.id).forEach((r: any, idx: number) => {
            r.propertyValues = r.propertyValues || {};
            const old = String(r.propertyValues[prop.id] || '');
            const m = old.match(/(\d+)$/);
            r.propertyValues[prop.id] = `${nextPref}-${m ? m[1] : idx + 1}`;
          });
          persist(false);
          refreshAllDatabaseViews();
        };
        uWrap.append(pInp);
        list.append(uWrap);
      }

      if (prop.type === 'button') {
        const bWrap = document.createElement('label');
        bWrap.className = 'db-pop-field-row';
        bWrap.innerHTML = '<span>Button label</span>';
        const bInp = document.createElement('input');
        bInp.type = 'text';
        bInp.className = 'db-pop-search';
        bInp.style.width = '120px';
        bInp.value = prop.buttonLabel || prop.name || 'Run';
        bInp.onchange = () => { prop.buttonLabel = bInp.value.trim() || 'Run'; persist(false); refreshAllDatabaseViews(); };
        bWrap.append(bInp);
        list.append(bWrap);

        prop.buttonActions = prop.buttonActions || [];
        const cfgBtn = document.createElement('button');
        cfgBtn.type = 'button';
        cfgBtn.className = 'db-pop-option-btn';
        cfgBtn.innerHTML = `<span>⚡ Configure button actions (${prop.buttonActions.length})</span>`;
        cfgBtn.onclick = () => {
          close();
          openNotionWorkflowModal({
            mode: 'button',
            title: prop.buttonLabel || prop.name || 'New button',
            icon: prop.buttonIcon,
            onIconChange: nextIco => { prop.buttonIcon = nextIco || undefined; },
            dbPage,
            actionsList: prop.buttonActions!,
            onRename: nextLabel => { prop.buttonLabel = nextLabel || 'Run'; },
            onCommit: () => {
              persist(false);
              refreshAllDatabaseViews();
            }
          });
        };
        list.append(cfgBtn);
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
        DB_ROLLUP_CALCS.forEach(c => {
          const o = document.createElement('option'); o.value = c.key; o.textContent = c.label; calcSel.append(o);
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

      const subItemsBtn = document.createElement('button');
      subItemsBtn.type = 'button';
      subItemsBtn.className = 'db-pop-option-btn';
      subItemsBtn.innerHTML = `<span>↳ Sub-items hierarchy</span><span class="db-pop-check">${db.subItemsEnabled ? '✓' : ''}</span>`;
      subItemsBtn.onclick = () => {
        db.subItemsEnabled = !db.subItemsEnabled;
        if (db.subItemsEnabled && (!db.parentPropertyId || !db.schema.some(s => s.id === db.parentPropertyId))) {
          const parentProp = addSchemaProperty(dbPage, 'Parent item', 'relation');
          parentProp.relationDatabaseId = dbPage.id;
          db.parentPropertyId = parentProp.id;
        }
        persist(false); refreshAllDatabaseViews(); close();
      };
      list.append(subItemsBtn);

      const depsBtn = document.createElement('button');
      depsBtn.type = 'button';
      depsBtn.className = 'db-pop-option-btn';
      depsBtn.innerHTML = `<span>⛓ Dependencies (Blocked by)</span><span class="db-pop-check">${db.dependenciesPropertyId ? '✓' : ''}</span>`;
      depsBtn.onclick = () => {
        if (db.dependenciesPropertyId) {
          db.dependenciesPropertyId = undefined;
        } else {
          const existing = db.schema.find(s => s.type === 'relation' && s.name.toLowerCase().includes('block'));
          const depProp = existing || addSchemaProperty(dbPage, 'Blocked by', 'relation');
          depProp.relationDatabaseId = dbPage.id;
          db.dependenciesPropertyId = depProp.id;
        }
        persist(false); refreshAllDatabaseViews(); close();
      };
      list.append(depsBtn);

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
        const subEnabled = !!db.subItemsEnabled && !!db.parentPropertyId;
        const parentPropId = db.parentPropertyId || '';
        const groupIdSet = new Set(group.rows.map((r: any) => r.id));
        const childrenByParent = new Map<string, any[]>();
        if (subEnabled) {
          group.rows.forEach(r => {
            const pIds: string[] = Array.isArray(r.propertyValues?.[parentPropId]) ? r.propertyValues[parentPropId] : [];
            const pid = pIds.find(x => groupIdSet.has(x) && x !== r.id);
            if (pid) {
              if (!childrenByParent.has(pid)) childrenByParent.set(pid, []);
              childrenByParent.get(pid)!.push(r);
            }
          });
        }
        const renderRowTree = (rowPage: any, treeDepth: number, seen: Set<string>) => {
          if (seen.has(rowPage.id)) return;
          seen.add(rowPage.id);
          const childRows = subEnabled ? (childrenByParent.get(rowPage.id) || []) : [];
          const subCollapsed = (view.collapsedSubItems || []).includes(rowPage.id);
          const tr = document.createElement('tr');
          tr.className = 'db-tr' + (treeDepth > 0 ? ' is-subitem' : '');
          tr.dataset.rowId = rowPage.id;
          cols.forEach(col => {
            const td = document.createElement('td');
            td.className = 'db-td' + (col.type === 'title' ? ' is-title-col' : '');
            const ctrl = renderPropertyValueControl(col, rowPage, dbPage, {
              compact: true,
              onOpenRow: col.type === 'title' ? () => openDatabaseRow(rowPage, dbPage, rowOrderIds) : undefined
            });
            if (col.type === 'title' && subEnabled) {
              const titleBox = ctrl.querySelector('.db-title-cell') as HTMLElement | null;
              if (titleBox) {
                titleBox.style.paddingLeft = `${treeDepth * 18}px`;
                const subToggle = document.createElement('button');
                subToggle.type = 'button';
                subToggle.className = 'db-subitem-toggle';
                subToggle.textContent = childRows.length ? (subCollapsed ? '▸' : '▾') : '·';
                subToggle.disabled = !childRows.length;
                subToggle.onclick = ev => {
                  ev.stopPropagation();
                  view.collapsedSubItems = view.collapsedSubItems || [];
                  view.collapsedSubItems = subCollapsed
                    ? view.collapsedSubItems.filter(x => x !== rowPage.id)
                    : [...view.collapsedSubItems, rowPage.id];
                  persist(false); refreshAllDatabaseViews();
                };
                titleBox.prepend(subToggle);
                if (!ro) {
                  const addSub = document.createElement('button');
                  addSub.type = 'button';
                  addSub.className = 'db-subitem-add-btn';
                  addSub.textContent = '+ Sub';
                  addSub.title = 'Add sub-item';
                  addSub.onclick = ev => {
                    ev.stopPropagation();
                    view.collapsedSubItems = (view.collapsedSubItems || []).filter(x => x !== rowPage.id);
                    const child = createDatabaseRow(dbPage, { [parentPropId]: [rowPage.id] });
                    persist(false); refreshAllDatabaseViews();
                    requestAnimationFrame(() => {
                      (scroll.querySelector(`tr[data-row-id="${CSS.escape(child.id)}"] .db-title-input`) as HTMLInputElement)?.focus();
                    });
                  };
                  titleBox.append(addSub);
                }
              }
            }
            if (col.type === 'title' && db.dependenciesPropertyId) {
              const blockerIds: string[] = Array.isArray(rowPage.propertyValues?.[db.dependenciesPropertyId]) ? rowPage.propertyValues[db.dependenciesPropertyId] : [];
              if (blockerIds.length) {
                const depBadge = document.createElement('span');
                depBadge.className = 'db-dep-badge';
                depBadge.textContent = `⛔ Blocked (${blockerIds.length})`;
                depBadge.title = blockerIds.map(idVal => getPageById(idVal)?.title || 'Task').join(', ');
                ctrl.append(depBadge);
              }
            }
            td.append(ctrl);
            tr.append(td);
          });
          if (!ro) {
            const blankTd = document.createElement('td');
            blankTd.className = 'db-td db-td-spacer';
            tr.append(blankTd);
          }
          tbody.append(tr);
          if (!subCollapsed) {
            childRows.forEach(cr => renderRowTree(cr, treeDepth + 1, seen));
          }
        };

        const seen = new Set<string>();
        const roots = subEnabled
          ? group.rows.filter(r => {
              const pIds: string[] = Array.isArray(r.propertyValues?.[parentPropId]) ? r.propertyValues[parentPropId] : [];
              return !pIds.some(x => groupIdSet.has(x) && x !== r.id);
            })
          : group.rows;
        roots.forEach(r => renderRowTree(r, 0, seen));
        group.rows.forEach(r => { if (!seen.has(r.id)) renderRowTree(r, 0, seen); });
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
      const author = r.createdBy || actorName();
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

  function renderFormView(canvas: HTMLElement, view: DbView, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    const ro = roMode(dbPage);
    view.formConfig = view.formConfig || {};
    const cfg = view.formConfig;
    cfg.requiredPropertyIds = cfg.requiredPropertyIds || [];
    cfg.hiddenPropertyIds = cfg.hiddenPropertyIds || [];

    const shell = document.createElement('div');
    shell.className = 'db-form-shell';

    const draftRow: any = {
      id: '__form_draft__',
      title: '',
      icon: '📄',
      propertyValues: {}
    };
    const fakePropMeta = (pid: string) => db.schema.find(s => s.id === pid);
    const eligibleProps = db.schema.filter(s => !['created_time', 'created_by', 'last_edited_time', 'last_edited_by', 'formula', 'rollup', 'unique_id', 'button'].includes(s.type));

    const header = document.createElement('div');
    header.className = 'db-form-header';
    const titleInp = document.createElement('input');
    titleInp.type = 'text';
    titleInp.className = 'db-form-title-input';
    titleInp.value = cfg.title || `${dbPage.title || 'Database'} intake form`;
    titleInp.disabled = ro;
    titleInp.onchange = () => { cfg.title = titleInp.value; persist(false); };
    const descInp = document.createElement('textarea');
    descInp.className = 'db-form-desc-input';
    descInp.placeholder = 'Optional form instructions…';
    descInp.value = cfg.description || '';
    descInp.disabled = ro;
    descInp.onchange = () => { cfg.description = descInp.value; persist(false); };
    header.append(titleInp, descInp);

    const statusBanner = document.createElement('div');
    statusBanner.className = 'db-form-submitted';
    statusBanner.hidden = true;

    const formBody = document.createElement('form');
    formBody.className = 'db-form-fields';

    const drawFields = () => {
      formBody.replaceChildren();
      eligibleProps.forEach(prop => {
        if (cfg.hiddenPropertyIds!.includes(prop.id) && prop.type !== 'title') return;
        const isReq = prop.type === 'title' || cfg.requiredPropertyIds!.includes(prop.id);
        const fieldCard = document.createElement('div');
        fieldCard.className = 'db-form-field-card';
        const top = document.createElement('div');
        top.className = 'db-form-field-head';
        top.innerHTML = `<label><strong>${escHtml(prop.name)}</strong>${isReq ? ' <span class="db-form-req">*</span>' : ''}</label>`;
        if (!ro && prop.type !== 'title') {
          const reqLbl = document.createElement('label');
          reqLbl.className = 'db-form-req-toggle';
          const reqCb = document.createElement('input');
          reqCb.type = 'checkbox';
          reqCb.checked = isReq;
          reqCb.onchange = () => {
            cfg.requiredPropertyIds = reqCb.checked
              ? [...new Set([...cfg.requiredPropertyIds!, prop.id])]
              : cfg.requiredPropertyIds!.filter(id => id !== prop.id);
            persist(false);
            drawFields();
          };
          reqLbl.append(reqCb, document.createTextNode('Required'));
          top.append(reqLbl);
        }
        fieldCard.append(top);

        // Local draft control avoiding mutating real workspace until Submit
        if (prop.type === 'title') {
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.className = 'db-form-input';
          inp.placeholder = 'Enter title…';
          inp.value = draftRow.title;
          inp.oninput = () => { draftRow.title = inp.value; };
          fieldCard.append(inp);
        } else if (prop.type === 'checkbox') {
          const lbl = document.createElement('label');
          lbl.style.display = 'inline-flex'; lbl.style.alignItems = 'center'; lbl.style.gap = '6px';
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = Boolean(draftRow.propertyValues[prop.id]);
          cb.onchange = () => { draftRow.propertyValues[prop.id] = cb.checked; };
          lbl.append(cb, document.createTextNode(prop.name));
          fieldCard.append(lbl);
        } else if (prop.type === 'select' || prop.type === 'status') {
          const sel = document.createElement('select');
          sel.className = 'db-form-input';
          sel.innerHTML = `<option value="">Choose option…</option>${(prop.options || []).map(o => `<option value="${escHtml(o.id)}">${escHtml(o.name)}</option>`).join('')}`;
          sel.value = draftRow.propertyValues[prop.id] || '';
          sel.onchange = () => { draftRow.propertyValues[prop.id] = sel.value; };
          fieldCard.append(sel);
        } else if (prop.type === 'multi_select') {
          const box = document.createElement('div');
          box.className = 'db-pill-list';
          (prop.options || []).forEach(o => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'db-form-chip-toggle';
            const syncChip = () => {
              const arr: string[] = draftRow.propertyValues[prop.id] || [];
              const active = arr.includes(o.id);
              btn.classList.toggle('is-active', active);
              btn.textContent = `${active ? '✓ ' : ''}${o.name}`;
            };
            btn.onclick = () => {
              const cur: string[] = draftRow.propertyValues[prop.id] || [];
              draftRow.propertyValues[prop.id] = cur.includes(o.id) ? cur.filter(x => x !== o.id) : [...cur, o.id];
              syncChip();
            };
            syncChip();
            box.append(btn);
          });
          fieldCard.append(box);
        } else if (prop.type === 'date') {
          const inp = document.createElement('input');
          inp.type = 'date';
          inp.className = 'db-form-input';
          inp.value = draftRow.propertyValues[prop.id]?.start || '';
          inp.onchange = () => { draftRow.propertyValues[prop.id] = inp.value ? { start: inp.value } : undefined; };
          fieldCard.append(inp);
        } else if (prop.type === 'person') {
          const sel = document.createElement('select');
          sel.className = 'db-form-input';
          const users = getState()?.users || [];
          sel.innerHTML = `<option value="">Choose person…</option>${users.map((u: any) => `<option value="${escHtml(u.id)}">${escHtml(u.name)}</option>`).join('')}`;
          sel.onchange = () => { draftRow.propertyValues[prop.id] = sel.value ? [sel.value] : []; };
          fieldCard.append(sel);
        } else {
          const inp = document.createElement('input');
          inp.type = prop.type === 'number' ? 'number' : prop.type === 'email' ? 'email' : prop.type === 'url' ? 'url' : 'text';
          inp.className = 'db-form-input';
          inp.placeholder = `Enter ${prop.name.toLowerCase()}…`;
          inp.value = draftRow.propertyValues[prop.id] ?? '';
          inp.oninput = () => {
            draftRow.propertyValues[prop.id] = prop.type === 'number' ? (inp.value === '' ? '' : Number(inp.value)) : inp.value;
          };
          fieldCard.append(inp);
        }
        formBody.append(fieldCard);
      });

      const footer = document.createElement('div');
      footer.className = 'db-form-footer';
      const subBtn = document.createElement('button');
      subBtn.type = 'submit';
      subBtn.className = 'share-button db-form-submit-btn';
      subBtn.textContent = cfg.submitLabel || 'Submit response';
      footer.append(subBtn);
      formBody.append(footer);
    };

    formBody.onsubmit = e => {
      e.preventDefault();
      if (!String(draftRow.title || '').trim()) {
        host?.toast?.('Please fill out the required Name field');
        return;
      }
      for (const reqId of cfg.requiredPropertyIds!) {
        const p = fakePropMeta(reqId);
        if (!p || p.type === 'title') continue;
        const v = draftRow.propertyValues[reqId];
        if (v == null || v === '' || (Array.isArray(v) && !v.length)) {
          host?.toast?.(`Please fill required field “${p.name}”`);
          return;
        }
      }
      const titleProp = db.schema.find(s => s.type === 'title');
      const initVals: Record<string, any> = { ...draftRow.propertyValues };
      if (titleProp) initVals[titleProp.id] = draftRow.title.trim();
      const created = createDatabaseRow(dbPage, initVals);
      persist(false);
      statusBanner.hidden = false;
      statusBanner.innerHTML = `<strong>✓ Submitted “${escHtml(created.title)}”</strong>`;
      const anotherBtn = document.createElement('button');
      anotherBtn.type = 'button';
      anotherBtn.className = 'secondary-button';
      anotherBtn.textContent = 'Submit another response';
      anotherBtn.onclick = () => {
        draftRow.title = '';
        draftRow.propertyValues = {};
        statusBanner.hidden = true;
        drawFields();
      };
      statusBanner.append(anotherBtn);
      host?.toast?.(`Form submitted: “${created.title}”`);
      draftRow.title = '';
      draftRow.propertyValues = {};
      drawFields();
    };

    drawFields();
    shell.append(header, statusBanner, formBody);
    canvas.append(shell);
  }

  let activeWorkflowOverlay: HTMLElement | null = null;
  let activeDbActionMenu: HTMLElement | null = null;
  function closeDbActionMenu() {
    if (activeDbActionMenu) {
      activeDbActionMenu.remove();
      activeDbActionMenu = null;
    }
  }
  function closeNotionWorkflowModal() {
    closeDbActionMenu();
    if (activeWorkflowOverlay) {
      activeWorkflowOverlay.remove();
      activeWorkflowOverlay = null;
    }
  }
  function userInitials(name: string): string {
    const parts = String(name || 'U').trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0] || 'U').slice(0, 2).toUpperCase();
  }
  const DB_WORKFLOW_ACTION_DEFS: Array<{ kind: DbAutomationActionKind; label: string; icon: string; isNew?: boolean; keywords: string }> = [
    { kind: 'add_page', label: 'Add page to...', icon: '＋', keywords: 'add page create database row' },
    { kind: 'edit_pages', label: 'Edit pages in...', icon: '✎', keywords: 'edit pages property set update this row related' },
    { kind: 'send_notification', label: 'Send notification to...', icon: '🔔', keywords: 'send notification alert inbox bell' },
    { kind: 'send_message', label: 'Send message...', icon: '💬', isNew: true, keywords: 'send message chat dm group channel' },
    { kind: 'send_webhook', label: 'Send webhook', icon: '{}', keywords: 'send webhook http post api json' },
    { kind: 'show_confirmation', label: 'Show confirmation', icon: '?', keywords: 'show confirmation branch choice modal button' },
    { kind: 'open_page', label: 'Open page, form, or URL', icon: '↗', keywords: 'open page form url link view navigate' },
    { kind: 'define_variables', label: 'Define variables', icon: '≡', keywords: 'define variables var formula let' }
  ];
  function openDbActionSearchMenu(anchorEl: HTMLElement, onPick: (kind: DbAutomationActionKind) => void) {
    closeDbActionMenu();
    const pop = document.createElement('div');
    pop.className = 'notion-action-menu db-interactive-surface';
    pop.setAttribute('role', 'listbox');
    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'notion-action-search';
    search.placeholder = 'Search actions...';
    search.autocomplete = 'off';
    const list = document.createElement('div');
    list.className = 'notion-action-list';

    const drawList = () => {
      list.replaceChildren();
      const q = search.value.trim().toLowerCase();
      const filtered = DB_WORKFLOW_ACTION_DEFS.filter(d => !q || `${d.label} ${d.keywords}`.toLowerCase().includes(q));
      if (!filtered.length) {
        const emp = document.createElement('div');
        emp.className = 'notion-action-empty';
        emp.textContent = 'No matching actions';
        list.append(emp);
        return;
      }
      filtered.forEach(d => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'notion-action-row';
        row.dataset.actionKind = d.kind;
        row.innerHTML = `<span class="notion-action-ico">${escHtml(d.icon)}</span><span class="notion-action-lbl">${escHtml(d.label)}</span>${d.isNew ? '<span class="notion-action-new-badge">New</span>' : ''}`;
        row.onclick = ev => {
          ev.stopPropagation();
          closeDbActionMenu();
          onPick(d.kind);
        };
        list.append(row);
      });
    };
    search.oninput = drawList;
    search.onkeydown = ev => {
      if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); closeDbActionMenu(); }
      if (ev.key === 'Enter') {
        const first = list.querySelector('.notion-action-row') as HTMLElement | null;
        if (first) { ev.preventDefault(); first.click(); }
      }
    };
    drawList();
    pop.append(search, list);
    document.body.append(pop);
    activeDbActionMenu = pop;
    const rect = anchorEl.getBoundingClientRect();
    const popW = Math.min(300, window.innerWidth - 24);
    const popH = Math.min(370, pop.scrollHeight || 350);
    const left = Math.max(12, Math.min(window.innerWidth - popW - 12, rect.left));
    const top = (rect.bottom + popH + 12 <= window.innerHeight || rect.top < popH + 20)
      ? Math.min(window.innerHeight - popH - 12, rect.bottom + 6)
      : Math.max(12, rect.top - popH - 6);
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
    pop.style.width = `${popW}px`;
    const onOutside = (ev: MouseEvent) => {
      if (!pop.isConnected) { document.removeEventListener('mousedown', onOutside, true); return; }
      const t = ev.target as Node;
      if (!pop.contains(t) && !anchorEl.contains(t)) {
        closeDbActionMenu();
        document.removeEventListener('mousedown', onOutside, true);
      }
    };
    document.addEventListener('mousedown', onOutside, true);
    requestAnimationFrame(() => search.focus());
  }
  function describeActionSummary(act: DbAutomationAction, db: DatabaseConfig, users: any[]): string {
    if (act.kind === 'set_property' || (act.kind === 'edit_pages' && (act.targetScope || 'this_page') === 'this_page')) {
      const prop = db.schema.find(s => s.id === act.propertyId);
      const pName = prop?.name || 'property';
      if (act.useFormula) return `Replace ${pName} with ∑ ${act.formulaExpr || 'formula'}`;
      if (prop?.type === 'person' && act.value) {
        const uidStr = Array.isArray(act.value) ? act.value[0] : String(act.value);
        const u = users.find(x => x.id === uidStr || x.name === uidStr);
        return `Replace ${pName} with ${u?.name || uidStr}`;
      }
      if ((prop?.type === 'status' || prop?.type === 'select') && act.value) {
        const opt = prop.options?.find(o => o.id === act.value || o.name === act.value);
        return `Edit ${pName} → ${opt?.name || act.value}`;
      }
      return act.value ? `Edit ${pName} → ${act.value}` : `Edit ${pName}`;
    }
    if (act.kind === 'edit_pages') {
      const tdb = act.targetDatabaseId ? getPageById(act.targetDatabaseId) : null;
      return `Edit pages in ${tdb?.title || 'database'}`;
    }
    if (act.kind === 'add_page') {
      const tdb = act.targetDatabaseId ? getPageById(act.targetDatabaseId) : null;
      return `Add page to ${tdb?.title || 'database'}`;
    }
    if (act.kind === 'edit_related') {
      const rp = db.schema.find(s => s.id === act.relationPropertyId);
      return `Edit pages in ${rp?.name || 'related database'}`;
    }
    if (act.kind === 'send_notification') {
      if (act.recipientMode === 'everyone') return 'Send notification to Everyone';
      if (act.recipientMode === 'person_prop') {
        const pp = db.schema.find(s => s.id === act.recipientPropertyId);
        return `Send notification to ${pp?.name || 'Person property'}`;
      }
      return 'Send notification to Specific people';
    }
    if (act.kind === 'send_message') {
      if (act.chatTargetAccount) return `Send message to DM @${act.chatTargetAccount}`;
      const ch = (getState()?.chats || []).find((c: any) => c.id === act.chatChannelId);
      return `Send message to #${ch?.name || 'general'}`;
    }
    if (act.kind === 'send_webhook') return `Send webhook ${act.webhookUrl ? '→ ' + act.webhookUrl.slice(0, 32) : ''}`.trim();
    if (act.kind === 'define_variables') return `Define variables (${(act.variables || []).length})`;
    if (act.kind === 'open_page') {
      if (act.openMode === 'url') return `Open URL ${act.openUrl || ''}`.trim();
      if (!act.openPageId || act.openPageId === 'current_row') return 'Open Current page';
      const pg = getPageById(act.openPageId);
      return `Open ${pg?.title || 'page'}`;
    }
    if (act.kind === 'show_confirmation') {
      return `Show confirmation: “${act.confirmMessage || 'Are you sure?'}”`;
    }
    return 'Action step';
  }
  function actionKindIcon(kind: DbAutomationActionKind): string {
    return kind === 'send_notification' ? '🔔'
      : kind === 'send_message' ? '💬'
      : kind === 'send_webhook' ? '{}'
      : kind === 'define_variables' ? '≡'
      : kind === 'add_page' ? '＋'
      : kind === 'edit_related' ? '⇄'
      : kind === 'open_page' ? '↗'
      : kind === 'show_confirmation' ? '?'
      : '✎';
  }

  function openNotionWorkflowModal(opts: {
    mode: 'automation' | 'button';
    title: string;
    icon?: string;
    onIconChange?: (next: string) => void;
    dbPage: any;
    automation?: DbAutomation;
    actionsList: DbAutomationAction[];
    onRename?: (next: string) => void;
    onDeleteAutomation?: () => void;
    onCommit: () => void;
  }) {
    closeDbPopover();
    closeNotionWorkflowModal();
    const db = ensureDatabaseConfig(opts.dbPage);
    const stateUsers = getState()?.users || [];
    const auto = opts.automation;
    if (auto) {
      if (!Array.isArray(auto.triggers) || !auto.triggers.length) {
        auto.triggers = [auto.trigger ? { id: uid(), ...auto.trigger } : { id: uid(), kind: 'page_added' }];
      }
      auto.triggerMatch = auto.triggerMatch || 'all';
    }
    let currentIcon = auto ? (auto.icon || '') : (opts.icon || '');

    const overlay = document.createElement('div');
    overlay.className = 'notion-workflow-overlay db-interactive-surface';
    const modal = document.createElement('div');
    modal.className = 'notion-workflow-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    overlay.addEventListener('pointerdown', e => e.stopPropagation());
    overlay.addEventListener('click', e => {
      e.stopPropagation();
      if (e.target === overlay) { closeDbActionMenu(); opts.onCommit(); closeNotionWorkflowModal(); }
    });
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeWorkflowOverlay === overlay) {
        if (activeDbActionMenu) { closeDbActionMenu(); return; }
        e.preventDefault();
        e.stopPropagation();
        opts.onCommit();
        closeNotionWorkflowModal();
        document.removeEventListener('keydown', onEsc, true);
      }
    };
    document.addEventListener('keydown', onEsc, true);

    const makeDefaultDbAction = (kind: DbAutomationActionKind): DbAutomationAction => {
      const aid = uid();
      if (kind === 'show_confirmation') {
        return {
          id: aid,
          kind,
          confirmMessage: 'Are you sure you want to continue?',
          branches: [
            { id: `dbr-ok-${aid}`, label: 'Okay', style: 'primary', mode: 'continue', actions: [] },
            { id: `dbr-cancel-${aid}`, label: 'Cancel', style: 'default', mode: 'stop', actions: [] }
          ]
        };
      }
      if (kind === 'define_variables') return { id: aid, kind, variables: [{ id: uid(), name: 'status', mode: 'text', value: 'Done' }] };
      if (kind === 'send_message') return { id: aid, kind, chatChannelId: getState()?.chats?.[0]?.id || 'chat-general', message: '' };
      if (kind === 'send_webhook') return { id: aid, kind, webhookUrl: 'https://', webhookBody: '' };
      if (kind === 'edit_pages') return { id: aid, kind, targetScope: 'this_page', propertyId: db.schema[1]?.id || db.schema[0]?.id, value: '' };
      if (kind === 'set_property') return { id: aid, kind, propertyId: db.schema[1]?.id || db.schema[0]?.id, value: '' };
      if (kind === 'add_page') return { id: aid, kind, targetDatabaseId: opts.dbPage.id, title: 'New item' };
      if (kind === 'open_page') return { id: aid, kind, openMode: 'page', openPageId: 'current_row' };
      return { id: aid, kind };
    };

    const drawModal = () => {
      modal.replaceChildren();
      const dbPages = getDatabasePages();
      const allPages = (getState()?.pages || []).filter((pg: any) => !pg.databaseId);
      const chats = getState()?.chats || [];

      // Header row: Optional Icon Picker + Editable Title + Enable/Delete/Close
      const header = document.createElement('div');
      header.className = 'notion-wf-header';
      const iconBtn = document.createElement('button');
      iconBtn.type = 'button';
      iconBtn.className = 'notion-wf-icon-picker-btn' + (currentIcon ? '' : ' is-empty');
      iconBtn.setAttribute('aria-label', 'Choose optional workflow icon');
      iconBtn.title = 'Choose icon (optional)';
      iconBtn.innerHTML = currentIcon && host?.iconMarkup
        ? host.iconMarkup(currentIcon)
        : (currentIcon ? escHtml(currentIcon) : '<span class="notion-wf-icon-placeholder">☺</span>');
      iconBtn.onclick = ev => {
        ev.stopPropagation();
        host?.iconPickerForValue?.(currentIcon, true, (nextIcon: string) => {
          currentIcon = nextIcon || '';
          if (auto) auto.icon = currentIcon || undefined;
          opts.onIconChange?.(currentIcon);
          opts.onCommit();
          drawModal();
        });
      };

      const titleInp = document.createElement('input');
      titleInp.type = 'text';
      titleInp.className = 'notion-wf-title-input';
      titleInp.value = auto ? (auto.name || '') : (opts.title || 'New button');
      titleInp.placeholder = opts.mode === 'automation' ? 'New automation' : 'New button';
      titleInp.oninput = () => {
        const val = titleInp.value;
        if (auto) auto.name = val;
        opts.onRename?.(val);
        opts.onCommit();
      };
      const hdrRight = document.createElement('div');
      hdrRight.className = 'notion-wf-hdr-actions';
      if (auto) {
        const enLbl = document.createElement('label');
        enLbl.className = 'notion-wf-switch-pill';
        const enCb = document.createElement('input');
        enCb.type = 'checkbox'; enCb.checked = auto.enabled !== false;
        enCb.onchange = () => { auto.enabled = enCb.checked; opts.onCommit(); };
        enLbl.append(enCb, document.createTextNode(auto.enabled !== false ? 'Active' : 'Paused'));
        hdrRight.append(enLbl);
        if (opts.onDeleteAutomation) {
          const delA = document.createElement('button');
          delA.type = 'button'; delA.className = 'notion-wf-icon-btn'; delA.title = 'Delete automation'; delA.textContent = '🗑';
          delA.onclick = () => { opts.onDeleteAutomation?.(); opts.onCommit(); closeNotionWorkflowModal(); };
          hdrRight.append(delA);
        }
      }
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button'; closeBtn.className = 'notion-wf-close-btn'; closeBtn.textContent = '×'; closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.onclick = () => { opts.onCommit(); closeNotionWorkflowModal(); };
      hdrRight.append(closeBtn);
      header.append(iconBtn, titleInp, hdrRight);

      const scopeRow = document.createElement('div');
      scopeRow.className = 'notion-wf-scope';
      scopeRow.innerHTML = `<span>For all pages in</span><span class="notion-wf-scope-pill">${escHtml(opts.dbPage.title || 'Database')}</span>`;

      modal.append(header, scopeRow);

      // WHEN SECTION (Triggers)
      const whenWrap = document.createElement('section');
      whenWrap.className = 'notion-wf-section';
      if (opts.mode === 'automation' && auto) {
        const whenHead = document.createElement('div');
        whenHead.className = 'notion-wf-section-label';
        const matchSel = document.createElement('select');
        matchSel.className = 'notion-wf-inline-select';
        [['all', 'all'], ['any', 'any']].forEach(([v, l]) => {
          const o = document.createElement('option'); o.value = v; o.textContent = l; matchSel.append(o);
        });
        matchSel.value = auto.triggerMatch || 'all';
        matchSel.onchange = () => { auto.triggerMatch = matchSel.value as 'all' | 'any'; opts.onCommit(); };
        whenHead.append(document.createTextNode('When '), matchSel, document.createTextNode(' triggers occur'));
        whenWrap.append(whenHead);

        auto.triggers!.forEach((trig, tIdx) => {
          const tCard = document.createElement('div');
          tCard.className = 'notion-wf-card notion-wf-trigger-card';

          const tTop = document.createElement('div');
          tTop.className = 'notion-wf-card-head';
          const kindSel = document.createElement('select');
          kindSel.className = 'notion-wf-inline-select';
          [['page_added', '📄 Page added'], ['property_edited', '☰ Property edited']].forEach(([k, l]) => {
            const o = document.createElement('option'); o.value = k; o.textContent = l; kindSel.append(o);
          });
          kindSel.value = trig.kind;
          kindSel.onchange = () => {
            trig.kind = kindSel.value as DbAutomationTriggerKind;
            if (tIdx === 0) auto.trigger = { ...trig };
            opts.onCommit(); drawModal();
          };
          tTop.append(kindSel);

          if (auto.triggers!.length > 1) {
            const rmT = document.createElement('button');
            rmT.type = 'button'; rmT.className = 'notion-wf-icon-btn'; rmT.textContent = '×';
            rmT.onclick = () => {
              auto.triggers!.splice(tIdx, 1);
              auto.trigger = auto.triggers![0] ? { ...auto.triggers![0] } : { kind: 'page_added' };
              opts.onCommit(); drawModal();
            };
            tTop.append(rmT);
          }
          tCard.append(tTop);

          if (trig.kind === 'property_edited') {
            const condGrid = document.createElement('div');
            condGrid.className = 'notion-wf-trig-controls';

            const propSel = document.createElement('select');
            propSel.className = 'notion-wf-select';
            propSel.innerHTML = `<option value="__any__">Any property</option>${db.schema.map(s => `<option value="${escHtml(s.id)}">${escHtml(s.name)}</option>`).join('')}`;
            propSel.value = trig.propertyId || '__any__';
            propSel.onchange = () => {
              trig.propertyId = propSel.value;
              if (tIdx === 0) auto.trigger = { ...trig };
              opts.onCommit(); drawModal();
            };
            condGrid.append(propSel);

            if (propSel.value !== '__any__') {
              const opSel = document.createElement('select');
              opSel.className = 'notion-wf-select';
              [['any_edit', 'edited'], ['is', 'is'], ['contains', 'contains'], ['is_not_empty', 'is not empty'], ['is_empty', 'is empty']].forEach(([ov, ol]) => {
                const o = document.createElement('option'); o.value = ov; o.textContent = ol; opSel.append(o);
              });
              opSel.value = trig.operator || (trig.matchValue ? 'is' : 'any_edit');
              opSel.onchange = () => {
                trig.operator = opSel.value as DbAutomationTriggerOp;
                if (tIdx === 0) auto.trigger = { ...trig };
                opts.onCommit(); drawModal();
              };
              condGrid.append(opSel);

              if (opSel.value === 'is' || opSel.value === 'contains') {
                const pills = (trig.matchValues && trig.matchValues.length)
                  ? trig.matchValues
                  : (trig.matchValue ? [trig.matchValue] : []);
                trig.matchValues = pills;
                const pillBox = document.createElement('div');
                pillBox.className = 'notion-wf-pill-list';
                pills.forEach((pv, pIdx) => {
                  if (pIdx > 0) {
                    const orSpan = document.createElement('span');
                    orSpan.className = 'notion-wf-or-sep'; orSpan.textContent = 'or';
                    pillBox.append(orSpan);
                  }
                  const chip = document.createElement('span');
                  chip.className = 'notion-wf-cond-pill';
                  chip.innerHTML = `<span>${escHtml(pv)}</span><button type="button" aria-label="Remove condition">×</button>`;
                  chip.querySelector('button')?.addEventListener('click', () => {
                    pills.splice(pIdx, 1);
                    trig.matchValue = pills[0] || '';
                    if (tIdx === 0) auto.trigger = { ...trig };
                    opts.onCommit(); drawModal();
                  });
                  pillBox.append(chip);
                });

                const targetProp = db.schema.find(s => s.id === trig.propertyId);
                if (targetProp?.options?.length) {
                  const optPick = document.createElement('select');
                  optPick.className = 'notion-wf-select';
                  optPick.innerHTML = `<option value="">＋ Add option…</option>${targetProp.options.map(o => `<option value="${escHtml(o.name)}">${escHtml(o.name)}</option>`).join('')}`;
                  optPick.onchange = () => {
                    if (optPick.value && !pills.includes(optPick.value)) {
                      pills.push(optPick.value);
                      trig.matchValue = pills[0];
                      if (tIdx === 0) auto.trigger = { ...trig };
                      opts.onCommit(); drawModal();
                    }
                  };
                  pillBox.append(optPick);
                } else {
                  const valAdd = document.createElement('input');
                  valAdd.type = 'text'; valAdd.className = 'notion-wf-pill-input';
                  valAdd.placeholder = 'Type value + Enter…';
                  valAdd.onkeydown = ev => {
                    if (ev.key === 'Enter' && valAdd.value.trim()) {
                      ev.preventDefault();
                      pills.push(valAdd.value.trim());
                      trig.matchValue = pills[0];
                      if (tIdx === 0) auto.trigger = { ...trig };
                      opts.onCommit(); drawModal();
                    }
                  };
                  pillBox.append(valAdd);
                }
                tCard.append(condGrid, pillBox);
              } else {
                tCard.append(condGrid);
              }
            } else {
              tCard.append(condGrid);
            }
          }
          whenWrap.append(tCard);
        });

        const addTrigBtn = document.createElement('button');
        addTrigBtn.type = 'button'; addTrigBtn.className = 'notion-wf-add-link';
        addTrigBtn.textContent = '＋ Add trigger';
        addTrigBtn.onclick = () => {
          auto.triggers!.push({ id: uid(), kind: 'property_edited', propertyId: db.schema[1]?.id || '__any__', operator: 'any_edit' });
          opts.onCommit(); drawModal();
        };
        whenWrap.append(addTrigBtn);
      } else {
        const whenHead = document.createElement('div');
        whenHead.className = 'notion-wf-section-label';
        whenHead.textContent = 'When';
        const tCard = document.createElement('div');
        tCard.className = 'notion-wf-card notion-wf-static-trig';
        tCard.innerHTML = `✳ <strong>Button</strong> is clicked`;
        whenWrap.append(whenHead, tCard);
      }

      const stem = document.createElement('div');
      stem.className = 'notion-wf-connector';

      const doWrap = document.createElement('section');
      doWrap.className = 'notion-wf-section';
      const doHead = document.createElement('div');
      doHead.className = 'notion-wf-section-label';
      doHead.textContent = 'Do';
      doWrap.append(doHead);

      const makeTokenToolbar = (targetInput: HTMLInputElement | HTMLTextAreaElement, onVal: (v: string) => void) => {
        const bar = document.createElement('div');
        bar.className = 'notion-wf-token-bar';
        const atBtn = document.createElement('button');
        atBtn.type = 'button'; atBtn.className = 'notion-wf-token-btn'; atBtn.textContent = '@'; atBtn.title = 'Insert dynamic property or user';
        const sumBtn = document.createElement('button');
        sumBtn.type = 'button'; sumBtn.className = 'notion-wf-token-btn'; sumBtn.textContent = '∑'; sumBtn.title = 'Insert formula expression';
        const pickerWrap = document.createElement('div');
        pickerWrap.className = 'notion-wf-token-tray';
        pickerWrap.hidden = true;
        const insertTok = (tok: string) => {
          const s = targetInput.selectionStart ?? targetInput.value.length;
          const e = targetInput.selectionEnd ?? s;
          targetInput.value = targetInput.value.slice(0, s) + tok + targetInput.value.slice(e);
          onVal(targetInput.value);
          pickerWrap.hidden = true;
          targetInput.focus();
        };
        atBtn.onclick = () => {
          pickerWrap.hidden = !pickerWrap.hidden;
          if (!pickerWrap.hidden) {
            pickerWrap.replaceChildren();
            const varNames = (opts.actionsList || []).filter(a => a.kind === 'define_variables').flatMap(a => (a.variables || []).map(v => v.name).filter(Boolean));
            [['{{Name}}', 'Page name'], ['{{Actor}}', 'Trigger user'], ['{{Today}}', 'Today date'], ...varNames.map(vn => [`{{${vn}}}`, `{{${vn}}}`]), ...db.schema.map(sp => [`{{${sp.name}}}`, sp.name])].forEach(([tok, lbl]) => {
              const chip = document.createElement('button');
              chip.type = 'button'; chip.className = 'notion-wf-mini-chip'; chip.textContent = lbl;
              chip.onclick = () => insertTok(tok);
              pickerWrap.append(chip);
            });
          }
        };
        sumBtn.onclick = () => insertTok('{{= prop("Name") }}');
        bar.append(atBtn, sumBtn);
        return { bar, pickerWrap };
      };

      const renderPropValueEditor = (act: DbAutomationAction, targetSchema: DbSchemaProperty[], container: HTMLElement) => {
        const propRow = document.createElement('div');
        propRow.className = 'notion-wf-field-split';
        const pSel = document.createElement('select');
        pSel.className = 'notion-wf-select';
        targetSchema.filter(s => !propMeta(s.type).readonly).forEach(s => {
          const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; pSel.append(o);
        });
        act.propertyId = act.propertyId || pSel.options[0]?.value || '';
        pSel.value = act.propertyId;
        pSel.onchange = () => { act.propertyId = pSel.value; act.value = ''; opts.onCommit(); drawModal(); };

        const formulaTog = document.createElement('button');
        formulaTog.type = 'button';
        formulaTog.className = 'notion-wf-mini-toggle' + (act.useFormula ? ' is-active' : '');
        formulaTog.textContent = '∑ Formula';
        formulaTog.onclick = () => { act.useFormula = !act.useFormula; opts.onCommit(); drawModal(); };
        propRow.append(pSel, formulaTog);
        container.append(propRow);

        const chosenProp = targetSchema.find(s => s.id === act.propertyId);
        if (act.useFormula) {
          const fInp = document.createElement('input');
          fInp.type = 'text'; fInp.className = 'notion-wf-input';
          fInp.placeholder = 'e.g. dateAdd(now(), 7, "days") or prop("Points") * 2';
          fInp.value = act.formulaExpr || '';
          fInp.oninput = () => { act.formulaExpr = fInp.value; opts.onCommit(); };
          container.append(fInp);
        } else if (chosenProp?.type === 'person') {
          const curIds = Array.isArray(act.value) ? act.value : (act.value ? [String(act.value)] : []);
          const chips = document.createElement('div');
          chips.className = 'notion-wf-people-list';
          stateUsers.forEach((u: any) => {
            const active = curIds.includes(u.id) || curIds.includes(u.name);
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'notion-wf-person-pill' + (active ? ' is-selected' : '');
            chip.innerHTML = `<span class="notion-avatar-circle">${escHtml(userInitials(u.name))}</span><span>${escHtml(u.name)}</span>`;
            chip.onclick = () => { act.value = active ? [] : [u.id]; opts.onCommit(); drawModal(); };
            chips.append(chip);
          });
          container.append(chips);
        } else if (chosenProp?.type === 'status' || chosenProp?.type === 'select') {
          const oSel = document.createElement('select');
          oSel.className = 'notion-wf-select';
          oSel.innerHTML = `<option value="">Choose option…</option>${(chosenProp.options || []).map(o => `<option value="${escHtml(o.id)}">${escHtml(o.name)}</option>`).join('')}<option value="@clear">Clear value</option>`;
          const matchedOpt = (chosenProp.options || []).find(o => o.id === act.value || o.name === act.value);
          oSel.value = matchedOpt ? matchedOpt.id : (act.value === '@clear' ? '@clear' : '');
          oSel.onchange = () => { act.value = oSel.value; opts.onCommit(); drawModal(); };
          container.append(oSel);
        } else if (chosenProp?.type === 'checkbox') {
          const cSel = document.createElement('select');
          cSel.className = 'notion-wf-select';
          [['true', 'Checked'], ['false', 'Unchecked'], ['@toggle', 'Toggle current']].forEach(([v, l]) => {
            const o = document.createElement('option'); o.value = v; o.textContent = l; cSel.append(o);
          });
          cSel.value = String(act.value ?? 'true');
          cSel.onchange = () => { act.value = cSel.value; opts.onCommit(); drawModal(); };
          container.append(cSel);
        } else {
          const vWrap = document.createElement('div');
          vWrap.className = 'notion-wf-msg-box';
          const vInp = document.createElement('input');
          vInp.type = chosenProp?.type === 'number' ? 'number' : 'text';
          vInp.className = 'notion-wf-input';
          vInp.placeholder = chosenProp?.type === 'date' ? '@today, @now, or YYYY-MM-DD' : 'New value (or @ variables)…';
          vInp.value = act.value ?? '';
          vInp.oninput = () => { act.value = vInp.value; opts.onCommit(); };
          const toks = makeTokenToolbar(vInp, v => { act.value = v; opts.onCommit(); });
          vWrap.append(vInp, toks.bar);
          container.append(vWrap, toks.pickerWrap);
        }
      };

      const renderDbActionList = (parentEl: HTMLElement, listRef: DbAutomationAction[], depth = 0) => {
        listRef.forEach((act, idx) => {
          const card = document.createElement('div');
          card.className = 'notion-wf-card notion-wf-action-card' + (depth > 0 ? ' is-nested-branch-card' : '');

          const cTop = document.createElement('div');
          cTop.className = 'notion-wf-card-head';
          const cTitle = document.createElement('button');
          cTitle.type = 'button';
          cTitle.className = 'notion-wf-card-summary notion-wf-kind-btn';
          cTitle.title = 'Change action';
          cTitle.innerHTML = `<span class="notion-wf-step-ico">${actionKindIcon(act.kind)}</span><span>${escHtml(describeActionSummary(act, db, stateUsers))}</span><span class="notion-wf-caret">▾</span>`;
          cTitle.onclick = ev => {
            ev.stopPropagation();
            openDbActionSearchMenu(cTitle, nextKind => {
              const rep = makeDefaultDbAction(nextKind);
              rep.id = act.id;
              listRef[idx] = rep;
              opts.onCommit(); drawModal();
            });
          };

          const rmBtn = document.createElement('button');
          rmBtn.type = 'button'; rmBtn.className = 'notion-wf-icon-btn'; rmBtn.title = 'Remove action'; rmBtn.textContent = '×';
          rmBtn.onclick = () => { listRef.splice(idx, 1); opts.onCommit(); drawModal(); };
          cTop.append(cTitle, rmBtn);
          card.append(cTop);

          const body = document.createElement('div');
          body.className = 'notion-wf-card-body';

          if (act.kind === 'set_property') {
            renderPropValueEditor(act, db.schema, body);
          } else if (act.kind === 'edit_pages') {
            const scopeSel = document.createElement('select');
            scopeSel.className = 'notion-wf-select';
            [['this_page', 'This page'], ['related', 'Related pages'], ['database', 'Pages in database']].forEach(([sv, sl]) => {
              const o = document.createElement('option'); o.value = sv; o.textContent = sl; scopeSel.append(o);
            });
            act.targetScope = act.targetScope || 'this_page';
            scopeSel.value = act.targetScope;
            scopeSel.onchange = () => { act.targetScope = scopeSel.value as any; opts.onCommit(); drawModal(); };
            body.append(scopeSel);
            if (act.targetScope === 'this_page') {
              renderPropValueEditor(act, db.schema, body);
            } else if (act.targetScope === 'related') {
              const rSel = document.createElement('select');
              rSel.className = 'notion-wf-select';
              db.schema.filter(s => s.type === 'relation').forEach(rp => {
                const o = document.createElement('option'); o.value = rp.id; o.textContent = rp.name; rSel.append(o);
              });
              act.relationPropertyId = act.relationPropertyId || rSel.options[0]?.value || '';
              rSel.value = act.relationPropertyId;
              rSel.onchange = () => { act.relationPropertyId = rSel.value; opts.onCommit(); drawModal(); };
              body.append(rSel);
              const relPropObj = db.schema.find(s => s.id === act.relationPropertyId);
              const relDb = relPropObj?.relationDatabaseId ? getPageById(relPropObj.relationDatabaseId) : null;
              if (relDb && isDatabasePage(relDb)) renderPropValueEditor(act, ensureDatabaseConfig(relDb).schema, body);
            } else {
              const dSel = document.createElement('select');
              dSel.className = 'notion-wf-select';
              dbPages.forEach((d: any) => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.title || 'Database'; dSel.append(o); });
              act.targetDatabaseId = act.targetDatabaseId || opts.dbPage.id;
              dSel.value = act.targetDatabaseId;
              dSel.onchange = () => { act.targetDatabaseId = dSel.value; act.propertyId = ''; opts.onCommit(); drawModal(); };
              body.append(dSel);
              const tDbPg = getPageById(act.targetDatabaseId);
              if (tDbPg && isDatabasePage(tDbPg)) renderPropValueEditor(act, ensureDatabaseConfig(tDbPg).schema, body);
            }
          } else if (act.kind === 'add_page') {
            const dSel = document.createElement('select');
            dSel.className = 'notion-wf-select';
            dbPages.forEach((d: any) => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.title || 'Database'; dSel.append(o); });
            act.targetDatabaseId = act.targetDatabaseId || opts.dbPage.id;
            dSel.value = act.targetDatabaseId;
            dSel.onchange = () => { act.targetDatabaseId = dSel.value; opts.onCommit(); drawModal(); };
            const tWrap = document.createElement('div');
            tWrap.className = 'notion-wf-msg-box';
            const tInp = document.createElement('input');
            tInp.type = 'text'; tInp.className = 'notion-wf-input';
            tInp.placeholder = 'Page title (e.g. Follow-up: {{Name}})';
            tInp.value = act.title ?? '';
            tInp.oninput = () => { act.title = tInp.value; opts.onCommit(); };
            const toks = makeTokenToolbar(tInp, v => { act.title = v; opts.onCommit(); });
            tWrap.append(tInp, toks.bar);
            body.append(dSel, tWrap, toks.pickerWrap);
          } else if (act.kind === 'edit_related') {
            const rSel = document.createElement('select');
            rSel.className = 'notion-wf-select';
            db.schema.filter(s => s.type === 'relation').forEach(rp => {
              const o = document.createElement('option'); o.value = rp.id; o.textContent = rp.name; rSel.append(o);
            });
            act.relationPropertyId = act.relationPropertyId || rSel.options[0]?.value || '';
            rSel.value = act.relationPropertyId;
            rSel.onchange = () => { act.relationPropertyId = rSel.value; opts.onCommit(); drawModal(); };
            const relPropObj = db.schema.find(s => s.id === act.relationPropertyId);
            const relDb = relPropObj?.relationDatabaseId ? getPageById(relPropObj.relationDatabaseId) : null;
            const tpSel = document.createElement('select');
            tpSel.className = 'notion-wf-select';
            if (relDb && isDatabasePage(relDb)) {
              ensureDatabaseConfig(relDb).schema.forEach(ts => { const o = document.createElement('option'); o.value = ts.id; o.textContent = ts.name; tpSel.append(o); });
            }
            act.propertyId = act.propertyId || tpSel.options[0]?.value || '';
            tpSel.value = act.propertyId;
            tpSel.onchange = () => { act.propertyId = tpSel.value; opts.onCommit(); };
            const vInp = document.createElement('input');
            vInp.type = 'text'; vInp.className = 'notion-wf-input';
            vInp.placeholder = 'New value (@today / @toggle / option name)';
            vInp.value = act.value ?? '';
            vInp.oninput = () => { act.value = vInp.value; opts.onCommit(); };
            body.append(rSel, tpSel, vInp);
          } else if (act.kind === 'send_notification') {
            const recRow = document.createElement('div');
            recRow.className = 'notion-wf-field-split';
            const recModeSel = document.createElement('select');
            recModeSel.className = 'notion-wf-select';
            [['specific', 'Specific people'], ['person_prop', 'Person property'], ['everyone', 'Everyone in workspace']].forEach(([v, l]) => {
              const o = document.createElement('option'); o.value = v; o.textContent = l; recModeSel.append(o);
            });
            act.recipientMode = act.recipientMode || 'specific';
            recModeSel.value = act.recipientMode;
            recModeSel.onchange = () => { act.recipientMode = recModeSel.value as any; opts.onCommit(); drawModal(); };
            recRow.append(recModeSel);
            body.append(recRow);

            if (act.recipientMode === 'specific') {
              const pLbl = document.createElement('div'); pLbl.className = 'notion-wf-sub-label'; pLbl.textContent = 'People';
              const pplList = document.createElement('div'); pplList.className = 'notion-wf-people-list';
              act.recipientAccounts = Array.isArray(act.recipientAccounts) ? act.recipientAccounts : (act.targetAccount ? [act.targetAccount] : []);
              stateUsers.forEach((u: any) => {
                const acctKey = u.linkedAccount || u.name;
                const active = act.recipientAccounts!.includes(acctKey) || act.recipientAccounts!.includes(u.name);
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'notion-wf-person-pill' + (active ? ' is-selected' : '');
                chip.innerHTML = `<span class="notion-avatar-circle">${escHtml(userInitials(u.name))}</span><span>${escHtml(u.name)}</span>`;
                chip.onclick = () => {
                  if (active) act.recipientAccounts = act.recipientAccounts!.filter(x => x !== acctKey && x !== u.name);
                  else act.recipientAccounts!.push(acctKey);
                  act.targetAccount = act.recipientAccounts![0];
                  opts.onCommit(); drawModal();
                };
                pplList.append(chip);
              });
              body.append(pLbl, pplList);
            } else if (act.recipientMode === 'person_prop') {
              const ppSel = document.createElement('select');
              ppSel.className = 'notion-wf-select';
              db.schema.filter(s => s.type === 'person').forEach(ps => {
                const o = document.createElement('option'); o.value = ps.id; o.textContent = ps.name; ppSel.append(o);
              });
              act.recipientPropertyId = act.recipientPropertyId || ppSel.options[0]?.value || '';
              ppSel.value = act.recipientPropertyId;
              ppSel.onchange = () => { act.recipientPropertyId = ppSel.value; opts.onCommit(); };
              body.append(ppSel);
            }

            const mLbl = document.createElement('div'); mLbl.className = 'notion-wf-sub-label'; mLbl.textContent = 'Message';
            const msgBox = document.createElement('div'); msgBox.className = 'notion-wf-msg-box';
            const mTa = document.createElement('textarea');
            mTa.className = 'notion-wf-textarea'; mTa.rows = 3; mTa.placeholder = 'Notification message…';
            mTa.value = act.message ?? '';
            mTa.oninput = () => { act.message = mTa.value; opts.onCommit(); };
            const toks = makeTokenToolbar(mTa, v => { act.message = v; opts.onCommit(); });
            msgBox.append(mTa, toks.bar);
            body.append(mLbl, msgBox, toks.pickerWrap);
          } else if (act.kind === 'send_message') {
            const destSel = document.createElement('select');
            destSel.className = 'notion-wf-select';
            const groupOpts = chats.filter((c: any) => c.kind === 'group').map((c: any) => `<option value="ch:${escHtml(c.id)}">Channel #${escHtml(c.name)}</option>`).join('');
            const dmOpts = stateUsers.filter((u: any) => !u.blocked).map((u: any) => `<option value="dm:${escHtml(u.linkedAccount || u.name)}">DM @${escHtml(u.name)}</option>`).join('');
            destSel.innerHTML = `${groupOpts}${dmOpts}`;
            destSel.value = act.chatTargetAccount ? `dm:${act.chatTargetAccount}` : `ch:${act.chatChannelId || chats[0]?.id || 'chat-general'}`;
            destSel.onchange = () => {
              if (destSel.value.startsWith('dm:')) { act.chatTargetAccount = destSel.value.slice(3); act.chatChannelId = undefined; }
              else { act.chatChannelId = destSel.value.slice(3); act.chatTargetAccount = undefined; }
              opts.onCommit();
            };
            const msgBox = document.createElement('div'); msgBox.className = 'notion-wf-msg-box';
            const mTa = document.createElement('textarea');
            mTa.className = 'notion-wf-textarea'; mTa.rows = 2; mTa.placeholder = 'Workspace Chat message… (supports {{Name}}, {{Today}})';
            mTa.value = act.message ?? '';
            mTa.oninput = () => { act.message = mTa.value; opts.onCommit(); };
            const toks = makeTokenToolbar(mTa, v => { act.message = v; opts.onCommit(); });
            msgBox.append(mTa, toks.bar);
            body.append(destSel, msgBox, toks.pickerWrap);
          } else if (act.kind === 'send_webhook') {
            const uInp = document.createElement('input');
            uInp.type = 'url'; uInp.className = 'notion-wf-input'; uInp.placeholder = 'POST URL (https://hooks.example.com/...)';
            uInp.value = act.webhookUrl ?? '';
            uInp.oninput = () => { act.webhookUrl = uInp.value; opts.onCommit(); };
            const hInp = document.createElement('input');
            hInp.type = 'text'; hInp.className = 'notion-wf-input'; hInp.placeholder = 'Headers JSON (optional)';
            hInp.value = act.webhookHeadersJson ?? '';
            hInp.oninput = () => { act.webhookHeadersJson = hInp.value; opts.onCommit(); };
            const bTa = document.createElement('textarea');
            bTa.className = 'notion-wf-textarea'; bTa.rows = 2; bTa.placeholder = 'Custom JSON body (defaults to row properties + variables)';
            bTa.value = act.webhookBody ?? '';
            bTa.oninput = () => { act.webhookBody = bTa.value; opts.onCommit(); };
            body.append(uInp, hInp, bTa);
          } else if (act.kind === 'define_variables') {
            act.variables = Array.isArray(act.variables) && act.variables.length ? act.variables : [{ id: uid(), name: 'var1', mode: 'text', value: '' }];
            act.variables.forEach((v, vIdx) => {
              const vRow = document.createElement('div');
              vRow.className = 'notion-wf-var-row';
              const vName = document.createElement('input');
              vName.type = 'text'; vName.className = 'notion-wf-input'; vName.placeholder = 'Name'; vName.value = v.name || '';
              vName.oninput = () => { v.name = vName.value; opts.onCommit(); };
              const vVal = document.createElement('input');
              vVal.type = 'text'; vVal.className = 'notion-wf-input'; vVal.placeholder = 'Value or {{Name}}'; vVal.value = v.value || '';
              vVal.oninput = () => { v.value = vVal.value; opts.onCommit(); };
              const rmV = document.createElement('button');
              rmV.type = 'button'; rmV.className = 'notion-wf-icon-btn'; rmV.textContent = '×';
              rmV.onclick = () => { act.variables!.splice(vIdx, 1); opts.onCommit(); drawModal(); };
              vRow.append(vName, vVal, rmV);
              body.append(vRow);
            });
            const addV = document.createElement('button');
            addV.type = 'button'; addV.className = 'notion-wf-mini-add'; addV.textContent = '＋ Add variable';
            addV.onclick = () => { act.variables!.push({ id: uid(), name: `var${act.variables!.length + 1}`, mode: 'text', value: '' }); opts.onCommit(); drawModal(); };
            body.append(addV);
          } else if (act.kind === 'open_page') {
            const mSel = document.createElement('select');
            mSel.className = 'notion-wf-select';
            [['page', 'Open page or database form'], ['url', 'Open external URL']].forEach(([v, l]) => {
              const o = document.createElement('option'); o.value = v; o.textContent = l; mSel.append(o);
            });
            mSel.value = act.openMode || 'page';
            mSel.onchange = () => { act.openMode = mSel.value as any; opts.onCommit(); drawModal(); };
            body.append(mSel);
            if (act.openMode === 'url') {
              const uInp = document.createElement('input');
              uInp.type = 'url'; uInp.className = 'notion-wf-input'; uInp.placeholder = 'https://example.com';
              uInp.value = act.openUrl || '';
              uInp.oninput = () => { act.openUrl = uInp.value; opts.onCommit(); };
              body.append(uInp);
            } else {
              const pgSel = document.createElement('select');
              pgSel.className = 'notion-wf-select';
              pgSel.innerHTML = `<option value="current_row">Current database row</option>${dbPages.map((dp: any) => `<option value="${escHtml(dp.id)}">DB: ${escHtml(dp.title || 'Database')}</option>`).join('')}${allPages.map((pg: any) => `<option value="${escHtml(pg.id)}">${escHtml(pg.title || 'Untitled')}</option>`).join('')}`;
              act.openPageId = act.openPageId || 'current_row';
              pgSel.value = act.openPageId;
              pgSel.onchange = () => { act.openPageId = pgSel.value; act.openViewId = ''; opts.onCommit(); drawModal(); };
              body.append(pgSel);
              const destPg = act.openPageId !== 'current_row' ? getPageById(act.openPageId) : null;
              if (destPg && isDatabasePage(destPg)) {
                const vSel = document.createElement('select');
                vSel.className = 'notion-wf-select';
                const views = ensureDatabaseConfig(destPg).views || [];
                vSel.innerHTML = `<option value="">Default view</option>${views.map(vw => `<option value="${escHtml(vw.id)}">View: ${escHtml(vw.name)} (${escHtml(vw.type)})</option>`).join('')}`;
                vSel.value = act.openViewId || '';
                vSel.onchange = () => { act.openViewId = vSel.value; opts.onCommit(); };
                body.append(vSel);
              }
            }
          } else if (act.kind === 'show_confirmation') {
            const ct = document.createElement('input');
            ct.type = 'text'; ct.className = 'notion-wf-input'; ct.placeholder = 'Confirmation message…';
            ct.value = act.confirmMessage || 'Are you sure you want to continue?';
            ct.oninput = () => { act.confirmMessage = ct.value; opts.onCommit(); };
            body.append(ct);

            const branches = normalizeDbActionBranches(act);
            const brLbl = document.createElement('div'); brLbl.className = 'notion-wf-sub-label'; brLbl.textContent = 'Choice buttons & branching';
            body.append(brLbl);

            branches.forEach((br, brIdx) => {
              const brBox = document.createElement('div');
              brBox.className = 'notion-wf-branch-box';
              const brRow = document.createElement('div');
              brRow.className = 'notion-wf-branch-row';

              const lblInp = document.createElement('input');
              lblInp.type = 'text'; lblInp.className = 'notion-wf-input'; lblInp.placeholder = 'Button label';
              lblInp.value = br.label || '';
              lblInp.oninput = () => { br.label = lblInp.value; opts.onCommit(); };

              const modeSel = document.createElement('select');
              modeSel.className = 'notion-wf-select';
              [['continue', 'Continue workflow'], ['stop', 'Stop workflow'], ['branch', 'Run branch actions']].forEach(([mv, ml]) => {
                const o = document.createElement('option'); o.value = mv; o.textContent = ml; modeSel.append(o);
              });
              modeSel.value = br.mode || 'continue';
              modeSel.onchange = () => {
                br.mode = modeSel.value as any;
                if (br.mode === 'branch' && (!br.actions || !br.actions.length)) br.actions = [makeDefaultDbAction('edit_pages')];
                opts.onCommit(); drawModal();
              };

              const stSel = document.createElement('select');
              stSel.className = 'notion-wf-select notion-wf-style-sel';
              [['primary', 'Primary'], ['default', 'Neutral'], ['danger', 'Danger']].forEach(([sv, sl]) => {
                const o = document.createElement('option'); o.value = sv; o.textContent = sl; stSel.append(o);
              });
              stSel.value = br.style || 'default';
              stSel.onchange = () => { br.style = stSel.value as any; opts.onCommit(); };

              brRow.append(lblInp, modeSel, stSel);
              if (branches.length > 1) {
                const rmBr = document.createElement('button');
                rmBr.type = 'button'; rmBr.className = 'notion-wf-icon-btn'; rmBr.textContent = '×';
                rmBr.onclick = () => { branches.splice(brIdx, 1); opts.onCommit(); drawModal(); };
                brRow.append(rmBr);
              }
              brBox.append(brRow);

              if (br.mode === 'branch') {
                br.actions = br.actions || [];
                const nested = document.createElement('div');
                nested.className = 'notion-wf-branch-steps';
                renderDbActionList(nested, br.actions, depth + 1);
                const addSub = document.createElement('button');
                addSub.type = 'button'; addSub.className = 'notion-wf-mini-add'; addSub.textContent = `＋ Add action for “${br.label || 'Choice'}”`;
                addSub.onclick = ev => {
                  ev.stopPropagation();
                  openDbActionSearchMenu(addSub, pickedKind => {
                    br.actions!.push(makeDefaultDbAction(pickedKind));
                    opts.onCommit(); drawModal();
                  });
                };
                nested.append(addSub);
                brBox.append(nested);
              }
              body.append(brBox);
            });

            const addBr = document.createElement('button');
            addBr.type = 'button'; addBr.className = 'notion-wf-mini-add'; addBr.textContent = '＋ Add choice button';
            addBr.onclick = () => {
              branches.push({ id: uid(), label: `Option ${branches.length + 1}`, style: 'default', mode: 'branch', actions: [] });
              opts.onCommit(); drawModal();
            };
            body.append(addBr);
          }

          card.append(body);
          parentEl.append(card);
        });
      };

      renderDbActionList(doWrap, opts.actionsList, 0);

      const addActBtn = document.createElement('button');
      addActBtn.type = 'button'; addActBtn.className = 'notion-wf-add-link notion-wf-new-action-btn';
      addActBtn.textContent = '＋ New action';
      addActBtn.onclick = ev => {
        ev.stopPropagation();
        openDbActionSearchMenu(addActBtn, pickedKind => {
          opts.actionsList.push(makeDefaultDbAction(pickedKind));
          opts.onCommit(); drawModal();
        });
      };
      doWrap.append(addActBtn);

      const footer = document.createElement('div');
      footer.className = 'notion-wf-footer';
      const doneBtn = document.createElement('button');
      doneBtn.type = 'button';
      doneBtn.className = 'notion-wf-done-btn';
      doneBtn.textContent = 'Done';
      doneBtn.onclick = () => { opts.onCommit(); closeNotionWorkflowModal(); };
      footer.append(doneBtn);

      modal.append(whenWrap, stem, doWrap, footer);
    };

    drawModal();
    overlay.append(modal);
    document.body.append(overlay);
    activeWorkflowOverlay = overlay;
  }

  function openActionStepsEditorPopover(
    _anchor: HTMLElement,
    headingText: string,
    actionsList: DbAutomationAction[],
    dbPage: any,
    onDone: () => void
  ) {
    openNotionWorkflowModal({
      mode: 'button',
      title: headingText,
      dbPage,
      actionsList,
      onCommit: onDone
    });
  }

  function openAutomationsPopover(anchor: HTMLElement, dbPage: any) {
    const db = ensureDatabaseConfig(dbPage);
    db.automations = db.automations || [];
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Automations';
      const list = document.createElement('div');
      list.className = 'db-pop-list';

      const draw = () => {
        list.replaceChildren();
        if (!db.automations!.length) {
          const emp = document.createElement('p');
          emp.className = 'db-placeholder';
          emp.textContent = 'Automatically edit properties, create pages, and notify teammates when pages change.';
          list.append(emp);
        }
        db.automations!.forEach((auto, idx) => {
          const row = document.createElement('div');
          row.className = 'db-auto-list-row';
          const enCb = document.createElement('input');
          enCb.type = 'checkbox'; enCb.checked = auto.enabled !== false; enCb.title = 'Enable automation';
          enCb.onclick = e => e.stopPropagation();
          enCb.onchange = () => { auto.enabled = enCb.checked; persist(false); refreshAllDatabaseViews(); };

          const infoBtn = document.createElement('button');
          infoBtn.type = 'button'; infoBtn.className = 'db-auto-row-main';
          const tCount = (auto.triggers?.length || 1);
          const summary = `${tCount} trigger${tCount === 1 ? '' : 's'} → ${auto.actions.length} action${auto.actions.length === 1 ? '' : 's'}`;
          const icoSpan = auto.icon && host?.iconMarkup ? `${host.iconMarkup(auto.icon)} ` : (auto.icon ? `${escHtml(auto.icon)} ` : '');
          infoBtn.innerHTML = `<strong>${icoSpan}${escHtml(auto.name || 'Automation')}</strong><small>${escHtml(summary)}${auto.runCount ? ` · ${auto.runCount} runs` : ''}</small>`;
          infoBtn.onclick = () => {
            close();
            openNotionWorkflowModal({
              mode: 'automation',
              title: auto.name || 'Automation',
              icon: auto.icon,
              dbPage,
              automation: auto,
              actionsList: auto.actions,
              onDeleteAutomation: () => { db.automations!.splice(idx, 1); },
              onCommit: () => { persist(false); refreshAllDatabaseViews(); }
            });
          };

          const editBtn = document.createElement('button');
          editBtn.type = 'button'; editBtn.className = 'db-mini-btn'; editBtn.textContent = 'Edit';
          editBtn.onclick = () => infoBtn.click();

          row.append(enCb, infoBtn, editBtn);
          list.append(row);
        });

        const addAuto = document.createElement('button');
        addAuto.type = 'button'; addAuto.className = 'db-pop-create-btn';
        addAuto.textContent = '＋ New automation';
        addAuto.onclick = () => {
          const created: DbAutomation = {
            id: uid(),
            name: `Automation ${db.automations!.length + 1}`,
            enabled: true,
            trigger: { kind: 'page_added' },
            triggers: [{ id: uid(), kind: 'page_added' }],
            triggerMatch: 'all',
            actions: [{ id: uid(), kind: 'set_property', propertyId: db.schema[1]?.id || db.schema[0]?.id, value: '' }]
          };
          db.automations!.push(created);
          persist(false); refreshAllDatabaseViews();
          close();
          openNotionWorkflowModal({
            mode: 'automation',
            title: created.name,
            icon: created.icon,
            dbPage,
            automation: created,
            actionsList: created.actions,
            onDeleteAutomation: () => {
              const i = db.automations!.indexOf(created);
              if (i >= 0) db.automations!.splice(i, 1);
            },
            onCommit: () => { persist(false); refreshAllDatabaseViews(); }
          });
        };
        list.append(addAuto);
      };

      draw();
      pop.append(header, list);
    }, 320);
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

      if (host?.canViewPage && !host.canViewPage(currentDb)) {
        const denied = document.createElement('div');
        denied.className = 'db-missing-source';
        denied.innerHTML = '<span>🔒 You do not have permission to view this linked database.</span>';
        hostEl.append(denied);
        return;
      }

      const db = ensureDatabaseConfig(currentDb);
      const ro = roMode(currentDb);
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

      const filterCount = countFilterRules(view);
      const filterBtn = document.createElement('button');
      filterBtn.type = 'button';
      filterBtn.className = 'db-toolbar-btn' + (filterCount ? ' is-active' : '');
      filterBtn.textContent = filterCount ? `Filter (${filterCount})` : 'Filter';
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

      const autoCount = (db.automations || []).filter(a => a.enabled).length;
      const autoBtn = document.createElement('button');
      autoBtn.type = 'button';
      autoBtn.className = 'db-toolbar-btn' + (autoCount ? ' is-active' : '');
      autoBtn.textContent = autoCount ? `⚡ Automations (${autoCount})` : '⚡ Automations';
      autoBtn.title = 'Database automations';
      if (!ro) autoBtn.onclick = () => openAutomationsPopover(autoBtn, currentDb);
      else autoBtn.disabled = true;

      const settingsBtn = document.createElement('button');
      settingsBtn.type = 'button';
      settingsBtn.className = 'db-toolbar-btn';
      settingsBtn.textContent = '⚙';
      settingsBtn.title = 'View settings';
      settingsBtn.setAttribute('aria-label', 'Settings');
      settingsBtn.onclick = () => openViewSettingsPopover(settingsBtn, view, currentDb);

      toolbar.append(filterBtn, sortBtn, groupBtn, propsBtn, autoBtn, searchWrap, settingsBtn);

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
        else if (view.type === 'form') renderFormView(canvas, view, currentDb);
        else renderTableView(canvas, rows, view, currentDb);
      };

      // Filter & Sort active bar
      const showFilterBar = filterOpenByKey.get(hostKey) || filterCount > 0;
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

    const buildRuleChip = (rule: DbFilterRule, onRemove: () => void) => {
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
      rm.onclick = onRemove;
      chip.append(rm);
      return chip;
    };

    if (view.filters.length > 1) {
      const combSel = document.createElement('select');
      combSel.className = 'db-filter-match-sel';
      combSel.innerHTML = '<option value="and">Match ALL (And)</option><option value="or">Match ANY (Or)</option>';
      combSel.value = view.filterMatch || 'and';
      combSel.onchange = () => { view.filterMatch = combSel.value as 'and' | 'or'; persist(false); refreshAllDatabaseViews(); };
      bar.append(combSel);
    }

    view.filters.forEach((rule, idx) => {
      bar.append(buildRuleChip(rule, () => {
        view.filters.splice(idx, 1);
        if (!countFilterRules(view)) filterOpenByKey.set(hostKey, false);
        persist(false); refreshAllDatabaseViews();
      }));
    });

    const renderGroupBox = (grp: DbFilterGroup, onRemoveSelf: () => void): HTMLElement => {
      const box = document.createElement('div');
      box.className = 'db-filter-group-box';
      const gHead = document.createElement('div');
      gHead.className = 'db-filter-group-head';
      const matchSel = document.createElement('select');
      matchSel.className = 'db-filter-match-sel';
      matchSel.innerHTML = '<option value="and">Group: And</option><option value="or">Group: Or</option>';
      matchSel.value = grp.match;
      matchSel.onchange = () => { grp.match = matchSel.value as 'and' | 'or'; persist(false); refreshAllDatabaseViews(); };

      const addGrpRule = document.createElement('button');
      addGrpRule.type = 'button'; addGrpRule.className = 'db-link-btn'; addGrpRule.textContent = '+ Rule';
      addGrpRule.onclick = () => {
        const targetProp = db.schema[1] || db.schema[0];
        grp.rules.push({ id: uid(), propertyId: targetProp.id, op: 'contains', value: '' });
        persist(false); refreshAllDatabaseViews();
      };

      const addSubGrp = document.createElement('button');
      addSubGrp.type = 'button'; addSubGrp.className = 'db-link-btn'; addSubGrp.textContent = '+ Sub-group';
      addSubGrp.onclick = () => {
        const targetProp = db.schema[1] || db.schema[0];
        grp.rules.push({
          id: uid(),
          match: grp.match === 'and' ? 'or' : 'and',
          rules: [{ id: uid(), propertyId: targetProp.id, op: 'contains', value: '' }]
        });
        persist(false); refreshAllDatabaseViews();
      };

      const rmGrp = document.createElement('button');
      rmGrp.type = 'button'; rmGrp.className = 'db-mini-btn'; rmGrp.textContent = '✕';
      rmGrp.title = 'Remove filter group';
      rmGrp.onclick = onRemoveSelf;
      gHead.append(matchSel, addGrpRule, addSubGrp, rmGrp);
      box.append(gHead);

      const inner = document.createElement('div');
      inner.className = 'db-filter-group-rules';
      grp.rules.forEach((node, idx) => {
        if (isFilterGroup(node)) {
          inner.append(renderGroupBox(node, () => {
            grp.rules.splice(idx, 1);
            persist(false); refreshAllDatabaseViews();
          }));
        } else {
          inner.append(buildRuleChip(node, () => {
            grp.rules.splice(idx, 1);
            persist(false); refreshAllDatabaseViews();
          }));
        }
      });
      box.append(inner);
      return box;
    };

    if (view.filterGroup) {
      bar.append(renderGroupBox(view.filterGroup, () => {
        view.filterGroup = undefined;
        if (!countFilterRules(view)) filterOpenByKey.set(hostKey, false);
        persist(false); refreshAllDatabaseViews();
      }));
    }

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

    const addGroup = document.createElement('button');
    addGroup.type = 'button';
    addGroup.className = 'db-link-btn';
    addGroup.textContent = '＋ Add filter group';
    addGroup.onclick = () => {
      const targetProp = db.schema[1] || db.schema[0];
      if (!view.filterGroup) {
        view.filterGroup = {
          id: uid(),
          match: 'or',
          rules: [{ id: uid(), propertyId: targetProp.id, op: 'contains', value: '' }]
        };
      } else {
        view.filterGroup.rules.push({
          id: uid(),
          match: view.filterGroup.match === 'and' ? 'or' : 'and',
          rules: [{ id: uid(), propertyId: targetProp.id, op: 'contains', value: '' }]
        });
      }
      filterOpenByKey.set(hostKey, true);
      persist(false); refreshAllDatabaseViews();
    };
    bar.append(addGroup);
    return bar;
  }

  function openLinkSourcePopover(anchor: HTMLElement, onChoose?: (dbPage: any) => void) {
    openDbPopover(anchor, (pop, close) => {
      const header = document.createElement('div');
      header.className = 'db-pop-header';
      header.textContent = 'Select a data source';
      const list = document.createElement('div');
      list.className = 'db-pop-list';
      const dbs = getDatabasePages().filter((d: any) => !host?.canViewPage || host.canViewPage(d));
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
    setRowValue,
    executeAutomationActions,
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
