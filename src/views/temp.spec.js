// src/views/temp.spec.js
import '@testing-library/jest-dom'; // add this at the top
import { render, screen } from '@testing-library/vue';
import Temp from './temp.vue';

it('renders Name field inside PagePaymentGateway', async () => {
  render(Temp, {
    global: {
      mocks: {
        $route: { params: { pathMatch: 'signup' }, query: { order_id: '12345' } },
      },
      stubs: { 'b-button': true },
    },
  });

  const nameField = await screen.findByText(/Name:/i);
  expect(nameField).toBeInTheDocument(); // now works
});