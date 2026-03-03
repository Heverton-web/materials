import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ExternalLink, Maximize2, Monitor, Smartphone, Tablet } from 'lucide-react';

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
        className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
            <div>
              <h3 className="text-white font-bold text-lg">{material.name}</h3>
              <p className="text-slate-500 text-xs">Visualização do Material Gerado</p>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="hidden md:flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button 
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg transition-all ${device === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              title="Desktop"
            >
              <Monitor size={18} />
            </button>
            <button 
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-lg transition-all ${device === 'tablet' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              title="Tablet"
            >
              <Tablet size={18} />
            </button>
            <button 
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg transition-all ${device === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              title="Mobile"
            >
              <Smartphone size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={openInNewTab}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <ExternalLink size={14} /> Abrir em Nova Aba
            </button>
            <button 
              onClick={downloadHtml}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
            >
              <Download size={14} /> Baixar HTML
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-slate-950 p-4 md:p-8 flex items-center justify-center overflow-hidden">
          <motion.div 
            layout
            className={`bg-white shadow-2xl overflow-hidden transition-all duration-500 ease-in-out h-full ${
              device === 'desktop' ? 'w-full' : 
              device === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            } rounded-2xl border border-slate-800`}
          >
            <iframe 
              srcDoc={material.html}
              className="w-full h-full border-none"
              title="Preview"
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MaterialPreviewModal;
