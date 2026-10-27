### Flows

- #### "Explain"
  - Runs a subtask on minimal/super cheap models to like explain a command, or rule, or something. Debatable whether it should be an interactive subtask or just direct answer.Also probably should be cachable or not? or have like different variation of the answer.
- #### Skills.
  - Internal subtask on much cheaper model to dynamically pull skills into the context?
- #### System prompts
  - Dynamic system prompt based on initial user query. Example: when I ask LLM to help me with inverter scheme and soldering - so I don't have to create system prompt for each new topic.

---

- #### \[MAY BE HUGE] How brain process so much information? Imitate that in the task
  - Like instead of static context window - you have dynamically rebuilding context window.
  - Yes, you lose caching discount, but you get something better.
  - What if you can imitate the unconscious? as meta-task over current task? So while you're doing the task, there's some background processing of the information? Memory, integration, stuff like that.

---

- #### Critique yourself button for responses.
  - AI models tend toward sycophancy (agreeing with whatever premise the user types). For Axon's mission—sharpening human thought—the UI should make it trivial to stress-test your own ideas.

---

- #### Task info - UI block.
  - `Artifacts` - Files it read/edited. Attachments. With ability to re-read files manually. Maybe bookmarking/pinned responses as well?
  - `Context/Price/Stats` - how much whole task cost, tokens in/out, caching %, etc.

---

- #### Multiple LLMs in chat - sequential AND parallel.
  - Former is for running model A run (tools/final response), then doing the same for model B, then for model C. Or maybe even same model just a few loops. Case - it gives first response, then the same model but in crique mode opposes to previous response, and model C (the same as A) provides better solution based on POV of both previous runs.
    - For parallel - needs special UI layout. You run 3 models on the same topic. Then 4th model gets final responses of each run, combines them to discard repeated stuff and merge unique ideas. And presents with result.
      - For UI - one can show compact interactive minimap as a tool renderer or something. So user sees progress of such execution, can open each branch/node by clicking on that map, and at the same time it's compact and clean.

---

- #### Obsidian Integration
  -
