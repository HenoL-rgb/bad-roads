export type ThemesType = {
  name: themes;
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

export enum themes {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}
