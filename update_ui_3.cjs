const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const startMarker = '{/* 2. Branding Tab */}';
const endMarker = '{/* 2. API Keys Tab */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newBrandingJSX = "{/* 2. Branding Tab */}\n" +
        "          {view === 'branding' && (\n" +
        "            <motion.div key=\"branding\" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className=\"space-y-6\">\n" +
        "              \n" +
        "              {/* BRANDING PRESET SELECTOR */}\n" +
        "              <div className=\"bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-6 border border-white/5 shadow-2xl flex flex-col md:flex-row gap-6 items-center justify-between\">\n" +
        "                <div className=\"flex-1 w-full\">\n" +
        "                  <label className=\"text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block\">Preset de Branding Ativo</label>\n" +
        "                  <div className=\"relative\">\n" +
        "                    <select\n" +
        "                      value={activeBrandId || ''}\n" +
        "                      onChange={(e) => switchBrandPreset(e.target.value)}\n" +
        "                      className=\"w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-amber-500 text-sm font-black rounded-xl outline-none focus:border-amber-500/50 cursor-pointer appearance-none uppercase tracking-widest transition-all\"\n" +
        "                    >\n" +
        "                      <option value=\"\" disabled>Selecione um Preset</option>\n" +
        "                      {brandPresets.map(preset => (\n" +
        "                        <option key={preset.id} value={preset.id}>{preset.name}</option>\n" +
        "                      ))}\n" +
        "                    </select>\n" +
        "                    <ChevronDown size={16} className=\"absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none\" />\n" +
        "                  </div>\n" +
        "                </div>\n" +
        "                <div className=\"flex items-center gap-3 pt-4 md:pt-6\">\n" +
        "                  <button onClick={() => {\n" +
        "                    const name = window.prompt('Nome do novo preset de branding:');\n" +
        "                    if (name) createBrandPreset(name);\n" +
        "                  }} className=\"bg-blue-600/20 text-blue-400 border border-blue-500/30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600/30 transition-all uppercase tracking-widest text-[10px]\">\n" +
        "                    <Plus size={14} /> Novo\n" +
        "                  </button>\n" +
        "                  <button onClick={() => {\n" +
        "                    if (activeBrandId && window.confirm('Certeza que deseja excluir este preset?')) {\n" +
        "                      deleteBrandPreset(activeBrandId);\n" +
        "                    }\n" +
        "                  }} className=\"bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all\" title=\"Excluir Preset\">\n" +
        "                    <Trash2 size={16} />\n" +
        "                  </button>\n" +
        "                </div>\n" +
        "              </div>\n" +
        "\n" +
        "              <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-6\">\n" +
        "\n" +
        "                {/* Left Panel: Visual Identity */}\n" +
        "                <div className=\"lg:col-span-4 space-y-6\">\n" +
        "                  <div className=\"bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/5 h-full shadow-2xl\">\n" +
        "                    <div className=\"flex justify-between items-center mb-8\">\n" +
        "                      <h2 className=\"text-xl font-sans font-black text-white flex items-center gap-3 uppercase tracking-tighter\">\n" +
        "                        <Palette className=\"text-amber-500\" /> Identidade Aura\n" +
        "                      </h2>\n" +
        "                    </div>\n" +
        "\n" +
        "                    <div className=\"space-y-8\">\n" +
        "                      <div className=\"space-y-4\">\n" +
        "                        <label className=\"text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]\">Nome do Preset</label>\n" +
        "                        <input\n" +
        "                          type=\"text\"\n" +
        "                          value={brandConfig.name || ''}\n" +
        "                          onChange={(e) => setBrandConfig({ ...brandConfig, name: e.target.value })}\n" +
        "                          className=\"w-full bg-slate-950/50 p-4 border border-white/5 text-white font-bold rounded-2xl outline-none focus:border-amber-500/50\"\n" +
        "                          placeholder=\"Ex: Hub Conexão\"\n" +
        "                        />\n" +
        "                      </div>\n" +
        "\n" +
        "                      <div className=\"space-y-4\">\n" +
        "                        <label className=\"text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]\">Primária (Main Aura)</label>\n" +
        "                        <div className=\"flex items-center gap-4 bg-slate-950/50 p-4 border border-white/5 rounded-2xl\">\n" +
        "                          <input\n" +
        "                            type=\"color\"\n" +
        "                            value={brandConfig.primaryBlue || '#004a8e'}\n" +
        "                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}\n" +
        "                            className=\"w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden\"\n" +
        "                          />\n" +
        "                          <div className=\"flex-1\">\n" +
        "                            <input\n" +
        "                              type=\"text\"\n" +
        "                              value={brandConfig.primaryBlue || '#004a8e'}\n" +
        "                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}\n" +
        "                              className=\"w-full bg-transparent text-white font-mono text-xs font-bold outline-none uppercase\"\n" +
        "                            />\n" +
        "                            <p className=\"text-[9px] text-slate-600 font-bold mt-1 uppercase\">HEX CODE</p>\n" +
        "                          </div>\n" +
        "                        </div>\n" +
        "                      </div>\n" +
        "\n" +
        "                      <div className=\"space-y-4\">\n" +
        "                        <label className=\"text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]\">Destaque (Aura Gold)</label>\n" +
        "                        <div className=\"flex items-center gap-4 bg-slate-950/50 p-4 border border-white/5 rounded-2xl\">\n" +
        "                          <input\n" +
        "                            type=\"color\"\n" +
        "                            value={brandConfig.primaryGold || '#b38e5d'}\n" +
        "                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}\n" +
        "                            className=\"w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden\"\n" +
        "                          />\n" +
        "                          <div className=\"flex-1\">\n" +
        "                            <input\n" +
        "                              type=\"text\"\n" +
        "                              value={brandConfig.primaryGold || '#b38e5d'}\n" +
        "                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}\n" +
        "                              className=\"w-full bg-transparent text-white font-mono text-xs font-bold outline-none uppercase\"\n" +
        "                            />\n" +
        "                            <p className=\"text-[9px] text-slate-600 font-bold mt-1 uppercase\">HEX CODE</p>\n" +
        "                          </div>\n" +
        "                        </div>\n" +
        "                      </div>\n" +
        "\n" +
        "                      <div className=\"space-y-4\">\n" +
        "                        <label className=\"text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]\">Família Tipográfica</label>\n" +
        "                        <div className=\"relative\">\n" +
        "                          <select\n" +
        "                            value={brandConfig.fontFamily || 'Inter'}\n" +
        "                            onChange={(e) => setBrandConfig({ ...brandConfig, fontFamily: e.target.value })}\n" +
        "                            className=\"w-full bg-slate-950/50 p-4 border border-white/5 text-white font-bold rounded-2xl outline-none focus:border-amber-500/50 appearance-none cursor-pointer\"\n" +
        "                          >\n" +
        "                            <option value=\"Inter\">Inter (Padrão)</option>\n" +
        "                            <option value=\"Roboto\">Roboto</option>\n" +
        "                            <option value=\"Montserrat\">Montserrat</option>\n" +
        "                            <option value=\"Poppins\">Poppins</option>\n" +
        "                            <option value=\"Outfit\">Outfit</option>\n" +
        "                            <option value=\"Satoshi\">Satoshi</option>\n" +
        "                            <option value=\"Lexend\">Lexend</option>\n" +
        "                            <option value=\"Fira Code\">Fira Code</option>\n" +
        "                            <option value=\"Fira Sans\">Fira Sans</option>\n" +
        "                          </select>\n" +
        "                          <ChevronDown size={16} className=\"absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none\" />\n" +
        "                        </div>\n" +
        "                      </div>\n" +
        "                    </div>\n" +
        "                  </div>\n" +
        "                </div>\n" +
        "\n" +
        "                {/* Right Panel: Brand Strategy */}\n" +
        "                <div className=\"lg:col-span-8 space-y-6\">\n" +
        "                  <div className=\"bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/5 h-full flex flex-col shadow-2xl\">\n" +
        "                    <h2 className=\"text-xl font-sans font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter\">\n" +
        "                      <FileText className=\"text-amber-500\" /> Estratégia Aura\n" +
        "                    </h2>\n" +
        "\n" +
        "                    <div className=\"grid grid-cols-1 md:grid-cols-2 gap-10 flex-1\">\n" +
        "                      <div className=\"space-y-4 flex flex-col\">\n" +
        "                        <label className=\"text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]\">Descrição Sistêmica</label>\n" +
        "                        <textarea\n" +
        "                          value={brandConfig.description || ''}\n" +
        "                          onChange={(e) => setBrandConfig({ ...brandConfig, description: e.target.value })}\n" +
        "                          className=\"flex-1 w-full p-4 bg-slate-950/50 border border-white/5 text-slate-300 rounded-2xl outline-none focus:border-amber-500/50 placeholder:text-slate-700 resize-none font-sans text-xs font-bold leading-relaxed\"\n" +
        "                          placeholder=\"Defina o core business e tom de voz...\"\n" +
        "                        />\n" +
        "                      </div>\n" +
        "\n" +
        "                      <div className=\"space-y-4 flex flex-col\">\n" +
        "                        <div className=\"flex items-center justify-between\">\n" +
        "                          <label className=\"text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]\">Análise de Guia Visual via IA</label>\n" +
        "                          {isExtractingColors && <RefreshCw className=\"animate-spin text-amber-500\" size={12} />}\n" +
        "                        </div>\n" +
        "                        \n" +
        "                        {!brandConfig.pdfName ? (\n" +
        "                          <label className={`flex-1 flex flex-col items-center justify-center w-full border border-dashed border-slate-800 rounded-2xl cursor-pointer hover:bg-blue-500/5 transition-all group bg-slate-950/30 ${isExtractingColors ? 'opacity-50 pointer-events-none' : ''}`}>\n" +
        "                            <div className=\"flex flex-col items-center justify-center p-6 text-center\">\n" +
        "                              <div className=\"w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:border-amber-500/30 transition-all\">\n" +
        "                                {isExtractingColors ? <RefreshCw className=\"w-6 h-6 text-amber-500 animate-spin\" /> : <Sparkles className=\"w-6 h-6 text-slate-600 group-hover:text-amber-500\" />}\n" +
        "                              </div>\n" +
        "                              <p className=\"text-xs font-black text-slate-500 group-hover:text-white transition-colors uppercase\">\n" +
        "                                {isExtractingColors ? 'Extraindo Cores & Nome...' : 'Dropar Logo/PDF'}\n" +
        "                              </p>\n" +
        "                              <p className=\"text-[9px] text-slate-700 mt-2 uppercase tracking-widest font-bold\">A Gemini IA define o Preset</p>\n" +
        "                            </div>\n" +
        "                            <input type=\"file\" className=\"hidden\" accept=\"application/pdf,image/png,image/jpeg,image/webp\" onChange={extractColorsFromBranding} disabled={isExtractingColors} />\n" +
        "                          </label>\n" +
        "                        ) : (\n" +
        "                          <div className=\"flex-1 flex flex-col items-center justify-center w-full bg-slate-950/50 border border-white/5 rounded-2xl p-8 relative group\">\n" +
        "                            <div className=\"w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-4\">\n" +
        "                              <FileText size={32} className=\"text-amber-500\" />\n" +
        "                            </div>\n" +
        "                            <p className=\"text-xs font-bold text-white text-center break-all px-4 uppercase tracking-tighter\">{brandConfig.pdfName}</p>\n" +
        "                            <p className=\"text-[9px] text-amber-500 font-black mt-2 uppercase tracking-[0.2em]\">Guia Integrado</p>\n" +
        "                            <button\n" +
        "                              onClick={(e) => { e.preventDefault(); setBrandConfig({...brandConfig, pdfName: undefined, pdfBase64: undefined}); }}\n" +
        "                              className=\"absolute top-4 right-4 p-2 bg-white/5 rounded-xl text-slate-500 hover:bg-amber-500 hover:text-black transition-all opacity-0 group-hover:opacity-100\"\n" +
        "                            >\n" +
        "                              <X size={14} />\n" +
        "                            </button>\n" +
        "                          </div>\n" +
        "                        )}\n" +
        "                      </div>\n" +
        "                    </div>\n" +
        "\n" +
        "                    <div className=\"mt-10 pt-8 border-t border-white/5 flex justify-end gap-6\">\n" +
        "                      <button onClick={saveBranding} disabled={loading} className={`bg-amber-500 text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-amber-400 transition-all uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20 ${loading ? 'opacity-50' : ''}`}>\n" +
        "                        {loading ? <RefreshCw className=\"animate-spin\" size={18} /> : <Save size={18} />}\n" +
        "                        Salvar Preset Atual\n" +
        "                      </button>\n" +
        "                    </div>\n" +
        "                  </div>\n" +
        "                </div>\n" +
        "              </div>\n" +
        "            </motion.div>\n" +
        "          )}\n\n          ";

    const modified = content.substring(0, startIndex) + newBrandingJSX + content.substring(endIndex);
    fs.writeFileSync('src/App.tsx', modified);
    console.log('UI updated successfully!');
} else {
    console.log('Not found:', startIndex, endIndex);
}
