import {useMemo, useEffect, useState} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomHeaderColumn} from '../table/columns/CustomHeaderColumn'
import {CustomRow} from '../table/columns/CustomRow'
import {usersColumns} from './columns/_columns'
import {User} from '../core/_models'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {UsersListPagination} from '../components/pagination/UsersListPagination'
import {ID, KTCardBody} from '../../../../../../_metronic/helpers'
import KcAdminClient from 'keycloak-admin';

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const kcAdminClient = useMemo(() => new KcAdminClient({
    baseUrl: 'https://195.251.8.195:8443',
  }), []);

  // Συνάρτηση Αυθεντικοποίησης στο Keycloak Admin API
  const authenticateAdmin = async () => {
    try {
      await kcAdminClient.auth({
        username: 'admin',
        password: 'admin',
        grantType: 'password',
        clientId: 'admin-cli',
      });
    } catch (error) {
      console.error('Authentication failed', error);
    }
  };

  // Λήψη όλων των χρηστών από το Keycloak
  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      await authenticateAdmin();
      const fetchedUsers = await kcAdminClient.users.find({ realm: 'pass4autism' });
      
      // Φέρνουμε τους ρόλους για κάθε χρήστη
      const usersWithRoles = await Promise.all(
        fetchedUsers.map(async (user) => {
          const roles = await kcAdminClient.users.listRealmRoleMappings({
            realm: 'pass4autism',
            id: user.id!,
          });

          const roleMap = {
            admin: 'Administrator',
            therapist: 'Therapist',
            user: 'User',
          };
          
          const getHighestRole = (roles: any) => {
            if (roles.some((role: any) => role.name === 'admin')) return 'Administrator';
            if (roles.some((role: any) => role.name === 'therapist')) return 'Therapist';
            return 'User';
          };

          return {
            id: user.id as ID, // Μετατροπή id
            name: user.firstName + ' ' + user.lastName,
            firstName: user.firstName || 'N/A',
            lastName: user.lastName || 'N/A',
            email: user.email || 'N/A',
            username: user.username || 'N/A',
            enabled: user.enabled ?? false,
            role: getHighestRole(roles)
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Φόρτωση των χρηστών κατά το mount
  useEffect(() => {
    getAllUsers();
  }, []);

  // Συνάρτηση για την διαγραφή χρήστη με επιβεβαίωση
  const deleteUser = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?")
    if (isConfirmed) {
      try {
        await authenticateAdmin(); // Αυθεντικοποίηση στο Keycloak
        await kcAdminClient.users.del({ realm: 'pass4autism', id }); // Διαγραφή χρήστη από το Keycloak
        getAllUsers(); // Ανανεώνουμε τη λίστα χρηστών μετά τη διαγραφή
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  // Διαμορφώνουμε τα δεδομένα στον πίνακα
  const data = useMemo(() => users, [users])
  const columns = useMemo(() => usersColumns, [])
  const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable({
    columns,
    data,
  })

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table
          id='kt_table_users'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}
        >
          <thead>
            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              {headers.map((column: ColumnInstance<User>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<User>, i) => {
                prepareRow(row)
                //return <CustomRow row={row} key={`row-${i}-${row.id}`} />
                return (
                  <CustomRow row={row} key={`row-${i}-${row.id}`}>
                    <>
                      <a
                        className='btn btn-light btn-active-light-primary btn-sm'
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        onClick={() => deleteUser(String(row.original.id))}
                      >
                        Delete
                      </a>
                    </>
                  </CustomRow>
                )
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                    No matching records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <UsersListPagination /> */}
      {/* {isLoading && <UsersListLoading />} */}
    </KTCardBody>
  )
}

export {UsersTable}
