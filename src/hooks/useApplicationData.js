import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";


export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    const {appointments,  day, days, id, interview, interviewers, type } = action
    switch (type) {
      case SET_DAY:
        return {
          ...state, day
        };
      case SET_APPLICATION_DATA:
        return {
          ...state, days, appointments, interviewers
        };
      case SET_INTERVIEW: {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        return { ...state, id, appointments };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${type}`
        );
    }
  }

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
          dispatch({type: SET_INTERVIEW, id ,interview})
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function cancelInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log("delete error");
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
        interviewers: all[2].data })

    });
  }, []);
  return { bookInterview, cancelInterview, state, setDay };
}
