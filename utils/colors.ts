import { Themes } from "../types/Themes";

export const colors = {
  blue: '#2196F3',
  verified: '#40ce08',
  lime: '#21f344',
  gray: '#b3b3b3',
  white: '#ffffff',
  red: '#f32121',
  black: '#000000',
  eyePress: '#rgba(236, 236, 236, 0.288)',
  undo: '#6e6e6e',
  green: 'green',
  darkRed: '#bd2727',
  notApproved: '#868686',
  badRoute: '#e71313',
  midRoute: '#fad507',
};

export const DarkTheme: Themes = {
  dark: false,
  colors: {
    background: 'rgb(1, 1, 1)',
    border: 'rgb(39, 39, 41)',
    card: 'rgb(18, 18, 18)',
    notification: 'rgb(255, 69, 58)',
    primary: 'rgb(10, 132, 255)',
    text: 'rgb(229, 229, 231)',
    activity: 'rgb(229, 229, 231)',
  },
};

export const LightTheme: Themes = {
  dark: false,
  colors: {
    background: 'rgb(242, 242, 242)',
    border: 'rgb(216, 216, 216)',
    card: 'rgb(255, 255, 255)',
    notification: 'rgb(255, 59, 48)',
    primary: 'rgb(0, 122, 255)',
    text: 'rgb(28, 28, 30)',
    activity: 'rgb(0, 122, 255)',
  },
};
