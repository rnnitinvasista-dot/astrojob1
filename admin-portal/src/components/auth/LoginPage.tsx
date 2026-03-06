import React, { useState } from 'react';
import {
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../../firebase';
import { Lock, Mail, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: '#f8fafc',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'white',
                padding: '2.5rem',
                borderRadius: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        background: '#3b82f6',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.4)'
                    }}>
                        <Lock size={32} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e3a8a', margin: 0 }}>Admin Portal</h2>
                    <p style={{ color: '#64748b', marginTop: '0.75rem', fontSize: '1rem' }}>Enter credentials to manage users</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#1e3a8a', fontWeight: 600, fontSize: '0.875rem', marginBottom: '8px' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 3rem',
                                    borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#1e3a8a', fontWeight: 600, fontSize: '0.875rem', marginBottom: '8px' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 3rem',
                                    borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.875rem',
                            background: '#fff1f2',
                            border: '1px solid #ffe4e6',
                            borderRadius: '12px',
                            color: '#e11d48',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            fontWeight: 500
                        }}>
                            {error}
                        </div>
                    )}


                    {/* Master Admin Initialization & Recovery */}
                    {email.toLowerCase() === 'astroadmin09@gmail.com' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={async () => {
                                    setLoading(true);
                                    setError(null);
                                    try {
                                        const { createUserWithEmailAndPassword } = await import('firebase/auth');
                                        const { setDoc, doc } = await import('firebase/firestore');
                                        const { db } = await import('../../firebase');

                                        // 1. Try to create Auth account
                                        let userCredential;
                                        try {
                                            userCredential = await createUserWithEmailAndPassword(auth, email, password);
                                        } catch (authErr: any) {
                                            if (authErr.code === 'auth/email-already-in-use') {
                                                console.log("Auth account exists, checking database...");
                                                // If already exists, we use the current user or just let them login
                                            } else {
                                                throw authErr;
                                            }
                                        }

                                        // 2. Ensure Firestore Document exists
                                        // If we created a user, we have the UID. If not, we might need to login first.
                                        // But for master recovery, we can just attempt to set the doc if we have a UID.
                                        const currentUid = auth.currentUser?.uid || userCredential?.user.uid;
                                        if (currentUid) {
                                            await setDoc(doc(db, 'users', currentUid), {
                                                email: email.toLowerCase(),
                                                role: 'admin',
                                                expiryDate: new Date('2099-12-31').toISOString(),
                                                createdAt: new Date().toISOString()
                                            });
                                            alert("Admin account and database record initialized!");
                                        } else {
                                            alert("Auth account exists. Please login first, then click this button again if you still see Access Denied.");
                                        }
                                    } catch (err: any) {
                                        setError(err.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                style={{
                                    background: '#10b981',
                                    color: 'white',
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                Initialize/Fix Master Admin
                            </button>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            background: '#1d4ed8',
                            color: 'white',
                            border: 'none',
                            padding: '0.875rem',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : 'Login to Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
