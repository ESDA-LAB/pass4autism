import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {
  MixedWidget2,
  MixedWidget10,
  MixedWidget11,
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget5,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  StatisticsWidget5,
  ListsWidget1,
} from '../../../_metronic/partials/widgets'

const DashboardPage = () => (
  <>
    {/* begin::Row */}
    <div className='row g-5 g-xl-8'>
      <div className="col-xl-4">
        <button onClick={() => window.open('http://localhost:3011/metronic8/react/demo8/createStory', '_blank')}
                style={{background: 'none', border: 'none', padding: '0', cursor: 'pointer'}}>
          <StatisticsWidget5
            className="card-xl-stretch mb-xl-8"
            svgIcon="/media/icons/duotune/general/gen005.svg"
            color="primary"
            iconColor="white"
            title="Create a new Visual Story"
            description="Create and save a visual story through keywords"
            titleColor="white"
            descriptionColor="white"
          />
        </button>
      </div>

      <div className="col-xl-4">
        <button onClick={() => window.open('https://pass4autism-project.eu/', '_blank')}
                style={{background: 'none', border: 'none', padding: '0', cursor: 'pointer'}}>
          <StatisticsWidget5
            className="card-xl-stretch mb-5 mb-xl-8"
            svgIcon="/media/icons/duotune/general/gen004.svg"
            color="dark"
            iconColor="gray-100"
            title="View Visual Stories"
            description="View and guide throuth the created Visual Stories"
            titleColor="gray-100"
            descriptionColor="gray-100"
          />
        </button>
      </div>

      <div className='col-xl-4'>
        <button onClick={() => window.open('https://pass4autism-project.eu/', '_blank')}
                style={{background: 'none', border: 'none', padding: '0', cursor: 'pointer'}}>
          <StatisticsWidget5
            className="card-xl-stretch mb-xl-10"
            svgIcon="/media/icons/duotune/electronics/elc001.svg"
            color="body-white"
            iconColor="primary"
            title="Visit our Website"
            description="Learn more about the project - PASS4Autism"
            titleColor="gray-900"
            descriptionColor="gray-400"
          />
        </button>

      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className="row g-5 g-xl-8">
      {/* begin::Col */}
      <div className='col-xl-12'>
        <TablesWidget5 className='card-xl-stretch mb-5 mb-xl-8' />
      </div>
      {/* end::Col */}
    </div>
  </>
)

const DashboardWrapper = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}