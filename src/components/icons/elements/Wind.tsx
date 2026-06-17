import * as React from "react";
import type { SVGProps } from "react";
const SvgWind = (props: SVGProps<SVGSVGElement>) => {
    const id = React.useId()
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.34 50.2" {...props}>
            <defs>
            <linearGradient
                id={`wind_svg__a_${id}`}
                x1={19.76}
                x2={37.1}
                y1={2.16}
                y2={47.24}
                gradientUnits="userSpaceOnUse"
            >
                <stop offset={0} stopColor="#5c95fc" />
                <stop offset={1} stopColor="#9de9fe" />
            </linearGradient>
            </defs>
            <path
                d="M53.92 13.71c-.41 8.63-3.61 13.82-9.25 16.02C62.34 13.05 37.9-7.6 17.34 2.81c8.24-2.33 16.6-.74 19.73 2.72C18-.96-.16 10.92 0 28.07c1.82-6.59 5.14-12.1 11.89-15.11-23.37 20.34 3.8 47.83 28.4 33.03-11.31 2.92-20.44-.05-24.44-7.18 15.94 13.1 46.4-4.82 38.06-25.1ZM29.38 9.08c19.31 0 15.03 24.94-3.88 24.94S10.07 9.08 29.38 9.08"
                style={{
                    fill: `url(#wind_svg__a_${id})`,
                }}
            />
        </svg>
    )
}
export default SvgWind;
