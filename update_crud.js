import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. UPDATE loadUserData to fetch brand_presets
const originalLoadUserData = `      // Load Branding
      const { data: branding, error: bError } = await supabase
        .from('branding_configs')
        .select('*')
        .single();

      if (branding && !bError) {
        setBrandConfig({
          primaryBlue: branding.primary_blue,
          primaryGold: branding.primary_gold,
          description: branding.description,
          pdfName: branding.pdf_name,
          systemPrompt: branding.system_prompt || brandConfig.systemPrompt
        });

        setSupabaseConfig({
          url: branding.supabase_url || '',
          anonKey: branding.supabase_anon_key || ''
        });
      }`;

const newLoadUserData = `      // Load Branding Presets
      const { data: presets, error: presetsError } = await supabase
        .from('brand_presets')
        .select('*')
        .order('created_at', { ascending: false });

      if (presets && presets.length > 0) {
        setBrandPresets(presets);
        const activePreset = presets.find((p: any) => p.is_active) || presets[0];
        setActiveBrandId(activePreset.id);
        setBrandConfig(prev => ({
          ...prev,
          id: activePreset.id,
          name: activePreset.name,
          primaryBlue: activePreset.primary_color,
          primaryGold: activePreset.secondary_color,
          fontFamily: activePreset.font_family || 'Inter'
        }));
      }

      // Load Legacy Branding Configs
      const { data: branding, error: bError } = await supabase
        .from('branding_configs')
        .select('*')
        .single();

      if (branding && !bError) {
        setBrandConfig(prev => ({
          ...prev,
          description: branding.description || prev.description,
          pdfName: branding.pdf_name,
          systemPrompt: branding.system_prompt || prev.systemPrompt,
          // Fallback if no presets exist
          ...(presets?.length ? {} : {
            primaryBlue: branding.primary_blue,
            primaryGold: branding.primary_gold
          })
        }));

        setSupabaseConfig({
          url: branding.supabase_url || '',
          anonKey: branding.supabase_anon_key || ''
        });
      }`;

content = content.replace(originalLoadUserData, newLoadUserData);
content = content.replace(originalLoadUserData.replace(/\n/g, '\r\n'), newLoadUserData.replace(/\n/g, '\r\n'));

// 2. UPDATE saveBranding and inject CRUD functions
const originalSaveBranding = `  const saveBranding = async () => {
    if (!session) return alert('Você precisa estar logado para salvar.');
    setLoading(true);
    setLoadingMsg('Salvando branding no Supabase...');

    try {
      const { error } = await supabase
        .from('branding_configs')
        .upsert({
          user_id: session.user.id,
          primary_blue: brandConfig.primaryBlue,
          primary_gold: brandConfig.primaryGold,
          description: brandConfig.description,
          pdf_name: brandConfig.pdfName,
          systemPrompt: brandConfig.systemPrompt
        }, { onConflict: 'user_id' });

      if (error) throw error;
      alert('Branding salvo com sucesso!');
    } catch (error: any) {
      alert(\`Erro ao salvar branding: \${error.message}\`);
    } finally {
      setLoading(false);
    }
  };`;

// Note: system_prompt has typo systemPrompt in the catch string
const regexSaveBranding = /const saveBranding = async \(\) => \{[\s\S]*?setLoading\(false\);\s*\}\s*\};/;

const newSaveBrandingAndCRUD = `  const saveBranding = async () => {
    if (!session) return alert('Você precisa estar logado para salvar.');
    setLoading(true);
    setLoadingMsg('Salvando branding...');

    try {
      if (activeBrandId) {
        const { error } = await supabase
          .from('brand_presets')
          .update({
            name: brandConfig.name || 'Meu Branding',
            primary_color: brandConfig.primaryBlue,
            secondary_color: brandConfig.primaryGold,
            font_family: brandConfig.fontFamily
          })
          .eq('id', activeBrandId);

        if (error) throw error;

        setBrandPresets(prev => prev.map(p => 
          p.id === activeBrandId 
            ? { ...p, name: brandConfig.name || '', primary_color: brandConfig.primaryBlue, secondary_color: brandConfig.primaryGold, font_family: brandConfig.fontFamily } 
            : p
        ));
      }

      const { error } = await supabase
        .from('branding_configs')
        .upsert({
          user_id: session.user.id,
          primary_blue: brandConfig.primaryBlue,
          primary_gold: brandConfig.primaryGold,
          description: brandConfig.description,
          pdf_name: brandConfig.pdfName,
          system_prompt: brandConfig.systemPrompt
        }, { onConflict: 'user_id' });

      if (error) throw error;
      alert('Branding salvo com sucesso!');
    } catch (error: any) {
      alert(\`Erro ao salvar branding: \${error.message}\`);
    } finally {
      setLoading(false);
    }
  };

  const createBrandPreset = async (name: string) => {
    if (!session) return;
    setLoading(true);
    try {
      if (activeBrandId) {
        await supabase.from('brand_presets').update({ is_active: false }).eq('user_id', session.user.id);
      }
      
      const { data, error } = await supabase
        .from('brand_presets')
        .insert({
          user_id: session.user.id,
          name: name,
          primary_color: '#004a8e',
          secondary_color: '#b38e5d',
          font_family: 'Inter',
          is_active: true
        })
        .select()
        .single();
        
      if (error) throw error;
      if (data) {
        setBrandPresets(prev => prev.map(p => ({ ...p, is_active: false })).concat(data));
        setActiveBrandId(data.id);
        setBrandConfig(prev => ({
          ...prev,
          id: data.id,
          name: data.name,
          primaryBlue: data.primary_color,
          primaryGold: data.secondary_color,
          fontFamily: data.font_family
        }));
      }
    } catch (err: any) {
      alert('Erro ao criar preset: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchBrandPreset = async (presetId: string) => {
    if (!session) return;
    const preset = brandPresets.find(p => p.id === presetId);
    if (!preset) return;
    
    setLoading(true);
    try {
      await supabase.from('brand_presets').update({ is_active: false }).eq('user_id', session.user.id);
      await supabase.from('brand_presets').update({ is_active: true }).eq('id', presetId);
      
      setBrandPresets(prev => prev.map(p => ({ ...p, is_active: p.id === presetId })));
      setActiveBrandId(presetId);
      setBrandConfig(prev => ({
        ...prev,
        id: preset.id,
        name: preset.name,
        primaryBlue: preset.primary_color,
        primaryGold: preset.secondary_color,
        fontFamily: preset.font_family
      }));
    } catch (err: any) {
      alert('Erro ao trocar preset: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBrandPreset = async (presetId: string) => {
    if (!session || brandPresets.length <= 1) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('brand_presets').delete().eq('id', presetId);
      if (error) throw error;
      
      const newPresets = brandPresets.filter(p => p.id !== presetId);
      setBrandPresets(newPresets);
      
      if (presetId === activeBrandId) {
        await switchBrandPreset(newPresets[0].id);
      }
    } catch (err: any) {
      alert('Erro ao deletar preset: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractColorsFromBranding = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !apiKeys.gemini) return;

    setIsExtractingColors(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        
        const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKeys.gemini}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Analise esta imagem/documento de guia de marca. Extraia a cor Primária, Secundária (em HEX), sugira um nome curto para o branding baseado no logo/texto, e escolha uma fonte do Google Fonts que seja visualmente idêntica à apresentada (ex: Inter, Roboto). Responda EXATAMENTE e APENAS no formato JSON: {\\"name\\": \\"Nome da Marca\\", \\"primary\\": \\"#HEXPRIM\\", \\"secondary\\": \\"#HEXSEC\\", \\"fontFamily\\": \\"Inter\\"}" },
                { inline_data: { mime_type: file.type, data: base64data } }
              ]
            }]
          })
        });

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
          try {
            const cleanJson = textResponse.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
            const extracted = JSON.parse(cleanJson);
            
            setBrandConfig(prev => ({
              ...prev,
              name: extracted.name || prev.name,
              primaryBlue: extracted.primary || prev.primaryBlue,
              primaryGold: extracted.secondary || prev.primaryGold,
              fontFamily: extracted.fontFamily || prev.fontFamily,
              pdfName: file.name
            }));
            
            if (activeBrandId) {
              setBrandPresets(prev => prev.map(p => 
                p.id === activeBrandId 
                  ? { ...p, name: extracted.name || p.name, primary_color: extracted.primary || p.primary_color, secondary_color: extracted.secondary || p.secondary_color, font_family: extracted.fontFamily || p.font_family } 
                  : p
              ));
            }

            alert('Branding analisado com sucesso e cores extraídas!');
          } catch (e) {
            console.error(e);
            alert('Falha ao processar a resposta da IA.');
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(\`Erro ao extrair cores: \${err.message}\`);
    } finally {
      setIsExtractingColors(false);
    }
  };`;

content = content.replace(regexSaveBranding, newSaveBrandingAndCRUD);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx CRUD Updated!');
