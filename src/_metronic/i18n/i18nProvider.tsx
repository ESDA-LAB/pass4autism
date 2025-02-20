import {FC} from 'react'
import {useLang} from './Metronici18n'
import {IntlProvider} from 'react-intl'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/locale-data/en'
import '@formatjs/intl-relativetimeformat/locale-data/es'
import '@formatjs/intl-relativetimeformat/locale-data/el'
import '@formatjs/intl-relativetimeformat/locale-data/it'

import enMessages from './messages/en.json'
import esMessages from './messages/es.json'
import elMessages from './messages/el.json'
import itMessages from './messages/it.json'
import {WithChildren} from '../helpers'


const allMessages = {
  en: enMessages,
  es: esMessages,
  el: elMessages,
  it: itMessages,
}

const I18nProvider: FC<WithChildren> = ({children}) => {
  const locale = useLang()
  const messages = allMessages[locale]

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  )
}

export {I18nProvider}
