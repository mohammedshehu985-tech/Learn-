import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'student' | 'admin';
  points: number;
  bio?: string;
  hasPaid?: boolean;
  paymentReference?: string;
  registrationFee?: number;
  createdAt?: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = undefined;
      }

      if (authUser) {
        const profileRef = doc(db, 'users', authUser.uid);
        unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
            setLoading(false);
          } else {
            // Only auto-create if it's the master admin email
            if (authUser.email === "mohammedshehu985@gmail.com") {
              const adminProfile: UserProfile = {
                uid: authUser.uid,
                displayName: authUser.displayName || 'Admin',
                email: authUser.email || '',
                role: 'admin',
                points: 0,
                hasPaid: true,
                createdAt: new Date()
              };
              setDoc(profileRef, adminProfile).then(() => {
                setProfile(adminProfile);
                setLoading(false);
              }).catch(err => {
                console.error("Error creating admin profile:", err);
                setLoading(false);
              });
            } else {
              // Not found and not admin - might be mid-signup or deleted
              setProfile(null);
              setLoading(false);
            }
          }
        }, (error) => {
          console.error("Profile listener error:", error);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
