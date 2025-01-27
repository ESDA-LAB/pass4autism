import {createRoot} from 'react-dom/client'
// Axios
import axios from 'axios'
import {Chart, registerables} from 'chart.js'
import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
// Apps
import {MetronicI18nProvider} from './_metronic/i18n/Metronici18n'
/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import './_metronic/assets/css/style.rtl.css'
 **/
import 'nouislider/dist/nouislider.css'
import './_metronic/assets/sass/style.scss'
import './_metronic/assets/sass/plugins.scss'
import './_metronic/assets/sass/style.react.scss'
import {AppRoutes} from './app/routing/AppRoutes'
import {AuthProvider, setupAxios} from './app/modules/auth'
import {ThemeModeProvider} from './_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {ReactKeycloakProvider} from '@react-keycloak/web' // Προσθήκη του ReactKeycloakProvider
import keycloak from './keycloak' // Import της ρύθμισης Keycloak
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
setupAxios(axios)
Chart.register(...registerables)

const queryClient = new QueryClient()
const container = document.getElementById('root')

const eventLogger = (event: any, error: any) => {
  console.log('Keycloak event:', event, error);
};

const tokenLogger = (tokens: any) => {
  console.log('Keycloak tokens:', tokens);
  if (tokens.token) {
    localStorage.setItem('kcToken', tokens.token); // Αποθηκεύουμε το access token
    localStorage.setItem('kcRefreshToken', tokens.refreshToken); // Αποθηκεύουμε το refresh token
  }
};

if (container) {
  createRoot(container).render(
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={eventLogger}
      onTokens={tokenLogger}
      initOptions={{
        onLoad: 'login-required',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <MetronicI18nProvider>
          <ThemeModeProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ThemeModeProvider>
        </MetronicI18nProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReactKeycloakProvider>
  )
}
