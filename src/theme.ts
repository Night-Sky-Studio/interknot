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