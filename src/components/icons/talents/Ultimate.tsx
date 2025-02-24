import * as React from "react";
import type { SVGProps } from "react";
const SvgUltimate = (props: SVGProps<SVGSVGElement>) => {
    const id = React.useId()
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            data-name="Layer 2"
            viewBox="0 0 48 48"
            {...props}
        >
            <defs>
                <linearGradient
                    id={`Ultimate_svg__a_${id}`}
                    x1={24}
                    x2={24}
                    y1={33}
                    y2={15}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0} stopColor="#f76d01" />
                    <stop offset={1} stopColor="#f7c300" />
                </linearGradient>
                <linearGradient
                    id={`Ultimate_svg__b_${id}`}
                    x1={29.93}
                    x2={29.93}
                    y1={44}
                    y2={8.16}
                    href={`#Ultimate_svg__a_${id}`}
                />
                <linearGradient
                    id={`Ultimate_svg__c_${id}`}
                    x1={18.07}
                    x2={18.07}
                    y1={39.84}
                    y2={4}
                    href={`#Ultimate_svg__a_${id}`}
                />
            </defs>
            <circle cx={24} cy={24} r={24} />
            <path
                d="M24 33a9.88 9.88 0 0 1 9-9 9.88 9.88 0 0 1-9-9 9.88 9.88 0 0 1-9 9 9.88 9.88 0 0 1 9 9"
                style={{
                    fill: `url(#Ultimate_svg__a_${id})`,
                }}
            />
            <path
                d="M36.26 8.2c-3.54-.22-6.72.58-9.62 2.21 6.42 2.37 10.99 8.54 10.99 15.78 0 9.29-7.53 16.82-16.82 16.82-1.73 0-3.39-.26-4.96-.75 2.49 1.11 5.24 1.75 8.15 1.75 11.05 0 20-8.95 20-20 0-6.43-3.03-12.14-7.74-15.8Z"
                style={{
                    fill: `url(#Ultimate_svg__b_${id})`,
                }}
            />
            <path
                d="M10.37 21.82C10.37 12.53 17.9 5 27.19 5c1.73 0 3.39.26 4.96.75A19.95 19.95 0 0 0 24 4C12.95 4 4 12.95 4 24c0 6.43 3.03 12.14 7.74 15.8 3.54.22 6.72-.58 9.62-2.21-6.42-2.37-10.99-8.54-10.99-15.78Z"
                style={{
                    fill: `url(#Ultimate_svg__c_${id})`,
                }}
            />
        </svg>
    )
}
export default SvgUltimate;
