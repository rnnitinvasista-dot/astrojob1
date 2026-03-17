import React, { useEffect, useState } from 'react';
import {
    collection,
    query,
    onSnapshot,
    updateDoc,
    doc,
    setDoc
} from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut as authSignOut } from 'firebase/auth';
import { db, firebaseConfig } from '../../firebase';
import { User as UserIcon, Search, LogOut, Calendar, UserPlus, ArrowLeft, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserData {
    uid: string;
    email: string;
    role: 'user' | 'admin';
    expiryDate: string;
    createdAt?: string;
    hasKPAccess?: boolean;
    hasPowerPositionAccess?: boolean;
    hasAnalysisAccess?: boolean;
    hasAdvancePredictionsAccess?: boolean;
}

interface AdminPortalProps {
    onBack: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onBack }) => {
    const { logout } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData: UserData[] = [];
            snapshot.forEach((doc) => {
                usersData.push({ uid: doc.id, ...doc.data() } as UserData);
            });
            setUsers(usersData);
            setLoading(false);
        }, (err) => {
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserEmail || !newUserPassword) return;

        setIsAdding(true);
        try {
            // Use a secondary Firebase app to create the user without signing out the admin
            const secondaryApp = getApps().find(app => app.name === 'Secondary') || initializeApp(firebaseConfig, 'Secondary');
            const secondaryAuth = getAuth(secondaryApp);
            
            // 1. Create the Auth User
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUserEmail, newUserPassword);
            const uid = userCredential.user.uid;

            // 2. Create the Firestore Document
            const userRef = doc(db, 'users', uid);
            const defaultExpiry = new Date();
            defaultExpiry.setMonth(defaultExpiry.getMonth() + 1);

            await setDoc(userRef, {
                email: newUserEmail.toLowerCase(),
                role: 'user',
                expiryDate: defaultExpiry.toISOString(),
                createdAt: new Date().toISOString()
            });

            // 3. Sign out from secondary app to keep it clean
            await authSignOut(secondaryAuth);

            setNewUserEmail('');
            setNewUserPassword('');
            alert("User created successfully!");
        } catch (err: any) {
            console.error("Add user failed", err);
            alert("Error adding user: " + (err.message || "Unknown error"));
        } finally {
            setIsAdding(false);
        }
    };

    const updateExpiry = async (uid: string, months: number) => {
        const newExpiry = new Date();
        newExpiry.setMonth(newExpiry.getMonth() + months);
        setExpiry(uid, newExpiry.toISOString());
    };

    const setExpiry = async (uid: string, isoString: string) => {
        const userRef = doc(db, 'users', uid);
        try {
            await updateDoc(userRef, {
                expiryDate: isoString
            });
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const toggleAdmin = async (uid: string, currentRole: string) => {
        const userRef = doc(db, 'users', uid);
        try {
            await updateDoc(userRef, {
                role: currentRole === 'admin' ? 'user' : 'admin'
            });
        } catch (err) {
            console.error("Toggle admin failed", err);
        }
    };

    const togglePermission = async (uid: string, field: string, currentStatus: boolean) => {
        const userRef = doc(db, 'users', uid);
        try {
            await updateDoc(userRef, { [field]: !currentStatus });
        } catch (err) {
            console.error(`Toggle ${field} failed`, err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDaysRemaining = (dateStr: string) => {
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const goldGradient = 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)';

    return (
        <div style={{ padding: 'env(safe-area-inset-top, 20px) 1rem 5rem', maxWidth: '1000px', margin: '0 auto', background: 'var(--bg)', minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '4px' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#000', margin: 0 }}>Management</h1>
                </div>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '2px solid #000', boxShadow: '4px 4px 0px #000' }}>
                    <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#000', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                        <Search size={16} /> Search Users
                    </h3>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                        <input
                            type="text"
                            placeholder="Email address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '10px', border: '1.5px solid #000', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                <div style={{ background: 'var(--secondary-light)', padding: '1.25rem', borderRadius: '16px', border: '2px solid #000', boxShadow: '4px 4px 0px #000' }}>
                    <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#000', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                        <UserPlus size={16} /> Add User
                    </h3>
                    <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <UserIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                            <input
                                type="email"
                                placeholder="Email..."
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '10px', border: '1.5px solid #000', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Key style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                            <input
                                type="password"
                                placeholder="Password..."
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '10px', border: '1.5px solid #000', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isAdding}
                            style={{ width: '100%', padding: '1rem', background: goldGradient, color: '#000', border: '2.5px solid #000', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', fontSize: '1rem', textTransform: 'uppercase', marginTop: '4px' }}
                        >
                            {isAdding ? 'CREATING...' : 'CREATE USER'}
                        </button>
                    </form>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {error && <div style={{ background: '#fef2f2', border: '2px solid #ef4444', padding: '1rem', borderRadius: '12px', color: '#ef4444', textAlign: 'center', fontWeight: 700 }}>{error}</div>}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <div style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                        Loading...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>No users found</div>
                ) : (
                    filteredUsers.map(user => {
                        const days = getDaysRemaining(user.expiryDate);
                        const isExpired = days <= 0;

                        return (
                            <div key={user.uid} style={{
                                background: 'white',
                                padding: '1.25rem',
                                borderRadius: '16px',
                                border: '2px solid #000',
                                boxShadow: '4px 4px 0px #000',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                                        <div style={{ width: '44px', height: '44px', background: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #000', flexShrink: 0 }}>
                                            <UserIcon size={24} color="#000" />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 800, color: '#000', fontSize: '1rem', wordBreak: 'break-all', lineHeight: 1.2 }}>{user.email}</div>
                                            <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                                                <div style={{ fontSize: '0.65rem', color: '#000', background: user.role === 'admin' ? '#d4af37' : '#f0f0f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 900, border: '1px solid #000' }}>{user.role.toUpperCase()}</div>
                                                <div style={{ fontSize: '0.65rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '2px' }}><Calendar size={10} /> {new Date(user.createdAt || '').toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: isExpired ? '#ef4444' : '#16a34a' }}>{isExpired ? 'EXPIRED' : `${days} DAYS`}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{new Date(user.expiryDate).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '1rem', borderTop: '2px solid #f0f0f0' }}>
                                    <button onClick={() => updateExpiry(user.uid, 1)} style={{ padding: '8px 12px', fontSize: '0.75rem', background: '#eff6ff', color: '#000', border: '2px solid #000', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>+1 MO</button>
                                    <button onClick={() => updateExpiry(user.uid, 6)} style={{ padding: '8px 12px', fontSize: '0.75rem', background: '#ecfdf5', color: '#000', border: '2px solid #000', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>+6 MO</button>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '2px solid #000' }}>
                                        <Calendar size={14} />
                                        <input
                                            type="date"
                                            defaultValue={user.expiryDate.split('T')[0]}
                                            onChange={(e) => e.target.value && setExpiry(user.uid, new Date(e.target.value).toISOString())}
                                            style={{ border: 'none', background: 'transparent', fontSize: '0.75rem', fontWeight: 800, outline: 'none', width: '90px' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', width: '100%', marginTop: '0.5rem' }}>
                                        <button onClick={() => togglePermission(user.uid, 'hasKPAccess', !!user.hasKPAccess)} style={{ padding: '8px 10px', fontSize: '0.75rem', background: user.hasKPAccess ? '#dcfce7' : '#fee2e2', color: '#000', border: '2px solid #000', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, flex: 1 }}>KP: {user.hasKPAccess ? 'ON' : 'OFF'}</button>
                                        <button onClick={() => togglePermission(user.uid, 'hasPowerPositionAccess', !!user.hasPowerPositionAccess)} style={{ padding: '8px 10px', fontSize: '0.75rem', background: user.hasPowerPositionAccess ? '#dcfce7' : '#fee2e2', color: '#000', border: '2px solid #000', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, flex: 1 }}>POWER: {user.hasPowerPositionAccess ? 'ON' : 'OFF'}</button>
                                        <button onClick={() => togglePermission(user.uid, 'hasAnalysisAccess', !!user.hasAnalysisAccess)} style={{ padding: '8px 10px', fontSize: '0.75rem', background: user.hasAnalysisAccess ? '#dcfce7' : '#fee2e2', color: '#000', border: '2px solid #000', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, flex: 1 }}>AI: {user.hasAnalysisAccess ? 'ON' : 'OFF'}</button>
                                        <button onClick={() => togglePermission(user.uid, 'hasAdvancePredictionsAccess', !!user.hasAdvancePredictionsAccess)} style={{ padding: '8px 10px', fontSize: '0.75rem', background: user.hasAdvancePredictionsAccess ? '#dcfce7' : '#fee2e2', color: '#000', border: '2px solid #000', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, flex: 1 }}>ADV: {user.hasAdvancePredictionsAccess ? 'ON' : 'OFF'}</button>
                                    </div>
                                    <button
                                        onClick={() => toggleAdmin(user.uid, user.role)}
                                        style={{ width: '100%', marginTop: '0.5rem', padding: '10px', fontSize: '0.8rem', background: user.role === 'admin' ? '#000' : '#d4af37', color: user.role === 'admin' ? '#fff' : '#000', border: '2.5px solid #000', borderRadius: '10px', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase' }}
                                    >
                                        {user.role === 'admin' ? 'REVOKE ADMIN ROLE' : 'MAKE SYSTEM ADMIN'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AdminPortal;
