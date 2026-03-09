/**
 * fix_branding_modal.cjs — Adds a proper modal for new brand preset + fixes alignment.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');
let changed = 0;

function replace(marker, replacement, desc) {
    if (!content.includes(marker)) {
        console.error('❌ MARKER NOT FOUND:', desc);
        return;
    }
    content = content.replace(marker, replacement);
    changed++;
    console.log('✅', desc);
}

// 1. Add showNewBrandModal state beside isExtractingColors
replace(
    `  const [isExtractingColors, setIsExtractingColors] = React.useState(false);`,
    `  const [isExtractingColors, setIsExtractingColors] = React.useState(false);\r\n  const [showNewBrandModal, setShowNewBrandModal] = React.useState(false);\r\n  const [newBrandName, setNewBrandName] = React.useState('');`,
    'Added showNewBrandModal and newBrandName states'
);

// 2. Fix the PRESET SELECTOR BAR — replace the whole bar with aligned version + modal trigger
const oldBar = `              {/* PRESET SELECTOR BAR */}
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
              </div>`;

const newBar = `              {/* PRESET SELECTOR BAR */}
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl px-6 py-5 border border-white/5 shadow-2xl">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Preset de Branding Ativo</label>
                <div className="flex items-center gap-3">
                  {/* Select */}
                  <div className="relative flex-1">
                    <select
                      value={activeBrandId || ''}
                      onChange={(e) => switchBrandPreset(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-amber-500 text-sm font-black rounded-xl outline-none focus:border-amber-500/50 cursor-pointer appearance-none uppercase tracking-widest transition-all h-[46px]"
                    >
                      <option value="" disabled>Selecione um Preset</option>
                      {brandPresets.map(preset => (
                        <option key={preset.id} value={preset.id}>{preset.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                  {/* Buttons - same height as select */}
                  <button
                    onClick={() => { setNewBrandName(''); setShowNewBrandModal(true); }}
                    className="flex items-center gap-2 px-5 h-[46px] bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all whitespace-nowrap shrink-0"
                  >
                    <Plus size={14} /> Novo
                  </button>
                  {brandPresets.length > 1 && (
                    <button
                      onClick={() => activeBrandId && window.confirm('Excluir este preset permanentemente?') && deleteBrandPreset(activeBrandId)}
                      className="flex items-center gap-2 px-5 h-[46px] bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all whitespace-nowrap shrink-0"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  )}
                </div>
              </div>

              {/* NEW BRAND PRESET MODAL */}
              {showNewBrandModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowNewBrandModal(false)}>
                  <div
                    className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-black text-white uppercase tracking-tighter flex items-center gap-2">
                        <Plus size={16} className="text-amber-500" /> Novo Preset
                      </h3>
                      <button onClick={() => setShowNewBrandModal(false)} className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Nome do Branding</label>
                        <input
                          type="text"
                          value={newBrandName}
                          onChange={(e) => setNewBrandName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' && newBrandName.trim()) { createBrandPreset(newBrandName.trim()); setShowNewBrandModal(false); } }}
                          placeholder="Ex: TRC Odontologia"
                          autoFocus
                          className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-white text-sm font-bold rounded-xl outline-none focus:border-amber-500/50 placeholder:text-slate-600 transition-colors"
                        />
                      </div>
                      <button
                        onClick={() => { if (newBrandName.trim()) { createBrandPreset(newBrandName.trim()); setShowNewBrandModal(false); } }}
                        disabled={!newBrandName.trim()}
                        className="w-full py-3.5 bg-amber-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Criar Preset
                      </button>
                    </div>
                  </div>
                </div>
              )}`;

replace(oldBar, newBar, 'Fixed alignment + replaced window.prompt with proper modal');

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 Done! Applied ${changed}/2 changes.`);
