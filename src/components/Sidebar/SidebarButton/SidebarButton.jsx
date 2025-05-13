import './SidebarButton.css'

import { ReactComponent as FilterIcon } from '../../../icons/FilterIcon19.svg'
import { ReactComponent as PlusIcon } from '../../../icons/PlusIcon19.svg'



export default function SidebarButton({ children, isActive, onClick, buttonType }) {
  return (
    <button
      onClick={ onClick }
      className={
        buttonType === 'addTask' ? (
          isActive ? 'button active' : 'button addTask'
        ) : (
          isActive ? 'button active' : 'button'
        )
      }
    >
      { buttonType === 'addTask' ? <PlusIcon /> : <FilterIcon /> }
      { children }
    </button>
  )
}