import * as React from "react";
import type { SVGProps } from "react";
const SvgAuricEther = (props: SVGProps<SVGSVGElement>) => {
    const id = React.useId()
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
            {...props}
        >
            <defs>
                <linearGradient id={`auric_ether_svg__a_${id}`}>
                    <stop
                        offset={0}
                        style={{
                            stopColor: "#f3d299",
                            stopOpacity: 1,
                        }}
                    />
                    <stop
                        offset={0.5}
                        style={{
                            stopColor: "#b7822c",
                            stopOpacity: 1,
                        }}
                    />
                    <stop
                        offset={1}
                        style={{
                            stopColor: "#ffcd77",
                            stopOpacity: 1,
                        }}
                    />
                </linearGradient>
                <linearGradient
                    href={`#auric_ether_svg__a_${id}`}
                    id={`auric_ether_svg__b_${id}`}
                    x1={15.915}
                    x2={22.39}
                    y1={2.392}
                    y2={8.867}
                    gradientTransform="translate(-12.386 1.207)"
                    gradientUnits="userSpaceOnUse"
                />
            </defs>
            <path
                d="M7.161 0S5.305 2.79 4.128 3.967c-.254.253-.59.54-.948.831l.076.063c2.105 1.177 3.63 2.942 5.05 4.666l-1.253 1.621L5.95 9.585l.784-.833c-.02-.198-.513-.735-1.148-1.326-.508.47-1.474 1.312-2.384 1.795.35.284.677.564.925.812C5.305 11.21 7.033 14 7.033 14c1.162-1.719 2.064-3.582 3.957-4.78-.533-.283-1.803-1.212-2.619-2.22l-1.21-1.322-1.21-1.287 1.268-1.588L8.294 4.32l-.91.955 1.205 1.308c.536-.69 1.92-1.806 2.41-1.904C9.69 3.6 8.389 2.143 7.16 0m-4.1 5.344S1.154 7 .652 7c.5 0 2.41 1.656 2.41 1.656l1.369-.898-1.04-.595v-.327l1.04-.594Zm7.878 0-1.37.898 1.04.594v.327l-1.04.595 1.37.898S12.904 7 13.348 7c-.444 0-2.41-1.656-2.41-1.656"
                style={{
                    opacity: 1,
                    fill: `url(#auric_ether_svg__b_${id})`,
                    strokeLinecap: "square",
                    strokeDashoffset: 3.77952,
                }}
            />
        </svg>
    )
};
export default SvgAuricEther;
