import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  html: string;
}

interface MaterialPreviewModalProps {
  material: Material | null;
  onClose: () => void;
}

const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({ material, onClose }) => {
  const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!material) return null;

  const downloadHtml = () => {
    const blob = new Blob([material.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${material.name}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    const win = window.open();
    if (win) {
      win.document.write(material.html);
      win.document.close();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl flex flex-col"
      >
        {/* Aura Browser Toolbar */}
        <div className="h-24 px-10 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-3xl shrink-0">
          <div className="flex items-center gap-8">
            <button
              onClick={onClose}
              className="w-14 h-14 bg-slate-900 border border-white/5 text-slate-500 hover:text-white flex items-center justify-center rounded-2xl transition-all group shadow-xl"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Material_Output // {material.id.split('-')[0]}</span>
              <h3 className="text-white font-black text-base uppercase tracking-tighter truncate max-w-[300px]">{material.name}</h3>
            </div>
          </div>

          {/* Viewport Control Aura */}
          <div className="hidden md:flex bg-slate-900/50 border border-white/5 p-1.5 rounded-2xl shrink-0 backdrop-blur-xl shadow-2xl">
            {[
              { id: 'desktop', icon: Monitor, label: 'DESKTOP 1440' },
              { id: 'tablet', icon: Tablet, label: 'TABLET 768' },
              { id: 'mobile', icon: Smartphone, label: 'MOBILE 375' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDevice(d.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${device === d.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
              >
                <d.icon size={16} />
                <span className="hidden lg:inline">{d.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openInNewTab}
              className="px-8 py-4 bg-slate-900 border border-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 rounded-2xl transition-all flex items-center gap-3 shadow-xl"
            >
              <ExternalLink size={16} /> <span className="hidden sm:inline">Visualizar_Externo</span>
            </button>
            <button
              onClick={downloadHtml}
              className="px-8 py-4 bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-amber-400 rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-3 active:scale-[0.98]"
            >
              <Download size={16} /> <span className="hidden sm:inline">Exportar_Código</span>
            </button>
          </div>
        </div>

        {/* Viewport Area Aura */}
        <div className="flex-1 bg-slate-950 p-6 md:p-16 flex items-center justify-center overflow-hidden">
          <motion.div
            layout
            className={`bg-white shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 ease-in-out h-full border border-white/10 rounded-3xl ${device === 'desktop' ? 'w-full' :
              device === 'tablet' ? 'w-[768px]' : 'w-[414px]'
              }`}
          >
            <iframe
              srcDoc={material.html}
              className="w-full h-full border-none"
              title="Aura Preview"
            />
          </motion.div>
        </div>

        {/* Footer info bar Aura */}
        <div className="h-10 px-8 bg-slate-950 border-t border-white/5 flex items-center justify-between shrink-0">
          <div className="flex gap-6">
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-relaxed">System_Protocol: AURA_CORE_v2026.0</span>
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-relaxed">Status: READY_FOR_STREAM</span>
          </div>
          <div className="flex gap-6">
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-relaxed">Resolution: {device === 'desktop' ? 'DYNAMIC_FILL' : device === 'tablet' ? '768xFILL' : '414xFILL'}</span>
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-relaxed">Stream_Encoding: UTF-8_BUFFER</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MaterialPreviewModal;
