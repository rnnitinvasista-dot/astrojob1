import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from 'firebase/auth';
import { auth } from '../../firebase';
import { Loader2, Moon, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
    onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
    const [email, setEmail] = useState(() => localStorage.getItem('remember_email') || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    // Zodiac sign glyphs helpers
    const topGlyphs = [
        { char: '♈', label: 'Aries' },
        { char: '♌', label: 'Leo' },
        { char: '♎', label: 'Libra' },
        { char: '♒', label: 'Aquarius' },
        { char: '♓', label: 'Pisces' },
        { char: '♏', label: 'Scorpio' }
    ];

    const bottomGlyphs = [
        { char: '♈', name: 'ARIES' },
        { char: '♉', name: 'TAURUS' },
        { char: '♊', name: 'GEMINI' },
        { char: '♋', name: 'CANCER' }
    ];

    return (
        <div className="login-split-container">
            {/* Left starry banner (Desktop only) */}
            <div className="login-left-panel">
                {/* Brand Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1 }}>
                    <Moon size={22} style={{ color: '#d4af37', transform: 'rotate(-25deg)' }} />
                    <span style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        color: '#ffffff'
                    }}>
                        JYOTISH
                    </span>
                </div>

                {/* Content & Top Glyphs */}
                <div style={{ zIndex: 1, marginTop: '2rem' }}>
                    {/* Top Glyphs Row */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
                        {topGlyphs.map((glyph, index) => (
                            <div
                                key={index}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.1rem',
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }}
                            >
                                {glyph.char}
                            </div>
                        ))}
                    </div>

                    {/* Slogan Title */}
                    <h2 style={{
                        fontFamily: "'Cinzel', 'Playfair Display', serif, Georgia",
                        fontSize: '2.8rem',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        letterSpacing: '0.02em',
                        color: '#ffffff',
                        marginBottom: '1.5rem'
                    }}>
                        THE COSMOS <br />
                        AWAIT YOUR <br />
                        RETURN
                    </h2>

                    {/* Slogan Description */}
                    <p style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        color: 'rgba(255, 255, 255, 0.65)',
                        maxWidth: '380px',
                        fontWeight: 400
                    }}>
                        Your natal chart, daily transits, and celestial guidance — all in one place, waiting for you.
                    </p>
                </div>

                {/* Bottom Glyph labels */}
                <div style={{ display: 'flex', gap: '1.5rem', zIndex: 1 }}>
                    {bottomGlyphs.map((glyph, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                color: '#ffffff'
                            }}>
                                {glyph.char}
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.05em' }}>
                                {glyph.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Form Card Panel */}
            <div className="login-right-panel">
                {/* Back link */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {onBack && (
                        <span
                            onClick={onBack}
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                            ← BACK TO JYOTISH
                        </span>
                    )}
                </div>

                {/* Center Form Section */}
                <div style={{ maxWidth: '400px', width: '100%', margin: 'auto' }}>
                    <div style={{ marginBottom: '2.25rem' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            color: 'var(--primary)',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '0.5rem'
                        }}>
                            SIGN IN
                        </span>
                        <h2 style={{
                            fontFamily: "'Cinzel', 'Playfair Display', serif",
                            fontSize: '2rem',
                            fontWeight: 600,
                            color: 'var(--secondary)',
                            margin: '0 0 0.5rem',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase'
                        }}>
                            WELCOME BACK
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
                            Continue your celestial journey
                        </p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                color: 'var(--secondary)',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em'
                            }}>
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(32, 22, 58, 0.15)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    background: 'white',
                                    color: 'var(--text)',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(32, 22, 58, 0.15)'}
                                required
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{
                                    color: 'var(--secondary)',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em'
                                }}>
                                    PASSWORD
                                </label>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    color: 'var(--primary)',
                                    cursor: 'pointer'
                                }}>
                                    FORGOT PASSWORD?
                                </span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 2.8rem 0.8rem 1rem',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(32, 22, 58, 0.15)',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        background: 'white',
                                        color: 'var(--text)',
                                        fontFamily: 'inherit',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(32, 22, 58, 0.15)'}
                                    required
                                />
                                <div
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        display: 'flex'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '-0.25rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                fontWeight: 500,
                                userSelect: 'none'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    style={{
                                        accentColor: 'var(--primary)',
                                        width: '16px',
                                        height: '16px',
                                        cursor: 'pointer'
                                    }}
                                />
                                Remember me
                            </label>
                        </div>

                        {error && (
                            <div style={{
                                padding: '0.75rem',
                                background: '#fef2f2',
                                border: '1px solid #fee2e2',
                                borderRadius: '4px',
                                color: '#b91c1c',
                                fontSize: '0.85rem',
                                textAlign: 'center',
                                fontWeight: 500
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.9rem',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 14px rgba(124, 92, 183, 0.2)',
                                textTransform: 'uppercase'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) e.currentTarget.style.boxShadow = '0 6px 18px rgba(124, 92, 183, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 92, 183, 0.2)';
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'ENTER THE COSMOS'}
                        </button>
                    </form>
                </div>

                {/* Footer spacer */}
                <div style={{ height: '20px' }} />
            </div>
        </div>
    );
};

export default LoginPage;
