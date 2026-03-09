/**
 * master_fix_2.cjs — Applies remaining multi-branding modifications to App.tsx safely.
 * This phase fixes loadUserData and saveBranding with correct markers.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

let changed = 0;

function replace(marker, replacement, description) {
    if (!content.includes(marker)) {
        console.error('❌ MARKER NOT FOUND:', description);
        // Show neighboring context
        const lines = content.split('\n');
        console.error('   Showing first 5 lines of the section to debug:');
        const shortMark = marker.substring(0, 30);
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(shortMark.trim())) {
                for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 5); j++) {
                    console.error(`   L${j + 1}: ${JSON.stringify(lines[j])}`);
                }
                break;
            }
        }
        return;
    }
    content = content.replace(marker, replacement);
    changed++;
    console.log('✅', description);
}

// ====================================================
// Fix loadUserData — Replace branding_configs section with brand_presets
// ====================================================
const loadOld = `      // Load Branding\r\n      const { data: branding, error: bError } = await supabase\r\n        .from('branding_configs')\r\n        .select('*')\r\n        .single();\r\n\r\n      if (branding && !bError) {\r\n        setBrandConfig({\r\n          primaryBlue: branding.primary_blue,\r\n          primaryGold: branding.primary_gold,\r\n          description: branding.description,\r\n          pdfName: branding.pdf_name,\r\n          systemPrompt: branding.system_prompt || brandConfig.systemPrompt\r\n        });\r\n\r\n        setSupabaseConfig({\r\n          url: branding.supabase_url || '',\r\n          anonKey: branding.supabase_anon_key || ''\r\n        });\r\n      }`;

const loadNew = `      // Load Brand Presets (new system)
      let presetsLoaded = false;
      try {
        const { data: presets } = await supabase
          .from('brand_presets')
          .select('*')
          .order('created_at', { ascending: true });

        if (presets && presets.length > 0) {
          setBrandPresets(presets as BrandPreset[]);
          const active = (presets as BrandPreset[]).find(p => p.is_active) || (presets as BrandPreset[])[0];
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

      // Fallback: Load legacy branding_configs
      if (!presetsLoaded) {
        const { data: branding, error: bError } = await supabase
          .from('branding_configs')
          .select('*')
          .single();

        if (branding && !bError) {
          setBrandConfig(prev => ({
            ...prev,
            primaryBlue: branding.primary_blue || prev.primaryBlue,
            primaryGold: branding.primary_gold || prev.primaryGold,
            description: branding.description || prev.description,
            pdfName: branding.pdf_name,
            systemPrompt: branding.system_prompt || prev.systemPrompt,
            fontFamily: 'Inter',
          }));

          setSupabaseConfig({
            url: branding.supabase_url || '',
            anonKey: branding.supabase_anon_key || ''
          });
        }
      }`;

replace(loadOld, loadNew, 'Updated loadUserData to load brand_presets with fallback');

// ====================================================
// Fix saveBranding — Update to use brand_presets
// ====================================================
const saveBrandBodyOld = `    if (!session) return alert('Você precisa estar logado para salvar.');\r\n    setLoading(true);\r\n    setLoadingMsg('Salvando branding no Supabase...');\r\n\r\n    try {\r\n      const { error } = await supabase\r\n        .from('branding_configs')\r\n        .upsert({\r\n          user_id: session.user.id,\r\n          primary_blue: brandConfig.primaryBlue,\r\n          primary_gold: brandConfig.primaryGold,\r\n          description: brandConfig.description,\r\n          pdf_name: brandConfig.pdfName,\r\n          system_prompt: brandConfig.systemPrompt\r\n        });\r\n\r\n      if (error) throw error;\r\n      alert('Branding salvo com sucesso!');\r\n    } catch (error: any) {\r\n      alert(\`Erro ao salvar branding: \${error.message}\`);\r\n    } finally {\r\n      setLoading(false);\r\n    }`;

const saveBrandBodyNew = `    if (!session || !activeBrandId) { alert('Selecione ou crie um preset de branding primeiro.'); return; }\r\n    setLoading(true);\r\n    setLoadingMsg('Salvando branding no Supabase...');\r\n\r\n    try {\r\n      const { error } = await supabase\r\n        .from('brand_presets')\r\n        .update({\r\n          name: brandConfig.name || 'Meu Branding',\r\n          primary_color: brandConfig.primaryBlue,\r\n          secondary_color: brandConfig.primaryGold,\r\n          font_family: brandConfig.fontFamily || 'Inter',\r\n        })\r\n        .eq('id', activeBrandId);\r\n\r\n      if (error) throw error;\r\n      setBrandPresets(prev => prev.map(p => p.id === activeBrandId\r\n        ? { ...p, name: brandConfig.name || p.name, primary_color: brandConfig.primaryBlue, secondary_color: brandConfig.primaryGold, font_family: brandConfig.fontFamily || 'Inter' }\r\n        : p\r\n      ));\r\n      alert('Preset de branding salvo com sucesso!');\r\n    } catch (error: any) {\r\n      alert(\`Erro ao salvar branding: \${error.message}\`);\r\n    } finally {\r\n      setLoading(false);\r\n    }`;

replace(saveBrandBodyOld, saveBrandBodyNew, 'Updated saveBranding to use brand_presets');

// ====================================================
// Write result
// ====================================================
fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 Done! Applied ${changed}/2 phase-2 changes to App.tsx`);
