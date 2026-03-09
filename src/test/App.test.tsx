import { render, screen, act } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import App from '../App';

// Mock simplificado e direto
vi.mock('../lib/supabase', () => {
    const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        match: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
        then: vi.fn((resolve) => resolve({ data: [], error: null })),
    };

    return {
        supabase: {
            auth: {
                onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
                getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
            },
            from: vi.fn(() => chain),
        }
    };
});

describe('App Component', () => {
    it('renders Aura repository title correctly', async () => {
        await act(async () => {
            render(<App />);
        });

        // Debug para ver o HTML gerado se falhar
        // screen.debug();

        const titleElement = await screen.findByText(/REPOSITÓRIO AURA/i);
        expect(titleElement).toBeInTheDocument();
    });

    it('shows empty state message when no materials are present', async () => {
        await act(async () => {
            render(<App />);
        });

        const emptyStateElement = await screen.findByText(/VÁCUO DE REGISTROS AURA/i);
        expect(emptyStateElement).toBeInTheDocument();
    });
});
