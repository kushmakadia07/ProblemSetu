import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { audioBase64, mimeType } = await req.json();

    if (!audioBase64) {
      return NextResponse.json(
        { error: "No audio data provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    const cleanMime = mimeType?.split(";")[0] || "audio/webm";

    const prompt = `You are a speech-to-text transcriber for citizens in Jharkhand, India.
The speaker is speaking English in an Indian accent.
TASK:
- Accurately transcribe the spoken English words.
- Correct minor phonetic misinterpretations common with Indian English pronunciation (e.g., "hall" vs "hole", "villaze" -> "village", "boring" -> "borewell", "handpump", "panchayat", "basti", "tola").
- Return ONLY the clean, transcribed English text.
- Do NOT add quotes, markdown, prefixes, explanations, or commentary.
- If the audio is completely silent or only contains inaudible noise, return an empty string.`;

    const candidateModels = [
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash",
      "gemini-flash-latest"
    ];

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: cleanMime,
                      data: audioBase64
                    }
                  },
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1
            }
          }),
          signal: AbortSignal.timeout(12000)
        });

        if (!res.ok) {
          const errData = await res.text();
          console.warn(`Gemini audio transcribe failed on model ${model}:`, res.status, errData);
          continue;
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        return NextResponse.json({
          transcript: text,
          model
        });
      } catch (err) {
        console.warn(`Error with model ${model} for audio transcription:`, err);
      }
    }

    return NextResponse.json(
      { error: "Could not transcribe audio with available models." },
      { status: 502 }
    );
  } catch (err: any) {
    console.error("Transcribe API error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
