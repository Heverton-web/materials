import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace Chunk 1
content = content.replace(
    `interface BrandConfig {
  primaryBlue: string;
  primaryGold: string;
  description: string;
  pdfBase64?: string;
  pdfName?: string;
  systemPrompt?: string;
}`,
    `interface BrandConfig {
  id?: string;
  name?: string;
  primaryBlue: string;
  primaryGold: string;
  fontFamily: string;
  description: string;
  pdfBase64?: string;
  pdfName?: string;
  systemPrompt?: string;
}

interface BrandPreset {
  id: string;
  user_id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  is_active: boolean;
  created_at: string;
}`.replace(/\n/g, '\r\n')
);

// Replace Chunk 2
content = content.replace(
    `  const [brandConfig, setBrandConfig] = useState<BrandConfig>({
    primaryBlue: '#1C1917',
    primaryGold: '#CA8A04',
    description: 'Plataforma multisetorial de geração de materiais de elite.',`,
    `  const [brandConfig, setBrandConfig] = useState<BrandConfig>({
    primaryBlue: '#1C1917',
    primaryGold: '#CA8A04',
    fontFamily: 'Inter',
    description: 'Plataforma multisetorial de geração de materiais de elite.',`.replace(/\n/g, '\r\n')
);

// Replace Chunk 3
content = content.replace(
    `  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    gemini: '',
    openai: '',
    claude: '',
    groq: ''
  });`,
    `  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    gemini: '',
    openai: '',
    claude: '',
    groq: ''
  });

  const [brandPresets, setBrandPresets] = useState<BrandPreset[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [renamingPreset, setRenamingPreset] = useState<string | null>(null);`.replace(/\n/g, '\r\n')
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx Updated!');
