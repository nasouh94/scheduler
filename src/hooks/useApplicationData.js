import React,{ useEffect , useState } from "react";
import axios from "axios";

export default function useApplicationData() {
  
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // setState({...state, appointments});

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(response => {
        if (response.status === 204) {
          setState(prev => ({ ...prev, appointments }));
        }
      })
      .catch(error => {
        console.log(error);
      });
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
  return { bookInterview, cancelInterview, state, setDay };
}
