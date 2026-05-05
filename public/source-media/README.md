# Source Media

Three MP4 video files power the scroll and farewell sections:

| File | Section | Behaviour |
|------|---------|-----------|
| `processed-videos/intro.mp4` | Hero (top) | Canvas scrubbed on scroll |
| `processed-videos/middle.mp4` | CinematicReveal (middle) | Canvas scrubbed on scroll |
| `processed-videos/last.mp4` | FarewellVideo (bottom) | Autoplay loop via IntersectionObserver |

The Hero and CinematicReveal sections seek `video.currentTime` proportionally
to scroll progress and draw each frame to a `<canvas>` via `ctx.drawImage`.
See `src/hooks/useScrollDrivenVideo.ts` for the shared implementation.
