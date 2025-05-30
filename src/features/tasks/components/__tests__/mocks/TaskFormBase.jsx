export default function MockTaskFormBase(props) {
  return (
    <div data-testid="task-form-base">
      <div>Mock TaskFormBase</div>
      <button onClick={() => props.onSubmitForm(props.initialTaskData)}>Submit</button>
      <button onClick={props.onCloseForm}>Close</button>
      {props.onInitiateDelete && <button onClick={props.onInitiateDelete}>Delete</button>}
      <div data-testid="initial-data">{JSON.stringify(props.initialTaskData)}</div>
      <div data-testid="is-update">{props.isUpdateForm.toString()}</div>
      <div data-testid="user-data">{JSON.stringify(props.loggedInUser)}</div>
      <div data-testid="task-to-edit">{JSON.stringify(props.taskToEdit)}</div>
    </div>
  )
} 