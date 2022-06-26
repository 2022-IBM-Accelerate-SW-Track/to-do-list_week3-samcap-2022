import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);

  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "11/10/2023";

  fireEvent.change(inputTask, { target: { value: "Some Task"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  fireEvent.change(inputTask, { target: { value: "Some Task"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  // error if more than 1 is found
  const checkTask = screen.getByText(/Some Task/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));

  expect(checkTask).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
 });



 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "11/10/2023";

  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
 });



 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const element = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, { target: { value: "Some Task"}});
  fireEvent.click(element);

  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "11/10/2023";

  fireEvent.change(inputTask, { target: { value: "Some Task"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
 });



 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const futureDate = "11/10/2023";
  const pastDate = "11/10/2020";
  
  fireEvent.change(inputTask, { target: { value: "FutureTask"}});
  fireEvent.change(inputDate, { target: { value: futureDate}});
  fireEvent.click(element);

  fireEvent.change(inputTask, { target: { value: "PastTask"}});
  fireEvent.change(inputDate, { target: { value: pastDate}});
  fireEvent.click(element);

  const futureColor = screen.getByTestId(/FutureTask/i).style.background;
  const pastColor = screen.getByTestId(/PastTask/i).style.background;

  expect(futureColor != pastColor);
 });
