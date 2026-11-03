import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { parseThemeData } from "./quartz/util/theme"
// The stylesheet is imported here (not inside util/theme.ts) because the tsx test
// runner cannot load .css imports, and the parser must stay testable.
import themeCss from "./quartz/styles/theme.css"

const config = await loadQuartzConfig()

// og-image reads cfg.theme (upstream plugin contract); its data is derived from
// the palette SSOT in quartz/styles/theme.css and is never authored in YAML.
config.configuration.theme = parseThemeData(themeCss)
export default config
export const layout = await loadQuartzLayout()
