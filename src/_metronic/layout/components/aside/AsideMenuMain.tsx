/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {AsideMenuItem} from './AsideMenuItem'
import {useAuth} from '../../../../app/modules/auth'; // Πρόσβαση στο Auth Context

export function AsideMenuMain() {
  const intl = useIntl()
  const {currentUser} = useAuth(); // Πρόσβαση στον τρέχοντα χρήστη και τους ρόλους του

  return (
    <>
      <div className='menu-item'>
        <div className='menu-content pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>{intl.formatMessage({id: 'MENU.Menu'})}</span>
        </div>
      </div>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen025.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
      />
      <AsideMenuItem
        to="/createStory"
        title={intl.formatMessage({id: 'MENU.CreateStory'})}
        icon='/media/icons/duotune/files/fil005.svg'/>
      <AsideMenuItem
        to="/ViewStory"
        title={intl.formatMessage({id: 'MENU.ViewStories'})}
        icon='/media/icons/duotune/general/gen004.svg'/>

      {/* Εμφάνιση μόνο για τον Admin */}
      {currentUser?.roles?.includes('admin') && ( // Ασφαλής πρόσβαση στο currentUser και roles
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>{intl.formatMessage({id: 'MENU.Admin'})}</span>
            </div>
          </div>
          <AsideMenuItem
            to='/apps/user-management/users'
            icon='/media/icons/duotune/general/gen051.svg'
            title={intl.formatMessage({id: 'MENU.Usermanagement'})}
          />
        </>
      )}
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
    </>
  )
}
