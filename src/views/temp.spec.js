import temp from './temp.vue';
import { render, screen } from '@testing-library/vue';

it('has Sign up header', () => {
    render(temp);
    const header = screen.queryByRole('heading', { name: 'Sign Up' });
    expect(header).not.toBeNull();
});
