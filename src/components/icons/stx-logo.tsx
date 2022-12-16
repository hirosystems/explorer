import React from 'react';

import { Box, BoxProps } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

export const StacksLogo: ForwardRefExoticComponentWithAs<BoxProps, 'svg'> = forwardRefWithAs<
  BoxProps,
  'svg'
>(({ width = '92px', color = 'white', as = 'svg', ...rest }, ref) => {
  return (
    <Box
      display="block"
      as={as}
      width={width}
      height="auto"
      viewBox="0 0 2116 400"
      fill="none"
      ref={ref}
      color={color}
    >
      <path
        d="M632.289 255.551C633.945 276.203 642.553 292.594 657.785 305.05C673.016 317.507 692.882 323.736 717.385 323.736C738.907 323.736 756.125 319.146 769.369 309.968C782.614 300.789 789.236 288.004 789.236 271.942C789.236 260.468 785.594 250.962 778.309 244.406C771.025 237.522 761.423 232.277 748.84 228.671C736.258 225.065 719.04 221.131 696.525 217.198C673.678 213.264 654.142 208.019 637.918 201.463C621.693 194.907 608.449 185.073 598.185 171.96C587.92 158.52 582.953 141.146 582.953 119.511C582.953 99.5145 588.251 81.8129 598.847 66.0781C609.442 50.3433 624.011 38.2143 643.216 29.6913C662.089 21.1683 683.942 16.579 708.445 16.579C733.609 16.579 756.125 21.1683 775.991 30.6747C795.858 39.8534 811.42 52.6379 822.678 69.0283C833.936 85.4188 840.227 103.776 841.22 124.756H784.269C782.283 106.726 774.336 92.3027 760.76 81.4851C746.854 70.6674 729.636 65.0946 708.445 65.0946C687.916 65.0946 671.691 69.3561 659.44 78.207C647.189 87.0578 641.229 99.5145 641.229 115.249C641.229 126.395 644.871 135.573 652.156 142.13C659.44 148.686 669.042 153.603 680.962 157.209C692.882 160.487 710.431 164.093 732.947 168.026C755.794 171.96 775.329 177.205 791.885 184.089C808.44 190.645 821.685 200.48 832.28 213.592C842.545 226.704 847.843 243.75 847.843 265.058C847.843 285.71 842.214 304.067 831.287 320.457C820.36 336.848 804.798 349.305 784.931 358.483C765.065 367.662 742.549 372.251 717.385 372.251C689.571 372.251 665.069 367.334 643.878 357.172C622.687 347.338 606.131 333.242 594.211 315.54C582.291 297.839 576.331 277.515 576 254.568L632.289 255.551ZM909.098 161.47H864.398V114.266H909.098V42.8037H964.063V113.938H1025.98V161.143H964.063V294.233C964.063 304.067 966.049 311.279 970.023 315.54C973.996 319.802 980.949 321.769 990.552 321.769H1031.94V369.301H979.625C955.123 369.301 937.243 363.728 925.985 352.255C914.727 341.109 909.098 323.408 909.098 299.806V161.47ZM1305.77 114.266V369.301H1258.09L1252.13 330.292C1243.19 343.076 1231.6 352.91 1217.36 360.778C1203.13 368.317 1186.9 372.251 1168.03 372.251C1144.52 372.251 1123.66 367.006 1105.12 356.516C1086.57 346.026 1072.34 330.947 1061.74 311.279C1051.48 291.61 1046.18 268.336 1046.18 241.783C1046.18 215.887 1051.48 192.94 1062.07 173.271C1072.67 153.603 1087.24 138.196 1105.45 127.378C1123.99 116.561 1144.85 111.316 1167.7 111.316C1186.9 111.316 1203.46 114.922 1217.36 122.133C1231.6 129.345 1242.86 139.179 1251.47 151.636L1258.09 114.266H1305.77ZM1231.27 303.411C1245.18 287.677 1251.8 267.68 1251.8 242.767C1251.8 217.526 1244.85 196.874 1231.27 181.139C1217.36 165.076 1199.48 157.209 1176.97 157.209C1154.45 157.209 1136.24 165.076 1122.67 180.811C1108.76 196.546 1102.14 216.87 1102.14 241.783C1102.14 267.025 1109.09 287.677 1122.67 303.411C1136.57 319.146 1154.45 327.014 1176.97 327.014C1199.48 327.014 1217.69 319.146 1231.27 303.411ZM1558.08 347.01C1537.22 363.728 1510.73 372.251 1477.95 372.251C1452.45 372.251 1429.94 367.006 1410.4 356.189C1390.87 345.371 1375.97 329.964 1365.37 309.968C1354.77 289.971 1349.48 267.025 1349.48 241.128C1349.48 215.231 1354.77 192.612 1365.7 172.944C1376.3 153.275 1391.53 138.196 1411.39 127.378C1430.93 116.561 1453.78 111.316 1479.6 111.316C1511.72 111.316 1538.21 119.839 1558.74 136.557C1579.27 153.275 1591.85 176.222 1597.15 205.069H1541.19C1537.55 190.317 1530.26 178.844 1519.01 170.321C1508.08 161.798 1494.5 157.209 1478.28 157.209C1456.43 157.209 1438.88 165.076 1425.63 180.483C1412.39 196.218 1405.77 216.214 1405.77 241.128C1405.77 266.369 1412.39 287.021 1425.63 302.756C1438.88 318.491 1456.43 326.358 1478.28 326.358C1495.17 326.358 1509.07 322.096 1520 313.246C1530.93 304.395 1538.21 292.594 1541.52 277.515H1596.82C1591.85 307.345 1578.61 330.292 1558.08 347.01ZM1640.52 20.5127H1694.83V238.833L1812.7 114.266H1875.61L1779.59 216.87L1881.9 369.301H1817.34L1740.85 256.207L1695.16 304.067V369.301H1640.85V20.5127H1640.52ZM1943.82 285.054C1944.82 298.494 1951.11 309.312 1962.7 317.835C1974.28 326.358 1989.18 330.619 2007.73 330.619C2024.28 330.619 2037.53 327.669 2047.79 321.441C2058.06 315.212 2063.02 307.017 2063.02 296.855C2063.02 288.332 2060.7 281.776 2056.07 277.515C2051.43 273.253 2045.14 269.975 2037.2 268.336C2029.25 266.369 2017 264.73 2000.77 262.763C1978.26 260.141 1959.72 256.535 1945.15 251.945C1930.58 247.356 1918.66 240.472 1910.05 230.638C1901.11 220.804 1896.8 207.691 1896.8 190.973C1896.8 175.238 1901.11 161.47 1910.05 149.341C1918.99 137.213 1931.24 127.706 1946.8 121.15C1962.36 114.594 1980.24 111.316 1999.78 111.316C2032.23 111.316 2058.72 118.527 2078.92 132.623C2099.11 147.047 2110.04 167.043 2112.03 192.94H2059.05C2057.72 181.467 2051.76 171.632 2041.5 164.421C2031.24 156.881 2017.99 153.275 2002.1 153.275C1986.2 153.275 1973.62 156.225 1963.69 162.126C1954.09 168.026 1949.12 176.222 1949.12 186.384C1949.12 193.923 1951.44 199.824 1956.4 203.43C1961.37 207.364 1967.33 209.986 1974.62 211.297C1981.9 212.936 1993.82 214.575 2010.38 216.542C2032.56 218.837 2051.1 222.443 2066.33 227.36C2081.56 232.277 2093.48 239.817 2102.42 250.306C2111.36 260.796 2116 274.892 2116 292.922C2116 308.984 2111.36 322.752 2101.76 334.881C2092.49 347.01 2079.58 356.189 2063.02 362.745C2046.47 369.301 2028.26 372.579 2007.73 372.579C1973.29 372.579 1945.15 364.712 1923.96 349.305C1902.76 333.898 1891.51 312.59 1890.84 285.382H1943.82V285.054Z"
        fill="currentColor"
      />
      <path
        d="M278.086 271.369L363.056 400H299.58L199.832 248.866L100.084 400H36.9437L121.914 271.704H0V223.006H400V271.369H278.086Z"
        fill="currentColor"
      />
      <path
        d="M400 126.952V175.651V175.987H0V126.952H119.563L35.6003 0H99.0764L199.832 153.149L300.924 0H364.4L280.437 126.952H400Z"
        fill="currentColor"
      />
    </Box>
  );
});
