/**
 * master_fix.cjs — Applies ALL multi-branding modifications to App.tsx safely.
 * Uses exact marker strings OUTSIDE template literals for all replacements.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

let changed = 0;

function replace(marker, replacement, description) {
    if (!content.includes(marker)) {
        console.error('❌ MARKER NOT FOUND:', description);
        console.error('   Expected:', JSON.stringify(marker.substring(0, 80)));
        return;
    }
    content = content.replace(marker, replacement);
    changed++;
    console.log('✅', description);
}

// ====================================================
// 1. Update BrandConfig interface + add BrandPreset
// ====================================================
replace(
    `interface BrandConfig {\r\n  primaryBlue: string;\r\n  primaryGold: string;\r\n  description: string;\r\n  pdfBase64?: string;\r\n  pdfName?: string;\r\n  systemPrompt?: string;\r\n}`,
    `interface BrandConfig {\r\n  id?: string;\r\n  name?: string;\r\n  primaryBlue: string;\r\n  primaryGold: string;\r\n  description: string;\r\n  fontFamily: string;\r\n  pdfBase64?: string;\r\n  pdfName?: string;\r\n  systemPrompt?: string;\r\n}\r\n\r\ninterface BrandPreset {\r\n  id: string;\r\n  user_id: string;\r\n  name: string;\r\n  primary_color: string;\r\n  secondary_color: string;\r\n  font_family: string;\r\n  is_active: boolean;\r\n}`,
    'Updated BrandConfig + added BrandPreset interface'
);

// ====================================================
// 2. Add fontFamily to initial brandConfig state
//    Marker: unique line just before description in useState<BrandConfig>
// ====================================================
replace(
    `    primaryGold: '#CA8A04',\r\n    description: '`,
    `    primaryGold: '#CA8A04',\r\n    fontFamily: 'Inter',\r\n    description: '`,
    'Added fontFamily to initial brandConfig state'
);

// ====================================================
// 3. Add brandPresets / activeBrandId / isExtractingColors states
//    Marker: the line just after the brandConfig useState block ends
// ====================================================
replace(
    `  const [apiKeys, setApiKeys] = useState<ApiKeys>({`,
    `  const [brandPresets, setBrandPresets] = React.useState<BrandPreset[]>([]);\r\n  const [activeBrandId, setActiveBrandId] = React.useState<string | null>(null);\r\n  const [isExtractingColors, setIsExtractingColors] = React.useState(false);\r\n\r\n  const [apiKeys, setApiKeys] = useState<ApiKeys>({`,
    'Added brandPresets / activeBrandId / isExtractingColors states'
);

// ====================================================
// 4. Update loadUserData to load from brand_presets with fallback
//    We replace the branding section inside loadUserData
// ====================================================
const loadBrandingOld = `      const { data: branding } = await supabase\r\n        .from('branding_configs')\r\n        .select('*')\r\n        .eq('user_id', session.user.id)\r\n        .single();\r\n\r\n      if (branding) {\r\n        setBrandConfig(prev => ({\r\n          ...prev,\r\n          primaryBlue: branding.primary_color || prev.primaryBlue,\r\n          primaryGold: branding.secondary_color || prev.primaryGold,\r\n          description: branding.description || prev.description,\r\n        }));\r\n      }`;

const loadBrandingNew = `      // Load brand presets (new) with fallback to legacy branding_configs
      let presetsLoaded = false;
      try {
        const { data: presets } = await supabase
          .from('brand_presets')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true });

        if (presets && presets.length > 0) {
          setBrandPresets(presets);
          const active = presets.find((p: BrandPreset) => p.is_active) || presets[0];
          setActiveBrandId(active.id);
          setBrandConfig(prev => ({
            ...prev,
            id: active.id,
            name: active.name,
            primaryBlue: active.primary_color || prev.primaryBlue,
            primaryGold: active.secondary_color || prev.primaryGold,
            fontFamily: active.font_family || 'Inter',
          }));
          presetsLoaded = true;
        }
      } catch (_) {}

      if (!presetsLoaded) {
        const { data: branding } = await supabase
          .from('branding_configs')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (branding) {
          setBrandConfig(prev => ({
            ...prev,
            primaryBlue: branding.primary_color || prev.primaryBlue,
            primaryGold: branding.secondary_color || prev.primaryGold,
            description: branding.description || prev.description,
            fontFamily: 'Inter',
          }));
        }
      }`;

if (content.includes(loadBrandingOld)) {
    content = content.replace(loadBrandingOld, loadBrandingNew);
    changed++;
    console.log('✅ Updated loadUserData to load brand_presets');
} else {
    console.warn('⚠️  loadUserData branding block not found — checking for alternative...');
    // Try to find a simpler marker
    const altMarker = `from('branding_configs')\r\n        .select('*')\r\n        .eq('user_id', session.user.id)\r\n        .single();`;
    if (content.includes(altMarker)) {
        console.warn('   Found branding_configs query. Manual review needed for loadUserData');
    }
}

// ====================================================
// 5. Replace saveBranding to update brand_presets
// ====================================================
const saveBrandingOld = `  const saveBranding = async () => {`;
// We insert the new CRUD functions before saveBranding
const crudFunctions = `  // ---- BRAND PRESET CRUD ----

  const createBrandPreset = async (name: string) => {
    if (!supabase || !session) return;
    try {
      // Deactivate existing
      await supabase.from('brand_presets').update({ is_active: false }).eq('user_id', session.user.id);
      const { data, error } = await supabase.from('brand_presets').insert({
        user_id: session.user.id,
        name,
        primary_color: '#1C1917',
        secondary_color: '#CA8A04',
        font_family: 'Inter',
        is_active: true,
      }).select().single();
      if (error) throw error;
      const newPreset: BrandPreset = data;
      setBrandPresets(prev => [...prev, newPreset]);
      setActiveBrandId(newPreset.id);
      setBrandConfig(prev => ({ ...prev, id: newPreset.id, name: newPreset.name, primaryBlue: newPreset.primary_color, primaryGold: newPreset.secondary_color, fontFamily: newPreset.font_family }));
    } catch (err: any) { alert('Erro ao criar preset: ' + err.message); }
  };

  const switchBrandPreset = async (presetId: string) => {
    const preset = brandPresets.find(p => p.id === presetId);
    if (!preset) return;
    setBrandPresets(prev => prev.map(p => ({ ...p, is_active: p.id === presetId })));
    setActiveBrandId(presetId);
    setBrandConfig(prev => ({ ...prev, id: preset.id, name: preset.name, primaryBlue: preset.primary_color, primaryGold: preset.secondary_color, fontFamily: preset.font_family }));
    if (supabase && session) {
      await supabase.from('brand_presets').update({ is_active: false }).eq('user_id', session.user.id);
      await supabase.from('brand_presets').update({ is_active: true }).eq('id', presetId);
    }
  };

  const deleteBrandPreset = async (presetId: string) => {
    if (!supabase || !session) return;
    if (brandPresets.length <= 1) { alert('Você precisa ter pelo menos um preset de branding.'); return; }
    try {
      const { error } = await supabase.from('brand_presets').delete().eq('id', presetId);
      if (error) throw error;
      const remaining = brandPresets.filter(p => p.id !== presetId);
      setBrandPresets(remaining);
      if (activeBrandId === presetId && remaining.length > 0) {
        await switchBrandPreset(remaining[0].id);
      }
    } catch (err: any) { alert('Erro ao excluir preset: ' + err.message); }
  };

  const extractColorsFromBranding = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !apiKeys.gemini) { alert('Configure a chave da API Gemini primeiro.'); return; }
    setIsExtractingColors(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(',')[1];
        const mimeType = file.type;
        const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKeys.gemini}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [
              { text: 'Você é um especialista em design de marca. Analise esta imagem/documento e extraia: 1) A cor primária principal (hex), 2) A cor de destaque/secundária (hex), 3) Nome da marca (se visível), 4) Família tipográfica sugerida (apenas: Inter, Roboto, Montserrat, Poppins, Outfit, Raleway, Lato, Open Sans, Nunito, Lexend, Playfair Display ou DM Sans). Responda APENAS em JSON: {"primary":"#hex","secondary":"#hex","name":"string ou null","fontFamily":"FontName"}' },
              { inlineData: { mimeType, data: base64 } }
            ]}],
          }),
        });
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const jsonMatch = text.match(/\\{[\\s\\S]*\\}/);
        if (jsonMatch) {
          const extracted = JSON.parse(jsonMatch[0]);
          setBrandConfig(prev => ({
            ...prev,
            primaryBlue: extracted.primary || prev.primaryBlue,
            primaryGold: extracted.secondary || prev.primaryGold,
            fontFamily: extracted.fontFamily || prev.fontFamily,
            name: extracted.name || prev.name,
            pdfName: file.name,
            pdfBase64: base64,
          }));
          if (extracted.name && window.confirm(\`Nome detectado: "\${extracted.name}". Renomear este preset?\`)) {
            setBrandConfig(prev => ({ ...prev, name: extracted.name }));
          }
        }
        setIsExtractingColors(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert('Erro ao extrair cores: ' + err.message);
      setIsExtractingColors(false);
    }
  };

`;

if (content.includes(saveBrandingOld)) {
    content = content.replace(saveBrandingOld, crudFunctions + saveBrandingOld);
    changed++;
    console.log('✅ Inserted CRUD functions before saveBranding');
} else {
    console.error('❌ saveBranding not found');
}

// ====================================================
// 6. Fix saveBranding to upsert into brand_presets
// ====================================================
const saveBrandingBodyOld = `    if (!supabase) { alert('Configure o Supabase primeiro.'); return; }\r\n    setLoading(true);\r\n    try {\r\n      const { error } = await supabase\r\n        .from('branding_configs')\r\n        .upsert({\r\n          user_id: session?.user?.id,\r\n          primary_color: brandConfig.primaryBlue,\r\n          secondary_color: brandConfig.primaryGold,\r\n          description: brandConfig.description,\r\n          pdf_base64: brandConfig.pdfBase64 || null,\r\n          pdf_name: brandConfig.pdfName || null,\r\n        }, { onConflict: 'user_id' });\r\n      if (error) throw error;\r\n      alert('Branding salvo com sucesso!');\r\n    } catch (err: any) {\r\n      alert('Erro ao salvar branding: ' + err.message);\r\n    } finally {\r\n      setLoading(false);\r\n    }`;

const saveBrandingBodyNew = `    if (!supabase || !activeBrandId) { alert('Selecione ou crie um preset de branding primeiro.'); return; }\r\n    setLoading(true);\r\n    try {\r\n      const { error } = await supabase\r\n        .from('brand_presets')\r\n        .update({\r\n          name: brandConfig.name || 'Sem nome',\r\n          primary_color: brandConfig.primaryBlue,\r\n          secondary_color: brandConfig.primaryGold,\r\n          font_family: brandConfig.fontFamily || 'Inter',\r\n        })\r\n        .eq('id', activeBrandId);\r\n      if (error) throw error;\r\n      setBrandPresets(prev => prev.map(p => p.id === activeBrandId ? { ...p, name: brandConfig.name || p.name, primary_color: brandConfig.primaryBlue, secondary_color: brandConfig.primaryGold, font_family: brandConfig.fontFamily || 'Inter' } : p));\r\n      alert('Preset de branding salvo com sucesso!');\r\n    } catch (err: any) {\r\n      alert('Erro ao salvar branding: ' + err.message);\r\n    } finally {\r\n      setLoading(false);\r\n    }`;

if (content.includes(saveBrandingBodyOld)) {
    content = content.replace(saveBrandingBodyOld, saveBrandingBodyNew);
    changed++;
    console.log('✅ Updated saveBranding to use brand_presets');
} else {
    console.warn('⚠️  saveBranding body not found — may already be updated');
}

// ====================================================
// 7. Write the file
// ====================================================
fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 Done! Applied ${changed} changes to App.tsx`);
