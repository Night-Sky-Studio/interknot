import type { SVGProps } from "react";
const SvgDodge = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 2"
    viewBox="0 0 48 48"
    {...props}
  >
    <circle cx={24} cy={24} r={24} />
    <circle
      cx={24}
      cy={24}
      r={20}
      style={{
        fill: "#fff",
      }}
    />
    <path d="m24 9.06 15.95 15.95c.02-.34.05-.67.05-1.01 0-8.84-7.16-16-16-16S8 15.16 8 24c0 .34.03.67.05 1.01z" />
    <path d="M24 14.72 9.05 29.67c.47 1.25 1.09 2.42 1.84 3.5l13.1-13.1 13.1 13.1c.75-1.08 1.37-2.25 1.84-3.5L23.98 14.72Z" />
    <path d="M13.59 36.13c.97.84 2.05 1.55 3.2 2.14L24 31.06l7.21 7.21c1.16-.59 2.23-1.3 3.2-2.14L24 25.72z" />
    <path d="m24 36.72-2.99 2.99c.97.18 1.97.29 2.99.29s2.02-.11 2.99-.29z" />
  </svg>
);
export default SvgDodge;
