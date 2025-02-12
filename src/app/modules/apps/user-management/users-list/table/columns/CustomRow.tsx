import clsx from 'clsx'
import { FC } from 'react'
import { Row } from 'react-table'
import { User } from '../../core/_models'

type Props = {
  row: Row<User>;
  children?: React.ReactNode;  // Προσθέτουμε το children
}

const CustomRow: FC<Props> = ({ row, children }) => (
  <tr {...row.getRowProps()}>
    {row.cells.map((cell) => {
      return (
        <td
          {...cell.getCellProps()}
          className={clsx({ 'text-end min-w-100px': cell.column.id === 'actions' })}
        >
          {cell.render('Cell')}
          {cell.column.id === 'actions'? children: ''} {/* Εδώ θα τοποθετηθούν τα children */}
        </td>
      )
    })}
  </tr>
)

export { CustomRow }
