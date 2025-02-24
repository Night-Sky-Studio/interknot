import * as React from "react";
import type { SVGProps } from "react";
const SvgSkill = (props: SVGProps<SVGSVGElement>) => {
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
                    id={`Skill_svg__a_${id}`}
                    x1={9.86}
                    x2={38.14}
                    y1={38.08}
                    y2={9.8}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0} stopColor="#e73452" />
                    <stop offset={1} stopColor="#5a61e7" />
                </linearGradient>
            </defs>
            <circle cx={24} cy={24} r={24} />
            <circle
                cx={24}
                cy={23.94}
                r={20}
                style={{
                    fill: `url(#Skill_svg__a_${id})`,
                }}
            />
            <path d="m45.07 21.29-14.71-3.65-3.65-14.71c-.7-2.83-4.72-2.83-5.42 0l-3.65 14.71-14.71 3.65c-2.83.7-2.83 4.72 0 5.42l14.71 3.65 3.65 14.71c.7 2.83 4.72 2.83 5.42 0l3.65-14.71 14.71-3.65c2.83-.7 2.83-4.72 0-5.42m-13.85 3.62-4.26 1.02c-.51.12-.9.52-1.02 1.02l-1.02 4.26c-.23.96-1.59.96-1.82 0l-1.02-4.26c-.12-.51-.52-.9-1.02-1.02l-4.26-1.02c-.96-.23-.96-1.59 0-1.82l4.26-1.02c.51-.12.9-.52 1.02-1.02l1.02-4.26c.23-.96 1.59-.96 1.82 0l1.02 4.26c.12.51.52.9 1.02 1.02l4.26 1.02c.96.23.96 1.59 0 1.82" />
        </svg>
    )
};
export default SvgSkill;
