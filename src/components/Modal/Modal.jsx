import { createPortal } from 'react-dom'
import { useRef, useEffect } from 'react'
import classes from './Modal.module.css'
 
// CreateTaskForm не используется здесь напрямую, убрал импорт

export default function Modal({ children, open, modelType, onCloseModal }) { // Добавили onCloseModal
  const dialog = useRef()

  useEffect(() => {
    const modal = dialog.current;
    if (open) {
        modal.showModal();
    } else {
        modal.close();
    }
  }, [open]);

  // Добавляем useEffect для обработки события 'close' на диалоге
  useEffect(() => {
    const modal = dialog.current;

    const handleDialogClose = () => {
      if (onCloseModal && open) { // Вызываем onCloseModal только если модалка была открыта и есть обработчик
        onCloseModal();
      }
    };

    modal.addEventListener('close', handleDialogClose);

    return () => {
      modal.removeEventListener('close', handleDialogClose);
    };
  }, [onCloseModal, open]); // Добавляем open в зависимости, чтобы правильно удалять/добавлять слушатель

  return(
    createPortal(
      <dialog
        ref={ dialog }
        className={(modelType === 'delete') ? `${classes.dialog} ${classes.delete}` : classes.dialog}
        // onClose={onCloseModal} // Можно и так, но обработка через addEventListener 'close' более явная
      >
        { children }
      </dialog>,
      document.getElementById('modal')
    )
  )
}