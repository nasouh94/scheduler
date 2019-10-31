import React, { useState , useEffect} from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "components/DayList"
import Appointment from "components/Appointment"
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from '../helpers/selectors';


export default function Application(props) {
  
   function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
  }
    const appointments = {
      ...state.appointments,
      [id]: appointment
  };
  
  // setState({...state, appointments});

  return axios.put(`/api/appointments/${id}`, {interview})
  .then((response) => {
    if(response.status === 204) {

      setState(prev => ({...prev, appointments}));
    }
  }).catch(error => {
    console.log(error)
  })

}

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then((response) => {
        console.log(response)
      }).catch(error => {
        console.log("delete error")
      })
      
  }


  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers"))
    ]).then((all) => {
      setState(prev => ({... prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
        <img
  className="sidebar--centered"
  src="images/logo.png"
  alt="Interview Scheduler"
/>
<hr className="sidebar__separator sidebar--centered" />
<nav className="sidebar__menu">
<DayList
  days={state.days}
  day={state.day}
  setDay={setDay}
/>
</nav>
<img
  className="sidebar__lhl sidebar--centered"
  src="images/lhl.png"
  alt="Lighthouse Labs"
/>
      </section>
      <section className="schedule">
        {getAppointmentsForDay(state, state.day).map(appointment => {
          const interviewers = getInterviewersForDay(state, state.day)
          const interview = getInterview(state, appointment.interview)
          return <Appointment 
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={interview}
          interviewers={interviewers} 
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
          />
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
