import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Appointment from 'components/Appointment';

describe('Appointment', () => {
	it('redners appointment element', () => {
		render(<Appointment />);
	});

	it("dosen't call the function", () => {
		const fn = jest.fn();
		expect(fn).toHaveBeenCalledTimes(0);
	});
	it('calls the function', () => {
		const fn = jest.fn();
		fn();
		expect(fn).toHaveBeenCalledTimes(1);
	});
	it('calls the function with an argument', () => {
		const fn = jest.fn();
		fn(5);
		expect(fn).toHaveBeenCalledWith(5);
	});
	it('uses fake function implemntation', () => {
		const fn = jest.fn((a, b) => 3);
		fn(1, 2);
		expect(fn).toHaveReturnedWith(3);
	});
});
