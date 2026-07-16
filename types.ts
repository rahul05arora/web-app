// types.ts
export type RootStackParamList = {
  Login: undefined; // Screen doesn't take parameters
  Dashboard: { token: string }; // Dashboard requires a valid token payload passed to it
};