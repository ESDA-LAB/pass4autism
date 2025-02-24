import {AuthModel} from './_models'
import keycloak from "../../../../keycloak"; // Βεβαιώσου ότι έχεις αρχικοποιήσει το Keycloak instance

const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v'
const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

export function setupAxios(axiosInstance: any) {
  axiosInstance.defaults.headers.Accept = "application/json";

  axiosInstance.interceptors.request.use(
    async (config: { headers: { Authorization?: string } }) => {
      if (keycloak.authenticated) {
        try {
          await keycloak.updateToken(30); // Ανανεώνει το token αν λήγει σύντομα
          config.headers.Authorization = `Bearer ${keycloak.token}`;
        } catch (error) {
          console.error("Token refresh failed, forcing login...");
          keycloak.login(); // Αν αποτύχει, αναγκάζει τον χρήστη να ξανακάνει login
        }
      }

      return config;
    },
    (error: any) => Promise.reject(error)
  );
}

export {getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY}
