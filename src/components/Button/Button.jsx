import classes from './Button.module.css';

export default function Button({ children, isActive, variant, ...props }) {
  let buttonClasses = classes.button;
  if (isActive) {
    buttonClasses += ` ${classes.active}`;
  }
  if (variant === 'secondary') {
    buttonClasses += ` ${classes.secondary}`;
  }

  return (
    <button
      {...props}
      className={buttonClasses}
    >
      {children}
    </button>
  );
}