import React from "react";
import {
	render,
	cleanup,
	prettyDOM,
	getByText,
	getAllByTestId,
	getByAltText,
	getByPlaceholderText,
	queryByText,
	queryByAltText
} from "@testing-library/react";
import { waitForElement } from "@testing-library/react";
import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
	it("defaults to Monday and changes the schedule when a new day is selected", async () => {
		const { getByText } = render(<Application />);

		await waitForElement(() => getByText("Monday"));

		fireEvent.click(getByText("Tuesday"));

		expect(getByText("Leopold Silvers")).toBeInTheDocument();
	});
	it("loads data, books an interview and reduces the spots remaining for monday by 1", async () => {
		const { container, debug } = render(<Application />);

		await waitForElement(() => getByText(container, "Archie Cohen"));

		const appointments = getAllByTestId(container, "appointment");
		const appointment = appointments[0];

		fireEvent.click(getByAltText(appointment, "Add"));

		fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
			target: { value: "Lydia Miller-Jones" }
		});
		fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

		fireEvent.click(getByText(appointment, "Save"));

		expect(getByText(appointment, "Saving")).toBeInTheDocument();

		await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

		const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));

		expect(getByText(day, "no spots remaining")).toBeInTheDocument();
	});

	it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
		// 1. Render the Application.
		const { container } = render(<Application />);
		// 2. Wait until the text "Archie Cohen" is displayed.
		await waitForElement(() => getByText(container, "Archie Cohen"));
		// 3. Click the "Delete" button on the booked appointment.
		const appointment = getAllByTestId(container, "appointment").find((appointment) =>
			queryByText(appointment, "Archie Cohen")
		);
		fireEvent.click(queryByAltText(appointment, "Delete"));
		// 4. Check that the confirmation message is shown.
		expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
		// 5. Click the "Confirm" button on the confirmation.
		fireEvent.click(getByText(appointment, "Confirm"));
		// 6. Check that the element with the text "Deleting" is displayed.
		expect(getByText(appointment, "Deleting")).toBeInTheDocument();
		// 7. Wait until the element with the "Add" button is displayed.
		await waitForElement(() => getByAltText(appointment, "Add"));
		// 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
		const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));

		expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
	});
	it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
		// 1. Render the Application.
		const { container } = render(<Application />);
		// 2. Wait until the text "Archie Cohen" is displayed.
		await waitForElement(() => getByText(container, "Archie Cohen"));
		// 3. Click the "Edit" button on the booked appointment.
		const appointment = getAllByTestId(container, "appointment").find((appointment) =>
			queryByText(appointment, "Archie Cohen")
		);
		fireEvent.click(queryByAltText(appointment, "Edit"));
		// 4. Target the field with enter student name
		fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
			target: { value: "Lydia Miller-Jones" }
		});
		// 5. Save appointment
		fireEvent.click(getByText(appointment, "Save"));
		// 6. Saving sate
		expect(getByText(appointment, "Saving")).toBeInTheDocument();
		// 7. Once saved, wait for appointment "Lydia Miller-Jones" to display
		await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
		// 8. Check that the DayListItem with the text "Monday" and make sure the spots didn"t change
		const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
		expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
	});

	it("shows the save error when failing to save an appointment", async () => {
		axios.put.mockRejectedValueOnce();

		// 1. Render the Application.
		const { container } = render(<Application />);
		// 2. Wait until the text "Archie Cohen" is displayed.
		await waitForElement(() => getByText(container, "Archie Cohen"));
		// get the appointment spot
		const appointments = getAllByTestId(container, "appointment");
		const appointment = appointments[0];
		// add appointment
		fireEvent.click(getByAltText(appointment, "Add"));
		// 5. Enters the name for an appointment
		fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
			target: { value: "Lydia Miller-Jones" }
		});
		fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
		// 6. save button
		fireEvent.click(getByText(appointment, "Save"));
		// 7. Check that the element with the text "Saving" is displayed.
		expect(getByText(appointment, "Saving")).toBeInTheDocument();
		// error message
		await waitForElement(() => getByText(appointment, "Could not save appointment."));
	});

	it("shows the delete error when failing to delete an existing appointment", async () => {
		axios.delete.mockRejectedValueOnce();

		// 1. Render the Application.
		const { container } = render(<Application />);

		// 2. Wait until the text "Archie Cohen" is displayed.
		await waitForElement(() => getByText(container, "Archie Cohen"));

		// 3. Click the "Delete" button on the booked appointment.
		const appointment = getAllByTestId(container, "appointment").find((appointment) =>
			queryByText(appointment, "Archie Cohen")
		);

		fireEvent.click(queryByAltText(appointment, "Delete"));

		// 4. Check that the confirmation message is shown.
		expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

		// 5. click the "Confirm" button on the confirmation.
		fireEvent.click(getByText(appointment, "Confirm"));

		// 6. check that the element with the text "Deleting" is displayed.
		expect(getByText(appointment, "Deleting")).toBeInTheDocument();

		// 7. error message is shown
		await waitForElement(() => getByText(appointment, "Could not delete appointment."));
	});
});
