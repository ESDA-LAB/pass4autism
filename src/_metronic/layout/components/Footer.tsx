/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useLayout} from '../core'
import { useIntl } from 'react-intl'
import {toAbsoluteUrl} from '../../helpers'

const Footer: FC = () => {
  const {classes} = useLayout()
  const intl = useIntl();
  return (
    <div className='footer py-4 d-flex flex-lg-column' id='kt_footer'>
      {/* begin::Container */}
      <div
        className={`${classes.footerContainer} d-flex flex-column flex-md-row align-items-center justify-content-between`}
      >
        {/* begin::Copyright */}
        <div className='text-dark order-2 order-md-1'>
          <span className='text-muted fw-bold me-2'>{new Date().getFullYear()} &copy;</span>
          <a href='https://pass4autism-project.eu/' target={'_blank'} rel='noopener noreferrer' className='text-gray-800 text-hover-primary'>
            PASS4Autism Project
          </a>
        </div>
        {/* end::Copyright */}

        {/* begin::Nav */}
        <ul className='menu menu-gray-600 menu-hover-primary fw-bold order-1'>
          <li className='menu-item'>
            <a href='https://pass4autism-project.eu/' target='_blank' rel='noopener noreferrer' className='menu-link ps-0 pe-2'>
              {intl.formatMessage({ id: 'Footer.VisitWebsite' })}
            </a>
          </li>
          <li className='menu-item'>
            <a href='https://pass4autism-project.eu/contact/' target='_blank' rel='noopener noreferrer' className='menu-link pe-0 pe-2'>
              {intl.formatMessage({ id: 'Footer.Contactus' })}
            </a>
          </li>
          <li className='menu-item'>
            <a href='https://pass4autism-project.eu/forum/' target='_blank' rel='noopener noreferrer' className='menu-link pe-0'>
              {intl.formatMessage({ id: 'Footer.PASS4AutismForum' })}
            </a>
          </li>
        </ul>
        {/* end::Nav */}
      </div>
      {/* end::Container */}
      {/* begin::Container */}
      <div
        className={`${classes.footerContainer} d-flex flex-column flex-md-row align-items-center justify-content-between`}
      >
        {/* begin::Copyright */}
        <div className='text-dark order-2 order-md-1'>
            <img src={toAbsoluteUrl('/media/footer/EN-Co-Funded-by-the-EU_POS-300x63.png')} alt='EN-Co-Funded-by-the-EU_POS' /><br></br>
            Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.<br></br>
            <strong>Project No.</strong> 2023-1-ES01-KA220-ADU-000154910
        </div>
        {/* end::Copyright */}
      </div>
      {/* end::Container */}
    </div>
  )
}

export {Footer}
