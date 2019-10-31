import React from "react";

import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form"
import useVisualMode from "hooks/useVisualMode";
import Status from "components/Appointment/Status";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVE";
const DELETING = "DELETE";
const CONFIRM = "CONFIRM";


export default function Appointment(props) {
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function saveInterview(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    return interview

  }
  
  function cancel() {
    return props.cancelInterview(props.id)
  }


  return(
    <article className="appointment">
      < Header time={props.time} />
      
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      
      {mode === SHOW && (<Show
    student={props.interview.student}
    interviewer={props.interview.interviewer}
    onDelete={() => transition(CONFIRM)}
    />)}

  {mode === CONFIRM && <Confirm
    message= "Are You Sure You Want To Delete?"
    onDelete={() => {transition(DELETING)
      cancel().then(() => transition(EMPTY))}}
    onCancel={() => back()}
  />}

  {mode === DELETING && <Status message="Deleting" />}
  
  {mode === SAVING && <Status message="Saving" />}
  
  {mode === CREATE && (<Form 
  interviewers={props.interviewers}
   onCancel={() => back()}
   onSave={(name, interviewer) => {transition(SAVING);
    props.bookInterview(props.id, saveInterview(name, interviewer)).then(() => transition(SHOW))
}}
   />)}
    </article>
  );
}

