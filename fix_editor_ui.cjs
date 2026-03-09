const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const OLD_BLOCK = `          {/* 3. Editor Tab Aura */}
          {view === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="fixed inset-0 top-[72px] bg-[#020617] flex flex-col overflow-hidden"
            >
              {/* Main Workspace */}
              <div className="flex-1 flex overflow-hidden">
                {/* Expanded Left Sidebar Aura */}
                <div className="w-64 bg-[#020617] border-r border-white/5 flex flex-col shrink-0 overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="px-6 py-8 border-b border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Ambiente Aura</p>
                  </div>

                  {/* Nav Tabs */}
                  <div className="flex flex-col p-4 space-y-2">
                    {[
                      { id: 'converter', label: 'Conversor Flux', icon: ArrowRightLeft },
                      { id: 'content', label: 'Editor Markdown', icon: Pencil },
                      { id: 'style', label: 'Arquétipos Aura', icon: Palette },
                      { id: 'metadata', label: 'Heurística & SEO', icon: LayoutTemplate }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setEditorTab(tab.id as any)}
                        className={\`flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-left group \${editorTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
                          }\`}
                      >
                        <tab.icon size={16} className={\`shrink-0 \${editorTab === tab.id ? 'text-black' : 'text-slate-600 group-hover:text-amber-500 transition-colors'}\`} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Generate Section Aura */}
                  <div className="border-t border-white/5 p-6 space-y-6 bg-blue-500/5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Wand2 size={12} className="text-amber-500" /> Motor de Geração
                    </p>

                    <div className="space-y-4">
                      {/* IA selector */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Cérebro AI</label>
                        <div className="relative">
                          <select
                            value={selectedApi}
                            onChange={(e) => setSelectedApi(e.target.value as keyof ApiKeys)}
                            className="w-full px-4 py-3.5 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-black rounded-xl outline-none focus:border-amber-500/50 cursor-pointer appearance-none uppercase tracking-widest transition-all"
                          >
                            {(apiKeys.gemini || (typeof process !== 'undefined' && process.env.GEMINI_API_KEY)) ? <option value="gemini">Google Gemini Pro</option> : null}
                            {apiKeys.openai ? <option value="openai">OpenAI GPT-4o</option> : null}
                            {apiKeys.claude ? <option value="claude">Anthropic Claude</option> : null}
                            {apiKeys.groq ? <option value="groq">Groq Llama 3</option> : null}
                            {!apiKeys.gemini && !apiKeys.openai && !apiKeys.claude && !apiKeys.groq && (typeof process === 'undefined' || !process.env.GEMINI_API_KEY) && (
                              <option value="gemini">Gemini Default</option>
                            )}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                        </div>
                      </div>

                      {/* Idioma selector Aura */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Localização</label>
                        <div className="relative">
                          <select
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value as any)}
                            className="w-full px-4 py-3.5 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-black rounded-xl outline-none focus:border-amber-500/50 cursor-pointer appearance-none uppercase tracking-widest transition-all"
                          >
                            <option value="pt">BR Português</option>
                            <option value="en">US English</option>
                            <option value="es">ES Spanish</option>
                            <option value="all">🌐 Multilingual</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                        </div>
                      </div>

                      {/* Identificador Aura */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Identificador Aura</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="page-id"
                            className="flex-1 px-4 py-3.5 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-mono rounded-xl outline-none focus:border-amber-500/50 min-w-0 transition-all font-bold"
                          />
                          <span className="text-slate-600 text-[9px] font-black uppercase">.html</span>
                        </div>
                        {/* Final Action button Aura */}
                        <button
                          onClick={generatePage}
                          disabled={!markdownText.trim() || !filename.trim()}
                          className={\`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-xl active:scale-[0.98] \${!markdownText.trim() || !filename.trim()
                            ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5 opacity-50'
                            : 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20'
                            }\`}
                        >
                          <Flame size={18} fill="currentColor" /> Transmutar Interface
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden relative bg-[#020617] pl-6 py-6 pr-6">`;

const NEW_BLOCK = `          {/* 3. Editor Tab Aura */}
          {view === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* TOP CONTROL BAR */}
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-5 border border-white/5 shadow-2xl">
                <div className="flex flex-wrap items-end gap-4">
                  {/* Sub-tabs */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mr-2 flex items-center gap-1.5">
                      <Wand2 size={11} className="text-amber-500" /> Modo
                    </p>
                    {[
                      { id: 'converter', label: 'Conversor', icon: ArrowRightLeft },
                      { id: 'content', label: 'Markdown', icon: Pencil },
                      { id: 'style', label: 'Arquétipos', icon: Palette },
                      { id: 'metadata', label: 'SEO', icon: LayoutTemplate }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setEditorTab(tab.id as any)}
                        className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all \${editorTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5 border border-white/5'}\`}
                      >
                        <tab.icon size={13} className="shrink-0" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1" />

                  {/* AI + Lang + Filename + Generate — inline */}
                  <div className="flex items-end gap-3 flex-wrap">
                    {/* Cérebro AI */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Cérebro AI</label>
                      <div className="relative">
                        <select
                          value={selectedApi}
                          onChange={(e) => setSelectedApi(e.target.value as keyof ApiKeys)}
                          className="px-3 py-2.5 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-black rounded-xl outline-none focus:border-amber-500/50 cursor-pointer appearance-none uppercase tracking-widest transition-all pr-7"
                        >
                          {(apiKeys.gemini || (typeof process !== 'undefined' && process.env.GEMINI_API_KEY)) ? <option value="gemini">Gemini Pro</option> : null}
                          {apiKeys.openai ? <option value="openai">GPT-4o</option> : null}
                          {apiKeys.claude ? <option value="claude">Claude</option> : null}
                          {apiKeys.groq ? <option value="groq">Groq Llama</option> : null}
                          {!apiKeys.gemini && !apiKeys.openai && !apiKeys.claude && !apiKeys.groq && (typeof process === 'undefined' || !process.env.GEMINI_API_KEY) && (
                            <option value="gemini">Gemini</option>
                          )}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                      </div>
                    </div>

                    {/* Localização */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Idioma</label>
                      <div className="relative">
                        <select
                          value={selectedLang}
                          onChange={(e) => setSelectedLang(e.target.value as any)}
                          className="px-3 py-2.5 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-black rounded-xl outline-none focus:border-amber-500/50 cursor-pointer appearance-none uppercase tracking-widest transition-all pr-7"
                        >
                          <option value="pt">Português</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="all">🌐 Multi</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                      </div>
                    </div>

                    {/* Identificador */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Identificador</label>
                      <div className="flex items-center gap-1.5 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2.5">
                        <input
                          type="text"
                          value={filename}
                          onChange={(e) => setFilename(e.target.value)}
                          placeholder="page-id"
                          className="bg-transparent text-slate-200 text-[10px] font-mono outline-none w-24 font-bold"
                        />
                        <span className="text-slate-600 text-[9px] font-black uppercase">.html</span>
                      </div>
                    </div>

                    {/* Transmutar button */}
                    <button
                      onClick={generatePage}
                      disabled={!markdownText.trim() || !filename.trim()}
                      className={\`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] \${!markdownText.trim() || !filename.trim()
                        ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5 opacity-50'
                        : 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20'
                      }\`}
                    >
                      <Flame size={15} fill="currentColor" /> Transmutar
                    </button>
                  </div>
                </div>
              </div>

              {/* MAIN CONTENT CARD */}
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden" style={{ minHeight: '65vh' }}>
                <div className="h-full relative bg-[#020617]">`;

// Find the precise old block string — we might need to adjust for minor whitespace differences
let safeOldBlock = OLD_BLOCK;
if (!content.includes(safeOldBlock)) {
    console.log("OLD_BLOCK not found exactly, trying to find main part");
    // The first line is view === 'editor' && (
    // We'll extract everything from {view === 'editor' && ( up to <div className="flex-1 overflow-hidden relative bg-[#020617]">
    const startIdx = content.indexOf(`{view === 'editor' && (\r\n            <motion.div`);
    const endIdxMatch = content.indexOf(`<div className="flex-1 overflow-hidden relative bg-[#020617]">`, startIdx);
    if (startIdx !== -1 && endIdxMatch !== -1) {
        const endIdx = endIdxMatch + `<div className="flex-1 overflow-hidden relative bg-[#020617]">`.length;
        safeOldBlock = content.substring(startIdx, endIdx);

        // adjust replacement accordingly
        const newReplacementPart = NEW_BLOCK.substring(NEW_BLOCK.indexOf(`{view === 'editor' && (`));
        content = content.replace(safeOldBlock, newReplacementPart);
    }
} else {
    content = content.replace(safeOldBlock, NEW_BLOCK);
}

// Fix the closing tags at the very end of the component
// Find the exact closing tags of the editor tab
// Since we removed `<div className="flex-1 flex overflow-hidden">` (the Main Workspace)
// We need to remove ONE closing </div> from the end of the editor tab
const closingMarkerOld = `              </div>\r\n            </motion.div>\r\n          )}\r\n\r\n          {/* 4.`;
const closingMarkerNew = `            </motion.div>\r\n          )}\r\n\r\n          {/* 4.`;
if (content.includes(closingMarkerOld)) {
    content = content.replace(closingMarkerOld, closingMarkerNew);
} else {
    // If CRs are missing
    const closingMarkerOldLF = `              </div>\n            </motion.div>\n          )}\n\n          {/* 4.`;
    const closingMarkerNewLF = `            </motion.div>\n          )}\n\n          {/* 4.`;
    if (content.includes(closingMarkerOldLF)) {
        content = content.replace(closingMarkerOldLF, closingMarkerNewLF);
    } else {
        // Try to find just the trailing </div> of motion.div
        const endOfEditor = content.indexOf(`          {/* 4.`);
        if (endOfEditor !== -1) {
            const beforeEditor = content.substring(0, endOfEditor);
            const afterEditor = content.substring(endOfEditor);
            // Replace the last </div>
            const lines = beforeEditor.split('\n');
            for (let i = lines.length - 1; i >= 0; i--) {
                if (lines[i].includes('</div>')) {
                    lines[i] = lines[i].replace('</div>', '');
                    break; // remove just one
                }
            }
            content = lines.join('\n') + afterEditor;
        }
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ UI editor fluid layout fix applied quickly');
