import classes from './CheckButton.module.css'

export default function CheckButton({ children, onClick, isImportant }) {
  return (
    <button
      className={isImportant ? `${classes.button} ${classes.important}` : classes.button}
      onClick={onClick}>
      {children}
    </button>
  )
}