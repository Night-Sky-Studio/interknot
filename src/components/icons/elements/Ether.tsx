import * as React from "react";
import type { SVGProps } from "react";
const SvgEther = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" {...props}>
    <defs>
      <linearGradient
        id="ether_svg__b"
        x1={16.461}
        x2={7.36}
        y1={354.589}
        y2={367.587}
        gradientTransform="translate(-2.93 -294.054)scale(.83374)"
        gradientUnits="userSpaceOnUse"
        href="#ether_svg__a"
      />
      <linearGradient id="ether_svg__a">
        <stop
          offset={0}
          style={{
            stopColor: "#ff0a1a",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.171}
          style={{
            stopColor: "#ff0626",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.5}
          style={{
            stopColor: "#b338dd",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.85}
          style={{
            stopColor: "#2a6bea",
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#2a6bea",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
    </defs>
    <path
      d="M6.52 0 5.036 3.715a1.68 1.68 0 0 1-.935.936L.385 6.135l3.716 1.483a1.47 1.47 0 0 1 .866.96L6.52 14l1.553-5.422a1.47 1.47 0 0 1 .866-.96l3.716-1.483L8.94 4.65a1.68 1.68 0 0 1-.935-.936Zm4.568 7.83-.57 1.403a1 1 0 0 1-.554.553l-1.403.57 1.403.57a1 1 0 0 1 .554.554l.57 1.404.57-1.404a1 1 0 0 1 .554-.553l1.403-.57-1.403-.57a1 1 0 0 1-.554-.554Z"
      style={{
        fill: "url(#ether_svg__b)",
        strokeWidth: 0.833738,
        strokeLinecap: "square",
        strokeDashoffset: 3.77952,
      }}
    />
  </svg>
);
export default SvgEther;
