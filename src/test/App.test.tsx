import { render, screen, act, fireEvent } from '@testing-library/react';
import { expect, it, describe, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock do Supabase
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
                signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: { id: '123' } }, error: null })),
                signOut: vi.fn(() => Promise.resolve({ error: null })),
            },
            from: vi.fn(() => chain),
        }
    };
});

// Mock do Google GenAI
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: vi.fn().mockImplementation(() => ({
            getGenerativeModel: vi.fn().mockReturnValue({
                generateContent: vi.fn().mockResolvedValue({
                    response: { text: () => 'Conteúdo mockado' }
                })
            })
        }))
    };
});

describe('App Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial view correctly (Infra & Tema)', async () => {
        await act(async () => {
            render(<App />);
        });

        const titleElement = await screen.findByText(/Chaves Aura/i);
        expect(titleElement).toBeInTheDocument();
    });

    it('navigates to Materials tab and shows empty state', async () => {
        await act(async () => {
            render(<App />);
        });

        // Clicar na aba Materiais
        const materialsTab = screen.getByRole('button', { name: /Materiais/i });
        await act(async () => {
            fireEvent.click(materialsTab);
        });

        const emptyStateTitle = await screen.findByText(/Vácuo de Registros Aura/i);
        expect(emptyStateTitle).toBeInTheDocument();
        
        const repoTitle = screen.getByText(/Repositório Aura/i);
        expect(repoTitle).toBeInTheDocument();
    });

    it('authenticates user correctly through the login modal', async () => {
        const { supabase } = await import('../lib/supabase');
        
        await act(async () => {
            render(<App />);
        });

        // Abrir modal de login
        const loginButton = screen.getByRole('button', { name: /Entrar/i });
        await act(async () => {
            fireEvent.click(loginButton);
        });

        // Preencher formulário
        const emailInput = screen.getByPlaceholderText(/IDENTIFICADOR_USUÁRIO/i);
        const passwordInput = screen.getByPlaceholderText(/CHAVE_DE_ACESSO/i);
        const submitButton = screen.getByRole('button', { name: /INICIAR_SESSÃO_AURA/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        // Verificar se chamou o Supabase
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });
    });
});
