import React from 'react';

import 'components/Appointment/styles.scss';
import Header from 'components/Appointment/Header';
import Empty from 'components/Appointment/Empty';
import Show from 'components/Appointment/Show';
import Form from 'components/Appointment/Form';
import Error from 'components/Appointment/Error';
import useVisualMode from 'hooks/useVisualMode';
import Status from 'components/Appointment/Status';
import Confirm from './Confirm';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVE';
const DELETING = 'DELETE';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';

export default function Appointment(props) {
	const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

	function saveInterview(name, interviewer) {
		if (name && interviewer) {
			const interview = {
				student: name,
				interviewer
			};
			transition(SAVING);
			props.bookInterview(props.id, interview).then(() => transition(SHOW)).catch(() => {
				transition(ERROR_SAVE, true);
			});
		} else {
			transition(ERROR_SAVE);
		}
	}

	function cancel(id) {
		transition(DELETING);
		props.cancelInterview(id).then(() => transition(EMPTY, true)).catch(() => transition(ERROR_DELETE, true));
	}

	return (
		<article className="appointment" data-testid="appointment">
			
			<Header time={props.time} />

			{mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

			{mode === SHOW && (
				<Show
					student={props.interview.student}
					interviewer={props.interview.interviewer}
					onDelete={() => transition(CONFIRM)}
					onEdit={() => transition(EDIT)}
				/>
			)}

			{mode === CREATE && (
				<Form
					interviewers={props.interviewers}
					onCancel={() => back()}
					onSave={(name, interviewer) => saveInterview(name, interviewer)}
				/>
			)}

			{mode === EDIT && (
				<Form
					interviewers={props.interviewers}
					name={props.interview.student}
					interviewer={props.interview.interviewer.id}
					onCancel={() => back()}
					onSave={(name, interviewer) => saveInterview(name, interviewer)}
				/>
			)}

			{mode === CONFIRM && (
				<Confirm
					message="Are You Sure You Want To Delete?"
					onDelete={() => {
						transition(DELETING);
						cancel(props.id);
					}}
					onCancel={() => back()}
				/>
			)}

			{mode === DELETING && <Status message="Deleting" />}
			{mode === SAVING && <Status message="Saving" />}

			{mode === ERROR_SAVE && <Error message="Could not save appointment." onClose={() => back()} />}

			{mode === ERROR_DELETE && <Error message="Could not delete appointment." onClose={() => back()} />}
		</article>
	);
}
