// @ts-nocheck
type BlockType = 'text'|'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'bullet'|'numbered'|'todo'|'toggle'|'quote'|'callout'|'divider'|'page_link'|'mention'|'code'|'image'|'file'|'pdf'|'bookmark'|'video'|'audio'|'embed'|'equation'|'columns'|'table'|'database_view'|'board_view'|'toc'|'breadcrumb'|'button'|'date';
type BlockButtonBranch = { id:string; label:string; style?:'primary'|'default'|'danger'; mode:'continue'|'stop'|'branch'; actions?:BlockButtonStep[] };
type BlockButtonVariable = { id:string; name:string; mode?:'text'|'formula'; value:string };
type BlockButtonStep = {
    id:string;
    kind:'insert_blocks'|'add_db_page'|'edit_pages'|'open_page'|'notify'|'send_message'|'send_webhook'|'show_confirmation'|'define_variables';
    blocksText?:string;
    dbId?:string;
    pageId?:string;
    openMode?:'page'|'url';
    url?:string;
    editTargetMode?:'page'|'db_filter';
    propertyId?:string;
    propertyValue?:string;
    filterPropertyId?:string;
    filterValue?:string;
    propAssignments?:{ propertyId:string; value:string }[];
    message?:string;
    recipientMode?:'specific'|'everyone';
    recipientAccounts?:string[];
    chatChannelId?:string;
    chatTargetAccount?:string;
    webhookUrl?:string;
    webhookHeadersJson?:string;
    webhookBody?:string;
    confirmTitle?:string;
    confirmLabel?:string;
    branches?:BlockButtonBranch[];
    variables?:BlockButtonVariable[];
};
type BlockButtonConfig = { label?:string; icon?:string; confirm?:boolean; confirmText?:string; steps:BlockButtonStep[] };
type SimpleTableData = { headers:string[]; headerHtml?:string[]; rows:string[][]; rowHtml?:string[][]; hasHeaderRow?:boolean; hasHeaderColumn?:boolean; fullWidth?:boolean; colColors?:string[]; rowColors?:string[]; cellColors?:Record<string, string> };
type Block = { id:string; type:BlockType; text:string; html?:string; indent?:number; align?:'left'|'center'|'right'|'justify'; font?:string; calloutType?:string; calloutTitle?:string; icon?:string; color?:string; bgColor?:string; assetId?:string; mimeType?:string; category?:AssetCategory; creator?:string; tags?:string[]; toggle?:boolean; open?:boolean; checked?:boolean; targetId?:string; viewId?:string; boardHeight?:number; boardWidthPct?:number; url?:string; linkDisplayMode?:'url'|'mention'|'bookmark'|'embed'; embedHeight?:number; mermaidMode?:'code'|'split'|'preview'; buttonConfig?:BlockButtonConfig; language?:string; children?:Block[]; columnWidths?:number[]; tableData?:SimpleTableData; remindDate?:string; remindTime?:string; remindOffset?:string; remindAt?:number; remindFired?:boolean; mentions?:{kind:'page'|'person'|'reminder';id:string;label:string}[] };
type CommentMessage = { id:string; authorId:string; authorName:string; text:string; createdAt:number; updatedAt?:number; edited?:boolean };
type CommentThread = { id:string; scope:'page'|'block'|'text'; blockId?:string; quote?:string; resolved?:boolean; resolvedAt?:number; resolvedBy?:string; createdAt:number; updatedAt:number; comments:CommentMessage[] };
type NotificationButtonAction = 'confirm_read'|'read_later'|'custom';
type NotificationButtonDef = { id:string; label:string; action:NotificationButtonAction; trackUsers?:boolean };
type NotificationButtonClick = { buttonId:string; buttonLabel:string; userId:string; userName:string; clickedAt:number };
type NotificationReadReceipt = { userId:string; userName:string; readAt:number };
type InboxNotification = { id:string; kind:'comment'|'reply'|'resolve'|'reopen'|'page'|'board'|'database'|'system'; title:string; body:string; markdown?:string; displayMode?:'inbox'|'popup'|'both'; pageId?:string; blockId?:string; commentThreadId?:string; actor?:string; targetAccount?:string; read?:boolean; createdAt:number; status?:'sent'|'scheduled'; scheduledFor?:number; scheduledTz?:string; sentAt?:number; buttons?:NotificationButtonDef[]; readBy?:NotificationReadReceipt[]; confirmedBy?:NotificationReadReceipt[]; buttonClicks?:NotificationButtonClick[] };
type DashboardSubMode = 'notifications'|'chat'|'user'|'admin'|'time-tracking'|'calendar'|'taskboard'|'scratchpad';
type ChatMessage = { id:string; senderName:string; senderAccount?:string; text:string; createdAt:number; fromAutomation?:string };
type ChatChannel = { id:string; kind:'dm'|'group'; name:string; topic?:string; icon?:string; memberAccounts:string[]; messages:ChatMessage[]; updatedAt:number; unreadCount?:number };
type PageVersionSnapshot = { id:string; savedAt:number; authorName:string; title:string; icon:string; wordCount:number; blocks:Block[]; note?:string };
type PageAnalytics = { totalViews:number; uniqueViewers:string[]; viewLog:{ userName:string; viewedAt:number }[] };
type DashboardTask = { id:string; text:string; done:boolean; completedAt?:number; priority?:'normal'|'high'; linkedPageId?:string; createdAt:number };
type DashboardMeeting = { id:string; title:string; dateTime:string; durationMins:number; attendeeIds:string[]; guestIds?:string[]; linkedPageId?:string; loggedAt?:number };
type DashboardTimeLog = { id:string; personId:string; personName:string; label:string; role:'working'|'guest'|'solo'; minutes:number; linkedPageId?:string; meetingId?:string; date?:string; createdAt:number };
type DashboardData = { scratchpadText:string; scratchpadUpdatedAt:number; tasks:DashboardTask[]; meetings:DashboardMeeting[]; timeLogs:DashboardTimeLog[] };
type RolePermissions = { manageMembers:boolean; manageRoles:boolean; manageAssets:boolean; createPages:boolean; editPages:boolean; writePages:boolean; comment:boolean; managePagePermissions:boolean; sendNotifications:boolean };
type RoleDef = { id:string; name:string; builtIn?:boolean; rank:number; color?:string; permissions:RolePermissions };
type TriOverride = 'allow'|'inherit'|'deny';
type PermissionSetOverride = { view?:TriOverride; edit?:TriOverride; comment?:TriOverride };
type PagePermissionConfig = { inheritParent?:boolean; noOneAccess?:boolean; roleOverrides?:Record<string,PermissionSetOverride>; userOverrides?:Record<string,PermissionSetOverride> };
type WorkspaceUser = { id:string; name:string; email?:string; roleId?:string; roleIds?:string[]; linkedAccount?:string; blocked?:boolean; inviteCode?:string };
type WorkspaceInvite = { code:string; userId:string; roleIds:string[]; createdAt:number; createdBy?:string; redeemedBy?:string; redeemedAt?:number };
type Page = { id:string; title:string; icon:string; parentId?:string; pageKind?:'page'|'database'|'board'; databaseId?:string; database?:any; board?:any; propertyValues?:Record<string,any>; createdBy?:string; lastEditedBy?:string; favorite?:boolean; cover?:string; coverX?:number; coverY?:number; coverZoom?:number; fullWidth?:boolean; showWordCount?:boolean; description?:string; properties?:DatabaseProperty[]; propertiesOpen?:boolean; comments?:CommentThread[]; permissions?:PagePermissionConfig; published?:boolean; publishedAt?:number; history?:PageVersionSnapshot[]; analytics?:PageAnalytics; blocks:Block[]; createdAt:number; updatedAt:number };
type WorkspaceTab = { id:string; pageId:string; history:string[]; historyIndex:number; pinned?:boolean };
type Workspace = { version:2; workspaceName:string; activePageId:string; activeTabId?:string; tabs?:WorkspaceTab[]; pages:Page[]; users:WorkspaceUser[]; roles?:RoleDef[]; invites?:WorkspaceInvite[]; loggedInAccount?:string; coordinationMode?:CoordinationMode; assetStorageMode?:AssetStorageMode; syncConfig?:SyncConfig; actingAsAdmin?:boolean; userPreferences?:any; notifications?:InboxNotification[]; chats?:ChatChannel[]; dashboardData?:DashboardData };
type PropertyType = 'text'|'status'|'select'|'date'|'number'|'person'|'url'|'email'|'phone'|'checkbox'|'files';
type DatabaseProperty = { id:string; name:string; type:PropertyType; value:string|number|boolean; options?:string[] };
const STORE = 'notion-clone-workspace-v2';
const oldStore = 'notion-clone-pages';
const RESET_MARKER = 'architect-fresh-workspace-reset-v1';
const RESET_BACKUP = 'architect-pre-fresh-reset-v1';
const WORKSPACES_INDEX_KEY = 'architect-workspaces-v1';
const ACTIVE_WS_STORE_KEY = 'architect-active-workspace-key-v1';
type WorkspaceEntry = { id: string; name: string; storeKey: string; updatedAt?: number };

function getActiveStoreKey(): string {
    try {
        const key = localStorage.getItem(ACTIVE_WS_STORE_KEY);
        if (key && (key === STORE || key.startsWith('architect-workspace-'))) return key;
    } catch {}
    return STORE;
}
function setActiveStoreKey(storeKey: string) {
    try {
        if (storeKey === STORE) localStorage.removeItem(ACTIVE_WS_STORE_KEY);
        else localStorage.setItem(ACTIVE_WS_STORE_KEY, storeKey);
    } catch {}
}
function readWorkspaceIndex(): WorkspaceEntry[] {
    try {
        const raw = localStorage.getItem(WORKSPACES_INDEX_KEY);
        if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
                const valid = list.filter(e => e && typeof e.storeKey === 'string' && e.storeKey);
                if (valid.length) return valid;
            }
        }
    } catch {}
    let primaryName = 'Acme Studio';
    try {
        const rawPrimary = localStorage.getItem(STORE);
        if (rawPrimary) {
            const parsed = JSON.parse(rawPrimary);
            if (parsed?.workspaceName) primaryName = String(parsed.workspaceName);
        }
    } catch {}
    return [{ id: 'default', name: primaryName, storeKey: STORE, updatedAt: Date.now() }];
}
function writeWorkspaceIndex(entries: WorkspaceEntry[]) {
    try {
        localStorage.setItem(WORKSPACES_INDEX_KEY, JSON.stringify(entries));
    } catch {}
}
function syncActiveWorkspaceInIndex(ws = state, storeKey = getActiveStoreKey()) {
    if (!ws) return;
    const entries = readWorkspaceIndex();
    const name = (ws.workspaceName || 'Untitled workspace').trim() || 'Untitled workspace';
    const idx = entries.findIndex(e => e.storeKey === storeKey);
    const entry: WorkspaceEntry = {
        id: idx >= 0 ? entries[idx].id : (storeKey === STORE ? 'default' : storeKey.replace(/^architect-workspace-/, '')),
        name,
        storeKey,
        updatedAt: Date.now()
    };
    if (idx >= 0) entries[idx] = entry;
    else entries.push(entry);
    writeWorkspaceIndex(entries);
}
const id = () => crypto.randomUUID();
const block = (type, text = '') => ({ id: id(), type, text });
const starter = [{ id: 'home', title: 'New hub', icon: '📄', blocks: [block('text')], createdAt: Date.now(), updatedAt: Date.now() }];
const ROLE_PERMISSION_DEFS: Array<{ key: keyof RolePermissions; label: string }> = [
    { key: 'manageMembers', label: 'Manage members' },
    { key: 'manageRoles', label: 'Manage roles' },
    { key: 'manageAssets', label: 'Manage assets' },
    { key: 'createPages', label: 'Create pages' },
    { key: 'editPages', label: 'Edit pages' },
    { key: 'writePages', label: 'Write blocks' },
    { key: 'comment', label: 'Comment' },
    { key: 'managePagePermissions', label: 'Page permissions' },
    { key: 'sendNotifications', label: 'Send notifications' }
];
function normalizeRolePermissions(raw: any, isAdminRole = false): RolePermissions {
    if (isAdminRole) {
        return {
            manageMembers: true, manageRoles: true, manageAssets: true,
            createPages: true, editPages: true, writePages: true,
            comment: true, managePagePermissions: true, sendNotifications: true
        };
    }
    const r = raw && typeof raw === 'object' ? raw : {};
    const legacyEdit = typeof r.edit === 'boolean' ? r.edit : undefined;
    const editPages = typeof r.editPages === 'boolean' ? r.editPages : (legacyEdit ?? false);
    const writePages = typeof r.writePages === 'boolean' ? r.writePages : (legacyEdit ?? editPages);
    return {
        manageMembers: !!r.manageMembers,
        manageRoles: !!r.manageRoles,
        manageAssets: !!r.manageAssets,
        createPages: typeof r.createPages === 'boolean' ? r.createPages : editPages,
        editPages,
        writePages,
        comment: typeof r.comment === 'boolean' ? r.comment : true,
        managePagePermissions: !!r.managePagePermissions,
        sendNotifications: !!r.sendNotifications
    };
}
function ensureWorkspaceDefaults(w) {
    w.coordinationMode = w.coordinationMode || 'local';
    w.assetStorageMode = w.assetStorageMode || 'local';
    w.actingAsAdmin = w.actingAsAdmin !== false;
    w.notifications = Array.isArray(w.notifications) ? w.notifications : [];
    w.invites = Array.isArray(w.invites) ? w.invites : [];
    const defaultRoles: RoleDef[] = [
        { id: 'role-admin', name: 'Admin', builtIn: true, rank: 0, color: '#e5534b', permissions: normalizeRolePermissions(null, true) },
        { id: 'role-editor', name: 'Editor', builtIn: true, rank: 1, color: '#2383e2', permissions: { manageMembers: false, manageRoles: false, manageAssets: false, createPages: true, editPages: true, writePages: true, comment: true, managePagePermissions: false, sendNotifications: false } },
        { id: 'role-viewer', name: 'Viewer', builtIn: true, rank: 2, color: '#787774', permissions: { manageMembers: false, manageRoles: false, manageAssets: false, createPages: false, editPages: false, writePages: false, comment: true, managePagePermissions: false, sendNotifications: false } }
    ];
    if (!Array.isArray(w.roles) || !w.roles.length) w.roles = defaultRoles;
    if (!w.roles.some(r => r.id === 'role-admin')) w.roles.unshift(defaultRoles[0]);
    const rawColors = ['#e5534b', '#2383e2', '#787774', '#9065b0', '#448361', '#d9730d', '#c14c8a'];
    w.roles = w.roles.map((r, idx) => {
        const isAdmin = r.id === 'role-admin';
        return {
            ...r,
            rank: isAdmin ? 0 : (Number.isFinite(Number(r.rank)) ? Math.max(1, Number(r.rank)) : idx + 1),
            color: r.color || rawColors[idx % rawColors.length],
            permissions: normalizeRolePermissions(r.permissions, isAdmin)
        };
    }).sort((a, b) => {
        if (a.id === 'role-admin') return -1;
        if (b.id === 'role-admin') return 1;
        return (a.rank ?? 99) - (b.rank ?? 99);
    });
    w.roles.forEach((r, idx) => { r.rank = r.id === 'role-admin' ? 0 : idx; });
    const validRoleIds = new Set(w.roles.map(r => r.id));
    if (Array.isArray(w.users) && w.users.length) {
        w.users.forEach((u, idx) => {
            const hasExplicitArray = Array.isArray(u.roleIds);
            const seed = hasExplicitArray ? u.roleIds! : (u.roleId ? [u.roleId] : [idx === 0 ? 'role-admin' : 'role-editor']);
            const cleaned = [...new Set(seed.filter(rid => validRoleIds.has(rid)))];
            if (!hasExplicitArray && !cleaned.length) cleaned.push(idx === 0 ? 'role-admin' : 'role-editor');
            if (idx === 0 && w.actingAsAdmin !== false && !cleaned.includes('role-admin')) cleaned.unshift('role-admin');
            u.roleIds = cleaned;
            u.roleId = cleaned[0] || undefined;
            if (idx === 0 && u.linkedAccount === undefined) u.linkedAccount = u.name;
            u.blocked = !!u.blocked;
        });
    }
    w.syncConfig = {
        driveProvider: 'local-folder',
        folderPath: '',
        sourceUrl: '',
        serverUrl: '',
        readOnlyMirror: false,
        cadence: 'on-start',
        intervalMinutes: 5,
        ...(w.syncConfig || {})
    };
    w.assetPreviewPolicy = {
        mode: 'smart-proxy',
        maxProxySizeKB: 500,
        cacheFolderPath: '',
        ...(w.assetPreviewPolicy || {})
    };
    const dd = w.dashboardData && typeof w.dashboardData === 'object' ? w.dashboardData : {};
    w.dashboardData = {
        scratchpadText: typeof dd.scratchpadText === 'string' ? dd.scratchpadText : '',
        scratchpadUpdatedAt: Number(dd.scratchpadUpdatedAt) || 0,
        tasks: Array.isArray(dd.tasks) ? dd.tasks : [],
        meetings: Array.isArray(dd.meetings) ? dd.meetings : [],
        timeLogs: Array.isArray(dd.timeLogs) ? dd.timeLogs : []
    };
    purgeExpiredCompletedTasks(w.dashboardData);
    w.chats = Array.isArray(w.chats) ? w.chats : [];
    if (!w.chats.some(c => c && c.id === 'chat-general')) {
        w.chats.unshift({
            id: 'chat-general',
            kind: 'group',
            name: 'general',
            topic: 'Workspace updates, coordination & automation feed',
            icon: '#',
            memberAccounts: [],
            messages: [],
            updatedAt: Date.now(),
            unreadCount: 0
        });
    }
    w.chats.forEach(c => {
        c.memberAccounts = Array.isArray(c.memberAccounts) ? c.memberAccounts : [];
        c.messages = Array.isArray(c.messages) ? c.messages : [];
        c.unreadCount = Number(c.unreadCount) || 0;
    });
    flushScheduledNotifications(w, false);
    if (typeof ArchitectBackend !== 'undefined') ArchitectBackend.setPreviewPolicy(w.assetPreviewPolicy);
    if (typeof ArchitectToolbar !== 'undefined') ArchitectToolbar.ensureUserPreferences(w);
    return w;
}
const LOGGED_IN_ACCOUNT_KEY = 'architect-logged-in-account-v1';
function getLoggedInAccountName(ws = state): string {
    try {
        const stored = localStorage.getItem(LOGGED_IN_ACCOUNT_KEY);
        if (stored && stored.trim()) return stored.trim();
    } catch {}
    if (ws?.loggedInAccount && String(ws.loggedInAccount).trim()) return String(ws.loggedInAccount).trim();
    return ws?.users?.[0]?.linkedAccount || ws?.users?.[0]?.name || 'Jordan Davis';
}
function setLoggedInAccountName(accountName: string, ws = state) {
    const clean = accountName.trim();
    if (ws) ws.loggedInAccount = clean || undefined;
    try {
        if (clean) localStorage.setItem(LOGGED_IN_ACCOUNT_KEY, clean);
        else localStorage.removeItem(LOGGED_IN_ACCOUNT_KEY);
    } catch {}
}
function getSortedRoles(ws = state): RoleDef[] {
    return [...(ws?.roles || [])].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
}
function getCurrentActorUser(ws = state): WorkspaceUser | undefined {
    const users = ws?.users || [];
    if (!users.length) return undefined;
    const owner = users[0];
    const acct = getLoggedInAccountName(ws).toLowerCase();
    const matched = users.find(u => u.linkedAccount && u.linkedAccount.trim().toLowerCase() === acct)
        || users.find(u => u.name.trim().toLowerCase() === acct);
    const picked = matched || owner;
    if (picked.id === owner?.id && ws?.actingAsAdmin === false) {
        const nonAdmin = (picked.roleIds || []).filter(rid => rid !== 'role-admin');
        return { ...picked, roleIds: nonAdmin.length ? nonAdmin : ['role-editor'], roleId: nonAdmin[0] || 'role-editor' };
    }
    return picked;
}
function getUserRoles(user: WorkspaceUser | undefined, ws = state): RoleDef[] {
    if (!user) return [];
    const roleIds = Array.isArray(user.roleIds) && user.roleIds.length ? user.roleIds : (user.roleId ? [user.roleId] : []);
    const byId = new Map((ws?.roles || []).map(r => [r.id, r]));
    return roleIds.map(rid => byId.get(rid)).filter((r): r is RoleDef => !!r).sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
}
function getUserHighestRank(user: WorkspaceUser | undefined, ws = state): number {
    if (!user) return 999;
    const owner = ws?.users?.[0];
    const picked = getCurrentActorUser(ws);
    if (user.id === owner?.id && ws?.actingAsAdmin !== false && picked?.id === owner?.id) return 0;
    const roles = getUserRoles(user, ws);
    if (!roles.length) return 999;
    return Math.min(...roles.map(r => Number.isFinite(r.rank) ? r.rank : 99));
}
function userHasGlobalPerm(permKey: keyof RolePermissions, user = getCurrentActorUser(), ws = state): boolean {
    if (!user || user.blocked) return false;
    const roles = getUserRoles(user, ws);
    if (roles.some(r => r.id === 'role-admin')) return true;
    return roles.some(r => !!r.permissions?.[permKey]);
}
function canManageRole(actor: WorkspaceUser | undefined, targetRole: RoleDef, ws = state): boolean {
    if (!actor || actor.blocked || !targetRole) return false;
    if (targetRole.id === 'role-admin') return false;
    if (!userHasGlobalPerm('manageRoles', actor, ws) && !userHasGlobalPerm('manageMembers', actor, ws)) return false;
    const actorRank = getUserHighestRank(actor, ws);
    return actorRank === 0 ? targetRole.rank > 0 : actorRank < targetRole.rank;
}
function getPageAncestorChain(page: Page, ws = state): Page[] {
    const chain: Page[] = [];
    const seen = new Set<string>();
    let cursor: Page | undefined = page;
    while (cursor && !seen.has(cursor.id)) {
        seen.add(cursor.id);
        chain.unshift(cursor);
        if (cursor.permissions?.inheritParent === false) break;
        cursor = cursor.parentId ? (ws?.pages || []).find(p => p.id === cursor!.parentId) : undefined;
    }
    return chain;
}
function resolvePagePermissions(page: Page | undefined, actor = getCurrentActorUser(), ws = state): {
    view: boolean;
    edit: boolean;
    comment: boolean;
    blocked: boolean;
    noOneAccess: boolean;
    inheritParent: boolean;
    inheritedFromPage: Page | null;
    reason: string;
} {
    const inheritParent = page?.permissions?.inheritParent !== false;
    if (actor?.blocked) {
        return { view: false, edit: false, comment: false, blocked: true, noOneAccess: !!page?.permissions?.noOneAccess, inheritParent, inheritedFromPage: null, reason: 'Your account is blocked in this workspace.' };
    }
    if (!page) {
        const canEdit = userHasGlobalPerm('editPages', actor, ws) || userHasGlobalPerm('writePages', actor, ws);
        return { view: true, edit: canEdit, comment: userHasGlobalPerm('comment', actor, ws), blocked: false, noOneAccess: false, inheritParent: true, inheritedFromPage: null, reason: '' };
    }
    const owner = ws?.users?.[0];
    const isOwnerActor = !!owner && !!actor && actor.id === owner.id && !actor.blocked && ws?.actingAsAdmin !== false;
    const chain = getPageAncestorChain(page, ws);
    const lockOwner = chain.find(node => !!node.permissions?.noOneAccess);
    if (lockOwner) {
        if (isOwnerActor) {
            return {
                view: true, edit: true, comment: true, blocked: false, noOneAccess: true, inheritParent,
                inheritedFromPage: lockOwner.id !== page.id ? lockOwner : null,
                reason: lockOwner.id !== page.id ? `Inherited owner-only lock from “${lockOwner.title || 'Untitled'}”.` : 'Locked — only workspace owner has access.'
            };
        }
        return {
            view: false, edit: false, comment: false, blocked: false, noOneAccess: true, inheritParent,
            inheritedFromPage: lockOwner.id !== page.id ? lockOwner : null,
            reason: lockOwner.id !== page.id ? `Inherited lock from “${lockOwner.title || 'Untitled'}” — No one has access to this.` : 'No one has access to this — Restricted to workspace owner.'
        };
    }
    const actorRoles = getUserRoles(actor, ws);
    let view = true;
    let edit = userHasGlobalPerm('editPages', actor, ws) || userHasGlobalPerm('writePages', actor, ws);
    let comment = userHasGlobalPerm('comment', actor, ws);
    let inheritedFromPage: Page | null = null;
    for (const node of chain) {
        const cfg = node.permissions;
        if (!cfg) continue;
        const applyAction = (key: 'view' | 'edit' | 'comment', currentVal: boolean): boolean => {
            let next = currentVal;
            const roleOvr = cfg.roleOverrides || {};
            const hasRoleAllow = actorRoles.some(r => roleOvr[r.id]?.[key] === 'allow');
            const hasRoleDeny = actorRoles.some(r => roleOvr[r.id]?.[key] === 'deny');
            if (hasRoleAllow) { next = true; if (node.id !== page.id) inheritedFromPage = node; }
            else if (hasRoleDeny) { next = false; if (node.id !== page.id) inheritedFromPage = node; }
            const userOvr = actor ? cfg.userOverrides?.[actor.id]?.[key] : undefined;
            if (userOvr === 'allow') { next = true; if (node.id !== page.id) inheritedFromPage = node; }
            else if (userOvr === 'deny') { next = false; if (node.id !== page.id) inheritedFromPage = node; }
            return next;
        };
        view = applyAction('view', view);
        edit = applyAction('edit', edit);
        comment = applyAction('comment', comment);
    }
    if (!view) { edit = false; comment = false; }
    const reason = !view ? 'You do not have View permission for this page.' : !edit ? 'You have View-only access on this page.' : '';
    return { view, edit, comment, blocked: false, noOneAccess: false, inheritParent, inheritedFromPage, reason };
}
function applyImportedDefaultPermissions<T extends Pick<Page, 'permissions'>>(pageOrPages: T | T[], ws: Workspace = state): T[] {
    const pages = Array.isArray(pageOrPages) ? pageOrPages : [pageOrPages];
    const roleIds = new Set<string>(['role-admin', 'role-editor', 'role-viewer', ...((ws?.roles || []).map(r => r.id).filter(Boolean))]);
    pages.forEach(pg => {
        if (!pg) return;
        const overrides: Record<string, PermissionSetOverride> = {};
        roleIds.forEach(rid => {
            overrides[rid] = { view: 'allow', edit: 'allow', comment: 'allow' };
        });
        pg.permissions = {
            inheritParent: false,
            noOneAccess: false,
            roleOverrides: overrides,
            userOverrides: {}
        };
    });
    return pages;
}
function importExternalPages(incomingPages: Partial<Page>[], parentId?: string): Page[] {
    const now = Date.now();
    const created: Page[] = incomingPages.map(raw => {
        const pg: Page = {
            id: raw.id || id(),
            title: (raw.title || 'Imported page').trim() || 'Imported page',
            icon: raw.icon || '📄',
            parentId: raw.parentId !== undefined ? raw.parentId : parentId,
            blocks: Array.isArray(raw.blocks) && raw.blocks.length ? raw.blocks : [block('text', '')],
            createdAt: raw.createdAt || now,
            updatedAt: raw.updatedAt || now,
            ...(raw.pageKind ? { pageKind: raw.pageKind } : {}),
            ...(raw.database ? { database: raw.database } : {}),
            ...(raw.board ? { board: raw.board } : {}),
            ...(raw.databaseId ? { databaseId: raw.databaseId } : {}),
            ...(raw.dbValues ? { dbValues: raw.dbValues } : {}),
            ...(raw.cover ? { cover: raw.cover } : {})
        };
        return pg;
    });
    applyImportedDefaultPermissions(created, state);
    state.pages.push(...created);
    save(true);
    renderNav();
    return created;
}
function isReadOnlyMirror() { return state?.coordinationMode === 'cloud-sync' && !!state?.syncConfig?.readOnlyMirror; }
function getActorDisplayName(ws = state): string {
    return getCurrentActorUser(ws)?.name || ws?.users?.[0]?.name || 'Jordan Davis';
}
function effectivePageReadOnly(page = current()): boolean {
    if (isReadOnlyMirror()) return true;
    if (!page) return false;
    const perms = resolvePagePermissions(page);
    return !perms.view || !perms.edit;
}
function canCommentOnPage(page = current()): boolean {
    if (isReadOnlyMirror() || !page) return false;
    const perms = resolvePagePermissions(page);
    return perms.view && perms.comment;
}
function isAdminAuthorized(actor = getCurrentActorUser()): boolean {
    if (!actor || actor.blocked) return false;
    if (state.actingAsAdmin !== false && getUserHighestRank(actor) === 0) return true;
    return userHasGlobalPerm('manageMembers', actor) || userHasGlobalPerm('manageRoles', actor) || userHasGlobalPerm('manageAssets', actor) || userHasGlobalPerm('sendNotifications', actor);
}
function generateWorkspaceInvite(userId: string, roleIds?: string[]): WorkspaceInvite | null {
    const user = (state.users || []).find(u => u.id === userId);
    if (!user) return null;
    const code = `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const roles = roleIds && roleIds.length ? [...roleIds] : [...(user.roleIds || ['role-editor'])];
    const entry: WorkspaceInvite = {
        code,
        userId: user.id,
        roleIds: roles,
        createdAt: Date.now(),
        createdBy: getCurrentActorUser()?.name || 'Admin'
    };
    user.inviteCode = code;
    state.invites = state.invites || [];
    state.invites.unshift(entry);
    save(true);
    return entry;
}
function redeemWorkspaceInvite(codeRaw: string, accountNameRaw: string): { ok: boolean; error?: string; user?: WorkspaceUser } {
    const code = codeRaw.trim().toUpperCase();
    const accountName = accountNameRaw.trim();
    if (!code) return { ok: false, error: 'Enter an invite code.' };
    if (!accountName) return { ok: false, error: 'Enter your app account username to link.' };
    state.invites = state.invites || [];
    const inv = state.invites.find(i => i.code.toUpperCase() === code);
    const targetUser = (state.users || []).find(u => (inv && u.id === inv.userId) || (u.inviteCode || '').toUpperCase() === code);
    if (!targetUser) return { ok: false, error: `Invite code “${code}” was not found.` };
    targetUser.linkedAccount = accountName;
    if (inv) {
        const merged = [...new Set([...(targetUser.roleIds || []), ...(inv.roleIds || [])])];
        if (merged.length) { targetUser.roleIds = merged; targetUser.roleId = merged[0]; }
        inv.redeemedBy = accountName;
        inv.redeemedAt = Date.now();
    }
    setLoggedInAccountName(accountName);
    state.actingAsAdmin = (targetUser.roleIds || []).includes('role-admin');
    save(true);
    render();
    return { ok: true, user: targetUser };
}
function freshWorkspace(name = 'Acme Studio', users) { return ensureWorkspaceDefaults({ version: 2, workspaceName: name || 'Acme Studio', activePageId: 'home', pages: [{ id: 'home', title: 'New hub', icon: '📄', blocks: [block('text')], createdAt: Date.now(), updatedAt: Date.now() }], users: users || [{ id: 'jordan.davis', name: 'Jordan Davis' }, { id: 'alex.morgan', name: 'Alex Morgan' }, { id: 'sam.lee', name: 'Sam Lee' }] }); }
function applyFreshReset(workspace, originalRaw) { if (localStorage.getItem(RESET_MARKER) === 'done') return ensureWorkspaceDefaults(workspace); const existing = originalRaw || (workspace.pages.length > 1 || (workspace.pages[0]?.blocks || []).some(b => b.text) ? JSON.stringify(workspace) : null); try { if (existing) localStorage.setItem(RESET_BACKUP, existing); const fresh = freshWorkspace(workspace.workspaceName, workspace.users); localStorage.setItem(STORE, JSON.stringify(fresh)); localStorage.setItem(RESET_MARKER, 'done'); return fresh; } catch { return ensureWorkspaceDefaults(workspace); } }
function loadWorkspace(storeKeyOverride?: string) {
    const storeKey = storeKeyOverride || getActiveStoreKey();
    try {
        const raw = localStorage.getItem(storeKey);
        if (raw) {
            const w = JSON.parse(raw);
            if (w.version === 2 && Array.isArray(w.pages))
                return storeKey === STORE ? applyFreshReset(w, raw) : ensureWorkspaceDefaults(w);
        }
        if (storeKey === STORE) {
            const old = JSON.parse(localStorage.getItem(oldStore) || 'null');
            if (Array.isArray(old)) {
                const pages = old.map((p) => ({ id: p.id || id(), title: p.title || 'Untitled', icon: p.icon || '📄', parentId: p.parent || undefined, blocks: (p.blocks || []).map((b) => ({ id: id(), type: { paragraph: 'text' }[b.type] || b.type, text: b.text || '', checked: b.checked })), createdAt: Date.now(), updatedAt: Date.now() }));
                return applyFreshReset({ version: 2, workspaceName: 'Acme Studio', activePageId: localStorage.getItem('notion-clone-active') || pages[0]?.id, pages, users: [{ id: 'jordan.davis', name: 'Jordan Davis' }, { id: 'alex.morgan', name: 'Alex Morgan' }, { id: 'sam.lee', name: 'Sam Lee' }] }, JSON.stringify(old));
            }
        }
    } catch { }
    if (storeKey !== STORE) {
        setActiveStoreKey(STORE);
        if (storeKeyOverride !== STORE) return loadWorkspace(STORE);
    }
    return applyFreshReset({ version: 2, workspaceName: 'Acme Studio', activePageId: 'home', pages: starter, users: [{ id: 'jordan.davis', name: 'Jordan Davis' }, { id: 'alex.morgan', name: 'Alex Morgan' }, { id: 'sam.lee', name: 'Sam Lee' }] }, null);
}
let state = loadWorkspace();
let pageHistory = [state.activePageId];
let historyIndex = 0;
let saveTimer;
let autoSyncTimer = 0;
let activeMenu = null;
let menuOptions = [];
let menuIndex = 0;
const $ = (s) => document.querySelector(s);
const editor = $('#editor');
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800); };
function current() { return state.pages.find(p => p.id === state.activePageId) || state.pages[0]; }
function collectBlockText(blocks, out = []) { (blocks || []).forEach(item => { if (item.text) out.push(item.text); if (item.children?.length) collectBlockText(item.children, out); }); return out; }
function countWords(page) { return [page.title, page.description || '', ...collectBlockText(page.blocks)].join(' ').trim().split(/\s+/).filter(Boolean).length; }
function updatePageOptions() {
    const page = current();
    const width = $('[data-action="toggle-width"]'), count = $('[data-action="toggle-word-count"]');
    const pubBtn = $('[data-action="toggle-publish"]'), anaBtn = $('[data-action="page-analytics"]');
    const pubPill = $('#published-status-pill');
    if (width) { width.textContent = `${page.fullWidth ? '✓ ' : ''}Full page width`; width.setAttribute('aria-pressed', String(!!page.fullWidth)); }
    if (count) { count.textContent = `${page.showWordCount ? '✓ ' : ''}Show word count`; count.setAttribute('aria-pressed', String(!!page.showWordCount)); }
    if (pubBtn) { pubBtn.textContent = page?.published ? '✓ 🌐 Published to workspace' : '🌐 Publish page'; pubBtn.setAttribute('aria-pressed', String(!!page?.published)); }
    if (anaBtn) anaBtn.hidden = !page?.published;
    if (pubPill) pubPill.hidden = !page?.published;
}
function updateHistoryControls() { const back = document.querySelector('[data-action="history-back"]'), forward = document.querySelector('[data-action="history-forward"]'); if (back) back.disabled = historyIndex <= 0; if (forward) forward.disabled = historyIndex >= pageHistory.length - 1; }
function pageHash(pageId, blockId) { return `page=${encodeURIComponent(pageId)}${blockId ? `&block=${encodeURIComponent(blockId)}` : ''}`; }
function pageHref(pageId, blockId) { const url = new URL(location.href); url.hash = pageHash(pageId, blockId); return url.href; }
function syncPageUrl(pageId) { try { history.replaceState(null, '', pageHref(pageId)); } catch { } }
function ensureTabs() {
    const validIds = new Set(state.pages.map(pg => pg.id));
    const fallbackId = validIds.has(state.activePageId) ? state.activePageId : state.pages[0]?.id;
    if (!Array.isArray(state.tabs)) state.tabs = [];
    state.tabs = state.tabs
        .filter(t => t && t.id && validIds.has(t.pageId))
        .map(t => {
            const cleanedHistory = (Array.isArray(t.history) ? t.history : [t.pageId]).filter(pid => validIds.has(pid));
            const history = cleanedHistory.length ? cleanedHistory : [t.pageId];
            const historyIndex = Math.max(0, Math.min(history.length - 1, Number.isFinite(t.historyIndex) ? t.historyIndex : history.length - 1));
            return { ...t, history, historyIndex };
        });
    if (!state.tabs.length && fallbackId) {
        state.tabs.push({ id: id(), pageId: fallbackId, history: [fallbackId], historyIndex: 0 });
    }
    let active = state.tabs.find(t => t.id === state.activeTabId);
    if (!active) {
        active = state.tabs.find(t => t.pageId === fallbackId) || state.tabs[0];
        state.activeTabId = active?.id;
    }
    return { tabs: state.tabs, active };
}
function activeTab() {
    return ensureTabs().active;
}
function syncHistoryToActiveTab() {
    const tab = activeTab();
    if (!tab) return;
    tab.pageId = state.activePageId;
    tab.history = [...pageHistory];
    tab.historyIndex = historyIndex;
}
function loadHistoryFromTab(tab) {
    if (!tab) return;
    const valid = new Set(state.pages.map(pg => pg.id));
    const hist = (tab.history || [tab.pageId]).filter(pid => valid.has(pid));
    pageHistory = hist.length ? hist : [tab.pageId];
    historyIndex = Math.max(0, Math.min(pageHistory.length - 1, Number.isFinite(tab.historyIndex) ? tab.historyIndex : pageHistory.length - 1));
}
function renderTabs() {
    const bar = $('#app-tab-bar');
    if (!bar) return;
    const { tabs, active } = ensureTabs();
    bar.replaceChildren();
    const list = document.createElement('div');
    list.className = 'app-tabs-scroll';
    tabs.forEach(tab => {
        const page = state.pages.find(pg => pg.id === tab.pageId) || state.pages[0];
        if (!page) return;
        const isCurrent = tab.id === active?.id;
        const el = document.createElement('div');
        el.className = 'app-tab' + (isCurrent ? ' active' : '') + (tab.pinned ? ' is-pinned' : '');
        el.setAttribute('role', 'tab');
        el.setAttribute('aria-selected', String(isCurrent));
        el.dataset.tabId = tab.id;
        el.tabIndex = 0;
        el.title = page.title || 'Untitled';
        const ico = document.createElement('span');
        ico.className = 'app-tab-icon';
        ico.innerHTML = pageIconMarkup(page.icon);
        const title = document.createElement('span');
        title.className = 'app-tab-title';
        title.textContent = page.title || 'Untitled';
        el.append(ico, title);
        if (!tab.pinned) {
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'app-tab-close';
            closeBtn.textContent = '×';
            closeBtn.setAttribute('aria-label', `Close tab ${page.title || 'Untitled'}`);
            closeBtn.title = 'Close tab';
            closeBtn.onclick = e => { e.stopPropagation(); closeTab(tab.id); };
            el.append(closeBtn);
        }
        el.onclick = () => switchTab(tab.id);
        el.onmousedown = e => { if (e.button === 1) e.preventDefault(); };
        el.onauxclick = e => {
            if (e.button === 1) { e.preventDefault(); e.stopPropagation(); closeTab(tab.id); }
        };
        el.onkeydown = e => {
            if (e.target !== el) return;
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchTab(tab.id); }
        };
        list.append(el);
    });
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'app-tab-new';
    addBtn.textContent = '＋';
    addBtn.title = 'New tab';
    addBtn.setAttribute('aria-label', 'New tab');
    addBtn.onclick = () => createNewBlankTab();
    bar.append(list, addBtn);
}
function openPageInNewTab(pageId, options = {}) {
    if (!state.pages.some(pg => pg.id === pageId)) return null;
    syncHistoryToActiveTab();
    const { tabs, active } = ensureTabs();
    const shouldActivate = options.activate !== false;
    const newTab = { id: id(), pageId, history: [pageId], historyIndex: 0 };
    const insertAt = active ? tabs.indexOf(active) + 1 : tabs.length;
    tabs.splice(insertAt, 0, newTab);
    if (shouldActivate) {
        state.activeTabId = newTab.id;
        loadHistoryFromTab(newTab);
        navigateToPage(pageId, false);
    } else {
        save();
        renderTabs();
    }
    return newTab;
}
function createNewBlankTab() {
    if (isReadOnlyMirror()) {
        const home = state.pages.find(pg => !pg.parentId && !pg.databaseId) || state.pages[0];
        if (home) openPageInNewTab(home.id);
        return;
    }
    const page = createPage(undefined);
    openPageInNewTab(page.id);
    requestAnimationFrame(() => {
        const firstBlock = editor.querySelector('.block-editor .block');
        if (firstBlock) focusBlockEl(firstBlock, true);
    });
}
function switchTab(tabId) {
    const { tabs } = ensureTabs();
    const target = tabs.find(t => t.id === tabId);
    if (!target) return;
    if (state.activeTabId === target.id && state.activePageId === target.pageId) return;
    syncHistoryToActiveTab();
    state.activeTabId = target.id;
    loadHistoryFromTab(target);
    navigateToPage(target.pageId, false);
}
function closeTab(tabId) {
    const { tabs } = ensureTabs();
    const idx = tabs.findIndex(t => t.id === tabId);
    if (idx < 0) return;
    if (tabs.length === 1) {
        const only = tabs[0];
        const home = state.pages.find(pg => !pg.parentId && !pg.databaseId) || state.pages[0];
        if (home && only.pageId !== home.id) {
            only.pageId = home.id;
            only.history = [home.id];
            only.historyIndex = 0;
            loadHistoryFromTab(only);
            navigateToPage(home.id, false);
        }
        return;
    }
    const closingActive = tabs[idx].id === state.activeTabId;
    tabs.splice(idx, 1);
    if (closingActive) {
        const nextTab = tabs[Math.min(idx, tabs.length - 1)] || tabs[0];
        state.activeTabId = nextTab.id;
        loadHistoryFromTab(nextTab);
        navigateToPage(nextTab.pageId, false);
    } else {
        save();
        renderTabs();
    }
}
function closeOtherTabs(tabId) {
    const { tabs } = ensureTabs();
    const keep = tabs.find(t => t.id === tabId);
    if (!keep) return;
    state.tabs = tabs.filter(t => t.id === tabId || t.pinned);
    state.activeTabId = keep.id;
    loadHistoryFromTab(keep);
    navigateToPage(keep.pageId, false);
}
function closeTabsToRight(tabId) {
    const { tabs } = ensureTabs();
    const idx = tabs.findIndex(t => t.id === tabId);
    if (idx < 0) return;
    state.tabs = tabs.filter((t, i) => i <= idx || t.pinned);
    if (!state.tabs.some(t => t.id === state.activeTabId)) {
        state.activeTabId = tabId;
        const target = state.tabs.find(t => t.id === tabId);
        if (target) {
            loadHistoryFromTab(target);
            navigateToPage(target.pageId, false);
            return;
        }
    }
    save();
    renderTabs();
}
function duplicateTab(tabId) {
    const { tabs } = ensureTabs();
    const src = tabs.find(t => t.id === tabId);
    if (!src) return;
    const copy = { id: id(), pageId: src.pageId, history: [...(src.history || [src.pageId])], historyIndex: src.historyIndex || 0 };
    tabs.splice(tabs.indexOf(src) + 1, 0, copy);
    state.activeTabId = copy.id;
    loadHistoryFromTab(copy);
    navigateToPage(copy.pageId, false);
}
function togglePinTab(tabId) {
    const { tabs } = ensureTabs();
    const target = tabs.find(t => t.id === tabId);
    if (!target) return;
    target.pinned = !target.pinned;
    save();
    renderTabs();
}
let currentAppMode: 'notion' | 'dashboard' = 'notion';
let currentDashboardSubMode: DashboardSubMode = 'user';
let inboxFilter: 'unread' | 'all' | 'comments' | 'activity' = 'unread';
let taskFilter: 'open' | 'completed' | 'all' = 'open';
function setAppMode(mode: 'notion' | 'dashboard' | 'inbox', opts: { skipRender?: boolean; subMode?: DashboardSubMode } = {}) {
    if (mode === 'inbox') {
        currentAppMode = 'dashboard';
        currentDashboardSubMode = 'notifications';
    } else if (mode === 'dashboard') {
        currentAppMode = 'dashboard';
        if (opts.subMode) currentDashboardSubMode = opts.subMode;
    } else {
        currentAppMode = 'notion';
    }
    if (currentAppMode !== 'notion') {
        stopAllAudioPlayers();
        closeDocsNotificationsPopover();
        if (typeof ArchitectDatabase !== 'undefined') {
            ArchitectDatabase.closeDatabasePeek?.();
            ArchitectDatabase.closeDbPopover?.();
        }
    }
    document.body.dataset.appMode = currentAppMode;
    document.body.dataset.dashboardSubmode = currentAppMode === 'dashboard' ? currentDashboardSubMode : '';
    if (!opts.skipRender) syncAppModeUi();
}
function setDashboardSubMode(subMode: DashboardSubMode) {
    const raw = String(subMode || '');
    const normalized: DashboardSubMode = raw === 'tasks' ? 'scratchpad' : raw === 'time-calendar' ? 'time-tracking' : subMode;
    currentDashboardSubMode = normalized;
    if (currentAppMode !== 'dashboard') {
        setAppMode('dashboard', { subMode: normalized });
        return;
    }
    document.body.dataset.dashboardSubmode = normalized;
    syncAppModeUi();
}
const notifiedPageBlockMentions = new Set<string>();
function mentionsUser(rawText: string, user: { id?: string; name?: string } | null | undefined): boolean {
    if (!rawText || !user) return false;
    const lower = String(rawText).toLowerCase();
    const candidates = new Set<string>();
    const name = String(user.name || '').trim().toLowerCase();
    const uid = String(user.id || '').trim().toLowerCase();
    if (name) {
        candidates.add(name);
        const firstToken = name.split(/\s+/)[0];
        if (firstToken && firstToken.length >= 2) candidates.add(firstToken);
    }
    if (uid) candidates.add(uid);
    for (const token of candidates) {
        const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(^|[^\\w@])@${escaped}(?![\\w-])`, 'i');
        if (re.test(lower)) return true;
    }
    return false;
}
function notifyPageMentionIfSelf(page: any, blockId: string, mentionedIdOrName: string, actorName?: string) {
    const me = getCurrentActorUser() || state.users?.[0];
    if (!me || !page || !blockId) return;
    const keyTarget = String(mentionedIdOrName || '').trim().toLowerCase();
    const meName = String(me.name || '').trim().toLowerCase();
    const meId = String(me.id || '').trim().toLowerCase();
    const meFirst = meName.split(/\s+/)[0] || '';
    const isMe = keyTarget === meId || keyTarget === meName || (meFirst.length >= 2 && keyTarget === meFirst);
    if (!isMe) return;
    const dedupeKey = `${page.id}:${blockId}:${me.id || me.name}`;
    if (notifiedPageBlockMentions.has(dedupeKey)) return;
    notifiedPageBlockMentions.add(dedupeKey);
    const sender = actorName || 'Teammate';
    pushInboxNotification({
        kind: 'mention',
        title: `${sender} tagged you on ${page.title || 'Untitled'}`,
        body: `@${me.name} on ${page.title || 'Untitled'}`,
        pageId: page.id,
        blockId,
        actor: sender
    });
}
function checkInlineBlockMentionNotification(page: any, blk: any) {
    const me = getCurrentActorUser() || state.users?.[0];
    if (!me || !page || !blk || blk.type === 'code') return;
    const dedupeKey = `${page.id}:${blk.id}:${me.id || me.name}`;
    const text = String(blk.text || '');
    if (mentionsUser(text, me)) {
        if (!notifiedPageBlockMentions.has(dedupeKey)) {
            notifiedPageBlockMentions.add(dedupeKey);
            pushInboxNotification({
                kind: 'mention',
                title: `Mentioned you on ${page.title || 'Untitled'}`,
                body: text.slice(0, 140),
                pageId: page.id,
                blockId: blk.id,
                actor: me.name || 'Workspace'
            });
        }
    } else {
        notifiedPageBlockMentions.delete(dedupeKey);
    }
}
function trimNotificationsList(ws = state) {
    if (!Array.isArray(ws?.notifications)) return;
    const scheduled = ws.notifications.filter(n => n.status === 'scheduled');
    const sent = ws.notifications.filter(n => n.status !== 'scheduled').slice(0, 80);
    ws.notifications = [...scheduled, ...sent];
}
function getNotificationActorIdentity() {
    const actor = getCurrentActorUser();
    const userName = actor?.name || getLoggedInAccountName() || 'Jordan Davis';
    const userId = actor?.id || userName.toLowerCase().replace(/[^a-z0-9]+/g, '.') || 'user';
    return { userId, userName };
}
function notificationRequiresConfirmRead(n: InboxNotification): boolean {
    return !!(n?.buttons || []).some(b => b.action === 'confirm_read');
}
function recordNotificationRead(n: InboxNotification, confirmed = false) {
    if (!n) return;
    n.read = true;
    const { userId, userName } = getNotificationActorIdentity();
    const now = Date.now();
    n.readBy = Array.isArray(n.readBy) ? n.readBy : [];
    if (!n.readBy.some(r => r.userId === userId)) n.readBy.push({ userId, userName, readAt: now });
    if (confirmed) {
        n.confirmedBy = Array.isArray(n.confirmedBy) ? n.confirmedBy : [];
        if (!n.confirmedBy.some(r => r.userId === userId)) n.confirmedBy.push({ userId, userName, readAt: now });
    }
}
function flushScheduledNotifications(ws = state, syncUi = true, allowPopup = true): InboxNotification[] {
    if (!Array.isArray(ws?.notifications)) return [];
    const now = Date.now();
    const delivered: InboxNotification[] = [];
    ws.notifications.forEach(n => {
        if (n.status === 'scheduled' && Number(n.scheduledFor || 0) <= now) {
            n.status = 'sent';
            n.sentAt = n.sentAt || n.scheduledFor || now;
            n.createdAt = n.sentAt;
            delivered.push(n);
        }
    });
    if (delivered.length > 0 && syncUi && typeof state !== 'undefined' && ws === state) {
        save();
        syncInboxBadges();
        if (delivered.some(d => !d.read)) triggerNewNotificationAnimation();
        if (!$('#docs-notif-popover')?.hidden) renderDocsNotificationsPopover();
        if (currentAppMode === 'dashboard' && (currentDashboardSubMode === 'notifications' || currentDashboardSubMode === 'admin')) renderDashboardView();
        if ($('#notification-analytics-dialog')?.open) renderNotificationAnalyticsBody();
        if (allowPopup) {
            const popItem = delivered.find(n => n.displayMode === 'popup' || n.displayMode === 'both');
            if (popItem) openNotificationViewer(popItem, !notificationRequiresConfirmRead(popItem) && popItem.displayMode === 'popup');
        }
    }
    return delivered;
}
function getVisibleInboxNotifications(ws = state): InboxNotification[] {
    const flipped = flushScheduledNotifications(ws, false, false);
    if (flipped.length > 0 && typeof state !== 'undefined' && ws === state) save();
    return (ws?.notifications || []).filter(n => n.status !== 'scheduled');
}
function handleNotificationButtonClick(n: InboxNotification, btn: NotificationButtonDef, viewerDlg?: HTMLDialogElement | null) {
    const { userId, userName } = getNotificationActorIdentity();
    n.buttonClicks = Array.isArray(n.buttonClicks) ? n.buttonClicks : [];
    if (btn.action === 'confirm_read') {
        const laterIds = new Set((n.buttons || []).filter(b => b.action === 'read_later').map(b => b.id));
        n.buttonClicks = n.buttonClicks.filter(c => !(c.userId === userId && (c.buttonId === btn.id || laterIds.has(c.buttonId))));
        n.buttonClicks.push({ buttonId: btn.id, buttonLabel: btn.label, userId, userName, clickedAt: Date.now() });
        recordNotificationRead(n, true);
        toast('Read confirmed');
    } else if (btn.action === 'read_later') {
        const confirmIds = new Set((n.buttons || []).filter(b => b.action === 'confirm_read').map(b => b.id));
        n.buttonClicks = n.buttonClicks.filter(c => !(c.userId === userId && (c.buttonId === btn.id || confirmIds.has(c.buttonId))));
        n.confirmedBy = (n.confirmedBy || []).filter(c => c.userId !== userId);
        n.buttonClicks.push({ buttonId: btn.id, buttonLabel: btn.label, userId, userName, clickedAt: Date.now() });
        n.read = false;
        toast('Saved for later (marked unread)');
        if (viewerDlg?.open) viewerDlg.close();
    } else {
        const existingIdx = n.buttonClicks.findIndex(c => c.buttonId === btn.id && c.userId === userId);
        if (existingIdx >= 0) {
            n.buttonClicks.splice(existingIdx, 1);
            toast(`Cleared “${btn.label}”`);
        } else {
            n.buttonClicks.push({ buttonId: btn.id, buttonLabel: btn.label, userId, userName, clickedAt: Date.now() });
            toast(`Clicked “${btn.label}”`);
        }
    }
    save();
    syncInboxBadges();
    if (viewerDlg?.open) openNotificationViewer(n, false);
    if (currentAppMode === 'dashboard' && (currentDashboardSubMode === 'notifications' || currentDashboardSubMode === 'admin')) renderDashboardView();
    if ($('#notification-analytics-dialog')?.open) renderNotificationAnalyticsBody();
}
function renderNotificationActionButtons(n: InboxNotification, stopProp = false, viewerDlg?: HTMLDialogElement | null): HTMLElement | null {
    const buttons = Array.isArray(n.buttons) ? n.buttons : [];
    if (!buttons.length) return null;
    const { userId } = getNotificationActorIdentity();
    const wrap = document.createElement('div');
    wrap.className = 'notif-action-buttons';
    buttons.forEach(btn => {
        const clicks = (n.buttonClicks || []).filter(c => c.buttonId === btn.id);
        const pressed = clicks.some(c => c.userId === userId)
            || (btn.action === 'confirm_read' && (n.confirmedBy || []).some(c => c.userId === userId));
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'notif-action-btn' + (btn.action === 'confirm_read' ? ' is-primary' : '') + (pressed ? ' is-pressed' : '');
        el.dataset.notifBtnId = btn.id;
        el.dataset.notifBtnAction = btn.action;
        el.textContent = pressed ? `✓ ${btn.label}` : btn.label;
        el.onclick = ev => {
            if (stopProp) ev.stopPropagation();
            handleNotificationButtonClick(n, btn, viewerDlg);
        };
        wrap.append(el);
    });
    return wrap;
}
function pushInboxNotification(item: Omit<InboxNotification, 'id' | 'createdAt' | 'read'> & { id?: string; createdAt?: number; read?: boolean }): InboxNotification {
    state.notifications = Array.isArray(state.notifications) ? state.notifications : [];
    const now = Date.now();
    const isScheduled = item.status === 'scheduled' && Number(item.scheduledFor || 0) > now;
    const entry: InboxNotification = {
        id: item.id || id(),
        kind: item.kind || 'system',
        title: item.title || 'Workspace update',
        body: item.body || '',
        markdown: item.markdown,
        displayMode: item.displayMode || 'inbox',
        pageId: item.pageId,
        blockId: item.blockId,
        commentThreadId: item.commentThreadId,
        actor: item.actor || getCurrentActorUser()?.name || state.users?.[0]?.name || 'Jordan Davis',
        targetAccount: item.targetAccount,
        read: isScheduled ? false : !!item.read,
        createdAt: item.createdAt || now,
        status: isScheduled ? 'scheduled' : 'sent',
        scheduledFor: item.scheduledFor,
        scheduledTz: item.scheduledTz,
        sentAt: isScheduled ? undefined : (item.sentAt || now),
        buttons: Array.isArray(item.buttons) ? item.buttons : undefined,
        readBy: Array.isArray(item.readBy) ? item.readBy : (item.read && !isScheduled ? [(() => { const a = getNotificationActorIdentity(); return { ...a, readAt: now }; })()] : []),
        confirmedBy: Array.isArray(item.confirmedBy) ? item.confirmedBy : [],
        buttonClicks: Array.isArray(item.buttonClicks) ? item.buttonClicks : []
    };
    state.notifications.unshift(entry);
    trimNotificationsList();
    syncInboxBadges();
    if (!isScheduled && !entry.read) triggerNewNotificationAnimation();
    if (!$('#docs-notif-popover')?.hidden) renderDocsNotificationsPopover();
    if (currentAppMode === 'dashboard' && (currentDashboardSubMode === 'notifications' || currentDashboardSubMode === 'admin')) renderDashboardView();
    return entry;
}
let notifAnimTimer = 0;
let docsNotifFilter: 'unread' | 'all' = 'unread';
function triggerNewNotificationAnimation() {
    const tabBtn = document.querySelector('.obsidian-explorer-tabs [data-action="updates"]') as HTMLElement | null;
    const dot = $('#sidebar-inbox-dot') as HTMLElement | null;
    [tabBtn, dot].forEach(el => {
        if (!el) return;
        el.classList.remove('is-new-notif-anim');
        void el.offsetWidth;
        el.classList.add('is-new-notif-anim');
    });
    clearTimeout(notifAnimTimer);
    notifAnimTimer = window.setTimeout(() => {
        tabBtn?.classList.remove('is-new-notif-anim');
        dot?.classList.remove('is-new-notif-anim');
    }, 1600);
}
function closeDocsNotificationsPopover() {
    const pop = $('#docs-notif-popover') as HTMLElement | null;
    if (pop) pop.hidden = true;
    const trig = document.querySelector('.obsidian-explorer-tabs [data-action="updates"]');
    trig?.setAttribute('aria-expanded', 'false');
}
function renderDocsNotificationsPopover() {
    const pop = $('#docs-notif-popover') as HTMLElement | null;
    if (!pop) return;
    state.notifications = Array.isArray(state.notifications) ? state.notifications : [];
    const all = getVisibleInboxNotifications().slice().sort((a, b) => (b.sentAt || b.createdAt || 0) - (a.sentAt || a.createdAt || 0));
    const unread = all.filter(n => !n.read);
    const items = docsNotifFilter === 'unread' ? unread : all;
    pop.replaceChildren();

    const head = document.createElement('div');
    head.className = 'docs-notif-head';
    head.innerHTML = `<div class="docs-notif-title"><strong>Notifications</strong>${unread.length ? `<span class="docs-notif-pill">${unread.length}</span>` : ''}</div>`;
    const headActs = document.createElement('div');
    headActs.className = 'docs-notif-head-acts';
    const markAll = document.createElement('button');
    markAll.type = 'button'; markAll.className = 'secondary-button'; markAll.textContent = '✓ Mark all read';
    markAll.disabled = unread.length === 0;
    markAll.onclick = () => {
        getVisibleInboxNotifications().forEach(n => recordNotificationRead(n, false));
        save(); syncInboxBadges(); renderDocsNotificationsPopover();
    };
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button'; closeBtn.className = 'icon-button'; closeBtn.textContent = '×'; closeBtn.setAttribute('aria-label', 'Close notifications');
    closeBtn.onclick = () => closeDocsNotificationsPopover();
    headActs.append(markAll, closeBtn);
    head.append(headActs);

    const tabs = document.createElement('div');
    tabs.className = 'docs-notif-tabs';
    [['unread', `Unread (${unread.length})`], ['all', `All (${all.length})`]].forEach(([k, lbl]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'docs-notif-tab' + (docsNotifFilter === k ? ' is-active' : '');
        b.textContent = lbl;
        b.onclick = () => { docsNotifFilter = k as any; renderDocsNotificationsPopover(); };
        tabs.append(b);
    });

    const list = document.createElement('div');
    list.className = 'docs-notif-list';
    if (!items.length) {
        const emp = document.createElement('div');
        emp.className = 'docs-notif-empty';
        emp.textContent = docsNotifFilter === 'unread' ? 'All caught up — no unread notifications.' : 'No notifications yet.';
        list.append(emp);
    } else {
        items.slice(0, 30).forEach(n => {
            const targetPage = n.pageId ? state.pages.find(pg => pg.id === n.pageId) : null;
            const row = document.createElement('div');
            row.className = 'docs-notif-item' + (n.read ? '' : ' is-unread');
            row.dataset.notificationId = n.id;

            const ico = document.createElement('span');
            ico.className = 'docs-notif-ico';
            ico.innerHTML = targetPage ? pageIconMarkup(targetPage.icon) : (n.kind === 'comment' || n.kind === 'reply' ? '💬' : '🔔');

            const copy = document.createElement('div');
            copy.className = 'docs-notif-copy';
            copy.innerHTML = `<div class="docs-notif-row-top"><strong>${esc(n.title)}</strong><span>${esc(formatInboxRelative(n.sentAt || n.createdAt))}</span></div><p>${esc(n.body)}</p><small>${esc(n.actor || 'Workspace')}${targetPage ? ` · ${esc(targetPage.title || 'Untitled')}` : ''}</small>`;
            const rowBtns = renderNotificationActionButtons(n, true);
            if (rowBtns) copy.append(rowBtns);

            row.onclick = () => {
                const req = notificationRequiresConfirmRead(n);
                if (!req) { recordNotificationRead(n, false); save(); syncInboxBadges(); }
                closeDocsNotificationsPopover();
                if (hasRichNotificationContent(n)) { openNotificationViewer(n, !req); return; }
                if (targetPage) {
                    navigateToPage(targetPage.id);
                    if (n.blockId) requestAnimationFrame(() => focusLinkedBlock(n.blockId));
                } else renderDocsNotificationsPopover();
            };
            row.append(ico, copy);
            list.append(row);
        });
    }

    const foot = document.createElement('div');
    foot.className = 'docs-notif-foot';
    const openFull = document.createElement('button');
    openFull.type = 'button'; openFull.className = 'docs-notif-open-full'; openFull.textContent = 'Open full Inbox view →';
    openFull.onclick = () => { closeDocsNotificationsPopover(); setDashboardSubMode('notifications'); };
    foot.append(openFull);

    pop.append(head, tabs, list, foot);
}
function toggleDocsNotificationsPopover() {
    const pop = $('#docs-notif-popover') as HTMLElement | null;
    const trigger = document.querySelector('.obsidian-explorer-tabs [data-action="updates"]') as HTMLElement | null;
    if (!pop) return;
    if (!pop.hidden) { closeDocsNotificationsPopover(); return; }
    renderDocsNotificationsPopover();
    pop.hidden = false;
    trigger?.setAttribute('aria-expanded', 'true');
    if (trigger) {
        const rect = trigger.getBoundingClientRect();
        const width = Math.min(390, window.innerWidth - 24);
        const left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.left));
        const top = Math.min(window.innerHeight - 160, rect.bottom + 8);
        pop.style.left = `${left}px`;
        pop.style.top = `${top}px`;
        pop.style.width = `${width}px`;
    }
}
document.addEventListener('pointerdown', ev => {
    const pop = $('#docs-notif-popover') as HTMLElement | null;
    if (!pop || pop.hidden) return;
    const t = ev.target as Element | null;
    if (pop.contains(t) || t?.closest('.obsidian-explorer-tabs [data-action="updates"]')) return;
    closeDocsNotificationsPopover();
}, true);
function getUnreadInboxCount(): number {
    return getVisibleInboxNotifications().filter(n => !n.read).length;
}
function syncInboxBadges() {
    const unread = getUnreadInboxCount();
    const dot = $('#sidebar-inbox-dot');
    if (dot) dot.hidden = unread <= 0;
    const dashInbox = $('#dash-nav-inbox-badge');
    if (dashInbox) {
        dashInbox.textContent = unread > 99 ? '99+' : String(unread);
        dashInbox.hidden = unread <= 0;
    }
    const unreadChats = (state.chats || []).reduce((acc, c) => acc + (Number(c.unreadCount) || 0), 0);
    const dashChat = $('#dash-nav-chat-badge');
    if (dashChat) {
        dashChat.textContent = unreadChats > 99 ? '99+' : String(unreadChats);
        dashChat.hidden = unreadChats <= 0;
    }
    const openTasks = (state.dashboardData?.tasks || []).filter(t => !t.done).length;
    const dashTasks = $('#dash-nav-tasks-badge');
    if (dashTasks) {
        dashTasks.textContent = openTasks > 99 ? '99+' : String(openTasks);
        dashTasks.hidden = openTasks <= 0;
    }
}
function initFeatureRailIcons() {
    if (typeof ArchitectIcons === 'undefined') return;
    const r = ArchitectIcons.RAIL_ICONS;
    const setBtn = (sel: string, svg: string) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const inner = el.querySelector('.rail-ico, .obs-tab-ico, .dash-subnav-ico');
        if (inner) inner.innerHTML = svg;
        else el.innerHTML = svg;
    };
    setBtn('#feature-rail [data-action="minimize-sidebar"]', r.sidebarToggle);
    setBtn('#feature-rail [data-app-mode="notion"]', r.notion);
    setBtn('#feature-rail [data-app-mode="dashboard"]', r.dashboard);
    setBtn('#feature-rail [data-action="asset-library"]', r.assets);
    setBtn('#feature-rail [data-action="sync-now"]', r.sync);
    setBtn('#feature-rail [data-action="trash"]', r.trash);
    setBtn('#feature-rail [data-action="user-settings"]', r.userSettings);

    setBtn('.obsidian-explorer-tabs [data-app-mode="notion"]', r.assets);
    setBtn('.obsidian-explorer-tabs [data-action="search"]', r.search);
    setBtn('.obsidian-explorer-tabs [data-action="updates"]', r.inbox);

    setBtn('#dashboard-subnav [data-dashboard-submode="notifications"]', r.inbox);
    setBtn('#dashboard-subnav [data-dashboard-submode="chat"]', (r as any).chat || r.inbox);
    setBtn('#dashboard-subnav [data-dashboard-submode="user"]', r.userDash);
    setBtn('#dashboard-subnav [data-dashboard-submode="admin"]', r.adminDash);
    setBtn('#dashboard-subnav [data-dashboard-submode="time-tracking"]', (r as any).timeTracking || r.calendarTime);
    setBtn('#dashboard-subnav [data-dashboard-submode="calendar"]', (r as any).calendar || r.calendarTime);
    setBtn('#dashboard-subnav [data-dashboard-submode="taskboard"]', (r as any).taskboard || r.tasks);
    setBtn('#dashboard-subnav [data-dashboard-submode="scratchpad"]', r.scratchpad);
}
function formatInboxRelative(ts: number): string {
    const delta = Math.max(0, Math.floor((Date.now() - (ts || 0)) / 1000));
    if (delta < 60) return 'just now';
    if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
    if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
    return `${Math.floor(delta / 86400)}d ago`;
}
function renderDashboardView() {
    const view = $('#dashboard-view');
    if (!view) return;
    ensureWorkspaceDefaults(state);
    view.replaceChildren();
    switch (currentDashboardSubMode) {
        case 'notifications':
            renderDashboardNotificationsView(view);
            break;
        case 'chat':
            renderDashboardChatView(view);
            break;
        case 'admin':
            renderAdminDashboardView(view);
            break;
        case 'time-tracking':
            renderTimeTrackingDashboardView(view);
            break;
        case 'calendar':
            renderCalendarDashboardView(view);
            break;
        case 'taskboard':
            renderTaskboardDashboardView(view);
            break;
        case 'scratchpad':
            renderScratchpadDashboardView(view);
            break;
        case 'user':
        default:
            renderUserDashboardView(view);
            break;
    }
}
const TIMEZONE_PRESETS = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Toronto', 'America/Sao_Paulo', 'Europe/London', 'Europe/Berlin', 'Europe/Paris',
    'Europe/Warsaw', 'Europe/Athens', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore',
    'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Auckland'
];
function getEffectiveUserTimeZone(ws = state): string {
    const prefTz = ws?.userPreferences?.timeZone;
    const sysTz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch { return 'UTC'; } })();
    const tz = typeof prefTz === 'string' && prefTz.trim() && prefTz !== 'auto' ? prefTz.trim() : sysTz;
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz }).format(new Date());
        return tz;
    } catch {
        return sysTz;
    }
}
function formatTimeZoneOffsetLabel(date: Date, timeZone: string): string {
    try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' }).formatToParts(date);
        const tzPart = parts.find(p => p.type === 'timeZoneName')?.value;
        if (tzPart) return tzPart;
    } catch {}
    try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).formatToParts(date);
        return parts.find(p => p.type === 'timeZoneName')?.value || timeZone;
    } catch {
        return timeZone;
    }
}
function wallClockToUnixSeconds(dateStr: string, timeStr: string, timeZone: string): number {
    const dm = String(dateStr || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const tm = String(timeStr || '12:00').trim().match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!dm) return Math.floor(Date.now() / 1000);
    const y = Number(dm[1]), mo = Number(dm[2]), d = Number(dm[3]);
    const hh = tm ? Number(tm[1]) : 12, mm = tm ? Number(tm[2]) : 0, ss = tm?.[3] ? Number(tm[3]) : 0;
    const targetWallMs = Date.UTC(y, mo - 1, d, hh, mm, ss);
    const wallMsInZone = (utcMs: number): number => {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            hour12: false,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).formatToParts(new Date(utcMs));
        const get = (t: string) => Number(parts.find(p => p.type === t)?.value || 0);
        return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
    };
    try {
        let guess = targetWallMs;
        guess -= (wallMsInZone(guess) - targetWallMs);
        guess -= (wallMsInZone(guess) - targetWallMs);
        return Math.floor(guess / 1000);
    } catch {
        return Math.floor(targetWallMs / 1000);
    }
}
function formatDiscordTimestamp(unixRaw: number, style = 'f', timeZone = getEffectiveUserTimeZone()): string {
    const unixSec = unixRaw > 1e12 ? Math.floor(unixRaw / 1000) : unixRaw;
    const d = new Date(unixSec * 1000);
    if (Number.isNaN(d.getTime())) return String(unixRaw);
    if (style === 'R') {
        const diffSec = Math.round((d.getTime() - Date.now()) / 1000);
        const abs = Math.abs(diffSec);
        try {
            const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
            if (abs < 60) return rtf.format(diffSec, 'second');
            if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
            if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
            if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), 'day');
            if (abs < 31536000) return rtf.format(Math.round(diffSec / 2592000), 'month');
            return rtf.format(Math.round(diffSec / 31536000), 'year');
        } catch {}
    }
    const opts: Record<string, Intl.DateTimeFormatOptions> = {
        t: { timeStyle: 'short' },
        T: { timeStyle: 'medium' },
        d: { dateStyle: 'short' },
        D: { dateStyle: 'long' },
        f: { dateStyle: 'medium', timeStyle: 'short' },
        F: { dateStyle: 'full', timeStyle: 'short' }
    };
    return new Intl.DateTimeFormat('en-US', { timeZone, ...(opts[style] || opts.f) }).format(d);
}
let userDashClockTimer: any = 0;
function renderUserDashboardView(view: HTMLElement) {
    clearInterval(userDashClockTimer);
    const pages = state.pages.filter(pg => !pg.databaseId && resolvePagePermissions(pg).view);
    const boards = pages.filter(pg => pg.pageKind === 'board');
    const dbs = pages.filter(pg => pg.pageKind === 'database');
    const assets = readAssets();
    const unread = getUnreadInboxCount();
    const dd = state.dashboardData;
    if (dd && purgeExpiredCompletedTasks(dd) > 0) save();
    const openTasks = (dd?.tasks || []).filter(t => !t.done).length;
    const recent = pages.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 6);
    const me = getActorDisplayName();

    const shell = document.createElement('div');
    shell.className = 'mode-page-shell';

    const hero = document.createElement('div');
    hero.className = 'mode-hero';
    const heroCopy = document.createElement('div');
    heroCopy.innerHTML = `<span class="mode-kicker">USER DASHBOARD</span><h1>Welcome back, ${esc(me)}</h1><p>${esc(state.workspaceName || 'Architect Studio')} · ${pages.length} docs · ${boards.length} boards · ${dbs.length} databases · ${assets.length} assets</p>`;

    const clockEl = document.createElement('div');
    clockEl.id = 'user-dashboard-clock';
    clockEl.className = 'user-dash-clock';
    clockEl.setAttribute('aria-label', 'Current local time');
    const updateClock = () => {
        if (!clockEl.isConnected && view.contains(clockEl) === false && document.body.contains(clockEl) === false) {
            clearInterval(userDashClockTimer);
            return;
        }
        const now = new Date();
        const tz = getEffectiveUserTimeZone();
        const timeStr = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit' }).format(now);
        const dateStr = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(now);
        const offset = formatTimeZoneOffsetLabel(now, tz);
        clockEl.innerHTML = `<strong class="user-dash-clock-time">${esc(timeStr)}</strong><span class="user-dash-clock-meta">${esc(dateStr)} · ${esc(tz.replace(/_/g, ' '))} (${esc(offset)})</span>`;
    };
    hero.append(heroCopy, clockEl);
    userDashClockTimer = setInterval(() => {
        if (!clockEl.isConnected) { clearInterval(userDashClockTimer); return; }
        updateClock();
    }, 1000);

    const stats = document.createElement('div');
    stats.className = 'dashboard-stats-grid';
    [
        { label: 'Docs & Hubs', val: String(pages.length), hint: 'Switch to Docs explorer', action: () => setAppMode('notion') },
        { label: 'Open tasks', val: String(openTasks), hint: 'Manage quick action items', action: () => setDashboardSubMode('tasks') },
        { label: 'Unread notifications', val: String(unread), hint: 'Review comments & updates', action: () => setDashboardSubMode('notifications') },
        { label: 'Scratchpad notes', val: (state.dashboardData?.scratchpadText || '').trim() ? 'Active' : 'Empty', hint: 'Open brainstorming pad', action: () => setDashboardSubMode('scratchpad') }
    ].forEach(card => {
        const box = document.createElement('button');
        box.type = 'button';
        box.className = 'dashboard-stat-card';
        box.innerHTML = `<span class="stat-label">${esc(card.label)}</span><strong class="stat-val">${esc(card.val)}</strong><small>${esc(card.hint)}</small>`;
        box.onclick = card.action;
        stats.append(box);
    });

    const recentSection = document.createElement('section');
    recentSection.className = 'dashboard-recent-section';
    recentSection.innerHTML = '<h2>Recent pages &amp; boards</h2>';
    const recentGrid = document.createElement('div');
    recentGrid.className = 'dashboard-recent-grid';
    recent.forEach(pg => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'dashboard-page-card';
        card.innerHTML = `<span class="dash-page-ico">${pageIconMarkup(pg.icon)}</span><span class="dash-page-copy"><strong>${esc(pg.title || 'Untitled')}</strong><small>${pg.pageKind === 'board' ? 'Board' : pg.pageKind === 'database' ? 'Database' : 'Page'} · ${formatInboxRelative(pg.updatedAt)}</small></span>`;
        card.onclick = e => { if (e.ctrlKey || e.metaKey) openPageInNewTab(pg.id); else navigateToPage(pg.id); };
        recentGrid.append(card);
    });
    recentSection.append(recentGrid);

    shell.append(hero, stats, recentSection);
    view.append(shell);
    updateClock();
}
function renderRichInlineInto(container: HTMLElement, rawText: string, afterNavigate?: () => void) {
    const tokenRe = /(!\[[^\]]*\]\([^)]+\)|\[\[[^\]]+\]\]|<t:\d{6,13}(?::[tTdDfFR])?>)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = tokenRe.exec(rawText)) !== null) {
        if (m.index > last) {
            const span = document.createElement('span');
            span.innerHTML = markdownInline(rawText.slice(last, m.index));
            container.append(...span.childNodes);
        }
        const tok = m[0];
        if (tok.startsWith('<t:')) {
            const tm = tok.match(/^<t:(\d{6,13})(?::([tTdDfFR]))?>$/);
            const unixRaw = Number(tm?.[1] || 0);
            const unixSec = unixRaw > 1e12 ? Math.floor(unixRaw / 1000) : unixRaw;
            const style = tm?.[2] || 'f';
            const userTz = getEffectiveUserTimeZone();
            const timeEl = document.createElement('time');
            timeEl.className = 'discord-timestamp-pill';
            timeEl.dataset.unix = String(unixSec);
            timeEl.dataset.style = style;
            const iso = new Date(unixSec * 1000).toISOString();
            timeEl.dateTime = iso;
            timeEl.textContent = formatDiscordTimestamp(unixSec, style, userTz);
            const fullHover = formatDiscordTimestamp(unixSec, 'F', userTz);
            timeEl.title = `${fullHover} (${userTz})`;
            container.append(timeEl);
        } else if (tok.startsWith('![')) {
            const imgMatch = tok.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
            const alt = imgMatch?.[1] || 'Image';
            const srcRaw = (imgMatch?.[2] || '').trim();
            const wrap = document.createElement('span');
            wrap.className = 'rich-md-img-wrap';
            const img = document.createElement('img');
            img.className = 'rich-md-img';
            img.alt = alt;
            if (srcRaw.startsWith('asset:')) {
                const aid = srcRaw.slice(6).trim();
                const assetRec = ArchitectBackend.readAssetCatalog().find(a => a.id === aid);
                if (assetRec) {
                    const quickUrl = assetRec.storageMode === 'local' ? (assetRec.url || '') : (assetRec.previewDataUrl || assetRec.externalUrl || assetRec.url || '');
                    if (quickUrl) img.src = quickUrl;
                    Promise.resolve(ArchitectBackend.resolveAssetOriginalUrl(assetRec) || ArchitectBackend.resolveAssetPreviewUrl(assetRec))
                        .then(u => { if (u && img.isConnected) img.src = u; })
                        .catch(() => {});
                    img.onclick = () => openImageLightbox(assetRec);
                }
            } else if (/^(https?:\/\/|data:image\/)/i.test(srcRaw)) {
                img.src = srcRaw;
                img.onclick = () => openImageLightbox({ id: 'inline', name: alt, storageMode: 'local', url: srcRaw, fileType: 'image/*' });
            }
            if (img.src || srcRaw.startsWith('asset:')) wrap.append(img);
            container.append(wrap);
        } else if (tok.startsWith('[[')) {
            const inner = tok.slice(2, -2);
            const [labelOrId, explicitId] = inner.includes('|') ? inner.split('|') : ['', inner];
            const pageId = (explicitId || inner).trim();
            const pg = state.pages.find(p => p.id === pageId)
                || state.pages.find(p => (p.title || '').toLowerCase() === (labelOrId || inner).trim().toLowerCase());
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'rich-md-page-embed';
            btn.innerHTML = `<span class="page-link-icon">${pageIconMarkup(pg?.icon)}</span><span>${esc(pg?.title || labelOrId || 'Page')}</span>`;
            btn.onclick = ev => {
                ev.stopPropagation();
                if (!pg) { toast('Linked page no longer exists'); return; }
                const viewer = $('#notification-viewer-dialog') as HTMLDialogElement | null;
                if (viewer?.open) viewer.close();
                afterNavigate?.();
                navigateToPage(pg.id);
            };
            container.append(btn);
        }
        last = tokenRe.lastIndex;
    }
    if (last < rawText.length) {
        const span = document.createElement('span');
        span.innerHTML = markdownInline(rawText.slice(last));
        container.append(...span.childNodes);
    }
}
function renderRichMarkdownFragment(mdText: string, afterNavigate?: () => void): HTMLElement {
    const root = document.createElement('div');
    root.className = 'rich-md-view';
    const lines = String(mdText || '').replace(/\r\n?/g, '\n').split('\n');
    let listEl: HTMLElement | null = null;
    let listKind: 'bullet' | 'numbered' | '' = '';
    const flushList = () => {
        if (listEl) root.append(listEl);
        listEl = null;
        listKind = '';
    };
    lines.forEach(line => {
        if (!line.trim()) { flushList(); return; }
        const parsed = parseMarkdownLine(line);
        if (parsed.type === 'bullet' || parsed.type === 'numbered') {
            if (listKind !== parsed.type) {
                flushList();
                listEl = document.createElement(parsed.type === 'numbered' ? 'ol' : 'ul');
                listKind = parsed.type;
            }
            const li = document.createElement('li');
            renderRichInlineInto(li, parsed.text, afterNavigate);
            listEl!.append(li);
            return;
        }
        flushList();
        if (parsed.type === 'divider') {
            root.append(document.createElement('hr'));
            return;
        }
        if (/^h[1-6]$/.test(parsed.type)) {
            const h = document.createElement(parsed.type);
            renderRichInlineInto(h, parsed.text, afterNavigate);
            root.append(h);
            return;
        }
        if (parsed.type === 'quote') {
            const bq = document.createElement('blockquote');
            renderRichInlineInto(bq, parsed.text, afterNavigate);
            root.append(bq);
            return;
        }
        if (parsed.type === 'todo') {
            const row = document.createElement('div');
            row.className = 'rich-md-todo';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.disabled = true;
            cb.checked = !!parsed.checked;
            const copy = document.createElement('span');
            renderRichInlineInto(copy, parsed.text, afterNavigate);
            row.append(cb, copy);
            root.append(row);
            return;
        }
        const pEl = document.createElement('p');
        renderRichInlineInto(pEl, line, afterNavigate);
        root.append(pEl);
    });
    flushList();
    if (!root.childNodes.length) {
        const empty = document.createElement('p');
        empty.className = 'dash-muted';
        empty.textContent = 'No content preview yet.';
        root.append(empty);
    }
    return root;
}
function summarizeNotificationMarkdown(md: string): string {
    return String(md || '')
        .replace(/<t:(\d{6,13})(?::([tTdDfFR]))?>/g, (_, u, st) => formatDiscordTimestamp(Number(u), st || 'f'))
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, (_, alt) => `[Image: ${alt || 'attachment'}]`)
        .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, (_, label) => `[Page: ${label}]`)
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^\s*[-*+]\s+\[[ xX]\]\s*/gm, '')
        .replace(/^\s*([-*+]|\d+\.)\s+/gm, '')
        .replace(/^>\s?/gm, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/~~([^~]+)~~/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
}
function hasRichNotificationContent(n: InboxNotification): boolean {
    const src = n.markdown || n.body || '';
    if (n.markdown && n.markdown.trim().length > 0) return true;
    return /!\[[^\]]*\]\([^)]+\)|\[\[[^\]]+\]\]|<t:\d{6,13}(?::[tTdDfFR])?>|^(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|---)/m.test(src) || src.includes('\n');
}
function openNotificationViewer(n: InboxNotification, markRead = true) {
    const dlg = $('#notification-viewer-dialog') as HTMLDialogElement | null;
    if (!dlg) return;
    if (markRead && !notificationRequiresConfirmRead(n)) {
        recordNotificationRead(n, false);
        save();
        syncInboxBadges();
    }
    const titleEl = $('#notif-viewer-title');
    const metaEl = $('#notif-viewer-meta');
    const bodyEl = $('#notif-viewer-body');
    const footerEl = $('#notif-viewer-footer');
    if (titleEl) titleEl.textContent = n.title || 'Notification';
    if (metaEl) metaEl.textContent = `From ${n.actor || 'Admin'} · ${formatInboxRelative(n.sentAt || n.createdAt)}${n.displayMode ? ` · Mode: ${n.displayMode}` : ''}`;
    if (bodyEl) {
        bodyEl.replaceChildren();
        bodyEl.append(renderRichMarkdownFragment(n.markdown || n.body || ''));
        const actionBtns = renderNotificationActionButtons(n, false, dlg);
        if (actionBtns) bodyEl.append(actionBtns);
    }
    if (footerEl) {
        footerEl.replaceChildren();
        const targetPg = n.pageId ? state.pages.find(pg => pg.id === n.pageId) : null;
        if (targetPg) {
            const goBtn = document.createElement('button');
            goBtn.type = 'button';
            goBtn.className = 'share-button';
            goBtn.textContent = `Open linked page: ${targetPg.title || 'Untitled'}`;
            goBtn.onclick = () => {
                dlg.close();
                navigateToPage(targetPg.id);
            };
            footerEl.append(goBtn);
        }
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'secondary-button';
        closeBtn.textContent = 'Close';
        closeBtn.onclick = () => dlg.close();
        footerEl.append(closeBtn);
    }
    if (!dlg.open) dlg.showModal();
    if (currentAppMode === 'dashboard' && currentDashboardSubMode === 'notifications') renderDashboardView();
}
function renderUserRoleChips(
    container: HTMLElement,
    u: WorkspaceUser,
    isOwner: boolean,
    actor: WorkspaceUser | undefined,
    onChanged: () => void
) {
    container.className = 'member-roles-wrap';
    const sortedRoles = getSortedRoles();
    const actorRank = getUserHighestRank(actor);
    const canEditTarget = userHasGlobalPerm('manageMembers', actor) && (actorRank === 0 || getUserHighestRank(u) > actorRank || !u.roleIds?.length);
    const assigned = getUserRoles(u);
    if (!assigned.length) {
        const base = document.createElement('span');
        base.className = 'dash-role-pill';
        base.textContent = '@everyone';
        container.append(base);
    }
    assigned.forEach(r => {
        const chip = document.createElement('span');
        chip.className = 'role-chip';
        chip.innerHTML = `<span class="role-chip-dot" style="background:${esc(r.color || '#2383e2')}"></span><span>${esc(r.name)}</span>`;
        const canRemoveThis = canEditTarget
            && !(isOwner && r.id === 'role-admin')
            && (actorRank === 0 || actorRank < r.rank);
        if (canRemoveThis) {
            const rm = document.createElement('button');
            rm.type = 'button';
            rm.className = 'role-chip-remove';
            rm.textContent = '×';
            rm.title = `Remove ${r.name} from ${u.name}`;
            rm.onclick = () => {
                u.roleIds = (u.roleIds || []).filter(id => id !== r.id);
                u.roleId = u.roleIds[0];
                save(true);
                onChanged();
            };
            chip.append(rm);
        }
        container.append(chip);
    });
    if (canEditTarget) {
        const assignable = sortedRoles.filter(r =>
            !(u.roleIds || []).includes(r.id)
            && (actorRank === 0 || (actorRank < r.rank && r.id !== 'role-admin'))
        );
        if (assignable.length) {
            const addSel = document.createElement('select');
            addSel.className = 'role-add-select';
            addSel.ariaLabel = `Add role for ${u.name}`;
            addSel.innerHTML = `<option value="">+ Role</option>${assignable.map(r => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('')}`;
            addSel.onchange = () => {
                const rid = addSel.value;
                if (!rid) return;
                u.roleIds = [...new Set([...(u.roleIds || []), rid])];
                u.roleId = u.roleIds[0];
                save(true);
                onChanged();
            };
            container.append(addSel);
        }
    }
}
function openFullMemberManagerDialog() {
    const dlg = $('#member-manager-dialog') as HTMLDialogElement | null;
    const body = $('#member-manager-body');
    if (!dlg || !body) return;
    let query = '';
    const renderModalBody = () => {
        ensureWorkspaceDefaults(state);
        const actor = getCurrentActorUser();
        const owner = state.users?.[0];
        const roles = getSortedRoles();
        const actorRank = getUserHighestRank(actor);
        const canManage = userHasGlobalPerm('manageMembers', actor);
        body.replaceChildren();

        const toolbar = document.createElement('div');
        toolbar.className = 'member-manager-toolbar';
        const searchInp = document.createElement('input');
        searchInp.id = 'mm-search';
        searchInp.type = 'search';
        searchInp.placeholder = 'Search members, linked accounts, roles…';
        searchInp.value = query;
        searchInp.oninput = () => { query = searchInp.value; renderTable(); };

        const createForm = document.createElement('form');
        createForm.className = 'dash-inline-form';
        const assignableOnCreate = roles.filter(r => actorRank === 0 || (actorRank < r.rank && r.id !== 'role-admin'));
        createForm.innerHTML = `<input id="mm-add-name" placeholder="New member name" autocomplete="off" required><select id="mm-add-role">${assignableOnCreate.map(r => `<option value="${esc(r.id)}"${r.id === 'role-editor' ? ' selected' : ''}>${esc(r.name)}</option>`).join('')}</select><button type="submit" class="share-button"${canManage ? '' : ' disabled'}>＋ Create user</button>`;
        createForm.onsubmit = ev => {
            ev.preventDefault();
            if (!canManage) return;
            const nInp = createForm.querySelector('#mm-add-name') as HTMLInputElement;
            const rSel = createForm.querySelector('#mm-add-role') as HTMLSelectElement;
            const rawName = nInp.value.trim();
            if (!rawName) return;
            const baseSlug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') || id().slice(0, 8);
            const slug = state.users.some(x => x.id === baseSlug) ? `${baseSlug}.${id().slice(0, 4)}` : baseSlug;
            const rid = rSel.value || 'role-editor';
            state.users.push({ id: slug, name: rawName, roleId: rid, roleIds: [rid], blocked: false });
            save(true);
            toast(`Added member “${rawName}”`);
            renderModalBody();
            if (currentAppMode === 'dashboard') renderDashboardView();
        };
        toolbar.append(searchInp, createForm);
        body.append(toolbar);

        const tableWrap = document.createElement('div');
        tableWrap.className = 'member-manager-table-wrap';
        body.append(tableWrap);

        const renderTable = () => {
            tableWrap.replaceChildren();
            const q = query.trim().toLowerCase();
            const filteredUsers = (state.users || []).filter(u => {
                if (!q) return true;
                const rNames = getUserRoles(u).map(r => r.name).join(' ').toLowerCase();
                return u.name.toLowerCase().includes(q) || (u.linkedAccount || '').toLowerCase().includes(q) || rNames.includes(q);
            });
            const table = document.createElement('table');
            table.className = 'member-manager-table';
            table.innerHTML = '<thead><tr><th>Member</th><th>Roles</th><th>Linked Account</th><th>Invite</th><th>Actions</th></tr></thead>';
            const tbody = document.createElement('tbody');
            filteredUsers.forEach(u => {
                const isOwner = !!owner && u.id === owner.id;
                const isActive = actor?.id === u.id;
                const tr = document.createElement('tr');
                if (u.blocked) tr.className = 'is-blocked';

                const tdName = document.createElement('td');
                tdName.innerHTML = `<strong>${esc(u.name)}</strong>${isOwner ? ' <span class="dash-role-pill">Owner</span>' : ''}${isActive ? ' <span class="dash-linked-pill">Logged in</span>' : ''}${u.blocked ? ' <span class="dash-status-blocked">Blocked</span>' : ''}`;

                const tdRoles = document.createElement('td');
                const rolesHost = document.createElement('div');
                renderUserRoleChips(rolesHost, u, isOwner, actor, () => { renderModalBody(); if (currentAppMode === 'dashboard') renderDashboardView(); render(); });
                tdRoles.append(rolesHost);

                const tdLink = document.createElement('td');
                const linkWrap = document.createElement('div');
                linkWrap.className = 'member-actions-cell';
                const accBadge = document.createElement('span');
                accBadge.className = u.linkedAccount ? 'dash-linked-pill' : 'dash-muted';
                accBadge.textContent = u.linkedAccount ? u.linkedAccount : 'Not linked';
                linkWrap.append(accBadge);
                if (canManage) {
                    const linkBtn = document.createElement('button');
                    linkBtn.type = 'button';
                    linkBtn.className = 'secondary-button';
                    linkBtn.textContent = u.linkedAccount ? 'Change' : 'Link account';
                    linkBtn.onclick = () => {
                        const nextAcc = prompt(`App account username for ${u.name}:`, u.linkedAccount || u.name);
                        if (nextAcc === null) return;
                        u.linkedAccount = nextAcc.trim() || undefined;
                        save(true);
                        renderModalBody();
                        if (currentAppMode === 'dashboard') renderDashboardView();
                    };
                    linkWrap.append(linkBtn);
                    if (u.linkedAccount && !isOwner) {
                        const unlinkBtn = document.createElement('button');
                        unlinkBtn.type = 'button';
                        unlinkBtn.className = 'secondary-button';
                        unlinkBtn.textContent = 'Unlink';
                        unlinkBtn.onclick = () => {
                            u.linkedAccount = undefined;
                            save(true);
                            renderModalBody();
                            if (currentAppMode === 'dashboard') renderDashboardView();
                        };
                        linkWrap.append(unlinkBtn);
                    }
                }
                tdLink.append(linkWrap);

                const tdInv = document.createElement('td');
                const invWrap = document.createElement('div');
                invWrap.className = 'member-actions-cell';
                if (u.inviteCode) {
                    const codeEl = document.createElement('span');
                    codeEl.className = 'invite-code-pill';
                    codeEl.textContent = u.inviteCode;
                    const copyBtn = document.createElement('button');
                    copyBtn.type = 'button';
                    copyBtn.className = 'secondary-button';
                    copyBtn.textContent = 'Copy link';
                    copyBtn.onclick = () => {
                        const url = new URL(location.href);
                        url.hash = `invite=${encodeURIComponent(u.inviteCode!)}`;
                        navigator.clipboard?.writeText(url.href).catch(() => {});
                        toast(`Copied invite link (${u.inviteCode})`);
                    };
                    invWrap.append(codeEl, copyBtn);
                }
                if (canManage && !isOwner) {
                    const genBtn = document.createElement('button');
                    genBtn.type = 'button';
                    genBtn.className = 'secondary-button';
                    genBtn.textContent = u.inviteCode ? 'New invite' : 'Create invite';
                    genBtn.onclick = () => {
                        const inv = generateWorkspaceInvite(u.id);
                        if (inv) toast(`Invite ${inv.code} ready for ${u.name}`);
                        renderModalBody();
                    };
                    invWrap.append(genBtn);
                }
                tdInv.append(invWrap);

                const tdActs = document.createElement('td');
                tdActs.className = 'member-actions-cell';
                if (canManage && !isOwner) {
                    const blkBtn = document.createElement('button');
                    blkBtn.type = 'button';
                    blkBtn.className = 'secondary-button';
                    blkBtn.textContent = u.blocked ? 'Unblock' : 'Block';
                    blkBtn.onclick = () => {
                        u.blocked = !u.blocked;
                        save(true);
                        toast(u.blocked ? `Blocked ${u.name}` : `Unblocked ${u.name}`);
                        renderModalBody();
                        if (currentAppMode === 'dashboard') renderDashboardView();
                        render();
                    };
                    const delBtn = document.createElement('button');
                    delBtn.type = 'button';
                    delBtn.className = 'secondary-button';
                    delBtn.textContent = 'Delete';
                    delBtn.onclick = () => {
                        state.users = state.users.filter(x => x.id !== u.id);
                        save(true);
                        renderModalBody();
                        if (currentAppMode === 'dashboard') renderDashboardView();
                        render();
                    };
                    tdActs.append(blkBtn, delBtn);
                } else {
                    const note = document.createElement('span');
                    note.className = 'dash-muted';
                    note.textContent = isOwner ? 'Workspace owner' : '—';
                    tdActs.append(note);
                }
                tr.append(tdName, tdRoles, tdLink, tdInv, tdActs);
                tbody.append(tr);
            });
            table.append(tbody);
            tableWrap.append(table);
        };
        renderTable();

        const inviteBox = document.createElement('div');
        inviteBox.className = 'invite-panel-box';
        inviteBox.innerHTML = '<strong>Accept invite &amp; link app account</strong><p class="dash-muted">Redeeming an invite binds your app account to that member entry so future role or block updates apply automatically.</p>';
        const redeemForm = document.createElement('form');
        redeemForm.className = 'dash-inline-form';
        redeemForm.innerHTML = '<input id="mm-redeem-code" placeholder="Invite code (e.g. INV-ABC123)" autocomplete="off" required><input id="mm-redeem-account" placeholder="Your app username (e.g. maya.studio)" autocomplete="off" required><button type="submit" id="mm-redeem-btn" class="share-button">Redeem invite</button>';
        redeemForm.onsubmit = ev => {
            ev.preventDefault();
            const codeVal = (redeemForm.querySelector('#mm-redeem-code') as HTMLInputElement).value;
            const accVal = (redeemForm.querySelector('#mm-redeem-account') as HTMLInputElement).value;
            const res = redeemWorkspaceInvite(codeVal, accVal);
            if (!res.ok) { toast(res.error || 'Could not redeem invite'); return; }
            toast(`Linked account “${accVal.trim()}” to ${res.user?.name}`);
            renderModalBody();
        };
        inviteBox.append(redeemForm);

        const activeInvites = (state.invites || []).slice(0, 8);
        if (activeInvites.length) {
            const invList = document.createElement('div');
            invList.className = 'dash-stack-list';
            activeInvites.forEach(inv => {
                const targetU = state.users.find(u => u.id === inv.userId);
                const r = document.createElement('div');
                r.className = 'dash-member-row';
                r.innerHTML = `<span><span class="invite-code-pill">${esc(inv.code)}</span> · <strong>${esc(targetU?.name || 'Member')}</strong></span><span class="dash-muted">${inv.redeemedBy ? `Linked to ${esc(inv.redeemedBy)}` : 'Pending acceptance'}</span>`;
                invList.append(r);
            });
            inviteBox.append(invList);
        }
        body.append(inviteBox);
    };
    renderModalBody();
    if (!dlg.open) dlg.showModal();
}
function openPagePermissionsDialog(p: Page) {
    const dlg = $('#page-permissions-dialog') as HTMLDialogElement | null;
    const sub = $('#page-perms-subtitle');
    const body = $('#page-perms-body');
    if (!dlg || !body || !p) return;
    const actor = getCurrentActorUser();
    if (!userHasGlobalPerm('managePagePermissions', actor) && getUserHighestRank(actor) !== 0) {
        toast('You do not have Manage Page Permissions access.');
        return;
    }
    const renderBody = () => {
        p.permissions = p.permissions || { inheritParent: true, noOneAccess: false, roleOverrides: {}, userOverrides: {} };
        const cfg = p.permissions;
        const parentPg = p.parentId ? state.pages.find(x => x.id === p.parentId) : null;
        if (sub) sub.textContent = `Configure access for “${p.title || 'Untitled'}” (Discord overrides & Google Drive subfolder inheritance).`;
        body.replaceChildren();

        const inheritCard = document.createElement('div');
        inheritCard.className = 'perms-inherit-card';

        const inhRow = document.createElement('div');
        inhRow.className = 'perms-inherit-row';
        const inhLbl = document.createElement('label');
        const inhCb = document.createElement('input');
        inhCb.id = 'perm-inherit-parent';
        inhCb.type = 'checkbox';
        inhCb.checked = cfg.inheritParent !== false;
        inhCb.disabled = !parentPg;
        inhCb.onchange = () => {
            cfg.inheritParent = inhCb.checked;
            save(true);
            render();
            renderBody();
        };
        inhLbl.append(inhCb, document.createTextNode(parentPg ? `Inherit permissions from parent page (“${parentPg.title || 'Untitled'}”)` : 'Top-level page (no parent folder)'));
        const inhHint = document.createElement('small');
        inhHint.className = 'dash-muted';
        inhHint.textContent = parentPg ? (cfg.inheritParent !== false ? 'Inheriting' : 'Excluded subfolder') : 'Root level';
        inhRow.append(inhLbl, inhHint);

        const lockRow = document.createElement('div');
        lockRow.className = 'perms-lock-row';
        const lockLbl = document.createElement('label');
        const lockCb = document.createElement('input');
        lockCb.id = 'perm-no-one-access';
        lockCb.type = 'checkbox';
        lockCb.checked = !!cfg.noOneAccess;
        lockCb.onchange = () => {
            cfg.noOneAccess = lockCb.checked;
            save(true);
            render();
            renderBody();
        };
        lockLbl.append(lockCb, document.createTextNode('No one has access to this (owner-only lock)'));
        lockRow.append(lockLbl);
        inheritCard.append(inhRow, lockRow);
        body.append(inheritCard);

        const buildTriGroup = (currentVal: TriOverride, onSet: (val: TriOverride) => void, ariaPrefix: string) => {
            const grp = document.createElement('div');
            grp.className = 'tri-toggle-group';
            ([['allow', 'Allow'], ['inherit', '/'], ['deny', 'Deny']] as Array<[TriOverride, string]>).forEach(([val, txt]) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'tri-btn' + (currentVal === val ? ' is-active' : '');
                btn.dataset.val = val;
                btn.textContent = txt;
                btn.setAttribute('aria-label', `${ariaPrefix}: ${val}`);
                btn.onclick = () => { onSet(val); save(true); render(); renderBody(); };
                grp.append(btn);
            });
            return grp;
        };

        const roleTitle = document.createElement('div');
        roleTitle.className = 'perms-section-title';
        roleTitle.textContent = 'Role Overrides (Discord hierarchy)';
        const roleTable = document.createElement('table');
        roleTable.className = 'perms-matrix-table';
        roleTable.innerHTML = '<thead><tr><th>Role</th><th>View</th><th>Edit</th><th>Comment</th></tr></thead>';
        const roleTbody = document.createElement('tbody');
        cfg.roleOverrides = cfg.roleOverrides || {};
        getSortedRoles().forEach(role => {
            const tr = document.createElement('tr');
            const tdR = document.createElement('td');
            tdR.innerHTML = `<span class="role-chip"><span class="role-chip-dot" style="background:${esc(role.color || '#2383e2')}"></span><span>${esc(role.name)}</span></span>`;
            tr.append(tdR);
            (['view', 'edit', 'comment'] as const).forEach(permKey => {
                const td = document.createElement('td');
                const cur: TriOverride = cfg.roleOverrides![role.id]?.[permKey] || 'inherit';
                td.append(buildTriGroup(cur, val => {
                    cfg.roleOverrides![role.id] = cfg.roleOverrides![role.id] || {};
                    if (val === 'inherit') delete cfg.roleOverrides![role.id][permKey];
                    else cfg.roleOverrides![role.id][permKey] = val;
                }, `${role.name} ${permKey}`));
                tr.append(td);
            });
            roleTbody.append(tr);
        });
        roleTable.append(roleTbody);

        const userTitle = document.createElement('div');
        userTitle.className = 'perms-section-title';
        userTitle.textContent = 'Member Overrides (overrides role permissions)';
        const userTable = document.createElement('table');
        userTable.className = 'perms-matrix-table';
        userTable.innerHTML = '<thead><tr><th>Member</th><th>View</th><th>Edit</th><th>Comment</th></tr></thead>';
        const userTbody = document.createElement('tbody');
        cfg.userOverrides = cfg.userOverrides || {};
        (state.users || []).forEach(u => {
            const tr = document.createElement('tr');
            const tdU = document.createElement('td');
            tdU.innerHTML = `<strong>${esc(u.name)}</strong>${u.linkedAccount ? ` <span class="dash-muted">(${esc(u.linkedAccount)})</span>` : ''}`;
            tr.append(tdU);
            (['view', 'edit', 'comment'] as const).forEach(permKey => {
                const td = document.createElement('td');
                const cur: TriOverride = cfg.userOverrides![u.id]?.[permKey] || 'inherit';
                td.append(buildTriGroup(cur, val => {
                    cfg.userOverrides![u.id] = cfg.userOverrides![u.id] || {};
                    if (val === 'inherit') delete cfg.userOverrides![u.id][permKey];
                    else cfg.userOverrides![u.id][permKey] = val;
                }, `${u.name} ${permKey}`));
                tr.append(td);
            });
            userTbody.append(tr);
        });
        userTable.append(userTbody);

        body.append(roleTitle, roleTable, userTitle, userTable);
    };
    renderBody();
    if (!dlg.open) dlg.showModal();
}
function getWeekBucket(dateOrTs: string | number | undefined): { key: string; label: string; isCurrentWeek: boolean; sortTs: number; dateIso: string } {
    const base = typeof dateOrTs === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateOrTs)
        ? new Date(`${dateOrTs.slice(0, 10)}T12:00:00`)
        : new Date(Number(dateOrTs) || Date.now());
    const valid = Number.isNaN(base.getTime()) ? new Date() : base;
    const monday = new Date(valid);
    monday.setHours(12, 0, 0, 0);
    const dayOffset = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - dayOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const fmtIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const fmtShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const nowMonday = new Date();
    nowMonday.setHours(12, 0, 0, 0);
    nowMonday.setDate(nowMonday.getDate() - ((nowMonday.getDay() + 6) % 7));

    const key = fmtIso(monday);
    const isCurrentWeek = key === fmtIso(nowMonday);
    return {
        key,
        label: `${fmtShort(monday)} – ${fmtShort(sunday)}`,
        isCurrentWeek,
        sortTs: monday.getTime(),
        dateIso: fmtIso(valid)
    };
}
type WeeklyTimeSummary = {
    totalMins: number;
    thisWeekMins: number;
    contributors: string[];
    weeks: Array<{
        key: string;
        label: string;
        isCurrentWeek: boolean;
        sortTs: number;
        totalMins: number;
        contributors: string[];
        items: DashboardTimeLog[];
    }>;
};
function summarizeWeeklyTimeLogs(logs: DashboardTimeLog[]): WeeklyTimeSummary {
    const currentWeekKey = getWeekBucket(Date.now()).key;
    const byWeek = new Map<string, { key: string; label: string; isCurrentWeek: boolean; sortTs: number; totalMins: number; contributors: Set<string>; items: DashboardTimeLog[] }>();
    const allContributors = new Set<string>();
    let totalMins = 0;
    let thisWeekMins = 0;

    logs.forEach(item => {
        const mins = Math.max(0, Number(item.minutes) || 0);
        const wk = getWeekBucket(item.date || item.createdAt);
        const person = (item.personName || 'Team member').trim() || 'Team member';
        totalMins += mins;
        if (wk.key === currentWeekKey) thisWeekMins += mins;
        allContributors.add(person);
        if (!byWeek.has(wk.key)) {
            byWeek.set(wk.key, {
                key: wk.key,
                label: wk.label,
                isCurrentWeek: wk.isCurrentWeek,
                sortTs: wk.sortTs,
                totalMins: 0,
                contributors: new Set(),
                items: []
            });
        }
        const bucket = byWeek.get(wk.key)!;
        bucket.totalMins += mins;
        bucket.contributors.add(person);
        bucket.items.push(item);
    });

    const weeks = [...byWeek.values()]
        .sort((a, b) => b.sortTs - a.sortTs)
        .map(w => ({
            ...w,
            contributors: [...w.contributors],
            items: w.items.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        }));

    return { totalMins, thisWeekMins, contributors: [...allContributors], weeks };
}
function openFullTimeTrackingDialog() {
    const dlg = $('#time-tracking-dialog') as HTMLDialogElement | null;
    const body = $('#time-tracking-body');
    if (!dlg || !body) return;
    let selectedWeek = 'all';
    let selectedMember = 'all';
    let searchQuery = '';

    const renderBody = () => {
        ensureWorkspaceDefaults(state);
        const logs = state.dashboardData?.timeLogs || [];
        const users = state.users || [];
        const pages = state.pages.filter(pg => !pg.databaseId);
        const summary = summarizeWeeklyTimeLogs(logs);
        body.replaceChildren();

        // Weekly hours strip across entire team
        const weekStrip = document.createElement('div');
        weekStrip.className = 'tt-week-strip';
        const allCard = document.createElement('button');
        allCard.type = 'button';
        allCard.className = 'tt-week-card' + (selectedWeek === 'all' ? ' is-active' : '');
        allCard.innerHTML = `<small>ALL WEEKS</small><strong>${(summary.totalMins / 60).toFixed(1)}h</strong><span>${logs.length} ${logs.length === 1 ? 'item' : 'items'} · ${summary.contributors.length} ${summary.contributors.length === 1 ? 'contributor' : 'contributors'}</span>`;
        allCard.onclick = () => { selectedWeek = 'all'; renderBody(); };
        weekStrip.append(allCard);

        summary.weeks.slice(0, 5).forEach(wk => {
            const c = document.createElement('button');
            c.type = 'button';
            c.className = 'tt-week-card' + (selectedWeek === wk.key ? ' is-active' : '');
            c.innerHTML = `<small>${wk.isCurrentWeek ? 'THIS WEEK · ' : ''}${esc(wk.label)}</small><strong>${(wk.totalMins / 60).toFixed(1)}h</strong><span>${wk.items.length} ${wk.items.length === 1 ? 'item' : 'items'} · ${wk.contributors.length} ${wk.contributors.length === 1 ? 'contributor' : 'contributors'}</span>`;
            c.onclick = () => { selectedWeek = wk.key; renderBody(); };
            weekStrip.append(c);
        });
        body.append(weekStrip);

        // Log team work entry form
        const logForm = document.createElement('form');
        logForm.id = 'tt-add-form';
        logForm.className = 'tt-log-form';
        const todayIso = getWeekBucket(Date.now()).dateIso;
        const memberOpts = users.map(u => `<option value="${esc(u.id)}">${esc(u.name)}</option>`).join('');
        const pageOpts = `<option value="">No linked page</option>${pages.map(pg => `<option value="${esc(pg.id)}">${esc(pg.title || 'Untitled')}</option>`).join('')}`;
        logForm.innerHTML = `
          <select id="tt-add-person" aria-label="Team contributor">${memberOpts}</select>
          <input id="tt-add-label" placeholder="What was worked on (e.g. Level lighting pass)" autocomplete="off" required>
          <select id="tt-add-page" aria-label="Worked-on document">${pageOpts}</select>
          <input id="tt-add-mins" type="number" min="5" max="1440" value="60" aria-label="Minutes worked" title="Minutes worked">
          <input id="tt-add-date" type="date" value="${todayIso}" aria-label="Work date">
          <button type="submit" class="share-button">＋ Log team hours</button>
        `;
        logForm.onsubmit = ev => {
            ev.preventDefault();
            const personId = (logForm.querySelector('#tt-add-person') as HTMLSelectElement).value;
            const label = (logForm.querySelector('#tt-add-label') as HTMLInputElement).value.trim();
            const linkedPageId = (logForm.querySelector('#tt-add-page') as HTMLSelectElement).value || undefined;
            const mins = Math.max(1, Number((logForm.querySelector('#tt-add-mins') as HTMLInputElement).value) || 60);
            const dateVal = (logForm.querySelector('#tt-add-date') as HTMLInputElement).value || todayIso;
            const userObj = users.find(u => u.id === personId) || users[0];
            if (!label || !userObj) return;
            state.dashboardData = state.dashboardData || { scratchpadText: '', scratchpadUpdatedAt: 0, tasks: [], meetings: [], timeLogs: [] };
            state.dashboardData.timeLogs.unshift({
                id: id(),
                personId: userObj.id,
                personName: userObj.name,
                label,
                role: 'working',
                minutes: mins,
                linkedPageId,
                date: dateVal,
                createdAt: new Date(`${dateVal}T12:00:00`).getTime() || Date.now()
            });
            save(true);
            toast(`Logged ${(mins / 60).toFixed(1)}h for ${userObj.name}`);
            renderBody();
            if (currentAppMode === 'dashboard') renderDashboardView();
        };
        body.append(logForm);

        // Filters toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'member-manager-toolbar';
        const weekSel = document.createElement('select');
        weekSel.id = 'tt-filter-week';
        weekSel.innerHTML = `<option value="all">All weeks</option>${summary.weeks.map(w => `<option value="${esc(w.key)}"${selectedWeek === w.key ? ' selected' : ''}>${w.isCurrentWeek ? 'This week · ' : ''}${esc(w.label)}</option>`).join('')}`;
        weekSel.onchange = () => { selectedWeek = weekSel.value; renderBody(); };

        const memSel = document.createElement('select');
        memSel.id = 'tt-filter-member';
        const memberNames = [...new Set([...users.map(u => u.name), ...summary.contributors])];
        memSel.innerHTML = `<option value="all">All contributors</option>${memberNames.map(n => `<option value="${esc(n)}"${selectedMember === n ? ' selected' : ''}>${esc(n)}</option>`).join('')}`;
        memSel.onchange = () => { selectedMember = memSel.value; renderTable(); };

        const qInp = document.createElement('input');
        qInp.id = 'tt-search';
        qInp.type = 'search';
        qInp.placeholder = 'Search worked-on item, document, contributor…';
        qInp.value = searchQuery;
        qInp.oninput = () => { searchQuery = qInp.value; renderTable(); };
        toolbar.append(weekSel, memSel, qInp);
        body.append(toolbar);

        const tableWrap = document.createElement('div');
        tableWrap.className = 'member-manager-table-wrap';
        body.append(tableWrap);

        const renderTable = () => {
            tableWrap.replaceChildren();
            const q = searchQuery.trim().toLowerCase();
            const filtered = logs.filter(item => {
                const wk = getWeekBucket(item.date || item.createdAt);
                if (selectedWeek !== 'all' && wk.key !== selectedWeek) return false;
                const pName = (item.personName || 'Team member').trim();
                if (selectedMember !== 'all' && pName !== selectedMember) return false;
                if (!q) return true;
                const linkedTitle = item.linkedPageId ? (state.pages.find(pg => pg.id === item.linkedPageId)?.title || '') : '';
                return (item.label || '').toLowerCase().includes(q) || pName.toLowerCase().includes(q) || linkedTitle.toLowerCase().includes(q);
            }).slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

            if (!filtered.length) {
                const empty = document.createElement('p');
                empty.className = 'dash-empty-note';
                empty.style.padding = '16px';
                empty.textContent = 'No time entries matching these filters yet. Use the form above to log team work.';
                tableWrap.append(empty);
                return;
            }
            const tbl = document.createElement('table');
            tbl.className = 'member-manager-table';
            tbl.innerHTML = '<thead><tr><th>Week</th><th>What was worked on</th><th>Contributor</th><th>Hours</th><th>Date</th><th></th></tr></thead>';
            const tbody = document.createElement('tbody');
            filtered.forEach(item => {
                const wk = getWeekBucket(item.date || item.createdAt);
                const tr = document.createElement('tr');
                const linkedPg = item.linkedPageId ? state.pages.find(pg => pg.id === item.linkedPageId) : null;

                const tdWk = document.createElement('td');
                tdWk.innerHTML = `<span class="dash-role-pill">${wk.isCurrentWeek ? 'This week' : esc(wk.label)}</span>`;

                const tdWork = document.createElement('td');
                const workTitle = document.createElement('div');
                workTitle.innerHTML = `<strong>${esc(item.label || 'Workspace work')}</strong>`;
                tdWork.append(workTitle);
                if (linkedPg) {
                    const pgBtn = document.createElement('button');
                    pgBtn.type = 'button';
                    pgBtn.className = 'dash-page-pill';
                    pgBtn.textContent = `📄 ${linkedPg.title || 'Untitled'}`;
                    pgBtn.onclick = () => { dlg.close(); navigateToPage(linkedPg.id); };
                    tdWork.append(pgBtn);
                }

                const tdMem = document.createElement('td');
                tdMem.textContent = item.personName || 'Team member';

                const tdHrs = document.createElement('td');
                tdHrs.innerHTML = `<strong>${(Number(item.minutes || 0) / 60).toFixed(2)}h</strong> <small class="dash-muted">(${Number(item.minutes || 0)}m)</small>`;

                const tdDate = document.createElement('td');
                tdDate.textContent = item.date || wk.dateIso;

                const tdAct = document.createElement('td');
                const rmBtn = document.createElement('button');
                rmBtn.type = 'button';
                rmBtn.className = 'icon-button';
                rmBtn.textContent = '×';
                rmBtn.title = 'Remove entry';
                rmBtn.onclick = () => {
                    state.dashboardData!.timeLogs = (state.dashboardData?.timeLogs || []).filter(x => x.id !== item.id);
                    save(true);
                    renderBody();
                    if (currentAppMode === 'dashboard') renderDashboardView();
                };
                tdAct.append(rmBtn);

                tr.append(tdWk, tdWork, tdMem, tdHrs, tdDate, tdAct);
                tbody.append(tr);
            });
            tbl.append(tbody);
            tableWrap.append(tbl);
        };
        renderTable();
    };
    renderBody();
    if (!dlg.open) dlg.showModal();
}
function renderAdminDashboardView(view: HTMLElement) {
    ensureWorkspaceDefaults(state);
    const actor = getCurrentActorUser();
    const owner = state.users?.[0];
    const isAdmin = isAdminAuthorized(actor);
    const pages = state.pages.filter(pg => !pg.databaseId);
    const assets = readAssets();
    const users = state.users || [];
    const roles = getSortedRoles();
    const logs = state.dashboardData?.timeLogs || [];

    const shell = document.createElement('div');
    shell.className = 'mode-page-shell';

    const hero = document.createElement('div');
    hero.className = 'mode-hero';
    hero.innerHTML = `<div><span class="mode-kicker">ADMINISTRATION</span><h1>Admin Dashboard</h1><p>Team &amp; Member, Role, Time Tracking, Asset &amp; File storage, and Rich Notifications for ${esc(state.workspaceName || 'Architect Studio')}.</p></div>`;

    if (!isAdmin) {
        const locked = document.createElement('div');
        locked.className = 'mode-empty-state admin-locked-card';
        locked.innerHTML = `<strong>Admin permission required</strong><p>${actor?.blocked ? 'Your tied account is blocked in this workspace.' : 'Your tied account does not currently have Admin or delegated management permissions.'}</p>`;
        shell.append(hero, locked);
        view.append(shell);
        return;
    }

    const heroActions = document.createElement('div');
    heroActions.className = 'mode-hero-actions';
    const wsBtn = document.createElement('button');
    wsBtn.type = 'button';
    wsBtn.className = 'share-button dashboard-admin-ws-btn';
    wsBtn.dataset.action = 'settings';
    wsBtn.innerHTML = '⚙ Workspace settings';
    heroActions.append(wsBtn);
    hero.append(heroActions);
    shell.append(hero);

    // Row 1: Compact Team & Member Manager + Time Tracking Overview
    const overviewGrid = document.createElement('div');
    overviewGrid.className = 'admin-dash-grid';

    const memberCard = document.createElement('section');
    memberCard.id = 'admin-member-manager';
    memberCard.className = 'dash-card admin-dash-card';
    const memberHead = document.createElement('div');
    memberHead.className = 'dash-card-head';
    memberHead.innerHTML = '<div><h3>Team &amp; Member manager</h3><p class="dash-muted">Manage workspace members, invites, linked accounts, and roles.</p></div>';
    memberCard.append(memberHead);

    const onlineCount = users.filter(u => !u.blocked && ((actor && u.id === actor.id) || (u as any).online)).length;
    const pendingInvitesCount = (state.invites || []).filter(i => !i.redeemedAt).length;
    const teamStrip = document.createElement('div');
    teamStrip.className = 'admin-stat-strip';
    teamStrip.innerHTML = `<div class="admin-mini-stat"><small>Members</small><strong>${users.length}</strong></div><div class="admin-mini-stat"><small>Online</small><strong>${onlineCount}</strong></div><div class="admin-mini-stat"><small>Invites pending</small><strong>${pendingInvitesCount}</strong></div>`;
    memberCard.append(teamStrip);

    const memberActions = document.createElement('div');
    memberActions.className = 'admin-card-actions';
    const openFullMgrBtn = document.createElement('button');
    openFullMgrBtn.type = 'button';
    openFullMgrBtn.id = 'open-full-member-manager';
    openFullMgrBtn.className = 'secondary-button';
    openFullMgrBtn.textContent = 'Open Member Manager';
    openFullMgrBtn.onclick = () => openFullMemberManagerDialog();
    memberActions.append(openFullMgrBtn);
    memberCard.append(memberActions);

    const timeOverviewCard = document.createElement('section');
    timeOverviewCard.id = 'admin-timetracking-overview';
    timeOverviewCard.className = 'dash-card admin-dash-card';
    const ttHead = document.createElement('div');
    ttHead.className = 'dash-card-head';
    ttHead.innerHTML = '<div><h3>Time tracking</h3><p class="dash-muted">Track weekly hours, contributor logs, and work linked to pages.</p></div>';
    timeOverviewCard.append(ttHead);

    const ttSummary = summarizeWeeklyTimeLogs(logs);
    const ttStats = document.createElement('div');
    ttStats.className = 'admin-stat-strip';
    ttStats.innerHTML = `<div class="admin-mini-stat"><small>This week</small><strong>${(ttSummary.thisWeekMins / 60).toFixed(1)}h</strong></div><div class="admin-mini-stat"><small>All time</small><strong>${(ttSummary.totalMins / 60).toFixed(1)}h</strong></div><div class="admin-mini-stat"><small>Contributors</small><strong>${ttSummary.contributors.length}</strong></div>`;
    timeOverviewCard.append(ttStats);

    const ttActions = document.createElement('div');
    ttActions.className = 'admin-card-actions';
    const openFullTtBtn = document.createElement('button');
    openFullTtBtn.type = 'button';
    openFullTtBtn.id = 'open-full-time-tracking';
    openFullTtBtn.className = 'secondary-button';
    openFullTtBtn.textContent = 'Open Time Tracking';
    openFullTtBtn.onclick = () => openFullTimeTrackingDialog();
    ttActions.append(openFullTtBtn);
    timeOverviewCard.append(ttActions);

    overviewGrid.append(memberCard, timeOverviewCard);

    // Row 2: Role Manager + Asset Manager (no stat bloat)
    const peopleGrid = document.createElement('div');
    peopleGrid.className = 'admin-dash-grid';

    const roleCard = document.createElement('section');
    roleCard.id = 'admin-role-manager';
    roleCard.className = 'dash-card admin-dash-card';
    roleCard.innerHTML = '<div class="dash-card-head"><div><h3>Role manager</h3><p class="dash-muted">Configure Discord-style role hierarchy, colors, and permissions.</p></div></div>';
    const roleActions = document.createElement('div');
    roleActions.className = 'admin-card-actions';
    const openRoleMgrBtn = document.createElement('button');
    openRoleMgrBtn.type = 'button';
    openRoleMgrBtn.id = 'open-role-manager-btn';
    openRoleMgrBtn.className = 'secondary-button';
    openRoleMgrBtn.textContent = 'Open Role Manager';
    openRoleMgrBtn.onclick = () => openRoleManagerDialog();
    roleActions.append(openRoleMgrBtn);
    roleCard.append(roleActions);

    const contentCard = document.createElement('section');
    contentCard.id = 'admin-content-manager';
    contentCard.className = 'dash-card admin-dash-card';
    contentCard.innerHTML = '<div class="dash-card-head"><div><h3>Asset manager</h3><p class="dash-muted">Browse workspace assets or configure local, Drive, and server save locations.</p></div></div>';
    const assetActions = document.createElement('div');
    assetActions.className = 'admin-card-actions';
    const assetsMgrBtn = document.createElement('button');
    assetsMgrBtn.type = 'button';
    assetsMgrBtn.className = 'secondary-button';
    assetsMgrBtn.dataset.action = 'asset-library';
    assetsMgrBtn.textContent = 'Open Asset Library';
    const filesLocBtn = document.createElement('button');
    filesLocBtn.type = 'button';
    filesLocBtn.id = 'open-files-locations-btn';
    filesLocBtn.className = 'secondary-button';
    filesLocBtn.textContent = 'Files & save locations';
    filesLocBtn.onclick = () => openFilesLocationsDialog();
    assetActions.append(assetsMgrBtn, filesLocBtn);
    contentCard.append(assetActions);

    peopleGrid.append(roleCard, contentCard);

    // Row 3: Messages & Scheduled Notifications + Read/Button Analytics
    const bottomGrid = document.createElement('div');
    bottomGrid.className = 'admin-dash-grid';

    flushScheduledNotifications(state, false, false);
    const allNotifs = state.notifications || [];
    const sentNotifs = allNotifs.filter(n => n.status !== 'scheduled');
    const queuedNotifs = allNotifs.filter(n => n.status === 'scheduled').sort((a, b) => (a.scheduledFor || 0) - (b.scheduledFor || 0));
    const confirmedTotal = sentNotifs.reduce((sum, n) => sum + ((n.confirmedBy || []).length), 0);

    const notifCreatorCard = document.createElement('section');
    notifCreatorCard.id = 'admin-notification-creator';
    notifCreatorCard.className = 'dash-card admin-dash-card';
    notifCreatorCard.innerHTML = '<div class="dash-card-head"><div><h3>Messages &amp; Notifications</h3><p class="dash-muted">Compose rich Markdown announcements, schedule sends, add interactive buttons, and inspect read analytics.</p></div></div>';

    const notifStats = document.createElement('div');
    notifStats.className = 'admin-stat-strip';
    notifStats.innerHTML = `<div class="admin-mini-stat"><small>Sent</small><strong>${sentNotifs.length}</strong></div><div class="admin-mini-stat"><small>Queued</small><strong>${queuedNotifs.length}</strong></div><div class="admin-mini-stat"><small>Read confirmations</small><strong>${confirmedTotal}</strong></div>`;
    notifCreatorCard.append(notifStats);

    if (queuedNotifs.length) {
        const nextQ = queuedNotifs[0];
        const preview = document.createElement('div');
        preview.className = 'admin-queued-preview';
        const tzShow = nextQ.scheduledTz || getEffectiveUserTimeZone();
        const whenTxt = formatDiscordTimestamp(Math.floor((nextQ.scheduledFor || Date.now()) / 1000), 'f', tzShow);
        preview.innerHTML = `<strong>Next queued:</strong> ${esc(nextQ.title || 'Scheduled message')} · <span>${esc(whenTxt)}</span>`;
        notifCreatorCard.append(preview);
    }

    const notifActions = document.createElement('div');
    notifActions.className = 'admin-card-actions';
    const newMsgBtn = document.createElement('button');
    newMsgBtn.type = 'button';
    newMsgBtn.id = 'open-notification-creator-btn';
    newMsgBtn.className = 'share-button';
    newMsgBtn.textContent = 'New message';
    newMsgBtn.onclick = () => openNotificationCreatorDialog();
    const analyticsBtn = document.createElement('button');
    analyticsBtn.type = 'button';
    analyticsBtn.id = 'open-notification-analytics-btn';
    analyticsBtn.className = 'secondary-button';
    analyticsBtn.textContent = 'Sent & Queued Analytics';
    analyticsBtn.onclick = () => openNotificationAnalyticsDialog();
    notifActions.append(newMsgBtn, analyticsBtn);
    notifCreatorCard.append(notifActions);

    bottomGrid.append(notifCreatorCard);
    shell.append(overviewGrid, peopleGrid, bottomGrid);
    view.append(shell);
}

function openRoleManagerDialog() {
    ensureWorkspaceDefaults(state);
    const dlg = $('#role-manager-dialog') as HTMLDialogElement | null;
    const body = $('#role-manager-body') as HTMLElement | null;
    if (!dlg || !body) return;
    const renderBody = () => {
        body.replaceChildren();
        const actor = getCurrentActorUser();
        if (!isAdminAuthorized(actor)) {
            body.innerHTML = '<div class="mode-empty-state"><strong>Admin permission required</strong><p>Only admins or delegated role managers can modify workspace roles.</p></div>';
            return;
        }
        const roles = getSortedRoles();
        const actorRank = getUserHighestRank(actor);
        const canManageRoles = userHasGlobalPerm('manageRoles', actor);

        const roleList = document.createElement('div');
        roleList.className = 'dash-stack-list';
        roles.forEach((role, roleIdx) => {
            const card = document.createElement('div');
            card.className = 'admin-role-card';
            const editable = canManageRole(actor, role);
            const head = document.createElement('div');
            head.className = 'admin-role-head';

            const titleGrp = document.createElement('div');
            titleGrp.className = 'admin-role-title-group';
            const rankPill = document.createElement('span');
            rankPill.className = 'role-rank-pill';
            rankPill.textContent = `#${roleIdx + 1}`;
            const colorInp = document.createElement('input');
            colorInp.type = 'color';
            colorInp.className = 'role-color-input';
            colorInp.value = role.color || '#2383e2';
            colorInp.ariaLabel = `Color for ${role.name}`;
            colorInp.disabled = !editable && role.id !== 'role-admin';
            colorInp.onchange = () => { role.color = colorInp.value; save(true); renderDashboardView(); renderBody(); };
            const nameStrong = document.createElement('strong');
            nameStrong.textContent = role.name;
            titleGrp.append(rankPill, colorInp, nameStrong);
            if (role.builtIn) {
                const builtInPill = document.createElement('span');
                builtInPill.className = 'dash-role-pill';
                builtInPill.textContent = 'Built-in';
                titleGrp.append(builtInPill);
            }

            const headRight = document.createElement('div');
            headRight.className = 'mode-hero-actions';
            const rankBtns = document.createElement('div');
            rankBtns.className = 'role-rank-btns';
            const upBtn = document.createElement('button');
            upBtn.type = 'button';
            upBtn.textContent = '↑';
            upBtn.title = `Move ${role.name} higher`;
            upBtn.disabled = !editable || roleIdx <= 1 || (roles[roleIdx - 1] && !canManageRole(actor, roles[roleIdx - 1]));
            upBtn.onclick = () => {
                const prev = roles[roleIdx - 1];
                if (!prev || prev.id === 'role-admin') return;
                const tmp = role.rank;
                role.rank = prev.rank;
                prev.rank = tmp;
                save(true);
                renderDashboardView();
                renderBody();
            };
            const downBtn = document.createElement('button');
            downBtn.type = 'button';
            downBtn.textContent = '↓';
            downBtn.title = `Move ${role.name} lower`;
            downBtn.disabled = !editable || roleIdx >= roles.length - 1;
            downBtn.onclick = () => {
                const next = roles[roleIdx + 1];
                if (!next) return;
                const tmp = role.rank;
                role.rank = next.rank;
                next.rank = tmp;
                save(true);
                renderDashboardView();
                renderBody();
            };
            rankBtns.append(upBtn, downBtn);
            headRight.append(rankBtns);

            if (!role.builtIn && editable) {
                const delRole = document.createElement('button');
                delRole.type = 'button';
                delRole.className = 'icon-button';
                delRole.textContent = '×';
                delRole.title = `Delete ${role.name}`;
                delRole.onclick = () => {
                    state.roles = (state.roles || []).filter(r => r.id !== role.id);
                    (state.users || []).forEach(u => {
                        u.roleIds = (u.roleIds || []).filter(rid => rid !== role.id);
                        if (!u.roleIds.length && u.roleId === role.id) u.roleIds = ['role-editor'];
                        u.roleId = u.roleIds[0];
                    });
                    (state.pages || []).forEach(pg => {
                        if (pg.permissions?.roleOverrides && role.id in pg.permissions.roleOverrides) {
                            delete pg.permissions.roleOverrides[role.id];
                        }
                    });
                    save(true);
                    renderDashboardView();
                    renderBody();
                };
                headRight.append(delRole);
            }
            head.append(titleGrp, headRight);

            const perms = document.createElement('div');
            perms.className = 'admin-perm-row';
            ROLE_PERMISSION_DEFS.forEach(({ key, label }) => {
                const lbl = document.createElement('label');
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = !!role.permissions?.[key];
                cb.disabled = role.id === 'role-admin' || !editable;
                cb.onchange = () => {
                    const liveRole = (state.roles || []).find(r => r.id === role.id) || role;
                    liveRole.permissions[key] = cb.checked;
                    save(true);
                    render();
                };
                lbl.append(cb, document.createTextNode(label));
                perms.append(lbl);
            });
            card.append(head, perms);
            roleList.append(card);
        });

        const addRoleForm = document.createElement('form');
        addRoleForm.className = 'dash-inline-form';
        addRoleForm.style.marginTop = '12px';
        addRoleForm.innerHTML = `<input id="admin-add-role-name" placeholder="New role name (e.g. Artist)" autocomplete="off" required><button type="submit" class="share-button"${canManageRoles ? '' : ' disabled'}>＋ Create role</button>`;
        addRoleForm.onsubmit = e => {
            e.preventDefault();
            if (!canManageRoles) return;
            const inp = addRoleForm.querySelector('#admin-add-role-name') as HTMLInputElement;
            const rName = inp.value.trim();
            if (!rName) return;
            state.roles = state.roles || [];
            const maxRank = state.roles.reduce((m, r) => Math.max(m, Number(r.rank) || 0), 0);
            state.roles.push({
                id: `role-${id().slice(0, 6)}`,
                name: rName,
                rank: Math.max(actorRank + 1, maxRank + 1),
                color: '#9065b0',
                permissions: { manageMembers: false, manageRoles: false, manageAssets: false, createPages: true, editPages: true, writePages: true, comment: true, managePagePermissions: false, sendNotifications: false }
            });
            save(true);
            toast(`Created role “${rName}”`);
            renderDashboardView();
            renderBody();
        };
        body.append(roleList, addRoleForm);
    };
    renderBody();
    if (!dlg.open) dlg.showModal();
}

function openFilesLocationsDialog() {
    ensureWorkspaceDefaults(state);
    const dlg = $('#files-locations-dialog') as HTMLDialogElement | null;
    const body = $('#files-locations-body') as HTMLElement | null;
    if (!dlg || !body) return;
    body.replaceChildren();
    const prefs = typeof ArchitectToolbar !== 'undefined' ? ArchitectToolbar.ensureUserPreferences(state) : (state.userPreferences = state.userPreferences || {});
    prefs.files = prefs.files || { localSavePath: '', driveSaveLocation: '', serverUrl: '' };

    const filesBox = document.createElement('div');
    filesBox.id = 'admin-files-settings';
    filesBox.className = 'admin-files-box';
    filesBox.innerHTML = `<small class="dash-muted" id="admin-files-summary"></small>`;
    filesBox.insertAdjacentHTML('beforeend', `
      <label class="admin-files-row">Primary save target
        <select id="admin-files-storage-mode">
          <option value="local">Local storage (device / folder)</option>
          <option value="drive">Drive (Google Drive / synced folder)</option>
          <option value="server">Server (team storage endpoint)</option>
        </select>
      </label>
      <label class="admin-files-row">Local save location
        <span class="admin-files-input-row"><input id="admin-files-local-path" placeholder="App default ArchitectData / local folder" autocomplete="off"><button type="button" class="secondary-button" id="admin-files-browse-local">Browse…</button></span>
      </label>
      <label class="admin-files-row">Drive save location
        <span class="admin-files-input-row"><input id="admin-files-drive-path" placeholder="https://drive… or synced Drive folder path" autocomplete="off"><button type="button" class="secondary-button" id="admin-files-browse-drive">Browse…</button></span>
      </label>
      <label class="admin-files-row">Server save location
        <input id="admin-files-server-url" placeholder="https://architect.yourteam.com" autocomplete="off">
      </label>
    `);
    const modeSel = filesBox.querySelector('#admin-files-storage-mode') as HTMLSelectElement;
    const localInp = filesBox.querySelector('#admin-files-local-path') as HTMLInputElement;
    const driveInp = filesBox.querySelector('#admin-files-drive-path') as HTMLInputElement;
    const srvInp = filesBox.querySelector('#admin-files-server-url') as HTMLInputElement;
    const summaryEl = filesBox.querySelector('#admin-files-summary') as HTMLElement;
    const syncFilesBoxUi = () => {
        const mode = state.assetStorageMode || 'local';
        modeSel.value = mode;
        localInp.value = prefs.files?.localSavePath || state.assetPreviewPolicy?.cacheFolderPath || '';
        driveInp.value = prefs.files?.driveSaveLocation || state.syncConfig?.folderPath || state.syncConfig?.sourceUrl || '';
        srvInp.value = prefs.files?.serverUrl || state.syncConfig?.serverUrl || '';
        summaryEl.textContent = mode === 'drive'
            ? `Primary target: Drive (${driveInp.value || 'Cloud / Drive folder'})`
            : mode === 'server'
                ? `Primary target: Server (${srvInp.value || 'Team server endpoint'})`
                : `Primary target: Local (${localInp.value || 'App ArchitectData / IndexedDB'})`;
    };
    const commitAdminFiles = () => {
        const nextMode = modeSel.value as AssetStorageMode;
        const loc = localInp.value.trim();
        const drv = driveInp.value.trim();
        const srv = srvInp.value.trim();
        prefs.files = { localSavePath: loc, driveSaveLocation: drv, serverUrl: srv };
        state.assetStorageMode = nextMode;
        if (state.assetPreviewPolicy) state.assetPreviewPolicy.cacheFolderPath = loc;
        if (state.syncConfig) {
            if (/^https?:\/\//i.test(drv)) state.syncConfig.sourceUrl = drv;
            else state.syncConfig.folderPath = drv;
            if (!srv || /^https?:\/\//i.test(srv)) state.syncConfig.serverUrl = srv || undefined;
        }
        save(true);
        syncFilesBoxUi();
        toast('File storage settings saved');
    };
    [modeSel, localInp, driveInp, srvInp].forEach(el => el.addEventListener('change', commitAdminFiles));
    const pickDirInto = async (targetInp: HTMLInputElement) => {
        try {
            let picked = '';
            const desktopHost = ArchitectBackend.host?.();
            if (desktopHost?.chooseSyncFolder) {
                const res = await desktopHost.chooseSyncFolder();
                if (!res?.canceled && res?.path) picked = res.path;
            } else if (typeof (window as any).showDirectoryPicker === 'function') {
                const dir = await (window as any).showDirectoryPicker();
                if (dir?.name) picked = dir.name;
            }
            if (picked) { targetInp.value = picked; commitAdminFiles(); }
        } catch {}
    };
    filesBox.querySelector('#admin-files-browse-local')?.addEventListener('click', () => pickDirInto(localInp));
    filesBox.querySelector('#admin-files-browse-drive')?.addEventListener('click', () => pickDirInto(driveInp));
    syncFilesBoxUi();
    body.append(filesBox);
    if (!dlg.open) dlg.showModal();
}

function openNotificationCreatorDialog() {
    ensureWorkspaceDefaults(state);
    const dlg = $('#notification-creator-dialog') as HTMLDialogElement | null;
    const body = $('#notification-creator-body') as HTMLElement | null;
    if (!dlg || !body) return;
    body.replaceChildren();

    const actor = getCurrentActorUser();
    const canSendNotif = userHasGlobalPerm('sendNotifications', actor);
    const users = state.users || [];
    const pages = state.pages.filter(pg => !pg.databaseId);
    const userOpts = `<option value="all">@everyone (All workspace members)</option>${users.map(u => `<option value="${esc(u.name)}">@${esc(u.name)}</option>`).join('')}`;
    const pageLinkOpts = `<option value="">No primary linked page</option>${pages.map(pg => `<option value="${esc(pg.id)}">${esc(pg.title || 'Untitled')}</option>`).join('')}`;
    const embedPageOpts = `<option value="">＋ Embed page</option>${pages.map(pg => `<option value="${esc(pg.id)}">${esc(pg.title || 'Untitled')}</option>`).join('')}`;
    const tzCurrent = getEffectiveUserTimeZone();
    const tzList = [...new Set([tzCurrent, ...TIMEZONE_PRESETS])];
    const tzOpts = tzList.map(z => `<option value="${esc(z)}"${z === tzCurrent ? ' selected' : ''}>${esc(z.replace(/_/g, ' '))}</option>`).join('');
    const plus10Min = new Date(Date.now() + 10 * 60 * 1000);
    const nowDateIso = new Intl.DateTimeFormat('en-CA', { timeZone: tzCurrent, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const nowTimeHm = new Intl.DateTimeFormat('en-GB', { timeZone: tzCurrent, hour12: false, hour: '2-digit', minute: '2-digit' }).format(new Date()).slice(0, 5);
    const schedDateIso = new Intl.DateTimeFormat('en-CA', { timeZone: tzCurrent, year: 'numeric', month: '2-digit', day: '2-digit' }).format(plus10Min);
    const schedTimeHms = new Intl.DateTimeFormat('en-GB', { timeZone: tzCurrent, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(plus10Min).slice(0, 8);

    const notifForm = document.createElement('form');
    notifForm.className = 'admin-notif-form';
    notifForm.innerHTML = `
      <select id="admin-notif-target" aria-label="Target recipient">${userOpts}</select>
      <input id="admin-notif-title" placeholder="Notification title (e.g. Build review ready)" autocomplete="off" required>
      <div class="notif-compose-toolbar">
        <button type="button" data-md-fmt="bold" title="Bold"><strong>B</strong></button>
        <button type="button" data-md-fmt="italic" title="Italic"><em>I</em></button>
        <button type="button" data-md-fmt="h2" title="Heading 2">H2</button>
        <button type="button" data-md-fmt="bullet" title="Bullet list">• List</button>
        <button type="button" data-md-fmt="todo" title="To-do item">☑ Todo</button>
        <label class="notif-tool-btn">🖼 Upload image<input type="file" id="admin-notif-img-upload" accept="image/*" hidden></label>
        <button type="button" id="admin-notif-pick-asset" title="Insert image from Asset Library">🗂 Assets</button>
        <button type="button" id="admin-notif-pick-time" title="Insert dynamic timestamp for every user's local timezone">🕒 Time</button>
        <select id="admin-notif-embed-page" aria-label="Embed workspace page" style="width:auto;padding:2px 6px;height:26px;font-size:11.5px">${embedPageOpts}</select>
        <div class="notif-compose-tabs">
          <button type="button" class="is-active" data-compose-tab="write">Write</button>
          <button type="button" data-compose-tab="preview">Preview</button>
        </div>
      </div>
      <div id="admin-notif-time-builder" class="notif-time-builder" hidden>
        <div class="notif-time-grid">
          <label>Date<input type="date" id="admin-ts-date" value="${esc(nowDateIso)}"></label>
          <label>Time<input type="time" id="admin-ts-time" value="${esc(nowTimeHm)}"></label>
          <label>Author time zone<select id="admin-ts-tz">${tzOpts}</select></label>
          <label>Display format
            <select id="admin-ts-style">
              <option value="f">Short date &amp; time (&lt;t:...:f&gt;)</option>
              <option value="F">Full date &amp; time (&lt;t:...:F&gt;)</option>
              <option value="t">Short time (&lt;t:...:t&gt;)</option>
              <option value="T">Long time (&lt;t:...:T&gt;)</option>
              <option value="d">Short date (&lt;t:...:d&gt;)</option>
              <option value="D">Long date (&lt;t:...:D&gt;)</option>
              <option value="R">Relative (&lt;t:...:R&gt;)</option>
            </select>
          </label>
        </div>
        <div class="notif-time-foot">
          <small class="dash-muted" id="admin-ts-live-preview"></small>
          <div class="mode-hero-actions">
            <button type="button" class="secondary-button" id="admin-ts-cancel">Cancel</button>
            <button type="button" class="share-button" id="admin-ts-insert">Insert timestamp</button>
          </div>
        </div>
      </div>
      <textarea id="admin-notif-body" placeholder="Supports **Markdown**, # Headings, - Lists, ![image](url), [[Page|id]], and <t:unix:f> timestamps…"></textarea>
      <div id="admin-notif-preview" class="notif-preview-box" hidden></div>
      <div class="notif-btn-builder">
        <strong>Interactive user buttons</strong>
        <div class="notif-btn-toggle-row">
          <label><input type="checkbox" id="admin-notif-btn-confirm" checked> Confirm read <small class="dash-muted">(marks read &amp; confirms)</small></label>
          <label class="notif-track-label"><input type="checkbox" id="admin-notif-btn-confirm-track" checked> Track who</label>
        </div>
        <div class="notif-btn-toggle-row">
          <label><input type="checkbox" id="admin-notif-btn-later" checked> Read later <small class="dash-muted">(keeps unread)</small></label>
          <label class="notif-track-label"><input type="checkbox" id="admin-notif-btn-later-track" checked> Track who</label>
        </div>
        <div id="admin-notif-custom-buttons" class="notif-custom-btn-list"></div>
        <button type="button" class="secondary-button" id="admin-notif-add-btn">＋ Add custom button</button>
      </div>
      <select id="admin-notif-page" aria-label="Link workspace page">${pageLinkOpts}</select>
      <select id="admin-notif-display" aria-label="Notification delivery mode">
        <option value="inbox">Go straight to Notifications (Dashboards → Notifications)</option>
        <option value="popup">Open immediately as rich pop-up</option>
        <option value="both">Send to Notifications + open pop-up</option>
      </select>
      <div class="notif-schedule-row">
        <label style="display:grid;gap:4px;font-size:12px">When should it be sent?
          <select id="admin-notif-when" aria-label="When to send">
            <option value="now">Send immediately</option>
            <option value="later">Schedule for later (queue)</option>
          </select>
        </label>
        <div id="admin-notif-schedule-box" class="notif-time-grid" hidden>
          <label>Send date<input type="date" id="admin-notif-sched-date" value="${esc(schedDateIso)}"></label>
          <label>Send time<input type="time" id="admin-notif-sched-time" step="1" value="${esc(schedTimeHms)}"></label>
          <label>Time zone<select id="admin-notif-sched-tz">${tzOpts}</select></label>
        </div>
      </div>
      <button type="submit" id="admin-notif-submit-btn" class="share-button"${canSendNotif ? '' : ' disabled'}>Send notification</button>
    `;

    const bodyTa = notifForm.querySelector('#admin-notif-body') as HTMLTextAreaElement;
    const previewBox = notifForm.querySelector('#admin-notif-preview') as HTMLElement;
    const insertMdSnippet = (snippet: string, wrapSelected?: [string, string]) => {
        const start = bodyTa.selectionStart ?? bodyTa.value.length;
        const end = bodyTa.selectionEnd ?? start;
        const selected = bodyTa.value.slice(start, end);
        const inserted = wrapSelected ? `${wrapSelected[0]}${selected || snippet}${wrapSelected[1]}` : snippet;
        bodyTa.setRangeText(inserted, start, end, 'end');
        bodyTa.focus();
    };
    notifForm.querySelectorAll('[data-md-fmt]').forEach(btn => {
        btn.addEventListener('click', () => {
            const kind = (btn as HTMLElement).dataset.mdFmt;
            if (kind === 'bold') insertMdSnippet('bold text', ['**', '**']);
            else if (kind === 'italic') insertMdSnippet('italic text', ['*', '*']);
            else if (kind === 'h2') insertMdSnippet('\n## Heading\n');
            else if (kind === 'bullet') insertMdSnippet('\n- List item');
            else if (kind === 'todo') insertMdSnippet('\n- [ ] Action item');
        });
    });
    notifForm.querySelector('#admin-notif-img-upload')?.addEventListener('change', async ev => {
        const inputEl = ev.target as HTMLInputElement;
        const file = inputEl.files?.[0];
        if (!file) return;
        try {
            const rec = await ArchitectBackend.ingestLocalFile(file, {
                creator: actor?.name || 'Admin',
                storageMode: state.assetStorageMode || 'local',
                previewPolicy: state.assetPreviewPolicy
            });
            insertMdSnippet(`\n![${rec.name}](asset:${rec.id})\n`);
            toast(`Inserted image “${rec.name}”`);
        } catch (err: any) {
            toast(err?.message || 'Could not upload notification image');
        }
        inputEl.value = '';
    });
    notifForm.querySelector('#admin-notif-pick-asset')?.addEventListener('click', () => {
        openAssetLibrary(null, {
            onSelectAsset: asset => {
                insertMdSnippet(`\n![${asset.name}](asset:${asset.id})\n`);
            }
        });
    });
    const tsBuilder = notifForm.querySelector('#admin-notif-time-builder') as HTMLElement;
    const tsDate = notifForm.querySelector('#admin-ts-date') as HTMLInputElement;
    const tsTime = notifForm.querySelector('#admin-ts-time') as HTMLInputElement;
    const tsTz = notifForm.querySelector('#admin-ts-tz') as HTMLSelectElement;
    const tsStyle = notifForm.querySelector('#admin-ts-style') as HTMLSelectElement;
    const tsPreview = notifForm.querySelector('#admin-ts-live-preview') as HTMLElement;
    const refreshTsPreview = () => {
        const unix = wallClockToUnixSeconds(tsDate.value, tsTime.value, tsTz.value);
        const st = tsStyle.value || 'f';
        const formattedLocal = formatDiscordTimestamp(unix, st, getEffectiveUserTimeZone());
        tsPreview.textContent = `Token <t:${unix}:${st}> → Displays in recipient local time (currently ${formattedLocal})`;
    };
    [tsDate, tsTime, tsTz, tsStyle].forEach(el => el?.addEventListener('change', refreshTsPreview));
    [tsDate, tsTime].forEach(el => el?.addEventListener('input', refreshTsPreview));
    notifForm.querySelector('#admin-notif-pick-time')?.addEventListener('click', () => {
        tsBuilder.hidden = !tsBuilder.hidden;
        if (!tsBuilder.hidden) refreshTsPreview();
    });
    notifForm.querySelector('#admin-ts-cancel')?.addEventListener('click', () => { tsBuilder.hidden = true; });
    notifForm.querySelector('#admin-ts-insert')?.addEventListener('click', () => {
        const unix = wallClockToUnixSeconds(tsDate.value, tsTime.value, tsTz.value);
        const st = tsStyle.value || 'f';
        insertMdSnippet(`<t:${unix}:${st}> `);
        tsBuilder.hidden = true;
    });
    const embedSel = notifForm.querySelector('#admin-notif-embed-page') as HTMLSelectElement;
    embedSel?.addEventListener('change', () => {
        const pid = embedSel.value;
        if (!pid) return;
        const pg = state.pages.find(x => x.id === pid);
        insertMdSnippet(`[[${pg?.title || 'Untitled'}|${pid}]] `);
        embedSel.value = '';
    });
    notifForm.querySelectorAll('[data-compose-tab]').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
            const mode = (tabBtn as HTMLElement).dataset.composeTab;
            notifForm.querySelectorAll('[data-compose-tab]').forEach(b => b.classList.toggle('is-active', b === tabBtn));
            const showPreview = mode === 'preview';
            bodyTa.hidden = showPreview;
            previewBox.hidden = !showPreview;
            if (showPreview) {
                previewBox.replaceChildren();
                previewBox.append(renderRichMarkdownFragment(bodyTa.value));
            }
        });
    });

    const customBtnsList = notifForm.querySelector('#admin-notif-custom-buttons') as HTMLElement;
    const addCustomBtnRow = (initialLabel = '', trackUsers = true) => {
        const row = document.createElement('div');
        row.className = 'notif-custom-btn-item';
        const lblInp = document.createElement('input');
        lblInp.type = 'text';
        lblInp.className = 'notif-custom-btn-label';
        lblInp.placeholder = 'Button label (e.g. Approve, Need review)';
        lblInp.value = initialLabel;
        const trackLbl = document.createElement('label');
        trackLbl.className = 'notif-track-label';
        const trackCb = document.createElement('input');
        trackCb.type = 'checkbox';
        trackCb.className = 'notif-custom-btn-track';
        trackCb.checked = trackUsers;
        trackLbl.append(trackCb, document.createTextNode('Track who clicked'));
        const rmBtn = document.createElement('button');
        rmBtn.type = 'button';
        rmBtn.className = 'icon-button';
        rmBtn.textContent = '×';
        rmBtn.title = 'Remove custom button';
        rmBtn.onclick = () => row.remove();
        row.append(lblInp, trackLbl, rmBtn);
        customBtnsList.append(row);
        if (!initialLabel) lblInp.focus();
    };
    notifForm.querySelector('#admin-notif-add-btn')?.addEventListener('click', () => addCustomBtnRow());

    const whenSel = notifForm.querySelector('#admin-notif-when') as HTMLSelectElement;
    const schedBox = notifForm.querySelector('#admin-notif-schedule-box') as HTMLElement;
    const submitBtn = notifForm.querySelector('#admin-notif-submit-btn') as HTMLButtonElement;
    whenSel?.addEventListener('change', () => {
        const isLater = whenSel.value === 'later';
        schedBox.hidden = !isLater;
        submitBtn.textContent = isLater ? 'Schedule notification' : 'Send notification';
    });

    notifForm.onsubmit = e => {
        e.preventDefault();
        if (!canSendNotif) return;
        const targetVal = (notifForm.querySelector('#admin-notif-target') as HTMLSelectElement).value;
        const title = (notifForm.querySelector('#admin-notif-title') as HTMLInputElement).value.trim();
        const rawMarkdown = bodyTa.value.trim();
        const linkedPgId = (notifForm.querySelector('#admin-notif-page') as HTMLSelectElement).value || undefined;
        const displayMode = ((notifForm.querySelector('#admin-notif-display') as HTMLSelectElement).value || 'inbox') as 'inbox' | 'popup' | 'both';
        if (!title) return;

        const buttons: NotificationButtonDef[] = [];
        if ((notifForm.querySelector('#admin-notif-btn-confirm') as HTMLInputElement)?.checked) {
            buttons.push({
                id: 'btn-confirm-read',
                label: 'Confirm read',
                action: 'confirm_read',
                trackUsers: (notifForm.querySelector('#admin-notif-btn-confirm-track') as HTMLInputElement)?.checked !== false
            });
        }
        if ((notifForm.querySelector('#admin-notif-btn-later') as HTMLInputElement)?.checked) {
            buttons.push({
                id: 'btn-read-later',
                label: 'Read later',
                action: 'read_later',
                trackUsers: (notifForm.querySelector('#admin-notif-btn-later-track') as HTMLInputElement)?.checked !== false
            });
        }
        customBtnsList.querySelectorAll('.notif-custom-btn-item').forEach((row, idx) => {
            const label = (row.querySelector('.notif-custom-btn-label') as HTMLInputElement)?.value.trim();
            if (!label) return;
            const trackUsers = !!(row.querySelector('.notif-custom-btn-track') as HTMLInputElement)?.checked;
            buttons.push({ id: `btn-custom-${id().slice(0, 6)}-${idx}`, label, action: 'custom', trackUsers });
        });

        const prefix = targetVal === 'all' ? '@everyone' : `@${targetVal}`;
        const plainSummary = summarizeNotificationMarkdown(rawMarkdown);
        const bodySummary = plainSummary ? `${prefix} — ${plainSummary}` : prefix;

        if (whenSel.value === 'later') {
            const schedDate = (notifForm.querySelector('#admin-notif-sched-date') as HTMLInputElement).value;
            const schedTime = (notifForm.querySelector('#admin-notif-sched-time') as HTMLInputElement).value;
            const schedTz = (notifForm.querySelector('#admin-notif-sched-tz') as HTMLSelectElement).value;
            const schedMs = wallClockToUnixSeconds(schedDate, schedTime, schedTz) * 1000;
            if (!schedDate || !Number.isFinite(schedMs)) {
                toast('Pick a valid scheduled date and time');
                return;
            }
            if (schedMs <= Date.now()) {
                toast('Pick a future date and time to queue, or choose Send immediately');
                return;
            }
            pushInboxNotification({
                kind: 'system',
                title,
                body: bodySummary,
                markdown: rawMarkdown || undefined,
                displayMode,
                pageId: linkedPgId,
                actor: actor?.name || 'Admin',
                status: 'scheduled',
                scheduledFor: schedMs,
                scheduledTz: schedTz,
                buttons: buttons.length ? buttons : undefined,
                read: false
            });
            save(true);
            dlg.close();
            toast('Notification scheduled');
            renderDashboardView();
            return;
        }

        const requiresConfirm = buttons.some(b => b.action === 'confirm_read');
        const created = pushInboxNotification({
            kind: 'system',
            title,
            body: bodySummary,
            markdown: rawMarkdown || undefined,
            displayMode,
            pageId: linkedPgId,
            actor: actor?.name || 'Admin',
            status: 'sent',
            sentAt: Date.now(),
            buttons: buttons.length ? buttons : undefined,
            read: displayMode === 'popup' && !requiresConfirm
        });
        save(true);
        dlg.close();
        toast(displayMode === 'popup' ? 'Pop-up notification shown' : 'Notification sent');
        if (displayMode === 'popup' || displayMode === 'both') {
            openNotificationViewer(created, !requiresConfirm && displayMode !== 'both');
        }
        renderDashboardView();
    };

    body.append(notifForm);
    if (!dlg.open) dlg.showModal();
}

function renderNotificationAnalyticsBody() {
    const body = $('#notification-analytics-body') as HTMLElement | null;
    if (!body) return;
    flushScheduledNotifications(state, false, false);
    body.replaceChildren();

    const all = state.notifications || [];
    const queued = all.filter(n => n.status === 'scheduled').sort((a, b) => (a.scheduledFor || 0) - (b.scheduledFor || 0));
    const sent = all.filter(n => n.status !== 'scheduled').sort((a, b) => (b.sentAt || b.createdAt || 0) - (a.sentAt || a.createdAt || 0));

    const qSec = document.createElement('section');
    qSec.className = 'notif-analytics-section';
    qSec.innerHTML = `<h4>Queued messages (${queued.length})</h4>`;
    if (!queued.length) {
        const emptyQ = document.createElement('p');
        emptyQ.className = 'dash-muted';
        emptyQ.textContent = 'No messages currently scheduled in the queue.';
        qSec.append(emptyQ);
    } else {
        queued.forEach(q => {
            const card = document.createElement('article');
            card.className = 'notif-analytics-card';
            card.dataset.notifAnalyticsId = q.id;
            const tzShow = q.scheduledTz || getEffectiveUserTimeZone();
            const schedLabel = formatDiscordTimestamp(Math.floor((q.scheduledFor || Date.now()) / 1000), 'F', tzShow);
            const relLabel = formatDiscordTimestamp(Math.floor((q.scheduledFor || Date.now()) / 1000), 'R', tzShow);
            card.innerHTML = `<div class="notif-analytics-head"><div><strong>${esc(q.title || 'Scheduled message')}</strong><small class="dash-muted">${esc(q.body || '')}</small></div><span class="dash-role-pill">Queued · ${esc(relLabel)}</span></div><div class="dash-muted" style="font-size:12px">Scheduled for: ${esc(schedLabel)} (${esc(tzShow)})</div>`;
            const acts = document.createElement('div');
            acts.className = 'mode-hero-actions';
            const sendNowBtn = document.createElement('button');
            sendNowBtn.type = 'button';
            sendNowBtn.className = 'share-button';
            sendNowBtn.textContent = 'Send now';
            sendNowBtn.onclick = () => {
                q.status = 'sent';
                q.sentAt = Date.now();
                q.createdAt = q.sentAt;
                save(true);
                syncInboxBadges();
                toast(`Sent “${q.title || 'message'}” now`);
                if (q.displayMode === 'popup' || q.displayMode === 'both') {
                    openNotificationViewer(q, !notificationRequiresConfirmRead(q) && q.displayMode !== 'both');
                }
                renderNotificationAnalyticsBody();
                renderDashboardView();
            };
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'secondary-button';
            cancelBtn.textContent = 'Cancel schedule';
            cancelBtn.onclick = () => {
                state.notifications = (state.notifications || []).filter(item => item.id !== q.id);
                save(true);
                syncInboxBadges();
                toast('Cancelled scheduled notification');
                renderNotificationAnalyticsBody();
                renderDashboardView();
            };
            acts.append(sendNowBtn, cancelBtn);
            card.append(acts);
            qSec.append(card);
        });
    }

    const sSec = document.createElement('section');
    sSec.className = 'notif-analytics-section';
    sSec.innerHTML = `<h4>Sent messages &amp; analytics (${sent.length})</h4>`;
    if (!sent.length) {
        const emptyS = document.createElement('p');
        emptyS.className = 'dash-muted';
        emptyS.textContent = 'No sent notifications yet.';
        sSec.append(emptyS);
    } else {
        sent.forEach(s => {
            const card = document.createElement('article');
            card.className = 'notif-analytics-card';
            card.dataset.notifAnalyticsId = s.id;
            const readReceipts = s.readBy || [];
            const readCount = readReceipts.length || (s.read ? 1 : 0);
            const confirmed = s.confirmedBy || [];
            const sentRel = formatInboxRelative(s.sentAt || s.createdAt);

            card.innerHTML = `<div class="notif-analytics-head"><div><strong>${esc(s.title || 'Notification')}</strong><small class="dash-muted">From ${esc(s.actor || 'Admin')} · ${esc(sentRel)}</small></div><span class="dash-role-pill">Sent</span></div>`;

            const metrics = document.createElement('div');
            metrics.className = 'notif-analytics-metrics';
            const readPill = document.createElement('span');
            readPill.className = 'notif-analytics-pill';
            readPill.textContent = `Read by ${readCount}${readReceipts.length ? ` (${readReceipts.map(r => r.userName).join(', ')})` : ''}`;
            metrics.append(readPill);
            if (notificationRequiresConfirmRead(s) || confirmed.length) {
                const confPill = document.createElement('span');
                confPill.className = 'notif-analytics-pill';
                confPill.textContent = `Confirmed read: ${confirmed.length}${confirmed.length ? ` (${confirmed.map(r => r.userName).join(', ')})` : ''}`;
                metrics.append(confPill);
            }
            card.append(metrics);

            if (s.buttons?.length) {
                const btnBreakdown = document.createElement('div');
                btnBreakdown.className = 'dash-stack-list';
                s.buttons.forEach(btn => {
                    const clicks = (s.buttonClicks || []).filter(c => c.buttonId === btn.id);
                    const row = document.createElement('div');
                    row.className = 'notif-analytics-btn-row';
                    row.dataset.analyticsBtnId = btn.id;
                    const left = document.createElement('strong');
                    left.textContent = `${btn.label} · ${clicks.length} click${clicks.length === 1 ? '' : 's'}`;
                    const who = document.createElement('span');
                    who.className = 'notif-analytics-who';
                    if (btn.trackUsers !== false) {
                        who.textContent = clicks.length ? `Clicked by: ${clicks.map(c => c.userName).join(', ')}` : 'No clicks yet';
                    } else {
                        who.textContent = 'Tracking disabled (count only)';
                    }
                    row.append(left, who);
                    btnBreakdown.append(row);
                });
                card.append(btnBreakdown);
            }
            sSec.append(card);
        });
    }

    body.append(qSec, sSec);
}

function openNotificationAnalyticsDialog() {
    ensureWorkspaceDefaults(state);
    const dlg = $('#notification-analytics-dialog') as HTMLDialogElement | null;
    if (!dlg) return;
    renderNotificationAnalyticsBody();
    if (!dlg.open) dlg.showModal();
}

function renderDashboardNotificationsView(view: HTMLElement) {
    state.notifications = Array.isArray(state.notifications) ? state.notifications : [];
    const all = getVisibleInboxNotifications().slice().sort((a, b) => (b.sentAt || b.createdAt || 0) - (a.sentAt || a.createdAt || 0));
    const unreadList = all.filter(n => !n.read);
    const filtered = inboxFilter === 'unread' ? unreadList
        : inboxFilter === 'comments' ? all.filter(n => ['comment', 'reply', 'resolve', 'reopen'].includes(n.kind))
        : inboxFilter === 'activity' ? all.filter(n => !['comment', 'reply', 'resolve', 'reopen'].includes(n.kind))
        : all;

    const shell = document.createElement('div');
    shell.className = 'mode-page-shell';

    const hero = document.createElement('div');
    hero.className = 'mode-hero';
    hero.innerHTML = `<div><span class="mode-kicker">NOTIFICATIONS</span><h1>Notifications</h1><p>${unreadList.length} unread notification${unreadList.length === 1 ? '' : 's'} across pages, comments, and boards.</p></div>`;
    const actions = document.createElement('div');
    actions.className = 'mode-hero-actions';
    const markAllBtn = document.createElement('button');
    markAllBtn.type = 'button'; markAllBtn.className = 'secondary-button'; markAllBtn.textContent = '✓ Mark all read';
    markAllBtn.disabled = unreadList.length === 0;
    markAllBtn.onclick = () => {
        getVisibleInboxNotifications().forEach(n => { recordNotificationRead(n, false); });
        save();
        syncInboxBadges();
        renderDashboardView();
    };
    const clearReadBtn = document.createElement('button');
    clearReadBtn.type = 'button'; clearReadBtn.className = 'secondary-button'; clearReadBtn.textContent = 'Clear read';
    clearReadBtn.disabled = all.every(n => !n.read);
    clearReadBtn.onclick = () => {
        state.notifications = state.notifications.filter(n => n.status === 'scheduled' || !n.read);
        save();
        syncInboxBadges();
        renderDashboardView();
    };
    actions.append(markAllBtn, clearReadBtn);
    hero.append(actions);

    const tabs = document.createElement('div');
    tabs.className = 'inbox-filter-tabs';
    [
        ['unread', `Unread (${unreadList.length})`],
        ['all', `All (${all.length})`],
        ['comments', 'Comments'],
        ['activity', 'Activity']
    ].forEach(([key, label]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'inbox-tab-btn' + (inboxFilter === key ? ' active' : '');
        b.textContent = label;
        b.onclick = () => { inboxFilter = key as any; renderDashboardView(); };
        tabs.append(b);
    });

    const list = document.createElement('div');
    list.className = 'inbox-list';
    if (!filtered.length) {
        const empty = document.createElement('div');
        empty.className = 'mode-empty-state';
        empty.textContent = inboxFilter === 'unread' ? 'You are all caught up — no unread notifications.' : 'No notifications matching this filter yet.';
        list.append(empty);
    } else {
        filtered.forEach(n => {
            const targetPage = n.pageId ? state.pages.find(pg => pg.id === n.pageId) : null;
            const row = document.createElement('article');
            row.className = 'inbox-item' + (n.read ? '' : ' is-unread');
            row.dataset.notificationId = n.id;

            const ico = document.createElement('span');
            ico.className = 'inbox-item-ico';
            ico.innerHTML = targetPage ? pageIconMarkup(targetPage.icon) : (n.kind === 'comment' || n.kind === 'reply' ? '💬' : '🔔');

            const isRich = hasRichNotificationContent(n);
            const hasImages = /!\[[^\]]*\]\([^)]+\)/.test(n.markdown || n.body || '');
            const hasPageEmbeds = /\[\[[^\]]+\]\]/.test(n.markdown || n.body || '');
            const copy = document.createElement('div');
            copy.className = 'inbox-item-copy';
            copy.innerHTML = `<div class="inbox-item-top"><strong>${esc(n.title)}${isRich ? '<span class="inbox-open-pill">Open rich view</span>' : ''}${hasImages ? '<span class="inbox-open-pill">🖼 Image</span>' : ''}${hasPageEmbeds ? '<span class="inbox-open-pill">📄 Page link</span>' : ''}</strong><span>${esc(formatInboxRelative(n.sentAt || n.createdAt))}</span></div><p>${esc(n.body)}</p><small>${esc(n.actor || 'Workspace')}${targetPage ? ` · ${esc(targetPage.title || 'Untitled')}` : ''}</small>`;
            const rowBtns = renderNotificationActionButtons(n, true);
            if (rowBtns) copy.append(rowBtns);

            const itemActs = document.createElement('div');
            itemActs.className = 'inbox-item-actions';
            if (isRich) {
                const openBtn = document.createElement('button');
                openBtn.type = 'button';
                openBtn.className = 'secondary-button';
                openBtn.textContent = 'Open';
                openBtn.onclick = ev => {
                    ev.stopPropagation();
                    openNotificationViewer(n, !notificationRequiresConfirmRead(n));
                };
                itemActs.append(openBtn);
            }
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'secondary-button';
            toggleBtn.textContent = n.read ? 'Mark unread' : 'Mark read';
            toggleBtn.onclick = ev => {
                ev.stopPropagation();
                if (n.read) n.read = false;
                else recordNotificationRead(n, false);
                save();
                syncInboxBadges();
                renderDashboardView();
            };
            itemActs.append(toggleBtn);

            row.onclick = () => {
                const requiresConfirm = notificationRequiresConfirmRead(n);
                if (!requiresConfirm) {
                    recordNotificationRead(n, false);
                    save();
                    syncInboxBadges();
                }
                if (isRich) {
                    openNotificationViewer(n, !requiresConfirm);
                    return;
                }
                if (targetPage) {
                    navigateToPage(targetPage.id);
                    if (n.commentThreadId) {
                        requestAnimationFrame(() => {
                            const th = (targetPage.comments || []).find(t => t.id === n.commentThreadId);
                            if (th) focusCommentTarget(targetPage, th);
                        });
                    } else if (n.blockId) {
                        requestAnimationFrame(() => focusLinkedBlock(n.blockId));
                    }
                } else {
                    renderDashboardView();
                }
            };

            row.append(ico, copy, itemActs);
            list.append(row);
        });
    }

    shell.append(hero, tabs, list);
    view.append(shell);
}
let activeChatChannelId = 'chat-general';
function ensureDirectChatChannel(targetAccountOrName: string): ChatChannel {
    state.chats = Array.isArray(state.chats) ? state.chats : [];
    const targetUser = (state.users || []).find(u => u.id === targetAccountOrName || u.linkedAccount === targetAccountOrName || u.name === targetAccountOrName);
    const labelName = targetUser?.name || targetAccountOrName || 'Teammate';
    const acctKey = targetUser?.linkedAccount || targetUser?.name || targetAccountOrName;
    const me = getActorDisplayName();
    let dm = state.chats.find(c => c.kind === 'dm' && (c.memberAccounts.includes(acctKey) || c.memberAccounts.includes(labelName) || c.name === labelName));
    if (!dm) {
        dm = {
            id: `dm-${id()}`,
            kind: 'dm',
            name: labelName,
            topic: `Direct message with ${labelName}`,
            icon: '👤',
            memberAccounts: [...new Set([me, acctKey].filter(Boolean))],
            messages: [],
            updatedAt: Date.now(),
            unreadCount: 0
        };
        state.chats.push(dm);
    }
    return dm;
}
function pushWorkspaceChatMessage(opts: { channelId?: string; targetAccount?: string; senderName?: string; text: string; fromAutomation?: string; silent?: boolean }): ChatMessage | null {
    const cleanText = String(opts.text || '').trim();
    if (!cleanText) return null;
    ensureWorkspaceDefaults(state);
    state.chats = Array.isArray(state.chats) ? state.chats : [];
    let ch: ChatChannel | undefined;
    if (opts.targetAccount && !opts.channelId) {
        ch = ensureDirectChatChannel(opts.targetAccount);
    } else if (opts.channelId) {
        ch = state.chats.find(c => c.id === opts.channelId || c.name.toLowerCase() === opts.channelId!.toLowerCase());
    }
    if (!ch) ch = state.chats[0];
    if (!ch) return null;
    const sender = opts.senderName || getActorDisplayName();
    const msg: ChatMessage = {
        id: id(),
        senderName: sender,
        senderAccount: getLoggedInAccountName(),
        text: cleanText,
        createdAt: Date.now(),
        ...(opts.fromAutomation ? { fromAutomation: opts.fromAutomation } : {})
    };
    ch.messages.push(msg);
    if (ch.messages.length > 200) ch.messages = ch.messages.slice(-200);
    ch.updatedAt = msg.createdAt;
    const viewingThisChat = currentAppMode === 'dashboard' && currentDashboardSubMode === 'chat' && activeChatChannelId === ch.id;
    if (!viewingThisChat && opts.fromAutomation) {
        ch.unreadCount = (ch.unreadCount || 0) + 1;
    }
    syncInboxBadges();
    if (!opts.silent && opts.fromAutomation) {
        pushInboxNotification({
            kind: 'system',
            title: `💬 ${ch.kind === 'group' ? '#' + ch.name : ch.name}`,
            body: `${opts.fromAutomation}: ${cleanText.slice(0, 140)}`,
            actor: sender,
            targetAccount: opts.targetAccount
        });
    }
    save();
    if (viewingThisChat) renderDashboardView();
    return msg;
}
function renderDashboardChatView(view: HTMLElement) {
    ensureWorkspaceDefaults(state);
    state.chats = state.chats || [];
    if (!state.chats.some(c => c.id === activeChatChannelId)) {
        activeChatChannelId = state.chats[0]?.id || 'chat-general';
    }
    const activeCh = state.chats.find(c => c.id === activeChatChannelId) || state.chats[0];
    if (activeCh && activeCh.unreadCount) {
        activeCh.unreadCount = 0;
        syncInboxBadges();
        save();
    }

    const shell = document.createElement('div');
    shell.className = 'mode-page-shell chat-shell';

    const layout = document.createElement('div');
    layout.className = 'ws-chat-layout';

    const sidebar = document.createElement('aside');
    sidebar.className = 'ws-chat-sidebar';

    const chHead = document.createElement('div');
    chHead.className = 'ws-chat-sec-head';
    chHead.innerHTML = '<span>THEMED CHANNELS</span>';
    const newChBtn = document.createElement('button');
    newChBtn.type = 'button'; newChBtn.className = 'secondary-button ws-chat-mini-btn'; newChBtn.textContent = '＋ Channel';
    chHead.append(newChBtn);
    sidebar.append(chHead);

    const newChForm = document.createElement('form');
    newChForm.className = 'ws-chat-new-form';
    newChForm.hidden = true;
    newChForm.innerHTML = `<input type="text" class="ws-chat-new-name" placeholder="e.g. launch-team" maxlength="40" required><input type="text" class="ws-chat-new-topic" placeholder="Channel topic (optional)"><div class="ws-chat-new-acts"><button type="button" class="secondary-button" data-cancel-ch>Cancel</button><button type="submit" class="share-button">Create</button></div>`;
    newChBtn.onclick = () => {
        newChForm.hidden = !newChForm.hidden;
        if (!newChForm.hidden) (newChForm.querySelector('.ws-chat-new-name') as HTMLInputElement)?.focus();
    };
    newChForm.querySelector('[data-cancel-ch]')?.addEventListener('click', () => { newChForm.hidden = true; });
    newChForm.onsubmit = ev => {
        ev.preventDefault();
        const rawName = ((newChForm.querySelector('.ws-chat-new-name') as HTMLInputElement)?.value || '').trim().replace(/^#+/, '').toLowerCase().replace(/\s+/g, '-');
        const topic = ((newChForm.querySelector('.ws-chat-new-topic') as HTMLInputElement)?.value || '').trim();
        if (!rawName) return;
        const created: ChatChannel = {
            id: `ch-${id()}`,
            kind: 'group',
            name: rawName,
            topic: topic || `Themed channel #${rawName}`,
            icon: '#',
            memberAccounts: (state.users || []).map(u => u.linkedAccount || u.name).filter(Boolean),
            messages: [],
            updatedAt: Date.now(),
            unreadCount: 0
        };
        state.chats!.push(created);
        activeChatChannelId = created.id;
        save(true);
        renderDashboardView();
    };
    sidebar.append(newChForm);

    const groupsList = document.createElement('div');
    groupsList.className = 'ws-chat-list';
    state.chats.filter(c => c.kind === 'group').forEach(ch => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ws-chat-item' + (ch.id === activeChatChannelId ? ' is-active' : '');
        btn.dataset.chatId = ch.id;
        btn.innerHTML = `<span class="ws-chat-item-ico">${esc(ch.icon || '#')}</span><span class="ws-chat-item-name">${esc(ch.name)}</span>${ch.unreadCount ? `<span class="ws-chat-unread-pill">${ch.unreadCount}</span>` : ''}`;
        btn.onclick = () => { activeChatChannelId = ch.id; renderDashboardView(); };
        groupsList.append(btn);
    });
    sidebar.append(groupsList);

    const dmHead = document.createElement('div');
    dmHead.className = 'ws-chat-sec-head';
    dmHead.innerHTML = '<span>DIRECT MESSAGES</span>';
    sidebar.append(dmHead);

    const dmList = document.createElement('div');
    dmList.className = 'ws-chat-list';
    (state.users || []).filter(u => !u.blocked).forEach(u => {
        const acctKey = u.linkedAccount || u.name;
        const existingDm = state.chats!.find(c => c.kind === 'dm' && (c.memberAccounts.includes(acctKey) || c.name === u.name));
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ws-chat-item' + (existingDm?.id === activeChatChannelId ? ' is-active' : '');
        const initials = commentUserInitials(u.name);
        btn.innerHTML = `<span class="ws-chat-avatar">${esc(initials)}</span><span class="ws-chat-item-name">${esc(u.name)}</span>${existingDm?.unreadCount ? `<span class="ws-chat-unread-pill">${existingDm.unreadCount}</span>` : ''}`;
        btn.onclick = () => {
            const dm = ensureDirectChatChannel(acctKey);
            activeChatChannelId = dm.id;
            save();
            renderDashboardView();
        };
        dmList.append(btn);
    });
    sidebar.append(dmList);

    const main = document.createElement('section');
    main.className = 'ws-chat-main';
    if (!activeCh) {
        main.innerHTML = '<div class="mode-empty-state">Select a channel or teammate to start chatting.</div>';
    } else {
        const mHead = document.createElement('header');
        mHead.className = 'ws-chat-main-head';
        mHead.innerHTML = `<div><h3>${esc(activeCh.kind === 'group' ? `#${activeCh.name}` : activeCh.name)}</h3><p>${esc(activeCh.topic || (activeCh.kind === 'group' ? 'Group channel' : 'Direct message'))}</p></div><span class="ws-chat-count-pill">${activeCh.messages.length} message${activeCh.messages.length === 1 ? '' : 's'}</span>`;

        const stream = document.createElement('div');
        stream.className = 'ws-chat-stream';
        if (!activeCh.messages.length) {
            const emp = document.createElement('div');
            emp.className = 'ws-chat-empty';
            emp.textContent = `No messages in ${activeCh.kind === 'group' ? '#' + activeCh.name : activeCh.name} yet. Send the first message below!`;
            stream.append(emp);
        } else {
            activeCh.messages.forEach(m => {
                const item = document.createElement('article');
                item.className = 'ws-chat-msg';
                item.innerHTML = `<span class="ws-chat-msg-avatar">${esc(commentUserInitials(m.senderName))}</span><div class="ws-chat-msg-body"><div class="ws-chat-msg-meta"><strong>${esc(m.senderName)}</strong>${m.fromAutomation ? `<span class="ws-chat-auto-tag">⚡ ${esc(m.fromAutomation)}</span>` : ''}<span>${esc(formatInboxRelative(m.createdAt))}</span></div><div class="ws-chat-msg-text">${esc(m.text)}</div></div>`;
                stream.append(item);
            });
        }

        const composer = document.createElement('form');
        composer.className = 'ws-chat-composer';
        composer.innerHTML = `<textarea rows="2" class="ws-chat-input" placeholder="Message ${esc(activeCh.kind === 'group' ? '#' + activeCh.name : activeCh.name)}… (Enter to send)"></textarea><button type="submit" class="share-button">Send</button>`;
        const ta = composer.querySelector('.ws-chat-input') as HTMLTextAreaElement;
        const doSend = () => {
            const val = (ta.value || '').trim();
            if (!val) return;
            ta.value = '';
            pushWorkspaceChatMessage({ channelId: activeCh.id, text: val, silent: true });
            requestAnimationFrame(() => (view.querySelector('.ws-chat-input') as HTMLTextAreaElement | null)?.focus());
        };
        ta.addEventListener('keydown', ev => {
            if (ev.key === 'Enter' && !ev.shiftKey) {
                ev.preventDefault();
                doSend();
            }
        });
        composer.onsubmit = ev => { ev.preventDefault(); doSend(); };

        main.append(mHead, stream, composer);
        requestAnimationFrame(() => { stream.scrollTop = stream.scrollHeight; });
    }

    layout.append(sidebar, main);
    shell.append(layout);
    view.append(shell);
}

// === PAGE VERSION HISTORY ===
function cloneBlocksForVersion(blocks: Block[]): Block[] {
    try { return JSON.parse(JSON.stringify(blocks || [])); } catch { return []; }
}
function blocksContentSignature(p: Page): string {
    try {
        return JSON.stringify({ t: p.title, i: p.icon, b: p.blocks });
    } catch { return String(Date.now()); }
}
function recordPageVersionSnapshot(page: Page, note?: string, force = false): PageVersionSnapshot | null {
    if (!page) return null;
    page.history = Array.isArray(page.history) ? page.history : [];
    const sig = blocksContentSignature(page);
    const latest = page.history[0];
    if (!force && latest) {
        const latestSig = JSON.stringify({ t: latest.title, i: latest.icon, b: latest.blocks });
        if (latestSig === sig) return null;
        if (Date.now() - latest.savedAt < 45000) return null;
    }
    const snap: PageVersionSnapshot = {
        id: id(),
        savedAt: Date.now(),
        authorName: getActorDisplayName(),
        title: page.title || 'Untitled',
        icon: page.icon || '📄',
        wordCount: countWords(page),
        blocks: cloneBlocksForVersion(page.blocks),
        ...(note ? { note } : {})
    };
    page.history.unshift(snap);
    if (page.history.length > 30) page.history = page.history.slice(0, 30);
    return snap;
}
function maybeAutoSnapshotPage(page: Page) {
    if (!page || page.databaseId) return;
    page.history = Array.isArray(page.history) ? page.history : [];
    if (!page.history.length) {
        recordPageVersionSnapshot(page, 'Initial snapshot', true);
        return;
    }
    recordPageVersionSnapshot(page, undefined, false);
}
function flattenBlockSummaries(blocks: Block[], out: { id: string; type: string; text: string }[] = []): { id: string; type: string; text: string }[] {
    (blocks || []).forEach(b => {
        out.push({ id: b.id, type: b.type, text: (b.text || '').trim() });
        if (Array.isArray(b.children) && b.children.length) flattenBlockSummaries(b.children, out);
    });
    return out;
}
function openVersionHistoryModal(p: Page) {
    p.history = Array.isArray(p.history) ? p.history : [];
    if (!p.history.length) {
        recordPageVersionSnapshot(p, 'Initial snapshot', true);
        save();
    }
    let activeSnapId = p.history[0]?.id || '';
    const overlay = document.createElement('div');
    overlay.className = 'notion-workflow-overlay';
    const modal = document.createElement('div');
    modal.className = 'notion-workflow-modal version-history-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    const close = () => { overlay.remove(); document.removeEventListener('keydown', onEsc, true); };
    const onEsc = (ev: KeyboardEvent) => { if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); close(); } };
    document.addEventListener('keydown', onEsc, true);
    overlay.addEventListener('click', ev => { if (ev.target === overlay) close(); });

    const draw = () => {
        modal.replaceChildren();
        const snaps = p.history || [];
        const sel = snaps.find(s => s.id === activeSnapId) || snaps[0];

        const head = document.createElement('div');
        head.className = 'vh-head';
        head.innerHTML = `<div><h3>🕒 Version history — ${esc(p.title || 'Untitled')}</h3><small>${snaps.length} saved snapshot${snaps.length === 1 ? '' : 's'}</small></div>`;
        const headBtns = document.createElement('div');
        headBtns.className = 'vh-head-acts';
        const noteInp = document.createElement('input');
        noteInp.type = 'text'; noteInp.className = 'vh-note-input'; noteInp.placeholder = 'Checkpoint label (optional)…';
        const saveSnapBtn = document.createElement('button');
        saveSnapBtn.type = 'button'; saveSnapBtn.className = 'share-button'; saveSnapBtn.textContent = 'Save snapshot';
        saveSnapBtn.onclick = () => {
            const created = recordPageVersionSnapshot(p, noteInp.value.trim() || 'Manual checkpoint', true);
            if (created) activeSnapId = created.id;
            save(true);
            toast('Version snapshot saved');
            draw();
        };
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button'; closeBtn.className = 'notion-wf-close-btn'; closeBtn.textContent = '×';
        closeBtn.onclick = close;
        headBtns.append(noteInp, saveSnapBtn, closeBtn);
        head.append(headBtns);

        const body = document.createElement('div');
        body.className = 'vh-body';

        const list = document.createElement('div');
        list.className = 'vh-snap-list';
        snaps.forEach((s, i) => {
            const row = document.createElement('button');
            row.type = 'button';
            row.className = 'vh-snap-row' + (s.id === sel?.id ? ' is-selected' : '');
            const dateStr = new Date(s.savedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            row.innerHTML = `<div class="vh-snap-top"><strong>${esc(s.note || (i === 0 ? 'Latest saved' : `Revision #${snaps.length - i}`))}</strong><span>${esc(dateStr)}</span></div><small>${esc(s.authorName)} · ${s.wordCount} words · ${s.blocks.length} blocks</small>`;
            row.onclick = () => { activeSnapId = s.id; draw(); };
            list.append(row);
        });

        const detail = document.createElement('div');
        detail.className = 'vh-detail';
        if (!sel) {
            detail.innerHTML = '<div class="mode-empty-state">No snapshots yet.</div>';
        } else {
            const curFlat = flattenBlockSummaries(p.blocks);
            const snapFlat = flattenBlockSummaries(sel.blocks);
            const curMap = new Map(curFlat.map(x => [x.id, x]));
            const snapMap = new Map(snapFlat.map(x => [x.id, x]));

            const diffRows: { tag: string; cls: string; text: string }[] = [];
            snapFlat.forEach(sb => {
                const cb = curMap.get(sb.id);
                if (!cb) diffRows.push({ tag: 'Restores', cls: 'is-added', text: `[${sb.type}] ${sb.text || '(empty)'}` });
                else if (cb.text !== sb.text || cb.type !== sb.type) diffRows.push({ tag: 'Changed', cls: 'is-changed', text: `"${sb.text || '(empty)'}" ← current: "${cb.text || '(empty)'}"` });
            });
            curFlat.forEach(cb => {
                if (!snapMap.has(cb.id)) diffRows.push({ tag: 'Removed on restore', cls: 'is-removed', text: `[${cb.type}] ${cb.text || '(empty)'}` });
            });

            const dHead = document.createElement('div');
            dHead.className = 'vh-detail-head';
            dHead.innerHTML = `<div><strong>${esc(sel.icon)} ${esc(sel.title)}</strong><div class="vh-detail-sub">Saved by ${esc(sel.authorName)} · ${new Date(sel.savedAt).toLocaleString()}</div></div>`;
            if (!effectivePageReadOnly(p)) {
                const restoreBtn = document.createElement('button');
                restoreBtn.type = 'button'; restoreBtn.className = 'share-button'; restoreBtn.textContent = 'Restore this version';
                restoreBtn.onclick = () => {
                    recordPageVersionSnapshot(p, 'Before restore', true);
                    p.title = sel.title;
                    p.icon = sel.icon;
                    p.blocks = cloneBlocksForVersion(sel.blocks);
                    p.updatedAt = Date.now();
                    save(true);
                    render();
                    toast(`Restored version from ${new Date(sel.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
                    close();
                };
                dHead.append(restoreBtn);
            }

            const diffBox = document.createElement('div');
            diffBox.className = 'vh-diff-section';
            diffBox.innerHTML = `<div class="vh-sec-label">Comparison against current page (${diffRows.length} difference${diffRows.length === 1 ? '' : 's'})</div>`;
            if (!diffRows.length) {
                diffBox.innerHTML += '<div class="vh-diff-same">✓ Matches current page content</div>';
            } else {
                const dList = document.createElement('div');
                dList.className = 'vh-diff-list';
                diffRows.forEach(d => {
                    const line = document.createElement('div');
                    line.className = `vh-diff-row ${d.cls}`;
                    line.innerHTML = `<span class="vh-diff-tag">${esc(d.tag)}</span><span>${esc(d.text)}</span>`;
                    dList.append(line);
                });
                diffBox.append(dList);
            }

            const prevBox = document.createElement('div');
            prevBox.className = 'vh-preview-section';
            prevBox.innerHTML = `<div class="vh-sec-label">Block preview (${snapFlat.length} blocks)</div>`;
            snapFlat.slice(0, 40).forEach(b => {
                const row = document.createElement('div');
                row.className = 'vh-preview-block';
                row.innerHTML = `<span class="vh-blk-type">${esc(b.type)}</span><span>${esc(b.text || '(empty block)')}</span>`;
                prevBox.append(row);
            });
            detail.append(dHead, diffBox, prevBox);
        }

        body.append(list, detail);
        modal.append(head, body);
    };

    draw();
    overlay.append(modal);
    document.body.append(overlay);
}

// === PUBLISHED PAGE & PAGE ANALYTICS (Published pages only) ===
let lastRecordedPublishedVisitKey = '';
let lastRecordedPublishedVisitAt = 0;
function recordPublishedPageView(p: Page | undefined | null, force = false) {
    if (!p || !p.published) return;
    const viewer = getActorDisplayName();
    const now = Date.now();
    const dedupeKey = `${p.id}:${viewer}`;
    if (!force && lastRecordedPublishedVisitKey === dedupeKey && now - lastRecordedPublishedVisitAt < 400) return;
    lastRecordedPublishedVisitKey = dedupeKey;
    lastRecordedPublishedVisitAt = now;
    p.analytics = p.analytics || { totalViews: 0, uniqueViewers: [], viewLog: [] };
    p.analytics.totalViews = (p.analytics.totalViews || 0) + 1;
    p.analytics.uniqueViewers = Array.isArray(p.analytics.uniqueViewers) ? p.analytics.uniqueViewers : [];
    if (!p.analytics.uniqueViewers.includes(viewer)) p.analytics.uniqueViewers.push(viewer);
    p.analytics.viewLog = Array.isArray(p.analytics.viewLog) ? p.analytics.viewLog : [];
    p.analytics.viewLog.unshift({ userName: viewer, viewedAt: now });
    if (p.analytics.viewLog.length > 50) p.analytics.viewLog = p.analytics.viewLog.slice(0, 50);
}
function togglePagePublish(p: Page) {
    if (!p || effectivePageReadOnly(p)) return;
    p.published = !p.published;
    if (p.published) {
        p.publishedAt = p.publishedAt || Date.now();
        recordPublishedPageView(p, true);
        toast(`Published “${p.title || 'Untitled'}” — analytics enabled`);
    } else {
        toast(`Unpublished “${p.title || 'Untitled'}”`);
    }
    save(true);
    updatePageOptions();
    render();
}
function openPageAnalyticsModal(p: Page) {
    if (!p || !p.published) {
        toast('Page analytics are only available on published pages');
        return;
    }
    const ana = p.analytics || { totalViews: 0, uniqueViewers: [], viewLog: [] };
    const overlay = document.createElement('div');
    overlay.className = 'notion-workflow-overlay';
    const modal = document.createElement('div');
    modal.className = 'notion-workflow-modal page-analytics-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    const close = () => { overlay.remove(); document.removeEventListener('keydown', onEsc, true); };
    const onEsc = (ev: KeyboardEvent) => { if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); close(); } };
    document.addEventListener('keydown', onEsc, true);
    overlay.addEventListener('click', ev => { if (ev.target === overlay) close(); });

    const head = document.createElement('div');
    head.className = 'vh-head';
    head.innerHTML = `<div><h3>📊 Page analytics — ${esc(p.title || 'Untitled')}</h3><small>Published ${p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'recently'}</small></div>`;
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button'; closeBtn.className = 'notion-wf-close-btn'; closeBtn.textContent = '×';
    closeBtn.onclick = close;
    head.append(closeBtn);

    const kpis = document.createElement('div');
    kpis.className = 'pa-kpis';
    kpis.innerHTML = `
      <div class="pa-kpi"><small>Total views</small><strong>${ana.totalViews || 0}</strong></div>
      <div class="pa-kpi"><small>Unique viewers</small><strong>${(ana.uniqueViewers || []).length}</strong></div>
      <div class="pa-kpi"><small>Status</small><strong>🌐 Live</strong></div>
    `;

    const days: { key: string; label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString([], { weekday: 'short' });
        const count = (ana.viewLog || []).filter(v => new Date(v.viewedAt).toISOString().slice(0, 10) === key).length;
        days.push({ key, label, count });
    }
    const maxCount = Math.max(1, ...days.map(d => d.count));
    const chart = document.createElement('div');
    chart.className = 'pa-chart-card';
    chart.innerHTML = '<div class="vh-sec-label">Views (last 7 days)</div>';
    const bars = document.createElement('div');
    bars.className = 'pa-bars';
    days.forEach(d => {
        const pct = Math.round((d.count / maxCount) * 100);
        const col = document.createElement('div');
        col.className = 'pa-bar-col';
        col.innerHTML = `<div class="pa-bar-track"><div class="pa-bar-fill" style="height:${d.count ? Math.max(10, pct) : 2}%"></div></div><span class="pa-bar-val">${d.count}</span><span class="pa-bar-lbl">${esc(d.label)}</span>`;
        bars.append(col);
    });
    chart.append(bars);

    const logBox = document.createElement('div');
    logBox.className = 'pa-log-card';
    logBox.innerHTML = '<div class="vh-sec-label">Recent views</div>';
    const logList = document.createElement('div');
    logList.className = 'pa-log-list';
    if (!(ana.viewLog || []).length) {
        logList.innerHTML = '<div class="vh-diff-same">No views recorded yet.</div>';
    } else {
        ana.viewLog.slice(0, 20).forEach(entry => {
            const row = document.createElement('div');
            row.className = 'pa-log-row';
            row.innerHTML = `<span class="ws-chat-avatar">${esc(commentUserInitials(entry.userName))}</span><strong>${esc(entry.userName)}</strong><span>${esc(formatInboxRelative(entry.viewedAt))}</span>`;
            logList.append(row);
        });
    }
    logBox.append(logList);

    modal.append(head, kpis, chart, logBox);
    overlay.append(modal);
    document.body.append(overlay);
}
function openSharePublishPopover(p: Page, anchorEl: HTMLElement | null) {
    closeRichPopover();
    if (!anchorEl) { copyPageLink(p); return; }
    const pop = openFloatingPopover(anchorEl, 'share-publish-popover');
    const draw = () => {
        pop.replaceChildren();
        const actor = getCurrentActorUser();
        const canManagePerms = !actor?.blocked && (userHasGlobalPerm('managePagePermissions', actor) || getUserHighestRank(actor) === 0);
        const ro = effectivePageReadOnly(p);

        const head = document.createElement('div');
        head.className = 'rich-popover-head';
        head.innerHTML = `<strong>Share &amp; Publish</strong><button type="button" class="icon-button" data-sp-close aria-label="Close">×</button>`;
        head.querySelector('[data-sp-close]')?.addEventListener('click', closeRichPopover);

        const pubCard = document.createElement('div');
        pubCard.className = 'sp-publish-row';
        pubCard.innerHTML = `<div><strong>${p.published ? '🌐 Published' : 'Publish to web / workspace'}</strong><small>${p.published ? 'Live link active & page analytics enabled' : 'Publish page to enable Page Analytics'}</small></div>`;
        const pubBtn = document.createElement('button');
        pubBtn.type = 'button';
        pubBtn.className = p.published ? 'secondary-button' : 'share-button';
        pubBtn.textContent = p.published ? 'Unpublish' : 'Publish';
        pubBtn.disabled = ro;
        pubBtn.onclick = () => { togglePagePublish(p); draw(); };
        pubCard.append(pubBtn);

        const acts = document.createElement('div');
        acts.className = 'sp-actions-col';
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button'; copyBtn.className = 'secondary-button'; copyBtn.textContent = '🔗 Copy link';
        copyBtn.onclick = () => { copyPageLink(p); closeRichPopover(); };
        acts.append(copyBtn);

        if (p.published) {
            const anaBtn = document.createElement('button');
            anaBtn.type = 'button'; anaBtn.className = 'secondary-button'; anaBtn.textContent = '📊 View page analytics';
            anaBtn.onclick = () => { closeRichPopover(); openPageAnalyticsModal(p); };
            acts.append(anaBtn);
        }
        if (canManagePerms) {
            const permBtn = document.createElement('button');
            permBtn.type = 'button'; permBtn.className = 'secondary-button'; permBtn.textContent = '🔒 Manage permissions';
            permBtn.onclick = () => { closeRichPopover(); openPagePermissionsDialog(p); };
            acts.append(permBtn);
        }

        pop.append(head, pubCard, acts);
    };
    draw();
}
function renderTimeTrackingDashboardView(view: HTMLElement) {
    view.replaceChildren();
}
function renderCalendarDashboardView(view: HTMLElement) {
    view.replaceChildren();
}
function renderTaskboardDashboardView(view: HTMLElement) {
    view.replaceChildren();
}
const TASK_TRASH_TTL_MS = 72 * 60 * 60 * 1000;
function purgeExpiredCompletedTasks(dd?: DashboardData, now = Date.now()): number {
    if (!dd || !Array.isArray(dd.tasks)) return 0;
    const before = dd.tasks.length;
    dd.tasks = dd.tasks.filter(t => {
        if (!t.done) return true;
        if (!t.completedAt) t.completedAt = t.createdAt || now;
        return now - t.completedAt < TASK_TRASH_TTL_MS;
    });
    return before - dd.tasks.length;
}
function formatTaskTrashCountdown(task: DashboardTask, now = Date.now()): string {
    const doneAt = Number(task.completedAt || task.createdAt || now);
    const remMs = Math.max(0, TASK_TRASH_TTL_MS - (now - doneAt));
    const hours = Math.floor(remMs / 3600000);
    if (hours >= 1) return `${hours}h left`;
    const mins = Math.max(1, Math.ceil(remMs / 60000));
    return `${mins}m left`;
}
function parseSlashTaskCommand(rawLine: string): { text: string; priority: 'normal' | 'high' } | null {
    const m = String(rawLine || '').match(/^\s*\/task\s+([\s\S]+)$/i);
    if (!m) return null;
    let body = m[1].trim();
    let priority: 'normal' | 'high' = 'normal';
    if (body.endsWith('!')) {
        priority = 'high';
        body = body.replace(/!+\s*$/, '').trim();
    }
    if (!body) return null;
    return { text: body, priority };
}
function addDashboardTask(dd: DashboardData, text: string, priority: 'normal' | 'high' = 'normal'): DashboardTask | null {
    const clean = text.trim();
    if (!clean) return null;
    const entry: DashboardTask = {
        id: id(),
        text: clean,
        done: false,
        priority,
        createdAt: Date.now()
    };
    dd.tasks.unshift(entry);
    save();
    syncInboxBadges();
    return entry;
}
function renderTasksPanelInto(tasksCard: HTMLElement, dd: DashboardData) {
    let draggedTaskId: string | null = null;
    const drawTasks = () => {
        if (purgeExpiredCompletedTasks(dd) > 0) save();
        const allTasks = dd.tasks;
        const openCount = allTasks.filter(t => !t.done).length;
        const doneCount = allTasks.length - openCount;
        const visibleTasks = taskFilter === 'open' ? allTasks.filter(t => !t.done)
            : taskFilter === 'completed' ? allTasks.filter(t => t.done)
            : allTasks;

        const activeInput = document.activeElement?.id === 'dash-task-input';
        const draftVal = ($('#dash-task-input') as HTMLInputElement | null)?.value || '';
        const draftPrio = ($('#dash-task-priority') as HTMLSelectElement | null)?.value || 'normal';

        tasksCard.replaceChildren();

        const head = document.createElement('div');
        head.className = 'dash-card-head';
        head.innerHTML = `<div><h3>Tasks</h3><small class="dash-muted">${openCount} open · ${doneCount} in trash</small></div>`;
        const clearDoneBtn = document.createElement('button');
        clearDoneBtn.type = 'button';
        clearDoneBtn.className = 'secondary-button';
        clearDoneBtn.textContent = taskFilter === 'completed' ? 'Empty trash' : 'Clear completed';
        clearDoneBtn.title = 'Permanently delete completed tasks now (auto-clears after ~72 hours)';
        clearDoneBtn.disabled = doneCount === 0;
        clearDoneBtn.onclick = () => {
            dd.tasks = dd.tasks.filter(t => !t.done);
            save();
            syncInboxBadges();
            drawTasks();
        };
        head.append(clearDoneBtn);

        const addForm = document.createElement('form');
        addForm.className = 'dash-task-add-form';
        const taskInp = document.createElement('input');
        taskInp.id = 'dash-task-input';
        taskInp.placeholder = 'Add a task (or type /task in Scratchpad)…';
        taskInp.autocomplete = 'off';
        taskInp.value = draftVal;
        const prioSel = document.createElement('select');
        prioSel.id = 'dash-task-priority';
        prioSel.innerHTML = '<option value="normal">Normal</option><option value="high">High priority</option>';
        prioSel.value = draftPrio;
        const addBtn = document.createElement('button');
        addBtn.type = 'submit';
        addBtn.className = 'share-button';
        addBtn.textContent = '＋ Add task';
        addForm.append(taskInp, prioSel, addBtn);
        addForm.onsubmit = e => {
            e.preventDefault();
            const text = taskInp.value.trim();
            if (!text) return;
            addDashboardTask(dd, text, prioSel.value === 'high' ? 'high' : 'normal');
            taskInp.value = '';
            drawTasks();
            requestAnimationFrame(() => ($('#dash-task-input') as HTMLInputElement | null)?.focus());
        };

        const filterTabs = document.createElement('div');
        filterTabs.className = 'inbox-filter-tabs';
        [
            ['open', `Open (${openCount})`],
            ['completed', `🗑 Trash (${doneCount})`],
            ['all', `All (${allTasks.length})`]
        ].forEach(([key, label]) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'inbox-tab-btn' + (taskFilter === key ? ' active' : '');
            b.textContent = label;
            b.onclick = () => { taskFilter = key as any; drawTasks(); };
            filterTabs.append(b);
        });

        const list = document.createElement('div');
        list.className = 'dash-task-list';
        const clearDropHints = () => {
            list.querySelectorAll('.is-drop-before, .is-drop-after').forEach(el => {
                el.classList.remove('is-drop-before', 'is-drop-after');
            });
        };
        if (!visibleTasks.length) {
            const empty = document.createElement('div');
            empty.className = 'mode-empty-state';
            empty.textContent = taskFilter === 'open'
                ? 'No open tasks — add one above or type /task in Scratchpad.'
                : taskFilter === 'completed'
                    ? 'Trash is empty — completed tasks stay here for ~72 hours before auto-clearing.'
                    : 'No tasks in this view.';
            list.append(empty);
        } else {
            visibleTasks.forEach(task => {
                const row = document.createElement('div');
                row.className = 'dash-task-row'
                    + (task.done ? ' is-done' : '')
                    + (task.priority === 'high' ? ' is-high-priority' : '');
                row.dataset.taskId = task.id;
                row.draggable = true;

                const grip = document.createElement('span');
                grip.className = 'task-drag-handle';
                grip.setAttribute('aria-hidden', 'true');
                grip.title = 'Drag to reorder';
                grip.textContent = '⋮⋮';

                const label = document.createElement('span');
                label.className = 'dash-task-text';
                label.textContent = task.text;

                const meta = document.createElement('div');
                meta.className = 'dash-task-meta';
                if (task.priority === 'high') {
                    const badge = document.createElement('span');
                    badge.className = 'dash-priority-high';
                    badge.textContent = 'High';
                    meta.append(badge);
                }
                if (task.done) {
                    const ttlBadge = document.createElement('span');
                    ttlBadge.className = 'task-trash-ttl';
                    ttlBadge.title = 'Completed tasks in Trash auto-empty after ~72 hours';
                    ttlBadge.textContent = formatTaskTrashCountdown(task);
                    meta.append(ttlBadge);
                }

                const completeBtn = document.createElement('button');
                completeBtn.type = 'button';
                completeBtn.className = 'task-complete-btn' + (task.done ? ' is-completed' : '');
                completeBtn.setAttribute('aria-pressed', String(!!task.done));
                completeBtn.setAttribute('aria-label', task.done ? `Restore ${task.text}` : `Complete ${task.text}`);
                completeBtn.title = task.done ? 'In Trash — click to restore task' : 'Mark completed (moves to Trash)';
                completeBtn.textContent = '✓';
                completeBtn.onclick = () => {
                    task.done = !task.done;
                    task.completedAt = task.done ? Date.now() : undefined;
                    save();
                    syncInboxBadges();
                    drawTasks();
                };
                meta.append(completeBtn);

                row.addEventListener('dragstart', e => {
                    draggedTaskId = task.id;
                    row.classList.add('is-dragging');
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', task.id);
                    }
                });
                row.addEventListener('dragend', () => {
                    draggedTaskId = null;
                    row.classList.remove('is-dragging');
                    clearDropHints();
                });
                row.addEventListener('dragover', e => {
                    const srcId = draggedTaskId || e.dataTransfer?.getData('text/plain');
                    if (!srcId || srcId === task.id) return;
                    e.preventDefault();
                    clearDropHints();
                    const rect = row.getBoundingClientRect();
                    const before = e.clientY < rect.top + rect.height / 2;
                    row.classList.add(before ? 'is-drop-before' : 'is-drop-after');
                });
                row.addEventListener('dragleave', () => {
                    row.classList.remove('is-drop-before', 'is-drop-after');
                });
                row.addEventListener('drop', e => {
                    e.preventDefault();
                    const srcId = draggedTaskId || e.dataTransfer?.getData('text/plain');
                    clearDropHints();
                    if (!srcId || srcId === task.id) return;
                    const fromIdx = dd.tasks.findIndex(t => t.id === srcId);
                    const targetIdx = dd.tasks.findIndex(t => t.id === task.id);
                    if (fromIdx < 0 || targetIdx < 0) return;
                    const rect = row.getBoundingClientRect();
                    const insertBefore = e.clientY < rect.top + rect.height / 2;
                    const [moved] = dd.tasks.splice(fromIdx, 1);
                    let destIdx = dd.tasks.findIndex(t => t.id === task.id);
                    if (!insertBefore) destIdx += 1;
                    dd.tasks.splice(destIdx, 0, moved);
                    save();
                    drawTasks();
                });

                row.append(grip, label, meta);
                list.append(row);
            });
        }

        tasksCard.append(head, addForm, filterTabs);
        if (taskFilter === 'completed') {
            const trashBanner = document.createElement('div');
            trashBanner.className = 'tasks-trash-banner';
            trashBanner.textContent = '🗑 Tasks Trash — Completed tasks auto-empty 72 hours after completion. Click ✓ to restore or drag to reorder.';
            tasksCard.append(trashBanner);
        }
        tasksCard.append(list);
        if (activeInput) ($('#dash-task-input') as HTMLInputElement | null)?.focus();
    };
    drawTasks();
    return drawTasks;
}
function parseScratchpadLine(rawLine: string): { level: number; text: string } {
    const clean = String(rawLine || '').replace(/\u200b/g, '').replace(/\u00a0/g, ' ');
    const m = clean.match(/^(#{1,5}) ([\s\S]*)$/);
    if (!m) return { level: 0, text: clean };
    return { level: m[1].length, text: m[2] };
}
function formatScratchpadLine(level: number, text: string): string {
    const clean = String(text || '').replace(/\u200b/g, '');
    const lvl = Math.max(0, Math.min(5, Math.floor(level || 0)));
    return lvl > 0 ? `${'#'.repeat(lvl)} ${clean}` : clean;
}
function createScratchpadLineEl(level: number, text: string): HTMLDivElement {
    const line = document.createElement('div');
    line.className = 'sp-line';
    line.dataset.level = String(Math.max(0, Math.min(5, Math.floor(level || 0))));
    if (text) line.textContent = text;
    else line.append(document.createElement('br'));
    return line;
}
function scratchpadLineText(el: Element): string {
    return (el.textContent || '').replace(/\u200b/g, '').replace(/\u00a0/g, ' ').replace(/\n/g, '');
}
function scratchpadCaretOffsetInLine(lineEl: Node): number | null {
    const sel = getSelection();
    if (!sel || !sel.rangeCount) return null;
    const range = sel.getRangeAt(0);
    if (!lineEl.contains(range.startContainer)) return null;
    const pre = document.createRange();
    pre.selectNodeContents(lineEl);
    pre.setEnd(range.startContainer, range.startOffset);
    return pre.toString().replace(/\u200b/g, '').length;
}
function setScratchpadCaretInLine(lineEl: HTMLElement, offset: number) {
    const sel = getSelection();
    if (!sel) return;
    const range = document.createRange();
    let remaining = Math.max(0, offset);
    const walker = document.createTreeWalker(lineEl, NodeFilter.SHOW_TEXT);
    let node: Text | null = walker.nextNode() as Text | null;
    while (node) {
        const len = node.data.length;
        if (remaining <= len) {
            range.setStart(node, remaining);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            return;
        }
        remaining -= len;
        node = walker.nextNode() as Text | null;
    }
    range.setStart(lineEl, lineEl.childNodes.length && lineEl.firstChild?.nodeName === 'BR' ? 0 : lineEl.childNodes.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}
function renderScratchpadDashboardView(view: HTMLElement) {
    const dd = state.dashboardData!;
    const shell = document.createElement('div');
    shell.className = 'mode-page-shell is-split-scratchpad';

    const hero = document.createElement('div');
    hero.className = 'mode-hero';
    hero.innerHTML = `<div><span class="mode-kicker">BRAINSTORMING NOTES &amp; TASKS</span><h1>Scratchpad</h1></div>`;
    const acts = document.createElement('div');
    acts.className = 'mode-hero-actions';

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'secondary-button';
    clearBtn.textContent = 'Clear';
    clearBtn.onclick = () => {
        dd.scratchpadText = '';
        dd.scratchpadUpdatedAt = Date.now();
        save(true);
        renderDashboardView();
    };
    acts.append(clearBtn);
    hero.append(acts);

    const splitWrap = document.createElement('div');
    splitWrap.className = 'scratchpad-tasks-split';

    const card = document.createElement('section');
    card.className = 'dash-card dash-scratchpad-card';
    const area = document.createElement('div');
    area.id = 'dash-scratchpad-input';
    area.className = 'dash-scratchpad-editor';
    area.contentEditable = 'true';
    area.setAttribute('role', 'textbox');
    area.setAttribute('aria-multiline', 'true');
    area.setAttribute('aria-label', 'Scratchpad editor');
    area.dataset.placeholder = 'Jot down notes… Type /task <text> + Enter to add a task (end with ! for high priority), or #..##### + Space for headings';

    const separator = document.createElement('div');
    separator.className = 'scratchpad-split-separator';
    separator.setAttribute('role', 'separator');
    separator.setAttribute('aria-orientation', 'vertical');

    const tasksCard = document.createElement('aside');
    tasksCard.id = 'dash-scratchpad-tasks-panel';
    tasksCard.className = 'dash-card dash-tasks-panel';
    const refreshTasksPanel = renderTasksPanelInto(tasksCard, dd);

    const loadLinesFromText = (raw: string) => {
        area.replaceChildren();
        const rows = String(raw || '').split(/\r?\n/);
        (rows.length ? rows : ['']).forEach(lineText => {
            const parsed = parseScratchpadLine(lineText);
            area.append(createScratchpadLineEl(parsed.level, parsed.text));
        });
    };
    const serializeLines = () => {
        const lines = [...area.querySelectorAll(':scope > .sp-line')].map(el =>
            formatScratchpadLine(Number((el as HTMLElement).dataset.level || 0), scratchpadLineText(el))
        );
        return lines.join('\n');
    };
    const ensureLineStructure = () => {
        const sel = getSelection();
        const anchorNode = sel?.rangeCount ? sel.getRangeAt(0).startContainer : null;
        const anchorOffset = sel?.rangeCount ? sel.getRangeAt(0).startOffset : 0;
        let replaced = false;
        [...area.childNodes].forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && (node as Element).classList.contains('sp-line')) {
                const el = node as HTMLElement;
                if (!el.dataset.level) el.dataset.level = '0';
                return;
            }
            replaced = true;
            const txt = (node.textContent || '').replace(/\u200b/g, '');
            const line = createScratchpadLineEl(0, txt);
            area.replaceChild(line, node);
            if (anchorNode && (node === anchorNode || node.contains(anchorNode))) {
                setScratchpadCaretInLine(line, Math.min(anchorOffset, txt.length));
            }
        });
        if (!area.children.length) {
            const first = createScratchpadLineEl(0, '');
            area.append(first);
            if (document.activeElement === area) setScratchpadCaretInLine(first, 0);
            replaced = true;
        }
        return replaced;
    };

    const footer = document.createElement('div');
    footer.className = 'dash-scratchpad-footer';
    const updateFooterAndEmptyState = () => {
        const lines = [...area.querySelectorAll(':scope > .sp-line')];
        const isEmpty = lines.length <= 1 && !scratchpadLineText(lines[0] || area).trim() && (lines[0]?.getAttribute('data-level') || '0') === '0';
        area.classList.toggle('is-empty', isEmpty);
        const plain = lines.map(scratchpadLineText).join('\n');
        const words = plain.trim() ? plain.trim().split(/\s+/).length : 0;
        const stamp = dd.scratchpadUpdatedAt ? ` · Saved ${formatInboxRelative(dd.scratchpadUpdatedAt)}` : '';
        footer.textContent = `${words} word${words === 1 ? '' : 's'} · ${plain.length} chars${stamp}`;
    };

    const syncFromDom = (skipSave = false) => {
        ensureLineStructure();
        const activeLine = (() => {
            const sel = getSelection();
            const n = sel?.rangeCount ? sel.getRangeAt(0).startContainer : null;
            return (n && n.nodeType === 3 ? n.parentElement : n as Element | null)?.closest?.('.sp-line') as HTMLElement | null;
        })();
        if (activeLine) {
            const txt = scratchpadLineText(activeLine);
            const lvl = Number(activeLine.dataset.level || 0);
            if (lvl === 0) {
                const m = txt.match(/^(#{1,5}) ([\s\S]*)$/);
                if (m) {
                    const prevCaret = scratchpadCaretOffsetInLine(activeLine) ?? (m[1].length + 1);
                    const nextLevel = m[1].length;
                    const bodyTxt = m[2];
                    activeLine.dataset.level = String(nextLevel);
                    activeLine.replaceChildren();
                    if (bodyTxt) activeLine.textContent = bodyTxt;
                    else activeLine.append(document.createElement('br'));
                    const strippedLen = nextLevel + 1;
                    setScratchpadCaretInLine(activeLine, Math.max(0, prevCaret - strippedLen));
                }
            }
        }
        const serialized = serializeLines();
        dd.scratchpadText = serialized;
        dd.scratchpadUpdatedAt = Date.now();
        updateFooterAndEmptyState();
        if (!skipSave) save();
    };

    Object.defineProperty(area, 'value', {
        configurable: true,
        get() { return serializeLines(); },
        set(val: string) {
            loadLinesFromText(val);
            updateFooterAndEmptyState();
        }
    });

    area.addEventListener('keydown', e => {
        if (e.isComposing) return;
        const sel = getSelection();
        if (!sel || !sel.rangeCount) return;
        const lineEl = (sel.getRangeAt(0).startContainer.nodeType === 3
            ? sel.getRangeAt(0).startContainer.parentElement
            : sel.getRangeAt(0).startContainer as Element | null)?.closest?.('.sp-line') as HTMLElement | null;
        if (!lineEl || !area.contains(lineEl)) return;
        const level = Number(lineEl.dataset.level || 0);

        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!sel.isCollapsed) return;
            e.preventDefault();
            const txt = scratchpadLineText(lineEl);
            const parsedCmd = parseSlashTaskCommand(txt);
            if (parsedCmd) {
                const created = addDashboardTask(dd, parsedCmd.text, parsedCmd.priority);
                const nextSibling = lineEl.nextElementSibling as HTMLElement | null;
                if (nextSibling && nextSibling.classList.contains('sp-line')) {
                    lineEl.remove();
                    setScratchpadCaretInLine(nextSibling, 0);
                } else {
                    lineEl.dataset.level = '0';
                    lineEl.replaceChildren(document.createElement('br'));
                    setScratchpadCaretInLine(lineEl, 0);
                }
                syncFromDom();
                refreshTasksPanel();
                if (created) toast(`Added ${created.priority === 'high' ? 'high-priority ' : ''}task “${created.text}”`);
                return;
            }
            const pos = scratchpadCaretOffsetInLine(lineEl) ?? txt.length;
            if (pos === 0 && txt.length > 0) {
                const blankAbove = createScratchpadLineEl(0, '');
                lineEl.before(blankAbove);
                setScratchpadCaretInLine(lineEl, 0);
            } else {
                const before = txt.slice(0, pos);
                const after = txt.slice(pos);
                lineEl.replaceChildren();
                if (before) lineEl.textContent = before;
                else lineEl.append(document.createElement('br'));
                const nextLine = createScratchpadLineEl(0, after);
                lineEl.after(nextLine);
                setScratchpadCaretInLine(nextLine, 0);
            }
            syncFromDom();
            return;
        }

        if (e.key === 'Backspace' && level > 0 && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const pos = scratchpadCaretOffsetInLine(lineEl);
            if (sel.isCollapsed && pos === 0) {
                e.preventDefault();
                lineEl.dataset.level = '0';
                setScratchpadCaretInLine(lineEl, 0);
                syncFromDom();
            }
        }
    });

    area.addEventListener('paste', e => {
        const plain = e.clipboardData?.getData('text/plain');
        if (plain == null) return;
        e.preventDefault();
        const pastedRows = plain.replace(/\r\n?/g, '\n').split('\n');
        const sel = getSelection();
        if (!sel || !sel.rangeCount) return;
        const lineEl = (sel.getRangeAt(0).startContainer.nodeType === 3
            ? sel.getRangeAt(0).startContainer.parentElement
            : sel.getRangeAt(0).startContainer as Element | null)?.closest?.('.sp-line') as HTMLElement | null;
        if (!lineEl) return;
        if (pastedRows.length === 1) {
            const parsedSingle = parseScratchpadLine(pastedRows[0]);
            const curTxt = scratchpadLineText(lineEl);
            const curLvl = Number(lineEl.dataset.level || 0);
            const pos = scratchpadCaretOffsetInLine(lineEl) ?? curTxt.length;
            if (curLvl === 0 && pos === 0 && !curTxt && parsedSingle.level > 0) {
                lineEl.dataset.level = String(parsedSingle.level);
                lineEl.textContent = parsedSingle.text;
                setScratchpadCaretInLine(lineEl, parsedSingle.text.length);
            } else {
                const nextTxt = curTxt.slice(0, pos) + pastedRows[0] + curTxt.slice(pos);
                lineEl.textContent = nextTxt;
                setScratchpadCaretInLine(lineEl, pos + pastedRows[0].length);
            }
        } else {
            const curTxt = scratchpadLineText(lineEl);
            const curLvl = Number(lineEl.dataset.level || 0);
            const pos = scratchpadCaretOffsetInLine(lineEl) ?? curTxt.length;
            const prefix = curTxt.slice(0, pos);
            const suffix = curTxt.slice(pos);
            let insertAfter: HTMLElement = lineEl;
            let caretEl: HTMLElement = lineEl;
            let caretPos = 0;
            pastedRows.forEach((rawRow, idx) => {
                const parsed = parseScratchpadLine(rawRow);
                if (idx === 0) {
                    if (curLvl === 0 && !prefix && parsed.level > 0) {
                        lineEl.dataset.level = String(parsed.level);
                        lineEl.textContent = parsed.text;
                    } else {
                        lineEl.textContent = prefix + rawRow;
                    }
                    if (idx === pastedRows.length - 1 && suffix) {
                        caretPos = (lineEl.textContent || '').length;
                        lineEl.textContent += suffix;
                    }
                } else {
                    const isLast = idx === pastedRows.length - 1;
                    const textWithSuffix = isLast ? parsed.text + suffix : parsed.text;
                    const nextEl = createScratchpadLineEl(parsed.level, textWithSuffix);
                    insertAfter.after(nextEl);
                    insertAfter = nextEl;
                    caretEl = nextEl;
                    caretPos = parsed.text.length;
                }
            });
            setScratchpadCaretInLine(caretEl, caretPos);
        }
        syncFromDom();
    });

    area.addEventListener('input', () => syncFromDom());

    loadLinesFromText(dd.scratchpadText || '');
    updateFooterAndEmptyState();

    card.append(area, footer);
    splitWrap.append(card, separator, tasksCard);
    shell.append(hero, splitWrap);
    view.append(shell);
}
function syncAppModeUi() {
    document.body.dataset.appMode = currentAppMode;
    document.body.dataset.dashboardSubmode = currentAppMode === 'dashboard' ? currentDashboardSubMode : '';
    document.querySelectorAll('button[data-app-mode]').forEach(btn => {
        btn.classList.toggle('is-active', (btn as HTMLElement).dataset.appMode === currentAppMode);
    });
    const docsSidebar = $('#sidebar-docs-panel');
    const dashSidebar = $('#sidebar-dashboard-panel');
    if (docsSidebar) docsSidebar.hidden = currentAppMode !== 'notion';
    if (dashSidebar) dashSidebar.hidden = currentAppMode !== 'dashboard';

    document.querySelectorAll('#dashboard-subnav [data-dashboard-submode]').forEach(btn => {
        const sub = (btn as HTMLElement).dataset.dashboardSubmode;
        btn.classList.toggle('is-active', currentAppMode === 'dashboard' && sub === currentDashboardSubMode);
    });
    const adminLock = $('#dash-admin-lock');
    if (adminLock) adminLock.hidden = isAdminAuthorized(getCurrentActorUser());

    const editorWrap = $('#editor-wrap');
    const coverSlot = $('#page-cover-slot');
    const toolbarDock = $('#editor-toolbar-dock');
    const tabBar = $('#app-tab-bar');
    const topbar = document.querySelector('.topbar') as HTMLElement | null;
    const pageOptMenu = $('#page-options-menu');
    const commentsDrawer = $('#comments-drawer');
    const dashView = $('#dashboard-view');

    const inNotion = currentAppMode === 'notion';
    if (tabBar) tabBar.hidden = !inNotion;
    if (topbar) topbar.hidden = !inNotion;
    if (!inNotion) {
        if (pageOptMenu) pageOptMenu.hidden = true;
        if (commentsDrawer && !commentsDrawer.hidden) commentsDrawer.hidden = true;
    }
    if (editorWrap) editorWrap.hidden = !inNotion;
    if (coverSlot && !inNotion) coverSlot.hidden = true;
    if (toolbarDock && !inNotion) toolbarDock.hidden = true;
    if (dashView) dashView.hidden = currentAppMode !== 'dashboard';

    syncInboxBadges();
    if (currentAppMode === 'dashboard') {
        renderDashboardView();
    } else if (inNotion && current()) {
        renderTabs();
        renderBreadcrumbs(current());
    }
    ArchitectToolbar?.renderToolbar?.();
}
function navigateToPage(pageId, record = true) { if (!state.pages.some(page => page.id === pageId)) return; closeDocsNotificationsPopover(); setAppMode('notion', { skipRender: true }); const switched = state.activePageId !== pageId; stopAllAudioPlayers(); closeSelectionToolbar(); hideCommentPopover(); savedEditorRange = null; formatPainterArmed = false; formatPainterStyle = null; ArchitectDatabase?.closeDbPopover?.(); ArchitectDatabase?.closeDatabasePeek?.(); editingCommentMsgId = null; typingBurstOpen = false; clearTimeout(typingUndoTimer); if (record && switched) { pageHistory = pageHistory.slice(0, historyIndex + 1); pageHistory.push(pageId); historyIndex = pageHistory.length - 1; } state.activePageId = pageId; const dest = state.pages.find(pg => pg.id === pageId); if (dest?.published && switched) recordPublishedPageView(dest); syncHistoryToActiveTab(); syncPageUrl(pageId); save(); render(); if (switched) window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); updateHistoryControls(); }
function navigateHistory(delta) { const next = historyIndex + delta; if (next < 0 || next >= pageHistory.length) return; historyIndex = next; navigateToPage(pageHistory[historyIndex], false); }
function syncUserProfileUi() {
    if (currentAppMode === 'dashboard') renderDashboardView();
}
function updateSidebarModeBadge() {
    const pill = $('#readonly-pill');
    const coord = state.coordinationMode || 'local';
    if (pill) pill.hidden = !isReadOnlyMirror();
    const syncBtn = $('#sidebar-sync-btn');
    if (syncBtn) {
        const last = state.syncConfig?.lastSyncedAt ? ` (last synced ${new Date(state.syncConfig.lastSyncedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })})` : '';
        syncBtn.title = coord === 'cloud-sync'
            ? (isReadOnlyMirror() ? `Pull updates from sync source${last}` : `Sync workspace with cloud/folder${last}`)
            : coord === 'server'
                ? `Sync with team server${last}`
                : 'Flush local workspace save to disk';
    }
}
function persistAllStorage(serialized) {
    const key = getActiveStoreKey();
    localStorage.setItem(key, serialized);
    syncActiveWorkspaceInIndex(state, key);
    const desktop = ArchitectBackend.host();
    if (desktop && key === STORE) desktop.writeWorkspace(serialized).catch(() => {});
}
window.addEventListener('beforeunload', () => {
    if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = 0;
        if (!isReadOnlyMirror()) persistAllStorage(JSON.stringify(state));
    }
});
function save(force = false) {
    if (isReadOnlyMirror() && !force) { $('#saved-status').textContent = 'View-only mirror'; return; }
    const activePg = current();
    if (activePg) {
        activePg.updatedAt = Date.now();
        maybeAutoSnapshotPage(activePg);
    }
    clearTimeout(saveTimer);
    saveTimer = 0;
    if (force) {
        persistAllStorage(JSON.stringify(state));
        $('#saved-status').textContent = isReadOnlyMirror() ? 'View-only mirror' : 'All changes saved';
        return;
    }
    $('#saved-status').textContent = 'Saving…';
    saveTimer = window.setTimeout(() => {
        saveTimer = 0;
        const serialized = JSON.stringify(state);
        persistAllStorage(serialized);
        $('#saved-status').textContent = 'All changes saved';
    }, 180);
}
function applyPulledWorkspace(raw) {
    const parsed = JSON.parse(raw);
    const incoming = parsed?.format === 'architect-workspace-backup' ? parsed.workspace : parsed;
    if (!incoming || incoming.version !== 2 || !Array.isArray(incoming.pages) || !incoming.pages.length) {
        throw new Error('Synced file does not contain a valid Architect v2 workspace.');
    }
    state.workspaceName = incoming.workspaceName || state.workspaceName;
    state.pages = incoming.pages;
    state.users = Array.isArray(incoming.users) && incoming.users.length ? incoming.users : state.users;
    state.tabs = incoming.tabs;
    state.activeTabId = incoming.activeTabId;
    if (!state.pages.some(pg => pg.id === state.activePageId)) {
        state.activePageId = state.pages.some(pg => pg.id === incoming.activePageId) ? incoming.activePageId : state.pages[0].id;
    }
    ensureTabs();
    undoStacks.clear();
    redoStacks.clear();
    lastStablePageState.clear();
    resolvedAssetPreviewCache.clear();
    resolvedCoverOriginalCache.clear();
    if (Array.isArray(parsed?.assets)) {
        const validAssets = parsed.assets.filter(a => a && typeof a.id === 'string' && typeof a.name === 'string');
        ArchitectBackend.saveAssetCatalog(validAssets);
    }
    const serialized = JSON.stringify(state);
    persistAllStorage(serialized);
    render();
}
async function runSyncPull(manual = false) {
    const cfg = state.syncConfig;
    if (!cfg) return;
    const res = await ArchitectBackend.pullSyncSource(cfg);
    if (!res.ok || !res.raw) {
        cfg.lastSyncError = res.error || 'Sync failed';
        persistAllStorage(JSON.stringify(state));
        updateSettingsSyncStatus();
        if (manual) toast(cfg.lastSyncError);
        return;
    }
    try {
        applyPulledWorkspace(res.raw);
        cfg.lastSyncedAt = Date.now();
        cfg.lastSyncError = undefined;
        persistAllStorage(JSON.stringify(state));
        updateSettingsSyncStatus();
        if (manual) toast('Pulled latest snapshot from sync source');
    } catch (err) {
        cfg.lastSyncError = err.message || 'Invalid synced data';
        updateSettingsSyncStatus();
        if (manual) toast(cfg.lastSyncError);
    }
}
async function runSyncPush(manual = false) {
    if (isReadOnlyMirror()) { if (manual) toast('View-only mirrors cannot push changes to the source.'); return; }
    const payload = JSON.stringify({ format: 'architect-workspace-backup', formatVersion: 1, exportedAt: new Date().toISOString(), workspace: state, assets: readAssets() });
    const res = await ArchitectBackend.pushSyncTarget(state.syncConfig, payload);
    if (!res.ok) {
        state.syncConfig.lastSyncError = res.error || 'Push failed';
        updateSettingsSyncStatus();
        if (manual) toast(state.syncConfig.lastSyncError);
        return;
    }
    state.syncConfig.lastSyncedAt = Date.now();
    state.syncConfig.lastSyncError = undefined;
    persistAllStorage(JSON.stringify(state));
    updateSettingsSyncStatus();
    if (currentAppMode === 'dashboard') renderDashboardView();
    if (manual) toast('Pushed snapshot to sync target');
}
async function synchronizeNow() {
    const btn = $('#sidebar-sync-btn');
    btn?.classList.add('is-syncing');
    try {
        const mode = state.coordinationMode || 'local';
        if (mode === 'cloud-sync') {
            if (!state.syncConfig?.folderPath && !state.syncConfig?.sourceUrl) {
                toast('Choose a sync folder or URL in Workspace settings');
                openWorkspaceSettings();
                return;
            }
            if (isReadOnlyMirror()) {
                await runSyncPull(true);
            } else {
                const res = await ArchitectBackend.pullSyncSource(state.syncConfig);
                let remoteTime = 0;
                if (res.ok && res.raw) {
                    try {
                        const parsed = JSON.parse(res.raw);
                        const w = parsed?.format === 'architect-workspace-backup' ? parsed.workspace : parsed;
                        remoteTime = Math.max(0, ...(w?.pages || []).map(pg => Number(pg.updatedAt) || 0));
                    } catch {}
                }
                const localTime = Math.max(0, ...(state.pages || []).map(pg => Number(pg.updatedAt) || 0));
                if (res.ok && remoteTime > localTime) await runSyncPull(true);
                else await runSyncPush(true);
            }
            return;
        }
        if (mode === 'server') {
            clearTimeout(saveTimer);
            persistAllStorage(JSON.stringify(state));
            toast(state.syncConfig?.serverUrl ? 'Local state saved; live server protocol pending backend launch' : 'Set a Team server URL in Workspace settings');
            return;
        }
        clearTimeout(saveTimer);
        persistAllStorage(JSON.stringify(state));
        $('#saved-status').textContent = 'All changes saved';
        toast('Workspace saved locally');
    } finally {
        btn?.classList.remove('is-syncing');
        updateSidebarModeBadge();
    }
}
function scheduleAutoSync() {
    clearInterval(autoSyncTimer);
    autoSyncTimer = 0;
    if (state.coordinationMode === 'cloud-sync' && state.syncConfig?.cadence === 'interval') {
        const mins = Math.max(1, Number(state.syncConfig.intervalMinutes) || 5);
        autoSyncTimer = window.setInterval(() => { runSyncPull(false); }, mins * 60_000);
    }
}
function commitOutgoingWorkspace() {
    clearTimeout(saveTimer);
    saveTimer = 0;
    try {
        persistAllStorage(JSON.stringify(state));
    } catch {}
}
function switchWorkspace(storeKey: string, options: { skipCommitOutgoing?: boolean } = {}) {
    if (!storeKey) return;
    if (!options.skipCommitOutgoing && storeKey === getActiveStoreKey()) {
        closeMenu();
        return;
    }
    if (!options.skipCommitOutgoing) commitOutgoingWorkspace();
    clearInterval(autoSyncTimer);
    autoSyncTimer = 0;
    closeMenu();
    stopAllAudioPlayers();
    closeSelectionToolbar();
    hideCommentPopover();
    savedEditorRange = null;
    formatPainterArmed = false;
    formatPainterStyle = null;
    ArchitectDatabase?.closeDbPopover?.();
    ArchitectDatabase?.closeDatabasePeek?.();
    editingCommentMsgId = null;
    typingBurstOpen = false;
    clearTimeout(typingUndoTimer);
    undoStacks.clear();
    redoStacks.clear();
    lastStablePageState.clear();
    pendingWorkspaceImport = null;
    iconTargetPage = null;
    iconTargetBlock = null;
    coverTargetPage = null;

    setActiveStoreKey(storeKey);
    state = loadWorkspace(storeKey);
    syncActiveWorkspaceInIndex(state, storeKey);
    ensureTabs();
    loadHistoryFromTab(activeTab());
    syncPageUrl(state.activePageId);
    ArchitectToolbar?.applyAppearanceStyles?.();
    setAppMode('notion', { skipRender: true });
    render();
    updateSidebarModeBadge();
    updateHistoryControls();
    scheduleAutoSync();
    toast(`Switched to ${state.workspaceName}`);
}
function createAndSwitchWorkspace(rawName: string) {
    const name = String(rawName || '').trim();
    if (!name) return;
    commitOutgoingWorkspace();
    const newId = id();
    const storeKey = `architect-workspace-${newId}`;
    const clonedUsers = Array.isArray(state.users) && state.users.length
        ? JSON.parse(JSON.stringify(state.users))
        : undefined;
    const created = freshWorkspace(name, clonedUsers);
    try {
        localStorage.setItem(storeKey, JSON.stringify(created));
    } catch {}
    syncActiveWorkspaceInIndex(created, storeKey);
    switchWorkspace(storeKey, { skipCommitOutgoing: true });
    toast(`Created workspace “${name}”`);
}
function openCreateWorkspaceDialog() {
    const dlg = $('#create-workspace-dialog') as HTMLDialogElement | null;
    const input = $('#new-workspace-name-input') as HTMLInputElement | null;
    if (!dlg || !input) return;
    input.value = '';
    if (!dlg.open) dlg.showModal();
    requestAnimationFrame(() => { input.focus(); input.select(); });
}
function openWorkspaceDropdown(anchorBtn: HTMLElement) {
    const existing = $('#command-menu');
    if (existing && !existing.hidden && existing.classList.contains('workspace-dropdown') && activeMenu === existing) {
        closeMenu();
        return;
    }
    closeMenu();
    syncActiveWorkspaceInIndex(state, getActiveStoreKey());
    const entries = readWorkspaceIndex();
    const activeKey = getActiveStoreKey();

    const menu = $('#command-menu');
    menu.className = 'command-menu workspace-dropdown';
    menu.replaceChildren();
    const heading = document.createElement('div');
    heading.className = 'menu-heading';
    const title = document.createElement('strong');
    title.textContent = 'Workspaces';
    heading.append(title);
    menu.append(heading);

    const list = document.createElement('div');
    list.className = 'command-list';
    entries.forEach(entry => {
        const isCurrent = entry.storeKey === activeKey;
        const monogram = esc((entry.name || 'W').trim().charAt(0).toUpperCase() || 'W');
        const iconHtml = `<span class="workspace-access-icon" aria-hidden="true">${monogram}</span>`;
        const row = menuRow(entry.name || 'Untitled workspace', iconHtml, () => {
            if (!isCurrent) switchWorkspace(entry.storeKey);
        }, '', '', { checked: isCurrent });
        row.dataset.workspaceKey = entry.storeKey;
        if (isCurrent) row.setAttribute('aria-current', 'true');
        list.append(row);
    });
    const divider = document.createElement('div');
    divider.className = 'menu-divider';
    list.append(divider);

    const createRow = menuRow('Create new workspace', '<span class="command-icon" aria-hidden="true">+</span>', () => {
        openCreateWorkspaceDialog();
    });
    createRow.dataset.action = 'create-workspace-menu-item';
    list.append(createRow);
    menu.append(list);

    const rect = anchorBtn.getBoundingClientRect();
    menu.style.minWidth = `${Math.max(220, Math.round(rect.width))}px`;
    menu.hidden = false;
    const box = menu.getBoundingClientRect();
    placeFloatingMenu(menu, rect.left, Math.max(8, rect.top - box.height - 6));
    menuOptions = [...list.querySelectorAll('.command-row')];
    menuIndex = Math.max(0, entries.findIndex(e => e.storeKey === activeKey));
    refreshMenuSelection();
    activeMenu = menu;
}
const ASSET_STORE = 'workspace-assets';
let pendingWorkspaceImport = null;
let coverTargetPage = null;
let chosenCoverAsset = '';
let coverCropMetrics = null;
let iconTargetPage = null;
let iconTargetBlock = null;
let iconTargetUndoPage = null;
let lastUsedColor = null;
let pendingDragIds = [];
let selectedLibraryAssetId = null;
function updateSettingsSyncStatus() {
    const label = $('#sync-last-status');
    const dot = $('#coord-status-dot');
    const title = $('#coord-status-title');
    const desc = $('#coord-status-desc');
    const mode = state.coordinationMode || 'local';
    if (title) title.textContent = mode === 'server' ? 'Team collaboration server' : mode === 'cloud-sync' ? (isReadOnlyMirror() ? 'Cloud sync · View-only mirror' : 'Cloud sync · Solo multi-device') : 'Local only (default)';
    if (desc) desc.textContent = mode === 'server'
        ? 'Connected to a team-hosted server for live WebSocket co-working, Discord-style roles, and workspace accounts.'
        : mode === 'cloud-sync'
            ? (isReadOnlyMirror() ? 'Auto-pulls from the shared cloud/folder source without write access. Editing is locked.' : 'Solo cross-device file sync via connected folder or cloud endpoint (not live multi-user co-op).')
            : 'Saved locally on this device by default. Works offline with zero external accounts.';
    if (dot) dot.style.background = mode === 'cloud-sync' && state.syncConfig?.lastSyncError ? '#d44c47' : mode === 'server' ? '#2383e2' : '#5c9c69';
    if (label) {
        if (state.syncConfig?.lastSyncError) label.textContent = `Last error: ${state.syncConfig.lastSyncError}`;
        else if (state.syncConfig?.lastSyncedAt) label.textContent = `Last synced ${new Date(state.syncConfig.lastSyncedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
        else label.textContent = 'Not synced yet';
    }
    const summary = $('#asset-storage-summary');
    const storeMode = state.assetStorageMode || 'local';
    const previewPolicy = state.assetPreviewPolicy || { mode: 'smart-proxy', maxProxySizeKB: 500, cacheFolderPath: '' };
    if (summary) summary.textContent = storeMode === 'drive'
        ? `External online drive selected (${previewPolicy.mode === 'download-all' ? 'downloading previews locally' : previewPolicy.mode === 'original-stream' ? 'streaming remote originals' : `crisp proxies capped at ${previewPolicy.maxProxySizeKB || 500} KB`}). Local files always preview at full resolution.`
        : storeMode === 'server'
            ? `Team server storage selected (${previewPolicy.mode === 'download-all' ? 'downloading previews locally' : previewPolicy.mode === 'original-stream' ? 'streaming originals' : `crisp proxies capped at ${previewPolicy.maxProxySizeKB || 500} KB`}). Local files always preview at full resolution.`
            : 'Local storage selected (default): local files always preview at full resolution directly from disk / IndexedDB.';
    updateSidebarModeBadge();
}
function syncAssetPreviewSettingsVisibility() {
    const hasRemoteAssets = ArchitectBackend.readAssetCatalog().some(a => a.storageMode !== 'local');
    const showRemotePanel = (state.assetStorageMode || 'local') !== 'local' || hasRemoteAssets;
    const panel = $('#settings-remote-preview-panel');
    if (panel) panel.hidden = !showRemotePanel;
    const mode = $('#settings-preview-mode')?.value || state.assetPreviewPolicy?.mode || 'smart-proxy';
    const sizeRow = $('#settings-proxy-size-row');
    const folderRow = $('#settings-cache-folder-row');
    if (sizeRow) sizeRow.hidden = mode !== 'smart-proxy';
    if (folderRow) folderRow.hidden = mode !== 'download-all';
}
function setWorkspaceSettingsTab(tab: 'general' | 'customization' | 'plugins') {
    const dlg = $('#settings-dialog');
    if (!dlg) return;
    dlg.querySelectorAll<HTMLElement>('[data-ws-tab]').forEach(btn => {
        const active = btn.dataset.wsTab === tab;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
    });
    dlg.querySelectorAll<HTMLElement>('[data-ws-panel]').forEach(panel => {
        panel.hidden = panel.dataset.wsPanel !== tab;
    });
}
function openWorkspaceSettings() {
    setWorkspaceSettingsTab('general');
    $('#settings-workspace-name').value = state.workspaceName || '';
    $('#settings-coord-mode').value = state.coordinationMode || 'local';
    $('#settings-asset-mode').value = state.assetStorageMode || 'local';
    const policy = state.assetPreviewPolicy || { mode: 'smart-proxy', maxProxySizeKB: 500, cacheFolderPath: '' };
    if ($('#settings-preview-mode')) $('#settings-preview-mode').value = policy.mode || 'smart-proxy';
    if ($('#settings-proxy-max-kb')) $('#settings-proxy-max-kb').value = String(policy.maxProxySizeKB || 500);
    if ($('#settings-cache-folder')) $('#settings-cache-folder').value = policy.cacheFolderPath || '';
    syncAssetPreviewSettingsVisibility();
    const cfg = state.syncConfig || {};
    $('#settings-sync-provider').value = cfg.driveProvider || 'local-folder';
    $('#settings-sync-folder').value = cfg.folderPath || '';
    $('#settings-sync-url').value = cfg.sourceUrl || '';
    $('#settings-sync-readonly').checked = !!cfg.readOnlyMirror;
    $('#settings-sync-cadence').value = cfg.cadence || 'on-start';
    $('#settings-sync-interval').value = String(cfg.intervalMinutes || 5);
    $('#settings-server-url').value = cfg.serverUrl || '';
    $('#settings-sync-panel').hidden = state.coordinationMode !== 'cloud-sync';
    $('#settings-server-panel').hidden = state.coordinationMode !== 'server';
    const isFolderSync = (cfg.driveProvider || 'local-folder') === 'local-folder';
    $('#settings-sync-folder-row').hidden = !isFolderSync;
    $('#settings-sync-url-row').hidden = isFolderSync;
    $('#settings-sync-interval').disabled = (cfg.cadence || 'on-start') !== 'interval';
    $('#sync-push-now').disabled = isReadOnlyMirror();
    updateSettingsSyncStatus();
    $('#settings-feedback').textContent = 'A backup includes your pages, sync settings, and asset metadata.';
    $('#import-workspace-file').value = '';
    $('#apply-workspace-import').disabled = true;
    pendingWorkspaceImport = null;
    $('#export-pre-reset-backup').hidden = !localStorage.getItem(RESET_BACKUP);
    $('#settings-dialog').showModal();
    setTimeout(() => $('#settings-workspace-name').focus(), 0);
}
function exportWorkspaceBackup() { const payload = { format: 'architect-workspace-backup', formatVersion: 1, exportedAt: new Date().toISOString(), workspace: state, assets: JSON.parse(localStorage.getItem(ASSET_STORE) || '[]') }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${(state.workspaceName || 'architect-workspace').trim().replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'architect-workspace'}-backup-${new Date().toISOString().slice(0, 10)}.json`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); $('#settings-feedback').textContent = `Backup exported with ${state.pages.length} pages.`; }
function exportPreviousWorkspaceBackup() { try { const raw = localStorage.getItem(RESET_BACKUP); if (!raw) throw new Error('No previous-workspace backup was found.'); let workspace = JSON.parse(raw); if (Array.isArray(workspace)) workspace = { version: 2, workspaceName: 'Acme Studio', activePageId: workspace[0]?.id, pages: workspace.map(page => ({ id: page.id || id(), title: page.title || 'Untitled', icon: page.icon || '📄', parentId: page.parent, blocks: (page.blocks || []).map(item => ({ id: item.id || id(), type: item.type === 'paragraph' ? 'text' : item.type, text: item.text || '', checked: item.checked })), createdAt: Date.now(), updatedAt: Date.now() })), users: state.users }; if (workspace.version !== 2 || !Array.isArray(workspace.pages)) throw new Error('The preserved data is not a supported workspace backup.'); const payload = { format: 'architect-workspace-backup', formatVersion: 1, exportedAt: new Date().toISOString(), workspace, assets: readAssets() }; const link = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })); link.href = url; link.download = 'architect-previous-workspace-backup.json'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); $('#settings-feedback').textContent = 'Previous workspace backup exported.'; } catch (error) { $('#settings-feedback').textContent = error.message; } }
function decodeWorkspaceBackup(value) {
    const rawWorkspace = value?.format === 'architect-workspace-backup' && value.formatVersion === 1 ? value.workspace : value;
    if (!rawWorkspace || rawWorkspace.version !== 2 || !Array.isArray(rawWorkspace.pages) || rawWorkspace.pages.length === 0) throw new Error('This file is not a supported Architect workspace backup.');
    const validMediaUrl = val => typeof val === 'string' && (/^data:(image|audio|video)\//i.test(val) || /^https?:\/\//i.test(val) || /^architect-asset:\/\//i.test(val));
    for (const page of rawWorkspace.pages) {
        if (!page || typeof page.id !== 'string' || typeof page.title !== 'string' || typeof page.icon !== 'string' || !Array.isArray(page.blocks)) throw new Error('The backup contains a page with missing required fields.');
        if (/[<>"'`]/.test(page.icon)) throw new Error('The backup contains an invalid page icon.');
        if (page.cover && !validMediaUrl(page.cover)) throw new Error(`The cover on “${page.title}” is not a supported image.`);
        for (const item of page.blocks) {
            if (!item || typeof item.id !== 'string' || typeof item.type !== 'string' || typeof item.text !== 'string') throw new Error(`The backup contains an invalid block on “${page.title}”.`);
            if (item.url && !validMediaUrl(item.url)) throw new Error(`The file on “${page.title}” has an unsupported URL.`);
        }
    }
    const workspace = ensureWorkspaceDefaults(JSON.parse(JSON.stringify(rawWorkspace)));
    if (!workspace.pages.some(page => page.id === workspace.activePageId)) workspace.activePageId = workspace.pages[0].id;
    workspace.users = Array.isArray(workspace.users) ? workspace.users : [];
    workspace.workspaceName = typeof workspace.workspaceName === 'string' && workspace.workspaceName.trim() ? workspace.workspaceName.trim() : 'Architect workspace';
    const assets = value?.format === 'architect-workspace-backup' ? value.assets : [];
    if (assets !== undefined && !Array.isArray(assets)) throw new Error('The backup asset list is invalid.');
    const safeAssets = (assets || []).map(asset => {
        if (!asset || typeof asset.name !== 'string') throw new Error('The backup contains an invalid asset.');
        if (asset.url && !validMediaUrl(asset.url)) throw new Error('The backup contains an invalid asset URL.');
        if (asset.externalUrl && !validMediaUrl(asset.externalUrl)) throw new Error('The backup contains an invalid external URL.');
        return asset;
    });
    return { workspace, assets: safeAssets };
}
function restoreWorkspaceBackup() {
    if (!pendingWorkspaceImport) return;
    if (!window.confirm('Restore this backup? It will replace the workspace currently saved on this device.')) return;
    const previousWorkspace = localStorage.getItem(STORE), previousAssets = localStorage.getItem(ASSET_STORE);
    try {
        clearTimeout(saveTimer);
        state = ensureWorkspaceDefaults(pendingWorkspaceImport.workspace);
        undoStacks.clear();
        redoStacks.clear();
        lastStablePageState.clear();
        ArchitectBackend.saveAssetCatalog(pendingWorkspaceImport.assets);
        persistAllStorage(JSON.stringify(state));
        scheduleAutoSync();
        $('#settings-dialog').close();
        render();
        $('#settings-feedback').textContent = '';
        toast('Workspace backup restored');
    } catch (error) {
        try {
            previousWorkspace === null ? localStorage.removeItem(STORE) : localStorage.setItem(STORE, previousWorkspace);
            if (previousAssets === null) localStorage.removeItem(ASSET_STORE);
            else ArchitectBackend.saveAssetCatalog(JSON.parse(previousAssets));
        } catch {}
        $('#settings-feedback').textContent = `Could not restore backup: ${error.message || 'storage is unavailable'}`;
    }
}
function esc(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
const ALLOWED_INLINE_COLOR_KEYS = new Set(['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red']);
const ALLOWED_INLINE_CASE_KEYS = new Set(['upper', 'lower', 'title', 'smallcaps']);
function cleanInlineHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const allowed = new Set(['STRONG', 'B', 'EM', 'I', 'S', 'DEL', 'CODE', 'U', 'A', 'BR', 'MARK', 'SUP', 'SUB', 'SPAN']);
    const walk = node => Array.from(node.childNodes).map(child => {
        if (child.nodeType === Node.TEXT_NODE) return esc(child.textContent || '');
        if (child.nodeType !== Node.ELEMENT_NODE) return '';
        const tag = child.tagName;
        if (!allowed.has(tag)) return walk(child);
        if (tag === 'BR') return '<br>';
        const content = walk(child);
        if (tag === 'MARK') {
            const cid = child.getAttribute('data-comment-id') || '';
            if (!content) return '';
            if (/^[a-zA-Z0-9_-]{4,80}$/.test(cid)) return `<mark class="comment-mark" data-comment-id="${esc(cid)}">${content}</mark>`;
            return content;
        }
        if (tag === 'A') {
            const href = child.getAttribute('href') || '';
            try {
                const url = new URL(href, location.href);
                if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
                    const cls = child.classList?.contains('inline-link-mention') ? ' class="inline-link-mention"' : '';
                    return `<a${cls} href="${esc(url.href)}" rel="noopener noreferrer">${content}</a>`;
                }
            } catch {}
            return content;
        }
        if (tag === 'SPAN') {
            if (child.classList?.contains('inline-mention-chip')) {
                const rawKind = child.getAttribute('data-mention-kind');
                const kind = rawKind === 'page' ? 'page' : rawKind === 'reminder' ? 'reminder' : 'person';
                const mid = child.getAttribute('data-mention-id') || '';
                const labelText = (child.textContent || '').trim();
                if (!labelText) return '';
                const idAttr = mid && /^[a-zA-Z0-9._:@-]{1,120}$/.test(mid) ? ` data-mention-id="${esc(mid)}"` : '';
                if (kind === 'reminder') {
                    const d = child.getAttribute('data-date') || '';
                    const tm = child.getAttribute('data-time') || '';
                    const off = child.getAttribute('data-remind-offset') || 'none';
                    const rat = child.getAttribute('data-remind-at') || '';
                    const fired = child.getAttribute('data-remind-fired') === '1';
                    const dAttr = /^\d{4}-\d{2}-\d{2}$/.test(d) ? ` data-date="${esc(d)}"` : '';
                    const tAttr = /^\d{2}:\d{2}$/.test(tm) ? ` data-time="${esc(tm)}"` : '';
                    const oAttr = /^[a-z0-9_]{1,20}$/.test(off) ? ` data-remind-offset="${esc(off)}"` : '';
                    const rAttr = /^\d{8,16}$/.test(rat) ? ` data-remind-at="${esc(rat)}"` : '';
                    const fAttr = fired ? ' data-remind-fired="1"' : '';
                    const extraCls = fired ? ' is-fired' : (rAttr ? ' is-scheduled' : '');
                    return `<span class="inline-mention-chip is-reminder-chip${extraCls}" contenteditable="false" data-mention-kind="reminder"${idAttr}${dAttr}${tAttr}${oAttr}${rAttr}${fAttr}>${esc(labelText)}</span>`;
                }
                return `<span class="inline-mention-chip" contenteditable="false" data-mention-kind="${kind}"${idAttr}>${esc(labelText)}</span>`;
            }
            if (child.classList?.contains('inline-math')) {
                const tex = (child.getAttribute('data-tex') || child.textContent || '').trim();
                if (!tex) return '';
                return `<span class="inline-math" contenteditable="false" data-tex="${esc(tex)}">${esc(tex)}</span>`;
            }
            if (!content) return '';
            const attrs = [];
            const tc = child.getAttribute('data-text-color');
            if (tc && ALLOWED_INLINE_COLOR_KEYS.has(tc)) attrs.push(`data-text-color="${esc(tc)}"`);
            const bc = child.getAttribute('data-bg-color');
            if (bc && ALLOWED_INLINE_COLOR_KEYS.has(bc)) attrs.push(`data-bg-color="${esc(bc)}"`);
            const tcase = child.getAttribute('data-text-case');
            if (tcase && ALLOWED_INLINE_CASE_KEYS.has(tcase)) attrs.push(`data-text-case="${esc(tcase)}"`);
            const fontKey = child.getAttribute('data-font');
            if (fontKey && /^[a-zA-Z0-9 _:-]{1,64}$/.test(fontKey)) attrs.push(`data-font="${esc(fontKey)}"`);
            return attrs.length ? `<span ${attrs.join(' ')}>${content}</span>` : content;
        }
        return `<${tag.toLowerCase()}>${content}</${tag.toLowerCase()}>`;
    }).join('');
    return walk(doc.body);
}
function inlineMarkdownAtCaret(el) { const selection=getSelection();if(!selection?.rangeCount)return false;const active=selection.getRangeAt(0),node=active.startContainer,offset=active.startOffset;if(node.nodeType!==Node.TEXT_NODE)return false;const before=node.textContent.slice(0,offset),match=before.match(/(\*\*([^*]+)\*\*|\*([^*]+)\*|~~([^~]+)~~|`([^`]+)`)\s$/);if(!match)return false;const tag=match[2]?'strong':match[3]?'em':match[4]?'del':'code',content=match[2]||match[3]||match[4]||match[5],start=offset-match[0].length,suffix=node.textContent.slice(offset),parent=node.parentNode;if(start<0||!parent)return false;const formatted=document.createElement(tag);formatted.textContent=content;const space=document.createTextNode(' '),tail=suffix?document.createTextNode(suffix):null;node.textContent=node.textContent.slice(0,start);parent.insertBefore(formatted,node.nextSibling);parent.insertBefore(space,formatted.nextSibling);if(tail)parent.insertBefore(tail,space.nextSibling);const caret=document.createRange();caret.setStartAfter(space);caret.collapse(true);selection.removeAllRanges();selection.addRange(caret);return true}
function renderNav() { const nav=$('#page-list');nav.replaceChildren();state.expandedPageIds=state.expandedPageIds||[];const section=(label)=>{const wrap=document.createElement('section');wrap.className='outline-section';const heading=document.createElement('div');heading.className='nav-label';heading.textContent=label;const list=document.createElement('div');wrap.append(heading,list);nav.append(wrap);return list};const favorites=section('FAVORITES'),pages=section('WORKSPACE PAGES');const hasChildren=p=>state.pages.some(x=>x.parentId===p.id&&!x.databaseId);const addRow=(p,container,depth=0,tree=false)=>{const navPerms=resolvePagePermissions(p);const isLockedNav=!navPerms.view||!!p.permissions?.noOneAccess;const row=document.createElement('div');row.className='page-nav'+(p.id===state.activePageId?' active':'')+(p.pageKind==='database'?' is-database-nav':'')+(p.pageKind==='board'?' is-board-nav':'')+(isLockedNav?' is-locked':'');row.style.paddingLeft=`${7+depth*13}px`;const children=hasChildren(p);const arrow=document.createElement('button');arrow.type='button';arrow.className='page-expand'+(state.expandedPageIds.includes(p.id)?' expanded':'');arrow.textContent=children?'›':'';arrow.setAttribute('aria-label',state.expandedPageIds.includes(p.id)?'Collapse subpages':'Expand subpages');arrow.onclick=e=>{e.stopPropagation();if(!children)return;state.expandedPageIds.includes(p.id)?state.expandedPageIds=state.expandedPageIds.filter(id=>id!==p.id):state.expandedPageIds.push(p.id);save();renderNav()};const icon=document.createElement('span');icon.className='page-icon';icon.innerHTML=pageIconMarkup(p.icon);const title=document.createElement('span');title.className='page-title';title.textContent=p.title;const more=document.createElement('button');more.type='button';more.className='page-more';more.title='Page actions';more.textContent='•••';more.onclick=e=>{e.stopPropagation();pageMenu(p,e.currentTarget)};row.append(arrow,icon,title);if(isLockedNav){const lk=document.createElement('span');lk.className='page-lock-badge';lk.title='Restricted permissions';lk.textContent='🔒';row.append(lk);}row.append(more);row.setAttribute('role','link');row.tabIndex=0;row.onclick=e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();openPageInNewTab(p.id);return;}navigateToPage(p.id)};row.onauxclick=e=>{if(e.button===1&&!e.target.closest('.page-more,.page-expand')){e.preventDefault();openPageInNewTab(p.id)}};row.addEventListener('mousedown',e=>{if(e.button===1&&!e.target.closest('.page-more,.page-expand'))e.preventDefault()});row.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();pageMenu(p,e)};row.onkeydown=e=>{if(e.target!==row)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();navigateToPage(p.id)}else if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){e.preventDefault();pageMenu(p,e.currentTarget)}};container.append(row);if(tree&&children&&state.expandedPageIds.includes(p.id))state.pages.filter(x=>x.parentId===p.id&&!x.databaseId).forEach(child=>addRow(child,container,depth+1,true))};state.pages.filter(p=>p.favorite).sort((a,b)=>a.title.localeCompare(b.title)).forEach(p=>addRow(p,favorites,0,true));state.pages.filter(p=>!p.parentId&&!p.databaseId).forEach(p=>addRow(p,pages,0,true));const ws=$('#workspace-access');if(ws){ws.innerHTML='';const button=document.createElement('button');button.type='button';button.className='workspace-access-item';const monogram=esc((state.workspaceName||'N').trim().charAt(0).toUpperCase()||'N');button.innerHTML=`<span class="workspace-access-icon">${monogram}</span><span>${esc(state.workspaceName)}</span><span class="workspace-access-arrow">⌄</span>`;button.title='Switch or create workspace';button.setAttribute('aria-haspopup','menu');button.onclick=e=>{e.stopPropagation();openWorkspaceDropdown(button)};ws.append(button)}}
function renderBreadcrumbs(p) { const target = $('#breadcrumbs'); target.replaceChildren(); const wireCrumb = (btn, pageId) => { btn.dataset.pageId = pageId; btn.onclick = e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); openPageInNewTab(pageId); return; } navigateToPage(pageId); }; btn.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); }); btn.onauxclick = e => { if (e.button === 1) { e.preventDefault(); openPageInNewTab(pageId); } }; }; const ancestors = []; let node = p; while (node) { ancestors.unshift(node); node = node.parentId ? state.pages.find(page => page.id === node.parentId) : null; } ancestors.forEach((page, index) => { if (index > 0) { const separator = document.createElement('span'); separator.textContent = '›'; target.append(separator); } if (index === ancestors.length - 1) { const currentCrumb = document.createElement('strong'); currentCrumb.textContent = page.title; target.append(currentCrumb); } else { const crumb = document.createElement('button'); crumb.type = 'button'; crumb.className = 'breadcrumb-ancestor'; crumb.textContent = page.title; wireCrumb(crumb, page.id); target.append(crumb); } }); }
const resolvedAssetPreviewCache = new Map();
const resolvedCoverOriginalCache = new Map();
function pageHasCover(page) {
    return Boolean(page && (page.cover || page.coverAssetId));
}
function ensurePageCoverSlot() {
    let slot = $('#page-cover-slot');
    if (slot) return slot;
    const wrap = $('#editor-wrap');
    const main = wrap?.parentElement || document.querySelector('.main-area');
    if (!main) return null;
    slot = document.createElement('div');
    slot.id = 'page-cover-slot';
    slot.className = 'page-cover-slot';
    slot.hidden = true;
    if (wrap && wrap.parentElement === main) main.insertBefore(slot, wrap);
    else main.append(slot);
    return slot;
}
function render() {
    stopAllAudioPlayers();
    const p = current();
    if (!p) return;
    if (!p.blocks.length) { p.blocks.push(block('text')); save(); }
    const pagePerms = resolvePagePermissions(p);
    const ro = isReadOnlyMirror() || !pagePerms.view || !pagePerms.edit;
    updateSidebarModeBadge();
    renderTabs();
    renderNav();
    renderBreadcrumbs(p);

    // Preserve document height and scroll position across atomic fragment replacement
    const prevScrollX = window.scrollX;
    const prevScrollY = window.scrollY;
    const prevEditorHeight = editor.offsetHeight;
    if (prevEditorHeight > 0) editor.style.minHeight = `${prevEditorHeight}px`;

    const frag = document.createDocumentFragment();
    const isDbPage = typeof ArchitectDatabase !== 'undefined' && ArchitectDatabase.isDatabasePage(p);
    const isBoardPage = typeof ArchitectBoard !== 'undefined' && ArchitectBoard.isBoardPage(p);
    editor.contentEditable = 'false';
    editor.classList.toggle('is-database-page', isDbPage);
    editor.classList.toggle('is-board-page', isBoardPage);
    editor.classList.toggle('full-width', !!p.fullWidth || isDbPage || isBoardPage);
    editor.classList.toggle('is-readonly', ro);

    const editorWrap = $('#editor-wrap');
    const coverSlot = ensurePageCoverSlot();
    const setTopbarPageControlsHidden = (hide: boolean) => {
        const cmBtn = document.querySelector('[data-action="toggle-comments"]') as HTMLElement | null;
        const optBtn = document.querySelector('[data-action="page-options"]') as HTMLElement | null;
        const shareBtn = document.querySelector('.top-actions [data-action="share"]') as HTMLElement | null;
        if (cmBtn) cmBtn.hidden = hide;
        if (optBtn) optBtn.hidden = hide;
        if (shareBtn) shareBtn.hidden = hide;
        if (hide) {
            const drawer = $('#comments-drawer');
            const lane = $('#comment-margin-lane');
            const optMenu = $('#page-options-menu');
            if (drawer) drawer.hidden = true;
            if (lane) { lane.hidden = true; lane.replaceChildren(); }
            if (optMenu) optMenu.hidden = true;
            hideCommentPopover();
        }
    };
    if (!pagePerms.view) {
        setTopbarPageControlsHidden(true);
        if (coverSlot) { coverSlot.replaceChildren(); coverSlot.hidden = true; }
        editorWrap?.classList.remove('has-page-cover');
        const lockedCard = document.createElement('div');
        lockedCard.id = 'page-restricted-banner';
        lockedCard.contentEditable = 'false';
        const lockHeading = document.createElement('h2');
        lockHeading.textContent = pagePerms.noOneAccess ? '🔒 No one has access to this' : '🔒 Access restricted';
        const lockDesc = document.createElement('p');
        lockDesc.textContent = pagePerms.reason || 'You do not have View permission for this page.';
        const lockActs = document.createElement('div');
        lockActs.className = 'mode-hero-actions';
        const actor = getCurrentActorUser();
        if (!pagePerms.blocked && (userHasGlobalPerm('managePagePermissions', actor) || getUserHighestRank(actor) === 0)) {
            const manageBtn = document.createElement('button');
            manageBtn.type = 'button';
            manageBtn.className = 'share-button';
            manageBtn.textContent = 'Manage Permissions';
            manageBtn.onclick = () => openPagePermissionsDialog(p);
            lockActs.append(manageBtn);
        }
        lockedCard.append(lockHeading, lockDesc, lockActs);
        frag.append(lockedCard);
        editor.replaceChildren(frag);
        editor.style.minHeight = '';
        editor.onkeydown = null;
        updateHistoryControls();
        updatePageOptions();
        initFeatureRailIcons();
        syncAppModeUi();
        return;
    }
    setTopbarPageControlsHidden(false);
    let coverEl = null;
    if (coverSlot) coverSlot.replaceChildren();
    if (pageHasCover(p)) {
        const c = document.createElement('div');
        c.className = 'page-cover';
        c.contentEditable = 'false';
        const coverAsset = p.coverAssetId ? ArchitectBackend.readAssetCatalog().find(a => a.id === p.coverAssetId) : null;
        const cachedOrig = p.coverAssetId ? (resolvedCoverOriginalCache.get(p.coverAssetId) || '') : '';
        const cachedFallback = p.coverAssetId ? (resolvedAssetPreviewCache.get(p.coverAssetId) || '') : '';
        const isStaleInlineCover = !!(
            coverAsset &&
            typeof p.cover === 'string' &&
            p.cover &&
            ((coverAsset.previewDataUrl && p.cover === coverAsset.previewDataUrl) || p.cover.startsWith('architect-asset://previews/'))
        );
        const initialUrl = cachedOrig || (!isStaleInlineCover ? p.cover : '') || (coverAsset?.storageMode === 'local' ? (coverAsset.url || '') : '') || cachedFallback;
        if (initialUrl) c.style.backgroundImage = `url("${initialUrl}")`;
        if (coverAsset) {
            ArchitectBackend.resolveAssetOriginalUrl(coverAsset).then(async origUrl => {
                const finalUrl = origUrl || await ArchitectBackend.resolveAssetPreviewUrl(coverAsset);
                if (!finalUrl) return;
                if (origUrl) resolvedCoverOriginalCache.set(coverAsset.id, origUrl);
                else resolvedAssetPreviewCache.set(coverAsset.id, finalUrl);
                if (c.isConnected) {
                    c.style.backgroundImage = `url("${finalUrl}")`;
                    applyCoverBackground(c, p);
                }
            });
        }
        if (!ro) {
            const edit = document.createElement('button');
            edit.type = 'button'; edit.className = 'edit-cover'; edit.dataset.action = 'cover'; edit.textContent = 'Edit cover';
            edit.onclick = () => openCoverPicker(p);
            c.append(edit);
        }
        coverEl = c;
        if (coverSlot) {
            coverSlot.append(c);
            coverSlot.hidden = false;
            editorWrap?.classList.add('has-page-cover');
            applyCoverBackground(c, p);
        } else {
            editorWrap?.classList.remove('has-page-cover');
            frag.append(c);
        }
    } else if (coverSlot) {
        coverSlot.hidden = true;
        editorWrap?.classList.remove('has-page-cover');
    }

    const pageIcon = document.createElement('button');
    pageIcon.type = 'button'; pageIcon.className = 'page-icon-large';
    pageIcon.title = ro ? '' : 'Change icon'; pageIcon.setAttribute('aria-label', 'Change page icon');
    pageIcon.innerHTML = pageIconMarkup(p.icon);
    if (!ro) pageIcon.onclick = () => iconPicker(p);

    const titleRow = document.createElement('div');
    titleRow.className = 'page-title-row';
    titleRow.append(pageIcon);
    const title = document.createElement('h1');
    title.className = 'page-heading'; title.contentEditable = ro ? 'false' : 'true'; title.spellcheck = true; title.textContent = p.title;
    if (!ro) wireSingleLineField(title, () => { p.title = title.innerText; save(); renderTabs(); renderNav(); renderBreadcrumbs(p); });
    titleRow.append(title);
    frag.append(titleRow);

    if (pagePerms.noOneAccess && pagePerms.view) {
        const ownerBanner = document.createElement('div');
        ownerBanner.className = 'page-perm-readonly-banner';
        ownerBanner.contentEditable = 'false';
        ownerBanner.textContent = '🔒 Locked (Owner only) — No other workspace members have access to this page';
        frag.append(ownerBanner);
    } else if (pagePerms.view && !pagePerms.edit) {
        const roBanner = document.createElement('div');
        roBanner.className = 'page-perm-readonly-banner';
        roBanner.contentEditable = 'false';
        roBanner.textContent = isReadOnlyMirror() ? 'View-only mirror' : `View only — ${pagePerms.comment ? 'comments allowed, editing disabled' : 'editing and comments disabled'}`;
        frag.append(roBanner);
    }

    const bar = document.createElement('div');
    bar.className = 'page-toolbar';
    bar.contentEditable = 'false';
    const canCommentToolbar = !isReadOnlyMirror() && pagePerms.view && pagePerms.comment;
    bar.innerHTML = ro
        ? `<span class="edit-time">${isReadOnlyMirror() ? 'View-only mirror' : 'View only'}</span>${canCommentToolbar ? '<button data-action="add-top-comment">💬 Add comment</button>' : ''}${p.showWordCount ? `<span class="word-count">${countWords(p)} words</span>` : ''}`
        : `${pageHasCover(p) ? '' : '<button data-action="cover">＋ Add cover</button>'}<button data-action="icon">☺ ${p.icon ? 'Change icon' : 'Add icon'}</button>${canCommentToolbar ? '<button data-action="add-top-comment">💬 Add comment</button>' : ''}<button data-action="favorite">${p.favorite ? '★ Favorited' : '☆ Favorite'}</button><span class="edit-time">Edited just now</span>${p.showWordCount ? `<span class="word-count">${countWords(p)} words</span>` : ''}`;
    frag.append(bar);
    if (canCommentToolbar) {
        bar.querySelector('[data-action="add-top-comment"]')?.addEventListener('click', () => focusTopCommentComposer());
    }
    if (!ro) {
        bar.querySelector('[data-action="cover"]')?.addEventListener('click', () => openCoverPicker(p));
        bar.querySelector('[data-action="icon"]')?.addEventListener('click', () => iconPicker(p));
        bar.querySelector('[data-action="favorite"]')?.addEventListener('click', () => { p.favorite = !p.favorite; save(); render(); });
    }

    const props = renderProperties(p);
    props.contentEditable = 'false';
    frag.append(props);

    const topComments = document.createElement('section');
    topComments.className = 'page-top-comments';
    topComments.contentEditable = 'false';
    frag.append(topComments);

    if (isDbPage) {
        const dbStage = document.createElement('section');
        dbStage.className = 'database-page-stage';
        dbStage.contentEditable = 'false';
        ArchitectDatabase.renderDatabaseWidget(dbStage, p);
        frag.append(dbStage);
    } else if (isBoardPage) {
        const boardStage = document.createElement('section');
        boardStage.className = 'board-page-stage';
        boardStage.contentEditable = 'false';
        ArchitectBoard.renderBoardWidget(boardStage, p);
        frag.append(boardStage);
    } else {
        const blockStage = document.createElement('div'); blockStage.className = 'block-stage';
        const blockEditor = document.createElement('div'); blockEditor.className = 'block-editor';
        blockEditor.contentEditable = ro ? 'false' : 'true';
        renderBlockList(blockEditor, p.blocks, p, null);
        const endSpace = document.createElement('div');
        endSpace.className = 'editor-end'; endSpace.contentEditable = 'false'; endSpace.setAttribute('aria-label', 'Click to add a block');
        if (!ro) endSpace.onclick = () => { pushUndoBeforeEdit(p); const next = block('text'); p.blocks.push(next); save(); render(); focusBlockById(next.id); };
        blockEditor.append(endSpace);
        const commentBadges = document.createElement('div');
        commentBadges.className = 'comment-gutter-badges';
        commentBadges.contentEditable = 'false';
        const rail = createBlockRail(p);
        blockStage.append(blockEditor, commentBadges, rail);
        if (!ro) {
            blockEditor.addEventListener('mousemove', e => { const b = resolveHoveredBlock(e.target, e.clientX, e.clientY); if (b) showBlockRail(b); });
            blockStage.addEventListener('mouseleave', () => { if (!activeMenu?.classList.contains('block-actions')) rail.hidden = true; });
        }
        frag.append(blockStage);
    }

    editor.replaceChildren(frag);
    if (coverEl) applyCoverBackground(coverEl, p);
    editor.style.minHeight = '';
    window.scrollTo({ top: prevScrollY, left: prevScrollX, behavior: 'auto' });

    editor.onkeydown = ro ? null : editorKeys;
    if (!typingBurstOpen) lastStablePageState.set(p.id, snapshotForPage(p));
    updateHistoryControls();
    updatePageOptions();
    syncCommentViews();
    if (typeof ArchitectToolbar !== 'undefined') {
        ArchitectToolbar.syncCustomFontStyles();
        ArchitectToolbar.renderToolbar();
        ArchitectToolbar.updateToolbarState();
    }
    initFeatureRailIcons();
    syncAppModeUi();
}
/** Render collapsible Page properties panel (closed to heading + arrow by default, including Description). */
function renderProperties(p) {
    const ro = effectivePageReadOnly(p);
    const parentDb = p.databaseId ? state.pages.find(x => x.id === p.databaseId && ArchitectDatabase.isDatabasePage(x)) : null;
    const open = parentDb ? (p.propertiesOpen !== false) : !!p.propertiesOpen;
    const panel = document.createElement('section');
    panel.className = 'property-panel' + (open ? '' : ' is-collapsed');

    const heading = document.createElement('div');
    heading.className = 'property-heading';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'property-toggle';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', 'Toggle page properties');
    toggle.innerHTML = `<span class="property-arrow" aria-hidden="true">›</span><span>${parentDb ? 'Database properties' : 'Page properties'}</span>`;

    let add = null;
    if (!ro) {
        add = document.createElement('button');
        add.type = 'button';
        add.className = 'property-add';
        add.textContent = '＋ Add a property';
        add.hidden = !open;
        add.onclick = () => {
            const name = prompt('Property name', 'Status');
            if (!name?.trim()) return;
            const type = (prompt('Type: text, status, select, date, number, person, url, email, phone, checkbox, files', 'status') || 'text').toLowerCase();
            const allowed = ['text', 'status', 'select', 'date', 'number', 'person', 'url', 'email', 'phone', 'checkbox', 'files'];
            const selected = allowed.includes(type) ? type : 'text';
            p.properties = p.properties || [];
            p.properties.push({ id: id(), name: name.trim(), type: selected, value: selected === 'checkbox' ? false : '', options: ['status', 'select'].includes(selected) ? ['Not started', 'In progress', 'Done'] : undefined });
            p.propertiesOpen = true;
            save();
            render();
        };
    }

    const body = document.createElement('div');
    body.className = 'property-body';
    body.hidden = !open;

    const rows = document.createElement('div');
    rows.className = 'property-rows';

    const descRow = document.createElement('label');
    descRow.className = 'property-row property-row-desc';
    const descLabel = document.createElement('span');
    descLabel.className = 'property-name';
    descLabel.textContent = 'Description';
    const descInput = document.createElement('textarea');
    descInput.rows = 1;
    descInput.className = 'property-desc-input';
    descInput.placeholder = ro ? 'No description' : 'Add a description…';
    descInput.value = p.description || '';
    descInput.disabled = ro;
    const fitDescHeight = () => {
        descInput.style.height = 'auto';
        descInput.style.height = `${Math.max(30, descInput.scrollHeight)}px`;
    };
    if (!ro) {
        descInput.addEventListener('keydown', event => {
            if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); focusBlockAt(0); }
        });
        descInput.addEventListener('input', () => {
            const flat = descInput.value.replace(/[\r\n]+/g, ' ');
            if (flat !== descInput.value) descInput.value = flat;
            p.description = flat;
            fitDescHeight();
            save();
        });
    }
    descRow.append(descLabel, descInput);
    rows.append(descRow);

    toggle.onclick = () => {
        const curOpen = parentDb ? (p.propertiesOpen !== false) : !!p.propertiesOpen;
        const nextOpen = !curOpen;
        p.propertiesOpen = nextOpen;
        panel.classList.toggle('is-collapsed', !nextOpen);
        toggle.setAttribute('aria-expanded', String(nextOpen));
        body.hidden = !nextOpen;
        if (add) add.hidden = !nextOpen;
        if (nextOpen) requestAnimationFrame(fitDescHeight);
        if (!ro) save();
    };
    if (open) requestAnimationFrame(fitDescHeight);

    heading.append(toggle);
    if (add && !parentDb) heading.append(add);
    panel.append(heading);
    if (parentDb) {
        body.prepend(ArchitectDatabase.renderRowDatabaseProperties(p, parentDb));
    }
    (p.properties || []).forEach(prop => {
        const row = document.createElement('label');
        row.className = 'property-row';
        const name = document.createElement('span');
        name.className = 'property-name';
        name.textContent = prop.name;
        let input;
        if (prop.type === 'checkbox') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = !!prop.value;
            input.disabled = ro;
            if (!ro) input.onchange = () => { prop.value = input.checked; save(); };
        } else if (prop.type === 'status' || prop.type === 'select' || prop.type === 'person') {
            input = document.createElement('select');
            const options = prop.type === 'person' ? state.users.map(u => u.name) : (prop.options || ['Option 1', 'Option 2']);
            input.innerHTML = '<option value="">Empty</option>';
            options.forEach(option => {
                const item = document.createElement('option');
                item.value = option;
                item.textContent = option;
                input.append(item);
            });
            input.value = String(prop.value || '');
            input.disabled = ro;
            if (!ro) input.onchange = () => { prop.value = input.value; save(); };
        } else {
            input = document.createElement('input');
            input.type = prop.type === 'date' ? 'date' : prop.type === 'number' ? 'number' : prop.type === 'email' ? 'email' : prop.type === 'url' ? 'url' : 'text';
            input.value = String(prop.value ?? '');
            input.placeholder = prop.type;
            input.disabled = ro;
            if (!ro) input.oninput = () => { prop.value = input.type === 'number' && input.value !== '' ? Number(input.value) : input.value; save(); };
        }
        row.append(name, input);
        rows.append(row);
    });
    body.append(rows);
    if (!parentDb && !(p.properties || []).length) {
        const empty = document.createElement('div');
        empty.className = 'property-empty';
        empty.textContent = ro ? 'No page properties on this page.' : 'Add typed fields such as status, date, person, number, or URL.';
        body.append(empty);
    }
    panel.append(body);
    return panel;
}
let dragScrollY = 0;
let railBlock = null;
let railBlockEl = null;
const listContextMap = new WeakMap();
function isToggleBlock(b) { return !!b && (b.type === 'toggle' || !!b.toggle); }
function isHeadingType(type) { return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(type); }
const MAX_LIST_INDENT = 8;
/** True for list item block types that support Tab/Shift+Tab subpoints (explicitly excluding toggle lists). */
function isIndentableListBlock(b) { return !!b && ['bullet', 'numbered', 'todo'].includes(b.type) && !isToggleBlock(b); }
function normalizedListIndent(b) {
    if (!isIndentableListBlock(b)) return 0;
    const n = Number(b.indent);
    return Number.isFinite(n) && n > 0 ? Math.min(MAX_LIST_INDENT, Math.floor(n)) : 0;
}
function setBlockListIndent(b, indent) {
    if (!b) return;
    const next = isIndentableListBlock(b) ? Math.max(0, Math.min(MAX_LIST_INDENT, Math.floor(indent || 0))) : 0;
    b.indent = next > 0 ? next : undefined;
}
function toAlphaIndex(n) {
    let num = Math.max(1, Math.floor(n)), out = '';
    while (num > 0) { num--; out = String.fromCharCode(97 + (num % 26)) + out; num = Math.floor(num / 26); }
    return out;
}
function toRomanIndex(n) {
    let num = Math.max(1, Math.floor(n)), out = '';
    if (num >= 4000) return String(num);
    const numerals = [[1000,'m'],[900,'cm'],[500,'d'],[400,'cd'],[100,'c'],[90,'xc'],[50,'l'],[40,'xl'],[10,'x'],[9,'ix'],[5,'v'],[4,'iv'],[1,'i']];
    for (const [val, sym] of numerals) { while (num >= val) { out += sym; num -= val; } }
    return out;
}
/** Compute parent-scoped numbered marker (1. -> a. -> i.) without letting deeper subpoints disturb outer counts. */
function numberedListMarker(list, index) {
    const indent = normalizedListIndent(list?.[index]);
    let count = 1;
    for (let k = index - 1; k >= 0; k--) {
        const prev = list[k];
        if (!isIndentableListBlock(prev)) break;
        const prevIndent = normalizedListIndent(prev);
        if (prevIndent < indent) break;
        if (prevIndent === indent) {
            if (prev.type !== 'numbered') break;
            count++;
        }
    }
    const mod = indent % 3;
    if (mod === 1) return toAlphaIndex(count);
    if (mod === 2) return toRomanIndex(count);
    return String(count);
}
function blockContext(blockEl) {
    const listEl = blockEl?.parentElement;
    const ctx = listEl ? listContextMap.get(listEl) : null;
    if (!ctx) return null;
    const index = Number(blockEl.dataset.index);
    const item = ctx.list[index];
    if (!item) return null;
    return { page: ctx.page, list: ctx.list, index, item, parentBlock: ctx.parentBlock, listEl };
}
function findBlockById(list, targetId, parentBlock = null) {
    for (let i = 0; i < (list || []).length; i++) {
        const item = list[i];
        if (item.id === targetId) return { list, index: i, item, parentBlock };
        if (item.children?.length) {
            const nested = findBlockById(item.children, targetId, item);
            if (nested) return nested;
        }
    }
    return null;
}
function blockContainsId(item, targetId) {
    if (!item) return false;
    if (item.id === targetId) return true;
    return (item.children || []).some(child => blockContainsId(child, targetId));
}
function ensureColumnBlocks(b) {
    b.children = b.children?.length ? b.children : [
        { id: id(), type: 'text', text: '', children: [block('text', '')] },
        { id: id(), type: 'text', text: '', children: [block('text', '')] }
    ];
    b.children.forEach(col => {
        if (!Array.isArray(col.children) || !col.children.length) {
            col.children = [{ id: id(), type: col.type && col.type !== 'text' ? col.type : 'text', text: col.text || '', html: col.html }];
            col.text = '';
            col.html = undefined;
        }
    });
    if (!Array.isArray(b.columnWidths) || b.columnWidths.length !== b.children.length) {
        b.columnWidths = Array(b.children.length).fill(100 / b.children.length);
    }
}
function normalizeColumnWidths(colList) {
    const count = colList.children?.length || 0;
    if (!count) { colList.columnWidths = []; return; }
    const widths = Array.isArray(colList.columnWidths) && colList.columnWidths.length === count ? colList.columnWidths : Array(count).fill(100 / count);
    const total = widths.reduce((sum, w) => sum + (Number(w) > 0 ? Number(w) : 0), 0);
    colList.columnWidths = total > 0 ? widths.map(w => (Math.max(5, Number(w) || 0) / total) * 100) : Array(count).fill(100 / count);
}
function findColumnHost(blocks, targetList) {
    for (let i = 0; i < (blocks || []).length; i++) {
        const item = blocks[i];
        if (item.type === 'columns' && Array.isArray(item.children)) {
            for (let c = 0; c < item.children.length; c++) {
                const col = item.children[c];
                if (col.children === targetList) return { outerList: blocks, colListIndex: i, colList: item, colIndex: c, col };
                const nested = findColumnHost(col.children, targetList);
                if (nested) return nested;
            }
        } else if (item.children?.length) {
            const nested = findColumnHost(item.children, targetList);
            if (nested) return nested;
        }
    }
    return null;
}
function pruneEmptyColumn(page, list) {
    if (list.length) return null;
    const host = findColumnHost(page.blocks, list);
    if (!host) {
        if (list === page.blocks) { const fallback = block('text'); list.push(fallback); return fallback.id; }
        return null;
    }
    host.colList.children.splice(host.colIndex, 1);
    if (Array.isArray(host.colList.columnWidths)) host.colList.columnWidths.splice(host.colIndex, 1);
    if (host.colList.children.length >= 2) {
        normalizeColumnWidths(host.colList);
        const neighbor = host.colList.children[Math.max(0, host.colIndex - 1)] || host.colList.children[0];
        return neighbor?.children?.[neighbor.children.length - 1]?.id || null;
    }
    if (host.colList.children.length === 1) {
        const remaining = host.colList.children[0].children?.length ? host.colList.children[0].children : [block('text')];
        host.outerList.splice(host.colListIndex, 1, ...remaining);
        return remaining[0]?.id || null;
    }
    host.outerList.splice(host.colListIndex, 1);
    return pruneEmptyColumn(page, host.outerList);
}
function insertColumnIntoList(colList, colIndex, blocksToInsert) {
    const newCol = { id: id(), type: 'text', text: '', children: blocksToInsert?.length ? blocksToInsert : [block('text')] };
    const existingCount = colList.children.length;
    const insertAt = Math.max(0, Math.min(existingCount, colIndex));
    colList.children.splice(insertAt, 0, newCol);
    const nextCount = colList.children.length;
    if (Array.isArray(colList.columnWidths) && colList.columnWidths.length === existingCount && existingCount > 0) {
        const scale = existingCount / nextCount;
        colList.columnWidths = colList.columnWidths.map(w => w * scale);
        colList.columnWidths.splice(insertAt, 0, 100 / nextCount);
        normalizeColumnWidths(colList);
    } else {
        colList.columnWidths = Array(nextCount).fill(100 / nextCount);
    }
    return newCol.children[0]?.id || null;
}
function insertColumnNextToBlock(page, targetItem, side, blocksToInsert) {
    const found = findBlockById(page.blocks, targetItem.id);
    if (!found) return null;
    if (targetItem.type === 'columns') {
        ensureColumnBlocks(targetItem);
        return insertColumnIntoList(targetItem, side === 'left' ? 0 : targetItem.children.length, blocksToInsert);
    }
    const host = findColumnHost(page.blocks, found.list);
    if (host) {
        return insertColumnIntoList(host.colList, side === 'left' ? host.colIndex : host.colIndex + 1, blocksToInsert);
    }
    const newBlocks = blocksToInsert?.length ? blocksToInsert : [block('text')];
    const leftChildren = side === 'left' ? newBlocks : [targetItem];
    const rightChildren = side === 'left' ? [targetItem] : newBlocks;
    const cols = {
        id: id(), type: 'columns', text: '',
        children: [
            { id: id(), type: 'text', text: '', children: leftChildren },
            { id: id(), type: 'text', text: '', children: rightChildren }
        ],
        columnWidths: [50, 50]
    };
    found.list.splice(found.index, 1, cols);
    return newBlocks[0]?.id || null;
}
function gridTemplateForWidths(widths) {
    return widths.map((w, idx) => idx < widths.length - 1 ? `minmax(0, ${w}fr) 10px` : `minmax(0, ${w}fr)`).join(' ');
}
const undoStacks = new Map();
const redoStacks = new Map();
const lastStablePageState = new Map();
let typingUndoTimer = 0;
let typingBurstOpen = false;
function captureCaretSnapshot() {
    const blockEl = activeBlockFromSelection();
    if (!blockEl) return null;
    const target = editableTarget(blockEl);
    const selection = getSelection();
    if (!target || !selection?.rangeCount || !target.contains(selection.getRangeAt(0).startContainer)) {
        return { blockId: blockEl.dataset.blockId, offset: 0 };
    }
    const range = selection.getRangeAt(0);
    const prefix = document.createRange();
    prefix.selectNodeContents(target);
    prefix.setEnd(range.startContainer, range.startOffset);
    const offset = (prefix.toString() || '').replace(/\u200b/g, '').length;
    return { blockId: blockEl.dataset.blockId, offset };
}
function snapshotForPage(page = current(), blocksJsonOverride = null, caret = null) {
    return {
        blocksJson: blocksJsonOverride ?? JSON.stringify(page.blocks),
        title: page.title,
        description: page.description || '',
        caret: caret ?? captureCaretSnapshot()
    };
}
function pushUndoBeforeEdit(page = current()) {
    if (!page) return;
    page.lastEditedBy = getActorDisplayName();
    clearTimeout(typingUndoTimer);
    typingBurstOpen = false;
    const snap = snapshotForPage(page);
    const stack = undoStacks.get(page.id) || [];
    if (stack[stack.length - 1]?.blocksJson !== snap.blocksJson || stack[stack.length - 1]?.title !== snap.title || stack[stack.length - 1]?.description !== snap.description) {
        stack.push(snap);
        if (stack.length > 100) stack.shift();
        undoStacks.set(page.id, stack);
    }
    redoStacks.set(page.id, []);
    lastStablePageState.set(page.id, snap);
}
function noteTypingBurstUndo(page = current()) {
    if (!page) return;
    page.lastEditedBy = getActorDisplayName();
    if (!typingBurstOpen) {
        const baseline = lastStablePageState.get(page.id) || snapshotForPage(page);
        if (!baseline.caret) baseline.caret = captureCaretSnapshot();
        const stack = undoStacks.get(page.id) || [];
        if (stack[stack.length - 1]?.blocksJson !== baseline.blocksJson) {
            stack.push(baseline);
            if (stack.length > 100) stack.shift();
            undoStacks.set(page.id, stack);
        }
        redoStacks.set(page.id, []);
        typingBurstOpen = true;
    }
    clearTimeout(typingUndoTimer);
    typingUndoTimer = window.setTimeout(() => {
        typingBurstOpen = false;
        lastStablePageState.set(page.id, snapshotForPage(page));
    }, 650);
}
function applyHistorySnapshot(page, snap) {
    if (!page || !snap) return;
    page.blocks = JSON.parse(snap.blocksJson);
    page.title = snap.title;
    page.description = snap.description;
    typingBurstOpen = false;
    clearTimeout(typingUndoTimer);
    lastStablePageState.set(page.id, snapshotForPage(page, snap.blocksJson, snap.caret));
    save();
    render();
    if (snap.caret?.blockId) {
        const targetEl = editor.querySelector(`[data-block-id="${CSS.escape(snap.caret.blockId)}"]`);
        if (targetEl) {
            setActiveEditorBlock(targetEl);
            const target = editableTarget(targetEl);
            if (target?.isContentEditable) setCaretAtTextOffset(target, snap.caret.offset || 0);
            return;
        }
    }
    focusBlockAt(0);
}
function undoPageEdit() {
    const page = current();
    const stack = undoStacks.get(page?.id);
    if (!page || !stack?.length) return false;
    const currentSnap = snapshotForPage(page);
    const prev = stack.pop();
    const redo = redoStacks.get(page.id) || [];
    redo.push(currentSnap);
    redoStacks.set(page.id, redo);
    applyHistorySnapshot(page, prev);
    return true;
}
function redoPageEdit() {
    const page = current();
    const stack = redoStacks.get(page?.id);
    if (!page || !stack?.length) return false;
    const currentSnap = snapshotForPage(page);
    const next = stack.pop();
    const undo = undoStacks.get(page.id) || [];
    undo.push(currentSnap);
    undoStacks.set(page.id, undo);
    applyHistorySnapshot(page, next);
    return true;
}
function renderBlockList(container, list, page, parentBlock = null) {
    container.classList.add('block-list');
    listContextMap.set(container, { list, page, parentBlock });
    container.replaceChildren();
    list.forEach((item, index) => container.append(renderBlock(page, item, index, list)));
}
function findVerticalBlockMatch(blocks, clientY) {
    let best = null;
    let bestDist = Infinity;
    for (const child of blocks) {
        const rect = child.getBoundingClientRect();
        if (clientY >= rect.top - 3 && clientY <= rect.bottom + 3) return child;
        const dist = clientY < rect.top ? rect.top - clientY : clientY - rect.bottom;
        if (dist < bestDist) { bestDist = dist; best = child; }
    }
    return bestDist <= 18 ? best : null;
}
function descendContainerBlock(blockEl, target, clientX, clientY) {
    if (!blockEl) return null;
    if (blockEl.classList.contains('is-toggle') && blockEl.classList.contains('expanded')) {
        const copyEl = blockEl.querySelector(':scope > .block-copy');
        const arrowEl = blockEl.querySelector(':scope > .toggle-arrow');
        const headerBottom = Math.max(copyEl?.getBoundingClientRect().bottom || 0, arrowEl?.getBoundingClientRect().bottom || 0);
        if (clientY > headerBottom + 2) {
            const contentEl = blockEl.querySelector(':scope > .toggle-content');
            const children = contentEl ? [...contentEl.querySelectorAll(':scope > .block')] : [];
            const match = findVerticalBlockMatch(children, clientY);
            if (match) return descendContainerBlock(match, target, clientX, clientY);
        }
        return blockEl;
    }
    if (blockEl.classList.contains('columns')) {
        if (target?.closest?.('.column-resizer')) return blockEl;
        const cells = [...blockEl.querySelectorAll(':scope > .column-grid > .column-cell')];
        if (!cells.length) return blockEl;
        let cell = cells.find(c => {
            const r = c.getBoundingClientRect();
            return clientX >= r.left - 4 && clientX <= r.right + 4;
        });
        if (!cell) {
            const railInThisCols = railBlockEl?.closest?.('.column-cell');
            if (railInThisCols && cells.includes(railInThisCols)) cell = railInThisCols;
            else if (clientX < cells[0].getBoundingClientRect().left) cell = cells[0];
        }
        if (cell) {
            const children = [...(cell.querySelector(':scope > .block-list')?.querySelectorAll(':scope > .block') || [])];
            const match = findVerticalBlockMatch(children, clientY);
            if (match) return descendContainerBlock(match, target, clientX, clientY);
        }
    }
    return blockEl;
}
function resolveHoveredBlock(target, clientX, clientY) {
    let candidate = target?.closest?.('.block') || null;
    if (!candidate) {
        const blockEditor = editor.querySelector('.block-editor');
        const topBlocks = blockEditor ? [...blockEditor.querySelectorAll(':scope > .block')] : [];
        candidate = findVerticalBlockMatch(topBlocks, clientY);
    }
    return candidate ? descendContainerBlock(candidate, target, clientX, clientY) : null;
}
function showBlockRail(blockEl) {
    const stage = editor.querySelector('.block-stage');
    const rail = editor.querySelector('.block-rail');
    if (!rail || !stage || !blockEl) { if (rail) rail.hidden = true; return; }
    const ctx = blockContext(blockEl);
    if (!ctx) { rail.hidden = true; return; }
    railBlock = ctx.item;
    railBlockEl = blockEl;
    const stageRect = stage.getBoundingClientRect();
    const blockRect = blockEl.getBoundingClientRect();
    const offset = blockEl.classList.contains('h1') ? 12 : blockEl.classList.contains('h2') ? 8 : blockEl.classList.contains('h3') ? 5 : blockEl.classList.contains('h4') ? 3 : blockEl.classList.contains('callout') ? 11 : 2;
    rail.style.top = `${blockRect.top - stageRect.top + offset}px`;
    const relLeft = blockRect.left - stageRect.left;
    const inColumn = !!blockEl.closest('.column-cell');
    const showInColumn = inColumn && relLeft > 40;
    rail.classList.toggle('in-column', showInColumn);
    rail.style.left = `${showInColumn ? relLeft - 46 : -50}px`;
    rail.hidden = false;
}
function createBlockRail(p) {
    const rail = document.createElement('div');
    rail.className = 'block-rail';
    rail.contentEditable = 'false';
    rail.hidden = true;
    const add = document.createElement('button');
    add.type = 'button'; add.className = 'block-add'; add.contentEditable = 'false'; add.draggable = false;
    add.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    add.title = 'Click to add below. Alt-click to add a block above';
    add.setAttribute('aria-label', 'Click to add below. Alt-click to add a block above');
    add.onclick = event => {
        event.preventDefault(); event.stopPropagation();
        if (!railBlock) return;
        const found = findBlockById(p.blocks, railBlock.id);
        if (!found) return;
        pushUndoBeforeEdit(p);
        const at = event.altKey ? found.index : found.index + 1;
        const created = block('text');
        found.list.splice(at, 0, created);
        save(); render();
        requestAnimationFrame(() => focusBlockById(created.id));
    };
    const handle = document.createElement('button');
    handle.type = 'button'; handle.className = 'block-handle'; handle.contentEditable = 'false'; handle.draggable = true;
    handle.setAttribute('aria-label', 'Drag to move, click to open menu'); handle.setAttribute('aria-haspopup', 'menu');
    handle.title = 'Drag to move, click to open menu'; handle.textContent = '';
    const captureDragSelection = () => { pendingDragIds = railBlock ? selectedBlockIdsForHandle(railBlock) : []; };
    handle.addEventListener('pointerdown', captureDragSelection);
    handle.addEventListener('mousedown', captureDragSelection);
    handle.onclick = event => { event.preventDefault(); event.stopPropagation(); pendingDragIds = []; if (railBlock) showBlockMenu(p, railBlock, handle); };
    handle.oncontextmenu = event => { event.preventDefault(); event.stopPropagation(); pendingDragIds = []; if (railBlock) showBlockMenu(p, railBlock, handle); };
    handle.addEventListener('dragstart', event => {
        if (!railBlock) return;
        dragScrollY = window.scrollY;
        const ids = pendingDragIds.length ? pendingDragIds : selectedBlockIdsForHandle(railBlock);
        const dragPayload = ids.length > 1 ? JSON.stringify(ids) : ids[0];
        event.dataTransfer.setData('text/plain', dragPayload);
        event.dataTransfer.effectAllowed = 'move';
        ids.forEach(did => editor.querySelector(`[data-block-id="${CSS.escape(did)}"]`)?.classList.add('dragging'));
    });
    handle.addEventListener('dragend', () => {
        editor.querySelectorAll('.block.dragging').forEach(node => node.classList.remove('dragging'));
        pendingDragIds = [];
        clearDropIndicators();
        window.scrollTo({ top: dragScrollY, left: window.scrollX });
    });
    rail.append(add, handle);
    return rail;
}
function selectedBlockIdsForHandle(handleBlock) {
    if (!handleBlock) return [];
    const selection = getSelection();
    const handleEl = editor.querySelector(`[data-block-id="${CSS.escape(handleBlock.id)}"]`);
    const listEl = handleEl?.parentElement;
    const ctx = listEl ? listContextMap.get(listEl) : null;
    if (!selection?.rangeCount || selection.isCollapsed || !listEl || !ctx) return [handleBlock.id];
    const range = selection.getRangeAt(0);
    const items = [...listEl.children].filter(el => el.classList?.contains('block'));
    const selected = items.filter(el => {
        if (!range.intersectsNode(el)) return false;
        const anchor = editableTarget(el);
        if (range.endContainer === anchor && range.endOffset === 0 && range.startContainer !== anchor) return false;
        if (range.endContainer.nodeType === Node.TEXT_NODE && range.endOffset === 0 && el.contains(range.endContainer) && !el.contains(range.startContainer)) {
            const pre = document.createRange(); pre.selectNodeContents(anchor); pre.setEnd(range.endContainer, 0);
            if (!pre.toString().replace(/\u200b/g, '')) return false;
        }
        return true;
    });
    const ids = selected.map(el => el.dataset.blockId).filter(Boolean);
    return ids.length > 1 && ids.includes(handleBlock.id) ? ids : [handleBlock.id];
}
function readDragBlockIds(dt) {
    const raw = dt?.getData('text/plain') || '';
    if (!raw) return [];
    if (raw.startsWith('[')) {
        try { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) return parsed.filter(x => typeof x === 'string'); } catch {}
    }
    return [raw];
}
function extractBlocksForDrop(p, dragIds, targetItem, targetList = null, insertAt = 0) {
    const sources = dragIds.map(did => findBlockById(p.blocks, did)).filter(Boolean);
    if (!sources.length) return null;
    if (targetItem && sources.some(s => s.item === targetItem || blockContainsId(s.item, targetItem.id))) return null;
    const unique = [];
    const seen = new Set();
    sources.forEach(s => { if (!seen.has(s.item.id)) { seen.add(s.item.id); unique.push(s); } });
    let adjustedInsertAt = insertAt;
    if (targetList) {
        unique.forEach(s => { if (s.list === targetList && s.index < insertAt) adjustedInsertAt--; });
    }
    const emptiedLists = [];
    const moved = unique.map(s => s.item);
    const byList = new Map();
    unique.forEach(s => {
        const arr = byList.get(s.list) || [];
        arr.push(s.index);
        byList.set(s.list, arr);
    });
    byList.forEach((indices, list) => {
        indices.sort((a, b) => b - a).forEach(idx => list.splice(idx, 1));
        if (!list.length) emptiedLists.push(list);
    });
    return { moved, adjustedInsertAt, emptiedLists };
}
function clearDropIndicators() {
    editor.querySelectorAll('.drop-target,.drop-before,.drop-after,.drop-left,.drop-right,.drop-inside').forEach(node => {
        node.classList.remove('drop-target', 'drop-before', 'drop-after', 'drop-left', 'drop-right', 'drop-inside');
    });
}
function dropZoneForBlock(el, event) {
    const rect = el.getBoundingClientRect();
    const inColumn = !!el.closest('.column-cell');
    const edge = el.classList.contains('columns') ? 32 : inColumn ? Math.min(22, rect.width * 0.22) : Math.min(44, rect.width * 0.22);
    if (event.clientX <= rect.left + edge) return 'left';
    if (event.clientX >= rect.right - edge) return 'right';
    return event.clientY > rect.top + rect.height / 2 ? 'after' : 'before';
}
function renderBlock(p, b, i, list = p.blocks) {
    const el = renderBlockContent(p, b, i, list);
    el.classList.toggle('is-empty', !(b.text || '').trim());
    if (b.color) el.dataset.textColor = b.color;
    if (b.bgColor) el.dataset.bgColor = b.bgColor;
    if (b.align && b.align !== 'left') el.dataset.align = b.align;
    if (b.font && b.font !== 'default') el.dataset.font = b.font;
    el.addEventListener('dragover', event => {
        if (!event.dataTransfer.types.includes('text/plain')) return;
        event.preventDefault(); event.stopPropagation();
        clearDropIndicators();
        const zone = dropZoneForBlock(el, event);
        el.classList.add(`drop-${zone}`);
    });
    el.addEventListener('dragleave', event => {
        if (!el.contains(event.relatedTarget)) el.classList.remove('drop-target', 'drop-before', 'drop-after', 'drop-left', 'drop-right');
    });
    el.addEventListener('drop', event => {
        event.preventDefault(); event.stopPropagation();
        const zone = dropZoneForBlock(el, event);
        clearDropIndicators();
        const dragIds = readDragBlockIds(event.dataTransfer);
        const target = blockContext(el);
        if (!target || !dragIds.length) return;
        const rawInsertAt = target.index + (zone === 'after' ? 1 : 0);
        pushUndoBeforeEdit(p);
        const extracted = extractBlocksForDrop(p, dragIds, target.item, (zone === 'before' || zone === 'after') ? target.list : null, rawInsertAt);
        if (!extracted) return;
        if (zone === 'left' || zone === 'right') {
            extracted.emptiedLists.forEach(srcList => { if (srcList !== target.list) pruneEmptyColumn(p, srcList); });
            insertColumnNextToBlock(p, target.item, zone, extracted.moved);
        } else {
            target.list.splice(Math.max(0, extracted.adjustedInsertAt), 0, ...extracted.moved);
            extracted.emptiedLists.forEach(srcList => { if (srcList !== target.list) pruneEmptyColumn(p, srcList); });
        }
        save(); render();
        const keep = dragScrollY || window.scrollY;
        window.scrollTo({ top: keep, left: window.scrollX });
        requestAnimationFrame(() => window.scrollTo({ top: keep, left: window.scrollX }));
    });
    return el;
}
function renderBlockContent(p, b, i, list = p.blocks) { const ro = effectivePageReadOnly(p); const el = document.createElement('div'); el.className = 'block ' + b.type + (isToggleBlock(b) ? ' is-toggle' : '') + (isToggleBlock(b) && b.open ? ' expanded' : ''); el.contentEditable = ro ? 'false' : 'true'; el.dataset.index = String(i); el.dataset.blockId = b.id; const listIndent = normalizedListIndent(b); if (listIndent > 0) {
    el.style.setProperty('--list-indent', String(listIndent));
    el.dataset.indent = String(listIndent);
    if (b.type === 'bullet') el.dataset.bulletLevel = String(listIndent % 3);
} if (b.type === 'numbered' && !isToggleBlock(b)) {
    el.dataset.listIndex = numberedListMarker(list, i);
} if (isToggleBlock(b)) {
    el.contentEditable = ro ? 'false' : 'true';
    el.innerHTML = `<button type="button" class="toggle-arrow" contenteditable="false" aria-label="Toggle section" aria-expanded="${!!b.open}">›</button><span class="block-copy"${ro ? ' contenteditable="false"' : ''}></span><div class="toggle-content"></div>`;
    const copy = el.querySelector(':scope > .block-copy');
    copy.dataset.placeholder = ro ? '' : (b.type === 'toggle' ? 'Toggle' : 'Toggle heading');
    copy.innerHTML = b.html ? cleanInlineHtml(b.html) : esc(b.text);
    hydrateInlineWidgets(copy, b, p, ro);
    if (!ro) wireText(copy, b, p);
    const content = el.querySelector(':scope > .toggle-content');
    content.hidden = !b.open;
    if (b.open) {
        if (!ro) b.children = b.children?.length ? b.children : [block('text')];
        if (b.children?.length) renderBlockList(content, b.children, p, b);
    }
    el.querySelector(':scope > .toggle-arrow').onclick = event => {
        event.stopPropagation();
        b.open = !b.open;
        if (!ro) {
            if (b.open && !b.children?.length) b.children = [block('text')];
            save();
        }
        render();
        if (!ro && b.open && b.children?.length) focusBlockById(b.children[0].id);
    };
    el.addEventListener('click', event => {
        if (ro || event.target.closest('button,.toggle-content')) return;
        if (!getSelection()?.isCollapsed) return;
        if (!copy.contains(event.target)) setCaretAtTextOffset(copy, (copy.innerText || '').replace(/\u200b/g, '').length);
    });
    return el;
} if (b.type === 'divider') {
    el.contentEditable = 'false';
    return el;
} if (b.type === 'page_link') {
    el.contentEditable = 'false';
    const target = state.pages.find(x => x.id === b.targetId);
    el.innerHTML = `<span class="page-link-icon">${pageIconMarkup(target?.icon)}</span><a href="${target ? esc(pageHref(target.id)) : '#'}" class="inline-page-link">${esc(target?.title || b.text || 'Missing page')}</a>`;
    const linkEl = el.querySelector('a');
    if (linkEl) {
        linkEl.onclick = e => { e.preventDefault(); if (!target) return; if (e.ctrlKey || e.metaKey) openPageInNewTab(target.id); else navigateToPage(target.id); };
        linkEl.onmousedown = e => { if (e.button === 1) e.preventDefault(); };
        linkEl.onauxclick = e => { if (e.button === 1) { e.preventDefault(); e.stopPropagation(); if (target) openPageInNewTab(target.id); } };
    }
    return el;
} if (b.type === 'mention') {
    el.contentEditable = 'false';
    const m = b.mentions?.[0];
    if (m?.kind === 'page') {
        const target = state.pages.find(page => page.id === m.id);
        el.className = 'block page_link';
        el.innerHTML = `<span class="page-link-icon">${pageIconMarkup(target?.icon)}</span><a href="${target ? esc(pageHref(target.id)) : '#'}" class="inline-page-link">${esc(target?.title || m.label)}</a>`;
        const linkEl = el.querySelector('a');
        if (linkEl) {
            linkEl.onclick = e => { e.preventDefault(); if (!target) return; if (e.ctrlKey || e.metaKey) openPageInNewTab(target.id); else navigateToPage(target.id); };
            linkEl.onmousedown = e => { if (e.button === 1) e.preventDefault(); };
            linkEl.onauxclick = e => { if (e.button === 1) { e.preventDefault(); e.stopPropagation(); if (target) openPageInNewTab(target.id); } };
        }
    } else el.innerHTML = m ? `<span class="mention-chip">@ ${esc(m.label)}</span>` : esc(b.text);
    return el;
} if (b.type === 'image') {
    el.contentEditable = 'false';
    const asset = findAssetForBlock(b);
    if (b.assetId && !asset) {
        el.append(buildMissingAssetElement(b, p, 'image'));
        return el;
    }
    if (!asset && !b.url) {
        el.innerHTML = ro ? '<div class="image-placeholder" aria-disabled="true">No image attached</div>' : '<button type="button" class="image-placeholder">Upload or pick image</button>';
        if (!ro) el.querySelector('button')?.addEventListener('click', () => uploadForBlock(b, p, 'image'));
        return el;
    }
    const displayName = asset?.name || b.text || 'Image';
    const cachedPreview = asset ? resolvedAssetPreviewCache.get(asset.id) : '';
    const fallbackPreview = cachedPreview || (asset?.storageMode === 'local' ? (asset?.url || '') : (asset?.previewDataUrl || b.url || ''));
    const dimAttrs = asset?.width && asset?.height ? ` width="${asset.width}" height="${asset.height}" style="width:auto;height:auto;max-width:100%;max-height:460px"` : '';
    const chips = [asset?.category || b.category, asset?.creator || b.creator, asset?.provider].filter(Boolean);
    el.innerHTML = `<div class="image-frame"><img class="content-image" src="${esc(fallbackPreview)}" alt="${esc(displayName)}"${dimAttrs}><div class="image-actions-bar"><button type="button" class="asset-pill-btn" data-img-expand title="Fullscreen high-quality preview">⤢ Fullscreen</button><button type="button" class="asset-pill-btn" data-img-download title="Download full-size file">↓ Download</button></div><div class="image-caption"><span>${esc(displayName)}</span><span class="asset-meta-chips">${chips.map(c => `<span class="asset-chip">${esc(String(c))}</span>`).join('')}</span></div></div>`;
    const imgEl = el.querySelector('img');
    if (asset) {
        ArchitectBackend.resolveAssetPreviewUrl(asset).then(url => {
            if (url) resolvedAssetPreviewCache.set(asset.id, url);
            if (url && imgEl.isConnected && imgEl.getAttribute('src') !== url) imgEl.src = url;
        });
    }
    const openLb = () => openImageLightbox(asset || { id: b.id, name: displayName, fileType: b.mimeType || 'image/*', category: b.category || 'image', creator: b.creator || 'Jordan Davis', uploadedBy: 'Jordan Davis', tags: b.tags || [], metadata: {}, storageMode: 'local', provider: 'Inline image', url: b.url, createdAt: Date.now(), updatedAt: Date.now() });
    imgEl.ondblclick = e => { e.preventDefault(); e.stopPropagation(); openLb(); };
    el.querySelector('[data-img-expand]').onclick = e => { e.stopPropagation(); openLb(); };
    el.querySelector('[data-img-download]').onclick = e => { e.stopPropagation(); downloadAssetOrBlock(asset, b, displayName); };
    return el;
} if (b.type === 'columns') {
    el.contentEditable = 'false';
    ensureColumnBlocks(b);
    el.replaceChildren();
    const grid = document.createElement('div');
    grid.className = 'column-grid';
    grid.style.gridTemplateColumns = gridTemplateForWidths(b.columnWidths);
    b.children.forEach((child, index) => {
        const col = document.createElement('div');
        col.className = 'column-cell';
        const listEl = document.createElement('div');
        listEl.contentEditable = ro ? 'false' : 'true';
        renderBlockList(listEl, child.children, p, b);
        col.append(listEl);
        col.addEventListener('click', event => {
            if (event.target !== col && event.target !== listEl) return;
            const last = child.children[child.children.length - 1];
            if (last) focusBlockById(last.id, false);
        });
        col.addEventListener('dragover', event => {
            if (!event.dataTransfer.types.includes('text/plain')) return;
            event.preventDefault(); event.stopPropagation();
            clearDropIndicators();
            const rc = col.getBoundingClientRect();
            const edge = Math.min(22, rc.width * 0.2);
            const z = event.clientX <= rc.left + edge ? 'before' : event.clientX >= rc.right - edge ? 'after' : 'inside';
            col.classList.add(`drop-${z}`);
        });
        col.addEventListener('drop', event => {
            if (!event.dataTransfer.types.includes('text/plain')) return;
            event.preventDefault(); event.stopPropagation();
            const rc = col.getBoundingClientRect();
            const edge = Math.min(22, rc.width * 0.2);
            const z = event.clientX <= rc.left + edge ? 'left' : event.clientX >= rc.right - edge ? 'right' : 'inside';
            clearDropIndicators();
            const dragIds = readDragBlockIds(event.dataTransfer);
            if (!dragIds.length) return;
            pushUndoBeforeEdit(p);
            const extracted = extractBlocksForDrop(p, dragIds, b, z === 'inside' ? child.children : null, child.children.length);
            if (!extracted) return;
            if (z === 'left' || z === 'right') {
                const targetIdx = b.children.indexOf(child);
                insertColumnIntoList(b, z === 'left' ? targetIdx : targetIdx + 1, extracted.moved);
            } else {
                child.children.push(...extracted.moved);
            }
            extracted.emptiedLists.forEach(srcList => { if (srcList !== child.children) pruneEmptyColumn(p, srcList); });
            save(); render();
        });
        grid.append(col);
        if (index < b.children.length - 1) {
            const resize = document.createElement('button');
            resize.type = 'button';
            resize.contentEditable = 'false';
            resize.className = 'column-resizer';
            resize.title = 'Drag to resize columns';
            resize.setAttribute('aria-label', `Resize column ${index + 1} and ${index + 2}`);
            resize.onpointerdown = event => {
                event.preventDefault();
                event.stopPropagation();
                pushUndoBeforeEdit(p);
                const rect = grid.getBoundingClientRect();
                const startX = event.clientX;
                const startLeft = b.columnWidths[index];
                const pairTotal = b.columnWidths[index] + b.columnWidths[index + 1];
                const minW = Math.min(18, pairTotal * 0.25);
                const move = next => {
                    const deltaPct = ((next.clientX - startX) / Math.max(1, rect.width)) * 100;
                    const first = Math.min(pairTotal - minW, Math.max(minW, startLeft + deltaPct));
                    b.columnWidths[index] = first;
                    b.columnWidths[index + 1] = pairTotal - first;
                    grid.style.gridTemplateColumns = gridTemplateForWidths(b.columnWidths);
                };
                const finish = next => {
                    move(next);
                    window.removeEventListener('pointermove', move);
                    window.removeEventListener('pointerup', finish);
                    save();
                };
                window.addEventListener('pointermove', move);
                window.addEventListener('pointerup', finish, { once: true });
            };
            grid.append(resize);
        }
    });
    el.append(grid);
    return el;
} if (b.type === 'toc') {
    el.contentEditable = 'false';
    el.innerHTML = '<strong>Table of contents</strong>';
    const collectHeadings = (blocks) => blocks.flatMap(x => [
        ...(isHeadingType(x.type) ? [x] : []),
        ...(x.children?.length ? collectHeadings(x.children) : [])
    ]);
    collectHeadings(p.blocks).forEach(h => {
        const a = document.createElement('button');
        a.className = 'toc-link';
        a.textContent = h.text || 'Untitled heading';
        a.onclick = () => focusLinkedBlock(h.id);
        el.append(a);
    });
    return el;
} if (b.type === 'breadcrumb') {
    el.contentEditable = 'false';
    let node = p;
    while (node) {
        const a = document.createElement('button');
        a.className = 'breadcrumb-link';
        a.textContent = node.title;
        a.onclick = () => navigateToPage(node.id);
        el.prepend(a);
        node = node.parentId ? state.pages.find(x => x.id === node.parentId) : undefined;
    }
    return el;
} if (b.type === 'button') {
    el.contentEditable = 'false';
    renderButtonBlock(el, b, p, ro);
    return el;
} if (b.type === 'todo') {
    el.contentEditable = ro ? 'false' : 'true';
    el.innerHTML = `<input type="checkbox" contenteditable="false" ${b.checked ? 'checked' : ''} ${ro ? 'disabled' : ''}><span class="block-copy"${ro ? ' contenteditable="false"' : ''}></span>`;
    const copy = el.querySelector(':scope > .block-copy');
    copy.innerHTML = b.html ? cleanInlineHtml(b.html) : esc(b.text);
    hydrateInlineWidgets(copy, b, p, ro);
    if (!ro) {
        el.querySelector('input').onchange = e => { pushUndoBeforeEdit(p); b.checked = e.target.checked; save(); render(); };
        wireText(copy, b, p);
    }
    el.addEventListener('click', event => { if (ro || event.target.closest('input')) return; if (!getSelection()?.isCollapsed) return; if (!copy.contains(event.target)) setCaretAtTextOffset(copy, (copy.innerText || '').replace(/\u200b/g, '').length); });
    return el;
} if (b.type === 'code') {
    renderCodeBlock(el, b, p, ro);
    return el;
} if (b.type === 'audio') {
    el.contentEditable = 'false';
    const asset = findAssetForBlock(b);
    if (b.assetId && !asset) {
        el.append(buildMissingAssetElement(b, p, 'audio'));
        return el;
    }
    if (!asset && !b.url) {
        el.innerHTML = ro ? '<div class="image-placeholder" aria-disabled="true">No audio attached</div>' : '<button type="button" class="image-placeholder">Upload audio or link from Asset library</button>';
        if (!ro) el.querySelector('button')?.addEventListener('click', () => uploadForBlock(b, p, 'audio'));
        return el;
    }
    const card = buildAudioPlayerElement(asset || { id: b.id, name: b.text || 'Audio track', fileType: b.mimeType || 'audio/*', category: b.category || 'music', creator: b.creator || 'Jordan Davis', uploadedBy: 'Jordan Davis', tags: b.tags || [], metadata: {}, storageMode: 'local', provider: 'Inline audio', url: b.url, externalUrl: /^https?:\/\//i.test(b.url || '') ? b.url : undefined, createdAt: Date.now(), updatedAt: Date.now() }, b);
    el.append(card);
    return el;
} if (['video', 'bookmark', 'embed', 'file', 'pdf'].includes(b.type)) {
    el.contentEditable = 'false';
    renderRichMediaLinkBlock(el, b, p, ro);
    return el;
} if (b.type === 'date') {
    el.contentEditable = 'false';
    const remAt = Number(b.remindAt) || 0;
    const cls = 'mention-chip date-reminder-btn' + (b.remindFired ? ' is-fired' : (remAt ? ' is-scheduled' : ''));
    const label = b.text || 'Choose date';
    const prefix = remAt && !b.remindFired ? '⏰ ' : '📅 ';
    el.innerHTML = `<button type="button" class="${cls}" ${ro ? 'disabled' : ''}>${prefix}${esc(label)}</button>`;
    if (!ro) {
        const btn = el.querySelector('button') as HTMLElement;
        btn.onclick = ev => {
            ev.stopPropagation();
            openReminderPickerPopover(btn, {
                date: b.remindDate || toLocalIsoDate(),
                time: b.remindTime || '',
                offset: b.remindOffset || 'at_time',
                remindAt: b.remindAt,
                fired: b.remindFired
            }, next => {
                pushUndoBeforeEdit(p);
                b.remindDate = next.date;
                b.remindTime = next.time || undefined;
                b.remindOffset = next.offset;
                b.remindAt = next.remindAt;
                b.remindFired = next.fired;
                b.text = next.label;
                save(); render();
            }, () => {
                pushUndoBeforeEdit(p);
                b.type = 'text';
                b.text = '';
                b.remindDate = b.remindTime = b.remindOffset = undefined;
                b.remindAt = undefined;
                b.remindFired = undefined;
                save(); render();
            });
        };
    }
    return el;
} if (b.type === 'equation') {
    el.contentEditable = 'false';
    const box = document.createElement('div');
    box.className = 'equation-block';
    const expr = (b.text || '').trim();
    if (!expr) {
        box.innerHTML = '<span class="equation-placeholder">∑ Click to add a LaTeX equation…</span>';
    } else if (typeof ArchitectRichRender !== 'undefined') {
        box.append(ArchitectRichRender.renderLatexToElement(expr, true));
    } else {
        box.textContent = expr;
    }
    if (!ro) {
        box.title = 'Click to edit equation';
        box.onclick = ev => { ev.stopPropagation(); openEquationEditorPopover(p, b, box); };
    }
    el.append(box);
    return el;
} if (b.type === 'callout') {
    el.contentEditable = ro ? 'false' : 'true';
    el.innerHTML = `<button type="button" class="callout-icon" contenteditable="false" aria-label="Change callout icon" title="Change icon">${pageIconMarkup(b.icon || '💡')}</button><span class="block-copy"${ro ? ' contenteditable="false"' : ''}></span>`;
    if (!ro) el.querySelector(':scope > .callout-icon').onclick = event => { event.preventDefault(); event.stopPropagation(); blockIconPicker(p, b); };
    const copy = el.querySelector(':scope > .block-copy');
    copy.dataset.placeholder = ro ? '' : 'Type something…';
    copy.innerHTML = b.html ? cleanInlineHtml(b.html) : esc(b.text);
    hydrateInlineWidgets(copy, b, p, ro);
    if (!ro) wireText(copy, b, p);
    el.addEventListener('click', event => { if (ro || event.target.closest('button')) return; if (!getSelection()?.isCollapsed) return; if (!copy.contains(event.target)) setCaretAtTextOffset(copy, (copy.innerText || '').replace(/\u200b/g, '').length); });
    return el;
} if (b.type === 'board_view') {
    el.contentEditable = 'false';
    const hostWrap = document.createElement('div');
    const sourceBoard = state.pages.find(x => x.id === b.targetId && ArchitectBoard.isBoardPage(x)) || { id: b.targetId || '' };
    ArchitectBoard.renderBoardWidget(hostWrap, sourceBoard, {
        inlineBlock: b,
        parentPage: p,
        onChangeSourceBoard: nextBoard => {
            pushUndoBeforeEdit(p);
            b.targetId = nextBoard.id;
            save();
            render();
        }
    });
    el.append(hostWrap);
    return el;
} if (b.type === 'database_view') {
    el.contentEditable = 'false';
    const hostWrap = document.createElement('div');
    const sourceDb = state.pages.find(x => x.id === b.targetId && ArchitectDatabase.isDatabasePage(x)) || { id: b.targetId || '' };
    ArchitectDatabase.renderDatabaseWidget(hostWrap, sourceDb, {
        inlineBlock: b,
        parentPage: p,
        onChangeSourceDb: nextDb => {
            pushUndoBeforeEdit(p);
            b.targetId = nextDb.id;
            b.viewId = undefined;
            save();
            render();
        }
    });
    el.append(hostWrap);
    return el;
} if (b.type === 'table') {
    renderSimpleTableBlock(el, b, p, ro);
    return el;
} el.dataset.placeholder = !ro && b.type === 'text' ? 'Type / for commands or start writing…' : ''; el.contentEditable = ro ? 'false' : 'true'; el.innerHTML = b.html ? cleanInlineHtml(b.html) : esc(b.text); hydrateInlineWidgets(el, b, p, ro); if (!ro) wireText(el, b, p); return el; }
function formatBytes(bytes) {
    if (!bytes || bytes < 1024) return bytes ? `${bytes} B` : '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatSeconds(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    const whole = Math.floor(sec), mins = Math.floor(whole / 60), secs = whole % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
function findAssetForBlock(b) {
    if (!b) return null;
    const all = ArchitectBackend.readAssetCatalog();
    if (b.assetId) return all.find(a => a.id === b.assetId) || null;
    if (b.url) return all.find(a => a.url === b.url || a.externalUrl === b.url || a.previewDataUrl === b.url) || null;
    return null;
}
async function downloadAssetOrBlock(asset, b, fallbackName = 'download') {
    try {
        if (asset) { await ArchitectBackend.downloadFullAsset(asset); return; }
        if (b?.url) {
            if (/^https?:\/\//i.test(b.url)) { window.open(b.url, '_blank', 'noopener,noreferrer'); return; }
            const a = document.createElement('a'); a.href = b.url; a.download = b.text || fallbackName; document.body.append(a); a.click(); a.remove();
        }
    } catch (err) {
        toast(err?.message || 'Could not download file');
    }
}
function buildMissingAssetElement(b, p, targetType = 'file') {
    const row = document.createElement('div');
    row.className = 'media-card-row';
    const ro = effectivePageReadOnly(p);
    row.innerHTML = `<div class="media-card-main"><strong>${esc(b.text || b.type)}</strong><small>Asset missing or removed from library</small></div><div class="settings-actions">${ro ? '' : '<button type="button" class="secondary-button" data-missing-relink>Relink from library</button><button type="button" class="secondary-button" data-missing-upload>↑ Upload file</button>'}</div>`;
    row.querySelector('[data-missing-relink]')?.addEventListener('click', () => openAssetLibrary(null, { targetPage: p, targetBlock: b }));
    row.querySelector('[data-missing-upload]')?.addEventListener('click', () => uploadForBlock(b, p, targetType));
    return row;
}
let activeRichPopoverEl: HTMLElement | null = null;
function closeRichPopover() {
    if (activeRichPopoverEl) {
        activeRichPopoverEl.remove();
        activeRichPopoverEl = null;
    }
}
function openFloatingPopover(anchorEl: Element | DOMRect | null | undefined, className = ''): HTMLDivElement {
    closeRichPopover();
    closeMenu();
    const pop = document.createElement('div');
    pop.id = 'rich-block-popover';
    pop.className = `rich-block-popover ${className}`.trim();
    document.body.append(pop);
    activeRichPopoverEl = pop;
    requestAnimationFrame(() => {
        if (!pop.isConnected) return;
        const rect = anchorEl && 'getBoundingClientRect' in anchorEl
            ? anchorEl.getBoundingClientRect()
            : (anchorEl as DOMRect | null | undefined) || { left: 260, right: 420, top: 180, bottom: 204 };
        const box = pop.getBoundingClientRect();
        const left = Math.max(12, Math.min(window.innerWidth - box.width - 12, rect.left));
        const below = rect.bottom + 6;
        const top = (below + box.height <= window.innerHeight - 12)
            ? below
            : Math.max(12, rect.top - box.height - 6);
        pop.style.left = `${Math.round(left)}px`;
        pop.style.top = `${Math.round(top)}px`;
    });
    return pop;
}
document.addEventListener('pointerdown', ev => {
    if (!activeRichPopoverEl) return;
    const t = ev.target instanceof Element ? ev.target : null;
    if (t && activeRichPopoverEl.contains(t)) return;
    closeRichPopover();
}, true);

function hydrateInlineWidgets(container: HTMLElement | null, _b: Block, p: Page, ro: boolean) {
    if (!container) return;
    container.querySelectorAll('.inline-mention-chip').forEach(node => {
        const chip = node as HTMLElement;
        chip.contentEditable = 'false';
        if (chip.dataset.mentionKind === 'reminder' && !ro) wireInlineReminderChip(chip, p, _b);
    });
    container.querySelectorAll('span.inline-math').forEach(node => {
        const span = node as HTMLElement;
        const tex = (span.getAttribute('data-tex') || span.textContent || '').trim();
        if (!tex) return;
        span.setAttribute('data-tex', tex);
        span.contentEditable = 'false';
        span.title = ro ? tex : 'Click to edit math expression';
        if (typeof ArchitectRichRender !== 'undefined' && ArchitectRichRender.renderLatexToHtml) {
            span.innerHTML = ArchitectRichRender.renderLatexToHtml(tex, false);
        } else {
            span.textContent = tex;
        }
    });
}
function openInlineMathPopover(p: Page, b: Block, spanEl: HTMLElement) {
    if (effectivePageReadOnly(p)) return;
    const pop = openFloatingPopover(spanEl, 'eq-editor-popover');
    const initialTex = (spanEl.getAttribute('data-tex') || spanEl.textContent || 'E = mc^2').trim();
    pop.innerHTML = `<div class="rich-popover-head"><strong>Inline equation</strong><button type="button" class="icon-button" data-eq-close aria-label="Close">×</button></div><textarea class="eq-popover-input" rows="2" placeholder="Enter LaTeX (e.g. \\frac{a}{b})"></textarea><div class="eq-popover-preview"></div><div class="rich-popover-actions"><button type="button" class="secondary-button" data-eq-remove>Remove</button><button type="button" class="share-button" data-eq-done>Done</button></div>`;
    const input = pop.querySelector('.eq-popover-input') as HTMLTextAreaElement;
    const prev = pop.querySelector('.eq-popover-preview') as HTMLElement;
    input.value = initialTex;
    const syncPreview = (val: string) => {
        prev.replaceChildren(typeof ArchitectRichRender !== 'undefined' ? ArchitectRichRender.renderLatexToElement(val || '\\square', false) : document.createTextNode(val));
    };
    syncPreview(initialTex);
    input.addEventListener('input', () => {
        const nextTex = input.value;
        syncPreview(nextTex);
        spanEl.setAttribute('data-tex', nextTex);
        if (typeof ArchitectRichRender !== 'undefined' && ArchitectRichRender.renderLatexToHtml) {
            spanEl.innerHTML = ArchitectRichRender.renderLatexToHtml(nextTex || '\\square', false);
        } else {
            spanEl.textContent = nextTex;
        }
        const blkEl = spanEl.closest('.block');
        if (blkEl) updateBlockFromDOM(blkEl);
        save();
    });
    pop.querySelector('[data-eq-remove]')?.addEventListener('click', () => {
        pushUndoBeforeEdit(p);
        const blkEl = spanEl.closest('.block');
        spanEl.remove();
        if (blkEl) updateBlockFromDOM(blkEl);
        save();
        closeRichPopover();
    });
    const finish = () => {
        if (!input.value.trim()) spanEl.remove();
        const blkEl = spanEl.closest('.block');
        if (blkEl) updateBlockFromDOM(blkEl);
        save();
        closeRichPopover();
    };
    pop.querySelector('[data-eq-done]')?.addEventListener('click', finish);
    pop.querySelector('[data-eq-close]')?.addEventListener('click', closeRichPopover);
    input.addEventListener('keydown', ev => { if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey || !ev.shiftKey)) { ev.preventDefault(); finish(); } });
    requestAnimationFrame(() => input.focus());
}
function openEquationEditorPopover(p: Page, b: Block, anchorEl: Element | null) {
    if (effectivePageReadOnly(p)) return;
    const pop = openFloatingPopover(anchorEl, 'eq-editor-popover');
    const snippets = [['\\frac{a}{b}', 'a/b'], ['\\sqrt{x}', '√x'], ['\\sum_{i=1}^n', '∑'], ['\\int_0^\\infty', '∫'], ['\\alpha', 'α'], ['\\beta', 'β'], ['^2', 'x²'], ['\\pm', '±']];
    pop.innerHTML = `<div class="rich-popover-head"><strong>LaTeX Equation</strong><button type="button" class="icon-button" data-eq-close aria-label="Close">×</button></div><div class="eq-snippet-strip">${snippets.map(([tex, lbl]) => `<button type="button" class="eq-snippet-btn" data-tex="${esc(tex)}">${esc(lbl)}</button>`).join('')}</div><textarea class="eq-popover-input" rows="3" placeholder="e.g. E = mc^2 or \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"></textarea><div class="eq-popover-preview"></div><div class="rich-popover-actions"><span class="eq-hint">Press Ctrl+Enter or Done</span><button type="button" class="share-button" data-eq-done>Done</button></div>`;
    const input = pop.querySelector('.eq-popover-input') as HTMLTextAreaElement;
    const preview = pop.querySelector('.eq-popover-preview') as HTMLElement;
    input.value = b.text || '';
    const renderPreview = () => {
        preview.replaceChildren(typeof ArchitectRichRender !== 'undefined' ? ArchitectRichRender.renderLatexToElement(input.value || 'Enter equation', true) : document.createTextNode(input.value));
        const domEq = editor.querySelector(`[data-block-id="${CSS.escape(b.id)}"] .equation-block`);
        if (domEq && typeof ArchitectRichRender !== 'undefined') {
            domEq.replaceChildren(ArchitectRichRender.renderLatexToElement(input.value || '\\text{Click to add equation}', true));
        }
    };
    renderPreview();
    input.addEventListener('input', () => { b.text = input.value; renderPreview(); save(); });
    pop.querySelectorAll('.eq-snippet-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const snippet = (btn as HTMLElement).dataset.tex || '';
            const start = input.selectionStart ?? input.value.length;
            const end = input.selectionEnd ?? start;
            input.value = input.value.slice(0, start) + snippet + input.value.slice(end);
            b.text = input.value;
            renderPreview();
            save();
            input.focus();
            input.setSelectionRange(start + snippet.length, start + snippet.length);
        });
    });
    const done = () => { b.text = input.value.trim() || b.text; save(); closeRichPopover(); render(); };
    pop.querySelector('[data-eq-done]')?.addEventListener('click', done);
    pop.querySelector('[data-eq-close]')?.addEventListener('click', () => { closeRichPopover(); render(); });
    input.addEventListener('keydown', ev => { if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); done(); } });
    requestAnimationFrame(() => input.focus());
}

function isStandaloneHttpUrl(raw: string): string | null {
    const trimmed = (raw || '').trim();
    if (!trimmed || /\s/.test(trimmed) || !/^https?:\/\//i.test(trimmed)) return null;
    try {
        const u = new URL(trimmed);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
        return u.href;
    } catch { return null; }
}
function formatLinkMentionLabel(rawUrl: string): string {
    try {
        const u = new URL(rawUrl);
        const host = u.hostname.replace(/^www\./, '');
        const cleanPath = decodeURIComponent(u.pathname || '').replace(/\/+$/, '');
        if (!cleanPath || cleanPath === '/') return host;
        const shortPath = cleanPath.length > 28 ? `${cleanPath.slice(0, 26)}…` : cleanPath;
        return `${host}${shortPath}`;
    } catch {
        return rawUrl.slice(0, 40);
    }
}
function normalizeEmbedUrl(raw: string): { embedUrl: string; kind: 'youtube'|'vimeo'|'figma'|'loom'|'gdocs'|'pdf'|'iframe'; label: string } {
    const trimmed = (raw || '').trim();
    if (!trimmed) return { embedUrl: '', kind: 'iframe', label: 'Embed' };
    if (/^data:application\/pdf/i.test(trimmed)) return { embedUrl: trimmed, kind: 'pdf', label: 'PDF' };
    try {
        const u = new URL(trimmed, location.href);
        const host = u.hostname.toLowerCase();
        if (host === 'youtu.be') {
            const vid = u.pathname.replace(/^\/+/, '').split('/')[0];
            if (vid) return { embedUrl: `https://www.youtube.com/embed/${vid}`, kind: 'youtube', label: 'YouTube' };
        }
        if (host.endsWith('youtube.com')) {
            const v = u.searchParams.get('v') || (u.pathname.startsWith('/shorts/') ? u.pathname.split('/')[2] : '') || (u.pathname.startsWith('/embed/') ? u.pathname.split('/')[2] : '');
            if (v) return { embedUrl: `https://www.youtube.com/embed/${v}`, kind: 'youtube', label: 'YouTube' };
        }
        if (host.endsWith('vimeo.com') && !host.startsWith('player.')) {
            const m = u.pathname.match(/\/(\d+)/);
            if (m) return { embedUrl: `https://player.vimeo.com/video/${m[1]}`, kind: 'vimeo', label: 'Vimeo' };
        }
        if (host.endsWith('figma.com')) {
            return { embedUrl: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(u.href)}`, kind: 'figma', label: 'Figma' };
        }
        if (host.endsWith('loom.com') && u.pathname.includes('/share/')) {
            const lid = u.pathname.split('/share/')[1]?.split('/')[0];
            if (lid) return { embedUrl: `https://www.loom.com/embed/${lid}`, kind: 'loom', label: 'Loom' };
        }
        if (host === 'docs.google.com' && u.pathname.endsWith('/edit')) {
            return { embedUrl: `${u.origin}${u.pathname.replace(/\/edit$/, '/preview')}${u.search}`, kind: 'gdocs', label: 'Google Docs' };
        }
        if (/\.pdf(?:$|[?#])/i.test(u.href)) {
            return { embedUrl: u.href, kind: 'pdf', label: 'PDF' };
        }
        return { embedUrl: u.href, kind: 'iframe', label: host.replace(/^www\./, '') || 'Embed' };
    } catch {
        return { embedUrl: trimmed, kind: /\.pdf/i.test(trimmed) ? 'pdf' : 'iframe', label: 'Embed' };
    }
}
const pdfBlobUrlCache = new Map<string, string>();
function toRenderablePdfSrc(rawUrl: string): string {
    if (!rawUrl || !rawUrl.startsWith('data:application/pdf')) return rawUrl;
    const cached = pdfBlobUrlCache.get(rawUrl);
    if (cached) return cached;
    try {
        const comma = rawUrl.indexOf(',');
        if (comma < 0) return rawUrl;
        const header = rawUrl.slice(0, comma);
        const body = rawUrl.slice(comma + 1);
        let bytes: Uint8Array;
        if (header.includes(';base64')) {
            const bin = atob(body);
            bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        } else {
            bytes = new TextEncoder().encode(decodeURIComponent(body));
        }
        const blobUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        pdfBlobUrlCache.set(rawUrl, blobUrl);
        return blobUrl;
    } catch {
        return rawUrl;
    }
}
function openLinkPreviewMenu(opts: { page: Page; list: Block[]; item: Block; blockElement: HTMLElement; target: HTMLElement; linkEl: HTMLAnchorElement | null; url: string; anchorRect: DOMRect }) {
    const menu = $('#command-menu');
    menu.className = 'command-menu link-preview-menu';
    menu.dataset.owner = 'link-preview';
    menu.replaceChildren();
    const listWrap = document.createElement('div');
    listWrap.className = 'command-list';
    const labelHeading = document.createElement('div');
    labelHeading.className = 'command-group-label';
    labelHeading.textContent = 'Paste link as';
    listWrap.append(labelHeading);

    const convertBlockOrInsert = (nextType: 'bookmark' | 'embed' | 'pdf') => {
        pushUndoBeforeEdit(opts.page);
        const curList = opts.list;
        const idx = curList.indexOf(opts.item);
        const targetIdx = idx >= 0 ? idx : 0;
        const info = normalizeEmbedUrl(opts.url);
        const actualType = nextType === 'embed' && info.kind === 'pdf' ? 'pdf' : nextType;
        const newBlk: Block = {
            id: id(),
            type: actualType,
            text: formatLinkMentionLabel(opts.url),
            url: opts.url,
            linkDisplayMode: nextType,
            embedHeight: actualType === 'pdf' ? 500 : actualType === 'embed' ? 380 : undefined
        };
        const onlyUrlInBlock = (opts.item.text || '').trim() === opts.url.trim();
        if (onlyUrlInBlock) {
            curList[targetIdx] = { ...newBlk, id: opts.item.id };
        } else {
            if (opts.linkEl && opts.linkEl.isConnected) {
                opts.linkEl.remove();
                updateBlockFromDOM(opts.blockElement);
            }
            curList.splice(targetIdx + 1, 0, newBlk);
        }
        save();
        closeMenu();
        render();
    };

    const rows = [
        {
            label: 'URL (keep link)',
            icon: menuGlyph('Copy link'),
            run: () => { closeMenu(); }
        },
        {
            label: 'Mention',
            icon: menuGlyph('Mention'),
            run: () => {
                if (opts.linkEl && opts.linkEl.isConnected) {
                    pushUndoBeforeEdit(opts.page);
                    opts.linkEl.className = 'inline-link-mention';
                    opts.linkEl.textContent = `🔗 ${formatLinkMentionLabel(opts.url)}`;
                    updateBlockFromDOM(opts.blockElement);
                    save();
                }
                closeMenu();
            }
        },
        {
            label: 'Bookmark',
            icon: menuGlyph('Web bookmark'),
            run: () => convertBlockOrInsert('bookmark')
        },
        {
            label: normalizeEmbedUrl(opts.url).kind === 'pdf' ? 'Embed PDF' : 'Embed',
            icon: menuGlyph('Embed'),
            run: () => convertBlockOrInsert('embed')
        }
    ];
    rows.forEach((entry, idx) => {
        const r = menuRow(entry.label, entry.icon, entry.run, '', idx === 0 ? 'Esc' : '');
        listWrap.append(r);
    });
    menu.append(listWrap);
    placeFloatingMenu(menu, opts.anchorRect.left, opts.anchorRect.bottom + 4);
    menuIndex = 0;
    refreshMenuSelection();
    activeMenu = menu;
}
function convertLinkBlockMode(p: Page, b: Block, nextMode: 'url' | 'mention' | 'bookmark' | 'embed', refUrl: string) {
    if (effectivePageReadOnly(p)) return;
    pushUndoBeforeEdit(p);
    if (nextMode === 'url' || nextMode === 'mention') {
        const label = nextMode === 'mention' ? `🔗 ${formatLinkMentionLabel(refUrl)}` : refUrl;
        const cls = nextMode === 'mention' ? ' class="inline-link-mention"' : '';
        b.type = 'text';
        b.text = label;
        b.html = `<a${cls} href="${esc(refUrl)}" rel="noopener noreferrer">${esc(label)}</a>`;
        b.url = undefined;
        b.linkDisplayMode = undefined;
    } else if (nextMode === 'bookmark') {
        b.type = 'bookmark';
        b.linkDisplayMode = 'bookmark';
        b.url = refUrl;
        if (!b.text || b.text === 'Embed' || b.text === 'Web bookmark') b.text = formatLinkMentionLabel(refUrl);
    } else {
        const info = normalizeEmbedUrl(refUrl);
        b.type = info.kind === 'pdf' ? 'pdf' : 'embed';
        b.linkDisplayMode = 'embed';
        b.url = refUrl;
        b.embedHeight = b.embedHeight || (b.type === 'pdf' ? 500 : 380);
        if (!b.text || b.text === 'Embed' || b.text === 'Web bookmark') b.text = formatLinkMentionLabel(refUrl);
    }
    save();
    render();
}
function openLinkBlockModeMenu(p: Page, b: Block, anchorEl: HTMLElement, refUrl: string) {
    const pop = openFloatingPopover(anchorEl, 'link-mode-popover');
    [
        ['URL link', 'url'],
        ['Inline mention', 'mention'],
        ['Web bookmark', 'bookmark'],
        ['Inline embed', 'embed']
    ].forEach(([label, mode]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'command-row';
        btn.textContent = label;
        btn.onclick = () => {
            closeRichPopover();
            convertLinkBlockMode(p, b, mode as 'url' | 'mention' | 'bookmark' | 'embed', refUrl);
        };
        pop.append(btn);
    });
}
function renderRichMediaLinkBlock(el: HTMLElement, b: Block, p: Page, ro: boolean) {
    const asset = findAssetForBlock(b);
    if (b.assetId && !asset) {
        el.append(buildMissingAssetElement(b, p, b.type === 'video' ? 'video' : b.type === 'pdf' ? 'pdf' : 'file'));
        return;
    }
    if (!asset && !b.url) {
        if (b.type === 'bookmark' || b.type === 'embed' || b.type === 'pdf') {
            if (ro) {
                el.innerHTML = `<div class="image-placeholder" aria-disabled="true">No ${b.type} URL attached</div>`;
                return;
            }
            const form = document.createElement('form');
            form.className = 'link-block-composer';
            form.innerHTML = `<input type="url" class="link-block-url-input" placeholder="Paste ${b.type === 'pdf' ? 'PDF or web' : 'an https://'} URL…" aria-label="${esc(b.type)} URL"><button type="submit" class="share-button">Embed</button>${b.type === 'pdf' ? '<button type="button" class="secondary-button" data-upload-pdf>↑ Upload PDF</button>' : ''}`;
            const urlInp = form.querySelector('.link-block-url-input') as HTMLInputElement;
            form.onsubmit = ev => {
                ev.preventDefault();
                const val = (urlInp.value || '').trim();
                const valid = isStandaloneHttpUrl(val) || (/^https?:\/\//i.test(val) ? val : val ? `https://${val}` : '');
                if (!valid) { toast('Please enter a valid URL'); return; }
                pushUndoBeforeEdit(p);
                b.url = valid;
                b.text = formatLinkMentionLabel(valid);
                if (b.type === 'embed' && normalizeEmbedUrl(valid).kind === 'pdf') b.type = 'pdf';
                save(); render();
            };
            form.querySelector('[data-upload-pdf]')?.addEventListener('click', () => uploadForBlock(b, p, 'pdf'));
            el.append(form);
            return;
        }
        el.innerHTML = ro ? `<div class="image-placeholder" aria-disabled="true">No ${b.type} attached</div>` : `<button type="button" class="image-placeholder">Add ${b.type}</button>`;
        if (!ro) el.querySelector('button')?.addEventListener('click', () => uploadForBlock(b, p, b.type));
        return;
    }
    const refHref = asset?.externalUrl || asset?.url || b.url || '';
    const title = asset?.name || (b.text && !['Embed', 'Web bookmark', 'PDF document'].includes(b.text) ? b.text : formatLinkMentionLabel(refHref)) || b.type;
    const chips = [asset?.category || b.category, asset?.creator || b.creator, asset?.provider, asset?.sizeBytes ? formatBytes(asset.sizeBytes) : ''].filter(Boolean);
    if (b.type === 'video') {
        const wrap = document.createElement('div'); wrap.className = 'audio-player-card';
        wrap.innerHTML = `<video controls preload="metadata" style="width:100%;max-height:360px;border-radius:5px;background:#000"></video><div class="media-card-row" style="border:0;padding:2px 0 0;background:transparent"><div class="media-card-main"><strong>${esc(title)}</strong><div class="asset-meta-chips">${chips.map(c => `<span class="asset-chip">${esc(String(c))}</span>`).join('')}</div></div><div class="settings-actions"><button type="button" class="secondary-button" data-vid-dl>↓ Download</button></div></div>`;
        const video = wrap.querySelector('video') as HTMLVideoElement;
        if (asset) ArchitectBackend.resolveAssetOriginalUrl(asset).then(u => { if (u && video.isConnected) video.src = u; });
        else if (b.url) video.src = b.url;
        wrap.querySelector('[data-vid-dl]')?.addEventListener('click', () => downloadAssetOrBlock(asset, b, title));
        el.append(wrap);
        return;
    }
    const isPdf = b.type === 'pdf' || b.mimeType === 'application/pdf' || asset?.fileType === 'application/pdf' || /\.pdf(?:$|[?#])/i.test(refHref || title);
    if (b.type === 'bookmark') {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        card.innerHTML = `<div class="bookmark-card-main"><div class="bookmark-card-title">⚑ ${esc(title)}</div><div class="bookmark-card-url">${esc(refHref)}</div></div><div class="settings-actions">${!ro && refHref ? '<button type="button" class="secondary-button" data-link-mode>Preview ▾</button>' : ''}${refHref ? `<a class="secondary-button bookmark-open-link" href="${esc(refHref)}" target="_blank" rel="noopener noreferrer">↗ Open</a>` : ''}</div>`;
        card.querySelector('[data-link-mode]')?.addEventListener('click', ev => { ev.stopPropagation(); openLinkBlockModeMenu(p, b, ev.currentTarget as HTMLElement, refHref); });
        el.append(card);
        return;
    }
    if (b.type === 'embed' || isPdf) {
        const norm = normalizeEmbedUrl(refHref);
        const card = document.createElement('div');
        card.className = 'embed-viewer-card' + (isPdf ? ' is-pdf' : '');
        const height = Math.max(180, Math.min(900, Number(b.embedHeight) || (isPdf ? 480 : 380)));
        const badgeLabel = isPdf ? 'PDF' : norm.label;
        const canSwitchMode = !ro && !asset && /^https?:\/\//i.test(refHref);
        card.innerHTML = `<div class="embed-viewer-bar"><span class="embed-viewer-badge">${esc(badgeLabel)}</span><strong class="embed-viewer-title">${esc(title)}</strong><div class="settings-actions">${canSwitchMode ? '<button type="button" class="secondary-button" data-link-mode>Preview ▾</button>' : ''}${asset ? '<button type="button" class="secondary-button" data-file-inspect>Inspect</button>' : ''}${refHref && /^https?:\/\//i.test(refHref) ? `<a class="secondary-button bookmark-open-link" href="${esc(refHref)}" target="_blank" rel="noopener noreferrer">↗ Open</a>` : ''}<button type="button" class="secondary-button" data-file-dl>↓ Download</button></div></div><div class="embed-frame-wrap" style="height:${height}px"><iframe class="embed-viewer-iframe" loading="lazy" title="${esc(title)}"></iframe></div>${ro ? '' : '<div class="embed-resize-handle" title="Drag to resize embed height" aria-label="Resize embed height"></div>'}`;
        const iframe = card.querySelector('.embed-viewer-iframe') as HTMLIFrameElement;
        if (!isPdf && /^https?:\/\//i.test(norm.embedUrl)) {
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-presentation');
            iframe.src = norm.embedUrl;
        } else if (asset) {
            ArchitectBackend.resolveAssetOriginalUrl(asset).then(u => {
                if (!iframe.isConnected) return;
                const resolved = u || asset.previewDataUrl || refHref;
                iframe.src = isPdf ? toRenderablePdfSrc(resolved) : resolved;
            });
        } else if (refHref) {
            iframe.src = isPdf ? toRenderablePdfSrc(refHref) : norm.embedUrl;
        }
        card.querySelector('[data-link-mode]')?.addEventListener('click', ev => { ev.stopPropagation(); openLinkBlockModeMenu(p, b, ev.currentTarget as HTMLElement, refHref); });
        card.querySelector('[data-file-inspect]')?.addEventListener('click', () => asset && openAssetLibrary(asset.id));
        card.querySelector('[data-file-dl]')?.addEventListener('click', () => downloadAssetOrBlock(asset, b, title));
        const handle = card.querySelector('.embed-resize-handle') as HTMLElement | null;
        const frameWrap = card.querySelector('.embed-frame-wrap') as HTMLElement;
        if (handle) {
            handle.addEventListener('pointerdown', ev => {
                ev.preventDefault();
                const startY = ev.clientY;
                const startH = frameWrap.getBoundingClientRect().height;
                iframe.style.pointerEvents = 'none';
                const onMove = (me: PointerEvent) => {
                    const nh = Math.max(180, Math.min(900, Math.round(startH + (me.clientY - startY))));
                    frameWrap.style.height = `${nh}px`;
                    b.embedHeight = nh;
                };
                const onUp = () => {
                    iframe.style.pointerEvents = '';
                    window.removeEventListener('pointermove', onMove);
                    window.removeEventListener('pointerup', onUp);
                    save();
                };
                window.addEventListener('pointermove', onMove);
                window.addEventListener('pointerup', onUp);
            });
        }
        el.append(card);
        return;
    }
    const row = document.createElement('div'); row.className = 'media-card-row';
    row.innerHTML = `<div class="media-card-main"><strong>${esc(title)}</strong><small>${esc(refHref || asset?.fileType || b.type)}</small><div class="asset-meta-chips">${chips.map(c => `<span class="asset-chip">${esc(String(c))}</span>`).join('')}</div></div><div class="settings-actions">${asset ? '<button type="button" class="secondary-button" data-file-inspect>Inspect</button>' : ''}<button type="button" class="secondary-button" data-file-dl>↓ Download</button></div>`;
    row.querySelector('[data-file-inspect]')?.addEventListener('click', () => openAssetLibrary(asset.id));
    row.querySelector('[data-file-dl]')?.addEventListener('click', () => downloadAssetOrBlock(asset, b, title));
    el.append(row);
}

function interpolateButtonTemplate(raw: string, p: Page, vars: Record<string, string> = {}): string {
    return String(raw || '').replace(/\{\{([^}]+)\}\}/g, (_, key) => {
        const rawKey = String(key).trim();
        const k = rawKey.toLowerCase();
        if (k === 'me' || k === 'actor') return getActorDisplayName();
        if (k === 'today') return new Date().toISOString().slice(0, 10);
        if (k === 'now') return new Date().toLocaleString();
        if (k === 'page' || k === 'title') return p.title || 'Untitled';
        const varEntry = Object.entries(vars).find(([vn]) => vn.toLowerCase() === k);
        if (varEntry) return varEntry[1];
        return '';
    });
}
function normalizeStepBranches(step: BlockButtonStep): BlockButtonBranch[] {
    if (Array.isArray(step.branches) && step.branches.length) return step.branches;
    const legacyOkLabel = (step.confirmLabel || '').trim() || 'Okay';
    step.branches = [
        { id: `br-ok-${step.id}`, label: legacyOkLabel, style: 'primary', mode: 'continue', actions: [] },
        { id: `br-cancel-${step.id}`, label: 'Cancel', style: 'default', mode: 'stop', actions: [] }
    ];
    return step.branches;
}
function openButtonChoiceBranchModal(titleText: string, bodyText: string, branches: BlockButtonBranch[], onChoose: (branch: BlockButtonBranch) => void) {
    closeButtonModalOverlay();
    const overlay = document.createElement('div');
    overlay.className = 'notion-workflow-overlay';
    const card = document.createElement('div');
    card.className = 'notion-workflow-modal is-confirm-modal';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');

    const body = document.createElement('div');
    body.className = 'notion-wf-confirm-body';
    body.innerHTML = `<strong>${esc(titleText)}</strong><p>${esc(bodyText)}</p>`;

    const acts = document.createElement('div');
    acts.className = 'notion-wf-confirm-actions';
    branches.forEach(br => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = br.style === 'primary' ? 'share-button' : br.style === 'danger' ? 'secondary-button is-danger' : 'secondary-button';
        btn.dataset.branchId = br.id;
        btn.textContent = br.label || 'Continue';
        btn.onclick = () => {
            closeButtonModalOverlay();
            onChoose(br);
        };
        acts.append(btn);
    });

    card.append(body, acts);
    overlay.addEventListener('click', ev => { if (ev.target === overlay) closeButtonModalOverlay(); });
    overlay.append(card);
    document.body.append(overlay);
    activeButtonModalOverlay = overlay;
}
function fireWorkflowWebhook(rawUrl: string, headersJson: string | undefined, bodyText: string, defaultPayload: any): void {
    const cleanUrl = (rawUrl || '').trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
        toast('Invalid webhook URL (must start with http:// or https://)');
        return;
    }
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (headersJson && headersJson.trim()) {
        try {
            const parsed = JSON.parse(headersJson);
            if (parsed && typeof parsed === 'object') headers = { ...headers, ...parsed };
        } catch {}
    }
    const finalBody = bodyText && bodyText.trim() ? bodyText : JSON.stringify(defaultPayload);
    try {
        (window as any).__lastWorkflowWebhookCall = { url: cleanUrl, headers, body: finalBody, at: Date.now() };
        fetch(cleanUrl, { method: 'POST', headers, body: finalBody }).catch(() => {});
    } catch {}
}
function runPageButtonStepsSequence(
    p: Page,
    b: Block,
    steps: BlockButtonStep[],
    startIdx = 0,
    vars: Record<string, string> = {},
    depth = 0,
    counters = { ran: 0, navTarget: '' as string, externalUrl: '' as string },
    onComplete?: () => void
) {
    if (depth > 4) { onComplete?.(); return; }
    const cfg = b.buttonConfig || { label: b.text || 'Run button', icon: '', steps: [] };
    for (let i = startIdx; i < steps.length; i++) {
        const step = steps[i];
        if (step.kind === 'show_confirmation') {
            const branches = normalizeStepBranches(step);
            openButtonChoiceBranchModal(
                step.confirmTitle || cfg.label || b.text || 'Confirm',
                interpolateButtonTemplate(step.message || cfg.confirmText || 'Are you sure you want to continue?', p, vars),
                branches,
                chosen => {
                    counters.ran++;
                    if (chosen.mode === 'stop') {
                        onComplete?.();
                        return;
                    }
                    if (chosen.mode === 'branch' && Array.isArray(chosen.actions) && chosen.actions.length) {
                        runPageButtonStepsSequence(p, b, chosen.actions, 0, { ...vars }, depth + 1, counters, onComplete);
                        return;
                    }
                    runPageButtonStepsSequence(p, b, steps, i + 1, vars, depth, counters, onComplete);
                }
            );
            return;
        }
        if (step.kind === 'define_variables') {
            (step.variables || []).forEach(v => {
                const vName = (v.name || '').trim();
                if (vName) vars[vName] = interpolateButtonTemplate(v.value || '', p, vars);
            });
            counters.ran++;
        } else if (step.kind === 'insert_blocks') {
            const found = findBlockById(p.blocks, b.id);
            const list = found?.list || p.blocks;
            const idx = found ? found.index : p.blocks.indexOf(b);
            const resolved = interpolateButtonTemplate(step.blocksText || 'New block', p, vars);
            const lines = resolved.split(/\r?\n/);
            const built = lines.map(ln => {
                const parsed = parseMarkdownLine(ln);
                return { ...block(parsed.type, parsed.text), ...parsed };
            });
            list.splice((idx >= 0 ? idx : list.length - 1) + 1, 0, ...built);
            counters.ran++;
        } else if (step.kind === 'add_db_page') {
            const dbPg = state.pages.find(pg => pg.id === step.dbId && ArchitectDatabase.isDatabasePage(pg));
            if (dbPg) {
                const dbCfg = ArchitectDatabase.ensureDatabaseConfig(dbPg);
                const tpId = dbCfg?.schema?.find((sp: any) => sp.type === 'title')?.id || 'prop_title';
                const initVals: Record<string, any> = {
                    [tpId]: interpolateButtonTemplate(step.blocksText || 'New entry', p, vars).trim()
                };
                (step.propAssignments || []).forEach(pa => {
                    if (pa.propertyId && pa.propertyId !== tpId) {
                        initVals[pa.propertyId] = interpolateButtonTemplate(pa.value || '', p, vars);
                    }
                });
                ArchitectDatabase.createDatabaseRow(dbPg, initVals, [], undefined, {});
                counters.ran++;
            }
        } else if (step.kind === 'edit_pages') {
            const dbPg = state.pages.find(pg => pg.id === step.dbId && ArchitectDatabase.isDatabasePage(pg));
            if (dbPg) {
                const dbCfg = ArchitectDatabase.ensureDatabaseConfig(dbPg);
                const rows = ArchitectDatabase.getDatabaseRows(dbPg.id) || [];
                const targetProp = dbCfg?.schema?.find((sp: any) => sp.id === step.propertyId);
                if (targetProp) {
                    const fProp = step.filterPropertyId ? dbCfg?.schema?.find((sp: any) => sp.id === step.filterPropertyId) : null;
                    const fNeedle = interpolateButtonTemplate(step.filterValue || '', p, vars).trim().toLowerCase();
                    const newVal = interpolateButtonTemplate(step.propertyValue || '', p, vars);
                    rows.forEach((r: any) => {
                        if (fProp && fNeedle) {
                            const rawCell = fProp.type === 'title' ? (r.title || '') : String(r.propertyValues?.[fProp.id] ?? '');
                            if (!rawCell.toLowerCase().includes(fNeedle)) return;
                        }
                        ArchitectDatabase.setRowValue(r, targetProp, newVal, dbPg, false, 1);
                    });
                    counters.ran++;
                }
            }
        } else if (step.kind === 'notify') {
            const body = interpolateButtonTemplate(step.message || 'Triggered page button', p, vars);
            const recips = step.recipientMode === 'everyone'
                ? (state.users || []).map(u => u.linkedAccount || u.name)
                : (Array.isArray(step.recipientAccounts) && step.recipientAccounts.length ? step.recipientAccounts : [undefined]);
            recips.forEach(targetAccount => {
                pushInboxNotification({
                    kind: 'page',
                    title: cfg.label || b.text || 'Button notification',
                    body,
                    pageId: p.id,
                    blockId: b.id,
                    targetAccount
                });
            });
            counters.ran++;
        } else if (step.kind === 'send_message') {
            const msgBody = interpolateButtonTemplate(step.message || 'Button update', p, vars);
            pushWorkspaceChatMessage({
                channelId: step.chatChannelId,
                targetAccount: step.chatTargetAccount,
                text: msgBody,
                fromAutomation: cfg.label || b.text || 'Button'
            });
            counters.ran++;
        } else if (step.kind === 'send_webhook') {
            const bodyStr = step.webhookBody ? interpolateButtonTemplate(step.webhookBody, p, vars) : '';
            fireWorkflowWebhook(step.webhookUrl || '', step.webhookHeadersJson, bodyStr, {
                source: 'page_button',
                button: cfg.label || b.text || 'Button',
                pageId: p.id,
                pageTitle: p.title,
                variables: vars,
                timestamp: Date.now()
            });
            counters.ran++;
        } else if (step.kind === 'open_page') {
            if (step.openMode === 'url' && step.url) {
                counters.externalUrl = interpolateButtonTemplate(step.url, p, vars);
                counters.ran++;
            } else if (step.pageId) {
                counters.navTarget = step.pageId;
                counters.ran++;
            }
        }
    }
    onComplete?.();
}
function executeBlockButton(p: Page, b: Block) {
    const cfg = b.buttonConfig || { label: b.text || 'Run button', icon: '', steps: [{ id: id(), kind: 'insert_blocks', blocksText: 'New block' }] };
    const steps = cfg.steps || [];
    if (!steps.length) { toast('Add steps in Edit button first'); return; }
    pushUndoBeforeEdit(p);
    const counters = { ran: 0, navTarget: '', externalUrl: '' };
    const finish = () => {
        save();
        if (counters.externalUrl && /^https?:\/\//i.test(counters.externalUrl)) {
            try { window.open(counters.externalUrl, '_blank', 'noopener,noreferrer'); } catch {}
        }
        if (counters.navTarget && state.pages.some(pg => pg.id === counters.navTarget)) navigateToPage(counters.navTarget);
        else render();
        if (counters.ran > 0) toast(`Executed ${counters.ran} button step${counters.ran === 1 ? '' : 's'}`);
    };
    if (cfg.confirm && !steps.some(s => s.kind === 'show_confirmation')) {
        openButtonChoiceBranchModal(
            cfg.label || b.text || 'Confirm action',
            cfg.confirmText || 'Are you sure you want to continue?',
            [
                { id: 'cfg-ok', label: 'Okay', style: 'primary', mode: 'continue' },
                { id: 'cfg-cancel', label: 'Cancel', style: 'default', mode: 'stop' }
            ],
            br => {
                if (br.mode !== 'stop') runPageButtonStepsSequence(p, b, steps, 0, {}, 0, counters, finish);
            }
        );
        return;
    }
    runPageButtonStepsSequence(p, b, steps, 0, {}, 0, counters, finish);
}
let activeButtonModalOverlay: HTMLElement | null = null;
function closeButtonModalOverlay() {
    if (activeButtonModalOverlay) {
        activeButtonModalOverlay.remove();
        activeButtonModalOverlay = null;
    }
}
let activeNotionActionPickerEl: HTMLElement | null = null;
function closeNotionActionPicker() {
    if (activeNotionActionPickerEl) {
        activeNotionActionPickerEl.remove();
        activeNotionActionPickerEl = null;
    }
}
const PAGE_BUTTON_ACTION_DEFS: Array<{ kind: BlockButtonStep['kind']; label: string; icon: string; isNew?: boolean; keywords: string }> = [
    { kind: 'insert_blocks', label: 'Insert blocks', icon: '⧉', keywords: 'insert blocks content text' },
    { kind: 'add_db_page', label: 'Add page to...', icon: '＋', keywords: 'add page database row create' },
    { kind: 'edit_pages', label: 'Edit pages in...', icon: '✎', keywords: 'edit pages update database property' },
    { kind: 'notify', label: 'Send notification to...', icon: '🔔', keywords: 'send notification inbox alert bell' },
    { kind: 'send_message', label: 'Send message...', icon: '💬', isNew: true, keywords: 'send message chat dm channel group' },
    { kind: 'send_webhook', label: 'Send webhook', icon: '{}', keywords: 'send webhook http post api json' },
    { kind: 'show_confirmation', label: 'Show confirmation', icon: '?', keywords: 'show confirmation branch choice button modal' },
    { kind: 'open_page', label: 'Open page, form, or URL', icon: '↗', keywords: 'open page form url link navigate' },
    { kind: 'define_variables', label: 'Define variables', icon: '≡', keywords: 'define variables var formula let' }
];
function openNotionActionSearchMenu(
    anchorEl: HTMLElement,
    defs: Array<{ kind: string; label: string; icon: string; isNew?: boolean; keywords: string }>,
    onPick: (kind: string) => void
) {
    closeNotionActionPicker();
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
        const filtered = defs.filter(d => !q || `${d.label} ${d.keywords}`.toLowerCase().includes(q));
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
            row.innerHTML = `<span class="notion-action-ico">${esc(d.icon)}</span><span class="notion-action-lbl">${esc(d.label)}</span>${d.isNew ? '<span class="notion-action-new-badge">New</span>' : ''}`;
            row.onclick = ev => {
                ev.stopPropagation();
                closeNotionActionPicker();
                onPick(d.kind);
            };
            list.append(row);
        });
    };
    search.oninput = drawList;
    search.onkeydown = ev => {
        if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); closeNotionActionPicker(); }
        if (ev.key === 'Enter') {
            const first = list.querySelector('.notion-action-row') as HTMLElement | null;
            if (first) { ev.preventDefault(); first.click(); }
        }
    };
    drawList();
    pop.append(search, list);
    document.body.append(pop);
    activeNotionActionPickerEl = pop;
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
            closeNotionActionPicker();
            document.removeEventListener('mousedown', onOutside, true);
        }
    };
    document.addEventListener('mousedown', onOutside, true);
    requestAnimationFrame(() => search.focus());
}
function openButtonConfigPopover(p: Page, b: Block, _anchorEl?: HTMLElement) {
    if (effectivePageReadOnly(p)) return;
    closeRichPopover();
    closeButtonModalOverlay();
    closeNotionActionPicker();
    const cfg: BlockButtonConfig = b.buttonConfig || (b.buttonConfig = {
        label: b.text || 'New button',
        icon: '',
        confirm: false,
        confirmText: 'Are you sure you want to continue?',
        steps: []
    });
    const overlay = document.createElement('div');
    overlay.className = 'notion-workflow-overlay';
    const modal = document.createElement('div');
    modal.className = 'notion-workflow-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    overlay.addEventListener('click', ev => { if (ev.target === overlay) { closeNotionActionPicker(); closeButtonModalOverlay(); save(); render(); } });
    const onEsc = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape' && activeButtonModalOverlay === overlay) {
            if (activeNotionActionPickerEl) { closeNotionActionPicker(); return; }
            ev.preventDefault(); ev.stopPropagation();
            closeButtonModalOverlay(); save(); render();
            document.removeEventListener('keydown', onEsc, true);
        }
    };
    document.addEventListener('keydown', onEsc, true);

    const userInitials = (name: string) => {
        const parts = String(name || 'U').trim().split(/\s+/).filter(Boolean);
        return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : (parts[0] || 'U').slice(0, 2).toUpperCase();
    };

    const initStepDefaults = (kind: BlockButtonStep['kind']): BlockButtonStep => {
        const stepId = id();
        const dbs = state.pages.filter(pg => ArchitectDatabase.isDatabasePage(pg));
        if (kind === 'show_confirmation') {
            return {
                id: stepId,
                kind,
                message: 'Are you sure you want to continue?',
                branches: [
                    { id: `br-ok-${stepId}`, label: 'Okay', style: 'primary', mode: 'continue', actions: [] },
                    { id: `br-cancel-${stepId}`, label: 'Cancel', style: 'default', mode: 'stop', actions: [] }
                ]
            };
        }
        if (kind === 'define_variables') return { id: stepId, kind, variables: [{ id: id(), name: 'status', mode: 'text', value: 'Ready' }] };
        if (kind === 'send_message') return { id: stepId, kind, chatChannelId: state.chats?.[0]?.id || 'chat-general', message: '' };
        if (kind === 'send_webhook') return { id: stepId, kind, webhookUrl: 'https://', webhookBody: '' };
        if (kind === 'add_db_page' || kind === 'edit_pages') return { id: stepId, kind, dbId: dbs[0]?.id || '', blocksText: '- New entry' };
        return { id: stepId, kind, blocksText: '- Action item' };
    };

    const attachAtPills = (inpEl: HTMLInputElement | HTMLTextAreaElement, setter: (v: string) => void) => {
        const wrapBox = document.createElement('div');
        wrapBox.className = 'notion-wf-msg-box';
        const bar = document.createElement('div'); bar.className = 'notion-wf-token-bar';
        const atBtn = document.createElement('button'); atBtn.type = 'button'; atBtn.className = 'notion-wf-token-btn'; atBtn.textContent = '@'; atBtn.title = 'Insert dynamic variable';
        const tray = document.createElement('div'); tray.className = 'notion-wf-token-tray'; tray.hidden = true;
        atBtn.onclick = () => {
            tray.hidden = !tray.hidden;
            if (!tray.hidden) {
                tray.replaceChildren();
                const varNames = (cfg.steps || []).filter(s => s.kind === 'define_variables').flatMap(s => (s.variables || []).map(v => v.name).filter(Boolean));
                [['{{Me}}', '@Me'], ['{{Today}}', '@Today'], ['{{Now}}', '@Now'], ['{{Page}}', '@Page title'], ...varNames.map(vn => [`{{${vn}}}`, `{{${vn}}}`])].forEach(([tok, lbl]) => {
                    const c = document.createElement('button'); c.type = 'button'; c.className = 'notion-wf-mini-chip'; c.textContent = lbl;
                    c.onclick = () => {
                        const s = inpEl.selectionStart ?? inpEl.value.length;
                        const e = inpEl.selectionEnd ?? s;
                        inpEl.value = inpEl.value.slice(0, s) + tok + inpEl.value.slice(e);
                        setter(inpEl.value); tray.hidden = true; inpEl.focus();
                    };
                    tray.append(c);
                });
            }
        };
        bar.append(atBtn);
        wrapBox.append(inpEl, bar);
        return { wrapBox, tray };
    };

    const renderStepCards = (container: HTMLElement, listRef: BlockButtonStep[], depth = 0) => {
        const dbs = state.pages.filter(pg => ArchitectDatabase.isDatabasePage(pg));
        const viewablePages = state.pages.filter(pg => !pg.databaseId && resolvePagePermissions(pg).view);
        const users = state.users || [];
        const chats = state.chats || [];

        listRef.forEach((step, idx) => {
            const card = document.createElement('div');
            card.className = 'notion-wf-card notion-wf-action-card' + (depth > 0 ? ' is-nested-branch-card' : '');
            const top = document.createElement('div');
            top.className = 'notion-wf-card-head';

            const def = PAGE_BUTTON_ACTION_DEFS.find(d => d.kind === step.kind);
            const sumEl = document.createElement('button');
            sumEl.type = 'button';
            sumEl.className = 'notion-wf-card-summary notion-wf-kind-btn';
            sumEl.title = 'Change action type';
            sumEl.innerHTML = `<span class="notion-wf-step-ico">${esc(def?.icon || '⚡')}</span><span>${esc(def?.label || step.kind)}</span><span class="notion-wf-caret">▾</span>`;
            sumEl.onclick = ev => {
                ev.stopPropagation();
                openNotionActionSearchMenu(sumEl, PAGE_BUTTON_ACTION_DEFS, nextKind => {
                    const replacement = initStepDefaults(nextKind as BlockButtonStep['kind']);
                    replacement.id = step.id;
                    listRef[idx] = replacement;
                    save(); draw();
                });
            };

            const rm = document.createElement('button');
            rm.type = 'button'; rm.className = 'notion-wf-icon-btn'; rm.textContent = '×'; rm.title = 'Remove step';
            rm.onclick = () => { listRef.splice(idx, 1); save(); draw(); };
            top.append(sumEl, rm);
            card.append(top);

            const body = document.createElement('div');
            body.className = 'notion-wf-card-body';

            if (step.kind === 'insert_blocks') {
                const ta = document.createElement('textarea');
                ta.className = 'notion-wf-textarea'; ta.rows = 3;
                ta.placeholder = 'Markdown lines to insert below button… (supports {{Today}}, {{Me}})';
                ta.value = step.blocksText || '';
                ta.oninput = () => { step.blocksText = ta.value; save(); };
                const { wrapBox, tray } = attachAtPills(ta, v => { step.blocksText = v; save(); });
                body.append(wrapBox, tray);
            } else if (step.kind === 'add_db_page') {
                const dbSel = document.createElement('select');
                dbSel.className = 'notion-wf-select';
                dbs.forEach(d => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.title || 'Database'; dbSel.append(o); });
                if (!step.dbId && dbs[0]) step.dbId = dbs[0].id;
                dbSel.value = step.dbId || '';
                dbSel.onchange = () => { step.dbId = dbSel.value; save(); };
                const titleInp = document.createElement('input');
                titleInp.type = 'text'; titleInp.className = 'notion-wf-input'; titleInp.placeholder = 'New row title (supports {{Today}}, {{Me}})';
                titleInp.value = step.blocksText || '';
                titleInp.oninput = () => { step.blocksText = titleInp.value; save(); };
                const { wrapBox, tray } = attachAtPills(titleInp, v => { step.blocksText = v; save(); });
                body.append(dbSel, wrapBox, tray);
            } else if (step.kind === 'edit_pages') {
                const dbSel = document.createElement('select');
                dbSel.className = 'notion-wf-select';
                dbs.forEach(d => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.title || 'Database'; dbSel.append(o); });
                if (!step.dbId && dbs[0]) step.dbId = dbs[0].id;
                dbSel.value = step.dbId || '';
                dbSel.onchange = () => { step.dbId = dbSel.value; step.propertyId = ''; save(); draw(); };
                const chosenDb = dbs.find(d => d.id === step.dbId);
                const dbCfg = chosenDb ? ArchitectDatabase.ensureDatabaseConfig(chosenDb) : null;
                const pSel = document.createElement('select');
                pSel.className = 'notion-wf-select';
                (dbCfg?.schema || []).filter((s: any) => !['formula', 'rollup', 'unique_id', 'created_time', 'created_by', 'last_edited_time', 'last_edited_by'].includes(s.type)).forEach((s: any) => {
                    const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; pSel.append(o);
                });
                if (!step.propertyId && pSel.options[0]) step.propertyId = pSel.options[0].value;
                pSel.value = step.propertyId || '';
                pSel.onchange = () => { step.propertyId = pSel.value; save(); };
                const valInp = document.createElement('input');
                valInp.type = 'text'; valInp.className = 'notion-wf-input'; valInp.placeholder = 'New value (@today / @toggle / text)';
                valInp.value = step.propertyValue || '';
                valInp.oninput = () => { step.propertyValue = valInp.value; save(); };
                body.append(dbSel, pSel, valInp);
            } else if (step.kind === 'open_page') {
                const modeRow = document.createElement('div');
                modeRow.className = 'notion-wf-field-split';
                const modeSel = document.createElement('select');
                modeSel.className = 'notion-wf-select';
                [['page', 'Workspace page or form'], ['url', 'External URL']].forEach(([v, l]) => {
                    const o = document.createElement('option'); o.value = v; o.textContent = l; modeSel.append(o);
                });
                modeSel.value = step.openMode || 'page';
                modeSel.onchange = () => { step.openMode = modeSel.value as any; save(); draw(); };
                modeRow.append(modeSel);
                body.append(modeRow);
                if (step.openMode === 'url') {
                    const urlInp = document.createElement('input');
                    urlInp.type = 'url'; urlInp.className = 'notion-wf-input'; urlInp.placeholder = 'https://example.com';
                    urlInp.value = step.url || '';
                    urlInp.oninput = () => { step.url = urlInp.value; save(); };
                    body.append(urlInp);
                } else {
                    const pgSel = document.createElement('select');
                    pgSel.className = 'notion-wf-select';
                    viewablePages.forEach(pg => { const o = document.createElement('option'); o.value = pg.id; o.textContent = pg.title || 'Untitled'; pgSel.append(o); });
                    if (!step.pageId && viewablePages[0]) step.pageId = viewablePages[0].id;
                    pgSel.value = step.pageId || '';
                    pgSel.onchange = () => { step.pageId = pgSel.value; save(); };
                    body.append(pgSel);
                }
            } else if (step.kind === 'notify') {
                const recSel = document.createElement('select');
                recSel.className = 'notion-wf-select';
                [['specific', 'Specific people'], ['everyone', 'Everyone in workspace']].forEach(([v, l]) => {
                    const o = document.createElement('option'); o.value = v; o.textContent = l; recSel.append(o);
                });
                recSel.value = step.recipientMode || 'specific';
                recSel.onchange = () => { step.recipientMode = recSel.value as any; save(); draw(); };
                body.append(recSel);
                if ((step.recipientMode || 'specific') === 'specific') {
                    const pplList = document.createElement('div'); pplList.className = 'notion-wf-people-list';
                    step.recipientAccounts = Array.isArray(step.recipientAccounts) ? step.recipientAccounts : [];
                    users.forEach((u: any) => {
                        const key = u.linkedAccount || u.name;
                        const active = step.recipientAccounts!.includes(key) || step.recipientAccounts!.includes(u.name);
                        const chip = document.createElement('button');
                        chip.type = 'button'; chip.className = 'notion-wf-person-pill' + (active ? ' is-selected' : '');
                        chip.innerHTML = `<span class="notion-avatar-circle">${esc(userInitials(u.name))}</span><span>${esc(u.name)}</span>`;
                        chip.onclick = () => {
                            if (active) step.recipientAccounts = step.recipientAccounts!.filter(x => x !== key && x !== u.name);
                            else step.recipientAccounts!.push(key);
                            save(); draw();
                        };
                        pplList.append(chip);
                    });
                    body.append(pplList);
                }
                const msgTa = document.createElement('textarea');
                msgTa.className = 'notion-wf-textarea'; msgTa.rows = 3; msgTa.placeholder = 'Notification message…';
                msgTa.value = step.message || '';
                msgTa.oninput = () => { step.message = msgTa.value; save(); };
                const { wrapBox, tray } = attachAtPills(msgTa, v => { step.message = v; save(); });
                body.append(wrapBox, tray);
            } else if (step.kind === 'send_message') {
                const destSel = document.createElement('select');
                destSel.className = 'notion-wf-select';
                const groupOpts = chats.filter(c => c.kind === 'group').map(c => `<option value="ch:${esc(c.id)}">Channel #${esc(c.name)}</option>`).join('');
                const dmOpts = users.filter((u: any) => !u.blocked).map((u: any) => `<option value="dm:${esc(u.linkedAccount || u.name)}">DM @${esc(u.name)}</option>`).join('');
                destSel.innerHTML = `${groupOpts}${dmOpts}`;
                const curVal = step.chatTargetAccount ? `dm:${step.chatTargetAccount}` : `ch:${step.chatChannelId || chats[0]?.id || 'chat-general'}`;
                destSel.value = curVal;
                destSel.onchange = () => {
                    if (destSel.value.startsWith('dm:')) { step.chatTargetAccount = destSel.value.slice(3); step.chatChannelId = undefined; }
                    else { step.chatChannelId = destSel.value.slice(3); step.chatTargetAccount = undefined; }
                    save();
                };
                const msgTa = document.createElement('textarea');
                msgTa.className = 'notion-wf-textarea'; msgTa.rows = 2; msgTa.placeholder = 'Chat message… (posts in Workspace Chat)';
                msgTa.value = step.message || '';
                msgTa.oninput = () => { step.message = msgTa.value; save(); };
                const { wrapBox, tray } = attachAtPills(msgTa, v => { step.message = v; save(); });
                body.append(destSel, wrapBox, tray);
            } else if (step.kind === 'send_webhook') {
                const urlInp = document.createElement('input');
                urlInp.type = 'url'; urlInp.className = 'notion-wf-input'; urlInp.placeholder = 'POST URL (https://hooks.example.com/...)';
                urlInp.value = step.webhookUrl || '';
                urlInp.oninput = () => { step.webhookUrl = urlInp.value; save(); };
                const hdrInp = document.createElement('input');
                hdrInp.type = 'text'; hdrInp.className = 'notion-wf-input'; hdrInp.placeholder = 'Optional headers JSON (e.g. {"Authorization":"Bearer ..."})';
                hdrInp.value = step.webhookHeadersJson || '';
                hdrInp.oninput = () => { step.webhookHeadersJson = hdrInp.value; save(); };
                const bodyTa = document.createElement('textarea');
                bodyTa.className = 'notion-wf-textarea'; bodyTa.rows = 2; bodyTa.placeholder = 'Optional custom JSON payload (defaults to workspace + page payload)';
                bodyTa.value = step.webhookBody || '';
                bodyTa.oninput = () => { step.webhookBody = bodyTa.value; save(); };
                body.append(urlInp, hdrInp, bodyTa);
            } else if (step.kind === 'define_variables') {
                step.variables = Array.isArray(step.variables) && step.variables.length ? step.variables : [{ id: id(), name: 'var1', value: '' }];
                step.variables.forEach((v, vIdx) => {
                    const vRow = document.createElement('div');
                    vRow.className = 'notion-wf-var-row';
                    const vName = document.createElement('input');
                    vName.type = 'text'; vName.className = 'notion-wf-input'; vName.placeholder = 'Variable name'; vName.value = v.name || '';
                    vName.oninput = () => { v.name = vName.value; save(); };
                    const vVal = document.createElement('input');
                    vVal.type = 'text'; vVal.className = 'notion-wf-input'; vVal.placeholder = 'Value ({{Today}}, text...)'; vVal.value = v.value || '';
                    vVal.oninput = () => { v.value = vVal.value; save(); };
                    const rmV = document.createElement('button');
                    rmV.type = 'button'; rmV.className = 'notion-wf-icon-btn'; rmV.textContent = '×';
                    rmV.onclick = () => { step.variables!.splice(vIdx, 1); save(); draw(); };
                    vRow.append(vName, vVal, rmV);
                    body.append(vRow);
                });
                const addV = document.createElement('button');
                addV.type = 'button'; addV.className = 'notion-wf-mini-add'; addV.textContent = '＋ Add variable';
                addV.onclick = () => { step.variables!.push({ id: id(), name: `var${step.variables!.length + 1}`, value: '' }); save(); draw(); };
                body.append(addV);
            } else if (step.kind === 'show_confirmation') {
                const cMsg = document.createElement('input');
                cMsg.type = 'text'; cMsg.className = 'notion-wf-input'; cMsg.placeholder = 'Confirmation / prompt question…';
                cMsg.value = step.message || cfg.confirmText || 'Are you sure you want to continue?';
                cMsg.oninput = () => { step.message = cMsg.value; cfg.confirmText = cMsg.value; save(); };
                body.append(cMsg);

                const branches = normalizeStepBranches(step);
                const brHead = document.createElement('div');
                brHead.className = 'notion-wf-sub-label';
                brHead.textContent = 'Choice buttons & branching';
                body.append(brHead);

                branches.forEach((br, brIdx) => {
                    const brCard = document.createElement('div');
                    brCard.className = 'notion-wf-branch-box';
                    const brRow = document.createElement('div');
                    brRow.className = 'notion-wf-branch-row';

                    const lblInp = document.createElement('input');
                    lblInp.type = 'text'; lblInp.className = 'notion-wf-input'; lblInp.placeholder = 'Button label';
                    lblInp.value = br.label || '';
                    lblInp.oninput = () => { br.label = lblInp.value; save(); };

                    const modeSel = document.createElement('select');
                    modeSel.className = 'notion-wf-select';
                    [['continue', 'Continue workflow'], ['stop', 'Stop workflow'], ['branch', 'Run branch actions']].forEach(([mv, ml]) => {
                        const o = document.createElement('option'); o.value = mv; o.textContent = ml; modeSel.append(o);
                    });
                    modeSel.value = br.mode || 'continue';
                    modeSel.onchange = () => {
                        br.mode = modeSel.value as any;
                        if (br.mode === 'branch' && (!br.actions || !br.actions.length)) br.actions = [initStepDefaults('insert_blocks')];
                        save(); draw();
                    };

                    const stSel = document.createElement('select');
                    stSel.className = 'notion-wf-select notion-wf-style-sel';
                    [['primary', 'Primary'], ['default', 'Neutral'], ['danger', 'Danger']].forEach(([sv, sl]) => {
                        const o = document.createElement('option'); o.value = sv; o.textContent = sl; stSel.append(o);
                    });
                    stSel.value = br.style || 'default';
                    stSel.onchange = () => { br.style = stSel.value as any; save(); };

                    brRow.append(lblInp, modeSel, stSel);
                    if (branches.length > 1) {
                        const rmBr = document.createElement('button');
                        rmBr.type = 'button'; rmBr.className = 'notion-wf-icon-btn'; rmBr.textContent = '×';
                        rmBr.onclick = () => { branches.splice(brIdx, 1); save(); draw(); };
                        brRow.append(rmBr);
                    }
                    brCard.append(brRow);

                    if (br.mode === 'branch') {
                        br.actions = br.actions || [];
                        const nestedWrap = document.createElement('div');
                        nestedWrap.className = 'notion-wf-branch-steps';
                        renderStepCards(nestedWrap, br.actions, depth + 1);
                        const addSub = document.createElement('button');
                        addSub.type = 'button'; addSub.className = 'notion-wf-mini-add'; addSub.textContent = `＋ Add action for “${br.label || 'Choice'}”`;
                        addSub.onclick = ev => {
                            ev.stopPropagation();
                            openNotionActionSearchMenu(addSub, PAGE_BUTTON_ACTION_DEFS, pickedKind => {
                                br.actions!.push(initStepDefaults(pickedKind as BlockButtonStep['kind']));
                                save(); draw();
                            });
                        };
                        nestedWrap.append(addSub);
                        brCard.append(nestedWrap);
                    }
                    body.append(brCard);
                });

                const addBr = document.createElement('button');
                addBr.type = 'button'; addBr.className = 'notion-wf-mini-add'; addBr.textContent = '＋ Add choice button';
                addBr.onclick = () => {
                    branches.push({ id: id(), label: `Option ${branches.length + 1}`, style: 'default', mode: 'branch', actions: [] });
                    save(); draw();
                };
                body.append(addBr);
            }
            card.append(body);
            container.append(card);
        });
    };

    const draw = () => {
        modal.replaceChildren();

        const header = document.createElement('div');
        header.className = 'notion-wf-header';
        const iconBtn = document.createElement('button');
        iconBtn.type = 'button';
        iconBtn.className = 'notion-wf-icon-picker-btn' + (cfg.icon ? '' : ' is-empty');
        iconBtn.setAttribute('aria-label', 'Choose optional button icon');
        iconBtn.title = 'Choose icon (optional)';
        iconBtn.innerHTML = cfg.icon ? pageIconMarkup(cfg.icon) : '<span class="notion-wf-icon-placeholder">☺</span>';
        iconBtn.onclick = ev => {
            ev.stopPropagation();
            iconPickerForCallback(cfg.icon, true, nextIcon => {
                cfg.icon = nextIcon || '';
                b.icon = cfg.icon || undefined;
                save();
                draw();
                render();
            });
        };

        const labelInp = document.createElement('input');
        labelInp.className = 'notion-wf-title-input';
        labelInp.value = cfg.label || b.text || '';
        labelInp.placeholder = 'New button';
        labelInp.oninput = () => { cfg.label = labelInp.value; b.text = labelInp.value; save(); };

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button'; closeBtn.className = 'notion-wf-close-btn'; closeBtn.textContent = '×'; closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.onclick = () => { closeNotionActionPicker(); closeButtonModalOverlay(); save(); render(); };
        header.append(iconBtn, labelInp, closeBtn);

        const scopeRow = document.createElement('div');
        scopeRow.className = 'notion-wf-scope';
        scopeRow.innerHTML = `<span>On page</span><span class="notion-wf-scope-pill">${esc(p.title || 'Untitled')}</span>`;

        const whenWrap = document.createElement('section');
        whenWrap.className = 'notion-wf-section';
        whenWrap.innerHTML = `<div class="notion-wf-section-label">When</div><div class="notion-wf-card notion-wf-static-trig">✳ <strong>Button</strong> is clicked</div>`;

        const stem = document.createElement('div');
        stem.className = 'notion-wf-connector';

        const doWrap = document.createElement('section');
        doWrap.className = 'notion-wf-section';
        const doLbl = document.createElement('div');
        doLbl.className = 'notion-wf-section-label';
        doLbl.textContent = 'Do';
        doWrap.append(doLbl);

        renderStepCards(doWrap, cfg.steps, 0);

        const addBtn = document.createElement('button');
        addBtn.type = 'button'; addBtn.className = 'notion-wf-add-link notion-wf-new-action-btn'; addBtn.textContent = '＋ New action';
        addBtn.onclick = ev => {
            ev.stopPropagation();
            openNotionActionSearchMenu(addBtn, PAGE_BUTTON_ACTION_DEFS, pickedKind => {
                cfg.steps.push(initStepDefaults(pickedKind as BlockButtonStep['kind']));
                save(); draw();
            });
        };
        doWrap.append(addBtn);

        const footer = document.createElement('div');
        footer.className = 'notion-wf-footer';
        const doneBtn = document.createElement('button');
        doneBtn.type = 'button';
        doneBtn.className = 'notion-wf-done-btn';
        doneBtn.textContent = 'Done';
        doneBtn.onclick = () => { closeNotionActionPicker(); closeButtonModalOverlay(); save(); render(); };
        footer.append(doneBtn);

        modal.append(header, scopeRow, whenWrap, stem, doWrap, footer);
    };
    draw();
    overlay.append(modal);
    document.body.append(overlay);
    activeButtonModalOverlay = overlay;
}
function renderButtonBlock(el: HTMLElement, b: Block, p: Page, ro: boolean) {
    const cfg = b.buttonConfig || (b.buttonConfig = { label: b.text || 'New button', icon: '', steps: [{ id: id(), kind: 'insert_blocks', blocksText: 'New action block' }] });
    const card = document.createElement('div');
    card.className = 'block-button-card';
    const runBtn = document.createElement('button');
    runBtn.type = 'button';
    runBtn.className = 'template-action block-button-run';
    const icoMarkup = cfg.icon ? `<span class="block-button-ico">${pageIconMarkup(cfg.icon)}</span>` : '';
    runBtn.innerHTML = `${icoMarkup}<span>${esc(cfg.label || b.text || 'New button')}</span>`;
    runBtn.disabled = ro;
    if (!ro) {
        runBtn.onclick = () => executeBlockButton(p, b);
    }
    card.append(runBtn);
    if (!ro) {
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'secondary-button block-button-edit';
        editBtn.textContent = '⚙ Edit';
        editBtn.onclick = ev => { ev.stopPropagation(); openButtonConfigPopover(p, b, card); };
        card.append(editBtn);
    }
    el.append(card);
}

const CODE_LANGUAGES = ['Plain text', 'JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'JSON', 'SQL', 'Bash', 'Mermaid'];
function renderCodeBlock(el: HTMLElement, b: Block, p: Page, ro: boolean) {
    el.contentEditable = 'false';
    const curLang = b.language && CODE_LANGUAGES.includes(b.language) ? b.language : 'Plain text';
    const isMermaid = curLang === 'Mermaid';
    const mMode = b.mermaidMode || 'split';
    const optsHtml = CODE_LANGUAGES.map(l => `<option${l === curLang ? ' selected' : ''}>${esc(l)}</option>`).join('');
    el.innerHTML = `<div class="code-meta" contenteditable="false"><select aria-label="Code language" ${ro ? 'disabled' : ''}>${optsHtml}</select>${isMermaid ? `<div class="mermaid-mode-tabs" role="tablist"><button type="button" data-mm="code" class="${mMode === 'code' ? 'is-active' : ''}">Code</button><button type="button" data-mm="split" class="${mMode === 'split' ? 'is-active' : ''}">Split</button><button type="button" data-mm="preview" class="${mMode === 'preview' ? 'is-active' : ''}">Preview</button></div>` : ''}<button type="button" class="code-copy-btn">Copy</button></div><div class="code-body" data-mermaid-mode="${isMermaid ? mMode : 'code'}"><div class="code-surface"><pre class="code-highlight-layer" aria-hidden="true"></pre><pre class="code-edit-layer" contenteditable="${ro ? 'false' : 'true'}" spellcheck="false"></pre></div>${isMermaid ? '<div class="mermaid-preview-pane"></div>' : ''}</div>`;
    const langSel = el.querySelector('.code-meta select') as HTMLSelectElement;
    const hiPre = el.querySelector('.code-highlight-layer') as HTMLPreElement;
    const editPre = el.querySelector('.code-edit-layer') as HTMLPreElement;
    const bodyEl = el.querySelector('.code-body') as HTMLElement;
    const mPane = el.querySelector('.mermaid-preview-pane') as HTMLElement | null;

    const syncHighlight = () => {
        const src = b.text || '';
        const highlighted = typeof ArchitectRichRender !== 'undefined'
            ? ArchitectRichRender.highlightCode(src, b.language || 'Plain text')
            : esc(src);
        hiPre.innerHTML = highlighted + (src.endsWith('\n') || !src ? '\n' : '');
        if (mPane && (b.language === 'Mermaid')) {
            if (typeof ArchitectRichRender !== 'undefined') {
                const res = ArchitectRichRender.renderMermaidSvg(src);
                if (res.ok && res.svg) mPane.innerHTML = res.svg;
                else mPane.innerHTML = `<div class="mermaid-error">${esc(res.error || 'Enter valid Mermaid syntax (flowchart, sequenceDiagram, stateDiagram, pie)')}</div>`;
            }
        }
    };
    editPre.textContent = b.text || '';
    syncHighlight();

    if (!ro) {
        langSel.onchange = () => {
            b.language = langSel.value;
            if (b.language === 'Mermaid' && !b.mermaidMode) b.mermaidMode = 'split';
            save();
            render();
        };
        editPre.addEventListener('input', () => {
            b.text = readPlainTextFromNode(editPre);
            syncHighlight();
        });
        wireText(editPre, b, p);
    }
    el.querySelectorAll('.mermaid-mode-tabs button').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = (btn as HTMLElement).dataset.mm as 'code'|'split'|'preview';
            b.mermaidMode = next;
            bodyEl.dataset.mermaidMode = next;
            el.querySelectorAll('.mermaid-mode-tabs button').forEach(x => x.classList.toggle('is-active', x === btn));
            save();
        });
    });
    el.querySelector('.code-copy-btn')?.addEventListener('click', () => {
        navigator.clipboard?.writeText(b.text || '');
        toast('Code copied');
    });
}

function getSimpleTableCellColors(data: SimpleTableData, rowIdx: number, colIdx: number) {
    const cellKey = rowIdx < 0 ? `h:${colIdx}` : `${rowIdx}:${colIdx}`;
    const pick = (v?: string) => (v && v !== 'default' ? v : '');
    const key = pick(data.cellColors?.[cellKey]) || (rowIdx >= 0 ? pick(data.rowColors?.[rowIdx]) : '') || pick(data.colColors?.[colIdx]) || 'default';
    return key !== 'default' ? BLOCK_COLORS.find(c => c.key === key) || null : null;
}
function ensureSimpleTableData(b: Block): SimpleTableData {
    const d = b.tableData || (b.tableData = { headers: ['Column 1', 'Column 2'], rows: [['', '']] });
    const cols = Math.max(1, d.headers?.length || d.rows?.[0]?.length || 2);
    if (!Array.isArray(d.headers) || d.headers.length !== cols) d.headers = Array.from({ length: cols }, (_, i) => d.headers?.[i] ?? '');
    if (!Array.isArray(d.headerHtml) || d.headerHtml.length !== cols) d.headerHtml = Array.from({ length: cols }, (_, i) => d.headerHtml?.[i] ?? esc(d.headers[i] || ''));
    d.rows = (Array.isArray(d.rows) && d.rows.length ? d.rows : [Array(cols).fill('')]).map(r => Array.from({ length: cols }, (_, c) => r?.[c] ?? ''));
    d.rowHtml = d.rows.map((r, ri) => Array.from({ length: cols }, (_, c) => d.rowHtml?.[ri]?.[c] ?? esc(r[c] || '')));
    if (d.hasHeaderRow === undefined) d.hasHeaderRow = true;
    d.hasHeaderColumn = !!d.hasHeaderColumn;
    d.fullWidth = !!d.fullWidth;
    d.colColors = Array.from({ length: cols }, (_, c) => d.colColors?.[c] || 'default');
    d.rowColors = Array.from({ length: d.rows.length }, (_, r) => d.rowColors?.[r] || 'default');
    d.cellColors = d.cellColors || {};
    return d;
}
function openSimpleTableAxisMenu(p: Page, b: Block, anchorEl: HTMLElement, axis: 'col' | 'row', index: number) {
    const d = ensureSimpleTableData(b);
    const pop = openFloatingPopover(anchorEl, 'simple-table-axis-popover');
    const act = (fn: () => void) => {
        pushUndoBeforeEdit(p);
        fn();
        save();
        closeRichPopover();
        render();
    };
    const addBtn = (label: string, fn: () => void, disabled = false) => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'command-row'; btn.textContent = label; btn.disabled = disabled;
        btn.onclick = () => act(fn);
        pop.append(btn);
    };
    if (axis === 'col') {
        const insertColAt = (pos: number) => {
            d.headers.splice(pos, 0, '');
            d.headerHtml!.splice(pos, 0, '');
            d.colColors!.splice(pos, 0, 'default');
            d.rows.forEach((r, ri) => { r.splice(pos, 0, ''); d.rowHtml![ri].splice(pos, 0, ''); });
            if (b.columnWidths?.length) b.columnWidths.splice(pos, 0, Math.round(100 / d.headers.length));
        };
        const swapCols = (a: number, bIdx: number) => {
            [d.headers[a], d.headers[bIdx]] = [d.headers[bIdx], d.headers[a]];
            [d.headerHtml![a], d.headerHtml![bIdx]] = [d.headerHtml![bIdx], d.headerHtml![a]];
            [d.colColors![a], d.colColors![bIdx]] = [d.colColors![bIdx], d.colColors![a]];
            d.rows.forEach((r, ri) => {
                [r[a], r[bIdx]] = [r[bIdx], r[a]];
                [d.rowHtml![ri][a], d.rowHtml![ri][bIdx]] = [d.rowHtml![ri][bIdx], d.rowHtml![ri][a]];
            });
        };
        addBtn('← Insert left', () => insertColAt(index));
        addBtn('→ Insert right', () => insertColAt(index + 1));
        addBtn('⇐ Move left', () => swapCols(index, index - 1), index <= 0);
        addBtn('⇒ Move right', () => swapCols(index, index + 1), index >= d.headers.length - 1);
        addBtn('⧉ Duplicate column', () => {
            d.headers.splice(index + 1, 0, d.headers[index]);
            d.headerHtml!.splice(index + 1, 0, d.headerHtml![index]);
            d.colColors!.splice(index + 1, 0, d.colColors![index]);
            d.rows.forEach((r, ri) => { r.splice(index + 1, 0, r[index]); d.rowHtml![ri].splice(index + 1, 0, d.rowHtml![ri][index]); });
        });
        if (index === 0) addBtn(d.hasHeaderColumn ? '✓ Header column' : 'Header column', () => { d.hasHeaderColumn = !d.hasHeaderColumn; });
        addBtn('⫼ Distribute columns evenly', () => { b.columnWidths = Array(d.headers.length).fill(Number((100 / d.headers.length).toFixed(2))); });
        addBtn('⌫ Clear column contents', () => { d.headers[index] = ''; d.headerHtml![index] = ''; d.rows.forEach((r, ri) => { r[index] = ''; d.rowHtml![ri][index] = ''; }); });
        addBtn('🗑 Delete column', () => {
            d.headers.splice(index, 1); d.headerHtml!.splice(index, 1); d.colColors!.splice(index, 1);
            d.rows.forEach((r, ri) => { r.splice(index, 1); d.rowHtml![ri].splice(index, 1); });
            if (b.columnWidths?.length) b.columnWidths.splice(index, 1);
        }, d.headers.length <= 1);
    } else {
        const isHeaderRow = index === -1;
        addBtn('↑ Insert above', () => {
            if (isHeaderRow) {
                d.rows.unshift([...d.headers]); d.rowHtml!.unshift([...d.headerHtml!]);
                d.rowColors!.unshift('default');
                d.headers = d.headers.map(() => ''); d.headerHtml = d.headers.map(() => '');
            } else {
                d.rows.splice(index, 0, d.headers.map(() => ''));
                d.rowHtml!.splice(index, 0, d.headers.map(() => ''));
                d.rowColors!.splice(index, 0, 'default');
            }
        });
        addBtn('↓ Insert below', () => {
            const pos = isHeaderRow ? 0 : index + 1;
            d.rows.splice(pos, 0, d.headers.map(() => ''));
            d.rowHtml!.splice(pos, 0, d.headers.map(() => ''));
            d.rowColors!.splice(pos, 0, 'default');
        });
        if (!isHeaderRow) {
            addBtn('⇑ Move up', () => {
                [d.rows[index], d.rows[index - 1]] = [d.rows[index - 1], d.rows[index]];
                [d.rowHtml![index], d.rowHtml![index - 1]] = [d.rowHtml![index - 1], d.rowHtml![index]];
                [d.rowColors![index], d.rowColors![index - 1]] = [d.rowColors![index - 1], d.rowColors![index]];
            }, index <= 0);
            addBtn('⇓ Move down', () => {
                [d.rows[index], d.rows[index + 1]] = [d.rows[index + 1], d.rows[index]];
                [d.rowHtml![index], d.rowHtml![index + 1]] = [d.rowHtml![index + 1], d.rowHtml![index]];
                [d.rowColors![index], d.rowColors![index + 1]] = [d.rowColors![index + 1], d.rowColors![index]];
            }, index >= d.rows.length - 1);
            addBtn('⧉ Duplicate row', () => {
                d.rows.splice(index + 1, 0, [...d.rows[index]]);
                d.rowHtml!.splice(index + 1, 0, [...d.rowHtml![index]]);
                d.rowColors!.splice(index + 1, 0, d.rowColors![index]);
            });
        }
        addBtn(d.hasHeaderRow ? '✓ Header row' : 'Header row', () => { d.hasHeaderRow = !d.hasHeaderRow; });
        addBtn('⌫ Clear row contents', () => {
            if (isHeaderRow) { d.headers = d.headers.map(() => ''); d.headerHtml = d.headers.map(() => ''); }
            else { d.rows[index] = d.rows[index].map(() => ''); d.rowHtml![index] = d.rows[index].map(() => ''); }
        });
        if (!isHeaderRow) {
            addBtn('🗑 Delete row', () => {
                d.rows.splice(index, 1); d.rowHtml!.splice(index, 1); d.rowColors!.splice(index, 1);
            }, d.rows.length <= 1);
        }
    }
    const swatchStrip = document.createElement('div');
    swatchStrip.className = 'simple-table-color-strip';
    BLOCK_COLORS.forEach(c => {
        const sw = document.createElement('button');
        sw.type = 'button';
        sw.className = 'simple-table-color-dot';
        sw.title = `${c.label} background`;
        sw.style.background = c.bgHex;
        sw.style.color = c.textHex;
        sw.textContent = c.key === 'default' ? '×' : '';
        sw.onclick = () => act(() => {
            if (axis === 'col') d.colColors![index] = c.key;
            else if (index >= 0) d.rowColors![index] = c.key;
            else {
                for (let ci = 0; ci < d.headers.length; ci++) {
                    if (c.key === 'default') delete d.cellColors![`h:${ci}`];
                    else d.cellColors![`h:${ci}`] = c.key;
                }
            }
        });
        swatchStrip.append(sw);
    });
    pop.append(swatchStrip);
}
function renderSimpleTableBlock(el: HTMLElement, b: Block, p: Page, ro: boolean) {
    el.contentEditable = 'false';
    const d = ensureSimpleTableData(b);
    el.classList.toggle('is-table-fullwidth', !!d.fullWidth);
    const wrap = document.createElement('div');
    wrap.className = 'simple-table-shell' + (d.fullWidth ? ' is-full-width' : '');
    if (!ro) {
        const bar = document.createElement('div');
        bar.className = 'simple-table-toolbar';
        const mkToggle = (label: string, active: boolean, fn: () => void) => {
            const btn = document.createElement('button');
            btn.type = 'button'; btn.className = 'simple-table-tool-btn' + (active ? ' is-active' : '');
            btn.textContent = label;
            btn.onclick = () => { pushUndoBeforeEdit(p); fn(); save(); render(); };
            return btn;
        };
        bar.append(
            mkToggle('Header row', d.hasHeaderRow !== false, () => { d.hasHeaderRow = d.hasHeaderRow === false; }),
            mkToggle('Header column', !!d.hasHeaderColumn, () => { d.hasHeaderColumn = !d.hasHeaderColumn; }),
            mkToggle('↔ Fit to page', !!d.fullWidth, () => { d.fullWidth = !d.fullWidth; }),
            mkToggle('⫼ Distribute columns', false, () => { b.columnWidths = Array(d.headers.length).fill(Number((100 / d.headers.length).toFixed(2))); })
        );
        wrap.append(bar);
    }

    const gridRow = document.createElement('div');
    gridRow.className = 'simple-table-grid-row';
    const scroll = document.createElement('div');
    scroll.className = 'table-scroll';
    const table = document.createElement('table');
    table.className = 'simple-table' + (d.hasHeaderRow !== false ? ' has-header-row' : '') + (d.hasHeaderColumn ? ' has-header-col' : '');
    if (b.columnWidths?.length === d.headers.length) {
        const cg = document.createElement('colgroup');
        b.columnWidths.forEach(w => { const c = document.createElement('col'); c.style.width = `${w}%`; cg.append(c); });
        table.append(cg);
    }
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const focusCellByCoord = (rowIdx: number, colIdx: number) => {
        const allRows = Array.from(table.querySelectorAll('tr'));
        const targetTr = allRows[rowIdx];
        const targetCell = targetTr?.querySelectorAll('.simple-table-cell-edit')[colIdx] as HTMLElement | undefined;
        if (targetCell) {
            targetCell.focus();
            setCaretAtTextOffset(targetCell, (targetCell.innerText || '').length);
        }
    };

    const wireCellNavigation = (cellEdit: HTMLElement, rowIdx: number, colIdx: number, updateFn: () => void) => {
        if (ro) return;
        cellEdit.addEventListener('input', () => { updateFn(); save(); });
        cellEdit.addEventListener('keydown', ev => {
            if (ev.key === 'Tab') {
                ev.preventDefault();
                const numCols = d.headers.length;
                const totalRows = 1 + d.rows.length;
                const flat = rowIdx * numCols + colIdx + (ev.shiftKey ? -1 : 1);
                if (!ev.shiftKey && flat >= totalRows * numCols) {
                    pushUndoBeforeEdit(p);
                    d.rows.push(d.headers.map(() => ''));
                    d.rowHtml!.push(d.headers.map(() => ''));
                    d.rowColors!.push('default');
                    save();
                    render();
                    requestAnimationFrame(() => {
                        const newBlk = editor.querySelector(`[data-block-id="${CSS.escape(b.id)}"] table.simple-table`);
                        const newRows = newBlk?.querySelectorAll('tr');
                        const lastEdit = newRows?.[newRows.length - 1]?.querySelector('.simple-table-cell-edit') as HTMLElement | undefined;
                        lastEdit?.focus();
                    });
                    return;
                }
                const nextFlat = Math.max(0, Math.min(totalRows * numCols - 1, flat));
                focusCellByCoord(Math.floor(nextFlat / numCols), nextFlat % numCols);
            }
        });
    };

    const htr = document.createElement('tr');
    if (d.hasHeaderRow !== false) htr.className = 'is-header-row';
    d.headers.forEach((value, col) => {
        const th = document.createElement('th');
        if (ro) th.contentEditable = 'false';
        if (col === 0 && d.hasHeaderColumn) th.classList.add('is-header-col');
        const pal = getSimpleTableCellColors(d, -1, col);
        if (pal) { th.style.background = pal.bgHex; th.style.color = pal.textHex; }
        if (!ro) {
            const colHandle = document.createElement('button');
            colHandle.type = 'button'; colHandle.className = 'simple-table-col-handle';
            colHandle.contentEditable = 'false'; colHandle.title = 'Column options'; colHandle.textContent = '⋯';
            colHandle.onclick = ev => { ev.stopPropagation(); openSimpleTableAxisMenu(p, b, colHandle, 'col', col); };
            th.append(colHandle);
            if (col === 0) {
                const rowHandle = document.createElement('button');
                rowHandle.type = 'button'; rowHandle.className = 'simple-table-row-handle';
                rowHandle.contentEditable = 'false'; rowHandle.title = 'Row options'; rowHandle.textContent = '⋮';
                rowHandle.onclick = ev => { ev.stopPropagation(); openSimpleTableAxisMenu(p, b, rowHandle, 'row', -1); };
                th.append(rowHandle);
            }
        }
        const cellEdit = document.createElement('div');
        cellEdit.className = 'simple-table-cell-edit';
        cellEdit.contentEditable = ro ? 'false' : 'true';
        cellEdit.innerHTML = d.headerHtml?.[col] ? cleanInlineHtml(d.headerHtml[col]) : esc(value);
        hydrateInlineWidgets(cellEdit, b, p, ro);
        wireCellNavigation(cellEdit, 0, col, () => {
            d.headers[col] = (cellEdit.innerText || '').replace(/\u200b/g, '');
            d.headerHtml![col] = cleanInlineHtml(cellEdit.innerHTML);
        });
        th.append(cellEdit);
        htr.append(th);
    });
    thead.append(htr);

    d.rows.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((value, col) => {
            const td = document.createElement('td');
            if (ro) td.contentEditable = 'false';
            if (col === 0 && d.hasHeaderColumn) td.classList.add('is-header-col');
            const pal = getSimpleTableCellColors(d, rowIndex, col);
            if (pal) { td.style.background = pal.bgHex; td.style.color = pal.textHex; }
            if (!ro && col === 0) {
                const rowHandle = document.createElement('button');
                rowHandle.type = 'button'; rowHandle.className = 'simple-table-row-handle';
                rowHandle.contentEditable = 'false'; rowHandle.title = 'Row options'; rowHandle.textContent = '⋮';
                rowHandle.onclick = ev => { ev.stopPropagation(); openSimpleTableAxisMenu(p, b, rowHandle, 'row', rowIndex); };
                td.append(rowHandle);
            }
            const cellEdit = document.createElement('div');
            cellEdit.className = 'simple-table-cell-edit';
            cellEdit.contentEditable = ro ? 'false' : 'true';
            cellEdit.innerHTML = d.rowHtml?.[rowIndex]?.[col] ? cleanInlineHtml(d.rowHtml[rowIndex][col]) : esc(value);
            hydrateInlineWidgets(cellEdit, b, p, ro);
            wireCellNavigation(cellEdit, rowIndex + 1, col, () => {
                d.rows[rowIndex][col] = (cellEdit.innerText || '').replace(/\u200b/g, '');
                d.rowHtml![rowIndex][col] = cleanInlineHtml(cellEdit.innerHTML);
            });
            td.append(cellEdit);
            tr.append(td);
        });
        tbody.append(tr);
    });

    table.append(thead, tbody);
    scroll.append(table);
    gridRow.append(scroll);
    if (!ro) {
        const addColBtn = document.createElement('button');
        addColBtn.type = 'button'; addColBtn.className = 'simple-table-add-col';
        addColBtn.title = 'Add column'; addColBtn.textContent = '＋';
        addColBtn.onclick = () => {
            pushUndoBeforeEdit(p);
            d.headers.push(`Column ${d.headers.length + 1}`);
            d.headerHtml!.push(esc(d.headers[d.headers.length - 1]));
            d.colColors!.push('default');
            d.rows.forEach((r, ri) => { r.push(''); d.rowHtml![ri].push(''); });
            save(); render();
        };
        gridRow.append(addColBtn);
    }
    wrap.append(gridRow);
    if (!ro) {
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button'; addRowBtn.className = 'add-table-row simple-table-add-row';
        addRowBtn.textContent = '＋ New row';
        addRowBtn.onclick = () => {
            pushUndoBeforeEdit(p);
            d.rows.push(d.headers.map(() => ''));
            d.rowHtml!.push(d.headers.map(() => ''));
            d.rowColors!.push('default');
            save(); render();
        };
        wrap.append(addRowBtn);
    }
    el.append(wrap);
}
const activeAudioPlayers = new Set();
function stopAllAudioPlayers(exceptAudio = null) {
    activeAudioPlayers.forEach(entry => {
        if (exceptAudio && entry.audio === exceptAudio) return;
        try { entry.audio.pause(); } catch {}
        entry.resetUi();
    });
}
function buildAudioPlayerElement(asset, blockItem = null) {
    const card = document.createElement('div');
    card.className = 'audio-player-card';
    const chips = [asset.category, asset.creator, asset.provider, asset.durationSec ? formatSeconds(asset.durationSec) : ''].filter(Boolean);
    card.innerHTML = `<div class="audio-player-head"><span>${asset.category === 'sfx' ? '🔊' : '🎵'}</span><span class="audio-player-title">${esc(asset.name || 'Audio')}</span><span class="asset-meta-chips">${chips.map(c => `<span class="asset-chip">${esc(String(c))}</span>`).join('')}</span><button type="button" class="secondary-button" style="min-height:26px;padding:0 8px" data-aud-dl>↓ Download</button></div><div class="audio-player-controls"><button type="button" class="audio-play-btn" aria-label="Play audio">▶</button><input type="range" class="audio-timeline" min="0" max="1000" value="0" aria-label="Audio timeline"><span class="audio-time">0:00 / ${formatSeconds(asset.durationSec || 0)}</span></div>`;
    const playBtn = card.querySelector('.audio-play-btn');
    const slider = card.querySelector('.audio-timeline');
    const timeEl = card.querySelector('.audio-time');
    const audio = new Audio();
    audio.preload = 'metadata';
    const playerEntry = { audio, resetUi: () => { playBtn.textContent = '▶'; } };
    activeAudioPlayers.add(playerEntry);
    let loaded = false;
    const ensureLoaded = async () => {
        if (loaded) return true;
        const src = await ArchitectBackend.resolveAssetOriginalUrl(asset);
        if (!src) { toast('Audio source unavailable'); return false; }
        audio.src = src;
        loaded = true;
        return true;
    };
    ArchitectBackend.resolveAssetOriginalUrl(asset).then(src => { if (src && card.isConnected) { audio.src = src; loaded = true; } });
    const syncUi = () => {
        const dur = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (asset.durationSec || 0);
        const cur = audio.currentTime || 0;
        if (dur > 0) slider.value = String(Math.round((cur / dur) * 1000));
        timeEl.textContent = `${formatSeconds(cur)} / ${formatSeconds(dur)}`;
    };
    audio.addEventListener('loadedmetadata', syncUi);
    audio.addEventListener('timeupdate', syncUi);
    audio.addEventListener('ended', () => { playBtn.textContent = '▶'; });
    playBtn.onclick = async e => {
        e.stopPropagation();
        if (!(await ensureLoaded())) return;
        if (audio.paused) {
            stopAllAudioPlayers(audio);
            await audio.play().catch(() => toast('Audio playback failed'));
            playBtn.textContent = '❚❚';
        } else {
            audio.pause();
            playBtn.textContent = '▶';
        }
    };
    slider.oninput = async () => {
        if (!(await ensureLoaded())) return;
        if (audio.readyState < 1) {
            await new Promise(resolve => audio.addEventListener('loadedmetadata', resolve, { once: true }));
        }
        const dur = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (asset.durationSec || 0);
        if (dur > 0) {
            audio.currentTime = (Number(slider.value) / 1000) * dur;
            syncUi();
        }
    };
    card.querySelector('[data-aud-dl]').onclick = e => { e.stopPropagation(); downloadAssetOrBlock(asset, blockItem, asset.name); };
    return card;
}
let lightboxZoom = 1;
let lightboxAsset = null;
async function openImageLightbox(asset) {
    const dialog = $('#lightbox-dialog');
    if (!dialog) return;
    lightboxAsset = asset;
    lightboxZoom = 1;
    $('#lightbox-title').textContent = asset.name || 'Image preview';
    const metaParts = [asset.category, asset.creator ? `by ${asset.creator}` : '', asset.width && asset.height ? `${asset.width}×${asset.height}` : '', formatBytes(asset.sizeBytes), asset.provider].filter(Boolean);
    $('#lightbox-subtitle').textContent = metaParts.join(' · ');
    const img = $('#lightbox-img');
    img.style.transform = 'scale(1)';
    $('#lightbox-zoom-label').textContent = 'Fit';
    img.src = asset.storageMode === 'local' ? (asset.url || '') : (asset.previewDataUrl || asset.url || '');
    if (!dialog.open) dialog.showModal();
    const fullUrl = await ArchitectBackend.resolveAssetOriginalUrl(asset);
    if (fullUrl && lightboxAsset?.id === asset.id) img.src = fullUrl;
}
function editableTarget(blockElement) { return blockElement?.querySelector(':scope > .code-body > .code-surface > .code-edit-layer, :scope > .code-surface > .code-edit-layer, :scope > .code-edit-layer, :scope > .block-copy, :scope > pre') || blockElement; }
function activeBlockFromNode(node) { const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement; return element?.closest?.('.block') || null; }
function activeBlockFromSelection() { return activeBlockFromNode(getSelection()?.focusNode); }
function pageIconMarkup(icon) {
    if (typeof ArchitectIcons !== 'undefined' && ArchitectIcons.renderIconHtml) return ArchitectIcons.renderIconHtml(icon);
    return String(icon || '📄').startsWith('data:image') ? `<img class="page-link-image-icon" src="${esc(icon)}" alt="">` : esc(icon || '📄');
}
function readPlainTextFromNode(root) {
    let out = '';
    root.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) out += (node.textContent || '').replace(/\u200b/g, '');
        else if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName;
            if (tag === 'BR') out += '\n';
            else {
                if (['DIV', 'P'].includes(tag) && out && !out.endsWith('\n')) out += '\n';
                out += readPlainTextFromNode(node);
            }
        }
    });
    return out.replace(/\r\n?/g, '\n');
}
function insertPlainTextIntoPre(pre, insertedText) {
    const selection = getSelection();
    if (!selection?.rangeCount) return false;
    const range = selection.getRangeAt(0);
    if (!pre.contains(range.startContainer) || !pre.contains(range.endContainer)) return false;
    const before = document.createRange(); before.selectNodeContents(pre); before.setEnd(range.startContainer, range.startOffset);
    const throughEnd = document.createRange(); throughEnd.selectNodeContents(pre); throughEnd.setEnd(range.endContainer, range.endOffset);
    const startOffset = readPlainTextFromNode(before.cloneContents()).length;
    const endOffset = readPlainTextFromNode(throughEnd.cloneContents()).length;
    const fullText = readPlainTextFromNode(pre);
    const nextText = fullText.slice(0, startOffset) + insertedText + fullText.slice(endOffset);
    pre.textContent = nextText.endsWith('\n') ? nextText + '\u200b' : nextText;
    setCaretAtTextOffset(pre, startOffset + insertedText.length);
    return true;
}
function updateBlockFromDOM(outer) {
    const ctx = blockContext(outer);
    const item = ctx?.item;
    if (!item || !outer || ['divider','page_link','mention','image','toc','breadcrumb','button','date','equation','video','audio','bookmark','embed','file','pdf','columns','table','database_view','board_view'].includes(item.type)) return;
    const target = editableTarget(outer);
    if (!target || target.getAttribute('contenteditable') === 'false') return;
    if (item.type === 'code') {
        item.text = readPlainTextFromNode(target);
        item.html = undefined;
        outer.classList.toggle('is-empty', !item.text.trim());
        return;
    }
    const plain = (target.textContent || '').replace(/\u200b/g, '');
    item.text = plain ? (target.innerText || '').replace(/\u200b/g, '') : '';
    item.html = item.text.trim() ? cleanInlineHtml(target.innerHTML.replace(/\u200b/g, '')) : undefined;
    outer.classList.toggle('is-empty', !item.text.trim());
}
function syncBlocksFromEditor() { editor.querySelectorAll('.block').forEach(outer => updateBlockFromDOM(outer)); }
function resolveTextPoint(target, offset) { const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT); let node, remaining = Math.max(0, offset), last = null; while ((node = walker.nextNode())) { last = node; if (remaining <= node.textContent.length) return { node, offset: remaining }; remaining -= node.textContent.length; } if (!last) { last = document.createTextNode('\u200b'); target.append(last); } return { node: last, offset: offset <= 0 ? 0 : last.textContent.length }; }
function textOffsetInTarget(target, container, offset) { if (!target || !container || !target.contains(container)) return 0; const range = document.createRange(); range.selectNodeContents(target); range.setEnd(container, offset); return range.toString().replace(/\u200b/g, '').length; }
function setCaretAtTextOffset(target, offset) { if (!target) return; const focusHost = target.getAttribute('contenteditable') === 'true' ? target : (target.closest('.block-editor') || target.closest('.block') || target); focusHost.focus?.({ preventScroll: true }); const pt = resolveTextPoint(target, offset); const range = document.createRange(); range.setStart(pt.node, pt.offset); range.collapse(true); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); }
function setActiveEditorBlock(blockElement) { editor.querySelectorAll('.block.active-block').forEach(element => element.classList.remove('active-block')); blockElement?.classList.add('active-block'); if (blockElement) showBlockRail(blockElement); }
function ensureBlockInViewport(outer) {
    if (!outer?.isConnected) return;
    const rect = outer.getBoundingClientRect();
    const topMargin = 58;
    const bottomMargin = 32;
    if (rect.top < topMargin) {
        window.scrollBy({ top: rect.top - topMargin, left: 0, behavior: 'auto' });
    } else if (rect.bottom > window.innerHeight - bottomMargin) {
        window.scrollBy({ top: rect.bottom - (window.innerHeight - bottomMargin), left: 0, behavior: 'auto' });
    }
}
function focusBlockEl(outer, atStart = true) { if (!outer) { editor.querySelector('.block-editor')?.focus({ preventScroll: true }); return; } setActiveEditorBlock(outer); const target = editableTarget(outer); const textLen = target.tagName === 'PRE' ? readPlainTextFromNode(target).length : (target.innerText || '').replace(/\u200b/g, '').length; setCaretAtTextOffset(target, atStart ? 0 : textLen); ensureBlockInViewport(outer); }
function focusBlockById(blockId, atStart = true) { focusBlockEl(editor.querySelector(`[data-block-id="${CSS.escape(blockId)}"]`), atStart); }
function focusBlockAt(index, atStart = true) { focusBlockEl(editor.querySelector(`.block-editor > .block[data-index="${index}"]`), atStart); }
function expandAncestorsForBlock(list, targetId) {
    for (const item of list || []) {
        if (item.id === targetId) return true;
        if (item.children?.length && expandAncestorsForBlock(item.children, targetId)) {
            if (isToggleBlock(item) && !item.open) item.open = true;
            return true;
        }
    }
    return false;
}
function focusLinkedBlock(blockId) {
    const page = current();
    if (expandAncestorsForBlock(page.blocks, blockId)) { save(); render(); }
    const element = editor.querySelector(`[data-block-id="${CSS.escape(blockId)}"]`);
    if (!element) return;
    element.scrollIntoView({ block: 'center', behavior: 'smooth' });
    element.classList.add('linked-block');
    setActiveEditorBlock(element);
    setTimeout(() => element.classList.remove('linked-block'), 2200);
}
function contentAtCaret(target, end) { const selection = getSelection(); if (!selection?.rangeCount) return null; const selected = selection.getRangeAt(0); if (!target.contains(selected.startContainer) || !target.contains(selected.endContainer)) return null; const range = document.createRange(); range.selectNodeContents(target); if (end) range.setStart(selected.endContainer, selected.endOffset); else range.setEnd(selected.startContainer, selected.startOffset); return range; }
function fragmentAsEditableHTML(fragment) { const wrapper = document.createElement('div'); wrapper.append(fragment); wrapper.querySelectorAll('br').forEach(br => br.replaceWith('\n')); return { text: (wrapper.textContent || '').replace(/\u200b/g, ''), html: cleanInlineHtml(wrapper.innerHTML) }; }
function selectedListTargetsInContext(ctx, target, blockEl) {
    const selection = getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const startOffset = range ? textOffsetInTarget(target, range.startContainer, range.startOffset) : 0;
    const endOffset = range ? textOffsetInTarget(target, range.endContainer, range.endOffset) : startOffset;
    const single = { targets: [{ item: ctx.item, index: ctx.index, blockEl }], startBlockId: ctx.item.id, endBlockId: ctx.item.id, startOffset, endOffset, collapsed: !range || range.collapsed };
    if (!range || range.collapsed || !blockEl?.parentElement) return single;
    const hitEls = Array.from(blockEl.parentElement.children)
        .filter(el => el.classList?.contains('block'))
        .filter(el => { try { return range.intersectsNode(el); } catch { return false; } });
    if (hitEls.length > 1) {
        const tailEl = hitEls[hitEls.length - 1], tailTarget = editableTarget(tailEl);
        const tailHasText = !!((tailTarget?.textContent || '').replace(/\u200b/g, '').length);
        if (tailHasText && tailTarget?.contains(range.endContainer) && textOffsetInTarget(tailTarget, range.endContainer, range.endOffset) === 0) hitEls.pop();
    }
    const mapped = hitEls.map(el => ({ el, ctx: blockContext(el) })).filter(entry => entry.ctx && entry.ctx.list === ctx.list);
    if (!mapped.length) return single;
    const firstEl = mapped[0].el, lastEl = mapped[mapped.length - 1].el;
    const firstTarget = editableTarget(firstEl), lastTarget = editableTarget(lastEl);
    return {
        targets: mapped.map(entry => ({ item: entry.ctx.item, index: entry.ctx.index, blockEl: entry.el })),
        startBlockId: mapped[0].ctx.item.id,
        endBlockId: mapped[mapped.length - 1].ctx.item.id,
        startOffset: firstTarget?.contains(range.startContainer) ? textOffsetInTarget(firstTarget, range.startContainer, range.startOffset) : 0,
        endOffset: lastTarget?.contains(range.endContainer)
            ? textOffsetInTarget(lastTarget, range.endContainer, range.endOffset)
            : (lastTarget ? (lastTarget.textContent || '').replace(/\u200b/g, '').length : 0),
        collapsed: false
    };
}
/** Indent (+1) or outdent (-1) selected bullet, numbered, or todo list items while preserving caret/selection and scroll position. */
function adjustListIndent(ctx, target, delta, blockEl) {
    const sel = selectedListTargetsInContext(ctx, target, blockEl);
    const indentable = sel.targets.filter(entry => isIndentableListBlock(entry.item));
    if (!indentable.length) return false;
    const nextLevels = indentable.map(entry => Math.max(0, Math.min(MAX_LIST_INDENT, normalizedListIndent(entry.item) + delta)));
    if (!indentable.some((entry, idx) => nextLevels[idx] !== normalizedListIndent(entry.item))) return true;
    syncBlocksFromEditor();
    pushUndoBeforeEdit(ctx.page);
    indentable.forEach((entry, idx) => setBlockListIndent(entry.item, nextLevels[idx]));
    const keepX = window.scrollX, keepY = window.scrollY;
    save();
    render();
    const startEl = editor.querySelector(`[data-block-id="${CSS.escape(sel.startBlockId)}"]`);
    const endEl = editor.querySelector(`[data-block-id="${CSS.escape(sel.endBlockId)}"]`);
    const newStart = startEl ? editableTarget(startEl) : null;
    const newEnd = endEl ? editableTarget(endEl) : null;
    if (startEl) setActiveEditorBlock(startEl);
    if (newStart && (sel.collapsed || !newEnd)) {
        setCaretAtTextOffset(newStart, sel.startOffset);
    } else if (newStart && newEnd) {
        const focusHost = newStart.getAttribute('contenteditable') === 'true' ? newStart : (newStart.closest('.block-editor') || editor);
        focusHost.focus?.({ preventScroll: true });
        const startPt = resolveTextPoint(newStart, sel.startOffset);
        const endPt = resolveTextPoint(newEnd, sel.endOffset);
        const restored = document.createRange();
        restored.setStart(startPt.node, startPt.offset);
        restored.setEnd(endPt.node, endPt.offset);
        const selection = getSelection();
        selection?.removeAllRanges();
        selection?.addRange(restored);
    }
    window.scrollTo({ left: keepX, top: keepY, behavior: 'auto' });
    return true;
}
function splitBlockAtCaret(ctx, target) {
    const { page, list, index, item } = ctx;
    const selection = getSelection(); if (!selection?.rangeCount) return;
    const selected = selection.getRangeAt(0); if (!target.contains(selected.startContainer) || !target.contains(selected.endContainer)) return;
    pushUndoBeforeEdit(page);
    const before = document.createRange(), after = document.createRange();
    before.selectNodeContents(target); before.setEnd(selected.startContainer, selected.startOffset);
    after.selectNodeContents(target); after.setStart(selected.endContainer, selected.endOffset);
    const left = fragmentAsEditableHTML(before.cloneContents()), right = fragmentAsEditableHTML(after.cloneContents());
    const isList = isIndentableListBlock(item);
    if (isList && !left.text.trim() && !right.text.trim()) {
        const indent = normalizedListIndent(item);
        if (indent > 0) setBlockListIndent(item, indent - 1);
        else { item.type = 'text'; item.indent = undefined; }
        item.text = ''; item.html = undefined;
        save(); render(); focusBlockById(item.id);
        return;
    }
    item.text = left.text; item.html = left.html;
    if (isToggleBlock(item) && item.open) {
        item.children = item.children || [];
        const child = block('text', right.text);
        child.html = right.html;
        item.children.unshift(child);
        save(); render(); focusBlockById(child.id);
        return;
    }
    const next = block(isList ? item.type : 'text', right.text);
    next.html = right.html;
    if (isList) setBlockListIndent(next, normalizedListIndent(item));
    if (next.type === 'todo') next.checked = false;
    list.splice(index + 1, 0, next);
    save(); render(); focusBlockById(next.id);
}
function mergeOrRemoveBlock(ctx, target) {
    const { page, list, index, item, parentBlock } = ctx;
    if (index < 0) return;
    const selection = getSelection(), range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (!range || !target.contains(range.startContainer)) return;
    const prefix = document.createRange(); prefix.selectNodeContents(target); prefix.setEnd(range.startContainer, range.startOffset);
    if (prefix.toString().replace(/\u200b/g, '').length) return;
    pushUndoBeforeEdit(page);
    if (isIndentableListBlock(item) && normalizedListIndent(item) > 0) {
        setBlockListIndent(item, normalizedListIndent(item) - 1);
        save(); render(); focusBlockById(item.id);
        return;
    }
    if (isToggleBlock(item)) {
        const kids = (item.children || []).filter((c, _k, arr) => arr.length > 1 || (c.text || '').trim() || c.children?.length || c.url || c.assetId);
        if (kids.length) list.splice(index + 1, 0, ...kids);
        item.children = undefined;
        item.toggle = false;
        item.open = false;
        if (item.type === 'toggle') item.type = 'text';
        save(); render(); focusBlockById(item.id);
        return;
    }
    if (!item.text) {
        if (list.length > 1) {
            const prevId = list[Math.max(0, index - 1)].id;
            list.splice(index, 1);
            save(); render(); focusBlockById(prevId, false);
            return;
        }
        if (findColumnHost(page.blocks, list)) {
            list.splice(index, 1);
            const focusId = pruneEmptyColumn(page, list);
            save(); render();
            if (focusId) focusBlockById(focusId, false);
            return;
        }
        if (parentBlock && isToggleBlock(parentBlock)) {
            parentBlock.children = [];
            save(); render(); focusBlockById(parentBlock.id, false);
            return;
        }
        return;
    }
    if (index <= 0) return;
    const previous = list[index - 1];
    if (isToggleBlock(previous) || ['divider','page_link','mention','image','table','columns','toc','breadcrumb','button','date','equation','video','audio','bookmark','embed','file','pdf','code'].includes(previous.type)) return;
    const previousText = previous.text || '', previousHTML = previous.html || esc(previousText), itemHTML = item.html || esc(item.text || '');
    previous.text = previousText + (item.text || '');
    previous.html = cleanInlineHtml(previousHTML + itemHTML);
    list.splice(index, 1);
    save(); render(); focusBlockById(previous.id, false);
    const prevEl = editor.querySelector(`[data-block-id="${CSS.escape(previous.id)}"]`);
    if (prevEl) setCaretAtTextOffset(editableTarget(prevEl), previousText.length);
}
function wireText(el, b, p) { el.spellcheck = true; }
function wireSingleLineField(el, onChange) {
    el.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); focusBlockAt(0); } });
    el.addEventListener('paste', event => { const text = event.clipboardData?.getData('text/plain'); if (text == null) return; event.preventDefault(); document.execCommand('insertText', false, text.replace(/[\r\n]+/g, ' ')); });
    el.addEventListener('input', () => { const raw = el.innerText || ''; if (raw.includes('\n')) { const flat = raw.replace(/\s*\n\s*/g, ' '); el.textContent = flat; setCaretAtTextOffset(el, flat.length); } onChange(); });
}
function markdownInline(raw) { let html = esc(raw); html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, href) => `<a href="${esc(href)}">${label}</a>`); html = html.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/~~([^~]+)~~/g, '<del>$1</del>').replace(/\*([^*]+)\*/g, '<em>$1</em>'); return cleanInlineHtml(html); }
function parseMarkdownLine(line) { let match; const leadCols = (line.match(/^([ \t]*)/)?.[1] || '').replace(/\t/g, '  ').length; const indent = Math.min(MAX_LIST_INDENT, Math.floor(leadCols / 2)); const indentProp = indent > 0 ? { indent } : {}; if ((match = line.match(/^(#{1,6})\s+(.+)$/))) return { type: `h${match[1].length}`, text: match[2], html: markdownInline(match[2]) }; if ((match = line.match(/^\s*[-*+]\s+\[([ xX])\]\s*(.*)$/))) return { type: 'todo', text: match[2], html: markdownInline(match[2]), checked: match[1].toLowerCase() === 'x', ...indentProp }; if ((match = line.match(/^\s*[-*+]\s+(.+)$/))) return { type: 'bullet', text: match[1], html: markdownInline(match[1]), ...indentProp }; if ((match = line.match(/^\s*\d+\.\s+(.+)$/))) return { type: 'numbered', text: match[1], html: markdownInline(match[1]), ...indentProp }; if ((match = line.match(/^>\s?(.*)$/))) return { type: 'quote', text: match[1], html: markdownInline(match[1]) }; if (/^(---|___|\*\*\*)\s*$/.test(line.trim())) return { type: 'divider', text: '', html: '' }; return { type: 'text', text: line, html: markdownInline(line) }; }
function handleMarkdownPaste(event) { const clipboard = event.clipboardData, raw = clipboard?.getData('text/plain'); if (!raw) return; const blockElement = activeBlockFromSelection(), ctx = blockContext(blockElement), target = editableTarget(blockElement), selection = getSelection(); if (!blockElement || !ctx || !selection?.rangeCount) return; const selected = selection.getRangeAt(0); if (!target.contains(selected.startContainer) || !target.contains(selected.endContainer)) return; const { page, list, index, item } = ctx; if (item.type === 'code') { event.preventDefault(); pushUndoBeforeEdit(page); insertPlainTextIntoPre(target, raw.replace(/\r\n?/g, '\n')); updateBlockFromDOM(blockElement); save(); return; } const pastedUrl = isStandaloneHttpUrl(raw); if (pastedUrl) { event.preventDefault(); pushUndoBeforeEdit(page); selected.deleteContents(); const a = document.createElement('a'); a.href = pastedUrl; a.rel = 'noopener noreferrer'; a.textContent = pastedUrl; selected.insertNode(a); const sp = document.createTextNode(' '); a.after(sp); const caret = document.createRange(); caret.setStart(sp, 1); caret.collapse(true); selection.removeAllRanges(); selection.addRange(caret); updateBlockFromDOM(blockElement); save(); const anchorRect = a.getBoundingClientRect(); openLinkPreviewMenu({ page, list, item, blockElement, target, linkEl: a, url: pastedUrl, anchorRect }); return; } const lines = raw.replace(/\r\n?/g, '\n').split('\n'), looksLikeMarkdown = lines.some(line => /^(#{1,6}\s|\s*[-*+]\s|\s*\d+\.\s|>\s?|---\s*$|___\s*$|\*\*\*\s*$)/.test(line)); if (lines.length === 1 && !looksLikeMarkdown && !/\*\*|\*[^*\s][^*]*\*|~~|`|\[[^\]]+\]\(https?:\/\//.test(raw)) return; event.preventDefault(); pushUndoBeforeEdit(page); const prefixRange = document.createRange(), suffixRange = document.createRange(); prefixRange.selectNodeContents(target); prefixRange.setEnd(selected.startContainer, selected.startOffset); suffixRange.selectNodeContents(target); suffixRange.setStart(selected.endContainer, selected.endOffset); const prefix = fragmentAsEditableHTML(prefixRange.cloneContents()), suffix = fragmentAsEditableHTML(suffixRange.cloneContents()), parsed = lines.map(parseMarkdownLine); if (prefix.text) { parsed[0].text = prefix.text + parsed[0].text; parsed[0].html = cleanInlineHtml(prefix.html + parsed[0].html); parsed[0].type = item.type; parsed[0].id = item.id; } else parsed[0].id = item.id; if (suffix.text) { const last = parsed[parsed.length - 1]; last.text += suffix.text; last.html = cleanInlineHtml(last.html + suffix.html); } const inserted = parsed.map(entry => ({ ...block(entry.type, entry.text), ...entry })); list.splice(index, 1, ...inserted); save(); render(); const caretOffset = (prefix.text && parsed.length === 1 ? prefix.text.length : 0) + (lines[lines.length - 1]?.length || 0); const lastInserted = inserted[inserted.length - 1]; focusBlockById(lastInserted.id); const lastEl = editor.querySelector(`[data-block-id="${CSS.escape(lastInserted.id)}"]`); if (lastEl) setCaretAtTextOffset(editableTarget(lastEl), Math.min(caretOffset, (lastInserted.text || '').length)); }
const MENU_GLYPHS = { 'Text':'T', 'Page':'▤', 'Board':'◩', 'Board - Inline':'⊞', 'Linked view of board':'↗', 'Turn into board':'◩', 'Database':'🗃️', 'Database - Inline':'⊞', 'Linked view of database':'↗', 'Board view':'▥', 'Gallery view':'◫', 'List view':'☰', 'Calendar view':'📅', 'Timeline view':'↦', 'Chart view':'◔', 'Feed view':'▤', 'Form view':'📝', 'Button':'🔘', 'Heading 1':'H1', 'Heading 2':'H2', 'Heading 3':'H3', 'Heading 4':'H4', 'Heading 5':'H5', 'Heading 6':'H6', 'Toggle heading 1':'▸H1', 'Toggle heading 2':'▸H2', 'Toggle heading 3':'▸H3', 'Make toggleable':'▸', 'Turn off toggle':'↩', 'Bulleted list':'•', 'Numbered list':'1.', 'To-do list':'☑', 'Toggle list':'▸', 'Quote':'❝', 'Callout':'☀', 'Divider':'—', 'Image':'▧', 'Video':'▶', 'Audio':'♪', 'File':'⌑', 'PDF':'PDF', 'Web bookmark':'⚑', 'Embed':'◇', 'Code':'</>', 'Mermaid diagram':'🧜', '2 columns':'▥', '3 columns':'▥', '4 columns':'▥', '5 columns':'▥', 'Add column left':'▥', 'Add column right':'▥', 'Add column':'▥', 'Delete column':'🗑', 'Table':'▦', 'Table of contents':'☰', 'Breadcrumb':'›', 'Mention':'@', 'Date / reminder':'▦', 'Equation':'∑', 'Emoji':'☺', 'Link to page':'↗', 'Comment':'💬', 'Duplicate block':'⧉', 'Move to page':'↪', 'Delete block':'🗑', 'Open page':'→', 'Open link':'↗', 'Open in new tab':'↗', 'Open in Peek':'◨', 'Open as full page':'⤢', 'New tab':'＋', 'Duplicate tab':'⧉', 'Pin tab':'📌', 'Unpin tab':'📌', 'Close tab':'×', 'Close other tabs':'×', 'Close tabs to the right':'×', 'Cut':'✂', 'Copy':'⧉', 'Paste':'📋', 'Select all':'▣', 'Copy image URL':'🔗', 'Add row':'＋', 'Add block':'＋', 'New page':'＋', 'New board':'◩', 'New database':'🗃️', 'Search workspace':'⌕', 'Workspace settings':'⚙', 'Back':'←', 'Forward':'→', 'Toggle full width':'↔', 'Open comments':'💬', 'Rename':'✎', 'Duplicate':'⧉', 'Copy link':'🔗', 'Copy link to block':'🔗', 'Add to favorites':'★', 'Remove from favorites':'★', 'Change icon':'☺', 'Edit icon':'☺', 'Color':'🖌', 'Delete':'🗑', 'Move to':'↪', 'Turn into':'⇄', 'Permissions':'🔒' };
const BLOCK_COLORS = [
    { key: 'default', label: 'Default', textHex: '#37352f', bgHex: '#ffffff' },
    { key: 'gray', label: 'Gray', textHex: '#787774', bgHex: '#f1f1ef' },
    { key: 'brown', label: 'Brown', textHex: '#9f6b53', bgHex: '#f4eeee' },
    { key: 'orange', label: 'Orange', textHex: '#d9730d', bgHex: '#fbecdd' },
    { key: 'yellow', label: 'Yellow', textHex: '#cb912f', bgHex: '#fbf3db' },
    { key: 'green', label: 'Green', textHex: '#448361', bgHex: '#edf3ec' },
    { key: 'blue', label: 'Blue', textHex: '#337ea9', bgHex: '#e7f3f8' },
    { key: 'purple', label: 'Purple', textHex: '#9065b0', bgHex: '#f4f0f7' },
    { key: 'pink', label: 'Pink', textHex: '#c14c8a', bgHex: '#faf1f5' },
    { key: 'red', label: 'Red', textHex: '#d44c47', bgHex: '#fdebec' }
];
let submenuCloseTimer = 0;
function getSubmenuEl() {
    let sub = $('#command-submenu');
    if (!sub) {
        sub = document.createElement('div');
        sub.id = 'command-submenu';
        sub.className = 'command-menu command-submenu';
        sub.hidden = true;
        document.body.append(sub);
    }
    return sub;
}
function hideSubmenu() {
    clearTimeout(submenuCloseTimer);
    const sub = $('#command-submenu');
    if (sub) { sub.hidden = true; sub.replaceChildren(); }
}
function menuGlyph(label, type) { return `<span class="command-icon" aria-hidden="true">${esc(MENU_GLYPHS[label] || MENU_GLYPHS[type] || '•')}</span>`; }
function menuSearchKey(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ''); }
function menuMatches(value, query) { return menuSearchKey(value).includes(menuSearchKey(query)); }
function closeMenu() { hideSubmenu(); const m = activeMenu || $('#command-menu'); if (m) { m.hidden = true; if (m.id === 'command-menu' && m.parentElement !== document.body) document.body.append(m); } activeMenu = null; }
function refreshMenuSelection() { if (!activeMenu) return; const rows = [...activeMenu.querySelectorAll('.command-row')]; if (!rows.length || menuIndex < 0) { rows.forEach(row => { row.classList.remove('selected'); row.setAttribute('aria-selected', 'false'); }); return; } menuIndex = Math.max(0, Math.min(menuIndex, rows.length - 1)); rows.forEach((row, index) => { row.classList.toggle('selected', index === menuIndex); row.setAttribute('aria-selected', String(index === menuIndex)); const key = row.querySelector('kbd'); if (key && !key.dataset.fixed) key.textContent = index === menuIndex ? '↵' : ''; }); }
function menuRow(label, icon, run, meta = '', shortcut = '', options = {}) {
    const row = document.createElement('button');
    row.type = 'button'; row.className = 'command-row';
    row.setAttribute('role', 'option'); row.setAttribute('aria-selected', 'false');
    const rightHtml = options.hasSubmenu ? '<span class="command-row-arrow" aria-hidden="true">›</span>'
        : options.checked ? '<span class="command-row-check" aria-hidden="true">✓</span>'
        : `<kbd>${esc(shortcut)}</kbd>`;
    row.innerHTML = `${icon}<span class="command-copy"><span>${esc(label)}</span>${meta ? `<small>${esc(meta)}</small>` : ''}</span>${rightHtml}`;
    if (shortcut && row.querySelector('kbd')) row.querySelector('kbd').dataset.fixed = 'true';
    row.onclick = () => { if (options.keepOpen) { run(); } else { closeMenu(); run(); } };
    return row;
}
function placeFloatingMenu(menu, x, y) {
    menu.hidden = false;
    menu.style.maxHeight = '';
    const margin = 8;
    const box = menu.getBoundingClientRect();
    const fullHeight = box.height;
    const left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, x));
    const maxAvail = window.innerHeight - margin * 2;
    let top = Math.max(margin, Math.min(window.innerHeight - fullHeight - margin, y));
    if (fullHeight > maxAvail) {
        top = margin;
        menu.style.maxHeight = `${maxAvail}px`;
    }
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
}
function placeCommandMenu(menu,anchor){if(!anchor)return;menu.hidden=false;menu.style.maxHeight='';const rect=anchor.getBoundingClientRect(),box=menu.getBoundingClientRect();const left=Math.max(12,Math.min(window.innerWidth-box.width-12,rect.left+22));const below=rect.bottom+5;const above=rect.top-5;const spaceBelow=window.innerHeight-below-12;const spaceAbove=above-12;if(spaceBelow>=220||spaceBelow>=spaceAbove){menu.style.maxHeight=`${Math.max(180,Math.min(box.height,spaceBelow))}px`;menu.style.top=`${Math.max(12,below)}px`}else{const height=Math.max(180,Math.min(box.height,spaceAbove));menu.style.maxHeight=`${height}px`;menu.style.top=`${Math.max(12,above-height)}px`}menu.style.left=`${left}px`}
function cmdCatalog() {
    return [
        ['Text', 'text', 'Basic blocks', 'T'], ['Page', 'page_link', 'Basic blocks', '▤'], ['Button', 'button', 'Basic blocks', '🔘'],
        ['Board', 'board_page', 'Board', '◩'],
        ['Board - Inline', 'board_view', 'Board', '⊞', undefined, undefined, 'inline-board'],
        ['Linked view of board', 'board_view', 'Board', '↗', undefined, undefined, 'linked-board'],
        ['Database', 'database_page', 'Database', '🗃️'],
        ['Database - Inline', 'database_view', 'Database', '⊞', undefined, undefined, 'table'],
        ['Linked view of database', 'database_view', 'Database', '↗', undefined, undefined, 'linked'],
        ['Board view', 'database_view', 'Database views', '▥', undefined, undefined, 'board'],
        ['Gallery view', 'database_view', 'Database views', '◫', undefined, undefined, 'gallery'],
        ['List view', 'database_view', 'Database views', '☰', undefined, undefined, 'list'],
        ['Calendar view', 'database_view', 'Database views', '📅', undefined, undefined, 'calendar'],
        ['Timeline view', 'database_view', 'Database views', '↦', undefined, undefined, 'timeline'],
        ['Chart view', 'database_view', 'Database views', '◔', undefined, undefined, 'chart'],
        ['Feed view', 'database_view', 'Database views', '▤', undefined, undefined, 'feed'],
        ['Form view', 'database_view', 'Database views', '📝', undefined, undefined, 'form'],
        ['Heading 1', 'h1', 'Headings', 'H1'], ['Heading 2', 'h2', 'Headings', 'H2'], ['Heading 3', 'h3', 'Headings', 'H3'], ['Heading 4', 'h4', 'Headings', 'H4'], ['Heading 5', 'h5', 'Headings', 'H5'], ['Heading 6', 'h6', 'Headings', 'H6'],
        ['Toggle heading 1', 'h1', 'Headings', '▸H1', undefined, true], ['Toggle heading 2', 'h2', 'Headings', '▸H2', undefined, true], ['Toggle heading 3', 'h3', 'Headings', '▸H3', undefined, true],
        ['Bulleted list', 'bullet', 'Lists', '•'], ['Numbered list', 'numbered', 'Lists', '1.'], ['To-do list', 'todo', 'Lists', '☑'], ['Toggle list', 'toggle', 'Lists', '▸', undefined, true],
        ['Quote', 'quote', 'Content', '❝'], ['Callout', 'callout', 'Content', '☀'], ['Divider', 'divider', 'Content', '—'],
        ['Image', 'image', 'Media', '▧'], ['Video', 'video', 'Media', '▶'], ['Audio', 'audio', 'Media', '♪'], ['File', 'file', 'Media', '⌑'], ['Asset library', 'file', 'Media', '🗂'], ['PDF', 'pdf', 'Media', 'PDF'], ['Web bookmark', 'bookmark', 'Media', '⚑'], ['Embed', 'embed', 'Media', '◇'], ['Code', 'code', 'Media', '</>'], ['Mermaid diagram', 'code', 'Media', '🧜'],
        ['2 columns', 'columns', 'Layout', '▥', 2], ['3 columns', 'columns', 'Layout', '▥', 3], ['4 columns', 'columns', 'Layout', '▥', 4], ['5 columns', 'columns', 'Layout', '▥', 5], ['Table', 'table', 'Layout', '▦'], ['Table of contents', 'toc', 'Layout', '☰'], ['Breadcrumb', 'breadcrumb', 'Layout', '›'],
        ['Mention', 'mention', 'Inline', '@'], ['Date / reminder', 'date', 'Inline', '▦'], ['Equation', 'equation', 'Inline', '∑'], ['Emoji', 'mention', 'Inline', '☺'], ['Link to page', 'page_link', 'Inline', '↗'],
        ['Duplicate block', 'text', 'Actions', '⧉'], ['Move to page', 'text', 'Actions', '↪'], ['Delete block', 'text', 'Actions', '🗑']
    ].map(([name, type, category, icon, columns, toggle, dbViewType]) => ({ name, type, category, icon, columns, toggle, dbViewType }));
}
function showMenu(query, blockAt) { const menu = $('#command-menu'), q = query.trim(); menu.className = 'command-menu'; menu.innerHTML = ''; menu.scrollTop = 0; const cmds = cmdCatalog().filter(c => menuMatches(c.name + ' ' + c.category, q)); const list = document.createElement('div'); list.className = 'command-list'; if (!cmds.length) { const empty = document.createElement('div'); empty.className = 'command-empty'; empty.textContent = 'No matching blocks'; list.append(empty); } [...new Set(cmds.map(c => c.category))].forEach(category => { const group = document.createElement('section'); group.className = 'command-group'; const label = document.createElement('div'); label.className = 'command-group-label'; label.textContent = category; group.append(label); cmds.filter(c => c.category === category).forEach(c => { const row = menuRow(c.name, menuGlyph(c.name, c.type), () => runCommand(c.name, c.type, blockAt, c), '', ''); group.append(row); }); list.append(group); }); menu.append(list); menuOptions = cmds; placeCommandMenu(menu, editor.querySelector(`[data-block-id="${CSS.escape(blockAt.id)}"]`)); menuIndex = 0; refreshMenuSelection(); activeMenu = menu; }
function runCommand(name, type, b, cmd) {
    const p = current();
    const found = findBlockById(p.blocks, b.id);
    const list = found?.list || p.blocks;
    const idx = found ? found.index : p.blocks.indexOf(b);
    if (name === 'Board') {
        const isPageEmpty = !ArchitectDatabase.isDatabasePage(p)
            && !ArchitectBoard.isBoardPage(p)
            && !p.databaseId
            && list === p.blocks
            && p.blocks.every(x => x.id === b.id || (!(x.text || '').trim() && !(x.children || []).length && x.type === 'text'));
        if (isPageEmpty) {
            b.text = '';
            b.html = undefined;
            ArchitectBoard.convertPageToBoard(p);
            save(); render();
        } else {
            pushUndoBeforeEdit(p);
            const boardPage = ArchitectBoard.createBoardPage(p.id, 'Untitled board');
            list[idx] = { id: id(), type: 'page_link', text: boardPage.title, targetId: boardPage.id };
            save(); navigateToPage(boardPage.id);
        }
        return;
    } if (type === 'board_view') {
        if (cmd?.dbViewType === 'linked-board') {
            const anchorEl = editor.querySelector(`[data-block-id="${CSS.escape(b.id)}"]`) || editor;
            ArchitectBoard.openLinkSourcePopover(anchorEl, chosenBoard => {
                pushUndoBeforeEdit(p);
                list[idx] = { id: b.id, type: 'board_view', text: chosenBoard.title || 'Board', targetId: chosenBoard.id, boardHeight: 460 };
                save(); render();
            });
            return;
        }
        pushUndoBeforeEdit(p);
        const boardPage = ArchitectBoard.createBoardPage(p.id, 'Untitled board');
        list[idx] = { id: b.id, type: 'board_view', text: boardPage.title, targetId: boardPage.id, boardHeight: 460 };
        save(); render();
        return;
    } if (name === 'Database') {
        const isPageEmpty = !ArchitectDatabase.isDatabasePage(p)
            && !p.databaseId
            && list === p.blocks
            && p.blocks.every(x => x.id === b.id || (!(x.text || '').trim() && !(x.children || []).length && x.type === 'text'));
        if (isPageEmpty) {
            b.text = '';
            b.html = undefined;
            ArchitectDatabase.convertPageToDatabase(p, 'table');
            save(); render();
        } else {
            pushUndoBeforeEdit(p);
            const dbPage = ArchitectDatabase.createDatabasePage(p.id, 'Untitled database', 'table');
            list[idx] = { id: id(), type: 'page_link', text: dbPage.title, targetId: dbPage.id };
            save(); navigateToPage(dbPage.id);
        }
        return;
    } if (type === 'database_view') {
        if (cmd?.dbViewType === 'linked') {
            const anchorEl = editor.querySelector(`[data-block-id="${CSS.escape(b.id)}"]`) || editor;
            ArchitectDatabase.openLinkSourcePopover(anchorEl, chosenDb => {
                pushUndoBeforeEdit(p);
                list[idx] = { id: b.id, type: 'database_view', text: chosenDb.title || 'Database', targetId: chosenDb.id };
                save(); render();
            });
            return;
        }
        pushUndoBeforeEdit(p);
        const viewType = cmd?.dbViewType || 'table';
        const dbPage = ArchitectDatabase.createDatabasePage(p.id, 'Untitled database', viewType);
        list[idx] = { id: b.id, type: 'database_view', text: dbPage.title, targetId: dbPage.id };
        save(); render();
        return;
    } if (name === 'Page') {
        pushUndoBeforeEdit(p);
        const child = createPage(p.id);
        list[idx] = { id: id(), type: 'page_link', text: child.title, targetId: child.id };
        save(); navigateToPage(child.id);
        return;
    } if (name === 'Link to page') {
        showPageLinkPicker(p, b);
        return;
    } if (name === 'Mention' || name === 'Emoji') {
        showMentionPicker(p, b);
        return;
    } if (name === 'Asset library') {
        openAssetLibrary(null, { targetPage: p, targetBlock: b });
        return;
    } if (name === 'Image' || name === 'Video' || name === 'Audio' || name === 'File' || name === 'PDF') {
        if (name === 'PDF') {
            pushUndoBeforeEdit(p);
            b.type = 'pdf';
            b.text = b.text || 'PDF document';
            b.url = b.url || '';
            save(); render();
        } else {
            uploadForBlock(b, p, type);
        }
        return;
    } if (name === 'Delete block') {
        pushUndoBeforeEdit(p);
        list.splice(idx, 1);
        const focusId = pruneEmptyColumn(p, list);
        save(); render();
        if (focusId) focusBlockById(focusId, false);
        return;
    } if (name === 'Duplicate block') {
        pushUndoBeforeEdit(p);
        list.splice(idx + 1, 0, cloneBlockTree(b));
        save(); render();
        return;
    } if (name === 'Move to page') {
        showMovePicker(p, b);
        return;
    } if (['Web bookmark', 'Embed'].includes(name)) {
        pushUndoBeforeEdit(p);
        b.type = type;
        b.linkDisplayMode = type === 'bookmark' ? 'bookmark' : 'embed';
        b.url = '';
        b.text = name;
        save(); render();
        requestAnimationFrame(() => (editor.querySelector(`[data-block-id="${CSS.escape(b.id)}"] .link-block-url-input`) as HTMLInputElement | null)?.focus());
        return;
    } if (name === 'Date / reminder') {
        pushUndoBeforeEdit(p);
        const todayIso = toLocalIsoDate();
        b.type = 'date';
        b.remindDate = todayIso;
        b.remindOffset = 'at_time';
        b.remindAt = computeReminderTimestamp(todayIso, '09:00', 'at_time');
        b.remindFired = false;
        b.text = formatReminderChipLabel(todayIso, '', 'at_time');
        save(); render();
        requestAnimationFrame(() => {
            const btn = editor.querySelector(`[data-block-id="${CSS.escape(b.id)}"] button`) as HTMLElement | null;
            if (btn) btn.click();
        });
        return;
    } if (name === 'Button' || name === 'Button / template') {
        pushUndoBeforeEdit(p);
        b.type = 'button';
        b.text = 'New button';
        b.buttonConfig = { label: 'New button', icon: '', steps: [{ id: id(), kind: 'insert_blocks', blocksText: 'New action item' }] };
        save(); render();
        return;
    } if (name === 'Mermaid diagram') {
        pushUndoBeforeEdit(p);
        b.type = 'code';
        b.language = 'Mermaid';
        b.mermaidMode = 'split';
        b.text = 'flowchart TD\n  Idea --> Draft\n  Draft --> Ship';
        b.html = undefined;
        save(); render();
        focusBlockById(b.id);
        return;
    } if (name === 'Math / LaTeX' || name === 'Equation') {
        pushUndoBeforeEdit(p);
        b.type = 'equation';
        b.text = b.text?.trim() && b.text !== '/equation' ? b.text : '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}';
        save(); render();
        requestAnimationFrame(() => {
            const blkEl = editor.querySelector(`[data-block-id="${CSS.escape(b.id)}"]`);
            if (blkEl) openEquationEditorPopover(p, b, blkEl);
        });
        return;
    } if (name === 'Table' || type === 'table') {
        pushUndoBeforeEdit(p);
        b.type = 'table';
        b.text = '';
        b.html = undefined;
        b.tableData = {
            headers: ['Column 1', 'Column 2', 'Column 3'],
            headerHtml: ['Column 1', 'Column 2', 'Column 3'],
            rows: [['', '', ''], ['', '', '']],
            rowHtml: [['', '', ''], ['', '', '']],
            hasHeaderRow: true,
            hasHeaderColumn: false,
            fullWidth: false
        };
        save(); render();
        return;
    } if (type === 'columns') {
        pushUndoBeforeEdit(p);
        const count = Math.max(2, Number(cmd?.columns) || 2);
        b.type = 'columns'; b.toggle = false; b.open = false; b.text = ''; b.html = undefined;
        b.children = Array.from({ length: count }, () => ({ id: id(), type: 'text', text: '', children: [block('text', '')] }));
        b.columnWidths = Array(count).fill(100 / count);
        save(); render();
        focusBlockById(b.children[0].children[0].id);
        return;
    }
    pushUndoBeforeEdit(p);
    b.type = type;
    b.text = '';
    b.html = undefined;
    b.indent = undefined;
    if (cmd?.toggle || type === 'toggle') {
        b.toggle = true;
        b.open = b.open ?? true;
        b.children = b.children?.length ? b.children : [block('text')];
    } else {
        b.toggle = false;
    }
    save(); render(); focusBlockById(b.id);
}
const TURN_INTO_TARGETS = [['Text', 'text'], ['Heading 1', 'h1'], ['Heading 2', 'h2'], ['Heading 3', 'h3'], ['Heading 4', 'h4'], ['Heading 5', 'h5'], ['Heading 6', 'h6'], ['Toggle heading 1', 'h1', true], ['Toggle heading 2', 'h2', true], ['Toggle heading 3', 'h3', true], ['Bulleted list', 'bullet'], ['Numbered list', 'numbered'], ['To-do list', 'todo'], ['Toggle list', 'toggle', true], ['Quote', 'quote'], ['Callout', 'callout'], ['Code', 'code'], ['Equation', 'equation'], ['Button', 'button'], ['Table', 'table'], ['Web bookmark', 'bookmark'], ['Embed', 'embed'], ['PDF', 'pdf'], ['Divider', 'divider']];
function blockTypeLabel(type, toggle = false) {
    if (toggle && isHeadingType(type)) return `Toggle heading ${type.slice(1)}`;
    const found = TURN_INTO_TARGETS.find(([, value, isToggle]) => value === type && !!isToggle === !!toggle);
    return found ? found[0] : (TURN_INTO_TARGETS.find(([, value]) => value === type)?.[0] || 'Text');
}
function cloneBlockTree(item) { const copy = JSON.parse(JSON.stringify(item)); const reid = child => { child.id = id(); (child.children || []).forEach(reid); }; reid(copy); return copy; }
function copyPageLink(p) { const url = pageHref(p.id); if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(() => toast('Page link copied'), () => toast(url)); else toast(url); }
function copyBlockLink(p, b) { const url = pageHref(p.id, b.id); if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(() => toast('Block link copied'), () => toast(url)); else toast(url); }
function duplicatePage(p) { const copy = { ...JSON.parse(JSON.stringify(p)), id: id(), title: `${p.title || 'Untitled'} (copy)`, favorite: false, comments: undefined, blocks: p.blocks.map(cloneBlockTree), createdAt: Date.now(), updatedAt: Date.now() }; state.pages.splice(state.pages.indexOf(p) + 1, 0, copy); save(); render(); toast('Page duplicated'); }
function deletePageTree(pageId) { const ids = new Set([pageId]); let changed = true; while (changed) { changed = false; state.pages.forEach(item => { if (item.parentId && ids.has(item.parentId) && !ids.has(item.id)) { ids.add(item.id); changed = true; } }); } state.pages = state.pages.filter(item => !ids.has(item.id)); ensureTabs(); }
function applyBlockColorChoice(p, b, kind, c) {
    pushUndoBeforeEdit(p);
    if (kind === 'text') b.color = c.key === 'default' ? undefined : c.key;
    else b.bgColor = c.key === 'default' ? (b.type === 'callout' ? 'default' : undefined) : c.key;
    lastUsedColor = { kind, key: c.key, label: `${c.label} ${kind === 'text' ? 'text' : 'background'}`, textHex: c.textHex, bgHex: c.bgHex };
    save(); render();
}
function colorSwatchIcon(kind, c) {
    if (kind === 'text') return `<span class="color-swatch" style="color:${c.textHex};border-color:${c.key === 'default' ? '#e6e5e2' : c.textHex + '44'}">A</span>`;
    return `<span class="color-swatch" style="background:${c.bgHex};border-color:${c.key === 'default' ? '#e6e5e2' : '#00000018'}"></span>`;
}
function showBlockMenu(p, b, anchor, commentDraftContext = null) {
    hideSubmenu();
    const ro = effectivePageReadOnly(p);
    const canComment = canCommentOnPage(p);
    const menu = $('#command-menu'); menu.className = 'command-menu block-actions'; menu.replaceChildren();
    const searchBox = document.createElement('div'); searchBox.className = 'command-search-box';
    const input = document.createElement('input'); input.className = 'command-search'; input.placeholder = 'Search actions…'; input.setAttribute('aria-label', 'Search block actions');
    searchBox.append(input); menu.append(searchBox);
    const list = document.createElement('div'); list.className = 'command-list'; menu.append(list);
    const found = findBlockById(p.blocks, b.id);
    const parentList = found?.list || p.blocks;
    const colHost = findColumnHost(p.blocks, parentList);
    const blockLabel = blockTypeLabel(b.type, isToggleBlock(b));

    const turnIntoItems = ro ? [] : TURN_INTO_TARGETS.map(([label, type, asToggle]) => ({
        label, group: 'Turn into', icon: menuGlyph(label, type),
        checked: b.type === type && isToggleBlock(b) === !!asToggle,
        run: () => {
            pushUndoBeforeEdit(p);
            b.type = type;
            b.toggle = !!asToggle || (isHeadingType(type) && !!b.toggle && asToggle === undefined);
            if (b.toggle) { b.open = b.open ?? true; b.children = b.children?.length ? b.children : [block('text')]; }
            if (type === 'divider') { b.text = ''; b.html = undefined; b.toggle = false; }
            if (!isIndentableListBlock(b)) b.indent = undefined;
            save(); render(); focusBlockById(b.id);
        }
    }));

    const colorItems = ro ? [] : [
        ...BLOCK_COLORS.map(c => ({
            label: `${c.label} text`, group: 'Text color',
            icon: colorSwatchIcon('text', c),
            checked: (b.color || 'default') === c.key,
            run: () => applyBlockColorChoice(p, b, 'text', c)
        })),
        ...BLOCK_COLORS.map(c => ({
            label: `${c.label} background`, group: 'Background color',
            icon: colorSwatchIcon('bg', c),
            checked: (b.bgColor || (b.type === 'callout' ? 'gray' : 'default')) === c.key,
            run: () => applyBlockColorChoice(p, b, 'bg', c)
        }))
    ];

    const linkedPageId = b.type === 'page_link' ? b.targetId : (b.type === 'mention' && b.mentions?.[0]?.kind === 'page' ? b.mentions[0].id : null);
    const linkedPageTarget = linkedPageId ? state.pages.find(pg => pg.id === linkedPageId && resolvePagePermissions(pg).view) : null;
    const linkActions = linkedPageTarget ? [
        { label: 'Open page', group: blockLabel, icon: menuGlyph('Open page'), run: () => navigateToPage(linkedPageTarget.id) },
        { label: 'Open in new tab', group: blockLabel, icon: menuGlyph('Open in new tab'), run: () => openPageInNewTab(linkedPageTarget.id) },
        { label: 'Copy link', group: blockLabel, icon: menuGlyph('Copy link'), run: () => copyPageLink(linkedPageTarget) }
    ] : [];

    const mediaActions = [];
    if (b.type === 'image' && (b.url || b.assetId)) {
        const asset = findAssetForBlock(b);
        mediaActions.push({ label: 'Expand fullscreen', group: blockLabel, icon: menuGlyph('Open in new tab'), run: () => openImageLightbox(asset || { id: b.id, name: b.text || 'Image', fileType: b.mimeType || 'image/*', category: b.category || 'image', creator: b.creator || getActorDisplayName(), uploadedBy: getActorDisplayName(), tags: b.tags || [], metadata: {}, storageMode: 'local', provider: 'Inline image', url: b.url, createdAt: Date.now(), updatedAt: Date.now() }) });
        mediaActions.push({ label: 'Download original', group: blockLabel, icon: menuGlyph('File'), run: () => downloadAssetOrBlock(asset, b, b.text || 'image') });
    } else if (b.assetId) {
        mediaActions.push({ label: 'Inspect in Asset library', group: blockLabel, icon: menuGlyph('File'), run: () => openAssetLibrary(b.assetId) });
    }

    const iconAction = (!ro && (b.type === 'callout' || b.type === 'page_link'))
        ? [{ label: 'Edit icon', group: blockLabel, icon: menuGlyph('Edit icon'), run: () => {
            if (b.type === 'callout') blockIconPicker(p, b);
            else { const linked = state.pages.find(pg => pg.id === b.targetId); iconPicker(linked || p); }
        } }]
        : [];

    const toggleAction = (!ro && isHeadingType(b.type))
        ? [{ label: b.toggle ? 'Turn off toggle' : 'Make toggleable', group: blockLabel, icon: menuGlyph(b.toggle ? 'Turn off toggle' : 'Make toggleable'), run: () => { pushUndoBeforeEdit(p); b.toggle = !b.toggle; if (b.toggle) { b.open = b.open ?? true; b.children = b.children?.length ? b.children : [block('text')]; } save(); render(); focusBlockById(b.id); } }]
        : [];

    const columnActions = ro ? [] : b.type === 'columns'
        ? [{ label: 'Add column', group: 'Columns', icon: menuGlyph('Add column'), run: () => { pushUndoBeforeEdit(p); ensureColumnBlocks(b); const focusId = insertColumnIntoList(b, b.children.length, [block('text')]); save(); render(); if (focusId) focusBlockById(focusId); } }]
        : [
            { label: 'Add column left', group: 'Columns', icon: menuGlyph('Add column left'), run: () => { pushUndoBeforeEdit(p); const focusId = insertColumnNextToBlock(p, b, 'left', [block('text')]); save(); render(); if (focusId) focusBlockById(focusId); } },
            { label: 'Add column right', group: 'Columns', icon: menuGlyph('Add column right'), run: () => { pushUndoBeforeEdit(p); const focusId = insertColumnNextToBlock(p, b, 'right', [block('text')]); save(); render(); if (focusId) focusBlockById(focusId); } },
            ...(colHost ? [{ label: 'Delete column', group: 'Columns', icon: menuGlyph('Delete column'), run: () => { pushUndoBeforeEdit(p); colHost.col.children.splice(0, colHost.col.children.length); const focusId = pruneEmptyColumn(p, colHost.col.children); save(); render(); if (focusId) focusBlockById(focusId, false); } }] : [])
        ];

    const primaryActions = [
        ...(canComment ? [{
            label: 'Comment',
            group: 'Actions',
            icon: menuGlyph('Comment'),
            shortcut: 'Ctrl+⇧+M',
            run: () => {
                if (commentDraftContext?.range) openCommentComposer({ scope: 'text', blockId: b.id, quote: commentDraftContext.quote, range: commentDraftContext.range, anchorRect: commentDraftContext.anchorRect });
                else openBlockCommentComposer(b, anchor);
            }
        }] : []),
        { label: 'Copy link to block', group: 'Actions', icon: menuGlyph('Copy link to block'), shortcut: 'Alt+⇧+L', run: () => copyBlockLink(p, b) },
        ...(!ro ? [
            { label: 'Duplicate', group: 'Actions', icon: menuGlyph('Duplicate'), shortcut: 'Ctrl+D', run: () => { pushUndoBeforeEdit(p); const index = parentList.indexOf(b); parentList.splice(index + 1, 0, cloneBlockTree(b)); save(); render(); } },
            { label: 'Move to', group: 'Actions', icon: menuGlyph('Move to'), shortcut: 'Ctrl+⇧+P', run: () => showMovePicker(p, b) },
            { label: 'Delete', group: 'Actions', icon: menuGlyph('Delete'), shortcut: 'Del', run: () => { pushUndoBeforeEdit(p); const index = parentList.indexOf(b); if (index >= 0) parentList.splice(index, 1); const focusId = pruneEmptyColumn(p, parentList); save(); render(); if (focusId) focusBlockById(focusId, false); } }
        ] : [])
    ];

    const selectionActions = (commentDraftContext?.range && !ro && b.type !== 'code') ? [
        { label: 'Bold', group: 'Selection', icon: menuGlyph('Text'), shortcut: 'Ctrl+B', run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'bold') },
        { label: 'Italic', group: 'Selection', icon: menuGlyph('Text'), shortcut: 'Ctrl+I', run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'italic') },
        { label: 'Underline', group: 'Selection', icon: menuGlyph('Text'), shortcut: 'Ctrl+U', run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'underline') },
        { label: 'Strikethrough', group: 'Selection', icon: menuGlyph('Text'), run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'strikeThrough') },
        { label: 'Inline code', group: 'Selection', icon: menuGlyph('Code'), run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'code') },
        { label: 'Superscript', group: 'Selection', icon: '<span class="command-icon" aria-hidden="true">x²</span>', run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'superscript') },
        { label: 'Subscript', group: 'Selection', icon: '<span class="command-icon" aria-hidden="true">x₂</span>', run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'subscript') },
        { label: 'UPPERCASE', group: 'Selection', icon: '<span class="command-icon" aria-hidden="true">AA</span>', run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'case', 'upper') },
        { label: 'lowercase', group: 'Selection', icon: '<span class="command-icon" aria-hidden="true">aa</span>', run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'case', 'lower') },
        { label: 'Small Caps', group: 'Selection', icon: '<span class="command-icon" aria-hidden="true">ᴀᴀ</span>', run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'case', 'smallcaps') },
        { label: 'Link selection', group: 'Selection', icon: menuGlyph('Copy link'), run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'link') },
        { label: 'Inline math', group: 'Selection', icon: menuGlyph('Equation'), run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'inline-math') },
        { label: 'Clear formatting', group: 'Selection', icon: '<span class="command-icon" aria-hidden="true">⌫</span>', run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'clear') }
    ] : [];

    const selColorItems = (commentDraftContext?.range && !ro && b.type !== 'code') ? [
        ...BLOCK_COLORS.map(c => ({
            label: `${c.label} text`, group: 'Selection text color',
            icon: colorSwatchIcon('text', c),
            run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'text-color', c.key)
        })),
        ...BLOCK_COLORS.map(c => ({
            label: `${c.label} highlight`, group: 'Selection highlight color',
            icon: colorSwatchIcon('bg', c),
            run: () => runSelectionFormatAction(p, b, commentDraftContext.range, 'bg-color', c.key)
        }))
    ] : [];

    const openSubmenu = (kind, triggerRow) => {
        clearTimeout(submenuCloseTimer);
        const sub = getSubmenuEl();
        sub.replaceChildren();
        const subList = document.createElement('div');
        subList.className = 'command-list';
        if (kind === 'turn-into') {
            const section = document.createElement('section'); section.className = 'command-group';
            const heading = document.createElement('div'); heading.className = 'command-group-label'; heading.textContent = 'Turn into';
            section.append(heading);
            turnIntoItems.forEach(item => section.append(menuRow(item.label, item.icon, item.run, '', '', { checked: item.checked })));
            subList.append(section);
        } else if (kind === 'sel-format') {
            const section = document.createElement('section'); section.className = 'command-group';
            const heading = document.createElement('div'); heading.className = 'command-group-label'; heading.textContent = 'Format selection';
            section.append(heading);
            selectionActions.forEach(item => section.append(menuRow(item.label, item.icon, item.run, '', item.shortcut || '')));
            subList.append(section);
        } else if (kind === 'sel-color') {
            if (lastUsedColor) {
                const recent = BLOCK_COLORS.find(c => c.key === lastUsedColor.key);
                if (recent) {
                    const sec = document.createElement('section'); sec.className = 'command-group';
                    const h = document.createElement('div'); h.className = 'command-group-label'; h.textContent = 'Last used';
                    sec.append(h, menuRow(lastUsedColor.label, colorSwatchIcon(lastUsedColor.kind, recent), () => runSelectionFormatAction(p, b, commentDraftContext.range, lastUsedColor.kind === 'text' ? 'text-color' : 'bg-color', recent.key)));
                    subList.append(sec);
                }
            }
            ['Selection text color', 'Selection highlight color'].forEach(grp => {
                const sec = document.createElement('section'); sec.className = 'command-group';
                const h = document.createElement('div'); h.className = 'command-group-label'; h.textContent = grp;
                sec.append(h);
                selColorItems.filter(it => it.group === grp).forEach(it => sec.append(menuRow(it.label, it.icon, it.run)));
                subList.append(sec);
            });
        } else {
            if (lastUsedColor) {
                const recent = BLOCK_COLORS.find(c => c.key === lastUsedColor.key);
                if (recent) {
                    const sec = document.createElement('section'); sec.className = 'command-group';
                    const h = document.createElement('div'); h.className = 'command-group-label'; h.textContent = 'Last used';
                    sec.append(h, menuRow(lastUsedColor.label, colorSwatchIcon(lastUsedColor.kind, recent), () => applyBlockColorChoice(p, b, lastUsedColor.kind, recent), '', 'Ctrl+⇧+H'));
                    subList.append(sec);
                }
            }
            ['Text color', 'Background color'].forEach(grp => {
                const sec = document.createElement('section'); sec.className = 'command-group';
                const h = document.createElement('div'); h.className = 'command-group-label'; h.textContent = grp;
                sec.append(h);
                colorItems.filter(it => it.group === grp).forEach(it => sec.append(menuRow(it.label, it.icon, it.run, '', '', { checked: it.checked })));
                subList.append(sec);
            });
        }
        sub.append(subList);
        sub.hidden = false;
        const menuRect = menu.getBoundingClientRect();
        const rowRect = triggerRow.getBoundingClientRect();
        const subRect = sub.getBoundingClientRect();
        const spaceRight = window.innerWidth - menuRect.right - 10;
        const x = spaceRight >= subRect.width ? menuRect.right + 4 : Math.max(8, menuRect.left - subRect.width - 4);
        const y = Math.max(8, Math.min(rowRect.top - 6, window.innerHeight - subRect.height - 8));
        sub.style.left = `${x}px`;
        sub.style.top = `${y}px`;
        sub.onmouseenter = () => clearTimeout(submenuCloseTimer);
        sub.onmouseleave = () => { submenuCloseTimer = window.setTimeout(hideSubmenu, 140); };
    };

    const wireSubmenuTrigger = (row, kind) => {
        row.dataset.submenu = kind;
        row.onmouseenter = () => openSubmenu(kind, row);
        row.onfocus = () => openSubmenu(kind, row);
        row.onmouseleave = () => { submenuCloseTimer = window.setTimeout(hideSubmenu, 140); };
    };

    const draw = () => {
        list.replaceChildren();
        hideSubmenu();
        menu.scrollTop = 0;
        const q = input.value.trim();
        if (q) {
            const searchable = [
                ...selectionActions,
                ...selColorItems,
                ...linkActions,
                ...mediaActions,
                ...iconAction,
                ...toggleAction,
                ...primaryActions,
                ...columnActions,
                ...turnIntoItems,
                ...colorItems
            ];
            const matches = searchable.filter(item => menuMatches(item.label + ' ' + item.group, q));
            if (!matches.length) {
                const empty = document.createElement('div'); empty.className = 'command-empty'; empty.textContent = 'No matching actions';
                list.append(empty);
            }
            [...new Set(matches.map(item => item.group))].forEach(group => {
                const section = document.createElement('section'); section.className = 'command-group';
                const heading = document.createElement('div'); heading.className = 'command-group-label'; heading.textContent = group;
                section.append(heading);
                matches.filter(item => item.group === group).forEach(item => section.append(menuRow(item.label, item.icon, item.run, '', item.shortcut || '', { checked: item.checked })));
                list.append(section);
            });
        } else {
            if (selectionActions.length) {
                const selGroup = document.createElement('section'); selGroup.className = 'command-group';
                const selHeading = document.createElement('div'); selHeading.className = 'command-group-label'; selHeading.textContent = 'Selected text';
                selGroup.append(selHeading);
                const selFmtRow = menuRow('Format selection', menuGlyph('Text'), () => openSubmenu('sel-format', selFmtRow), '', '', { hasSubmenu: true, keepOpen: true });
                wireSubmenuTrigger(selFmtRow, 'sel-format');
                const selColorRow = menuRow('Highlight / Text color', menuGlyph('Color'), () => openSubmenu('sel-color', selColorRow), '', '', { hasSubmenu: true, keepOpen: true });
                wireSubmenuTrigger(selColorRow, 'sel-color');
                selGroup.append(selFmtRow, selColorRow);
                list.append(selGroup);
            }
            if (!ro || linkActions.length || mediaActions.length || iconAction.length || toggleAction.length) {
                const topGroup = document.createElement('section'); topGroup.className = 'command-group';
                const topHeading = document.createElement('div'); topHeading.className = 'command-group-label'; topHeading.textContent = blockLabel;
                topGroup.append(topHeading);
                if (!ro) {
                    const turnRow = menuRow('Turn into', menuGlyph('Turn into'), () => openSubmenu('turn-into', turnRow), '', '', { hasSubmenu: true, keepOpen: true });
                    wireSubmenuTrigger(turnRow, 'turn-into');
                    const colorRow = menuRow('Color', menuGlyph('Color'), () => openSubmenu('color', colorRow), '', '', { hasSubmenu: true, keepOpen: true });
                    wireSubmenuTrigger(colorRow, 'color');
                    topGroup.append(turnRow, colorRow);
                }
                [...linkActions, ...mediaActions, ...iconAction, ...toggleAction].forEach(item => {
                    const r = menuRow(item.label, item.icon, item.run);
                    r.onmouseenter = () => { submenuCloseTimer = window.setTimeout(hideSubmenu, 100); };
                    topGroup.append(r);
                });
                list.append(topGroup);
            }

            if (columnActions.length) {
                const colGroup = document.createElement('section'); colGroup.className = 'command-group';
                columnActions.forEach(item => {
                    const r = menuRow(item.label, item.icon, item.run);
                    r.onmouseenter = () => { submenuCloseTimer = window.setTimeout(hideSubmenu, 100); };
                    colGroup.append(r);
                });
                list.append(colGroup);
            }

            const actGroup = document.createElement('section'); actGroup.className = 'command-group';
            primaryActions.forEach(item => {
                const r = menuRow(item.label, item.icon, item.run, '', item.shortcut || '');
                r.onmouseenter = () => { submenuCloseTimer = window.setTimeout(hideSubmenu, 100); };
                actGroup.append(r);
            });
            list.append(actGroup);
        }
        menuIndex = q ? 0 : -1; refreshMenuSelection();
    };
    input.addEventListener('input', draw);
    const author = p.lastEditedBy || getActorDisplayName();
    const initials = author.split(/\s+/).map(s => s[0]).join('').slice(0, 2).toUpperCase() || 'JD';
    const blockPlain = [b.text || '', ...collectBlockText(b.children || [])].join(' ').trim();
    const words = blockPlain ? blockPlain.split(/\s+/).filter(Boolean).length : 0;
    const chars = blockPlain.length;
    const stamp = new Date(p.updatedAt || Date.now()).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    const footer = document.createElement('div'); footer.className = 'menu-footer';
    footer.innerHTML = `<div class="menu-footer-title">Last edited</div><div class="menu-footer-user"><span class="menu-footer-avatar">${esc(initials)}</span><span>${esc(author)}</span></div><div>${esc(stamp)}</div><div>${words} ${words === 1 ? 'word' : 'words'}, ${chars} ${chars === 1 ? 'character' : 'characters'}</div>`;
    menu.append(footer);
    draw();
    const point = anchor?.clientX != null
        ? { left: anchor.clientX + 2, top: anchor.clientY + 2 }
        : { left: anchor.getBoundingClientRect().left - 4, top: anchor.getBoundingClientRect().bottom + 5 };
    placeFloatingMenu(menu, point.left, point.top);
    menuIndex = -1; refreshMenuSelection(); activeMenu = menu;
    requestAnimationFrame(() => { input.focus(); input.setSelectionRange(input.value.length, input.value.length); });
}
function createPage(parentId, title = 'Untitled') {
    const fw = !!state?.userPreferences?.appearance?.defaultFullWidth;
    const actor = getActorDisplayName();
    const p = { id: id(), title, icon: '📄', parentId, createdBy: actor, lastEditedBy: actor, fullWidth: fw, blocks: [block('text')], createdAt: Date.now(), updatedAt: Date.now() };
    state.pages.push(p);
    return p;
}
function showPageLinkPicker(p, b) { const query = prompt('Search pages or type a new page title', ''); if (query === null)
    return; pushUndoBeforeEdit(p); const found = state.pages.find(x => x.title.toLowerCase() === query.toLowerCase()); if (found) {
    b.type = 'page_link';
    b.targetId = found.id;
    b.text = found.title;
}
else if (query.trim()) {
    const child = createPage(p.id, query.trim());
    b.type = 'page_link';
    b.targetId = child.id;
    b.text = child.title;
} save(); render(); }
function toLocalIsoDate(d = new Date()): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
function computeReminderTimestamp(dateStr: string, timeStr: string, offsetKey: string, overrideMs?: number): number | undefined {
    if (!offsetKey || offsetKey === 'none') return undefined;
    if (typeof overrideMs === 'number' && Number.isFinite(overrideMs) && overrideMs > 0) return overrideMs;
    const dm = String(dateStr || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dm) return undefined;
    const y = Number(dm[1]), mo = Number(dm[2]), day = Number(dm[3]);
    const tm = String(timeStr || '09:00').match(/^(\d{1,2}):(\d{2})$/);
    const hh = tm ? Number(tm[1]) : 9, mm = tm ? Number(tm[2]) : 0;
    const baseMs = new Date(y, mo - 1, day, hh, mm, 0, 0).getTime();
    if (!Number.isFinite(baseMs)) return undefined;
    const minusMs = offsetKey === '15m' ? 15 * 60000 : offsetKey === '1h' ? 3600000 : offsetKey === '1d' ? 86400000 : 0;
    return baseMs - minusMs;
}
function formatReminderChipLabel(dateStr: string, timeStr: string, offsetKey: string): string {
    const today = toLocalIsoDate(new Date());
    const tom = toLocalIsoDate(new Date(Date.now() + 86400000));
    let base = dateStr || 'Date';
    if (dateStr === today) base = 'Today';
    else if (dateStr === tom) base = 'Tomorrow';
    else {
        const dm = String(dateStr || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dm) base = new Date(Number(dm[1]), Number(dm[2]) - 1, Number(dm[3])).toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    const timePart = timeStr ? ` ${timeStr}` : '';
    const remTag = offsetKey && offsetKey !== 'none' ? ` · 🔔` : '';
    return `${base}${timePart}${remTag}`;
}
function openReminderPickerPopover(
    anchorEl: HTMLElement,
    initial: { date?: string; time?: string; offset?: string; remindAt?: number; fired?: boolean },
    onApply: (next: { date: string; time: string; offset: string; remindAt?: number; fired: boolean; label: string }) => void,
    onRemove?: () => void
) {
    closeRichPopover();
    const pop = openFloatingPopover(anchorEl, 'reminder-picker-popover');
    let selDate = initial.date || toLocalIsoDate();
    let selTime = initial.time || '';
    let selOffset = initial.offset || 'at_time';
    let overrideMs: number | undefined = undefined;

    const draw = () => {
        pop.replaceChildren();
        const computedMs = computeReminderTimestamp(selDate, selTime || '09:00', selOffset, overrideMs);
        const head = document.createElement('div');
        head.className = 'rich-popover-head';
        head.innerHTML = `<strong>⏰ Date &amp; reminder</strong><button type="button" class="icon-button" data-rem-close aria-label="Close">×</button>`;
        head.querySelector('[data-rem-close]')?.addEventListener('click', closeRichPopover);

        const presets = document.createElement('div');
        presets.className = 'rem-presets-row';
        const nowD = new Date();
        const addPreset = (label: string, dStr: string, tStr: string, off: string, msOverride?: number) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'secondary-button rem-preset-btn'; b.textContent = label;
            b.onclick = () => { selDate = dStr; selTime = tStr; selOffset = off; overrideMs = msOverride; draw(); };
            presets.append(b);
        };
        addPreset('Today', toLocalIsoDate(nowD), selTime, selOffset === 'none' ? 'at_time' : selOffset);
        addPreset('Tomorrow', toLocalIsoDate(new Date(Date.now() + 86400000)), selTime || '09:00', selOffset === 'none' ? 'at_time' : selOffset);
        addPreset('Next week', toLocalIsoDate(new Date(Date.now() + 7 * 86400000)), selTime || '09:00', selOffset === 'none' ? 'at_time' : selOffset);
        const in1Min = new Date(Date.now() + 60000);
        addPreset('In 1m', toLocalIsoDate(in1Min), `${String(in1Min.getHours()).padStart(2, '0')}:${String(in1Min.getMinutes()).padStart(2, '0')}`, 'at_time', in1Min.getTime());

        const fields = document.createElement('div');
        fields.className = 'rem-fields-grid';
        fields.innerHTML = `<label class="rem-field"><span>Date</span><input type="date" class="rem-date-input"></label><label class="rem-field"><span>Time (optional)</span><input type="time" class="rem-time-input"></label><label class="rem-field rem-field-wide"><span>Remind me</span><select class="rem-offset-select"><option value="none">No reminder</option><option value="at_time">At time of event</option><option value="15m">15 minutes before</option><option value="1h">1 hour before</option><option value="1d">1 day before</option></select></label>`;
        const dInp = fields.querySelector('.rem-date-input') as HTMLInputElement;
        const tInp = fields.querySelector('.rem-time-input') as HTMLInputElement;
        const oSel = fields.querySelector('.rem-offset-select') as HTMLSelectElement;
        dInp.value = selDate;
        tInp.value = selTime;
        oSel.value = selOffset;
        dInp.onchange = () => { selDate = dInp.value || toLocalIsoDate(); overrideMs = undefined; statusEl.textContent = buildStatus(); };
        tInp.onchange = () => { selTime = tInp.value; overrideMs = undefined; statusEl.textContent = buildStatus(); };
        oSel.onchange = () => { selOffset = oSel.value; overrideMs = undefined; statusEl.textContent = buildStatus(); };

        const statusEl = document.createElement('div');
        statusEl.className = 'rem-status-note';
        const buildStatus = () => {
            const ms = computeReminderTimestamp(dInp.value || selDate, tInp.value || '09:00', oSel.value, overrideMs);
            if (!ms) return 'Date chip without push notification.';
            if (initial.fired && ms === initial.remindAt) return `Triggered on ${new Date(ms).toLocaleString()}`;
            return `Reminds on ${new Date(ms).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
        };
        statusEl.textContent = buildStatus();

        const foot = document.createElement('div');
        foot.className = 'rich-popover-actions';
        if (onRemove) {
            const rmBtn = document.createElement('button');
            rmBtn.type = 'button'; rmBtn.className = 'secondary-button'; rmBtn.textContent = 'Remove';
            rmBtn.onclick = () => { closeRichPopover(); onRemove(); };
            foot.append(rmBtn);
        }
        const saveBtn = document.createElement('button');
        saveBtn.type = 'button'; saveBtn.className = 'share-button rem-save-btn'; saveBtn.textContent = 'Save';
        saveBtn.onclick = () => {
            const dVal = dInp.value || selDate || toLocalIsoDate();
            const tVal = tInp.value || selTime || '';
            const offVal = oSel.value || selOffset || 'none';
            const nextAt = computeReminderTimestamp(dVal, tVal || '09:00', offVal, overrideMs);
            const fired = !!initial.fired && !!nextAt && nextAt === initial.remindAt;
            const label = formatReminderChipLabel(dVal, tVal, offVal);
            closeRichPopover();
            onApply({ date: dVal, time: tVal, offset: offVal, remindAt: nextAt, fired, label });
        };
        foot.append(saveBtn);

        pop.append(head, presets, fields, statusEl, foot);
    };
    draw();
}
function checkDueReminders(ws = state, syncUi = true): number {
    if (!Array.isArray(ws?.pages)) return 0;
    const now = Date.now();
    let firedCount = 0;
    const visit = (blocks: Block[], pg: Page) => {
        for (const b of blocks || []) {
            if (b.type === 'date' && b.remindAt && !b.remindFired && Number(b.remindAt) <= now) {
                b.remindFired = true;
                firedCount++;
                pushInboxNotification({
                    kind: 'system',
                    title: `⏰ Reminder: ${b.text || b.remindDate || 'Date'}`,
                    body: `Scheduled reminder on “${pg.title || 'Untitled'}”`,
                    pageId: pg.id,
                    blockId: b.id,
                    displayMode: 'inbox'
                });
            }
            if (b.html && b.html.includes('data-mention-kind="reminder"')) {
                try {
                    const doc = new DOMParser().parseFromString(b.html, 'text/html');
                    let blockChanged = false;
                    doc.querySelectorAll('.inline-mention-chip[data-mention-kind="reminder"]').forEach(chip => {
                        const rat = Number(chip.getAttribute('data-remind-at') || 0);
                        const already = chip.getAttribute('data-remind-fired') === '1';
                        if (rat > 0 && !already && rat <= now) {
                            chip.setAttribute('data-remind-fired', '1');
                            chip.classList.add('is-fired');
                            chip.classList.remove('is-scheduled');
                            blockChanged = true;
                            firedCount++;
                            pushInboxNotification({
                                kind: 'system',
                                title: `⏰ Reminder: ${(chip.textContent || '').trim() || 'Date'}`,
                                body: `Reminder triggered in “${pg.title || 'Untitled'}”`,
                                pageId: pg.id,
                                blockId: b.id,
                                displayMode: 'inbox'
                            });
                            const liveDomChip = editor.querySelector(`[data-block-id="${CSS.escape(b.id)}"] .inline-mention-chip[data-mention-id="${CSS.escape(chip.getAttribute('data-mention-id') || '')}"]`);
                            if (liveDomChip) {
                                liveDomChip.setAttribute('data-remind-fired', '1');
                                liveDomChip.classList.add('is-fired');
                                liveDomChip.classList.remove('is-scheduled');
                            }
                        }
                    });
                    if (blockChanged) b.html = cleanInlineHtml(doc.body.innerHTML);
                } catch {}
            }
            if (Array.isArray(b.children) && b.children.length) visit(b.children, pg);
        }
    };
    ws.pages.forEach(pg => visit(pg.blocks || [], pg));
    if (firedCount > 0 && syncUi && ws === state) {
        save();
        syncInboxBadges();
    }
    return firedCount;
}
function wireInlineReminderChip(chip: HTMLElement, p: Page, b: Block) {
    chip.title = 'Click to edit date & reminder';
    chip.onclick = ev => {
        if (effectivePageReadOnly(p)) return;
        ev.preventDefault();
        ev.stopPropagation();
        openReminderPickerPopover(chip, {
            date: chip.getAttribute('data-date') || toLocalIsoDate(),
            time: chip.getAttribute('data-time') || '',
            offset: chip.getAttribute('data-remind-offset') || 'at_time',
            remindAt: Number(chip.getAttribute('data-remind-at') || 0) || undefined,
            fired: chip.getAttribute('data-remind-fired') === '1'
        }, next => {
            pushUndoBeforeEdit(p);
            chip.setAttribute('data-date', next.date);
            if (next.time) chip.setAttribute('data-time', next.time); else chip.removeAttribute('data-time');
            chip.setAttribute('data-remind-offset', next.offset);
            if (next.remindAt) chip.setAttribute('data-remind-at', String(next.remindAt)); else chip.removeAttribute('data-remind-at');
            if (next.fired) {
                chip.setAttribute('data-remind-fired', '1');
                chip.classList.add('is-fired');
                chip.classList.remove('is-scheduled');
            } else {
                chip.removeAttribute('data-remind-fired');
                chip.classList.remove('is-fired');
                chip.classList.toggle('is-scheduled', !!next.remindAt);
            }
            chip.textContent = `⏰ ${next.label}`;
            const blkEl = chip.closest('.block');
            if (blkEl) updateBlockFromDOM(blkEl);
            save();
        }, () => {
            pushUndoBeforeEdit(p);
            const blkEl = chip.closest('.block');
            chip.remove();
            if (blkEl) updateBlockFromDOM(blkEl);
            save();
        });
    };
}
function buildMentionUserSuggestions(q = ''): Array<{ id: string; label: string; kind: 'person'; roleLabel: string }> {
    const query = q.trim().toLowerCase();
    const list: Array<{ id: string; label: string; kind: 'person'; roleLabel: string }> = (state.users || [])
        .filter(u => !u.blocked)
        .map(u => {
            const topRole = getUserRoles(u)[0]?.name || 'Member';
            return { id: u.id, label: u.name, kind: 'person', roleLabel: topRole };
        });
    list.push({ id: 'everyone', label: 'everyone', kind: 'person', roleLabel: 'Notify all members' });
    return list.filter(x => !query || x.label.toLowerCase().includes(query) || x.roleLabel.toLowerCase().includes(query));
}
function buildInlineMentionChipNode(x: { kind: 'page' | 'person' | 'reminder'; id: string; label: string; date?: string; time?: string; offset?: string; remindAt?: number }): HTMLSpanElement {
    const chip = document.createElement('span');
    chip.className = 'inline-mention-chip' + (x.kind === 'reminder' ? ' is-reminder-chip is-scheduled' : '');
    chip.contentEditable = 'false';
    chip.dataset.mentionKind = x.kind;
    if (x.id) chip.dataset.mentionId = x.id;
    if (x.kind === 'reminder') {
        const dStr = x.date || toLocalIsoDate();
        const off = x.offset || 'at_time';
        const rAt = x.remindAt || computeReminderTimestamp(dStr, x.time || '09:00', off);
        chip.setAttribute('data-date', dStr);
        if (x.time) chip.setAttribute('data-time', x.time);
        chip.setAttribute('data-remind-offset', off);
        if (rAt) chip.setAttribute('data-remind-at', String(rAt));
        chip.textContent = `⏰ ${x.label}`;
    } else {
        chip.textContent = x.kind === 'page' ? `📄 ${x.label}` : `@${x.label}`;
    }
    return chip;
}
function insertInlineMentionChipAtRange(triggerRange: Range, x: { kind: 'page' | 'person' | 'reminder'; id: string; label: string; date?: string; time?: string; offset?: string; remindAt?: number }, target: HTMLElement, blockEl: HTMLElement, p: Page, b: Block): HTMLSpanElement {
    pushUndoBeforeEdit(p);
    triggerRange.deleteContents();
    const chip = buildInlineMentionChipNode(x);
    triggerRange.insertNode(chip);
    const afterChip = document.createRange();
    afterChip.setStartAfter(chip);
    afterChip.collapse(true);
    const nextChar = (chip.nextSibling?.nodeType === Node.TEXT_NODE ? (chip.nextSibling.textContent || '') : '')[0] || '';
    let caretNode: Text;
    let caretOffset = 1;
    if (/^\s$/.test(nextChar) && chip.nextSibling?.nodeType === Node.TEXT_NODE) {
        caretNode = chip.nextSibling as Text;
    } else {
        caretNode = document.createTextNode(' ');
        afterChip.insertNode(caretNode);
    }
    const caret = document.createRange();
    caret.setStart(caretNode, Math.min(caretOffset, (caretNode.textContent || '').length));
    caret.collapse(true);
    target.focus?.({ preventScroll: true });
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(caret);
    b.mentions = b.mentions || [];
    if (!b.mentions.some(m => m.kind === x.kind && m.id === x.id)) b.mentions.push({ kind: x.kind, id: x.id, label: x.label });
    updateBlockFromDOM(blockEl);
    if (x.kind === 'person') notifyPageMentionIfSelf(p, b.id, x.id || x.label, commentUserProfile().name);
    if (x.kind === 'reminder') wireInlineReminderChip(chip, p, b);
    save();
    scheduleBadgeLayout();
    return chip;
}
function getMentionTriggerBeforeCaret(target: HTMLElement): { isPageLink: boolean; query: string; triggerRange: Range } | null {
    const sel = getSelection();
    if (!sel?.rangeCount || !sel.isCollapsed) return null;
    let node: Node | null = sel.focusNode;
    let offset = sel.focusOffset;
    if (!node || !target.contains(node)) return null;
    if (node.nodeType !== Node.TEXT_NODE) {
        if (offset > 0 && node.childNodes[offset - 1]) {
            let cur: Node | null = node.childNodes[offset - 1];
            while (cur && cur.nodeType !== Node.TEXT_NODE && cur.lastChild) cur = cur.lastChild;
            if (cur?.nodeType === Node.TEXT_NODE) {
                node = cur;
                offset = (cur.textContent || '').length;
            }
        } else if (offset === 0 && node === target && target.childNodes.length === 1 && target.firstChild?.nodeType === Node.TEXT_NODE && /^(@|\[\[)[^@\n]*$/.test(target.firstChild.textContent || '')) {
            node = target.firstChild;
            offset = (node.textContent || '').length;
        }
    }
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const before = (node.textContent || '').slice(0, offset);
    const pageMatch = before.match(/\[\[([^\[\]\n]{0,40})$/);
    if (pageMatch) {
        const triggerStart = offset - pageMatch[0].length;
        const triggerRange = document.createRange();
        triggerRange.setStart(node, triggerStart);
        triggerRange.setEnd(node, offset);
        return { isPageLink: true, query: pageMatch[1] || '', triggerRange };
    }
    const atMatch = before.match(/(?:^|[\s(\["'])@([a-zA-Z0-9._-]*(?:\s[a-zA-Z0-9._-]*)?)$/);
    if (atMatch) {
        const atIdx = atMatch[0].lastIndexOf('@');
        const triggerLen = atMatch[0].length - atIdx;
        const triggerStart = offset - triggerLen;
        if (triggerStart < 0) return null;
        const triggerRange = document.createRange();
        triggerRange.setStart(node, triggerStart);
        triggerRange.setEnd(node, offset);
        return { isPageLink: false, query: atMatch[1] || '', triggerRange };
    }
    return null;
}
function showMentionPicker(p, b) { const menu = $('#command-menu'); menu.className = 'command-menu'; menu.dataset.owner = 'doc-mention'; const suggestions = [...buildMentionUserSuggestions().map(u => ({ label: u.label, id: u.id, kind: 'person' as const })), ...state.pages.filter(pg => resolvePagePermissions(pg).view).map(x => ({ label: x.title || 'Untitled', id: x.id, kind: 'page' as const }))]; menu.innerHTML = ''; suggestions.forEach((x, i) => { const row = document.createElement('button'); row.type = 'button'; row.className = 'command-row' + (!i ? ' selected' : ''); row.textContent = (x.kind === 'page' ? '📄 ' : '👤 ') + x.label; row.onclick = () => { pushUndoBeforeEdit(p); const chipHtml = `<span class="inline-mention-chip" contenteditable="false" data-mention-kind="${x.kind}" data-mention-id="${esc(x.id)}">${x.kind === 'page' ? '📄 ' + esc(x.label) : '@' + esc(x.label)}</span> `; b.type = b.type === 'mention' ? 'text' : b.type; b.text = ((b.text || '').trim() ? b.text + ' ' : '') + (x.kind === 'page' ? x.label : '@' + x.label) + ' '; b.html = cleanInlineHtml((b.html || esc(b.text === `@${x.label} ` ? '' : b.text)) + chipHtml); b.mentions = [{ kind: x.kind, id: x.id, label: x.label }]; if (x.kind === 'person') notifyPageMentionIfSelf(p, b.id, x.id || x.label, commentUserProfile().name); save(); render(); menu.hidden = true; activeMenu = null; }; menu.append(row); }); const blkEl = editor.querySelector(`[data-block-id="${CSS.escape(b.id)}"]`); placeCommandMenu(menu, blkEl || editor); menuIndex = 0; refreshMenuSelection(); activeMenu = menu; }
function showMovePicker(p, b) { const dest = state.pages.filter(x => x.id !== p.id); const choice = prompt('Move block to which page?\n' + dest.map(x => x.title).join('\n')); const target = dest.find(x => x.title === choice); if (target) {
    pushUndoBeforeEdit(p);
    target.blocks.push(cloneBlockTree(b));
    const found = findBlockById(p.blocks, b.id);
    if (found) { found.list.splice(found.index, 1); pruneEmptyColumn(p, found.list); }
    save();
    render();
} }
function showMenuKeyboard(e) { if (!activeMenu || activeMenu.hidden)
    return; const rows = Array.from(activeMenu.querySelectorAll('.command-row')); if (!rows.length)
    return; if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    e.stopPropagation();
    menuIndex = (menuIndex + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
    refreshMenuSelection();
    rows[menuIndex]?.scrollIntoView({ block: 'nearest' });
}
else if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault();
    e.stopPropagation();
    rows[menuIndex]?.click();
}
else if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    activeMenu.hidden = true;
    activeMenu = null;
} }
function selectAllPageText() {
    const activeColList = activeBlockFromSelection()?.closest('.column-cell > .block-list');
    const host = (activeColList && activeColList.isContentEditable) ? activeColList : editor.querySelector('.block-editor');
    if (!host) return;
    const blocks = Array.from(host.querySelectorAll('.block')).filter(el => {
        if (activeColList) return el.closest('.column-cell > .block-list') === activeColList;
        return !el.closest('.columns');
    });
    const targets = blocks.map(blockEl => editableTarget(blockEl)).filter(t => t && t.isContentEditable && !t.closest('.simple-table'));
    if (!targets.length) return;
    const first = targets[0], last = targets[targets.length - 1];
    first.focus?.({ preventScroll: true });
    const range = document.createRange();
    range.setStart(first, 0);
    range.setEnd(last, last.childNodes.length);
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}
function adjacentEditableBlockEl(currentBlockEl, delta) {
    const editableBlocks = Array.from(editor.querySelectorAll('.block')).filter(el => editableTarget(el)?.isContentEditable);
    const pos = editableBlocks.indexOf(currentBlockEl);
    return pos >= 0 ? (editableBlocks[pos + delta] || null) : null;
}
function isCaretAtVerticalEdge(target, toTop) {
    const selection = getSelection();
    if (!selection?.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    if (!target.contains(range.startContainer)) return false;
    const text = (target.textContent || '').replace(/\u200b/g, '');
    if (!text) return true;
    const targetRect = target.getBoundingClientRect();
    const rects = range.getClientRects();
    const caretRect = rects[0];
    if (!caretRect || !targetRect.height) return false;
    return toTop ? (caretRect.top - targetRect.top <= 10) : (targetRect.bottom - caretRect.bottom <= 10);
}
function editorKeys(e) {
    const el = e.target;
    if (!editor.contains(el) || !el.isContentEditable) return;
    if (el.closest('.simple-table, .db-interactive-surface')) return;
    const isContainerTarget = el.matches?.('.block-editor, .toggle-content, .block-list');
    const selBlock = activeBlockFromSelection();
    const blockEl = isContainerTarget ? (selBlock || el.closest('.block')) : (el.closest('.block') || selBlock);
    if (!blockEl) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && el.closest('.block-editor')) { e.preventDefault(); selectAllPageText(); }
        else if (e.key === 'Enter' && el.matches('.page-heading,.page-subtitle')) { e.preventDefault(); focusBlockAt(0); }
        return;
    }
    const ctx = blockContext(blockEl);
    if (!ctx) return;
    const { list, index: idx, item: b } = ctx, target = editableTarget(blockEl);
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        triggerSelectionOrBlockComment(ctx.page, b, blockEl);
        return;
    }
    if (b.type === 'code') {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            const range = document.createRange(); range.selectNodeContents(target);
            const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            pushUndoBeforeEdit(ctx.page);
            const created = block('text');
            list.splice(idx + 1, 0, created);
            save(); render(); focusBlockById(created.id);
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            noteTypingBurstUndo(ctx.page);
            insertPlainTextIntoPre(target, '\n');
            updateBlockFromDOM(blockEl);
            save();
            return;
        }
        if (e.key === 'Backspace' && getSelection()?.isCollapsed) {
            if (!readPlainTextFromNode(target) && (list.length > 1 || ctx.parentBlock)) {
                e.preventDefault();
                mergeOrRemoveBlock(ctx, target);
                return;
            }
            if (target.textContent?.endsWith('\n\u200b')) {
                const selection = getSelection(), range = selection?.rangeCount ? selection.getRangeAt(0) : null;
                if (range && range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset === range.startContainer.textContent.length && range.startContainer.textContent.endsWith('\u200b')) {
                    range.startContainer.textContent = range.startContainer.textContent.slice(0, -1);
                    setCaretAtTextOffset(target, readPlainTextFromNode(target).length);
                }
            }
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey && isCaretAtVerticalEdge(target, e.key === 'ArrowUp')) {
            const nextEl = adjacentEditableBlockEl(blockEl, e.key === 'ArrowUp' ? -1 : 1);
            if (nextEl) { e.preventDefault(); focusBlockEl(nextEl, e.key === 'ArrowDown'); return; }
        }
        return;
    }
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (adjustListIndent(ctx, target, e.shiftKey ? -1 : 1, blockEl)) {
            e.preventDefault();
            return;
        }
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') { e.preventDefault(); selectAllPageText(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); pushUndoBeforeEdit(ctx.page); const dup = cloneBlockTree(b); list.splice(idx + 1, 0, dup); save(); render(); focusBlockById(dup.id); return; }
    if ((e.ctrlKey || e.metaKey) && ['b','i','u'].includes(e.key.toLowerCase())) { e.preventDefault(); pushUndoBeforeEdit(ctx.page); document.execCommand(e.key.toLowerCase() === 'b' ? 'bold' : e.key.toLowerCase() === 'i' ? 'italic' : 'underline'); syncBlocksFromEditor(); save(); lastStablePageState.set(ctx.page.id, snapshotForPage(ctx.page)); return; }
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey && isCaretAtVerticalEdge(target, e.key === 'ArrowUp')) {
        const nextEl = adjacentEditableBlockEl(blockEl, e.key === 'ArrowUp' ? -1 : 1);
        if (nextEl) { e.preventDefault(); focusBlockEl(nextEl, e.key === 'ArrowDown'); return; }
    }
    if (e.key === 'ArrowLeft' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey && (isToggleBlock(b) || b.type === 'todo' || b.type === 'callout') && getSelection()?.isCollapsed) {
        const before = contentAtCaret(target, false);
        if (before?.toString().replace(/\u200b/g, '') === '') {
            e.preventDefault();
            const prev = adjacentEditableBlockEl(blockEl, -1);
            if (prev) focusBlockEl(prev, false);
            return;
        }
    }
    const convertLineToDivider = (alwaysInsertLineAfter: boolean) => {
        e.preventDefault();
        pushUndoBeforeEdit(ctx.page);
        b.type = 'divider';
        b.toggle = false;
        b.indent = undefined;
        b.text = '';
        b.html = undefined;
        let next = !alwaysInsertLineAfter ? list[idx + 1] : null;
        if (!next || next.type === 'divider') {
            next = block('text');
            list.splice(idx + 1, 0, next);
        }
        save();
        render();
        focusBlockById(next.id);
    };
    if (e.key === 'Enter' && !e.shiftKey) {
        const raw = (target.textContent || '').replace(/\u200b/g, '').trim();
        if (!isToggleBlock(b) && (raw === '---' || raw === '___' || raw === '***')) {
            convertLineToDivider(true);
            return;
        }
        e.preventDefault();
        splitBlockAtCaret(ctx, target);
        return;
    }
    if (e.key === 'Backspace' && getSelection()?.isCollapsed) {
        const before = contentAtCaret(target, false);
        if (before?.toString().replace(/\u200b/g, '') === '' && (isToggleBlock(b) || (isIndentableListBlock(b) && normalizedListIndent(b) > 0) || b.text === '' || idx > 0 || ctx.parentBlock)) {
            e.preventDefault();
            mergeOrRemoveBlock(ctx, target);
            return;
        }
    }
    if (e.key === '/' && !(target.textContent || '').replace(/\u200b/g, '')) { setTimeout(() => showMenu('', b), 0); return; }
    if (e.key === ' ') {
        const raw = (target.textContent || '').replace(/\u200b/g, '').trim();
        const toggleMatch = raw.match(/^>(#{1,6})$/);
        if (raw === '>>' || toggleMatch) {
            e.preventDefault();
            pushUndoBeforeEdit(ctx.page);
            b.type = toggleMatch ? `h${toggleMatch[1].length}` : 'toggle';
            b.toggle = true;
            b.indent = undefined;
            b.open = true;
            b.children = b.children?.length ? b.children : [block('text')];
            b.text = ''; b.html = undefined;
            save(); render(); focusBlockById(b.id);
            return;
        }
        const map = { '#': 'h1', '##': 'h2', '###': 'h3', '####': 'h4', '#####': 'h5', '######': 'h6', '-': 'bullet', '*': 'bullet', '+': 'bullet', '[]': 'todo', '[ ]': 'todo', '>': 'quote' };
        if (!isToggleBlock(b) && (raw === '---' || raw === '___' || raw === '***')) {
            convertLineToDivider(false);
            return;
        }
        if (map[raw] || (/^\d+\.$/.test(raw))) {
            e.preventDefault();
            pushUndoBeforeEdit(ctx.page);
            b.type = map[raw] || 'numbered';
            if (!isHeadingType(b.type)) b.toggle = false;
            if (!isIndentableListBlock(b)) b.indent = undefined;
            b.text = ''; b.html = undefined;
            save(); render(); focusBlockById(b.id);
        }
    }
}
function removeCaretAnchorFromInput(target) {
    const selection = getSelection();
    if (!target || !selection?.rangeCount || !target.textContent.includes('\u200b') || !target.textContent.replace(/\u200b/g, '')) return;
    const range = selection.getRangeAt(0);
    if (!target.contains(range.startContainer)) return;
    const prefix = document.createRange(); prefix.selectNodeContents(target); prefix.setEnd(range.startContainer, range.startOffset);
    const offset = prefix.toString().replace(/\u200b/g, '').length;
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT); let node;
    while (node = walker.nextNode()) node.textContent = node.textContent.replace(/\u200b/g, '');
    setCaretAtTextOffset(target, offset);
}
function handleBlockRangeDeletion(event) {
    const isDelete = ['deleteContentBackward', 'deleteContentForward', 'deleteByCut'].includes(event.inputType);
    const isInsert = event.inputType === 'insertText' || event.inputType === 'insertReplacementText';
    if (!isDelete && !isInsert) return;
    const selection = getSelection(); if (!selection?.rangeCount || selection.isCollapsed) return;
    const range = selection.getRangeAt(0), startBlock = activeBlockFromNode(range.startContainer), endBlock = activeBlockFromNode(range.endContainer);
    if (!startBlock || !endBlock || startBlock === endBlock) return;
    const startCtx = blockContext(startBlock), endCtx = blockContext(endBlock);
    if (!startCtx || !endCtx) { event.preventDefault(); return; }
    const startTarget = editableTarget(startBlock), endTarget = editableTarget(endBlock);
    if (!startTarget?.contains(range.startContainer) || !endTarget?.contains(range.endContainer)) {
        event.preventDefault();
        return;
    }
    const inserted = isInsert ? (event.data ?? '') : '';
    const before = document.createRange(), after = document.createRange();
    before.selectNodeContents(startTarget); before.setEnd(range.startContainer, range.startOffset);
    after.selectNodeContents(endTarget); after.setStart(range.endContainer, range.endOffset);
    const prefix = fragmentAsEditableHTML(before.cloneContents()), suffix = fragmentAsEditableHTML(after.cloneContents());
    const text = prefix.text + inserted + suffix.text;
    const html = cleanInlineHtml(prefix.html + esc(inserted) + suffix.html);

    if (startCtx.list === endCtx.list) {
        const startIndex = startCtx.index, endIndex = endCtx.index;
        if (startIndex < 0 || endIndex <= startIndex) { event.preventDefault(); return; }
        const first = startCtx.list[startIndex];
        const kept = { ...first, type: text ? first.type : 'text', text, html: html || undefined };
        if (!text && !isToggleBlock(first)) { kept.checked = undefined; kept.targetId = undefined; kept.mentions = undefined; kept.toggle = undefined; }
        pushUndoBeforeEdit(startCtx.page);
        startCtx.list.splice(startIndex, endIndex - startIndex + 1, kept);
        if (!startCtx.list.length) startCtx.list.push(block('text'));
        event.preventDefault(); save(); render(); focusBlockById(kept.id);
        const keptEl = editor.querySelector(`[data-block-id="${CSS.escape(kept.id)}"]`);
        if (keptEl) setCaretAtTextOffset(editableTarget(keptEl), prefix.text.length + inserted.length);
        return;
    }

    if (isToggleBlock(startCtx.item) && startCtx.item.children === endCtx.list) {
        pushUndoBeforeEdit(startCtx.page);
        startCtx.item.text = text;
        startCtx.item.html = html || undefined;
        endCtx.list.splice(0, endCtx.index + 1);
        event.preventDefault(); save(); render(); focusBlockById(startCtx.item.id);
        const keptEl = editor.querySelector(`[data-block-id="${CSS.escape(startCtx.item.id)}"]`);
        if (keptEl) setCaretAtTextOffset(editableTarget(keptEl), prefix.text.length + inserted.length);
        return;
    }

    event.preventDefault();
}
function onEditorInput(e) {
    const p = current();
    if (effectivePageReadOnly(p)) return;
    if (!editor.contains(e.target) || !e.target.isContentEditable) return;
    if (e.target.closest('.simple-table, .db-interactive-surface')) return;
    const blockBeforeInput = activeBlockFromSelection();
    noteTypingBurstUndo(p);
    const preBlock = blockContext(blockBeforeInput)?.item;
    if (blockBeforeInput && preBlock?.type !== 'code') removeCaretAnchorFromInput(editableTarget(blockBeforeInput));
    if (e.inputType === 'insertText' && e.data === ' ' && blockBeforeInput && preBlock?.type !== 'code') inlineMarkdownAtCaret(editableTarget(blockBeforeInput));
    syncBlocksFromEditor(); const blockEl = activeBlockFromSelection(); if (!blockEl) { save(); return; } const ctx = blockContext(blockEl), b = ctx?.item, target = editableTarget(blockEl), value = target.innerText || ''; const wordCount = editor.querySelector('.word-count'); if (wordCount) wordCount.textContent = `${countWords(p)} words`;
    if (b && b.type !== 'code' && !b.text && !target.querySelector('img, input, button') && target.querySelector('br, strong, em, b, i, del, s, code, a, u, sup, sub, span')) {
        target.innerHTML = '';
        setCaretAtTextOffset(target, 0);
    }
    if (!b || b.type === 'code') { save(); scheduleBadgeLayout(); return; }
    if (value.startsWith('/') && !value.includes('\n')) {
        showMenu(value.slice(1), b);
        return;
    }
    const mentionTrig = getMentionTriggerBeforeCaret(target);
    if (mentionTrig) {
        const isPageLink = mentionTrig.isPageLink, q = mentionTrig.query.trim().toLowerCase();
        const pageMatches = state.pages.filter(pg => resolvePagePermissions(pg).view).map(x => ({ id: x.id, label: x.title || 'Untitled', kind: 'page' as const, roleLabel: 'Page' })).filter(x => x.label.toLowerCase().includes(q));
        const peopleMatches = isPageLink ? [] : buildMentionUserSuggestions(q);
        const topPeople = peopleMatches.slice(0, 5);
        const remindSuggestions: Array<{ id: string; label: string; kind: 'reminder'; roleLabel: string }> =
            !isPageLink && (!q || 'remind today tomorrow date schedule'.includes(q) || 'remind'.startsWith(q))
                ? [{ id: `rem-${id()}`, label: 'remind', kind: 'reminder', roleLabel: 'Date & reminder' }]
                : [];
        const matches = isPageLink
            ? pageMatches.slice(0, 8)
            : [...remindSuggestions, ...topPeople, ...pageMatches.slice(0, Math.max(0, 8 - remindSuggestions.length - topPeople.length))];
        const menu = $('#command-menu');
        menu.className = 'command-menu';
        menu.dataset.owner = 'doc-mention';
        menu.innerHTML = '';
        matches.forEach((x, i) => {
            const r = document.createElement('button');
            r.type = 'button';
            r.setAttribute('role', 'option');
            r.setAttribute('aria-selected', String(!i));
            r.className = 'command-row' + (!i ? ' selected' : '');
            const icoGlyph = x.kind === 'page' ? '▤' : x.kind === 'reminder' ? '⏰' : '@';
            const displayLbl = x.kind === 'reminder' ? '@remind — Date & reminder' : x.label;
            r.innerHTML = `<span class="command-icon">${icoGlyph}</span><span class="command-copy"><span>${esc(displayLbl)}</span><small>${esc(x.kind === 'page' ? 'Page' : (x.roleLabel || 'Person'))}</small></span><kbd>${!i ? '↵' : ''}</kbd>`;
            r.onclick = () => {
                if (x.kind === 'reminder') {
                    const todayIso = toLocalIsoDate();
                    const remChip = insertInlineMentionChipAtRange(mentionTrig.triggerRange, {
                        kind: 'reminder',
                        id: x.id,
                        label: formatReminderChipLabel(todayIso, '', 'at_time'),
                        date: todayIso,
                        time: '',
                        offset: 'at_time'
                    }, target, blockEl, p, b);
                    menu.hidden = true;
                    activeMenu = null;
                    requestAnimationFrame(() => remChip.click());
                    return;
                }
                insertInlineMentionChipAtRange(mentionTrig.triggerRange, { kind: x.kind === 'page' ? 'page' : 'person', id: x.id, label: x.label }, target, blockEl, p, b);
                menu.hidden = true;
                activeMenu = null;
            };
            menu.append(r);
        });
        menu.hidden = !matches.length;
        placeCommandMenu(menu, blockEl);
        activeMenu = matches.length ? menu : null;
        menuIndex = 0;
        return;
    }
    if (activeMenu)
        activeMenu.hidden = true;
    activeMenu = null;
    checkInlineBlockMentionNotification(p, b);
    save();
    scheduleBadgeLayout();
}
let commentsFilter = 'open';
let activeCommentThreadId = null;
let editingCommentMsgId = null;
let commentPopoverState = null; // { mode:'compose'|'view', scope?:'block'|'text', blockId?:string, quote?:string, range?:Range, threadIds?:string[], anchorRect:{left:number,top:number,right:number,bottom:number} }
let selToolbarState = null;
let badgeLayoutFrame = 0;

function commentUserProfile() {
    const u = getCurrentActorUser() || state.users?.[0];
    return { id: u?.id || 'jordan.davis', name: u?.name || 'Jordan Davis' };
}
function commentUserInitials(name) {
    return (name || 'U').split(/\s+/).filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'U';
}
function formatCommentRelativeTime(ts) {
    const diffSec = Math.max(0, Math.floor((Date.now() - (Number(ts) || Date.now())) / 1000));
    if (diffSec < 45) return 'Just now';
    const mins = Math.floor(diffSec / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 14) return `${days}d`;
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
}
function ensurePageComments(page) {
    if (!Array.isArray(page.comments)) page.comments = [];
    return page.comments;
}
function autoSizeTextarea(el, minH = 24) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(minH, el.scrollHeight)}px`;
}
function wrapRangeWithCommentMark(target, range, commentId) {
    if (!target || !range || range.collapsed) return false;
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    const slices = [];
    let tn;
    while ((tn = walker.nextNode())) {
        try { if (!range.intersectsNode(tn)) continue; } catch { continue; }
        const len = tn.textContent?.length || 0;
        if (!len) continue;
        const start = tn === range.startContainer ? Math.max(0, Math.min(len, range.startOffset)) : 0;
        const end = tn === range.endContainer ? Math.max(0, Math.min(len, range.endOffset)) : len;
        if (end > start && tn.textContent.slice(start, end).replace(/\u200b/g, '')) slices.push({ node: tn, start, end });
    }
    if (!slices.length) return false;
    for (let i = slices.length - 1; i >= 0; i--) {
        const { node, start, end } = slices[i];
        let targetNode = node;
        if (end < targetNode.textContent.length) targetNode.splitText(end);
        if (start > 0) targetNode = targetNode.splitText(start);
        const mark = document.createElement('mark');
        mark.className = 'comment-mark';
        mark.dataset.commentId = commentId;
        targetNode.parentNode?.insertBefore(mark, targetNode);
        mark.appendChild(targetNode);
    }
    return true;
}
function unwrapCommentMarkInBlocks(list, commentId) {
    let changed = false;
    for (const item of list || []) {
        if (item.html && item.html.includes(commentId)) {
            const doc = new DOMParser().parseFromString(item.html, 'text/html');
            const marks = doc.querySelectorAll(`mark[data-comment-id="${CSS.escape(commentId)}"]`);
            if (marks.length) {
                marks.forEach(mark => {
                    const frag = document.createDocumentFragment();
                    while (mark.firstChild) frag.append(mark.firstChild);
                    mark.replaceWith(frag);
                });
                const cleaned = cleanInlineHtml(doc.body.innerHTML);
                item.html = cleaned || undefined;
                changed = true;
            }
        }
        if (item.children?.length && unwrapCommentMarkInBlocks(item.children, commentId)) changed = true;
    }
    return changed;
}
function createCommentThread(page, { scope, blockId = undefined, quote = undefined, range = null, text, author: authorOverride = null }) {
    const trimmed = String(text || '').trim();
    if (!trimmed) return null;
    const now = Date.now();
    const author = authorOverride || commentUserProfile();
    const me = getCurrentActorUser() || state.users?.[0];
    const threadId = id();
    let finalScope = scope;
    if (scope === 'text' && range && blockId) {
        const blockEl = editor.querySelector(`[data-block-id="${CSS.escape(blockId)}"]`);
        const found = findBlockById(page.blocks, blockId);
        const target = blockEl ? editableTarget(blockEl) : null;
        if (blockEl && target && found?.item?.type !== 'code' && wrapRangeWithCommentMark(target, range, threadId)) {
            updateBlockFromDOM(blockEl);
        } else {
            finalScope = 'block';
        }
    }
    const thread = {
        id: threadId,
        scope: finalScope,
        blockId,
        quote: quote ? String(quote).trim().slice(0, 140) : undefined,
        resolved: false,
        createdAt: now,
        updatedAt: now,
        comments: [{ id: id(), authorId: author.id, authorName: author.name, text: trimmed, createdAt: now }]
    };
    ensurePageComments(page).push(thread);
    activeCommentThreadId = thread.id;
    if (me && mentionsUser(trimmed, me)) {
        pushInboxNotification({
            kind: 'comment',
            title: `${author.name} mentioned you in a comment on ${page.title || 'Untitled'}`,
            body: quote ? `“${quote}” — ${trimmed}` : trimmed,
            pageId: page.id,
            blockId,
            commentThreadId: thread.id,
            actor: author.name
        });
    }
    save();
    return thread;
}
function replyToCommentThread(page, thread, text, authorOverride = null) {
    const trimmed = String(text || '').trim();
    if (!trimmed || !thread) return null;
    const author = authorOverride || commentUserProfile();
    const me = getCurrentActorUser() || state.users?.[0];
    const hadMyComment = !!me && (thread.comments || []).some(c => c.authorId === me.id || c.authorName === me.name);
    const repliedByOther = !!me && author.id !== me.id && author.name !== me.name;
    const mentionedMe = !!me && mentionsUser(trimmed, me);
    const now = Date.now();
    const msg = { id: id(), authorId: author.id, authorName: author.name, text: trimmed, createdAt: now };
    thread.comments.push(msg);
    if (thread.resolved) { thread.resolved = false; thread.resolvedAt = undefined; thread.resolvedBy = undefined; }
    thread.updatedAt = now;
    activeCommentThreadId = thread.id;
    if (mentionedMe || (hadMyComment && repliedByOther)) {
        pushInboxNotification({
            kind: 'reply',
            title: mentionedMe
                ? `${author.name} mentioned you in a reply on ${page.title || 'Untitled'}`
                : `${author.name} replied to your comment on ${page.title || 'Untitled'}`,
            body: trimmed,
            pageId: page.id,
            blockId: thread.blockId,
            commentThreadId: thread.id,
            actor: author.name
        });
    }
    save();
    syncCommentViews();
    return msg;
}
function focusCommentTarget(page, thread) {
    if (!thread) return;
    activeCommentThreadId = thread.id;
    if (thread.scope === 'page' || !thread.blockId) {
        editor.querySelector('.page-top-comments')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        syncCommentViews();
        return;
    }
    if (expandAncestorsForBlock(page.blocks, thread.blockId)) { save(); render(); }
    const mark = editor.querySelector(`mark.comment-mark[data-comment-id="${CSS.escape(thread.id)}"]`);
    const targetEl = mark || editor.querySelector(`[data-block-id="${CSS.escape(thread.blockId)}"]`);
    if (!targetEl) return;
    targetEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const blockEl = targetEl.closest('.block') || targetEl;
    blockEl.classList.add('linked-block');
    setTimeout(() => blockEl.classList.remove('linked-block'), 1800);
    syncCommentViews();
}
function wireCommentComposerBox(textarea, sendBtn, onSubmit) {
    const closeMention = () => {
        const menu = $('#command-menu');
        if (menu && activeMenu === menu && menu.dataset.owner === 'comment-mention') {
            menu.hidden = true;
            menu.dataset.owner = '';
            activeMenu = null;
        }
    };
    const updateCommentMentionMenu = () => {
        const menu = $('#command-menu');
        if (!menu) return;
        const pos = textarea.selectionStart ?? textarea.value.length;
        const before = textarea.value.slice(0, pos);
        const match = before.match(/(^|[\s(])@([^@\n\r]*)$/);
        if (!match) {
            closeMention();
            return;
        }
        const query = match[2] || '';
        const matches = buildMentionUserSuggestions(query).slice(0, 8);
        if (!matches.length) {
            closeMention();
            return;
        }
        const atIdx = before.lastIndexOf('@');
        menu.className = 'command-menu';
        menu.dataset.owner = 'comment-mention';
        menu.innerHTML = '';
        matches.forEach((x, i) => {
            const r = document.createElement('button');
            r.type = 'button';
            r.setAttribute('role', 'option');
            r.setAttribute('aria-selected', String(!i));
            r.className = 'command-row' + (!i ? ' selected' : '');
            r.innerHTML = `<span class="command-icon">@</span><span class="command-copy"><span>${esc(x.label)}</span><small>${esc(x.roleLabel)}</small></span><kbd>${!i ? '↵' : ''}</kbd>`;
            r.addEventListener('mousedown', e => e.preventDefault());
            r.onclick = () => {
                const after = textarea.value.slice(pos);
                const inserted = `@${x.label} `;
                textarea.value = textarea.value.slice(0, atIdx) + inserted + after;
                const nextCaret = atIdx + inserted.length;
                textarea.focus();
                textarea.setSelectionRange(nextCaret, nextCaret);
                closeMention();
                refresh();
            };
            menu.append(r);
        });
        placeCommandMenu(menu, textarea);
        activeMenu = menu;
        menuIndex = 0;
        refreshMenuSelection();
    };
    const refresh = () => {
        autoSizeTextarea(textarea, 24);
        if (sendBtn) sendBtn.disabled = !textarea.value.trim();
    };
    textarea.addEventListener('input', () => {
        refresh();
        updateCommentMentionMenu();
    });
    textarea.addEventListener('keydown', event => {
        if (activeMenu && !activeMenu.hidden && activeMenu.dataset.owner === 'comment-mention') {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === 'Tab' || event.key === 'Escape') return;
        }
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (textarea.value.trim()) {
                closeMention();
                onSubmit(textarea.value);
            }
        }
    });
    textarea.addEventListener('blur', () => {
        setTimeout(() => {
            if (document.activeElement !== textarea) closeMention();
        }, 120);
    });
    if (sendBtn) sendBtn.onclick = () => {
        if (textarea.value.trim()) {
            closeMention();
            onSubmit(textarea.value);
        }
    };
    refresh();
}
function renderCommentThreadCard(page, thread, opts = {}) {
    const ro = !canCommentOnPage(page);
    const card = document.createElement('article');
    card.className = 'comment-card' + (thread.resolved ? ' is-resolved' : '');
    card.dataset.threadId = thread.id;

    if (opts.showContext) {
        const ctxRow = document.createElement('div');
        ctxRow.className = 'comment-card-context';
        const ctxBtn = document.createElement('button');
        ctxBtn.type = 'button';
        ctxBtn.className = 'comment-context-link';
        let label = 'Page comment';
        if (thread.scope === 'text' && thread.quote) label = `“${thread.quote}”`;
        else if (thread.blockId) {
            const blk = findBlockById(page.blocks, thread.blockId)?.item;
            label = thread.quote ? `“${thread.quote}”` : (blk?.text ? blk.text : `[${blk?.type || 'block'}]`);
        }
        ctxBtn.textContent = label;
        ctxBtn.title = label;
        ctxBtn.onclick = () => focusCommentTarget(page, thread);
        ctxRow.append(ctxBtn);
        card.append(ctxRow);
    }

    const msgList = document.createElement('div');
    msgList.className = 'comment-messages';

    thread.comments.forEach((msg, msgIndex) => {
        const row = document.createElement('div');
        row.className = 'comment-message';
        row.dataset.commentMsgId = msg.id;

        const head = document.createElement('div');
        head.className = 'comment-msg-head';

        const avatar = document.createElement('span');
        avatar.className = 'comment-avatar';
        avatar.textContent = commentUserInitials(msg.authorName);

        const author = document.createElement('span');
        author.className = 'comment-msg-author';
        author.textContent = msg.authorName || 'Jordan Davis';

        const time = document.createElement('span');
        time.className = 'comment-msg-time';
        time.textContent = formatCommentRelativeTime(msg.createdAt);

        head.append(avatar, author, time);
        if (msg.edited) {
            const ed = document.createElement('span');
            ed.className = 'comment-msg-edited';
            ed.textContent = '(edited)';
            head.append(ed);
        }

        const actions = document.createElement('div');
        actions.className = 'comment-msg-actions';
        if (!ro) {
            if (msgIndex === 0) {
                const resolveBtn = document.createElement('button');
                resolveBtn.type = 'button';
                resolveBtn.className = 'comment-icon-btn is-resolve';
                resolveBtn.dataset.commentAction = 'resolve';
                resolveBtn.setAttribute('aria-label', thread.resolved ? 'Reopen comment' : 'Resolve comment');
                resolveBtn.title = thread.resolved ? 'Reopen comment' : 'Resolve comment';
                resolveBtn.textContent = thread.resolved ? '↺ Reopen' : '✓';
                resolveBtn.onclick = () => {
                    thread.resolved = !thread.resolved;
                    thread.resolvedAt = thread.resolved ? Date.now() : undefined;
                    thread.resolvedBy = thread.resolved ? commentUserProfile().name : undefined;
                    thread.updatedAt = Date.now();
                    if (thread.resolved && opts.inPopover && commentPopoverState?.threadIds?.includes(thread.id)) {
                        const rem = commentPopoverState.threadIds.filter(x => x !== thread.id);
                        commentPopoverState = rem.length ? { ...commentPopoverState, threadIds: rem } : null;
                        if (activeCommentThreadId === thread.id) activeCommentThreadId = rem[0] || null;
                    } else if (thread.resolved && activeCommentThreadId === thread.id) {
                        activeCommentThreadId = null;
                    }
                    save();
                    syncCommentViews();
                    toast(thread.resolved ? 'Comment resolved' : 'Comment reopened');
                };
                actions.append(resolveBtn);
            }
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'comment-icon-btn';
            editBtn.dataset.commentAction = 'edit';
            editBtn.setAttribute('aria-label', 'Edit comment');
            editBtn.title = 'Edit comment';
            editBtn.textContent = '✎';
            editBtn.onclick = () => {
                editingCommentMsgId = msg.id;
                syncCommentViews();
                requestAnimationFrame(() => {
                    const inputEl = document.querySelector(`[data-comment-msg-id="${CSS.escape(msg.id)}"] .comment-edit-input`);
                    if (inputEl) { inputEl.focus(); inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length); }
                });
            };

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'comment-icon-btn';
            delBtn.dataset.commentAction = 'delete';
            delBtn.setAttribute('aria-label', msgIndex === 0 ? 'Delete thread' : 'Delete reply');
            delBtn.title = msgIndex === 0 ? 'Delete thread' : 'Delete reply';
            delBtn.textContent = '🗑';
            delBtn.onclick = () => {
                editingCommentMsgId = null;
                if (msgIndex === 0) {
                    const list = ensurePageComments(page);
                    const at = list.indexOf(thread);
                    if (at >= 0) list.splice(at, 1);
                    const unwrapped = unwrapCommentMarkInBlocks(page.blocks, thread.id);
                    if (activeCommentThreadId === thread.id) activeCommentThreadId = null;
                    if (commentPopoverState?.threadIds?.includes(thread.id)) {
                        const rem = commentPopoverState.threadIds.filter(x => x !== thread.id);
                        commentPopoverState = rem.length ? { ...commentPopoverState, threadIds: rem } : null;
                    }
                    save();
                    if (unwrapped) render();
                    else syncCommentViews();
                } else {
                    thread.comments.splice(msgIndex, 1);
                    thread.updatedAt = Date.now();
                    save();
                    syncCommentViews();
                }
            };
            actions.append(editBtn, delBtn);
        }
        if (opts.onClose && msgIndex === 0) {
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'comment-icon-btn';
            closeBtn.setAttribute('aria-label', 'Close comment popover');
            closeBtn.textContent = '×';
            closeBtn.onclick = opts.onClose;
            actions.append(closeBtn);
        }
        if (actions.childNodes.length) head.append(actions);
        row.append(head);

        if (!ro && editingCommentMsgId === msg.id) {
            const editWrap = document.createElement('div');
            editWrap.className = 'comment-edit-wrap';
            const editInput = document.createElement('textarea');
            editInput.rows = 2;
            editInput.className = 'comment-edit-input';
            editInput.value = msg.text;
            editInput.setAttribute('aria-label', 'Edit comment text');
            const editActions = document.createElement('div');
            editActions.className = 'comment-edit-actions';
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button'; cancelBtn.className = 'comment-btn-sm'; cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => { editingCommentMsgId = null; syncCommentViews(); };
            const saveBtn = document.createElement('button');
            saveBtn.type = 'button'; saveBtn.className = 'comment-btn-sm primary'; saveBtn.textContent = 'Save';
            const commitEdit = () => {
                const next = editInput.value.trim();
                if (!next) return;
                msg.text = next;
                msg.edited = true;
                msg.updatedAt = Date.now();
                thread.updatedAt = Date.now();
                editingCommentMsgId = null;
                save();
                syncCommentViews();
            };
            saveBtn.onclick = commitEdit;
            editInput.addEventListener('keydown', event => {
                if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); commitEdit(); }
                else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); editingCommentMsgId = null; syncCommentViews(); }
            });
            editActions.append(cancelBtn, saveBtn);
            editWrap.append(editInput, editActions);
            row.append(editWrap);
            requestAnimationFrame(() => autoSizeTextarea(editInput, 44));
        } else {
            const body = document.createElement('div');
            body.className = 'comment-msg-body';
            body.textContent = msg.text;
            row.append(body);
        }
        msgList.append(row);
    });
    card.append(msgList);

    if (!ro) {
        const replyBox = document.createElement('div');
        replyBox.className = 'comment-reply-box';
        const avatar = document.createElement('span');
        avatar.className = 'comment-avatar';
        avatar.textContent = commentUserInitials(commentUserProfile().name);
        const replyInput = document.createElement('textarea');
        replyInput.rows = 1;
        replyInput.className = 'comment-reply-input';
        replyInput.placeholder = 'Reply…';
        replyInput.setAttribute('aria-label', 'Reply to comment');
        const sendBtn = document.createElement('button');
        sendBtn.type = 'button';
        sendBtn.className = 'comment-send-btn';
        sendBtn.setAttribute('aria-label', 'Send reply');
        sendBtn.textContent = '↑';
        wireCommentComposerBox(replyInput, sendBtn, val => {
            replyToCommentThread(page, thread, val);
        });
        replyBox.append(avatar, replyInput, sendBtn);
        card.append(replyBox);
    }

    return card;
}
function renderTopCommentsSection(p) {
    const host = editor.querySelector('.page-top-comments');
    if (!host) return;
    host.replaceChildren();
    const perms = resolvePagePermissions(p);
    const ro = isReadOnlyMirror() || !perms.view || !perms.comment;
    const allPageComments = ensurePageComments(p).filter(t => t.scope === 'page');
    const openPageComments = allPageComments.filter(t => !t.resolved);
    const resolvedPageCount = allPageComments.length - openPageComments.length;
    host.classList.toggle('is-empty-ro', ro && !openPageComments.length);

    openPageComments.forEach(thread => host.append(renderCommentThreadCard(p, thread)));

    if (!ro) {
        const box = document.createElement('div');
        box.className = 'page-comment-composer';
        const avatar = document.createElement('span');
        avatar.className = 'comment-avatar';
        avatar.textContent = commentUserInitials(commentUserProfile().name);
        const input = document.createElement('textarea');
        input.rows = 1;
        input.className = 'comment-compose-input';
        input.placeholder = 'Add a comment…';
        input.setAttribute('aria-label', 'Add a comment at top of page');
        const send = document.createElement('button');
        send.type = 'button';
        send.className = 'comment-send-btn';
        send.setAttribute('aria-label', 'Post comment');
        send.textContent = '↑';
        wireCommentComposerBox(input, send, val => {
            createCommentThread(p, { scope: 'page', text: val });
            syncCommentViews();
        });
        box.append(avatar, input, send);
        host.append(box);
    }
    if (resolvedPageCount > 0) {
        const link = document.createElement('button');
        link.type = 'button';
        link.className = 'page-resolved-hint';
        link.textContent = `${resolvedPageCount} resolved page ${resolvedPageCount === 1 ? 'comment' : 'comments'}`;
        link.onclick = () => { commentsFilter = 'resolved'; toggleCommentsDrawer(true); };
        host.append(link);
    }
}
function syncCommentMarkClasses(p) {
    const map = new Map(ensurePageComments(p).map(t => [t.id, t]));
    editor.querySelectorAll('mark.comment-mark[data-comment-id]').forEach(mark => {
        const cid = mark.dataset.commentId || '';
        const thread = map.get(cid);
        const resolved = !thread || !!thread.resolved;
        mark.classList.toggle('is-resolved', resolved);
        mark.classList.toggle('is-active-comment', !resolved && activeCommentThreadId === cid);
    });
}
const MARGIN_MIN_WRAP_WIDTH = 910;
const MARGIN_CARD_GAP = 10;
const MARGIN_MAX_STACK_DRIFT = 220;
let lastMarginLaneKey = '';

function canUseRightCommentLane(p) {
    const wrap = $('#editor-wrap') || editor.parentElement;
    if (!wrap || !p || p.fullWidth) return false;
    return wrap.getBoundingClientRect().width >= MARGIN_MIN_WRAP_WIDTH;
}
function buildDraftCommentElement(p, draft, inMargin = false) {
    const box = document.createElement('article');
    box.className = 'comment-card margin-comment-composer-card';
    const head = document.createElement('div');
    head.className = 'comment-popover-head';
    const q = document.createElement('div');
    q.className = 'comment-popover-quote';
    q.textContent = draft.quote ? `“${draft.quote}”` : 'Comment on block';
    const close = document.createElement('button');
    close.type = 'button'; close.className = 'comment-icon-btn'; close.setAttribute('aria-label', 'Cancel comment'); close.textContent = '×';
    close.onclick = hideCommentPopover;
    head.append(q, close);

    const composer = document.createElement('div');
    composer.className = 'page-comment-composer';
    const avatar = document.createElement('span');
    avatar.className = 'comment-avatar';
    avatar.textContent = commentUserInitials(commentUserProfile().name);
    const input = document.createElement('textarea');
    input.rows = 2;
    input.className = 'comment-compose-input';
    input.placeholder = 'Add a comment…';
    input.setAttribute('aria-label', 'New comment');
    const send = document.createElement('button');
    send.type = 'button'; send.className = 'comment-send-btn'; send.setAttribute('aria-label', 'Send comment'); send.textContent = '↑';
    wireCommentComposerBox(input, send, val => {
        const created = createCommentThread(p, {
            scope: draft.scope,
            blockId: draft.blockId,
            quote: draft.quote,
            range: draft.range,
            text: val
        });
        if (created) {
            if (inMargin) commentPopoverState = null;
            else commentPopoverState = { mode: 'view', threadIds: [created.id], blockId: created.blockId, anchorRect: draft.anchorRect };
            syncCommentViews();
        } else {
            hideCommentPopover();
        }
    });
    input.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); hideCommentPopover(); }
    });
    composer.append(avatar, input, send);
    box.append(head, composer);
    return { box, input };
}
function renderCommentOverflowPills(p, groupsByBlock) {
    const stage = editor.querySelector('.block-stage');
    const host = stage?.querySelector('.comment-gutter-badges');
    if (!stage || !host) return;
    host.replaceChildren();
    if (!groupsByBlock || !groupsByBlock.size) return;
    const stageRect = stage.getBoundingClientRect();
    groupsByBlock.forEach((threads, blockId) => {
        const blockEl = editor.querySelector(`[data-block-id="${CSS.escape(blockId)}"]`);
        if (!blockEl || blockEl.offsetParent === null) return;
        const rect = blockEl.getBoundingClientRect();
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'comment-block-pill';
        pill.dataset.blockId = blockId;
        pill.style.top = `${Math.max(0, rect.top - stageRect.top + 3)}px`;
        pill.setAttribute('aria-label', `${threads.length} ${threads.length === 1 ? 'comment' : 'comments'} on block`);
        pill.title = 'View comments on this block';
        pill.textContent = `💬 ${threads.length}`;
        pill.onclick = event => {
            event.stopPropagation();
            openBlockThreadsPopover(p, blockEl, threads);
        };
        host.append(pill);
    });
}
/** Render inline/block comments stacked cleanly at the right edge; overflow/narrow views shrink to compact pills. */
function layoutRightComments(p, { focusDraft = false, repositionOnly = false } = {}) {
    const wrap = $('#editor-wrap') || editor.parentElement;
    const lane = $('#comment-margin-lane');
    const openThreads = ensurePageComments(p).filter(t => !t.resolved && (t.scope === 'block' || t.scope === 'text') && t.blockId);
    const draftActive = commentPopoverState?.mode === 'compose' && !!commentPopoverState.blockId && !isReadOnlyMirror();
    const wantLane = canUseRightCommentLane(p) && (openThreads.length > 0 || draftActive);

    wrap?.classList.toggle('has-right-comments', wantLane);
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();

    if (!wantLane) {
        if (lane) { lane.hidden = true; lane.replaceChildren(); lane.style.minHeight = ''; }
        wrap.style.minHeight = '';
        lastMarginLaneKey = '';
        const allGroups = new Map();
        openThreads.forEach(t => {
            const arr = allGroups.get(t.blockId) || [];
            arr.push(t);
            allGroups.set(t.blockId, arr);
        });
        renderCommentOverflowPills(p, allGroups);
        return;
    }

    const candidates = [];
    openThreads.forEach(thread => {
        const blockEl = editor.querySelector(`[data-block-id="${CSS.escape(thread.blockId)}"]`);
        if (!blockEl || blockEl.offsetParent === null) return;
        candidates.push({
            kind: 'thread',
            key: `t:${thread.id}`,
            blockId: thread.blockId,
            blockEl,
            thread,
            desiredTop: Math.max(24, blockEl.getBoundingClientRect().top - wrapRect.top),
            orderTs: thread.createdAt || 0
        });
    });
    if (draftActive) {
        const blockEl = editor.querySelector(`[data-block-id="${CSS.escape(commentPopoverState.blockId)}"]`);
        if (blockEl && blockEl.offsetParent !== null) {
            candidates.push({
                kind: 'draft',
                key: `d:${commentPopoverState.blockId}`,
                blockId: commentPopoverState.blockId,
                blockEl,
                draft: commentPopoverState,
                desiredTop: Math.max(24, blockEl.getBoundingClientRect().top - wrapRect.top),
                orderTs: Number.MAX_SAFE_INTEGER
            });
        }
    }
    candidates.sort((a, b) => (a.desiredTop - b.desiredTop) || (a.orderTs - b.orderTs));

    const nextKey = candidates.map(c => c.key).join('|');
    const canReuse = repositionOnly && lane && !lane.hidden && nextKey === lastMarginLaneKey;
    let draftInputToFocus = null;

    if (!canReuse && lane) {
        lane.replaceChildren();
        lane.hidden = !candidates.length;
        candidates.forEach(entry => {
            const itemWrap = document.createElement('div');
            itemWrap.className = 'margin-comment-item';
            itemWrap.dataset.marginKey = entry.key;
            if (entry.kind === 'draft') {
                const { box, input } = buildDraftCommentElement(p, entry.draft, true);
                itemWrap.append(box);
                draftInputToFocus = input;
            } else {
                const thread = entry.thread;
                itemWrap.classList.toggle('is-active-comment', activeCommentThreadId === thread.id);
                const card = renderCommentThreadCard(p, thread, { inMargin: true });
                if (thread.scope === 'text' && thread.quote) {
                    const qBar = document.createElement('div');
                    qBar.className = 'comment-popover-head';
                    const q = document.createElement('div');
                    q.className = 'comment-popover-quote';
                    q.textContent = `“${thread.quote}”`;
                    qBar.append(q);
                    card.prepend(qBar);
                }
                itemWrap.append(card);
                itemWrap.addEventListener('pointerdown', () => {
                    if (activeCommentThreadId !== thread.id) {
                        activeCommentThreadId = thread.id;
                        syncCommentMarkClasses(p);
                        lane.querySelectorAll('.margin-comment-item').forEach(node => {
                            node.classList.toggle('is-active-comment', node.dataset.marginKey === entry.key);
                        });
                    }
                });
            }
            lane.append(itemWrap);
        });
        lastMarginLaneKey = nextKey;
    }

    if (!lane || !candidates.length) {
        if (lane) { lane.hidden = true; lane.style.minHeight = ''; }
        wrap.style.minHeight = '';
        renderCommentOverflowPills(p, null);
        return;
    }

    lane.hidden = false;
    let cursorY = 0;
    const overflowByBlock = new Map();
    candidates.forEach(entry => {
        const el = lane.querySelector(`[data-margin-key="${CSS.escape(entry.key)}"]`);
        if (!el) return;
        const y = Math.max(cursorY, entry.desiredTop);
        const h = el.offsetHeight || 110;
        const drift = y - entry.desiredTop;
        if (entry.kind === 'thread' && drift > MARGIN_MAX_STACK_DRIFT) {
            el.hidden = true;
            const arr = overflowByBlock.get(entry.blockId) || [];
            arr.push(entry.thread);
            overflowByBlock.set(entry.blockId, arr);
        } else {
            el.hidden = false;
            el.style.top = `${y}px`;
            if (entry.kind === 'thread') el.classList.toggle('is-active-comment', activeCommentThreadId === entry.thread.id);
            cursorY = y + h + MARGIN_CARD_GAP;
        }
    });

    const visibleItems = Array.from(lane.children).filter(c => !c.hidden).length;
    lane.hidden = visibleItems === 0;
    lane.style.minHeight = visibleItems ? `${Math.ceil(cursorY + 24)}px` : '';
    wrap.style.minHeight = visibleItems ? `${Math.ceil(cursorY + 64)}px` : '';
    renderCommentOverflowPills(p, overflowByBlock);

    if (focusDraft && draftInputToFocus) {
        requestAnimationFrame(() => draftInputToFocus?.focus());
    }
}
function renderBlockCommentBadges(p, opts = {}) {
    layoutRightComments(p, opts);
}
function scheduleBadgeLayout() {
    cancelAnimationFrame(badgeLayoutFrame);
    badgeLayoutFrame = requestAnimationFrame(() => layoutRightComments(current(), { repositionOnly: true }));
}
function positionFloatingBox(el, anchorRect) {
    if (!el || !anchorRect) return;
    el.hidden = false;
    const margin = 12;
    const box = el.getBoundingClientRect();
    const desiredLeft = anchorRect.preferRight ? (window.innerWidth - box.width - 16) : Math.max(margin, anchorRect.left);
    const left = Math.max(margin, Math.min(window.innerWidth - box.width - 16, desiredLeft));
    let top = anchorRect.bottom + 8;
    if (top + box.height + margin > window.innerHeight && anchorRect.top - box.height - 8 >= margin) {
        top = anchorRect.top - box.height - 8;
    } else {
        top = Math.max(margin, Math.min(window.innerHeight - box.height - margin, top));
    }
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
}
function hideCommentPopover() {
    const wasCompose = commentPopoverState?.mode === 'compose';
    commentPopoverState = null;
    const pop = $('#comment-popover');
    if (pop) { pop.hidden = true; pop.replaceChildren(); }
    if (activeCommentThreadId) {
        activeCommentThreadId = null;
        syncCommentMarkClasses(current());
        $('#comment-margin-lane')?.querySelectorAll('.margin-comment-item.is-active-comment').forEach(node => node.classList.remove('is-active-comment'));
        $('#comments-drawer')?.querySelectorAll('.comment-card.is-active-comment').forEach(node => node.classList.remove('is-active-comment'));
    }
    if (wasCompose) layoutRightComments(current());
}
function renderCommentPopover() {
    const pop = $('#comment-popover');
    if (!pop) return;
    const p = current();
    if (!commentPopoverState) { pop.hidden = true; pop.replaceChildren(); return; }
    const ro = !canCommentOnPage(p);
    if (commentPopoverState.mode === 'compose') {
        if (ro || canUseRightCommentLane(p)) {
            pop.hidden = true;
            pop.replaceChildren();
            return;
        }
        pop.replaceChildren();
        const { box, input } = buildDraftCommentElement(p, commentPopoverState, false);
        pop.append(box);
        positionFloatingBox(pop, { ...commentPopoverState.anchorRect, preferRight: true });
        requestAnimationFrame(() => input.focus());
        return;
    }

    pop.replaceChildren();
    const allThreads = ensurePageComments(p);
    const ids = new Set(commentPopoverState.threadIds || []);
    const matched = allThreads.filter(t => ids.has(t.id));
    if (!matched.length) { hideCommentPopover(); return; }
    matched.forEach((thread, idx) => {
        if (thread.scope === 'text' && thread.quote && idx === 0) {
            const qBar = document.createElement('div');
            qBar.className = 'comment-popover-head';
            const q = document.createElement('div');
            q.className = 'comment-popover-quote';
            q.textContent = `“${thread.quote}”`;
            qBar.append(q);
            pop.append(qBar);
        }
        pop.append(renderCommentThreadCard(p, thread, { inPopover: true, onClose: idx === 0 ? hideCommentPopover : undefined }));
    });
    positionFloatingBox(pop, { ...commentPopoverState.anchorRect, preferRight: true });
    if (commentPopoverState.focusReply) {
        commentPopoverState.focusReply = false;
        requestAnimationFrame(() => pop.querySelector('.comment-reply-input')?.focus());
    }
}
function openCommentComposer({ scope, blockId, quote, range = null, anchorRect }) {
    if (!canCommentOnPage()) return;
    closeSelectionToolbar();
    activeCommentThreadId = null;
    commentPopoverState = { mode: 'compose', scope, blockId, quote, range, anchorRect };
    const p = current();
    layoutRightComments(p, { focusDraft: true });
    renderCommentPopover();
}
function openBlockCommentComposer(blockItem, anchorEl) {
    const el = editor.querySelector(`[data-block-id="${CSS.escape(blockItem.id)}"]`) || (anchorEl?.getBoundingClientRect ? anchorEl : null);
    const rect = el?.getBoundingClientRect ? el.getBoundingClientRect() : { left: anchorEl?.clientX || 320, top: anchorEl?.clientY || 200, right: (anchorEl?.clientX || 320) + 120, bottom: (anchorEl?.clientY || 200) + 24 };
    openCommentComposer({
        scope: 'block',
        blockId: blockItem.id,
        quote: (blockItem.text || '').trim(),
        anchorRect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
    });
}
function openThreadPopover(thread, anchorRect, focusReply = false) {
    if (!thread) return;
    closeSelectionToolbar();
    activeCommentThreadId = thread.id;
    syncCommentMarkClasses(current());
    commentPopoverState = { mode: 'view', threadIds: [thread.id], blockId: thread.blockId, anchorRect, focusReply };
    renderCommentPopover();
}
function openBlockThreadsPopover(page, blockEl, threads) {
    closeSelectionToolbar();
    const rect = blockEl.getBoundingClientRect();
    activeCommentThreadId = threads[0]?.id || null;
    syncCommentMarkClasses(page);
    commentPopoverState = {
        mode: 'view',
        threadIds: threads.map(t => t.id),
        blockId: blockEl.dataset.blockId,
        anchorRect: { left: Math.max(24, rect.right - 320), top: rect.top, right: rect.right, bottom: rect.bottom },
        focusReply: true
    };
    renderCommentPopover();
}
function triggerSelectionOrBlockComment(page, b, blockEl) {
    const selection = getSelection();
    if (selection?.rangeCount && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const quote = range.toString().trim();
        if (quote && blockEl.contains(range.startContainer) && blockEl.contains(range.endContainer)) {
            const rect = range.getBoundingClientRect();
            openCommentComposer({
                scope: 'text',
                blockId: b.id,
                quote,
                range: range.cloneRange(),
                anchorRect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
            });
            return;
        }
    }
    openBlockCommentComposer(b, blockEl);
    void page;
}
function focusTopCommentComposer() {
    const input = editor.querySelector('.page-top-comments .comment-compose-input');
    if (input) {
        input.scrollIntoView({ block: 'center', behavior: 'smooth' });
        input.focus();
    }
}
function renderCommentsDrawer() {
    const drawer = $('#comments-drawer');
    if (!drawer || drawer.hidden) return;
    const p = current();
    const perms = resolvePagePermissions(p);
    const ro = isReadOnlyMirror() || !perms.view || !perms.comment;
    const all = ensurePageComments(p);
    const openList = all.filter(t => !t.resolved);
    const resolvedList = all.filter(t => !!t.resolved);
    const shown = (commentsFilter === 'resolved' ? resolvedList : commentsFilter === 'all' ? all : openList)
        .slice()
        .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));

    drawer.replaceChildren();
    const header = document.createElement('header');
    header.className = 'comments-drawer-header';
    const title = document.createElement('h2');
    title.textContent = 'Comments';
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button'; closeBtn.className = 'icon-button'; closeBtn.setAttribute('aria-label', 'Close comments panel'); closeBtn.textContent = '×';
    closeBtn.onclick = () => toggleCommentsDrawer(false);
    header.append(title, closeBtn);

    const tabs = document.createElement('div');
    tabs.className = 'comments-drawer-tabs';
    [['open', `Open (${openList.length})`], ['resolved', `Resolved (${resolvedList.length})`], ['all', `All (${all.length})`]].forEach(([key, label]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'comments-tab-btn' + (commentsFilter === key ? ' active' : '');
        btn.textContent = label;
        btn.onclick = () => { commentsFilter = key; renderCommentsDrawer(); };
        tabs.append(btn);
    });

    const list = document.createElement('div');
    list.className = 'comments-drawer-list';
    if (!shown.length) {
        const empty = document.createElement('div');
        empty.className = 'comments-drawer-empty';
        empty.textContent = commentsFilter === 'resolved'
            ? 'No resolved comments yet.'
            : 'No open comments on this page. Select text, right-click any block, or comment at the top of the page.';
        list.append(empty);
    } else {
        shown.forEach(thread => list.append(renderCommentThreadCard(p, thread, { showContext: true })));
    }
    drawer.append(header, tabs, list);

    if (!ro) {
        const footer = document.createElement('div');
        footer.className = 'comments-drawer-composer';
        const box = document.createElement('div');
        box.className = 'page-comment-composer';
        const avatar = document.createElement('span');
        avatar.className = 'comment-avatar';
        avatar.textContent = commentUserInitials(commentUserProfile().name);
        const input = document.createElement('textarea');
        input.rows = 1;
        input.className = 'comment-compose-input';
        input.placeholder = 'Comment on page…';
        input.setAttribute('aria-label', 'Comment on page from drawer');
        const send = document.createElement('button');
        send.type = 'button'; send.className = 'comment-send-btn'; send.setAttribute('aria-label', 'Post comment'); send.textContent = '↑';
        wireCommentComposerBox(input, send, val => {
            createCommentThread(p, { scope: 'page', text: val });
            commentsFilter = 'open';
            syncCommentViews();
        });
        box.append(avatar, input, send);
        footer.append(box);
        drawer.append(footer);
    }
}
function toggleCommentsDrawer(forceOpen = null) {
    const drawer = $('#comments-drawer');
    const btn = $('[data-action="toggle-comments"]');
    if (!drawer) return;
    const nextOpen = forceOpen === null ? drawer.hidden : !!forceOpen;
    drawer.hidden = !nextOpen;
    btn?.setAttribute('aria-expanded', String(nextOpen));
    if (nextOpen) renderCommentsDrawer();
    layoutRightComments(current());
    if (commentPopoverState) renderCommentPopover();
}
function syncCommentViews() {
    const p = current();
    if (!p) return;
    const openCount = ensurePageComments(p).filter(t => !t.resolved).length;
    const countBadge = $('#topbar-comment-count');
    if (countBadge) {
        countBadge.textContent = String(openCount);
        countBadge.hidden = openCount <= 0;
    }
    syncCommentMarkClasses(p);
    renderTopCommentsSection(p);
    layoutRightComments(p);
    if (commentPopoverState) renderCommentPopover();
    if (!$('#comments-drawer')?.hidden) renderCommentsDrawer();
}
let savedEditorRange = null; // { blockId: string, range: Range }
let formatPainterStyle = null;
let formatPainterArmed = false;

function captureEditorSelection() {
    const sel = getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    const blk = activeBlockFromNode(range.startContainer);
    if (!blk || !editor.contains(blk)) return;
    const target = editableTarget(blk);
    const ctx = blockContext(blk);
    if (!target || !target.isContentEditable || !ctx) return;
    savedEditorRange = { blockId: ctx.item.id, range: range.cloneRange() };
}

function getActiveFormattingTarget(restoreSelection = true) {
    const sel = getSelection();
    if (sel?.rangeCount) {
        const range = sel.getRangeAt(0);
        const startBlock = activeBlockFromNode(range.startContainer);
        if (startBlock && editor.contains(startBlock)) {
            const target = editableTarget(startBlock);
            const ctx = blockContext(startBlock);
            if (target?.isContentEditable && ctx) {
                const endBlock = activeBlockFromNode(range.endContainer);
                return { blockEl: startBlock, endBlock, target, ctx, range, sameBlock: startBlock === endBlock, collapsed: range.collapsed };
            }
        }
    }
    if (savedEditorRange?.range && editor.contains(savedEditorRange.range.startContainer)) {
        const startBlock = activeBlockFromNode(savedEditorRange.range.startContainer);
        const target = startBlock ? editableTarget(startBlock) : null;
        const ctx = startBlock ? blockContext(startBlock) : null;
        if (target?.isContentEditable && ctx) {
            if (restoreSelection) {
                const selObj = getSelection();
                selObj?.removeAllRanges();
                selObj?.addRange(savedEditorRange.range);
            }
            const endBlock = activeBlockFromNode(savedEditorRange.range.endContainer);
            return { blockEl: startBlock, endBlock, target, ctx, range: savedEditorRange.range, sameBlock: startBlock === endBlock, collapsed: savedEditorRange.range.collapsed };
        }
    }
    const activeEl = (savedEditorRange?.blockId ? editor.querySelector(`[data-block-id="${CSS.escape(savedEditorRange.blockId)}"]`) : null)
        || editor.querySelector('.block.active-block')
        || editor.querySelector('.block-editor > .block');
    if (activeEl) {
        const target = editableTarget(activeEl);
        const ctx = blockContext(activeEl);
        if (target?.isContentEditable && ctx) {
            if (!restoreSelection) {
                return { blockEl: activeEl, endBlock: activeEl, target, ctx, range: null, sameBlock: true, collapsed: true };
            }
            setCaretAtTextOffset(target, (target.innerText || '').replace(/\u200b/g, '').length);
            const selNow = getSelection();
            const range = selNow?.rangeCount ? selNow.getRangeAt(0) : null;
            if (range) return { blockEl: activeEl, endBlock: activeEl, target, ctx, range, sameBlock: true, collapsed: range.collapsed };
        }
    }
    return null;
}

function selectRangeInEditor(range) {
    if (!range) return;
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    captureEditorSelection();
}

function unwrapMatchingNodes(root, selector) {
    root.querySelectorAll?.(selector).forEach(node => {
        const parent = node.parentNode;
        if (!parent) return;
        while (node.firstChild) parent.insertBefore(node.firstChild, node);
        node.remove();
    });
}

function closestTagOrAttrAncestor(node, stopAt, predicate) {
    let cur = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    while (cur && cur !== stopAt) {
        if (predicate(cur)) return cur;
        cur = cur.parentElement;
    }
    return null;
}

function wrapRangeWithAttrSpan(range, target, attrName, attrValue, fallbackToggleOff = false) {
    if (!range || range.collapsed) return;
    const ancestor = closestTagOrAttrAncestor(range.commonAncestorContainer, target, el => el.tagName === 'SPAN' && el.hasAttribute(attrName));
    if (ancestor && (!attrValue || attrValue === 'default' || (fallbackToggleOff && ancestor.getAttribute(attrName) === attrValue)) && ancestor.textContent === range.toString()) {
        ancestor.removeAttribute(attrName);
        if (!ancestor.attributes.length) {
            const pNode = ancestor.parentNode;
            const nr = document.createRange();
            const first = ancestor.firstChild, last = ancestor.lastChild;
            while (ancestor.firstChild) pNode.insertBefore(ancestor.firstChild, ancestor);
            ancestor.remove();
            if (first && last) {
                nr.setStartBefore(first);
                nr.setEndAfter(last);
                selectRangeInEditor(nr);
            }
            return;
        }
        return;
    }

    const frag = range.extractContents();
    frag.querySelectorAll?.(`span[${attrName}]`).forEach(sp => {
        sp.removeAttribute(attrName);
        if (!sp.attributes.length && !sp.className) {
            const p = sp.parentNode;
            while (sp.firstChild) p.insertBefore(sp.firstChild, sp);
            sp.remove();
        }
    });
    if (!attrValue || attrValue === 'default') {
        const first = frag.firstChild, last = frag.lastChild;
        range.insertNode(frag);
        if (first && last) {
            const nr = document.createRange();
            nr.setStartBefore(first);
            nr.setEndAfter(last);
            selectRangeInEditor(nr);
        }
        return;
    }
    const span = document.createElement('span');
    span.setAttribute(attrName, attrValue);
    span.append(frag);
    range.insertNode(span);
    const nr = document.createRange();
    nr.selectNodeContents(span);
    selectRangeInEditor(nr);
}

function toggleInlineTagOnRange(range, target, tagName, className = '') {
    if (!range || range.collapsed) return;
    const upperTag = tagName.toUpperCase();
    const existing = closestTagOrAttrAncestor(range.commonAncestorContainer, target, el => el.tagName === upperTag && (!className || el.classList.contains(className)));
    if (existing && existing.textContent === range.toString()) {
        const p = existing.parentNode;
        const first = existing.firstChild, last = existing.lastChild;
        while (existing.firstChild) p.insertBefore(existing.firstChild, existing);
        existing.remove();
        if (first && last) {
            const nr = document.createRange();
            nr.setStartBefore(first);
            nr.setEndAfter(last);
            selectRangeInEditor(nr);
        }
        return;
    }
    const frag = range.extractContents();
    unwrapMatchingNodes(frag, tagName + (className ? `.${className}` : ''));
    const wrapper = document.createElement(tagName);
    if (className) wrapper.className = className;
    wrapper.append(frag);
    range.insertNode(wrapper);
    const nr = document.createRange();
    nr.selectNodeContents(wrapper);
    selectRangeInEditor(nr);
}

function transformRangeTextCase(range, mode) {
    if (!range || range.collapsed) return;
    const frag = range.extractContents();
    const walker = document.createTreeWalker(frag, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    const toTitle = str => str.toLowerCase().replace(/\b([a-z\u00c0-\u024f])/g, ch => ch.toUpperCase());
    nodes.forEach(tn => {
        const s = tn.textContent || '';
        tn.textContent = mode === 'upper' ? s.toUpperCase() : mode === 'lower' ? s.toLowerCase() : mode === 'title' ? toTitle(s) : s;
    });
    const first = frag.firstChild, last = frag.lastChild;
    range.insertNode(frag);
    if (first && last) {
        const nr = document.createRange();
        nr.setStartBefore(first);
        nr.setEndAfter(last);
        selectRangeInEditor(nr);
    }
}

function commitInlineDomMutation(page) {
    syncBlocksFromEditor();
    save();
    lastStablePageState.set(page.id, snapshotForPage(page));
    refreshSelectionToolbar();
    ArchitectToolbar?.updateToolbarState?.();
}

function runSelectionFormatAction(page, blockItem, rawRange, action, value = '') {
    if (effectivePageReadOnly(page) || !rawRange) return;
    const blkEl = editor.querySelector(`[data-block-id="${CSS.escape(blockItem.id)}"]`);
    const target = blkEl ? editableTarget(blkEl) : null;
    if (!target || !target.isContentEditable) return;
    pushUndoBeforeEdit(page);
    selectRangeInEditor(rawRange);
    const sel = getSelection();
    const range = sel?.rangeCount ? sel.getRangeAt(0) : rawRange;

    if (['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'].includes(action)) {
        document.execCommand(action);
    } else if (action === 'code') {
        toggleInlineTagOnRange(range, target, 'code');
    } else if (action === 'text-color') {
        const c = BLOCK_COLORS.find(x => x.key === value);
        if (c) lastUsedColor = { kind: 'text', key: c.key, label: `${c.label} text`, textHex: c.textHex, bgHex: c.bgHex };
        wrapRangeWithAttrSpan(range, target, 'data-text-color', value || 'default', false);
    } else if (action === 'bg-color') {
        const c = BLOCK_COLORS.find(x => x.key === value);
        if (c) lastUsedColor = { kind: 'bg', key: c.key, label: `${c.label} background`, textHex: c.textHex, bgHex: c.bgHex };
        wrapRangeWithAttrSpan(range, target, 'data-bg-color', value || 'default', false);
    } else if (action === 'font') {
        wrapRangeWithAttrSpan(range, target, 'data-font', value || 'default', false);
    } else if (action === 'case') {
        if (value === 'smallcaps') wrapRangeWithAttrSpan(range, target, 'data-text-case', 'smallcaps', true);
        else transformRangeTextCase(range, value);
    } else if (action === 'link') {
        const curA = closestTagOrAttrAncestor(range.commonAncestorContainer, target, el => el.tagName === 'A');
        const entered = prompt('Enter link URL (leave empty to remove link)', curA?.getAttribute('href') || 'https://');
        if (entered === null) return;
        const cleanUrl = entered.trim();
        if (!cleanUrl) {
            if (curA) {
                const pNode = curA.parentNode;
                while (curA.firstChild) pNode.insertBefore(curA.firstChild, curA);
                curA.remove();
            }
        } else {
            const href = /^(https?:|mailto:)/i.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;
            try {
                const parsed = new URL(href);
                if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) throw new Error();
                if (range.collapsed) {
                    const a = document.createElement('a');
                    a.href = parsed.href;
                    a.rel = 'noopener noreferrer';
                    a.textContent = cleanUrl;
                    range.insertNode(a);
                } else {
                    const frag = range.extractContents();
                    unwrapMatchingNodes(frag, 'a');
                    const a = document.createElement('a');
                    a.href = parsed.href;
                    a.rel = 'noopener noreferrer';
                    a.append(frag);
                    range.insertNode(a);
                    const nr = document.createRange();
                    nr.selectNodeContents(a);
                    selectRangeInEditor(nr);
                }
            } catch {
                toast('Invalid link URL');
                return;
            }
        }
    } else if (action === 'inline-math') {
        const selected = range.toString().trim();
        const span = document.createElement('span');
        span.className = 'inline-math';
        span.contentEditable = 'false';
        const tex = selected || 'E = mc^2';
        span.setAttribute('data-tex', tex);
        if (typeof ArchitectRichRender !== 'undefined' && ArchitectRichRender.renderLatexToHtml) {
            span.innerHTML = ArchitectRichRender.renderLatexToHtml(tex, false);
        } else {
            span.textContent = tex;
        }
        if (selected) range.deleteContents();
        range.insertNode(span);
        const sp = document.createTextNode(' ');
        span.after(sp);
        commitInlineDomMutation(page);
        if (!selected) openInlineMathPopover(page, blockItem, span);
        return;
    } else if (action === 'clear') {
        document.execCommand('removeFormat');
        const frag = range.extractContents();
        unwrapMatchingNodes(frag, 'strong,b,em,i,s,del,u,code,sup,sub,a,span[data-text-color],span[data-bg-color],span[data-text-case],span[data-font],span.inline-math');
        const first = frag.firstChild, last = frag.lastChild;
        range.insertNode(frag);
        if (first && last) {
            const nr = document.createRange();
            nr.setStartBefore(first);
            nr.setEndAfter(last);
            selectRangeInEditor(nr);
        }
    }
    commitInlineDomMutation(page);
}

function getToolbarFormattingContext() {
    const info = getActiveFormattingTarget(false);
    const b = info?.ctx?.item;
    const tHex = b?.color ? (BLOCK_COLORS.find(c => c.key === b.color)?.textHex || '#111111') : '#111111';
    const bHex = b?.bgColor ? (BLOCK_COLORS.find(c => c.key === b.bgColor)?.bgHex || '#111111') : '#111111';
    const inEditor = editor.contains(document.activeElement);
    const safeCmdState = cmd => { if (!inEditor) return false; try { return !!document.queryCommandState(cmd); } catch { return false; } };
    const inCode = info?.range ? !!closestTagOrAttrAncestor(info.range.commonAncestorContainer, info.target, el => el.tagName === 'CODE') : false;
    return {
        blockType: b?.type || 'text',
        isToggle: isToggleBlock(b),
        align: b?.align || 'left',
        font: b?.font || (state.userPreferences?.defaultFont || 'default'),
        calloutType: b?.calloutType || 'default',
        bold: safeCmdState('bold'),
        italic: safeCmdState('italic'),
        underline: safeCmdState('underline'),
        strikeThrough: safeCmdState('strikeThrough'),
        superscript: safeCmdState('superscript'),
        subscript: safeCmdState('subscript'),
        inlineCode: inCode,
        textColorHex: tHex,
        bgColorHex: bHex
    };
}

function toolbarApplyInlineCommand(cmd) {
    const info = getActiveFormattingTarget();
    if (!info || info.ctx.item.type === 'code') return;
    if (info.sameBlock && !info.collapsed) {
        runSelectionFormatAction(info.ctx.page, info.ctx.item, info.range, cmd);
    } else {
        pushUndoBeforeEdit(info.ctx.page);
        document.execCommand(cmd);
        commitInlineDomMutation(info.ctx.page);
    }
}

function toolbarApplyInlineCode() {
    const info = getActiveFormattingTarget();
    if (!info || info.ctx.item.type === 'code' || !info.sameBlock || info.collapsed) return;
    runSelectionFormatAction(info.ctx.page, info.ctx.item, info.range, 'code');
}

function toolbarApplyTextCase(mode) {
    const info = getActiveFormattingTarget();
    if (!info || info.ctx.item.type === 'code') return;
    if (info.sameBlock && !info.collapsed) {
        runSelectionFormatAction(info.ctx.page, info.ctx.item, info.range, 'case', mode);
    } else if (info.target) {
        const full = document.createRange();
        full.selectNodeContents(info.target);
        runSelectionFormatAction(info.ctx.page, info.ctx.item, full, 'case', mode);
    }
}

function toolbarApplyColor(kind, key) {
    const info = getActiveFormattingTarget();
    if (!info) return;
    if (info.sameBlock && !info.collapsed && info.ctx.item.type !== 'code') {
        runSelectionFormatAction(info.ctx.page, info.ctx.item, info.range, kind === 'text' ? 'text-color' : 'bg-color', key);
    } else {
        const c = BLOCK_COLORS.find(x => x.key === key) || BLOCK_COLORS[0];
        applyBlockColorChoice(info.ctx.page, info.ctx.item, kind === 'text' ? 'text' : 'bg', c);
    }
}

function toolbarApplyFontChoice(fontKey) {
    const info = getActiveFormattingTarget();
    if (!info) return;
    if (info.sameBlock && !info.collapsed && info.ctx.item.type !== 'code') {
        runSelectionFormatAction(info.ctx.page, info.ctx.item, info.range, 'font', fontKey);
    } else {
        pushUndoBeforeEdit(info.ctx.page);
        info.ctx.item.font = !fontKey || fontKey === 'default' ? undefined : fontKey;
        save(); render(); focusBlockById(info.ctx.item.id, false);
    }
}

function toolbarSetBlockType(nextType, opts = {}) {
    const info = getActiveFormattingTarget();
    if (!info) return;
    const { ctx } = info;
    const b = ctx.item;
    pushUndoBeforeEdit(ctx.page);
    b.type = nextType;
    b.toggle = !!opts.toggle || (isHeadingType(nextType) && !!b.toggle && opts.toggle === undefined);
    if (b.toggle) { b.open = b.open ?? true; b.children = b.children?.length ? b.children : [block('text')]; }
    else if (nextType === 'todo' && typeof b.checked !== 'boolean') b.checked = false;
    if (nextType !== 'callout') b.calloutType = undefined;
    if (!isIndentableListBlock(b)) b.indent = undefined;
    save(); render(); focusBlockById(b.id, false);
}

function toolbarSetBlockAlignment(align) {
    const info = getActiveFormattingTarget();
    if (!info) return;
    const targets = selectedListTargetsInContext(info.ctx, info.target, info.blockEl)?.targets || [{ item: info.ctx.item }];
    pushUndoBeforeEdit(info.ctx.page);
    targets.forEach(t => { t.item.align = align === 'left' ? undefined : align; });
    save(); render(); focusBlockById(info.ctx.item.id, false);
}

function toolbarApplyCalloutOrQuote(variant) {
    const info = getActiveFormattingTarget();
    if (!info || !variant) return;
    const { ctx } = info;
    const b = ctx.item;
    pushUndoBeforeEdit(ctx.page);
    if (variant.kind === 'quote') {
        b.type = 'quote';
        b.toggle = false;
        b.calloutType = undefined;
        b.calloutTitle = undefined;
    } else {
        b.type = 'callout';
        b.toggle = false;
        b.calloutType = undefined;
        b.calloutTitle = undefined;
        b.icon = b.icon || variant.icon || '💡';
    }
    save(); render(); focusBlockById(b.id, false);
}

function toolbarInsertSimpleTable() {
    const info = getActiveFormattingTarget();
    if (!info) return;
    const { ctx } = info;
    pushUndoBeforeEdit(ctx.page);
    const tbl: Block = {
        id: id(),
        type: 'table',
        text: '',
        tableData: {
            headers: ['Column 1', 'Column 2', 'Column 3'],
            headerHtml: ['Column 1', 'Column 2', 'Column 3'],
            rows: [['', '', ''], ['', '', '']],
            rowHtml: [['', '', ''], ['', '', '']],
            hasHeaderRow: true,
            hasHeaderColumn: false,
            fullWidth: false
        }
    };
    if (!ctx.item.text?.trim() && ctx.item.type === 'text') ctx.list.splice(ctx.index, 1, tbl);
    else ctx.list.splice(ctx.index + 1, 0, tbl);
    save(); render();
}

function toolbarClearFormatting() {
    const info = getActiveFormattingTarget();
    if (!info) return;
    if (info.sameBlock && !info.collapsed && info.ctx.item.type !== 'code') {
        runSelectionFormatAction(info.ctx.page, info.ctx.item, info.range, 'clear');
    } else {
        pushUndoBeforeEdit(info.ctx.page);
        info.ctx.item.html = undefined;
        info.ctx.item.color = undefined;
        info.ctx.item.bgColor = undefined;
        info.ctx.item.font = undefined;
        info.ctx.item.align = undefined;
        save(); render(); focusBlockById(info.ctx.item.id, false);
    }
}

function toolbarToggleFormatPainter() {
    if (formatPainterArmed) {
        formatPainterArmed = false;
        formatPainterStyle = null;
        ArchitectToolbar?.updateToolbarState?.();
        toast('Format painter canceled');
        return;
    }
    const info = getActiveFormattingTarget();
    if (!info) return;
    const ctxState = getToolbarFormattingContext();
    formatPainterStyle = {
        bold: ctxState.bold,
        italic: ctxState.italic,
        underline: ctxState.underline,
        strikeThrough: ctxState.strikeThrough,
        color: info.ctx.item.color,
        bgColor: info.ctx.item.bgColor,
        font: info.ctx.item.font,
        align: info.ctx.item.align
    };
    formatPainterArmed = true;
    ArchitectToolbar?.updateToolbarState?.();
    toast('Style copied — click a block or select text to apply');
}

function applyArmedFormatPainter(info) {
    if (!formatPainterArmed || !formatPainterStyle || !info) return false;
    const style = formatPainterStyle;
    formatPainterArmed = false;
    formatPainterStyle = null;
    pushUndoBeforeEdit(info.ctx.page);
    if (info.sameBlock && !info.collapsed && info.ctx.item.type !== 'code') {
        selectRangeInEditor(info.range);
        if (style.bold !== !!getToolbarFormattingContext().bold) document.execCommand('bold');
        if (style.italic !== !!getToolbarFormattingContext().italic) document.execCommand('italic');
        if (style.underline !== !!getToolbarFormattingContext().underline) document.execCommand('underline');
        if (style.strikeThrough !== !!getToolbarFormattingContext().strikeThrough) document.execCommand('strikeThrough');
        if (style.color) wrapRangeWithAttrSpan(getSelection().getRangeAt(0), info.target, 'data-text-color', style.color, false);
        if (style.bgColor) wrapRangeWithAttrSpan(getSelection().getRangeAt(0), info.target, 'data-bg-color', style.bgColor, false);
        commitInlineDomMutation(info.ctx.page);
    } else {
        info.ctx.item.color = style.color;
        info.ctx.item.bgColor = style.bgColor;
        info.ctx.item.font = style.font;
        info.ctx.item.align = style.align;
        save(); render(); focusBlockById(info.ctx.item.id, false);
    }
    ArchitectToolbar?.updateToolbarState?.();
    return true;
}

function closeSelectionToolbar() {
    selToolbarState = null;
    const bar = $('#selection-toolbar');
    if (bar) { bar.hidden = true; bar.replaceChildren(); }
}
function refreshSelectionToolbar() {
    captureEditorSelection();
    ArchitectToolbar?.updateToolbarState?.();
    if (effectivePageReadOnly(current()) || (activeMenu && !activeMenu.hidden) || !$('#comment-popover')?.hidden || commentPopoverState?.mode === 'compose') {
        closeSelectionToolbar();
        return;
    }
    const selection = getSelection();
    if (!selection?.rangeCount || selection.isCollapsed) { closeSelectionToolbar(); return; }
    const range = selection.getRangeAt(0);
    const quote = range.toString().trim();
    if (!quote) { closeSelectionToolbar(); return; }
    const startBlock = activeBlockFromNode(range.startContainer);
    const endBlock = activeBlockFromNode(range.endContainer);
    if (!startBlock || !editor.contains(startBlock)) { closeSelectionToolbar(); return; }
    if (startBlock.contains(document.activeElement) === false && !editor.contains(document.activeElement)) { closeSelectionToolbar(); return; }
    const scEl = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
    if (scEl?.closest('.callout-title-chip, .simple-table')) { closeSelectionToolbar(); return; }
    const target = editableTarget(startBlock);
    if (!target || !target.isContentEditable) { closeSelectionToolbar(); return; }
    const ctx = blockContext(startBlock);
    if (!ctx) { closeSelectionToolbar(); return; }
    const sameBlock = startBlock === endBlock;
    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) { closeSelectionToolbar(); return; }

    selToolbarState = {
        blockId: ctx.item.id,
        range: range.cloneRange(),
        quote,
        isCode: ctx.item.type === 'code'
    };

    const bar = $('#selection-toolbar');
    bar.replaceChildren();
    const keepSel = e => e.preventDefault();

    if (canCommentOnPage(ctx.page)) {
        const commentBtn = document.createElement('button');
        commentBtn.type = 'button';
        commentBtn.dataset.selAction = 'comment';
        commentBtn.title = 'Comment (Ctrl+Shift+M)';
        commentBtn.innerHTML = '<span>💬</span><span>Comment</span>';
        commentBtn.onmousedown = keepSel;
        commentBtn.onclick = () => {
            if (!selToolbarState) return;
            const { blockId, quote: qText, range: savedRange } = selToolbarState;
            const rRect = savedRange.getBoundingClientRect();
            const boxRect = (rRect.width || rRect.height) ? rRect : { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
            openCommentComposer({
                scope: (sameBlock && !selToolbarState.isCode) ? 'text' : 'block',
                blockId,
                quote: qText,
                range: sameBlock ? savedRange : null,
                anchorRect: { left: boxRect.left, top: boxRect.top, right: boxRect.right, bottom: boxRect.bottom }
            });
        };
        bar.append(commentBtn);
    }

    if (sameBlock && !selToolbarState.isCode) {
        if (canCommentOnPage(ctx.page)) {
            const sep = document.createElement('span'); sep.className = 'sel-divider';
            bar.append(sep);
        }

        const safeState = cmd => { try { return !!document.queryCommandState(cmd); } catch { return false; } };
        const addBtn = (glyph, actionKey, label, isActive, onClick) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.selAction = actionKey;
            btn.setAttribute('aria-label', label);
            btn.setAttribute('aria-pressed', String(!!isActive));
            btn.title = label;
            if (isActive) btn.classList.add('is-active');
            btn.innerHTML = glyph;
            btn.onmousedown = keepSel;
            btn.onclick = onClick;
            bar.append(btn);
            return btn;
        };

        [['<strong>B</strong>', 'bold', 'Bold (Ctrl+B)'],
         ['<em>I</em>', 'italic', 'Italic (Ctrl+I)'],
         ['<u>U</u>', 'underline', 'Underline (Ctrl+U)'],
         ['<s>S</s>', 'strikeThrough', 'Strikethrough']].forEach(([glyph, cmd, label]) => {
            addBtn(glyph, cmd, label, safeState(cmd), () => {
                runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, cmd);
            });
        });

        const inCode = !!closestTagOrAttrAncestor(range.commonAncestorContainer, target, el => el.tagName === 'CODE');
        addBtn('&lt;/&gt;', 'code', 'Inline code', inCode, () => runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, 'code'));
        addBtn('x²', 'superscript', 'Superscript', safeState('superscript'), () => runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, 'superscript'));
        addBtn('x₂', 'subscript', 'Subscript', safeState('subscript'), () => runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, 'subscript'));
        addBtn('🔗', 'link', 'Link', !!closestTagOrAttrAncestor(range.commonAncestorContainer, target, el => el.tagName === 'A'), () => runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, 'link'));
        addBtn('∑', 'inline-math', 'Inline math', false, () => runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, 'inline-math'));

        const sep2 = document.createElement('span'); sep2.className = 'sel-divider';
        bar.append(sep2);

        // Caps / Case submenu button
        const caseWrap = document.createElement('div');
        caseWrap.className = 'sel-dd-wrap';
        const caseBtn = addBtn('AA ▾', 'case-menu', 'Text case (Caps)', false, () => {
            const wasHidden = casePop.hidden;
            colorPop.hidden = true;
            casePop.hidden = !wasHidden;
        });
        const casePop = document.createElement('div');
        casePop.className = 'sel-subpopover';
        casePop.hidden = true;
        [['UPPERCASE', 'upper'], ['lowercase', 'lower'], ['Title Case', 'title'], ['Small Caps', 'smallcaps']].forEach(([lbl, md]) => {
            const row = document.createElement('button');
            row.type = 'button';
            row.className = 'sel-sub-row';
            row.dataset.selCase = md;
            row.textContent = lbl;
            row.onmousedown = keepSel;
            row.onclick = () => {
                casePop.hidden = true;
                runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, 'case', md);
            };
            casePop.append(row);
        });
        caseWrap.append(caseBtn, casePop);
        bar.append(caseWrap);

        // Colors & Highlights submenu button (all existing BLOCK_COLORS)
        const colorWrap = document.createElement('div');
        colorWrap.className = 'sel-dd-wrap';
        const colorBtn = addBtn('<span class="sel-color-a">A</span> ▾', 'colors', 'Text & Highlight color', false, () => {
            const wasHidden = colorPop.hidden;
            casePop.hidden = true;
            colorPop.hidden = !wasHidden;
        });
        const colorPop = document.createElement('div');
        colorPop.className = 'sel-color-popover';
        colorPop.id = 'sel-color-popover';
        colorPop.hidden = true;
        if (lastUsedColor) {
            const recent = BLOCK_COLORS.find(c => c.key === lastUsedColor.key);
            if (recent) {
                const lh = document.createElement('div'); lh.className = 'sel-color-group-label'; lh.textContent = 'Last used';
                const lb = document.createElement('button');
                lb.type = 'button'; lb.className = 'sel-sub-row';
                lb.innerHTML = `${colorSwatchIcon(lastUsedColor.kind, recent)}<span>${esc(lastUsedColor.label)}</span>`;
                lb.onmousedown = keepSel;
                lb.onclick = () => { colorPop.hidden = true; runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, lastUsedColor.kind === 'text' ? 'text-color' : 'bg-color', recent.key); };
                colorPop.append(lh, lb);
            }
        }
        [['Text color', 'text'], ['Highlight color', 'bg']].forEach(([grpLabel, kind]) => {
            const h = document.createElement('div'); h.className = 'sel-color-group-label'; h.textContent = grpLabel;
            const grid = document.createElement('div'); grid.className = 'sel-color-grid';
            BLOCK_COLORS.forEach(c => {
                const sw = document.createElement('button');
                sw.type = 'button';
                sw.className = 'sel-color-swatch';
                sw.dataset.selColorKind = kind;
                sw.dataset.selColorKey = c.key;
                sw.title = `${c.label} ${kind === 'text' ? 'text' : 'highlight'}`;
                sw.innerHTML = colorSwatchIcon(kind, c);
                sw.onmousedown = keepSel;
                sw.onclick = () => {
                    colorPop.hidden = true;
                    runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, kind === 'text' ? 'text-color' : 'bg-color', c.key);
                };
                grid.append(sw);
            });
            colorPop.append(h, grid);
        });
        colorWrap.append(colorBtn, colorPop);
        bar.append(colorWrap);

        addBtn('⌫', 'clear', 'Clear formatting', false, () => runSelectionFormatAction(ctx.page, ctx.item, selToolbarState.range, 'clear'));
    }

    bar.hidden = false;
    const box = bar.getBoundingClientRect();
    const margin = 8;
    const left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, rect.left + (rect.width - box.width) / 2));
    const top = rect.top - box.height - 8 >= margin ? rect.top - box.height - 8 : Math.min(window.innerHeight - box.height - margin, rect.bottom + 8);
    bar.style.left = `${left}px`;
    bar.style.top = `${top}px`;
}
document.addEventListener('selectionchange', () => requestAnimationFrame(refreshSelectionToolbar));
document.addEventListener('keydown', showMenuKeyboard, true);
document.addEventListener('pointerdown', event => {
    const sub = $('#command-submenu');
    if (activeMenu && !activeMenu.hidden && !activeMenu.contains(event.target) && (!sub || sub.hidden || !sub.contains(event.target)) && !event.target.closest?.('.workspace-access-item')) closeMenu();
    const pop = $('#comment-popover');
    const inCommentUi = event.target.closest?.('#comment-popover,.margin-comment-composer-card,.margin-comment-item,.comment-mark,.comment-block-pill,#selection-toolbar,.page-top-comments .comment-card,#comments-drawer')
        || ($('#command-menu')?.dataset?.owner === 'comment-mention' && $('#command-menu')?.contains(event.target));
    if (((pop && !pop.hidden) || commentPopoverState || activeCommentThreadId) && !inCommentUi) {
        hideCommentPopover();
    }
}, true);
editor.addEventListener('contextmenu', event => {
    const pg = current();
    if (effectivePageReadOnly(pg) && !canCommentOnPage(pg)) return;
    const rawTarget = event.target instanceof Element ? event.target : null;
    if (!rawTarget || rawTarget.closest('.callout-title-chip, .simple-table, .db-interactive-surface, dialog')) return;
    const blockEl = resolveHoveredBlock(rawTarget, event.clientX, event.clientY);
    if (!blockEl) return;
    const ctx = blockContext(blockEl);
    if (!ctx) return;
    const selection = getSelection();
    let selContext = null;
    if (selection?.rangeCount && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const quote = range.toString().trim();
        if (quote && blockEl.contains(range.startContainer) && blockEl.contains(range.endContainer)) {
            const rect = range.getBoundingClientRect();
            selContext = { range: range.cloneRange(), quote, anchorRect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom } };
        }
    }
    event.preventDefault();
    event.stopPropagation();
    closeSelectionToolbar();
    showBlockMenu(ctx.page, ctx.item, { clientX: event.clientX, clientY: event.clientY }, selContext);
});
editor.addEventListener('input', onEditorInput);
editor.addEventListener('beforeinput', handleBlockRangeDeletion);
editor.addEventListener('paste', handleMarkdownPaste);
editor.addEventListener('click', event => {
    const rawTarget = event.target instanceof Element ? event.target : null;
    const pageMention = rawTarget?.closest?.('.inline-mention-chip[data-mention-kind="page"]') as HTMLElement | null;
    if (pageMention) {
        const pid = pageMention.dataset.mentionId;
        if (pid && state.pages.some(pg => pg.id === pid && resolvePagePermissions(pg).view)) {
            event.preventDefault();
            event.stopPropagation();
            if (event.ctrlKey || event.metaKey) openPageInNewTab(pid);
            else navigateToPage(pid);
            return;
        }
    }
    const inlineMathEl = rawTarget?.closest?.('span.inline-math') as HTMLElement | null;
    if (inlineMathEl && !effectivePageReadOnly(current())) {
        const mathBlk = resolveHoveredBlock(inlineMathEl, event.clientX, event.clientY);
        const mCtx = mathBlk ? blockContext(mathBlk) : null;
        if (mCtx) {
            event.preventDefault();
            event.stopPropagation();
            openInlineMathPopover(mCtx.page, mCtx.item, inlineMathEl);
            return;
        }
    }
    const markEl = rawTarget?.closest?.('mark.comment-mark[data-comment-id]');
    if (markEl && !markEl.classList.contains('is-resolved')) {
        const cid = markEl.dataset.commentId;
        const thread = ensurePageComments(current()).find(t => t.id === cid && !t.resolved);
        if (thread) {
            const laneCard = $(`#comment-margin-lane .margin-comment-item[data-margin-key="t:${CSS.escape(cid)}"]:not([hidden])`);
            if (laneCard) {
                activeCommentThreadId = thread.id;
                syncCommentMarkClasses(current());
                $('#comment-margin-lane')?.querySelectorAll('.margin-comment-item').forEach(node => {
                    node.classList.toggle('is-active-comment', node === laneCard);
                });
                laneCard.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                const rect = markEl.getBoundingClientRect();
                openThreadPopover(thread, { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }, false);
            }
        }
    }
    const blockEl = rawTarget?.closest('.block') ? resolveHoveredBlock(rawTarget, event.clientX, event.clientY) : null;
    setActiveEditorBlock(blockEl);
    if (!blockEl || rawTarget?.closest('input, button, select, textarea, a, .callout-title-chip, .simple-table-shell, .simple-table, .db-interactive-surface, .inline-mention-chip, .inline-math, .code-meta, .code-body, .block-button-card, .embed-viewer-card, .bookmark-card, .equation-block, .link-block-composer')) return;
    if (formatPainterArmed) {
        const info = getActiveFormattingTarget();
        if (info) { applyArmedFormatPainter(info); return; }
    }
    if (!getSelection()?.isCollapsed) return;
    const target = editableTarget(blockEl);
    if (target?.isContentEditable && !target.contains(getSelection()?.focusNode)) setCaretAtTextOffset(target, 0);
});
editor.addEventListener('keyup', () => setActiveEditorBlock(activeBlockFromSelection()));
editor.addEventListener('focusout', event => { if (!editor.contains(event.relatedTarget)) setActiveEditorBlock(null); });
let searchMatches = [];
let searchIndex = 0;
function openSearch() { if (activeMenu) activeMenu.hidden = true; activeMenu = null; const dialog = $('#search-dialog'); if (dialog.open) { $('#search-input').focus(); return; } $('#search-input').value = ''; updateSearchResults(''); dialog.showModal(); $('#search-input').focus(); }
function updateSearchResults(query) { const q = query.trim().toLowerCase(), out = $('#search-results');
    const rawAssets = readAssets();
    const assetMatches = q ? ArchitectBackend.queryAssets(rawAssets, { query: q }).slice(0, 6).map(asset => ({
        kind: 'asset',
        asset,
        score: asset.name.toLowerCase().includes(q) ? 3 : 1
    })) : [];
    const pageMatches = state.pages.filter(page => resolvePagePermissions(page).view).map(page => {
        const title = page.title.toLowerCase();
        const desc = (page.description || '').toLowerCase();
        const contentBlock = page.blocks.find(item => item.text?.toLowerCase().includes(q));
        const commentHit = (page.comments || []).some(t => t.comments.some(m => m.text.toLowerCase().includes(q)));
        const score = !q ? 0 : title === q ? 4 : title.startsWith(q) ? 3 : title.includes(q) ? 2 : (contentBlock || desc.includes(q) || commentHit) ? 1 : -1;
        return { kind: 'page', page, score, preview: contentBlock?.text || page.description || '' };
    }).filter(result => result.score >= 0).sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title));
    searchMatches = [...pageMatches, ...assetMatches];
    searchIndex = 0;
    out.replaceChildren();
    if (!searchMatches.length) {
        const empty = document.createElement('div');
        empty.className = 'search-empty';
        empty.textContent = q ? 'No pages or assets found. Try another query or check the Asset library.' : 'No pages yet. Create one with the New hub button.';
        out.append(empty);
        $('#search-input').setAttribute('aria-expanded', 'false');
        return;
    }
    searchMatches.forEach((entry, index) => {
        const row = document.createElement('button');
        row.type = 'button'; row.id = `search-result-${index}`;
        row.className = 'search-result' + (index === searchIndex ? ' selected' : '');
        row.setAttribute('role', 'option'); row.setAttribute('aria-selected', String(index === searchIndex));
        if (entry.kind === 'asset') {
            const a = entry.asset;
            const iconText = (a.category === 'music' || a.category === 'sfx') ? '🎵' : a.category === 'video' ? '▶' : a.category === '3d model' ? '◇' : '▧';
            row.innerHTML = `<span class="search-result-icon">${iconText}</span><span class="search-result-copy"><strong>${esc(a.name)}</strong><small>${esc([a.category, a.creator, ...(a.tags || [])].filter(Boolean).join(' · '))}</small></span><span class="search-result-badge">${esc(a.category)}</span>`;
        } else {
            const { page, preview } = entry;
            const icon = document.createElement('span'); icon.className = 'search-result-icon'; icon.innerHTML = pageIconMarkup(page.icon);
            const copy = document.createElement('span'); copy.className = 'search-result-copy';
            const title = document.createElement('strong'); title.textContent = page.title || 'Untitled';
            const parentDb = page.databaseId ? state.pages.find(x => x.id === page.databaseId) : null;
            const kindHint = page.pageKind === 'board' ? 'Board' : page.pageKind === 'database' ? 'Database' : parentDb ? `In ${parentDb.title || 'Database'}` : 'Page';
            const description = document.createElement('small'); description.textContent = preview ? preview.replace(/\s+/g, ' ').trim() : kindHint;
            copy.append(title, description); row.append(icon, copy);
        }
        row.onclick = event => openSearchResult(index, event);
        out.append(row);
    });
    $('#search-input').setAttribute('aria-expanded', 'true');
    $('#search-input').setAttribute('aria-activedescendant', `search-result-${searchIndex}`);
}
function moveSearchSelection(delta) { if (!searchMatches.length) return; searchIndex = (searchIndex + delta + searchMatches.length) % searchMatches.length; $('#search-results').querySelectorAll('.search-result').forEach((row, index) => { row.classList.toggle('selected', index === searchIndex); row.setAttribute('aria-selected', String(index === searchIndex)); }); $('#search-input').setAttribute('aria-activedescendant', `search-result-${searchIndex}`); $('#search-result-' + searchIndex)?.scrollIntoView({ block: 'nearest' }); }
function openSearchResult(index, event = null) {
    const result = searchMatches[index];
    if (!result) return;
    $('#search-dialog').close();
    if (result.kind === 'asset') {
        openAssetLibrary(result.asset.id);
        return;
    }
    if (event?.ctrlKey || event?.metaKey) openPageInNewTab(result.page.id);
    else navigateToPage(result.page.id);
}
const SIDEBAR_COLLAPSED_KEY = 'architect-sidebar-collapsed-v1';
function setSidebarCollapsed(force?: boolean) {
    const next = typeof force === 'boolean' ? force : !document.body.classList.contains('sidebar-collapsed');
    document.body.classList.toggle('sidebar-collapsed', next);
    const btn = $('#sidebar-collapse-handle');
    if (btn) {
        btn.textContent = next ? '›' : '‹';
        btn.setAttribute('aria-expanded', String(!next));
        btn.setAttribute('aria-label', next ? 'Expand sidebar' : 'Minimize sidebar');
        btn.title = next ? 'Expand sidebar (Ctrl+\\)' : 'Minimize sidebar (Ctrl+\\)';
    }
    try { localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0'); } catch {}
    requestAnimationFrame(() => {
        const page = current(), cover = document.querySelector('.page-cover');
        if (cover && page && pageHasCover(page)) applyCoverBackground(cover, page);
        if (page) layoutRightComments(page);
    });
}
try {
    if (localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1') setSidebarCollapsed(true);
} catch {}

function wireAllModalDialogs() {
    document.querySelectorAll('[data-close-dialog]').forEach(btn => {
        btn.addEventListener('click', () => {
            const dlg = btn.closest('dialog') as HTMLDialogElement | null;
            dlg?.close('cancel');
        });
    });

    let backdropDownDialog: HTMLDialogElement | null = null;
    const isBackdropEvent = (dlg: HTMLDialogElement, e: MouseEvent) => {
        if (e.target !== dlg) return false;
        const r = dlg.getBoundingClientRect();
        if (!r.width || !r.height) return true;
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    document.querySelectorAll('dialog').forEach(node => {
        const dlg = node as HTMLDialogElement;
        dlg.addEventListener('pointerdown', e => {
            backdropDownDialog = isBackdropEvent(dlg, e) ? dlg : null;
        });
        dlg.addEventListener('click', e => {
            if (backdropDownDialog === dlg && isBackdropEvent(dlg, e)) {
                backdropDownDialog = null;
                dlg.close('dismiss');
                return;
            }
            backdropDownDialog = null;
        });
        dlg.addEventListener('keydown', e => {
            if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
            const target = e.target as HTMLElement | null;
            if (!target) return;
            if (target.closest('textarea, select, a[href], summary, label.file-select, [data-close-dialog]')) return;

            if (dlg.id === 'cover-dialog') {
                if (target.closest('[data-action="remove-cover"]')) return;
                e.preventDefault();
                applyCoverFromPicker();
                return;
            }
            if (dlg.id === 'create-workspace-dialog') {
                e.preventDefault();
                ($('#confirm-create-workspace') as HTMLElement | null)?.click();
                return;
            }
            if (dlg.id === 'settings-dialog') {
                if (target.closest('#settings-sync-now, #export-workspace, #export-pre-reset-backup, #choose-sync-folder, #choose-asset-cache-folder, #sync-pull-now, #sync-push-now, #apply-workspace-import')) return;
                e.preventDefault();
                const nameInput = $('#settings-workspace-name') as HTMLInputElement | null;
                const trimmed = nameInput?.value.trim() || '';
                if (nameInput && !trimmed) {
                    $('#settings-feedback').textContent = 'Enter a workspace name first.';
                    nameInput.focus();
                    return;
                }
                if (trimmed && trimmed !== state.workspaceName) {
                    state.workspaceName = trimmed;
                    save(); syncActiveWorkspaceInIndex(); renderNav();
                    const firstCrumb = $('#breadcrumbs')?.firstElementChild;
                    if (firstCrumb) firstCrumb.textContent = trimmed;
                }
                persistSettingsChange();
                save(true);
                dlg.close('save');
                toast('Workspace settings saved');
                return;
            }
            if (dlg.id === 'user-settings-dialog') {
                if (target.closest('#user-settings-search, #hotkeys-filter-input, #hotkeys-reset-btn, [data-settings-tab], [data-hotkey-filter], .hotkey-assign-btn, .hotkey-clear-btn, #user-files-browse-local, #user-files-browse-drive, #user-files-local-path, #user-files-drive-path, #user-files-server-url, #user-toolbar-reset, #user-toolbar-add-sep, .user-font-remove, .tb-cust-remove, .tb-cust-add')) return;
                e.preventDefault();
                const nameInput = $('#user-display-name-input') as HTMLInputElement | null;
                const trimmed = nameInput?.value.trim() || '';
                const actor = getCurrentActorUser();
                const curName = actor?.name || state.users?.[0]?.name || '';
                if (trimmed && trimmed !== curName) {
                    state.users = state.users || [];
                    const targetUser = (actor && state.users.find(u => u.id === actor.id)) || state.users[0];
                    if (targetUser) {
                        targetUser.name = trimmed;
                        targetUser.linkedAccount = trimmed;
                    } else {
                        state.users.push({ id: 'user.local', name: trimmed, linkedAccount: trimmed, roleId: 'role-admin', roleIds: ['role-admin'] });
                    }
                    setLoggedInAccountName(trimmed);
                    syncUserProfileUi();
                }
                save(true);
                dlg.close('save');
                toast('User settings saved');
                return;
            }
            if (dlg.id === 'icon-dialog') {
                if (target.closest('.emoji-option, .vector-icon-option, .cover-asset, .icon-tab-btn, #icon-random-btn, #icon-color-trigger, .icon-color-swatch-btn, [data-action="remove-icon"]')) return;
                e.preventDefault();
                const q = ($('#icon-search') as HTMLInputElement | null)?.value.trim();
                const firstChoice = q ? (dlg.querySelector('.icon-tab-pane:not([hidden]) .vector-icon-option, .icon-tab-pane:not([hidden]) .emoji-option, .icon-tab-pane:not([hidden]) .cover-asset') as HTMLElement | null) : null;
                if (firstChoice) firstChoice.click();
                else dlg.close('save');
                return;
            }
            if (dlg.id === 'assets-dialog') {
                if (target.closest('button')) return;
                const driveForm = $('#drive-ref-form');
                if (driveForm && !driveForm.hidden && driveForm.contains(target)) return;
                e.preventDefault();
                if (target.closest('#assets-inspector input')) {
                    target.dispatchEvent(new Event('change', { bubbles: true }));
                }
                if (libraryTargetContext) {
                    const insertBtn = dlg.querySelector('#assets-inspector .share-button') as HTMLElement | null;
                    if (insertBtn) { insertBtn.click(); return; }
                }
                dlg.close('save');
            }
        });
    });
}
wireAllModalDialogs();

document.addEventListener('click', e => {
    const modeBtn = e.target.closest('button[data-app-mode]') as HTMLElement | null;
    if (modeBtn) {
        const mode = modeBtn.dataset.appMode as 'notion' | 'dashboard' | 'inbox';
        if (mode) setAppMode(mode);
        return;
    }
    const dashSubBtn = e.target.closest('button[data-dashboard-submode]') as HTMLElement | null;
    if (dashSubBtn) {
        const subMode = dashSubBtn.dataset.dashboardSubmode as DashboardSubMode;
        if (subMode) setDashboardSubMode(subMode);
        return;
    }
    const a = e.target.closest('[data-action]')?.dataset.action;
    if (a === 'dashboard') { setAppMode('dashboard'); return; }
    if (a === 'updates') { if (currentAppMode === 'notion') toggleDocsNotificationsPopover(); else setDashboardSubMode('notifications'); return; }
    if (a === 'search') { openSearch(); return; }
    if (a === 'asset-library') { openAssetLibrary(); return; }
    if (a === 'sync-now') { synchronizeNow(); return; }
    if (a === 'trash') {
        const dd = state.dashboardData;
        if (dd && purgeExpiredCompletedTasks(dd) > 0) save();
        const doneTasks = (dd?.tasks || []).filter(t => t.done);
        if (doneTasks.length) {
            taskFilter = 'completed';
            setDashboardSubMode('scratchpad');
            toast(`Trash — ${doneTasks.length} completed task${doneTasks.length === 1 ? '' : 's'} (auto-clears after 72h)`);
        } else {
            toast('Trash is empty');
        }
        return;
    }
    if (a === 'new-page') {
        if (isReadOnlyMirror()) { toast('View-only mirror: editing is disabled'); return; }
        if (!userHasGlobalPerm('createPages')) { toast('Your roles do not allow creating pages'); return; }
        const p = createPage(undefined);
        navigateToPage(p.id);
        return;
    }
    if (a === 'toggle-sidebar') $('#sidebar').classList.toggle('open');
    if (a === 'minimize-sidebar') setSidebarCollapsed();
    if (a === 'share') { openSharePublishPopover(current(), e.target.closest('[data-action="share"]')); return; }
});
$('#search-input').addEventListener('input', e => updateSearchResults(e.target.value));
$('#search-input').addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); moveSearchSelection(1); } else if (e.key === 'ArrowUp') { e.preventDefault(); moveSearchSelection(-1); } else if (e.key === 'Enter' && searchMatches.length) { e.preventDefault(); openSearchResult(searchIndex, e); } });
document.addEventListener('keydown', e => {
    if (typeof ArchitectToolbar !== 'undefined' && ArchitectToolbar.isRecordingHotkey?.()) return;
    if (typeof ArchitectToolbar !== 'undefined' && ArchitectToolbar.matchHotkeyAction) {
        const hk = ArchitectToolbar.matchHotkeyAction(e);
        if (hk) {
            e.preventDefault();
            switch (hk) {
                case 'quick-search': openSearch(); return;
                case 'new-page': {
                    if (isReadOnlyMirror() || !userHasGlobalPerm('createPages')) { toast('Creating pages is disabled for your role'); return; }
                    const pg = createPage(undefined); navigateToPage(pg.id); return;
                }
                case 'new-board': {
                    if (isReadOnlyMirror() || !userHasGlobalPerm('createPages')) { toast('Creating boards is disabled for your role'); return; }
                    const bd = ArchitectBoard.createBoardPage(undefined, 'Untitled board'); navigateToPage(bd.id); return;
                }
                case 'new-database': {
                    if (isReadOnlyMirror() || !userHasGlobalPerm('createPages')) { toast('Creating databases is disabled for your role'); return; }
                    const db = ArchitectDatabase.createDatabasePage(undefined, 'Untitled database'); save(); navigateToPage(db.id); return;
                }
                case 'new-tab': createNewBlankTab(); return;
                case 'toggle-sidebar': setSidebarCollapsed(); return;
                case 'toggle-fullscreen': ArchitectToolbar.toggleFullscreen(); return;
                case 'add-comment': {
                    if (!canCommentOnPage()) { toast('Commenting is disabled on this page'); return; }
                    const info = getActiveFormattingTarget();
                    if (info) triggerSelectionOrBlockComment(info.ctx.page, info.ctx.item, info.blockEl);
                    else focusTopCommentComposer();
                    return;
                }
                case 'mode-notion': setAppMode('notion'); return;
                case 'mode-dashboard': setAppMode('dashboard'); return;
                case 'mode-inbox': setDashboardSubMode('notifications'); return;
                case 'open-assets': openAssetLibrary(); return;
                case 'user-settings': ArchitectToolbar.openUserSettings(); return;
            }
        }
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); openSearch(); }
    if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); navigateHistory(-1); }
    if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); navigateHistory(1); }
    if (e.key === 'Escape' && $('#search-dialog').open) $('#search-dialog').close();
});
document.addEventListener('click', e => { const action = e.target.closest('[data-action]')?.dataset.action; if (action === 'settings') openWorkspaceSettings(); if (action === 'user-settings') ArchitectToolbar.openUserSettings(); if (action === 'import') openWorkspaceSettings(); });
document.addEventListener('click', e => { if (e.target.closest('[data-action="remove-icon"]')) choosePageIcon(iconTargetCallback ? '' : (iconTargetBlock ? '💡' : '📄')); });
document.addEventListener('click', e => { const action = e.target.closest('[data-action]')?.dataset.action, menu = $('#page-options-menu'), trigger = $('[data-action="page-options"]'); if (action === 'page-options') { updatePageOptions(); menu.hidden = !menu.hidden; trigger.setAttribute('aria-expanded', String(!menu.hidden)); return; } if (!e.target.closest('#page-options-menu')) { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); } if (action === 'toggle-comments') { toggleCommentsDrawer(); return; } if (action === 'history-back') navigateHistory(-1); if (action === 'history-forward') navigateHistory(1); if (action === 'toggle-width') { current().fullWidth = !current().fullWidth; save(); render(); menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); } if (action === 'toggle-word-count') { current().showWordCount = !current().showWordCount; save(); render(); menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); } if (action === 'toggle-publish') { togglePagePublish(current()); menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); return; } if (action === 'version-history') { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); openVersionHistoryModal(current()); return; } if (action === 'page-analytics') { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); openPageAnalyticsModal(current()); return; } if (action === 'apply-cover') applyCoverFromPicker(); if (action === 'remove-cover') { const page = coverTargetPage; if (page) { page.cover = undefined; page.coverAssetId = undefined; page.coverX = page.coverY = undefined; page.coverZoom = undefined; page.coverAspect = undefined; save(true); render(); $('#cover-dialog').close(); } } });
$('#confirm-create-workspace')?.addEventListener('click', () => {
    const dlg = $('#create-workspace-dialog') as HTMLDialogElement | null;
    const input = $('#new-workspace-name-input') as HTMLInputElement | null;
    const name = input?.value.trim() || '';
    if (!name) {
        toast('Enter a workspace name first');
        input?.focus();
        return;
    }
    dlg?.close('create');
    createAndSwitchWorkspace(name);
});
$('#ws-settings-tabs')?.addEventListener('click', e => {
    const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-ws-tab]');
    const tab = btn?.dataset?.wsTab;
    if (tab === 'general' || tab === 'customization' || tab === 'plugins') setWorkspaceSettingsTab(tab);
});
$('#save-workspace-name').addEventListener('click', () => { const name = $('#settings-workspace-name').value.trim(); if (!name) { $('#settings-feedback').textContent = 'Enter a workspace name first.'; $('#settings-workspace-name').focus(); return; } state.workspaceName = name; save(); syncActiveWorkspaceInIndex(); renderNav(); renderBreadcrumbs(current()); $('#settings-feedback').textContent = 'Workspace name saved.'; toast('Workspace name updated'); });
$('#settings-sync-now')?.addEventListener('click', () => synchronizeNow());
$('#export-workspace').addEventListener('click', exportWorkspaceBackup);
$('#export-pre-reset-backup').addEventListener('click', exportPreviousWorkspaceBackup);
$('#import-workspace-file').addEventListener('change', async e => { const file = e.target.files?.[0]; if (!file) return; try { pendingWorkspaceImport = decodeWorkspaceBackup(JSON.parse(await file.text())); $('#settings-feedback').textContent = `Ready to restore “${pendingWorkspaceImport.workspace.workspaceName}” with ${pendingWorkspaceImport.workspace.pages.length} pages and ${pendingWorkspaceImport.assets.length} assets. Restoring replaces the current local workspace.`; $('#apply-workspace-import').disabled = false; } catch (error) { pendingWorkspaceImport = null; $('#apply-workspace-import').disabled = true; $('#settings-feedback').textContent = error.message || 'Could not read this backup file.'; } });
$('#apply-workspace-import').addEventListener('click', restoreWorkspaceBackup);
function persistSettingsChange() {
    state.actingAsAdmin = state.actingAsAdmin !== false;
    state.coordinationMode = $('#settings-coord-mode').value;
    state.assetStorageMode = $('#settings-asset-mode').value;
    state.assetPreviewPolicy = ArchitectBackend.setPreviewPolicy({
        mode: $('#settings-preview-mode')?.value || state.assetPreviewPolicy?.mode || 'smart-proxy',
        maxProxySizeKB: Math.max(50, Math.min(20480, Number($('#settings-proxy-max-kb')?.value) || 500)),
        cacheFolderPath: $('#settings-cache-folder')?.value.trim() || ''
    });
    const rawSourceUrl = $('#settings-sync-url').value.trim();
    const rawServerUrl = $('#settings-server-url').value.trim();
    const validSourceUrl = rawSourceUrl ? ArchitectBackend.safeHttpUrl(rawSourceUrl) : null;
    const validServerUrl = rawServerUrl ? ArchitectBackend.safeHttpUrl(rawServerUrl) : null;
    let urlError = undefined;
    if (rawSourceUrl && !validSourceUrl) {
        urlError = 'Sync URL must use http:// or https://';
        toast(urlError);
    }
    if (rawServerUrl && !validServerUrl) {
        const msg = 'Team server URL must use http:// or https://';
        urlError = urlError || msg;
        toast(msg);
    }
    state.syncConfig = {
        ...state.syncConfig,
        driveProvider: $('#settings-sync-provider').value,
        folderPath: $('#settings-sync-folder').value.trim(),
        sourceUrl: rawSourceUrl ? (validSourceUrl || state.syncConfig?.sourceUrl || undefined) : undefined,
        readOnlyMirror: $('#settings-sync-readonly').checked,
        cadence: $('#settings-sync-cadence').value,
        intervalMinutes: Math.max(1, Number($('#settings-sync-interval').value) || 5),
        serverUrl: rawServerUrl ? (validServerUrl || state.syncConfig?.serverUrl || undefined) : undefined,
        lastSyncError: urlError
    };
    $('#settings-sync-panel').hidden = state.coordinationMode !== 'cloud-sync';
    $('#settings-server-panel').hidden = state.coordinationMode !== 'server';
    syncAssetPreviewSettingsVisibility();
    const isFolderSync = state.syncConfig.driveProvider === 'local-folder';
    $('#settings-sync-folder-row').hidden = !isFolderSync;
    $('#settings-sync-url-row').hidden = isFolderSync;
    $('#settings-sync-interval').disabled = state.syncConfig.cadence !== 'interval';
    $('#sync-push-now').disabled = isReadOnlyMirror();
    persistAllStorage(JSON.stringify(state));
    updateSettingsSyncStatus();
    if (currentAppMode === 'dashboard') renderDashboardView();
    scheduleAutoSync();
    render();
}
['#settings-coord-mode', '#settings-asset-mode', '#settings-preview-mode', '#settings-proxy-max-kb', '#settings-cache-folder', '#settings-sync-provider', '#settings-sync-readonly', '#settings-sync-cadence', '#settings-sync-interval', '#settings-sync-folder', '#settings-sync-url', '#settings-server-url'].forEach(sel => {
    $(sel)?.addEventListener('change', persistSettingsChange);
});
$('#choose-asset-cache-folder')?.addEventListener('click', async () => {
    const desktop = ArchitectBackend.host();
    if (desktop) {
        const picked = desktop.chooseCacheFolder ? await desktop.chooseCacheFolder() : await desktop.chooseSyncFolder();
        if (!picked.canceled && picked.path) { $('#settings-cache-folder').value = picked.path; persistSettingsChange(); }
        return;
    }
    const picked = await ArchitectBackend.pickBrowserCacheFolder();
    if (!picked.canceled && picked.name) {
        $('#settings-cache-folder').value = picked.name;
        persistSettingsChange();
        toast(`Selected download cache folder: ${picked.name}`);
    } else if (picked.error) {
        toast(picked.error);
    }
});
$('#choose-sync-folder')?.addEventListener('click', async () => {
    const desktop = ArchitectBackend.host();
    if (desktop) {
        const picked = await desktop.chooseSyncFolder();
        if (!picked.canceled && picked.path) { $('#settings-sync-folder').value = picked.path; persistSettingsChange(); }
        return;
    }
    const picked = await ArchitectBackend.pickBrowserSyncFolder();
    if (!picked.canceled && picked.name) {
        $('#settings-sync-folder').value = picked.name;
        persistSettingsChange();
        toast(`Selected sync folder: ${picked.name}`);
    } else if (picked.error) {
        toast(picked.error);
    }
});
$('#sync-pull-now')?.addEventListener('click', () => { persistSettingsChange(); runSyncPull(true); });
$('#sync-push-now')?.addEventListener('click', () => { persistSettingsChange(); runSyncPush(true); });
$('#topbar-sync-now')?.addEventListener('click', () => runSyncPull(true));

let libraryTargetContext = null;
const ASSET_CATEGORIES = ['music', 'sfx', '3d model', 'concept', 'illustration', 'video', 'document', 'image', 'other'];
function insertAssetIntoBlockTarget(asset, targetPage, targetBlock) {
    if (effectivePageReadOnly(targetPage)) { toast('Read-only: cannot edit this page'); return; }
    pushUndoBeforeEdit(targetPage);
    const kind = asset.fileType.startsWith('image/') || asset.category === 'concept' || asset.category === 'illustration' || asset.category === 'image' ? 'image'
        : asset.fileType.startsWith('audio/') || asset.category === 'music' || asset.category === 'sfx' ? 'audio'
        : asset.fileType.startsWith('video/') || asset.category === 'video' ? 'video'
        : (asset.fileType === 'application/pdf' || /\.pdf(?:$|[?#])/i.test(asset.name || asset.url || '') ? 'pdf' : 'file');
    targetBlock.type = kind;
    targetBlock.assetId = asset.id;
    targetBlock.url = asset.storageMode === 'local' ? (asset.url || '') : (asset.previewDataUrl || asset.externalUrl || asset.url);
    targetBlock.text = asset.name;
    targetBlock.mimeType = asset.fileType;
    targetBlock.category = asset.category;
    targetBlock.creator = asset.creator;
    targetBlock.tags = [...(asset.tags || [])];
    save(); render();
}
function refreshAssetCreatorFilter(all) {
    const creators = [...new Set(all.map(a => a.creator).filter(Boolean))].sort();
    const creatorSel = $('#assets-filter-creator');
    const prevCreator = creatorSel.value;
    creatorSel.innerHTML = '<option value="all">All creators</option>' + creators.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
    if (creators.includes(prevCreator)) creatorSel.value = prevCreator;
    return creatorSel;
}
function renderAssetLibrary() {
    stopAllAudioPlayers();
    const all = ArchitectBackend.readAssetCatalog();
    const actor = getCurrentActorUser();
    const isAdmin = !actor?.blocked && (userHasGlobalPerm('manageAssets', actor) || getUserHighestRank(actor) === 0);
    const storeLabel = state.assetStorageMode === 'drive' ? 'External Drive' : state.assetStorageMode === 'server' ? 'Team Server' : 'Local Storage';
    const subtitle = $('#assets-subtitle');
    if (subtitle) subtitle.textContent = `Storage: ${storeLabel} · Role: ${isAdmin ? 'Admin (creator reassignment enabled)' : 'Member (creator read-only)'} — Search, play audio timelines, or insert references.`;
    const creatorSel = refreshAssetCreatorFilter(all);
    const filtered = ArchitectBackend.queryAssets(all, {
        query: $('#assets-search').value,
        category: $('#assets-filter-category').value,
        creator: creatorSel.value,
        storageMode: $('#assets-filter-storage').value
    });
    const grid = $('#assets-grid');
    grid.replaceChildren();
    if (!filtered.length) {
        const empty = document.createElement('div');
        empty.className = 'assets-inspector-empty';
        empty.textContent = all.length ? 'No assets match these filters.' : 'No assets yet. Upload files or attach a Drive reference above.';
        grid.append(empty);
    }
    filtered.forEach(asset => {
        const card = document.createElement('button');
        card.type = 'button';
        card.dataset.assetId = asset.id;
        card.className = 'asset-card' + (asset.id === selectedLibraryAssetId ? ' selected' : '');
        const initialThumb = asset.storageMode === 'local' ? (asset.url || '') : (asset.previewDataUrl || asset.url || '');
        const thumbHtml = (initialThumb && (asset.fileType.startsWith('image/') || asset.previewDataUrl))
            ? `<img src="${esc(initialThumb)}" alt="">`
            : asset.category === 'music' ? '🎵' : asset.category === 'sfx' ? '🔊' : asset.category === 'video' ? '🎬' : asset.category === '3d model' ? '◇' : '📄';
        const storeLabel = asset.storageMode === 'drive-reference' ? 'Drive ref' : asset.storageMode === 'server' ? 'Server' : 'Local';
        card.innerHTML = `<div class="asset-thumb">${thumbHtml}</div><div class="asset-card-name">${esc(asset.name)}</div><div class="asset-card-sub"><span>${esc(asset.category)} · ${esc(asset.creator)}</span><span>${esc(storeLabel)}</span></div>`;
        card.onclick = () => { selectedLibraryAssetId = asset.id; renderAssetLibrary(); };
        grid.append(card);
        if (asset.fileType.startsWith('image/') || asset.category === 'concept' || asset.category === 'illustration' || asset.category === 'image') {
            ArchitectBackend.resolveAssetPreviewUrl(asset).then(url => {
                const thumb = card.querySelector('.asset-thumb');
                if (url && thumb && card.isConnected) thumb.innerHTML = `<img src="${esc(url)}" alt="">`;
            });
        }
    });
    const inspector = $('#assets-inspector');
    inspector.replaceChildren();
    const selected = all.find(a => a.id === selectedLibraryAssetId) || filtered[0];
    if (!selected) {
        inspector.innerHTML = '<div class="assets-inspector-empty">Select an asset to inspect metadata, scrub audio, preview fullscreen, or download full size.</div>';
        return;
    }
    selectedLibraryAssetId = selected.id;
    const previewBox = document.createElement('div');
    previewBox.className = 'assets-inspector-preview';
    if (selected.category === 'music' || selected.category === 'sfx' || selected.fileType.startsWith('audio/')) {
        previewBox.append(buildAudioPlayerElement(selected));
    } else if (selected.category === 'video' || selected.fileType.startsWith('video/')) {
        const video = document.createElement('video');
        video.controls = true; video.preload = 'metadata';
        ArchitectBackend.resolveAssetOriginalUrl(selected).then(u => { if (u && video.isConnected) video.src = u; });
        previewBox.append(video);
    } else if (selected.fileType.startsWith('image/') || selected.category === 'concept' || selected.category === 'illustration' || selected.category === 'image') {
        const img = document.createElement('img');
        img.alt = selected.name;
        img.src = selected.storageMode === 'local' ? (selected.url || '') : (selected.previewDataUrl || selected.url || '');
        ArchitectBackend.resolveAssetPreviewUrl(selected).then(u => { if (u && img.isConnected) img.src = u; });
        img.onclick = () => openImageLightbox(selected);
        const expandBtn = document.createElement('button');
        expandBtn.type = 'button'; expandBtn.className = 'secondary-button'; expandBtn.textContent = '⤢ Fullscreen high-res preview';
        expandBtn.onclick = () => openImageLightbox(selected);
        previewBox.append(img, expandBtn);
    } else {
        previewBox.innerHTML = `<div style="font-size:32px">${selected.category === '3d model' ? '◇' : '📄'}</div><strong style="font-size:12px">${esc(selected.name)}</strong><small style="color:#787774">${esc(selected.fileType)} ${selected.sizeBytes ? '· ' + formatBytes(selected.sizeBytes) : ''}</small>`;
    }
    inspector.append(previewBox);
    const metaBox = document.createElement('div');
    metaBox.style.display = 'grid'; metaBox.style.gap = '8px';
    const proxyNote = selected.storageMode === 'local' ? 'Full-res local preview'
        : selected.metadata?.proxySizeBytes ? `Proxy ${formatBytes(Number(selected.metadata.proxySizeBytes))}` : '';
    metaBox.innerHTML = `
      <label>Category<select id="insp-cat">${ASSET_CATEGORIES.map(c => `<option value="${c}" ${selected.category === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
      <label>Creator ${isAdmin ? '(Admin reassignable)' : '(Admin required)'}<input id="insp-creator" value="${esc(selected.creator)}" ${isAdmin ? '' : 'disabled'}></label>
      <label>Tags (comma-separated)<input id="insp-tags" value="${esc((selected.tags || []).join(', '))}"></label>
      <label>Notes / Metadata<input id="insp-notes" value="${esc(String(selected.metadata?.notes || ''))}" placeholder="e.g. BPM 120, loopable, client rev 2"></label>
      <div style="font-size:11px;color:#787774">File type: <strong>${esc(selected.fileType)}</strong> · Storage: <strong>${esc(selected.provider)}</strong>${proxyNote ? ` · ${esc(proxyNote)}` : ''}${selected.uploadedBy ? ` · Uploaded by ${esc(selected.uploadedBy)}` : ''}</div>
    `;
    const saveMeta = (reRender = false) => {
        const updated = ArchitectBackend.updateAsset(selected.id, {
            category: $('#insp-cat').value,
            creator: isAdmin ? ($('#insp-creator').value.trim() || selected.creator) : selected.creator,
            tags: $('#insp-tags').value.split(',').map(s => s.trim()).filter(Boolean),
            metadata: { ...(selected.metadata || {}), notes: $('#insp-notes').value.trim() }
        });
        if (reRender) { renderAssetLibrary(); return; }
        if (updated) {
            Object.assign(selected, updated);
            const card = grid.querySelector(`.asset-card[data-asset-id="${CSS.escape(selected.id)}"]`);
            const sub = card?.querySelector('.asset-card-sub span:first-child');
            if (sub) sub.textContent = `${updated.category} · ${updated.creator}`;
            refreshAssetCreatorFilter(ArchitectBackend.readAssetCatalog());
        }
    };
    metaBox.querySelector('#insp-cat')?.addEventListener('change', () => saveMeta(true));
    ['#insp-creator', '#insp-tags', '#insp-notes'].forEach(sel => {
        const field = metaBox.querySelector(sel);
        field?.addEventListener('input', () => saveMeta(false));
        field?.addEventListener('change', () => saveMeta(false));
    });
    inspector.append(metaBox);

    const actions = document.createElement('div');
    actions.className = 'assets-inspector-actions';
    const insertBtn = document.createElement('button');
    insertBtn.type = 'button'; insertBtn.className = 'share-button';
    insertBtn.textContent = libraryTargetContext?.onSelectAsset ? 'Insert into board' : libraryTargetContext ? 'Insert into block' : 'Insert into page';
    insertBtn.onclick = () => {
        if (libraryTargetContext?.onSelectAsset) {
            libraryTargetContext.onSelectAsset(selected);
            $('#assets-dialog').close();
            toast(`Inserted ${selected.name} onto board`);
            return;
        }
        const page = libraryTargetContext?.targetPage || current();
        let targetBlock = libraryTargetContext?.targetBlock;
        if (!targetBlock) {
            targetBlock = block('file');
            page.blocks.push(targetBlock);
        }
        insertAssetIntoBlockTarget(selected, page, targetBlock);
        $('#assets-dialog').close();
        toast(`Inserted ${selected.name}`);
    };
    const dlBtn = document.createElement('button');
    dlBtn.type = 'button'; dlBtn.className = 'secondary-button'; dlBtn.textContent = '↓ Download full size';
    dlBtn.onclick = () => ArchitectBackend.downloadFullAsset(selected);
    const delBtn = document.createElement('button');
    delBtn.type = 'button'; delBtn.className = 'secondary-button'; delBtn.textContent = 'Delete';
    delBtn.onclick = async () => { resolvedAssetPreviewCache.delete(selected.id); resolvedCoverOriginalCache.delete(selected.id); await ArchitectBackend.removeAsset(selected.id); selectedLibraryAssetId = null; renderAssetLibrary(); render(); };
    actions.append(insertBtn, dlBtn, delBtn);
    inspector.append(actions);
}
function openAssetLibrary(focusId = null, targetCtx = null) {
    libraryTargetContext = targetCtx;
    if (focusId) selectedLibraryAssetId = focusId;
    const dialog = $('#assets-dialog');
    $('#assets-search').value = '';
    renderAssetLibrary();
    if (!dialog.open) dialog.showModal();
    $('#assets-search').focus();
}
$('#close-assets-dialog')?.addEventListener('click', () => { stopAllAudioPlayers(); $('#assets-dialog').close(); });
$('#assets-dialog')?.addEventListener('close', () => stopAllAudioPlayers());
['#assets-search', '#assets-filter-category', '#assets-filter-creator', '#assets-filter-storage'].forEach(sel => {
    $(sel)?.addEventListener('input', renderAssetLibrary);
    $(sel)?.addEventListener('change', renderAssetLibrary);
});
$('#assets-upload-input')?.addEventListener('change', async event => {
    const files = [...(event.target.files || [])];
    if (!files.length) return;
    const creator = getActorDisplayName();
    for (const file of files) {
        try {
            const rec = await ArchitectBackend.ingestLocalFile(file, { creator, storageMode: state.assetStorageMode || 'local', previewPolicy: state.assetPreviewPolicy });
            selectedLibraryAssetId = rec.id;
        } catch (err) {
            toast(err?.message || `Failed to store ${file.name}`);
        }
    }
    event.target.value = '';
    renderAssetLibrary();
    toast(`Added ${files.length} ${files.length === 1 ? 'asset' : 'assets'}`);
});
$('#assets-add-drive-ref')?.addEventListener('click', () => { $('#drive-ref-form').hidden = !$('#drive-ref-form').hidden; });
$('#drive-ref-cancel')?.addEventListener('click', () => { $('#drive-ref-form').hidden = true; });
$('#drive-ref-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#drive-ref-name').value.trim();
    const category = $('#drive-ref-category').value || undefined;
    try {
        const rec = ArchitectBackend.addDriveReference({
            name,
            fileType: ArchitectBackend.inferMimeFromNameAndCategory(name, category),
            category,
            creator: getActorDisplayName(),
            tags: $('#drive-ref-tags').value.split(',').map(s => s.trim()).filter(Boolean),
            externalUrl: $('#drive-ref-url').value,
            previewUrl: $('#drive-ref-preview').value || undefined,
            provider: state.syncConfig?.driveProvider === 'google-drive' ? 'Google Drive' : 'External Drive'
        });
        selectedLibraryAssetId = rec.id;
        $('#drive-ref-form').reset();
        $('#drive-ref-form').hidden = true;
        renderAssetLibrary();
        toast('Saved cloud Drive reference');
    } catch (err) {
        toast(err?.message || 'Invalid Drive URL');
    }
});
$('#lightbox-close')?.addEventListener('click', () => $('#lightbox-dialog').close());
$('#lightbox-stage')?.addEventListener('click', e => { if (e.target === $('#lightbox-stage')) $('#lightbox-dialog').close(); });
$('#lightbox-img')?.addEventListener('dblclick', () => $('#lightbox-dialog').close());
const setLightboxScale = next => {
    lightboxZoom = Math.max(0.5, Math.min(3, next));
    $('#lightbox-img').style.transform = `scale(${lightboxZoom})`;
    $('#lightbox-zoom-label').textContent = lightboxZoom === 1 ? 'Fit' : `${Math.round(lightboxZoom * 100)}%`;
};
$('#lightbox-zoom-in')?.addEventListener('click', () => setLightboxScale(lightboxZoom + 0.35));
$('#lightbox-zoom-out')?.addEventListener('click', () => setLightboxScale(lightboxZoom - 0.35));
$('#lightbox-fit')?.addEventListener('click', () => setLightboxScale(1));
$('#lightbox-download')?.addEventListener('click', () => { if (lightboxAsset) ArchitectBackend.downloadFullAsset(lightboxAsset); });
function pageMenu(p, anchor) { closeMenu(); const menu = $('#command-menu'); menu.className = 'command-menu page-actions'; menu.replaceChildren(); const heading = document.createElement('div'); heading.className = 'menu-heading'; const icon = document.createElement('span'); icon.className = 'menu-heading-icon'; icon.innerHTML = pageIconMarkup(p.icon); const title = document.createElement('strong'); title.textContent = p.title || 'Untitled'; heading.append(icon, title); menu.append(heading); const list = document.createElement('div'); list.className = 'command-list'; menu.append(list); const add = (label, run) => list.append(menuRow(label, menuGlyph(label), run)); const divider = () => { const line = document.createElement('div'); line.className = 'menu-divider'; list.append(line); }; const pgPerms = resolvePagePermissions(p); const actor = getCurrentActorUser(); const canManagePerms = !actor?.blocked && (userHasGlobalPerm('managePagePermissions', actor) || getUserHighestRank(actor) === 0); add('Open in new tab', () => openPageInNewTab(p.id)); if (pgPerms.edit && !isReadOnlyMirror()) { add('Rename', () => { const name = prompt('Page title', p.title); if (name?.trim()) { p.title = name.trim(); save(); render(); } }); add('Duplicate', () => duplicatePage(p)); } add('Copy link', () => copyPageLink(p)); divider(); add(p.favorite ? 'Remove from favorites' : 'Add to favorites', () => { p.favorite = !p.favorite; save(); render(); }); add('Version history', () => openVersionHistoryModal(p)); if (pgPerms.edit && !isReadOnlyMirror()) { add(p.published ? 'Unpublish page' : 'Publish page', () => togglePagePublish(p)); } if (p.published) { add('Page analytics', () => openPageAnalyticsModal(p)); } if (pgPerms.edit && !isReadOnlyMirror()) { add('Change icon', () => iconPicker(p)); if (!ArchitectDatabase.isDatabasePage(p) && !ArchitectBoard.isBoardPage(p) && !p.databaseId) { add('Turn into database', () => { ArchitectDatabase.convertPageToDatabase(p); save(); render(); }); add('Turn into board', () => { ArchitectBoard.convertPageToBoard(p); save(); render(); }); } } if (canManagePerms) { add('Permissions', () => openPagePermissionsDialog(p)); } divider(); if (pgPerms.edit && !isReadOnlyMirror()) { add('Delete', () => { if (confirm(`Move “${p.title}” and its children to Trash?`)) { deletePageTree(p.id); if (!state.pages.length) createPage(); if (!state.pages.some(page => page.id === state.activePageId)) state.activePageId = state.pages[0].id; pageHistory = [state.activePageId]; historyIndex = 0; save(); render(); } }); } const point = anchor?.clientX != null ? { x: anchor.clientX, y: anchor.clientY + 2 } : anchor?.getBoundingClientRect ? { x: anchor.getBoundingClientRect().right, y: anchor.getBoundingClientRect().bottom + 2 } : { x: 256, y: 92 }; placeFloatingMenu(menu, point.x, point.y); menuIndex = 0; refreshMenuSelection(); activeMenu = menu; }
function readAssets() { return ArchitectBackend.readAssetCatalog(); }
function coverBannerAspect() {
    const cover = document.querySelector('.page-cover');
    if (cover?.clientHeight) return cover.clientWidth / cover.clientHeight;
    const host = ensurePageCoverSlot() || document.querySelector('.main-area') || editor;
    const probe = document.createElement('div');
    probe.className = 'page-cover';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    const wasHidden = host.hidden;
    if (wasHidden) host.hidden = false;
    host.prepend(probe);
    const aspect = probe.clientWidth / Math.max(1, probe.clientHeight);
    probe.remove();
    if (wasHidden) host.hidden = true;
    return aspect || 3.8;
}
function applyCoverBackground(element, page) {
    const zoom = Math.max(100, Number(page.coverZoom) || 100);
    element.style.backgroundPosition = `${page.coverX ?? 50}% ${page.coverY ?? 50}%`;
    if (!element.clientWidth || !element.clientHeight) {
        element.style.backgroundSize = zoom <= 100 ? 'cover' : `${zoom}% auto`;
        return;
    }
    if (Number(page.coverAspect)) {
        const fit = Math.min(1, (element.clientWidth / Math.max(1, element.clientHeight)) / Number(page.coverAspect));
        element.style.backgroundSize = `${(zoom / Math.max(0.01, fit)).toFixed(2)}% auto`;
    } else element.style.backgroundSize = zoom <= 100 ? 'cover' : `${zoom}% auto`;
}
function positionCoverCrop() {
    const stage = $('#cover-crop-preview'), image = stage.querySelector('.cover-source-image'), frame = stage.querySelector('.crop-frame');
    if (!image?.naturalWidth || !stage.clientWidth || !stage.clientHeight) return;
    const stageWidth = stage.clientWidth, stageHeight = stage.clientHeight, scale = Math.min(stageWidth / image.naturalWidth, stageHeight / image.naturalHeight);
    const imageWidth = image.naturalWidth * scale, imageHeight = image.naturalHeight * scale, imageLeft = (stageWidth - imageWidth) / 2, imageTop = (stageHeight - imageHeight) / 2;
    image.style.width = `${imageWidth}px`; image.style.height = `${imageHeight}px`; image.style.left = `${imageLeft}px`; image.style.top = `${imageTop}px`;
    const aspect = coverBannerAspect(), fitWidth = Math.min(imageWidth, imageHeight * aspect), zoom = Math.max(100, Number($('#cover-zoom').value) || 100);
    const cropWidth = Math.max(48, fitWidth * 100 / zoom), cropHeight = cropWidth / aspect;
    const x = Math.min(100, Math.max(0, Number($('#cover-x').value) || 0)), y = Math.min(100, Math.max(0, Number($('#cover-y').value) || 0));
    const left = imageLeft + (imageWidth - cropWidth) * x / 100, top = imageTop + (imageHeight - cropHeight) * y / 100;
    frame.style.left = `${left}px`; frame.style.top = `${top}px`; frame.style.width = `${cropWidth}px`; frame.style.height = `${cropHeight}px`;
    coverCropMetrics = { stageWidth, stageHeight, imageLeft, imageTop, imageWidth, imageHeight, fitWidth, cropWidth, cropHeight, left, top };
    const [topShade, bottomShade, leftShade, rightShade] = stage.querySelectorAll('.crop-shade-piece');
    Object.assign(topShade.style, { left: '0', top: '0', width: `${stageWidth}px`, height: `${top}px` });
    Object.assign(bottomShade.style, { left: '0', top: `${top + cropHeight}px`, width: `${stageWidth}px`, height: `${Math.max(0, stageHeight - top - cropHeight)}px` });
    Object.assign(leftShade.style, { left: '0', top: `${top}px`, width: `${left}px`, height: `${cropHeight}px` });
    Object.assign(rightShade.style, { left: `${left + cropWidth}px`, top: `${top}px`, width: `${Math.max(0, stageWidth - left - cropWidth)}px`, height: `${cropHeight}px` });
}
function updateCoverCropPreview() {
    const stage = $('#cover-crop-preview'); stage.replaceChildren(); coverCropMetrics = null;
    if (!chosenCoverAsset) { const empty = document.createElement('span'); empty.className = 'crop-empty'; empty.textContent = 'Choose an image to preview'; stage.append(empty); return; }
    const image = document.createElement('img'); image.className = 'cover-source-image'; image.alt = 'Full image being cropped'; image.draggable = false;
    const shade = document.createElement('div'); shade.className = 'crop-shade';
    const shades = Array.from({ length: 4 }, () => { const panel = document.createElement('div'); panel.className = 'crop-shade-piece'; shade.append(panel); return panel; });
    const frame = document.createElement('div'); frame.className = 'crop-frame'; frame.setAttribute('aria-label', 'Banner crop area; drag to reposition');
    const handle = document.createElement('button'); handle.type = 'button'; handle.className = 'crop-resize-handle'; handle.setAttribute('aria-label', 'Resize crop area'); frame.append(handle); stage.append(image, shade, frame);
    image.onload = positionCoverCrop; image.src = chosenCoverAsset;
    const updatePosition = (dx, dy, start) => {
        if (!coverCropMetrics) return;
        const m = coverCropMetrics;
        if (start.mode === 'move') {
            $('#cover-x').value = String(Math.round(Math.min(100, Math.max(0, ((start.left + dx - m.imageLeft) / Math.max(1, m.imageWidth - m.cropWidth)) * 100))));
            $('#cover-y').value = String(Math.round(Math.min(100, Math.max(0, ((start.top + dy - m.imageTop) / Math.max(1, m.imageHeight - m.cropHeight)) * 100))));
        } else {
            const nextWidth = Math.min(m.fitWidth, Math.max(m.fitWidth * 100 / 240, start.width + dx));
            $('#cover-zoom').value = String(Math.round(m.fitWidth * 100 / nextWidth));
        }
        positionCoverCrop();
    };
    const beginDrag = (event, mode) => {
        event.preventDefault(); event.stopPropagation(); ($('#cover-dialog [data-action="apply-cover"]') as HTMLElement | null)?.focus({ preventScroll: true }); const m = coverCropMetrics; if (!m) return;
        const start = { mode, x: event.clientX, y: event.clientY, left: m.left, top: m.top, width: m.cropWidth };
        const move = next => updatePosition(next.clientX - start.x, next.clientY - start.y, start);
        const end = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', end, { once: true });
    };
    frame.addEventListener('pointerdown', event => { if (event.target !== handle) beginDrag(event, 'move'); });
    handle.addEventListener('pointerdown', event => beginDrag(event, 'resize'));
    requestAnimationFrame(positionCoverCrop);
}
let chosenCoverAssetId = '';
function selectCoverAsset(url, assetId = '') { chosenCoverAsset = url; chosenCoverAssetId = assetId; $('#cover-assets').querySelectorAll('.cover-asset').forEach(button => button.classList.toggle('selected', assetId ? button.dataset.assetId === assetId : button.dataset.url === url)); updateCoverCropPreview(); }
function renderCoverAssets() {
    const list = $('#cover-assets'), query = $('#cover-asset-search').value.trim().toLowerCase();
    list.replaceChildren();
    const assets = readAssets().filter(a => a.fileType?.startsWith('image/') || a.previewDataUrl || a.url);
    if (coverTargetPage?.cover && !assets.some(item => item.id === coverTargetPage.coverAssetId || (item.previewDataUrl || item.url) === coverTargetPage.cover)) {
        assets.unshift({ id: coverTargetPage.coverAssetId || '', name: 'Current cover', url: coverTargetPage.cover, previewDataUrl: coverTargetPage.cover });
    }
    const filtered = assets.filter(asset => asset.name.toLowerCase().includes(query));
    if (!filtered.length) {
        const empty = document.createElement('span'); empty.className = 'cover-assets-empty';
        empty.textContent = assets.length ? 'No images match this search.' : 'No saved images yet. Upload one to add it to the local image library.';
        list.append(empty);
        return;
    }
    filtered.forEach(asset => {
        const thumb = asset.storageMode === 'local' ? (asset.url || '') : (asset.previewDataUrl || asset.url || '');
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'cover-asset'; button.title = asset.name;
        button.setAttribute('aria-label', `Use ${asset.name} as cover`);
        button.dataset.url = thumb;
        button.dataset.assetId = asset.id || '';
        if (thumb) button.style.backgroundImage = `url("${thumb}")`;
        button.onclick = async () => {
            const full = asset.id ? ((await ArchitectBackend.resolveAssetOriginalUrl(asset)) || thumb) : thumb;
            selectCoverAsset(full, asset.id || '');
        };
        list.append(button);
        if (asset.id && asset.fileType?.startsWith('image/')) {
            ArchitectBackend.resolveAssetPreviewUrl(asset).then(resolved => {
                if (resolved && button.isConnected) {
                    button.dataset.url = resolved;
                    button.style.backgroundImage = `url("${resolved}")`;
                }
            });
        }
    });
    list.querySelectorAll('.cover-asset').forEach(button => button.classList.toggle('selected', chosenCoverAssetId ? button.dataset.assetId === chosenCoverAssetId : button.dataset.url === chosenCoverAsset));
}
async function openCoverPicker(page) {
    coverTargetPage = page;
    chosenCoverAsset = page.cover || '';
    chosenCoverAssetId = page.coverAssetId || '';
    if (chosenCoverAssetId) {
        const a = readAssets().find(item => item.id === chosenCoverAssetId);
        if (a) chosenCoverAsset = (await ArchitectBackend.resolveAssetOriginalUrl(a)) || (await ArchitectBackend.resolveAssetPreviewUrl(a)) || chosenCoverAsset;
    }
    $('#cover-zoom').value = String(page.coverZoom || 100); $('#cover-x').value = String(page.coverX ?? 50); $('#cover-y').value = String(page.coverY ?? 50);
    $('#cover-asset-search').value = '';
    renderCoverAssets();
    $('#cover-dialog').showModal();
    updateCoverCropPreview();
    ($('#cover-dialog [data-action="apply-cover"]') as HTMLElement | null)?.focus({ preventScroll: true });
}
function applyCoverFromPicker() {
    if (!coverTargetPage || (!chosenCoverAsset && !chosenCoverAssetId)) { toast('Choose an image first'); return; }
    const page = coverTargetPage;
    const finish = aspect => {
        const asset = chosenCoverAssetId ? readAssets().find(item => item.id === chosenCoverAssetId) : null;
        const isEphemeralOrPreviewUrl = !!(
            chosenCoverAssetId &&
            asset &&
            (chosenCoverAsset.startsWith('blob:') ||
                chosenCoverAsset.startsWith('architect-asset://previews/') ||
                (asset.previewDataUrl && chosenCoverAsset === asset.previewDataUrl) ||
                (chosenCoverAsset.startsWith('data:') && chosenCoverAsset === asset.url))
        );
        page.coverAssetId = chosenCoverAssetId || undefined;
        page.cover = isEphemeralOrPreviewUrl ? '' : chosenCoverAsset;
        if (chosenCoverAssetId && chosenCoverAsset && chosenCoverAsset !== asset?.previewDataUrl && !chosenCoverAsset.startsWith('architect-asset://previews/')) {
            resolvedCoverOriginalCache.set(chosenCoverAssetId, chosenCoverAsset);
        }
        page.coverZoom = Number($('#cover-zoom').value); page.coverX = Number($('#cover-x').value); page.coverY = Number($('#cover-y').value);
        if (aspect) page.coverAspect = aspect;
        save(true); $('#cover-dialog').close(); render();
    };
    const image = new Image(); image.onload = () => finish(image.naturalWidth / Math.max(1, image.naturalHeight)); image.onerror = () => finish(0); image.src = chosenCoverAsset;
}
$('#cover-asset-search').addEventListener('input', renderCoverAssets);
$('#cover-upload').addEventListener('change', async event => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) { toast('Choose an image file'); return; } try { const rec = await ArchitectBackend.ingestLocalFile(file, { creator: getActorDisplayName(), storageMode: state.assetStorageMode || 'local', previewPolicy: state.assetPreviewPolicy }); const pickedUrl = (await ArchitectBackend.resolveAssetOriginalUrl(rec)) || rec.previewDataUrl || rec.url || ''; renderCoverAssets(); selectCoverAsset(pickedUrl, rec.id); } catch { toast('Image selected, but it could not be saved locally'); } event.target.value = ''; });
const emojiChoices = [['📄','document page'],['📝','memo note'],['📚','books resources'],['📁','folder'],['📌','pin'],['⭐','star favorite'],['✨','sparkles'],['💡','idea'],['🎯','target'],['🚀','rocket'],['🎨','art palette'],['🧠','brain'],['💬','speech chat'],['📅','calendar'],['✅','check'],['🔥','fire'],['❤️','heart'],['🌱','plant'],['🌍','earth'],['🏠','home'],['🏢','office'],['📈','chart'],['🧩','puzzle'],['🎵','music'],['📷','camera'],['🔒','lock'],['🛠️','tools'],['💻','computer'],['🤝','handshake'],['🎉','celebration'],['🧪','experiment'],['🗂️','files'],['🧭','compass'],['☀️','sun'],['🌙','moon'],['🐛','bug'],['🗓️','schedule'],['🖊️','writing'],['💰','money'],['🏆','award'],['⚡','lightning'],['🌈','rainbow'],['🔔','notification'],['📣','announcement'],['🛒','shopping'],['✈️','travel'],['🍽️','food'],['🐶','dog'],['🐱','cat'],['🌸','flower'],['💎','gem']];
let activeIconTab: 'emoji' | 'icons' | 'upload' = 'emoji';
let selectedIconColorKey = 'default';
function setIconDialogTab(tab: 'emoji' | 'icons' | 'upload') {
    activeIconTab = tab;
    document.querySelectorAll('#icon-dialog [data-icon-tab]').forEach(btn => {
        const match = (btn as HTMLElement).dataset.iconTab === tab;
        btn.classList.toggle('is-active', match);
        btn.setAttribute('aria-selected', String(match));
    });
    const emojiPane = $('#icon-tab-emoji');
    const iconsPane = $('#icon-tab-icons');
    const uploadPane = $('#icon-tab-upload');
    if (emojiPane) emojiPane.hidden = tab !== 'emoji';
    if (iconsPane) iconsPane.hidden = tab !== 'icons';
    if (uploadPane) uploadPane.hidden = tab !== 'upload';
    const colorWrap = document.querySelector('#icon-dialog .icon-color-picker-wrap') as HTMLElement | null;
    if (colorWrap) colorWrap.hidden = tab === 'upload';
}
function closeIconColorPopover() {
    const pop = $('#icon-color-popover');
    const trig = $('#icon-color-trigger');
    if (pop) pop.hidden = true;
    if (trig) trig.setAttribute('aria-expanded', 'false');
}
function renderIconColorGrid() {
    const grid = $('#icon-color-grid');
    const activeDot = $('#icon-color-active-dot');
    const colors = typeof ArchitectIcons !== 'undefined' ? ArchitectIcons.ICON_COLORS : [];
    const currentDef = typeof ArchitectIcons !== 'undefined' ? ArchitectIcons.getColorDef(selectedIconColorKey) : { hex: '#474540', swatchHex: '#d5d3ce' };
    if (activeDot) activeDot.style.background = currentDef.hex;
    if (!grid) return;
    grid.replaceChildren();
    colors.forEach(col => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'icon-color-swatch-btn' + (selectedIconColorKey === col.key ? ' is-selected' : '');
        btn.dataset.iconColor = col.key;
        btn.title = col.label;
        btn.setAttribute('aria-label', `${col.label} icon color`);
        btn.innerHTML = `<span class="swatch-dot" style="background:${col.hex}"></span>`;
        btn.onclick = ev => {
            ev.preventDefault();
            ev.stopPropagation();
            selectedIconColorKey = col.key;
            renderIconColorGrid();
            closeIconColorPopover();
            renderIconPicker();
        };
        grid.append(btn);
    });
}
let iconTargetCallback: ((val: string) => void) | null = null;
let iconTargetAllowEmpty = false;
function choosePageIcon(value) {
    if (typeof value === 'string' && value.startsWith('blob:')) {
        fetch(value).then(r => r.blob()).then(blob => {
            const reader = new FileReader();
            reader.onload = () => choosePageIcon(String(reader.result || ''));
            reader.readAsDataURL(blob);
        }).catch(() => toast('Icon could not be loaded'));
        return;
    }
    if (iconTargetCallback) {
        const cb = iconTargetCallback;
        const allowEmpty = iconTargetAllowEmpty;
        iconTargetCallback = null;
        iconTargetAllowEmpty = false;
        cb(allowEmpty ? (value || '') : (value || '⚡'));
        closeIconColorPopover();
        $('#icon-dialog').close();
        return;
    }
    if (iconTargetBlock && iconTargetUndoPage) {
        pushUndoBeforeEdit(iconTargetUndoPage);
        iconTargetBlock.icon = value || '💡';
        save(); render();
        closeIconColorPopover();
        $('#icon-dialog').close();
        iconTargetBlock = null; iconTargetUndoPage = null;
        return;
    }
    if (!iconTargetPage) return;
    iconTargetPage.icon = value || '📄';
    save(); render();
    closeIconColorPopover();
    $('#icon-dialog').close();
}
function renderIconPicker() {
    const query = ($('#icon-search') as HTMLInputElement)?.value.trim().toLowerCase() || '';
    const emojiGrid = $('#emoji-grid');
    const vectorGrid = $('#vector-icon-grid');
    const assets = $('#icon-assets');
    emojiGrid?.replaceChildren();
    vectorGrid?.replaceChildren();
    assets?.replaceChildren();

    const emojis = emojiChoices.filter(([emoji, label]) => !query || `${emoji} ${label}`.toLowerCase().includes(query));
    if (!emojis.length && emojiGrid) {
        const empty = document.createElement('div');
        empty.className = 'emoji-empty';
        empty.textContent = 'No matching emoji. Try Icons tab or Upload an image.';
        emojiGrid.append(empty);
    }
    emojis.forEach(([emoji, label]) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'emoji-option'; button.textContent = emoji; button.title = label; button.setAttribute('aria-label', label);
        button.onclick = () => choosePageIcon(emoji);
        emojiGrid?.append(button);
    });

    if (typeof ArchitectIcons !== 'undefined' && vectorGrid) {
        const colorDef = ArchitectIcons.getColorDef(selectedIconColorKey);
        const icons = ArchitectIcons.VECTOR_ICONS.filter(ic => !query || `${ic.label} ${ic.keywords} ${ic.id}`.toLowerCase().includes(query));
        if (!icons.length) {
            const empty = document.createElement('div');
            empty.className = 'emoji-empty';
            empty.textContent = 'No matching icons.';
            vectorGrid.append(empty);
        }
        icons.forEach(ic => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'vector-icon-option';
            btn.dataset.vectorIconId = ic.id;
            btn.title = `${ic.label} (${colorDef.label})`;
            btn.setAttribute('aria-label', `${ic.label} icon`);
            btn.style.color = colorDef.hex;
            btn.innerHTML = ArchitectIcons.getSvgMarkupById(ic.id, 1.9);
            btn.onclick = () => choosePageIcon(ArchitectIcons.makeSvgIconValue(ic.id, selectedIconColorKey));
            vectorGrid.append(btn);
        });
    }

    const matches = readAssets().filter(asset => (asset.tags || []).includes('icon') || /icon/i.test(asset.name)).filter(asset => asset.name.toLowerCase().includes(query));
    if (!matches.length && assets) {
        const empty = document.createElement('span');
        empty.className = 'cover-assets-empty';
        empty.textContent = query ? 'No uploaded images match.' : 'No uploaded images yet.';
        assets.append(empty);
    }
    matches.forEach(asset => {
        const thumb = asset.previewDataUrl || asset.url || '';
        const button = document.createElement('button'); button.type = 'button'; button.className = 'cover-asset'; button.title = asset.name; button.setAttribute('aria-label', `Use ${asset.name} as icon`);
        if (thumb) button.style.backgroundImage = `url("${thumb}")`;
        let pickedIcon = thumb;
        if (!pickedIcon || asset.storageMode === 'local') {
            ArchitectBackend.resolveAssetPreviewUrl(asset).then(resolved => {
                if (resolved && button.isConnected) {
                    pickedIcon = resolved;
                    button.style.backgroundImage = `url("${resolved}")`;
                }
            });
        }
        button.onclick = () => choosePageIcon(pickedIcon || thumb);
        assets?.append(button);
    });
    renderIconColorGrid();
}
function openIconDialogWithInitialValue(currentVal?: string) {
    $('#icon-search').value = '';
    if (typeof ArchitectIcons !== 'undefined' && ArchitectIcons.isSvgIconValue(currentVal)) {
        selectedIconColorKey = ArchitectIcons.parseSvgIconValue(currentVal).colorKey || 'default';
        setIconDialogTab('icons');
    } else if (typeof currentVal === 'string' && /^(data:image|blob:|architect-asset:)/i.test(currentVal)) {
        setIconDialogTab('upload');
    } else {
        setIconDialogTab('emoji');
    }
    closeIconColorPopover();
    renderIconPicker();
    $('#icon-dialog').showModal();
    $('#icon-search').focus();
}
function iconPicker(page) { iconTargetCallback = null; iconTargetAllowEmpty = false; iconTargetBlock = null; iconTargetUndoPage = null; iconTargetPage = page; openIconDialogWithInitialValue(page?.icon); }
function blockIconPicker(page, blockItem) { iconTargetCallback = null; iconTargetAllowEmpty = false; iconTargetPage = null; iconTargetBlock = blockItem; iconTargetUndoPage = page; openIconDialogWithInitialValue(blockItem?.icon); }
function iconPickerForCallback(currentVal: string | undefined, allowEmpty: boolean, onPick: (val: string) => void) {
    iconTargetPage = null;
    iconTargetBlock = null;
    iconTargetUndoPage = null;
    iconTargetAllowEmpty = allowEmpty;
    iconTargetCallback = onPick;
    openIconDialogWithInitialValue(currentVal);
}
$('#icon-dialog')?.addEventListener('click', ev => {
    const t = ev.target as HTMLElement;
    const tabBtn = t.closest('[data-icon-tab]') as HTMLElement | null;
    if (tabBtn) {
        ev.preventDefault();
        setIconDialogTab((tabBtn.dataset.iconTab as any) || 'emoji');
        closeIconColorPopover();
        return;
    }
    if (t.closest('#icon-color-trigger')) {
        ev.preventDefault();
        ev.stopPropagation();
        const pop = $('#icon-color-popover');
        const trig = $('#icon-color-trigger');
        if (pop) {
            const next = !pop.hidden;
            pop.hidden = next;
            trig?.setAttribute('aria-expanded', String(!next));
        }
        return;
    }
    if (!t.closest('.icon-color-picker-wrap')) closeIconColorPopover();
});
$('#icon-random-btn')?.addEventListener('click', () => {
    if (activeIconTab === 'icons' && typeof ArchitectIcons !== 'undefined') {
        const list = ArchitectIcons.VECTOR_ICONS;
        const pick = list[Math.floor(Math.random() * list.length)];
        if (pick) choosePageIcon(ArchitectIcons.makeSvgIconValue(pick.id, selectedIconColorKey));
        return;
    }
    const pick = emojiChoices[Math.floor(Math.random() * emojiChoices.length)];
    if (pick) choosePageIcon(pick[0]);
});
$('#icon-search').addEventListener('input', renderIconPicker);
$('#icon-upload').addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
        await ArchitectBackend.ingestLocalFile(file, { creator: getActorDisplayName(), tags: ['icon'], storageMode: state.assetStorageMode || 'local', previewPolicy: state.assetPreviewPolicy });
        const reader = new FileReader();
        reader.onload = () => choosePageIcon(String(reader.result || ''));
        reader.onerror = () => toast('Icon could not be read');
        reader.readAsDataURL(file);
    } catch {
        toast('Icon could not be saved locally');
    }
    event.target.value = '';
});
function uploadForBlock(b, p, targetType = 'image') {
    if (effectivePageReadOnly(p)) return;
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = targetType === 'image' ? 'image/*' : targetType === 'audio' ? 'audio/*' : targetType === 'video' ? 'video/*' : targetType === 'pdf' ? '.pdf,application/pdf' : '*/*';
    file.onchange = async () => {
        const f = file.files?.[0];
        if (!f) return;
        try {
            const rec = await ArchitectBackend.ingestLocalFile(f, {
                creator: getActorDisplayName(),
                storageMode: state.assetStorageMode || 'local',
                previewPolicy: state.assetPreviewPolicy
            });
            insertAssetIntoBlockTarget(rec, p, b);
        } catch (err) {
            toast(err?.message || 'Could not upload file');
        }
    };
    file.click();
}
function pageLinkVisible(p) { return p.blocks.some(b => b.type === 'page_link' && state.pages.some(x => x.id === b.targetId)); }
document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && !e.altKey && (key === 'z' || (key === 'y' && !e.shiftKey))) {
        const el = e.target instanceof Element ? e.target : null;
        if (el?.closest('dialog, input, textarea, select, .page-heading, .page-subtitle, .simple-table, .db-interactive-surface')) return;
        const ok = (key === 'y' || e.shiftKey) ? redoPageEdit() : undoPageEdit();
        if (ok) { e.preventDefault(); closeMenu(); }
        return;
    }
    if ((e.ctrlKey || e.metaKey) && key === 'n') {
        const bound = state?.userPreferences?.hotkeys?.['new-page'];
        if (typeof bound === 'string' && bound.toLowerCase() !== 'ctrl + n') return;
        e.preventDefault();
        const p = createPage(undefined);
        navigateToPage(p.id);
        return;
    }
    if (e.key === 'Escape') {
        if (activeRichPopoverEl) { closeRichPopover(); return; }
        if (activeMenu && !activeMenu.hidden) { closeMenu(); return; }
        if (document.querySelector('.db-popover')) { ArchitectDatabase.closeDbPopover(); return; }
        if (ArchitectDatabase.isPeekOpen()) { ArchitectDatabase.closeDatabasePeek(); return; }
        if (editingCommentMsgId) { editingCommentMsgId = null; syncCommentViews(); return; }
        if (!$('#comment-popover')?.hidden || commentPopoverState) { hideCommentPopover(); return; }
        if (!$('#selection-toolbar')?.hidden) { closeSelectionToolbar(); return; }
        if (!$('#comments-drawer')?.hidden) { toggleCommentsDrawer(false); return; }
    }
});

let internalClipboardText = '';
function captureContextSnapshot(rawTarget) {
    const inputEl = rawTarget?.closest?.('input, textarea');
    if (inputEl && !inputEl.disabled) {
        const s = inputEl.selectionStart ?? inputEl.value.length;
        const end = inputEl.selectionEnd ?? inputEl.value.length;
        return { kind: 'input', el: inputEl, start: s, end, selectedText: inputEl.value.slice(s, end), isReadOnly: !!inputEl.readOnly };
    }
    const sel = getSelection();
    const range = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    const ceEl = rawTarget?.closest?.('[contenteditable="true"]');
    return {
        kind: ceEl ? 'ce' : 'doc',
        el: ceEl || rawTarget,
        range,
        selectedText: range ? range.toString() : ''
    };
}
function restoreContextSnapshot(snap) {
    if (!snap) return;
    if (snap.kind === 'input' && snap.el?.isConnected) {
        snap.el.focus({ preventScroll: true });
        try { snap.el.setSelectionRange(snap.start, snap.end); } catch {}
        return;
    }
    if (snap.range && snap.el?.isConnected) {
        if (snap.kind === 'ce') snap.el.focus?.({ preventScroll: true });
        const sel = getSelection();
        sel.removeAllRanges();
        try { sel.addRange(snap.range); } catch {}
    }
}
async function contextCopy(snap) {
    const txt = snap?.selectedText || '';
    if (!txt) return;
    internalClipboardText = txt;
    try { await navigator.clipboard?.writeText(txt); } catch {}
    toast('Copied');
}
async function contextCut(snap) {
    if (!snap || snap.isReadOnly) return;
    const txt = snap.selectedText || '';
    if (txt) {
        internalClipboardText = txt;
        try { await navigator.clipboard?.writeText(txt); } catch {}
    }
    restoreContextSnapshot(snap);
    if (snap.kind === 'input' && snap.el?.isConnected && txt) {
        const el = snap.el;
        el.setRangeText('', snap.start, snap.end, 'end');
        el.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (snap.kind === 'ce' && snap.range && !snap.range.collapsed) {
        document.execCommand('delete');
        snap.el.dispatchEvent(new Event('input', { bubbles: true }));
    }
}
async function contextPaste(snap) {
    if (!snap || snap.isReadOnly || (snap.kind === 'ce' && effectivePageReadOnly(current()))) return;
    let text = '';
    try { text = (await navigator.clipboard?.readText()) || ''; } catch {}
    if (!text) text = internalClipboardText;
    restoreContextSnapshot(snap);
    if (snap.kind === 'input' && snap.el?.isConnected) {
        const el = snap.el;
        el.setRangeText(text, snap.start, snap.end, 'end');
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return;
    }
    if (snap.kind === 'ce') {
        if (text) {
            document.execCommand('insertText', false, text);
            snap.el.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            try { document.execCommand('paste'); } catch {}
        }
    }
}
function contextSelectAll(snap) {
    if (snap?.kind === 'input' && snap.el?.isConnected) {
        snap.el.focus({ preventScroll: true });
        snap.el.select();
        return;
    }
    if (snap?.kind === 'ce' && snap.el?.isConnected) {
        if (snap.el.closest?.('.block-editor')) { selectAllPageText(); return; }
        snap.el.focus({ preventScroll: true });
        const r = document.createRange(); r.selectNodeContents(snap.el);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
        return;
    }
    selectAllPageText();
}
function showCustomContextMenu(event, sections, heading = null) {
    closeMenu();
    ArchitectDatabase?.closeDbPopover?.();
    const rawTarget = event.target instanceof Element ? event.target : null;
    const modalDialog = rawTarget?.closest?.('dialog[open]');
    const menu = $('#command-menu');
    menu.className = 'command-menu context-menu';
    menu.replaceChildren();
    if (modalDialog && menu.parentElement !== modalDialog) modalDialog.append(menu);
    else if (!modalDialog && menu.parentElement !== document.body) document.body.append(menu);

    if (heading?.title) {
        const h = document.createElement('div');
        h.className = 'menu-heading';
        if (heading.icon) {
            const ic = document.createElement('span');
            ic.className = 'menu-heading-icon';
            ic.innerHTML = heading.icon;
            h.append(ic);
        }
        const t = document.createElement('strong');
        t.textContent = heading.title;
        h.append(t);
        menu.append(h);
    }

    const list = document.createElement('div');
    list.className = 'command-list';
    const validSections = (sections || []).filter(sec => sec.items?.length);
    validSections.forEach((sec, sIdx) => {
        if (sIdx > 0) {
            const div = document.createElement('div');
            div.className = 'menu-divider';
            list.append(div);
        }
        if (sec.label) {
            const grpLabel = document.createElement('div');
            grpLabel.className = 'command-group-label';
            grpLabel.textContent = sec.label;
            list.append(grpLabel);
        }
        sec.items.forEach(item => {
            const row = menuRow(item.label, menuGlyph(item.label, item.iconKey), item.run, item.meta || '', item.shortcut || '');
            if (item.danger) row.classList.add('command-row-danger');
            list.append(row);
        });
    });
    menu.append(list);
    placeFloatingMenu(menu, event.clientX + 2, event.clientY + 2);
    menuIndex = -1;
    refreshMenuSelection();
    activeMenu = menu;
}
function handleDocumentContextMenu(event) {
    event.preventDefault();
    const rawTarget = event.target instanceof Element ? event.target : null;
    if (!rawTarget) return;
    const ro = effectivePageReadOnly(current());
    const snap = captureContextSnapshot(rawTarget);
    const { tabs } = ensureTabs();

    // 1. Tab right-click
    const tabEl = rawTarget.closest('.app-tab[data-tab-id]');
    if (tabEl) {
        const tabId = tabEl.dataset.tabId;
        const tab = tabs.find(t => t.id === tabId);
        const tabPage = tab ? state.pages.find(pg => pg.id === tab.pageId) : null;
        const tabIdx = tabs.findIndex(t => t.id === tabId);
        showCustomContextMenu(event, [
            {
                items: [
                    { label: 'New tab', shortcut: 'Ctrl+T', run: () => createNewBlankTab() },
                    { label: 'Duplicate tab', run: () => duplicateTab(tabId) },
                    { label: tab?.pinned ? 'Unpin tab' : 'Pin tab', run: () => togglePinTab(tabId) }
                ]
            },
            {
                items: [
                    ...(!tab?.pinned ? [{ label: 'Close tab', run: () => closeTab(tabId) }] : []),
                    ...(tabs.length > 1 ? [{ label: 'Close other tabs', run: () => closeOtherTabs(tabId) }] : []),
                    ...(tabIdx >= 0 && tabIdx < tabs.length - 1 ? [{ label: 'Close tabs to the right', run: () => closeTabsToRight(tabId) }] : [])
                ]
            }
        ], { title: tabPage?.title || 'Tab', icon: tabPage ? pageIconMarkup(tabPage.icon) : '' });
        return;
    }

    if (rawTarget.closest('#app-tab-bar')) {
        showCustomContextMenu(event, [{
            items: [
                { label: 'New tab', shortcut: 'Ctrl+T', run: () => createNewBlankTab() },
                ...(activeTab() ? [{ label: 'Duplicate tab', run: () => duplicateTab(activeTab().id) }] : [])
            ]
        }]);
        return;
    }

    // 2. Database header or row/card/pill
    const dbThBtn = rawTarget.closest('.db-th')?.querySelector('.db-th-btn');
    if (dbThBtn instanceof HTMLElement) { dbThBtn.click(); return; }
    const dbAddBtn = rawTarget.closest('.db-th-add')?.querySelector('.db-th-add-btn');
    if (dbAddBtn instanceof HTMLElement) { dbAddBtn.click(); return; }

    const dbWrap = rawTarget.closest('.db-view-wrap[data-db-page-id]');
    const dbRowEl = rawTarget.closest('[data-row-id]');
    if (dbRowEl && dbWrap) {
        const dbPage = state.pages.find(pg => pg.id === dbWrap.dataset.dbPageId);
        const rowPage = state.pages.find(pg => pg.id === dbRowEl.dataset.rowId);
        if (dbPage && rowPage) {
            const editItems = [];
            if (snap.kind === 'input' || snap.selectedText) {
                if (snap.selectedText) editItems.push({ label: 'Copy', shortcut: 'Ctrl+C', run: () => contextCopy(snap) });
                if (snap.kind === 'input' && !snap.isReadOnly) {
                    if (snap.selectedText) editItems.push({ label: 'Cut', shortcut: 'Ctrl+X', run: () => contextCut(snap) });
                    editItems.push({ label: 'Paste', shortcut: 'Ctrl+V', run: () => contextPaste(snap) });
                    editItems.push({ label: 'Select all', shortcut: 'Ctrl+A', run: () => contextSelectAll(snap) });
                }
            }
            showCustomContextMenu(event, [
                ...(editItems.length ? [{ items: editItems }] : []),
                {
                    items: [
                        { label: 'Open in Peek', run: () => ArchitectDatabase.openDatabaseRow(rowPage, dbPage) },
                        { label: 'Open as full page', run: () => ArchitectDatabase.openDatabaseRow(rowPage, dbPage, undefined, 'full_page') },
                        { label: 'Open in new tab', run: () => openPageInNewTab(rowPage.id) },
                        { label: 'Copy link', run: () => copyPageLink(rowPage) }
                    ]
                },
                ...(!ro ? [{
                    items: [
                        { label: 'Duplicate row', iconKey: 'Duplicate', run: () => { ArchitectDatabase.createDatabaseRow(dbPage, { ...(rowPage.propertyValues || {}), prop_title: `${rowPage.title || 'Untitled'} (copy)` }, rowPage.blocks || [], rowPage.icon); save(); ArchitectDatabase.refreshAllDatabaseViews(); } },
                        { label: 'Delete row', iconKey: 'Delete', danger: true, run: () => { ArchitectDatabase.deleteDatabaseRow(rowPage.id); save(); ArchitectDatabase.refreshAllDatabaseViews(); } }
                    ]
                }] : [])
            ], { title: rowPage.title || 'Untitled', icon: pageIconMarkup(rowPage.icon) });
            return;
        }
    }

    // 3. Breadcrumb page links
    const crumbBtn = rawTarget.closest('.breadcrumb-ancestor[data-page-id]');
    if (crumbBtn) {
        const target = state.pages.find(pg => pg.id === crumbBtn.dataset.pageId);
        if (target) {
            showCustomContextMenu(event, [{
                items: [
                    { label: 'Open page', run: () => navigateToPage(target.id) },
                    { label: 'Open in new tab', run: () => openPageInNewTab(target.id) },
                    { label: 'Copy link', run: () => copyPageLink(target) }
                ]
            }], { title: target.title || 'Untitled', icon: pageIconMarkup(target.icon) });
            return;
        }
    }

    // 4. Simple table cell
    const simpleTable = rawTarget.closest('.simple-table');
    if (simpleTable) {
        const clipItems = [];
        if (snap.selectedText) clipItems.push({ label: 'Copy', shortcut: 'Ctrl+C', run: () => contextCopy(snap) });
        if (!ro) {
            if (snap.selectedText) clipItems.push({ label: 'Cut', shortcut: 'Ctrl+X', run: () => contextCut(snap) });
            clipItems.push({ label: 'Paste', shortcut: 'Ctrl+V', run: () => contextPaste(snap) });
            clipItems.push({ label: 'Add row', run: () => simpleTable.closest('.block.table')?.querySelector('.add-table-row')?.click() });
        }
        showCustomContextMenu(event, [{ items: clipItems }]);
        return;
    }

    // 5. Images & links
    const imgEl = rawTarget.closest('img.content-image, #lightbox-img, .assets-preview img, img');
    const linkEl = rawTarget.closest('a[href]');
    const mediaSection = [];
    if (imgEl?.getAttribute('src')) {
        const src = imgEl.getAttribute('src');
        mediaSection.push({ label: 'Copy image URL', run: async () => { internalClipboardText = src; try { await navigator.clipboard?.writeText(src); } catch {} toast('Image URL copied'); } });
    }
    if (linkEl) {
        const href = linkEl.getAttribute('href') || '';
        const linkedId = linkEl.closest('.block.page_link') ? blockContext(linkEl.closest('.block'))?.item?.targetId : null;
        if (linkedId) {
            const linkedPage = state.pages.find(pg => pg.id === linkedId);
            if (linkedPage) {
                mediaSection.push({ label: 'Open page', run: () => navigateToPage(linkedPage.id) });
                mediaSection.push({ label: 'Open in new tab', run: () => openPageInNewTab(linkedPage.id) });
            }
        } else if (/^https?:\/\//i.test(href)) {
            mediaSection.push({ label: 'Open link', run: () => window.open(href, '_blank', 'noopener,noreferrer') });
            mediaSection.push({ label: 'Copy link', run: async () => { internalClipboardText = href; try { await navigator.clipboard?.writeText(href); } catch {} toast('Link copied'); } });
        }
    }

    // 6. Editable text / selection anywhere (inputs, textareas, page title, modals, comments)
    const editItems = [];
    if (snap.selectedText) editItems.push({ label: 'Copy', shortcut: 'Ctrl+C', run: () => contextCopy(snap) });
    if ((snap.kind === 'input' && !snap.isReadOnly) || (snap.kind === 'ce' && !ro)) {
        if (snap.selectedText) editItems.push({ label: 'Cut', shortcut: 'Ctrl+X', run: () => contextCut(snap) });
        editItems.push({ label: 'Paste', shortcut: 'Ctrl+V', run: () => contextPaste(snap) });
        editItems.push({ label: 'Select all', shortcut: 'Ctrl+A', run: () => contextSelectAll(snap) });
    }

    // 7. Board canvas / items right-click
    const boardShell = rawTarget.closest('.board-shell[data-board-page-id]') as HTMLElement | null;
    if (boardShell) {
        const bp = state.pages.find(pg => pg.id === boardShell.dataset.boardPageId && ArchitectBoard.isBoardPage(pg));
        if (bp) {
            const nodeEl = rawTarget.closest('.board-node[data-board-node-id]') as HTMLElement | null;
            const nodeObj = nodeEl ? (bp.board?.nodes || []).find(n => n.id === nodeEl.dataset.boardNodeId) : null;
            if (nodeObj) {
                const items: any[] = [];
                if (nodeObj.kind === 'page_link' && nodeObj.pageId) {
                    items.push({ label: 'Open page', run: () => navigateToPage(nodeObj.pageId) });
                    items.push({ label: 'Open in new tab', run: () => openPageInNewTab(nodeObj.pageId) });
                }
                if (!ro) {
                    items.push({
                        label: 'Duplicate item',
                        iconKey: 'Duplicate',
                        run: () => {
                            const copy = JSON.parse(JSON.stringify(nodeObj));
                            copy.id = `bn-${id()}`;
                            copy.x += 24; copy.y += 24;
                            bp.board.nodes.push(copy);
                            save(true);
                            ArchitectBoard.refreshBoardInstances(bp.id);
                        }
                    });
                    items.push({
                        label: 'Delete item',
                        iconKey: 'Delete',
                        danger: true,
                        run: () => {
                            bp.board.nodes = (bp.board.nodes || []).filter(n => n.id !== nodeObj.id);
                            bp.board.edges = (bp.board.edges || []).filter(e => e.fromId !== nodeObj.id && e.toId !== nodeObj.id);
                            save(true);
                            ArchitectBoard.refreshBoardInstances(bp.id);
                        }
                    });
                }
                if (items.length) { showCustomContextMenu(event, [{ items }]); return; }
            }
            showCustomContextMenu(event, [{
                items: [
                    { label: 'Open board as full page', run: () => navigateToPage(bp.id) },
                    { label: 'Open in new tab', run: () => openPageInNewTab(bp.id) },
                    ...(!ro ? [{ label: 'Insert from Asset library', run: () => openAssetLibrary(null, { onSelectAsset: asset => ArchitectBoard.insertAssetNodeIntoBoard(bp, asset) }) }] : [])
                ]
            }]);
            return;
        }
    }

    // 8. Sidebar empty space
    if (rawTarget.closest('#sidebar, #feature-rail')) {
        showCustomContextMenu(event, [
            ...(editItems.length ? [{ items: editItems }] : []),
            {
                items: [
                    ...(!ro && userHasGlobalPerm('createPages') ? [{ label: 'New page', shortcut: 'Ctrl+N', run: () => { const p = createPage(undefined); navigateToPage(p.id); } },
                               { label: 'New board', run: () => { const bd = ArchitectBoard.createBoardPage(undefined, 'Untitled board'); navigateToPage(bd.id); } },
                               { label: 'New database', run: () => { const db = ArchitectDatabase.createDatabasePage(undefined, 'Untitled database'); save(); navigateToPage(db.id); } }] : []),
                    { label: 'New tab', shortcut: 'Ctrl+T', run: () => createNewBlankTab() },
                    { label: 'Search workspace', shortcut: 'Ctrl+K', run: () => openSearch() },
                    ...(isAdminAuthorized(getCurrentActorUser()) ? [{ label: 'Workspace settings', run: () => openWorkspaceSettings() }] : []),
                    { label: 'User settings', run: () => ArchitectToolbar.openUserSettings() }
                ]
            }
        ]);
        return;
    }

    // 9. General page / modal / fallback menu (guarantees native browser menu NEVER shows)
    const page = current();
    const generalItems = [
        { label: 'New tab', shortcut: 'Ctrl+T', run: () => createNewBlankTab() },
        ...(historyIndex > 0 ? [{ label: 'Back', shortcut: 'Alt+←', run: () => navigateHistory(-1) }] : []),
        ...(historyIndex < pageHistory.length - 1 ? [{ label: 'Forward', shortcut: 'Alt+→', run: () => navigateHistory(1) }] : []),
        ...(!ro && page && !rawTarget.closest('dialog[open]') ? [
            { label: 'Comment', run: () => focusTopCommentComposer() },
            ...(!ArchitectDatabase.isDatabasePage(page) && !ArchitectBoard.isBoardPage(page) ? [{ label: 'Add block', run: () => { pushUndoBeforeEdit(page); const b = block('text'); page.blocks.push(b); save(); render(); focusBlockById(b.id); } }] : []),
            { label: 'Duplicate page', iconKey: 'Duplicate', run: () => duplicatePage(page) }
        ] : []),
        ...(page && !rawTarget.closest('dialog[open]') ? [
            { label: 'Copy link', run: () => copyPageLink(page) },
            { label: 'Toggle full width', run: () => { page.fullWidth = !page.fullWidth; save(); render(); } }
        ] : [])
    ];

    showCustomContextMenu(event, [
        ...(mediaSection.length ? [{ items: mediaSection }] : []),
        ...(editItems.length ? [{ items: editItems }] : []),
        ...(generalItems.length ? [{ items: generalItems }] : [])
    ]);
}
document.addEventListener('contextmenu', event => { event.preventDefault(); }, true);
document.addEventListener('contextmenu', handleDocumentContextMenu);

ArchitectDatabase.initHost({
    getState: () => state,
    getCurrentUser: () => getActorDisplayName(),
    save: force => save(force),
    render: () => render(),
    renderNav: () => renderNav(),
    navigateToPage: pageId => navigateToPage(pageId),
    openPageInNewTab: (pageId, opts) => openPageInNewTab(pageId, opts),
    isReadOnlyMirror: () => effectivePageReadOnly(current()),
    isPageReadOnly: page => effectivePageReadOnly(page || current()),
    canViewPage: page => !page || resolvePagePermissions(page).view,
    openAssetLibrary: assetId => openAssetLibrary(assetId),
    toast: msg => toast(msg),
    iconPicker: page => iconPicker(page),
    iconPickerForValue: (currentVal: string | undefined, allowEmpty: boolean, cb: (val: string) => void) => iconPickerForCallback(currentVal, allowEmpty, cb),
    iconMarkup: (val?: string) => (val ? pageIconMarkup(val) : ''),
    pushChatMessage: (opts: any) => pushWorkspaceChatMessage(opts),
    pushNotification: item => pushInboxNotification({ ...(item || {}), kind: (item?.kind || 'database') as any })
});
(window as any).ArchitectWorkspace = {
    applyImportedDefaultPermissions,
    importExternalPages,
    pushWorkspaceChatMessage,
    checkDueReminders,
    openVersionHistoryModal,
    openPageAnalyticsModal,
    togglePagePublish,
    toggleDocsNotificationsPopover,
    getState: () => state,
    render: () => render(),
    save: (force?: boolean) => save(!!force),
    openPage: (pageId: string) => navigateToPage(pageId)
};
ArchitectBoard.initHost({
    getPages: () => state.pages,
    getCurrentPage: () => current(),
    getCurrentUser: () => getActorDisplayName(),
    isReadOnlyMirror: () => effectivePageReadOnly(current()),
    isPageReadOnly: page => effectivePageReadOnly(page || current()),
    canViewPage: page => !page || resolvePagePermissions(page).view,
    commitChange: (_page, force) => {
        save(!!force);
        renderNav();
    },
    navigateToPage: (pageId, newTab) => newTab ? openPageInNewTab(pageId) : navigateToPage(pageId),
    openLightbox: (asset, fallbackUrl, name) => openImageLightbox(asset || { name: name || 'Image', url: fallbackUrl }),
    downloadAsset: (asset, fallbackUrl, name) => downloadAssetOrBlock(asset, { url: fallbackUrl, text: name }, name),
    createAudioPlayer: (asset, fallbackUrl, title) => {
        const enriched = asset || { id: id(), name: title || 'Audio', category: 'audio', fileType: 'audio/mpeg', url: fallbackUrl || '' };
        return buildAudioPlayerElement(enriched);
    },
    ingestLocalFile: file => ArchitectBackend.ingestLocalFile(file, {
        creator: getActorDisplayName(),
        storageMode: state.assetStorageMode || 'local',
        previewPolicy: state.assetPreviewPolicy
    }),
    findAssetById: (assetId, url) => {
        const all = ArchitectBackend.readAssetCatalog();
        if (assetId) return all.find(a => a.id === assetId) || null;
        if (url) return all.find(a => a.url === url || a.externalUrl === url || a.previewDataUrl === url) || null;
        return null;
    },
    resolveAssetOriginalUrl: asset => ArchitectBackend.resolveAssetOriginalUrl(asset),
    resolveAssetPreviewUrl: asset => ArchitectBackend.resolveAssetPreviewUrl(asset),
    openAssetPicker: (boardPage, pos) => {
        openAssetLibrary(null, {
            onSelectAsset: asset => ArchitectBoard.insertAssetNodeIntoBoard(boardPage, asset, pos)
        });
    },
    openPagePicker: (boardPage, pos, anchorEl) => {
        const menu = $('#command-menu');
        menu.className = 'command-menu';
        menu.replaceChildren();
        const heading = document.createElement('div');
        heading.className = 'menu-heading';
        heading.innerHTML = '<strong>Link page onto board</strong>';
        const list = document.createElement('div');
        list.className = 'command-list';
        state.pages.filter(pg => pg.id !== boardPage.id && !pg.databaseId && resolvePagePermissions(pg).view).slice(0, 20).forEach(pg => {
            list.append(menuRow(pg.title || 'Untitled', `<span class="command-icon">${pageIconMarkup(pg.icon)}</span>`, () => {
                ArchitectBoard.insertPageLinkNodeIntoBoard(boardPage, pg, pos);
            }));
        });
        menu.append(heading, list);
        placeFloatingMenu(menu, anchorEl?.getBoundingClientRect?.().left || 320, (anchorEl?.getBoundingClientRect?.().bottom || 120) + 4);
        menuIndex = 0;
        refreshMenuSelection();
        activeMenu = menu;
    },
    openPopoverMenu: (anchorEl, items) => {
        const menu = $('#command-menu');
        menu.className = 'command-menu';
        menu.replaceChildren();
        const list = document.createElement('div');
        list.className = 'command-list';
        items.forEach(item => list.append(menuRow(item.label, menuGlyph('Board'), item.run)));
        menu.append(list);
        placeFloatingMenu(menu, anchorEl?.getBoundingClientRect?.().left || 320, (anchorEl?.getBoundingClientRect?.().bottom || 120) + 4);
        menuIndex = 0;
        refreshMenuSelection();
        activeMenu = menu;
    },
    toast: msg => toast(msg)
});
ArchitectToolbar.initHost({
    getState: () => state,
    getCurrentUser: () => getActorDisplayName(),
    save: force => save(force),
    render: () => render(),
    toast: msg => toast(msg),
    isReadOnlyMirror: () => effectivePageReadOnly(current()),
    isToolbarAllowed: () => {
        if (currentAppMode !== 'notion') return false;
        const pg = current();
        if (!pg) return true;
        if (effectivePageReadOnly(pg)) return false;
        if (typeof ArchitectDatabase !== 'undefined' && ArchitectDatabase.isDatabasePage(pg)) return false;
        if (typeof ArchitectBoard !== 'undefined' && ArchitectBoard.isBoardPage(pg)) return false;
        return true;
    },
    getColors: () => BLOCK_COLORS,
    getLastUsedColor: () => lastUsedColor,
    getFormattingContext: () => getToolbarFormattingContext(),
    undo: () => { if (undoPageEdit()) closeMenu(); },
    redo: () => { if (redoPageEdit()) closeMenu(); },
    applyInlineFormat: cmd => toolbarApplyInlineCommand(cmd),
    applyInlineCode: () => toolbarApplyInlineCode(),
    applyTextCase: mode => toolbarApplyTextCase(mode),
    applyColor: (kind, key) => toolbarApplyColor(kind, key),
    applyFontChoice: fontKey => toolbarApplyFontChoice(fontKey),
    setBlockType: (t, opts) => toolbarSetBlockType(t, opts),
    setBlockAlignment: align => toolbarSetBlockAlignment(align),
    applyCalloutOrQuote: v => toolbarApplyCalloutOrQuote(v),
    insertSimpleTable: () => toolbarInsertSimpleTable(),
    clearFormatting: () => toolbarClearFormatting(),
    toggleFormatPainter: () => toolbarToggleFormatPainter(),
    isFormatPainterArmed: () => formatPainterArmed,
    indentList: delta => {
        const info = getActiveFormattingTarget();
        if (info) adjustListIndent(info.ctx, info.target, delta, info.blockEl);
    },
    insertDividerBlock: () => {
        const info = getActiveFormattingTarget();
        if (!info) return;
        pushUndoBeforeEdit(info.ctx.page);
        const d = block('divider');
        info.ctx.list.splice(info.ctx.index + 1, 0, d);
        save(); render();
    },
    insertColumnsBlock: (count = 2) => {
        const info = getActiveFormattingTarget();
        if (!info) return;
        pushUndoBeforeEdit(info.ctx.page);
        const col = { id: id(), type: 'columns', text: '', children: Array.from({ length: count }, () => ({ id: id(), type: 'text', text: '', children: [block('text', '')] })), columnWidths: Array(count).fill(100 / count) };
        info.ctx.list.splice(info.ctx.index + 1, 0, col);
        save(); render();
        focusBlockById(col.children[0].children[0].id);
    },
    insertLinkOnSelection: () => {
        const info = getActiveFormattingTarget();
        if (info && info.ctx.item.type !== 'code') runSelectionFormatAction(info.ctx.page, info.ctx.item, info.range, 'link');
    },
    insertInlineMath: () => {
        const info = getActiveFormattingTarget();
        if (info && info.ctx.item.type !== 'code') runSelectionFormatAction(info.ctx.page, info.ctx.item, info.range, 'inline-math');
    },
    insertEmbedBlock: () => {
        const info = getActiveFormattingTarget();
        if (!info) return;
        pushUndoBeforeEdit(info.ctx.page);
        const emb: Block = { id: id(), type: 'embed', text: 'Embed', url: '', linkDisplayMode: 'embed' };
        if (!info.ctx.item.text?.trim() && info.ctx.item.type === 'text') info.ctx.list.splice(info.ctx.index, 1, emb);
        else info.ctx.list.splice(info.ctx.index + 1, 0, emb);
        save(); render();
        requestAnimationFrame(() => (editor.querySelector(`[data-block-id="${CSS.escape(emb.id)}"] .link-block-url-input`) as HTMLInputElement | null)?.focus());
    },
    insertDateBlock: () => {
        const info = getActiveFormattingTarget();
        if (!info) return;
        const d = prompt('Enter date', new Date().toLocaleDateString());
        if (!d) return;
        pushUndoBeforeEdit(info.ctx.page);
        const db = { id: id(), type: 'date', text: d };
        if (!info.ctx.item.text?.trim() && info.ctx.item.type === 'text') info.ctx.list.splice(info.ctx.index, 1, db);
        else info.ctx.list.splice(info.ctx.index + 1, 0, db);
        save(); render();
    },
    commentSelectionOrBlock: () => {
        const info = getActiveFormattingTarget();
        if (info) triggerSelectionOrBlockComment(info.ctx.page, info.ctx.item, info.blockEl);
        else focusTopCommentComposer();
    },
    updateUserName: name => {
        state.users = state.users || [];
        const actor = getCurrentActorUser();
        const target = (actor && state.users.find(u => u.id === actor.id)) || state.users[0];
        if (target) {
            target.name = name;
            target.linkedAccount = name;
        } else {
            state.users.push({ id: 'user.local', name, linkedAccount: name, roleId: 'role-admin', roleIds: ['role-admin'] });
        }
        setLoggedInAccountName(name);
        save(true);
        syncUserProfileUi();
        toast(`Updated profile name to ${name}`);
    }
});
let coverResizeFrame = 0;
window.addEventListener('resize', () => { cancelAnimationFrame(coverResizeFrame); coverResizeFrame = requestAnimationFrame(() => { const page = current(), cover = document.querySelector('.page-cover'); if (cover && pageHasCover(page)) applyCoverBackground(cover, page); if ($('#cover-dialog').open) positionCoverCrop(); layoutRightComments(page); if (commentPopoverState) renderCommentPopover(); }); });
const initialParams = new URLSearchParams(location.hash.replace(/^#/, ''));
const initialPageId = initialParams.get('page'), initialBlockId = initialParams.get('block'), initialInviteCode = initialParams.get('invite');
if (initialPageId && state.pages.some(page => page.id === initialPageId)) {
    state.activePageId = initialPageId;
    const matchTab = state.tabs?.find(t => t.pageId === initialPageId);
    if (matchTab) state.activeTabId = matchTab.id;
    else ensureTabs();
    pageHistory = [initialPageId];
    historyIndex = 0;
} else {
    ensureTabs();
}
function handleInviteHash(inviteCode: string | null) {
    if (!inviteCode) return;
    requestAnimationFrame(() => {
        openFullMemberManagerDialog();
        const codeInp = $('#mm-redeem-code') as HTMLInputElement | null;
        if (codeInp) { codeInp.value = inviteCode; ($('#mm-redeem-account') as HTMLInputElement | null)?.focus(); }
    });
}
window.addEventListener('hashchange', () => { const params = new URLSearchParams(location.hash.replace(/^#/, '')), pageId = params.get('page'), inviteCode = params.get('invite'); if (pageId) navigateToPage(pageId); const blockId = params.get('block'); if (blockId) requestAnimationFrame(() => { focusLinkedBlock(blockId); try { history.replaceState(null, '', pageHref(current().id, blockId)); } catch { } }); if (inviteCode) handleInviteHash(inviteCode); });
render();
if (current()?.published) recordPublishedPageView(current());
flushScheduledNotifications(state, true, true);
checkDueReminders(state, true);
setInterval(() => { flushScheduledNotifications(state, true, true); checkDueReminders(state, true); }, 5000);
if (initialInviteCode) handleInviteHash(initialInviteCode);
if (initialBlockId) { try { history.replaceState(null, '', pageHref(state.activePageId, initialBlockId)); } catch { } requestAnimationFrame(() => focusLinkedBlock(initialBlockId)); } else syncPageUrl(state.activePageId);
scheduleAutoSync();
if (state.coordinationMode === 'cloud-sync') runSyncPull(false);
if (ArchitectBackend.host()) {
    Promise.all([
        ArchitectBackend.host().readWorkspace().catch(() => null),
        ArchitectBackend.hydrateAssetsFromHost().catch(() => false)
    ]).then(([raw, assetsHydrated]) => {
        let changed = !!assetsHydrated;
        let pulledDiskState = false;
        if (raw) {
            try {
                const diskState = ensureWorkspaceDefaults(JSON.parse(raw));
                if (diskState.version === 2 && Array.isArray(diskState.pages) && diskState.pages.length) {
                    state = diskState;
                    ArchitectBackend.setPreviewPolicy(state.assetPreviewPolicy);
                    localStorage.setItem(STORE, JSON.stringify(state));
                    scheduleAutoSync();
                    changed = true;
                    pulledDiskState = true;
                }
            } catch {}
        } else {
            ArchitectBackend.host().writeWorkspace(JSON.stringify(state)).catch(() => {});
        }
        if (changed) {
            render();
            if (pulledDiskState && state.coordinationMode === 'cloud-sync') runSyncPull(false);
        }
    }).catch(() => {});
}

