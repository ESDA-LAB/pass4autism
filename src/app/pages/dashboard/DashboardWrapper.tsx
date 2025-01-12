import { useIntl } from 'react-intl';
import { PageTitle } from '../../../_metronic/layout/core';
import {
  StatisticsWidget5,
  TablesWidget5,
} from '../../../_metronic/partials/widgets';
import { useNavigate } from 'react-router-dom';
import { MyStoriesGrid } from './components/MyStoriesGrid';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate(); // Χρήση του useNavigate για πλοήγηση

  // Inline styles για το grid
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };
  
  return (
    <>
      {/* begin::Row */}
      <div className="row g-5 g-xl-8">
        <div className="col-xl-4">
          <button
            onClick={() => navigate('/createStory')} // Πλοήγηση στο τοπικό /createStory
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
            }}
          >
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
          <button
            onClick={() => navigate('/ViewStory')} // Πλοήγηση στο τοπικό /ViewStory
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
            }}
          >
            <StatisticsWidget5
              className="card-xl-stretch mb-5 mb-xl-8"
              svgIcon="/media/icons/duotune/general/gen004.svg"
              color="dark"
              iconColor="gray-100"
              title="View Visual Stories"
              description="View and guide through the created Visual Stories"
              titleColor="gray-100"
              descriptionColor="gray-100"
            />
          </button>
        </div>

        <div className="col-xl-4">
          <button
            onClick={() => window.open('https://pass4autism-project.eu/', '_blank')} // Εξωτερικό URL
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
            }}
          >
            <StatisticsWidget5
              className="card-xl-stretch mb-xl-10"
              svgIcon="/media/icons/duotune/electronics/elc001.svg"
              color="secondary"
              iconColor="primary"
              title="Visit our Website"
              description="Learn more about the project - PASS4Autism"
              titleColor="gray-900"
              descriptionColor="gray-900"
            />
          </button>
        </div>
      </div>
      {/* end::Row */}

      {/* Welcome Message */}
      <div className="row g-5 g-xl-8">
        <div className="col-xl-12">  
          <div style={containerStyle}>
            <h2 style={titleStyle}>Welcome Message</h2>
          </div>
        </div>
      </div>

      {/* My Stories Section */}
      <div className="row g-5 g-xl-8">
        <div className="col-xl-12">
          <MyStoriesGrid />
        </div>
      </div>

      {/* begin::Row */}
      <div className="row g-5 g-xl-8">
        {/* begin::Col */}
        <div className="col-xl-12">
          <TablesWidget5 className="card-xl-stretch mb-5 mb-xl-8" />
        </div>
        {/* end::Col */}
      </div>
    </>
  );
};

const DashboardWrapper: React.FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };
