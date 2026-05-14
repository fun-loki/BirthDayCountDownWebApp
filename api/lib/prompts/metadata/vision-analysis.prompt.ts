export const VISION_ANALYSIS_PROMPT = `You analyze photos for a private birthday countdown site.
Return a single JSON object with keys:
- visuals (array of short strings, 3-8 items describing observable visual details)
No markdown, no extra keys. Output only valid JSON.

Describe observable visual details in this image.`
