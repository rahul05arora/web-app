import { render } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

// Mock out the navigation props array parameters 
const mockNavigation = {
  replace: jest.fn(),
} as any;

// Mock the native hardware SecureStore engine so tests run flawlessly in headless workflows
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
}));

describe('Mobile Login View Layer Layout Verification', () => {
  it('should render the default terminal entry form screen items correctly on initial paint', async () => {
    const { getByPlaceholderText, getByText } = await render(<LoginScreen navigation={mockNavigation} />);
    
    // Check if critical visual identifiers render cleanly
    expect(getByPlaceholderText('Enter Terminal PIN')).toBeTruthy();
    expect(getByText('Authorize')).toBeTruthy();
  });
});