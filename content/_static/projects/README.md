## Plugins

- ### Dataview
  - `require()`, `path`, `app.vault.adapter.getBasePath()` - have issues on iOS. So avoid those in scripts.

## Templater

1. Don't use <> tags in template js comments, to mark some adjustable value it breaks further markdown rendering in obsidian.
2. Don't use current file name of template, since it might change
3. All configurable values should be at the top CFG const, so it's easy to configure scripts.

## Decisions

- Templates should be self-documenting
  - **Reason**: Avoid duplication. Like flow, you write it down here, and then there's like 80% of what is in the plan template
- \~~Obsidian Dataview shouldn't be used to pull up steps~~ Dataview should be used to pull up steps.
  - **Reasons**: Inline steps, temp steps, future steps placeholders, etc. Dataview limits this significantly.
    - **REVIEW**: Each one could be easily created as templated file and a name can be used to move them automatically in the order. Plus of the file-based is that it allows to painless expansion of the implementation, when it gets unexpectedly complex.
      - **Pushback** - llm can't execute dataviewjs... so you need to either use native dataview queries + serializer or don't use dataview at all. Like it needs those descriptions of each step to see the whole picture without reading all the steps.
        - **Still good** - Very big and distinct rule to ask explore tool to read all steps and list which ones is related to current one, which one should be read, stuff like that. It's even better than just brief description that means little to to LLM
