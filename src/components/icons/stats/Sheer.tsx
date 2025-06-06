import type { SVGProps } from "react";
const SvgSheer = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width="14mm"
    height="14mm"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      d="M.31.31s-.454 7.384 2.418 12.998c.646.581 2.901-1.92 2.901-1.92s5.862 2.415 5.951 2.325c.09-.09-4.287-5.055-4.287-5.055s-2.758.06-2.965.021C2.79 5.98 3.283 3.283 3.283 3.283S5.98 2.79 8.679 4.328c.038.207-.02 2.965-.02 2.965s4.965 4.377 5.054 4.287-2.325-5.95-2.325-5.95 2.501-2.256 1.92-2.902C7.694-.144.31.31.31.31"
      style={{
        fill: "currentColor",
        fillOpacity: 1,
        strokeWidth: 1.16745,
        strokeLinecap: "square",
        strokeDashoffset: 3.77952,
      }}
    />
  </svg>
);
export default SvgSheer;
