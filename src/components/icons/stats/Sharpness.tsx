import type { SVGProps } from "react";
const SvgSharpness = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...props}>
    <g
      style={{
        fill: "currentColor",
      }}
    >
      <path d="M16.37 6h1.88V4.31H20L17.31.76l-2.69 3.55h1.75zM12.85 5.67 9.99 0 7.14 5.67c-.32.64-.84 1.15-1.47 1.47L0 10l5.67 2.86c.64.32 1.15.84 1.47 1.47L9.99 20l2.85-5.67c.32-.64.83-1.15 1.47-1.47l5.67-2.85-5.67-2.86c-.63-.32-1.15-.84-1.47-1.47Zm-6.28 5.85-.91-2.75 2.27 1.8.79 2.57zm2.15-1.96L10 5.26l1.28 4.3L10 13.53zm4.71 1.96-2.15 1.62.79-2.57 2.27-1.8z" />
    </g>
  </svg>
);
export default SvgSharpness;
