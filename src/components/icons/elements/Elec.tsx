import * as React from "react";
import type { SVGProps } from "react";
const SvgElec = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" {...props}>
    <defs>
      <linearGradient
        id="elec_svg__b"
        x1={12.046}
        x2={12.046}
        y1={334.813}
        y2={349.957}
        gradientTransform="translate(-4.136 -309.526)scale(.92447)"
        gradientUnits="userSpaceOnUse"
        href="#elec_svg__a"
      />
      <linearGradient id="elec_svg__a">
        <stop
          offset={0}
          style={{
            stopColor: "#0075ff",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#3decff",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
    </defs>
    <path
      d="m9.822.624-5.237.624-1.573 5.236 2.143-.054-1.736 6.946 6.783-8.628-2.768.217ZM1.6 5.779 0 7.705l.678 2.578.652-.57.949 2.496.597-4.531-1.167.814Zm9.17 1.004L8.14 9.225l1.166.298-2.7 3.392 6.065-2.768-1.764-.786L14 7Z"
      style={{
        fill: "url(#elec_svg__b)",
        strokeWidth: 0.924468,
        strokeLinecap: "square",
        strokeDashoffset: 3.77952,
      }}
    />
  </svg>
);
export default SvgElec;
