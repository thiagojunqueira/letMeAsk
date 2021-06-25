import { createContext, useEffect, useState, ReactNode } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
  provider: string,
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // console.log(user);
      handleUserValidation({user});
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);
    handleUserValidation(result);
  }

  async function signInWithGithub() {
    const provider = new firebase.auth.GithubAuthProvider();

    const result = await auth.signInWithPopup(provider);
    handleUserValidation(result);
  }

  async function signOut() {
    await auth.signOut();
    setUser(undefined);
  }

  function handleUserValidation(authResponse: any) {
    // console.log(authResponse);
    
    if (authResponse.user) {
      const { displayName, photoURL, uid } = authResponse.user
      const { providerId } = authResponse.user.providerData[0];

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Auth Provider.");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
        provider: providerId
      });
    }
  }
  
  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signInWithGithub, signOut }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
