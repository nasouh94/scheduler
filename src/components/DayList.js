import React from 'react';
import DayListItem from 'components/DayListItem';

export default function DayList(props) {
	const { appointments, days, getSpotsForDay, selectedDay, setDay } = props;

	const dayList = props.days.map((day) => {
		return (
			<DayListItem
				key={day.id}
				name={day.name}
				spots={getSpotsForDay(appointments, days, day)}
				selected={day.name === selectedDay}
				setDay={setDay}
			/>
		);
	});
	return dayList;
}
