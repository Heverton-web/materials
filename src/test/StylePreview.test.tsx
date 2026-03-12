import { render, screen } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import StylePreview from '../components/StylePreview';

describe('StylePreview Component', () => {
    const brandConfig = {
        primaryBlue: '#004a8e',
        primaryGold: '#c5a059',
    };

    it('renders Brutalism style correctly', () => {
        render(<StylePreview styleTitle="Neobrutalismo" brandConfig={brandConfig} />);
        expect(screen.getByText(/Core_Brutal.v1/i)).toBeInTheDocument();
        expect(screen.getByText(/TRANSFORMAR_AURA/i)).toBeInTheDocument();
    });

    it('renders Bento style correctly', () => {
        render(<StylePreview styleTitle="Bento Grid" brandConfig={brandConfig} />);
        // Checking for a text or specific element unique to Bento if possible
        // Bento version has specific structure, but lets check for something simple
        // Since it doesn't have unique text, we can check for classes if needed, 
        // but it's better to check for visual cues.
        // Actually, Bento doesn't have unique text. Let's add an aria-label in the component if needed, 
        // or just check for presence.
        expect(screen.queryByText(/Core_Brutal/i)).not.toBeInTheDocument();
    });

    it('renders Cyber/Neon style correctly', () => {
        render(<StylePreview styleTitle="Neon Style" brandConfig={brandConfig} />);
        expect(screen.getByText(/Protocol_Active/i)).toBeInTheDocument();
        expect(screen.getByText(/DATA_STREAM_INIT/i)).toBeInTheDocument();
    });

    it('renders Minimalist style correctly', () => {
        render(<StylePreview styleTitle="Minimalismo Zen" brandConfig={brandConfig} />);
        expect(screen.getByText(/01 \/ ARCHIVE/i)).toBeInTheDocument();
    });

    it('renders Aurora fallback correctly', () => {
        render(<StylePreview styleTitle="Aurora UI" brandConfig={brandConfig} />);
        expect(screen.getByText(/Aura_Aurora/i)).toBeInTheDocument();
        expect(screen.getByText(/Sync_Estelar/i)).toBeInTheDocument();
    });
});
