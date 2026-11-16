// @ts-nocheck
type BlockType = 'text'|'h1'|'h2'|'h3'|'bullet'|'numbered'|'todo'|'toggle'|'quote'|'callout'|'divider'|'page_link'|'mention'|'code'|'image'|'file'|'bookmark'|'video'|'audio'|'embed'|'equation'|'columns'|'table'|'toc'|'breadcrumb'|'button'|'date';
type Block = { id:string; type:BlockType; text:string; html?:string; checked?:boolean; targetId?:string; url?:string; language?:string; children?:Block[]; tableData?:{headers:string[];rows:string[][]}; mentions?:{kind:'page'|'person';id:string;label:string}[] };
type Page = { id:string; title:string; icon:string; parentId?:string; favorite?:boolean; cover?:string; coverY?:number; description?:string; properties?:DatabaseProperty[]; blocks:Block[]; createdAt:number; updatedAt:number };
type Workspace = { version:2; workspaceName:string; activePageId:string; pages:Page[]; users:{id:string;name:string}[] };
type PropertyType = 'text'|'status'|'select'|'date'|'number'|'person'|'url'|'email'|'phone'|'checkbox'|'files';
type DatabaseProperty = { id:string; name:string; type:PropertyType; value:string|number|boolean; options?:string[] };
const STORE = 'notion-clone-workspace-v2';
const oldStore = 'notion-clone-pages';
const id = () => crypto.randomUUID();
const block = (type, text = '') => ({ id: id(), type, text });
const starter = [
    { id: 'home', title: 'Getting started', icon: '👋', blocks: [block('text', 'Welcome to your workspace. Use / to add a block, @ to mention a page or person, and [[ to link a page.'), block('callout', '✨ Your workspace is ready. Make it yours by editing this page.'), block('h2', 'Make this space your own'), block('bullet', 'Write something down — click and start typing.'), block('bullet', 'Create a page for a project, meeting, or anything else.'), block('bullet', 'Invite your team to collaborate.')], createdAt: Date.now(), updatedAt: Date.now() },
    { id: 'projects', title: 'Projects', icon: '📁', blocks: [block('text', 'A home for active work.')], createdAt: Date.now(), updatedAt: Date.now() },
    { id: 'roadmap', title: 'Roadmap', icon: '🗺️', parentId: 'projects', blocks: [block('text', 'A clear view of where we’re going.'), block('h2', 'This quarter'), block('todo', 'Ship the onboarding experience'), block('todo', 'Launch the customer feedback portal')], createdAt: Date.now(), updatedAt: Date.now() },
    { id: 'meetings', title: 'Meeting notes', icon: '📝', blocks: [block('text', 'Keep decisions and follow-ups easy to find.'), block('h2', 'Weekly team sync'), block('bullet', 'Review progress on the roadmap'), block('todo', 'Share revised timeline')], createdAt: Date.now(), updatedAt: Date.now() }
];
function loadWorkspace() { try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
        const w = JSON.parse(raw);
        if (w.version === 2 && Array.isArray(w.pages))
            return w;
    }
    const old = JSON.parse(localStorage.getItem(oldStore) || 'null');
    if (Array.isArray(old)) {
        const pages = old.map((p) => ({ id: p.id || id(), title: p.title || 'Untitled', icon: p.icon || '📄', parentId: p.parent || undefined, blocks: (p.blocks || []).map((b) => ({ id: id(), type: { paragraph: 'text' }[b.type] || b.type, text: b.text || '', checked: b.checked })), createdAt: Date.now(), updatedAt: Date.now() }));
        return { version: 2, workspaceName: 'Acme Studio', activePageId: localStorage.getItem('notion-clone-active') || pages[0]?.id, pages, users: [{ id: 'jordan.davis', name: 'Jordan Davis' }, { id: 'alex.morgan', name: 'Alex Morgan' }, { id: 'sam.lee', name: 'Sam Lee' }] };
    }
}
catch { } return { version: 2, workspaceName: 'Acme Studio', activePageId: 'home', pages: starter, users: [{ id: 'jordan.davis', name: 'Jordan Davis' }, { id: 'alex.morgan', name: 'Alex Morgan' }, { id: 'sam.lee', name: 'Sam Lee' }] }; }
let state = loadWorkspace();
let saveTimer;
let activeMenu = null;
let menuOptions = [];
let menuIndex = 0;
const $ = (s) => document.querySelector(s);
const editor = $('#editor');
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800); };
function current() { return state.pages.find(p => p.id === state.activePageId) || state.pages[0]; }
function save() { current().updatedAt = Date.now(); $('#saved-status').textContent = 'Saving…'; clearTimeout(saveTimer); saveTimer = window.setTimeout(() => { localStorage.setItem(STORE, JSON.stringify(state)); $('#saved-status').textContent = 'All changes saved'; }, 180); }
function esc(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function cleanInlineHtml(html) { const doc=new DOMParser().parseFromString(html,'text/html'),allowed=new Set(['STRONG','B','EM','I','S','DEL','CODE','U','A','BR']);const walk=node=>Array.from(node.childNodes).map(child=>{if(child.nodeType===Node.TEXT_NODE)return esc(child.textContent||'');if(child.nodeType!==Node.ELEMENT_NODE)return '';const tag=child.tagName;if(!allowed.has(tag))return walk(child);if(tag==='BR')return '<br>';const content=walk(child);if(tag==='A'){const href=child.getAttribute('href')||'';try{const url=new URL(href,location.href);if(['http:','https:','mailto:'].includes(url.protocol))return `<a href="${esc(url.href)}" rel="noopener noreferrer">${content}</a>`}catch{}return content}return `<${tag.toLowerCase()}>${content}</${tag.toLowerCase()}>`}).join('');return walk(doc.body)}
function inlineMarkdownAtCaret(el) { const selection=getSelection();if(!selection?.rangeCount)return false;const active=selection.getRangeAt(0),node=active.startContainer,offset=active.startOffset;if(node.nodeType!==Node.TEXT_NODE)return false;const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];let item,total=0,caretOffset=null;while(item=walker.nextNode()){nodes.push({node:item,start:total});if(item===node)caretOffset=total+offset;total+=item.textContent.length}if(caretOffset===null)return false;const before=el.innerText.slice(0,caretOffset),match=before.match(/(\*\*([^*]+)\*\*|\*([^*]+)\*|~~([^~]+)~~|`([^`]+)`) $/);if(!match)return false;const tag=match[2]?'strong':match[3]?'em':match[4]?'del':'code',content=match[2]||match[3]||match[4]||match[5],startOffset=caretOffset-match[0].length,pointAt=target=>{for(const entry of nodes){const length=entry.node.textContent.length;if(target<=entry.start+length)return [entry.node,target-entry.start]}const last=nodes[nodes.length-1];return last?[last.node,last.node.textContent.length]:[el,0]},[startNode,start]=pointAt(startOffset),range=document.createRange();range.setStart(startNode,start);range.setEnd(node,offset);range.deleteContents();const formatted=document.createElement(tag);formatted.textContent=content;const space=document.createTextNode(' ');range.insertNode(formatted);formatted.after(space);const caret=document.createRange();caret.setStartAfter(space);caret.collapse(true);selection.removeAllRanges();selection.addRange(caret);return true}
function renderNav() { const nav=$('#page-list');nav.replaceChildren();state.expandedPageIds=state.expandedPageIds||[];const section=(label)=>{const wrap=document.createElement('section');wrap.className='outline-section';const heading=document.createElement('div');heading.className='nav-label';heading.textContent=label;const list=document.createElement('div');wrap.append(heading,list);nav.append(wrap);return list};const favorites=section('FAVORITES'),shared=section('SHARED'),pages=section('WORKSPACE PAGES');const hasChildren=p=>state.pages.some(x=>x.parentId===p.id);const addRow=(p,container,depth=0,tree=false)=>{const row=document.createElement('div');row.className='page-nav'+(p.id===state.activePageId?' active':'');row.style.paddingLeft=`${7+depth*13}px`;const children=hasChildren(p);const arrow=document.createElement('button');arrow.type='button';arrow.className='page-expand'+(state.expandedPageIds.includes(p.id)?' expanded':'');arrow.textContent=children?'›':'';arrow.setAttribute('aria-label',state.expandedPageIds.includes(p.id)?'Collapse subpages':'Expand subpages');arrow.onclick=e=>{e.stopPropagation();if(!children)return;state.expandedPageIds.includes(p.id)?state.expandedPageIds=state.expandedPageIds.filter(id=>id!==p.id):state.expandedPageIds.push(p.id);save();renderNav()};const icon=document.createElement('span');icon.className='page-icon';icon.innerHTML=p.icon.startsWith('data:image')?`<img src="${p.icon}"/>`:esc(p.icon);const title=document.createElement('span');title.className='page-title';title.textContent=p.title;const more=document.createElement('button');more.type='button';more.className='page-more';more.title='Page actions';more.textContent='•••';more.onclick=e=>{e.stopPropagation();pageMenu(p)};row.append(arrow,icon,title,more);row.onclick=()=>{state.activePageId=p.id;save();render()};container.append(row);if(tree&&children&&state.expandedPageIds.includes(p.id))state.pages.filter(x=>x.parentId===p.id&&!x.shared&&!x.favorite).forEach(child=>addRow(child,container,depth+1,true))};state.pages.filter(p=>p.favorite).sort((a,b)=>a.title.localeCompare(b.title)).forEach(p=>addRow(p,favorites,0,true));state.pages.filter(p=>p.shared&&!p.favorite).forEach(p=>addRow(p,shared,0,true));state.pages.filter(p=>!p.parentId&&!p.favorite&&!p.shared).forEach(p=>addRow(p,pages,0,true));const ws=$('#workspace-access');if(ws){ws.innerHTML='';const button=document.createElement('button');button.className='workspace-access-item';button.innerHTML=`<span class="workspace-access-icon">N</span><span>${esc(state.workspaceName)}</span><span class="workspace-access-arrow">⌄</span>`;button.title='Workspaces you can access';ws.append(button)}}
function render() { const p = current(); if(!p.blocks.length||p.blocks[p.blocks.length-1].type!=='text'||p.blocks[p.blocks.length-1].text!==''){p.blocks.push(block('text'));save()} renderNav(); $('#breadcrumbs').innerHTML = `<span>${esc(state.workspaceName)}</span><span>›</span><strong>${esc(p.title)}</strong>`; editor.replaceChildren(); if (p.cover) {
    const c = document.createElement('div');
    c.className = 'page-cover';
    c.style.backgroundImage = `url("${p.cover}")`;
    c.style.backgroundPosition = `center ${p.coverY ?? 50}%`;
    const edit = document.createElement('button');
    edit.className = 'edit-cover';
    edit.textContent = 'Edit cover';
    edit.onclick = () => coverPicker(p);
    c.append(edit);
    editor.append(c);
} const bar = document.createElement('div'); bar.className = 'page-toolbar'; bar.innerHTML = '<button data-action="cover">＋ Add cover</button><button data-action="icon">☺ Add icon</button><button data-action="favorite">☆ Favorite</button><span class="edit-time">Edited just now</span>'; editor.append(bar); bar.querySelector('[data-action="cover"]').addEventListener('click', () => coverPicker(p)); bar.querySelector('[data-action="icon"]').addEventListener('click', () => iconPicker(p)); bar.querySelector('[data-action="favorite"]').addEventListener('click', () => { p.favorite = !p.favorite; save(); render(); }); const title = document.createElement('h1'); title.className = 'page-heading'; title.contentEditable = 'true'; title.spellcheck = true; title.textContent = p.title; title.oninput = () => { p.title = title.innerText; save(); renderNav(); $('#breadcrumbs').lastElementChild.textContent = p.title; }; editor.append(title); const sub = document.createElement('div'); sub.className = 'page-subtitle'; sub.contentEditable = 'true'; sub.dataset.placeholder = 'Add a description…'; sub.textContent = p.description || ''; sub.oninput = () => { p.description = sub.innerText; save(); }; editor.append(sub); editor.append(renderProperties(p)); p.blocks.forEach((b, i) => editor.append(renderBlock(p, b, i))); editor.onkeydown = editorKeys; }
function renderProperties(p) { const panel=document.createElement('section'); panel.className='property-panel'; const heading=document.createElement('div'); heading.className='property-heading'; heading.innerHTML='<span>Page properties</span>'; const add=document.createElement('button'); add.type='button'; add.textContent='＋ Add a property'; add.onclick=()=>{const name=prompt('Property name','Status');if(!name?.trim())return;const type=(prompt('Type: text, status, select, date, number, person, url, email, phone, checkbox, files','status')||'text').toLowerCase();const allowed=['text','status','select','date','number','person','url','email','phone','checkbox','files'];const selected=allowed.includes(type)?type:'text';p.properties=p.properties||[];p.properties.push({id:id(),name:name.trim(),type:selected,value:selected==='checkbox'?false:'',options:['status','select'].includes(selected)?['Not started','In progress','Done']:undefined});save();render()}; heading.append(add);panel.append(heading);const rows=document.createElement('div');rows.className='property-rows';(p.properties||[]).forEach(prop=>{const row=document.createElement('label');row.className='property-row';const name=document.createElement('span');name.className='property-name';name.textContent=prop.name;let input;if(prop.type==='checkbox'){input=document.createElement('input');input.type='checkbox';input.checked=!!prop.value;input.onchange=()=>{prop.value=input.checked;save()}}else if(prop.type==='status'||prop.type==='select'||prop.type==='person'){input=document.createElement('select');const options=prop.type==='person'?state.users.map(u=>u.name):(prop.options||['Option 1','Option 2']);input.innerHTML='<option value="">Empty</option>';options.forEach(option=>{const item=document.createElement('option');item.value=option;item.textContent=option;input.append(item)});input.value=String(prop.value||'');input.onchange=()=>{prop.value=input.value;save()}}else{input=document.createElement('input');input.type=prop.type==='date'?'date':prop.type==='number'?'number':prop.type==='email'?'email':prop.type==='url'?'url':'text';input.value=String(prop.value??'');input.placeholder=prop.type;input.oninput=()=>{prop.value=input.type==='number'&&input.value!==''?Number(input.value):input.value;save()}}row.append(name,input);rows.append(row)});panel.append(rows);if(!(p.properties||[]).length){const empty=document.createElement('div');empty.className='property-empty';empty.textContent='Add typed fields such as status, date, person, number, or URL.';panel.append(empty)}return panel}
function renderBlock(p, b, i) { const el = document.createElement('div'); el.className = 'block ' + b.type; el.dataset.index = String(i); if (b.type === 'divider') {
    el.contentEditable = 'false';
    return el;
} if (b.type === 'page_link') {
    el.contentEditable = 'false';
    const target = state.pages.find(x => x.id === b.targetId);
    el.innerHTML = `<span class="page-link-icon">${target?.icon || '📄'}</span><a href="#" class="inline-page-link">${esc(target?.title || b.text || 'Missing page')}</a>`;
    el.querySelector('a').onclick = e => { e.preventDefault(); if (target) {
        state.activePageId = target.id;
        save();
        render();
    } };
    return el;
} if (b.type === 'mention') {
    el.contentEditable = 'false';
    const m = b.mentions?.[0];
    if(m?.kind==='page'){const target=state.pages.find(page=>page.id===m.id);el.className='block page_link';el.innerHTML=`<span class="page-link-icon">${target?.icon||'📄'}</span><a href="#" class="inline-page-link">${esc(target?.title||m.label)}</a>`;el.querySelector('a').onclick=e=>{e.preventDefault();if(target){state.activePageId=target.id;save();render()}}}else el.innerHTML=m?`<span class="mention-chip">@ ${esc(m.label)}</span>`:esc(b.text);
    return el;
} if (b.type === 'image') {
    el.contentEditable = 'false';
    el.innerHTML = b.url ? `<img class="content-image" src="${esc(b.url)}" alt="${esc(b.text)}"><small>${esc(b.text)}</small>` : '<button class="image-placeholder">Choose image</button>';
    el.querySelector('button')?.addEventListener('click', () => uploadForBlock(b, p));
    return el;
} if (b.type === 'columns') {
    el.contentEditable = 'false';
    b.children = b.children?.length ? b.children : [block('text', 'Column 1'), block('text', 'Column 2')];
    el.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'column-grid';
    b.children.forEach(child => { const col = document.createElement('div'); col.className = 'column-cell'; col.contentEditable = 'true'; col.textContent = child.text; col.oninput = () => { child.text = col.innerText; save(); }; grid.append(col); });
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
        a.onclick = () => { state.activePageId = node.id; save(); render(); };
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
    el.innerHTML = `<input type="checkbox" ${b.checked ? 'checked' : ''}><span class="block-copy" contenteditable="true"></span>`;
    el.querySelector('.block-copy').textContent = b.text;
    el.querySelector('input').onchange = e => { b.checked = e.target.checked; save(); render(); };
    wireText(el.querySelector('.block-copy'), b, p);
    return el;
} if (b.type === 'toggle') {
    el.innerHTML = `<button class="toggle-arrow">›</button><span class="block-copy" contenteditable="true"></span><div class="toggle-content" hidden></div>`;
    el.querySelector('.block-copy').textContent = b.text;
    wireText(el.querySelector('.block-copy'), b, p);
    el.querySelector('button').onclick = () => { const c = el.querySelector('.toggle-content'); c.hidden = !c.hidden; el.classList.toggle('expanded', !c.hidden); };
    return el;
} if (b.type === 'code') {
    el.innerHTML = `<div class="code-meta"><select aria-label="Code language"><option>Plain text</option><option>JavaScript</option><option>TypeScript</option><option>Python</option><option>HTML</option><option>CSS</option><option>JSON</option></select><button>Copy</button></div><pre contenteditable="true"></pre>`;
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
} el.contentEditable = 'true'; el.dataset.placeholder = b.type === 'text' ? 'Type / for commands or start writing…' : ''; el.innerHTML = b.html ? cleanInlineHtml(b.html) : esc(b.text); wireText(el, b, p); return el; }
function wireText(el, b, p) { el.oninput = () => { b.text = el.innerText; b.html = cleanInlineHtml(el.innerHTML); save(); }; el.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const idx = p.blocks.indexOf(b);
    const n = block('text');
    p.blocks.splice(idx + 1, 0, n);
    save();
    render();
    document.querySelector(`[data-index="${idx + 1}"]`)?.focus();
} if (e.key === 'Backspace' && !el.innerText && p.blocks.length > 1) {
    e.preventDefault();const idx=p.blocks.indexOf(b);if(idx===p.blocks.length-1)return;
    p.blocks.splice(idx, 1);save();render();document.querySelector(`[data-index="${Math.max(0,idx-1)}"]`)?.focus();
} }; }
function cmdCatalog() {
    return [
        ['Text', 'text', 'Basic'], ['Page', 'page_link', 'Basic'], ['Bulleted list', 'bullet', 'Basic'], ['Numbered list', 'numbered', 'Basic'], ['To-do list', 'todo', 'Basic'], ['Toggle list', 'toggle', 'Basic'], ['Divider', 'divider', 'Basic'], ['Quote', 'quote', 'Basic'], ['Callout', 'callout', 'Basic'], ['Heading 1', 'h1', 'Basic'], ['Heading 2', 'h2', 'Basic'], ['Heading 3', 'h3', 'Basic'], ['Link to page', 'page_link', 'Basic'],
        ['Mention', 'mention', 'Inline'], ['Date / reminder', 'date', 'Inline'], ['Equation', 'equation', 'Inline'], ['Emoji', 'mention', 'Inline'], ['Image', 'image', 'Media'], ['PDF', 'file', 'Media'], ['Web bookmark', 'bookmark', 'Media'], ['Video', 'video', 'Media'], ['Audio', 'audio', 'Media'], ['Code', 'code', 'Media'], ['File', 'file', 'Media'], ['Embed', 'embed', 'Media'],
        ['Columns', 'columns', 'Layout'], ['Table', 'table', 'Layout'], ['Table of contents', 'toc', 'Advanced'], ['Breadcrumb', 'breadcrumb', 'Advanced'], ['Button / template', 'button', 'Advanced'], ['Math / LaTeX', 'equation', 'Advanced'], ['Duplicate block', 'text', 'Actions'], ['Move to page', 'text', 'Actions'], ['Delete block', 'text', 'Actions']
    ].map(([name, type, category]) => ({ name, type: type, category }));
}
function placeCommandMenu(menu,anchor){if(!anchor)return;const rect=anchor.getBoundingClientRect(),width=320;menu.style.left=`${Math.max(258,Math.min(window.innerWidth-width-12,rect.left+22))}px`;menu.style.top=`${Math.max(12,Math.min(window.innerHeight-350,rect.bottom+5))}px`}
function showMenu(query, blockAt) { const menu = $('#command-menu'); const q = query.toLowerCase(); let cmds = cmdCatalog().filter(c => (c.name + ' ' + c.category).toLowerCase().includes(q)); if (q === '') cmds = cmds.slice(0, 16); menuOptions = cmds.map(c => ({ label: c.name, meta: c.category, run: () => runCommand(c.name, c.type, blockAt) })); menu.innerHTML = '';menu.classList.toggle('empty',!cmds.length); menuOptions.forEach((o, i) => { const row = document.createElement('button'); row.type='button';row.setAttribute('role','option');row.setAttribute('aria-selected',String(i===0));row.className = 'command-row' + (!i ? ' selected' : '');row.innerHTML = `<span class="command-icon">${o.meta==='Basic'?'¶':o.meta==='Media'?'▧':o.meta==='Layout'?'▦':o.meta==='Actions'?'⋯':'@'}</span><span class="command-copy"><span>${esc(o.label)}</span><small>${esc(o.meta || '')}</small></span><kbd>${i===0?'↵':''}</kbd>`; row.onclick = () => { o.run(); menu.hidden = true;activeMenu=null; }; menu.append(row); });placeCommandMenu(menu,editor.querySelector(`[data-index="${current().blocks.indexOf(blockAt)}"]`));menuIndex = 0; menu.hidden = !cmds.length; activeMenu = menu; }
function runCommand(name, type, b) { const p = current(); const idx = p.blocks.indexOf(b); if (name === 'Page') {
    const child = createPage(p.id);
    p.blocks[idx] = { id: id(), type: 'page_link', text: child.title, targetId: child.id };
    save();
    state.activePageId = child.id;
    render();
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
} b.type = type; b.text = ''; b.html=undefined; save(); render(); document.querySelector(`[data-index="${idx}"]`)?.focus(); }
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
    return; const rows = Array.from(activeMenu.querySelectorAll('.command-row')); if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    e.stopPropagation();
    menuIndex = (menuIndex + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
    rows.forEach((x, i) => {x.classList.toggle('selected', i === menuIndex);x.setAttribute('aria-selected',String(i===menuIndex))});
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
function editorKeys(e) { const el = e.target; if (!el.matches('.block[contenteditable="true"]'))
    return; const p = current(); const b = p.blocks[Number(el.dataset.index)]; if((e.ctrlKey||e.metaKey)&&['b','i','u'].includes(e.key.toLowerCase())){e.preventDefault();document.execCommand(e.key.toLowerCase()==='b'?'bold':e.key.toLowerCase()==='i'?'italic':'underline');b.text=el.innerText;b.html=cleanInlineHtml(el.innerHTML);save();return} if (e.key === '/') {
    if (!el.innerText) {
        e.stopPropagation();
        setTimeout(() => showMenu('', b), 0);
    }
    return;
} if (e.key === ' ') {
    const raw = el.innerText.trim();
    const map = { '#': 'h1', '##': 'h2', '###': 'h3', '-': 'bullet', '*': 'bullet', '+': 'bullet', '[]': 'todo', '>': 'quote', '"': 'quote', '---': 'divider' };
    if (map[raw] || (/^\d+\.$/.test(raw))) {
        e.preventDefault();
        b.type = map[raw] || 'numbered';
        b.text = '';
        b.html = undefined;
        save();
        render();
        document.querySelector(`[data-index="${Number(el.dataset.index)}"]`)?.focus();
        return;
    }
} }
function onEditorInput(e) {
    const el = e.target;
    if (!el.matches('.block[contenteditable="true"]'))
        return;
    if(e.inputType==='insertText'&&e.data===' ')inlineMarkdownAtCaret(el);
    const p = current(), b = p.blocks[Number(el.dataset.index)], value = el.innerText;
    b.text = value;
    b.html = cleanInlineHtml(el.innerHTML);
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
        placeCommandMenu(menu,el);
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
editor.addEventListener('input', onEditorInput);
document.addEventListener('click', e => { const a = e.target.closest('[data-action]')?.dataset.action; if (a === 'search') {
    $('#search-dialog').showModal();
    $('#search-input').focus();
} if (a === 'new-page') {
    const p = createPage(undefined);
    state.activePageId = p.id;
    save();
    render();
} if (a === 'toggle-sidebar')
    $('#sidebar').classList.toggle('open'); if (a === 'share')
    toast('Page link copied'); });
$('#search-input').addEventListener('input', e => { const q = e.target.value.toLowerCase(); const out = $('#search-results'); out.innerHTML = ''; state.pages.filter(p => p.title.toLowerCase().includes(q) || p.blocks.some(b => b.text.toLowerCase().includes(q))).forEach(p => { const row = document.createElement('button'); row.className = 'search-result'; row.textContent = p.icon + ' ' + p.title; row.onclick = () => { state.activePageId = p.id; save(); render(); $('#search-dialog').close(); }; out.append(row); }); });
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    $('#search-dialog').showModal();
    $('#search-input').focus();
} if (e.key === 'Escape' && $('#search-dialog').open)
    $('#search-dialog').close(); });
function pageMenu(p) { const action = prompt('Page actions: rename, favorite, delete', 'rename'); if (action === 'rename') {
    const name = prompt('Page title', p.title);
    if (name) {
        p.title = name;
        save();
        render();
    }
}
else if (action === 'favorite') {
    p.favorite = !p.favorite;
    save();
    render();
}
else if (action === 'delete') {
    if (confirm(`Move “${p.title}” and its children to Trash?`)) {
        state.pages = state.pages.filter(x => x.id !== p.id && x.parentId !== p.id);
        state.activePageId = state.pages[0].id;
        save();
        render();
    }
} }
function coverPicker(p) { const file = document.createElement('input'); file.type = 'file'; file.accept = 'image/*'; file.onchange = () => { const f = file.files?.[0]; if (!f)
    return; const reader = new FileReader(); reader.onload = () => { p.cover = String(reader.result); p.coverY = 50; save(); render(); }; reader.readAsDataURL(f); }; file.click(); }
function iconPicker(p) { const choice = prompt('Choose an icon (emoji) or enter image URL', '✨'); if (choice) {
    p.icon = choice;
    save();
    render();
} }
function uploadForBlock(b, p) { const file = document.createElement('input'); file.type = 'file'; file.accept = 'image/*'; file.onchange = () => { const f = file.files?.[0]; if (!f)
    return; const r = new FileReader(); r.onload = () => { b.type = 'image'; b.url = String(r.result); b.text = f.name; save(); render(); }; r.readAsDataURL(f); }; file.click(); }
function pageLinkVisible(p) { return p.blocks.some(b => b.type === 'page_link' && state.pages.some(x => x.id === b.targetId)); }
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
    e.preventDefault();
    const p = createPage();
    state.activePageId = p.id;
    save();
    render();
} });
render();

