import {useAuth} from '../../../../app/modules/auth'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu, Search} from '../../../partials'

/* eslint-disable jsx-a11y/anchor-is-valid */
const AsideToolbar = () => {
  const {currentUser} = useAuth()

  return (
    <>
      {/*begin::User*/}
      <div className='aside-user d-flex align-items-sm-center justify-content-center py-5'
        style={{borderBottom: '1px solid #2d2d43'}}>
        {/*begin::Wrapper*/}
        <div className='aside-user-info flex-row-fluid flex-wrap ms-5'>
          {/*begin::Section*/}
          <div className='d-flex'>
            {/*begin::Info*/}
            <div className='flex-grow-1 me-2'>
              {/*begin::Username*/}
              <span className='text-white text-hover-primary fs-6 fw-bold'>
                {currentUser?.first_name} {currentUser?.last_name}
              </span>
              {/*end::Username*/}

              {/*begin::Description*/}
              <span className='text-gray-600 fw-bold d-block fs-8 mb-1'>{currentUser?.email}</span>
              {/*end::Description*/}
            </div>
            {/*end::Info*/}

            {/*begin::User menu*/}
            <div className='me-n2'>
              {/*begin::Action*/}
              <a
                href='#'
                className='btn btn-icon btn-sm btn-active-color-primary mt-n2'
                data-kt-menu-trigger='click'
                data-kt-menu-placement='bottom-start'
                data-kt-menu-overflow='false'
              >
                <KTSVG
                  path='/media/icons/duotune/coding/cod001.svg'
                  className='svg-icon-muted svg-icon-12'
                />
              </a>

              <HeaderUserMenu />
              {/*end::Action*/}
            </div>
            {/*end::User menu*/}
          </div>
          {/*end::Section*/}
        </div>
        {/*end::Wrapper*/}
      </div>
      {/*end::User*/}
    </>
  )
}

export {AsideToolbar}
