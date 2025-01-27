import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import {useKeycloak} from '@react-keycloak/web' // Χρήση του useKeycloak

const App = () => {
  const {keycloak, initialized} = useKeycloak()

  if (!initialized) {
    return <LayoutSplashScreen />
  }
// 5UIKBYh5Z2H1InY2 Google Client Secret
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <AuthInit>
            <Outlet />
            <MasterInit />
          </AuthInit>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}
