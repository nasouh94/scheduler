import React ,{ useState } from "react";
import InterviewerListItem from "components/InterviewerListItem"
import "components/InterviewerList.scss"
import classnames from "classnames";


export default function InterviewerList(props) {
  const [ selected, changeSelected] = useState(props.interviewer)
  const selectInterviewer = id => {
    changeSelected(id);
    props.setInterviewer(id)

  }
  const interviewer = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem 
      key={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      interviewId={interviewer.id}
      selected={interviewer.id === props.interviewer}
      setInterviewer={event => props.setInterviewer(interviewer.id)} />
    );
  });
  return <section className="interviewers">
  <h4 className="interviewers__header text--light">Interviewer</h4> 
  <ul className="interviewers__list">{interviewer}</ul>
</section>
  
}