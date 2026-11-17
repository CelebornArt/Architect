// @ts-nocheck
type BlockType = 'text'|'h1'|'h2'|'h3'|'bullet'|'numbered'|'todo'|'toggle'|'quote'|'callout'|'divider'|'page_link'|'mention'|'code'|'image'|'file'|'bookmark'|'video'|'audio'|'embed'|'equation'|'columns'|'table'|'toc'|'breadcrumb'|'button'|'date';
type Block = { id:string; type:BlockType; text:string; html?:string; checked?:boolean; targetId?:string; url?:string; language?:string; children?:Block[]; columnWidths?:number[]; tableData?:{headers:string[];rows:string[][]}; mentions?:{kind:'page'|'person';id:string;label:string}[] };
type Page = { id:string; title:string; icon:string; parentId?:string; favorite?:boolean; cover?:string; coverX?:number; coverY?:number; coverZoom?:number; fullWidth?:boolean; showWordCount?:boolean; description?:string; properties?:DatabaseProperty[]; blocks:Block[]; createdAt:number; updatedAt:number };
type Workspace = { version:2; workspaceName:string; activePageId:string; pages:Page[]; users:{id:string;name:string}[] };
type PropertyType = 'text'|'status'|'select'|'date'|'number'|'person'|'url'|'email'|'phone'|'checkbox'|'files';
type DatabaseProperty = { id:string; name:string; type:PropertyType; value:string|number|boolean; options?:string[] };
const STORE = 'notion-clone-workspace-v2';
const oldStore = 'notion-clone-pages';
const RESET_MARKER = 'architect-fresh-workspace-reset-v1';
const RESET_BACKUP = 'architect-pre-fresh-reset-v1';
const id = () => crypto.randomUUID();
const block = (type, text = '') => ({ id: id(), type, text });
const starter = [{ id: 'home', title: 'New hub', icon: '📄', blocks: [block('text')], createdAt: Date.now(), updatedAt: Date.now() }];
function freshWorkspace(name = 'Acme Studio', users) { return { version: 2, workspaceName: name || 'Acme Studio', activePageId: 'home', pages: [{ id: 'home', title: 'New hub', icon: '📄', blocks: [block('text')], createdAt: Date.now(), updatedAt: Date.now() }], users: users || [{ id: 'jordan.davis', name: 'Jordan Davis' }, { id: 'alex.morgan', name: 'Alex Morgan' }, { id: 'sam.lee', name: 'Sam Lee' }] }; }
function applyFreshReset(workspace, originalRaw) { if (localStorage.getItem(RESET_MARKER) === 'done') return workspace; const existing = originalRaw || (workspace.pages.length > 1 || (workspace.pages[0]?.blocks || []).some(b => b.text) ? JSON.stringify(workspace) : null); try { if (existing) localStorage.setItem(RESET_BACKUP, existing); const fresh = freshWorkspace(workspace.workspaceName, workspace.users); localStorage.setItem(STORE, JSON.stringify(fresh)); localStorage.setItem(RESET_MARKER, 'done'); return fresh; } catch { return workspace; } }
function loadWorkspace() { try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
        const w = JSON.parse(raw);
        if (w.version === 2 && Array.isArray(w.pages))
            return applyFreshReset(w, raw);
    }
    const old = JSON.parse(localStorage.getItem(oldStore) || 'null');
    if (Array.isArray(old)) {
        const pages = old.map((p) => ({ id: p.id || id(), title: p.title || 'Untitled', icon: p.icon || '📄', parentId: p.parent || undefined, blocks: (p.blocks || []).map((b) => ({ id: id(), type: { paragraph: 'text' }[b.type] || b.type, text: b.text || '', checked: b.checked })), createdAt: Date.now(), updatedAt: Date.now() }));
        return applyFreshReset({ version: 2, workspaceName: 'Acme Studio', activePageId: localStorage.getItem('notion-clone-active') || pages[0]?.id, pages, users: [{ id: 'jordan.davis', name: 'Jordan Davis' }, { id: 'alex.morgan', name: 'Alex Morgan' }, { id: 'sam.lee', name: 'Sam Lee' }] }, JSON.stringify(old));
    }
}
catch { } return applyFreshReset({ version: 2, workspaceName: 'Acme Studio', activePageId: 'home', pages: starter, users: [{ id: 'jordan.davis', name: 'Jordan Davis' }, { id: 'alex.morgan', name: 'Alex Morgan' }, { id: 'sam.lee', name: 'Sam Lee' }] }, null); }
let state = loadWorkspace();
let pageHistory = [state.activePageId];
let historyIndex = 0;
let saveTimer;
let activeMenu = null;
let menuOptions = [];
let menuIndex = 0;
const $ = (s) => document.querySelector(s);
const editor = $('#editor');
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800); };
function current() { return state.pages.find(p => p.id === state.activePageId) || state.pages[0]; }
function countWords(page) { return [page.title, page.description || '', ...page.blocks.map(item => item.text || '')].join(' ').trim().split(/\s+/).filter(Boolean).length; }
function updatePageOptions() { const page = current(); const width = $('[data-action="toggle-width"]'), count = $('[data-action="toggle-word-count"]'); if (width) { width.textContent = `${page.fullWidth ? '✓ ' : ''}Full page width`; width.setAttribute('aria-pressed', String(!!page.fullWidth)); } if (count) { count.textContent = `${page.showWordCount ? '✓ ' : ''}Show word count`; count.setAttribute('aria-pressed', String(!!page.showWordCount)); } }
function updateHistoryControls() { const back = document.querySelector('[data-action="history-back"]'), forward = document.querySelector('[data-action="history-forward"]'); if (back) back.disabled = historyIndex <= 0; if (forward) forward.disabled = historyIndex >= pageHistory.length - 1; }
function pageHash(pageId, blockId) { return `page=${encodeURIComponent(pageId)}${blockId ? `&block=${encodeURIComponent(blockId)}` : ''}`; }
function pageHref(pageId, blockId) { const url = new URL(location.href); url.hash = pageHash(pageId, blockId); return url.href; }
function syncPageUrl(pageId) { try { history.replaceState(null, '', pageHref(pageId)); } catch { } }
function openPageInNewTab(pageId) { window.open(pageHref(pageId), '_blank', 'noopener'); }
function navigateToPage(pageId, record = true) { if (!state.pages.some(page => page.id === pageId)) return; if (record && state.activePageId !== pageId) { pageHistory = pageHistory.slice(0, historyIndex + 1); pageHistory.push(pageId); historyIndex = pageHistory.length - 1; } state.activePageId = pageId; syncPageUrl(pageId); save(); render(); updateHistoryControls(); }
function navigateHistory(delta) { const next = historyIndex + delta; if (next < 0 || next >= pageHistory.length) return; historyIndex = next; navigateToPage(pageHistory[historyIndex], false); }
function save() { current().updatedAt = Date.now(); $('#saved-status').textContent = 'Saving…'; clearTimeout(saveTimer); saveTimer = window.setTimeout(() => { localStorage.setItem(STORE, JSON.stringify(state)); $('#saved-status').textContent = 'All changes saved'; }, 180); }
const ASSET_STORE = 'workspace-assets';
let pendingWorkspaceImport = null;
let coverTargetPage = null;
let chosenCoverAsset = '';
let coverCropMetrics = null;
let iconTargetPage = null;
function openWorkspaceSettings() { $('#settings-workspace-name').value = state.workspaceName || ''; $('#settings-feedback').textContent = 'A backup includes your pages and locally uploaded assets.'; $('#import-workspace-file').value = ''; $('#apply-workspace-import').disabled = true; pendingWorkspaceImport = null; $('#export-pre-reset-backup').hidden = !localStorage.getItem(RESET_BACKUP); $('#settings-dialog').showModal(); setTimeout(() => $('#settings-workspace-name').focus(), 0); }
function exportWorkspaceBackup() { const payload = { format: 'architect-workspace-backup', formatVersion: 1, exportedAt: new Date().toISOString(), workspace: state, assets: JSON.parse(localStorage.getItem(ASSET_STORE) || '[]') }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${(state.workspaceName || 'architect-workspace').trim().replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'architect-workspace'}-backup-${new Date().toISOString().slice(0, 10)}.json`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); $('#settings-feedback').textContent = `Backup exported with ${state.pages.length} pages.`; }
function exportPreviousWorkspaceBackup() { try { const raw = localStorage.getItem(RESET_BACKUP); if (!raw) throw new Error('No previous-workspace backup was found.'); let workspace = JSON.parse(raw); if (Array.isArray(workspace)) workspace = { version: 2, workspaceName: 'Acme Studio', activePageId: workspace[0]?.id, pages: workspace.map(page => ({ id: page.id || id(), title: page.title || 'Untitled', icon: page.icon || '📄', parentId: page.parent, blocks: (page.blocks || []).map(item => ({ id: item.id || id(), type: item.type === 'paragraph' ? 'text' : item.type, text: item.text || '', checked: item.checked })), createdAt: Date.now(), updatedAt: Date.now() })), users: state.users }; if (workspace.version !== 2 || !Array.isArray(workspace.pages)) throw new Error('The preserved data is not a supported workspace backup.'); const payload = { format: 'architect-workspace-backup', formatVersion: 1, exportedAt: new Date().toISOString(), workspace, assets: readAssets() }; const link = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })); link.href = url; link.download = 'architect-previous-workspace-backup.json'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); $('#settings-feedback').textContent = 'Previous workspace backup exported.'; } catch (error) { $('#settings-feedback').textContent = error.message; } }
function decodeWorkspaceBackup(value) { const rawWorkspace = value?.format === 'architect-workspace-backup' && value.formatVersion === 1 ? value.workspace : value; if (!rawWorkspace || rawWorkspace.version !== 2 || !Array.isArray(rawWorkspace.pages) || rawWorkspace.pages.length === 0) throw new Error('This file is not a supported Architect workspace backup.'); const validImage = value => typeof value === 'string' && (/^data:image\/(png|jpeg|jpg|gif|webp);base64,[a-z0-9+/=]+$/i.test(value) || /^https?:\/\//i.test(value)); for (const page of rawWorkspace.pages) { if (!page || typeof page.id !== 'string' || typeof page.title !== 'string' || typeof page.icon !== 'string' || !Array.isArray(page.blocks)) throw new Error('The backup contains a page with missing required fields.'); if (/[<>"'`]/.test(page.icon)) throw new Error('The backup contains an invalid page icon.'); if (page.cover && !validImage(page.cover)) throw new Error(`The cover on “${page.title}” is not a supported image.`); for (const item of page.blocks) { if (!item || typeof item.id !== 'string' || typeof item.type !== 'string' || typeof item.text !== 'string') throw new Error(`The backup contains an invalid block on “${page.title}”.`); if (item.url && !validImage(item.url)) throw new Error(`The file on “${page.title}” has an unsupported URL.`); } } const workspace = JSON.parse(JSON.stringify(rawWorkspace)); if (!workspace.pages.some(page => page.id === workspace.activePageId)) workspace.activePageId = workspace.pages[0].id; workspace.users = Array.isArray(workspace.users) ? workspace.users : []; workspace.workspaceName = typeof workspace.workspaceName === 'string' && workspace.workspaceName.trim() ? workspace.workspaceName.trim() : 'Architect workspace'; const assets = value?.format === 'architect-workspace-backup' ? value.assets : []; if (assets !== undefined && !Array.isArray(assets)) throw new Error('The backup asset list is invalid.'); const safeAssets = (assets || []).map(asset => { if (!asset || typeof asset.name !== 'string' || !validImage(asset.url)) throw new Error('The backup contains an invalid asset.'); return { name: asset.name, url: asset.url }; }); return { workspace, assets: safeAssets }; }
function restoreWorkspaceBackup() { if (!pendingWorkspaceImport) return; if (!window.confirm('Restore this backup? It will replace the workspace currently saved on this device.')) return; const previousWorkspace = localStorage.getItem(STORE), previousAssets = localStorage.getItem(ASSET_STORE); try { clearTimeout(saveTimer); localStorage.setItem(STORE, JSON.stringify(pendingWorkspaceImport.workspace)); localStorage.setItem(ASSET_STORE, JSON.stringify(pendingWorkspaceImport.assets)); state = pendingWorkspaceImport.workspace; $('#settings-dialog').close(); render(); $('#settings-feedback').textContent = ''; toast('Workspace backup restored'); } catch (error) { try { previousWorkspace === null ? localStorage.removeItem(STORE) : localStorage.setItem(STORE, previousWorkspace); previousAssets === null ? localStorage.removeItem(ASSET_STORE) : localStorage.setItem(ASSET_STORE, previousAssets); } catch {} $('#settings-feedback').textContent = `Could not restore backup: ${error.message || 'storage is unavailable'}`; } }
function esc(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function cleanInlineHtml(html) { const doc=new DOMParser().parseFromString(html,'text/html'),allowed=new Set(['STRONG','B','EM','I','S','DEL','CODE','U','A','BR']);const walk=node=>Array.from(node.childNodes).map(child=>{if(child.nodeType===Node.TEXT_NODE)return esc(child.textContent||'');if(child.nodeType!==Node.ELEMENT_NODE)return '';const tag=child.tagName;if(!allowed.has(tag))return walk(child);if(tag==='BR')return '<br>';const content=walk(child);if(tag==='A'){const href=child.getAttribute('href')||'';try{const url=new URL(href,location.href);if(['http:','https:','mailto:'].includes(url.protocol))return `<a href="${esc(url.href)}" rel="noopener noreferrer">${content}</a>`}catch{}return content}return `<${tag.toLowerCase()}>${content}</${tag.toLowerCase()}>`}).join('');return walk(doc.body)}
function inlineMarkdownAtCaret(el) { const selection=getSelection();if(!selection?.rangeCount)return false;const active=selection.getRangeAt(0),node=active.startContainer,offset=active.startOffset;if(node.nodeType!==Node.TEXT_NODE)return false;const before=node.textContent.slice(0,offset),match=before.match(/(\*\*([^*]+)\*\*|\*([^*]+)\*|~~([^~]+)~~|`([^`]+)`)\s$/);if(!match)return false;const tag=match[2]?'strong':match[3]?'em':match[4]?'del':'code',content=match[2]||match[3]||match[4]||match[5],start=offset-match[0].length,suffix=node.textContent.slice(offset),parent=node.parentNode;if(start<0||!parent)return false;const formatted=document.createElement(tag);formatted.textContent=content;const space=document.createTextNode(' '),tail=suffix?document.createTextNode(suffix):null;node.textContent=node.textContent.slice(0,start);parent.insertBefore(formatted,node.nextSibling);parent.insertBefore(space,formatted.nextSibling);if(tail)parent.insertBefore(tail,space.nextSibling);const caret=document.createRange();caret.setStartAfter(space);caret.collapse(true);selection.removeAllRanges();selection.addRange(caret);return true}
function renderNav() { const nav=$('#page-list');nav.replaceChildren();state.expandedPageIds=state.expandedPageIds||[];const section=(label)=>{const wrap=document.createElement('section');wrap.className='outline-section';const heading=document.createElement('div');heading.className='nav-label';heading.textContent=label;const list=document.createElement('div');wrap.append(heading,list);nav.append(wrap);return list};const favorites=section('FAVORITES'),pages=section('WORKSPACE PAGES');const hasChildren=p=>state.pages.some(x=>x.parentId===p.id);const addRow=(p,container,depth=0,tree=false)=>{const row=document.createElement('div');row.className='page-nav'+(p.id===state.activePageId?' active':'');row.style.paddingLeft=`${7+depth*13}px`;const children=hasChildren(p);const arrow=document.createElement('button');arrow.type='button';arrow.className='page-expand'+(state.expandedPageIds.includes(p.id)?' expanded':'');arrow.textContent=children?'›':'';arrow.setAttribute('aria-label',state.expandedPageIds.includes(p.id)?'Collapse subpages':'Expand subpages');arrow.onclick=e=>{e.stopPropagation();if(!children)return;state.expandedPageIds.includes(p.id)?state.expandedPageIds=state.expandedPageIds.filter(id=>id!==p.id):state.expandedPageIds.push(p.id);save();renderNav()};const icon=document.createElement('span');icon.className='page-icon';icon.innerHTML=p.icon.startsWith('data:image')?`<img src="${p.icon}"/>`:esc(p.icon);const title=document.createElement('span');title.className='page-title';title.textContent=p.title;const more=document.createElement('button');more.type='button';more.className='page-more';more.title='Page actions';more.textContent='•••';more.onclick=e=>{e.stopPropagation();pageMenu(p,e.currentTarget)};row.append(arrow,icon,title,more);row.setAttribute('role','link');row.tabIndex=0;row.onclick=e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();openPageInNewTab(p.id);return;}navigateToPage(p.id)};row.onauxclick=e=>{if(e.button===1&&!e.target.closest('.page-more,.page-expand')){e.preventDefault();openPageInNewTab(p.id)}};row.addEventListener('mousedown',e=>{if(e.button===1&&!e.target.closest('.page-more,.page-expand'))e.preventDefault()});row.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();pageMenu(p,e)};row.onkeydown=e=>{if(e.target!==row)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();navigateToPage(p.id)}else if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){e.preventDefault();pageMenu(p,e.currentTarget)}};container.append(row);if(tree&&children&&state.expandedPageIds.includes(p.id))state.pages.filter(x=>x.parentId===p.id).forEach(child=>addRow(child,container,depth+1,true))};state.pages.filter(p=>p.favorite).sort((a,b)=>a.title.localeCompare(b.title)).forEach(p=>addRow(p,favorites,0,true));state.pages.filter(p=>!p.parentId).forEach(p=>addRow(p,pages,0,true));const ws=$('#workspace-access');if(ws){ws.innerHTML='';const button=document.createElement('button');button.className='workspace-access-item';button.innerHTML=`<span class="workspace-access-icon">N</span><span>${esc(state.workspaceName)}</span><span class="workspace-access-arrow">⌄</span>`;button.title='Workspaces you can access';ws.append(button)}}
function renderBreadcrumbs(p) { const target = $('#breadcrumbs'); target.replaceChildren(); const root = state.pages.find(page => !page.parentId && !page.shared); const rootButton = document.createElement('button'); rootButton.className = 'breadcrumb-ancestor'; rootButton.type = 'button'; rootButton.textContent = state.workspaceName; rootButton.title = 'Open workspace home'; rootButton.onclick = () => root && navigateToPage(root.id); target.append(rootButton); const ancestors = []; let node = p; while (node) { ancestors.unshift(node); node = node.parentId ? state.pages.find(page => page.id === node.parentId) : null; } ancestors.forEach((page, index) => { const separator = document.createElement('span'); separator.textContent = '›'; target.append(separator); if (index === ancestors.length - 1) { const currentCrumb = document.createElement('strong'); currentCrumb.textContent = page.title; target.append(currentCrumb); } else { const crumb = document.createElement('button'); crumb.type = 'button'; crumb.className = 'breadcrumb-ancestor'; crumb.textContent = page.title; crumb.onclick = () => navigateToPage(page.id); target.append(crumb); } }); }
function render() { const p = current(); if (!p) return; if(!p.blocks.length){p.blocks.push(block('text'));save()} renderNav(); renderBreadcrumbs(p); editor.replaceChildren(); editor.contentEditable = 'false'; editor.classList.toggle('full-width', !!p.fullWidth); if (p.cover) {
    const c = document.createElement('div');
    c.className = 'page-cover';
    c.contentEditable = 'false';
    c.style.backgroundImage = `url("${p.cover}")`;
    const edit = document.createElement('button');
    edit.type = 'button'; edit.className = 'edit-cover'; edit.textContent = 'Edit cover';
    edit.onclick = () => openCoverPicker(p);
    c.append(edit); editor.append(c); applyCoverBackground(c, p);
} const bar = document.createElement('div'); bar.className = 'page-toolbar'; bar.contentEditable = 'false'; bar.innerHTML = `<button data-action="cover">${p.cover ? '✎ Edit cover' : '＋ Add cover'}</button><button data-action="icon">☺ ${p.icon ? 'Change icon' : 'Add icon'}</button><button data-action="favorite">${p.favorite ? '★ Favorited' : '☆ Favorite'}</button><span class="edit-time">Edited just now</span>${p.showWordCount ? `<span class="word-count">${countWords(p)} words</span>` : ''}`; editor.append(bar); bar.querySelector('[data-action="cover"]').addEventListener('click', () => openCoverPicker(p)); bar.querySelector('[data-action="icon"]').addEventListener('click', () => iconPicker(p)); bar.querySelector('[data-action="favorite"]').addEventListener('click', () => { p.favorite = !p.favorite; save(); render(); }); const pageIcon = document.createElement('button'); pageIcon.type = 'button'; pageIcon.className = 'page-icon-large'; pageIcon.title = 'Change icon'; pageIcon.setAttribute('aria-label', 'Change page icon'); pageIcon.innerHTML = pageIconMarkup(p.icon); pageIcon.onclick = () => iconPicker(p); const titleRow = document.createElement('div'); titleRow.className = 'page-title-row'; titleRow.append(pageIcon); const title = document.createElement('h1'); title.className = 'page-heading'; title.contentEditable = 'true'; title.spellcheck = true; title.textContent = p.title; wireSingleLineField(title, () => { p.title = title.innerText; save(); renderNav(); renderBreadcrumbs(p); }); titleRow.append(title); editor.append(titleRow); const sub = document.createElement('div'); sub.className = 'page-subtitle'; sub.contentEditable = 'true'; sub.dataset.placeholder = 'Add a description…'; sub.textContent = p.description || ''; wireSingleLineField(sub, () => { p.description = sub.innerText; save(); }); editor.append(sub); const props = renderProperties(p); props.contentEditable = 'false'; editor.append(props); const blockEditor = document.createElement('div'); blockEditor.className = 'block-editor'; blockEditor.contentEditable = 'true'; p.blocks.forEach((b, i) => blockEditor.append(renderBlock(p, b, i))); const endSpace = document.createElement('div'); endSpace.className = 'editor-end'; endSpace.contentEditable = 'false'; endSpace.setAttribute('aria-label', 'Click to add a block'); endSpace.onclick = () => { const next = block('text'); p.blocks.push(next); save(); render(); focusBlockAt(p.blocks.length - 1); }; blockEditor.append(endSpace); editor.append(blockEditor); editor.onkeydown = editorKeys; updateHistoryControls(); updatePageOptions(); }
function renderProperties(p) { const panel=document.createElement('section'); panel.className='property-panel'; const heading=document.createElement('div'); heading.className='property-heading'; heading.innerHTML='<span>Page properties</span>'; const add=document.createElement('button'); add.type='button'; add.textContent='＋ Add a property'; add.onclick=()=>{const name=prompt('Property name','Status');if(!name?.trim())return;const type=(prompt('Type: text, status, select, date, number, person, url, email, phone, checkbox, files','status')||'text').toLowerCase();const allowed=['text','status','select','date','number','person','url','email','phone','checkbox','files'];const selected=allowed.includes(type)?type:'text';p.properties=p.properties||[];p.properties.push({id:id(),name:name.trim(),type:selected,value:selected==='checkbox'?false:'',options:['status','select'].includes(selected)?['Not started','In progress','Done']:undefined});save();render()}; heading.append(add);panel.append(heading);const rows=document.createElement('div');rows.className='property-rows';(p.properties||[]).forEach(prop=>{const row=document.createElement('label');row.className='property-row';const name=document.createElement('span');name.className='property-name';name.textContent=prop.name;let input;if(prop.type==='checkbox'){input=document.createElement('input');input.type='checkbox';input.checked=!!prop.value;input.onchange=()=>{prop.value=input.checked;save()}}else if(prop.type==='status'||prop.type==='select'||prop.type==='person'){input=document.createElement('select');const options=prop.type==='person'?state.users.map(u=>u.name):(prop.options||['Option 1','Option 2']);input.innerHTML='<option value="">Empty</option>';options.forEach(option=>{const item=document.createElement('option');item.value=option;item.textContent=option;input.append(item)});input.value=String(prop.value||'');input.onchange=()=>{prop.value=input.value;save()}}else{input=document.createElement('input');input.type=prop.type==='date'?'date':prop.type==='number'?'number':prop.type==='email'?'email':prop.type==='url'?'url':'text';input.value=String(prop.value??'');input.placeholder=prop.type;input.oninput=()=>{prop.value=input.type==='number'&&input.value!==''?Number(input.value):input.value;save()}}row.append(name,input);rows.append(row)});panel.append(rows);if(!(p.properties||[]).length){const empty=document.createElement('div');empty.className='property-empty';empty.textContent='Add typed fields such as status, date, person, number, or URL.';panel.append(empty)}return panel}
let dragScrollY = 0;
function renderBlock(p, b, i) {
    const el = renderBlockContent(p, b, i);
    el.classList.toggle('is-empty', !(b.text || '').trim());
    const add = document.createElement('button');
    add.type = 'button'; add.className = 'block-add'; add.contentEditable = 'false'; add.draggable = false;
    add.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    add.title = 'Click to add below. Alt-click to add a block above';
    add.setAttribute('aria-label', 'Click to add below. Alt-click to add a block above');
    add.onclick = event => {
        event.preventDefault(); event.stopPropagation();
        const index = p.blocks.indexOf(b); if (index < 0) return;
        const at = event.altKey ? index : index + 1;
        p.blocks.splice(at, 0, block('text'));
        save(); render();
        requestAnimationFrame(() => focusBlockAt(at));
    };
    const handle = document.createElement('button');
    handle.type = 'button'; handle.className = 'block-handle'; handle.contentEditable = 'false'; handle.draggable = true;
    handle.setAttribute('aria-label', 'Drag to move, click to open menu'); handle.setAttribute('aria-haspopup', 'menu');
    handle.title = 'Drag to move, click to open menu'; handle.textContent = '';
    handle.onclick = event => { event.preventDefault(); event.stopPropagation(); showBlockMenu(p, b, handle); };
    handle.oncontextmenu = event => { event.preventDefault(); event.stopPropagation(); showBlockMenu(p, b, handle); };
    handle.addEventListener('dragstart', event => {
        dragScrollY = window.scrollY;
        event.dataTransfer.setData('text/plain', String(p.blocks.indexOf(b)));
        event.dataTransfer.effectAllowed = 'move';
        el.classList.add('dragging');
    });
    handle.addEventListener('dragend', () => {
        el.classList.remove('dragging');
        window.scrollTo({ top: dragScrollY, left: window.scrollX });
    });
    el.addEventListener('dragover', event => { if (!event.dataTransfer.types.includes('text/plain')) return; event.preventDefault(); el.classList.add('drop-target'); });
    el.addEventListener('dragleave', () => el.classList.remove('drop-target'));
    el.addEventListener('drop', event => {
        event.preventDefault(); el.classList.remove('drop-target');
        const from = Number(event.dataTransfer.getData('text/plain')), to = p.blocks.indexOf(b);
        if (!Number.isInteger(from) || from < 0 || from >= p.blocks.length || from === to) return;
        const rect = el.getBoundingClientRect();
        let insertAt = to + (event.clientY > rect.top + rect.height / 2 ? 1 : 0);
        const [moved] = p.blocks.splice(from, 1);
        if (from < insertAt) insertAt--;
        p.blocks.splice(Math.max(0, insertAt), 0, moved);
        save(); render();
        const keep = dragScrollY || window.scrollY;
        window.scrollTo({ top: keep, left: window.scrollX });
        requestAnimationFrame(() => window.scrollTo({ top: keep, left: window.scrollX }));
    });
    el.append(add, handle);
    return el;
}
function renderBlockContent(p, b, i) { const el = document.createElement('div'); el.className = 'block ' + b.type; el.contentEditable = 'true'; el.dataset.index = String(i); if (b.type === 'divider') {
    el.contentEditable = 'false';
    return el;
} if (b.type === 'page_link') {
    el.contentEditable = 'false';
    const target = state.pages.find(x => x.id === b.targetId);
    el.innerHTML = `<span class="page-link-icon">${pageIconMarkup(target?.icon)}</span><a href="#" class="inline-page-link">${esc(target?.title || b.text || 'Missing page')}</a>`;
    el.querySelector('a').onclick = e => { e.preventDefault(); if (target) {
        navigateToPage(target.id);
    } };
    return el;
} if (b.type === 'mention') {
    el.contentEditable = 'false';
    const m = b.mentions?.[0];
    if(m?.kind==='page'){const target=state.pages.find(page=>page.id===m.id);el.className='block page_link';el.innerHTML=`<span class="page-link-icon">${pageIconMarkup(target?.icon)}</span><a href="#" class="inline-page-link">${esc(target?.title||m.label)}</a>`;el.querySelector('a').onclick=e=>{e.preventDefault();if(target)navigateToPage(target.id)}}else el.innerHTML=m?`<span class="mention-chip">@ ${esc(m.label)}</span>`:esc(b.text);
    return el;
} if (b.type === 'image') {
    el.contentEditable = 'false';
    el.innerHTML = b.url ? `<img class="content-image" src="${esc(b.url)}" alt="${esc(b.text)}"><small>${esc(b.text)}</small>` : '<button class="image-placeholder">Choose image</button>';
    el.querySelector('button')?.addEventListener('click', () => uploadForBlock(b, p));
    return el;
} if (b.type === 'columns') {
    el.contentEditable = 'false';
    b.children = b.children?.length ? b.children : [block('text', 'Column 1'), block('text', 'Column 2')];
    b.columnWidths = b.columnWidths?.length === b.children.length ? b.columnWidths : Array(b.children.length).fill(100 / b.children.length);
    el.replaceChildren();
    const grid = document.createElement('div'); grid.className = 'column-grid'; grid.style.gridTemplateColumns = b.children.length === 2 ? `minmax(0, ${b.columnWidths[0]}fr) 8px minmax(0, ${b.columnWidths[1]}fr)` : `repeat(${b.children.length}, minmax(0, 1fr))`;
    b.children.forEach((child, index) => { const col = document.createElement('div'); col.className = 'column-cell'; col.contentEditable = 'true'; col.textContent = child.text; col.oninput = () => { child.text = col.innerText; save(); }; grid.append(col); if (index === 0 && b.children.length === 2) { const resize = document.createElement('button'); resize.type = 'button'; resize.contentEditable = 'false'; resize.className = 'column-resizer'; resize.title = 'Resize columns'; resize.setAttribute('aria-label', 'Resize columns'); resize.onpointerdown = event => { event.preventDefault(); const rect = grid.getBoundingClientRect(); const move = next => { const first = Math.min(80, Math.max(20, ((next.clientX - rect.left) / rect.width) * 100)); b.columnWidths = [first, 100 - first]; grid.style.gridTemplateColumns = `minmax(0, ${first}fr) 8px minmax(0, ${100 - first}fr)`; }; const finish = next => { move(next); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); save(); }; window.addEventListener('pointermove', move); window.addEventListener('pointerup', finish, { once: true }); }; grid.append(resize); } });
    el.append(grid);
    return el;
} if (b.type === 'toc') {
    el.contentEditable = 'false';
    el.innerHTML = '<strong>Table of contents</strong>';
    p.blocks.filter(x => ['h1', 'h2', 'h3'].includes(x.type)).forEach(h => { const a = document.createElement('button'); a.className = 'toc-link'; a.textContent = h.text || 'Untitled heading'; a.onclick = () => document.querySelector(`[data-index="${p.blocks.indexOf(h)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.append(a); });
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
    const button = document.createElement('button');
    button.className = 'template-action';
    button.textContent = b.text || 'Add template content';
    button.onclick = () => { p.blocks.splice(p.blocks.indexOf(b) + 1, 0, block('text', 'New template block')); save(); render(); };
    el.append(button);
    return el;
} if (b.type === 'todo') {
    el.innerHTML = `<input type="checkbox" contenteditable="false" ${b.checked ? 'checked' : ''}><span class="block-copy"></span>`;
    el.querySelector('.block-copy').textContent = b.text;
    el.querySelector('input').onchange = e => { b.checked = e.target.checked; save(); render(); };
    wireText(el.querySelector('.block-copy'), b, p);
    return el;
} if (b.type === 'toggle') {
    el.innerHTML = `<button class="toggle-arrow" contenteditable="false">›</button><span class="block-copy"></span><div class="toggle-content" hidden></div>`;
    el.querySelector('.block-copy').textContent = b.text;
    wireText(el.querySelector('.block-copy'), b, p);
    el.querySelector('button').onclick = () => { const c = el.querySelector('.toggle-content'); c.hidden = !c.hidden; el.classList.toggle('expanded', !c.hidden); };
    return el;
} if (b.type === 'code') {
    el.innerHTML = `<div class="code-meta" contenteditable="false"><select aria-label="Code language"><option>Plain text</option><option>JavaScript</option><option>TypeScript</option><option>Python</option><option>HTML</option><option>CSS</option><option>JSON</option></select><button>Copy</button></div><pre></pre>`;
    const language = el.querySelector('select');
    language.value = b.language || 'Plain text';
    language.onchange = () => { b.language = language.value; save(); };
    el.querySelector('pre').textContent = b.text;
    wireText(el.querySelector('pre'), b, p);
    el.querySelector('button').onclick = () => navigator.clipboard?.writeText(b.text);
    return el;
} if (['video', 'audio', 'bookmark', 'embed', 'file'].includes(b.type)) {
    el.contentEditable = 'false';
    el.innerHTML = b.url ? `<a class="media-card" href="${esc(b.url)}" target="_blank" rel="noreferrer">${esc(b.text || b.type)}<small>${esc(b.url)}</small></a>` : `<button class="image-placeholder">Add ${b.type} URL</button>`;
    el.querySelector('button')?.addEventListener('click', () => runCommand(b.type, b.type, b));
    return el;
} if (b.type === 'date') {
    el.contentEditable = 'false';
    el.innerHTML = `<button class="mention-chip">📅 ${esc(b.text || 'Choose date')}</button>`;
    el.onclick = () => { const x = prompt('Enter a date', b.text || new Date().toLocaleDateString()); if (x) {
        b.text = x;
        save();
        render();
    } };
    return el;
} if (b.type === 'equation') {
    el.contentEditable = 'false';
    el.innerHTML = `<div class="equation-block">${esc(b.text || 'Enter equation')}</div>`;
    el.onclick = () => { b.text = prompt('Edit equation', b.text) || b.text; save(); render(); };
    return el;
} if (b.type === 'table') {
    el.contentEditable = 'false';
    const data = b.tableData || (b.tableData = { headers: ['Name', 'Status'], rows: [['New item', 'To do']] });
    el.innerHTML = '<div class="table-scroll"><table class="simple-table"><thead></thead><tbody></tbody></table></div><button class="add-table-row">＋ Add row</button>';
    const table = el.querySelector('table'), head = table.querySelector('thead'), body = table.querySelector('tbody'), headerRow = document.createElement('tr');
    data.headers.forEach((value, col) => { const cell = document.createElement('th'); cell.contentEditable = 'true'; cell.textContent = value; cell.oninput = () => { data.headers[col] = cell.innerText; save(); }; headerRow.append(cell); });
    head.append(headerRow);
    const drawRows = () => { body.replaceChildren(); data.rows.forEach((row, rowIndex) => { const tr = document.createElement('tr'); row.forEach((value, col) => { const cell = document.createElement('td'); cell.contentEditable = 'true'; cell.textContent = value; cell.oninput = () => { data.rows[rowIndex][col] = cell.innerText; save(); }; tr.append(cell); }); body.append(tr); }); };
    drawRows();
    el.querySelector('.add-table-row').addEventListener('click', () => { data.rows.push(data.headers.map(() => '')); save(); drawRows(); });
    return el;
} el.dataset.placeholder = b.type === 'text' ? 'Type / for commands or start writing…' : ''; el.innerHTML = b.html ? cleanInlineHtml(b.html) : esc(b.text); wireText(el, b, p); return el; }
function editableTarget(blockElement) { return blockElement?.querySelector('.block-copy, pre') || blockElement; }
function activeBlockFromNode(node) { const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement; return element?.closest?.('.block') || null; }
function activeBlockFromSelection() { return activeBlockFromNode(getSelection()?.focusNode); }
function pageIconMarkup(icon) { return String(icon || '📄').startsWith('data:image') ? `<img class="page-link-image-icon" src="${esc(icon)}" alt="">` : esc(icon || '📄'); }
function updateBlockFromDOM(page, index) { const item = page.blocks[index], outer = editor.querySelector(`[data-index="${index}"]`); if (!item || !outer || outer.getAttribute('contenteditable') === 'false' || ['divider','page_link','mention','image','toc','breadcrumb','button','date','equation','video','audio','bookmark','embed','file','columns','table'].includes(item.type)) return; const target = editableTarget(outer); item.text = (target.innerText || '').replace(/\u200b/g, ''); item.html = item.text.trim() ? cleanInlineHtml(target.innerHTML.replace(/\u200b/g, '')) : undefined; outer.classList.toggle('is-empty', !item.text.trim()); }
function syncBlocksFromEditor(page = current()) { if (!page) return; page.blocks.forEach((_, index) => updateBlockFromDOM(page, index)); }
function setCaretAtTextOffset(target, offset) { if (!target) return; const focusHost = target.closest('.block-editor') || target.closest('.block') || target; focusHost.focus?.({ preventScroll: true }); const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT); let node, remaining = Math.max(0, offset), last = null; while ((node = walker.nextNode())) { last = node; if (remaining <= node.textContent.length) { const range = document.createRange(); range.setStart(node, remaining); range.collapse(true); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); return; } remaining -= node.textContent.length; } if (!last) { last = document.createTextNode('\u200b'); target.append(last); } const range = document.createRange(); range.setStart(last, offset <= 0 ? 0 : last.textContent.length); range.collapse(true); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); }
function setActiveEditorBlock(blockElement) { editor.querySelectorAll('.block.active-block').forEach(element => element.classList.remove('active-block')); blockElement?.classList.add('active-block'); }
function focusBlockAt(index, atStart = true) { const outer = editor.querySelector(`[data-index="${index}"]`); if (!outer) { editor.querySelector('.block-editor')?.focus(); return; } setActiveEditorBlock(outer); const target = editableTarget(outer); setCaretAtTextOffset(target, atStart ? 0 : (target.innerText || '').length); }
function focusLinkedBlock(blockId) { const page = current(), index = page.blocks.findIndex(item => item.id === blockId), element = index < 0 ? null : editor.querySelector(`[data-index="${index}"]`); if (!element) return; element.scrollIntoView({ block: 'center', behavior: 'smooth' }); element.classList.add('linked-block'); setActiveEditorBlock(element); setTimeout(() => element.classList.remove('linked-block'), 2200); }
function contentAtCaret(target, end) { const selection = getSelection(); if (!selection?.rangeCount) return null; const selected = selection.getRangeAt(0); if (!target.contains(selected.startContainer) || !target.contains(selected.endContainer)) return null; const range = document.createRange(); range.selectNodeContents(target); if (end) range.setStart(selected.endContainer, selected.endOffset); else range.setEnd(selected.startContainer, selected.startOffset); return range; }
function fragmentAsEditableHTML(fragment) { const wrapper = document.createElement('div'); wrapper.append(fragment); return { text: wrapper.innerText.replace(/\u200b/g, ''), html: cleanInlineHtml(wrapper.innerHTML) }; }
function splitBlockAtCaret(page, item, target) { const index = page.blocks.indexOf(item), selection = getSelection(); if (!selection?.rangeCount) return; const selected = selection.getRangeAt(0); if (!target.contains(selected.startContainer) || !target.contains(selected.endContainer)) return; const before = document.createRange(), after = document.createRange(); before.selectNodeContents(target); before.setEnd(selected.startContainer, selected.startOffset); after.selectNodeContents(target); after.setStart(selected.endContainer, selected.endOffset); const left = fragmentAsEditableHTML(before.cloneContents()), right = fragmentAsEditableHTML(after.cloneContents()); const isList = ['bullet','numbered','todo'].includes(item.type); if (isList && !left.text.trim() && !right.text.trim()) { item.type = 'text'; item.text = ''; item.html = undefined; save(); render(); focusBlockAt(index); return; } item.text = left.text; item.html = left.html; const next = block(isList ? item.type : 'text', right.text); next.html = right.html; if (next.type === 'todo') next.checked = false; page.blocks.splice(index + 1, 0, next); save(); render(); focusBlockAt(index + 1); }
function mergeOrRemoveBlock(page, item, target) { const index = page.blocks.indexOf(item); if (index < 0) return; const selection = getSelection(), range = selection?.rangeCount ? selection.getRangeAt(0) : null; if (!range || !target.contains(range.startContainer)) return; const prefix = document.createRange(); prefix.selectNodeContents(target); prefix.setEnd(range.startContainer, range.startOffset); if (prefix.toString().length) return; if (!item.text && page.blocks.length > 1) { page.blocks.splice(index, 1); save(); render(); focusBlockAt(Math.max(0, index - 1), false); return; } if (index <= 0) return; const previous = page.blocks[index - 1]; if (['divider','page_link','mention','image','table','columns'].includes(previous.type)) return; const previousText = previous.text || '', previousHTML = previous.html || esc(previousText), itemHTML = item.html || esc(item.text || ''); previous.text = previousText + (item.text || ''); previous.html = cleanInlineHtml(previousHTML + itemHTML); page.blocks.splice(index, 1); save(); render(); focusBlockAt(index - 1, false); setCaretAtTextOffset(editableTarget(editor.querySelector(`[data-index="${index - 1}"]`)), previousText.length); }
function wireText(el, b, p) { el.spellcheck = true; }
function wireSingleLineField(el, onChange) {
    el.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); focusBlockAt(0); } });
    el.addEventListener('paste', event => { const text = event.clipboardData?.getData('text/plain'); if (text == null) return; event.preventDefault(); document.execCommand('insertText', false, text.replace(/[\r\n]+/g, ' ')); });
    el.addEventListener('input', () => { const raw = el.innerText || ''; if (raw.includes('\n')) { const flat = raw.replace(/\s*\n\s*/g, ' '); el.textContent = flat; setCaretAtTextOffset(el, flat.length); } onChange(); });
}
function markdownInline(raw) { let html = esc(raw); html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, href) => `<a href="${esc(href)}">${label}</a>`); html = html.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/~~([^~]+)~~/g, '<del>$1</del>').replace(/\*([^*]+)\*/g, '<em>$1</em>'); return cleanInlineHtml(html); }
function parseMarkdownLine(line) { let match; if ((match = line.match(/^(#{1,3})\s+(.+)$/))) return { type: `h${match[1].length}`, text: match[2], html: markdownInline(match[2]) }; if ((match = line.match(/^\s*[-*+]\s+\[([ xX])\]\s*(.*)$/))) return { type: 'todo', text: match[2], html: markdownInline(match[2]), checked: match[1].toLowerCase() === 'x' }; if ((match = line.match(/^\s*[-*+]\s+(.+)$/))) return { type: 'bullet', text: match[1], html: markdownInline(match[1]) }; if ((match = line.match(/^\s*\d+\.\s+(.+)$/))) return { type: 'numbered', text: match[1], html: markdownInline(match[1]) }; if ((match = line.match(/^>\s?(.*)$/))) return { type: 'quote', text: match[1], html: markdownInline(match[1]) }; if (/^(---|___|\*\*\*)\s*$/.test(line.trim())) return { type: 'divider', text: '', html: '' }; return { type: 'text', text: line, html: markdownInline(line) }; }
function handleMarkdownPaste(event) { const clipboard = event.clipboardData, raw = clipboard?.getData('text/plain'); if (!raw) return; const page = current(), blockElement = activeBlockFromSelection(), target = editableTarget(blockElement), selection = getSelection(); if (!blockElement || !selection?.rangeCount) return; const selected = selection.getRangeAt(0); if (!target.contains(selected.startContainer) || !target.contains(selected.endContainer)) return; const lines = raw.replace(/\r\n?/g, '\n').split('\n'), looksLikeMarkdown = lines.some(line => /^(#{1,3}\s|\s*[-*+]\s|\s*\d+\.\s|>\s?|---\s*$|___\s*$|\*\*\*\s*$)/.test(line)); if (lines.length === 1 && !looksLikeMarkdown && !/\*\*|\*[^*\s][^*]*\*|~~|`|\[[^\]]+\]\(https?:\/\//.test(raw)) return; event.preventDefault(); const prefixRange = document.createRange(), suffixRange = document.createRange(); prefixRange.selectNodeContents(target); prefixRange.setEnd(selected.startContainer, selected.startOffset); suffixRange.selectNodeContents(target); suffixRange.setStart(selected.endContainer, selected.endOffset); const prefix = fragmentAsEditableHTML(prefixRange.cloneContents()), suffix = fragmentAsEditableHTML(suffixRange.cloneContents()), parsed = lines.map(parseMarkdownLine), index = page.blocks.indexOf(page.blocks[Number(blockElement.dataset.index)]); if (index < 0) return; if (prefix.text) { parsed[0].text = prefix.text + parsed[0].text; parsed[0].html = cleanInlineHtml(prefix.html + parsed[0].html); parsed[0].type = page.blocks[index].type; parsed[0].id = page.blocks[index].id; } else parsed[0].id = page.blocks[index].id; if (suffix.text) { const last = parsed[parsed.length - 1]; last.text += suffix.text; last.html = cleanInlineHtml(last.html + suffix.html); } const inserted = parsed.map(item => ({ ...block(item.type, item.text), ...item })); page.blocks.splice(index, 1, ...inserted); save(); render(); const caretOffset = (prefix.text && parsed.length === 1 ? prefix.text.length : 0) + (lines[lines.length - 1]?.length || 0); focusBlockAt(index + inserted.length - 1); setCaretAtTextOffset(editableTarget(editor.querySelector(`[data-index="${index + inserted.length - 1}"]`)), Math.min(caretOffset, (inserted[inserted.length - 1].text || '').length)); }
const MENU_GLYPHS = { 'Text':'T', 'Page':'▤', 'Heading 1':'H1', 'Heading 2':'H2', 'Heading 3':'H3', 'Bulleted list':'•', 'Numbered list':'1.', 'To-do list':'☑', 'Toggle list':'▸', 'Quote':'❝', 'Callout':'☀', 'Divider':'—', 'Image':'▧', 'Video':'▶', 'Audio':'♪', 'File':'⌑', 'PDF':'PDF', 'Web bookmark':'⚑', 'Embed':'◇', 'Code':'</>', '2 columns':'▥', '3 columns':'▥', '4 columns':'▥', 'Table':'▦', 'Table of contents':'☰', 'Breadcrumb':'›', 'Mention':'@', 'Date / reminder':'▦', 'Equation':'∑', 'Emoji':'☺', 'Link to page':'↗', 'Duplicate block':'⧉', 'Move to page':'↪', 'Delete block':'🗑', 'Open in new tab':'↗', 'Rename':'✎', 'Duplicate':'⧉', 'Copy link':'🔗', 'Copy link to block':'🔗', 'Add to favorites':'★', 'Remove from favorites':'★', 'Change icon':'☺', 'Delete':'🗑', 'Move to':'↪', 'Turn into':'⇄' };
function menuGlyph(label, type) { return `<span class="command-icon" aria-hidden="true">${esc(MENU_GLYPHS[label] || MENU_GLYPHS[type] || '•')}</span>`; }
function menuSearchKey(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ''); }
function menuMatches(value, query) { return menuSearchKey(value).includes(menuSearchKey(query)); }
function closeMenu() { if (activeMenu) activeMenu.hidden = true; activeMenu = null; }
function refreshMenuSelection() { if (!activeMenu) return; const rows = [...activeMenu.querySelectorAll('.command-row')]; if (!rows.length) { menuIndex = 0; return; } menuIndex = Math.max(0, Math.min(menuIndex, rows.length - 1)); rows.forEach((row, index) => { row.classList.toggle('selected', index === menuIndex); row.setAttribute('aria-selected', String(index === menuIndex)); const key = row.querySelector('kbd'); if (key && !key.dataset.fixed) key.textContent = index === menuIndex ? '↵' : ''; }); }
function menuRow(label, icon, run, meta = '', shortcut = '') { const row = document.createElement('button'); row.type = 'button'; row.className = 'command-row'; row.setAttribute('role', 'option'); row.setAttribute('aria-selected', 'false'); row.innerHTML = `${icon}<span class="command-copy"><span>${esc(label)}</span>${meta ? `<small>${esc(meta)}</small>` : ''}</span><kbd>${esc(shortcut)}</kbd>`; if (shortcut) row.querySelector('kbd').dataset.fixed = 'true'; row.onclick = () => { closeMenu(); run(); }; return row; }
function placeFloatingMenu(menu, x, y) {
    menu.hidden = false;
    menu.style.maxHeight = '';
    const margin = 8;
    const box = menu.getBoundingClientRect();
    const fullHeight = box.height;
    const left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, x));
    let top = Math.max(margin, Math.min(window.innerHeight - margin, y));
    const below = window.innerHeight - top - margin;
    let height = fullHeight;
    if (fullHeight > below) {
        const above = top - margin;
        if (below < 180 && above > below) {
            height = Math.max(140, Math.min(fullHeight, above));
            top = Math.max(margin, y - height - 2);
        } else {
            height = Math.max(140, Math.min(fullHeight, below));
        }
        menu.style.maxHeight = `${height}px`;
    }
    menu.style.left = `${left}px`;
    menu.style.top = `${Math.max(margin, Math.min(top, window.innerHeight - height - margin))}px`;
}
function placeCommandMenu(menu,anchor){if(!anchor)return;menu.hidden=false;menu.style.maxHeight='';const rect=anchor.getBoundingClientRect(),box=menu.getBoundingClientRect();const left=Math.max(12,Math.min(window.innerWidth-box.width-12,rect.left+22));const below=rect.bottom+5;const above=rect.top-5;const spaceBelow=window.innerHeight-below-12;const spaceAbove=above-12;if(spaceBelow>=220||spaceBelow>=spaceAbove){menu.style.maxHeight=`${Math.max(180,Math.min(box.height,spaceBelow))}px`;menu.style.top=`${Math.max(12,below)}px`}else{const height=Math.max(180,Math.min(box.height,spaceAbove));menu.style.maxHeight=`${height}px`;menu.style.top=`${Math.max(12,above-height)}px`}menu.style.left=`${left}px`}
function cmdCatalog() {
    return [
        ['Text', 'text', 'Basic blocks', 'T'], ['Page', 'page_link', 'Basic blocks', '▤'],
        ['Heading 1', 'h1', 'Headings', 'H1'], ['Heading 2', 'h2', 'Headings', 'H2'], ['Heading 3', 'h3', 'Headings', 'H3'],
        ['Bulleted list', 'bullet', 'Lists', '•'], ['Numbered list', 'numbered', 'Lists', '1.'], ['To-do list', 'todo', 'Lists', '☑'], ['Toggle list', 'toggle', 'Lists', '▸'],
        ['Quote', 'quote', 'Content', '❝'], ['Callout', 'callout', 'Content', '☀'], ['Divider', 'divider', 'Content', '—'],
        ['Image', 'image', 'Media', '▧'], ['Video', 'video', 'Media', '▶'], ['Audio', 'audio', 'Media', '♪'], ['File', 'file', 'Media', '⌑'], ['PDF', 'file', 'Media', 'PDF'], ['Web bookmark', 'bookmark', 'Media', '⚑'], ['Embed', 'embed', 'Media', '◇'], ['Code', 'code', 'Media', '</>'],
        ['2 columns', 'columns', 'Layout', '▥', 2], ['3 columns', 'columns', 'Layout', '▥', 3], ['4 columns', 'columns', 'Layout', '▥', 4], ['Table', 'table', 'Layout', '▦'], ['Table of contents', 'toc', 'Layout', '☰'], ['Breadcrumb', 'breadcrumb', 'Layout', '›'],
        ['Mention', 'mention', 'Inline', '@'], ['Date / reminder', 'date', 'Inline', '▦'], ['Equation', 'equation', 'Inline', '∑'], ['Emoji', 'mention', 'Inline', '☺'], ['Link to page', 'page_link', 'Inline', '↗'],
        ['Duplicate block', 'text', 'Actions', '⧉'], ['Move to page', 'text', 'Actions', '↪'], ['Delete block', 'text', 'Actions', '🗑']
    ].map(([name, type, category, icon, columns]) => ({ name, type, category, icon, columns }));
}
function showMenu(query, blockAt) { const menu = $('#command-menu'), q = query.trim(); menu.className = 'command-menu'; menu.innerHTML = ''; menu.scrollTop = 0; const cmds = cmdCatalog().filter(c => menuMatches(c.name + ' ' + c.category, q)); const list = document.createElement('div'); list.className = 'command-list'; if (!cmds.length) { const empty = document.createElement('div'); empty.className = 'command-empty'; empty.textContent = 'No matching blocks'; list.append(empty); } [...new Set(cmds.map(c => c.category))].forEach(category => { const group = document.createElement('section'); group.className = 'command-group'; const label = document.createElement('div'); label.className = 'command-group-label'; label.textContent = category; group.append(label); cmds.filter(c => c.category === category).forEach(c => { const row = menuRow(c.name, menuGlyph(c.name, c.type), () => runCommand(c.name, c.type, blockAt, c), '', ''); group.append(row); }); list.append(group); }); menu.append(list); menuOptions = cmds; placeCommandMenu(menu, editor.querySelector(`[data-index="${current().blocks.indexOf(blockAt)}"]`)); menuIndex = 0; refreshMenuSelection(); activeMenu = menu; }
function runCommand(name, type, b, cmd) { const p = current(); const idx = p.blocks.indexOf(b); if (name === 'Page') {
    const child = createPage(p.id);
    p.blocks[idx] = { id: id(), type: 'page_link', text: child.title, targetId: child.id };
    save();
    navigateToPage(child.id);
    return;
} if (name === 'Link to page') {
    showPageLinkPicker(p, b);
    return;
} if (name === 'Mention' || name === 'Emoji') {
    showMentionPicker(p, b);
    return;
} if (name === 'Image') {
    uploadForBlock(b, p);
    return;
} if (name === 'Delete block') {
    p.blocks.splice(idx, 1);
    save();
    render();
    return;
} if (name === 'Duplicate block') {
    p.blocks.splice(idx + 1, 0, { ...b, id: id() });
    save();
    render();
    return;
} if (name === 'Move to page') {
    showMovePicker(p, b);
    return;
} if (['PDF', 'Web bookmark', 'Video', 'Audio', 'File', 'Embed'].includes(name)) {
    const url = prompt(`Enter a URL or choose a file for ${name.toLowerCase()}`);
    if (url) {
        b.type = type;
        b.url = url;
        b.text = name;
        save();
        render();
    }
    return;
} if (name === 'Date / reminder') {
    b.type = 'date';
    b.text = new Date().toLocaleDateString();
    save();
    render();
    return;
} if (name === 'Button / template') {
    b.type = 'button';
    b.text = 'Click to add a template block';
    save();
    render();
    return;
} if (name === 'Math / LaTeX' || name === 'Equation') {
    b.type = 'equation';
    b.text = prompt('Enter a LaTeX expression', 'x^2 + y^2 = z^2') || '';
    save();
    render();
    return;
} if (type === 'columns') { const count = Math.max(2, Math.min(5, Number(cmd?.columns) || 2)); b.type = 'columns'; b.text = ''; b.html = undefined; b.children = Array.from({ length: count }, (_, index) => block('text', `Column ${index + 1}`)); b.columnWidths = Array(count).fill(100 / count); save(); render(); return; } b.type = type; b.text = ''; b.html=undefined; save(); render(); focusBlockAt(idx); }
const TURN_INTO_TARGETS = [['Text', 'text'], ['Heading 1', 'h1'], ['Heading 2', 'h2'], ['Heading 3', 'h3'], ['Bulleted list', 'bullet'], ['Numbered list', 'numbered'], ['To-do list', 'todo'], ['Toggle list', 'toggle'], ['Quote', 'quote'], ['Callout', 'callout'], ['Code', 'code'], ['Divider', 'divider']];
function blockTypeLabel(type) { const found = TURN_INTO_TARGETS.find(([, value]) => value === type); return found ? found[0] : 'Text'; }
function cloneBlockTree(item) { const copy = JSON.parse(JSON.stringify(item)); const reid = child => { child.id = id(); (child.children || []).forEach(reid); }; reid(copy); return copy; }
function copyPageLink(p) { const url = pageHref(p.id); if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(() => toast('Page link copied'), () => toast(url)); else toast(url); }
function copyBlockLink(p, b) { const url = pageHref(p.id, b.id); if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(() => toast('Block link copied'), () => toast(url)); else toast(url); }
function duplicatePage(p) { const copy = { ...JSON.parse(JSON.stringify(p)), id: id(), title: `${p.title || 'Untitled'} (copy)`, favorite: false, blocks: p.blocks.map(cloneBlockTree), createdAt: Date.now(), updatedAt: Date.now() }; state.pages.splice(state.pages.indexOf(p) + 1, 0, copy); save(); render(); toast('Page duplicated'); }
function deletePageTree(pageId) { const ids = new Set([pageId]); let changed = true; while (changed) { changed = false; state.pages.forEach(item => { if (item.parentId && ids.has(item.parentId) && !ids.has(item.id)) { ids.add(item.id); changed = true; } }); } state.pages = state.pages.filter(item => !ids.has(item.id)); }
function showBlockMenu(p, b, anchor) {
    const menu = $('#command-menu'); menu.className = 'command-menu block-actions'; menu.replaceChildren();
    const searchBox = document.createElement('div'); searchBox.className = 'command-search-box';
    const input = document.createElement('input'); input.className = 'command-search'; input.placeholder = 'Search actions…'; input.setAttribute('aria-label', 'Search block actions');
    searchBox.append(input); menu.append(searchBox);
    const list = document.createElement('div'); list.className = 'command-list'; menu.append(list);
    const items = [
        ...TURN_INTO_TARGETS.map(([label, type]) => ({ label, group: 'Turn into', icon: menuGlyph(label, type), run: () => { b.type = type; if (type === 'divider') { b.text = ''; b.html = undefined; } save(); render(); const index = p.blocks.indexOf(b); if (index >= 0) focusBlockAt(index); } })),
        { label: 'Copy link to block', group: 'Actions', icon: menuGlyph('Copy link to block'), run: () => copyBlockLink(p, b) },
        { label: 'Duplicate', group: 'Actions', icon: menuGlyph('Duplicate'), run: () => { const index = p.blocks.indexOf(b); p.blocks.splice(index + 1, 0, cloneBlockTree(b)); save(); render(); } },
        { label: 'Move to page', group: 'Actions', icon: menuGlyph('Move to page'), run: () => showMovePicker(p, b) },
        { label: 'Delete', group: 'Actions', icon: menuGlyph('Delete'), run: () => { const index = p.blocks.indexOf(b); p.blocks.splice(index, 1); if (!p.blocks.length) p.blocks.push(block('text')); save(); render(); } }
    ];
    const draw = () => { list.replaceChildren(); menu.scrollTop = 0; const q = input.value.trim(); const matches = items.filter(item => menuMatches(item.label + ' ' + item.group, q)); if (!matches.length) { const empty = document.createElement('div'); empty.className = 'command-empty'; empty.textContent = 'No matching actions'; list.append(empty); } [...new Set(matches.map(item => item.group))].forEach(group => { const section = document.createElement('section'); section.className = 'command-group'; const heading = document.createElement('div'); heading.className = 'command-group-label'; heading.textContent = group; section.append(heading); matches.filter(item => item.group === group).forEach(item => section.append(menuRow(item.label, item.icon, item.run))); list.append(section); }); menuIndex = 0; refreshMenuSelection(); };
    input.addEventListener('input', draw);
    const footer = document.createElement('div'); footer.className = 'menu-footer'; footer.textContent = `${blockTypeLabel(b.type)} block · Last edited ${new Date(p.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}`; menu.append(footer);
    draw();
    const rect = anchor.getBoundingClientRect(); placeFloatingMenu(menu, rect.left - 4, rect.bottom + 5);
    menuIndex = 0; refreshMenuSelection(); activeMenu = menu;
    requestAnimationFrame(() => { input.focus(); input.setSelectionRange(input.value.length, input.value.length); });
}
function createPage(parentId, title = 'Untitled') { const p = { id: id(), title, icon: '📄', parentId, blocks: [block('text')], createdAt: Date.now(), updatedAt: Date.now() }; state.pages.push(p); return p; }
function showPageLinkPicker(p, b) { const query = prompt('Search pages or type a new page title', ''); if (query === null)
    return; const found = state.pages.find(x => x.title.toLowerCase() === query.toLowerCase()); if (found) {
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
function showMentionPicker(p, b) { const menu = $('#command-menu'); const suggestions = [...state.pages.map(x => ({ label: x.title, id: x.id, kind: 'page' })), ...state.users.map(x => ({ label: x.name, id: x.id, kind: 'person' }))]; menu.innerHTML = ''; suggestions.forEach((x, i) => { const row = document.createElement('button'); row.className = 'command-row' + (!i ? ' selected' : ''); row.textContent = (x.kind === 'page' ? '📄 ' : '👤 ') + x.label; row.onclick = () => { b.type = 'mention'; b.text = '@' + x.label; b.mentions = [{ kind: x.kind, id: x.id, label: x.label }]; save(); render(); menu.hidden = true; }; menu.append(row); }); menu.hidden = false; menuIndex = 0; activeMenu = menu; }
function showMovePicker(p, b) { const dest = state.pages.filter(x => x.id !== p.id); const choice = prompt('Move block to which page?\n' + dest.map(x => x.title).join('\n')); const target = dest.find(x => x.title === choice); if (target) {
    target.blocks.push({ ...b, id: id() });
    p.blocks.splice(p.blocks.indexOf(b), 1);
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
function selectAllPageText() { const blocks = Array.from(editor.querySelectorAll('.block-editor>.block[contenteditable="true"]')); if (!blocks.length) return; const first = editableTarget(blocks[0]), last = editableTarget(blocks[blocks.length - 1]); blocks[0].closest('.block-editor')?.focus({ preventScroll: true }); const range = document.createRange(); range.selectNodeContents(first); range.setEnd(last, last.childNodes.length); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); }
function editorKeys(e) {
    const el = e.target;
    if (!editor.contains(el) || !el.isContentEditable) return;
    if (el.closest('.column-cell, .simple-table')) return;
    const blockEl = el.closest('.block') || activeBlockFromSelection();
    if (!blockEl) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && el.closest('.block-editor')) { e.preventDefault(); selectAllPageText(); }
        else if (e.key === 'Enter' && el.matches('.page-heading,.page-subtitle')) { e.preventDefault(); focusBlockAt(0); }
        return;
    }
    const p = current(), b = p.blocks[Number(blockEl.dataset.index)], target = editableTarget(blockEl);
    if (!b) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') { e.preventDefault(); selectAllPageText(); return; }
    if ((e.ctrlKey || e.metaKey) && ['b','i','u'].includes(e.key.toLowerCase())) { e.preventDefault(); document.execCommand(e.key.toLowerCase() === 'b' ? 'bold' : e.key.toLowerCase() === 'i' ? 'italic' : 'underline'); syncBlocksFromEditor(p); save(); return; }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); splitBlockAtCaret(p, b, target); return; }
    if (e.key === 'Backspace' && getSelection()?.isCollapsed) { const before = contentAtCaret(target, false); if (before?.toString() === '' && (b.text === '' || p.blocks.indexOf(b) > 0)) { e.preventDefault(); mergeOrRemoveBlock(p, b, target); return; } }
    if (e.key === '/' && !(target.textContent || '').replace(/\u200b/g, '')) { setTimeout(() => showMenu('', b), 0); return; }
    if (e.key === ' ') { const raw = (target.textContent || '').replace(/\u200b/g, '').trim(), map = { '#': 'h1', '##': 'h2', '###': 'h3', '-': 'bullet', '*': 'bullet', '+': 'bullet', '[]': 'todo', '[ ]': 'todo', '>': 'quote', '---': 'divider' }; if (map[raw] || (/^\d+\.$/.test(raw))) { e.preventDefault(); b.type = map[raw] || 'numbered'; b.text = ''; b.html = undefined; save(); render(); focusBlockAt(Number(blockEl.dataset.index)); } }
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
    if (!['deleteContentBackward','deleteContentForward'].includes(event.inputType)) return;
    const selection = getSelection(); if (!selection?.rangeCount || selection.isCollapsed) return;
    const range = selection.getRangeAt(0), startBlock = activeBlockFromNode(range.startContainer), endBlock = activeBlockFromNode(range.endContainer);
    if (!startBlock || !endBlock || startBlock === endBlock) return;
    const page = current(), startIndex = page.blocks.indexOf(page.blocks[Number(startBlock.dataset.index)]), endIndex = page.blocks.indexOf(page.blocks[Number(endBlock.dataset.index)]);
    if (startIndex < 0 || endIndex <= startIndex) return;
    const startTarget = editableTarget(startBlock), endTarget = editableTarget(endBlock);
    if (!startTarget.contains(range.startContainer) || !endTarget.contains(range.endContainer)) return;
    const before = document.createRange(), after = document.createRange();
    before.selectNodeContents(startTarget); before.setEnd(range.startContainer, range.startOffset);
    after.selectNodeContents(endTarget); after.setStart(range.endContainer, range.endOffset);
    const prefix = fragmentAsEditableHTML(before.cloneContents()), suffix = fragmentAsEditableHTML(after.cloneContents());
    const text = prefix.text + suffix.text, html = cleanInlineHtml(prefix.html + suffix.html), first = page.blocks[startIndex];
    const kept = { ...first, type: text ? first.type : 'text', text, html: html || undefined };
    if (!text) { kept.checked = undefined; kept.targetId = undefined; kept.mentions = undefined; }
    page.blocks.splice(startIndex, endIndex - startIndex + 1, kept);
    if (!page.blocks.length) page.blocks.push(block('text'));
    event.preventDefault(); save(); render(); focusBlockAt(startIndex); setCaretAtTextOffset(editableTarget(editor.querySelector(`[data-index="${startIndex}"]`)), prefix.text.length);
}
function onEditorInput(e) {
    if (!editor.contains(e.target) || !e.target.isContentEditable) return;
    if (e.target.closest('.column-cell, .simple-table')) return;
    const blockBeforeInput = activeBlockFromSelection(); if (blockBeforeInput) removeCaretAnchorFromInput(editableTarget(blockBeforeInput));
    if (e.inputType === 'insertText' && e.data === ' ') { const activeBlock = activeBlockFromSelection(); if (activeBlock) inlineMarkdownAtCaret(editableTarget(activeBlock)); }
    const p = current(); syncBlocksFromEditor(p); const blockEl = activeBlockFromSelection(); if (!blockEl) { save(); return; } const b = p.blocks[Number(blockEl.dataset.index)], target = editableTarget(blockEl), value = target.innerText || ''; const wordCount = editor.querySelector('.word-count'); if (wordCount) wordCount.textContent = `${countWords(p)} words`;
    if (!b) { save(); return; }
    if (value.startsWith('/') && !value.includes('\n')) {
        showMenu(value.slice(1), b);
        return;
    }
    const pageQuery = value.match(/\[\[([^\]]*)$/), mentionQuery = value.match(/@([^@\s]*)$/);
    if (pageQuery || mentionQuery) {
        const isPageLink = !!pageQuery, q = (pageQuery?.[1] || mentionQuery?.[1] || '').toLowerCase();
        const suggestions = isPageLink ? state.pages.map(x => ({ id: x.id, label: x.title, kind: 'page' })) : [...state.pages.map(x => ({ id: x.id, label: x.title, kind: 'page' })), ...state.users.map(x => ({ id: x.id, label: x.name, kind: 'person' }))];
        const matches = suggestions.filter(x => x.label.toLowerCase().includes(q)).slice(0, 8), menu = $('#command-menu');
        menu.innerHTML = '';
        matches.forEach((x, i) => { const r = document.createElement('button'); r.type='button';r.setAttribute('role','option');r.setAttribute('aria-selected',String(!i));r.className = 'command-row' + (!i ? ' selected' : ''); r.innerHTML = `<span class="command-icon">${x.kind==='page'?'▤':'@'}</span><span class="command-copy"><span>${esc(x.label)}</span><small>${x.kind==='page'?'Page':'Person'}</small></span><kbd>${!i?'↵':''}</kbd>`; r.onclick = () => { const start = isPageLink ? value.lastIndexOf('[[') : value.lastIndexOf('@'), prefix = start < 0 ? '' : value.slice(0, start), idx = p.blocks.indexOf(b); if (prefix) {
            b.text = prefix;
            b.type = 'text';
            b.html = undefined;
            const ref = { id: id(), type: isPageLink ? 'page_link' : 'mention', text: x.label, targetId: isPageLink || x.kind === 'page' ? x.id : undefined, mentions: isPageLink ? undefined : [{ kind: x.kind, id: x.id, label: x.label }] };
            p.blocks.splice(idx + 1, 0, ref);
        }
        else {
            b.type = isPageLink ? 'page_link' : 'mention';
            b.targetId = isPageLink || x.kind === 'page' ? x.id : undefined;
            b.mentions = isPageLink ? undefined : [{ kind: x.kind, id: x.id, label: x.label }];
            b.text = x.label;
            b.html = undefined;
        } save(); render(); menu.hidden = true; activeMenu = null; }; menu.append(r); });
        menu.hidden = !matches.length;
        placeCommandMenu(menu,blockEl);
        activeMenu = matches.length ? menu : null;
        menuIndex = 0;
        return;
    }
    if (activeMenu)
        activeMenu.hidden = true;
    activeMenu = null;
    save();
}
document.addEventListener('keydown', showMenuKeyboard, true);
document.addEventListener('pointerdown', event => { if (!activeMenu || activeMenu.hidden || activeMenu.contains(event.target)) return; closeMenu(); }, true);
editor.addEventListener('input', onEditorInput);
editor.addEventListener('beforeinput', handleBlockRangeDeletion);
editor.addEventListener('paste', handleMarkdownPaste);
editor.addEventListener('click', event => setActiveEditorBlock(event.target.closest('.block')));
editor.addEventListener('keyup', () => setActiveEditorBlock(activeBlockFromSelection()));
editor.addEventListener('focusout', event => { if (!editor.contains(event.relatedTarget)) setActiveEditorBlock(null); });
let searchMatches = [];
let searchIndex = 0;
function openSearch() { if (activeMenu) activeMenu.hidden = true; activeMenu = null; const dialog = $('#search-dialog'); if (dialog.open) { $('#search-input').focus(); return; } $('#search-input').value = ''; updateSearchResults(''); dialog.showModal(); $('#search-input').focus(); }
function updateSearchResults(query) { const q = query.trim().toLowerCase(), out = $('#search-results'); searchMatches = state.pages.map(page => { const title = page.title.toLowerCase(), contentBlock = page.blocks.find(item => item.text?.toLowerCase().includes(q)); const score = !q ? 0 : title === q ? 4 : title.startsWith(q) ? 3 : title.includes(q) ? 2 : contentBlock ? 1 : -1; return { page, score, preview: contentBlock?.text || '' }; }).filter(result => result.score >= 0).sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title)); searchIndex = 0; out.replaceChildren(); if (!searchMatches.length) { const empty = document.createElement('div'); empty.className = 'search-empty'; empty.textContent = q ? 'No pages found. Try another title or a word from the page.' : 'No pages yet. Create one with the New hub button.'; out.append(empty); $('#search-input').setAttribute('aria-expanded', 'false'); return; } searchMatches.forEach(({ page, preview }, index) => { const row = document.createElement('button'); row.type = 'button'; row.id = `search-result-${index}`; row.className = 'search-result' + (index === searchIndex ? ' selected' : ''); row.setAttribute('role', 'option'); row.setAttribute('aria-selected', String(index === searchIndex)); const icon = document.createElement('span'); icon.className = 'search-result-icon'; icon.textContent = page.icon.startsWith('data:image') ? '▧' : page.icon; const copy = document.createElement('span'); copy.className = 'search-result-copy'; const title = document.createElement('strong'); title.textContent = page.title || 'Untitled'; const description = document.createElement('small'); description.textContent = preview ? preview.replace(/\s+/g, ' ').trim() : 'Page'; copy.append(title, description); row.append(icon, copy); row.onclick = () => openSearchResult(index); out.append(row); }); $('#search-input').setAttribute('aria-expanded', 'true'); $('#search-input').setAttribute('aria-activedescendant', `search-result-${searchIndex}`); }
function moveSearchSelection(delta) { if (!searchMatches.length) return; searchIndex = (searchIndex + delta + searchMatches.length) % searchMatches.length; $('#search-results').querySelectorAll('.search-result').forEach((row, index) => { row.classList.toggle('selected', index === searchIndex); row.setAttribute('aria-selected', String(index === searchIndex)); }); $('#search-input').setAttribute('aria-activedescendant', `search-result-${searchIndex}`); $('#search-result-' + searchIndex)?.scrollIntoView({ block: 'nearest' }); }
function openSearchResult(index) { const result = searchMatches[index]; if (!result) return; navigateToPage(result.page.id); $('#search-dialog').close(); }
document.addEventListener('click', e => { const a = e.target.closest('[data-action]')?.dataset.action; if (a === 'dashboard') { const home = state.pages.find(page => !page.parentId); if (home) navigateToPage(home.id); } if (a === 'search') {
    openSearch();
} if (a === 'new-page') {
    const p = createPage(undefined);
    navigateToPage(p.id);
} if (a === 'toggle-sidebar')
    $('#sidebar').classList.toggle('open'); if (a === 'share')
    toast('Page link copied'); });
$('#search-input').addEventListener('input', e => updateSearchResults(e.target.value));
$('#search-input').addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); moveSearchSelection(1); } else if (e.key === 'ArrowUp') { e.preventDefault(); moveSearchSelection(-1); } else if (e.key === 'Enter' && searchMatches.length) { e.preventDefault(); openSearchResult(searchIndex); } });
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSearch();
} if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); openSearch(); } if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); navigateHistory(-1); } if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); navigateHistory(1); } if (e.key === 'Escape' && $('#search-dialog').open)
    $('#search-dialog').close(); });
document.addEventListener('click', e => { const action = e.target.closest('[data-action]')?.dataset.action; if (action === 'settings') openWorkspaceSettings(); if (action === 'import') openWorkspaceSettings(); });
document.addEventListener('click', e => { if (e.target.closest('[data-action="remove-icon"]')) choosePageIcon('📄'); });
document.addEventListener('click', e => { const action = e.target.closest('[data-action]')?.dataset.action, menu = $('#page-options-menu'), trigger = $('[data-action="page-options"]'); if (action === 'page-options') { menu.hidden = !menu.hidden; trigger.setAttribute('aria-expanded', String(!menu.hidden)); return; } if (!e.target.closest('#page-options-menu')) { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); } if (action === 'history-back') navigateHistory(-1); if (action === 'history-forward') navigateHistory(1); if (action === 'toggle-width') { current().fullWidth = !current().fullWidth; save(); render(); menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); } if (action === 'toggle-word-count') { current().showWordCount = !current().showWordCount; save(); render(); menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); } if (action === 'apply-cover') applyCoverFromPicker(); if (action === 'remove-cover') { const page = coverTargetPage; if (page) { page.cover = undefined; page.coverX = page.coverY = undefined; page.coverZoom = undefined; page.coverAspect = undefined; save(); render(); $('#cover-dialog').close(); } } });
$('#save-workspace-name').addEventListener('click', () => { const name = $('#settings-workspace-name').value.trim(); if (!name) { $('#settings-feedback').textContent = 'Enter a workspace name first.'; $('#settings-workspace-name').focus(); return; } state.workspaceName = name; save(); renderNav(); $('#breadcrumbs').firstElementChild.textContent = name; $('#settings-feedback').textContent = 'Workspace name saved.'; toast('Workspace name updated'); });
$('#settings-workspace-name').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#save-workspace-name').click(); } });
$('#export-workspace').addEventListener('click', exportWorkspaceBackup);
$('#export-pre-reset-backup').addEventListener('click', exportPreviousWorkspaceBackup);
$('#import-workspace-file').addEventListener('change', async e => { const file = e.target.files?.[0]; if (!file) return; try { pendingWorkspaceImport = decodeWorkspaceBackup(JSON.parse(await file.text())); $('#settings-feedback').textContent = `Ready to restore “${pendingWorkspaceImport.workspace.workspaceName}” with ${pendingWorkspaceImport.workspace.pages.length} pages and ${pendingWorkspaceImport.assets.length} assets. Restoring replaces the current local workspace.`; $('#apply-workspace-import').disabled = false; } catch (error) { pendingWorkspaceImport = null; $('#apply-workspace-import').disabled = true; $('#settings-feedback').textContent = error.message || 'Could not read this backup file.'; } });
$('#apply-workspace-import').addEventListener('click', restoreWorkspaceBackup);
function pageMenu(p, anchor) { closeMenu(); const menu = $('#command-menu'); menu.className = 'command-menu page-actions'; menu.replaceChildren(); const heading = document.createElement('div'); heading.className = 'menu-heading'; const icon = document.createElement('span'); icon.className = 'menu-heading-icon'; icon.innerHTML = pageIconMarkup(p.icon); const title = document.createElement('strong'); title.textContent = p.title || 'Untitled'; heading.append(icon, title); menu.append(heading); const list = document.createElement('div'); list.className = 'command-list'; menu.append(list); const add = (label, run) => list.append(menuRow(label, menuGlyph(label), run)); const divider = () => { const line = document.createElement('div'); line.className = 'menu-divider'; list.append(line); }; add('Open in new tab', () => openPageInNewTab(p.id)); add('Rename', () => { const name = prompt('Page title', p.title); if (name?.trim()) { p.title = name.trim(); save(); render(); } }); add('Duplicate', () => duplicatePage(p)); add('Copy link', () => copyPageLink(p)); divider(); add(p.favorite ? 'Remove from favorites' : 'Add to favorites', () => { p.favorite = !p.favorite; save(); render(); }); add('Change icon', () => iconPicker(p)); divider(); add('Delete', () => { if (confirm(`Move “${p.title}” and its children to Trash?`)) { deletePageTree(p.id); if (!state.pages.length) createPage(); if (!state.pages.some(page => page.id === state.activePageId)) state.activePageId = state.pages[0].id; pageHistory = [state.activePageId]; historyIndex = 0; save(); render(); } }); const point = anchor?.clientX != null ? { x: anchor.clientX, y: anchor.clientY + 2 } : anchor?.getBoundingClientRect ? { x: anchor.getBoundingClientRect().right, y: anchor.getBoundingClientRect().bottom + 2 } : { x: 256, y: 92 }; placeFloatingMenu(menu, point.x, point.y); menuIndex = 0; refreshMenuSelection(); activeMenu = menu; }
function readAssets() { try { const items = JSON.parse(localStorage.getItem(ASSET_STORE) || '[]'); return Array.isArray(items) ? items.filter(item => item && typeof item.name === 'string' && typeof item.url === 'string') : []; } catch { return []; } }
function coverBannerAspect() {
    const cover = editor.querySelector('.page-cover');
    if (cover?.clientHeight) return cover.clientWidth / cover.clientHeight;
    const probe = document.createElement('div');
    probe.className = 'page-cover';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    editor.prepend(probe);
    const aspect = probe.clientWidth / Math.max(1, probe.clientHeight);
    probe.remove();
    return aspect || 3.8;
}
function applyCoverBackground(element, page) {
    const zoom = Math.max(100, Number(page.coverZoom) || 100);
    element.style.backgroundPosition = `${page.coverX ?? 50}% ${page.coverY ?? 50}%`;
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
        event.preventDefault(); event.stopPropagation(); const m = coverCropMetrics; if (!m) return;
        const start = { mode, x: event.clientX, y: event.clientY, left: m.left, top: m.top, width: m.cropWidth };
        const move = next => updatePosition(next.clientX - start.x, next.clientY - start.y, start);
        const end = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', end, { once: true });
    };
    frame.addEventListener('pointerdown', event => { if (event.target !== handle) beginDrag(event, 'move'); });
    handle.addEventListener('pointerdown', event => beginDrag(event, 'resize'));
    requestAnimationFrame(positionCoverCrop);
}
function selectCoverAsset(url) { chosenCoverAsset = url; $('#cover-assets').querySelectorAll('.cover-asset').forEach(button => button.classList.toggle('selected', button.dataset.url === url)); updateCoverCropPreview(); }
function renderCoverAssets() { const list = $('#cover-assets'), query = $('#cover-asset-search').value.trim().toLowerCase(); list.replaceChildren(); const assets = readAssets(); if (coverTargetPage?.cover && !assets.some(item => item.url === coverTargetPage.cover)) assets.unshift({ name: 'Current cover', url: coverTargetPage.cover }); const filtered = assets.filter(asset => asset.name.toLowerCase().includes(query)); if (!filtered.length) { const empty = document.createElement('span'); empty.className = 'cover-assets-empty'; empty.textContent = assets.length ? 'No images match this search.' : 'No saved images yet. Upload one to add it to the local image library.'; list.append(empty); return; } filtered.forEach(asset => { const button = document.createElement('button'); button.type = 'button'; button.className = 'cover-asset'; button.title = asset.name; button.setAttribute('aria-label', `Use ${asset.name} as cover`); button.dataset.url = asset.url; button.style.backgroundImage = `url("${asset.url}")`; button.onclick = () => selectCoverAsset(asset.url); list.append(button); }); list.querySelectorAll('.cover-asset').forEach(button => button.classList.toggle('selected', button.dataset.url === chosenCoverAsset)); }
function openCoverPicker(page) { coverTargetPage = page; chosenCoverAsset = page.cover || ''; $('#cover-zoom').value = String(page.coverZoom || 100); $('#cover-x').value = String(page.coverX ?? 50); $('#cover-y').value = String(page.coverY ?? 50); $('#cover-asset-search').value = ''; renderCoverAssets(); $('#cover-dialog').showModal(); updateCoverCropPreview(); }
function applyCoverFromPicker() { if (!coverTargetPage || !chosenCoverAsset) { toast('Choose an image first'); return; } const page = coverTargetPage, finish = aspect => { page.cover = chosenCoverAsset; page.coverZoom = Number($('#cover-zoom').value); page.coverX = Number($('#cover-x').value); page.coverY = Number($('#cover-y').value); if (aspect) page.coverAspect = aspect; save(); $('#cover-dialog').close(); render(); }; const image = new Image(); image.onload = () => finish(image.naturalWidth / Math.max(1, image.naturalHeight)); image.onerror = () => finish(0); image.src = chosenCoverAsset; }
$('#cover-asset-search').addEventListener('input', renderCoverAssets);
$('#cover-upload').addEventListener('change', event => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) { toast('Choose an image file'); return; } const reader = new FileReader(); reader.onload = () => { const url = String(reader.result); const assets = readAssets(); if (!assets.some(item => item.url === url)) assets.unshift({ name: file.name, url }); try { localStorage.setItem(ASSET_STORE, JSON.stringify(assets)); } catch { toast('Image selected, but it could not be saved to the local asset list'); } renderCoverAssets(); selectCoverAsset(url); }; reader.readAsDataURL(file); event.target.value = ''; });
const emojiChoices = [['📄','document page'],['📝','memo note'],['📚','books resources'],['📁','folder'],['📌','pin'],['⭐','star favorite'],['✨','sparkles'],['💡','idea'],['🎯','target'],['🚀','rocket'],['🎨','art palette'],['🧠','brain'],['💬','speech chat'],['📅','calendar'],['✅','check'],['🔥','fire'],['❤️','heart'],['🌱','plant'],['🌍','earth'],['🏠','home'],['🏢','office'],['📈','chart'],['🧩','puzzle'],['🎵','music'],['📷','camera'],['🔒','lock'],['🛠️','tools'],['💻','computer'],['🤝','handshake'],['🎉','celebration'],['🧪','experiment'],['🗂️','files'],['🧭','compass'],['☀️','sun'],['🌙','moon'],['🐛','bug'],['🗓️','schedule'],['🖊️','writing'],['💰','money'],['🏆','award'],['⚡','lightning'],['🌈','rainbow'],['🔔','notification'],['📣','announcement'],['🛒','shopping'],['✈️','travel'],['🍽️','food'],['🐶','dog'],['🐱','cat'],['🌸','flower'],['💎','gem']];
function choosePageIcon(value) { if (!iconTargetPage) return; iconTargetPage.icon = value || '📄'; save(); render(); $('#icon-dialog').close(); }
function renderIconPicker() {
    const query = $('#icon-search').value.trim().toLowerCase(), grid = $('#emoji-grid'), assets = $('#icon-assets'); grid.replaceChildren(); assets.replaceChildren();
    const emojis = emojiChoices.filter(([emoji, label]) => !query || `${emoji} ${label}`.toLowerCase().includes(query));
    if (!emojis.length) { const empty = document.createElement('div'); empty.className = 'emoji-empty'; empty.textContent = 'No matching emoji. Upload or search the image library below.'; grid.append(empty); }
    emojis.forEach(([emoji, label]) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'emoji-option'; button.textContent = emoji; button.title = label; button.setAttribute('aria-label', label); button.onclick = () => choosePageIcon(emoji); grid.append(button); });
    const matches = readAssets().filter(asset => (asset.tags || []).includes('icon') || /icon/i.test(asset.name)).filter(asset => asset.name.toLowerCase().includes(query));
    if (!matches.length) { const empty = document.createElement('span'); empty.className = 'cover-assets-empty'; empty.textContent = query ? 'No uploaded images match.' : 'No uploaded images yet.'; assets.append(empty); }
    matches.forEach(asset => { const button = document.createElement('button'); button.type = 'button'; button.className = 'cover-asset'; button.title = asset.name; button.setAttribute('aria-label', `Use ${asset.name} as icon`); button.style.backgroundImage = `url("${asset.url}")`; button.onclick = () => choosePageIcon(asset.url); assets.append(button); });
}
function iconPicker(page) { iconTargetPage = page; $('#icon-search').value = ''; renderIconPicker(); $('#icon-dialog').showModal(); $('#icon-search').focus(); }
$('#icon-search').addEventListener('input', renderIconPicker);
$('#icon-upload').addEventListener('change', event => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const url = String(reader.result), assets = readAssets(); if (!assets.some(item => item.url === url)) assets.unshift({ name: file.name, url, tags: ['icon'] }); try { localStorage.setItem(ASSET_STORE, JSON.stringify(assets)); } catch { toast('Icon selected, but it could not be saved to the local image library'); } choosePageIcon(url); }; reader.readAsDataURL(file); event.target.value = ''; });
function uploadForBlock(b, p) { const file = document.createElement('input'); file.type = 'file'; file.accept = 'image/*'; file.onchange = () => { const f = file.files?.[0]; if (!f)
    return; const r = new FileReader(); r.onload = () => { b.type = 'image'; b.url = String(r.result); b.text = f.name; save(); render(); }; r.readAsDataURL(f); }; file.click(); }
function pageLinkVisible(p) { return p.blocks.some(b => b.type === 'page_link' && state.pages.some(x => x.id === b.targetId)); }
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
    e.preventDefault();
    const p = createPage();
    navigateToPage(p.id);
} });
let coverResizeFrame = 0;
window.addEventListener('resize', () => { cancelAnimationFrame(coverResizeFrame); coverResizeFrame = requestAnimationFrame(() => { const page = current(), cover = editor.querySelector('.page-cover'); if (cover && page?.cover) applyCoverBackground(cover, page); if ($('#cover-dialog').open) positionCoverCrop(); }); });
const initialParams = new URLSearchParams(location.hash.replace(/^#/, ''));
const initialPageId = initialParams.get('page'), initialBlockId = initialParams.get('block');
if (initialPageId && state.pages.some(page => page.id === initialPageId)) { state.activePageId = initialPageId; pageHistory = [initialPageId]; historyIndex = 0; }
window.addEventListener('hashchange', () => { const params = new URLSearchParams(location.hash.replace(/^#/, '')), pageId = params.get('page'); if (pageId) navigateToPage(pageId); const blockId = params.get('block'); if (blockId) requestAnimationFrame(() => { focusLinkedBlock(blockId); try { history.replaceState(null, '', pageHref(current().id, blockId)); } catch { } }); });
render();
if (initialBlockId) { try { history.replaceState(null, '', pageHref(state.activePageId, initialBlockId)); } catch { } requestAnimationFrame(() => focusLinkedBlock(initialBlockId)); } else syncPageUrl(state.activePageId);

