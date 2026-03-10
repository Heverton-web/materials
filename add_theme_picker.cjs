
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const themePickerHtml = `
                {/* PLATFORM THEME PICKER */}
                <div className="mt-12 pt-8 border-t border-white/5">
                  <h3 className="text-base font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <Palette size={18} className="text-accent" /> Personalização da Plataforma
                  </h3>
                  <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={appAccentColor} 
                        onChange={(e) => setAppAccentColor(e.target.value)}
                        className="w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden"
                      />
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cor Global Aura</p>
                        <p className="text-xs font-mono text-white mt-1 uppercase">{appAccentColor}</p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-tighter">
                        Esta cor altera os estados visuais do Interactive Builder (botões, ícones, estados de hover), permitindo que você trabalhe no ambiente que desejar sem afetar o branding dos materiais gerados.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
                        <button 
                          key={c} 
                          onClick={() => setAppAccentColor(c)}
                          className={\`w-6 h-6 rounded-full border border-white/10 transition-transform hover:scale-125 \${appAccentColor === c ? 'ring-2 ring-white/20 scale-125' : ''}\`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
`;

// Find the section for supabase config and insert before the last closing div of that section
// The section ends with </div>\n                  </div>\n                </div>\n              </div>
// based on view_file 301/320

const searchPattern = /className="w-full pl-12 pr-4 py-4 bg-slate-950\/50 border border-white\/5 text-slate-200 font-mono text-sm outline-none focus:border-accent-shadow transition-colors rounded-2xl"\s*\/?>\s*<\/div>\s*<\/div>\s*<\/div>/;

if (searchPattern.test(content)) {
    content = content.replace(searchPattern, (match) => match + themePickerHtml);
    fs.writeFileSync(filePath, content);
    console.log('Theme picker added via script');
} else {
    console.log('Pattern not found');
    // Fallback search
    const fallbackPattern = /value={supabaseConfig\.anonKey}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
    if (fallbackPattern.test(content)) {
        content = content.replace(fallbackPattern, (match) => match.replace(/<\/div>\s*<\/div>$/, themePickerHtml + '</div></div>'));
        fs.writeFileSync(filePath, content);
        console.log('Theme picker added via fallback script');
    }
}
