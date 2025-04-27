import './SidebarButton.css'

import { ReactComponent as FilterIcon } from '../../../icons/FilterIcon19.svg'
import { ReactComponent as PlusIcon } from '../../../icons/PlusIcon19.svg'

export default function SidebarButton({ children, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={isActive ? 'button active' : 'button'}
    >
      {children === 'Добавить задачу' ? <PlusIcon /> : <FilterIcon />}
      {children}
    </button>
  )
}