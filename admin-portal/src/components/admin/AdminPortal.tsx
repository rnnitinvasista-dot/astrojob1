import React, { useEffect, useState } from 'react';
import {
    collection,
    query,
    onSnapshot,
    updateDoc,
    doc,
    setDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import { User as UserIcon, Search, Shield, Clock, LogOut, ExternalLink, Calendar, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserData {
    uid: string;
    email: string;
    role: 'user' | 'admin';
    expiryDate: string;
    createdAt?: string;
    hasKPAccess?: boolean;
}

const AdminPortal: React.FC = () => {
    const { logout } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("AdminPortal: Received users snapshot, count:", snapshot.size);
            const usersData: UserData[] = [];
            snapshot.forEach((doc) => {
                usersData.push({ uid: doc.id, ...doc.data() } as UserData);
            });
            setUsers(usersData);
            setLoading(false);
        }, (err) => {
            console.error("AdminPortal: Snapshot error:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserEmail) return;

        setIsAdding(true);
        try {
            // We use the email as a temporary UID if we don't have one, 
            // but Firebase handles it better if we use a random string or the email's hash.
            // Actually, we can just let it be added when they log in, OR 
            // the admin can specify a UID if they know it.
            // For simplicity, we'll use a sanitized version of the email as the ID for pre-creation,
            // or better, a random ID that will be replaced when they log in? 
            // No, the main app's AuthContext uses user.uid.
            // If we don't know the UID, we can't easily pre-set it.

            // ALTERNATIVE: The main app's AuthContext checks if a record exists.
            // If we want to PRE-SET permissions, we need a way to link them by email.
            // Let's modify the main app later to also check for records by email.

            // For now, let's just implement the form to add a user.
            // We'll use a random doc ID and ensure it has an 'email' field.
            const userRef = doc(collection(db, 'users'));
            const defaultExpiry = new Date();
            defaultExpiry.setMonth(defaultExpiry.getMonth() + 1); // 1 month default

            await setDoc(userRef, {
                email: newUserEmail.toLowerCase(),
                role: 'user',
                expiryDate: defaultExpiry.toISOString(),
                createdAt: new Date().toISOString()
            });

            setNewUserEmail('');
            alert("User record created!");
        } catch (err) {
            console.error("Add user failed", err);
            alert("Error adding user");
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

    const toggleKPAccess = async (uid: string, currentStatus: boolean) => {
        const userRef = doc(db, 'users', uid);
        try {
            await updateDoc(userRef, {
                hasKPAccess: !currentStatus
            });
        } catch (err) {
            console.error("Toggle KP access failed", err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDaysRemaining = (dateStr: string) => {
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: '#1d4ed8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', margin: 0 }}>Admin Dashboard</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => window.open('https://astrojob-f0918.web.app', '_blank')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '12px',
                            border: '1.5px solid #1d4ed8',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ExternalLink size={18} /> Astro App
                    </button>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Search size={18} /> Search Users
                    </h3>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem 0.875rem 3.25rem',
                                borderRadius: '12px',
                                border: '1.5px solid #e2e8f0',
                                outline: 'none',
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserPlus size={18} /> Add New User
                    </h3>
                    <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                            type="email"
                            placeholder="User email address..."
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            required
                            style={{
                                flex: 1,
                                padding: '0.875rem 1rem',
                                borderRadius: '12px',
                                border: '1.5px solid #e2e8f0',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isAdding}
                            style={{
                                padding: '0.875rem 1.5rem',
                                background: '#1d4ed8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {isAdding ? '...' : 'Add'}
                        </button>
                    </form>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {error && (
                    <div style={{ gridColumn: '1/-1', background: '#fef2f2', border: '1px solid #ef4444', padding: '1rem', borderRadius: '12px', color: '#b91c1c', textAlign: 'center' }}>
                        Error: {error}. Please check Firestore Security Rules.
                    </div>
                )}
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                        <Shield size={48} className="animate-pulse" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        Loading management data...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>No users matched your search</div>
                ) : (
                    filteredUsers.map(user => {
                        const days = getDaysRemaining(user.expiryDate);
                        const isExpired = days <= 0;

                        return (
                            <div key={user.uid} style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                borderLeft: `6px solid ${user.role === 'admin' ? '#8b5cf6' : isExpired ? '#ef4444' : '#22c55e'}`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            background: '#f8fafc',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <UserIcon size={24} color="#64748b" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '1rem' }}>{user.email}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>UID: {user.uid}</div>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Shield size={12} /> {user.role.toUpperCase()}
                                                </div>
                                                {user.createdAt && (
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Calendar size={12} /> Joined: {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 700,
                                            color: isExpired ? '#ef4444' : '#22c55e',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            gap: '4px'
                                        }}>
                                            <Clock size={16} />
                                            {isExpired ? 'EXPIRED' : `${days} DAYS LEFT`}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                                            Renews: {new Date(user.expiryDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    flexWrap: 'wrap',
                                    borderTop: '1.5px solid #f8fafc',
                                    paddingTop: '1.25rem'
                                }}>
                                    <button
                                        onClick={() => updateExpiry(user.uid, 2)}
                                        style={{ padding: '8px 14px', fontSize: '0.8rem', background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                                    >
                                        +2 Mos
                                    </button>
                                    <button
                                        onClick={() => updateExpiry(user.uid, 6)}
                                        style={{ padding: '8px 14px', fontSize: '0.8rem', background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                                    >
                                        +6 Mos
                                    </button>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <Calendar size={14} color="#64748b" />
                                        <input
                                            type="date"
                                            defaultValue={user.expiryDate.split('T')[0]}
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    setExpiry(user.uid, new Date(e.target.value).toISOString());
                                                }
                                            }}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                fontSize: '0.8rem',
                                                color: '#1e3a8a',
                                                fontWeight: 600,
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => toggleKPAccess(user.uid, !!user.hasKPAccess)}
                                        style={{
                                            padding: '8px 14px',
                                            fontSize: '0.8rem',
                                            background: user.hasKPAccess ? '#ecfdf5' : '#fef2f2',
                                            color: user.hasKPAccess ? '#059669' : '#dc2626',
                                            border: '1.5px solid transparent',
                                            borderColor: user.hasKPAccess ? '#a7f3d0' : '#fecaca',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            marginLeft: '0.5rem'
                                        }}
                                    >
                                        {user.hasKPAccess ? 'Revoke KP' : 'Give KP Access'}
                                    </button>
                                    <button
                                        onClick={() => toggleAdmin(user.uid, user.role)}
                                        style={{
                                            padding: '8px 14px',
                                            fontSize: '0.8rem',
                                            background: user.role === 'admin' ? '#f5f3ff' : '#f8fafc',
                                            color: user.role === 'admin' ? '#7c3aed' : '#64748b',
                                            border: '1.5px solid transparent',
                                            borderColor: user.role === 'admin' ? '#ddd6fe' : '#e2e8f0',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            marginLeft: 'auto'
                                        }}
                                    >
                                        {user.role === 'admin' ? 'Revoke' : 'Make Admin'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminPortal;
