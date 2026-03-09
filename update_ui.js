import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const newBrandingJSX = `{/* 2. Branding Tab */}
          {view === 'branding' && (
            <motion.div key="branding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              
              {/* BRANDING PRESET SELECTOR */}
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-6 border border-white/5 shadow-2xl flex flex-col md:flex-row gap-6 items-center justify-between">
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
                <div className="flex items-center gap-3 pt-4 md:pt-6">
                  <button onClick={() => {
                    const name = prompt('Nome do novo preset de branding:');
                    if (name) createBrandPreset(name);
                  }} className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600/30 transition-all uppercase tracking-widest text-[10px]">
                    <Plus size={14} /> Novo
                  </button>
                  <button onClick={() => {
                    if (activeBrandId && confirm('Certeza que deseja excluir este preset?')) {
                      deleteBrandPreset(activeBrandId);
                    }
                  }} className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all" title="Excluir Preset">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Panel: Visual Identity */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/5 h-full shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-sans font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                        <Palette className="text-amber-500" /> Identidade Aura
                      </h2>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nome do Preset</label>
                        <input
                          type="text"
                          value={brandConfig.name || ''}
                          onChange={(e) => setBrandConfig({ ...brandConfig, name: e.target.value })}
                          className="w-full bg-slate-950/50 p-4 border border-white/5 text-white font-bold rounded-2xl outline-none focus:border-amber-500/50"
                          placeholder="Ex: Hub Conexão"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Primária (Main Aura)</label>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-4 border border-white/5 rounded-2xl">
                          <input
                            type="color"
                            value={brandConfig.primaryBlue || '#004a8e'}
                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}
                            className="w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandConfig.primaryBlue || '#004a8e'}
                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-xs font-bold outline-none uppercase"
                            />
                            <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase">HEX CODE</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Destaque (Aura Gold)</label>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-4 border border-white/5 rounded-2xl">
                          <input
                            type="color"
                            value={brandConfig.primaryGold || '#b38e5d'}
                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}
                            className="w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandConfig.primaryGold || '#b38e5d'}
                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-xs font-bold outline-none uppercase"
                            />
                            <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase">HEX CODE</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Família Tipográfica</label>
                        <div className="relative">
                          <select
                            value={brandConfig.fontFamily || 'Inter'}
                            onChange={(e) => setBrandConfig({ ...brandConfig, fontFamily: e.target.value })}
                            className="w-full bg-slate-950/50 p-4 border border-white/5 text-white font-bold rounded-2xl outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                          >
                            <option value="Inter">Inter (Padrão)</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Outfit">Outfit</option>
                            <option value="Satoshi">Satoshi</option>
                            <option value="Lexend">Lexend</option>
                            <option value="Fira Code">Fira Code</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Brand Strategy */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/5 h-full flex flex-col shadow-2xl">
                    <h2 className="text-xl font-sans font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                      <FileText className="text-amber-500" /> Estratégia Aura
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
                          <label \`\${isExtractingColors ? 'opacity-50 pointer-events-none' : ''} flex-1 flex flex-col items-center justify-center w-full border border-dashed border-slate-800 rounded-2xl cursor-pointer hover:bg-blue-500/5 transition-all group bg-slate-950/30\`>
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                              <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:border-amber-500/30 transition-all">
                                {isExtractingColors ? <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" /> : <Sparkles className="w-6 h-6 text-slate-600 group-hover:text-amber-500" />}
                              </div>
                              <p className="text-xs font-black text-slate-500 group-hover:text-white transition-colors uppercase">
                                {isExtractingColors ? 'Extraindo Cores & Nome...' : 'Dropar Logo/PDF'}
                              </p>
                              <p className="text-[9px] text-slate-700 mt-2 uppercase tracking-widest font-bold">A Gemini IA define o Preset</p>
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
                      <button onClick={saveBranding} disabled={loading} className={\`\${loading ? 'opacity-50' : ''} bg-amber-500 text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-amber-400 transition-all uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20\`}>
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        Salvar Preset Atual
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. API Keys Tab */}
`;

const regexBrandingTab = /\{\/\*\s*2\.\s*Branding\s*Tab\s*\*\/\}\s*\{view\s*===\s*'branding'\s*&&\s*\([\s\S]*?\}\s*\)\}\s*\{\/\*\s*2\.\s*API\s*Keys\s*Tab\s*\*\/\}/m;

if (regexBrandingTab.test(content)) {
    content = content.replace(regexBrandingTab, newBrandingJSX);
    fs.writeFileSync('src/App.tsx', content);
    console.log('App.tsx UI Updated successfully!');
} else {
    console.error('Could not match Branding Tab string.');
}
