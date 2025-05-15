import { createPortal } from 'react-dom'
import { useRef, useEffect } from 'react'
import classes from './Modal.module.css'
 

export default function Modal({ children, open, modelType, onCloseModal }) {
  const dialog = useRef()

  useEffect(() => {
    const modal = dialog.current;
    if (open) {
        modal.showModal();
    } else {
        // Добавляем проверку, открыт ли диалог перед вызовом close()
        // Это предотвращает ошибку, если close() вызывается для уже закрытого диалога
        if (modal.open) {
            modal.close();
        }
    }
  }, [open]);

  useEffect(() => {
    const modal = dialog.current;

    const handleDialogClose = () => {
      if (onCloseModal && open) { 
        onCloseModal();
      }
    };

    modal.addEventListener('close', handleDialogClose);

    return () => {
      modal.removeEventListener('close', handleDialogClose);
    };
  }, [onCloseModal, open]);

  let dialogClasses = classes.dialog;
  if (modelType === 'delete') {
    dialogClasses += ` ${classes.delete}`;
  } else if (modelType === 'default') { // Можно добавить для явности или если будут другие типы
    dialogClasses += ` ${classes.default}`;
  }


  return(
    createPortal(
      <dialog
        ref={ dialog }
        className={dialogClasses}
      >
        { children }
      </dialog>,
      document.getElementById('modal')
    )
  )
}