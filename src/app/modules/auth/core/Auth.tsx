import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import {LayoutSplashScreen} from '../../../../_metronic/layout/core';
import {AuthModel, UserModel} from './_models';
import * as authHelper from './AuthHelpers';
import {WithChildren} from '../../../../_metronic/helpers';
import {useKeycloak} from '@react-keycloak/web'; // Χρήση του Keycloak

// Τύπος δεδομένων για το AuthContext
type AuthContextProps = {
  auth: AuthModel | undefined; // Το auth token ή undefined
  saveAuth: (auth: AuthModel | undefined) => void; // Αποθηκεύει το auth
  currentUser: UserModel | undefined; // Πληροφορίες χρήστη
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>; // Ενημέρωση του χρήστη
  logout: () => void; // Διαγραφή auth και αποσύνδεση
};

// Αρχική κατάσταση του AuthContext
const initAuthContextPropsState = {
  auth: undefined,
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

// Custom hook για πρόσβαση στο AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: FC<WithChildren> = ({children}) => {
  const {keycloak, initialized} = useKeycloak(); // Αρχικοποίηση Keycloak
  const [auth, setAuth] = useState<AuthModel | undefined>();
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

  // Αποθήκευση Auth
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth); // Αποθηκεύει το auth token στο localStorage
    } else {
      authHelper.removeAuth();
    }
  };

  // Logout
  const logout = () => {
    setAuth(undefined);
    setCurrentUser(undefined);
    keycloak.logout({
      redirectUri: `${window.location.origin}`, // Ανακατεύθυνση στην αρχική σελίδα
    });
    authHelper.removeAuth(); // Καθαρισμός του localStorage
  };

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      // Ενημέρωση auth και χρήστη αν το Keycloak είναι συνδεδεμένο
      const token = keycloak.token;
      const parsedToken = keycloak.tokenParsed as any; // Προσαρμογή τύπου αν χρειάζεται

      saveAuth({token}); // Αποθήκευση του token μέσω saveAuth

      setCurrentUser({
        id: parsedToken.sub,
        username: parsedToken.preferred_username,
        first_name: parsedToken.given_name, // Το πεδίο "first_name" από το token
        last_name: parsedToken.family_name, // Το πεδίο "last_name" από το token
        email: parsedToken.email, // Το email από το token
        roles: parsedToken.realm_access?.roles || [], // Ανάκτηση ρόλων από το token
      });
    }
  }, [keycloak, initialized]);

  return (
    <AuthContext.Provider value={{auth, saveAuth, currentUser, setCurrentUser, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthInit: FC<WithChildren> = ({children}) => {
  const {auth, logout} = useAuth(); // Από το AuthContext
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const didRequest = useRef(false); // Για αποφυγή διπλών αιτημάτων

  useEffect(() => {
    const initializeAuth = async () => {
      const token = auth?.token;

      // Αν υπάρχει token, θεωρούμε ότι ο χρήστης είναι συνδεδεμένος
      if (token) {
        console.log('Auth Token Found:', token);
        setShowSplashScreen(false);
        return;
      }

      // Αν δεν υπάρχει token και δεν έχουμε κάνει request ακόμα
      if (!didRequest.current) {
        didRequest.current = true;
        console.warn('No Auth Token Found, waiting for Keycloak...');
        // Δεν κάνουμε logout εδώ, περιμένουμε να αρχικοποιηθεί το Keycloak
      }

      // Καταργούμε το splash screen, ώστε να προχωρήσει η εφαρμογή
      setShowSplashScreen(false);
    };

    initializeAuth();
  }, [auth]);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export {AuthProvider, AuthInit, useAuth};
