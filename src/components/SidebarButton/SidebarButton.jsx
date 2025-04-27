import './SidebarButton.css'

export default function SidebarButton({ children, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={isActive ? 'button active' : 'button'}
    >
      {children}
    </button>
  )
}