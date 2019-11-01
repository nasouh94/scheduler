import React, { useState } from 'react';

export default function useVisualMode(initial) {
	const [ mode, setMode ] = useState(initial);
	const [ history, setHistory ] = useState([ initial ]);

	function transition(newMode, replace) {
		if (!replace) {
			setHistory((prev) => [ ...prev, mode ]);
		}
		setMode(newMode);
	}
	function back() {
		if (history.length >= 1) {
			setMode(history[history.length - 1]);
			setHistory((prev) => [ ...prev.slice(0, -1) ]);
		}
	}
	return { mode, transition, back };
}
