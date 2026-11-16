# Theme system review exploration

- Theme initialization and persistence
  - Does the inline initializer restore every supported stored mode before styles render?
  - Are invalid values, unavailable storage, and OS seeding handled consistently with the intended contract?
- Toggle and layout
  - Does the delegated handler survive navigation and preserve the intended cycle and event payload?
  - Do layout grouping and resource collection deliver the toggle and its scripts on every configured page type?
  - Does the control communicate its state and work on mobile and with native input methods?
- Consumer integration
  - Does Remark42 use the same mapping for initial mounts, navigation remounts, and live changes?
  - Can a theme change during an asynchronous mount be lost?
  - Do other enabled theme-sensitive plugins interpret dark-low coherently?
- CSS and build output
  - Are native color-scheme, syntax colors, and icon selection correct in each mode?
  - Does the generated plugin output carry the source behavior, and what freshness evidence is available?
  - What do the available HTML artifacts actually establish about startup and placement?
- Maintainability and verification
  - Are the theme contract, global types, documentation, and comments aligned?
  - Which behaviors have meaningful regression protection or require manual verification?
  - Are any proposed changes outside this step's locked scope or contrary to its testing policy?

## Provisional review possibilities

### [BUG] Use the same Remark42 mapping at mount and on events
- **Description:** Initial and navigation mounts appear to interpret `dark-low` differently from live theme events. Confirm the source and generated runtime paths.
- **How To Do This:** Validate the root attribute and map all recognized site modes through the same binary conversion before constructing the widget config.
- **Benefit:** Initial loads, navigation, and live toggles would agree about the widget theme.
- **Complexity:** Low; generated plugin output also needs rebuilding.
- **Closed Advantageous Doors:**
  - No meaningful alternative is closed; unknown-attribute fallback still needs an explicit choice.
- **Description In Simpler Terms:** The comments widget should start in the same dark mode that it uses after a toggle.

### [BUG] Reconcile theme changes while the widget is mounting
- **Description:** A theme event may arrive while the async widget import is pending, when no live instance exists to receive it. Determine whether the resulting mount can retain the older theme.
- **How To Do This:** Re-read the active theme when the instance becomes available and reconcile the widget, accounting for superseded navigation generations.
- **Benefit:** A slow network would not leave the comments widget on an outdated theme after a click.
- **Complexity:** Moderate because first import and later mounts have different paths and the widget may already be visible.
- **Closed Advantageous Doors:**
  - An unconditional reconciliation could introduce extra widget messages or a visible transition; alternatives should be compared.
- **Description In Simpler Terms:** If someone changes the theme while comments are loading, comments should not get stuck with the earlier choice.

### [COMPATIBILITY] Account for dark-low in Excalidraw's auto palette
- **Description:** The enabled drawing plugin appears to select its dark colors only for the exact `dark` attribute. Confirm which real drawing content uses those variables and what dark-low displays.
- **How To Do This:** If the user wants parity, locally extend the drawing palette's dark selectors to include dark-low or pursue a maintainable upstream-compatible override.
- **Benefit:** Drawings using the plugin's adaptive palette would follow the site's two dark modes consistently.
- **Complexity:** Moderate due to third-party CSS ownership and potential impact on deliberately authored drawing colors.
- **Closed Advantageous Doors:**
  - Automatically mapping dark-low to the existing dark drawing palette limits independent per-mode drawing colors unless a separate override is later added.
- **Description In Simpler Terms:** A drawing may keep its light-mode colors even though the rest of the page is in dark-low.

### [VERIFICATION] Protect the runtime contract after design approval
- **Description:** Existing tests exercise palette parsing and generic layout grouping, but no focused browser theme-contract or Remark42 runtime tests were found. Determine which cases warrant durable coverage under the project's test policy.
- **How To Do This:** Once behavior is settled, exercise stored-mode initialization, cycling and raw events, Remark42 mount mapping, and a controlled pending-import theme change with suitable browser or DOM fakes.
- **Benefit:** Cross-module regressions would be detected without relying entirely on manual checks.
- **Complexity:** Moderate; test infrastructure and mocking effort must be weighed against the existing manual-widget policy.
- **Closed Advantageous Doors:**
  - A comprehensive mock-based suite could constrain implementation details and carry ongoing maintenance cost.
- **Description In Simpler Terms:** A few targeted checks could catch the same mismatches before they reach visitors.

### [CONTRACT] Align the required documentation and event guard
- **Description:** Check whether the required rendering-model guidance was updated and whether the new event guard follows the project's no-cast-narrowing rule.
- **How To Do This:** Document the raw three-mode event and ownership boundary where the step requires it; use runtime checks that narrow event detail without unchecked shape casts if needed.
- **Benefit:** Future consumers would have an accurate contract and a clearly validated event boundary.
- **Complexity:** Low, subject to checking the type declarations and existing documentation conventions.
- **Closed Advantageous Doors:**
  - A stricter event guard might reject synthetic events that only imitate a CustomEvent; compatibility should be considered.
- **Description In Simpler Terms:** The instructions and the code that checks incoming messages should agree about what a valid theme change is.

### [MINOR] Small clarity and usability issues
- **Description:** Check the outdated contract path in `Head.tsx`, the three-mode button's static accessible label, and missing local module documentation against repository conventions.
- **How To Do This:** Correct stale references and discuss whether additional state information or documentation is warranted, without adding unsolicited accessibility scaffolding.
- **Benefit:** Fewer misleading pointers and clearer operation for future maintainers and visitors.
- **Complexity:** Low for comments; usability and documentation decisions require user judgment.
- **Closed Advantageous Doors:**
  - More dynamic accessible labeling would create another state synchronization obligation.
- **Description In Simpler Terms:** Fix confusing instructions and decide whether the three-way control needs more explanation.
