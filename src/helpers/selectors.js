export function getAppointmentsForDay(state, day) {
	const appointmentsId = state.days
		.filter((i) => i.name === day)
		.map((i) => i.appointments)
		.reduce((acc, val) => acc.concat(val), []);

	const appointment = [];
	appointmentsId.forEach((i) => {
		appointment.push(state.appointments[i]);
	});
	return appointment;
};

export function getInterviewersForDay(state, day) {
	const interviewersId = state.days
		.filter((i) => i.name === day)
		.map((i) => i.interviewers)
		.reduce((acc, val) => acc.concat(val), []);

	const interviewers = [];
	interviewersId.forEach((i) => {
		interviewers.push(state.interviewers[i]);
	});

	return interviewers;
};

export function getInterview(state, interview) {
	if (!interview) {
		return null;
	} else {
		const student = interview.student;
		const interviewer = state.interviewers[interview.interviewer];
		const interviewObject = { student, interviewer };
		return interviewObject;
	}
};
