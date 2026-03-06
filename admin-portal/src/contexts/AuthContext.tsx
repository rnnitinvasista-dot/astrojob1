import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface UserMetadata {
    role: 'user' | 'admin';
    expiryDate: string;
}

interface AuthContextType {
    currentUser: User | null;
    userData: UserMetadata | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserMetadata | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const unsubscribeData = onSnapshot(userDocRef, (docSnap) => {
                    console.log("Auth Record Snapshot:", docSnap.exists() ? "Exists" : "Not Found", user.email);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserMetadata;
                        console.log("Auth Data:", data);

                        // Ensure master admin has admin role
                        if (user.email?.toLowerCase() === 'astroadmin09@gmail.com' && data.role !== 'admin') {
                            console.log("Forcing Admin Role for Master");
                            data.role = 'admin';
                        }

                        setUserData(data);
                    } else if (user.email?.toLowerCase() === 'astroadmin09@gmail.com') {
                        console.log("Master Admin log-in, doc missing - applying default state");
                        // Handle case where master admin logs in but document doesn't exist yet
                        setUserData({ role: 'admin', expiryDate: new Date('2099-12-31').toISOString() });
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Admin Auth snapshot error:", error);
                    setLoading(false);
                });

                return () => unsubscribeData();
            } else {
                setUserData(null);
                setLoading(false);
            }
        });

        return unsubscribeAuth;
    }, []);

    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ currentUser, userData, loading, logout }}>
            {loading ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: '#f8fafc',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #e2e8f0',
                        borderTop: '4px solid #1d4ed8',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 500 }}>Authenticating Admin...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
