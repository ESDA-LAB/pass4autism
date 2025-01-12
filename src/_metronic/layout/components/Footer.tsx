/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useLayout} from '../core'

const Footer: FC = () => {
  const {classes} = useLayout()
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
              Visit Website
            </a>
          </li>
          <li className='menu-item'>
            <a href='https://pass4autism-project.eu/contact/' target='_blank' rel='noopener noreferrer' className='menu-link pe-0 pe-2'>
              Contact us
            </a>
          </li>
          <li className='menu-item'>
            <a href='https://pass4autism-project.eu/forum/' target='_blank' rel='noopener noreferrer' className='menu-link pe-0'>
              PASS4Autism Forum
            </a>
          </li>
        </ul>
        {/* end::Nav */}
      </div>
      {/* end::Container */}
    </div>
  )
}

export {Footer}
