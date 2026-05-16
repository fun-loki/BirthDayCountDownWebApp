export const VISION_ANALYSIS_PROMPT = `You analyze photos for a private birthday countdown site.
Return a single JSON object with keys:
- visuals (array of short strings, 3-8 items describing observable visual details)
- gender (one of "female", "male", or "unknown"; if the person's gender is not clearly visible, use "unknown")
- person_vibe (array of short phrases, 1-4 items, capturing the person's visible style, energy, or mood)
No markdown, no extra keys. Output only valid JSON.

Describe observable visual details in this image.`
