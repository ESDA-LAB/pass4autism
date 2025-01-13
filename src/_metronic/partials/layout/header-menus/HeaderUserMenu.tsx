/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useAuth} from '../../../../app/modules/auth'
import {Languages} from './Languages'
import { useIntl } from 'react-intl'

const HeaderUserMenu: FC = () => {
  const {logout} = useAuth()
  const intl = useIntl();
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
      data-popper-placement='bottom-start'
    >
      <Languages />
      
      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          {intl.formatMessage({ id: 'SignOut' })}
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
