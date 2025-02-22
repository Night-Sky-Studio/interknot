import { ActionIcon, Button, colorsTuple, createTheme, Title, Image } from "@mantine/core"

const theme = createTheme({
    colors: { 
        "zzz": colorsTuple("#dcfe00")
    }, 
    primaryColor: "zzz",
    components: {
        Title: Title.extend({
            styles: {
                root: {
                    fontFamily: "'zzz', system-ui, sans-serif"
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
            }
        }),
        Image: Image.extend({
            styles: {
                root: {
                    width: "auto"
                }
            }
        })
    }
})

export default theme