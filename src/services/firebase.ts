import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  getIdTokenResult
} from 'firebase/auth';

// Firebase configuration - production ready
const firebaseConfig = {
  apiKey: "AIzaSyCN7jOuuN49Rr7MN3KiPDGU4zdF9gLAHvo",
  authDomain: "accverse-8bd06.firebaseapp.com",
  projectId: "accverse-8bd06",
  storageBucket: "accverse-8bd06.applestorage.googleapis.com",
  messagingSenderId: "912912221430",
  appId: "1:912912221430:web:31be2c4b6ea11bd69d58d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

interface GoogleAuthResponse {
  token: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    provider: string;
    firebase_uid: string;
    firebase_token: string;
    email_verified: boolean;
    created_at: string | null;
  };
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<GoogleAuthResponse> => {
  try {
    console.log("Starting Google sign-in process in production mode...");
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    const tokenResult = await getIdTokenResult(result.user);
    
    console.log("Google sign in successful, token obtained");
    
    // Return user info formatted similarly to your existing auth structure
    return {
      token: token,
      user: {
        id: result.user.uid,
        name: result.user.displayName || 'Google User',
        email: result.user.email || '',
        provider: 'google',
        firebase_uid: result.user.uid,
        firebase_token: token,
        email_verified: result.user.emailVerified,
        created_at: tokenResult.claims.auth_time ? new Date(Number(tokenResult.claims.auth_time) * 1000).toISOString() : null
      }
    };
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};

// Sign out
export const signOutFromGoogle = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Google sign out error:", error);
    throw error;
  }
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user token
export const getCurrentUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Refresh token
export const refreshUserToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user logged in");
  }
  
  try {
    await user.getIdToken(true); // Force refresh
    return await user.getIdToken();
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export default auth;
