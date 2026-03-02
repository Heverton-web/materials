import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Lock, Key, Palette, ChevronRight, ChevronLeft, 
  CheckCircle2, Loader2, AlertTriangle, FileText, Upload, ShieldCheck
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { supabase as defaultSupabase } from '../lib/supabase';

interface OnboardingWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function OnboardingWizard({ onComplete, onCancel }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // API Keys are optional, user can provide 1 or all
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
      // 0. Create a temporary client with the provided credentials
      const tempSupabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

      // 1. Sign up user
      const { data: authData, error: authError } = await tempSupabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erro ao criar usuário.');
      }

      const userId = authData.user.id;

      // Save credentials to localStorage for the rest of the app
      localStorage.setItem('supabase_url', supabaseConfig.url);
      localStorage.setItem('supabase_anon_key', supabaseConfig.anonKey);

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Save API Keys
      const keysToInsert = [];
      if (apiKeys.gemini) keysToInsert.push({ user_id: userId, service_name: 'gemini', key_value: apiKeys.gemini });
      if (apiKeys.openai) keysToInsert.push({ user_id: userId, service_name: 'openai', key_value: apiKeys.openai });
      if (apiKeys.claude) keysToInsert.push({ user_id: userId, service_name: 'claude', key_value: apiKeys.claude });
      if (apiKeys.groq) keysToInsert.push({ user_id: userId, service_name: 'groq', key_value: apiKeys.groq });

      if (keysToInsert.length > 0) {
        const { error: keysError } = await tempSupabase.from('api_keys').insert(keysToInsert);
        if (keysError) throw keysError;
      }

      // 3. Save Supabase Config (in branding_configs table for now as it's the general config table)
      const { error: configError } = await tempSupabase.from('branding_configs').insert({
        user_id: userId,
        supabase_url: supabaseConfig.url,
        supabase_anon_key: supabaseConfig.anonKey,
        // Default branding if not provided
        primary_blue: '#004a8e',
        primary_gold: '#c5a059',
        description: 'Configuração inicial via Onboarding'
      });

      if (configError) throw configError;

      // Success!
      // We need to reload to ensure the default supabase client uses the new credentials
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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
            <p className="text-sm text-slate-400 mt-1">Configure seu ambiente em 3 passos simples</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            Cancelar
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
                step === i 
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                  : step > i 
                    ? 'border-emerald-500 text-emerald-500' 
                    : 'border-transparent text-slate-500'
              }`}
            >
              Passo {i}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400"
              >
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <User size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Informações Básicas</h3>
                  <p className="text-slate-400 text-sm mt-2">Como devemos chamar você?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="João da Silva"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">E-mail</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="joao@exemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <Key size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Chaves de API (IA)</h3>
                  <p className="text-slate-400 text-sm mt-2">Forneça pelo menos uma chave para gerar conteúdo. Você pode adicionar as outras depois.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Google Gemini API Key</label>
                    <input 
                      type="password" 
                      value={apiKeys.gemini}
                      onChange={(e) => setApiKeys({...apiKeys, gemini: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                      placeholder="AIzaSy..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">OpenAI API Key</label>
                    <input 
                      type="password" 
                      value={apiKeys.openai}
                      onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                      placeholder="sk-..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Anthropic Claude API Key</label>
                    <input 
                      type="password" 
                      value={apiKeys.claude}
                      onChange={(e) => setApiKeys({...apiKeys, claude: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                      placeholder="sk-ant-..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Groq API Key</label>
                    <input 
                      type="password" 
                      value={apiKeys.groq}
                      onChange={(e) => setApiKeys({...apiKeys, groq: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                      placeholder="gsk_..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <ShieldCheck size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Projeto Supabase</h3>
                  <p className="text-slate-400 text-sm mt-2">Configure as credenciais do seu projeto Supabase.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Supabase URL</label>
                    <input 
                      type="text" 
                      value={supabaseConfig.url}
                      onChange={(e) => setSupabaseConfig({...supabaseConfig, url: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                      placeholder="https://your-project.supabase.co"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Supabase Anon Key</label>
                    <input 
                      type="password" 
                      value={supabaseConfig.anonKey}
                      onChange={(e) => setSupabaseConfig({...supabaseConfig, anonKey: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <ChevronLeft size={18} /> Voltar
            </button>
          ) : (
            <div></div>
          )}
          
          <button 
            onClick={handleNextStep}
            disabled={loading}
            className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Processando...</>
            ) : step === 3 ? (
              <><CheckCircle2 size={18} /> Finalizar Cadastro</>
            ) : (
              <>Próximo <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
