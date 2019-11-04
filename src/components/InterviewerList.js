import React, { useState } from 'react';
import InterviewerListItem from 'components/InterviewerListItem';
import 'components/InterviewerList.scss';
import PropTypes from 'prop-types';



export default function InterviewerList(props) {

	InterviewerList.propTypes = {
		value: PropTypes.number,
		onChange: PropTypes.func.isRequired
	};

	const interviewer = props.interviewers.map((interviewer) => {
		return (
			<InterviewerListItem
				key={interviewer.id}
				name={interviewer.name}
				avatar={interviewer.avatar}
				interviewId={interviewer.id}
				selected={interviewer.id === props.value}
				setInterviewer={() => props.onChange(interviewer.id)}
			/>
		);
	});
	return (
		<section className="interviewers">
			<h4 className="interviewers__header text--light">Interviewer</h4>
			<ul className="interviewers__list">{interviewer}</ul>
		</section>
	);
}
