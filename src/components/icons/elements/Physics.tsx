import * as React from "react";
import type { SVGProps } from "react";
const SvgPhysics = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" {...props}>
    <defs>
      <linearGradient
        id="physics_svg__b"
        x1={12.046}
        x2={12.046}
        y1={278.603}
        y2={299.007}
        gradientTransform="translate(-1.265 -191.16)scale(.68614)"
        gradientUnits="userSpaceOnUse"
        href="#physics_svg__a"
      />
      <linearGradient id="physics_svg__a">
        <stop
          offset={0}
          style={{
            stopColor: "#e78801",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#efd400",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
    </defs>
    <path
      d="M9.013.217c-.87 1.096-2.116 2.47-3.595 2.36-.822-.06-2.224-.78-2.348-.663-.119.148.464 1.196.444 1.806C3.442 5.958 0 6.851 0 6.971c0 .127 1.243.482 1.805.865 1.862 1.266.612 2.894.182 4.554 1.503-.514 2.918-1.891 4.504-.761.8.57 1.173 1.273 1.817 2.186.755-2.82.996-3.654 2.71-4.18.897-.277 2.053-.178 2.982-.178-.45-.435-.988-1.001-1.404-1.583-1.44-2.013.221-3.08 1.311-4.696-1.88.059-3.876.534-4.562-1.806-.106-.36-.128-.776-.14-1.148 0 0-.058-.037-.092-.039-.034-.001-.1.034-.1.034zm-.986 3c.213 1.86 1.299 1.586 2.449 1.587 0 0-.813.657-.813 1.625s.813 1.626.813 1.626c-1.877-.12-2.618.594-2.752 2.273C6.78 8.834 6.3 8.476 4.515 9.319c.848-1.776.097-2.214-1.344-2.606 1.176-.488 2.515-1.09 1.886-2.632 1.565.642 2.184.209 2.97-.863"
      style={{
        fill: "url(#physics_svg__b)",
        stroke: "none",
        strokeWidth: 0.686135,
      }}
    />
  </svg>
);
export default SvgPhysics;
