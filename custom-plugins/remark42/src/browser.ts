// Quartz executes this shared bootstrap before dispatching its initial nav event.
// Installing listeners is synchronous; Remark42 itself is fetched only on demand.
import { installRemark42 } from "./runtime"

installRemark42(window, document)
