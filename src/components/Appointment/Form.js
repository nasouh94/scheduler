import React, {useState} from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(null);
  function reset() {
    setName("")
    setInterviewer(null)
  }

  return (
    <main className="appointment__card appointment__card--create">
  <section className="appointment__card-left">
    <form onSubmit={event => event.preventDefault()} autoComplete="off">
      <input
        className="appointment__create-input text--semi-bold"
        name="name"
        type="text"
        placeholder="Enter Student Name"
        value={name}
        onChange={event => {
          setName(event.target.value);
        }}
      
      />
    </form>
    <InterviewerList interviewers={props.interviewers}
     value={interviewer}
     interviewer={interviewer}
     setInterviewer={setInterviewer}
      />
  </section>
  <section className="appointment__card-right">
    <section className="appointment__actions">
      <Button onClick={() => props.onCancel(reset())} danger>Cancel</Button>
      <Button onClick={() => props.onSave(name, interviewer)} confirm>Save</Button>
    </section>
  </section>
</main>
  )
}