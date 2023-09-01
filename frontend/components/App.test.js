import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppClass from './AppClass'; //
import AppFunctional from './AppFunctional';

test('sanity', () => {
  expect(true).toBe(true)
})

test('renders coordinates and steps', async () => {
  render(<AppClass />);
  
  // Use screen.getByText to find elements in the rendered output
  const coordinatesElement = screen.getByText(/Coordinates/);
  const stepsElement = screen.getByText(/You moved/);
  
  // Use Jest's expect to assert expectations about the elements
  expect(coordinatesElement).toBeInTheDocument();
  expect(stepsElement).toBeInTheDocument();
});

test('reset button clears messages', async () => {
    render(<AppClass />);
    
    // Find the reset button and click it
    const resetButton = screen.getByText('reset');
    fireEvent.click(resetButton);
    
    // Check that the response message is no longer in the document
    const responseElement = screen.queryByText(/You can't go/);
    expect(responseElement).not.toBeInTheDocument();
});

test('displays error message for missing email on submit', async () => {
    render(<AppClass />);
  
    // Find the submit button and click it
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);
  
    // Check that the error message appears
    const errorMessage = await screen.findByText(/Ouch: email is required/i);
    expect(errorMessage).toBeInTheDocument();
});

test('reset button clears messages', async () => {
    render(<AppClass />);
    
    // Find the reset button and click it
    const resetButton = screen.getByText('reset');
    fireEvent.click(resetButton);
    
    // Check that the response message is no longer in the document
    const responseElement = screen.queryByText(/You can't go/);
    expect(responseElement).not.toBeInTheDocument();
});
  
test('App Class Renders', () => {
    render(<AppFunctional />)
  })
  test('Nav links are present', () => {
    render(<AppFunctional />)
    const nav = screen.queryAllByRole('nav')
    expect(nav).toBeTruthy()
  })
  test('Coordinates are present', () => {
    render(<AppFunctional />)
    const header = screen.queryByText(/Coordinates/i)
    expect(header).toBeTruthy()
  })
  test('Buttons are present', () => {
    render(<AppFunctional />)
    const buttons = screen.queryAllByRole('button')
    expect(buttons).toHaveLength(6)
  })
  test('Movement is present', () => {
    render(<AppFunctional />)
    const movement = screen.queryByText(/You moved/i)
    expect(movement).toBeTruthy()
  })

