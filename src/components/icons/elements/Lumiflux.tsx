import * as React from "react";
import type { SVGProps } from "react";
const SvgLumiflux = (props: SVGProps<SVGSVGElement>) => {
    const id = React.useId()
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 58 58"
            {...props}
        >
            <defs>
                <linearGradient
                    id={`lumiflux_svg__a_${id}`}
                    x1={29}
                    x2={29}
                    y1={58}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0} stopColor="#fe9ac9" />
                    <stop offset={1} stopColor="#fec9fc" />
                </linearGradient>
            </defs>
            <path
                d="M33 29c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4m25 0-15.24-5.64L33.47 33a6 6 0 0 1-4.48 2l16.26 10.26-4.54-9.87L57.99 29Zm-42.76 5.64L24.53 25c1.1-1.22 2.69-2 4.48-2L12.74 12.74l4.54 9.87L0 29zm17.75-10.12A5.98 5.98 0 0 1 35 29l10.26-16.26-9.87 4.54L29 0l-5.64 15.24L33 24.53h-.01Zm-7.98 8.96A5.98 5.98 0 0 1 23 29L12.74 45.26l9.87-4.54L29 58l5.64-15.24L25 33.47h.01Z"
                data-name="Layer 15"
                style={{
                    fill: `url(#lumiflux_svg__a_${id})`,
                }}
            />
        </svg>
    )
}
export default SvgLumiflux;
