/**
 * fix_branding_ui.cjs — Replaces the Branding tab JSX with the full multi-preset UI.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the old branding tab block
// Marker: starts with the comment and view check, ends before the next view section
const startMarker = `          {/* 2. Branding Tab */}\r\n          {view === 'branding' && (\r\n            <motion.div key="branding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">`;

// Find the exact end marker — the next view block after branding
const endMarker = `\r\n\r\n          {/* 3. API Keys Tab */}`;
const altEndMarker = `\r\n\r\n          {/* 2. API Keys Tab */}`;

if (!content.includes(startMarker)) {
    console.error('❌ Start marker NOT found');
    // Debug
    const idx = content.indexOf('{/* 2. Branding Tab */}');
    if (idx !== -1) {
        console.error('   Found branding comment, showing surrounding:');
        console.error(JSON.stringify(content.substring(idx, idx + 200)));
    }
    process.exit(1);
}

const startIdx = content.indexOf(startMarker);

let endIdx = content.indexOf(endMarker, startIdx);
if (endIdx === -1) {
    endIdx = content.indexOf(altEndMarker, startIdx);
}
if (endIdx === -1) {
    // Find any next tabs section
    const nextTabMarkers = [
        '          {/* API Keys Tab */}',
        '          {view === \'keys\'',
        '          {view === "keys"',
    ];
    for (const m of nextTabMarkers) {
        const i = content.indexOf(m, startIdx + 100);
        if (i !== -1) {
            endIdx = i - 2; // back before the preceding \r\n\r\n
            break;
        }
    }
}

if (endIdx === -1) {
    console.error('❌ End marker NOT found');
    process.exit(1);
}

const oldBlock = content.substring(startIdx, endIdx);
console.log('✅ Found old branding block (' + oldBlock.length + ' chars)');

const newBrandingJSX = `          {/* 2. Branding Tab */}
          {view === 'branding' && (
            <motion.div key="branding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">

              {/* PRESET SELECTOR BAR */}
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-6 border border-white/5 shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Preset de Branding Ativo</label>
                  <div className="relative">
                    <select
                      value={activeBrandId || ''}
                      onChange={(e) => switchBrandPreset(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-amber-500 text-sm font-black rounded-xl outline-none focus:border-amber-500/50 cursor-pointer appearance-none uppercase tracking-widest transition-all"
                    >
                      <option value="" disabled>Selecione um Preset</option>
                      {brandPresets.map(preset => (
                        <option key={preset.id} value={preset.id}>{preset.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => { const n = window.prompt('Nome do novo preset de branding:'); if (n) createBrandPreset(n); }}
                    className="flex items-center gap-2 px-5 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
                  >
                    <Plus size={14} /> Novo
                  </button>
                  {brandPresets.length > 1 && (
                    <button
                      onClick={() => activeBrandId && window.confirm('Excluir este preset?') && deleteBrandPreset(activeBrandId)}
                      className="flex items-center gap-2 px-5 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  )}
                </div>
              </div>

              {/* MAIN BRANDING EDITOR */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Panel: Visual Identity */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/5 h-full shadow-2xl">
                    <h2 className="text-xl font-sans font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                      <Palette className="text-amber-500" /> Identidade Visual
                    </h2>

                    <div className="space-y-6">
                      {/* Nome */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nome do Preset</label>
                        <input
                          type="text"
                          value={brandConfig.name || ''}
                          onChange={(e) => setBrandConfig({ ...brandConfig, name: e.target.value })}
                          placeholder="Ex: TRC Odontologia"
                          className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 text-white text-sm font-bold rounded-xl outline-none focus:border-amber-500/50 transition-colors"
                        />
                      </div>

                      {/* Primary color */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cor Primária</label>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-4 border border-white/5 rounded-2xl">
                          <input
                            type="color"
                            value={brandConfig.primaryBlue}
                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}
                            className="w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandConfig.primaryBlue}
                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-xs font-bold outline-none uppercase"
                            />
                            <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase">HEX CODE</p>
                          </div>
                        </div>
                      </div>

                      {/* Secondary color */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cor Secundária / Destaque</label>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-4 border border-white/5 rounded-2xl">
                          <input
                            type="color"
                            value={brandConfig.primaryGold}
                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}
                            className="w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandConfig.primaryGold}
                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-xs font-bold outline-none uppercase"
                            />
                            <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase">HEX CODE</p>
                          </div>
                        </div>
                      </div>

                      {/* Color preview bar */}
                      <div className="h-4 rounded-full overflow-hidden flex">
                        <div className="flex-1 transition-all" style={{ backgroundColor: brandConfig.primaryBlue }} />
                        <div className="flex-1 transition-all" style={{ backgroundColor: brandConfig.primaryGold }} />
                      </div>

                      {/* Font Family */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Família Tipográfica</label>
                        <div className="relative">
                          <select
                            value={brandConfig.fontFamily || 'Inter'}
                            onChange={(e) => setBrandConfig({ ...brandConfig, fontFamily: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-white text-sm font-bold rounded-xl outline-none focus:border-amber-500/50 cursor-pointer appearance-none transition-all"
                          >
                            {['Inter', 'Roboto', 'Montserrat', 'Poppins', 'Outfit', 'Raleway', 'Lato', 'Open Sans', 'Nunito', 'Lexend', 'Playfair Display', 'DM Sans'].map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-600 font-bold" style={{ fontFamily: brandConfig.fontFamily || 'Inter' }}>
                          Preview: Aa Bb Cc — {brandConfig.fontFamily || 'Inter'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Strategy + AI Upload */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/5 h-full flex flex-col shadow-2xl">
                    <h2 className="text-xl font-sans font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                      <FileText className="text-amber-500" /> Estratégia de Marca
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                      <div className="space-y-4 flex flex-col">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Descrição Sistêmica</label>
                        <textarea
                          value={brandConfig.description || ''}
                          onChange={(e) => setBrandConfig({ ...brandConfig, description: e.target.value })}
                          className="flex-1 w-full p-4 bg-slate-950/50 border border-white/5 text-slate-300 rounded-2xl outline-none focus:border-amber-500/50 placeholder:text-slate-700 resize-none font-sans text-xs font-bold leading-relaxed"
                          placeholder="Defina o core business e tom de voz..."
                        />
                      </div>

                      <div className="space-y-4 flex flex-col">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Análise de Guia Visual via IA</label>
                          {isExtractingColors && <RefreshCw className="animate-spin text-amber-500" size={12} />}
                        </div>

                        {!brandConfig.pdfName ? (
                          <label className={\`flex-1 flex flex-col items-center justify-center w-full border border-dashed border-slate-800 rounded-2xl cursor-pointer hover:bg-blue-500/5 transition-all group bg-slate-950/30 \${isExtractingColors ? 'opacity-50 pointer-events-none' : ''}\`}>
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                              <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:border-amber-500/30 transition-all">
                                {isExtractingColors ? <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" /> : <Sparkles className="w-6 h-6 text-slate-600 group-hover:text-amber-500" />}
                              </div>
                              <p className="text-xs font-black text-slate-500 group-hover:text-white transition-colors uppercase">
                                {isExtractingColors ? 'Extraindo Cores & Nome...' : 'Dropar Logo/PDF'}
                              </p>
                              <p className="text-[9px] text-slate-700 mt-2 uppercase tracking-widest font-bold">A Gemini IA extrai o Preset</p>
                            </div>
                            <input type="file" className="hidden" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={extractColorsFromBranding} disabled={isExtractingColors} />
                          </label>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center w-full bg-slate-950/50 border border-white/5 rounded-2xl p-8 relative group">
                            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-4">
                              <FileText size={32} className="text-amber-500" />
                            </div>
                            <p className="text-xs font-bold text-white text-center break-all px-4 uppercase tracking-tighter">{brandConfig.pdfName}</p>
                            <p className="text-[9px] text-amber-500 font-black mt-2 uppercase tracking-[0.2em]">Guia Integrado</p>
                            <button
                              onClick={(e) => { e.preventDefault(); setBrandConfig({...brandConfig, pdfName: undefined, pdfBase64: undefined}); }}
                              className="absolute top-4 right-4 p-2 bg-white/5 rounded-xl text-slate-500 hover:bg-amber-500 hover:text-black transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 flex justify-end gap-6">
                      <button onClick={saveBranding} disabled={loading} className={\`bg-amber-500 text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-amber-400 transition-all uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20 \${loading ? 'opacity-50' : ''}\`}>
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        Salvar Preset Atual
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}`;

content = content.substring(0, startIdx) + newBrandingJSX + content.substring(endIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Branding tab JSX replaced successfully!');
