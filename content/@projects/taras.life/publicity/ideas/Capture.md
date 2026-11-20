## Reddit

- Obsidian subreddit.
  - Why it may pass through? Because you're making vault and quartz website public. People can clone and continue right where you left off. So it may have some inspirational value at least. And easy to reproduce/tinker.

## Discord

## Promotion

- Digital Garden Collections

## Youtube Issues

- How to compensate for slow ability to skim?
  - That timelapse idea is definitely something.

## Youtube

- Sync youtube video publishing with updates of website?
- ### If you do re-encoding path
  - you may add on the bottom a timeline. So it's like always visible and 1:1 to time in youtube video. Could be more visible. Animated. More interactive? I don't know. Definitely borders "too much".
  - Re-encoding settings experiments
    - `ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i "input.mp4" -c:v hevc_nvenc -preset p1 -split_encode_mode 2 -b:v 1500k -c:a copy "output.mp4"` - split frame NVENC encoding + CUDA decoding (so cpu isn't loaded at all). Fastest so far. (av1 may be even better for storage)
  - Ideas
    - You can speed up night. And have day on lower speeds.
    - timelapse on keyframes - super fast.
    - timelapse for the whole day at the start.
      - then you exclude sleeping and insert the rest of the day at lower speed.
        - When I rewatch videos - that high speed makes some moments feel weird. Unnatural.
- ### Thumbnail
  - Current one is the same for all days = it might as well be a black square = you can do little to nothing to make it better, or give it some effort to make it really better.
  - Why?
    - At least to have ability to visually distinct and reference days.
  - **Insight**: thumbnail can simply act as a secondary title string.
    - But it shouldn't depend on the title nor title should depend on the thumbnail. They need to add to the other one.
  - **Progress Chart**
    - Track in frontmatter of notes
    - Create chart. Use in youtube videos. Self-description of the day.
- ### Issues
  - Skimming is slow. That's the main issue. Like you set time and wait 10 seconds for it to load - slow.
  - Youtube video is 10/15 fps, it plays faster though, so I'm not sure how it works. Like either it's like encoded 15fps but plays as more OR it's playing at 15fps as result of youtube processing.
- ### Ideas
  - Timelapse in front of the main video. Like x50. So it would take like 15 minutes to finish it (skipping the sleep and meals)
    - Performance though. Because I'm not sure speed up is better. You probably have to either re-encode OR do some manipulation with frames. Otherwise bitrate would be insane. like hundreds of megabytes per minute.
  - If I would watch it - what would be interesting for me?
    - how the guy on video got desperate/hopeless/angry, and if he found away to get out of it, either by accident or intentionally.
    - I would really appreciate honesty and humility. Like if I saw that the guy acts on camera - I would just not believe that the whole thing is real.
    -
