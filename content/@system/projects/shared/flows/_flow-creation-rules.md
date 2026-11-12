## Description

Every single flow in `_flows/` must adhere to these rules to be of high quality.

## Rules

- **Repeatable**
  - Means using a template. So current flow of LLM.md acting as hub + absolute links is good.
- **Read-only**
  - If all tasks will write summary or interact in other ways with the flow note - it will be another headache to handle.
- **Sequential**
  - Two words - Expected. Structure.
  - Which means you don't have to think about "optimal order of execution". Makes it very action-oriented.
- **Identifiable Steps**
  - Number, not bullet. Name. Not description.
  - Don't use words/numbers that overlap with projects. Steps/phases/01/001/ those terms from the plan template. Like instead of numbers - use letters. ABC. Instead of steps - use stages OR chunks OR actions OR etc. Make flow distinct from the execution of the flow.
  - It feels like these make "probability anchors" for LLM. Harder to miss/ignore/hallucinate, because "meaning" attached to it. It's not like a one bullet point among 50 others.
- **Reliable**
  - If I would have to fight LLM to keep it up with the flow - it would be an issue.
  - So the flow must have another kind of "anchors", to, both - make sure LLM follows the flow AND increase probability of LLM to follow the flow. Like simple big rule for LLMs at the start of the flow like :
    \- "On each response write the step of the flow you're executing."
    \- "You must execute each step separately and report on its completion to the user"
- **Explicit**
  - Ties into reliability. If the flow is implicit, not a bit verbose - LLM will forget about it. Or importance of the flow will be reduced.
- **Controllable Chaos. NOT Overwhelming Tyranny**
  - As in life. LLMs are chaotic systems. You can't place/expect strict order following. Instead you must at least not fight with it OR, at the very best, make it into a win.

## Editing Rules

- **Survivor Bias**
  - Some rules may feel useless, but they work exactly because they're useless. For example, doublechecking phase size in critique flow. You may seem to have no issues with that and it's useless rule. But it works because you're constantly reminded and kept in check about the size of the planned step.
    - Removing that rule will make you to drift towards unnecessary big phases once again.
