import React from 'react';
import { Palette, Sparkles, Layout, Layers, Zap, MousePointer2 } from 'lucide-react';

interface StylePreviewProps {
  styleTitle: string;
  brandConfig: {
    primaryBlue: string;
    primaryGold: string;
  };
}

const StylePreview: React.FC<StylePreviewProps> = ({ styleTitle, brandConfig }) => {
  const title = styleTitle.toLowerCase();

  // Neobrutalismo
  if (title.includes('neobrutalismo')) {
    return (
      <div className="w-full h-full bg-[#f4f4f0] p-4 border-4 border-black flex flex-col gap-4 font-sans">
        <div className="border-4 border-black p-4 bg-white shadow-[8px_8px_0px_0px_#000]">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-black">Título Neobrutalista</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-4 border-black p-4 bg-[#FFD100] shadow-[4px_4px_0px_0px_#000]">
            <Zap className="text-black mb-2" />
            <div className="h-2 w-full bg-black/20 rounded-full" />
          </div>
          <div className="border-4 border-black p-4 bg-[#FF90E8] shadow-[4px_4px_0px_0px_#000]">
            <Palette className="text-black mb-2" />
            <div className="h-2 w-full bg-black/20 rounded-full" />
          </div>
        </div>
        <div className="mt-auto border-4 border-black p-3 bg-black text-white text-center font-bold">
          BOTÃO DE AÇÃO
        </div>
      </div>
    );
  }

  // Bento Grid
  if (title.includes('bento')) {
    return (
      <div className="w-full h-full bg-[#0a0a0c] p-4 grid grid-cols-3 grid-rows-3 gap-2 font-sans overflow-hidden">
        <div className="col-span-2 row-span-2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-4 flex flex-col justify-end">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full mb-2" />
          <div className="h-3 w-2/3 bg-white/20 rounded-full mb-1" />
          <div className="h-2 w-1/2 bg-white/10 rounded-full" />
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-4 flex items-center justify-center">
          <Sparkles className="text-blue-400" />
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-4 flex items-center justify-center">
          <Layers className="text-purple-400" />
        </div>
        <div className="col-span-2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl" />
          <div className="flex-1 space-y-1">
            <div className="h-2 w-full bg-white/20 rounded-full" />
            <div className="h-2 w-1/2 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Aurora UI
  if (title.includes('aurora')) {
    return (
      <div className="w-full h-full bg-[#050505] p-6 relative overflow-hidden flex flex-col items-center justify-center text-center font-serif">
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600/30 blur-[60px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-fuchsia-600/30 blur-[60px] animate-pulse" />
        <div className="relative z-10 bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] w-full">
          <h1 className="text-3xl text-white mb-4 tracking-tighter">Aurora Design</h1>
          <div className="space-y-2">
            <div className="h-1 w-24 bg-white/20 mx-auto rounded-full" />
            <div className="h-1 w-16 bg-white/10 mx-auto rounded-full" />
          </div>
          <div className="mt-8 px-6 py-2 border border-white/10 rounded-full text-white/50 text-[10px] tracking-widest uppercase">
            Explore a Elegância
          </div>
        </div>
      </div>
    );
  }

  // Claymorphism
  if (title.includes('claymorphism')) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#A5D8FF] to-[#E5DBFF] p-6 flex flex-col gap-4 font-sans items-center justify-center">
        <div className="w-full bg-[#A5D8FF] rounded-[2.5rem] p-6 shadow-[10px_10px_20px_rgba(0,0,0,0.1),inset_4px_4px_8px_rgba(255,255,255,0.5),inset_-4px_-4px_8px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white rounded-full mb-4 shadow-inner flex items-center justify-center">
            <Palette className="text-blue-400" size={32} />
          </div>
          <div className="h-4 w-32 bg-blue-900/20 rounded-full mb-2" />
          <div className="h-2 w-24 bg-blue-900/10 rounded-full" />
        </div>
        <div className="w-32 py-3 bg-[#FFD6E8] rounded-full shadow-[5px_5px_10px_rgba(0,0,0,0.1),inset_2px_2px_4px_rgba(255,255,255,0.5)] text-[#d63384] font-bold text-xs text-center">
          CLAY UI
        </div>
      </div>
    );
  }

  // Retro-Futurismo
  if (title.includes('retro-futurismo') || title.includes('cyberpunk')) {
    return (
      <div className="w-full h-full bg-[#020205] p-4 flex flex-col gap-4 font-mono overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-magenta-500/20 to-transparent opacity-50" />
        <div className="border border-cyan-500/50 p-4 bg-black/60 backdrop-blur-lg shadow-[0_0_15px_rgba(0,243,255,0.2)]">
          <h1 className="text-xl text-cyan-400 uppercase tracking-widest">System Online</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-magenta-500/50 p-3 bg-black/40">
            <div className="h-1 w-full bg-magenta-500/50 mb-2" />
            <div className="h-1 w-2/3 bg-magenta-500/30" />
          </div>
          <div className="border border-cyan-500/50 p-3 bg-black/40">
            <div className="h-1 w-full bg-cyan-500/50 mb-2" />
            <div className="h-1 w-2/3 bg-cyan-500/30" />
          </div>
        </div>
        <div className="mt-auto py-2 border border-cyan-400 text-cyan-400 text-center text-[10px] animate-pulse">
          INITIALIZING PROTOCOL...
        </div>
      </div>
    );
  }

  // Skeuomorph Moderno
  if (title.includes('skeuomorph') || title.includes('neumorphism')) {
    return (
      <div className="w-full h-full bg-[#E0E5EC] p-6 flex flex-col gap-6 font-sans items-center justify-center">
        <div className="w-full bg-[#E0E5EC] rounded-3xl p-6 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
          <div className="w-12 h-12 rounded-full bg-[#E0E5EC] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.6),inset_-6px_-6px_12px_rgba(255,255,255,0.5)] mb-4" />
          <div className="h-3 w-3/4 bg-slate-400/30 rounded-full mb-2" />
          <div className="h-2 w-1/2 bg-slate-400/20 rounded-full" />
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E0E5EC] shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]" />
        </div>
      </div>
    );
  }

  // Default / Branding (Medical Luxury)
  return (
    <div className="w-full h-full bg-[#fdfbf7] p-6 flex flex-col gap-6 font-serif overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/20 rounded-full -mr-16 -mt-16" />
      <div className="flex items-center justify-between border-b border-black/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/10" style={{ backgroundColor: brandConfig.primaryBlue }}>
            <Layout className="text-white" size={20} />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-32 bg-slate-900/80 rounded-full" />
            <div className="h-2 w-20 bg-slate-400/30 rounded-full" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center">
          <MousePointer2 size={12} className="text-slate-400" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="h-8 w-3/4 bg-slate-900/90 rounded-lg" />
        <div className="space-y-2">
          <div className="h-2 w-full bg-slate-300/40 rounded-full" />
          <div className="h-2 w-full bg-slate-300/40 rounded-full" />
          <div className="h-2 w-2/3 bg-slate-300/40 rounded-full" />
        </div>
        <div className="mt-auto flex items-center gap-4">
          <div className="h-10 flex-1 rounded-full shadow-md shadow-gold-900/10" style={{ backgroundColor: brandConfig.primaryGold }} />
          <div className="w-10 h-10 rounded-full border border-black/5" />
        </div>
      </div>
    </div>
  );
};

export default StylePreview;
