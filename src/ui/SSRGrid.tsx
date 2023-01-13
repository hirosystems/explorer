import { SSRData } from '@/app/common/SSRData';
import { breakpoints } from '@/ui/breakpoints';
import { css } from '@emotion/css';
import { CSSProperties, FC } from 'react';

enum Shorthand {
  m = 'm',
  mt = 'mt',
  mr = 'mr',
  me = 'me',
  mb = 'mb',
  ml = 'ml',
  ms = 'ms',
  mx = 'mx',
  my = 'my',
  p = 'p',
  pt = 'pt',
  pr = 'pr',
  pe = 'pe',
  pb = 'pb',
  pl = 'pl',
  ps = 'ps',
  px = 'px',
  py = 'py',
  size = 'size',
}

const shorthandMap: Record<Shorthand, string | string[]> = {
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  me: 'marginInlineEnd',
  mb: 'marginBottom',
  ml: 'marginLeft',
  ms: 'marginInlineStart',
  mx: ['marginInlineStart', 'marginInlineEnd'],
  my: ['marginTop', 'marginBottom'],
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pe: 'paddingInlineEnd',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  ps: 'paddingInlineStart',
  px: ['paddingInlineStart', 'paddingInlineEnd'],
  py: ['paddingTop', 'paddingBottom'],
  size: ['width', 'height'],
};

export interface GridProps extends CSSProperties, Partial<Record<Shorthand, string | number>> {}

export const Grid: FC<GridProps> = ({ children, ...styleProps }) => {
  const cssPropsWithFullName = Object.keys(styleProps).reduce((acc, cssProp) => {
    const cssKey = cssProp as keyof CSSProperties;
    const fullCssKey = shorthandMap[cssKey as Shorthand];
    fullCssKey ? console.log(fullCssKey) : undefined;
    if (!fullCssKey) acc[cssKey] = styleProps[cssKey];
    else if (Array.isArray(fullCssKey)) fullCssKey.forEach(key => (acc[key] = styleProps[cssKey]));
    else acc[fullCssKey] = styleProps[cssKey];
    return acc;
  }, {} as any);
  const css11 = Object.keys(cssPropsWithFullName).reduce((acc, cssProp) => {
    const cssKey = cssProp as keyof CSSProperties;
    const cssValue = styleProps[cssKey];
    if (Array.isArray(cssValue)) {
      acc[cssKey] = cssValue[0];
      for (let i = 1; i < cssValue.length; ++i) {
        acc[`@media screen and (min-width: ${breakpoints[i]})`] = {
          [cssKey]: cssValue[i],
        };
      }
    } else {
      acc[cssKey] = cssValue;
    }
    return acc;
  }, {} as any);

  return (
    <div
      className={css({
        display: 'grid',
        borderColor: `border.${SSRData.getInstance().colorMode}`,
        ...css11,
      })}
    >
      {JSON.stringify(css11, null, 4)}
      {children}
    </div>
  );
};
