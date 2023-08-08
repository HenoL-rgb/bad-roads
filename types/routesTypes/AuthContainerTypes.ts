export enum authScreens {
  Login = 'Login',
  Register = 'Register',
}

export type AuthStack = {
  [authScreens.Login]: undefined;
  [authScreens.Register]: undefined;
};
