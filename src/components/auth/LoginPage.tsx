import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from 'firebase/auth';
import { auth } from '../../firebase';
import { Lock, Mail, Loader2, CheckSquare, Square } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState(() => localStorage.getItem('remember_email') || '');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (rememberMe) {
                localStorage.setItem('remember_email', email);
            } else {
                localStorage.removeItem('remember_email');
            }
            // Set persistence based on "Remember Me"
            await setPersistence(
                auth,
                rememberMe ? browserLocalPersistence : browserSessionPersistence
            );
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="parchment-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="parchment-card" style={{ width: '100%', maxWidth: '400px', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--primary)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.3)',
                        border: '2px solid #000000'
                    }}>
                        <img src="/app_logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text)', margin: 0, textTransform: 'uppercase' }}>Welcome Back</h2>
                    <p style={{ color: '#000000', marginTop: '0.5rem', fontWeight: 600 }}>Please enter your credentials to login</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#000000', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.8rem',
                                    borderRadius: '0',
                                    border: '3px solid #000000',
                                    fontSize: '1rem',
                                    transition: 'background 0.2s',
                                    outline: 'none',
                                    background: 'white'
                                }}
                                onFocus={(e) => e.target.style.background = 'var(--secondary-light)'}
                                onBlur={(e) => e.target.style.background = 'white'}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#000000', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.8rem',
                                    borderRadius: '0',
                                    border: '3px solid #000000',
                                    fontSize: '1rem',
                                    transition: 'background 0.2s',
                                    outline: 'none',
                                    background: 'white'
                                }}
                                onFocus={(e) => e.target.style.background = 'var(--secondary-light)'}
                                onBlur={(e) => e.target.style.background = 'white'}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-0.5rem' }}>
                        <label
                            onClick={() => setRememberMe(!rememberMe)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#000000',
                                fontWeight: 800,
                                userSelect: 'none'
                            }}
                        >
                            {rememberMe ? (
                                <CheckSquare size={18} color="var(--primary)" />
                            ) : (
                                <Square size={18} color="#94a3b8" />
                            )}
                            Remember Me
                        </label>
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            background: '#fef2f2',
                            border: '1px solid #fee2e2',
                            borderRadius: '8px',
                            color: '#b91c1c',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="scroll-button"
                        style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: 'var(--primary)',
                            color: 'var(--text)',
                            borderColor: '#000000',
                            width: '100%'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login to Continue'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default LoginPage;
