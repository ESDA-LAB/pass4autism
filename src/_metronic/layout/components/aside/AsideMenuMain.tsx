/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {AsideMenuItem} from './AsideMenuItem'
import {useAuth} from '../../../../app/modules/auth'; // Πρόσβαση στο Auth Context
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {KTSVG} from '../../../helpers'

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

      <div className='menu-item'>
        <div className='menu-content pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>{intl.formatMessage({id: 'MENU.TrainingCourse'})}</span>
        </div>
      </div>
      <div className='menu-item'>
        <a className="menu-link without-sub" href="https://pass4autism.thinkific.com/" target="_blank" rel="noopener noreferrer" >
          <span className="menu-icon">
            <KTSVG path="/media/flags/united-kingdom.svg" className="svg-icon-2" />
          </span>
          <span className="menu-title">
            Improving the social skills of ASD people using visual stories
          </span>
        </a>
      </div>
      <div className='menu-item'>
        <a className="menu-link without-sub" href="https://pass4autism-es.thinkific.com/" target="_blank" rel="noopener noreferrer" >
          <span className="menu-icon">
            <KTSVG path="/media/flags/spain.svg" className="svg-icon-2" />
          </span>
          <span className="menu-title">
            Mejora de habilidades sociales de personas con TEA mediante historias visuales
          </span>
        </a>
      </div>
      <div className='menu-item'>
        <a className="menu-link without-sub" href="https://pass4autism-gr.thinkific.com/" target="_blank" rel="noopener noreferrer" >
          <span className="menu-icon">
            <KTSVG path="/media/flags/greece.svg" className="svg-icon-2" />
          </span>
          <span className="menu-title">
            Βελτιώνοντας τις κοινωνικές δεξιότητες των ατόμων με ΔΑΦ με τη χρήση οπτικών ιστοριών
          </span>
        </a>
      </div>
      <div className='menu-item'>
        <a className="menu-link without-sub" href="https://pass4autism-it.thinkific.com/" target="_blank" rel="noopener noreferrer" >
          <span className="menu-icon">
            <KTSVG path="/media/flags/italy.svg" className="svg-icon-2" />
          </span>
          <span className="menu-title">
            Migliorare le abilità sociali delle persone con ASD utilizzando storie visive
          </span>
        </a>
      </div>

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
