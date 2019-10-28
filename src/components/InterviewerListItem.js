import React from "react";
import "components/InterviewerListItem.scss"
let classnames = require('classnames');

export default function InterviewerListItem(props) {
  
  const intervieweritemClass = classnames("interviewers__item",{
    "interviewers__item--selected": props.selected
  })

  // const interviewerItemImageClass = classnames("interviewers__item-image", {
  //   "interviewers__item--selected-image": props.selected && props.image
  // });
  
  
  return (
    <li className={intervieweritemClass} onClick={props.setInterviewer}>
  <img
    className="interviewers__item-image"
    src={props.avatar}
    alt={props.name}
  />
  {props.selected && props.name}
</li>
  )
}