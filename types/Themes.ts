export type ThemesType = {
  name: 'light' | 'dark';
  dark: boolean;
  colors: {
    background: string;
    border: string;
    card: string;
    notification: string;
    primary: string;
    text: string;
    activity: string;
  };
};