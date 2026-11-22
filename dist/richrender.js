/**
 * Offline zero-dependency renderers for Architect:
 * - LaTeX -> MathML equations (inline and display block)
 * - Multi-language code syntax highlighting (exact character-preserving spans)
 * - Mermaid diagrams (flowchart/graph, sequenceDiagram, stateDiagram, pie) -> crisp SVG
 */
const ArchitectRichRender = (() => {
    function escHtml(v) {
        return String(v ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    // =========================================================================
    // 1. LaTeX -> MathML Engine
    // =========================================================================
    const GREEK_MAP = {
        alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ϵ', varepsilon: 'ε',
        zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ',
        lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', varpi: 'ϖ',
        rho: 'ρ', varrho: 'ϱ', sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ',
        phi: 'ϕ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
        Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
        Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω'
    };
    const SYMBOL_MAP = {
        infty: '∞', pm: '±', mp: '∓', cdot: '·', times: '×', div: '÷', ast: '∗',
        star: '⋆', circ: '∘', bullet: '•', leq: '≤', le: '≤', geq: '≥', ge: '≥',
        neq: '≠', ne: '≠', approx: '≈', equiv: '≡', sim: '∼', simeq: '≃', cong: '≅',
        propto: '∝', to: '→', rightarrow: '→', leftarrow: '←', leftrightarrow: '↔',
        Rightarrow: '⇒', Leftarrow: '⇐', Leftrightarrow: '⇔', mapsto: '↦',
        forall: '∀', exists: '∃', nexists: '∄', in: '∈', notin: '∉', ni: '∋',
        subset: '⊂', subseteq: '⊆', supset: '⊃', supseteq: '⊇', cup: '∪', cap: '∩',
        emptyset: '∅', varnothing: '∅', nabla: '∇', partial: '∂', ell: 'ℓ',
        hbar: 'ℏ', Re: 'ℜ', Im: 'ℑ', wp: '℘', aleph: 'ℵ', dots: '…', cdots: '⋯',
        ldots: '…', vdots: '⋮', ddots: '⋱', prime: '′', degree: '°', angle: '∠',
        perp: '⊥', parallel: '∥', land: '∧', lor: '∨', lnot: '¬', neg: '¬',
        oplus: '⊕', otimes: '⊗', dagger: '†', ddagger: '‡', checkmark: '✓'
    };
    const LARGE_OPS = {
        sum: '∑', prod: '∏', coprod: '∐', int: '∫', iint: '∬', iiint: '∭',
        oint: '∮', bigcup: '⋃', bigcap: '⋂', bigoplus: '⨁', bigotimes: '⨂'
    };
    const STD_FUNCS = new Set([
        'sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'arcsin', 'arccos', 'arctan',
        'sinh', 'cosh', 'tanh', 'log', 'ln', 'lg', 'exp', 'lim', 'limsup',
        'liminf', 'sup', 'inf', 'max', 'min', 'arg', 'det', 'dim', 'gcd', 'lcm',
        'deg', 'mod', 'Pr'
    ]);
    const BLACKBOARD = {
        R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', P: 'ℙ', E: '𝔼', F: '𝔽', H: 'ℍ'
    };
    function latexToMathmlInner(tex) {
        const src = String(tex || '');
        let pos = 0;
        const skipWs = () => {
            while (pos < src.length && /\s/.test(src[pos]))
                pos++;
        };
        const readBracedRaw = () => {
            skipWs();
            if (pos >= src.length)
                return '';
            if (src[pos] !== '{') {
                if (src[pos] === '\\') {
                    const m = src.slice(pos).match(/^\\[a-zA-Z]+|^\\./);
                    if (m) {
                        pos += m[0].length;
                        return m[0];
                    }
                }
                return src[pos++];
            }
            pos++; // skip {
            let depth = 1;
            const start = pos;
            while (pos < src.length && depth > 0) {
                if (src[pos] === '\\' && pos + 1 < src.length) {
                    pos += 2;
                    continue;
                }
                if (src[pos] === '{')
                    depth++;
                else if (src[pos] === '}') {
                    depth--;
                    if (depth === 0) {
                        const inner = src.slice(start, pos);
                        pos++;
                        return inner;
                    }
                }
                pos++;
            }
            return src.slice(start);
        };
        const readBracketRaw = () => {
            skipWs();
            if (src[pos] !== '[')
                return null;
            pos++;
            const start = pos;
            let depth = 1;
            while (pos < src.length && depth > 0) {
                if (src[pos] === '\\' && pos + 1 < src.length) {
                    pos += 2;
                    continue;
                }
                if (src[pos] === '[')
                    depth++;
                else if (src[pos] === ']') {
                    depth--;
                    if (depth === 0) {
                        const inner = src.slice(start, pos);
                        pos++;
                        return inner;
                    }
                }
                pos++;
            }
            return src.slice(start);
        };
        const parseEnv = (envName) => {
            const endTag = `\\end{${envName}}`;
            const endIdx = src.indexOf(endTag, pos);
            const body = endIdx >= 0 ? src.slice(pos, endIdx) : src.slice(pos);
            pos = endIdx >= 0 ? endIdx + endTag.length : src.length;
            const rows = body.split(/\\\\/).map(r => r.trim()).filter((r, idx, arr) => r || idx < arr.length - 1);
            const trs = rows.map(row => {
                const cells = row.split('&').map(cell => `<mtd>${latexToMathmlInner(cell.trim())}</mtd>`).join('');
                return `<mtr>${cells}</mtr>`;
            }).join('');
            const table = `<mtable>${trs}</mtable>`;
            if (envName === 'pmatrix')
                return `<mrow><mo>(</mo>${table}<mo>)</mo></mrow>`;
            if (envName === 'bmatrix')
                return `<mrow><mo>[</mo>${table}<mo>]</mo></mrow>`;
            if (envName === 'vmatrix')
                return `<mrow><mo>|</mo>${table}<mo>|</mo></mrow>`;
            if (envName === 'Bmatrix')
                return `<mrow><mo>{</mo>${table}<mo>}</mo></mrow>`;
            if (envName === 'cases')
                return `<mrow><mo>{</mo>${table}</mrow>`;
            return table;
        };
        const parseAtom = () => {
            skipWs();
            if (pos >= src.length)
                return '';
            const ch = src[pos];
            if (ch === '{') {
                const inner = readBracedRaw();
                return `<mrow>${latexToMathmlInner(inner)}</mrow>`;
            }
            if (ch === '\\') {
                pos++;
                if (pos >= src.length)
                    return '';
                if (!/[a-zA-Z]/.test(src[pos])) {
                    const sym = src[pos++];
                    if (sym === ',' || sym === ';' || sym === ':' || sym === ' ')
                        return '<mspace width="0.22em"/>';
                    if (sym === '!')
                        return '<mspace width="-0.15em"/>';
                    if (sym === '\\')
                        return '<mo linebreak="newline"/>';
                    return `<mo>${escHtml(sym)}</mo>`;
                }
                let cmd = '';
                while (pos < src.length && /[a-zA-Z]/.test(src[pos]))
                    cmd += src[pos++];
                if (cmd === 'left' || cmd === 'right') {
                    skipWs();
                    let delim = '';
                    if (src[pos] === '\\') {
                        pos++;
                        if (src[pos] === '{' || src[pos] === '}' || src[pos] === '|')
                            delim = src[pos++];
                        else {
                            let dc = '';
                            while (pos < src.length && /[a-zA-Z]/.test(src[pos]))
                                dc += src[pos++];
                            delim = SYMBOL_MAP[dc] || (dc === 'langle' ? '⟨' : dc === 'rangle' ? '⟩' : dc === 'lfloor' ? '⌊' : dc === 'rfloor' ? '⌋' : dc === 'lceil' ? '⌈' : dc === 'rceil' ? '⌉' : '');
                        }
                    }
                    else if (pos < src.length) {
                        delim = src[pos++];
                    }
                    if (delim === '.')
                        return '';
                    return `<mo stretchy="true">${escHtml(delim)}</mo>`;
                }
                if (cmd === 'begin') {
                    const env = readBracedRaw().trim();
                    return parseEnv(env);
                }
                if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac') {
                    const num = latexToMathmlInner(readBracedRaw());
                    const den = latexToMathmlInner(readBracedRaw());
                    return `<mfrac>${num || '<mspace/>'}${den || '<mspace/>'}</mfrac>`;
                }
                if (cmd === 'binom') {
                    const top = latexToMathmlInner(readBracedRaw());
                    const bot = latexToMathmlInner(readBracedRaw());
                    return `<mrow><mo>(</mo><mfrac linethickness="0">${top || '<mspace/>'}${bot || '<mspace/>'}</mfrac><mo>)</mo></mrow>`;
                }
                if (cmd === 'sqrt') {
                    const root = readBracketRaw();
                    const base = latexToMathmlInner(readBracedRaw());
                    if (root !== null)
                        return `<mroot><mrow>${base}</mrow><mrow>${latexToMathmlInner(root)}</mrow></mroot>`;
                    return `<msqrt><mrow>${base}</mrow></msqrt>`;
                }
                if (cmd === 'text' || cmd === 'textrm' || cmd === 'mbox') {
                    return `<mtext>${escHtml(readBracedRaw())}</mtext>`;
                }
                if (cmd === 'mathrm') {
                    return `<mi mathvariant="normal">${escHtml(readBracedRaw())}</mi>`;
                }
                if (cmd === 'mathbf' || cmd === 'textbf') {
                    return `<mrow mathvariant="bold">${latexToMathmlInner(readBracedRaw())}</mrow>`;
                }
                if (cmd === 'mathit' || cmd === 'textit') {
                    return `<mrow mathvariant="italic">${latexToMathmlInner(readBracedRaw())}</mrow>`;
                }
                if (cmd === 'mathbb') {
                    const raw = readBracedRaw().trim();
                    const mapped = raw.split('').map(c => BLACKBOARD[c] || c).join('');
                    return `<mi>${escHtml(mapped)}</mi>`;
                }
                if (cmd === 'bar' || cmd === 'overline') {
                    return `<mover accent="true"><mrow>${latexToMathmlInner(readBracedRaw())}</mrow><mo>¯</mo></mover>`;
                }
                if (cmd === 'underline') {
                    return `<munder accentunder="true"><mrow>${latexToMathmlInner(readBracedRaw())}</mrow><mo>_</mo></munder>`;
                }
                if (cmd === 'hat' || cmd === 'widehat') {
                    return `<mover accent="true"><mrow>${latexToMathmlInner(readBracedRaw())}</mrow><mo>^</mo></mover>`;
                }
                if (cmd === 'vec') {
                    return `<mover accent="true"><mrow>${latexToMathmlInner(readBracedRaw())}</mrow><mo>→</mo></mover>`;
                }
                if (cmd === 'tilde' || cmd === 'widetilde') {
                    return `<mover accent="true"><mrow>${latexToMathmlInner(readBracedRaw())}</mrow><mo>~</mo></mover>`;
                }
                if (cmd === 'dot') {
                    return `<mover accent="true"><mrow>${latexToMathmlInner(readBracedRaw())}</mrow><mo>˙</mo></mover>`;
                }
                if (cmd === 'quad')
                    return '<mspace width="1em"/>';
                if (cmd === 'qquad')
                    return '<mspace width="2em"/>';
                if (LARGE_OPS[cmd])
                    return `<mo data-large-op="1">${LARGE_OPS[cmd]}</mo>`;
                if (STD_FUNCS.has(cmd)) {
                    const isLim = cmd === 'lim' || cmd === 'limsup' || cmd === 'liminf' || cmd === 'sup' || cmd === 'inf' || cmd === 'max' || cmd === 'min';
                    return `<mo${isLim ? ' data-large-op="1"' : ''} mathvariant="normal">${escHtml(cmd)}</mo>`;
                }
                if (GREEK_MAP[cmd])
                    return `<mi>${GREEK_MAP[cmd]}</mi>`;
                if (SYMBOL_MAP[cmd])
                    return `<mo>${SYMBOL_MAP[cmd]}</mo>`;
                return `<mi>${escHtml(cmd)}</mi>`;
            }
            if (/[0-9]/.test(ch)) {
                let num = '';
                while (pos < src.length && /[0-9.]/.test(src[pos]))
                    num += src[pos++];
                return `<mn>${escHtml(num)}</mn>`;
            }
            if (/[a-zA-Z]/.test(ch)) {
                pos++;
                return `<mi>${escHtml(ch)}</mi>`;
            }
            pos++;
            return `<mo>${escHtml(ch)}</mo>`;
        };
        const parts = [];
        while (pos < src.length) {
            skipWs();
            if (pos >= src.length)
                break;
            let atom = parseAtom();
            if (!atom)
                continue;
            let subNode = null;
            let supNode = null;
            for (let k = 0; k < 2; k++) {
                skipWs();
                if (src[pos] === '_' && subNode === null) {
                    pos++;
                    subNode = parseAtom() || '<mspace/>';
                }
                else if (src[pos] === '^' && supNode === null) {
                    pos++;
                    supNode = parseAtom() || '<mspace/>';
                }
            }
            const isUnderOver = atom.includes('data-large-op="1"');
            if (subNode !== null && supNode !== null) {
                atom = isUnderOver
                    ? `<munderover>${atom}${subNode}${supNode}</munderover>`
                    : `<msubsup>${atom}${subNode}${supNode}</msubsup>`;
            }
            else if (subNode !== null) {
                atom = isUnderOver ? `<munder>${atom}${subNode}</munder>` : `<msub>${atom}${subNode}</msub>`;
            }
            else if (supNode !== null) {
                atom = isUnderOver ? `<mover>${atom}${supNode}</mover>` : `<msup>${atom}${supNode}</msup>`;
            }
            parts.push(atom);
        }
        return parts.join('');
    }
    function renderLatexToHtml(tex, displayMode = false) {
        const clean = String(tex || '').trim();
        if (!clean)
            return '<span class="math-empty">Empty equation</span>';
        const inner = latexToMathmlInner(clean);
        return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${displayMode ? 'block' : 'inline'}">${inner}</math>`;
    }
    function renderLatexToElement(tex, displayMode = false) {
        const span = document.createElement('span');
        span.className = displayMode ? 'rich-math-block' : 'rich-math-inline';
        span.innerHTML = renderLatexToHtml(tex, displayMode);
        return span;
    }
    // =========================================================================
    // 2. Single-pass Multi-language Syntax Highlighter (preserves exact text!)
    // =========================================================================
    const LANG_KEYWORDS = {
        javascript: new Set(['async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null', 'of', 'return', 'static', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'undefined', 'var', 'void', 'while', 'with', 'yield']),
        typescript: new Set(['abstract', 'any', 'as', 'async', 'await', 'boolean', 'break', 'case', 'catch', 'class', 'const', 'continue', 'declare', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function', 'if', 'implements', 'import', 'in', 'infer', 'instanceof', 'interface', 'is', 'keyof', 'let', 'module', 'namespace', 'never', 'new', 'null', 'number', 'object', 'of', 'override', 'private', 'protected', 'public', 'readonly', 'return', 'static', 'string', 'super', 'switch', 'this', 'throw', 'true', 'try', 'type', 'typeof', 'undefined', 'unknown', 'var', 'void', 'while', 'yield']),
        python: new Set(['and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True', 'try', 'while', 'with', 'yield', 'self']),
        sql: new Set(['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'DISTINCT', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ASC', 'DESC']),
        bash: new Set(['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'in', 'function', 'return', 'local', 'export', 'readonly', 'unset', 'shift', 'exit', 'echo', 'cd', 'ls', 'cat', 'grep', 'sed', 'awk', 'npm', 'node', 'git', 'true', 'false']),
        css: new Set(['@media', '@import', '@keyframes', '@font-face', '@supports', '@layer', 'important']),
        mermaid: new Set(['flowchart', 'graph', 'sequenceDiagram', 'stateDiagram', 'stateDiagram-v2', 'pie', 'title', 'participant', 'actor', 'Note', 'right', 'left', 'over', 'of', 'as', 'subgraph', 'end', 'TD', 'TB', 'LR', 'RL', 'BT', 'style', 'classDef', 'class'])
    };
    function highlightCode(code, languageRaw = 'Plain text') {
        const src = String(code ?? '');
        const lang = String(languageRaw || 'Plain text').trim().toLowerCase();
        if (!src || lang === 'plain text' || lang === 'text' || lang === 'plaintext') {
            return escHtml(src);
        }
        const kwSet = LANG_KEYWORDS[lang] || LANG_KEYWORDS.javascript;
        const isHtml = lang === 'html' || lang === 'xml';
        const isCss = lang === 'css';
        const isJson = lang === 'json';
        const isPy = lang === 'python';
        const isSql = lang === 'sql';
        const isBash = lang === 'bash' || lang === 'shell' || lang === 'sh';
        const isMermaid = lang === 'mermaid';
        const span = (cls, txt) => `<span class="${cls}">${escHtml(txt)}</span>`;
        let out = '';
        let i = 0;
        while (i < src.length) {
            const ch = src[i];
            // Line comments
            if (((!isPy && !isSql && !isHtml && !isCss && !isBash && !isMermaid) && ch === '/' && src[i + 1] === '/') ||
                ((isPy || isBash) && ch === '#') ||
                (isSql && ch === '-' && src[i + 1] === '-') ||
                (isMermaid && ch === '%' && src[i + 1] === '%')) {
                const nl = src.indexOf('\n', i);
                const end = nl < 0 ? src.length : nl;
                out += span('tok-cmt', src.slice(i, end));
                i = end;
                continue;
            }
            // Block comments /* ... */ or <!-- ... -->
            if ((!isHtml && ch === '/' && src[i + 1] === '*')) {
                const close = src.indexOf('*/', i + 2);
                const end = close < 0 ? src.length : close + 2;
                out += span('tok-cmt', src.slice(i, end));
                i = end;
                continue;
            }
            if (isHtml && src.startsWith('<!--', i)) {
                const close = src.indexOf('-->', i + 4);
                const end = close < 0 ? src.length : close + 3;
                out += span('tok-cmt', src.slice(i, end));
                i = end;
                continue;
            }
            // HTML tags
            if (isHtml && ch === '<') {
                const m = src.slice(i).match(/^<\/?([a-zA-Z0-9:-]+)/);
                if (m) {
                    out += escHtml(m[0].startsWith('</') ? '</' : '<') + span('tok-tag', m[1]);
                    i += m[0].length;
                    continue;
                }
            }
            // Strings ('...', "...", `...`)
            if (ch === '"' || ch === "'" || (!isSql && !isJson && ch === '`')) {
                const quote = ch;
                let j = i + 1;
                while (j < src.length) {
                    if (src[j] === '\\' && j + 1 < src.length) {
                        j += 2;
                        continue;
                    }
                    if (src[j] === quote) {
                        j++;
                        break;
                    }
                    if (src[j] === '\n' && quote !== '`')
                        break;
                    j++;
                }
                const tok = src.slice(i, j);
                // JSON property key highlight
                if (isJson && quote === '"') {
                    let k = j;
                    while (k < src.length && (src[k] === ' ' || src[k] === '\t'))
                        k++;
                    if (src[k] === ':') {
                        out += span('tok-attr', tok);
                        i = j;
                        continue;
                    }
                }
                out += span('tok-str', tok);
                i = j;
                continue;
            }
            // Numbers
            if (/[0-9]/.test(ch) && (i === 0 || !/[a-zA-Z_$]/.test(src[i - 1]))) {
                const m = src.slice(i).match(/^(?:0x[0-9a-fA-F]+|0b[01]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/);
                if (m) {
                    out += span('tok-num', m[0]);
                    i += m[0].length;
                    continue;
                }
            }
            // Mermaid arrows
            if (isMermaid) {
                const mArrow = src.slice(i).match(/^(?:-->>|->>|==>|-.->|-->|---|-\.-|==)/);
                if (mArrow) {
                    out += span('tok-op', mArrow[0]);
                    i += mArrow[0].length;
                    continue;
                }
            }
            // Identifiers / Keywords / Types / Functions
            if (/[a-zA-Z_$@]/.test(ch)) {
                const m = src.slice(i).match(/^@?[a-zA-Z_$][a-zA-Z0-9_$-]*/);
                if (m) {
                    const word = m[0];
                    const upper = word.toUpperCase();
                    if (isJson) {
                        out += (word === 'true' || word === 'false' || word === 'null') ? span('tok-kw', word) : escHtml(word);
                    }
                    else if (isCss && src[i + word.length] === ':' && !word.startsWith('@')) {
                        out += span('tok-attr', word);
                    }
                    else if (isSql ? kwSet.has(upper) : kwSet.has(word)) {
                        out += span('tok-kw', word);
                    }
                    else if (src[i + word.length] === '(') {
                        out += span('tok-fn', word);
                    }
                    else if (/^[A-Z][a-zA-Z0-9_]*$/.test(word) && !isSql) {
                        out += span('tok-type', word);
                    }
                    else {
                        out += escHtml(word);
                    }
                    i += word.length;
                    continue;
                }
            }
            // Operators
            if ('=+-*/<>!&|?:~^%'.includes(ch)) {
                out += span('tok-op', ch);
                i++;
                continue;
            }
            out += escHtml(ch);
            i++;
        }
        return out;
    }
    function parseMermaidNodeToken(raw) {
        const t = raw.trim();
        let m;
        if ((m = t.match(/^([a-zA-Z0-9_.-]+)\(\((.+)\)\)$/)))
            return { id: m[1], label: stripQuotes(m[2]), shape: 'circle' };
        if ((m = t.match(/^([a-zA-Z0-9_.-]+)\(\[(.+)\]\)$/)))
            return { id: m[1], label: stripQuotes(m[2]), shape: 'pill' };
        if ((m = t.match(/^([a-zA-Z0-9_.-]+)\[\[(.+)\]\]$/)))
            return { id: m[1], label: stripQuotes(m[2]), shape: 'rect' };
        if ((m = t.match(/^([a-zA-Z0-9_.-]+)\[(.+)\]$/)))
            return { id: m[1], label: stripQuotes(m[2]), shape: 'rect' };
        if ((m = t.match(/^([a-zA-Z0-9_.-]+)\((.+)\)$/)))
            return { id: m[1], label: stripQuotes(m[2]), shape: 'round' };
        if ((m = t.match(/^([a-zA-Z0-9_.-]+)\{(.+)\}$/)))
            return { id: m[1], label: stripQuotes(m[2]), shape: 'diamond' };
        const clean = stripQuotes(t);
        return { id: clean, label: clean, shape: 'rect' };
    }
    function stripQuotes(s) {
        const trimmed = s.trim();
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return trimmed.slice(1, -1);
        }
        return trimmed;
    }
    function renderFlowOrStateSvg(lines, isState) {
        const header = lines[0]?.trim() || '';
        const dirMatch = header.match(/^(?:flowchart|graph)\s+(TD|TB|LR|RL|BT)/i);
        const dir = (dirMatch ? dirMatch[1].toUpperCase() : 'TD');
        const horizontal = dir === 'LR' || dir === 'RL';
        const reversed = dir === 'RL' || dir === 'BT';
        const nodes = new Map();
        const edges = [];
        const ensureNode = (n) => {
            const existing = nodes.get(n.id);
            if (!existing) {
                nodes.set(n.id, n);
            }
            else if (n.label !== n.id || n.shape !== 'rect') {
                existing.label = n.label;
                existing.shape = n.shape;
            }
        };
        let autoStarIdx = 0;
        for (let li = 1; li < lines.length; li++) {
            let line = lines[li].trim().replace(/;+$/, '');
            if (!line || line.startsWith('%%') || /^(subgraph|end|style|classDef|class|linkStyle|direction)\b/i.test(line))
                continue;
            if (isState) {
                const sm = line.match(/^(\[\*\]|[a-zA-Z0-9_.-]+)\s*-->\s*(\[\*\]|[a-zA-Z0-9_.-]+)(?:\s*:\s*(.+))?$/);
                if (sm) {
                    const fromId = sm[1] === '[*]' ? `__start_${autoStarIdx++}` : sm[1];
                    const toId = sm[2] === '[*]' ? `__end_${autoStarIdx++}` : sm[2];
                    ensureNode({ id: fromId, label: sm[1] === '[*]' ? '' : fromId, shape: sm[1] === '[*]' ? 'startend' : 'round' });
                    ensureNode({ id: toId, label: sm[2] === '[*]' ? '' : toId, shape: sm[2] === '[*]' ? 'startend' : 'round' });
                    edges.push({ from: fromId, to: toId, label: (sm[3] || '').trim(), style: 'solid' });
                    continue;
                }
                const desc = line.match(/^state\s+"([^"]+)"\s+as\s+([a-zA-Z0-9_.-]+)/);
                if (desc) {
                    ensureNode({ id: desc[2], label: desc[1], shape: 'round' });
                    continue;
                }
            }
            // Split chained edges e.g. A[Start] --> B{Check} -->|Yes| C[Done]
            const arrowRe = /\s*(==>|-\.->|-->|---|-\.-|==)(?:\|([^|]+)\|)?\s*|\s*--\s+([^->]+?)\s+-->\s*/g;
            const parts = [];
            const ops = [];
            let lastIdx = 0;
            let am;
            while ((am = arrowRe.exec(line)) !== null) {
                parts.push(line.slice(lastIdx, am.index));
                const opTxt = am[1] || '-->';
                const style = opTxt.includes('.') ? 'dashed' : opTxt.includes('=') ? 'thick' : 'solid';
                const label = (am[2] || am[3] || '').trim();
                ops.push({ style, label });
                lastIdx = am.index + am[0].length;
            }
            if (ops.length) {
                parts.push(line.slice(lastIdx));
                for (let pi = 0; pi < ops.length; pi++) {
                    const rawLeft = parts[pi].trim();
                    const rawRight = parts[pi + 1].trim();
                    if (!rawLeft || !rawRight)
                        continue;
                    const nLeft = parseMermaidNodeToken(rawLeft);
                    const nRight = parseMermaidNodeToken(rawRight);
                    ensureNode(nLeft);
                    ensureNode(nRight);
                    edges.push({ from: nLeft.id, to: nRight.id, label: ops[pi].label, style: ops[pi].style });
                }
            }
            else {
                const single = parseMermaidNodeToken(line);
                if (single.id)
                    ensureNode(single);
            }
        }
        if (!nodes.size) {
            return { ok: false, diagramType: isState ? 'state' : 'flowchart', error: 'Add nodes/edges (e.g. A[Start] --> B[Finish])' };
        }
        // Topological longest-path rank assignment (handles cycles safely via visited tracking)
        const adj = new Map();
        const indeg = new Map();
        nodes.forEach((_, id) => { adj.set(id, []); indeg.set(id, 0); });
        edges.forEach(e => {
            adj.get(e.from)?.push(e.to);
            indeg.set(e.to, (indeg.get(e.to) || 0) + 1);
        });
        const rank = new Map();
        const queue = [];
        indeg.forEach((deg, id) => { if (deg === 0)
            queue.push(id); rank.set(id, 0); });
        if (!queue.length)
            queue.push([...nodes.keys()][0]);
        const processed = new Set();
        while (queue.length) {
            const u = queue.shift();
            if (processed.has(u))
                continue;
            processed.add(u);
            const ur = rank.get(u) || 0;
            (adj.get(u) || []).forEach(v => {
                if (!processed.has(v)) {
                    rank.set(v, Math.max(rank.get(v) || 0, ur + 1));
                    indeg.set(v, Math.max(0, (indeg.get(v) || 1) - 1));
                    if ((indeg.get(v) || 0) <= 0)
                        queue.push(v);
                }
            });
        }
        // Catch any disconnected components/cycles
        let guard = 0;
        while (processed.size < nodes.size && guard++ < nodes.size + 5) {
            for (const id of nodes.keys()) {
                if (!processed.has(id)) {
                    processed.add(id);
                    const ur = rank.get(id) || 0;
                    (adj.get(id) || []).forEach(v => {
                        if (!processed.has(v))
                            rank.set(v, Math.max(rank.get(v) || 0, ur + 1));
                    });
                    break;
                }
            }
        }
        const maxRank = Math.max(0, ...rank.values());
        const layers = new Map();
        nodes.forEach(n => {
            const r = reversed ? (maxRank - (rank.get(n.id) || 0)) : (rank.get(n.id) || 0);
            if (!layers.has(r))
                layers.set(r, []);
            layers.get(r).push(n);
        });
        const nodeDims = new Map();
        nodes.forEach(n => {
            if (n.shape === 'startend') {
                nodeDims.set(n.id, { w: 22, h: 22 });
            }
            else {
                const textW = Math.max(72, Math.min(220, n.label.length * 7.8 + 28));
                const w = n.shape === 'diamond' ? textW + 24 : n.shape === 'circle' ? Math.max(54, textW * 0.72) : textW;
                const h = n.shape === 'diamond' ? 52 : n.shape === 'circle' ? w : 38;
                nodeDims.set(n.id, { w, h });
            }
        });
        const pad = 28;
        const gapAlong = 56;
        const gapCross = 28;
        const pos = new Map();
        // Calculate each layer's extent cleanly
        const layerCoords = [];
        let cursor = pad;
        let maxCrossSpan = 0;
        for (let r = 0; r <= maxRank; r++) {
            const items = layers.get(r) || [];
            const crossSize = items.reduce((sum, n, idx) => {
                const d = nodeDims.get(n.id);
                return sum + (horizontal ? d.h : d.w) + (idx > 0 ? gapCross : 0);
            }, 0);
            maxCrossSpan = Math.max(maxCrossSpan, crossSize);
            const alongSize = Math.max(38, ...items.map(n => horizontal ? nodeDims.get(n.id).w : nodeDims.get(n.id).h));
            layerCoords.push(cursor + alongSize / 2);
            cursor += alongSize + gapAlong;
        }
        const totalCross = Math.max(180, maxCrossSpan + pad * 2);
        for (let r = 0; r <= maxRank; r++) {
            const items = layers.get(r) || [];
            const crossUsed = items.reduce((sum, n, idx) => {
                const d = nodeDims.get(n.id);
                return sum + (horizontal ? d.h : d.w) + (idx > 0 ? gapCross : 0);
            }, 0);
            let cPos = (totalCross - crossUsed) / 2;
            items.forEach(n => {
                const d = nodeDims.get(n.id);
                const span = horizontal ? d.h : d.w;
                const centerCross = cPos + span / 2;
                const centerAlong = layerCoords[r];
                pos.set(n.id, {
                    cx: horizontal ? centerAlong : centerCross,
                    cy: horizontal ? centerCross : centerAlong,
                    w: d.w,
                    h: d.h
                });
                cPos += span + gapCross;
            });
        }
        const svgW = Math.round(horizontal ? cursor - gapAlong + pad : totalCross);
        const svgH = Math.round(horizontal ? totalCross : cursor - gapAlong + pad);
        const midId = `mmd-arrow-${Math.random().toString(36).slice(2, 8)}`;
        const edgeSvg = edges.map(e => {
            const a = pos.get(e.from);
            const b = pos.get(e.to);
            if (!a || !b)
                return '';
            const dx = b.cx - a.cx;
            const dy = b.cy - a.cy;
            let x1 = a.cx, y1 = a.cy, x2 = b.cx, y2 = b.cy;
            if (horizontal && Math.abs(dx) >= Math.abs(dy) * 0.5) {
                const sign = dx >= 0 ? 1 : -1;
                x1 += sign * (a.w / 2);
                x2 -= sign * (b.w / 2 + 4);
            }
            else {
                const sign = dy >= 0 ? 1 : -1;
                y1 += sign * (a.h / 2);
                y2 -= sign * (b.h / 2 + 4);
            }
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const dPath = horizontal
                ? `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
                : `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
            const dash = e.style === 'dashed' ? ' stroke-dasharray="5 4"' : '';
            const sw = e.style === 'thick' ? '2.5' : '1.6';
            const lbl = e.label
                ? `<g transform="translate(${mx},${my})"><rect x="${-Math.max(18, e.label.length * 3.8 + 8)}" y="-10" width="${Math.max(36, e.label.length * 7.6 + 16)}" height="20" rx="5" class="mmd-edge-bg"/><text class="mmd-edge-text" text-anchor="middle" dy="4">${escHtml(e.label)}</text></g>`
                : '';
            return `<path d="${dPath}" class="mmd-edge" fill="none" stroke-width="${sw}"${dash} marker-end="url(#${midId})"/>${lbl}`;
        }).join('');
        const nodeSvg = [...nodes.values()].map(n => {
            const p = pos.get(n.id);
            const x = p.cx - p.w / 2;
            const y = p.cy - p.h / 2;
            let shapeEl = '';
            if (n.shape === 'startend') {
                shapeEl = `<circle cx="${p.cx}" cy="${p.cy}" r="9" class="mmd-node-start"/>`;
            }
            else if (n.shape === 'circle') {
                shapeEl = `<circle cx="${p.cx}" cy="${p.cy}" r="${p.w / 2}" class="mmd-node-shape"/>`;
            }
            else if (n.shape === 'diamond') {
                const pts = `${p.cx},${y} ${x + p.w},${p.cy} ${p.cx},${y + p.h} ${x},${p.cy}`;
                shapeEl = `<polygon points="${pts}" class="mmd-node-shape is-diamond"/>`;
            }
            else {
                const rx = n.shape === 'pill' ? p.h / 2 : n.shape === 'round' ? 12 : 6;
                shapeEl = `<rect x="${x}" y="${y}" width="${p.w}" height="${p.h}" rx="${rx}" class="mmd-node-shape"/>`;
            }
            const txt = n.shape === 'startend' ? '' : `<text x="${p.cx}" y="${p.cy}" dy="4" text-anchor="middle" class="mmd-node-text">${escHtml(n.label)}</text>`;
            return `<g class="mmd-node">${shapeEl}${txt}</g>`;
        }).join('');
        const svg = `<svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" class="mermaid-svg" role="img" aria-label="Mermaid diagram"><defs><marker id="${midId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" class="mmd-arrow-head"/></marker></defs>${edgeSvg}${nodeSvg}</svg>`;
        return { ok: true, svg, diagramType: isState ? 'state' : 'flowchart' };
    }
    function renderSequenceSvg(lines) {
        const participants = [];
        const ensurePart = (pid, label) => {
            const existing = participants.find(p => p.id === pid);
            if (!existing)
                participants.push({ id: pid, label: label || pid });
            else if (label)
                existing.label = label;
        };
        const steps = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('%%'))
                continue;
            let m;
            if ((m = line.match(/^(?:participant|actor)\s+([a-zA-Z0-9_.-]+)(?:\s+as\s+(.+))?$/i))) {
                ensurePart(m[1], (m[2] || m[1]).trim());
                continue;
            }
            if ((m = line.match(/^Note\s+(?:right of|left of|over)\s+([a-zA-Z0-9_.-]+)(?:,[a-zA-Z0-9_.-]+)?\s*:\s*(.+)$/i))) {
                ensurePart(m[1]);
                steps.push({ kind: 'note', who: m[1], text: m[2].trim() });
                continue;
            }
            if ((m = line.match(/^([a-zA-Z0-9_.-]+)\s*(--?>>?|--?>)\s*([a-zA-Z0-9_.-]+)\s*:\s*(.*)$/))) {
                ensurePart(m[1]);
                ensurePart(m[3]);
                steps.push({ kind: 'msg', from: m[1], to: m[3], label: m[4].trim(), dashed: m[2].startsWith('--') });
            }
        }
        if (!participants.length)
            return { ok: false, diagramType: 'sequence', error: 'Add sequence steps (e.g. Alice->>Bob: Hello)' };
        const colW = 155;
        const padX = 40;
        const topY = 20;
        const boxH = 34;
        const stepH = 44;
        const firstStepY = topY + boxH + 34;
        const botY = firstStepY + steps.length * stepH + 14;
        const svgW = Math.max(320, padX * 2 + (participants.length - 1) * colW + 120);
        const svgH = botY + boxH + 20;
        const xOf = (pid) => padX + 60 + participants.findIndex(p => p.id === pid) * colW;
        const midId = `seq-arr-${Math.random().toString(36).slice(2, 8)}`;
        const actorsSvg = participants.map(p => {
            const cx = xOf(p.id);
            const bw = Math.max(88, Math.min(138, p.label.length * 7.8 + 24));
            return `
        <line x1="${cx}" y1="${topY + boxH}" x2="${cx}" y2="${botY}" class="mmd-seq-line"/>
        <rect x="${cx - bw / 2}" y="${topY}" width="${bw}" height="${boxH}" rx="6" class="mmd-node-shape"/>
        <text x="${cx}" y="${topY + 21}" text-anchor="middle" class="mmd-node-text">${escHtml(p.label)}</text>
        <rect x="${cx - bw / 2}" y="${botY}" width="${bw}" height="${boxH}" rx="6" class="mmd-node-shape"/>
        <text x="${cx}" y="${botY + 21}" text-anchor="middle" class="mmd-node-text">${escHtml(p.label)}</text>
      `;
        }).join('');
        const stepsSvg = steps.map((st, idx) => {
            const y = firstStepY + idx * stepH;
            if (st.kind === 'note') {
                const cx = xOf(st.who);
                const nw = Math.max(100, Math.min(200, st.text.length * 7 + 20));
                return `<rect x="${cx - nw / 2}" y="${y - 14}" width="${nw}" height="24" rx="4" class="mmd-note-box"/><text x="${cx}" y="${y + 2}" text-anchor="middle" class="mmd-edge-text">${escHtml(st.text)}</text>`;
            }
            const x1 = xOf(st.from);
            const x2 = xOf(st.to);
            const dash = st.dashed ? ' stroke-dasharray="5 4"' : '';
            if (x1 === x2) {
                return `<path d="M ${x1} ${y - 6} h 34 v 18 h -30" fill="none" class="mmd-edge" stroke-width="1.6"${dash} marker-end="url(#${midId})"/><text x="${x1 + 38}" y="${y + 5}" class="mmd-edge-text">${escHtml(st.label)}</text>`;
            }
            const dirSign = x2 > x1 ? 1 : -1;
            const mx = (x1 + x2) / 2;
            return `<line x1="${x1}" y1="${y}" x2="${x2 - dirSign * 4}" y2="${y}" class="mmd-edge" stroke-width="1.6"${dash} marker-end="url(#${midId})"/><text x="${mx}" y="${y - 7}" text-anchor="middle" class="mmd-edge-text">${escHtml(st.label)}</text>`;
        }).join('');
        const svg = `<svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" class="mermaid-svg" role="img" aria-label="Sequence diagram"><defs><marker id="${midId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" class="mmd-arrow-head"/></marker></defs>${actorsSvg}${stepsSvg}</svg>`;
        return { ok: true, svg, diagramType: 'sequence' };
    }
    function renderPieSvg(lines) {
        let title = '';
        const slices = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            const tm = line.match(/^title\s+(.+)$/i);
            if (tm) {
                title = tm[1].trim();
                continue;
            }
            const sm = line.match(/^"([^"]+)"\s*:\s*([0-9]+(?:\.[0-9]+)?)/);
            if (sm)
                slices.push({ label: sm[1], value: Number(sm[2]) || 0 });
        }
        const total = slices.reduce((s, x) => s + Math.max(0, x.value), 0);
        if (!slices.length || total <= 0)
            return { ok: false, diagramType: 'pie', error: 'Add slices like "Docs" : 45' };
        const colors = ['#2383e2', '#448361', '#d9730d', '#9065b0', '#e5534b', '#cb912f', '#c14c8a'];
        const cx = 110, cy = title ? 128 : 108, r = 78;
        let angle = -Math.PI / 2;
        const paths = slices.map((sl, idx) => {
            const frac = Math.max(0, sl.value) / total;
            const sweep = frac * Math.PI * 2;
            const x1 = cx + r * Math.cos(angle);
            const y1 = cy + r * Math.sin(angle);
            angle += sweep;
            const x2 = cx + r * Math.cos(angle);
            const y2 = cy + r * Math.sin(angle);
            const large = sweep > Math.PI ? 1 : 0;
            const col = colors[idx % colors.length];
            if (slices.length === 1)
                return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`;
            return `<path d="M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${col}" stroke="var(--bg, #fff)" stroke-width="2"/>`;
        }).join('');
        const legend = slices.map((sl, idx) => {
            const ly = (title ? 58 : 38) + idx * 24;
            const pct = Math.round((sl.value / total) * 100);
            return `<rect x="218" y="${ly - 10}" width="12" height="12" rx="3" fill="${colors[idx % colors.length]}"/><text x="236" y="${ly}" class="mmd-node-text">${escHtml(sl.label)} (${pct}%)</text>`;
        }).join('');
        const titleSvg = title ? `<text x="16" y="24" class="mmd-pie-title">${escHtml(title)}</text>` : '';
        const svgH = Math.max(225, (title ? 68 : 48) + slices.length * 24);
        const svg = `<svg viewBox="0 0 420 ${svgH}" width="420" height="${svgH}" class="mermaid-svg" role="img" aria-label="Pie diagram">${titleSvg}${paths}${legend}</svg>`;
        return { ok: true, svg, diagramType: 'pie' };
    }
    function renderMermaidSvg(srcRaw) {
        const lines = String(srcRaw || '').replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim().length > 0);
        if (!lines.length)
            return { ok: false, error: 'Write Mermaid syntax (flowchart TD, sequenceDiagram, stateDiagram, or pie)' };
        const head = lines[0].trim().toLowerCase();
        if (head.startsWith('sequencediagram'))
            return renderSequenceSvg(lines);
        if (head.startsWith('statediagram'))
            return renderFlowOrStateSvg(lines, true);
        if (head.startsWith('pie'))
            return renderPieSvg(lines);
        if (head.startsWith('flowchart') || head.startsWith('graph'))
            return renderFlowOrStateSvg(lines, false);
        return { ok: false, error: 'Start with flowchart TD, graph LR, sequenceDiagram, stateDiagram-v2, or pie' };
    }
    return {
        renderLatexToHtml,
        renderLatexToElement,
        highlightCode,
        renderMermaidSvg
    };
})();
