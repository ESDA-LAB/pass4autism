/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG} from '../../../helpers'

type Props = {
  className: string
  color: string
  svgIcon: string
  iconColor: string
  title: string
  titleColor?: string
  description: string | React.ReactNode // Υποστηρίζει HTML ή JSX
  descriptionColor?: string
}

const StatisticsWidget5: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  title,
  titleColor,
  description,
  descriptionColor,
}) => {
  return (
    <div className={`card bg-${color} hoverable ${className}`}>
      <div className='card-body'>
        <KTSVG path={svgIcon} className={`svg-icon-${iconColor} svg-icon-3x ms-n1`} />

        <div className={`text-${titleColor} fw-bold fs-2 mb-2 mt-5`}>{title}</div>

        {/* Αν το description είναι string, επιτρέπουμε HTML με dangerouslySetInnerHTML */}
        {typeof description === 'string' ? (
          <div
            className={`fw-semibold text-${descriptionColor}`}
            dangerouslySetInnerHTML={{__html: description}}
          />
        ) : (
          // Αν το description είναι JSX ή React node, το εμφανίζουμε κανονικά
          <div className={`fw-semibold text-${descriptionColor}`}>{description}</div>
        )}
      </div>
    </div>
  )
}

export {StatisticsWidget5}
