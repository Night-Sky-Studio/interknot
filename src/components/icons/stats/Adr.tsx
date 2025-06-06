import type { SVGProps } from "react";
const SvgAdr = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width="14mm"
    height="14mm"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      d="M6.996-.004 4.997 3.97A2.33 2.33 0 0 1 3.965 5L-.007 7l3.972 2c.446.224.808.585 1.032 1.03l2 3.973 2-3.972a2.32 2.32 0 0 1 1.03-1.032L14 7l-3.973-2a2.33 2.33 0 0 1-1.03-1.031zm5.127.532-1.884 2.488h1.224v1.18h1.32v-1.18h1.224zm-5.13 2.798.003.006.005-.006v.01l1.416 1.725-1.416 1.621v.01l-.005-.005-.004.005v-.01L5.576 5.061l1.416-1.724zm-2.019 2.72L6.996 8.09 9.02 6.046v1.755L6.996 9.845 4.974 7.801z"
      style={{
        fill: "currentColor",
        strokeWidth: 0.894903,
        strokeLinecap: "square",
        strokeDashoffset: 3.77952,
        opacity: 1,
      }}
    />
  </svg>
);
export default SvgAdr;
