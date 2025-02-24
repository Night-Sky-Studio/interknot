import type { SVGProps } from "react";
const SvgSwitch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Switch_svg__Layer_2"
    data-name="Layer 2"
    viewBox="0 0 48 48"
    {...props}
  >
    <defs>
      <style>{".Switch_svg__cls-2{fill:#f9d217}"}</style>
    </defs>
    <g id="Switch_svg__Switch">
      <circle cx={24} cy={24} r={24} className="Switch_svg__cls-2" />
      <circle cx={24} cy={24} r={20} />
      <path
        d="M18 15.5h-6.01L12 31.38c0 .69.69 1.19 1.34.94 1.25-.47 3.28-2.17 10.6-8.32s9.52-7.99 10.81-8.38c.62-.19 1.24.32 1.24.97v15.9H30"
        style={{
          fill: "none",
          stroke: "#f9d217",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 5,
        }}
      />
      <path
        d="m25.7 15.1-6.9-5.16a.507.507 0 0 0-.81.4v10.33c0 .42.47.65.81.4l6.9-5.16c.27-.2.27-.61 0-.81M22.37 32.9l6.9 5.16c.33.25.81.01.81-.4V27.33c0-.42-.47-.65-.81-.4l-6.9 5.16c-.27.2-.27.61 0 .81"
        className="Switch_svg__cls-2"
      />
    </g>
  </svg>
);
export default SvgSwitch;
