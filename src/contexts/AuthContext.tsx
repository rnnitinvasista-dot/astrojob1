import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

interface UserMetadata {
    role: 'user' | 'admin';
    expiryDate: string; // ISO String
    hasKPAccess?: boolean;
    hasPowerPositionAccess?: boolean;
    hasAnalysisAccess?: boolean;
    hasAdvancePredictionsAccess?: boolean;
}

interface AuthContextType {
    currentUser: User | null;
    userData: UserMetadata | null;
    loading: boolean;
    isExpired: boolean;
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
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Listen for real-time updates to user data
                const userDocRef = doc(db, 'users', user.uid);
                const unsubscribeData = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserMetadata;

                        // Force admin role for master email if not already set correctly in DB
                        if (user.email === 'astroadmin09@gmail.com' && data.role !== 'admin') {
                            data.role = 'admin';
                        }

                        setUserData(data);

                        // Check expiry
                        const expDate = new Date(data.expiryDate);
                        const now = new Date();
                        setIsExpired(now > expDate && data.role !== 'admin');
                    } else {
                        // Create default user profile if it doesn't exist
                        // Default 3 days trial
                        const trialDate = new Date();
                        trialDate.setDate(trialDate.getDate() + 3);
                        const isMasterAdmin = user.email === 'astroadmin09@gmail.com';
                        const defaultData: UserMetadata = {
                            role: isMasterAdmin ? 'admin' : 'user',
                            expiryDate: trialDate.toISOString(),
                            hasKPAccess: isMasterAdmin ? true : false,
                            hasPowerPositionAccess: isMasterAdmin ? true : false,
                            hasAnalysisAccess: isMasterAdmin ? true : false,
                            hasAdvancePredictionsAccess: isMasterAdmin ? true : false
                        };
                        setDoc(userDocRef, {
                            ...defaultData,
                            email: user.email,
                            createdAt: new Date().toISOString()
                        });
                        setUserData(defaultData);
                        setIsExpired(false);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Auth snapshot error:", error);
                    setLoading(false);
                });

                return () => unsubscribeData();
            } else {
                setUserData(null);
                setIsExpired(false);
                setLoading(false);
            }
        });

        return unsubscribeAuth;
    }, []);

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        userData,
        loading,
        isExpired,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: '#f8fafc',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 500 }}>Initializing Application...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
