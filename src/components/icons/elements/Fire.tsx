import * as React from "react";
import type { SVGProps } from "react";
const SvgFire = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" {...props}>
    <defs>
      <linearGradient
        id="fire_svg__b"
        x1={12.182}
        x2={12.182}
        y1={302.124}
        y2={315.03}
        gradientTransform="translate(-4.909 -294.668)scale(.9776)"
        gradientUnits="userSpaceOnUse"
        href="#fire_svg__a"
      />
      <linearGradient id="fire_svg__a">
        <stop
          offset={0}
          style={{
            stopColor: "#ea1503",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#f3741a",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
    </defs>
    <path
      d="M1.972 11.944c1.112 1.072 2.998 1.314 4.368 2.027.007-1.742-1.044-3.54-3.158-3.855 2.096-.47 3.1-1.295 3.665-3.693.572 2.723 1.85 3.219 3.91 3.678-2.092.376-3.42 1.696-3.159 3.899 1.55-.806 3.624-1.29 4.76-2.677 2.117-2.58.435-6.764-2.47-7.9.949 2.315-1.854 2.066-2.105-.375C7.666 1.909 8.886.993 9.77.47 7.84-.68 4.008.404 4.242 2.366c.191 1.6 1.52 3.367-.155 3.766-1.715.409-1.2-2.104-1.2-2.104C.665 5.06-.254 9.8 1.973 11.945"
      style={{
        fill: "url(#fire_svg__b)",
        fillOpacity: 1,
        stroke: "none",
        strokeWidth: 0.977604,
      }}
    />
  </svg>
);
export default SvgFire;
