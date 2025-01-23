export interface UIComponent {
  // TODO: Remove this
  size?: string | number;
}

export type ResponsiveDesignObject = {
  base?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  xl?: number | string;
  '2xl'?: number | string;
};
