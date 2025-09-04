import { ActionIcon, Button, colorsTuple, createTheme, Title, Image, Switch, Anchor } from "@mantine/core"

const theme = createTheme({
    colors: { 
        "zzz": colorsTuple("#dcfe00")
    }, 
    primaryColor: "zzz",
    components: {
        Anchor: Anchor.extend({
            styles: {
                root: {
                    color: "#339af0"
                }
            }
        }),
        Title: Title.extend({
            styles: {
                root: {
                    fontFamily: "'zzz', 'zzz-jp', 'zzz-kr', 'zzz-cn', 'zzz-tw', system-ui, sans-serif"
                }
            }
        }),
        ActionIcon: ActionIcon.extend({
            defaultProps: {
                autoContrast: true,
                h: 36, w: 36,
                radius: "xl"
            }
        }),
        Button: Button.extend({
            defaultProps: {
                autoContrast: true,
                radius: "xl"
            },
            styles: {
                root: {
                    overflow: "visible"
                },
                inner: {
                    overflow: "visible"
                },
                label: {
                    overflow: "visible"
                }
            }
        }),
        Image: Image.extend({
            styles: {
                root: {
                    width: "auto"
                }
            }
        }),
        Switch: Switch.extend({
            styles: {
                root: {
                    color: "white"
                },
                thumb: {
                    backgroundColor: "white",
                    outline: "1px solid var(--mantine-color-dark-3)"
                }
            }
        })
    }
})

export default theme

export function shouldFontColorChange(hex: string, threshold = 0.6): boolean {
    if (hex.length === 4) {
        hex = "#" + [...hex.slice(1)].map(c => c + c).join("")
    }

    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const srgbToLinear = (c: number) =>
        c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

    const R = srgbToLinear(r)
    const G = srgbToLinear(g)
    const B = srgbToLinear(b)

    // Relative luminance
    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B

    return L > threshold
}