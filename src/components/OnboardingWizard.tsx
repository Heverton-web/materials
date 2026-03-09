import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Mail, Lock, Key, ChevronRight, ChevronLeft,
  CheckCircle2, Loader2, AlertTriangle, ShieldCheck, Copy, Check, Terminal
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_TABLES_SQL } from '../constants/supabaseSql';
import { SEED_PROMPTS_SQL } from '../constants/seedSql';

interface OnboardingWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function OnboardingWizard({ onComplete, onCancel }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedSeedSql, setCopiedSeedSql] = useState(false);

  // Step 1: Basic Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: API Keys
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openai: '',
    claude: '',
    groq: ''
  });

  // Step 3: Supabase Config
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    anonKey: ''
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_TABLES_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const copySeedSql = () => {
    navigator.clipboard.writeText(SEED_PROMPTS_SQL);
    setCopiedSeedSql(true);
    setTimeout(() => setCopiedSeedSql(false), 2000);
  };

  const handleNextStep = async () => {
    setError('');

    if (step === 1) {
      if (!fullName || !email || !password) {
        setError('Preencha todos os campos.');
        return;
      }
      if (!validateEmail(email)) {
        setError('E-mail inválido.');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!apiKeys.gemini && !apiKeys.openai && !apiKeys.claude && !apiKeys.groq) {
        setError('Forneça pelo menos uma chave de API para continuar.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');

    try {
      const tempSupabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

      let { data: authData, error: authError } = await tempSupabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('already registered') || authError.message.toLowerCase().includes('already exists')) {
          const { data: signInData, error: signInError } = await tempSupabase.auth.signInWithPassword({
            email,
            password
          });
          if (!signInError && signInData.user) {
            authData = signInData;
            authError = null;
          } else {
            throw authError;
          }
        } else {
          throw authError;
        }
      }

      if (!authData?.user) {
        throw new Error('Erro ao criar usuário.');
      }

      if (!authData.session) {
        const { data: signInData, error: signInError } = await tempSupabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError || !signInData.session) {
          throw new Error('Erro de Autenticação: O seu projeto Supabase exige confirmação de e-mail. Vá em Authentication > Providers > Email no Supabase e DESATIVE "Confirm email", depois tente novamente.');
        }
      }

      const userId = authData.user.id;

      localStorage.setItem('supabase_url', supabaseConfig.url);
      localStorage.setItem('supabase_anon_key', supabaseConfig.anonKey);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const keysToInsert = [];
      if (apiKeys.gemini) keysToInsert.push({ user_id: userId, service_name: 'gemini', key_value: apiKeys.gemini });
      if (apiKeys.openai) keysToInsert.push({ user_id: userId, service_name: 'openai', key_value: apiKeys.openai });
      if (apiKeys.claude) keysToInsert.push({ user_id: userId, service_name: 'claude', key_value: apiKeys.claude });
      if (apiKeys.groq) keysToInsert.push({ user_id: userId, service_name: 'groq', key_value: apiKeys.groq });

      if (keysToInsert.length > 0) {
        const { error: keysError } = await tempSupabase.from('api_keys').insert(keysToInsert);
        if (keysError) throw keysError;
      }

      const { error: configError } = await tempSupabase.from('branding_configs').upsert({
        user_id: userId,
        supabase_url: supabaseConfig.url,
        supabase_anon_key: supabaseConfig.anonKey,
        primary_blue: '#004a8e',
        primary_gold: '#b38e5d',
        description: 'Hub Conexão Digital - Plataforma Elite de Automação e Design'
      }, { onConflict: 'user_id' });

      if (configError) throw configError;

      window.location.reload();
      onComplete();

    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.message || 'Ocorreu um erro durante o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/40 border border-white/10 shadow-2xl w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] relative backdrop-blur-3xl"
      >
        {/* Decorator Aura */}
        <div className="absolute top-0 right-0 p-1 opacity-20">
          <Terminal size={120} className="text-amber-500 -mr-12 -mt-12 rotate-12" />
        </div>

        {/* Header Aura */}
        <div className="p-10 border-b border-white/5 bg-slate-950/40 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">System_Pulse v2026.1</span>
            <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
              Interromper_Carga
            </button>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Aura_Initialization</h2>
          <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-[0.2em] leading-relaxed">Sincronize seu núcleo de desenvolvimento em 3 fases de transmutação</p>
        </div>

        {/* Progress System Aura */}
        <div className="flex bg-slate-950/50 relative border-b border-white/5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 py-5 text-center text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${step === i
                ? 'text-amber-500 bg-amber-500/5'
                : step > i
                  ? 'text-slate-400 opacity-50'
                  : 'text-slate-700'
                }`}
            >
              Stream_0{i}
              {step === i && <motion.div layoutId="onboarding-step" className="absolute bottom-0 left-0 w-full h-1 bg-amber-500" />}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-stone-950/50">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="mb-8 p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-start gap-4 text-rose-500 shadow-xl backdrop-blur-md"
              >
                <AlertTriangle size={24} className="shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-widest block">Error_Detected:</span>
                  <p className="text-[11px] leading-relaxed uppercase font-black">{error}</p>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                  <div className="w-20 h-20 bg-slate-950/50 border border-white/5 flex items-center justify-center text-amber-500 rounded-2xl shadow-xl">
                    <User size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Identity_Registration</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Configure suas credenciais de acesso local</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">User_Alias</label>
                    <div className="relative">
                      <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 py-5 pl-14 pr-6 text-white font-black text-xs rounded-xl focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-800"
                        placeholder="AURA_OPERATOR_01"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Network_Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 py-5 pl-14 pr-6 text-white font-black text-xs rounded-xl focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-800"
                        placeholder="OPERATOR@AURA.STREAM"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure_Hash</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 py-5 pl-14 pr-6 text-white font-black text-xs rounded-xl focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-800"
                        placeholder="MIN_6_CHARS"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-6 pb-4 border-b border-white/5">
                  <div className="w-16 h-16 bg-white/5 border border-white/5 flex items-center justify-center text-amber-600">
                    <Key size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-mono font-bold text-white uppercase tracking-tight">Core_Intelligence</h3>
                    <p className="text-stone-500 text-[10px] font-mono uppercase tracking-widest mt-1">Integre modelos de linguagem avançados</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    { label: 'Gemini_Protocol', key: 'gemini', placeholder: 'AIzaSy...' },
                    { label: 'OpenAI_Interface', key: 'openai', placeholder: 'sk-...' },
                    { label: 'Claude_Engine', key: 'claude', placeholder: 'sk-ant-...' },
                    { label: 'Groq_Accelerator', key: 'groq', placeholder: 'gsk_...' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest">{field.label}</label>
                      <input
                        type="password"
                        value={(apiKeys as any)[field.key]}
                        onChange={(e) => setApiKeys({ ...apiKeys, [field.key]: e.target.value })}
                        className="w-full bg-black border border-white/5 py-4 px-4 text-white font-mono text-[10px] focus:border-amber-600 focus:outline-none transition-all placeholder:text-stone-800"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-6 pb-4 border-b border-white/5">
                  <div className="w-16 h-16 bg-white/5 border border-white/5 flex items-center justify-center text-amber-600">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-mono font-bold text-white uppercase tracking-tight">Nexus_Storage</h3>
                    <p className="text-stone-500 text-[10px] font-mono uppercase tracking-widest mt-1">Configure o banco de dados Supabase</p>
                  </div>
                </div>

                <div className="bg-amber-600/5 border border-amber-600/20 p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <AlertTriangle size={20} className="text-amber-500 shrink-0" />
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-[0.2em]">Mandatory_Deployment</span>
                      <p className="text-[11px] font-mono text-stone-400 leading-relaxed uppercase">Execute os scripts SQL no painel Supabase antes de concluir a sincronização.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={copySql}
                      className={`py-3 font-mono text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${copiedSql ? 'bg-amber-600 text-black' : 'bg-white/5 text-stone-400 hover:bg-white/10'}`}
                    >
                      {copiedSql ? <><Check size={14} /> SQL_SCHEMA_COPIED</> : <><Copy size={14} /> COPY_SCHEMA_SQL</>}
                    </button>
                    <button
                      onClick={copySeedSql}
                      className={`py-3 font-mono text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${copiedSeedSql ? 'bg-amber-600 text-black' : 'bg-white/5 text-stone-400 hover:bg-white/10'}`}
                    >
                      {copiedSeedSql ? <><Check size={14} /> SQL_SEED_COPIED</> : <><Copy size={14} /> COPY_SEED_SQL</>}
                    </button>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest">Supabase_URL</label>
                    <input
                      type="text"
                      value={supabaseConfig.url}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                      className="w-full bg-black border border-white/5 py-4 px-4 text-white font-mono text-[10px] focus:border-amber-600 focus:outline-none transition-all placeholder:text-stone-800"
                      placeholder="https://nexus_id.supabase.co"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest">Global_Auth_Key_Anon</label>
                    <input
                      type="password"
                      value={supabaseConfig.anonKey}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })}
                      className="w-full bg-black border border-white/5 py-4 px-4 text-white font-mono text-[10px] focus:border-amber-600 focus:outline-none transition-all placeholder:text-stone-800"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar Aura */}
        <div className="p-10 border-t border-white/5 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                disabled={loading}
                className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-all disabled:opacity-20 flex items-center gap-3 bg-white/5 rounded-2xl"
              >
                <ChevronLeft size={18} /> Stream_Anterior
              </button>
            )}
          </div>

          <button
            onClick={handleNextStep}
            disabled={loading}
            className="px-12 py-5 bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-amber-400 rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-3 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Sincronizando_Aura...</>
            ) : step === 3 ? (
              <><CheckCircle2 size={18} /> Implementar_Núcleo</>
            ) : (
              <>Próxima_Fase <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
