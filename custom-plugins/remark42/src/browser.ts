// Step-02 placeholder bootstrap: proves the browser resource travels through the
// build as a string without executing anything. It ships site-wide, so it must
// stay a hard no-op on pages without a comments container. The real runtime is
// authored in step 06 (visibility gating, instance lifecycle, theme handling).
console.debug("[remark42] scaffold bootstrap loaded")
export {}
