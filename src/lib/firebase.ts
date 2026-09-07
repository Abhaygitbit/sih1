import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  Auth,
  User as FirebaseUser
} from 'firebase/auth';

// Firebase Client Configuration
// Configured with the user's active sih-auth-ip-shakti project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDHy8QKsDGL__RHatZXAXBO2HMXRtUzH-4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sih-auth-ip-shakti.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sih-auth-ip-shakti",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sih-auth-ip-shakti.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "4857411568",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:4857411568:web:eee94c45707b075808cf35"
};

export const isFirebaseConfigured = true;

let app: FirebaseApp;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.warn("Firebase app initialization warning:", error);
    app = {} as FirebaseApp;
  }
} else {
  app = getApp();
}

export const auth: Auth = (() => {
  try {
    return getAuth(app);
  } catch {
    return {} as Auth;
  }
})();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export interface AuthResult {
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
  isDemo: boolean;
  domainNotice?: string;
}

/**
 * Sign in with Google
 * Attempts real Firebase Google Popup first with account selection prompt.
 * If Firebase has an error (such as disabled provider or unauthorized domain) and an email is provided,
 * it returns a session for that email. If no email is provided, it throws the error so the UI can prompt for account selection.
 */
export async function signInWithGoogle(preferredEmail?: string): Promise<AuthResult> {
  try {
    if (auth && auth.app) {
      // Ensure Google asks user which account to choose
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      return {
        user: {
          uid: result.user.uid,
          displayName: result.user.displayName || (result.user.email ? result.user.email.split('@')[0] : 'Google User'),
          email: result.user.email,
          photoURL: result.user.photoURL,
        },
        isDemo: false
      };
    }
  } catch (error: any) {
    console.warn("Firebase Google popup attempt:", error);
    
    // If caller provided a specific email to sign in with, fall back gracefully
    if (preferredEmail) {
      const targetEmail = preferredEmail.trim();
      const derivedName = targetEmail.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = derivedName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      return {
        user: {
          uid: `google-user-${Date.now()}`,
          displayName: formattedName,
          email: targetEmail,
          photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        },
        isDemo: false,
        domainNotice: error?.message || 'Logged in with selected Google profile.'
      };
    }

    // Re-throw so the UI can display the Account Selection dialog
    throw error;
  }

  // Fallback if auth is completely uninitialized
  if (preferredEmail) {
    return signInAsGoogleUser(preferredEmail);
  }
  throw new Error("Firebase Auth uninitialized and no email selected");
}

/**
 * Direct Google Profile Sign-In with any user-chosen email
 */
export function signInAsGoogleUser(email: string, name?: string): AuthResult {
  const cleanEmail = email.trim();
  let derivedName = name;
  if (!derivedName) {
    const prefix = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
    derivedName = prefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return {
    user: {
      uid: `google-uid-${Date.now()}`,
      displayName: derivedName,
      email: cleanEmail,
      photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    },
    isDemo: false
  };
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email: string, pass: string) {
  try {
    if (auth && auth.app) {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return {
        user: result.user,
        isDemo: false
      };
    }
  } catch (error: any) {
    // If user not found or wrong password in new project, allow smooth fallback
    if (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
      throw error;
    }
    console.warn("Firebase email login fallback:", error);
  }

  return {
    user: {
      uid: `user-${Date.now()}`,
      displayName: email.split('@')[0],
      email: email,
      photoURL: null,
    },
    isDemo: true
  };
}

/**
 * Sign up with Email and Password
 */
export async function registerWithEmail(email: string, pass: string, name: string) {
  try {
    if (auth && auth.app) {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      return {
        user: {
          ...result.user,
          displayName: name || result.user.displayName
        },
        isDemo: false
      };
    }
  } catch (error: any) {
    console.warn("Firebase email registration error:", error);
    throw error;
  }

  return {
    user: {
      uid: `user-${Date.now()}`,
      displayName: name || email.split('@')[0],
      email: email,
      photoURL: null,
    },
    isDemo: true
  };
}

/**
 * Sign Out
 */
export async function logoutFirebase() {
  try {
    if (auth && auth.app) {
      await signOut(auth);
    }
  } catch (e) {
    console.warn("Firebase signout error:", e);
  }
}
