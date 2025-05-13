import { createPortal } from 'react-dom'
import { useRef, useEffect } from 'react'
import classes from './Modal.module.css'
 
import CreateTaskForm from '../CreateTaskForm/CreateTaskForm'

export default function Modal({ children, open, modelType }) {
  const dialog = useRef()

  useEffect(() => {
    if (open) {
        dialog.current.showModal()
    } else {
        dialog.current.close()
    }
  }, [open])

  return(
    createPortal(
      <dialog
        ref={ dialog }
        className={(modelType === 'delete') ? `${classes.dialog} ${classes.delete}` : classes.dialog}
      >
        { children }
      </dialog>,
      document.getElementById('modal')
    )
  )
}