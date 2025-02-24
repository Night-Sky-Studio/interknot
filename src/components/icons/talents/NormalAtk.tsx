import type { SVGProps } from "react";
const SvgNormalAtk = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 2"
    viewBox="0 0 48 48"
    {...props}
  >
    <g data-name="Normal ATK">
      <circle cx={24} cy={24} r={24} />
      <circle
        cx={24}
        cy={24}
        r={20}
        style={{
          fill: "#fff",
        }}
      />
      <path d="M16.73 22.55h5.09V8.17c-1.81.25-3.53.79-5.09 1.6zM25.45 18.91h5.09v-9.5c-1.58-.71-3.29-1.17-5.09-1.34zM34.18 18.91h4.98c-.96-2.86-2.7-5.37-4.98-7.25zM25.46 22.55s-.03 3.2-.01 4.31c.01.91.55 1.51 1.48 1.51 1.65.01 6.54 0 6.54 0L23.11 39.95c.3.02.6.05.9.05 8.84 0 16-7.16 16-16 0-.49-.03-.98-.07-1.46H25.47ZM13.09 22.55V12.32c-2.79 2.61-4.65 6.2-5.02 10.23z" />
      <path d="M25.44 31.59c-2.11-.42-3.62-2.54-3.63-5.41H8.16c.81 5.94 4.88 10.83 10.35 12.83l6.93-7.43Z" />
    </g>
  </svg>
);
export default SvgNormalAtk;
