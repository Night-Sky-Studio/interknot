import * as React from "react";
import type { SVGProps } from "react";
type EndGameStarProps = SVGProps<SVGSVGElement> & {
    state: "active" | "radiant" | "regular"
}
const SvgEndGameStar = ({ state = "regular", ...props }: EndGameStarProps) => {
    const id = React.useId()
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="EndGameStar_svg__Layer_2"
            data-name="Layer 2"
            viewBox="0 0 45 45"
            {...props}
        >
            <defs>
                <linearGradient id={`eg_star_${id}_regular`}
                    gradientUnits="userSpaceOnUse"
                    x1={0} x2={0} y1={0} y2={45} >
                    <stop
                        offset={0}
                        style={{
                            stopColor: "#ccc",
                            stopOpacity: 1
                        }}
                    />
                    <stop
                        offset={1}
                        style={{
                            stopColor: "#505050",
                            stopOpacity: 1
                        }}
                    />
                </linearGradient>
                <linearGradient id={`eg_star_${id}_active`}
                    gradientUnits="userSpaceOnUse"
                    x1={0} x2={0} y1={0} y2={45}>
                    <stop
                        offset={0}
                        style={{
                            stopColor: "#dd7530",
                            stopOpacity: 1
                        }}
                    />
                    <stop
                        offset={1}
                        style={{
                            stopColor: "#dc352d",
                            stopOpacity: 1
                        }}
                    />
                </linearGradient>
                <linearGradient id={`eg_star_${id}_radiant`}
                    gradientUnits="userSpaceOnUse"
                    x1={0} x2={0} y1={45} y2={0}>
                    <stop
                        offset={0}
                        style={{
                            stopColor: "#f7aeff",
                            stopOpacity: 1
                        }}
                    />
                    <stop
                        offset={0.5}
                        style={{
                            stopColor: "#9ed8ff",
                            stopOpacity: 1
                        }}
                    />
                    <stop
                        offset={1}
                        style={{
                            stopColor: "#68fcff",
                            stopOpacity: 1
                        }}
                    />
                </linearGradient>
            </defs>
            <g id="EndGameStar_svg__Layer_19" data-name="Layer 19" style={{
                fill: `url(#eg_star_${id}_${state})`
            }}>
                <path
                    d="M22.5 0C10.07 0 0 10.07 0 22.5S10.07 45 22.5 45 45 34.93 45 22.5 34.93 0 22.5 0m0 40C12.85 40 5 32.15 5 22.5S12.85 5 22.5 5 40 12.85 40 22.5 32.15 40 22.5 40"
                />
                <path
                    d="m34.61 29.49-1.73-1a.5.5 0 0 0-.67.17c-.99 1.56-2.35 2.87-3.96 3.8a11.5 11.5 0 0 1-5.27 1.53c-.27.01-.48.22-.48.49v2c0 .28.23.52.52.51 2.36-.08 4.68-.75 6.73-1.93s3.79-2.86 5.04-4.86c.15-.24.06-.56-.18-.7Z"
                />
                <path
                    d="M30.19 10.21a.51.51 0 0 0-.7.18l-1 1.73c-.13.23-.06.52.17.67 3.3 2.1 5.34 5.77 5.34 9.71 0 .72-.09 1.44-.23 2.14l-5.41-3.2c-1.24-.73-2-2.06-2.02-3.5l-.08-9.06c0-.23-.16-.44-.38-.49-1.1-.26-2.24-.4-3.37-.4-6.42 0-12.08 4.24-13.9 10.37-.07.22.03.46.23.58l7.81 4.61a4.1 4.1 0 0 1 2.02 3.5l.06 6.31c-1.96-.68-3.68-1.87-5.03-3.47a11.4 11.4 0 0 1-2.59-5.91.49.49 0 0 0-.53-.44l-1.99.17c-.28.02-.5.28-.46.56.34 2.78 1.47 5.38 3.28 7.54a14.4 14.4 0 0 0 6.98 4.58c.22.07.46-.03.58-.23l4.6-7.81a4.1 4.1 0 0 1 3.5-2.02l9.06-.08c.23 0 .44-.16.49-.38.27-1.1.4-2.24.4-3.37 0-4.99-2.6-9.65-6.81-12.29Zm-8.74 6.43a4.1 4.1 0 0 1-3.5 2.02l-6.31.06C13.24 14.14 17.58 11 22.5 11c.72 0 1.44.09 2.14.23l-3.2 5.41Z"
                />
            </g>
        </svg>
    )
}
export default SvgEndGameStar;
