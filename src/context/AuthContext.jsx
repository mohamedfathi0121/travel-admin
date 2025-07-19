import React, { createContext, useState, useEffect } from "react";
import supabase from "../utils/supabase"; // Assuming supabase client is here

// Define the role you require for access.
// You could also pass this in as a prop to AuthProvider for more flexibility.
const REQUIRED_ROLE = "admin";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Centralized function to check user metadata and set the session
  const checkUserAndSetSession = async session => {
    if (session?.user) {
      const { is_blocked, role } = session.user.app_metadata;

      // 1. Check for block status first
      if (is_blocked) {
        console.warn("Blocked user session detected. Signing out.");
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return; // Stop further processing
      }

      // 2. Check for the required role
      if (role !== REQUIRED_ROLE) {
        console.warn(
          `User role '${role}' does not meet requirement of '${REQUIRED_ROLE}'. Signing out.`
        );
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return; // Stop further processing
      }

      // If all checks pass, set the user
      setUser(session.user);
    } else {
      // No session or user, clear the state
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Get current session and check the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUserAndSetSession(session);
    });

    // Subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        checkUserAndSetSession(session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data, error };
    }

    // Post-login checks
    if (data.user) {
      const { is_blocked, role } = data.user.app_metadata;

      // Check for role
      if (role !== REQUIRED_ROLE) {
        console.warn(`User role '${role}' is not permitted. Signing out.`);
        await supabase.auth.signOut();
        return {
          data: null,
          error: {
            message: `Access denied. You need the '${REQUIRED_ROLE}' role.`,
          },
        };
      }

      // Check for block status
      if (is_blocked) {
        console.warn("Blocked user tried to sign in. Signing out.");
        await supabase.auth.signOut();
        return {
          data: null,
          error: { message: "This account has been blocked." },
        };
      }
    }

    // If checks pass, the onAuthStateChange listener will handle setting the user state.
    return { data, error };
  };

  const value = {
    user,
    loading,
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn,
    signOut: async () => {
      await supabase.auth.signOut();
      setUser(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
