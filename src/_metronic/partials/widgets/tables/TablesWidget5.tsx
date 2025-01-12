
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'

type Props = {
  className: string
}

const TablesWidget5: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>PASS4Autism Training Courses</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Find our Courses and enroll now</span>
        </h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        <div className='tab-content'>
          {/* begin::Tap pane */}
          <div className='tab-pane fade show active' id='kt_table_widget_5_tab_1'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                  <tr className='border-0'>
                    <th className='p-0 w-50px'></th>
                    <th className='p-0 min-w-150px'></th>
                    <th className='p-0 min-w-140px'></th>
                    <th className='p-0 min-w-110px'></th>
                    <th className='p-0 min-w-50px'></th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  <tr>
                    <td>
                      <div className='symbol symbol-45px me-2'>
                        <span className='symbol-label'>
                          <img
                            src={toAbsoluteUrl('/media/flags/united-kingdom.svg')}
                            className='h-50 align-self-center'
                            alt=''
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
                        Improving the social skills of ASD people using visual stories
                      </a>
                    </td>
                    <td className='text-end text-muted fw-semibold'></td>
                    <td className='text-end'>
                      <span className='badge badge-light-success'>Available</span>
                    </td>
                    <td className='text-end'>
                      <a
                        href='https://pass4autism.thinkific.com/' target='{_blank}'
                        rel='noopener noreferrer' className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                      >
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr064.svg'
                          className='svg-icon-2'
                        />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className='symbol symbol-45px me-2'>
                        <span className='symbol-label'>
                          <img
                            src={toAbsoluteUrl('/media/flags/spain.svg')}
                            className='h-50 align-self-center'
                            alt=''
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
                        Mejora de habilidades sociales de personas con TEA mediante historias visuales
                      </a>
                    </td>
                    <td className='text-end text-muted fw-semibold'></td>
                    <td className='text-end'>
                      <span className='badge badge-light-success'>Available</span>
                    </td>
                    <td className='text-end'>
                      <a
                        href='https://pass4autism-es.thinkific.com/' target='{_blank}'
                        rel='noopener noreferrer' className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                      >
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr064.svg'
                          className='svg-icon-2'
                        />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className='symbol symbol-45px me-2'>
                        <span className='symbol-label'>
                          <img
                            src={toAbsoluteUrl('/media/flags/greece.svg')}
                            className='h-50 align-self-center'
                            alt=''
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
                        Βελτιώνοντας τις κοινωνικές δεξιότητες των ατόμων με ΔΑΦ με τη χρήση οπτικών ιστοριών
                      </a>
                    </td>
                    <td className='text-end text-muted fw-semibold'></td>
                    <td className='text-end'>
                      <span className='badge badge-light-success'>Available</span>
                    </td>
                    <td className='text-end'>
                      <a
                        href='https://pass4autism-gr.thinkific.com/' target='{_blank}'
                        rel='noopener noreferrer' className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                      >
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr064.svg'
                          className='svg-icon-2'
                        />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className='symbol symbol-45px me-2'>
                        <span className='symbol-label'>
                          <img
                            src={toAbsoluteUrl('/media/flags/italy.svg')}
                            className='h-50 align-self-center'
                            alt=''
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
                        Migliorare le abilità sociali delle persone con ASD utilizzando storie visive
                      </a>
                    </td>
                    <td className='text-end text-muted fw-semibold'></td>
                    <td className='text-end'>
                      <span className='badge badge-light-success'>Available</span>
                    </td>
                    <td className='text-end'>
                      <a
                        href='https://pass4autism-it.thinkific.com/' target='{_blank}'
                        rel='noopener noreferrer' className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                      >
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr064.svg'
                          className='svg-icon-2'
                        />
                      </a>
                    </td>
                  </tr>
                </tbody>
                {/* end::Table body */}
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}
        </div>
      </div>
      {/* end::Body */}
    </div>
  )
}

export {TablesWidget5}
