'use client';

import { useState } from 'react';
import { login } from './actions';

export default function LoginForm() {
    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        const result = await login(null, formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Acesso Administrativo</h1>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <input
                    type="password"
                    name="password"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Digite a senha de acesso"
                />
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
                Entrar
            </button>
        </form>
    );
}
