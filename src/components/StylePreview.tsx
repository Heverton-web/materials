import React from 'react';
import { Palette, Sparkles, Layout, Layers, Zap, MousePointer2, ShieldCheck, Activity } from 'lucide-react';

interface StylePreviewProps {
  styleTitle: string;
  brandConfig: {
    primaryBlue: string;
    primaryGold: string;
  };
}

const StylePreview: React.FC<StylePreviewProps> = ({ styleTitle, brandConfig }) => {
  const title = styleTitle.toLowerCase();

  // Aura Neobrutalismo
  if (title.includes('neobrutalismo')) {
    return (
      <div className="w-full h-full bg-slate-900 p-4 border border-white/10 flex flex-col gap-4 font-black rounded-3xl overflow-hidden">
        <div className="border-[3px] border-amber-500 p-5 bg-slate-950 shadow-[6px_6px_0px_0px_rgba(245,158,11,0.2)] rounded-2xl">
          <h1 className="text-xl font-black uppercase tracking-tighter text-amber-500">Core_Brutal.v1</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-white/10 p-5 bg-amber-500 shadow-xl rounded-2xl">
            <Zap className="text-black mb-2" size={24} />
            <div className="h-1.5 w-full bg-black/30 rounded-full" />
          </div>
          <div className="border border-white/10 p-5 bg-slate-800 shadow-xl rounded-2xl">
            <Palette className="text-amber-500 mb-2" size={24} />
            <div className="h-1.5 w-full bg-amber-500/20 rounded-full" />
          </div>
        </div>
        <div className="mt-auto border border-amber-500 p-4 bg-amber-500 text-black text-center font-black text-[10px] tracking-[0.3em] uppercase rounded-xl">
          TRANSFORMAR_AURA
        </div>
      </div>
    );
  }

  // Aura Bento
  if (title.includes('bento')) {
    return (
      <div className="w-full h-full bg-slate-950 p-5 grid grid-cols-3 grid-rows-3 gap-3 font-black overflow-hidden rounded-3xl border border-white/10">
        <div className="col-span-2 row-span-2 bg-slate-900/50 border border-white/5 p-5 flex flex-col justify-end relative group rounded-2xl">
          <div className="absolute top-5 right-5 text-amber-500 opacity-40">
            <Activity size={20} />
          </div>
          <div className="w-12 h-2 bg-amber-500/50 mb-4 rounded-full" />
          <div className="h-5 w-2/3 bg-white/20 mb-3 rounded-lg" />
          <div className="h-3 w-1/2 bg-white/5 rounded-lg" />
        </div>
        <div className="bg-slate-900/50 border border-white/5 p-5 flex items-center justify-center rounded-2xl shadow-xl">
          <Sparkles className="text-amber-500" size={24} />
        </div>
        <div className="bg-slate-900/50 border border-white/5 p-5 flex items-center justify-center rounded-2xl shadow-xl">
          <Layers className="text-slate-600" size={24} />
        </div>
        <div className="col-span-2 bg-slate-900/50 border border-white/5 p-5 flex items-center gap-5 rounded-2xl shadow-xl">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center rounded-xl">
            <ShieldCheck size={20} className="text-amber-500" />
          </div>
          <div className="flex-1 space-y-2.5">
            <div className="h-2 w-full bg-white/10 rounded-full" />
            <div className="h-2 w-1/2 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Aura Estelar
  if (title.includes('aurora')) {
    return (
      <div className="w-full h-full bg-slate-950 p-6 relative overflow-hidden flex flex-col items-center justify-center text-center font-black rounded-3xl border border-white/10">
        <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/10 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-slate-500/10 blur-[80px]" />
        <div className="relative z-10 bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 w-full shadow-2xl rounded-2xl">
          <span className="text-[10px] text-amber-500 uppercase tracking-[0.5em] mb-4 block font-black">Sync_Estelar</span>
          <h1 className="text-2xl text-white font-black mb-6 tracking-tighter uppercase">Aura_Aurora</h1>
          <div className="space-y-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto" />
          </div>
          <div className="mt-10 px-8 py-4 border border-amber-500/30 text-white/40 text-[10px] tracking-[0.4em] uppercase hover:text-amber-500 hover:bg-amber-500/5 transition-all cursor-crosshair rounded-xl font-black">
            INICIAR_TRANSCENDÊNCIA
          </div>
        </div>
      </div>
    );
  }

  // Aura Modern (Default Branding)
  return (
    <div className="w-full h-full bg-slate-950 p-8 flex flex-col gap-8 font-black overflow-hidden relative rounded-3xl border border-white/10">
      <div className="absolute top-0 right-0 w-48 h-px bg-gradient-to-l from-amber-500/40 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-48 bg-gradient-to-b from-amber-500/40 to-transparent" />

      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-xl" style={{ color: brandConfig.primaryGold }}>
            <Layout size={28} />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-40 bg-white/10 rounded-full" />
            <div className="h-2 w-24 bg-amber-500/30 rounded-full" />
          </div>
        </div>
        <div className="w-10 h-10 flex items-center justify-center border border-white/5 text-slate-700 rounded-xl bg-white/5 shadow-inner">
          <MousePointer2 size={16} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <div className="space-y-5">
          <div className="h-8 w-3/4 bg-slate-900 border-l-[3px] border-amber-500 pl-6 flex items-center rounded-r-xl shadow-lg">
            <div className="h-2.5 w-1/2 bg-white/20 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="h-2 w-full bg-white/10 rounded-full" />
            <div className="h-2 w-full bg-white/10 rounded-full" />
            <div className="h-2 w-2/3 bg-white/10 rounded-full" />
          </div>
        </div>

        <div className="mt-auto flex items-center gap-4">
          <div
            className="h-14 flex-1 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.4em] text-black shadow-lg rounded-2xl active:scale-[0.98] transition-all"
            style={{ backgroundColor: brandConfig.primaryGold }}
          >
            AURA_STREAM
          </div>
          <div className="w-14 h-14 border border-white/10 flex items-center justify-center text-slate-500 rounded-2xl bg-slate-900 shadow-xl">
            <Zap size={24} />
          </div>
        </div>
      </div>

      {/* Grid pattern overlay Aura */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
};

export default StylePreview;
