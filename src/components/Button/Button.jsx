import './Button.css'

export default function Botton({ children, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={isActive ? 'botton active' : 'botton'}
    >
      {children}
    </button>
  )
}