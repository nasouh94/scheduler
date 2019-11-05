import React, { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  function bookInterview(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(response => {
        if (response.status === 204) {
          dispatch({ type: SET_INTERVIEW, id, interview });
        }
      })
      .catch(error => {
        throw new Error(error)
      });
  }

  function cancelInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(response => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
      })
      .catch(error => {
        throw new Error(error)
      });
  }

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers"))
    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
  }, []);

  function getSpotsForDay(appointments, days, day) {
    const targetDay = days.find(target => target.name === day.name);
    const appointmentList = [...targetDay.appointments];
    const totalSpots = appointmentList.length;
    const appointmentsSpread = { ...appointments };

    const filledSpots = Object.values(appointmentsSpread).reduce(
      (total, appointment) => {
        if (appointmentList.includes(appointment.id)) {
          if (appointment.interview) {
            return total + 1;
          }
        }
        return total;
      },
      0
    );
    return totalSpots - filledSpots;
  }

  return { bookInterview, cancelInterview, state, setDay, getSpotsForDay };
}
