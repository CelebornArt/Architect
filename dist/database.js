// @ts-nocheck
/**
 * Notion-style relational Database engine and multi-view UI for Architect.
 * Supports full-page databases (/database), inline database views (/database inline),
 * shared schema across row pages, 8 view layouts, formulas, rollups, relations,
 * filtering/sorting/grouping/aggregations, templates, and Side/Center/Full peek.
 */
const ArchitectDatabase = (() => {
    const DB_COLORS = [
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
    const DB_PROPERTY_TYPES = [
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
    const DB_ROLLUP_CALCS = [
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
    const DB_VIEW_TYPES = [
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
    const DB_AGGREGATIONS = [
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
    const DB_FILTER_OPS = [
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
    let host = null;
    let activePopover = null;
    let activePopoverCleanup = null;
    let activePeek = null;
    const searchQueriesByKey = new Map();
    const filterOpenByKey = new Map();
    const noDateOpenByKey = new Map();
    const activeHostRenders = new Map();
    function initHost(nextHost) {
        host = nextHost;
    }
    function uid() {
        return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `db_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }
    function escHtml(v) {
        return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function dbIconHtml(icon, fallback = '📄') {
        const raw = icon || fallback;
        if (window.ArchitectIcons?.renderIconHtml)
            return window.ArchitectIcons.renderIconHtml(raw, '', fallback);
        return String(raw).startsWith('data:image') ? escHtml(fallback) : escHtml(raw);
    }
    function getState() {
        return host?.getState?.();
    }
    function actorName() {
        return host?.getCurrentUser?.() || getState()?.users?.[0]?.name || 'Raphael';
    }
    function isHostReadOnly(page) {
        if (page && host?.isPageReadOnly)
            return !!host.isPageReadOnly(page);
        return !!host?.isReadOnlyMirror?.();
    }
    function roMode(page) {
        if (page?.database?.locked)
            return true;
        return isHostReadOnly(page);
    }
    function persist(shouldRender = false) {
        host?.save?.();
        if (shouldRender)
            host?.render?.();
    }
    function isFormPage(page) {
        return !!page && page.pageKind === 'form';
    }
    function isDatabasePage(page) {
        return !!page && (page.pageKind === 'database' || page.pageKind === 'form');
    }
    function getDatabasePages() {
        return (getState()?.pages || []).filter((p) => isDatabasePage(p));
    }
    function getPageById(pageId) {
        return (getState()?.pages || []).find((p) => p.id === pageId) || null;
    }
    function getDatabaseRows(dbPageId) {
        return (getState()?.pages || []).filter((p) => p.databaseId === dbPageId);
    }
    function colorMeta(key) {
        return DB_COLORS.find(c => c.key === key) || DB_COLORS[0];
    }
    function propMeta(type) {
        if (type === 'title')
            return { type: 'title', label: 'Title', icon: 'Aa', readonly: false };
        return DB_PROPERTY_TYPES.find(t => t.type === type) || DB_PROPERTY_TYPES[0];
    }
    function viewMeta(type) {
        return DB_VIEW_TYPES.find(v => v.type === type) || DB_VIEW_TYPES[0];
    }
    function defaultStatusOptions() {
        return [
            { id: uid(), name: 'Not started', color: 'gray', statusGroup: 'todo' },
            { id: uid(), name: 'In progress', color: 'blue', statusGroup: 'in_progress' },
            { id: uid(), name: 'Done', color: 'green', statusGroup: 'complete' }
        ];
    }
    function defaultTagOptions() {
        return [
            { id: uid(), name: 'Design', color: 'purple' },
            { id: uid(), name: 'Engineering', color: 'blue' },
            { id: uid(), name: 'Urgent', color: 'red' }
        ];
    }
    function buildDefaultSchema() {
        return [
            { id: 'prop_title', name: 'Name', type: 'title', width: 220 },
            { id: uid(), name: 'Tags', type: 'multi_select', options: defaultTagOptions(), width: 150 },
            { id: uid(), name: 'Status', type: 'status', options: defaultStatusOptions(), width: 145 }
        ];
    }
    function buildDefaultView(schema, type = 'table', name) {
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
            hideEmptyGroups: false,
            groupSort: 'manual',
            showGroupCounts: true,
            conditionalColors: [],
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
    function ensureDatabaseConfig(dbPage) {
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
        const db = dbPage.database;
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
            if (!Array.isArray(v.propertyOrder))
                v.propertyOrder = [...schemaIds];
            schemaIds.forEach(sid => {
                if (!v.propertyOrder.includes(sid))
                    v.propertyOrder.push(sid);
            });
            v.propertyOrder = v.propertyOrder.filter(sid => schemaIds.includes(sid));
            if (!Array.isArray(v.visiblePropertyIds))
                v.visiblePropertyIds = [...schemaIds];
            const titleProp = db.schema.find(s => s.type === 'title');
            if (titleProp && !v.visiblePropertyIds.includes(titleProp.id)) {
                v.visiblePropertyIds.unshift(titleProp.id);
            }
            v.visiblePropertyIds = v.visiblePropertyIds.filter(sid => schemaIds.includes(sid));
            v.filters = Array.isArray(v.filters) ? v.filters : [];
            v.sorts = Array.isArray(v.sorts) ? v.sorts : [];
            v.calculations = v.calculations || {};
            v.columnWidths = v.columnWidths || {};
            v.hiddenGroups = Array.isArray(v.hiddenGroups) ? v.hiddenGroups : [];
            v.collapsedGroups = Array.isArray(v.collapsedGroups) ? v.collapsedGroups : [];
            v.conditionalColors = Array.isArray(v.conditionalColors) ? v.conditionalColors : [];
            v.groupSort = v.groupSort || 'manual';
            if (v.showGroupCounts === undefined)
                v.showGroupCounts = true;
            if (!v.datePropertyId)
                v.datePropertyId = db.schema.find(s => s.type === 'date')?.id;
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
        db.connections = Array.isArray(db.connections) ? db.connections : [];
        if (db.schema.some(s => s.type === 'unique_id'))
            assignUniqueIds(dbPage);
        return db;
    }
    function assignUniqueIds(dbPage, specificRow) {
        const db = dbPage?.database;
        if (!db)
            return;
        const idProps = (db.schema || []).filter(s => s.type === 'unique_id');
        if (!idProps.length)
            return;
        const allRows = getDatabaseRows(dbPage.id);
        const targets = specificRow ? [specificRow] : allRows;
        idProps.forEach(prop => {
            const prefix = prop.idPrefix || 'ID';
            let maxExisting = 0;
            allRows.forEach((r) => {
                const val = String(r.propertyValues?.[prop.id] || '');
                const m = val.match(/(\d+)$/);
                if (m)
                    maxExisting = Math.max(maxExisting, Number(m[1]) || 0);
            });
            let nextNum = Math.max(Number(prop.idNext) || 1, maxExisting + 1);
            targets.forEach((r) => {
                r.propertyValues = r.propertyValues || {};
                if (!r.propertyValues[prop.id]) {
                    r.propertyValues[prop.id] = `${prefix}-${nextNum}`;
                    nextNum++;
                }
            });
            prop.idNext = nextNum;
        });
    }
    function interpolateAutoTemplate(tpl, rowPage, dbPage, vars = {}) {
        const db = ensureDatabaseConfig(dbPage);
        return String(tpl || '').replace(/\{\{([^}]+)\}\}/g, (_, key) => {
            const rawKey = String(key).trim();
            if (rawKey.startsWith('=')) {
                const expr = rawKey.slice(1).trim();
                if (!expr)
                    return '';
                const res = evaluateDbFormula(expr, rowPage, dbPage);
                return res && typeof res === 'object' && 'text' in res ? String(res.text ?? '') : String(res ?? '');
            }
            const k = rawKey.toLowerCase();
            if (k === 'name' || k === 'title')
                return rowPage?.title || 'Untitled';
            if (k === 'actor' || k === 'triggerperson' || k === 'me')
                return actorName();
            if (k === 'today')
                return new Date().toISOString().slice(0, 10);
            if (k === 'now')
                return new Date().toLocaleString();
            const vHit = Object.entries(vars).find(([vn]) => vn.toLowerCase() === k);
            if (vHit)
                return vHit[1];
            const prop = db.schema.find(s => s.name.toLowerCase() === k || s.id === rawKey);
            return prop && rowPage ? valueAsSearchText(prop, rowPage, dbPage) : '';
        });
    }
    function coerceAutomationPropValue(prop, rawVal, currentRowVal) {
        if (rawVal === '@clear')
            return prop.type === 'checkbox' ? false : (prop.type === 'multi_select' || prop.type === 'person' || prop.type === 'relation' ? [] : '');
        if (prop.type === 'checkbox') {
            if (rawVal === '@toggle')
                return !Boolean(currentRowVal);
            if (typeof rawVal === 'boolean')
                return rawVal;
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
            return vals.map(v => users.find((u) => u.id === v || u.name?.toLowerCase() === v.toLowerCase() || u.linkedAccount?.toLowerCase() === v.toLowerCase())?.id || v);
        }
        if (prop.type === 'number')
            return Number(rawVal) || 0;
        return rawVal;
    }
    function resolveActionValue(act, targetProp, rowPage, dbPage, vars = {}) {
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
    function fireDbWorkflowWebhook(rawUrl, headersJson, bodyStr, defaultPayload) {
        const cleanUrl = (rawUrl || '').trim();
        if (!/^https?:\/\//i.test(cleanUrl)) {
            host?.toast?.('Invalid webhook URL (must start with http:// or https://)');
            return;
        }
        let headers = { 'Content-Type': 'application/json' };
        if (headersJson && headersJson.trim()) {
            try {
                const parsed = JSON.parse(headersJson);
                if (parsed && typeof parsed === 'object')
                    headers = { ...headers, ...parsed };
            }
            catch { }
        }
        const finalBody = bodyStr && bodyStr.trim() ? bodyStr : JSON.stringify(defaultPayload);
        try {
            window.__lastWorkflowWebhookCall = { url: cleanUrl, headers, body: finalBody, at: Date.now() };
            fetch(cleanUrl, { method: 'POST', headers, body: finalBody }).catch(() => { });
        }
        catch { }
    }
    function executeSingleDbAction(act, rowPage, dbPage, depth, vars) {
        const db = ensureDatabaseConfig(dbPage);
        const users = getState()?.users || [];
        let mutated = false;
        if (act.kind === 'define_variables') {
            (act.variables || []).forEach(v => {
                const vn = (v.name || '').trim();
                if (!vn)
                    return;
                if (v.mode === 'formula' && v.value) {
                    const ev = evaluateDbFormula(v.value, rowPage, dbPage);
                    vars[vn] = ev && typeof ev === 'object' && 'text' in ev ? String(ev.text ?? '') : String(ev ?? '');
                }
                else {
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
        }
        else if (act.kind === 'edit_pages') {
            const scope = act.targetScope || 'this_page';
            if (scope === 'this_page' && act.propertyId && rowPage) {
                const tp = db.schema.find(s => s.id === act.propertyId);
                if (tp) {
                    setRowValue(rowPage, tp, resolveActionValue(act, tp, rowPage, dbPage, vars), dbPage, false, depth + 1);
                    mutated = true;
                }
            }
            else if (scope === 'related' && act.relationPropertyId && act.propertyId && rowPage) {
                const relProp = db.schema.find(s => s.id === act.relationPropertyId && s.type === 'relation');
                const targetDb = relProp?.relationDatabaseId ? getPageById(relProp.relationDatabaseId) : null;
                if (relProp && targetDb && isDatabasePage(targetDb)) {
                    const tp = ensureDatabaseConfig(targetDb).schema.find(s => s.id === act.propertyId);
                    const ids = Array.isArray(rowPage?.propertyValues?.[relProp.id]) ? rowPage.propertyValues[relProp.id] : [];
                    ids.forEach((rid) => {
                        const relRow = getPageById(rid);
                        if (relRow && tp) {
                            setRowValue(relRow, tp, resolveActionValue(act, tp, relRow, targetDb, vars), targetDb, false, depth + 1);
                            mutated = true;
                        }
                    });
                }
            }
            else if (scope === 'database') {
                const targetDb = (act.targetDatabaseId && getPageById(act.targetDatabaseId)) || dbPage;
                if (targetDb && isDatabasePage(targetDb)) {
                    const tDb = ensureDatabaseConfig(targetDb);
                    const tp = tDb.schema.find(s => s.id === act.propertyId);
                    const fProp = act.filterPropertyId ? tDb.schema.find(s => s.id === act.filterPropertyId) : null;
                    const fNeedle = interpolateAutoTemplate(act.filterValue || '', rowPage, dbPage, vars).trim().toLowerCase();
                    if (tp) {
                        getDatabaseRows(targetDb.id).forEach((r) => {
                            if (fProp && fNeedle) {
                                const txt = valueAsSearchText(fProp, r, targetDb).toLowerCase();
                                if (!txt.includes(fNeedle))
                                    return;
                            }
                            setRowValue(r, tp, resolveActionValue(act, tp, r, targetDb, vars), targetDb, false, depth + 1);
                            mutated = true;
                        });
                    }
                }
            }
        }
        else if (act.kind === 'add_page') {
            const targetDb = (act.targetDatabaseId && getPageById(act.targetDatabaseId)) || dbPage;
            if (isDatabasePage(targetDb)) {
                const tDb = ensureDatabaseConfig(targetDb);
                const titleProp = tDb.schema.find(s => s.type === 'title');
                const initVals = {};
                const resolvedTitle = act.useFormula && act.formulaExpr
                    ? String(evaluateDbFormula(act.formulaExpr, rowPage, dbPage)?.text ?? evaluateDbFormula(act.formulaExpr, rowPage, dbPage) ?? 'New item')
                    : interpolateAutoTemplate(act.title || 'New item', rowPage, dbPage, vars);
                if (titleProp)
                    initVals[titleProp.id] = resolvedTitle;
                (act.propAssignments || []).forEach(pa => {
                    const ap = tDb.schema.find(s => s.id === pa.propertyId);
                    if (ap && ap.id !== titleProp?.id) {
                        initVals[ap.id] = coerceAutomationPropValue(ap, interpolateAutoTemplate(pa.value || '', rowPage, dbPage, vars), '');
                    }
                });
                createDatabaseRow(targetDb, initVals, [], '📄', { automationDepth: depth + 1 });
                mutated = true;
            }
        }
        else if (act.kind === 'edit_related' && act.relationPropertyId && act.propertyId) {
            const relProp = db.schema.find(s => s.id === act.relationPropertyId && s.type === 'relation');
            const targetDb = relProp?.relationDatabaseId ? getPageById(relProp.relationDatabaseId) : null;
            if (relProp && targetDb && isDatabasePage(targetDb)) {
                const tDb = ensureDatabaseConfig(targetDb);
                const targetProp = tDb.schema.find(s => s.id === act.propertyId);
                const ids = Array.isArray(rowPage?.propertyValues?.[relProp.id]) ? rowPage.propertyValues[relProp.id] : [];
                ids.forEach((rid) => {
                    const relRow = getPageById(rid);
                    if (relRow && targetProp) {
                        const nv = resolveActionValue(act, targetProp, relRow, targetDb, vars);
                        setRowValue(relRow, targetProp, nv, targetDb, false, depth + 1);
                        mutated = true;
                    }
                });
            }
        }
        else if (act.kind === 'send_notification') {
            const body = interpolateAutoTemplate(act.message || `Updated ${rowPage?.title || 'row'}`, rowPage, dbPage, vars);
            let targets = [];
            if (act.recipientMode === 'person_prop' && act.recipientPropertyId) {
                const pIds = Array.isArray(rowPage?.propertyValues?.[act.recipientPropertyId])
                    ? rowPage.propertyValues[act.recipientPropertyId]
                    : (rowPage?.propertyValues?.[act.recipientPropertyId] ? [rowPage.propertyValues[act.recipientPropertyId]] : []);
                pIds.forEach((pid) => {
                    const usr = users.find((u) => u.id === pid || u.name === pid);
                    if (usr)
                        targets.push(usr.linkedAccount || usr.name);
                    else if (pid)
                        targets.push(pid);
                });
            }
            else if (act.recipientMode === 'everyone') {
                targets = users.map((u) => u.linkedAccount || u.name);
            }
            else if (Array.isArray(act.recipientAccounts) && act.recipientAccounts.length) {
                targets = [...act.recipientAccounts];
            }
            else if (act.targetAccount) {
                targets = [act.targetAccount];
            }
            if (!targets.length)
                targets = [undefined];
            targets.forEach(targetAccount => {
                host?.pushNotification?.({
                    kind: 'database',
                    title: `${dbPage.title || 'Database'} automation`,
                    body,
                    pageId: rowPage?.id || dbPage.id,
                    targetAccount
                });
            });
        }
        else if (act.kind === 'send_message') {
            const body = interpolateAutoTemplate(act.message || `Update from ${rowPage?.title || dbPage.title || 'Database'}`, rowPage, dbPage, vars);
            host?.pushChatMessage?.({
                channelId: act.chatChannelId,
                targetAccount: act.chatTargetAccount,
                text: body,
                fromAutomation: dbPage?.title || 'Database'
            });
        }
        else if (act.kind === 'send_webhook') {
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
        }
        else if (act.kind === 'open_page') {
            if (act.openMode === 'url' && act.openUrl) {
                const u = interpolateAutoTemplate(act.openUrl, rowPage, dbPage, vars);
                if (/^https?:\/\//i.test(u)) {
                    try {
                        window.open(u, '_blank', 'noopener,noreferrer');
                    }
                    catch { }
                }
            }
            else {
                const destId = (!act.openPageId || act.openPageId === 'current_row') ? rowPage?.id : act.openPageId;
                if (destId) {
                    const targetPg = getPageById(destId);
                    if (act.openViewId && targetPg && isDatabasePage(targetPg)) {
                        const tDb = ensureDatabaseConfig(targetPg);
                        if (tDb.views.some(v => v.id === act.openViewId))
                            tDb.activeViewId = act.openViewId;
                    }
                    host?.navigateToPage?.(destId);
                }
            }
        }
        return mutated;
    }
    function executeAutomationActions(actions, rowPage, dbPage, depth = 0, vars = {}) {
        if (!Array.isArray(actions) || !actions.length || depth > 4)
            return false;
        let mutated = false;
        actions.forEach(act => {
            if (act.kind === 'show_confirmation')
                return;
            if (executeSingleDbAction(act, rowPage, dbPage, depth, vars))
                mutated = true;
        });
        return mutated;
    }
    function normalizeDbActionBranches(act) {
        if (Array.isArray(act.branches) && act.branches.length)
            return act.branches;
        const okLbl = (act.confirmLabel || '').trim() || 'Okay';
        act.branches = [
            { id: `dbr-ok-${act.id}`, label: okLbl, style: 'primary', mode: 'continue', actions: [] },
            { id: `dbr-cancel-${act.id}`, label: 'Cancel', style: 'default', mode: 'stop', actions: [] }
        ];
        return act.branches;
    }
    function openDbChoiceBranchModal(titleText, bodyText, branches, onChoose) {
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
        overlay.addEventListener('click', ev => { if (ev.target === overlay) {
            overlay.remove();
            activeWorkflowOverlay = null;
        } });
        overlay.append(card);
        document.body.append(overlay);
        activeWorkflowOverlay = overlay;
    }
    function executeAutomationStepsInteractive(actions, rowPage, dbPage, titleContext, startIdx = 0, vars = {}, depth = 0, onDone) {
        if (!Array.isArray(actions) || depth > 4) {
            onDone?.();
            return;
        }
        for (let i = startIdx; i < actions.length; i++) {
            const act = actions[i];
            if (act.kind === 'show_confirmation') {
                const branches = normalizeDbActionBranches(act);
                openDbChoiceBranchModal(act.confirmTitle || titleContext || 'Confirm action', interpolateAutoTemplate(act.confirmMessage || 'Are you sure you want to continue?', rowPage, dbPage, vars), branches, br => {
                    if (br.mode === 'stop')
                        return;
                    if (br.mode === 'branch' && Array.isArray(br.actions) && br.actions.length) {
                        executeAutomationStepsInteractive(br.actions, rowPage, dbPage, br.label || titleContext, 0, { ...vars }, depth + 1, onDone);
                        return;
                    }
                    executeAutomationStepsInteractive(actions, rowPage, dbPage, titleContext, i + 1, vars, depth, onDone);
                });
                return;
            }
            executeSingleDbAction(act, rowPage, dbPage, depth, vars);
        }
        onDone?.();
    }
    function evaluateTriggerCondition(trig, rowPage, dbPage, db) {
        if (!trig.propertyId || trig.propertyId === '__any__')
            return true;
        const prop = db.schema.find(s => s.id === trig.propertyId);
        if (!prop)
            return true;
        const actual = valueAsSearchText(prop, rowPage, dbPage).trim().toLowerCase();
        const pills = (trig.matchValues && trig.matchValues.length)
            ? trig.matchValues.map(s => String(s).trim().toLowerCase()).filter(Boolean)
            : (trig.matchValue && trig.matchValue.trim() ? [trig.matchValue.trim().toLowerCase()] : []);
        const op = trig.operator || (pills.length ? 'is' : 'any_edit');
        if (op === 'is_empty')
            return !actual;
        if (op === 'is_not_empty')
            return !!actual;
        if (!pills.length || op === 'any_edit')
            return true;
        if (op === 'contains')
            return pills.some(p => actual.includes(p));
        return pills.some(p => actual === p);
    }
    function triggerDatabaseAutomations(triggerKind, rowPage, dbPage, changedPropId, depth = 0) {
        if (depth > 3 || roMode(dbPage))
            return;
        const db = dbPage?.database;
        const list = (db?.automations || []).filter(a => a.enabled);
        if (!list.length || !db)
            return;
        let didMutate = false;
        list.forEach(auto => {
            const trigs = (auto.triggers && auto.triggers.length) ? auto.triggers : (auto.trigger ? [auto.trigger] : []);
            if (!trigs.length)
                return;
            const matchesEvent = (t) => {
                if (t.kind !== triggerKind)
                    return false;
                if (triggerKind === 'property_edited') {
                    if (t.propertyId && t.propertyId !== '__any__' && t.propertyId !== changedPropId)
                        return false;
                }
                return evaluateTriggerCondition(t, rowPage, dbPage, db);
            };
            const anyEventMatched = trigs.some(matchesEvent);
            if (!anyEventMatched)
                return;
            if (auto.triggerMatch !== 'any' && trigs.length > 1) {
                const allOk = trigs.every(t => {
                    if (t.kind === 'page_added')
                        return triggerKind === 'page_added' || matchesEvent(t);
                    return evaluateTriggerCondition(t, rowPage, dbPage, db);
                });
                if (!allOk)
                    return;
            }
            auto.runCount = (auto.runCount || 0) + 1;
            auto.lastRunAt = Date.now();
            if (executeAutomationActions(auto.actions, rowPage, dbPage, depth + 1))
                didMutate = true;
        });
        if (didMutate)
            persist(false);
    }
    function createDatabaseRow(dbPage, initialValues = {}, initialBlocks = [], icon = '📄', opts = {}) {
        const s = getState();
        const db = ensureDatabaseConfig(dbPage);
        const titleProp = db.schema.find(p => p.type === 'title');
        const titleVal = initialValues[titleProp?.id || 'prop_title'] ?? '';
        const now = Date.now();
        const propVals = {};
        for (const key of Object.keys(initialValues)) {
            if (key !== titleProp?.id)
                propVals[key] = structuredCloneSafe(initialValues[key]);
        }
        const statusProp = db.schema.find(p => p.type === 'status');
        if (statusProp && propVals[statusProp.id] === undefined && statusProp.options?.length) {
            propVals[statusProp.id] = statusProp.options[0].id;
        }
        const submitter = opts.anonymous ? 'Anonymous' : actorName();
        const rowPage = {
            id: uid(),
            title: typeof titleVal === 'string' ? titleVal : '',
            icon: icon || '📄',
            parentId: dbPage.id,
            databaseId: dbPage.id,
            propertyValues: propVals,
            blocks: initialBlocks.length ? structuredCloneSafe(initialBlocks) : [{ id: uid(), type: 'text', text: '' }],
            createdBy: submitter,
            lastEditedBy: submitter,
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
    function seedStarterRows(dbPage) {
        if (getDatabaseRows(dbPage.id).length)
            return;
        for (let k = 0; k < 3; k++) {
            createDatabaseRow(dbPage, {}, [], '📄', { skipAutomations: true });
        }
    }
    function convertPageToDatabase(page, initialViewType = 'table') {
        if (!page)
            return page;
        page.pageKind = 'database';
        if (page.icon === '📄')
            page.icon = '🗃️';
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
    function createDatabasePage(parentId, title = 'Untitled database', initialViewType = 'table') {
        const s = getState();
        const now = Date.now();
        const dbPage = {
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
    function isoOffsetDate(daysOffset) {
        const d = new Date();
        d.setDate(d.getDate() + daysOffset);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
    function questPriorityOptions() {
        return [
            { id: uid(), name: 'Super High', color: 'red' },
            { id: uid(), name: 'High', color: 'orange' },
            { id: uid(), name: 'Medium', color: 'yellow' },
            { id: uid(), name: 'Low', color: 'green' }
        ];
    }
    function questPhaseOptions() {
        return [
            { id: uid(), name: 'R&D + Ideation', color: 'gray', statusGroup: 'todo' },
            { id: uid(), name: 'Assigned', color: 'blue', statusGroup: 'todo' },
            { id: uid(), name: 'Briefed', color: 'purple', statusGroup: 'todo' },
            { id: uid(), name: 'To Assign', color: 'default', statusGroup: 'todo' },
            { id: uid(), name: 'In progress', color: 'blue', statusGroup: 'in_progress' },
            { id: uid(), name: 'On hold', color: 'yellow', statusGroup: 'in_progress' },
            { id: uid(), name: 'Complete', color: 'green', statusGroup: 'complete' },
            { id: uid(), name: 'Finished', color: 'green', statusGroup: 'complete' },
            { id: uid(), name: 'Dismissed', color: 'red', statusGroup: 'complete' }
        ];
    }
    function questScopeOptions() {
        return [
            { id: uid(), name: 'Project / Task', color: 'blue' },
            { id: uid(), name: 'Check-in / Review', color: 'purple' }
        ];
    }
    function questProjectOptions() {
        return [
            { id: uid(), name: 'Grimhald', color: 'purple' },
            { id: uid(), name: 'Trials of Akash', color: 'orange' },
            { id: uid(), name: 'Edany EP', color: 'pink' },
            { id: uid(), name: 'Anomaly', color: 'blue' },
            { id: uid(), name: 'Leilani', color: 'green' },
            { id: uid(), name: 'Soul Atlas', color: 'yellow' }
        ];
    }
    function questHealthOptions() {
        return [
            { id: uid(), name: 'On Track', color: 'green' },
            { id: uid(), name: 'At Risk', color: 'yellow' },
            { id: uid(), name: 'Delayed', color: 'red' },
            { id: uid(), name: 'Unclear', color: 'gray' }
        ];
    }
    function questDepartmentOptions() {
        return [
            { id: uid(), name: 'Animation', color: 'purple' },
            { id: uid(), name: 'Art', color: 'blue' },
            { id: uid(), name: 'Comics', color: 'orange' },
            { id: uid(), name: 'Community', color: 'green' },
            { id: uid(), name: 'Content Creation', color: 'pink' },
            { id: uid(), name: 'Digital Marketing | Mail/Web', color: 'default' },
            { id: uid(), name: 'Documentary', color: 'brown' },
            { id: uid(), name: 'Editing', color: 'gray' },
            { id: uid(), name: 'Fashion', color: 'red' },
            { id: uid(), name: 'Featurettes', color: 'yellow' },
            { id: uid(), name: 'Production', color: 'purple' }
        ];
    }
    function questTypeOptions() {
        return [
            { id: uid(), name: 'Production', color: 'purple' },
            { id: uid(), name: '2D Animation', color: 'blue' },
            { id: uid(), name: 'Concept Art', color: 'pink' },
            { id: uid(), name: 'Layout', color: 'orange' },
            { id: uid(), name: 'Graphic Design', color: 'green' },
            { id: uid(), name: 'Art Direction', color: 'red' },
            { id: uid(), name: 'Marketing Sustain', color: 'yellow' },
            { id: uid(), name: 'Games Art', color: 'blue' },
            { id: uid(), name: 'Recruiting', color: 'brown' },
            { id: uid(), name: 'Coordination', color: 'default' },
            { id: uid(), name: 'Promotion & Collabs', color: 'green' },
            { id: uid(), name: 'SMM Support - Community', color: 'pink' },
            { id: uid(), name: 'Art Content Creation', color: 'purple' },
            { id: uid(), name: 'Writing', color: 'gray' },
            { id: uid(), name: 'Marketing Featurettes', color: 'yellow' }
        ];
    }
    function configureQuestboardDatabase(dbPage, seedSampleQuests = true) {
        const dbPageId = dbPage.id;
        const titleProp = { id: 'prop_title', name: 'Task', type: 'title', width: 270 };
        const keyProp = { id: uid(), name: 'Issue Key', type: 'unique_id', idPrefix: 'QUEST', idNext: 1, width: 96 };
        const prioProp = { id: uid(), name: 'Priority', type: 'select', options: questPriorityOptions(), width: 120 };
        const timeProp = { id: uid(), name: 'Timeframe', type: 'date', width: 175 };
        const phaseProp = { id: uid(), name: 'Phase', type: 'status', options: questPhaseOptions(), width: 150 };
        const respProp = { id: uid(), name: 'Responsible.', type: 'person', width: 145 };
        const acctProp = { id: uid(), name: 'Accountable.', type: 'person', width: 145 };
        const consProp = { id: uid(), name: 'Consulted.', type: 'person', width: 145 };
        const scopeProp = { id: uid(), name: 'Scope', type: 'select', options: questScopeOptions(), width: 140 };
        const projProp = { id: uid(), name: 'Project', type: 'multi_select', options: questProjectOptions(), width: 155 };
        const healthProp = { id: uid(), name: 'Health', type: 'select', options: questHealthOptions(), width: 115 };
        const deptProp = { id: uid(), name: 'Department', type: 'multi_select', options: questDepartmentOptions(), width: 170 };
        const typeProp = { id: uid(), name: 'Type', type: 'multi_select', options: questTypeOptions(), width: 170 };
        const parentProp = { id: uid(), name: 'Parent task', type: 'relation', relationDatabaseId: dbPageId, width: 165 };
        const schema = [
            titleProp, keyProp, prioProp, timeProp, phaseProp,
            respProp, acctProp, consProp, scopeProp,
            projProp, healthProp, deptProp, typeProp, parentProp
        ];
        const tableAllIds = [
            titleProp.id, keyProp.id, prioProp.id, timeProp.id, phaseProp.id,
            respProp.id, acctProp.id, consProp.id, scopeProp.id,
            projProp.id, healthProp.id, deptProp.id, typeProp.id
        ];
        const everythingView = buildDefaultView(schema, 'table', 'Everything');
        everythingView.visiblePropertyIds = [...tableAllIds];
        everythingView.propertyOrder = [...tableAllIds];
        const boardView = buildDefaultView(schema, 'board', 'Board');
        boardView.groupBy = phaseProp.id;
        boardView.visiblePropertyIds = [keyProp.id, prioProp.id, timeProp.id, respProp.id, acctProp.id, consProp.id, projProp.id, healthProp.id];
        boardView.cardPreview = 'none';
        const timelineView = buildDefaultView(schema, 'timeline', 'Timeline');
        timelineView.datePropertyId = timeProp.id;
        timelineView.timelineZoom = 'week';
        timelineView.visiblePropertyIds = [keyProp.id, prioProp.id, phaseProp.id, respProp.id, healthProp.id];
        const docView = buildDefaultView(schema, 'table', 'Documentary');
        docView.visiblePropertyIds = [...tableAllIds];
        docView.propertyOrder = [...tableAllIds];
        docView.filters = [{ id: uid(), propertyId: deptProp.id, op: 'contains', value: 'Documentary' }];
        const personView = buildDefaultView(schema, 'board', 'Specific Person View');
        personView.groupBy = respProp.id;
        personView.visiblePropertyIds = [keyProp.id, prioProp.id, timeProp.id, phaseProp.id, scopeProp.id, projProp.id, healthProp.id];
        dbPage.database = {
            schema,
            views: [everythingView, boardView, timelineView, docView, personView],
            activeViewId: everythingView.id,
            defaultOpenMode: 'side_peek',
            templates: [],
            automations: [],
            subItemsEnabled: true,
            parentPropertyId: parentProp.id,
            isOfficialTaskboard: true,
            showTitle: true
        };
        if (seedSampleQuests && !getDatabaseRows(dbPageId).length) {
            const s = getState();
            const users = (s?.users || []).filter(Boolean);
            const actor = actorName().toLowerCase();
            const u0 = users.find((u) => u.name.toLowerCase() === actor || (u.linkedAccount || '').toLowerCase() === actor) || users[0];
            const u1 = users.find((u) => u0 && u.id !== u0.id) || u0;
            const u2 = users.find((u) => u0 && u1 && u.id !== u0.id && u.id !== u1.id) || u1;
            const optId = (prop, name) => prop.options?.find(o => o.name === name)?.id || '';
            const idOrEmpty = (u) => (u?.id ? [u.id] : []);
            const q1 = createDatabaseRow(dbPage, {
                [prioProp.id]: optId(prioProp, 'Super High'),
                [timeProp.id]: { start: isoOffsetDate(-3), end: isoOffsetDate(-1) },
                [phaseProp.id]: optId(phaseProp, 'In progress'),
                [respProp.id]: idOrEmpty(u0),
                [acctProp.id]: idOrEmpty(u1),
                [consProp.id]: idOrEmpty(u2),
                [scopeProp.id]: optId(scopeProp, 'Project / Task'),
                [projProp.id]: [optId(projProp, 'Grimhald')],
                [healthProp.id]: optId(healthProp, 'Delayed'),
                [deptProp.id]: [optId(deptProp, 'Art'), optId(deptProp, 'Production')],
                [typeProp.id]: [optId(typeProp, 'Concept Art'), optId(typeProp, 'Art Direction')]
            }, [{ id: uid(), type: 'text', text: 'Finalize silhouette pass and lighting key for the Grimhald citadel sequence.' }], '🔥', { skipAutomations: true });
            q1.title = 'Grimhald Key Art Lock';
            const q2 = createDatabaseRow(dbPage, {
                [prioProp.id]: optId(prioProp, 'High'),
                [timeProp.id]: { start: isoOffsetDate(-1), end: isoOffsetDate(2) },
                [phaseProp.id]: optId(phaseProp, 'Briefed'),
                [respProp.id]: idOrEmpty(u0),
                [acctProp.id]: idOrEmpty(u1),
                [scopeProp.id]: optId(scopeProp, 'Project / Task'),
                [projProp.id]: [optId(projProp, 'Trials of Akash')],
                [healthProp.id]: optId(healthProp, 'At Risk'),
                [deptProp.id]: [optId(deptProp, 'Animation')],
                [typeProp.id]: [optId(typeProp, '2D Animation'), optId(typeProp, 'Layout')]
            }, [{ id: uid(), type: 'text', text: 'Complete animatic layout blocking for Episode 2 reveal.' }], '🎬', { skipAutomations: true });
            q2.title = 'Akash Ep.2 Layout Pass';
            const q3 = createDatabaseRow(dbPage, {
                [prioProp.id]: optId(prioProp, 'High'),
                [timeProp.id]: { start: isoOffsetDate(0), end: isoOffsetDate(1) },
                [phaseProp.id]: optId(phaseProp, 'In progress'),
                [respProp.id]: idOrEmpty(u1),
                [acctProp.id]: idOrEmpty(u0),
                [consProp.id]: idOrEmpty(u2),
                [scopeProp.id]: optId(scopeProp, 'Check-in / Review'),
                [projProp.id]: [optId(projProp, 'Anomaly')],
                [healthProp.id]: optId(healthProp, 'At Risk'),
                [deptProp.id]: [optId(deptProp, 'Documentary'), optId(deptProp, 'Editing')],
                [typeProp.id]: [optId(typeProp, 'Production'), optId(typeProp, 'Coordination')]
            }, [{ id: uid(), type: 'text', text: 'Review rough documentary cut and confirm B-roll interview pacing.' }], '🧐', { skipAutomations: true });
            q3.title = 'Review Documentary Cut v3';
            const q4 = createDatabaseRow(dbPage, {
                [prioProp.id]: optId(prioProp, 'Medium'),
                [timeProp.id]: { start: isoOffsetDate(1), end: isoOffsetDate(5) },
                [phaseProp.id]: optId(phaseProp, 'Assigned'),
                [respProp.id]: idOrEmpty(u2),
                [consProp.id]: idOrEmpty(u0),
                [acctProp.id]: idOrEmpty(u1),
                [scopeProp.id]: optId(scopeProp, 'Project / Task'),
                [projProp.id]: [optId(projProp, 'Leilani')],
                [healthProp.id]: optId(healthProp, 'On Track'),
                [deptProp.id]: [optId(deptProp, 'Fashion'), optId(deptProp, 'Comics')],
                [typeProp.id]: [optId(typeProp, 'Graphic Design')]
            }, [{ id: uid(), type: 'text', text: 'Consult on costume color scripting and cover emblem variations.' }], '🪡', { skipAutomations: true });
            q4.title = 'Leilani Costume Palette Consult';
            const q5 = createDatabaseRow(dbPage, {
                [prioProp.id]: optId(prioProp, 'Medium'),
                [timeProp.id]: { start: isoOffsetDate(3), end: isoOffsetDate(9) },
                [phaseProp.id]: optId(phaseProp, 'R&D + Ideation'),
                [respProp.id]: idOrEmpty(u0),
                [consProp.id]: idOrEmpty(u1),
                [scopeProp.id]: optId(scopeProp, 'Project / Task'),
                [projProp.id]: [optId(projProp, 'Anomaly')],
                [healthProp.id]: optId(healthProp, 'On Track'),
                [deptProp.id]: [optId(deptProp, 'Community'), optId(deptProp, 'Content Creation')],
                [typeProp.id]: [optId(typeProp, 'Marketing Sustain'), optId(typeProp, 'SMM Support - Community')]
            }, [{ id: uid(), type: 'text', text: 'Draft lore teaser carousel for community release window.' }], '✨', { skipAutomations: true });
            q5.title = 'Anomaly Launch Beat Sheet';
            const q6 = createDatabaseRow(dbPage, {
                [prioProp.id]: optId(prioProp, 'Low'),
                [timeProp.id]: { start: isoOffsetDate(-7), end: isoOffsetDate(-4) },
                [phaseProp.id]: optId(phaseProp, 'Complete'),
                [respProp.id]: idOrEmpty(u0),
                [scopeProp.id]: optId(scopeProp, 'Project / Task'),
                [projProp.id]: [optId(projProp, 'Soul Atlas')],
                [healthProp.id]: optId(healthProp, 'On Track'),
                [deptProp.id]: [optId(deptProp, 'Featurettes')],
                [typeProp.id]: [optId(typeProp, 'Marketing Featurettes')]
            }, [], '✅', { skipAutomations: true });
            q6.title = 'Soul Atlas Teaser Export';
            // Jira-ready Subtasks linked under parent quests via Parent task relation
            const st1 = createDatabaseRow(dbPage, {
                [prioProp.id]: optId(prioProp, 'High'),
                [timeProp.id]: { start: isoOffsetDate(-3), end: isoOffsetDate(-2) },
                [phaseProp.id]: optId(phaseProp, 'Complete'),
                [respProp.id]: idOrEmpty(u0),
                [scopeProp.id]: optId(scopeProp, 'Project / Task'),
                [projProp.id]: [optId(projProp, 'Grimhald')],
                [healthProp.id]: optId(healthProp, 'On Track'),
                [deptProp.id]: [optId(deptProp, 'Art')],
                [parentProp.id]: [q1.id]
            }, [], '↳', { skipAutomations: true });
            st1.title = 'Silhouette thumbnails batch A';
            const st2 = createDatabaseRow(dbPage, {
                [prioProp.id]: optId(prioProp, 'Super High'),
                [timeProp.id]: { start: isoOffsetDate(-2), end: isoOffsetDate(-1) },
                [phaseProp.id]: optId(phaseProp, 'In progress'),
                [respProp.id]: idOrEmpty(u0),
                [consProp.id]: idOrEmpty(u1),
                [scopeProp.id]: optId(scopeProp, 'Project / Task'),
                [projProp.id]: [optId(projProp, 'Grimhald')],
                [healthProp.id]: optId(healthProp, 'At Risk'),
                [deptProp.id]: [optId(deptProp, 'Art')],
                [parentProp.id]: [q1.id]
            }, [], '↳', { skipAutomations: true });
            st2.title = 'Rim-light mood paint-over';
            const st3 = createDatabaseRow(dbPage, {
                [prioProp.id]: optId(prioProp, 'Medium'),
                [timeProp.id]: { start: isoOffsetDate(0), end: isoOffsetDate(2) },
                [phaseProp.id]: optId(phaseProp, 'Assigned'),
                [respProp.id]: idOrEmpty(u1),
                [acctProp.id]: idOrEmpty(u0),
                [scopeProp.id]: optId(scopeProp, 'Check-in / Review'),
                [projProp.id]: [optId(projProp, 'Trials of Akash')],
                [healthProp.id]: optId(healthProp, 'On Track'),
                [deptProp.id]: [optId(deptProp, 'Animation')],
                [parentProp.id]: [q2.id]
            }, [], '↳', { skipAutomations: true });
            st3.title = 'Camera timing check-in';
        }
        assignUniqueIds(dbPage);
        return dbPage;
    }
    function isHiddenBasePage(pg, ws = getState()) {
        if (!pg)
            return false;
        if (pg.hiddenFromDocs === true)
            return true;
        if (pg.hiddenFromDocs === false)
            return false;
        return !!(!pg.parentId
            && !pg.databaseId
            && (pg.id === ws?.officialTaskboardId || pg.database?.isOfficialTaskboard)
            && /master questboard/i.test(String(pg.title || '')));
    }
    function createQuestboardPage(parentId, title = 'Master Questboard | OS', seedSampleQuests = true, hiddenFromDocs = false) {
        const s = getState();
        const now = Date.now();
        const dbPage = {
            id: uid(),
            title: title || 'Master Questboard | OS',
            icon: '⚔️',
            parentId,
            pageKind: 'database',
            fullWidth: true,
            ...(hiddenFromDocs ? { hiddenFromDocs: true } : {}),
            blocks: [{ id: uid(), type: 'text', text: '' }],
            createdAt: now,
            updatedAt: now
        };
        s.pages.push(dbPage);
        configureQuestboardDatabase(dbPage, seedSampleQuests);
        if (!s.officialTaskboardId)
            s.officialTaskboardId = dbPage.id;
        return dbPage;
    }
    function getOfficialQuestboardPage() {
        const s = getState();
        if (!s || !Array.isArray(s.pages))
            return null;
        if (s.officialTaskboardId) {
            const explicit = s.pages.find((p) => p.id === s.officialTaskboardId && isDatabasePage(p));
            if (explicit)
                return explicit;
        }
        const flagged = s.pages.find((p) => isDatabasePage(p) && p.database?.isOfficialTaskboard);
        if (flagged) {
            s.officialTaskboardId = flagged.id;
            return flagged;
        }
        const named = s.pages.find((p) => isDatabasePage(p) && /questboard|official task/i.test(String(p.title || '')));
        if (named) {
            s.officialTaskboardId = named.id;
            return named;
        }
        return null;
    }
    function setOfficialQuestboardPage(dbPageId) {
        const s = getState();
        if (!s)
            return null;
        const target = s.pages.find((p) => p.id === dbPageId && isDatabasePage(p));
        if (!target)
            return null;
        s.pages.forEach((p) => {
            if (p.database?.isOfficialTaskboard && p.id !== target.id)
                p.database.isOfficialTaskboard = false;
        });
        const db = ensureDatabaseConfig(target);
        db.isOfficialTaskboard = true;
        s.officialTaskboardId = target.id;
        persist(false);
        return target;
    }
    function ensureOfficialQuestboardPage() {
        const existing = getOfficialQuestboardPage();
        if (existing) {
            if (existing.hiddenFromDocs === undefined && !existing.parentId && /master questboard/i.test(String(existing.title || ''))) {
                existing.hiddenFromDocs = true;
            }
            return existing;
        }
        const created = createQuestboardPage(undefined, 'Master Questboard | OS', true, true);
        persist(false);
        return created;
    }
    function getParentPropForDb(dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        if (db.parentPropertyId) {
            const p = db.schema.find(s => s.id === db.parentPropertyId);
            if (p)
                return p;
        }
        return db.schema.find(s => s.type === 'relation' && /parent/i.test(s.name || ''));
    }
    function getSubtasksForRow(rowPage, dbPage) {
        if (!rowPage || !dbPage)
            return [];
        const parentProp = getParentPropForDb(dbPage);
        if (!parentProp)
            return [];
        return getDatabaseRows(dbPage.id).filter((r) => {
            const linked = Array.isArray(r.propertyValues?.[parentProp.id]) ? r.propertyValues[parentProp.id] : [];
            return linked.includes(rowPage.id);
        });
    }
    function isRowComplete(rowPage, dbPage) {
        if (!rowPage || !dbPage)
            return false;
        const db = ensureDatabaseConfig(dbPage);
        const statusProp = db.schema.find(s => s.type === 'status') || db.schema.find(s => s.type === 'select' && /phase|status/i.test(s.name || ''));
        if (statusProp) {
            const opt = resolveOption(statusProp, getRawValue(statusProp, rowPage, dbPage));
            if (opt?.statusGroup === 'complete')
                return true;
            if (opt && /^(complete|finished|done|dismissed)$/i.test(opt.name.trim()))
                return true;
        }
        const chk = db.schema.find(s => s.type === 'checkbox' && /done|complete/i.test(s.name || ''));
        if (chk)
            return Boolean(getRawValue(chk, rowPage, dbPage));
        return false;
    }
    function toggleRowComplete(rowPage, dbPage, makeDone) {
        if (!rowPage || !dbPage || roMode(dbPage))
            return;
        const db = ensureDatabaseConfig(dbPage);
        const currentlyDone = isRowComplete(rowPage, dbPage);
        const targetDone = makeDone !== undefined ? makeDone : !currentlyDone;
        const statusProp = db.schema.find(s => s.type === 'status') || db.schema.find(s => s.type === 'select' && /phase|status/i.test(s.name || ''));
        if (statusProp?.options?.length) {
            const targetOpt = targetDone
                ? (statusProp.options.find(o => o.statusGroup === 'complete') || statusProp.options.find(o => /^(complete|finished|done)$/i.test(o.name)) || statusProp.options[statusProp.options.length - 1])
                : (statusProp.options.find(o => o.statusGroup === 'in_progress') || statusProp.options.find(o => o.statusGroup === 'todo') || statusProp.options[0]);
            if (targetOpt)
                setRowValue(rowPage, statusProp, targetOpt.id, dbPage, true);
            return;
        }
        const chk = db.schema.find(s => s.type === 'checkbox');
        if (chk)
            setRowValue(rowPage, chk, targetDone, dbPage, true);
    }
    function createSubtaskForRow(parentRow, dbPage, title, extraProps = {}) {
        if (!parentRow || !dbPage || roMode(dbPage))
            return null;
        const db = ensureDatabaseConfig(dbPage);
        let parentProp = getParentPropForDb(dbPage);
        if (!parentProp) {
            parentProp = addSchemaProperty(dbPage, 'Parent task', 'relation');
            parentProp.relationDatabaseId = dbPage.id;
        }
        db.subItemsEnabled = true;
        db.parentPropertyId = parentProp.id;
        const inherited = {};
        ['Project', 'Department', 'Scope'].forEach(pName => {
            const p = db.schema.find(s => s.name.toLowerCase() === pName.toLowerCase());
            const v = p ? getRawValue(p, parentRow, dbPage) : undefined;
            if (p && v != null && (!Array.isArray(v) || v.length))
                inherited[p.id] = Array.isArray(v) ? [...v] : v;
        });
        const respProp = db.schema.find(s => s.type === 'person' && /responsible|assignee|owner/i.test(s.name || '')) || db.schema.find(s => s.type === 'person');
        if (respProp && !extraProps[respProp.id]) {
            const parentResp = getRawValue(respProp, parentRow, dbPage);
            if (Array.isArray(parentResp) && parentResp.length)
                inherited[respProp.id] = [...parentResp];
        }
        const statusProp = db.schema.find(s => s.type === 'status');
        if (statusProp?.options?.length && !extraProps[statusProp.id]) {
            const firstActive = statusProp.options.find(o => o.statusGroup === 'todo') || statusProp.options[0];
            if (firstActive)
                inherited[statusProp.id] = firstActive.id;
        }
        const child = createDatabaseRow(dbPage, { ...inherited, ...extraProps, [parentProp.id]: [parentRow.id] }, [], '↳');
        if (title && title.trim())
            child.title = title.trim();
        persist(false);
        refreshAllDatabaseViews();
        return child;
    }
    function formShareUrl(pageId) {
        try {
            const url = new URL(window.location.href);
            url.hash = `page=${encodeURIComponent(pageId)}&formMode=respond`;
            return url.toString();
        }
        catch {
            return `#page=${encodeURIComponent(pageId)}&formMode=respond`;
        }
    }
    function sanitizeSubdomainSlug(raw) {
        return String(raw || '')
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 48);
    }
    function formSubdomainUrl(cfgOrSlug) {
        const rawSlug = typeof cfgOrSlug === 'string' ? cfgOrSlug : cfgOrSlug?.subdomain;
        const slug = sanitizeSubdomainSlug(rawSlug);
        if (!slug)
            return '';
        return `https://${slug}.forms.architect.local`;
    }
    function convertPageToForm(page, formTitle) {
        if (!page)
            return page;
        const hadDb = Boolean(page.database && Array.isArray(page.database.schema) && page.database.schema.length);
        page.pageKind = 'form';
        page.fullWidth = true;
        if (!page.title || page.title === 'Untitled' || page.title === 'Untitled database') {
            page.title = formTitle || 'New form';
        }
        else if (formTitle) {
            page.title = formTitle;
        }
        if (!page.icon || page.icon === '📄' || page.icon === '🗃️') {
            page.icon = 'arch-icon:file:indigo';
        }
        if (!hadDb) {
            const titleProp = { id: 'prop_title', name: 'Question 1', type: 'title', width: 240 };
            const respProp = { id: uid(), name: 'Respondent', type: 'created_by', width: 160 };
            const timeProp = { id: uid(), name: 'Submission time', type: 'created_time', width: 170 };
            const q2Prop = {
                id: uid(),
                name: 'Question 2',
                type: 'multi_select',
                options: [
                    { id: uid(), name: 'Option 1', color: 'blue' },
                    { id: uid(), name: 'Option 2', color: 'yellow' },
                    { id: uid(), name: 'Option 3', color: 'red' }
                ],
                width: 210
            };
            const schema = [titleProp, q2Prop, respProp, timeProp];
            const formView = buildDefaultView(schema, 'form', 'Form');
            formView.formConfig = {
                title: page.title || 'New form',
                description: '',
                submitLabel: 'Submit',
                submitColor: 'blue',
                confirmationTitle: 'Thank you!',
                confirmationBody: 'Your response has been recorded.',
                isClosed: false,
                anonymousSubmissions: false,
                allowSendToEmail: true,
                allowSubmitAnotherResponse: true,
                submissionPermissions: 'workspace',
                formMode: 'editor',
                containerStyle: 'outlined',
                backgroundMode: 'default',
                backgroundColor: '#f4f6fb',
                requiredPropertyIds: [titleProp.id],
                hiddenPropertyIds: [],
                questions: [
                    { id: uid(), propertyId: titleProp.id, label: 'Question 1', required: true },
                    { id: uid(), propertyId: q2Prop.id, label: 'Question 2', required: false, displayMode: 'list' }
                ]
            };
            const respView = buildDefaultView(schema, 'table', 'Responses');
            respView.visiblePropertyIds = [titleProp.id, respProp.id, timeProp.id, q2Prop.id];
            respView.propertyOrder = [titleProp.id, respProp.id, timeProp.id, q2Prop.id];
            page.database = {
                schema,
                views: [formView, respView],
                activeViewId: formView.id,
                defaultOpenMode: 'side_peek',
                templates: [],
                showTitle: true,
                formUploadsToAssets: true,
                formUploadsFolder: 'form-uploads'
            };
            syncFormDocBlocks(page);
            return page;
        }
        const db = ensureDatabaseConfig(page);
        let formView = db.views.find(v => v.type === 'form');
        if (!formView) {
            formView = buildDefaultView(db.schema, 'form', 'Form');
            db.views.unshift(formView);
        }
        if (!db.views.some(v => v.type === 'table')) {
            const respView = buildDefaultView(db.schema, 'table', 'Responses');
            db.views.push(respView);
        }
        db.activeViewId = formView.id;
        syncFormDocBlocks(page);
        return page;
    }
    function createFormPage(parentId, title = 'New form') {
        const s = getState();
        const now = Date.now();
        const formPage = {
            id: uid(),
            title: title || 'New form',
            icon: 'arch-icon:file:indigo',
            parentId,
            pageKind: 'form',
            fullWidth: true,
            blocks: [{ id: uid(), type: 'text', text: '' }],
            createdAt: now,
            updatedAt: now
        };
        s.pages.push(formPage);
        convertPageToForm(formPage, title || 'New form');
        return formPage;
    }
    function deleteDatabaseRow(rowPageId) {
        const s = getState();
        s.pages = s.pages.filter((p) => p.id !== rowPageId);
        // Clean dangling relation references
        s.pages.forEach((p) => {
            if (p.propertyValues) {
                Object.keys(p.propertyValues).forEach(k => {
                    const val = p.propertyValues[k];
                    if (Array.isArray(val) && val.includes(rowPageId)) {
                        p.propertyValues[k] = val.filter(x => x !== rowPageId);
                    }
                });
            }
        });
        if (activePeek?.rowId === rowPageId)
            closeDatabasePeek();
    }
    function structuredCloneSafe(val) {
        if (val == null)
            return val;
        try {
            return JSON.parse(JSON.stringify(val));
        }
        catch {
            return val;
        }
    }
    function activeViewFor(dbPage, viewOverrideId) {
        const db = ensureDatabaseConfig(dbPage);
        if (viewOverrideId) {
            const found = db.views.find(v => v.id === viewOverrideId);
            if (found)
                return found;
        }
        return db.views.find(v => v.id === db.activeViewId) || db.views[0];
    }
    function resolveOption(prop, rawVal) {
        if (!prop.options?.length || rawVal == null || rawVal === '')
            return null;
        const str = String(rawVal);
        return prop.options.find(o => o.id === str || o.name.toLowerCase() === str.toLowerCase()) || null;
    }
    function dateTextOf(rawVal) {
        if (!rawVal)
            return '';
        if (typeof rawVal === 'string')
            return rawVal;
        if (typeof rawVal === 'object' && rawVal.start) {
            return rawVal.end ? `${rawVal.start} -> ${rawVal.end}` : rawVal.start;
        }
        return '';
    }
    function formatNumberVal(val, fmt) {
        if (val === '' || val == null || Number.isNaN(Number(val)))
            return '';
        const num = Number(val);
        if (fmt === 'percent')
            return `${Math.round(num * 1000) / 10}%`;
        if (fmt === 'dollar')
            return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
        if (fmt === 'euro')
            return `€${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
        return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
    function unwrapFormulaVal(v) {
        if (v && typeof v === 'object') {
            if (v.__dbRow)
                return v.__dbRow.title || 'Untitled';
            if (v.__richFormula)
                return v.text ?? '';
        }
        return v;
    }
    function formulaAsString(v) {
        const u = unwrapFormulaVal(v);
        if (u == null)
            return '';
        if (Array.isArray(u))
            return u.map(formulaAsString).join(', ');
        if (typeof u === 'object' && u.start)
            return dateTextOf(u);
        return String(u);
    }
    function formulaDateMs(v) {
        const u = v && typeof v === 'object' && v.start ? v.start : unwrapFormulaVal(v);
        if (typeof u === 'number')
            return u;
        const ms = Date.parse(String(u || ''));
        return Number.isNaN(ms) ? NaN : ms;
    }
    // Safe AST recursive-descent Formulas 2.0 evaluator (let/lets, current, list methods, regex, dates, style/link).
    function evaluateDbFormula(expr, rowPage, dbPage, depth = 0) {
        if (!expr || !expr.trim() || depth > 5)
            return '';
        const db = ensureDatabaseConfig(dbPage);
        const readPropForRow = (name, targetRow = rowPage, targetDb = dbPage) => {
            const tDb = ensureDatabaseConfig(targetDb);
            const target = tDb.schema.find(s => s.name.toLowerCase() === String(name).toLowerCase());
            if (!target)
                return '';
            if (target.type === 'formula')
                return evaluateDbFormula(target.formulaExpr || '', targetRow, targetDb, depth + 1);
            if (target.type === 'relation') {
                const ids = Array.isArray(targetRow.propertyValues?.[target.id]) ? targetRow.propertyValues[target.id] : [];
                const relDb = target.relationDatabaseId ? getPageById(target.relationDatabaseId) : null;
                return ids.map((rid) => getPageById(rid)).filter(Boolean).map((lr) => ({
                    __dbRow: lr,
                    __dbPage: relDb && isDatabasePage(relDb) ? relDb : targetDb
                }));
            }
            const raw = getRawValue(target, targetRow, targetDb, depth + 1);
            if (target.type === 'select' || target.type === 'status')
                return resolveOption(target, raw)?.name || raw || '';
            if (target.type === 'multi_select') {
                return (Array.isArray(raw) ? raw : []).map((idVal) => resolveOption(target, idVal)?.name || String(idVal));
            }
            if (target.type === 'person') {
                const users = getState()?.users || [];
                return (Array.isArray(raw) ? raw : raw ? [raw] : []).map((uidVal) => users.find((u) => u.id === uidVal)?.name || String(uidVal));
            }
            if (target.type === 'date')
                return typeof raw === 'object' && raw?.start ? raw.start : (raw || '');
            return raw ?? '';
        };
        try {
            const tokens = [];
            let i = 0;
            const src = expr.trim();
            while (i < src.length) {
                const ch = src[i];
                if (/\s/.test(ch)) {
                    i++;
                    continue;
                }
                if (ch === '"' || ch === "'") {
                    const quote = ch;
                    i++;
                    let s = '';
                    while (i < src.length && src[i] !== quote) {
                        if (src[i] === '\\' && i + 1 < src.length) {
                            i++;
                            s += src[i++];
                        }
                        else
                            s += src[i++];
                    }
                    i++;
                    tokens.push({ t: 'str', v: s });
                    continue;
                }
                if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1] || ''))) {
                    let num = '';
                    while (i < src.length && /[0-9.]/.test(src[i]))
                        num += src[i++];
                    tokens.push({ t: 'num', v: parseFloat(num) });
                    continue;
                }
                if (/[a-zA-Z_]/.test(ch)) {
                    let ident = '';
                    while (i < src.length && /[a-zA-Z0-9_]/.test(src[i]))
                        ident += src[i++];
                    if (ident === 'true')
                        tokens.push({ t: 'bool', v: true });
                    else if (ident === 'false')
                        tokens.push({ t: 'bool', v: false });
                    else
                        tokens.push({ t: 'id', v: ident });
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
            const parsePrimary = () => {
                const tk = peek();
                if (!tk)
                    return { kind: 'lit', v: '' };
                if (tk.t === 'num' || tk.t === 'str' || tk.t === 'bool') {
                    consume();
                    return { kind: 'lit', v: tk.v };
                }
                if (tk.t === '[') {
                    consume();
                    const items = [];
                    while (peek() && peek().t !== ']') {
                        items.push(parseOr());
                        if (peek()?.t === ',')
                            consume();
                    }
                    if (peek()?.t === ']')
                        consume();
                    return { kind: 'arr', items };
                }
                if (tk.t === 'id') {
                    consume();
                    if (peek()?.t === '(') {
                        consume();
                        const args = [];
                        while (peek() && peek().t !== ')') {
                            args.push(parseOr());
                            if (peek()?.t === ',')
                                consume();
                        }
                        if (peek()?.t === ')')
                            consume();
                        return { kind: 'call', fn: tk.v, args };
                    }
                    return { kind: 'id', name: tk.v };
                }
                if (tk.t === '(') {
                    consume();
                    const inner = parseOr();
                    if (peek()?.t === ')')
                        consume();
                    return inner;
                }
                return { kind: 'lit', v: '' };
            };
            const parsePostfix = () => {
                let node = parsePrimary();
                while (peek()?.t === '.') {
                    consume();
                    const mTok = peek();
                    if (!mTok || mTok.t !== 'id')
                        break;
                    consume();
                    let args;
                    if (peek()?.t === '(') {
                        consume();
                        args = [];
                        while (peek() && peek().t !== ')') {
                            args.push(parseOr());
                            if (peek()?.t === ',')
                                consume();
                        }
                        if (peek()?.t === ')')
                            consume();
                    }
                    node = { kind: 'member', target: node, name: mTok.v, args };
                }
                return node;
            };
            const parseUnary = () => {
                const tk = peek();
                if (tk?.t === 'op' && (tk.v === '!' || tk.v === '-')) {
                    consume();
                    return { kind: 'un', op: tk.v, expr: parseUnary() };
                }
                return parsePostfix();
            };
            const parseMul = () => {
                let left = parseUnary();
                while (peek()?.t === 'op' && ['*', '/', '%'].includes(peek().v)) {
                    const op = consume().v;
                    left = { kind: 'bin', op, left, right: parseUnary() };
                }
                return left;
            };
            const parseAdd = () => {
                let left = parseMul();
                while (peek()?.t === 'op' && ['+', '-'].includes(peek().v)) {
                    const op = consume().v;
                    left = { kind: 'bin', op, left, right: parseMul() };
                }
                return left;
            };
            const parseCmp = () => {
                let left = parseAdd();
                while (peek()?.t === 'op' && ['==', '!=', '>', '>=', '<', '<='].includes(peek().v)) {
                    const op = consume().v;
                    left = { kind: 'bin', op, left, right: parseAdd() };
                }
                return left;
            };
            const parseAnd = () => {
                let left = parseCmp();
                while (peek()?.t === 'op' && peek().v === '&&') {
                    consume();
                    left = { kind: 'bin', op: '&&', left, right: parseCmp() };
                }
                return left;
            };
            const parseOr = () => {
                let left = parseAnd();
                while (peek()?.t === 'op' && peek().v === '||') {
                    consume();
                    left = { kind: 'bin', op: '||', left, right: parseAnd() };
                }
                return left;
            };
            const ast = parseOr();
            const invokeFn = (lower, evalArgNodes, env, receiver) => {
                const evalA = (idx) => idx < evalArgNodes.length ? evalAst(evalArgNodes[idx], env) : undefined;
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
                if (lower === 'if')
                    return evalA(0) ? evalA(1) : evalA(2);
                if (lower === 'ifs') {
                    for (let k = 0; k < evalArgNodes.length; k += 2) {
                        if (k + 1 >= evalArgNodes.length)
                            return evalAst(evalArgNodes[k], env);
                        if (evalAst(evalArgNodes[k], env))
                            return evalAst(evalArgNodes[k + 1], env);
                    }
                    return '';
                }
                // Member/collection callbacks binding `current`
                if (['map', 'filter', 'find', 'some', 'every'].includes(lower)) {
                    const listSrc = receiver !== undefined ? receiver : evalA(0);
                    const exprNode = receiver !== undefined ? evalArgNodes[0] : evalArgNodes[1];
                    const arr = Array.isArray(listSrc) ? listSrc : (listSrc == null || listSrc === '' ? [] : [listSrc]);
                    if (!exprNode)
                        return lower === 'map' || lower === 'filter' ? arr : undefined;
                    const runCb = (el) => {
                        const childEnv = new Map(env);
                        childEnv.set('current', el);
                        return evalAst(exprNode, childEnv);
                    };
                    if (lower === 'map')
                        return arr.map(runCb);
                    if (lower === 'filter')
                        return arr.filter(el => Boolean(runCb(el)));
                    if (lower === 'find')
                        return arr.find(el => Boolean(runCb(el))) ?? '';
                    if (lower === 'some')
                        return arr.some(el => Boolean(runCb(el)));
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
                if (lower === 'first')
                    return Array.isArray(targetVal) ? (targetVal[0] ?? '') : targetVal;
                if (lower === 'last')
                    return Array.isArray(targetVal) ? (targetVal[targetVal.length - 1] ?? '') : targetVal;
                if (lower === 'flat')
                    return Array.isArray(targetVal) ? targetVal.reduce((acc, x) => acc.concat(Array.isArray(x) ? x : [x]), []) : [targetVal];
                if (lower === 'unique') {
                    const arr = Array.isArray(targetVal) ? targetVal : [targetVal];
                    const seen = new Set();
                    return arr.filter(x => { const k = formulaAsString(x); if (seen.has(k))
                        return false; seen.add(k); return true; });
                }
                if (lower === 'sort') {
                    const arr = Array.isArray(targetVal) ? [...targetVal] : [];
                    return arr.sort((x, y) => formulaAsString(x).localeCompare(formulaAsString(y), undefined, { numeric: true }));
                }
                if (lower === 'reverse')
                    return Array.isArray(targetVal) ? [...targetVal].reverse() : formulaAsString(targetVal).split('').reverse().join('');
                if (lower === 'join')
                    return (Array.isArray(targetVal) ? targetVal : [targetVal]).map(formulaAsString).join(a0 != null ? String(a0) : ', ');
                if (lower === 'includes') {
                    if (Array.isArray(targetVal))
                        return targetVal.some(x => formulaAsString(x) === formulaAsString(a0));
                    return formulaAsString(targetVal).includes(formulaAsString(a0));
                }
                if (lower === 'length')
                    return Array.isArray(targetVal) ? targetVal.length : formulaAsString(targetVal).length;
                if (lower === 'empty') {
                    const u = unwrapFormulaVal(targetVal);
                    return u == null || u === '' || (Array.isArray(u) && u.length === 0);
                }
                if (lower === 'mean') {
                    const arr = Array.isArray(targetVal) ? targetVal : args;
                    const nums = arr.map((x) => Number(unwrapFormulaVal(x))).filter((n) => !Number.isNaN(n));
                    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
                }
                if (lower === 'sum') {
                    const arr = receiver !== undefined && Array.isArray(receiver) ? receiver : (args.length === 1 && Array.isArray(args[0]) ? args[0] : args);
                    return arr.reduce((acc, x) => acc + (Number(unwrapFormulaVal(x)) || 0), 0);
                }
                if (lower === 'min') {
                    const arr = receiver !== undefined && Array.isArray(receiver) ? receiver : (args.length === 1 && Array.isArray(args[0]) ? args[0] : args);
                    const nums = arr.map((x) => Number(unwrapFormulaVal(x))).filter((n) => !Number.isNaN(n));
                    return nums.length ? Math.min(...nums) : 0;
                }
                if (lower === 'max') {
                    const arr = receiver !== undefined && Array.isArray(receiver) ? receiver : (args.length === 1 && Array.isArray(args[0]) ? args[0] : args);
                    const nums = arr.map((x) => Number(unwrapFormulaVal(x))).filter((n) => !Number.isNaN(n));
                    return nums.length ? Math.max(...nums) : 0;
                }
                // Logic helpers
                if (lower === 'and')
                    return args.every(Boolean);
                if (lower === 'or')
                    return args.some(Boolean);
                if (lower === 'not')
                    return !args[0];
                if (lower === 'equal')
                    return formulaAsString(targetVal) === formulaAsString(a0);
                if (lower === 'unequal')
                    return formulaAsString(targetVal) !== formulaAsString(a0);
                // String & regex functions
                if (lower === 'concat')
                    return args.map(formulaAsString).join('');
                if (lower === 'lower')
                    return formulaAsString(targetVal).toLowerCase();
                if (lower === 'upper')
                    return formulaAsString(targetVal).toUpperCase();
                if (lower === 'trim')
                    return formulaAsString(targetVal).trim();
                if (lower === 'contains')
                    return formulaAsString(targetVal).toLowerCase().includes(formulaAsString(a0).toLowerCase());
                if (lower === 'startswith')
                    return formulaAsString(targetVal).startsWith(formulaAsString(a0));
                if (lower === 'endswith')
                    return formulaAsString(targetVal).endsWith(formulaAsString(a0));
                if (lower === 'substring' || lower === 'slice') {
                    if (Array.isArray(targetVal))
                        return targetVal.slice(Number(a0) || 0, a1 != null ? Number(a1) : undefined);
                    return formulaAsString(targetVal).slice(Number(a0) || 0, a1 != null ? Number(a1) : undefined);
                }
                if (lower === 'split')
                    return formulaAsString(targetVal).split(formulaAsString(a0));
                if (lower === 'repeat')
                    return formulaAsString(targetVal).repeat(Math.max(0, Math.min(200, Number(a0) || 0)));
                if (lower === 'padstart')
                    return formulaAsString(targetVal).padStart(Number(a0) || 0, a1 != null ? String(a1) : ' ');
                if (lower === 'padend')
                    return formulaAsString(targetVal).padEnd(Number(a0) || 0, a1 != null ? String(a1) : ' ');
                if (lower === 'test') {
                    try {
                        return new RegExp(formulaAsString(a0)).test(formulaAsString(targetVal));
                    }
                    catch {
                        return false;
                    }
                }
                if (lower === 'match') {
                    try {
                        return formulaAsString(targetVal).match(new RegExp(formulaAsString(a0), 'g')) || [];
                    }
                    catch {
                        return [];
                    }
                }
                if (lower === 'replace') {
                    try {
                        return formulaAsString(targetVal).replace(new RegExp(formulaAsString(a0)), formulaAsString(a1));
                    }
                    catch {
                        return formulaAsString(targetVal);
                    }
                }
                if (lower === 'replaceall') {
                    try {
                        return formulaAsString(targetVal).replace(new RegExp(formulaAsString(a0), 'g'), formulaAsString(a1));
                    }
                    catch {
                        return formulaAsString(targetVal);
                    }
                }
                // Math & numbers
                if (lower === 'tonumber')
                    return Number(unwrapFormulaVal(targetVal)) || 0;
                if (lower === 'format')
                    return formulaAsString(targetVal);
                if (lower === 'round')
                    return Math.round(Number(unwrapFormulaVal(targetVal)) || 0);
                if (lower === 'floor')
                    return Math.floor(Number(unwrapFormulaVal(targetVal)) || 0);
                if (lower === 'ceil')
                    return Math.ceil(Number(unwrapFormulaVal(targetVal)) || 0);
                if (lower === 'abs')
                    return Math.abs(Number(unwrapFormulaVal(targetVal)) || 0);
                if (lower === 'sqrt')
                    return Math.sqrt(Math.max(0, Number(unwrapFormulaVal(targetVal)) || 0));
                if (lower === 'cbrt')
                    return Math.cbrt(Number(unwrapFormulaVal(targetVal)) || 0);
                if (lower === 'exp')
                    return Math.exp(Number(unwrapFormulaVal(targetVal)) || 0);
                if (lower === 'log10')
                    return Math.log10(Math.max(1e-9, Number(unwrapFormulaVal(targetVal)) || 1));
                if (lower === 'log2')
                    return Math.log2(Math.max(1e-9, Number(unwrapFormulaVal(targetVal)) || 1));
                if (lower === 'sign')
                    return Math.sign(Number(unwrapFormulaVal(targetVal)) || 0);
                if (lower === 'pow')
                    return Math.pow(Number(unwrapFormulaVal(targetVal)) || 0, Number(a0) || 0);
                if (lower === 'mod')
                    return (Number(unwrapFormulaVal(targetVal)) || 0) % (Number(a0) || 1);
                // Date & time
                if (lower === 'now' || lower === 'today')
                    return new Date().toISOString().slice(0, 10);
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
                    if (Number.isNaN(base.getTime()))
                        return '';
                    const delta = (lower === 'datesubtract' ? -1 : 1) * (Number(a0) || 0);
                    const u = String(a1 || 'days').toLowerCase();
                    if (u.startsWith('year'))
                        base.setFullYear(base.getFullYear() + delta);
                    else if (u.startsWith('month'))
                        base.setMonth(base.getMonth() + delta);
                    else if (u.startsWith('week'))
                        base.setDate(base.getDate() + delta * 7);
                    else if (u.startsWith('hour'))
                        base.setHours(base.getHours() + delta);
                    else if (u.startsWith('minute'))
                        base.setMinutes(base.getMinutes() + delta);
                    else
                        base.setDate(base.getDate() + delta);
                    return base.toISOString().slice(0, 10);
                }
                if (lower === 'datebetween') {
                    const d1 = formulaDateMs(targetVal), d2 = formulaDateMs(a0);
                    if (Number.isNaN(d1) || Number.isNaN(d2))
                        return 0;
                    const unit = String(a1 || 'days').toLowerCase();
                    const diffMs = d1 - d2;
                    if (unit.startsWith('hour'))
                        return Math.round(diffMs / 3600000);
                    if (unit.startsWith('week'))
                        return Math.round(diffMs / (7 * 86400000));
                    if (unit.startsWith('month'))
                        return Math.round(diffMs / (30.4375 * 86400000));
                    if (unit.startsWith('year'))
                        return Math.round(diffMs / (365.25 * 86400000));
                    return Math.round(diffMs / 86400000);
                }
                if (lower === 'formatdate') {
                    const d = new Date(formulaDateMs(targetVal));
                    if (Number.isNaN(d.getTime()))
                        return '';
                    const fmt = String(a0 || 'YYYY-MM-DD');
                    const pad2 = (n) => String(n).padStart(2, '0');
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
                    if (Number.isNaN(d.getTime()))
                        return 0;
                    if (lower === 'year')
                        return d.getFullYear();
                    if (lower === 'month')
                        return d.getMonth() + 1;
                    if (lower === 'date')
                        return d.getDate();
                    if (lower === 'day')
                        return d.getDay();
                    if (lower === 'hour')
                        return d.getHours();
                    return d.getMinutes();
                }
                // Rich output formatting: style() and link()
                if (lower === 'style') {
                    const base = targetVal && targetVal.__richFormula ? { ...targetVal } : { __richFormula: true, text: formulaAsString(targetVal), styles: [] };
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
            const evalAst = (node, env) => {
                if (node.kind === 'lit')
                    return node.v;
                if (node.kind === 'arr')
                    return node.items.map(it => evalAst(it, env));
                if (node.kind === 'id') {
                    if (env.has(node.name))
                        return env.get(node.name);
                    return readPropForRow(node.name);
                }
                if (node.kind === 'call')
                    return invokeFn(node.fn.toLowerCase(), node.args, env);
                if (node.kind === 'member') {
                    const target = evalAst(node.target, env);
                    if (node.args !== undefined)
                        return invokeFn(node.name.toLowerCase(), node.args, env, target);
                    if (node.name === 'length')
                        return Array.isArray(target) ? target.length : formulaAsString(target).length;
                    return '';
                }
                if (node.kind === 'un') {
                    const val = evalAst(node.expr, env);
                    return node.op === '!' ? !val : -(Number(unwrapFormulaVal(val)) || 0);
                }
                if (node.kind === 'bin') {
                    if (node.op === '&&')
                        return evalAst(node.left, env) && evalAst(node.right, env);
                    if (node.op === '||')
                        return evalAst(node.left, env) || evalAst(node.right, env);
                    const l = unwrapFormulaVal(evalAst(node.left, env));
                    const r = unwrapFormulaVal(evalAst(node.right, env));
                    if (node.op === '+') {
                        if (typeof l === 'string' || typeof r === 'string')
                            return String(l ?? '') + String(r ?? '');
                        return (Number(l) || 0) + (Number(r) || 0);
                    }
                    if (node.op === '-')
                        return (Number(l) || 0) - (Number(r) || 0);
                    if (node.op === '*')
                        return (Number(l) || 0) * (Number(r) || 0);
                    if (node.op === '/')
                        return (Number(r) || 0) === 0 ? 0 : (Number(l) || 0) / (Number(r) || 0);
                    if (node.op === '%')
                        return (Number(l) || 0) % (Number(r) || 1);
                    if (node.op === '==')
                        return formulaAsString(l) === formulaAsString(r);
                    if (node.op === '!=')
                        return formulaAsString(l) !== formulaAsString(r);
                    if (node.op === '>')
                        return Number(l) > Number(r);
                    if (node.op === '>=')
                        return Number(l) >= Number(r);
                    if (node.op === '<')
                        return Number(l) < Number(r);
                    if (node.op === '<=')
                        return Number(l) <= Number(r);
                }
                return '';
            };
            const res = evalAst(ast, new Map());
            if (Array.isArray(res))
                return res.map(formulaAsString).join(', ');
            if (res && typeof res === 'object' && res.__dbRow)
                return res.__dbRow.title || 'Untitled';
            return res;
        }
        catch {
            return '';
        }
    }
    function getRawValue(prop, rowPage, dbPage, depth = 0) {
        if (!prop || !rowPage || depth > 5)
            return '';
        if (prop.type === 'title')
            return rowPage.title || '';
        if (prop.type === 'created_time')
            return rowPage.createdAt ? new Date(rowPage.createdAt).toLocaleString() : '';
        if (prop.type === 'last_edited_time')
            return rowPage.updatedAt ? new Date(rowPage.updatedAt).toLocaleString() : '';
        if (prop.type === 'created_by')
            return rowPage.createdBy || actorName();
        if (prop.type === 'last_edited_by')
            return rowPage.lastEditedBy || actorName();
        if (prop.type === 'unique_id')
            return rowPage.propertyValues?.[prop.id] || '';
        if (prop.type === 'formula')
            return evaluateDbFormula(prop.formulaExpr || '', rowPage, dbPage, depth + 1);
        if (prop.type === 'rollup') {
            const db = ensureDatabaseConfig(dbPage);
            const relProp = db.schema.find(s => s.id === prop.rollupRelationId && s.type === 'relation');
            if (!relProp || !relProp.relationDatabaseId)
                return '';
            const linkedIds = Array.isArray(rowPage.propertyValues?.[relProp.id]) ? rowPage.propertyValues[relProp.id] : [];
            const targetDb = getPageById(relProp.relationDatabaseId);
            if (!targetDb || !isDatabasePage(targetDb))
                return '';
            const targetSchema = ensureDatabaseConfig(targetDb).schema;
            const targetProp = targetSchema.find(s => s.id === prop.rollupTargetPropertyId) || targetSchema[0];
            const linkedRows = linkedIds.map((rid) => getPageById(rid)).filter(Boolean);
            const calc = prop.rollupCalc || 'count_all';
            if (calc === 'count_all')
                return linkedRows.length;
            const vals = linkedRows.map((lr) => targetProp ? getRawValue(targetProp, lr, targetDb, depth + 1) : '');
            const isEmptyV = (v) => v === '' || v == null || (Array.isArray(v) && v.length === 0) || (typeof v === 'object' && 'start' in v && !v.start);
            const nonEmpty = vals.filter((v) => !isEmptyV(v));
            const emptyCount = linkedRows.length - nonEmpty.length;
            if (calc === 'count_values' || calc === 'count_not_empty')
                return nonEmpty.length;
            if (calc === 'count_empty')
                return emptyCount;
            if (calc === 'percent_empty')
                return linkedRows.length ? `${Math.round((emptyCount / linkedRows.length) * 100)}%` : '0%';
            if (calc === 'percent_not_empty')
                return linkedRows.length ? `${Math.round((nonEmpty.length / linkedRows.length) * 100)}%` : '0%';
            if (calc === 'count_unique') {
                const u = new Set(nonEmpty.map((v) => formulaAsString(v)));
                return u.size;
            }
            if (calc === 'checked' || calc === 'unchecked' || calc === 'percent_checked' || calc === 'percent_unchecked') {
                const chk = vals.filter(Boolean).length;
                const unchk = linkedRows.length - chk;
                if (calc === 'checked')
                    return chk;
                if (calc === 'unchecked')
                    return unchk;
                if (calc === 'percent_checked')
                    return linkedRows.length ? `${Math.round((chk / linkedRows.length) * 100)}%` : '0%';
                return linkedRows.length ? `${Math.round((unchk / linkedRows.length) * 100)}%` : '0%';
            }
            if (calc === 'sum' || calc === 'average' || calc === 'median' || calc === 'min' || calc === 'max' || calc === 'range') {
                const nums = nonEmpty.map((v) => Number(unwrapFormulaVal(v))).filter((n) => !Number.isNaN(n)).sort((a, b) => a - b);
                if (!nums.length)
                    return 0;
                if (calc === 'sum')
                    return nums.reduce((a, b) => a + b, 0);
                if (calc === 'average')
                    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
                if (calc === 'median') {
                    const mid = Math.floor(nums.length / 2);
                    return nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
                }
                if (calc === 'min')
                    return nums[0];
                if (calc === 'max')
                    return nums[nums.length - 1];
                return nums[nums.length - 1] - nums[0];
            }
            if (calc === 'earliest_date' || calc === 'latest_date' || calc === 'date_range_days') {
                const dates = nonEmpty.map((v) => (typeof v === 'object' && v.start ? v.start : String(v))).filter((s) => !Number.isNaN(Date.parse(s))).sort();
                if (!dates.length)
                    return calc === 'date_range_days' ? 0 : '';
                if (calc === 'earliest_date')
                    return dates[0];
                if (calc === 'latest_date')
                    return dates[dates.length - 1];
                return Math.round((Date.parse(dates[dates.length - 1]) - Date.parse(dates[0])) / 86400000);
            }
            return linkedRows.map((lr) => (targetProp ? valueAsSearchText(targetProp, lr, targetDb) : String(lr.title || ''))).filter(Boolean).join(', ');
        }
        return rowPage.propertyValues?.[prop.id];
    }
    function valueAsSearchText(prop, rowPage, dbPage) {
        const raw = getRawValue(prop, rowPage, dbPage);
        if (raw == null || raw === '')
            return '';
        if (prop.type === 'formula' && typeof raw === 'object' && raw.__richFormula)
            return String(raw.text || '');
        if (prop.type === 'checkbox')
            return raw ? 'Checked' : 'Unchecked';
        if (prop.type === 'select' || prop.type === 'status')
            return resolveOption(prop, raw)?.name || String(raw);
        if (prop.type === 'multi_select') {
            return (Array.isArray(raw) ? raw : []).map(v => resolveOption(prop, v)?.name || String(v)).join(', ');
        }
        if (prop.type === 'person') {
            const users = getState()?.users || [];
            return (Array.isArray(raw) ? raw : [raw]).map(uid => users.find((u) => u.id === uid)?.name || uid).join(', ');
        }
        if (prop.type === 'date')
            return dateTextOf(raw);
        if (prop.type === 'files')
            return (Array.isArray(raw) ? raw : []).map((f) => f.name || '').join(', ');
        if (prop.type === 'relation')
            return (Array.isArray(raw) ? raw : []).map(rid => getPageById(rid)?.title || 'Untitled').join(', ');
        if (prop.type === 'number')
            return String(raw);
        return String(raw);
    }
    function isValueEmpty(prop, rowPage, dbPage) {
        const raw = getRawValue(prop, rowPage, dbPage);
        if (raw == null || raw === '')
            return true;
        if (prop.type === 'formula' && typeof raw === 'object' && raw.__richFormula)
            return !String(raw.text || '').trim();
        if (prop.type === 'date')
            return !dateTextOf(raw);
        if (Array.isArray(raw))
            return raw.length === 0;
        return false;
    }
    function isFilterGroup(node) {
        return !!node && Array.isArray(node.rules);
    }
    function countFilterRules(view) {
        const walk = (grp) => grp ? grp.rules.reduce((n, r) => n + (isFilterGroup(r) ? walk(r) : 1), 0) : 0;
        return (view.filters?.length || 0) + walk(view.filterGroup);
    }
    function matchesSingleFilter(rule, rowPage, dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        const prop = db.schema.find(s => s.id === rule.propertyId);
        if (!prop)
            return true;
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
                if (prop.type === 'number')
                    return numVal === Number(rule.value);
                return text === q;
            case 'not_equals':
                if (prop.type === 'number')
                    return numVal !== Number(rule.value);
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
                if (!rowDateIso)
                    return false;
                const wkAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
                return rowDateIso >= wkAgo && rowDateIso <= todayIso;
            }
            case 'next_week': {
                if (!rowDateIso)
                    return false;
                const wkAhead = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
                return rowDateIso >= todayIso && rowDateIso <= wkAhead;
            }
            default: return true;
        }
    }
    function matchesFilterGroup(group, rowPage, dbPage) {
        if (!group.rules.length)
            return true;
        const evalNode = (node) => isFilterGroup(node) ? matchesFilterGroup(node, rowPage, dbPage) : matchesSingleFilter(node, rowPage, dbPage);
        return group.match === 'or' ? group.rules.some(evalNode) : group.rules.every(evalNode);
    }
    function evaluateConditionalColor(view, rowPage, dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        let rowColor;
        const propColors = new Map();
        const rules = Array.isArray(view.conditionalColors) ? view.conditionalColors : [];
        for (const rule of rules) {
            if (!rule || rule.enabled === false)
                continue;
            const synth = { id: rule.id, propertyId: rule.propertyId, op: rule.op, value: rule.value };
            if (!matchesSingleFilter(synth, rowPage, dbPage))
                continue;
            let colorKey = String(rule.color || 'blue');
            if (rule.colorMode === 'match_property_value') {
                const prop = db.schema.find(s => s.id === rule.propertyId);
                if (prop && prop.options?.length) {
                    const raw = getRawValue(prop, rowPage, dbPage);
                    const candidate = Array.isArray(raw) ? raw[0] : raw;
                    const opt = resolveOption(prop, candidate);
                    if (opt?.color)
                        colorKey = opt.color;
                }
            }
            if (rule.applyTo === 'property') {
                if (!propColors.has(rule.propertyId))
                    propColors.set(rule.propertyId, colorKey);
            }
            else if (!rowColor) {
                rowColor = colorKey;
            }
        }
        return { rowColor, propColors };
    }
    function applyConditionalRowColor(el, colorKey) {
        if (colorKey && colorKey !== 'default') {
            el.dataset.rowColor = colorKey;
        }
        else {
            delete el.dataset.rowColor;
        }
    }
    function copyViewLink(dbPage, view) {
        const hash = `#page=${encodeURIComponent(dbPage.id)}&view=${encodeURIComponent(view.id)}`;
        const fullUrl = typeof location !== 'undefined' ? `${location.origin}${location.pathname}${hash}` : hash;
        try {
            navigator.clipboard?.writeText(fullUrl).catch(() => { });
        }
        catch { }
        host?.toast?.('Copied link to view');
    }
    function queryViewRows(dbPage, view, searchQuery = '') {
        let rows = getDatabaseRows(dbPage.id);
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            const db = ensureDatabaseConfig(dbPage);
            rows = rows.filter((r) => (r.title || '').toLowerCase().includes(q) ||
                db.schema.some(prop => valueAsSearchText(prop, r, dbPage).toLowerCase().includes(q)));
        }
        if (view.filters?.length) {
            const useOr = view.filterMatch === 'or';
            rows = rows.filter((r) => useOr
                ? view.filters.some(rule => matchesSingleFilter(rule, r, dbPage))
                : view.filters.every(rule => matchesSingleFilter(rule, r, dbPage)));
        }
        if (view.filterGroup?.rules?.length) {
            rows = rows.filter((r) => matchesFilterGroup(view.filterGroup, r, dbPage));
        }
        if (view.sorts?.length) {
            const db = ensureDatabaseConfig(dbPage);
            rows = [...rows].sort((a, b) => {
                for (const s of view.sorts) {
                    const prop = db.schema.find(p => p.id === s.propertyId);
                    if (!prop)
                        continue;
                    const dir = s.direction === 'desc' ? -1 : 1;
                    const av = getRawValue(prop, a, dbPage);
                    const bv = getRawValue(prop, b, dbPage);
                    if (prop.type === 'number') {
                        const na = av === '' || av == null ? Number.NEGATIVE_INFINITY : Number(av);
                        const nb = bv === '' || bv == null ? Number.NEGATIVE_INFINITY : Number(bv);
                        if (na !== nb)
                            return (na - nb) * dir;
                    }
                    else if (prop.type === 'checkbox') {
                        const ca = av ? 1 : 0, cb = bv ? 1 : 0;
                        if (ca !== cb)
                            return (ca - cb) * dir;
                    }
                    else if (prop.type === 'date') {
                        const da = dateTextOf(av), dbStr = dateTextOf(bv);
                        if (da !== dbStr)
                            return da.localeCompare(dbStr) * dir;
                    }
                    else {
                        const ta = valueAsSearchText(prop, a, dbPage);
                        const tb = valueAsSearchText(prop, b, dbPage);
                        const cmp = ta.localeCompare(tb, undefined, { numeric: true, sensitivity: 'base' });
                        if (cmp !== 0)
                            return cmp * dir;
                    }
                }
                return (a.createdAt || 0) - (b.createdAt || 0);
            });
        }
        return rows;
    }
    function computeAggregation(prop, rows, calc, dbPage) {
        if (!calc || calc === 'none')
            return '';
        if (calc === 'count_all')
            return `${rows.length}`;
        const empties = rows.filter(r => isValueEmpty(prop, r, dbPage)).length;
        const nonEmpties = rows.length - empties;
        if (calc === 'count_values' || calc === 'count_not_empty')
            return `${nonEmpties}`;
        if (calc === 'count_empty')
            return `${empties}`;
        if (calc === 'percent_empty')
            return rows.length ? `${Math.round((empties / rows.length) * 100)}%` : '0%';
        if (calc === 'percent_not_empty')
            return rows.length ? `${Math.round((nonEmpties / rows.length) * 100)}%` : '0%';
        const nums = rows
            .map(r => getRawValue(prop, r, dbPage))
            .filter(v => v !== '' && v != null && !Number.isNaN(Number(v)))
            .map(Number)
            .sort((a, b) => a - b);
        if (!nums.length)
            return '0';
        if (calc === 'sum')
            return formatNumberVal(nums.reduce((a, b) => a + b, 0), prop.numberFormat);
        if (calc === 'average')
            return formatNumberVal(nums.reduce((a, b) => a + b, 0) / nums.length, prop.numberFormat);
        if (calc === 'median') {
            const mid = Math.floor(nums.length / 2);
            const med = nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
            return formatNumberVal(med, prop.numberFormat);
        }
        if (calc === 'min')
            return formatNumberVal(nums[0], prop.numberFormat);
        if (calc === 'max')
            return formatNumberVal(nums[nums.length - 1], prop.numberFormat);
        if (calc === 'range')
            return formatNumberVal(nums[nums.length - 1] - nums[0], prop.numberFormat);
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
    function openDbPopover(anchor, buildFn, minWidth = 240) {
        closeDbPopover();
        const openedAt = Date.now();
        if (anchor instanceof HTMLElement)
            anchor.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
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
        let liveAnchor = anchor;
        const anchorHostWrap = anchor instanceof HTMLElement ? anchor.closest('.db-view-wrap') : null;
        const anchorHostKey = anchorHostWrap?.dataset?.dbHostKey || '';
        const anchorMatchSel = anchor instanceof HTMLElement
            ? (anchor.dataset.dbTool
                ? `[data-db-tool="${CSS.escape(anchor.dataset.dbTool)}"]`
                : anchor.dataset.dbAction
                    ? `[data-db-action="${CSS.escape(anchor.dataset.dbAction)}"]`
                    : anchor.classList.contains('db-tab')
                        ? '.db-tab.active'
                        : anchor.classList.contains('db-th-add-btn')
                            ? '.db-th-add-btn'
                            : '')
            : '';
        let lastRect = anchor instanceof HTMLElement
            ? anchor.getBoundingClientRect()
            : { left: anchor.left, top: anchor.top, bottom: anchor.bottom, right: anchor.right, width: Math.max(1, anchor.right - anchor.left), height: Math.max(1, anchor.bottom - anchor.top) };
        let rafId = 0;
        let lockedSide = null;
        const positionPopover = (closeIfOffscreen = false) => {
            if (!pop.isConnected)
                return;
            if (liveAnchor instanceof HTMLElement && !liveAnchor.isConnected && anchorHostKey && anchorMatchSel) {
                const hostWrap = document.querySelector(`.db-view-wrap[data-db-host-key="${CSS.escape(anchorHostKey)}"]`);
                const rebound = hostWrap?.querySelector(anchorMatchSel);
                if (rebound?.isConnected)
                    liveAnchor = rebound;
            }
            if (liveAnchor instanceof HTMLElement && !liveAnchor.isConnected && anchorHostKey) {
                const hostWrap = document.querySelector(`.db-view-wrap[data-db-host-key="${CSS.escape(anchorHostKey)}"]`);
                if (!hostWrap?.isConnected) {
                    closeDbPopover();
                    return;
                }
            }
            const hasLiveEl = liveAnchor instanceof HTMLElement && liveAnchor.isConnected;
            const rect = hasLiveEl ? liveAnchor.getBoundingClientRect() : lastRect;
            if (hasLiveEl)
                lastRect = rect;
            if (closeIfOffscreen && hasLiveEl && (rect.bottom < -12 || rect.top > window.innerHeight + 12 || (rect.width === 0 && rect.height === 0))) {
                closeDbPopover();
                return;
            }
            const margin = 10;
            const maxCap = Math.min(680, window.innerHeight - margin * 2);
            pop.style.maxHeight = `${maxCap}px`;
            const box = pop.getBoundingClientRect();
            const left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, rect.left));
            const spaceBelow = window.innerHeight - rect.bottom - margin;
            const spaceAbove = rect.top - margin;
            if (!lockedSide) {
                lockedSide = (spaceBelow < Math.min(340, box.height) && spaceAbove > spaceBelow) ? 'above' : 'below';
            }
            else if (lockedSide === 'above' && spaceAbove < 150 && spaceBelow >= 300) {
                lockedSide = 'below';
            }
            else if (lockedSide === 'below' && spaceBelow < 150 && spaceAbove >= 300) {
                lockedSide = 'above';
            }
            const placeAbove = lockedSide === 'above';
            if (placeAbove) {
                const avail = Math.max(220, spaceAbove - 4);
                pop.style.maxHeight = `${Math.min(maxCap, avail)}px`;
                const finalH = pop.getBoundingClientRect().height;
                const top = Math.max(margin, rect.top - finalH - 4);
                pop.style.top = `${Math.round(top)}px`;
            }
            else {
                const top = Math.max(margin, Math.min(window.innerHeight - 180, rect.bottom + 4));
                const avail = Math.max(220, window.innerHeight - top - margin);
                pop.style.maxHeight = `${Math.min(maxCap, avail)}px`;
                pop.style.top = `${Math.round(top)}px`;
            }
            pop.style.left = `${Math.round(left)}px`;
        };
        positionPopover(false);
        const scheduleReposition = (closeIfOffscreen = false) => {
            if (rafId)
                cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                rafId = 0;
                positionPopover(closeIfOffscreen);
            });
        };
        const onScrollOrResize = () => scheduleReposition(Date.now() - openedAt > 180);
        const onPopResize = () => scheduleReposition(false);
        const onDown = (e) => {
            if (e.target instanceof Node && (pop.contains(e.target) || (liveAnchor instanceof HTMLElement && liveAnchor.contains(e.target))))
                return;
            closeDbPopover();
        };
        const roObs = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onPopResize) : null;
        roObs?.observe(pop);
        document.addEventListener('scroll', onScrollOrResize, true);
        window.addEventListener('resize', onPopResize);
        setTimeout(() => document.addEventListener('pointerdown', onDown, true), 0);
        activePopoverCleanup = () => {
            if (rafId)
                cancelAnimationFrame(rafId);
            roObs?.disconnect();
            document.removeEventListener('scroll', onScrollOrResize, true);
            window.removeEventListener('resize', onPopResize);
            document.removeEventListener('pointerdown', onDown, true);
        };
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
        if (activePeek)
            renderPeekModal();
        host?.onDatabaseChanged?.();
    }
    function setRowValue(rowPage, prop, value, dbPage, rerenderAll = true, automationDepth = 0) {
        if (roMode(dbPage))
            return;
        rowPage.propertyValues = rowPage.propertyValues || {};
        if (prop.type === 'title') {
            rowPage.title = String(value ?? '');
        }
        else {
            rowPage.propertyValues[prop.id] = value;
        }
        rowPage.updatedAt = Date.now();
        rowPage.lastEditedBy = actorName();
        dbPage.updatedAt = Date.now();
        persist(false);
        triggerDatabaseAutomations('property_edited', rowPage, dbPage, prop.id, automationDepth);
        if (rerenderAll)
            refreshAllDatabaseViews();
    }
    function createPillEl(label, colorKey, isStatus = false, statusGroup) {
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
    function buildDbUserChip(uidOrName, users) {
        const u = users.find((x) => x.id === uidOrName || x.name === uidOrName) || { id: '', name: uidOrName };
        const chip = document.createElement('span');
        chip.className = 'db-person-chip';
        const ref = u.id || u.name;
        chip.dataset.userRef = ref;
        chip.title = `${u.name} — Click to view dashboard · Right-click for options`;
        const av = document.createElement('span');
        av.className = 'db-person-avatar';
        av.textContent = String(u.name || '?').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
        const nm = document.createElement('span');
        nm.textContent = u.name;
        chip.append(av, nm);
        chip.onclick = e => {
            e.stopPropagation();
            host?.openUserDashboard?.(ref);
        };
        chip.oncontextmenu = e => {
            if (host?.openUserContextMenu) {
                e.preventDefault();
                e.stopPropagation();
                host.openUserContextMenu(e, ref);
            }
        };
        return chip;
    }
    function toSafeDbHref(propType, val) {
        const s = String(val ?? '').trim();
        if (!s || /^\s*(javascript|vbscript|data):/i.test(s))
            return null;
        if (s.startsWith('#page='))
            return s;
        if (propType === 'email') {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? `mailto:${s}` : null;
        }
        if (propType === 'phone_number') {
            const cleaned = s.replace(/[^\d+]/g, '');
            return /^[+\d()\s.-]{5,}$/.test(s) && cleaned.length >= 5 ? `tel:${cleaned}` : null;
        }
        if (/^(https?:|mailto:|tel:)/i.test(s))
            return s;
        if (propType === 'url' && /^([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i.test(s))
            return `https://${s}`;
        return null;
    }
    function wireDbAnchorClick(a, href) {
        a.href = href;
        if (href.startsWith('#page=')) {
            a.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                const targetId = href.slice(6).split('&')[0];
                if (targetId) {
                    if (e.ctrlKey || e.metaKey)
                        host?.openPageInNewTab?.(targetId);
                    else
                        host?.navigateToPage?.(targetId);
                }
            };
        }
        else {
            if (/^https?:/i.test(href)) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            a.onclick = e => e.stopPropagation();
        }
    }
    function appendTextWithDbLinks(parent, text) {
        const tokenRe = /(https?:\/\/[^\s<>()]+|#page=[^\s<>()]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        let last = 0;
        let hasLink = false;
        let m;
        while ((m = tokenRe.exec(text)) !== null) {
            hasLink = true;
            if (m.index > last)
                parent.append(document.createTextNode(text.slice(last, m.index)));
            const rawTok = m[0];
            const href = rawTok.includes('@') && !rawTok.startsWith('http') && !rawTok.startsWith('#') ? `mailto:${rawTok}` : rawTok;
            const a = document.createElement('a');
            a.className = 'db-cell-link';
            a.textContent = rawTok;
            wireDbAnchorClick(a, href);
            parent.append(a);
            last = m.index + rawTok.length;
        }
        if (!hasLink)
            return false;
        if (last < text.length)
            parent.append(document.createTextNode(text.slice(last)));
        return true;
    }
    // Shared cell & property-sheet renderer used identically in Table cells, Peek properties, and Full Row Page properties!
    function renderPropertyValueControl(prop, rowPage, dbPage, opts = {}) {
        const ro = roMode(dbPage);
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
                    if (e.ctrlKey || e.metaKey) {
                        host?.openPageInNewTab?.(rowPage.id);
                        return;
                    }
                    opts.onOpenRow?.();
                };
                openBtn.onauxclick = e => {
                    if (e.button === 1) {
                        e.preventDefault();
                        e.stopPropagation();
                        host?.openPageInNewTab?.(rowPage.id);
                    }
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
                    : [{ id: uid(), kind: 'send_notification', message: `Clicked "${prop.buttonLabel || prop.name}" on {{Name}}` }];
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
            if ((prop.type === 'created_by' || prop.type === 'last_edited_by') && raw) {
                const users = getState()?.users || [];
                wrap.append(buildDbUserChip(String(raw), users));
                return wrap;
            }
            if (prop.type === 'formula' && raw && typeof raw === 'object' && raw.__richFormula) {
                const node = raw.href ? document.createElement('a') : document.createElement('span');
                node.className = 'db-readonly-val is-formula db-formula-styled';
                if (raw.href && node instanceof HTMLAnchorElement) {
                    wireDbAnchorClick(node, String(raw.href));
                }
                node.textContent = String(raw.text ?? '');
                const styles = Array.isArray(raw.styles) ? raw.styles : [];
                styles.forEach(st => {
                    const k = st.toLowerCase();
                    if (k === 'b' || k === 'bold')
                        node.style.fontWeight = '700';
                    else if (k === 'i' || k === 'italic')
                        node.style.fontStyle = 'italic';
                    else if (k === 'u' || k === 'underline')
                        node.style.textDecoration = 'underline';
                    else if (k === 's' || k === 'strikethrough')
                        node.style.textDecoration = 'line-through';
                    else if (k === 'c' || k === 'code')
                        node.classList.add('is-code-pill');
                    else if (k.endsWith('_background')) {
                        const cm = colorMeta(k.replace('_background', ''));
                        node.style.backgroundColor = cm.bg;
                        node.style.padding = '1px 6px';
                        node.style.borderRadius = '4px';
                    }
                    else if (DB_COLORS.some(c => c.key === k)) {
                        node.style.color = colorMeta(k).fg;
                    }
                });
                wrap.append(node);
                return wrap;
            }
            const span = document.createElement('span');
            span.className = 'db-readonly-val' + (prop.type === 'formula' ? ' is-formula' : '');
            let disp = raw;
            if (prop.type === 'formula' && typeof raw === 'number')
                disp = formatNumberVal(raw, prop.numberFormat);
            else if (prop.type === 'formula' && typeof raw === 'boolean')
                disp = raw ? '☑ True' : '☐ False';
            const dispStr = String(disp ?? '');
            if (dispStr && !appendTextWithDbLinks(span, dispStr))
                span.textContent = dispStr;
            else if (!dispStr) {
                span.textContent = opts.compact ? '' : 'Empty';
                span.classList.add('is-empty');
            }
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
            }
            else {
                const list = document.createElement('div');
                list.className = 'db-pill-list';
                selectedIds.forEach((sid) => {
                    const opt = resolveOption(prop, sid);
                    if (opt)
                        list.append(createPillEl(opt.name, opt.color, prop.type === 'status', opt.statusGroup));
                    else
                        list.append(createPillEl(String(sid), 'default', prop.type === 'status'));
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
            const ids = Array.isArray(raw) ? raw : (raw ? [String(raw)] : []);
            const users = getState()?.users || [];
            if (!ids.length) {
                const ph = document.createElement('span');
                ph.className = 'db-placeholder';
                ph.textContent = opts.compact ? '' : 'Empty';
                btn.append(ph);
            }
            else {
                const list = document.createElement('div');
                list.className = 'db-pill-list';
                ids.forEach(uidVal => list.append(buildDbUserChip(uidVal, users)));
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
            if (!txt)
                btn.classList.add('is-empty');
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
            const files = Array.isArray(raw) ? raw : [];
            if (!files.length) {
                const addBtn = document.createElement('button');
                addBtn.type = 'button';
                addBtn.className = 'db-placeholder-btn';
                addBtn.textContent = opts.compact ? '+ Add' : '+ Attach file or media';
                addBtn.disabled = ro;
                addBtn.onclick = e => { e.stopPropagation(); openFilesPicker(btn, prop, rowPage, dbPage, commit); };
                btn.append(addBtn);
            }
            else {
                files.forEach((f, idx) => {
                    const chip = document.createElement('button');
                    chip.type = 'button';
                    chip.className = 'db-file-chip';
                    chip.textContent = `📎 ${f.name || 'File'}`;
                    chip.onclick = e => {
                        e.stopPropagation();
                        if (f.assetId && host?.openAssetLibrary)
                            host.openAssetLibrary(f.assetId);
                        else if (!ro)
                            openFilesPicker(btn, prop, rowPage, dbPage, commit);
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
            const linkedIds = Array.isArray(raw) ? raw : [];
            if (!prop.relationDatabaseId) {
                const ph = document.createElement('span');
                ph.className = 'db-placeholder';
                ph.textContent = 'Select database…';
                btn.append(ph);
            }
            else if (!linkedIds.length) {
                const ph = document.createElement('span');
                ph.className = 'db-placeholder';
                ph.textContent = opts.compact ? '' : 'Empty';
                btn.append(ph);
            }
            else {
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
        const startInlineInput = (autoFocus = false) => {
            wrap.replaceChildren();
            const input = document.createElement('input');
            input.className = 'db-inline-input' + (prop.type === 'number' ? ' is-number' : '');
            input.type = prop.type === 'number' ? 'text' : prop.type === 'email' ? 'email' : prop.type === 'url' ? 'url' : 'text';
            input.disabled = ro;
            const syncDisplay = () => {
                if (prop.type === 'number' && document.activeElement !== input) {
                    input.value = formatNumberVal(getRawValue(prop, rowPage, dbPage), prop.numberFormat);
                }
                else {
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
                }
                else {
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
            if (autoFocus)
                requestAnimationFrame(() => input.focus());
        };
        const rawStr = String(raw ?? '').trim();
        const directHref = (prop.type === 'url' || prop.type === 'email' || prop.type === 'phone_number')
            ? toSafeDbHref(prop.type, rawStr)
            : null;
        const hasRichTextLinks = prop.type === 'text' && /(https?:\/\/[^\s<>()]+|#page=[^\s<>()]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(rawStr);
        if (directHref || hasRichTextLinks) {
            const linkWrap = document.createElement('div');
            linkWrap.className = 'db-cell-link-wrap';
            if (directHref) {
                const a = document.createElement('a');
                a.className = 'db-cell-link';
                a.textContent = rawStr;
                a.title = directHref;
                wireDbAnchorClick(a, directHref);
                linkWrap.append(a);
            }
            else {
                const span = document.createElement('span');
                span.className = 'db-readonly-val';
                appendTextWithDbLinks(span, String(raw ?? ''));
                linkWrap.append(span);
            }
            if (!ro) {
                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.className = 'db-mini-btn db-cell-edit-btn';
                editBtn.textContent = '✎';
                editBtn.title = `Edit ${prop.name}`;
                editBtn.onclick = e => {
                    e.stopPropagation();
                    startInlineInput(true);
                };
                linkWrap.append(editBtn);
            }
            wrap.append(linkWrap);
            return wrap;
        }
        startInlineInput(false);
        return wrap;
    }
    function openOptionPicker(anchor, prop, rowPage, dbPage, onChange) {
        prop.options = prop.options || (prop.type === 'status' ? defaultStatusOptions() : []);
        openDbPopover(anchor, (pop, close) => {
            const isMulti = prop.type === 'multi_select';
            const currentRaw = getRawValue(prop, rowPage, dbPage);
            let selectedIds = isMulti
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
                            if (active)
                                selectedIds = selectedIds.filter(x => x !== opt.id && x !== opt.name);
                            else
                                selectedIds.push(opt.id);
                            setRowValue(rowPage, prop, [...selectedIds], dbPage, true);
                            renderOptions();
                            onChange();
                        }
                        else {
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
                    const nextColor = DB_COLORS[(prop.options.length % (DB_COLORS.length - 1)) + 1].key;
                    createBtn.append('Create ', createPillEl(q, nextColor, prop.type === 'status', 'todo'));
                    createBtn.onclick = () => {
                        const created = {
                            id: uid(),
                            name: q,
                            color: nextColor,
                            statusGroup: prop.type === 'status' ? 'in_progress' : undefined
                        };
                        prop.options.push(created);
                        if (isMulti) {
                            selectedIds.push(created.id);
                            setRowValue(rowPage, prop, [...selectedIds], dbPage, true);
                            search.value = '';
                            renderOptions();
                        }
                        else {
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
                    const createEl = listEl.querySelector('.db-pop-create-btn');
                    const firstOpt = listEl.querySelector('.db-pop-option-btn');
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
    function openPersonPicker(anchor, prop, rowPage, dbPage, onChange) {
        openDbPopover(anchor, (pop, close) => {
            const users = getState()?.users || [];
            const currentRaw = getRawValue(prop, rowPage, dbPage);
            let selected = Array.isArray(currentRaw) ? [...currentRaw] : (currentRaw ? [String(currentRaw)] : []);
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
                users.forEach((u) => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'db-pop-option-btn';
                    btn.dataset.userRef = u.id || u.name;
                    const has = selected.includes(u.id);
                    btn.innerHTML = `<span class="db-person-chip"><span class="db-person-avatar">${escHtml(u.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase())}</span><span>${escHtml(u.name)}</span></span><span class="db-pop-check">${has ? '✓' : ''}</span>`;
                    btn.oncontextmenu = ev => {
                        if (host?.openUserContextMenu) {
                            ev.preventDefault();
                            ev.stopPropagation();
                            host.openUserContextMenu(ev, u.id || u.name);
                        }
                    };
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
    function openDatePicker(anchor, prop, rowPage, dbPage, onChange) {
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
                if (!rangeCb.checked)
                    endInput.value = '';
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
    function openFilesPicker(anchor, prop, rowPage, dbPage, onChange) {
        openDbPopover(anchor, (pop, close) => {
            const files = Array.isArray(getRawValue(prop, rowPage, dbPage)) ? [...getRawValue(prop, rowPage, dbPage)] : [];
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
                    if (!f)
                        return;
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
                    }
                    catch {
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
                if (!assets.length) {
                    host?.toast?.('Asset library is empty');
                    return;
                }
                list.replaceChildren();
                assets.slice(0, 12).forEach((a) => {
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
    function openRelationPicker(anchor, prop, rowPage, dbPage, onChange) {
        openDbPopover(anchor, (pop, close) => {
            const header = document.createElement('div');
            header.className = 'db-pop-header';
            if (!prop.relationDatabaseId) {
                header.textContent = 'Connect to database';
                ensureOfficialQuestboardPage();
                const dbs = getDatabasePages().filter((d) => !host?.canViewPage || host.canViewPage(d));
                const list = document.createElement('div');
                list.className = 'db-pop-list';
                dbs.forEach((targetDb) => {
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
            let selected = Array.isArray(getRawValue(prop, rowPage, dbPage)) ? [...getRawValue(prop, rowPage, dbPage)] : [];
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
                candidates.forEach((cand) => {
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
    function addSchemaProperty(dbPage, name, type, insertIndex) {
        const db = ensureDatabaseConfig(dbPage);
        const prop = {
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
        if (type === 'unique_id')
            assignUniqueIds(dbPage);
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
    function openAddPropertyPopover(anchor, dbPage, insertIndex, onCreated) {
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
    function openPropertyHeaderMenu(anchor, prop, view, dbPage) {
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
                if (e.key === 'Enter') {
                    e.preventDefault();
                    refreshAllDatabaseViews();
                    close();
                }
            });
            const list = document.createElement('div');
            list.className = 'db-pop-list';
            const addAction = (icon, label, run, cls = '') => {
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
                    prop.type = sel.value;
                    if (prop.type === 'status' && !prop.options?.length)
                        prop.options = defaultStatusOptions();
                    if ((prop.type === 'select' || prop.type === 'multi_select') && !prop.options?.length)
                        prop.options = defaultTagOptions();
                    if (prop.type === 'formula' && !prop.formulaExpr)
                        prop.formulaExpr = 'prop("Name")';
                    if (prop.type === 'unique_id') {
                        prop.idPrefix = prop.idPrefix || 'ID';
                        assignUniqueIds(dbPage);
                    }
                    if (prop.type === 'button') {
                        prop.buttonLabel = prop.buttonLabel || prop.name || 'Run';
                        prop.buttonActions = prop.buttonActions || [];
                    }
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
                    const o = document.createElement('option');
                    o.value = k;
                    o.textContent = l;
                    sel.append(o);
                });
                sel.value = prop.numberFormat || 'number';
                sel.onchange = () => { prop.numberFormat = sel.value; persist(false); refreshAllDatabaseViews(); };
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
                    getDatabaseRows(dbPage.id).forEach((r, idx) => {
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
                        actionsList: prop.buttonActions,
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
                getDatabasePages().forEach((d) => {
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
                    const o = document.createElement('option');
                    o.value = rp.id;
                    o.textContent = rp.name;
                    relSel.append(o);
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
                        const o = document.createElement('option');
                        o.value = ts.id;
                        o.textContent = ts.name;
                        tSel.append(o);
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
                    const o = document.createElement('option');
                    o.value = c.key;
                    o.textContent = c.label;
                    calcSel.append(o);
                });
                calcSel.value = prop.rollupCalc || 'count_all';
                calcSel.onchange = () => { prop.rollupCalc = calcSel.value; persist(false); refreshAllDatabaseViews(); };
                cWrap.append(calcSel);
                list.append(cWrap);
            }
            addAction('↑', 'Sort ascending', () => {
                view.sorts = [{ propertyId: prop.id, direction: 'asc' }];
                persist(false);
                refreshAllDatabaseViews();
                close();
            });
            addAction('↓', 'Sort descending', () => {
                view.sorts = [{ propertyId: prop.id, direction: 'desc' }];
                persist(false);
                refreshAllDatabaseViews();
                close();
            });
            addAction('▽', 'Filter', () => {
                filterOpenByKey.set(dbPage.id, true);
                view.filters.push({ id: uid(), propertyId: prop.id, op: prop.type === 'checkbox' ? 'is_checked' : 'contains', value: '' });
                persist(false);
                refreshAllDatabaseViews();
                close();
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
                    persist(false);
                    refreshAllDatabaseViews();
                    close();
                });
                addAction('⧉', 'Duplicate property', () => {
                    const copy = addSchemaProperty(dbPage, `${prop.name} copy`, prop.type, db.schema.indexOf(prop) + 1);
                    copy.options = structuredCloneSafe(prop.options);
                    copy.numberFormat = prop.numberFormat;
                    copy.formulaExpr = prop.formulaExpr;
                    persist(false);
                    refreshAllDatabaseViews();
                    close();
                });
                addAction('🗑', 'Delete property', () => {
                    removePropertyFromDatabase(dbPage, prop.id);
                    persist(false);
                    refreshAllDatabaseViews();
                    close();
                }, 'is-danger');
            }
            pop.append(nameInput, list);
            requestAnimationFrame(() => nameInput.focus());
        }, 250);
    }
    function makePopSubHeader(titleText, close, onBack) {
        const header = document.createElement('div');
        header.className = 'db-pop-header db-pop-nav-header';
        const left = document.createElement('div');
        left.className = 'db-pop-nav-left';
        if (onBack) {
            const backBtn = document.createElement('button');
            backBtn.type = 'button';
            backBtn.className = 'db-mini-btn db-pop-back-btn';
            backBtn.textContent = '←';
            backBtn.title = 'Back';
            backBtn.setAttribute('aria-label', 'Back');
            backBtn.onclick = onBack;
            left.append(backBtn);
        }
        const titleEl = document.createElement('span');
        titleEl.className = 'db-pop-nav-title';
        titleEl.textContent = titleText;
        left.append(titleEl);
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'db-mini-btn db-pop-close-btn';
        closeBtn.textContent = '✕';
        closeBtn.title = 'Close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.onclick = close;
        header.append(left, closeBtn);
        return header;
    }
    function renderPropertiesPanel(container, view, dbPage, close, onBack) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        let query = '';
        container.replaceChildren();
        container.append(makePopSubHeader('Property visibility', close, onBack));
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.className = 'db-pop-search';
        searchInput.placeholder = 'Search for a property…';
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        const draw = () => {
            list.replaceChildren();
            const q = query.trim().toLowerCase();
            const ordered = view.propertyOrder
                .map(pid => db.schema.find(s => s.id === pid))
                .filter((p) => Boolean(p) && (!q || p.name.toLowerCase().includes(q)));
            const shown = ordered.filter(p => view.visiblePropertyIds.includes(p.id));
            const hidden = ordered.filter(p => !view.visiblePropertyIds.includes(p.id));
            const buildRow = (prop, visible) => {
                const idx = view.propertyOrder.indexOf(prop.id);
                const row = document.createElement('div');
                row.className = 'db-pop-option-row';
                const lbl = document.createElement('span');
                lbl.className = 'db-prop-label';
                lbl.innerHTML = `<span class="db-prop-type-ico">${escHtml(propMeta(prop.type).icon)}</span> ${escHtml(prop.name)}`;
                const controls = document.createElement('div');
                controls.className = 'db-prop-mini-actions';
                if (!ro && idx > 0) {
                    const up = document.createElement('button');
                    up.type = 'button';
                    up.className = 'db-mini-btn';
                    up.textContent = '↑';
                    up.title = 'Move left / up';
                    up.onclick = () => {
                        const tmp = view.propertyOrder[idx - 1];
                        view.propertyOrder[idx - 1] = view.propertyOrder[idx];
                        view.propertyOrder[idx] = tmp;
                        persist(false);
                        refreshAllDatabaseViews();
                        draw();
                    };
                    controls.append(up);
                }
                if (!ro && idx >= 0 && idx < view.propertyOrder.length - 1) {
                    const dn = document.createElement('button');
                    dn.type = 'button';
                    dn.className = 'db-mini-btn';
                    dn.textContent = '↓';
                    dn.title = 'Move right / down';
                    dn.onclick = () => {
                        const tmp = view.propertyOrder[idx + 1];
                        view.propertyOrder[idx + 1] = view.propertyOrder[idx];
                        view.propertyOrder[idx] = tmp;
                        persist(false);
                        refreshAllDatabaseViews();
                        draw();
                    };
                    controls.append(dn);
                }
                const eye = document.createElement('button');
                eye.type = 'button';
                eye.className = 'db-mini-btn ' + (visible ? 'is-on' : 'is-off');
                eye.textContent = visible ? '👁' : '🚫';
                eye.disabled = ro || prop.type === 'title';
                eye.title = prop.type === 'title' ? 'Title is always visible' : (visible ? 'Hide in view' : 'Show in view');
                eye.onclick = () => {
                    if (visible)
                        view.visiblePropertyIds = view.visiblePropertyIds.filter(id => id !== prop.id);
                    else
                        view.visiblePropertyIds.push(prop.id);
                    persist(false);
                    refreshAllDatabaseViews();
                    draw();
                };
                controls.append(eye);
                row.append(lbl, controls);
                return row;
            };
            const shownHead = document.createElement('div');
            shownHead.className = 'db-pop-section-head';
            shownHead.innerHTML = '<span>Shown in view</span>';
            if (!ro && shown.some(p => p.type !== 'title')) {
                const hideAllBtn = document.createElement('button');
                hideAllBtn.type = 'button';
                hideAllBtn.className = 'db-link-btn';
                hideAllBtn.textContent = 'Hide all';
                hideAllBtn.onclick = () => {
                    const titleProp = db.schema.find(s => s.type === 'title');
                    view.visiblePropertyIds = titleProp ? [titleProp.id] : [];
                    persist(false);
                    refreshAllDatabaseViews();
                    draw();
                };
                shownHead.append(hideAllBtn);
            }
            list.append(shownHead);
            shown.forEach(p => list.append(buildRow(p, true)));
            if (hidden.length) {
                const hiddenHead = document.createElement('div');
                hiddenHead.className = 'db-pop-section-head';
                hiddenHead.innerHTML = '<span>Hidden in view</span>';
                if (!ro) {
                    const showAllBtn = document.createElement('button');
                    showAllBtn.type = 'button';
                    showAllBtn.className = 'db-link-btn';
                    showAllBtn.textContent = 'Show all';
                    showAllBtn.onclick = () => {
                        view.visiblePropertyIds = db.schema.map(s => s.id);
                        persist(false);
                        refreshAllDatabaseViews();
                        draw();
                    };
                    hiddenHead.append(showAllBtn);
                }
                list.append(hiddenHead);
                hidden.forEach(p => list.append(buildRow(p, false)));
            }
        };
        searchInput.addEventListener('input', () => { query = searchInput.value; draw(); });
        draw();
        const wrapBtn = document.createElement('button');
        wrapBtn.type = 'button';
        wrapBtn.className = 'db-pop-option-btn';
        wrapBtn.disabled = ro;
        const drawWrapState = () => {
            wrapBtn.innerHTML = `<span>Wrap all properties</span><span class="db-pop-check">${view.wrapCells ? '✓' : ''}</span>`;
        };
        drawWrapState();
        wrapBtn.onclick = () => { view.wrapCells = !view.wrapCells; persist(false); refreshAllDatabaseViews(); drawWrapState(); };
        container.append(searchInput, list, wrapBtn);
        if (!ro) {
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'db-pop-create-btn';
            addBtn.textContent = '＋ New property';
            addBtn.onclick = () => {
                const anchorRect = container.getBoundingClientRect();
                close();
                openAddPropertyPopover(anchorRect, dbPage);
            };
            container.append(addBtn);
        }
        requestAnimationFrame(() => searchInput.focus());
    }
    function renderSortPanel(container, view, dbPage, close, onBack) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        container.replaceChildren();
        container.append(makePopSubHeader('Sort', close, onBack));
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        const draw = () => {
            list.replaceChildren();
            view.sorts.forEach((rule, idx) => {
                const row = document.createElement('div');
                row.className = 'db-rule-row';
                const propSel = document.createElement('select');
                propSel.disabled = ro;
                db.schema.forEach(s => {
                    const o = document.createElement('option');
                    o.value = s.id;
                    o.textContent = s.name;
                    propSel.append(o);
                });
                propSel.value = rule.propertyId;
                propSel.onchange = () => { rule.propertyId = propSel.value; persist(false); refreshAllDatabaseViews(); };
                const dirSel = document.createElement('select');
                dirSel.disabled = ro;
                [['asc', 'Ascending'], ['desc', 'Descending']].forEach(([k, l]) => {
                    const o = document.createElement('option');
                    o.value = k;
                    o.textContent = l;
                    dirSel.append(o);
                });
                dirSel.value = rule.direction;
                dirSel.onchange = () => { rule.direction = dirSel.value; persist(false); refreshAllDatabaseViews(); };
                const rm = document.createElement('button');
                rm.type = 'button';
                rm.className = 'db-mini-btn';
                rm.textContent = '✕';
                rm.disabled = ro;
                rm.onclick = () => { view.sorts.splice(idx, 1); persist(false); refreshAllDatabaseViews(); draw(); };
                row.append(propSel, dirSel, rm);
                list.append(row);
            });
            if (!ro) {
                const addBtn = document.createElement('button');
                addBtn.type = 'button';
                addBtn.className = 'db-pop-create-btn';
                addBtn.textContent = '＋ Add sort';
                addBtn.onclick = () => {
                    view.sorts.push({ propertyId: db.schema[0].id, direction: 'asc' });
                    persist(false);
                    refreshAllDatabaseViews();
                    draw();
                };
                list.append(addBtn);
            }
            if (!ro && view.sorts.length) {
                const clear = document.createElement('button');
                clear.type = 'button';
                clear.className = 'db-link-btn';
                clear.textContent = 'Delete all sorts';
                clear.onclick = () => { view.sorts = []; persist(false); refreshAllDatabaseViews(); draw(); };
                list.append(clear);
            }
        };
        draw();
        container.append(list);
    }
    function openPropertiesMenu(anchor, view, dbPage) {
        openDbPopover(anchor, (pop, close) => renderPropertiesPanel(pop, view, dbPage, close), 285);
    }
    function openSortPopover(anchor, view, dbPage) {
        openDbPopover(anchor, (pop, close) => renderSortPanel(pop, view, dbPage, close), 280);
    }
    function openFilterPopover(anchor, view, dbPage, key) {
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
    function renderGroupPanel(container, view, dbPage, close, onBack) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        container.replaceChildren();
        container.append(makePopSubHeader('Group', close, onBack));
        const draw = () => {
            while (container.children.length > 1)
                container.lastElementChild?.remove();
            const groupable = db.schema.filter(s => ['status', 'select', 'multi_select', 'person', 'checkbox', 'text', 'date'].includes(s.type));
            const byHead = document.createElement('div');
            byHead.className = 'db-pop-section-head';
            byHead.innerHTML = '<span>Group by</span>';
            container.append(byHead);
            const list = document.createElement('div');
            list.className = 'db-pop-list';
            const noneBtn = document.createElement('button');
            noneBtn.type = 'button';
            noneBtn.className = 'db-pop-option-btn';
            noneBtn.disabled = ro;
            noneBtn.innerHTML = `<span>None</span><span class="db-pop-check">${!view.groupBy ? '✓' : ''}</span>`;
            noneBtn.onclick = () => {
                if (view.type === 'board') {
                    host?.toast?.('Board view needs a Group by property');
                    return;
                }
                view.groupBy = undefined;
                persist(false);
                refreshAllDatabaseViews();
                if (onBack)
                    draw();
                else
                    close();
            };
            list.append(noneBtn);
            groupable.forEach(prop => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'db-pop-option-btn';
                btn.disabled = ro;
                btn.innerHTML = `<span><span class="db-prop-type-ico">${escHtml(propMeta(prop.type).icon)}</span> ${escHtml(prop.name)}</span><span class="db-pop-check">${view.groupBy === prop.id ? '✓' : ''}</span>`;
                btn.onclick = () => {
                    view.groupBy = prop.id;
                    persist(false);
                    refreshAllDatabaseViews();
                    if (onBack)
                        draw();
                    else
                        close();
                };
                list.append(btn);
            });
            container.append(list);
            const groupProp = view.groupBy ? db.schema.find(s => s.id === view.groupBy) : undefined;
            if (groupProp) {
                const optsHead = document.createElement('div');
                optsHead.className = 'db-pop-section-head';
                optsHead.innerHTML = '<span>Group options</span>';
                container.append(optsHead);
                const sortRow = document.createElement('label');
                sortRow.className = 'db-pop-field-row';
                sortRow.innerHTML = '<span>Sort</span>';
                const sortSel = document.createElement('select');
                sortSel.disabled = ro;
                [['manual', 'Manual'], ['asc', 'Alphabetical'], ['desc', 'Reverse alphabetical']].forEach(([k, l]) => {
                    const o = document.createElement('option');
                    o.value = k;
                    o.textContent = l;
                    sortSel.append(o);
                });
                sortSel.value = view.groupSort || 'manual';
                sortSel.onchange = () => { view.groupSort = sortSel.value; persist(false); refreshAllDatabaseViews(); };
                sortRow.append(sortSel);
                container.append(sortRow);
                const hideEmptyBtn = document.createElement('button');
                hideEmptyBtn.type = 'button';
                hideEmptyBtn.className = 'db-pop-option-btn';
                hideEmptyBtn.disabled = ro;
                hideEmptyBtn.innerHTML = `<span>Hide empty groups</span><span class="db-pop-check">${view.hideEmptyGroups ? '✓' : ''}</span>`;
                hideEmptyBtn.onclick = () => { view.hideEmptyGroups = !view.hideEmptyGroups; persist(false); refreshAllDatabaseViews(); draw(); };
                container.append(hideEmptyBtn);
                const showCntBtn = document.createElement('button');
                showCntBtn.type = 'button';
                showCntBtn.className = 'db-pop-option-btn';
                showCntBtn.disabled = ro;
                showCntBtn.innerHTML = `<span>Show group counts</span><span class="db-pop-check">${view.showGroupCounts !== false ? '✓' : ''}</span>`;
                showCntBtn.onclick = () => { view.showGroupCounts = view.showGroupCounts === false; persist(false); refreshAllDatabaseViews(); draw(); };
                container.append(showCntBtn);
                const allBuckets = buildGroupsForRows(getDatabaseRows(dbPage.id), groupProp, dbPage, view, { includeHidden: true });
                const visHead = document.createElement('div');
                visHead.className = 'db-pop-section-head';
                visHead.innerHTML = '<span>Visible groups</span>';
                if (!ro && (view.hiddenGroups || []).length) {
                    const resetVis = document.createElement('button');
                    resetVis.type = 'button';
                    resetVis.className = 'db-link-btn';
                    resetVis.textContent = 'Show all';
                    resetVis.onclick = () => { view.hiddenGroups = []; persist(false); refreshAllDatabaseViews(); draw(); };
                    visHead.append(resetVis);
                }
                container.append(visHead);
                const visList = document.createElement('div');
                visList.className = 'db-pop-list';
                allBuckets.forEach(g => {
                    const hiddenSet = new Set(view.hiddenGroups || []);
                    const isHidden = hiddenSet.has(g.key);
                    const row = document.createElement('div');
                    row.className = 'db-pop-option-row';
                    const pillWrap = document.createElement('div');
                    pillWrap.className = 'db-prop-label';
                    pillWrap.append(createPillEl(g.label, g.color, groupProp.type === 'status', g.statusGroup));
                    const cnt = document.createElement('span');
                    cnt.className = 'db-group-count';
                    cnt.textContent = String(g.rows.length);
                    pillWrap.append(cnt);
                    const eye = document.createElement('button');
                    eye.type = 'button';
                    eye.className = 'db-mini-btn ' + (!isHidden ? 'is-on' : 'is-off');
                    eye.textContent = !isHidden ? '👁' : '🚫';
                    eye.disabled = ro;
                    eye.title = isHidden ? 'Show group' : 'Hide group';
                    eye.onclick = () => {
                        view.hiddenGroups = isHidden
                            ? (view.hiddenGroups || []).filter(k => k !== g.key)
                            : [...new Set([...(view.hiddenGroups || []), g.key])];
                        persist(false);
                        refreshAllDatabaseViews();
                        draw();
                    };
                    row.append(pillWrap, eye);
                    visList.append(row);
                });
                container.append(visList);
            }
        };
        draw();
    }
    function renderFilterSettingsPanel(container, view, dbPage, close, onBack) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        container.replaceChildren();
        container.append(makePopSubHeader('Filter', close, onBack));
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        const draw = () => {
            list.replaceChildren();
            if (view.filters.length > 1) {
                const matchRow = document.createElement('label');
                matchRow.className = 'db-pop-field-row';
                matchRow.innerHTML = '<span>Match</span>';
                const matchSel = document.createElement('select');
                matchSel.disabled = ro;
                matchSel.innerHTML = '<option value="and">All filters (And)</option><option value="or">Any filter (Or)</option>';
                matchSel.value = view.filterMatch || 'and';
                matchSel.onchange = () => { view.filterMatch = matchSel.value; persist(false); refreshAllDatabaseViews(); };
                matchRow.append(matchSel);
                list.append(matchRow);
            }
            view.filters.forEach((rule, idx) => {
                const card = document.createElement('div');
                card.className = 'db-cond-card';
                const top = document.createElement('div');
                top.className = 'db-rule-row';
                const propSel = document.createElement('select');
                propSel.disabled = ro;
                db.schema.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; propSel.append(o); });
                propSel.value = rule.propertyId;
                propSel.onchange = () => { rule.propertyId = propSel.value; persist(false); refreshAllDatabaseViews(); };
                const opSel = document.createElement('select');
                opSel.disabled = ro;
                DB_FILTER_OPS.forEach(f => { const o = document.createElement('option'); o.value = f.op; o.textContent = f.label; opSel.append(o); });
                opSel.value = rule.op;
                opSel.onchange = () => { rule.op = opSel.value; persist(false); refreshAllDatabaseViews(); draw(); };
                const rm = document.createElement('button');
                rm.type = 'button';
                rm.className = 'db-mini-btn';
                rm.textContent = '✕';
                rm.disabled = ro;
                rm.onclick = () => { view.filters.splice(idx, 1); persist(false); refreshAllDatabaseViews(); draw(); };
                top.append(propSel, opSel, rm);
                card.append(top);
                const opMeta = DB_FILTER_OPS.find(f => f.op === rule.op);
                if (!opMeta?.noValue) {
                    const valInp = document.createElement('input');
                    valInp.type = 'text';
                    valInp.className = 'db-pop-search';
                    valInp.placeholder = 'Filter value…';
                    valInp.value = rule.value || '';
                    valInp.disabled = ro;
                    valInp.oninput = () => { rule.value = valInp.value; persist(false); refreshAllDatabaseViews(); };
                    card.append(valInp);
                }
                list.append(card);
            });
            if (!view.filters.length) {
                const empty = document.createElement('div');
                empty.className = 'db-pop-muted';
                empty.textContent = 'No filters applied to this view.';
                list.append(empty);
            }
            if (!ro) {
                const addBtn = document.createElement('button');
                addBtn.type = 'button';
                addBtn.className = 'db-pop-create-btn';
                addBtn.textContent = '＋ Add filter';
                addBtn.onclick = () => {
                    view.filters.push({ id: uid(), propertyId: db.schema[0].id, op: 'contains', value: '' });
                    persist(false);
                    refreshAllDatabaseViews();
                    draw();
                };
                list.append(addBtn);
            }
        };
        draw();
        container.append(list);
    }
    function renderConditionalColorPanel(container, view, dbPage, close, onBack) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        view.conditionalColors = view.conditionalColors || [];
        container.replaceChildren();
        container.append(makePopSubHeader('Conditional color', close, onBack));
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        const draw = () => {
            list.replaceChildren();
            const rules = view.conditionalColors;
            if (!rules.length) {
                const empty = document.createElement('div');
                empty.className = 'db-pop-muted';
                empty.textContent = 'Highlight rows or properties automatically when conditions match.';
                list.append(empty);
            }
            rules.forEach((rule, idx) => {
                const card = document.createElement('div');
                card.className = 'db-cond-card';
                const rTop = document.createElement('div');
                rTop.className = 'db-rule-row';
                const enCb = document.createElement('input');
                enCb.type = 'checkbox';
                enCb.checked = rule.enabled !== false;
                enCb.disabled = ro;
                enCb.title = 'Enable rule';
                enCb.onchange = () => { rule.enabled = enCb.checked; persist(false); refreshAllDatabaseViews(); };
                const propSel = document.createElement('select');
                propSel.disabled = ro;
                db.schema.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; propSel.append(o); });
                propSel.value = rule.propertyId;
                propSel.onchange = () => { rule.propertyId = propSel.value; persist(false); refreshAllDatabaseViews(); draw(); };
                const rm = document.createElement('button');
                rm.type = 'button';
                rm.className = 'db-mini-btn';
                rm.textContent = '✕';
                rm.disabled = ro;
                rm.onclick = () => { rules.splice(idx, 1); persist(false); refreshAllDatabaseViews(); draw(); };
                rTop.append(enCb, propSel, rm);
                card.append(rTop);
                const rMid = document.createElement('div');
                rMid.className = 'db-rule-row';
                const opSel = document.createElement('select');
                opSel.disabled = ro;
                DB_FILTER_OPS.forEach(f => { const o = document.createElement('option'); o.value = f.op; o.textContent = f.label; opSel.append(o); });
                opSel.value = rule.op;
                opSel.onchange = () => { rule.op = opSel.value; persist(false); refreshAllDatabaseViews(); draw(); };
                rMid.append(opSel);
                const opMeta = DB_FILTER_OPS.find(f => f.op === rule.op);
                if (!opMeta?.noValue) {
                    const valInp = document.createElement('input');
                    valInp.type = 'text';
                    valInp.className = 'db-pop-search';
                    valInp.placeholder = 'Value…';
                    valInp.value = rule.value || '';
                    valInp.disabled = ro;
                    const prop = db.schema.find(s => s.id === rule.propertyId);
                    if (prop?.options?.length) {
                        const dlId = `dl-${rule.id}`;
                        const dl = document.createElement('datalist');
                        dl.id = dlId;
                        prop.options.forEach(o => { const optEl = document.createElement('option'); optEl.value = o.name; dl.append(optEl); });
                        valInp.setAttribute('list', dlId);
                        card.append(dl);
                    }
                    valInp.oninput = () => { rule.value = valInp.value; persist(false); refreshAllDatabaseViews(); };
                    rMid.append(valInp);
                }
                card.append(rMid);
                const rBot = document.createElement('div');
                rBot.className = 'db-rule-row';
                const modeSel = document.createElement('select');
                modeSel.disabled = ro;
                [['fixed', 'Fixed color'], ['match_property_value', 'Match option']].forEach(([k, l]) => {
                    const o = document.createElement('option');
                    o.value = k;
                    o.textContent = l;
                    modeSel.append(o);
                });
                modeSel.value = rule.colorMode || 'fixed';
                modeSel.onchange = () => { rule.colorMode = modeSel.value; persist(false); refreshAllDatabaseViews(); draw(); };
                const applySel = document.createElement('select');
                applySel.disabled = ro;
                [['row', 'Entire row'], ['property', 'This cell']].forEach(([k, l]) => {
                    const o = document.createElement('option');
                    o.value = k;
                    o.textContent = l;
                    applySel.append(o);
                });
                applySel.value = rule.applyTo || 'row';
                applySel.onchange = () => { rule.applyTo = applySel.value; persist(false); refreshAllDatabaseViews(); };
                rBot.append(modeSel, applySel);
                card.append(rBot);
                if ((rule.colorMode || 'fixed') === 'fixed') {
                    const swatches = document.createElement('div');
                    swatches.className = 'db-color-swatches';
                    DB_COLORS.slice(1).forEach(c => {
                        const dot = document.createElement('button');
                        dot.type = 'button';
                        dot.className = 'db-color-swatch' + (rule.color === c.key ? ' is-selected' : '');
                        dot.style.backgroundColor = c.bg;
                        dot.style.borderColor = c.dot;
                        dot.title = c.label;
                        dot.disabled = ro;
                        dot.onclick = () => { rule.color = c.key; persist(false); refreshAllDatabaseViews(); draw(); };
                        swatches.append(dot);
                    });
                    card.append(swatches);
                }
                list.append(card);
            });
        };
        draw();
        container.append(list);
        if (!ro) {
            const addRuleBtn = document.createElement('button');
            addRuleBtn.type = 'button';
            addRuleBtn.className = 'db-pop-create-btn';
            addRuleBtn.textContent = '＋ New color rule';
            addRuleBtn.onclick = () => {
                const pref = db.schema.find(s => s.type === 'status' || s.type === 'select') || db.schema[0];
                view.conditionalColors.push({
                    id: uid(),
                    enabled: true,
                    propertyId: pref.id,
                    op: pref.options?.[0] ? 'equals' : 'is_not_empty',
                    value: pref.options?.[0]?.name || undefined,
                    colorMode: 'fixed',
                    color: 'blue',
                    applyTo: 'row'
                });
                persist(false);
                refreshAllDatabaseViews();
                draw();
            };
            container.append(addRuleBtn);
        }
    }
    function renderEditPropertiesPanel(container, view, dbPage, close, onBack, editPropId) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        container.replaceChildren();
        if (editPropId) {
            const prop = db.schema.find(s => s.id === editPropId);
            if (!prop) {
                renderEditPropertiesPanel(container, view, dbPage, close, onBack);
                return;
            }
            container.append(makePopSubHeader(prop.name || 'Edit property', close, () => renderEditPropertiesPanel(container, view, dbPage, close, onBack)));
            const nameInp = document.createElement('input');
            nameInp.type = 'text';
            nameInp.className = 'db-pop-search';
            nameInp.value = prop.name;
            nameInp.disabled = ro;
            nameInp.oninput = () => { prop.name = nameInp.value || 'Untitled'; persist(false); };
            nameInp.onblur = () => refreshAllDatabaseViews();
            container.append(nameInp);
            const list = document.createElement('div');
            list.className = 'db-pop-list';
            if (prop.type !== 'title') {
                const typeRow = document.createElement('label');
                typeRow.className = 'db-pop-field-row';
                typeRow.innerHTML = '<span>Type</span>';
                const sel = document.createElement('select');
                sel.disabled = ro;
                DB_PROPERTY_TYPES.forEach(pt => { const o = document.createElement('option'); o.value = pt.type; o.textContent = pt.label; sel.append(o); });
                sel.value = prop.type;
                sel.onchange = () => {
                    prop.type = sel.value;
                    if (prop.type === 'status' && !prop.options?.length)
                        prop.options = defaultStatusOptions();
                    if ((prop.type === 'select' || prop.type === 'multi_select') && !prop.options?.length)
                        prop.options = defaultTagOptions();
                    if (prop.type === 'formula' && !prop.formulaExpr)
                        prop.formulaExpr = 'prop("Name")';
                    if (prop.type === 'unique_id') {
                        prop.idPrefix = prop.idPrefix || 'ID';
                        assignUniqueIds(dbPage);
                    }
                    persist(false);
                    refreshAllDatabaseViews();
                    renderEditPropertiesPanel(container, view, dbPage, close, onBack, prop.id);
                };
                typeRow.append(sel);
                list.append(typeRow);
            }
            if (prop.type === 'select' || prop.type === 'multi_select' || prop.type === 'status') {
                const optHead = document.createElement('div');
                optHead.className = 'db-pop-section-head';
                optHead.innerHTML = '<span>Options</span>';
                list.append(optHead);
                prop.options = prop.options || [];
                prop.options.forEach((opt, idx) => {
                    const oRow = document.createElement('div');
                    oRow.className = 'db-pop-option-row';
                    const cBtn = document.createElement('button');
                    cBtn.type = 'button';
                    cBtn.className = 'db-color-swatch';
                    const cm = colorMeta(opt.color);
                    cBtn.style.backgroundColor = cm.bg;
                    cBtn.style.borderColor = cm.dot;
                    cBtn.disabled = ro;
                    cBtn.title = 'Cycle color';
                    cBtn.onclick = () => {
                        const ci = DB_COLORS.findIndex(c => c.key === opt.color);
                        opt.color = DB_COLORS[(ci + 1) % DB_COLORS.length].key;
                        persist(false);
                        refreshAllDatabaseViews();
                        renderEditPropertiesPanel(container, view, dbPage, close, onBack, prop.id);
                    };
                    const oInp = document.createElement('input');
                    oInp.type = 'text';
                    oInp.className = 'db-pop-search';
                    oInp.value = opt.name;
                    oInp.disabled = ro;
                    oInp.onchange = () => { opt.name = oInp.value.trim() || opt.name; persist(false); refreshAllDatabaseViews(); };
                    oRow.append(cBtn, oInp);
                    if (!ro) {
                        const delO = document.createElement('button');
                        delO.type = 'button';
                        delO.className = 'db-mini-btn';
                        delO.textContent = '✕';
                        delO.onclick = () => {
                            prop.options.splice(idx, 1);
                            persist(false);
                            refreshAllDatabaseViews();
                            renderEditPropertiesPanel(container, view, dbPage, close, onBack, prop.id);
                        };
                        oRow.append(delO);
                    }
                    list.append(oRow);
                });
                if (!ro) {
                    const addOptRow = document.createElement('div');
                    addOptRow.className = 'db-pop-option-row';
                    const newOptInp = document.createElement('input');
                    newOptInp.type = 'text';
                    newOptInp.className = 'db-pop-search';
                    newOptInp.placeholder = 'New option…';
                    const addOptBtn = document.createElement('button');
                    addOptBtn.type = 'button';
                    addOptBtn.className = 'db-mini-btn';
                    addOptBtn.textContent = '＋';
                    const doAddOpt = () => {
                        const label = newOptInp.value.trim();
                        if (!label)
                            return;
                        const nextColor = DB_COLORS[(prop.options.length % (DB_COLORS.length - 1)) + 1].key;
                        prop.options.push({ id: uid(), name: label, color: nextColor, ...(prop.type === 'status' ? { statusGroup: 'todo' } : {}) });
                        persist(false);
                        refreshAllDatabaseViews();
                        renderEditPropertiesPanel(container, view, dbPage, close, onBack, prop.id);
                    };
                    addOptBtn.onclick = doAddOpt;
                    newOptInp.onkeydown = e => { if (e.key === 'Enter') {
                        e.preventDefault();
                        doAddOpt();
                    } };
                    addOptRow.append(newOptInp, addOptBtn);
                    list.append(addOptRow);
                }
            }
            if (prop.type === 'number') {
                const fmtRow = document.createElement('label');
                fmtRow.className = 'db-pop-field-row';
                fmtRow.innerHTML = '<span>Number format</span>';
                const fSel = document.createElement('select');
                fSel.disabled = ro;
                [['number', 'Number'], ['percent', 'Percent'], ['dollar', 'US Dollar'], ['euro', 'Euro']].forEach(([k, l]) => {
                    const o = document.createElement('option');
                    o.value = k;
                    o.textContent = l;
                    fSel.append(o);
                });
                fSel.value = prop.numberFormat || 'number';
                fSel.onchange = () => { prop.numberFormat = fSel.value; persist(false); refreshAllDatabaseViews(); };
                fmtRow.append(fSel);
                list.append(fmtRow);
            }
            if (prop.type === 'formula') {
                const fRow = document.createElement('div');
                fRow.className = 'db-pop-field-col';
                fRow.innerHTML = '<small>Formula expression</small>';
                const fInp = document.createElement('input');
                fInp.type = 'text';
                fInp.className = 'db-pop-search';
                fInp.value = prop.formulaExpr || '';
                fInp.disabled = ro;
                fInp.onchange = () => { prop.formulaExpr = fInp.value; persist(false); refreshAllDatabaseViews(); };
                fRow.append(fInp);
                list.append(fRow);
            }
            if (prop.type === 'relation') {
                const rRow = document.createElement('label');
                rRow.className = 'db-pop-field-row';
                rRow.innerHTML = '<span>Target DB</span>';
                const rSel = document.createElement('select');
                rSel.disabled = ro;
                rSel.innerHTML = '<option value="">Choose database…</option>';
                getDatabasePages().forEach((d) => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.title || 'Untitled'; rSel.append(o); });
                rSel.value = prop.relationDatabaseId || '';
                rSel.onchange = () => { prop.relationDatabaseId = rSel.value; persist(false); refreshAllDatabaseViews(); };
                rRow.append(rSel);
                list.append(rRow);
            }
            if (!ro && prop.type !== 'title') {
                const delProp = document.createElement('button');
                delProp.type = 'button';
                delProp.className = 'db-pop-option-btn is-danger';
                delProp.innerHTML = '<span>🗑 Delete property</span>';
                delProp.onclick = () => {
                    removePropertyFromDatabase(dbPage, prop.id);
                    persist(false);
                    refreshAllDatabaseViews();
                    renderEditPropertiesPanel(container, view, dbPage, close, onBack);
                };
                list.append(delProp);
            }
            container.append(list);
            return;
        }
        container.append(makePopSubHeader('Properties', close, onBack));
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        db.schema.forEach(prop => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'db-pop-option-btn';
            btn.innerHTML = `<span><span class="db-prop-type-ico">${escHtml(propMeta(prop.type).icon)}</span> ${escHtml(prop.name)}</span><span class="db-pop-muted-chev">${escHtml(propMeta(prop.type).label)} ›</span>`;
            btn.onclick = () => renderEditPropertiesPanel(container, view, dbPage, close, onBack, prop.id);
            list.append(btn);
        });
        container.append(list);
        if (!ro) {
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'db-pop-create-btn';
            addBtn.textContent = '＋ New property';
            addBtn.onclick = () => {
                const r = container.getBoundingClientRect();
                close();
                openAddPropertyPopover(r, dbPage);
            };
            container.append(addBtn);
        }
    }
    function renderMoreSettingsPanel(container, view, dbPage, close, onBack) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        const pushDetail = (sub) => {
            container.replaceChildren();
            const backToMore = () => renderMoreSettingsPanel(container, view, dbPage, close, onBack);
            if (sub === 'subitems') {
                container.append(makePopSubHeader('Sub-items', close, backToMore));
                const togBtn = document.createElement('button');
                togBtn.type = 'button';
                togBtn.className = 'db-pop-option-btn';
                togBtn.disabled = ro;
                togBtn.innerHTML = `<span>Enable sub-items hierarchy</span><span class="db-pop-check">${db.subItemsEnabled ? '✓' : ''}</span>`;
                togBtn.onclick = () => {
                    db.subItemsEnabled = !db.subItemsEnabled;
                    if (db.subItemsEnabled && (!db.parentPropertyId || !db.schema.some(s => s.id === db.parentPropertyId))) {
                        const p = addSchemaProperty(dbPage, 'Parent item', 'relation');
                        p.relationDatabaseId = dbPage.id;
                        db.parentPropertyId = p.id;
                    }
                    persist(false);
                    refreshAllDatabaseViews();
                    pushDetail('subitems');
                };
                const pRow = document.createElement('label');
                pRow.className = 'db-pop-field-row';
                pRow.innerHTML = '<span>Parent relation</span>';
                const sel = document.createElement('select');
                sel.disabled = ro;
                db.schema.filter(s => s.type === 'relation').forEach(rp => {
                    const o = document.createElement('option');
                    o.value = rp.id;
                    o.textContent = rp.name;
                    sel.append(o);
                });
                sel.value = db.parentPropertyId || '';
                sel.onchange = () => { db.parentPropertyId = sel.value || undefined; db.subItemsEnabled = Boolean(sel.value); persist(false); refreshAllDatabaseViews(); };
                pRow.append(sel);
                container.append(togBtn, pRow);
                return;
            }
            if (sub === 'dependencies') {
                container.append(makePopSubHeader('Dependencies', close, backToMore));
                const togBtn = document.createElement('button');
                togBtn.type = 'button';
                togBtn.className = 'db-pop-option-btn';
                togBtn.disabled = ro;
                togBtn.innerHTML = `<span>Blocking / Blocked by</span><span class="db-pop-check">${db.dependenciesPropertyId ? '✓' : ''}</span>`;
                togBtn.onclick = () => {
                    if (db.dependenciesPropertyId) {
                        db.dependenciesPropertyId = undefined;
                    }
                    else {
                        const existing = db.schema.find(s => s.type === 'relation' && s.name.toLowerCase().includes('block'));
                        const depProp = existing || addSchemaProperty(dbPage, 'Blocked by', 'relation');
                        depProp.relationDatabaseId = dbPage.id;
                        db.dependenciesPropertyId = depProp.id;
                    }
                    persist(false);
                    refreshAllDatabaseViews();
                    pushDetail('dependencies');
                };
                container.append(togBtn);
                return;
            }
            if (sub === 'linked_events') {
                container.append(makePopSubHeader('Linked events', close, backToMore));
                const togBtn = document.createElement('button');
                togBtn.type = 'button';
                togBtn.className = 'db-pop-option-btn';
                togBtn.disabled = ro;
                togBtn.innerHTML = `<span>Sync calendar events with dated rows</span><span class="db-pop-check">${db.linkedEventsEnabled ? '✓' : ''}</span>`;
                togBtn.onclick = () => {
                    db.linkedEventsEnabled = !db.linkedEventsEnabled;
                    if (db.linkedEventsEnabled && !view.datePropertyId) {
                        let dp = db.schema.find(s => s.type === 'date');
                        if (!dp)
                            dp = addSchemaProperty(dbPage, 'Date', 'date');
                        view.datePropertyId = dp.id;
                    }
                    persist(false);
                    refreshAllDatabaseViews();
                    pushDetail('linked_events');
                };
                const dRow = document.createElement('label');
                dRow.className = 'db-pop-field-row';
                dRow.innerHTML = '<span>Date property</span>';
                const dSel = document.createElement('select');
                dSel.disabled = ro;
                db.schema.filter(s => s.type === 'date').forEach(dp => {
                    const o = document.createElement('option');
                    o.value = dp.id;
                    o.textContent = dp.name;
                    dSel.append(o);
                });
                dSel.value = view.datePropertyId || '';
                dSel.onchange = () => { view.datePropertyId = dSel.value; persist(false); refreshAllDatabaseViews(); };
                dRow.append(dSel);
                container.append(togBtn, dRow);
                return;
            }
            if (sub === 'connections') {
                container.append(makePopSubHeader('Connections', close, backToMore));
                db.connections = db.connections && db.connections.length ? db.connections : [
                    { id: 'conn-slack', label: 'Slack updates', provider: 'Slack', enabled: false },
                    { id: 'conn-github', label: 'GitHub PR sync', provider: 'GitHub', enabled: false },
                    { id: 'conn-cal', label: 'Calendar feed', provider: 'Calendar', enabled: false }
                ];
                db.connections.forEach(c => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'db-pop-option-btn';
                    btn.disabled = ro;
                    btn.innerHTML = `<span>${escHtml(c.label)}</span><span class="db-pop-check">${c.enabled ? '✓' : ''}</span>`;
                    btn.onclick = () => { c.enabled = !c.enabled; persist(false); pushDetail('connections'); };
                    container.append(btn);
                });
                if (!ro) {
                    const autoBtn = document.createElement('button');
                    autoBtn.type = 'button';
                    autoBtn.className = 'db-pop-create-btn';
                    autoBtn.textContent = '⚡ Configure webhook automations…';
                    autoBtn.onclick = () => { const r = container.getBoundingClientRect(); close(); openAutomationsPopover(r, dbPage); };
                    container.append(autoBtn);
                }
                return;
            }
            if (sub === 'form_uploads') {
                container.append(makePopSubHeader('Form uploads', close, backToMore));
                const lbl = document.createElement('label');
                lbl.className = 'db-form-setting-toggle';
                const span = document.createElement('span');
                span.textContent = 'Save form uploads to Asset Management';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = db.formUploadsToAssets !== false;
                cb.disabled = ro;
                cb.dataset.dbSetting = 'form-uploads-to-assets';
                cb.onchange = () => {
                    db.formUploadsToAssets = cb.checked;
                    persist(false);
                    refreshAllDatabaseViews();
                    pushDetail('form_uploads');
                };
                lbl.append(span, cb);
                container.append(lbl);
                const folderRow = document.createElement('div');
                folderRow.className = 'db-form-setting-field';
                folderRow.innerHTML = '<label>Separate uploads folder (used when unchecked)</label>';
                const fInp = document.createElement('input');
                fInp.type = 'text';
                fInp.className = 'db-pop-input';
                fInp.disabled = ro;
                fInp.value = db.formUploadsFolder || 'form-uploads';
                fInp.onchange = () => {
                    db.formUploadsFolder = fInp.value.trim() || 'form-uploads';
                    persist(false);
                    refreshAllDatabaseViews();
                };
                folderRow.append(fInp);
                const hint = document.createElement('div');
                hint.className = 'db-pop-hint';
                hint.textContent = db.formUploadsToAssets !== false
                    ? 'Form file uploads are indexed in Workspace Asset Management.'
                    : `Form file uploads live separately under form-uploads/${db.formUploadsFolder || 'form-uploads'}.`;
                container.append(folderRow, hint);
                return;
            }
            container.append(makePopSubHeader('Customize page layout', close, backToMore));
            const openRow = document.createElement('label');
            openRow.className = 'db-pop-field-row';
            openRow.innerHTML = '<span>Open pages in</span>';
            const oSel = document.createElement('select');
            oSel.disabled = ro;
            [['side_peek', 'Side peek'], ['center_peek', 'Center peek'], ['full_page', 'Full page']].forEach(([k, l]) => {
                const o = document.createElement('option');
                o.value = k;
                o.textContent = l;
                oSel.append(o);
            });
            oSel.value = db.defaultOpenMode || 'side_peek';
            oSel.onchange = () => { db.defaultOpenMode = oSel.value; persist(false); refreshAllDatabaseViews(); };
            openRow.append(oSel);
            const titleBtn = document.createElement('button');
            titleBtn.type = 'button';
            titleBtn.className = 'db-pop-option-btn';
            titleBtn.disabled = ro;
            titleBtn.innerHTML = `<span>Show database title</span><span class="db-pop-check">${db.showTitle !== false ? '✓' : ''}</span>`;
            titleBtn.onclick = () => { db.showTitle = db.showTitle === false; persist(false); refreshAllDatabaseViews(); pushDetail('page_layout'); };
            const cardsBtn = document.createElement('button');
            cardsBtn.type = 'button';
            cardsBtn.className = 'db-pop-option-btn';
            cardsBtn.disabled = ro;
            cardsBtn.innerHTML = `<span>Show properties on cards</span><span class="db-pop-check">${view.showPropertiesOnCards !== false ? '✓' : ''}</span>`;
            cardsBtn.onclick = () => { view.showPropertiesOnCards = view.showPropertiesOnCards === false; persist(false); refreshAllDatabaseViews(); pushDetail('page_layout'); };
            container.append(openRow, titleBtn, cardsBtn);
        };
        container.replaceChildren();
        container.append(makePopSubHeader('More settings', close, onBack));
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        [
            ['subitems', '↳', 'Sub-items', db.subItemsEnabled ? 'On' : ''],
            ['dependencies', '⛓', 'Dependencies', db.dependenciesPropertyId ? 'On' : ''],
            ['linked_events', '📅', 'Linked events', db.linkedEventsEnabled ? 'On' : ''],
            ['connections', '🔗', 'Connections', String((db.connections || []).filter(c => c.enabled).length || '')],
            ['form_uploads', '📎', 'Form uploads', db.formUploadsToAssets === false ? 'Separate' : 'Assets'],
            ['page_layout', '◨', 'Customize page layout', '']
        ].forEach(([key, ico, lbl, badge]) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'db-pop-option-btn';
            btn.innerHTML = `<span><span class="db-prop-type-ico">${ico}</span> ${lbl}</span><span class="db-pop-muted-chev">${escHtml(badge)} ›</span>`;
            btn.onclick = () => pushDetail(key);
            list.append(btn);
        });
        container.append(list);
    }
    function renderChangeSourcePanel(container, dbPage, close, onBack, opts) {
        const ro = roMode(dbPage);
        container.replaceChildren();
        container.append(makePopSubHeader('Source', close, onBack));
        const search = document.createElement('input');
        search.type = 'search';
        search.className = 'db-pop-search';
        search.placeholder = 'Search databases…';
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        const draw = () => {
            list.replaceChildren();
            ensureOfficialQuestboardPage();
            const q = search.value.trim().toLowerCase();
            const dbs = getDatabasePages().filter((d) => (!host?.canViewPage || host.canViewPage(d)) && (!q || (d.title || 'Untitled').toLowerCase().includes(q)));
            dbs.forEach((d) => {
                const isCurrent = d.id === dbPage.id;
                const rowsCnt = getDatabaseRows(d.id).length;
                const hiddenHint = isHiddenBasePage(d) ? 'Base DB · ' : '';
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'db-pop-option-btn';
                btn.innerHTML = `<span>${dbIconHtml(d.icon, '🗃️')} ${escHtml(d.title || 'Untitled database')}</span><span class="db-pop-muted-chev">${hiddenHint}${rowsCnt} rows ${isCurrent ? '✓' : '›'}</span>`;
                btn.onclick = () => {
                    close();
                    if (opts.onChangeSourceDb && !ro) {
                        opts.onChangeSourceDb(d);
                    }
                    else {
                        host?.navigateToPage?.(d.id);
                    }
                };
                list.append(btn);
            });
        };
        search.addEventListener('input', draw);
        draw();
        container.append(search, list);
        if (opts.onChangeSourceDb && !ro) {
            const createNew = document.createElement('button');
            createNew.type = 'button';
            createNew.className = 'db-pop-create-btn';
            createNew.textContent = '＋ Create new database source';
            createNew.onclick = () => {
                const createdDb = createDatabasePage(undefined, 'New Database');
                persist(false);
                close();
                opts.onChangeSourceDb(createdDb);
            };
            container.append(createNew);
        }
        requestAnimationFrame(() => search.focus());
    }
    function renderManageSourcesPanel(container, dbPage, close, onBack, opts) {
        const db = ensureDatabaseConfig(dbPage);
        container.replaceChildren();
        container.append(makePopSubHeader('Manage data sources', close, onBack));
        const summary = document.createElement('div');
        summary.className = 'db-cond-card';
        summary.innerHTML = `<div><strong>${dbIconHtml(dbPage.icon, '🗃️')} ${escHtml(dbPage.title || 'Database')}</strong></div><div class="db-pop-muted">${getDatabaseRows(dbPage.id).length} pages · ${db.schema.length} properties · ${db.views.length} views</div>`;
        container.append(summary);
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        const openBtn = document.createElement('button');
        openBtn.type = 'button';
        openBtn.className = 'db-pop-option-btn';
        openBtn.innerHTML = '<span>⤢ Open source database page</span><span class="db-pop-muted-chev">›</span>';
        openBtn.onclick = () => { close(); host?.navigateToPage?.(dbPage.id); };
        list.append(openBtn);
        if (opts.onChangeSourceDb && !roMode(dbPage)) {
            const chBtn = document.createElement('button');
            chBtn.type = 'button';
            chBtn.className = 'db-pop-option-btn';
            chBtn.innerHTML = '<span>⇄ Change linked data source…</span><span class="db-pop-muted-chev">›</span>';
            chBtn.onclick = () => renderChangeSourcePanel(container, dbPage, close, () => renderManageSourcesPanel(container, dbPage, close, onBack, opts), opts);
            list.append(chBtn);
        }
        const expCsv = document.createElement('button');
        expCsv.type = 'button';
        expCsv.className = 'db-pop-option-btn';
        expCsv.innerHTML = '<span>⇩ Export database as CSV</span>';
        expCsv.onclick = () => {
            const cols = db.schema;
            const rows = getDatabaseRows(dbPage.id);
            const escapeCsv = (s) => `"${String(s).replace(/"/g, '""')}"`;
            const lines = [cols.map(c => escapeCsv(c.name)).join(',')];
            rows.forEach((r) => {
                lines.push(cols.map(c => escapeCsv(valueAsSearchText(c, r, dbPage))).join(','));
            });
            const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${(dbPage.title || 'database').replace(/[^\w\-]+/g, '_')}.csv`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 1000);
            host?.toast?.('Exported CSV');
            close();
        };
        list.append(expCsv);
        const expJson = document.createElement('button');
        expJson.type = 'button';
        expJson.className = 'db-pop-option-btn';
        expJson.innerHTML = '<span>⇩ Export database as JSON</span>';
        expJson.onclick = () => {
            const payload = { database: { id: dbPage.id, title: dbPage.title, ...db }, rows: getDatabaseRows(dbPage.id) };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${(dbPage.title || 'database').replace(/[^\w\-]+/g, '_')}.json`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 1000);
            host?.toast?.('Exported JSON');
            close();
        };
        list.append(expJson);
        container.append(list);
    }
    function renderTurnIntoPanel(container, view, dbPage, close, onBack, opts) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        container.replaceChildren();
        container.append(makePopSubHeader('Turn into', close, onBack));
        const layoutGrid = document.createElement('div');
        layoutGrid.className = 'db-layout-grid';
        DB_VIEW_TYPES.forEach(vt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'db-layout-tile' + (view.type === vt.type ? ' active' : '');
            btn.disabled = ro;
            btn.innerHTML = `<span>${vt.icon}</span><small>${vt.label}</small>`;
            btn.onclick = () => {
                view.type = vt.type;
                if (vt.type === 'board' && !view.groupBy) {
                    view.groupBy = db.schema.find(s => ['status', 'select', 'multi_select', 'person', 'checkbox'].includes(s.type))?.id;
                }
                if ((vt.type === 'calendar' || vt.type === 'timeline') && !view.datePropertyId) {
                    let dp = db.schema.find(s => s.type === 'date');
                    if (!dp)
                        dp = addSchemaProperty(dbPage, 'Date', 'date');
                    view.datePropertyId = dp.id;
                }
                if (vt.type === 'chart' && !view.chartConfig) {
                    view.chartConfig = { chartType: 'vertical_bar', xPropertyId: db.schema[1]?.id || db.schema[0].id, yMode: 'count' };
                }
                persist(false);
                refreshAllDatabaseViews();
                close();
            };
            layoutGrid.append(btn);
        });
        container.append(layoutGrid);
        const list = document.createElement('div');
        list.className = 'db-pop-list';
        if (opts.isInline && opts.onTurnIntoFullPage && !ro) {
            const fullBtn = document.createElement('button');
            fullBtn.type = 'button';
            fullBtn.className = 'db-pop-option-btn';
            fullBtn.innerHTML = '<span>⤢ Turn into full page</span>';
            fullBtn.onclick = () => { close(); opts.onTurnIntoFullPage(); };
            list.append(fullBtn);
        }
        if (!ro) {
            const dupBtn = document.createElement('button');
            dupBtn.type = 'button';
            dupBtn.className = 'db-pop-option-btn';
            dupBtn.innerHTML = '<span>⧉ Duplicate view</span>';
            dupBtn.onclick = () => {
                const copy = { ...structuredCloneSafe(view), id: uid(), name: `${view.name} copy` };
                db.views.push(copy);
                db.activeViewId = copy.id;
                persist(false);
                refreshAllDatabaseViews();
                close();
            };
            list.append(dupBtn);
        }
        if (!ro && db.views.length > 1) {
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'db-pop-option-btn is-danger';
            delBtn.innerHTML = '<span>🗑 Delete view</span>';
            delBtn.onclick = () => {
                db.views = db.views.filter(v => v.id !== view.id);
                db.activeViewId = db.views[0].id;
                persist(false);
                refreshAllDatabaseViews();
                close();
            };
            list.append(delBtn);
        }
        container.append(list);
    }
    function openGroupPopover(anchor, view, dbPage) {
        openDbPopover(anchor, (pop, close) => renderGroupPanel(pop, view, dbPage, close), 265);
    }
    function openViewSettingsPopover(anchor, view, dbPage, opts = {}) {
        const db = ensureDatabaseConfig(dbPage);
        openDbPopover(anchor, (pop, close) => {
            const renderLayoutPanel = (onBack) => {
                pop.replaceChildren();
                pop.append(makePopSubHeader('Layout', close, onBack));
                const ro = roMode(dbPage);
                const layoutGrid = document.createElement('div');
                layoutGrid.className = 'db-layout-grid';
                DB_VIEW_TYPES.forEach(vt => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'db-layout-tile' + (view.type === vt.type ? ' active' : '');
                    btn.disabled = ro;
                    btn.innerHTML = `<span>${vt.icon}</span><small>${vt.label}</small>`;
                    btn.onclick = () => {
                        view.type = vt.type;
                        if (vt.type === 'board' && !view.groupBy) {
                            view.groupBy = db.schema.find(s => ['status', 'select', 'multi_select', 'person', 'checkbox'].includes(s.type))?.id;
                        }
                        if ((vt.type === 'calendar' || vt.type === 'timeline') && !view.datePropertyId) {
                            let dp = db.schema.find(s => s.type === 'date');
                            if (!dp)
                                dp = addSchemaProperty(dbPage, 'Date', 'date');
                            view.datePropertyId = dp.id;
                        }
                        if (vt.type === 'chart' && !view.chartConfig) {
                            view.chartConfig = { chartType: 'vertical_bar', xPropertyId: db.schema[1]?.id || db.schema[0].id, yMode: 'count' };
                        }
                        persist(false);
                        refreshAllDatabaseViews();
                        renderLayoutPanel(onBack);
                    };
                    layoutGrid.append(btn);
                });
                pop.append(layoutGrid);
                const list = document.createElement('div');
                list.className = 'db-pop-list';
                const wrapBtn = document.createElement('button');
                wrapBtn.type = 'button';
                wrapBtn.className = 'db-pop-option-btn';
                wrapBtn.disabled = ro;
                wrapBtn.innerHTML = `<span>Wrap all properties</span><span class="db-pop-check">${view.wrapCells ? '✓' : ''}</span>`;
                wrapBtn.onclick = () => { view.wrapCells = !view.wrapCells; persist(false); refreshAllDatabaseViews(); renderLayoutPanel(onBack); };
                list.append(wrapBtn);
                if (view.type === 'gallery' || view.type === 'board') {
                    const prevRow = document.createElement('label');
                    prevRow.className = 'db-pop-field-row';
                    prevRow.innerHTML = '<span>Card preview</span>';
                    const prevSel = document.createElement('select');
                    prevSel.disabled = ro;
                    [['none', 'None'], ['cover', 'Page cover'], ['content', 'Page content'], ['files', 'Files & media']].forEach(([k, l]) => {
                        const o = document.createElement('option');
                        o.value = k;
                        o.textContent = l;
                        prevSel.append(o);
                    });
                    prevSel.value = view.cardPreview || 'none';
                    prevSel.onchange = () => { view.cardPreview = prevSel.value; persist(false); refreshAllDatabaseViews(); };
                    prevRow.append(prevSel);
                    list.append(prevRow);
                }
                if (view.type === 'gallery') {
                    const sizeRow = document.createElement('label');
                    sizeRow.className = 'db-pop-field-row';
                    sizeRow.innerHTML = '<span>Card size</span>';
                    const sizeSel = document.createElement('select');
                    sizeSel.disabled = ro;
                    [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']].forEach(([k, l]) => {
                        const o = document.createElement('option');
                        o.value = k;
                        o.textContent = l;
                        sizeSel.append(o);
                    });
                    sizeSel.value = view.cardSize || 'medium';
                    sizeSel.onchange = () => { view.cardSize = sizeSel.value; persist(false); refreshAllDatabaseViews(); };
                    sizeRow.append(sizeSel);
                    list.append(sizeRow);
                }
                if (view.type === 'calendar' || view.type === 'timeline') {
                    const dateRow = document.createElement('label');
                    dateRow.className = 'db-pop-field-row';
                    dateRow.innerHTML = '<span>Date by</span>';
                    const dateSel = document.createElement('select');
                    dateSel.disabled = ro;
                    db.schema.filter(s => s.type === 'date').forEach(dp => {
                        const o = document.createElement('option');
                        o.value = dp.id;
                        o.textContent = dp.name;
                        dateSel.append(o);
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
                    ctSel.disabled = ro;
                    [['vertical_bar', 'Vertical bar'], ['horizontal_bar', 'Horizontal bar'], ['donut', 'Donut']].forEach(([k, l]) => {
                        const o = document.createElement('option');
                        o.value = k;
                        o.textContent = l;
                        ctSel.append(o);
                    });
                    ctSel.value = view.chartConfig.chartType;
                    ctSel.onchange = () => { view.chartConfig.chartType = ctSel.value; persist(false); refreshAllDatabaseViews(); };
                    ctRow.append(ctSel);
                    list.append(ctRow);
                    const xRow = document.createElement('label');
                    xRow.className = 'db-pop-field-row';
                    xRow.innerHTML = '<span>Group by</span>';
                    const xSel = document.createElement('select');
                    xSel.disabled = ro;
                    db.schema.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; xSel.append(o); });
                    xSel.value = view.chartConfig.xPropertyId;
                    xSel.onchange = () => { view.chartConfig.xPropertyId = xSel.value; persist(false); refreshAllDatabaseViews(); };
                    xRow.append(xSel);
                    list.append(xRow);
                }
                pop.append(list);
            };
            const renderRoot = () => {
                const ro = roMode(dbPage);
                const hostRo = isHostReadOnly(dbPage);
                const curDb = ensureDatabaseConfig(dbPage);
                pop.replaceChildren();
                pop.append(makePopSubHeader('View settings', close));
                const namePill = document.createElement('div');
                namePill.className = 'db-vs-name-pill';
                const vIco = document.createElement('span');
                vIco.className = 'db-vs-name-ico';
                vIco.textContent = viewMeta(view.type).icon;
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.className = 'db-vs-name-input';
                nameInput.value = view.name;
                nameInput.placeholder = 'View name';
                nameInput.disabled = ro;
                nameInput.oninput = () => { view.name = nameInput.value || 'View'; persist(false); };
                nameInput.onblur = () => refreshAllDatabaseViews();
                const infoBadge = document.createElement('span');
                infoBadge.className = 'db-vs-info-badge';
                infoBadge.textContent = 'ⓘ';
                infoBadge.title = `${getDatabaseRows(dbPage.id).length} rows · ${viewMeta(view.type).label}`;
                namePill.append(vIco, nameInput, infoBadge);
                pop.append(namePill);
                const menuList = document.createElement('div');
                menuList.className = 'db-pop-list db-vs-menu-list';
                const addMenuItem = (icon, label, rightText, onClick, cls = '', disabled = false) => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'db-pop-option-btn' + (cls ? ' ' + cls : '');
                    btn.disabled = disabled;
                    btn.innerHTML = `<span class="db-vs-item-left"><span class="db-prop-type-ico">${icon}</span><span>${escHtml(label)}</span></span><span class="db-pop-muted-chev">${rightText ? escHtml(rightText) + ' ' : ''}${rightText === '__no_chev__' ? '' : '›'}</span>`;
                    if (rightText === '__no_chev__') {
                        btn.querySelector('.db-pop-muted-chev').textContent = '';
                    }
                    btn.onclick = onClick;
                    menuList.append(btn);
                };
                const visNonTitle = view.visiblePropertyIds.filter(id => curDb.schema.some(s => s.id === id && s.type !== 'title')).length;
                const filterCnt = countFilterRules(view);
                const sortCnt = view.sorts.length;
                const grpName = view.groupBy ? (curDb.schema.find(s => s.id === view.groupBy)?.name || '') : '';
                const condCnt = (view.conditionalColors || []).filter(r => r && r.enabled !== false).length;
                addMenuItem(viewMeta(view.type).icon, 'Layout', viewMeta(view.type).label, () => renderLayoutPanel(renderRoot));
                addMenuItem('👁', 'Property visibility', String(visNonTitle), () => renderPropertiesPanel(pop, view, dbPage, close, renderRoot));
                addMenuItem('☷', 'Filter', filterCnt ? String(filterCnt) : '', () => renderFilterSettingsPanel(pop, view, dbPage, close, renderRoot));
                addMenuItem('⇅', 'Sort', sortCnt ? String(sortCnt) : '', () => renderSortPanel(pop, view, dbPage, close, renderRoot));
                addMenuItem('⊞', 'Group', grpName, () => renderGroupPanel(pop, view, dbPage, close, renderRoot));
                addMenuItem('🖌', 'Conditional color', condCnt ? String(condCnt) : '', () => renderConditionalColorPanel(pop, view, dbPage, close, renderRoot));
                addMenuItem('🔗', 'Copy link to view', '__no_chev__', () => { copyViewLink(dbPage, view); close(); });
                const sep1 = document.createElement('div');
                sep1.className = 'db-pop-section-head';
                sep1.innerHTML = '<span>Data source settings</span>';
                menuList.append(sep1);
                addMenuItem('⇄', 'Source', dbPage.title || 'Database', () => renderChangeSourcePanel(pop, dbPage, close, renderRoot, opts));
                addMenuItem('☰', 'Edit properties', '', () => renderEditPropertiesPanel(pop, view, dbPage, close, renderRoot));
                addMenuItem('⚡', 'Automations', (curDb.automations || []).length ? String(curDb.automations.length) : '', () => {
                    const rect = pop.getBoundingClientRect();
                    close();
                    openAutomationsPopover(rect, dbPage);
                }, '', ro);
                addMenuItem('↻', 'Turn into', '', () => renderTurnIntoPanel(pop, view, dbPage, close, renderRoot, opts));
                addMenuItem('•••', 'More settings', '', () => renderMoreSettingsPanel(pop, view, dbPage, close, renderRoot));
                const sep2 = document.createElement('div');
                sep2.className = 'db-pop-divider';
                menuList.append(sep2);
                addMenuItem('🗄', 'Manage data sources', '', () => renderManageSourcesPanel(pop, dbPage, close, renderRoot, opts));
                addMenuItem(curDb.locked ? '🔓' : '🔒', curDb.locked ? 'Unlock database' : 'Lock database', '__no_chev__', () => {
                    if (hostRo)
                        return;
                    curDb.locked = !curDb.locked;
                    persist(false);
                    refreshAllDatabaseViews();
                    host?.toast?.(curDb.locked ? 'Database locked' : 'Database unlocked');
                    renderRoot();
                }, curDb.locked ? 'is-locked-toggle' : '', hostRo);
                pop.append(menuList);
            };
            if (opts.initialPanel === 'properties')
                renderPropertiesPanel(pop, view, dbPage, close, renderRoot);
            else if (opts.initialPanel === 'group')
                renderGroupPanel(pop, view, dbPage, close, renderRoot);
            else if (opts.initialPanel === 'conditional_color')
                renderConditionalColorPanel(pop, view, dbPage, close, renderRoot);
            else if (opts.initialPanel === 'source')
                renderChangeSourcePanel(pop, dbPage, close, renderRoot, opts);
            else if (opts.initialPanel === 'more')
                renderMoreSettingsPanel(pop, view, dbPage, close, renderRoot);
            else if (opts.initialPanel === 'manage_sources')
                renderManageSourcesPanel(pop, dbPage, close, renderRoot, opts);
            else
                renderRoot();
        }, 305);
    }
    function openAddViewPopover(anchor, dbPage, onSelectView) {
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
                        if (!db.schema.some(s => s.type === 'date'))
                            addSchemaProperty(dbPage, 'Date', 'date');
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
    function openDatabaseRow(rowPage, dbPage, rowOrderIds, overrideMode) {
        if (!rowPage)
            return;
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
    function ensurePeekLayer() {
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
        if (!activePeek)
            return;
        const rowPage = getPageById(activePeek.rowId);
        const dbPage = getPageById(activePeek.dbPageId);
        if (!rowPage || !dbPage) {
            closeDatabasePeek();
            return;
        }
        const ro = roMode(dbPage);
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
                        }
                        else if (activePeek) {
                            activePeek.mode = m;
                            db.defaultOpenMode = m;
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
        const order = activePeek.rowOrder || getDatabaseRows(dbPage.id).map((r) => r.id);
        const curIdx = order.indexOf(rowPage.id);
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'db-toolbar-btn';
        prevBtn.textContent = '‹';
        prevBtn.title = 'Previous page';
        prevBtn.disabled = curIdx <= 0;
        prevBtn.onclick = () => {
            if (curIdx > 0)
                openDatabaseRow(getPageById(order[curIdx - 1]), dbPage, order, activePeek?.mode);
        };
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'db-toolbar-btn';
        nextBtn.textContent = '›';
        nextBtn.title = 'Next page';
        nextBtn.disabled = curIdx < 0 || curIdx >= order.length - 1;
        nextBtn.onclick = () => {
            if (curIdx >= 0 && curIdx < order.length - 1)
                openDatabaseRow(getPageById(order[curIdx + 1]), dbPage, order, activePeek?.mode);
        };
        const dbCrumb = document.createElement('span');
        dbCrumb.className = 'db-peek-crumb';
        dbCrumb.innerHTML = `${dbIconHtml(dbPage.icon, '🗃️')} <span>${escHtml(dbPage.title || 'Database')}</span>`;
        leftNav.append(modeBtn, fullBtn, tabBtn, prevBtn, nextBtn, dbCrumb);
        const rightNav = document.createElement('div');
        rightNav.className = 'db-peek-controls';
        if (!ro) {
            const favBtn = document.createElement('button');
            favBtn.type = 'button';
            favBtn.className = 'db-toolbar-btn';
            favBtn.textContent = rowPage.favorite ? '★' : '☆';
            favBtn.title = 'Toggle favorite';
            favBtn.onclick = () => { rowPage.favorite = !rowPage.favorite; persist(false); refreshAllDatabaseViews(); };
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'db-toolbar-btn is-danger';
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
        closeBtn.type = 'button';
        closeBtn.className = 'db-toolbar-btn';
        closeBtn.textContent = '✕';
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
        if (!ro)
            iconBtn.onclick = () => host?.iconPicker?.(rowPage);
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
                if (el.isConnected)
                    rerender();
            }
            host?.renderNav?.();
        });
        titleRow.append(iconBtn, titleInput);
        const propsSheet = renderRowDatabaseProperties(rowPage, dbPage, { inPeek: true });
        const bodyDivider = document.createElement('hr');
        bodyDivider.className = 'db-peek-divider';
        const bodyHost = document.createElement('div');
        bodyHost.className = 'db-peek-blocks';
        const blocks = rowPage.blocks || (rowPage.blocks = [{ id: uid(), type: 'text', text: '' }]);
        const drawBlocks = () => {
            bodyHost.replaceChildren();
            blocks.forEach((b, idx) => {
                const bRow = document.createElement('div');
                bRow.className = `db-peek-block db-peek-block-${b.type}`;
                if (b.type === 'todo') {
                    const cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.checked = !!b.checked;
                    cb.disabled = ro;
                    cb.onchange = () => { b.checked = cb.checked; rowPage.updatedAt = Date.now(); persist(false); };
                    bRow.append(cb);
                }
                else if (b.type === 'bullet') {
                    const bullet = document.createElement('span');
                    bullet.className = 'db-peek-bullet';
                    bullet.textContent = '•';
                    bRow.append(bullet);
                }
                else if (b.type === 'numbered') {
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
                                edits[idx + 1]?.focus();
                            });
                        }
                        else if (e.key === 'Backspace' && !ed.innerText.trim() && blocks.length > 1) {
                            e.preventDefault();
                            blocks.splice(idx, 1);
                            persist(false);
                            drawBlocks();
                            requestAnimationFrame(() => {
                                const edits = bodyHost.querySelectorAll('.db-peek-block-edit');
                                edits[Math.max(0, idx - 1)]?.focus();
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
        const subtasksPanel = renderPeekSubtasksSection(rowPage, dbPage, ro, () => renderPeekModal());
        scroll.append(titleRow, propsSheet, subtasksPanel, bodyDivider, bodyHost);
        panel.append(topbar, scroll);
        layer.append(backdrop, panel);
    }
    function renderPeekSubtasksSection(rowPage, dbPage, ro, rerenderPeek) {
        const db = ensureDatabaseConfig(dbPage);
        const parentProp = getParentPropForDb(dbPage);
        const parentIds = parentProp && Array.isArray(rowPage.propertyValues?.[parentProp.id]) ? rowPage.propertyValues[parentProp.id] : [];
        const subtasks = getSubtasksForRow(rowPage, dbPage);
        const doneCount = subtasks.filter((st) => isRowComplete(st, dbPage)).length;
        const keyProp = db.schema.find(s => s.type === 'unique_id');
        const statusProp = db.schema.find(s => s.type === 'status') || db.schema.find(s => s.type === 'select' && /phase|status/i.test(s.name || ''));
        const respProp = db.schema.find(s => s.type === 'person' && /responsible|assignee|owner/i.test(s.name || '')) || db.schema.find(s => s.type === 'person');
        const users = getState()?.users || [];
        const sec = document.createElement('section');
        sec.className = 'db-peek-subtasks';
        if (parentIds.length) {
            const parentBar = document.createElement('div');
            parentBar.className = 'db-peek-parent-bar';
            parentIds.forEach((pid) => {
                const parentRow = getPageById(pid);
                if (!parentRow)
                    return;
                const pBtn = document.createElement('button');
                pBtn.type = 'button';
                pBtn.className = 'db-peek-parent-link';
                const pKey = keyProp ? String(parentRow.propertyValues?.[keyProp.id] || '') : '';
                pBtn.innerHTML = `<span>↑ Parent quest:</span>${pKey ? `<code class="db-issue-key-chip">${escHtml(pKey)}</code>` : ''}<strong>${escHtml(parentRow.title || 'Untitled')}</strong>`;
                pBtn.onclick = () => openDatabaseRow(parentRow, dbPage);
                parentBar.append(pBtn);
            });
            if (parentBar.children.length)
                sec.append(parentBar);
        }
        const head = document.createElement('div');
        head.className = 'db-peek-subtasks-head';
        const pct = subtasks.length ? Math.round((doneCount / subtasks.length) * 100) : 0;
        head.innerHTML = `<div class="db-peek-subtasks-title"><span>↳ Subtasks</span><strong>${doneCount}/${subtasks.length}</strong>${subtasks.length ? `<div class="db-subtask-bar"><span style="width:${pct}%"></span></div><small>${pct}%</small>` : '<small>Break this quest down into Jira-ready sub-items</small>'}</div>`;
        sec.append(head);
        if (subtasks.length) {
            const list = document.createElement('div');
            list.className = 'db-peek-subtasks-list';
            subtasks.forEach((st) => {
                const item = document.createElement('div');
                const stDone = isRowComplete(st, dbPage);
                item.className = `db-peek-subtask-row${stDone ? ' is-done' : ''}`;
                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.className = 'db-peek-subtask-chk';
                chk.checked = stDone;
                chk.disabled = ro;
                chk.title = stDone ? 'Mark subtask incomplete' : 'Mark subtask done';
                chk.onchange = () => {
                    toggleRowComplete(st, dbPage, chk.checked);
                    rerenderPeek();
                };
                const stKey = keyProp ? String(st.propertyValues?.[keyProp.id] || '') : '';
                const openBtn = document.createElement('button');
                openBtn.type = 'button';
                openBtn.className = 'db-peek-subtask-open';
                openBtn.innerHTML = `${stKey ? `<code class="db-issue-key-chip">${escHtml(stKey)}</code>` : ''}<span>${escHtml(st.title || 'Untitled subtask')}</span>`;
                openBtn.onclick = () => openDatabaseRow(st, dbPage);
                const meta = document.createElement('div');
                meta.className = 'db-peek-subtask-meta';
                if (statusProp) {
                    const opt = resolveOption(statusProp, getRawValue(statusProp, st, dbPage));
                    if (opt)
                        meta.append(createPillEl(opt.name, opt.color, statusProp.type === 'status', opt.statusGroup));
                }
                if (respProp) {
                    const rawUsers = getRawValue(respProp, st, dbPage);
                    const arr = Array.isArray(rawUsers) ? rawUsers : (rawUsers ? [rawUsers] : []);
                    arr.slice(0, 2).forEach((uidVal) => meta.append(buildDbUserChip(uidVal, users)));
                }
                if (!ro) {
                    const del = document.createElement('button');
                    del.type = 'button';
                    del.className = 'db-mini-btn';
                    del.title = 'Delete subtask';
                    del.textContent = '×';
                    del.onclick = () => {
                        deleteDatabaseRow(st.id);
                        persist(false);
                        refreshAllDatabaseViews();
                        rerenderPeek();
                    };
                    meta.append(del);
                }
                item.append(chk, openBtn, meta);
                list.append(item);
            });
            sec.append(list);
        }
        if (!ro) {
            const addForm = document.createElement('form');
            addForm.className = 'db-peek-subtask-add';
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.className = 'db-peek-subtask-input';
            inp.placeholder = '＋ Add subtask… (inherits Project & Department)';
            const btn = document.createElement('button');
            btn.type = 'submit';
            btn.className = 'db-toolbar-btn';
            btn.textContent = 'Add subtask';
            addForm.onsubmit = ev => {
                ev.preventDefault();
                const val = inp.value.trim();
                if (!val)
                    return;
                createSubtaskForRow(rowPage, dbPage, val);
                rerenderPeek();
            };
            addForm.append(inp, btn);
            sec.append(addForm);
        }
        return sec;
    }
    function renderRowDatabaseProperties(rowPage, dbPage, opts = {}) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        const sheet = document.createElement('div');
        sheet.className = 'db-row-prop-sheet';
        const order = db.views[0]?.propertyOrder || db.schema.map(s => s.id);
        order.forEach(pid => {
            const prop = db.schema.find(s => s.id === pid);
            if (!prop || prop.type === 'title')
                return;
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
                if (opts.inPeek)
                    renderPeekModal();
                else
                    host?.render?.();
            });
            sheet.append(addProp);
        }
        return sheet;
    }
    // Group builder shared across Table (when groupBy active), Board, and List
    function buildGroupsForRows(rows, groupProp, dbPage, view, opts = {}) {
        if (!groupProp)
            return [{ key: '__all__', label: 'All pages', color: 'default', rows }];
        const groups = [];
        const byKey = new Map();
        const ensureBucket = (key, label, color = 'default', statusGroup) => {
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
        }
        else if (groupProp.type === 'multi_select') {
            (groupProp.options || []).forEach(o => ensureBucket(o.id, o.name, o.color));
            ensureBucket('__none__', `No ${groupProp.name}`, 'gray');
            rows.forEach(r => {
                const raw = getRawValue(groupProp, r, dbPage);
                const arr = Array.isArray(raw) ? raw : (raw ? [raw] : []);
                const matchedIds = new Set();
                arr.forEach((v) => {
                    const opt = resolveOption(groupProp, v);
                    if (opt && !matchedIds.has(opt.id)) {
                        matchedIds.add(opt.id);
                        ensureBucket(opt.id, opt.name, opt.color).rows.push(r);
                    }
                });
                if (!matchedIds.size)
                    byKey.get('__none__').rows.push(r);
            });
        }
        else if (groupProp.type === 'person') {
            (getState()?.users || []).forEach((u) => ensureBucket(u.id, u.name, 'blue'));
            ensureBucket('__none__', `No ${groupProp.name}`, 'gray');
            rows.forEach(r => {
                const raw = getRawValue(groupProp, r, dbPage);
                const ids = Array.isArray(raw) ? raw : (raw ? [String(raw)] : []);
                if (!ids.length)
                    byKey.get('__none__').rows.push(r);
                else
                    ids.forEach(uidVal => {
                        const u = (getState()?.users || []).find((x) => x.id === uidVal || x.name === uidVal);
                        ensureBucket(u?.id || uidVal, u?.name || uidVal, 'blue').rows.push(r);
                    });
            });
        }
        else if (groupProp.type === 'checkbox') {
            ensureBucket('true', 'Checked', 'green');
            ensureBucket('false', 'Unchecked', 'gray');
            rows.forEach(r => ensureBucket(getRawValue(groupProp, r, dbPage) ? 'true' : 'false', '', 'default').rows.push(r));
        }
        else {
            rows.forEach(r => {
                const txt = valueAsSearchText(groupProp, r, dbPage) || `No ${groupProp.name}`;
                ensureBucket(txt, txt, txt.startsWith('No ') ? 'gray' : 'blue').rows.push(r);
            });
            if (!groups.length)
                ensureBucket('__none__', `No ${groupProp.name}`, 'gray');
        }
        if (view?.groupSort === 'asc' || view?.groupSort === 'desc') {
            const dir = view.groupSort === 'desc' ? -1 : 1;
            groups.sort((a, b) => {
                if (a.key === '__none__' && b.key !== '__none__')
                    return 1;
                if (b.key === '__none__' && a.key !== '__none__')
                    return -1;
                return a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }) * dir;
            });
        }
        if (opts.includeHidden)
            return groups;
        const hiddenSet = new Set(view?.hiddenGroups || []);
        return groups.filter(g => !hiddenSet.has(g.key) && (!view?.hideEmptyGroups || g.rows.length > 0));
    }
    function assignGroupValueToRow(rowPage, groupProp, groupKey, dbPage) {
        if (!groupProp || groupKey === '__all__')
            return;
        if (groupKey === '__none__') {
            setRowValue(rowPage, groupProp, groupProp.type === 'person' || groupProp.type === 'multi_select' ? [] : '', dbPage, true);
            return;
        }
        if (groupProp.type === 'status' || groupProp.type === 'select') {
            setRowValue(rowPage, groupProp, groupKey, dbPage, true);
        }
        else if (groupProp.type === 'multi_select' || groupProp.type === 'person') {
            setRowValue(rowPage, groupProp, [groupKey], dbPage, true);
        }
        else if (groupProp.type === 'checkbox') {
            setRowValue(rowPage, groupProp, groupKey === 'true', dbPage, true);
        }
        else {
            setRowValue(rowPage, groupProp, groupKey, dbPage, true);
        }
    }
    // ==================== VIEW LAYOUT RENDERERS ====================
    function renderTableView(canvas, rows, view, dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        const cols = view.propertyOrder
            .filter(pid => view.visiblePropertyIds.includes(pid))
            .map(pid => db.schema.find(s => s.id === pid))
            .filter(Boolean);
        const scroll = document.createElement('div');
        scroll.className = 'db-table-scroll';
        const rowOrderIds = rows.map((r) => r.id);
        const groupProp = view.groupBy ? db.schema.find(s => s.id === view.groupBy) : undefined;
        const isGrouped = Boolean(groupProp);
        const groups = buildGroupsForRows(rows, groupProp, dbPage, view);
        const createColgroup = () => {
            const cg = document.createElement('colgroup');
            cols.forEach(col => {
                const c = document.createElement('col');
                const w = view.columnWidths?.[col.id] || col.width || (col.type === 'title' ? 250 : 155);
                c.style.width = `${w}px`;
                cg.append(c);
            });
            if (!ro) {
                const addCol = document.createElement('col');
                addCol.style.width = '42px';
                cg.append(addCol);
            }
            return cg;
        };
        const createThead = () => {
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
                        const startW = th.getBoundingClientRect().width;
                        const colEls = Array.from(scroll.querySelectorAll('table.db-table colgroup')).map(cg => cg.children[cIdx]);
                        const onMove = (ev) => {
                            const nextW = Math.max(90, Math.min(540, Math.round(startW + (ev.clientX - startX))));
                            view.columnWidths = view.columnWidths || {};
                            view.columnWidths[col.id] = nextW;
                            colEls.forEach(colEl => { if (colEl)
                                colEl.style.width = `${nextW}px`; });
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
            return thead;
        };
        const appendGroupRowsToTbody = (tbody, groupRows) => {
            const subEnabled = !!db.subItemsEnabled && !!db.parentPropertyId;
            const parentPropId = db.parentPropertyId || '';
            const groupIdSet = new Set(groupRows.map((r) => r.id));
            const childrenByParent = new Map();
            if (subEnabled) {
                groupRows.forEach(r => {
                    const pIds = Array.isArray(r.propertyValues?.[parentPropId]) ? r.propertyValues[parentPropId] : [];
                    const pid = pIds.find(x => groupIdSet.has(x) && x !== r.id);
                    if (pid) {
                        if (!childrenByParent.has(pid))
                            childrenByParent.set(pid, []);
                        childrenByParent.get(pid).push(r);
                    }
                });
            }
            const renderRowTree = (rowPage, treeDepth, seen) => {
                if (seen.has(rowPage.id))
                    return;
                seen.add(rowPage.id);
                const childRows = subEnabled ? (childrenByParent.get(rowPage.id) || []) : [];
                const subCollapsed = (view.collapsedSubItems || []).includes(rowPage.id);
                const cond = evaluateConditionalColor(view, rowPage, dbPage);
                const tr = document.createElement('tr');
                tr.className = 'db-tr' + (treeDepth > 0 ? ' is-subitem' : '');
                tr.dataset.rowId = rowPage.id;
                applyConditionalRowColor(tr, cond.rowColor);
                cols.forEach(col => {
                    const td = document.createElement('td');
                    td.className = 'db-td' + (col.type === 'title' ? ' is-title-col' : '');
                    const cellColor = cond.propColors.get(col.id);
                    if (cellColor && cellColor !== 'default')
                        td.dataset.cellColor = cellColor;
                    const ctrl = renderPropertyValueControl(col, rowPage, dbPage, {
                        compact: true,
                        onOpenRow: col.type === 'title' ? () => openDatabaseRow(rowPage, dbPage, rowOrderIds) : undefined
                    });
                    if (col.type === 'title' && subEnabled) {
                        const titleBox = ctrl.querySelector('.db-title-cell');
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
                                persist(false);
                                refreshAllDatabaseViews();
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
                                    persist(false);
                                    refreshAllDatabaseViews();
                                    requestAnimationFrame(() => {
                                        scroll.querySelector(`tr[data-row-id="${CSS.escape(child.id)}"] .db-title-input`)?.focus();
                                    });
                                };
                                titleBox.append(addSub);
                            }
                        }
                    }
                    if (col.type === 'title' && db.dependenciesPropertyId) {
                        const blockerIds = Array.isArray(rowPage.propertyValues?.[db.dependenciesPropertyId]) ? rowPage.propertyValues[db.dependenciesPropertyId] : [];
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
            const seen = new Set();
            const roots = subEnabled
                ? groupRows.filter(r => {
                    const pIds = Array.isArray(r.propertyValues?.[parentPropId]) ? r.propertyValues[parentPropId] : [];
                    return !pIds.some(x => groupIdSet.has(x) && x !== r.id);
                })
                : groupRows;
            roots.forEach(r => renderRowTree(r, 0, seen));
            groupRows.forEach(r => { if (!seen.has(r.id))
                renderRowTree(r, 0, seen); });
        };
        const appendNewRowTrigger = (tbody, presetGroupKey) => {
            if (ro)
                return;
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
                if (groupProp && presetGroupKey && presetGroupKey !== '__all__') {
                    assignGroupValueToRow(created, groupProp, presetGroupKey, dbPage);
                }
                persist(false);
                refreshAllDatabaseViews();
                requestAnimationFrame(() => {
                    const inp = scroll.querySelector(`tr[data-row-id="${CSS.escape(created.id)}"] .db-title-input`);
                    inp?.focus();
                });
            };
            newTd.append(addRowBtn);
            newTr.append(newTd);
            tbody.append(newTr);
        };
        const createCalcTfoot = (targetRows) => {
            const tfoot = document.createElement('tfoot');
            const footTr = document.createElement('tr');
            footTr.className = 'db-calc-row';
            cols.forEach(col => {
                const td = document.createElement('td');
                td.className = 'db-calc-td';
                const calcType = view.calculations?.[col.id] || 'none';
                const val = calcType !== 'none' ? computeAggregation(col, targetRows, calcType, dbPage) : '';
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'db-calc-btn' + (calcType !== 'none' ? ' has-calc' : '');
                if (calcType !== 'none') {
                    const label = DB_AGGREGATIONS.find(a => a.key === calcType)?.label || '';
                    btn.innerHTML = `<span class="db-calc-label">${escHtml(label)}</span> <strong>${escHtml(val)}</strong>`;
                }
                else {
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
                                    persist(false);
                                    refreshAllDatabaseViews();
                                    close();
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
            return tfoot;
        };
        if (!isGrouped) {
            const table = document.createElement('table');
            table.className = 'db-table' + (view.wrapCells ? ' is-wrap' : '');
            table.append(createColgroup(), createThead());
            const tbody = document.createElement('tbody');
            appendGroupRowsToTbody(tbody, groups[0]?.rows || []);
            appendNewRowTrigger(tbody);
            table.append(tbody, createCalcTfoot(rows));
            scroll.append(table);
        }
        else if (!groups.length) {
            const empty = document.createElement('div');
            empty.className = 'db-empty-state';
            empty.textContent = 'No groups to display in this view.';
            if (!ro) {
                const showBtn = document.createElement('button');
                showBtn.type = 'button';
                showBtn.className = 'db-toolbar-btn';
                showBtn.textContent = 'Reset hidden/empty groups';
                showBtn.onclick = () => {
                    view.hiddenGroups = [];
                    view.hideEmptyGroups = false;
                    persist(false);
                    refreshAllDatabaseViews();
                };
                empty.append(showBtn);
            }
            scroll.append(empty);
        }
        else {
            let renderedExpandedHeader = false;
            groups.forEach(group => {
                const collapsed = (view.collapsedGroups || []).includes(group.key);
                const gBlock = document.createElement('div');
                gBlock.className = 'db-table-group-block' + (collapsed ? ' is-collapsed' : '');
                const gHead = document.createElement('div');
                gHead.className = 'db-table-group-row';
                const left = document.createElement('div');
                left.className = 'db-group-head-left';
                const toggle = document.createElement('button');
                toggle.type = 'button';
                toggle.className = 'db-group-toggle';
                toggle.textContent = collapsed ? '▸' : '▾';
                toggle.onclick = () => {
                    view.collapsedGroups = view.collapsedGroups || [];
                    view.collapsedGroups = collapsed ? view.collapsedGroups.filter(x => x !== group.key) : [...view.collapsedGroups, group.key];
                    persist(false);
                    refreshAllDatabaseViews();
                };
                left.append(toggle, createPillEl(group.label, group.color, groupProp.type === 'status', group.statusGroup));
                if (view.showGroupCounts !== false) {
                    const count = document.createElement('span');
                    count.className = 'db-group-count';
                    count.textContent = String(group.rows.length);
                    left.append(count);
                }
                const gActions = document.createElement('div');
                gActions.className = 'db-group-head-actions';
                if (!ro) {
                    const moreBtn = document.createElement('button');
                    moreBtn.type = 'button';
                    moreBtn.className = 'db-mini-btn';
                    moreBtn.textContent = '⋯';
                    moreBtn.title = 'Group options';
                    moreBtn.onclick = () => {
                        openDbPopover(moreBtn, (pop, close) => {
                            const tog = document.createElement('button');
                            tog.type = 'button';
                            tog.className = 'db-pop-option-btn';
                            tog.textContent = collapsed ? 'Expand group' : 'Collapse group';
                            tog.onclick = () => { toggle.click(); close(); };
                            const hide = document.createElement('button');
                            hide.type = 'button';
                            hide.className = 'db-pop-option-btn';
                            hide.textContent = 'Hide group';
                            hide.onclick = () => {
                                view.hiddenGroups = [...new Set([...(view.hiddenGroups || []), group.key])];
                                persist(false);
                                refreshAllDatabaseViews();
                                close();
                            };
                            const cfg = document.createElement('button');
                            cfg.type = 'button';
                            cfg.className = 'db-pop-option-btn';
                            cfg.textContent = 'Group settings…';
                            cfg.onclick = () => { close(); openGroupPopover(moreBtn, view, dbPage); };
                            pop.append(tog, hide, cfg);
                        }, 190);
                    };
                    const plusBtn = document.createElement('button');
                    plusBtn.type = 'button';
                    plusBtn.className = 'db-mini-btn';
                    plusBtn.textContent = '＋';
                    plusBtn.title = `New page in ${group.label}`;
                    plusBtn.onclick = () => {
                        view.collapsedGroups = (view.collapsedGroups || []).filter(x => x !== group.key);
                        const created = createDatabaseRow(dbPage, {});
                        assignGroupValueToRow(created, groupProp, group.key, dbPage);
                        persist(false);
                        refreshAllDatabaseViews();
                        requestAnimationFrame(() => {
                            scroll.querySelector(`tr[data-row-id="${CSS.escape(created.id)}"] .db-title-input`)?.focus();
                        });
                    };
                    gActions.append(moreBtn, plusBtn);
                }
                gHead.append(left, gActions);
                gBlock.append(gHead);
                if (!collapsed) {
                    renderedExpandedHeader = true;
                    const gTable = document.createElement('table');
                    gTable.className = 'db-table db-table-grouped' + (view.wrapCells ? ' is-wrap' : '');
                    gTable.append(createColgroup(), createThead());
                    const gTbody = document.createElement('tbody');
                    appendGroupRowsToTbody(gTbody, group.rows);
                    appendNewRowTrigger(gTbody, group.key);
                    gTable.append(gTbody, createCalcTfoot(group.rows));
                    gBlock.append(gTable);
                }
                scroll.append(gBlock);
            });
            if (!renderedExpandedHeader) {
                const hdrTable = document.createElement('table');
                hdrTable.className = 'db-table db-table-grouped';
                hdrTable.append(createColgroup(), createThead());
                scroll.prepend(hdrTable);
            }
        }
        canvas.append(scroll);
    }
    function cardPreviewMarkup(rowPage, dbPage, previewMode) {
        if (!previewMode || previewMode === 'none')
            return null;
        const box = document.createElement('div');
        box.className = 'db-card-preview';
        if (previewMode === 'cover' && (rowPage.cover || rowPage.coverAssetId)) {
            if (rowPage.cover)
                box.style.backgroundImage = `url("${rowPage.cover}")`;
            if (rowPage.coverAssetId && typeof ArchitectBackend !== 'undefined') {
                const coverAsset = ArchitectBackend.readAssetCatalog().find((a) => a.id === rowPage.coverAssetId);
                if (coverAsset) {
                    ArchitectBackend.resolveAssetPreviewUrl(coverAsset).then((url) => {
                        if (url && box.isConnected)
                            box.style.backgroundImage = `url("${url}")`;
                    }).catch(() => { });
                }
            }
            box.classList.add('has-image');
            return box;
        }
        const textPreview = (rowPage.blocks || []).map((b) => b.text).filter(Boolean).join(' ').trim();
        if (previewMode === 'files') {
            const db = ensureDatabaseConfig(dbPage);
            const fileProp = db.schema.find(s => s.type === 'files');
            const files = fileProp ? (getRawValue(fileProp, rowPage, dbPage) || []) : [];
            if (files.length) {
                box.textContent = files.map((f) => `📎 ${f.name}`).join('\n');
                return box;
            }
        }
        if (textPreview) {
            box.textContent = textPreview.slice(0, 120);
            return box;
        }
        return null;
    }
    function wireRowTrigger(el, rowPage, dbPage, rowOrderIds) {
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
        el.addEventListener('mousedown', e => { if (e.button === 1)
            e.preventDefault(); });
        el.addEventListener('auxclick', e => {
            if (e.button === 1) {
                e.preventDefault();
                e.stopPropagation();
                host?.openPageInNewTab?.(rowPage.id);
            }
        });
    }
    function buildRowCard(rowPage, view, dbPage, rowOrderIds, opts = {}) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        const cond = evaluateConditionalColor(view, rowPage, dbPage);
        const card = document.createElement('div');
        card.className = 'db-card';
        applyConditionalRowColor(card, cond.rowColor);
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
        if (previewEl)
            card.append(previewEl);
        const titleLine = document.createElement('div');
        titleLine.className = 'db-card-title';
        titleLine.innerHTML = `${dbIconHtml(rowPage.icon)} <span>${escHtml(rowPage.title || 'Untitled')}</span>`;
        card.append(titleLine);
        if (view.showPropertiesOnCards !== false) {
            const propsWrap = document.createElement('div');
            propsWrap.className = 'db-card-props';
            view.propertyOrder.forEach(pid => {
                if (!view.visiblePropertyIds.includes(pid))
                    return;
                const prop = db.schema.find(s => s.id === pid);
                if (!prop || prop.type === 'title' || isValueEmpty(prop, rowPage, dbPage))
                    return;
                const item = document.createElement('div');
                item.className = 'db-card-prop-line';
                const val = renderPropertyValueControl(prop, rowPage, dbPage, { compact: true });
                item.append(val);
                propsWrap.append(item);
            });
            if (propsWrap.children.length)
                card.append(propsWrap);
        }
        const subtasks = getSubtasksForRow(rowPage, dbPage);
        if (subtasks.length) {
            const doneCount = subtasks.filter((st) => isRowComplete(st, dbPage)).length;
            const pct = Math.round((doneCount / subtasks.length) * 100);
            const subBadge = document.createElement('div');
            subBadge.className = `db-card-subtasks-pill${doneCount === subtasks.length ? ' is-all-done' : ''}`;
            subBadge.innerHTML = `<span>↳ ${doneCount}/${subtasks.length} subtasks</span><span class="db-card-subtasks-track"><span style="width:${pct}%"></span></span>`;
            card.append(subBadge);
        }
        return card;
    }
    function renderBoardView(canvas, rows, view, dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        const groupProp = db.schema.find(s => s.id === view.groupBy) || db.schema.find(s => ['status', 'select', 'multi_select', 'person', 'checkbox'].includes(s.type));
        if (!groupProp) {
            const empty = document.createElement('div');
            empty.className = 'db-empty-state';
            empty.textContent = 'Board views require a Status, Select, Person, or Checkbox property to group by.';
            canvas.append(empty);
            return;
        }
        const groups = buildGroupsForRows(rows, groupProp, dbPage, view);
        const rowOrderIds = rows.map((r) => r.id);
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
                    const initial = {};
                    if (group.key !== '__none__')
                        initial[groupProp.id] = groupProp.type === 'person' ? [group.key] : groupProp.type === 'checkbox' ? group.key === 'true' : group.key;
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
                    const initial = {};
                    if (group.key !== '__none__')
                        initial[groupProp.id] = groupProp.type === 'person' ? [group.key] : groupProp.type === 'checkbox' ? group.key === 'true' : group.key;
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
                        if (!name)
                            return;
                        groupProp.options = groupProp.options || [];
                        groupProp.options.push({
                            id: uid(),
                            name,
                            color: DB_COLORS[(groupProp.options.length % (DB_COLORS.length - 1)) + 1].key,
                            statusGroup: groupProp.type === 'status' ? 'in_progress' : undefined
                        });
                        persist(false);
                        refreshAllDatabaseViews();
                        close();
                    };
                    saveBtn.onclick = create;
                    inp.onkeydown = e => { if (e.key === 'Enter') {
                        e.preventDefault();
                        create();
                    } };
                    pop.append(inp, saveBtn);
                    requestAnimationFrame(() => inp.focus());
                }, 210);
            };
            addGroupCol.append(btn);
            board.append(addGroupCol);
        }
        canvas.append(board);
    }
    function renderListView(canvas, rows, view, dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
        const listWrap = document.createElement('div');
        listWrap.className = 'db-list-view';
        const rowOrderIds = rows.map((r) => r.id);
        const props = view.propertyOrder
            .filter(pid => view.visiblePropertyIds.includes(pid))
            .map(pid => db.schema.find(s => s.id === pid))
            .filter(p => p && p.type !== 'title');
        const groupProp = view.groupBy ? db.schema.find(s => s.id === view.groupBy) : undefined;
        const groups = buildGroupsForRows(rows, groupProp, dbPage, view);
        groups.forEach(group => {
            if (groupProp) {
                const gh = document.createElement('div');
                gh.className = 'db-list-group-head';
                gh.append(createPillEl(group.label, group.color, groupProp.type === 'status', group.statusGroup));
                if (view.showGroupCounts !== false) {
                    const cnt = document.createElement('span');
                    cnt.className = 'db-group-count';
                    cnt.textContent = String(group.rows.length);
                    gh.append(cnt);
                }
                listWrap.append(gh);
            }
            group.rows.forEach(r => {
                const row = document.createElement('div');
                row.className = 'db-list-item';
                row.dataset.rowId = r.id;
                applyConditionalRowColor(row, evaluateConditionalColor(view, r, dbPage).rowColor);
                const left = document.createElement('button');
                left.type = 'button';
                left.className = 'db-list-title';
                left.innerHTML = `${dbIconHtml(r.icon)} <span>${escHtml(r.title || 'Untitled')}</span>`;
                wireRowTrigger(left, r, dbPage, rowOrderIds);
                const right = document.createElement('div');
                right.className = 'db-list-props';
                props.forEach(p => {
                    if (isValueEmpty(p, r, dbPage))
                        return;
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
                persist(false);
                refreshAllDatabaseViews();
                openDatabaseRow(created, dbPage);
            };
            listWrap.append(add);
        }
        canvas.append(listWrap);
    }
    function renderGalleryView(canvas, rows, view, dbPage) {
        const ro = roMode(dbPage);
        const rowOrderIds = rows.map((r) => r.id);
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
                persist(false);
                refreshAllDatabaseViews();
                openDatabaseRow(created, dbPage);
            };
            grid.append(addCard);
        }
        canvas.append(grid);
    }
    function renderCalendarView(canvas, rows, view, dbPage, hostKey) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
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
                    persist(false);
                    refreshAllDatabaseViews();
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
        const rowOrderIds = rows.map((r) => r.id);
        const calHead = document.createElement('div');
        calHead.className = 'db-cal-header';
        const monthLabel = document.createElement('strong');
        monthLabel.textContent = monthStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        const nav = document.createElement('div');
        nav.className = 'db-cal-nav';
        const shiftMonth = (delta) => {
            const next = new Date(year, month - 1 + delta, 1);
            view.calendarMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
            persist(false);
            refreshAllDatabaseViews();
        };
        const prevM = document.createElement('button');
        prevM.type = 'button';
        prevM.className = 'db-toolbar-btn';
        prevM.textContent = '‹';
        prevM.title = 'Previous Month';
        prevM.onclick = () => shiftMonth(-1);
        const todayB = document.createElement('button');
        todayB.type = 'button';
        todayB.className = 'db-toolbar-btn';
        todayB.textContent = 'Today';
        todayB.onclick = () => { view.calendarMonth = new Date().toISOString().slice(0, 7); persist(false); refreshAllDatabaseViews(); };
        const nextM = document.createElement('button');
        nextM.type = 'button';
        nextM.className = 'db-toolbar-btn';
        nextM.textContent = '›';
        nextM.title = 'Next Month';
        nextM.onclick = () => shiftMonth(1);
        const noDateRows = rows.filter((r) => !dateTextOf(getRawValue(dateProp, r, dbPage)));
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
                cell.ondragover = e => { if (e.dataTransfer?.types.includes('application/x-db-row')) {
                    e.preventDefault();
                    cell.classList.add('is-drag-over');
                } };
                cell.ondragleave = () => cell.classList.remove('is-drag-over');
                cell.ondrop = e => {
                    e.preventDefault();
                    cell.classList.remove('is-drag-over');
                    const rid = e.dataTransfer?.getData('application/x-db-row');
                    const rp = rid ? getPageById(rid) : null;
                    if (rp) {
                        setRowValue(rp, dateProp, { start: iso }, dbPage, true);
                    }
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
                    const created = createDatabaseRow(dbPage, { [dateProp.id]: { start: iso } });
                    persist(false);
                    refreshAllDatabaseViews();
                    openDatabaseRow(created, dbPage);
                };
                dayHead.append(plus);
            }
            cell.append(dayHead);
            const events = rows.filter(r => {
                const rv = getRawValue(dateProp, r, dbPage);
                const start = (typeof rv === 'object' ? rv?.start : String(rv || '')).slice(0, 10);
                const end = (typeof rv === 'object' ? rv?.end : '').slice(0, 10) || start;
                return !!start && iso >= start && iso <= end;
            });
            events.forEach(ev => {
                const pill = document.createElement('button');
                pill.type = 'button';
                pill.className = 'db-cal-pill';
                applyConditionalRowColor(pill, evaluateConditionalColor(view, ev, dbPage).rowColor);
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
    function renderTimelineView(canvas, rows, view, dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        const ro = roMode(dbPage);
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
        const rowOrderIds = rows.map((r) => r.id);
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
            const o = document.createElement('option');
            o.value = k;
            o.textContent = l;
            zoomSel.append(o);
        });
        zoomSel.value = view.timelineZoom || 'week';
        zoomSel.onchange = () => { view.timelineZoom = zoomSel.value; persist(false); refreshAllDatabaseViews(); };
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
        const dayIsos = [];
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
            const cond = evaluateConditionalColor(view, r, dbPage);
            const row = document.createElement('div');
            row.className = 'db-timeline-row';
            row.style.gridTemplateColumns = `190px 1fr`;
            applyConditionalRowColor(row, cond.rowColor);
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
                    applyConditionalRowColor(bar, cond.rowColor);
                    bar.style.left = `${leftPct}%`;
                    bar.style.width = `${Math.max(4, rightPct - leftPct)}%`;
                    bar.textContent = r.title || 'Untitled';
                    wireRowTrigger(bar, r, dbPage, rowOrderIds);
                    track.append(bar);
                }
            }
            else if (!ro) {
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
    function renderChartView(canvas, rows, view, dbPage) {
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
            const stops = [];
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
        }
        else if (cfg.chartType === 'horizontal_bar') {
            const list = document.createElement('div');
            list.className = 'db-hbar-list';
            series.forEach(s => {
                const row = document.createElement('div');
                row.className = 'db-hbar-row';
                row.innerHTML = `<span class="db-hbar-lbl">${escHtml(s.label)}</span><div class="db-hbar-track"><div class="db-hbar-fill" style="width:${(s.value / maxVal) * 100}%;background:${s.color}"></div></div><strong>${s.value}</strong>`;
                list.append(row);
            });
            chartBox.append(list);
        }
        else {
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
    function renderFeedView(canvas, rows, view, dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        const feed = document.createElement('div');
        feed.className = 'db-feed-list';
        const rowOrderIds = rows.map((r) => r.id);
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
            const bodyTxt = (r.blocks || []).map((b) => b.text).filter(Boolean).join('\n').trim();
            const body = document.createElement('p');
            body.className = 'db-feed-body';
            body.textContent = bodyTxt.slice(0, 240) || 'No content yet.';
            const tags = document.createElement('div');
            tags.className = 'db-card-props';
            view.propertyOrder.forEach(pid => {
                if (!view.visiblePropertyIds.includes(pid))
                    return;
                const p = db.schema.find(s => s.id === pid);
                if (!p || p.type === 'title' || isValueEmpty(p, r, dbPage))
                    return;
                tags.append(renderPropertyValueControl(p, r, dbPage, { compact: true }));
            });
            card.append(meta, h, body);
            if (tags.children.length)
                card.append(tags);
            feed.append(card);
        });
        canvas.append(feed);
    }
    const FORM_EXCLUDED_PROP_TYPES = new Set([
        'created_time', 'created_by', 'last_edited_time', 'last_edited_by',
        'formula', 'rollup', 'unique_id', 'button', 'person', 'checkbox'
    ]);
    const FORM_QUESTION_TYPES = [
        { type: 'text', label: 'Short / Long text', icon: '¶' },
        { type: 'number', label: 'Number', icon: '#' },
        { type: 'select', label: 'Select', icon: '▾' },
        { type: 'date', label: 'Date', icon: '📅' },
        { type: 'email', label: 'Email', icon: '@' },
        { type: 'phone', label: 'Phone', icon: '☎' },
        { type: 'url', label: 'URL', icon: '🔗' },
        { type: 'files', label: 'Upload', icon: '📎' },
        { type: 'relation', label: 'Relation', icon: '↗' }
    ];
    const PHONE_DIAL_COUNTRIES = [
        { code: '+1', iso: 'US/CA', name: 'United States / Canada', flag: '🇺🇸' },
        { code: '+44', iso: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
        { code: '+49', iso: 'DE', name: 'Germany', flag: '🇩🇪' },
        { code: '+43', iso: 'AT', name: 'Austria', flag: '🇦🇹' },
        { code: '+41', iso: 'CH', name: 'Switzerland', flag: '🇨🇭' },
        { code: '+33', iso: 'FR', name: 'France', flag: '🇫🇷' },
        { code: '+34', iso: 'ES', name: 'Spain', flag: '🇪🇸' },
        { code: '+39', iso: 'IT', name: 'Italy', flag: '🇮🇹' },
        { code: '+31', iso: 'NL', name: 'Netherlands', flag: '🇳🇱' },
        { code: '+32', iso: 'BE', name: 'Belgium', flag: '🇧🇪' },
        { code: '+45', iso: 'DK', name: 'Denmark', flag: '🇩🇰' },
        { code: '+46', iso: 'SE', name: 'Sweden', flag: '🇸🇪' },
        { code: '+47', iso: 'NO', name: 'Norway', flag: '🇳🇴' },
        { code: '+358', iso: 'FI', name: 'Finland', flag: '🇫🇮' },
        { code: '+48', iso: 'PL', name: 'Poland', flag: '🇵🇱' },
        { code: '+351', iso: 'PT', name: 'Portugal', flag: '🇵🇹' },
        { code: '+353', iso: 'IE', name: 'Ireland', flag: '🇮🇪' },
        { code: '+420', iso: 'CZ', name: 'Czechia', flag: '🇨🇿' },
        { code: '+61', iso: 'AU', name: 'Australia', flag: '🇦🇺' },
        { code: '+64', iso: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
        { code: '+81', iso: 'JP', name: 'Japan', flag: '🇯🇵' },
        { code: '+82', iso: 'KR', name: 'South Korea', flag: '🇰🇷' },
        { code: '+65', iso: 'SG', name: 'Singapore', flag: '🇸🇬' },
        { code: '+91', iso: 'IN', name: 'India', flag: '🇮🇳' },
        { code: '+55', iso: 'BR', name: 'Brazil', flag: '🇧🇷' },
        { code: '+52', iso: 'MX', name: 'Mexico', flag: '🇲🇽' },
        { code: '+86', iso: 'CN', name: 'China', flag: '🇨🇳' },
        { code: '+971', iso: 'AE', name: 'UAE', flag: '🇦🇪' }
    ];
    const PHONE_DIAL_BY_LENGTH = [...PHONE_DIAL_COUNTRIES].sort((a, b) => b.code.length - a.code.length);
    const PHONE_BY_ISO = new Map();
    PHONE_DIAL_COUNTRIES.forEach(c => {
        if (c.iso === 'US/CA') {
            PHONE_BY_ISO.set('US', c);
            PHONE_BY_ISO.set('CA', c);
        }
        else {
            PHONE_BY_ISO.set(c.iso.toUpperCase(), c);
        }
    });
    PHONE_BY_ISO.set('UK', PHONE_BY_ISO.get('GB'));
    function detectPhoneCountry(raw) {
        const trimmed = String(raw || '').trim();
        if (!trimmed)
            return null;
        // 1. Supported ISO prefixes: "DE 0151...", "DE-0151...", "(DE) 0151..."
        const isoMatch = /^(?:\(([A-Za-z]{2})\)\s*|([A-Za-z]{2})(?:[\s-]+))(.+)$/.exec(trimmed);
        if (isoMatch) {
            const isoKey = (isoMatch[1] || isoMatch[2] || '').toUpperCase();
            const restDigits = (isoMatch[3] || '').replace(/\D/g, '').length;
            const found = PHONE_BY_ISO.get(isoKey);
            if (found) {
                return {
                    viable: restDigits >= 4,
                    hasPrefix: true,
                    recognized: true,
                    ...found,
                    subscriberDigits: restDigits
                };
            }
            return { viable: false, hasPrefix: false, recognized: false, code: '', iso: isoKey, name: '', flag: '', subscriberDigits: restDigits };
        }
        // 2. Supported numeric dial prefixes: "+49 0151...", "(+49) 0151...", "0049 0151..."
        let plusNormalized = '';
        if (trimmed.startsWith('+')) {
            plusNormalized = trimmed;
        }
        else if (/^\(\+\d{1,4}\)/.test(trimmed)) {
            plusNormalized = trimmed.replace(/^\((\+\d{1,4})\)/, '$1');
        }
        else if (/^00\d{1,4}[\s-]/.test(trimmed)) {
            plusNormalized = '+' + trimmed.slice(2);
        }
        if (!plusNormalized) {
            return { viable: false, hasPrefix: false, recognized: false, code: '', iso: '', name: '', flag: '', subscriberDigits: trimmed.replace(/\D/g, '').length };
        }
        const compact = '+' + plusNormalized.slice(1).replace(/[\s().-]+/g, '');
        const exact = PHONE_DIAL_BY_LENGTH.find(c => compact.startsWith(c.code));
        if (exact) {
            const restDigits = Math.max(0, compact.length - exact.code.length);
            return {
                viable: restDigits >= 4,
                hasPrefix: true,
                recognized: true,
                ...exact,
                subscriberDigits: restDigits
            };
        }
        const m = /^(\+\d{1,3})(\d*)$/.exec(compact);
        if (m) {
            const restDigits = m[2].length;
            return {
                viable: restDigits >= 5,
                hasPrefix: true,
                recognized: false,
                code: m[1],
                iso: 'INTL',
                name: `International (${m[1]})`,
                flag: '🌐',
                subscriberDigits: restDigits
            };
        }
        return { viable: false, hasPrefix: false, recognized: false, code: '', iso: '', name: '', flag: '', subscriberDigits: 0 };
    }
    function renderQuestionMarkdownHtml(raw) {
        const src = String(raw || '').trim();
        if (!src)
            return '<span class="db-form-q-md-empty">Untitled question</span>';
        const formatInline = (text) => {
            let s = escHtml(text);
            s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
            s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
            s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
            s = s.replace(/_([^_]+)_/g, '<em>$1</em>');
            s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            return s;
        };
        const hMatch = /^(#{1,3})\s+(.+)$/.exec(src);
        if (hMatch) {
            const lvl = hMatch[1].length;
            return `<span class="db-form-q-md-h${lvl}">${formatInline(hMatch[2])}</span>`;
        }
        return formatInline(src);
    }
    function sanitizeFormRichHtml(raw) {
        const temp = document.createElement('div');
        temp.innerHTML = String(raw || '');
        const allowedTags = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'CODE', 'BR', 'SPAN']);
        const walk = (node) => {
            Array.from(node.childNodes).forEach(child => {
                if (child.nodeType === Node.TEXT_NODE)
                    return;
                if (child.nodeType === Node.ELEMENT_NODE) {
                    const el = child;
                    if (!allowedTags.has(el.tagName)) {
                        const frag = document.createDocumentFragment();
                        while (el.firstChild)
                            frag.append(el.firstChild);
                        node.replaceChild(frag, el);
                        walk(node);
                        return;
                    }
                    Array.from(el.attributes).forEach(attr => el.removeAttribute(attr.name));
                    walk(el);
                }
                else {
                    child.remove();
                }
            });
        };
        walk(temp);
        return temp.innerHTML;
    }
    function stripFormHtml(html) {
        if (!html)
            return '';
        const d = document.createElement('div');
        d.innerHTML = html;
        return (d.textContent || '').replace(/\u00a0/g, ' ').trim();
    }
    const activeFormControllers = new Map();
    function readFormAssetsByKind(kind) {
        const backend = typeof ArchitectBackend !== 'undefined' ? ArchitectBackend : window.ArchitectBackend;
        const catalog = backend?.readAssetCatalog?.() || [];
        if (kind === 'image') {
            return catalog.filter(a => a && (a.fileType?.startsWith('image/') || a.category === 'image' || a.category === 'concept' || a.category === 'illustration'));
        }
        return catalog.filter(a => a && (a.fileType?.startsWith('audio/') || a.category === 'music' || a.category === 'sfx'));
    }
    async function resolveFormAssetUrl(asset) {
        if (!asset)
            return '';
        try {
            const backend = typeof ArchitectBackend !== 'undefined' ? ArchitectBackend : window.ArchitectBackend;
            const fn = backend?.resolveAssetOriginalUrl;
            if (typeof fn === 'function') {
                const resolved = await fn(asset);
                if (resolved)
                    return resolved;
            }
        }
        catch { }
        return asset.url || asset.previewDataUrl || '';
    }
    function getDefaultFormButtonConfig(kind = 'submit', cfg) {
        if (kind === 'download') {
            return {
                kind: 'download',
                label: 'Download response',
                bgColor: '#f3f4f6',
                textColor: '#1f2328',
                borderColor: '#d0d7de',
                radius: 8,
                align: 'left',
                fontFamily: 'inherit',
                icon: '↓'
            };
        }
        if (kind === 'send_email') {
            return {
                kind: 'send_email',
                label: 'Send response to my mail',
                bgColor: '#eff6ff',
                textColor: '#1d4ed8',
                borderColor: '#bfdbfe',
                radius: 8,
                align: 'left',
                fontFamily: 'inherit',
                icon: '✉'
            };
        }
        if (kind === 'custom') {
            return {
                kind: 'custom',
                label: 'Custom Action',
                bgColor: '#37352f',
                textColor: '#ffffff',
                borderColor: '#37352f',
                radius: 8,
                align: 'left',
                fontFamily: 'inherit',
                icon: '✦',
                customUrl: '',
                actionNote: 'Custom button action triggered'
            };
        }
        return {
            kind: 'submit',
            label: cfg?.submitLabel || 'Submit',
            bgColor: '#2383e2',
            textColor: '#ffffff',
            borderColor: '#2383e2',
            radius: 8,
            align: 'left',
            fontFamily: 'inherit',
            icon: '✓'
        };
    }
    function ensureFormConfig(dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        if (db.formUploadsToAssets === undefined)
            db.formUploadsToAssets = true;
        if (!db.formUploadsFolder)
            db.formUploadsFolder = 'form-uploads';
        let formView = db.views.find(v => v.type === 'form');
        if (!formView) {
            formView = buildDefaultView(db.schema, 'form', 'Form');
            db.views.unshift(formView);
        }
        formView.formConfig = formView.formConfig || {};
        const cfg = formView.formConfig;
        cfg.requiredPropertyIds = Array.isArray(cfg.requiredPropertyIds) ? cfg.requiredPropertyIds : [];
        cfg.hiddenPropertyIds = Array.isArray(cfg.hiddenPropertyIds) ? cfg.hiddenPropertyIds : [];
        cfg.allowSubmitAnotherResponse = cfg.allowSubmitAnotherResponse !== false;
        if (cfg.allowSendToEmail === undefined) {
            cfg.allowSendToEmail = cfg.allowViewResponse !== undefined ? Boolean(cfg.allowViewResponse) : true;
        }
        cfg.containerStyle = cfg.containerStyle === 'loose' ? 'loose' : 'outlined';
        cfg.backgroundMode = cfg.backgroundMode || 'default';
        cfg.backgroundColorEnabled = true;
        cfg.backgroundColor = cfg.backgroundColor || '#f4f6fb';
        if (cfg.backgroundImageOpacity === undefined || !Number.isFinite(Number(cfg.backgroundImageOpacity))) {
            cfg.backgroundImageOpacity = 1;
        }
        if (!cfg.questionCardBgColor)
            cfg.questionCardBgColor = '#ffffff';
        if (cfg.questionCardBgOpacity === undefined || !Number.isFinite(Number(cfg.questionCardBgOpacity))) {
            cfg.questionCardBgOpacity = 1;
        }
        if (!cfg.questionCardOutlineColor)
            cfg.questionCardOutlineColor = 'default';
        if (!cfg.musicReleaseStatus)
            cfg.musicReleaseStatus = 'unreleased';
        if (!Array.isArray(cfg.musicTracks)) {
            cfg.musicTracks = (cfg.musicAssetId || cfg.musicUrl || cfg.musicName)
                ? [{
                        assetId: cfg.musicAssetId || '',
                        name: cfg.musicName || 'Track 1',
                        url: cfg.musicUrl || '',
                        releaseStatus: cfg.musicReleaseStatus || 'unreleased',
                        spotifyUrl: cfg.musicSpotifyUrl || ''
                    }]
                : [];
        }
        cfg.submissionPermissions = cfg.submissionPermissions || 'workspace';
        const eligibleProps = db.schema.filter(s => !FORM_EXCLUDED_PROP_TYPES.has(s.type));
        const propById = new Map(db.schema.map(s => [s.id, s]));
        const eligibleIds = new Set(eligibleProps.map(s => s.id));
        if (!Array.isArray(cfg.questions))
            cfg.questions = [];
        cfg.questions = cfg.questions.filter(q => eligibleIds.has(q.propertyId) && !cfg.hiddenPropertyIds.includes(q.propertyId));
        const coveredPropIds = new Set(cfg.questions.map(q => q.propertyId));
        eligibleProps.forEach(prop => {
            if (coveredPropIds.has(prop.id))
                return;
            if (cfg.hiddenPropertyIds.includes(prop.id) && prop.type !== 'title')
                return;
            cfg.questions.push({
                id: uid(),
                propertyId: prop.id,
                label: prop.name,
                required: prop.type === 'title' || cfg.requiredPropertyIds.includes(prop.id),
                displayMode: (prop.type === 'multi_select' || prop.type === 'select') ? 'list' : undefined,
                maxSelections: prop.type === 'select' ? 1 : undefined,
                maxSizeMb: prop.type === 'files' ? 10 : undefined
            });
        });
        cfg.questions.forEach(q => {
            const prop = propById.get(q.propertyId);
            if (prop?.type === 'title')
                q.required = true;
            else if (q.required === undefined && cfg.requiredPropertyIds.includes(q.propertyId))
                q.required = true;
            if (q.limitOne && q.maxSelections === undefined)
                q.maxSelections = 1;
            if (prop?.type === 'files' && !(Number(q.maxSizeMb) > 0))
                q.maxSizeMb = 10;
        });
        cfg.requiredPropertyIds = Array.from(new Set(cfg.questions.filter(q => q.required).map(q => q.propertyId)));
        return { db, formView, cfg };
    }
    function syncFormQuestionOrderFromBlocks(dbPage, formStateOverride) {
        if (!dbPage || !Array.isArray(dbPage.blocks))
            return false;
        const { cfg } = formStateOverride || ensureFormConfig(dbPage);
        const byQId = new Map(cfg.questions.map(q => [q.id, q]));
        const ordered = [];
        const seen = new Set();
        const visit = (blocks) => {
            blocks.forEach((b) => {
                if (!b)
                    return;
                if (b.type === 'form_question' && b.questionId && byQId.has(b.questionId) && !seen.has(b.questionId)) {
                    ordered.push(byQId.get(b.questionId));
                    seen.add(b.questionId);
                }
                if (b.type === 'columns' && Array.isArray(b.columns)) {
                    b.columns.forEach((col) => { if (Array.isArray(col))
                        visit(col); });
                }
                if (Array.isArray(b.children))
                    visit(b.children);
            });
        };
        visit(dbPage.blocks);
        cfg.questions.forEach(q => { if (!seen.has(q.id))
            ordered.push(q); });
        const orderChanged = ordered.length !== cfg.questions.length || ordered.some((q, idx) => q.id !== cfg.questions[idx]?.id);
        if (orderChanged)
            cfg.questions = ordered;
        cfg.requiredPropertyIds = Array.from(new Set(cfg.questions.filter(q => q.required).map(q => q.propertyId)));
        return orderChanged;
    }
    function removePropertyFromDatabase(dbPage, propId) {
        const db = ensureDatabaseConfig(dbPage);
        db.schema = db.schema.filter(s => s.id !== propId);
        db.views.forEach(v => {
            v.visiblePropertyIds = v.visiblePropertyIds.filter(id => id !== propId);
            v.propertyOrder = v.propertyOrder.filter(id => id !== propId);
            v.filters = v.filters.filter(f => f.propertyId !== propId);
            v.sorts = v.sorts.filter(s => s.propertyId !== propId);
            if (v.groupBy === propId)
                v.groupBy = undefined;
        });
        if (isFormPage(dbPage)) {
            syncFormDocBlocks(dbPage);
        }
    }
    function syncFormDocBlocks(dbPage, formStateOverride) {
        if (!dbPage)
            return false;
        const { db, cfg } = formStateOverride || ensureFormConfig(dbPage);
        let changed = false;
        if (!Array.isArray(dbPage.blocks)) {
            dbPage.blocks = [];
            changed = true;
        }
        const schemaIds = new Set(db.schema.filter(s => !FORM_EXCLUDED_PROP_TYPES.has(s.type)).map(s => s.id));
        const hiddenSet = new Set(cfg.hiddenPropertyIds || []);
        const validQIds = new Set(cfg.questions
            .filter(q => schemaIds.has(q.propertyId) && !hiddenSet.has(q.propertyId))
            .map(q => q.id));
        const seenQIds = new Set();
        const hasBlockQ = (blocks) => blocks.some(b => {
            if (!b)
                return false;
            if (b.type === 'form_question' && b.questionId && validQIds.has(b.questionId))
                return true;
            if (b.type === 'columns' && Array.isArray(b.columns))
                return b.columns.some((c) => Array.isArray(c) && hasBlockQ(c));
            return Array.isArray(b.children) && hasBlockQ(b.children);
        });
        // Migrate legacy cfg.blocks into Doc blocks only if Doc blocks don't contain form_question yet
        if (!hasBlockQ(dbPage.blocks) && Array.isArray(cfg.blocks) && cfg.blocks.length) {
            changed = true;
            const migrated = [];
            cfg.blocks.forEach(lb => {
                if (!lb)
                    return;
                if (lb.kind === 'question' && lb.questionId && validQIds.has(lb.questionId) && !seenQIds.has(lb.questionId)) {
                    const q = cfg.questions.find(x => x.id === lb.questionId);
                    migrated.push({ id: uid(), type: 'form_question', questionId: q.id, propertyId: q.propertyId });
                    seenQIds.add(q.id);
                }
                else if (lb.kind !== 'question') {
                    const plain = stripFormHtml(lb.html);
                    if (lb.kind === 'divider')
                        migrated.push({ id: uid(), type: 'divider', text: '' });
                    else if (plain)
                        migrated.push({ id: uid(), type: lb.kind === 'bullet' ? 'bullet' : lb.kind, text: plain });
                }
            });
            const stripAllInvalidQuestions = (blocks) => blocks.filter(b => {
                if (!b || b.type === 'form_question')
                    return false;
                if (b.type === 'columns' && Array.isArray(b.columns)) {
                    b.columns = b.columns.map((c) => Array.isArray(c) ? stripAllInvalidQuestions(c) : []);
                }
                if (Array.isArray(b.children))
                    b.children = stripAllInvalidQuestions(b.children);
                return true;
            });
            const existingNonEmpty = stripAllInvalidQuestions(dbPage.blocks).filter((b) => b.type !== 'text' || String(b.text || '').trim());
            dbPage.blocks = [...existingNonEmpty, ...migrated];
        }
        else {
            const filterInvalidQuestions = (blocks) => {
                let arrChanged = false;
                const next = [];
                for (const b of blocks) {
                    if (!b) {
                        arrChanged = true;
                        continue;
                    }
                    if (b.type === 'form_question') {
                        if (!b.questionId || !validQIds.has(b.questionId) || seenQIds.has(b.questionId)) {
                            arrChanged = true;
                            continue;
                        }
                        seenQIds.add(b.questionId);
                    }
                    if (b.type === 'columns' && Array.isArray(b.columns)) {
                        b.columns = b.columns.map((c) => Array.isArray(c) ? filterInvalidQuestions(c) : []);
                    }
                    if (Array.isArray(b.children))
                        b.children = filterInvalidQuestions(b.children);
                    next.push(b);
                }
                if (arrChanged)
                    changed = true;
                return arrChanged ? next : blocks;
            };
            dbPage.blocks = filterInvalidQuestions(dbPage.blocks);
        }
        const insertMissingBeforeButton = (nb) => {
            const submitIdx = dbPage.blocks.findIndex((b) => b?.type === 'form_button');
            if (submitIdx >= 0)
                dbPage.blocks.splice(submitIdx, 0, nb);
            else
                dbPage.blocks.push(nb);
        };
        cfg.questions.forEach(q => {
            if (!seenQIds.has(q.id)) {
                changed = true;
                insertMissingBeforeButton({ id: uid(), type: 'form_question', questionId: q.id, propertyId: q.propertyId });
                seenQIds.add(q.id);
            }
        });
        if (isFormPage(dbPage) && !dbPage.blocks.some((b) => b?.type === 'form_button')) {
            changed = true;
            dbPage.blocks.push({
                id: uid(),
                type: 'form_button',
                text: '',
                formButtonConfig: getDefaultFormButtonConfig('submit', cfg)
            });
        }
        if (syncFormQuestionOrderFromBlocks(dbPage, { cfg }))
            changed = true;
        return changed;
    }
    function addFormQuestionBlock(dbPage, type = 'text', insertAfterBlockIdOrIndex) {
        if (!dbPage)
            return null;
        if (type === 'person' || type === 'checkbox' || type === 'select')
            type = 'multi_select';
        const { db, cfg } = ensureFormConfig(dbPage);
        const nextNum = cfg.questions.length + 1;
        const baseLabel = type === 'files' ? `Upload file ${nextNum}` : `Question ${nextNum}`;
        const newProp = {
            id: uid(),
            name: baseLabel,
            type,
            width: 170
        };
        if (type === 'select' || type === 'multi_select') {
            newProp.options = [
                { id: uid(), name: 'Option 1', color: 'blue' },
                { id: uid(), name: 'Option 2', color: 'yellow' }
            ];
        }
        db.schema.push(newProp);
        db.views.forEach(v => {
            if (!v.propertyOrder.includes(newProp.id))
                v.propertyOrder.push(newProp.id);
            if (!v.visiblePropertyIds.includes(newProp.id))
                v.visiblePropertyIds.push(newProp.id);
        });
        const newQ = {
            id: uid(),
            propertyId: newProp.id,
            label: baseLabel,
            required: false,
            displayMode: type === 'multi_select' ? 'list' : undefined,
            maxSizeMb: type === 'files' ? 10 : undefined
        };
        cfg.questions.push(newQ);
        const newBlock = {
            id: uid(),
            type: 'form_question',
            questionId: newQ.id,
            propertyId: newProp.id
        };
        if (!Array.isArray(dbPage.blocks))
            dbPage.blocks = [];
        if (typeof insertAfterBlockIdOrIndex === 'number' && insertAfterBlockIdOrIndex >= 0 && insertAfterBlockIdOrIndex <= dbPage.blocks.length) {
            dbPage.blocks.splice(insertAfterBlockIdOrIndex, 0, newBlock);
        }
        else if (typeof insertAfterBlockIdOrIndex === 'string' && insertAfterBlockIdOrIndex) {
            const idx = dbPage.blocks.findIndex((b) => b?.id === insertAfterBlockIdOrIndex);
            if (idx >= 0)
                dbPage.blocks.splice(idx + 1, 0, newBlock);
            else {
                const submitIdx = dbPage.blocks.findIndex((b) => b?.type === 'form_button');
                if (submitIdx >= 0)
                    dbPage.blocks.splice(submitIdx, 0, newBlock);
                else
                    dbPage.blocks.push(newBlock);
            }
        }
        else {
            const submitIdx = dbPage.blocks.findIndex((b) => b?.type === 'form_button');
            if (submitIdx >= 0)
                dbPage.blocks.splice(submitIdx, 0, newBlock);
            else
                dbPage.blocks.push(newBlock);
        }
        syncFormDocBlocks(dbPage, { db, cfg });
        return { prop: newProp, question: newQ, block: newBlock };
    }
    function deleteFormQuestionBlock(dbPage, questionId, blockId) {
        if (!dbPage)
            return;
        const { cfg } = ensureFormConfig(dbPage);
        const targetQ = questionId ? cfg.questions.find(x => x.id === questionId) : null;
        if (targetQ && questionId) {
            cfg.questions = cfg.questions.filter(x => x.id !== questionId);
            cfg.questions.forEach(other => {
                if (other.condition?.parentQuestionId === questionId)
                    other.condition = null;
            });
            cfg.hiddenPropertyIds = [...new Set([...(cfg.hiddenPropertyIds || []), targetQ.propertyId])];
            cfg.blocks = (cfg.blocks || []).filter(x => x.questionId !== questionId);
        }
        const stripBlocks = (blocks) => blocks.filter(b => {
            if (!b)
                return false;
            if (b.type === 'form_question') {
                if ((blockId && b.id === blockId) || (questionId && b.questionId === questionId))
                    return false;
            }
            if (b.type === 'columns' && Array.isArray(b.columns)) {
                b.columns = b.columns.map((c) => Array.isArray(c) ? stripBlocks(c) : []);
            }
            if (Array.isArray(b.children))
                b.children = stripBlocks(b.children);
            return true;
        });
        if (Array.isArray(dbPage.blocks)) {
            dbPage.blocks = stripBlocks(dbPage.blocks);
        }
        cfg.requiredPropertyIds = Array.from(new Set(cfg.questions.filter(q => q.required).map(q => q.propertyId)));
    }
    function duplicateFormQuestionBlock(dbPage, questionIdOrBlockId) {
        if (!dbPage)
            return null;
        const { db, cfg } = ensureFormConfig(dbPage);
        const srcQ = cfg.questions.find(x => x.id === questionIdOrBlockId)
            || (() => {
                const blk = (dbPage.blocks || []).find((b) => b?.id === questionIdOrBlockId);
                return blk ? cfg.questions.find(x => x.id === blk.questionId) : null;
            })();
        if (!srcQ)
            return null;
        const prop = db.schema.find(s => s.id === srcQ.propertyId);
        if (!prop || prop.type === 'title')
            return null;
        const dupProp = structuredCloneSafe(prop);
        dupProp.id = uid();
        dupProp.name = `${prop.name} (copy)`;
        db.schema.push(dupProp);
        db.views.forEach(v => {
            if (!v.propertyOrder.includes(dupProp.id))
                v.propertyOrder.push(dupProp.id);
            if (!v.visiblePropertyIds.includes(dupProp.id))
                v.visiblePropertyIds.push(dupProp.id);
        });
        const dupQ = {
            ...structuredCloneSafe(srcQ),
            id: uid(),
            propertyId: dupProp.id,
            label: `${srcQ.label || prop.name} (copy)`,
            condition: null
        };
        const qIdx = cfg.questions.findIndex(x => x.id === srcQ.id);
        cfg.questions.splice(qIdx + 1, 0, dupQ);
        const dupBlock = { id: uid(), type: 'form_question', questionId: dupQ.id, propertyId: dupProp.id };
        if (Array.isArray(dbPage.blocks)) {
            const bIdx = dbPage.blocks.findIndex((b) => b?.type === 'form_question' && b.questionId === srcQ.id);
            if (bIdx >= 0)
                dbPage.blocks.splice(bIdx + 1, 0, dupBlock);
            else
                dbPage.blocks.push(dupBlock);
        }
        syncFormDocBlocks(dbPage);
        return { prop: dupProp, question: dupQ, block: dupBlock };
    }
    function evaluateFormCondition(_dbPage, _q, _draftRow) {
        // Conditional logic UI is temporarily disabled (tracked in TODO.md)
        return true;
    }
    function describeFormCondition(dbPage, cond) {
        if (!cond?.parentQuestionId)
            return '';
        const { db, cfg } = ensureFormConfig(dbPage);
        const pQ = cfg.questions.find(x => x.id === cond.parentQuestionId);
        const pProp = pQ ? db.schema.find(s => s.id === pQ.propertyId) : null;
        if (!pQ || !pProp)
            return 'Conditional rule';
        const pTitle = pQ.label || pProp.name || 'Question';
        if (pProp.type === 'checkbox') {
            const wantChecked = cond.operator ? cond.operator === 'is_checked' : (cond.values || []).includes('true');
            return `When “${pTitle}” is ${wantChecked ? 'checked' : 'unchecked'}`;
        }
        const names = (cond.values || [])
            .map(oid => pProp.options?.find(o => o.id === oid)?.name || oid)
            .filter(Boolean);
        return `When “${pTitle}” is ${names.length ? names.join(', ') : '(select option)'}`;
    }
    function openFormConditionPopover(anchor, dbPage, q, onDone) {
        const { db, cfg } = ensureFormConfig(dbPage);
        const idx = cfg.questions.findIndex(x => x.id === q.id);
        const eligibleParents = cfg.questions.slice(0, idx).filter(pq => {
            const p = db.schema.find(s => s.id === pq.propertyId);
            return p && ['select', 'multi_select', 'status'].includes(p.type);
        });
        openDbPopover(anchor, (pop, close) => {
            pop.classList.add('db-form-logic-popover');
            const head = document.createElement('div');
            head.className = 'db-pop-header';
            head.innerHTML = '<strong>Conditional logic</strong>';
            pop.append(head);
            if (!eligibleParents.length) {
                const empty = document.createElement('div');
                empty.className = 'db-pop-hint';
                empty.textContent = 'Add a Select or Multi-select question above this question to branch on its answer.';
                pop.append(empty);
                return;
            }
            const curParentId = q.condition?.parentQuestionId || eligibleParents[0].id;
            const pSel = document.createElement('select');
            pSel.className = 'db-pop-select';
            eligibleParents.forEach(pq => {
                const pp = db.schema.find(s => s.id === pq.propertyId);
                const opt = document.createElement('option');
                opt.value = pq.id;
                opt.textContent = `Show if: ${pq.label || pp?.name || 'Question'}`;
                pSel.append(opt);
            });
            pSel.value = eligibleParents.some(pq => pq.id === curParentId) ? curParentId : eligibleParents[0].id;
            const valuesWrap = document.createElement('div');
            valuesWrap.className = 'db-form-logic-values';
            const drawConditionValues = () => {
                valuesWrap.replaceChildren();
                const pq = eligibleParents.find(x => x.id === pSel.value);
                const pp = pq ? db.schema.find(s => s.id === pq.propertyId) : null;
                if (!pq || !pp)
                    return;
                if (!q.condition || q.condition.parentQuestionId !== pq.id) {
                    q.condition = {
                        parentQuestionId: pq.id,
                        operator: 'equals',
                        values: pp.options?.[0] ? [pp.options[0].id] : []
                    };
                }
                (pp.options || []).forEach(opt => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    const active = (q.condition?.values || []).includes(opt.id);
                    btn.className = 'db-form-chip-toggle' + (active ? ' is-active' : '');
                    btn.textContent = `${active ? '✓ ' : ''}${opt.name}`;
                    btn.onclick = () => {
                        const cur = q.condition?.values || [];
                        const next = cur.includes(opt.id) ? cur.filter(x => x !== opt.id) : [...cur, opt.id];
                        q.condition = { parentQuestionId: pq.id, operator: pp.type === 'multi_select' ? 'contains_any' : 'equals', values: next };
                        persist(false);
                        drawConditionValues();
                    };
                    valuesWrap.append(btn);
                });
            };
            pSel.onchange = () => {
                q.condition = null;
                drawConditionValues();
                persist(false);
            };
            drawConditionValues();
            const actions = document.createElement('div');
            actions.className = 'db-form-logic-actions';
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'secondary-button';
            clearBtn.textContent = 'Clear rule';
            clearBtn.onclick = () => {
                q.condition = null;
                persist(false);
                close();
                onDone();
            };
            const applyBtn = document.createElement('button');
            applyBtn.type = 'button';
            applyBtn.className = 'primary-button';
            applyBtn.textContent = 'Done';
            applyBtn.onclick = () => {
                persist(false);
                close();
                onDone();
            };
            actions.append(clearBtn, applyBtn);
            pop.append(pSel, valuesWrap, actions);
        }, 280);
    }
    function renderFormDesignPanel(panel, dbPage, opts) {
        const { db, cfg } = ensureFormConfig(dbPage);
        const onUpdated = opts.onUpdated;
        const onClose = opts.onClose;
        panel.replaceChildren();
        const head = document.createElement('header');
        head.className = 'form-design-sidebar-head';
        const titleWrap = document.createElement('div');
        titleWrap.className = 'form-design-sidebar-title';
        titleWrap.innerHTML = '<strong>Design &amp; Settings</strong><span>Form appearance, Soul Atlas Radio &amp; publish</span>';
        const closeTopBtn = document.createElement('button');
        closeTopBtn.type = 'button';
        closeTopBtn.className = 'icon-button form-design-close-btn';
        closeTopBtn.dataset.formAction = 'close-settings';
        closeTopBtn.setAttribute('aria-label', 'Close design settings');
        closeTopBtn.title = 'Close Design & Settings';
        closeTopBtn.textContent = '×';
        closeTopBtn.onclick = () => onClose();
        head.append(titleWrap, closeTopBtn);
        panel.append(head);
        const body = document.createElement('div');
        body.className = 'form-design-sidebar-body';
        panel.append(body);
        const linkBox = document.createElement('div');
        linkBox.className = 'db-form-share-row';
        const linkInp = document.createElement('input');
        linkInp.type = 'text';
        linkInp.readOnly = true;
        linkInp.className = 'db-pop-input';
        linkInp.value = formShareUrl(dbPage.id);
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'primary-button';
        copyBtn.dataset.formAction = 'copy-link';
        copyBtn.textContent = 'Copy link';
        copyBtn.onclick = () => {
            try {
                navigator.clipboard?.writeText(linkInp.value);
            }
            catch { }
            copyBtn.textContent = 'Copied!';
            host?.toast?.('Form responder link copied to clipboard');
            setTimeout(() => { if (copyBtn.isConnected)
                copyBtn.textContent = 'Copy link'; }, 1200);
        };
        linkBox.append(linkInp, copyBtn);
        body.append(linkBox);
        const mkSectionTitle = (title) => {
            const el = document.createElement('div');
            el.className = 'db-form-settings-sec-title';
            el.textContent = title;
            body.append(el);
        };
        const settingCheckboxes = new Map();
        const mkToggle = (label, checked, testKey, onChange) => {
            const row = document.createElement('label');
            row.className = 'db-form-setting-toggle';
            const span = document.createElement('span');
            span.textContent = label;
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = checked;
            cb.dataset.formSetting = testKey;
            settingCheckboxes.set(testKey, cb);
            cb.onchange = () => { onChange(cb.checked); persist(false); onUpdated(); };
            row.append(span, cb);
            body.append(row);
        };
        // 1. Custom Subdomain & Published Site
        mkSectionTitle('Publish & Custom Subdomain');
        mkToggle('Publish form on custom subdomain', !!cfg.publishedSiteEnabled, 'published-site', v => {
            cfg.publishedSiteEnabled = v;
            if (v)
                dbPage.published = true;
        });
        const subRow = document.createElement('div');
        subRow.className = 'db-form-setting-field';
        subRow.innerHTML = '<label>Custom subdomain slug</label>';
        const subSlugInp = document.createElement('input');
        subSlugInp.type = 'text';
        subSlugInp.className = 'db-pop-input';
        subSlugInp.placeholder = 'e.g. player-feedback';
        subSlugInp.dataset.formSetting = 'subdomain';
        subSlugInp.value = cfg.subdomain || '';
        const subPreview = document.createElement('div');
        subPreview.className = 'db-form-subdomain-preview';
        subPreview.dataset.formSubdomainUrl = 'true';
        const refreshSubPreview = () => {
            const u = formSubdomainUrl(cfg.subdomain);
            subPreview.textContent = u ? `Live endpoint: ${u}` : 'Enter a slug to bind a custom team subdomain.';
        };
        refreshSubPreview();
        subSlugInp.oninput = () => {
            cfg.subdomain = sanitizeSubdomainSlug(subSlugInp.value);
            if (cfg.subdomain && !cfg.publishedSiteEnabled) {
                cfg.publishedSiteEnabled = true;
                dbPage.published = true;
                const pubCb = settingCheckboxes.get('published-site');
                if (pubCb)
                    pubCb.checked = true;
            }
            refreshSubPreview();
            persist(false);
            onUpdated();
        };
        subRow.append(subSlugInp, subPreview);
        body.append(subRow);
        // 2. Site Design, Surface, Always-On Background Color + Cropped Image + Opacity + Question Blocks Styling
        mkSectionTitle('Surface & Background');
        const surfRow = document.createElement('div');
        surfRow.className = 'db-form-setting-field';
        surfRow.innerHTML = '<label>Surface layout</label>';
        const surfSeg = document.createElement('div');
        surfSeg.className = 'db-form-seg-group';
        ['outlined', 'loose'].forEach(mode => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'db-form-seg-btn' + (cfg.containerStyle === mode ? ' is-active' : '');
            btn.dataset.formDesignSurface = mode;
            btn.textContent = mode === 'outlined' ? '▢ Outlined card' : '✦ Loose on background';
            btn.onclick = () => {
                cfg.containerStyle = mode;
                surfSeg.querySelectorAll('.db-form-seg-btn').forEach(x => x.classList.remove('is-active'));
                btn.classList.add('is-active');
                persist(false);
                onUpdated();
            };
            surfSeg.append(btn);
        });
        surfRow.append(surfSeg);
        body.append(surfRow);
        const bgRow = document.createElement('div');
        bgRow.className = 'db-form-setting-field';
        bgRow.innerHTML = '<label>Canvas background (color + optional cropped image)</label>';
        const bgControls = document.createElement('div');
        bgControls.className = 'db-form-bg-stack';
        const openBgCropper = (srcUrl) => {
            const targetUrl = srcUrl || cfg.backgroundImageUrl || '';
            if (!targetUrl || !host?.openFormCropper)
                return;
            const aspectInfo = host.getFormCanvasCropAspect?.() || { aspect: 0.85, label: 'Form canvas aspect based on length' };
            host.openFormCropper({
                title: 'Crop Form Background Image',
                subtitle: 'Select the image region matching your current form length.',
                src: targetUrl,
                aspectRatio: aspectInfo.aspect,
                dimensionLabel: aspectInfo.label,
                initialX: cfg.backgroundCropX ?? 50,
                initialY: cfg.backgroundCropY ?? 50,
                initialZoom: cfg.backgroundCropZoom ?? 100,
                previewKind: 'background',
                backgroundColor: cfg.backgroundColor || '#f4f6fb',
                backgroundOpacity: cfg.backgroundImageOpacity ?? 1,
                onApply: (crop) => {
                    cfg.backgroundMode = 'image';
                    cfg.backgroundCropX = crop.x;
                    cfg.backgroundCropY = crop.y;
                    cfg.backgroundCropZoom = crop.zoom;
                    cfg.backgroundCropAspect = crop.aspect;
                    persist(false);
                    onUpdated();
                }
            });
        };
        const drawBgControls = () => {
            bgControls.replaceChildren();
            // Background color is always active behind any image or alone when no image is set
            const clrCard = document.createElement('div');
            clrCard.className = 'db-form-bg-subcard';
            const clrRow = document.createElement('div');
            clrRow.className = 'db-form-inline-row db-form-bg-color-row';
            const clrTxt = document.createElement('span');
            clrTxt.className = 'db-form-bg-sub-lbl';
            clrTxt.textContent = 'Background color';
            const clrInp = document.createElement('input');
            clrInp.type = 'color';
            clrInp.dataset.formBgColor = 'true';
            clrInp.value = cfg.backgroundColor || '#f4f6fb';
            const hexLbl = document.createElement('code');
            hexLbl.className = 'db-form-hex-pill';
            hexLbl.textContent = clrInp.value;
            const clrReset = document.createElement('button');
            clrReset.type = 'button';
            clrReset.className = 'secondary-button db-form-mini-reset-btn';
            clrReset.dataset.formBgColorReset = 'true';
            clrReset.textContent = 'Reset';
            clrInp.oninput = () => {
                cfg.backgroundColor = clrInp.value;
                cfg.backgroundColorEnabled = true;
                if (!cfg.backgroundImageUrl && !cfg.backgroundAssetId)
                    cfg.backgroundMode = 'color';
                hexLbl.textContent = clrInp.value;
                persist(false);
                onUpdated();
            };
            clrReset.onclick = () => {
                cfg.backgroundColor = '#f4f6fb';
                cfg.backgroundColorEnabled = true;
                clrInp.value = '#f4f6fb';
                hexLbl.textContent = '#f4f6fb';
                if (!cfg.backgroundImageUrl && !cfg.backgroundAssetId)
                    cfg.backgroundMode = 'default';
                persist(false);
                onUpdated();
            };
            clrRow.append(clrTxt, clrInp, hexLbl, clrReset);
            clrCard.append(clrRow);
            bgControls.append(clrCard);
            // Background image + crop + opacity control (works simultaneously over color)
            const imgCard = document.createElement('div');
            imgCard.className = 'db-form-bg-subcard';
            const imgs = readFormAssetsByKind('image');
            const imgSel = document.createElement('select');
            imgSel.className = 'db-pop-select';
            imgSel.dataset.formBgAssetSelect = 'true';
            imgSel.innerHTML = `<option value="">Pick image from Asset Management…</option>${imgs.map(a => `<option value="${escHtml(a.id)}">${escHtml(a.name)}</option>`).join('')}`;
            imgSel.value = cfg.backgroundAssetId || '';
            const applyPickedBgImage = async (asset) => {
                if (!asset)
                    return;
                const resolved = await resolveFormAssetUrl(asset);
                cfg.backgroundMode = 'image';
                cfg.backgroundAssetId = asset.id;
                cfg.backgroundImageUrl = resolved;
                cfg.backgroundCropX = 50;
                cfg.backgroundCropY = 50;
                cfg.backgroundCropZoom = 100;
                cfg.backgroundCropAspect = host?.getFormCanvasCropAspect?.()?.aspect;
                drawBgControls();
                persist(false);
                onUpdated();
                openBgCropper(resolved);
            };
            imgSel.onchange = async () => {
                const asset = imgs.find(a => a.id === imgSel.value);
                if (!asset)
                    return;
                await applyPickedBgImage(asset);
            };
            const actRow = document.createElement('div');
            actRow.className = 'db-form-inline-row';
            if (host?.pickAsset) {
                const pickBtn = document.createElement('button');
                pickBtn.type = 'button';
                pickBtn.className = 'secondary-button';
                pickBtn.textContent = '🖼 Library';
                pickBtn.onclick = () => {
                    host.pickAsset({
                        focusId: cfg.backgroundAssetId || null,
                        label: 'Use as Form Background',
                        onSelect: async (asset) => applyPickedBgImage(asset)
                    });
                };
                actRow.append(pickBtn);
            }
            const upLbl = document.createElement('label');
            upLbl.className = 'secondary-button file-select';
            upLbl.textContent = '↑ Upload';
            const upInp = document.createElement('input');
            upInp.type = 'file';
            upInp.accept = 'image/*';
            upInp.hidden = true;
            upInp.dataset.formBgUpload = 'true';
            upInp.onchange = async () => {
                const file = upInp.files?.[0];
                if (!file || !host?.ingestLocalFile)
                    return;
                const rec = await host.ingestLocalFile(file, { creator: actorName(), tags: ['form-background'] });
                if (rec)
                    await applyPickedBgImage(rec);
            };
            upLbl.append(upInp);
            actRow.append(upLbl);
            const hasImage = !!(cfg.backgroundImageUrl || cfg.backgroundAssetId);
            const cropBtn = document.createElement('button');
            cropBtn.type = 'button';
            cropBtn.className = 'secondary-button';
            cropBtn.dataset.formBgCrop = 'true';
            cropBtn.textContent = '✂ Crop';
            cropBtn.disabled = !hasImage;
            cropBtn.onclick = async () => {
                let u = cfg.backgroundImageUrl || '';
                if (!u && cfg.backgroundAssetId) {
                    const asset = imgs.find(a => a.id === cfg.backgroundAssetId);
                    if (asset)
                        u = await resolveFormAssetUrl(asset);
                }
                if (u)
                    openBgCropper(u);
            };
            actRow.append(cropBtn);
            if (hasImage) {
                const clrImgBtn = document.createElement('button');
                clrImgBtn.type = 'button';
                clrImgBtn.className = 'secondary-button';
                clrImgBtn.dataset.formBgClearImage = 'true';
                clrImgBtn.textContent = '× Clear';
                clrImgBtn.onclick = () => {
                    cfg.backgroundAssetId = '';
                    cfg.backgroundImageUrl = '';
                    cfg.backgroundCropX = undefined;
                    cfg.backgroundCropY = undefined;
                    cfg.backgroundCropZoom = undefined;
                    cfg.backgroundCropAspect = undefined;
                    cfg.backgroundMode = cfg.backgroundColor && cfg.backgroundColor.toLowerCase() !== '#f4f6fb' ? 'color' : 'default';
                    drawBgControls();
                    persist(false);
                    onUpdated();
                };
                actRow.append(clrImgBtn);
            }
            const opRow = document.createElement('div');
            opRow.className = 'db-form-range-row';
            const opLbl = document.createElement('span');
            opLbl.textContent = 'Image opacity';
            const opInp = document.createElement('input');
            opInp.type = 'range';
            opInp.min = '0';
            opInp.max = '100';
            opInp.step = '1';
            opInp.dataset.formBgOpacity = 'true';
            const initialOp = Math.round((cfg.backgroundImageOpacity !== undefined ? Number(cfg.backgroundImageOpacity) : 1) * 100);
            opInp.value = String(Math.max(0, Math.min(100, initialOp)));
            const opVal = document.createElement('span');
            opVal.className = 'db-form-range-val';
            opVal.dataset.formBgOpacityValue = 'true';
            opVal.textContent = `${opInp.value}%`;
            opInp.oninput = () => {
                cfg.backgroundImageOpacity = Math.max(0, Math.min(1, Number(opInp.value) / 100));
                opVal.textContent = `${opInp.value}%`;
                if (cfg.backgroundMode === 'default' && (cfg.backgroundImageUrl || cfg.backgroundAssetId)) {
                    cfg.backgroundMode = 'image';
                }
                persist(false);
                onUpdated();
            };
            opRow.append(opLbl, opInp, opVal);
            imgCard.append(imgSel, actRow, opRow);
            bgControls.append(imgCard);
        };
        drawBgControls();
        bgRow.append(bgControls);
        body.append(bgRow);
        // 2b. Question Block Surface & Outline Styling
        mkSectionTitle('Question Blocks');
        const qStyleField = document.createElement('div');
        qStyleField.className = 'db-form-setting-field';
        const qStyleCard = document.createElement('div');
        qStyleCard.className = 'db-form-bg-subcard db-form-qstyle-card';
        const qcTopRow = document.createElement('div');
        qcTopRow.className = 'db-form-inline-row db-form-bg-color-row';
        const qcLbl = document.createElement('span');
        qcLbl.className = 'db-form-bg-sub-lbl';
        qcLbl.textContent = 'Card background';
        const qcClr = document.createElement('input');
        qcClr.type = 'color';
        qcClr.dataset.formQcardBgColor = 'true';
        qcClr.value = cfg.questionCardBgColor || '#ffffff';
        const qcHex = document.createElement('code');
        qcHex.className = 'db-form-hex-pill';
        qcHex.textContent = qcClr.value;
        const qcTransLbl = document.createElement('label');
        qcTransLbl.className = 'db-form-mini-check db-form-qcard-trans-lbl';
        const qcTransCb = document.createElement('input');
        qcTransCb.type = 'checkbox';
        qcTransCb.dataset.formQcardBgTransparent = 'true';
        qcTransCb.checked = !!cfg.questionCardBgTransparent;
        qcTransLbl.append(qcTransCb, document.createTextNode('Transparent'));
        qcTopRow.append(qcLbl, qcClr, qcHex, qcTransLbl);
        const qcOpRow = document.createElement('div');
        qcOpRow.className = 'db-form-range-row';
        const qcOpLbl = document.createElement('span');
        qcOpLbl.textContent = 'Card opacity';
        const qcOpInp = document.createElement('input');
        qcOpInp.type = 'range';
        qcOpInp.min = '0';
        qcOpInp.max = '100';
        qcOpInp.step = '1';
        qcOpInp.dataset.formQcardBgOpacity = 'true';
        const initQcOp = Math.round((cfg.questionCardBgOpacity !== undefined ? Number(cfg.questionCardBgOpacity) : 1) * 100);
        qcOpInp.value = String(cfg.questionCardBgTransparent ? 0 : Math.max(0, Math.min(100, initQcOp)));
        qcOpInp.disabled = !!cfg.questionCardBgTransparent;
        const qcOpVal = document.createElement('span');
        qcOpVal.className = 'db-form-range-val';
        qcOpVal.dataset.formQcardBgOpacityValue = 'true';
        qcOpVal.textContent = `${qcOpInp.value}%`;
        qcOpRow.append(qcOpLbl, qcOpInp, qcOpVal);
        qcClr.oninput = () => {
            cfg.questionCardBgColor = qcClr.value;
            cfg.questionCardBgTransparent = false;
            qcTransCb.checked = false;
            qcOpInp.disabled = false;
            if ((cfg.questionCardBgOpacity ?? 1) === 0) {
                cfg.questionCardBgOpacity = 1;
                qcOpInp.value = '100';
                qcOpVal.textContent = '100%';
            }
            qcHex.textContent = qcClr.value;
            persist(false);
            onUpdated();
        };
        qcTransCb.onchange = () => {
            cfg.questionCardBgTransparent = qcTransCb.checked;
            qcOpInp.disabled = qcTransCb.checked;
            qcOpInp.value = qcTransCb.checked ? '0' : String(Math.round((cfg.questionCardBgOpacity ?? 1) * 100));
            qcOpVal.textContent = `${qcOpInp.value}%`;
            persist(false);
            onUpdated();
        };
        qcOpInp.oninput = () => {
            cfg.questionCardBgTransparent = false;
            qcTransCb.checked = false;
            cfg.questionCardBgOpacity = Math.max(0, Math.min(1, Number(qcOpInp.value) / 100));
            qcOpVal.textContent = `${qcOpInp.value}%`;
            persist(false);
            onUpdated();
        };
        const qcOutlineRow = document.createElement('div');
        qcOutlineRow.className = 'db-form-inline-row db-form-bg-color-row';
        const qcOutLbl = document.createElement('span');
        qcOutLbl.className = 'db-form-bg-sub-lbl';
        qcOutLbl.textContent = 'Card outline';
        const qcOutSel = document.createElement('select');
        qcOutSel.className = 'db-pop-select';
        qcOutSel.dataset.formQcardOutline = 'true';
        [
            { id: 'default', label: 'Default border' },
            { id: 'none', label: 'No outline' },
            { id: 'gray', label: 'Gray' },
            { id: 'brown', label: 'Brown' },
            { id: 'orange', label: 'Orange' },
            { id: 'yellow', label: 'Yellow' },
            { id: 'green', label: 'Green' },
            { id: 'blue', label: 'Blue' },
            { id: 'purple', label: 'Purple' },
            { id: 'pink', label: 'Pink' },
            { id: 'red', label: 'Red' }
        ].forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.id;
            o.textContent = opt.label;
            qcOutSel.append(o);
        });
        qcOutSel.value = cfg.questionCardOutlineColor || 'default';
        qcOutSel.onchange = () => {
            cfg.questionCardOutlineColor = qcOutSel.value;
            persist(false);
            onUpdated();
        };
        qcOutlineRow.append(qcOutLbl, qcOutSel);
        qStyleCard.append(qcTopRow, qcOpRow, qcOutlineRow);
        qStyleField.append(qStyleCard);
        body.append(qStyleField);
        // 3. Soul Atlas Radio Multi-Track Custom Select & Hover Release Metadata
        mkSectionTitle('Soul Atlas Radio');
        const musicRow = document.createElement('div');
        musicRow.className = 'db-form-setting-field';
        musicRow.innerHTML = '<label>Playlist tracks (plays in Preview &amp; Published view)</label>';
        const readAudioAssets = () => {
            const list = readFormAssetsByKind('audio');
            const known = new Set(list.map(a => a.id));
            const extras = [];
            (cfg.musicTracks || []).forEach(tr => {
                if (tr.assetId && !known.has(tr.assetId) && tr.name) {
                    known.add(tr.assetId);
                    extras.push({ id: tr.assetId, name: tr.name, url: tr.url || '', metadata: { releaseStatus: tr.releaseStatus || 'unreleased', spotifyUrl: tr.spotifyUrl || '' } });
                }
            });
            return [...extras, ...list];
        };
        const syncLegacyMusicFields = () => {
            const tracks = cfg.musicTracks || [];
            const first = tracks[0] || null;
            cfg.musicAssetId = first ? first.assetId : '';
            cfg.musicName = first ? first.name : '';
            cfg.musicUrl = first ? (first.url || '') : '';
            cfg.musicReleaseStatus = first ? (first.releaseStatus || 'unreleased') : 'unreleased';
            cfg.musicSpotifyUrl = first ? (first.spotifyUrl || '') : '';
        };
        let focusedTrackIdx = 0;
        const customSelWrap = document.createElement('div');
        customSelWrap.className = 'form-custom-select';
        customSelWrap.dataset.formMusicSelectWrap = 'true';
        const musicTrigger = document.createElement('button');
        musicTrigger.type = 'button';
        musicTrigger.className = 'form-custom-select-trigger';
        musicTrigger.dataset.formMusicSelect = 'true';
        musicTrigger.dataset.value = (cfg.musicTracks || []).map(t => t.assetId).join(',');
        musicTrigger.setAttribute('aria-haspopup', 'listbox');
        musicTrigger.setAttribute('aria-expanded', 'false');
        const musicMenu = document.createElement('div');
        musicMenu.className = 'form-custom-select-menu';
        musicMenu.dataset.formMusicMenu = 'true';
        musicMenu.setAttribute('role', 'listbox');
        musicMenu.setAttribute('aria-multiselectable', 'true');
        musicMenu.hidden = true;
        const playlistEl = document.createElement('div');
        playlistEl.className = 'form-radio-playlist';
        playlistEl.dataset.formRadioPlaylist = 'true';
        const releaseBox = document.createElement('div');
        releaseBox.className = 'db-form-bg-subcard form-radio-meta-box';
        const releaseHead = document.createElement('div');
        releaseHead.className = 'db-form-radio-meta-head';
        releaseHead.innerHTML = '<span>Hover info for “Soul Atlas Radio”</span><small>Linked from Asset Management (TODO)</small>';
        const relSeg = document.createElement('div');
        relSeg.className = 'db-form-seg-group';
        const spInp = document.createElement('input');
        spInp.type = 'url';
        spInp.className = 'db-pop-input';
        spInp.placeholder = 'https://open.spotify.com/track/…';
        spInp.dataset.formRadioSpotifyUrl = 'true';
        spInp.value = cfg.musicSpotifyUrl || '';
        releaseBox.append(releaseHead);
        const setMenuOpen = (open) => {
            musicMenu.hidden = !open;
            musicTrigger.setAttribute('aria-expanded', String(open));
            customSelWrap.classList.toggle('is-open', open);
        };
        const toggleTrackSelection = async (asset) => {
            if (!asset) {
                cfg.musicTracks = [];
                focusedTrackIdx = 0;
                syncLegacyMusicFields();
                refreshMusicUi();
                persist(false);
                onUpdated();
                return;
            }
            const tracks = [...(cfg.musicTracks || [])];
            const existingIdx = tracks.findIndex(t => t.assetId === asset.id);
            if (existingIdx >= 0) {
                tracks.splice(existingIdx, 1);
            }
            else {
                const url = await resolveFormAssetUrl(asset);
                const assetRel = String(asset.metadata?.releaseStatus || asset.releaseStatus || '').toLowerCase();
                const assetSp = String(asset.metadata?.spotifyUrl || asset.spotifyUrl || '').trim();
                tracks.push({
                    assetId: asset.id,
                    name: asset.name || 'Track',
                    url,
                    releaseStatus: (assetRel === 'spotify' || assetSp) ? 'spotify' : 'unreleased',
                    spotifyUrl: assetSp
                });
                if (tracks.length === 1)
                    focusedTrackIdx = 0;
            }
            cfg.musicTracks = tracks;
            if (focusedTrackIdx >= tracks.length)
                focusedTrackIdx = Math.max(0, tracks.length - 1);
            syncLegacyMusicFields();
            refreshMusicUi();
            persist(false);
            onUpdated();
        };
        const refreshMusicUi = () => {
            const assets = readAudioAssets();
            const tracks = cfg.musicTracks || [];
            if (focusedTrackIdx >= tracks.length)
                focusedTrackIdx = Math.max(0, tracks.length - 1);
            const selectedIds = new Set(tracks.map(t => t.assetId));
            musicTrigger.dataset.value = tracks.map(t => t.assetId).join(',');
            let triggerText = 'No background music';
            if (tracks.length === 1)
                triggerText = `🎵 ${tracks[0].name}`;
            else if (tracks.length > 1)
                triggerText = `🎵 ${tracks.length} tracks (${tracks[0].name}…)`;
            musicTrigger.innerHTML = `<span class="form-custom-select-label">${escHtml(triggerText)}</span><span class="form-custom-select-caret" aria-hidden="true">▾</span>`;
            musicMenu.replaceChildren();
            const mkOption = (idVal, label, badge, isChecked, onPick) => {
                const opt = document.createElement('button');
                opt.type = 'button';
                opt.className = 'form-custom-select-option' + (isChecked ? ' is-selected' : '');
                opt.setAttribute('role', 'option');
                opt.setAttribute('aria-selected', String(isChecked));
                opt.dataset.musicOption = idVal;
                const mark = idVal ? (isChecked ? '☑ ' : '☐ ') : '';
                opt.innerHTML = `<span class="form-custom-select-opt-name">${escHtml(mark + label)}</span>${badge ? `<span class="form-custom-select-opt-badge">${escHtml(badge)}</span>` : ''}`;
                opt.onclick = ev => {
                    ev.stopPropagation();
                    onPick();
                    if (!idVal)
                        setMenuOpen(false);
                };
                musicMenu.append(opt);
            };
            mkOption('', 'Clear selection (No background music)', '', tracks.length === 0, () => { toggleTrackSelection(null); });
            assets.forEach(a => {
                const isSp = String(a.metadata?.releaseStatus || a.releaseStatus || '').toLowerCase() === 'spotify' || Boolean(a.metadata?.spotifyUrl || a.spotifyUrl);
                mkOption(a.id, `🎵 ${a.name}`, isSp ? 'Spotify' : 'Unreleased', selectedIds.has(a.id), () => { toggleTrackSelection(a); });
            });
            playlistEl.replaceChildren();
            playlistEl.hidden = tracks.length === 0;
            tracks.forEach((tr, idx) => {
                const chip = document.createElement('div');
                chip.className = 'form-radio-track-item' + (idx === focusedTrackIdx ? ' is-active' : '');
                chip.dataset.radioTrackIndex = String(idx);
                const selBtn = document.createElement('button');
                selBtn.type = 'button';
                selBtn.className = 'form-radio-track-name';
                selBtn.textContent = `${idx + 1}. ${tr.name}`;
                selBtn.title = 'Edit release metadata for this track';
                selBtn.onclick = () => {
                    focusedTrackIdx = idx;
                    refreshMusicUi();
                };
                const badge = document.createElement('span');
                badge.className = 'form-custom-select-opt-badge';
                badge.textContent = tr.releaseStatus === 'spotify' ? 'Spotify' : 'Unreleased';
                const rmBtn = document.createElement('button');
                rmBtn.type = 'button';
                rmBtn.className = 'form-radio-track-rm';
                rmBtn.textContent = '×';
                rmBtn.title = `Remove ${tr.name} from playlist`;
                rmBtn.onclick = () => {
                    cfg.musicTracks = tracks.filter((_, i) => i !== idx);
                    syncLegacyMusicFields();
                    refreshMusicUi();
                    persist(false);
                    onUpdated();
                };
                chip.append(selBtn, badge, rmBtn);
                playlistEl.append(chip);
            });
            const activeTrack = tracks[focusedTrackIdx] || null;
            const relStatus = activeTrack ? (activeTrack.releaseStatus === 'spotify' ? 'spotify' : 'unreleased') : (cfg.musicReleaseStatus === 'spotify' ? 'spotify' : 'unreleased');
            releaseHead.innerHTML = `<span>Hover info${activeTrack ? ` · ${escHtml(activeTrack.name)}` : ' for “Soul Atlas Radio”'}</span><small>Linked from Asset Management (TODO)</small>`;
            relSeg.querySelectorAll('[data-form-radio-release]').forEach(btn => {
                btn.classList.toggle('is-active', btn.dataset.formRadioRelease === relStatus);
            });
            spInp.value = activeTrack ? (activeTrack.spotifyUrl || '') : (cfg.musicSpotifyUrl || '');
            spInp.hidden = relStatus !== 'spotify';
        };
        musicTrigger.onclick = ev => {
            ev.stopPropagation();
            const nextOpen = musicMenu.hidden;
            if (nextOpen)
                refreshMusicUi();
            setMenuOpen(nextOpen);
        };
        const outsideClickHandler = (ev) => {
            if (!customSelWrap.isConnected) {
                document.removeEventListener('click', outsideClickHandler);
                return;
            }
            if (!customSelWrap.contains(ev.target))
                setMenuOpen(false);
        };
        document.addEventListener('click', outsideClickHandler);
        customSelWrap.append(musicTrigger, musicMenu);
        ['unreleased', 'spotify'].forEach(rel => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'db-form-seg-btn';
            b.dataset.formRadioRelease = rel;
            b.textContent = rel === 'unreleased' ? 'Unreleased' : 'Spotify link';
            b.onclick = () => {
                const tracks = cfg.musicTracks || [];
                if (tracks[focusedTrackIdx])
                    tracks[focusedTrackIdx].releaseStatus = rel;
                else
                    cfg.musicReleaseStatus = rel;
                syncLegacyMusicFields();
                refreshMusicUi();
                persist(false);
                onUpdated();
            };
            relSeg.append(b);
        });
        spInp.oninput = () => {
            const tracks = cfg.musicTracks || [];
            const val = spInp.value.trim();
            if (tracks[focusedTrackIdx]) {
                tracks[focusedTrackIdx].spotifyUrl = val;
                if (val)
                    tracks[focusedTrackIdx].releaseStatus = 'spotify';
            }
            else {
                cfg.musicSpotifyUrl = val;
                if (val)
                    cfg.musicReleaseStatus = 'spotify';
            }
            syncLegacyMusicFields();
            persist(false);
            onUpdated();
        };
        releaseBox.append(relSeg, spInp);
        const musicActRow = document.createElement('div');
        musicActRow.className = 'db-form-inline-row';
        if (host?.pickAsset) {
            const pickAudioBtn = document.createElement('button');
            pickAudioBtn.type = 'button';
            pickAudioBtn.className = 'secondary-button';
            pickAudioBtn.textContent = '🎵 Add from Asset Library';
            pickAudioBtn.onclick = () => {
                host.pickAsset({
                    focusId: cfg.musicAssetId || null,
                    label: 'Add to Soul Atlas Radio',
                    onSelect: async (asset) => {
                        const exists = (cfg.musicTracks || []).some(t => t.assetId === asset.id);
                        if (!exists)
                            await toggleTrackSelection(asset);
                    }
                });
            };
            musicActRow.append(pickAudioBtn);
        }
        const clrMusicBtn = document.createElement('button');
        clrMusicBtn.type = 'button';
        clrMusicBtn.className = 'secondary-button';
        clrMusicBtn.dataset.formMusicClear = 'true';
        clrMusicBtn.textContent = 'Clear';
        clrMusicBtn.onclick = () => { toggleTrackSelection(null); };
        musicActRow.append(clrMusicBtn);
        refreshMusicUi();
        musicRow.append(customSelWrap, playlistEl, musicActRow, releaseBox);
        body.append(musicRow);
        // 4. Responses, Mail & Uploads
        mkSectionTitle('Submissions & Uploads');
        mkToggle('Accepting responses (open)', !cfg.isClosed, 'accepting', v => { cfg.isClosed = !v; });
        mkToggle('Anonymous responses', !!cfg.anonymousSubmissions, 'anonymous', v => { cfg.anonymousSubmissions = v; });
        mkToggle('Add "Send response to my mail" option', cfg.allowSendToEmail !== false, 'send-to-email', v => { cfg.allowSendToEmail = v; });
        mkToggle('Allow submit another response', cfg.allowSubmitAnotherResponse !== false, 'submit-another', v => { cfg.allowSubmitAnotherResponse = v; });
        mkToggle('Save uploads to Asset Management', db.formUploadsToAssets !== false, 'uploads-to-assets', v => { db.formUploadsToAssets = v; });
        const folderRow = document.createElement('div');
        folderRow.className = 'db-form-setting-field';
        folderRow.innerHTML = '<label>Separate uploads folder (when unchecked)</label>';
        const folderInp = document.createElement('input');
        folderInp.type = 'text';
        folderInp.className = 'db-pop-input';
        folderInp.dataset.formSetting = 'uploads-folder';
        folderInp.value = db.formUploadsFolder || 'form-uploads';
        folderInp.onchange = () => { db.formUploadsFolder = folderInp.value.trim() || 'form-uploads'; persist(false); onUpdated(); };
        folderRow.append(folderInp);
        body.append(folderRow);
        const subLblRow = document.createElement('div');
        subLblRow.className = 'db-form-setting-field';
        subLblRow.innerHTML = '<label>Submit button text</label>';
        const subInp = document.createElement('input');
        subInp.type = 'text';
        subInp.className = 'db-pop-input';
        subInp.value = cfg.submitLabel || 'Submit';
        subInp.onchange = () => {
            cfg.submitLabel = subInp.value.trim() || 'Submit';
            const btnBlock = Array.isArray(dbPage.blocks) ? dbPage.blocks.find((b) => b?.type === 'form_button' && b.formButtonConfig?.kind === 'submit') : null;
            if (btnBlock?.formButtonConfig)
                btnBlock.formButtonConfig.label = cfg.submitLabel;
            persist(false);
            onUpdated();
        };
        subLblRow.append(subInp);
        body.append(subLblRow);
        const confTitleRow = document.createElement('div');
        confTitleRow.className = 'db-form-setting-field';
        confTitleRow.innerHTML = '<label>Confirmation title</label>';
        const ctInp = document.createElement('input');
        ctInp.type = 'text';
        ctInp.className = 'db-pop-input';
        ctInp.value = cfg.confirmationTitle || 'Thank you!';
        ctInp.onchange = () => { cfg.confirmationTitle = ctInp.value; persist(false); };
        confTitleRow.append(ctInp);
        body.append(confTitleRow);
        const confBodyRow = document.createElement('div');
        confBodyRow.className = 'db-form-setting-field';
        confBodyRow.innerHTML = '<label>Confirmation message</label>';
        const cbInp = document.createElement('input');
        cbInp.type = 'text';
        cbInp.className = 'db-pop-input';
        cbInp.value = cfg.confirmationBody || 'Your response has been recorded.';
        cbInp.onchange = () => { cfg.confirmationBody = cbInp.value; persist(false); };
        confBodyRow.append(cbInp);
        body.append(confBodyRow);
    }
    function openFormDesignAndSettingsPopover(anchor, dbPage, onUpdated) {
        if (host?.openFormDesignSidebar) {
            host.openFormDesignSidebar(dbPage, onUpdated);
            return;
        }
        openDbPopover(anchor, (pop, close) => {
            pop.classList.add('db-form-settings-popover');
            renderFormDesignPanel(pop, dbPage, { onUpdated, onClose: close });
        }, 340);
    }
    function getSelectMaxSelections(q, prop) {
        const raw = q.maxSelections !== undefined && q.maxSelections !== null ? Number(q.maxSelections) : NaN;
        if (Number.isFinite(raw) && raw >= 1)
            return Math.floor(raw);
        if (q.limitOne)
            return 1;
        if (prop.type === 'select')
            return 1;
        return null;
    }
    function isFormFieldValueEmpty(prop, val) {
        if (prop.type === 'checkbox')
            return !val;
        if (Array.isArray(val))
            return val.length === 0;
        return val == null || String(val).trim() === '';
    }
    function renderFormQuestionAnswerControl(opts) {
        const { dbPage, prop, q, draftRow, fieldErrors, isRespondMode, isReadOnly, onRedraw, onAnswerUpdated } = opts;
        const { db, cfg } = ensureFormConfig(dbPage);
        const wrap = document.createElement('div');
        wrap.className = 'db-form-answer-wrap';
        const isBuilderEdit = !isRespondMode && !isReadOnly && isFormPage(dbPage);
        if (prop.type === 'title') {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.className = 'db-form-input' + (isBuilderEdit ? ' is-builder-placeholder-input' : '');
            if (isBuilderEdit) {
                inp.placeholder = 'Type greyed-out preview placeholder text…';
                inp.value = q.placeholder || '';
                inp.oninput = () => {
                    q.placeholder = inp.value;
                    persist(false);
                };
            }
            else {
                inp.placeholder = (q.placeholder && q.placeholder.trim()) ? q.placeholder : 'Your answer…';
                inp.value = draftRow.title || '';
                inp.oninput = () => {
                    draftRow.title = inp.value;
                    delete fieldErrors[q.propertyId];
                };
            }
            wrap.append(inp);
        }
        else if (prop.type === 'text') {
            if (q.longAnswer) {
                const ta = document.createElement('textarea');
                ta.className = 'db-form-input db-form-textarea' + (isBuilderEdit ? ' is-builder-placeholder-input' : '');
                ta.rows = 3;
                if (isBuilderEdit) {
                    ta.placeholder = 'Type greyed-out preview placeholder text…';
                    ta.value = q.placeholder || '';
                    ta.oninput = () => {
                        q.placeholder = ta.value;
                        persist(false);
                    };
                }
                else {
                    ta.placeholder = (q.placeholder && q.placeholder.trim()) ? q.placeholder : 'Your detailed answer…';
                    ta.value = draftRow.propertyValues[prop.id] ?? '';
                    ta.oninput = () => {
                        draftRow.propertyValues[prop.id] = ta.value;
                        delete fieldErrors[q.propertyId];
                    };
                }
                wrap.append(ta);
            }
            else {
                const inp = document.createElement('input');
                inp.type = 'text';
                inp.className = 'db-form-input' + (isBuilderEdit ? ' is-builder-placeholder-input' : '');
                if (isBuilderEdit) {
                    inp.placeholder = 'Type greyed-out preview placeholder text…';
                    inp.value = q.placeholder || '';
                    inp.oninput = () => {
                        q.placeholder = inp.value;
                        persist(false);
                    };
                }
                else {
                    inp.placeholder = (q.placeholder && q.placeholder.trim()) ? q.placeholder : 'Your answer…';
                    inp.value = draftRow.propertyValues[prop.id] ?? '';
                    inp.oninput = () => {
                        draftRow.propertyValues[prop.id] = inp.value;
                        delete fieldErrors[q.propertyId];
                    };
                }
                wrap.append(inp);
            }
        }
        else if (prop.type === 'select' || prop.type === 'multi_select' || prop.type === 'status') {
            const maxSel = prop.type === 'status' ? 1 : getSelectMaxSelections(q, prop);
            const isSingle = maxSel === 1;
            const getSelectedIds = () => {
                const v = draftRow.propertyValues[prop.id];
                if (Array.isArray(v))
                    return v.filter(Boolean);
                return typeof v === 'string' && v ? [v] : [];
            };
            const setSelectedIds = (ids) => {
                const clipped = maxSel ? ids.slice(0, maxSel) : ids;
                draftRow.propertyValues[prop.id] = (prop.type === 'select' || prop.type === 'status')
                    ? (clipped[0] || '')
                    : clipped;
            };
            if (q.displayMode === 'dropdown') {
                const sel = document.createElement('select');
                sel.className = 'db-form-input';
                sel.multiple = !isSingle;
                if (isSingle) {
                    const cur = getSelectedIds()[0] || '';
                    sel.innerHTML = `<option value="">Choose option…</option>${(prop.options || []).map(o => `<option value="${escHtml(o.id)}">${escHtml(o.name)}</option>`).join('')}`;
                    sel.value = cur;
                }
                else {
                    const cur = new Set(getSelectedIds());
                    (prop.options || []).forEach(o => {
                        const opt = document.createElement('option');
                        opt.value = o.id;
                        opt.textContent = o.name;
                        opt.selected = cur.has(o.id);
                        sel.append(opt);
                    });
                }
                sel.onchange = () => {
                    const picked = Array.from(sel.selectedOptions).map(o => o.value).filter(Boolean);
                    if (maxSel && picked.length > maxSel) {
                        host?.toast?.(`Select up to ${maxSel} option${maxSel === 1 ? '' : 's'}.`);
                    }
                    setSelectedIds(picked);
                    delete fieldErrors[q.propertyId];
                    onAnswerUpdated?.();
                };
                wrap.append(sel);
            }
            else {
                const box = document.createElement('div');
                box.className = 'db-pill-list ' + (isSingle ? 'is-single-select' : 'is-multi-select');
                (prop.options || []).forEach(o => {
                    const rowItem = document.createElement('div');
                    rowItem.className = 'db-form-opt-pill';
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'db-form-chip-toggle ' + (isSingle ? 'is-single-select' : 'is-multi-select');
                    const syncChip = () => {
                        const active = getSelectedIds().includes(o.id);
                        btn.classList.toggle('is-active', active);
                        if (isSingle) {
                            btn.textContent = `${active ? '◉ ' : '○ '}${o.name}`;
                        }
                        else {
                            btn.textContent = `${active ? '☑ ' : '☐ '}${o.name}`;
                        }
                    };
                    btn.onclick = () => {
                        const cur = getSelectedIds();
                        if (cur.includes(o.id)) {
                            setSelectedIds(cur.filter(x => x !== o.id));
                        }
                        else if (isSingle) {
                            setSelectedIds([o.id]);
                        }
                        else if (maxSel && cur.length >= maxSel) {
                            host?.toast?.(`Maximum ${maxSel} selection${maxSel === 1 ? '' : 's'} allowed.`);
                            return;
                        }
                        else {
                            setSelectedIds([...cur, o.id]);
                        }
                        delete fieldErrors[q.propertyId];
                        if (isSingle) {
                            onRedraw();
                        }
                        else {
                            syncChip();
                            onAnswerUpdated?.();
                        }
                    };
                    syncChip();
                    rowItem.append(btn);
                    if (!isRespondMode && !isReadOnly) {
                        const rm = document.createElement('button');
                        rm.type = 'button';
                        rm.className = 'db-form-opt-del';
                        rm.title = `Remove "${o.name}"`;
                        rm.textContent = '×';
                        rm.onclick = () => {
                            prop.options = (prop.options || []).filter(x => x.id !== o.id);
                            persist(false);
                            onRedraw();
                        };
                        rowItem.append(rm);
                    }
                    box.append(rowItem);
                });
                if (!isRespondMode && !isReadOnly) {
                    const addOptBtn = document.createElement('button');
                    addOptBtn.type = 'button';
                    addOptBtn.className = 'db-form-add-opt-btn';
                    addOptBtn.textContent = '+ Add option';
                    addOptBtn.onclick = () => {
                        prop.options = prop.options || [];
                        const idx = prop.options.length + 1;
                        const palette = ['blue', 'yellow', 'red', 'green', 'purple', 'orange'];
                        prop.options.push({ id: uid(), name: `Option ${idx}`, color: palette[(idx - 1) % palette.length] });
                        persist(false);
                        onRedraw();
                    };
                    box.append(addOptBtn);
                }
                wrap.append(box);
            }
        }
        else if (prop.type === 'date') {
            const row = document.createElement('div');
            row.className = 'db-form-date-row';
            const inp = document.createElement('input');
            inp.type = q.includeTime ? 'datetime-local' : 'date';
            inp.className = 'db-form-input';
            inp.value = draftRow.propertyValues[prop.id]?.start || '';
            inp.onchange = () => {
                const prev = draftRow.propertyValues[prop.id] || {};
                draftRow.propertyValues[prop.id] = inp.value ? { ...prev, start: inp.value, includeTime: !!q.includeTime } : undefined;
                delete fieldErrors[q.propertyId];
            };
            row.append(inp);
            if (q.includeEndDate) {
                const endInp = document.createElement('input');
                endInp.type = q.includeTime ? 'datetime-local' : 'date';
                endInp.className = 'db-form-input';
                endInp.placeholder = 'End date';
                endInp.value = draftRow.propertyValues[prop.id]?.end || '';
                endInp.onchange = () => {
                    const prev = draftRow.propertyValues[prop.id] || { start: inp.value };
                    draftRow.propertyValues[prop.id] = { ...prev, end: endInp.value || undefined };
                };
                row.append(document.createTextNode('→'), endInp);
            }
            wrap.append(row);
        }
        else if (prop.type === 'files') {
            const maxMb = Number(q.maxSizeMb) > 0 ? Number(q.maxSizeMb) : 10;
            const maxBytes = maxMb * 1024 * 1024;
            const toAssets = db.formUploadsToAssets !== false;
            const box = document.createElement('div');
            box.className = 'db-form-files-box';
            const curFiles = Array.isArray(draftRow.propertyValues[prop.id]) ? draftRow.propertyValues[prop.id] : [];
            const fileInp = document.createElement('input');
            fileInp.type = 'file';
            fileInp.multiple = true;
            fileInp.className = 'db-form-file-input';
            fileInp.onchange = async () => {
                const files = fileInp.files ? Array.from(fileInp.files) : [];
                if (!files.length)
                    return;
                const next = [...curFiles];
                let rejectedMsg = '';
                for (const f of files) {
                    if (f.size > maxBytes) {
                        rejectedMsg = `File "${f.name}" exceeds max upload limit of ${maxMb} MB.`;
                        continue;
                    }
                    if (toAssets) {
                        if (host?.ingestLocalFile) {
                            try {
                                const rec = await host.ingestLocalFile(f, {
                                    creator: cfg.anonymousSubmissions ? 'Anonymous' : actorName(),
                                    tags: ['form-upload']
                                });
                                if (rec)
                                    next.push({ name: rec.name || f.name, url: rec.url || rec.previewDataUrl || '', assetId: rec.id, sizeBytes: f.size, storageLocation: 'assets' });
                            }
                            catch {
                                next.push({ name: f.name, sizeBytes: f.size, storageLocation: 'assets' });
                            }
                        }
                        else {
                            next.push({ name: f.name, sizeBytes: f.size, storageLocation: 'assets' });
                        }
                    }
                    else {
                        if (host?.saveFormSeparateUpload) {
                            try {
                                const rec = await host.saveFormSeparateUpload(f, {
                                    folder: db.formUploadsFolder || (dbPage.title || 'form-uploads'),
                                    creator: cfg.anonymousSubmissions ? 'Anonymous' : actorName()
                                });
                                if (rec)
                                    next.push({ name: rec.name || f.name, url: rec.url || '', sizeBytes: f.size, storageLocation: 'form-uploads-folder' });
                            }
                            catch {
                                next.push({ name: f.name, sizeBytes: f.size, storageLocation: 'form-uploads-folder' });
                            }
                        }
                        else {
                            next.push({ name: f.name, sizeBytes: f.size, storageLocation: 'form-uploads-folder' });
                        }
                    }
                }
                draftRow.propertyValues[prop.id] = next;
                if (rejectedMsg) {
                    fieldErrors[q.propertyId] = rejectedMsg;
                    host?.toast?.(rejectedMsg);
                }
                else {
                    delete fieldErrors[q.propertyId];
                }
                onRedraw();
            };
            const hint = document.createElement('div');
            hint.className = 'db-form-upload-hint';
            hint.innerHTML = `<span>Max ${maxMb} MB per file</span><span>Destination: ${toAssets ? 'Asset Management' : `Separate folder (${escHtml(db.formUploadsFolder || 'form-uploads')})`}</span>`;
            box.append(fileInp, hint);
            if (curFiles.length) {
                const chips = document.createElement('div');
                chips.className = 'db-pill-list';
                curFiles.forEach((f, idx) => {
                    const ch = document.createElement('span');
                    ch.className = 'db-form-file-chip';
                    ch.textContent = `📎 ${f.name} `;
                    const rm = document.createElement('button');
                    rm.type = 'button';
                    rm.textContent = '×';
                    rm.onclick = () => {
                        draftRow.propertyValues[prop.id] = curFiles.filter((_, i) => i !== idx);
                        onRedraw();
                    };
                    ch.append(rm);
                    chips.append(ch);
                });
                box.append(chips);
            }
            wrap.append(box);
        }
        else if (prop.type === 'phone') {
            const inp = document.createElement('input');
            inp.type = 'tel';
            inp.className = 'db-form-input' + (isBuilderEdit ? ' is-builder-placeholder-input' : '');
            inp.placeholder = isBuilderEdit
                ? 'Type greyed-out preview placeholder (e.g. +49 0151 1234567)…'
                : ((q.placeholder && q.placeholder.trim()) ? q.placeholder : '+49 0151 1234567');
            inp.value = isBuilderEdit ? (q.placeholder || '') : (draftRow.propertyValues[prop.id] ?? '');
            const detectedEl = document.createElement('div');
            detectedEl.className = 'db-form-phone-detected';
            const refreshPhoneBadge = () => {
                const raw = String(inp.value || '').trim();
                const info = detectPhoneCountry(raw);
                if (!raw) {
                    detectedEl.className = 'db-form-phone-detected';
                    detectedEl.textContent = 'Auto country detection — examples: +49 0151…, (+49) 0151…, DE 0151…, (DE) 0151…';
                    return;
                }
                if (!info || !info.hasPrefix || !info.viable) {
                    detectedEl.className = 'db-form-phone-detected is-error';
                    detectedEl.textContent = !info?.hasPrefix
                        ? 'Missing country code — e.g. +49 0151…, (+49) 0151…, DE 0151…, or (DE) 0151…'
                        : 'Missing country code or incomplete number — e.g. +49 0151 1234567';
                    return;
                }
                detectedEl.className = 'db-form-phone-detected is-valid';
                detectedEl.textContent = `${info.flag} ${info.name}${info.code ? ` (${info.code})` : ''}`;
            };
            inp.oninput = () => {
                if (isBuilderEdit) {
                    q.placeholder = inp.value;
                    persist(false);
                }
                else {
                    draftRow.propertyValues[prop.id] = inp.value;
                    delete fieldErrors[q.propertyId];
                }
                refreshPhoneBadge();
            };
            refreshPhoneBadge();
            wrap.append(inp, detectedEl);
        }
        else if (prop.type === 'relation') {
            const targetDb = prop.relationDatabaseId ? getPageById(prop.relationDatabaseId) : null;
            const sel = document.createElement('select');
            sel.className = 'db-form-input';
            const targetRows = targetDb ? getDatabaseRows(targetDb.id) : [];
            sel.innerHTML = `<option value="">${targetDb ? `Link from ${escHtml(targetDb.title || 'database')}…` : 'Select linked database in property settings…'}</option>${targetRows.map((r) => `<option value="${escHtml(r.id)}">${escHtml(r.title || 'Untitled')}</option>`).join('')}`;
            const curArr = Array.isArray(draftRow.propertyValues[prop.id]) ? draftRow.propertyValues[prop.id] : [];
            sel.value = curArr[0] || '';
            sel.onchange = () => {
                draftRow.propertyValues[prop.id] = sel.value ? [sel.value] : [];
                delete fieldErrors[q.propertyId];
            };
            wrap.append(sel);
        }
        else {
            const inp = document.createElement('input');
            inp.type = prop.type === 'number' ? 'number' : prop.type === 'email' ? 'email' : prop.type === 'url' ? 'url' : 'text';
            inp.className = 'db-form-input' + (isBuilderEdit ? ' is-builder-placeholder-input' : '');
            const defaultPh = prop.type === 'email' ? 'name@example.com' : prop.type === 'url' ? 'https://…' : `Enter ${(q.label || prop.name).toLowerCase()}…`;
            if (isBuilderEdit) {
                inp.placeholder = 'Type greyed-out preview placeholder text…';
                inp.value = q.placeholder || '';
                inp.oninput = () => {
                    q.placeholder = inp.value;
                    persist(false);
                };
            }
            else {
                inp.placeholder = (q.placeholder && q.placeholder.trim()) ? q.placeholder : defaultPh;
                inp.value = draftRow.propertyValues[prop.id] ?? '';
                inp.oninput = () => {
                    draftRow.propertyValues[prop.id] = prop.type === 'number' ? (inp.value === '' ? '' : Number(inp.value)) : inp.value;
                    delete fieldErrors[q.propertyId];
                };
            }
            wrap.append(inp);
        }
        return wrap;
    }
    function renderFormQuestionCard(opts) {
        const { dbPage, q, prop, blockId, draftRow, fieldErrors, isRespondMode, isReadOnly } = opts;
        const { db, cfg } = ensureFormConfig(dbPage);
        const visibleByLogic = evaluateFormCondition(dbPage, q, draftRow);
        if (isRespondMode && !visibleByLogic)
            return null;
        const isReq = prop.type === 'title' || Boolean(q.required);
        const fieldCard = document.createElement('div');
        fieldCard.className = 'db-form-field-card'
            + (opts.isFocused && !isRespondMode ? ' is-focused' : '')
            + (fieldErrors[q.propertyId] ? ' has-error' : '');
        fieldCard.dataset.questionId = q.id;
        fieldCard.dataset.propId = prop.id;
        if (blockId)
            fieldCard.dataset.formBlockId = blockId;
        fieldCard.onclick = () => { opts.onFocus?.(); };
        if (!isRespondMode && !isReadOnly) {
            const builderHead = document.createElement('div');
            builderHead.className = 'db-form-q-builder-head';
            const titleWrap = document.createElement('div');
            titleWrap.className = 'db-form-q-title-wrap has-rendered';
            const qNameInp = document.createElement('input');
            qNameInp.type = 'text';
            qNameInp.className = 'db-form-q-label';
            qNameInp.value = q.label || prop.name || '';
            qNameInp.placeholder = 'Question title (supports # Markdown, **bold**, *italic*)…';
            const mdView = document.createElement('div');
            mdView.className = 'db-form-q-md-preview';
            mdView.innerHTML = renderQuestionMarkdownHtml(qNameInp.value);
            mdView.onclick = ev => {
                ev.stopPropagation();
                qNameInp.focus({ preventScroll: true });
            };
            qNameInp.oninput = () => {
                q.label = qNameInp.value;
                prop.name = qNameInp.value.trim() || prop.name;
                mdView.innerHTML = renderQuestionMarkdownHtml(qNameInp.value);
                persist(false);
            };
            qNameInp.onkeydown = ev => {
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    qNameInp.blur();
                }
            };
            titleWrap.append(qNameInp, mdView);
            const typeBadgeOrSelect = (() => {
                if (prop.type === 'title') {
                    const bPill = document.createElement('span');
                    bPill.className = 'db-form-type-pill';
                    bPill.textContent = 'Aa Primary Title';
                    return bPill;
                }
                const sel = document.createElement('select');
                sel.className = 'db-form-q-type';
                FORM_QUESTION_TYPES.forEach(qt => {
                    const o = document.createElement('option');
                    o.value = qt.type;
                    o.textContent = `${qt.icon} ${qt.label}`;
                    sel.append(o);
                });
                const normalizedType = (prop.type === 'select' || prop.type === 'multi_select') ? 'select' : prop.type;
                sel.value = FORM_QUESTION_TYPES.some(t => t.type === normalizedType) ? normalizedType : 'text';
                sel.onchange = () => {
                    const picked = sel.value;
                    if (picked === 'select') {
                        prop.type = q.maxSelections === 1 ? 'select' : 'multi_select';
                        if (!prop.options || !prop.options.length) {
                            prop.options = [
                                { id: uid(), name: 'Option 1', color: 'blue' },
                                { id: uid(), name: 'Option 2', color: 'yellow' }
                            ];
                        }
                        if (!q.displayMode)
                            q.displayMode = 'list';
                    }
                    else {
                        prop.type = picked;
                    }
                    if (prop.type === 'files' && !(Number(q.maxSizeMb) > 0))
                        q.maxSizeMb = 10;
                    delete draftRow.propertyValues[prop.id];
                    persist(false);
                    opts.onRedraw();
                };
                return sel;
            })();
            builderHead.append(titleWrap, typeBadgeOrSelect);
            if (isReq) {
                const ast = document.createElement('span');
                ast.className = 'db-form-req';
                ast.textContent = '*';
                builderHead.append(ast);
            }
            fieldCard.append(builderHead);
            if (q.showDescription || q.description) {
                const qDesc = document.createElement('input');
                qDesc.type = 'text';
                qDesc.className = 'db-form-q-desc-input';
                qDesc.placeholder = 'Add helper description for respondents…';
                qDesc.value = q.description || '';
                qDesc.oninput = () => { q.description = qDesc.value; persist(false); };
                fieldCard.append(qDesc);
            }
        }
        else {
            const top = document.createElement('div');
            top.className = 'db-form-field-head';
            const lblEl = document.createElement('label');
            lblEl.className = 'db-form-field-md-label';
            lblEl.innerHTML = `${renderQuestionMarkdownHtml(q.label || prop.name)}${isReq ? ' <span class="db-form-req">*</span>' : ''}`;
            top.append(lblEl);
            fieldCard.append(top);
            if (q.showDescription && q.description) {
                const p = document.createElement('p');
                p.className = 'db-form-q-desc';
                p.textContent = q.description;
                fieldCard.append(p);
            }
        }
        const answerCtrl = renderFormQuestionAnswerControl({
            dbPage,
            prop,
            q,
            draftRow,
            fieldErrors,
            isRespondMode,
            isReadOnly,
            onRedraw: opts.onRedraw,
            onAnswerUpdated: () => {
                if (opts.onAnswerUpdated)
                    opts.onAnswerUpdated();
                else if (['select', 'multi_select', 'status'].includes(prop.type) && isRespondMode)
                    opts.onRedraw();
            }
        });
        fieldCard.append(answerCtrl);
        if (fieldErrors[q.propertyId]) {
            const err = document.createElement('div');
            err.className = 'db-form-field-error';
            err.textContent = fieldErrors[q.propertyId];
            fieldCard.append(err);
        }
        if (!isRespondMode && !isReadOnly) {
            const qOpts = document.createElement('div');
            qOpts.className = 'db-form-q-controls';
            if (prop.type === 'text') {
                const lLbl = document.createElement('label');
                lLbl.className = 'db-form-mini-check';
                const lCb = document.createElement('input');
                lCb.type = 'checkbox';
                lCb.checked = !!q.longAnswer;
                lCb.onchange = () => { q.longAnswer = lCb.checked; persist(false); opts.onRedraw(); };
                lLbl.append(lCb, document.createTextNode('Long answer'));
                qOpts.append(lLbl);
            }
            else if (prop.type === 'select' || prop.type === 'multi_select') {
                const modeBtn = document.createElement('button');
                modeBtn.type = 'button';
                modeBtn.className = 'db-form-ctrl-btn';
                modeBtn.textContent = q.displayMode === 'dropdown' ? '▾ Dropdown' : '▤ List';
                modeBtn.onclick = () => { q.displayMode = q.displayMode === 'dropdown' ? 'list' : 'dropdown'; persist(false); opts.onRedraw(); };
                qOpts.append(modeBtn);
                const maxSel = getSelectMaxSelections(q, prop);
                const maxWrap = document.createElement('label');
                maxWrap.className = 'db-form-mini-check db-form-maxsel-wrap';
                const maxCb = document.createElement('input');
                maxCb.type = 'checkbox';
                maxCb.dataset.formQMaxToggle = 'true';
                maxCb.checked = maxSel !== null;
                const maxCountInp = document.createElement('input');
                maxCountInp.type = 'number';
                maxCountInp.min = '1';
                maxCountInp.max = '99';
                maxCountInp.className = 'db-form-maxsel-input';
                maxCountInp.dataset.formQMaxCount = 'true';
                maxCountInp.disabled = maxSel === null;
                maxCountInp.value = String(maxSel ?? 2);
                const syncSelectCap = (nextCap, redrawNow) => {
                    q.maxSelections = nextCap ?? undefined;
                    q.limitOne = nextCap === 1;
                    prop.type = nextCap === 1 ? 'select' : 'multi_select';
                    const cur = draftRow.propertyValues[prop.id];
                    if (prop.type === 'select' && Array.isArray(cur)) {
                        draftRow.propertyValues[prop.id] = cur[0] || '';
                    }
                    else if (prop.type === 'multi_select' && typeof cur === 'string') {
                        draftRow.propertyValues[prop.id] = cur ? [cur] : [];
                    }
                    persist(false);
                    if (redrawNow)
                        opts.onRedraw();
                };
                maxCb.onchange = () => {
                    if (maxCb.checked) {
                        const parsed = Math.max(1, Math.floor(Number(maxCountInp.value) || 1));
                        maxCountInp.disabled = false;
                        maxCountInp.value = String(parsed);
                        syncSelectCap(parsed, true);
                    }
                    else {
                        maxCountInp.disabled = true;
                        syncSelectCap(null, true);
                    }
                };
                maxCountInp.oninput = () => {
                    if (!maxCb.checked)
                        return;
                    const rawNum = Math.floor(Number(maxCountInp.value));
                    if (!Number.isFinite(rawNum) || rawNum < 1)
                        return;
                    syncSelectCap(Math.min(99, rawNum), false);
                };
                maxCountInp.onchange = () => {
                    if (!maxCb.checked)
                        return;
                    const clamped = Math.max(1, Math.min(99, Math.floor(Number(maxCountInp.value) || 1)));
                    maxCountInp.value = String(clamped);
                    syncSelectCap(clamped, true);
                };
                maxWrap.append(maxCb, document.createTextNode('Max '), maxCountInp);
                qOpts.append(maxWrap);
            }
            else if (prop.type === 'date') {
                const tLbl = document.createElement('label');
                tLbl.className = 'db-form-mini-check';
                const tCb = document.createElement('input');
                tCb.type = 'checkbox';
                tCb.checked = !!q.includeTime;
                tCb.onchange = () => { q.includeTime = tCb.checked; persist(false); opts.onRedraw(); };
                tLbl.append(tCb, document.createTextNode('Time'));
                const eLbl = document.createElement('label');
                eLbl.className = 'db-form-mini-check';
                const eCb = document.createElement('input');
                eCb.type = 'checkbox';
                eCb.checked = !!q.includeEndDate;
                eCb.onchange = () => { q.includeEndDate = eCb.checked; persist(false); opts.onRedraw(); };
                eLbl.append(eCb, document.createTextNode('End date'));
                qOpts.append(tLbl, eLbl);
            }
            else if (prop.type === 'files') {
                const maxLbl = document.createElement('label');
                maxLbl.className = 'db-form-mini-check';
                maxLbl.textContent = 'Max MB ';
                const maxInp = document.createElement('input');
                maxInp.type = 'number';
                maxInp.min = '1';
                maxInp.max = '500';
                maxInp.className = 'db-form-maxmb-input';
                maxInp.dataset.formQMaxMb = 'true';
                maxInp.value = String(Number(q.maxSizeMb) > 0 ? Number(q.maxSizeMb) : 10);
                maxInp.onchange = () => {
                    const val = Math.max(1, Math.min(500, Math.round(Number(maxInp.value) || 10)));
                    q.maxSizeMb = val;
                    persist(false);
                    opts.onRedraw();
                };
                maxLbl.append(maxInp);
                qOpts.append(maxLbl);
            }
            const rightCtrls = document.createElement('div');
            rightCtrls.className = 'db-form-q-actions';
            if (opts.onAddTextBelow) {
                const addTextBelow = document.createElement('button');
                addTextBelow.type = 'button';
                addTextBelow.className = 'db-form-ctrl-btn';
                addTextBelow.textContent = '+ Text';
                addTextBelow.title = 'Insert free text below';
                addTextBelow.onclick = e => { e.stopPropagation(); opts.onAddTextBelow(); };
                rightCtrls.append(addTextBelow);
            }
            const descBtn = document.createElement('button');
            descBtn.type = 'button';
            descBtn.className = 'db-form-ctrl-btn' + (q.showDescription ? ' is-active' : '');
            descBtn.textContent = 'Desc';
            descBtn.title = 'Toggle question description';
            descBtn.onclick = e => { e.stopPropagation(); q.showDescription = !q.showDescription; persist(false); opts.onRedraw(); };
            rightCtrls.append(descBtn);
            if (opts.canMoveUp && opts.onMoveUp) {
                const upBtn = document.createElement('button');
                upBtn.type = 'button';
                upBtn.className = 'db-form-ctrl-btn';
                upBtn.textContent = '↑';
                upBtn.title = 'Move up';
                upBtn.onclick = e => { e.stopPropagation(); opts.onMoveUp(); };
                rightCtrls.append(upBtn);
            }
            if (opts.canMoveDown && opts.onMoveDown) {
                const dnBtn = document.createElement('button');
                dnBtn.type = 'button';
                dnBtn.className = 'db-form-ctrl-btn';
                dnBtn.textContent = '↓';
                dnBtn.title = 'Move down';
                dnBtn.onclick = e => { e.stopPropagation(); opts.onMoveDown(); };
                rightCtrls.append(dnBtn);
            }
            if (prop.type !== 'title') {
                const dupBtn = document.createElement('button');
                dupBtn.type = 'button';
                dupBtn.className = 'db-form-ctrl-btn';
                dupBtn.textContent = '⧉';
                dupBtn.title = 'Duplicate question';
                dupBtn.onclick = e => {
                    e.stopPropagation();
                    if (opts.onDuplicate)
                        opts.onDuplicate();
                    else {
                        duplicateFormQuestionBlock(dbPage, q.id);
                        persist(false);
                        opts.onRedraw();
                    }
                };
                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.className = 'db-form-ctrl-btn danger';
                delBtn.textContent = '🗑';
                delBtn.title = 'Remove question';
                delBtn.onclick = e => {
                    e.stopPropagation();
                    if (opts.onDelete)
                        opts.onDelete();
                    else {
                        deleteFormQuestionBlock(dbPage, q.id);
                        persist(false);
                        opts.onRedraw();
                    }
                };
                const reqLbl = document.createElement('label');
                reqLbl.className = 'db-form-req-toggle';
                const reqCb = document.createElement('input');
                reqCb.type = 'checkbox';
                reqCb.checked = isReq;
                reqCb.onchange = () => {
                    q.required = reqCb.checked;
                    cfg.requiredPropertyIds = Array.from(new Set(cfg.questions.filter(x => x.required).map(x => x.propertyId)));
                    persist(false);
                    opts.onRedraw();
                };
                reqLbl.append(reqCb, document.createTextNode('Required'));
                rightCtrls.append(dupBtn, delBtn, reqLbl);
            }
            qOpts.append(rightCtrls);
            fieldCard.append(qOpts);
        }
        return fieldCard;
    }
    function validateAndSubmitForm(dbPage, draftRow, fieldErrors) {
        const { db, cfg } = ensureFormConfig(dbPage);
        if (cfg.isClosed) {
            host?.toast?.('This form is closed.');
            return { ok: false, firstError: 'This form is closed.' };
        }
        Object.keys(fieldErrors).forEach(k => delete fieldErrors[k]);
        const propById = new Map(db.schema.map(s => [s.id, s]));
        const visibleQuestions = cfg.questions.filter(q => evaluateFormCondition(dbPage, q, draftRow));
        const visibleByQId = new Map(visibleQuestions.map(q => [q.id, q]));
        let firstErrorMsg = '';
        for (const q of visibleQuestions) {
            const prop = propById.get(q.propertyId);
            if (!prop)
                continue;
            const val = prop.type === 'title' ? draftRow.title : draftRow.propertyValues[q.propertyId];
            const isEmpty = prop.type === 'checkbox'
                ? (q.required && !val)
                : isFormFieldValueEmpty(prop, val);
            if ((prop.type === 'title' || q.required) && isEmpty) {
                fieldErrors[q.propertyId] = 'This question is required';
                if (!firstErrorMsg)
                    firstErrorMsg = `Please fill out "${q.label || prop.name}"`;
                continue;
            }
            if (!isEmpty && typeof val === 'string') {
                if (prop.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
                    fieldErrors[q.propertyId] = 'Invalid email';
                    if (!firstErrorMsg)
                        firstErrorMsg = `Invalid email in "${q.label || prop.name}"`;
                }
                else if (prop.type === 'url' && !/^https?:\/\/[^\s]+/i.test(val.trim())) {
                    fieldErrors[q.propertyId] = 'Invalid URL (include http:// or https://)';
                    if (!firstErrorMsg)
                        firstErrorMsg = `Invalid URL in "${q.label || prop.name}"`;
                }
                else if (prop.type === 'phone') {
                    const phoneInfo = detectPhoneCountry(val.trim());
                    if (!phoneInfo || !phoneInfo.hasPrefix || !phoneInfo.viable) {
                        fieldErrors[q.propertyId] = 'Missing country code (e.g. +49 0151…, (+49) 0151…, DE 0151…, or (DE) 0151…)';
                        if (!firstErrorMsg)
                            firstErrorMsg = `Missing country code for "${q.label || prop.name}"`;
                    }
                }
            }
            if (!isEmpty && (prop.type === 'select' || prop.type === 'multi_select')) {
                const maxSel = getSelectMaxSelections(q, prop);
                if (maxSel && Array.isArray(val) && val.length > maxSel) {
                    fieldErrors[q.propertyId] = `Select at most ${maxSel} option${maxSel === 1 ? '' : 's'}`;
                    if (!firstErrorMsg)
                        firstErrorMsg = `Too many selections in "${q.label || prop.name}"`;
                }
            }
        }
        // Column-linked validation groups across doc columns blocks
        const checkLinkedColumns = (blocks) => {
            if (!Array.isArray(blocks))
                return;
            for (const blk of blocks) {
                if (!blk)
                    continue;
                if (blk.type === 'columns' && (Array.isArray(blk.columns) || Array.isArray(blk.children))) {
                    const rule = blk.columnLinkRule;
                    const groupFields = [];
                    const collectCols = (sub) => {
                        if (!Array.isArray(sub))
                            return;
                        for (const item of sub) {
                            if (!item)
                                continue;
                            if (item.type === 'form_question' && item.questionId) {
                                const vq = visibleByQId.get(item.questionId);
                                const vp = vq ? propById.get(vq.propertyId) : null;
                                if (vq && vp) {
                                    const val = vp.type === 'title' ? draftRow.title : draftRow.propertyValues[vq.propertyId];
                                    groupFields.push({ q: vq, prop: vp, filled: !isFormFieldValueEmpty(vp, val) });
                                }
                            }
                            if (item.type === 'columns' && Array.isArray(item.columns))
                                item.columns.forEach(collectCols);
                            if (Array.isArray(item.children))
                                collectCols(item.children);
                        }
                    };
                    if (Array.isArray(blk.columns))
                        blk.columns.forEach(collectCols);
                    if (Array.isArray(blk.children))
                        collectCols(blk.children);
                    if (rule && rule.mode && rule.mode !== 'none' && groupFields.length >= 2) {
                        const filledCount = groupFields.filter(f => f.filled).length;
                        if (rule.mode === 'all_if_any' && filledCount > 0 && filledCount < groupFields.length) {
                            groupFields.filter(f => !f.filled).forEach(f => {
                                fieldErrors[f.q.propertyId] = 'Linked fields: fill all fields in this row or leave all blank';
                            });
                            if (!firstErrorMsg)
                                firstErrorMsg = 'If you fill one field in the linked group, fill all of them.';
                        }
                        else if (rule.mode === 'at_least_one' && filledCount < 1) {
                            groupFields.forEach(f => {
                                fieldErrors[f.q.propertyId] = 'Linked fields: fill at least 1 field in this row';
                            });
                            if (!firstErrorMsg)
                                firstErrorMsg = 'Fill at least 1 field in the linked column group.';
                        }
                        else if (rule.mode === 'at_least_n') {
                            const need = Math.max(1, Math.min(groupFields.length, Math.floor(Number(rule.count) || 2)));
                            if (filledCount < need) {
                                groupFields.filter(f => !f.filled).forEach(f => {
                                    fieldErrors[f.q.propertyId] = `Linked fields: fill at least ${need} fields in this row`;
                                });
                                if (!firstErrorMsg)
                                    firstErrorMsg = `Fill at least ${need} fields in the linked column group.`;
                            }
                        }
                    }
                    if (Array.isArray(blk.columns))
                        blk.columns.forEach(checkLinkedColumns);
                    if (Array.isArray(blk.children))
                        checkLinkedColumns(blk.children);
                    continue;
                }
                if (Array.isArray(blk.children))
                    checkLinkedColumns(blk.children);
            }
        };
        if (Array.isArray(dbPage.blocks))
            checkLinkedColumns(dbPage.blocks);
        if (Object.keys(fieldErrors).length) {
            host?.toast?.(firstErrorMsg || 'Please check form fields');
            return { ok: false, firstError: firstErrorMsg };
        }
        const titleProp = db.schema.find(s => s.type === 'title');
        const initVals = {};
        visibleQuestions.forEach(q => {
            if (q.propertyId !== titleProp?.id && draftRow.propertyValues[q.propertyId] !== undefined) {
                initVals[q.propertyId] = structuredCloneSafe(draftRow.propertyValues[q.propertyId]);
            }
        });
        if (titleProp)
            initVals[titleProp.id] = (draftRow.title || '').trim();
        const created = createDatabaseRow(dbPage, initVals, [], '📄', { anonymous: !!cfg.anonymousSubmissions });
        persist(false);
        host?.toast?.(`Form submitted: “${created.title}”`);
        return { ok: true, row: created };
    }
    function triggerSendResponseToMail(dbPage, rowOrDraft, emailAddr) {
        const email = String(emailAddr || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            host?.toast?.('Enter a valid email address to receive your copy.');
            return false;
        }
        const { db, cfg } = ensureFormConfig(dbPage);
        const lines = [`Form: ${cfg.title || dbPage.title || 'Form'}`];
        cfg.questions.forEach(q => {
            const prop = db.schema.find(s => s.id === q.propertyId);
            if (!prop)
                return;
            const val = prop.type === 'title' ? rowOrDraft?.title : rowOrDraft?.propertyValues?.[prop.id];
            const textVal = Array.isArray(val) ? val.map(v => v?.name || prop.options?.find(o => o.id === v)?.name || v).join(', ')
                : (val && typeof val === 'object' ? JSON.stringify(val) : (prop.options?.find(o => o.id === val)?.name || val || ''));
            lines.push(`- ${q.label || prop.name}: ${textVal}`);
        });
        const w = window;
        if (!Array.isArray(w.__architectFormMailQueue))
            w.__architectFormMailQueue = [];
        w.__architectFormMailQueue.push({
            formId: dbPage.id,
            formTitle: cfg.title || dbPage.title || 'Form',
            to: email,
            body: lines.join('\n'),
            queuedAt: Date.now()
        });
        host?.toast?.(`Response copy queued for ${email}`);
        return true;
    }
    function renderFormView(canvas, view, dbPage) {
        const db = ensureDatabaseConfig(dbPage);
        if (db.formUploadsToAssets === undefined)
            db.formUploadsToAssets = true;
        if (!db.formUploadsFolder)
            db.formUploadsFolder = 'form-uploads';
        const ro = roMode(dbPage);
        view.formConfig = view.formConfig || {};
        const cfg = view.formConfig;
        cfg.requiredPropertyIds = Array.isArray(cfg.requiredPropertyIds) ? cfg.requiredPropertyIds : [];
        cfg.hiddenPropertyIds = Array.isArray(cfg.hiddenPropertyIds) ? cfg.hiddenPropertyIds : [];
        cfg.allowSubmitAnotherResponse = cfg.allowSubmitAnotherResponse !== false;
        if (cfg.allowSendToEmail === undefined) {
            cfg.allowSendToEmail = cfg.allowViewResponse !== undefined ? Boolean(cfg.allowViewResponse) : true;
        }
        cfg.submissionPermissions = cfg.submissionPermissions || 'workspace';
        // Sync questions from schema while preserving custom question order and excluding person/checkbox/meta types
        const eligibleProps = db.schema.filter(s => !FORM_EXCLUDED_PROP_TYPES.has(s.type));
        const eligibleIds = new Set(eligibleProps.map(s => s.id));
        if (!Array.isArray(cfg.questions))
            cfg.questions = [];
        cfg.questions = cfg.questions.filter(q => eligibleIds.has(q.propertyId) && !cfg.hiddenPropertyIds.includes(q.propertyId));
        const coveredPropIds = new Set(cfg.questions.map(q => q.propertyId));
        eligibleProps.forEach(prop => {
            if (coveredPropIds.has(prop.id))
                return;
            if (cfg.hiddenPropertyIds.includes(prop.id) && prop.type !== 'title')
                return;
            cfg.questions.push({
                id: uid(),
                propertyId: prop.id,
                label: prop.name,
                required: prop.type === 'title' || cfg.requiredPropertyIds.includes(prop.id),
                displayMode: prop.type === 'multi_select' ? 'list' : undefined,
                maxSizeMb: prop.type === 'files' ? 10 : undefined
            });
        });
        const syncFormBlocks = () => {
            if (!Array.isArray(cfg.blocks))
                cfg.blocks = [];
            const validQIds = new Set(cfg.questions.map(q => q.id));
            const seenQIds = new Set();
            cfg.blocks = cfg.blocks.filter(b => {
                if (!b || !b.kind)
                    return false;
                if (b.kind === 'question') {
                    if (!b.questionId || !validQIds.has(b.questionId) || seenQIds.has(b.questionId))
                        return false;
                    seenQIds.add(b.questionId);
                    return true;
                }
                return ['text', 'h1', 'h2', 'h3', 'bullet', 'callout', 'divider'].includes(b.kind);
            });
            cfg.questions.forEach(q => {
                if (!seenQIds.has(q.id)) {
                    cfg.blocks.push({ id: uid(), kind: 'question', questionId: q.id });
                    seenQIds.add(q.id);
                }
            });
            // Reorder cfg.questions to match block stream order so conditions & responses stay consistent
            const byQId = new Map(cfg.questions.map(q => [q.id, q]));
            const ordered = [];
            cfg.blocks.forEach(b => {
                if (b.kind === 'question' && b.questionId && byQId.has(b.questionId)) {
                    ordered.push(byQId.get(b.questionId));
                }
            });
            if (ordered.length === cfg.questions.length)
                cfg.questions = ordered;
        };
        const syncRequiredFromQuestions = () => {
            cfg.requiredPropertyIds = Array.from(new Set(cfg.questions.filter(q => q.required).map(q => q.propertyId)));
        };
        cfg.questions.forEach(q => {
            const prop = db.schema.find(s => s.id === q.propertyId);
            if (prop?.type === 'title')
                q.required = true;
            else if (q.required === undefined && cfg.requiredPropertyIds.includes(q.propertyId))
                q.required = true;
            if (prop?.type === 'files' && !(Number(q.maxSizeMb) > 0))
                q.maxSizeMb = 10;
        });
        syncRequiredFromQuestions();
        syncFormBlocks();
        const isRespondActive = () => {
            return ro || cfg.formMode === 'respond' || window.__architectFormOpenMode === dbPage.id;
        };
        let isRespondMode = isRespondActive();
        const draftRow = {
            id: '__form_draft__',
            title: '',
            icon: '📄',
            propertyValues: {}
        };
        const fieldErrors = {};
        let submittedRow = null;
        let activeQuestionId = null;
        let activeFormBlockId = null;
        const shell = document.createElement('div');
        shell.className = 'db-form-shell' + (isRespondMode ? ' is-responder-mode' : ' is-builder-mode');
        shell.dataset.formMode = isRespondMode ? 'respond' : 'editor';
        let slashMenuEl = null;
        const closeSlashMenu = () => {
            if (slashMenuEl) {
                slashMenuEl.remove();
                slashMenuEl = null;
            }
        };
        const openFormSettingsPopover = (anchor) => openFormDesignAndSettingsPopover(anchor, dbPage, () => renderShell());
        const addTextBlock = (kind = 'text', afterBlockId) => {
            syncFormBlocks();
            const nb = { id: uid(), kind, html: '' };
            const idx = afterBlockId ? cfg.blocks.findIndex(b => b.id === afterBlockId) : -1;
            if (idx >= 0)
                cfg.blocks.splice(idx + 1, 0, nb);
            else
                cfg.blocks.push(nb);
            activeFormBlockId = nb.id;
            activeQuestionId = null;
            persist(false);
            drawFormBody();
            if (kind !== 'divider') {
                const el = shell.querySelector(`[data-form-block-id="${CSS.escape(nb.id)}"] .db-form-text-editable`);
                if (el)
                    el.focus({ preventScroll: true });
            }
            return nb;
        };
        const addNewQuestion = (type, afterBlockId) => {
            if (type === 'person' || type === 'checkbox')
                type = 'select';
            const nextNum = cfg.questions.length + 1;
            const baseLabel = type === 'files' ? `Upload file ${nextNum}` : `Question ${nextNum}`;
            const newProp = {
                id: uid(),
                name: baseLabel,
                type,
                width: 170
            };
            if (type === 'select' || type === 'multi_select') {
                newProp.options = [
                    { id: uid(), name: 'Option 1', color: 'blue' },
                    { id: uid(), name: 'Option 2', color: 'yellow' }
                ];
            }
            db.schema.push(newProp);
            db.views.forEach(v => {
                if (!v.propertyOrder.includes(newProp.id))
                    v.propertyOrder.push(newProp.id);
                if (!v.visiblePropertyIds.includes(newProp.id))
                    v.visiblePropertyIds.push(newProp.id);
            });
            const newQ = {
                id: uid(),
                propertyId: newProp.id,
                label: baseLabel,
                required: false,
                displayMode: type === 'multi_select' ? 'list' : undefined,
                maxSizeMb: type === 'files' ? 10 : undefined
            };
            cfg.questions.push(newQ);
            const nb = { id: uid(), kind: 'question', questionId: newQ.id };
            const targetAnchorId = afterBlockId || activeFormBlockId || (activeQuestionId ? cfg.blocks.find(b => b.questionId === activeQuestionId)?.id : null);
            const idx = targetAnchorId ? cfg.blocks.findIndex(b => b.id === targetAnchorId) : -1;
            if (idx >= 0)
                cfg.blocks.splice(idx + 1, 0, nb);
            else
                cfg.blocks.push(nb);
            syncFormBlocks();
            activeQuestionId = newQ.id;
            activeFormBlockId = nb.id;
            persist(false);
            renderShell();
            const inp = shell.querySelector(`[data-question-id="${CSS.escape(newQ.id)}"] .db-form-q-label`);
            if (inp) {
                inp.focus({ preventScroll: true });
                inp.select();
            }
            return newQ;
        };
        activeFormControllers.set(dbPage.id, {
            addQuestion: (t, afterId) => addNewQuestion(t, afterId),
            addTextBlock: (k, afterId) => addTextBlock(k, afterId)
        });
        const jumpToResponses = () => {
            let tableView = db.views.find(v => v.type === 'table');
            if (!tableView) {
                tableView = buildDefaultView(db.schema, 'table', 'Responses');
                db.views.push(tableView);
            }
            db.activeViewId = tableView.id;
            persist(false);
            refreshAllDatabaseViews();
        };
        const formBody = document.createElement('form');
        formBody.className = 'db-form-fields';
        formBody.noValidate = true;
        const FORM_SLASH_COMMANDS = [
            { cmd: '/question', label: 'Question (Text)', kind: 'question', propType: 'text' },
            { cmd: '/select', label: 'Select question', kind: 'question', propType: 'multi_select' },
            { cmd: '/upload', label: 'Upload file question', kind: 'question', propType: 'files' },
            { cmd: '/phone', label: 'Phone (+country) question', kind: 'question', propType: 'phone' },
            { cmd: '/number', label: 'Number question', kind: 'question', propType: 'number' },
            { cmd: '/date', label: 'Date question', kind: 'question', propType: 'date' },
            { cmd: '/email', label: 'Email question', kind: 'question', propType: 'email' },
            { cmd: '/url', label: 'URL question', kind: 'question', propType: 'url' },
            { cmd: '/text', label: 'Free text paragraph', kind: 'block', blockKind: 'text' },
            { cmd: '/h1', label: 'Heading 1', kind: 'block', blockKind: 'h1' },
            { cmd: '/h2', label: 'Heading 2', kind: 'block', blockKind: 'h2' },
            { cmd: '/h3', label: 'Heading 3', kind: 'block', blockKind: 'h3' },
            { cmd: '/bullet', label: 'Bullet item', kind: 'block', blockKind: 'bullet' },
            { cmd: '/callout', label: 'Callout box', kind: 'block', blockKind: 'callout' },
            { cmd: '/divider', label: 'Divider line', kind: 'block', blockKind: 'divider' }
        ];
        const moveFormBlock = (blockIdx, delta) => {
            const targetIdx = blockIdx + delta;
            if (targetIdx < 0 || targetIdx >= cfg.blocks.length)
                return;
            const arr = cfg.blocks;
            [arr[blockIdx], arr[targetIdx]] = [arr[targetIdx], arr[blockIdx]];
            syncFormBlocks();
            persist(false);
            drawFormBody();
        };
        const drawFormBody = () => {
            closeSlashMenu();
            syncFormBlocks();
            formBody.replaceChildren();
            if (isRespondMode && cfg.isClosed) {
                const closed = document.createElement('div');
                closed.className = 'db-form-closed-banner';
                closed.innerHTML = '<strong>This form is closed.</strong><span>No new responses can be submitted.</span>';
                formBody.append(closed);
                return;
            }
            if (submittedRow && isRespondMode) {
                const doneBox = document.createElement('div');
                doneBox.className = 'db-form-submitted';
                doneBox.innerHTML = `<strong>✓ ${escHtml(cfg.confirmationTitle || 'Thank you!')}</strong><span>${escHtml(cfg.confirmationBody || `Submitted “${submittedRow.title}”`)}</span>`;
                const btnRow = document.createElement('div');
                btnRow.className = 'db-form-submitted-actions';
                if (cfg.allowSendToEmail !== false) {
                    const emailWrap = document.createElement('div');
                    emailWrap.className = 'db-form-sendmail-inline';
                    const emailToggle = document.createElement('button');
                    emailToggle.type = 'button';
                    emailToggle.className = 'secondary-button';
                    emailToggle.dataset.formAction = 'send-to-email';
                    emailToggle.textContent = '✉ Send response to my mail';
                    emailToggle.onclick = () => {
                        if (emailWrap.querySelector('input'))
                            return;
                        const inp = document.createElement('input');
                        inp.type = 'email';
                        inp.className = 'db-form-input';
                        inp.placeholder = 'you@example.com';
                        const sendBtn = document.createElement('button');
                        sendBtn.type = 'button';
                        sendBtn.className = 'primary-button';
                        sendBtn.textContent = 'Send copy';
                        sendBtn.onclick = () => {
                            if (triggerSendResponseToMail(dbPage, submittedRow, inp.value)) {
                                emailWrap.replaceChildren(document.createTextNode(`✓ Sent copy to ${inp.value.trim()}`));
                            }
                        };
                        emailWrap.append(inp, sendBtn);
                        inp.focus();
                    };
                    emailWrap.append(emailToggle);
                    btnRow.append(emailWrap);
                }
                if (cfg.allowSubmitAnotherResponse !== false) {
                    const anotherBtn = document.createElement('button');
                    anotherBtn.type = 'button';
                    anotherBtn.className = 'primary-button';
                    anotherBtn.textContent = 'Submit another response';
                    anotherBtn.onclick = () => {
                        submittedRow = null;
                        draftRow.title = '';
                        draftRow.propertyValues = {};
                        Object.keys(fieldErrors).forEach(k => delete fieldErrors[k]);
                        drawFormBody();
                    };
                    btnRow.append(anotherBtn);
                }
                doneBox.append(btnRow);
                formBody.append(doneBox);
                return;
            }
            cfg.blocks.forEach((b, bIdx) => {
                if (b.kind !== 'question') {
                    if (isRespondMode || ro) {
                        if (b.kind === 'divider') {
                            const hr = document.createElement('div');
                            hr.className = 'db-form-divider-row';
                            hr.innerHTML = '<div class="db-form-divider-line"></div>';
                            formBody.append(hr);
                            return;
                        }
                        if (!stripFormHtml(b.html))
                            return;
                        const out = document.createElement('div');
                        out.className = `db-form-text-block is-responder is-${b.kind}`;
                        out.dataset.formBlockId = b.id;
                        const inner = document.createElement('div');
                        inner.className = 'db-form-text-editable';
                        inner.innerHTML = sanitizeFormRichHtml(b.html || '');
                        out.append(inner);
                        formBody.append(out);
                        return;
                    }
                    const wrap = document.createElement('div');
                    wrap.className = `db-form-text-block is-builder is-${b.kind}`;
                    wrap.dataset.formBlockId = b.id;
                    const tools = document.createElement('div');
                    tools.className = 'db-form-text-block-tools';
                    if (b.kind !== 'divider') {
                        const kSel = document.createElement('select');
                        kSel.className = 'db-form-ctrl-btn';
                        [['text', '¶ Text'], ['h1', 'H1'], ['h2', 'H2'], ['h3', 'H3'], ['bullet', '• Bullet'], ['callout', '💡 Callout']].forEach(([k, l]) => {
                            const o = document.createElement('option');
                            o.value = k;
                            o.textContent = l;
                            kSel.append(o);
                        });
                        kSel.value = b.kind;
                        kSel.onchange = () => { b.kind = kSel.value; persist(false); drawFormBody(); };
                        tools.append(kSel);
                    }
                    if (bIdx > 0) {
                        const up = document.createElement('button');
                        up.type = 'button';
                        up.className = 'db-form-ctrl-btn';
                        up.textContent = '↑';
                        up.onclick = () => moveFormBlock(bIdx, -1);
                        tools.append(up);
                    }
                    if (bIdx < cfg.blocks.length - 1) {
                        const dn = document.createElement('button');
                        dn.type = 'button';
                        dn.className = 'db-form-ctrl-btn';
                        dn.textContent = '↓';
                        dn.onclick = () => moveFormBlock(bIdx, 1);
                        tools.append(dn);
                    }
                    const del = document.createElement('button');
                    del.type = 'button';
                    del.className = 'db-form-ctrl-btn danger';
                    del.textContent = '🗑';
                    del.onclick = () => {
                        cfg.blocks = cfg.blocks.filter(x => x.id !== b.id);
                        persist(false);
                        drawFormBody();
                    };
                    tools.append(del);
                    if (b.kind === 'divider') {
                        const row = document.createElement('div');
                        row.className = 'db-form-divider-row';
                        row.innerHTML = '<div class="db-form-divider-line"></div>';
                        wrap.append(tools, row);
                        formBody.append(wrap);
                        return;
                    }
                    const ed = document.createElement('div');
                    ed.className = 'db-form-text-editable';
                    ed.contentEditable = 'true';
                    ed.dataset.placeholder = b.kind === 'h1' ? 'Heading 1…' : b.kind === 'h2' ? 'Heading 2…' : b.kind === 'h3' ? 'Heading 3…' : b.kind === 'callout' ? 'Callout note…' : "Write freely between questions, or type '/' for commands (/question, /upload…)";
                    ed.innerHTML = sanitizeFormRichHtml(b.html || '');
                    ed.onfocus = () => {
                        activeFormBlockId = b.id;
                        activeQuestionId = null;
                    };
                    let slashSelectionIdx = 0;
                    const openOrUpdateSlashMenu = () => {
                        const txt = (ed.textContent || '').replace(/\u00a0/g, ' ');
                        const match = /(?:^|\s)(\/[a-z-]*)$/i.exec(txt);
                        if (!match) {
                            closeSlashMenu();
                            return;
                        }
                        const query = match[1].toLowerCase();
                        const hits = FORM_SLASH_COMMANDS.filter(c => c.cmd.includes(query) || c.label.toLowerCase().includes(query.slice(1)));
                        if (!hits.length) {
                            closeSlashMenu();
                            return;
                        }
                        if (slashSelectionIdx >= hits.length)
                            slashSelectionIdx = 0;
                        closeSlashMenu();
                        const menu = document.createElement('div');
                        menu.className = 'db-form-slash-menu';
                        const r = ed.getBoundingClientRect();
                        menu.style.left = `${Math.max(12, Math.min(window.innerWidth - 250, r.left))}px`;
                        menu.style.top = `${Math.min(window.innerHeight - 290, r.bottom + 4)}px`;
                        hits.forEach((cmd, idx) => {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'db-form-slash-item' + (idx === slashSelectionIdx ? ' is-selected' : '');
                            btn.dataset.formSlashCmd = cmd.cmd;
                            btn.innerHTML = `<span>${escHtml(cmd.label)}</span><small>${escHtml(cmd.cmd)}</small>`;
                            btn.onmousedown = e => {
                                e.preventDefault();
                                runFormSlashCommand(cmd);
                            };
                            menu.append(btn);
                        });
                        document.body.append(menu);
                        slashMenuEl = menu;
                    };
                    const runFormSlashCommand = (cmd) => {
                        closeSlashMenu();
                        const plain = (ed.textContent || '').replace(/\u00a0/g, ' ');
                        const cleaned = plain.replace(/(?:^|\s)\/[a-z-]*$/i, '').trim();
                        if (!cleaned) {
                            if (cmd.kind === 'block' && cmd.blockKind && cmd.blockKind !== 'divider') {
                                b.kind = cmd.blockKind;
                                b.html = '';
                                persist(false);
                                drawFormBody();
                                const nextEd = shell.querySelector(`[data-form-block-id="${CSS.escape(b.id)}"] .db-form-text-editable`);
                                if (nextEd)
                                    nextEd.focus();
                                return;
                            }
                            cfg.blocks = cfg.blocks.filter(x => x.id !== b.id);
                            if (cmd.kind === 'question' && cmd.propType) {
                                addNewQuestion(cmd.propType, bIdx > 0 ? cfg.blocks[bIdx - 1]?.id : null);
                            }
                            else if (cmd.kind === 'block' && cmd.blockKind) {
                                addTextBlock(cmd.blockKind, bIdx > 0 ? cfg.blocks[bIdx - 1]?.id : null);
                            }
                            return;
                        }
                        b.html = escHtml(cleaned);
                        if (cmd.kind === 'question' && cmd.propType) {
                            addNewQuestion(cmd.propType, b.id);
                        }
                        else if (cmd.kind === 'block' && cmd.blockKind) {
                            addTextBlock(cmd.blockKind, b.id);
                        }
                    };
                    ed.oninput = () => {
                        b.html = sanitizeFormRichHtml(ed.innerHTML);
                        persist(false);
                        openOrUpdateSlashMenu();
                    };
                    ed.onkeydown = e => {
                        if (slashMenuEl) {
                            const items = Array.from(slashMenuEl.querySelectorAll('.db-form-slash-item'));
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                slashSelectionIdx = (slashSelectionIdx + 1) % Math.max(1, items.length);
                                items.forEach((el, i) => el.classList.toggle('is-selected', i === slashSelectionIdx));
                                return;
                            }
                            if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                slashSelectionIdx = (slashSelectionIdx - 1 + Math.max(1, items.length)) % Math.max(1, items.length);
                                items.forEach((el, i) => el.classList.toggle('is-selected', i === slashSelectionIdx));
                                return;
                            }
                            if (e.key === 'Enter' && items[slashSelectionIdx]) {
                                e.preventDefault();
                                const cmdName = items[slashSelectionIdx].dataset.formSlashCmd;
                                const found = FORM_SLASH_COMMANDS.find(c => c.cmd === cmdName);
                                if (found)
                                    runFormSlashCommand(found);
                                return;
                            }
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                closeSlashMenu();
                                return;
                            }
                        }
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            addTextBlock('text', b.id);
                        }
                        else if (e.key === 'Backspace' && !stripFormHtml(ed.innerHTML)) {
                            e.preventDefault();
                            cfg.blocks = cfg.blocks.filter(x => x.id !== b.id);
                            persist(false);
                            drawFormBody();
                        }
                    };
                    wrap.append(tools, ed);
                    formBody.append(wrap);
                    return;
                }
                const q = cfg.questions.find(x => x.id === b.questionId);
                if (!q)
                    return;
                const prop = db.schema.find(s => s.id === q.propertyId);
                if (!prop)
                    return;
                const fieldCard = renderFormQuestionCard({
                    dbPage,
                    q,
                    prop,
                    blockId: b.id,
                    draftRow,
                    fieldErrors,
                    isRespondMode,
                    isReadOnly: ro,
                    isFocused: activeQuestionId === q.id,
                    onFocus: () => {
                        if (!isRespondMode && (activeQuestionId !== q.id || activeFormBlockId !== b.id)) {
                            activeQuestionId = q.id;
                            activeFormBlockId = b.id;
                            formBody.querySelectorAll('.db-form-field-card').forEach(el => el.classList.toggle('is-focused', el.dataset.questionId === q.id));
                        }
                    },
                    onRedraw: () => drawFormBody(),
                    onAnswerUpdated: () => {
                        if (['select', 'multi_select', 'status'].includes(prop.type) && isRespondMode)
                            drawFormBody();
                    },
                    onAddTextBelow: () => addTextBlock('text', b.id),
                    canMoveUp: bIdx > 0,
                    canMoveDown: bIdx < cfg.blocks.length - 1,
                    onMoveUp: () => moveFormBlock(bIdx, -1),
                    onMoveDown: () => moveFormBlock(bIdx, 1),
                    onDuplicate: () => {
                        const dupProp = structuredCloneSafe(prop);
                        dupProp.id = uid();
                        dupProp.name = `${prop.name} (copy)`;
                        db.schema.push(dupProp);
                        const dupQ = { ...structuredCloneSafe(q), id: uid(), propertyId: dupProp.id, label: `${q.label || prop.name} (copy)`, condition: null };
                        const qIdx = cfg.questions.findIndex(x => x.id === q.id);
                        cfg.questions.splice(qIdx + 1, 0, dupQ);
                        cfg.blocks.splice(bIdx + 1, 0, { id: uid(), kind: 'question', questionId: dupQ.id });
                        syncFormBlocks();
                        cfg.requiredPropertyIds = Array.from(new Set(cfg.questions.filter(x => x.required).map(x => x.propertyId)));
                        persist(false);
                        drawFormBody();
                    },
                    onDelete: () => {
                        cfg.questions = cfg.questions.filter(x => x.id !== q.id);
                        cfg.questions.forEach(other => {
                            if (other.condition?.parentQuestionId === q.id)
                                other.condition = null;
                        });
                        cfg.blocks = cfg.blocks.filter(x => x.questionId !== q.id);
                        cfg.hiddenPropertyIds = [...new Set([...cfg.hiddenPropertyIds, q.propertyId])];
                        cfg.requiredPropertyIds = Array.from(new Set(cfg.questions.filter(x => x.required).map(x => x.propertyId)));
                        persist(false);
                        drawFormBody();
                    }
                });
                if (fieldCard)
                    formBody.append(fieldCard);
            });
            if (submittedRow && !isRespondMode) {
                const doneBox = document.createElement('div');
                doneBox.className = 'db-form-submitted';
                doneBox.innerHTML = `<strong>✓ Submitted “${escHtml(submittedRow.title)}”</strong>`;
                const anotherBtn = document.createElement('button');
                anotherBtn.type = 'button';
                anotherBtn.className = 'secondary-button';
                anotherBtn.textContent = 'Submit another response';
                anotherBtn.onclick = () => {
                    submittedRow = null;
                    draftRow.title = '';
                    draftRow.propertyValues = {};
                    drawFormBody();
                };
                doneBox.append(anotherBtn);
                formBody.append(doneBox);
            }
            const footer = document.createElement('div');
            footer.className = 'db-form-footer';
            const identPill = document.createElement('span');
            identPill.className = 'db-form-identity-pill';
            identPill.textContent = cfg.anonymousSubmissions
                ? '🕶 Anonymous responses'
                : `Submitting as ${actorName()}`;
            const subBtn = document.createElement('button');
            subBtn.type = 'submit';
            subBtn.className = 'share-button db-form-submit-btn';
            subBtn.textContent = cfg.submitLabel || 'Submit';
            footer.append(identPill, subBtn);
            formBody.append(footer);
        };
        formBody.onsubmit = e => {
            e.preventDefault();
            if (cfg.isClosed && isRespondMode) {
                host?.toast?.('This form is closed.');
                return;
            }
            const res = validateAndSubmitForm(dbPage, draftRow, fieldErrors);
            if (!res.ok) {
                drawFormBody();
                return;
            }
            submittedRow = res.row;
            draftRow.title = '';
            draftRow.propertyValues = {};
            drawFormBody();
        };
        const buildDedicatedFormToolbar = () => {
            const tb = document.createElement('div');
            tb.className = 'db-form-toolbar';
            tb.setAttribute('role', 'toolbar');
            tb.setAttribute('aria-label', 'Forms builder toolbar');
            const closeAllMenus = () => {
                tb.querySelectorAll('.db-form-tb-menu').forEach(m => m.setAttribute('hidden', ''));
            };
            const mkBtn = (label, title, cls = '', onClick) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = `db-form-tb-btn ${cls}`.trim();
                b.title = title;
                b.textContent = label;
                if (onClick)
                    b.onclick = () => { closeAllMenus(); onClick(); };
                return b;
            };
            // Free text / formatting controls
            const textGroup = document.createElement('div');
            textGroup.className = 'db-form-tb-group';
            const txtInsertBtn = mkBtn('¶ Text block', 'Insert free-text paragraph block (also via Enter)', '', () => addTextBlock('text', activeFormBlockId));
            txtInsertBtn.dataset.formTb = 'insert-text';
            textGroup.append(txtInsertBtn);
            const hDrop = document.createElement('div');
            hDrop.className = 'db-form-tb-dropdown';
            const hBtn = mkBtn('Blocks ▾', 'Insert heading, bullet, callout or divider', '');
            hBtn.dataset.formTb = 'blocks-dropdown';
            const hMenu = document.createElement('div');
            hMenu.className = 'db-form-tb-menu';
            hMenu.setAttribute('hidden', '');
            [
                { kind: 'h1', label: 'H1 Heading 1' },
                { kind: 'h2', label: 'H2 Heading 2' },
                { kind: 'h3', label: 'H3 Heading 3' },
                { kind: 'bullet', label: '• Bullet list item' },
                { kind: 'callout', label: '💡 Callout block' },
                { kind: 'divider', label: '― Divider line' }
            ].forEach(item => {
                const mi = document.createElement('button');
                mi.type = 'button';
                mi.className = 'db-form-tb-item';
                mi.dataset.formBlockInsert = item.kind;
                mi.textContent = item.label;
                mi.onclick = () => { closeAllMenus(); addTextBlock(item.kind, activeFormBlockId); };
                hMenu.append(mi);
            });
            hBtn.onclick = e => {
                e.stopPropagation();
                const open = hMenu.hasAttribute('hidden');
                closeAllMenus();
                if (open)
                    hMenu.removeAttribute('hidden');
            };
            hDrop.append(hBtn, hMenu);
            textGroup.append(hDrop);
            [['B', 'Bold', 'bold'], ['I', 'Italic', 'italic'], ['U', 'Underline', 'underline']].forEach(([lbl, tip, cmd]) => {
                const fb = mkBtn(lbl, tip, 'is-fmt');
                fb.onmousedown = e => {
                    e.preventDefault();
                    try {
                        document.execCommand(cmd, false);
                    }
                    catch { }
                };
                textGroup.append(fb);
            });
            const sep = document.createElement('span');
            sep.className = 'db-form-tb-sep';
            // Question insertion controls: Select dropdown (Select + Multi-select), no Checkbox, no Person, includes Phone & Upload
            const qGroup = document.createElement('div');
            qGroup.className = 'db-form-tb-group';
            const textQBtn = mkBtn('+ ¶ Question', 'Add text question (/question)', 'is-primary-q', () => addNewQuestion('text'));
            textQBtn.dataset.addQuestionType = 'text';
            qGroup.append(textQBtn);
            const selBtn = mkBtn('+ ▾ Select', 'Add Select question (/select)', 'is-primary-q', () => addNewQuestion('multi_select'));
            selBtn.dataset.addQuestionType = 'select';
            qGroup.append(selBtn);
            [
                { type: 'number', label: '# Number' },
                { type: 'date', label: '📅 Date' },
                { type: 'email', label: '@ Email' },
                { type: 'phone', label: '☎ Phone' },
                { type: 'url', label: '🔗 URL' },
                { type: 'files', label: '📎 Upload' }
            ].forEach(item => {
                const b = mkBtn(item.label, `Add ${item.label.slice(2)} question`, 'is-primary-q', () => addNewQuestion(item.type));
                b.dataset.addQuestionType = item.type;
                qGroup.append(b);
            });
            const onDocClick = () => {
                if (!tb.isConnected) {
                    document.removeEventListener('click', onDocClick);
                    return;
                }
                closeAllMenus();
            };
            document.addEventListener('click', onDocClick);
            tb.append(textGroup, qGroup);
            return tb;
        };
        const renderShell = () => {
            shell.replaceChildren();
            isRespondMode = isRespondActive();
            const respondActive = isRespondMode;
            shell.className = 'db-form-shell' + (respondActive ? ' is-responder-mode' : ' is-builder-mode');
            shell.dataset.formMode = respondActive ? 'respond' : 'editor';
            if (!ro) {
                const topStrip = document.createElement('div');
                topStrip.className = 'db-form-top-actions';
                const modePill = document.createElement('span');
                modePill.className = 'db-form-mode-badge';
                modePill.textContent = respondActive ? '👁 Responder preview' : '📝 Form builder';
                const rightBtns = document.createElement('div');
                rightBtns.className = 'db-form-top-btns';
                const respCount = getDatabaseRows(dbPage.id).length;
                const respBtn = document.createElement('button');
                respBtn.type = 'button';
                respBtn.className = 'db-toolbar-btn';
                respBtn.dataset.formAction = 'view-responses';
                respBtn.textContent = `📊 Responses (${respCount})`;
                respBtn.onclick = jumpToResponses;
                const prevBtn = document.createElement('button');
                prevBtn.type = 'button';
                prevBtn.className = 'db-toolbar-btn' + (respondActive ? ' is-active' : '');
                prevBtn.dataset.formAction = 'toggle-preview';
                prevBtn.textContent = respondActive ? '✎ Edit form' : '👁 Preview';
                prevBtn.onclick = () => {
                    window.__architectFormOpenMode = null;
                    cfg.formMode = respondActive ? 'editor' : 'respond';
                    submittedRow = null;
                    persist(false);
                    renderShell();
                };
                const settingsBtn = document.createElement('button');
                settingsBtn.type = 'button';
                settingsBtn.className = 'db-toolbar-btn';
                settingsBtn.dataset.formAction = 'form-settings';
                settingsBtn.textContent = '⚙ Settings & Link';
                settingsBtn.onclick = () => openFormSettingsPopover(settingsBtn);
                rightBtns.append(respBtn, prevBtn, settingsBtn);
                topStrip.append(modePill, rightBtns);
                shell.append(topStrip);
                if (!respondActive) {
                    shell.append(buildDedicatedFormToolbar());
                }
            }
            const header = document.createElement('div');
            header.className = 'db-form-header';
            if (respondActive || ro) {
                const h2 = document.createElement('h2');
                h2.className = 'db-form-title-static';
                h2.textContent = cfg.title || dbPage.title || 'Form';
                header.append(h2);
                if (cfg.description) {
                    const p = document.createElement('p');
                    p.className = 'db-form-desc-static';
                    p.textContent = cfg.description;
                    header.append(p);
                }
            }
            else {
                const titleInp = document.createElement('input');
                titleInp.type = 'text';
                titleInp.className = 'db-form-title-input';
                titleInp.value = cfg.title || `${dbPage.title || 'New form'}`;
                titleInp.onchange = () => { cfg.title = titleInp.value; persist(false); };
                const descInp = document.createElement('textarea');
                descInp.className = 'db-form-desc-input';
                descInp.placeholder = 'Optional form instructions…';
                descInp.value = cfg.description || '';
                descInp.onchange = () => { cfg.description = descInp.value; persist(false); };
                header.append(titleInp, descInp);
            }
            shell.append(header, formBody);
            drawFormBody();
        };
        renderShell();
        canvas.append(shell);
    }
    let activeWorkflowOverlay = null;
    let activeDbActionMenu = null;
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
    function userInitials(name) {
        const parts = String(name || 'U').trim().split(/\s+/).filter(Boolean);
        if (parts.length >= 2)
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return (parts[0] || 'U').slice(0, 2).toUpperCase();
    }
    const DB_WORKFLOW_ACTION_DEFS = [
        { kind: 'add_page', label: 'Add page to...', icon: '＋', keywords: 'add page create database row' },
        { kind: 'edit_pages', label: 'Edit pages in...', icon: '✎', keywords: 'edit pages property set update this row related' },
        { kind: 'send_notification', label: 'Send notification to...', icon: '🔔', keywords: 'send notification alert inbox bell' },
        { kind: 'send_message', label: 'Send message...', icon: '💬', isNew: true, keywords: 'send message chat dm group channel' },
        { kind: 'send_webhook', label: 'Send webhook', icon: '{}', keywords: 'send webhook http post api json' },
        { kind: 'show_confirmation', label: 'Show confirmation', icon: '?', keywords: 'show confirmation branch choice modal button' },
        { kind: 'open_page', label: 'Open page, form, or URL', icon: '↗', keywords: 'open page form url link view navigate' },
        { kind: 'define_variables', label: 'Define variables', icon: '≡', keywords: 'define variables var formula let' }
    ];
    function openDbActionSearchMenu(anchorEl, onPick) {
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
            if (ev.key === 'Escape') {
                ev.preventDefault();
                ev.stopPropagation();
                closeDbActionMenu();
            }
            if (ev.key === 'Enter') {
                const first = list.querySelector('.notion-action-row');
                if (first) {
                    ev.preventDefault();
                    first.click();
                }
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
        const onOutside = (ev) => {
            if (!pop.isConnected) {
                document.removeEventListener('mousedown', onOutside, true);
                return;
            }
            const t = ev.target;
            if (!pop.contains(t) && !anchorEl.contains(t)) {
                closeDbActionMenu();
                document.removeEventListener('mousedown', onOutside, true);
            }
        };
        document.addEventListener('mousedown', onOutside, true);
        requestAnimationFrame(() => search.focus());
    }
    function describeActionSummary(act, db, users) {
        if (act.kind === 'set_property' || (act.kind === 'edit_pages' && (act.targetScope || 'this_page') === 'this_page')) {
            const prop = db.schema.find(s => s.id === act.propertyId);
            const pName = prop?.name || 'property';
            if (act.useFormula)
                return `Replace ${pName} with ∑ ${act.formulaExpr || 'formula'}`;
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
            if (act.recipientMode === 'everyone')
                return 'Send notification to Everyone';
            if (act.recipientMode === 'person_prop') {
                const pp = db.schema.find(s => s.id === act.recipientPropertyId);
                return `Send notification to ${pp?.name || 'Person property'}`;
            }
            return 'Send notification to Specific people';
        }
        if (act.kind === 'send_message') {
            if (act.chatTargetAccount)
                return `Send message to DM @${act.chatTargetAccount}`;
            const ch = (getState()?.chats || []).find((c) => c.id === act.chatChannelId);
            return `Send message to #${ch?.name || 'general'}`;
        }
        if (act.kind === 'send_webhook')
            return `Send webhook ${act.webhookUrl ? '→ ' + act.webhookUrl.slice(0, 32) : ''}`.trim();
        if (act.kind === 'define_variables')
            return `Define variables (${(act.variables || []).length})`;
        if (act.kind === 'open_page') {
            if (act.openMode === 'url')
                return `Open URL ${act.openUrl || ''}`.trim();
            if (!act.openPageId || act.openPageId === 'current_row')
                return 'Open Current page';
            const pg = getPageById(act.openPageId);
            return `Open ${pg?.title || 'page'}`;
        }
        if (act.kind === 'show_confirmation') {
            return `Show confirmation: “${act.confirmMessage || 'Are you sure?'}”`;
        }
        return 'Action step';
    }
    function actionKindIcon(kind) {
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
    function openNotionWorkflowModal(opts) {
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
            if (e.target === overlay) {
                closeDbActionMenu();
                opts.onCommit();
                closeNotionWorkflowModal();
            }
        });
        const onEsc = (e) => {
            if (e.key === 'Escape' && activeWorkflowOverlay === overlay) {
                if (activeDbActionMenu) {
                    closeDbActionMenu();
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                opts.onCommit();
                closeNotionWorkflowModal();
                document.removeEventListener('keydown', onEsc, true);
            }
        };
        document.addEventListener('keydown', onEsc, true);
        const makeDefaultDbAction = (kind) => {
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
            if (kind === 'define_variables')
                return { id: aid, kind, variables: [{ id: uid(), name: 'status', mode: 'text', value: 'Done' }] };
            if (kind === 'send_message')
                return { id: aid, kind, chatChannelId: getState()?.chats?.[0]?.id || 'chat-general', message: '' };
            if (kind === 'send_webhook')
                return { id: aid, kind, webhookUrl: 'https://', webhookBody: '' };
            if (kind === 'edit_pages')
                return { id: aid, kind, targetScope: 'this_page', propertyId: db.schema[1]?.id || db.schema[0]?.id, value: '' };
            if (kind === 'set_property')
                return { id: aid, kind, propertyId: db.schema[1]?.id || db.schema[0]?.id, value: '' };
            if (kind === 'add_page')
                return { id: aid, kind, targetDatabaseId: opts.dbPage.id, title: 'New item' };
            if (kind === 'open_page')
                return { id: aid, kind, openMode: 'page', openPageId: 'current_row' };
            return { id: aid, kind };
        };
        const drawModal = () => {
            modal.replaceChildren();
            const dbPages = getDatabasePages();
            const allPages = (getState()?.pages || []).filter((pg) => !pg.databaseId);
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
                host?.iconPickerForValue?.(currentIcon, true, (nextIcon) => {
                    currentIcon = nextIcon || '';
                    if (auto)
                        auto.icon = currentIcon || undefined;
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
                if (auto)
                    auto.name = val;
                opts.onRename?.(val);
                opts.onCommit();
            };
            const hdrRight = document.createElement('div');
            hdrRight.className = 'notion-wf-hdr-actions';
            if (auto) {
                const enLbl = document.createElement('label');
                enLbl.className = 'notion-wf-switch-pill';
                const enCb = document.createElement('input');
                enCb.type = 'checkbox';
                enCb.checked = auto.enabled !== false;
                enCb.onchange = () => { auto.enabled = enCb.checked; opts.onCommit(); };
                enLbl.append(enCb, document.createTextNode(auto.enabled !== false ? 'Active' : 'Paused'));
                hdrRight.append(enLbl);
                if (opts.onDeleteAutomation) {
                    const delA = document.createElement('button');
                    delA.type = 'button';
                    delA.className = 'notion-wf-icon-btn';
                    delA.title = 'Delete automation';
                    delA.textContent = '🗑';
                    delA.onclick = () => { opts.onDeleteAutomation?.(); opts.onCommit(); closeNotionWorkflowModal(); };
                    hdrRight.append(delA);
                }
            }
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'notion-wf-close-btn';
            closeBtn.textContent = '×';
            closeBtn.setAttribute('aria-label', 'Close');
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
                    const o = document.createElement('option');
                    o.value = v;
                    o.textContent = l;
                    matchSel.append(o);
                });
                matchSel.value = auto.triggerMatch || 'all';
                matchSel.onchange = () => { auto.triggerMatch = matchSel.value; opts.onCommit(); };
                whenHead.append(document.createTextNode('When '), matchSel, document.createTextNode(' triggers occur'));
                whenWrap.append(whenHead);
                auto.triggers.forEach((trig, tIdx) => {
                    const tCard = document.createElement('div');
                    tCard.className = 'notion-wf-card notion-wf-trigger-card';
                    const tTop = document.createElement('div');
                    tTop.className = 'notion-wf-card-head';
                    const kindSel = document.createElement('select');
                    kindSel.className = 'notion-wf-inline-select';
                    [['page_added', '📄 Page added'], ['property_edited', '☰ Property edited']].forEach(([k, l]) => {
                        const o = document.createElement('option');
                        o.value = k;
                        o.textContent = l;
                        kindSel.append(o);
                    });
                    kindSel.value = trig.kind;
                    kindSel.onchange = () => {
                        trig.kind = kindSel.value;
                        if (tIdx === 0)
                            auto.trigger = { ...trig };
                        opts.onCommit();
                        drawModal();
                    };
                    tTop.append(kindSel);
                    if (auto.triggers.length > 1) {
                        const rmT = document.createElement('button');
                        rmT.type = 'button';
                        rmT.className = 'notion-wf-icon-btn';
                        rmT.textContent = '×';
                        rmT.onclick = () => {
                            auto.triggers.splice(tIdx, 1);
                            auto.trigger = auto.triggers[0] ? { ...auto.triggers[0] } : { kind: 'page_added' };
                            opts.onCommit();
                            drawModal();
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
                            if (tIdx === 0)
                                auto.trigger = { ...trig };
                            opts.onCommit();
                            drawModal();
                        };
                        condGrid.append(propSel);
                        if (propSel.value !== '__any__') {
                            const opSel = document.createElement('select');
                            opSel.className = 'notion-wf-select';
                            [['any_edit', 'edited'], ['is', 'is'], ['contains', 'contains'], ['is_not_empty', 'is not empty'], ['is_empty', 'is empty']].forEach(([ov, ol]) => {
                                const o = document.createElement('option');
                                o.value = ov;
                                o.textContent = ol;
                                opSel.append(o);
                            });
                            opSel.value = trig.operator || (trig.matchValue ? 'is' : 'any_edit');
                            opSel.onchange = () => {
                                trig.operator = opSel.value;
                                if (tIdx === 0)
                                    auto.trigger = { ...trig };
                                opts.onCommit();
                                drawModal();
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
                                        orSpan.className = 'notion-wf-or-sep';
                                        orSpan.textContent = 'or';
                                        pillBox.append(orSpan);
                                    }
                                    const chip = document.createElement('span');
                                    chip.className = 'notion-wf-cond-pill';
                                    chip.innerHTML = `<span>${escHtml(pv)}</span><button type="button" aria-label="Remove condition">×</button>`;
                                    chip.querySelector('button')?.addEventListener('click', () => {
                                        pills.splice(pIdx, 1);
                                        trig.matchValue = pills[0] || '';
                                        if (tIdx === 0)
                                            auto.trigger = { ...trig };
                                        opts.onCommit();
                                        drawModal();
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
                                            if (tIdx === 0)
                                                auto.trigger = { ...trig };
                                            opts.onCommit();
                                            drawModal();
                                        }
                                    };
                                    pillBox.append(optPick);
                                }
                                else {
                                    const valAdd = document.createElement('input');
                                    valAdd.type = 'text';
                                    valAdd.className = 'notion-wf-pill-input';
                                    valAdd.placeholder = 'Type value + Enter…';
                                    valAdd.onkeydown = ev => {
                                        if (ev.key === 'Enter' && valAdd.value.trim()) {
                                            ev.preventDefault();
                                            pills.push(valAdd.value.trim());
                                            trig.matchValue = pills[0];
                                            if (tIdx === 0)
                                                auto.trigger = { ...trig };
                                            opts.onCommit();
                                            drawModal();
                                        }
                                    };
                                    pillBox.append(valAdd);
                                }
                                tCard.append(condGrid, pillBox);
                            }
                            else {
                                tCard.append(condGrid);
                            }
                        }
                        else {
                            tCard.append(condGrid);
                        }
                    }
                    whenWrap.append(tCard);
                });
                const addTrigBtn = document.createElement('button');
                addTrigBtn.type = 'button';
                addTrigBtn.className = 'notion-wf-add-link';
                addTrigBtn.textContent = '＋ Add trigger';
                addTrigBtn.onclick = () => {
                    auto.triggers.push({ id: uid(), kind: 'property_edited', propertyId: db.schema[1]?.id || '__any__', operator: 'any_edit' });
                    opts.onCommit();
                    drawModal();
                };
                whenWrap.append(addTrigBtn);
            }
            else {
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
            const makeTokenToolbar = (targetInput, onVal) => {
                const bar = document.createElement('div');
                bar.className = 'notion-wf-token-bar';
                const atBtn = document.createElement('button');
                atBtn.type = 'button';
                atBtn.className = 'notion-wf-token-btn';
                atBtn.textContent = '@';
                atBtn.title = 'Insert dynamic property or user';
                const sumBtn = document.createElement('button');
                sumBtn.type = 'button';
                sumBtn.className = 'notion-wf-token-btn';
                sumBtn.textContent = '∑';
                sumBtn.title = 'Insert formula expression';
                const pickerWrap = document.createElement('div');
                pickerWrap.className = 'notion-wf-token-tray';
                pickerWrap.hidden = true;
                const insertTok = (tok) => {
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
                            chip.type = 'button';
                            chip.className = 'notion-wf-mini-chip';
                            chip.textContent = lbl;
                            chip.onclick = () => insertTok(tok);
                            pickerWrap.append(chip);
                        });
                    }
                };
                sumBtn.onclick = () => insertTok('{{= prop("Name") }}');
                bar.append(atBtn, sumBtn);
                return { bar, pickerWrap };
            };
            const renderPropValueEditor = (act, targetSchema, container) => {
                const propRow = document.createElement('div');
                propRow.className = 'notion-wf-field-split';
                const pSel = document.createElement('select');
                pSel.className = 'notion-wf-select';
                targetSchema.filter(s => !propMeta(s.type).readonly).forEach(s => {
                    const o = document.createElement('option');
                    o.value = s.id;
                    o.textContent = s.name;
                    pSel.append(o);
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
                    fInp.type = 'text';
                    fInp.className = 'notion-wf-input';
                    fInp.placeholder = 'e.g. dateAdd(now(), 7, "days") or prop("Points") * 2';
                    fInp.value = act.formulaExpr || '';
                    fInp.oninput = () => { act.formulaExpr = fInp.value; opts.onCommit(); };
                    container.append(fInp);
                }
                else if (chosenProp?.type === 'person') {
                    const curIds = Array.isArray(act.value) ? act.value : (act.value ? [String(act.value)] : []);
                    const chips = document.createElement('div');
                    chips.className = 'notion-wf-people-list';
                    stateUsers.forEach((u) => {
                        const active = curIds.includes(u.id) || curIds.includes(u.name);
                        const chip = document.createElement('button');
                        chip.type = 'button';
                        chip.className = 'notion-wf-person-pill' + (active ? ' is-selected' : '');
                        chip.innerHTML = `<span class="notion-avatar-circle">${escHtml(userInitials(u.name))}</span><span>${escHtml(u.name)}</span>`;
                        chip.onclick = () => { act.value = active ? [] : [u.id]; opts.onCommit(); drawModal(); };
                        chips.append(chip);
                    });
                    container.append(chips);
                }
                else if (chosenProp?.type === 'status' || chosenProp?.type === 'select') {
                    const oSel = document.createElement('select');
                    oSel.className = 'notion-wf-select';
                    oSel.innerHTML = `<option value="">Choose option…</option>${(chosenProp.options || []).map(o => `<option value="${escHtml(o.id)}">${escHtml(o.name)}</option>`).join('')}<option value="@clear">Clear value</option>`;
                    const matchedOpt = (chosenProp.options || []).find(o => o.id === act.value || o.name === act.value);
                    oSel.value = matchedOpt ? matchedOpt.id : (act.value === '@clear' ? '@clear' : '');
                    oSel.onchange = () => { act.value = oSel.value; opts.onCommit(); drawModal(); };
                    container.append(oSel);
                }
                else if (chosenProp?.type === 'checkbox') {
                    const cSel = document.createElement('select');
                    cSel.className = 'notion-wf-select';
                    [['true', 'Checked'], ['false', 'Unchecked'], ['@toggle', 'Toggle current']].forEach(([v, l]) => {
                        const o = document.createElement('option');
                        o.value = v;
                        o.textContent = l;
                        cSel.append(o);
                    });
                    cSel.value = String(act.value ?? 'true');
                    cSel.onchange = () => { act.value = cSel.value; opts.onCommit(); drawModal(); };
                    container.append(cSel);
                }
                else {
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
            const renderDbActionList = (parentEl, listRef, depth = 0) => {
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
                            opts.onCommit();
                            drawModal();
                        });
                    };
                    const rmBtn = document.createElement('button');
                    rmBtn.type = 'button';
                    rmBtn.className = 'notion-wf-icon-btn';
                    rmBtn.title = 'Remove action';
                    rmBtn.textContent = '×';
                    rmBtn.onclick = () => { listRef.splice(idx, 1); opts.onCommit(); drawModal(); };
                    cTop.append(cTitle, rmBtn);
                    card.append(cTop);
                    const body = document.createElement('div');
                    body.className = 'notion-wf-card-body';
                    if (act.kind === 'set_property') {
                        renderPropValueEditor(act, db.schema, body);
                    }
                    else if (act.kind === 'edit_pages') {
                        const scopeSel = document.createElement('select');
                        scopeSel.className = 'notion-wf-select';
                        [['this_page', 'This page'], ['related', 'Related pages'], ['database', 'Pages in database']].forEach(([sv, sl]) => {
                            const o = document.createElement('option');
                            o.value = sv;
                            o.textContent = sl;
                            scopeSel.append(o);
                        });
                        act.targetScope = act.targetScope || 'this_page';
                        scopeSel.value = act.targetScope;
                        scopeSel.onchange = () => { act.targetScope = scopeSel.value; opts.onCommit(); drawModal(); };
                        body.append(scopeSel);
                        if (act.targetScope === 'this_page') {
                            renderPropValueEditor(act, db.schema, body);
                        }
                        else if (act.targetScope === 'related') {
                            const rSel = document.createElement('select');
                            rSel.className = 'notion-wf-select';
                            db.schema.filter(s => s.type === 'relation').forEach(rp => {
                                const o = document.createElement('option');
                                o.value = rp.id;
                                o.textContent = rp.name;
                                rSel.append(o);
                            });
                            act.relationPropertyId = act.relationPropertyId || rSel.options[0]?.value || '';
                            rSel.value = act.relationPropertyId;
                            rSel.onchange = () => { act.relationPropertyId = rSel.value; opts.onCommit(); drawModal(); };
                            body.append(rSel);
                            const relPropObj = db.schema.find(s => s.id === act.relationPropertyId);
                            const relDb = relPropObj?.relationDatabaseId ? getPageById(relPropObj.relationDatabaseId) : null;
                            if (relDb && isDatabasePage(relDb))
                                renderPropValueEditor(act, ensureDatabaseConfig(relDb).schema, body);
                        }
                        else {
                            const dSel = document.createElement('select');
                            dSel.className = 'notion-wf-select';
                            dbPages.forEach((d) => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.title || 'Database'; dSel.append(o); });
                            act.targetDatabaseId = act.targetDatabaseId || opts.dbPage.id;
                            dSel.value = act.targetDatabaseId;
                            dSel.onchange = () => { act.targetDatabaseId = dSel.value; act.propertyId = ''; opts.onCommit(); drawModal(); };
                            body.append(dSel);
                            const tDbPg = getPageById(act.targetDatabaseId);
                            if (tDbPg && isDatabasePage(tDbPg))
                                renderPropValueEditor(act, ensureDatabaseConfig(tDbPg).schema, body);
                        }
                    }
                    else if (act.kind === 'add_page') {
                        const dSel = document.createElement('select');
                        dSel.className = 'notion-wf-select';
                        dbPages.forEach((d) => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.title || 'Database'; dSel.append(o); });
                        act.targetDatabaseId = act.targetDatabaseId || opts.dbPage.id;
                        dSel.value = act.targetDatabaseId;
                        dSel.onchange = () => { act.targetDatabaseId = dSel.value; opts.onCommit(); drawModal(); };
                        const tWrap = document.createElement('div');
                        tWrap.className = 'notion-wf-msg-box';
                        const tInp = document.createElement('input');
                        tInp.type = 'text';
                        tInp.className = 'notion-wf-input';
                        tInp.placeholder = 'Page title (e.g. Follow-up: {{Name}})';
                        tInp.value = act.title ?? '';
                        tInp.oninput = () => { act.title = tInp.value; opts.onCommit(); };
                        const toks = makeTokenToolbar(tInp, v => { act.title = v; opts.onCommit(); });
                        tWrap.append(tInp, toks.bar);
                        body.append(dSel, tWrap, toks.pickerWrap);
                    }
                    else if (act.kind === 'edit_related') {
                        const rSel = document.createElement('select');
                        rSel.className = 'notion-wf-select';
                        db.schema.filter(s => s.type === 'relation').forEach(rp => {
                            const o = document.createElement('option');
                            o.value = rp.id;
                            o.textContent = rp.name;
                            rSel.append(o);
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
                        vInp.type = 'text';
                        vInp.className = 'notion-wf-input';
                        vInp.placeholder = 'New value (@today / @toggle / option name)';
                        vInp.value = act.value ?? '';
                        vInp.oninput = () => { act.value = vInp.value; opts.onCommit(); };
                        body.append(rSel, tpSel, vInp);
                    }
                    else if (act.kind === 'send_notification') {
                        const recRow = document.createElement('div');
                        recRow.className = 'notion-wf-field-split';
                        const recModeSel = document.createElement('select');
                        recModeSel.className = 'notion-wf-select';
                        [['specific', 'Specific people'], ['person_prop', 'Person property'], ['everyone', 'Everyone in workspace']].forEach(([v, l]) => {
                            const o = document.createElement('option');
                            o.value = v;
                            o.textContent = l;
                            recModeSel.append(o);
                        });
                        act.recipientMode = act.recipientMode || 'specific';
                        recModeSel.value = act.recipientMode;
                        recModeSel.onchange = () => { act.recipientMode = recModeSel.value; opts.onCommit(); drawModal(); };
                        recRow.append(recModeSel);
                        body.append(recRow);
                        if (act.recipientMode === 'specific') {
                            const pLbl = document.createElement('div');
                            pLbl.className = 'notion-wf-sub-label';
                            pLbl.textContent = 'People';
                            const pplList = document.createElement('div');
                            pplList.className = 'notion-wf-people-list';
                            act.recipientAccounts = Array.isArray(act.recipientAccounts) ? act.recipientAccounts : (act.targetAccount ? [act.targetAccount] : []);
                            stateUsers.forEach((u) => {
                                const acctKey = u.linkedAccount || u.name;
                                const active = act.recipientAccounts.includes(acctKey) || act.recipientAccounts.includes(u.name);
                                const chip = document.createElement('button');
                                chip.type = 'button';
                                chip.className = 'notion-wf-person-pill' + (active ? ' is-selected' : '');
                                chip.innerHTML = `<span class="notion-avatar-circle">${escHtml(userInitials(u.name))}</span><span>${escHtml(u.name)}</span>`;
                                chip.onclick = () => {
                                    if (active)
                                        act.recipientAccounts = act.recipientAccounts.filter(x => x !== acctKey && x !== u.name);
                                    else
                                        act.recipientAccounts.push(acctKey);
                                    act.targetAccount = act.recipientAccounts[0];
                                    opts.onCommit();
                                    drawModal();
                                };
                                pplList.append(chip);
                            });
                            body.append(pLbl, pplList);
                        }
                        else if (act.recipientMode === 'person_prop') {
                            const ppSel = document.createElement('select');
                            ppSel.className = 'notion-wf-select';
                            db.schema.filter(s => s.type === 'person').forEach(ps => {
                                const o = document.createElement('option');
                                o.value = ps.id;
                                o.textContent = ps.name;
                                ppSel.append(o);
                            });
                            act.recipientPropertyId = act.recipientPropertyId || ppSel.options[0]?.value || '';
                            ppSel.value = act.recipientPropertyId;
                            ppSel.onchange = () => { act.recipientPropertyId = ppSel.value; opts.onCommit(); };
                            body.append(ppSel);
                        }
                        const mLbl = document.createElement('div');
                        mLbl.className = 'notion-wf-sub-label';
                        mLbl.textContent = 'Message';
                        const msgBox = document.createElement('div');
                        msgBox.className = 'notion-wf-msg-box';
                        const mTa = document.createElement('textarea');
                        mTa.className = 'notion-wf-textarea';
                        mTa.rows = 3;
                        mTa.placeholder = 'Notification message…';
                        mTa.value = act.message ?? '';
                        mTa.oninput = () => { act.message = mTa.value; opts.onCommit(); };
                        const toks = makeTokenToolbar(mTa, v => { act.message = v; opts.onCommit(); });
                        msgBox.append(mTa, toks.bar);
                        body.append(mLbl, msgBox, toks.pickerWrap);
                    }
                    else if (act.kind === 'send_message') {
                        const destSel = document.createElement('select');
                        destSel.className = 'notion-wf-select';
                        const groupOpts = chats.filter((c) => c.kind === 'group').map((c) => `<option value="ch:${escHtml(c.id)}">Channel #${escHtml(c.name)}</option>`).join('');
                        const dmOpts = stateUsers.filter((u) => !u.blocked).map((u) => `<option value="dm:${escHtml(u.linkedAccount || u.name)}">DM @${escHtml(u.name)}</option>`).join('');
                        destSel.innerHTML = `${groupOpts}${dmOpts}`;
                        destSel.value = act.chatTargetAccount ? `dm:${act.chatTargetAccount}` : `ch:${act.chatChannelId || chats[0]?.id || 'chat-general'}`;
                        destSel.onchange = () => {
                            if (destSel.value.startsWith('dm:')) {
                                act.chatTargetAccount = destSel.value.slice(3);
                                act.chatChannelId = undefined;
                            }
                            else {
                                act.chatChannelId = destSel.value.slice(3);
                                act.chatTargetAccount = undefined;
                            }
                            opts.onCommit();
                        };
                        const msgBox = document.createElement('div');
                        msgBox.className = 'notion-wf-msg-box';
                        const mTa = document.createElement('textarea');
                        mTa.className = 'notion-wf-textarea';
                        mTa.rows = 2;
                        mTa.placeholder = 'Workspace Chat message… (supports {{Name}}, {{Today}})';
                        mTa.value = act.message ?? '';
                        mTa.oninput = () => { act.message = mTa.value; opts.onCommit(); };
                        const toks = makeTokenToolbar(mTa, v => { act.message = v; opts.onCommit(); });
                        msgBox.append(mTa, toks.bar);
                        body.append(destSel, msgBox, toks.pickerWrap);
                    }
                    else if (act.kind === 'send_webhook') {
                        const uInp = document.createElement('input');
                        uInp.type = 'url';
                        uInp.className = 'notion-wf-input';
                        uInp.placeholder = 'POST URL (https://hooks.example.com/...)';
                        uInp.value = act.webhookUrl ?? '';
                        uInp.oninput = () => { act.webhookUrl = uInp.value; opts.onCommit(); };
                        const hInp = document.createElement('input');
                        hInp.type = 'text';
                        hInp.className = 'notion-wf-input';
                        hInp.placeholder = 'Headers JSON (optional)';
                        hInp.value = act.webhookHeadersJson ?? '';
                        hInp.oninput = () => { act.webhookHeadersJson = hInp.value; opts.onCommit(); };
                        const bTa = document.createElement('textarea');
                        bTa.className = 'notion-wf-textarea';
                        bTa.rows = 2;
                        bTa.placeholder = 'Custom JSON body (defaults to row properties + variables)';
                        bTa.value = act.webhookBody ?? '';
                        bTa.oninput = () => { act.webhookBody = bTa.value; opts.onCommit(); };
                        body.append(uInp, hInp, bTa);
                    }
                    else if (act.kind === 'define_variables') {
                        act.variables = Array.isArray(act.variables) && act.variables.length ? act.variables : [{ id: uid(), name: 'var1', mode: 'text', value: '' }];
                        act.variables.forEach((v, vIdx) => {
                            const vRow = document.createElement('div');
                            vRow.className = 'notion-wf-var-row';
                            const vName = document.createElement('input');
                            vName.type = 'text';
                            vName.className = 'notion-wf-input';
                            vName.placeholder = 'Name';
                            vName.value = v.name || '';
                            vName.oninput = () => { v.name = vName.value; opts.onCommit(); };
                            const vVal = document.createElement('input');
                            vVal.type = 'text';
                            vVal.className = 'notion-wf-input';
                            vVal.placeholder = 'Value or {{Name}}';
                            vVal.value = v.value || '';
                            vVal.oninput = () => { v.value = vVal.value; opts.onCommit(); };
                            const rmV = document.createElement('button');
                            rmV.type = 'button';
                            rmV.className = 'notion-wf-icon-btn';
                            rmV.textContent = '×';
                            rmV.onclick = () => { act.variables.splice(vIdx, 1); opts.onCommit(); drawModal(); };
                            vRow.append(vName, vVal, rmV);
                            body.append(vRow);
                        });
                        const addV = document.createElement('button');
                        addV.type = 'button';
                        addV.className = 'notion-wf-mini-add';
                        addV.textContent = '＋ Add variable';
                        addV.onclick = () => { act.variables.push({ id: uid(), name: `var${act.variables.length + 1}`, mode: 'text', value: '' }); opts.onCommit(); drawModal(); };
                        body.append(addV);
                    }
                    else if (act.kind === 'open_page') {
                        const mSel = document.createElement('select');
                        mSel.className = 'notion-wf-select';
                        [['page', 'Open page or database form'], ['url', 'Open external URL']].forEach(([v, l]) => {
                            const o = document.createElement('option');
                            o.value = v;
                            o.textContent = l;
                            mSel.append(o);
                        });
                        mSel.value = act.openMode || 'page';
                        mSel.onchange = () => { act.openMode = mSel.value; opts.onCommit(); drawModal(); };
                        body.append(mSel);
                        if (act.openMode === 'url') {
                            const uInp = document.createElement('input');
                            uInp.type = 'url';
                            uInp.className = 'notion-wf-input';
                            uInp.placeholder = 'https://example.com';
                            uInp.value = act.openUrl || '';
                            uInp.oninput = () => { act.openUrl = uInp.value; opts.onCommit(); };
                            body.append(uInp);
                        }
                        else {
                            const pgSel = document.createElement('select');
                            pgSel.className = 'notion-wf-select';
                            pgSel.innerHTML = `<option value="current_row">Current database row</option>${dbPages.map((dp) => `<option value="${escHtml(dp.id)}">DB: ${escHtml(dp.title || 'Database')}</option>`).join('')}${allPages.map((pg) => `<option value="${escHtml(pg.id)}">${escHtml(pg.title || 'Untitled')}</option>`).join('')}`;
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
                    }
                    else if (act.kind === 'show_confirmation') {
                        const ct = document.createElement('input');
                        ct.type = 'text';
                        ct.className = 'notion-wf-input';
                        ct.placeholder = 'Confirmation message…';
                        ct.value = act.confirmMessage || 'Are you sure you want to continue?';
                        ct.oninput = () => { act.confirmMessage = ct.value; opts.onCommit(); };
                        body.append(ct);
                        const branches = normalizeDbActionBranches(act);
                        const brLbl = document.createElement('div');
                        brLbl.className = 'notion-wf-sub-label';
                        brLbl.textContent = 'Choice buttons & branching';
                        body.append(brLbl);
                        branches.forEach((br, brIdx) => {
                            const brBox = document.createElement('div');
                            brBox.className = 'notion-wf-branch-box';
                            const brRow = document.createElement('div');
                            brRow.className = 'notion-wf-branch-row';
                            const lblInp = document.createElement('input');
                            lblInp.type = 'text';
                            lblInp.className = 'notion-wf-input';
                            lblInp.placeholder = 'Button label';
                            lblInp.value = br.label || '';
                            lblInp.oninput = () => { br.label = lblInp.value; opts.onCommit(); };
                            const modeSel = document.createElement('select');
                            modeSel.className = 'notion-wf-select';
                            [['continue', 'Continue workflow'], ['stop', 'Stop workflow'], ['branch', 'Run branch actions']].forEach(([mv, ml]) => {
                                const o = document.createElement('option');
                                o.value = mv;
                                o.textContent = ml;
                                modeSel.append(o);
                            });
                            modeSel.value = br.mode || 'continue';
                            modeSel.onchange = () => {
                                br.mode = modeSel.value;
                                if (br.mode === 'branch' && (!br.actions || !br.actions.length))
                                    br.actions = [makeDefaultDbAction('edit_pages')];
                                opts.onCommit();
                                drawModal();
                            };
                            const stSel = document.createElement('select');
                            stSel.className = 'notion-wf-select notion-wf-style-sel';
                            [['primary', 'Primary'], ['default', 'Neutral'], ['danger', 'Danger']].forEach(([sv, sl]) => {
                                const o = document.createElement('option');
                                o.value = sv;
                                o.textContent = sl;
                                stSel.append(o);
                            });
                            stSel.value = br.style || 'default';
                            stSel.onchange = () => { br.style = stSel.value; opts.onCommit(); };
                            brRow.append(lblInp, modeSel, stSel);
                            if (branches.length > 1) {
                                const rmBr = document.createElement('button');
                                rmBr.type = 'button';
                                rmBr.className = 'notion-wf-icon-btn';
                                rmBr.textContent = '×';
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
                                addSub.type = 'button';
                                addSub.className = 'notion-wf-mini-add';
                                addSub.textContent = `＋ Add action for “${br.label || 'Choice'}”`;
                                addSub.onclick = ev => {
                                    ev.stopPropagation();
                                    openDbActionSearchMenu(addSub, pickedKind => {
                                        br.actions.push(makeDefaultDbAction(pickedKind));
                                        opts.onCommit();
                                        drawModal();
                                    });
                                };
                                nested.append(addSub);
                                brBox.append(nested);
                            }
                            body.append(brBox);
                        });
                        const addBr = document.createElement('button');
                        addBr.type = 'button';
                        addBr.className = 'notion-wf-mini-add';
                        addBr.textContent = '＋ Add choice button';
                        addBr.onclick = () => {
                            branches.push({ id: uid(), label: `Option ${branches.length + 1}`, style: 'default', mode: 'branch', actions: [] });
                            opts.onCommit();
                            drawModal();
                        };
                        body.append(addBr);
                    }
                    card.append(body);
                    parentEl.append(card);
                });
            };
            renderDbActionList(doWrap, opts.actionsList, 0);
            const addActBtn = document.createElement('button');
            addActBtn.type = 'button';
            addActBtn.className = 'notion-wf-add-link notion-wf-new-action-btn';
            addActBtn.textContent = '＋ New action';
            addActBtn.onclick = ev => {
                ev.stopPropagation();
                openDbActionSearchMenu(addActBtn, pickedKind => {
                    opts.actionsList.push(makeDefaultDbAction(pickedKind));
                    opts.onCommit();
                    drawModal();
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
    function openActionStepsEditorPopover(_anchor, headingText, actionsList, dbPage, onDone) {
        openNotionWorkflowModal({
            mode: 'button',
            title: headingText,
            dbPage,
            actionsList,
            onCommit: onDone
        });
    }
    function openAutomationsPopover(anchor, dbPage) {
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
                if (!db.automations.length) {
                    const emp = document.createElement('p');
                    emp.className = 'db-placeholder';
                    emp.textContent = 'Automatically edit properties, create pages, and notify teammates when pages change.';
                    list.append(emp);
                }
                db.automations.forEach((auto, idx) => {
                    const row = document.createElement('div');
                    row.className = 'db-auto-list-row';
                    const enCb = document.createElement('input');
                    enCb.type = 'checkbox';
                    enCb.checked = auto.enabled !== false;
                    enCb.title = 'Enable automation';
                    enCb.onclick = e => e.stopPropagation();
                    enCb.onchange = () => { auto.enabled = enCb.checked; persist(false); refreshAllDatabaseViews(); };
                    const infoBtn = document.createElement('button');
                    infoBtn.type = 'button';
                    infoBtn.className = 'db-auto-row-main';
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
                            onDeleteAutomation: () => { db.automations.splice(idx, 1); },
                            onCommit: () => { persist(false); refreshAllDatabaseViews(); }
                        });
                    };
                    const editBtn = document.createElement('button');
                    editBtn.type = 'button';
                    editBtn.className = 'db-mini-btn';
                    editBtn.textContent = 'Edit';
                    editBtn.onclick = () => infoBtn.click();
                    row.append(enCb, infoBtn, editBtn);
                    list.append(row);
                });
                const addAuto = document.createElement('button');
                addAuto.type = 'button';
                addAuto.className = 'db-pop-create-btn';
                addAuto.textContent = '＋ New automation';
                addAuto.onclick = () => {
                    const created = {
                        id: uid(),
                        name: `Automation ${db.automations.length + 1}`,
                        enabled: true,
                        trigger: { kind: 'page_added' },
                        triggers: [{ id: uid(), kind: 'page_added' }],
                        triggerMatch: 'all',
                        actions: [{ id: uid(), kind: 'set_property', propertyId: db.schema[1]?.id || db.schema[0]?.id, value: '' }]
                    };
                    db.automations.push(created);
                    persist(false);
                    refreshAllDatabaseViews();
                    close();
                    openNotionWorkflowModal({
                        mode: 'automation',
                        title: created.name,
                        icon: created.icon,
                        dbPage,
                        automation: created,
                        actionsList: created.actions,
                        onDeleteAutomation: () => {
                            const i = db.automations.indexOf(created);
                            if (i >= 0)
                                db.automations.splice(i, 1);
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
    function renderDatabaseWidget(hostEl, dbPage, options = {}) {
        const isInline = Boolean(options.inlineBlock);
        const hostKey = options.inlineBlock ? `block:${options.inlineBlock.id}` : `page:${dbPage.id}`;
        const draw = () => {
            hostEl.classList.add('db-view-wrap', 'db-interactive-surface', isInline ? 'is-inline' : 'is-fullpage');
            hostEl.dataset.dbPageId = dbPage.id || '';
            hostEl.dataset.dbHostKey = hostKey;
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
            const hostRo = isHostReadOnly(currentDb);
            const viewSettingsOpts = {
                isInline,
                onChangeSourceDb: options.onChangeSourceDb,
                onTurnIntoFullPage: options.onTurnIntoFullPage
            };
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
                openFull.className = 'db-toolbar-btn db-icon-tool-btn';
                openFull.dataset.dbAction = 'open-full';
                openFull.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2.5H13.5V6.5M6.5 13.5H2.5V9.5M13.5 2.5L9 7M2.5 13.5L7 9"/></svg>';
                openFull.title = `Open "${currentDb.title || 'Database'}" as full page (Ctrl/middle-click for new tab)`;
                openFull.setAttribute('aria-label', 'Open as full page');
                openFull.onclick = e => {
                    if (e.ctrlKey || e.metaKey) {
                        host?.openPageInNewTab?.(currentDb.id);
                        return;
                    }
                    host?.navigateToPage?.(currentDb.id);
                };
                openFull.onauxclick = e => {
                    if (e.button === 1) {
                        e.preventDefault();
                        host?.openPageInNewTab?.(currentDb.id);
                    }
                };
                right.append(openFull);
                if (!ro && options.onChangeSourceDb) {
                    const linkSource = document.createElement('button');
                    linkSource.type = 'button';
                    linkSource.className = 'db-toolbar-btn db-icon-tool-btn';
                    linkSource.dataset.dbAction = 'source';
                    linkSource.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5.5H12.5L10 3M13 10.5H3.5L6 13"/></svg>';
                    linkSource.title = 'Change data source';
                    linkSource.setAttribute('aria-label', 'Source');
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
                const rawViewIco = escHtml(viewMeta(v.type).icon);
                const resolvedViewIco = window.ArchitectIcons?.resolveUiSlotMarkup?.(`db-view-${v.type}`, rawViewIco) || rawViewIco;
                tab.innerHTML = `<span class="db-tab-ico">${resolvedViewIco}</span><span>${escHtml(v.name)}</span>`;
                tab.onclick = () => {
                    if (isCurrent) {
                        if (!hostRo)
                            openViewSettingsPopover(tab, v, currentDb, viewSettingsOpts);
                    }
                    else {
                        if (options.inlineBlock) {
                            options.inlineBlock.viewId = v.id;
                            persist(false);
                            draw();
                        }
                        else {
                            db.activeViewId = v.id;
                            if (isFormPage(currentDb)) {
                                persist(true);
                            }
                            else {
                                persist(false);
                                draw();
                            }
                        }
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
                    if (options.inlineBlock)
                        options.inlineBlock.viewId = nextView.id;
                    else
                        db.activeViewId = nextView.id;
                    refreshAllDatabaseViews();
                });
                tabList.append(addTab);
            }
            const toolbar = document.createElement('div');
            toolbar.className = 'db-toolbar';
            const iconBtn = (toolKey, svg, label, count = 0, active = false) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'db-toolbar-btn db-icon-tool-btn' + (active ? ' is-active' : '');
                btn.dataset.dbTool = toolKey;
                const fullLabel = count ? `${label} (${count})` : label;
                btn.title = fullLabel;
                btn.setAttribute('aria-label', fullLabel);
                btn.innerHTML = `${svg}${count ? `<span class="db-tool-badge">${count}</span>` : ''}`;
                return btn;
            };
            const filterCount = countFilterRules(view);
            const filterBtn = iconBtn('filter', '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 4.5H13.5M4.5 8H11.5M6.5 11.5H9.5"/></svg>', 'Filter', filterCount, filterCount > 0);
            filterBtn.onclick = () => openFilterPopover(filterBtn, view, currentDb, hostKey);
            const sortBtn = iconBtn('sort', '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 3.5V12.5M5.5 3.5L3.5 5.5M5.5 3.5L7.5 5.5M10.5 12.5V3.5M10.5 12.5L8.5 10.5M10.5 12.5L12.5 10.5"/></svg>', 'Sort', view.sorts.length, view.sorts.length > 0);
            sortBtn.onclick = () => openSortPopover(sortBtn, view, currentDb);
            const groupBtn = iconBtn('group', '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.2" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9.3" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.2" y="9" width="4.5" height="4.5" rx="1"/><rect x="9.3" y="9" width="4.5" height="4.5" rx="1"/></svg>', 'Group', 0, !!view.groupBy);
            groupBtn.onclick = () => openGroupPopover(groupBtn, view, currentDb);
            const propsBtn = iconBtn('properties', '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.8 8C3 5.3 5.2 4 8 4C10.8 4 13 5.3 14.2 8C13 10.7 10.8 12 8 12C5.2 12 3 10.7 1.8 8Z"/><circle cx="8" cy="8" r="1.8"/></svg>', 'Properties');
            propsBtn.onclick = () => openPropertiesMenu(propsBtn, view, currentDb);
            const autoCount = (db.automations || []).filter(a => a.enabled).length;
            const autoBtn = iconBtn('automations', '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2L4 9H8L7 14L12 7H8L9 2Z"/></svg>', 'Automations', autoCount, autoCount > 0);
            if (!ro)
                autoBtn.onclick = () => openAutomationsPopover(autoBtn, currentDb);
            else
                autoBtn.disabled = true;
            const searchWrap = document.createElement('div');
            searchWrap.className = 'db-search-wrap' + (searchQ ? ' is-open' : '');
            const searchToggle = iconBtn('search', '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="7" r="4.2"/><path d="M10.2 10.2L13.5 13.5"/></svg>', 'Search');
            const searchInput = document.createElement('input');
            searchInput.type = 'search';
            searchInput.className = 'db-search-input';
            searchInput.placeholder = 'Search…';
            searchInput.setAttribute('aria-label', 'Search database');
            searchInput.value = searchQ;
            searchToggle.onclick = () => {
                const opening = !searchWrap.classList.contains('is-open');
                searchWrap.classList.toggle('is-open', opening);
                if (opening) {
                    searchInput.focus();
                    searchInput.select();
                }
                else if (!searchInput.value.trim()) {
                    searchInput.blur();
                }
            };
            searchInput.addEventListener('blur', () => {
                if (!searchInput.value.trim())
                    searchWrap.classList.remove('is-open');
            });
            searchInput.addEventListener('input', () => {
                searchQueriesByKey.set(hostKey, searchInput.value);
                searchWrap.classList.toggle('is-open', !!searchInput.value || document.activeElement === searchInput);
                drawCanvas();
            });
            searchWrap.append(searchToggle, searchInput);
            const settingsBtn = iconBtn('settings', '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 5H13.5M2.5 11H13.5"/><circle cx="5.5" cy="5" r="1.4" fill="currentColor"/><circle cx="10.5" cy="11" r="1.4" fill="currentColor"/></svg>', 'Settings');
            settingsBtn.title = 'View settings';
            settingsBtn.onclick = () => openViewSettingsPopover(settingsBtn, view, currentDb, viewSettingsOpts);
            if (db.locked) {
                const lockBtn = document.createElement('button');
                lockBtn.type = 'button';
                lockBtn.className = 'db-toolbar-btn db-locked-badge';
                lockBtn.dataset.dbTool = 'lock';
                lockBtn.textContent = '🔒';
                lockBtn.title = hostRo ? 'Database is locked' : 'Database locked (click to unlock)';
                lockBtn.setAttribute('aria-label', 'Unlock database');
                lockBtn.disabled = hostRo;
                lockBtn.onclick = () => {
                    if (hostRo)
                        return;
                    db.locked = false;
                    persist(false);
                    refreshAllDatabaseViews();
                    host?.toast?.('Database unlocked');
                };
                if (view.type === 'form')
                    toolbar.append(lockBtn, propsBtn, autoBtn, settingsBtn);
                else
                    toolbar.append(lockBtn, filterBtn, sortBtn, groupBtn, propsBtn, autoBtn, searchWrap, settingsBtn);
            }
            else {
                if (view.type === 'form')
                    toolbar.append(propsBtn, autoBtn, settingsBtn);
                else
                    toolbar.append(filterBtn, sortBtn, groupBtn, propsBtn, autoBtn, searchWrap, settingsBtn);
            }
            if (!ro && view.type !== 'form') {
                const newSplit = document.createElement('div');
                newSplit.className = 'db-new-split';
                const newPrimary = document.createElement('button');
                newPrimary.type = 'button';
                newPrimary.className = 'db-new-btn';
                newPrimary.textContent = 'New';
                newPrimary.onclick = () => {
                    const initial = {};
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
                if (view.type === 'board')
                    renderBoardView(canvas, rows, view, currentDb);
                else if (view.type === 'list')
                    renderListView(canvas, rows, view, currentDb);
                else if (view.type === 'gallery')
                    renderGalleryView(canvas, rows, view, currentDb);
                else if (view.type === 'calendar')
                    renderCalendarView(canvas, rows, view, currentDb, hostKey);
                else if (view.type === 'timeline')
                    renderTimelineView(canvas, rows, view, currentDb);
                else if (view.type === 'chart')
                    renderChartView(canvas, rows, view, currentDb);
                else if (view.type === 'feed')
                    renderFeedView(canvas, rows, view, currentDb);
                else if (view.type === 'form')
                    renderFormView(canvas, view, currentDb);
                else
                    renderTableView(canvas, rows, view, currentDb);
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
    function renderFilterStrip(view, dbPage, hostKey, onLiveUpdate) {
        const db = ensureDatabaseConfig(dbPage);
        const bar = document.createElement('div');
        bar.className = 'db-filter-strip';
        const buildRuleChip = (rule, onRemove) => {
            const chip = document.createElement('div');
            chip.className = 'db-filter-chip';
            const propSel = document.createElement('select');
            db.schema.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; propSel.append(o); });
            propSel.value = rule.propertyId;
            propSel.onchange = () => { rule.propertyId = propSel.value; persist(false); refreshAllDatabaseViews(); };
            const opSel = document.createElement('select');
            DB_FILTER_OPS.forEach(f => { const o = document.createElement('option'); o.value = f.op; o.textContent = f.label; opSel.append(o); });
            opSel.value = rule.op;
            opSel.onchange = () => { rule.op = opSel.value; persist(false); refreshAllDatabaseViews(); };
            chip.append(propSel, opSel);
            const opMeta = DB_FILTER_OPS.find(f => f.op === rule.op);
            if (!opMeta?.noValue) {
                const valInput = document.createElement('input');
                valInput.type = 'text';
                valInput.placeholder = 'Value…';
                valInput.value = rule.value || '';
                valInput.oninput = () => { rule.value = valInput.value; persist(false); onLiveUpdate?.(); };
                valInput.onblur = () => refreshAllDatabaseViews();
                valInput.onkeydown = e => { if (e.key === 'Enter') {
                    e.preventDefault();
                    refreshAllDatabaseViews();
                } };
                chip.append(valInput);
            }
            const rm = document.createElement('button');
            rm.type = 'button';
            rm.className = 'db-mini-btn';
            rm.textContent = '✕';
            rm.onclick = onRemove;
            chip.append(rm);
            return chip;
        };
        if (view.filters.length > 1) {
            const combSel = document.createElement('select');
            combSel.className = 'db-filter-match-sel';
            combSel.innerHTML = '<option value="and">Match ALL (And)</option><option value="or">Match ANY (Or)</option>';
            combSel.value = view.filterMatch || 'and';
            combSel.onchange = () => { view.filterMatch = combSel.value; persist(false); refreshAllDatabaseViews(); };
            bar.append(combSel);
        }
        view.filters.forEach((rule, idx) => {
            bar.append(buildRuleChip(rule, () => {
                view.filters.splice(idx, 1);
                if (!countFilterRules(view))
                    filterOpenByKey.set(hostKey, false);
                persist(false);
                refreshAllDatabaseViews();
            }));
        });
        const renderGroupBox = (grp, onRemoveSelf) => {
            const box = document.createElement('div');
            box.className = 'db-filter-group-box';
            const gHead = document.createElement('div');
            gHead.className = 'db-filter-group-head';
            const matchSel = document.createElement('select');
            matchSel.className = 'db-filter-match-sel';
            matchSel.innerHTML = '<option value="and">Group: And</option><option value="or">Group: Or</option>';
            matchSel.value = grp.match;
            matchSel.onchange = () => { grp.match = matchSel.value; persist(false); refreshAllDatabaseViews(); };
            const addGrpRule = document.createElement('button');
            addGrpRule.type = 'button';
            addGrpRule.className = 'db-link-btn';
            addGrpRule.textContent = '+ Rule';
            addGrpRule.onclick = () => {
                const targetProp = db.schema[1] || db.schema[0];
                grp.rules.push({ id: uid(), propertyId: targetProp.id, op: 'contains', value: '' });
                persist(false);
                refreshAllDatabaseViews();
            };
            const addSubGrp = document.createElement('button');
            addSubGrp.type = 'button';
            addSubGrp.className = 'db-link-btn';
            addSubGrp.textContent = '+ Sub-group';
            addSubGrp.onclick = () => {
                const targetProp = db.schema[1] || db.schema[0];
                grp.rules.push({
                    id: uid(),
                    match: grp.match === 'and' ? 'or' : 'and',
                    rules: [{ id: uid(), propertyId: targetProp.id, op: 'contains', value: '' }]
                });
                persist(false);
                refreshAllDatabaseViews();
            };
            const rmGrp = document.createElement('button');
            rmGrp.type = 'button';
            rmGrp.className = 'db-mini-btn';
            rmGrp.textContent = '✕';
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
                        persist(false);
                        refreshAllDatabaseViews();
                    }));
                }
                else {
                    inner.append(buildRuleChip(node, () => {
                        grp.rules.splice(idx, 1);
                        persist(false);
                        refreshAllDatabaseViews();
                    }));
                }
            });
            box.append(inner);
            return box;
        };
        if (view.filterGroup) {
            bar.append(renderGroupBox(view.filterGroup, () => {
                view.filterGroup = undefined;
                if (!countFilterRules(view))
                    filterOpenByKey.set(hostKey, false);
                persist(false);
                refreshAllDatabaseViews();
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
            persist(false);
            refreshAllDatabaseViews();
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
            }
            else {
                view.filterGroup.rules.push({
                    id: uid(),
                    match: view.filterGroup.match === 'and' ? 'or' : 'and',
                    rules: [{ id: uid(), propertyId: targetProp.id, op: 'contains', value: '' }]
                });
            }
            filterOpenByKey.set(hostKey, true);
            persist(false);
            refreshAllDatabaseViews();
        };
        bar.append(addGroup);
        return bar;
    }
    function openLinkSourcePopover(anchor, onChoose) {
        openDbPopover(anchor, (pop, close) => {
            const header = document.createElement('div');
            header.className = 'db-pop-header';
            header.textContent = 'Select a data source';
            const list = document.createElement('div');
            list.className = 'db-pop-list';
            ensureOfficialQuestboardPage();
            const dbs = getDatabasePages().filter((d) => !host?.canViewPage || host.canViewPage(d));
            dbs.forEach((d) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'db-pop-option-btn';
                const basePrefix = isHiddenBasePage(d) ? 'Base DB · ' : '';
                b.innerHTML = `<span>${dbIconHtml(d.icon, '🗃️')} ${escHtml(d.title || 'Untitled database')}</span><small>${basePrefix}${getDatabaseRows(d.id).length} pages</small>`;
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
    function openNewTemplateMenu(anchor, dbPage) {
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
                persist(false);
                close();
                refreshAllDatabaseViews();
                openDatabaseRow(created, dbPage);
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
                    persist(false);
                    close();
                    refreshAllDatabaseViews();
                    openDatabaseRow(created, dbPage);
                };
                const del = document.createElement('button');
                del.type = 'button';
                del.className = 'db-mini-btn';
                del.textContent = '✕';
                del.onclick = () => {
                    db.templates = (db.templates || []).filter(t => t.id !== tpl.id);
                    persist(false);
                    close();
                    openNewTemplateMenu(anchor, dbPage);
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
        isFormPage,
        isDatabasePage,
        getDatabasePages,
        getDatabaseRows,
        ensureDatabaseConfig,
        convertPageToDatabase,
        createDatabasePage,
        createQuestboardPage,
        getOfficialQuestboardPage,
        setOfficialQuestboardPage,
        ensureOfficialQuestboardPage,
        isHiddenBasePage,
        getSubtasksForRow,
        createSubtaskForRow,
        isRowComplete,
        toggleRowComplete,
        resolveOption,
        getRawValue,
        valueAsSearchText,
        activeViewFor,
        convertPageToForm,
        createFormPage,
        formShareUrl,
        formSubdomainUrl,
        ensureFormConfig,
        syncFormDocBlocks,
        syncFormQuestionOrderFromBlocks,
        addFormQuestionBlock,
        deleteFormQuestionBlock,
        duplicateFormQuestionBlock,
        evaluateFormCondition,
        describeFormCondition,
        openFormConditionPopover,
        renderFormDesignPanel,
        openFormDesignAndSettingsPopover,
        renderFormQuestionCard,
        validateAndSubmitForm,
        triggerSendResponseToMail,
        getDefaultFormButtonConfig,
        readFormAssetsByKind,
        resolveFormAssetUrl,
        triggerFormInsert: (pageId, propType) => {
            const ctrl = activeFormControllers.get(pageId);
            if (ctrl) {
                ctrl.addQuestion(propType);
                return true;
            }
            const pg = getPageById(pageId);
            if (pg && isFormPage(pg)) {
                addFormQuestionBlock(pg, propType);
                persist(true);
                return true;
            }
            return false;
        },
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
