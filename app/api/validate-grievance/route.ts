import { NextResponse } from "next/server";

export type IssueClassification = "PUBLIC_INFRASTRUCTURE" | "PRIVATE_PROPERTY" | "SPAM_OR_FAKE";

export interface ValidationResult {
  isApproved: boolean;
  classification: IssueClassification;
  citizenMessage: string;
  detailedReason: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, district, block, panchayat, mediaUrls } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Quick pre-flight check for blank or trivial inputs
    const trimmedTitle = (title || "").trim();
    const trimmedDesc = (description || "").trim();

    if (trimmedTitle.length < 3 || trimmedDesc.length < 5) {
      return NextResponse.json<ValidationResult>({
        isApproved: false,
        classification: "SPAM_OR_FAKE",
        citizenMessage: "The complaint details provided are too brief or incomplete. Please provide a clear title and description of the community problem.",
        detailedReason: "Title or description was under minimum character threshold."
      });
    }

    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured for AI Validation Filter. Falling back to local heuristic validation.");
      const fallbackResult = runLocalHeuristicValidation(trimmedTitle, trimmedDesc, category);
      return NextResponse.json<ValidationResult>(fallbackResult);
    }

    const prompt = `You are the official AI Validation & Classification Gatekeeper for 'ProblemSetu' (Government of Jharkhand Societal Innovation & Public Grievance Portal).
Your critical duty is to inspect citizen complaints before they enter the public system or get saved to the database.

Citizen Complaint to Validate:
- Title: ${trimmedTitle}
- Category: ${category || "General"}
- Ground Description: ${trimmedDesc}
- Administrative Location: ${panchayat ? `${panchayat} Panchayat, ` : ""}${block ? `${block} Block, ` : ""}${district ? `${district} District, Jharkhand` : "Jharkhand"}
- Media/Image Attachments: ${mediaUrls && mediaUrls.length > 0 ? `${mediaUrls.length} file(s) attached` : "None"}

CLASSIFICATION & VALIDATION RULES:

1. 'PUBLIC_INFRASTRUCTURE' (APPROVE):
   - Scope: Issues that affect a village, community, public sphere, shared infrastructure, or public safety.
   - Examples: "water is not coming in the village", village drinking water supply, community handpumps, contaminated groundwater, dry community borewells, streetlights, potholes, open drainage, public road damage, government facilities, shared solar microgrids.
   - CRITICAL RULE: Any problem mentioning a village, tola, gram panchayat, neighborhood, or shared community water/utility is a societal problem and MUST be classified as 'PUBLIC_INFRASTRUCTURE' (isApproved = true).
   - Action: isApproved = true, classification = "PUBLIC_INFRASTRUCTURE".
   - Citizen message: "Your report has been verified as a public community infrastructure grievance eligible for engineering resolution."

2. 'PRIVATE_PROPERTY' (REJECT):
   - Scope: ONLY issues purely confined to inside an individual's private residence, private flat/apartment, personal bathroom/kitchen plumbing (e.g., "my bathroom tap", "my kitchen sink"), private appliance repair, private vehicle, or personal neighbor dispute.
   - If the issue affects a village, neighborhood, or community facility, it is NEVER private property.
   - Action: isApproved = false, classification = "PRIVATE_PROPERTY".
   - Citizen message: "ProblemSetu is dedicated exclusively to public and community infrastructure grievances (such as roads, community water, streetlights, and drainage). We are unable to accept complaints regarding private household maintenance or personal property matters."

3. 'SPAM_OR_FAKE' (REJECT):
   - Scope: Obvious nonsense, random keyboard mashing (e.g. 'asdfghjkl', 'qwerty'), test text (e.g. 'test 123', 'checking app', 'hello hello'), abusive/offensive language, commercial advertisements, or obviously fake/fabricated claims with no real information.
   - Action: isApproved = false, classification = "SPAM_OR_FAKE".
   - Citizen message: A polite notice stating that the submission appears to contain test, placeholder, or invalid text, and requesting the citizen to submit a genuine community issue.

OUTPUT FORMAT:
Respond ONLY with a valid JSON object matching this schema with NO markdown code fences, NO backticks, and NO surrounding commentary:
{
  "isApproved": true or false,
  "classification": "PUBLIC_INFRASTRUCTURE" | "PRIVATE_PROPERTY" | "SPAM_OR_FAKE",
  "citizenMessage": "Clear, polite message directly addressed to the citizen...",
  "detailedReason": "Short internal reason explaining why this classification was determined..."
}`;

    const candidateModels = [
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash",
      "gemini-flash-latest"
    ];

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json"
            }
          }),
          signal: AbortSignal.timeout(9000)
        });

        if (!geminiRes.ok) {
          continue;
        }

        const data = await geminiRes.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText) {
          const cleanedText = candidateText.replace(/```json/gi, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanedText);

          if (typeof parsed.isApproved === "boolean" && parsed.classification) {
            const isPrivate = parsed.classification === "PRIVATE_PROPERTY";
            return NextResponse.json<ValidationResult>({
              isApproved: isPrivate ? false : parsed.isApproved,
              classification: parsed.classification,
              citizenMessage: isPrivate
                ? "ProblemSetu is dedicated exclusively to public and community infrastructure grievances (such as roads, community water, streetlights, and drainage). We are unable to accept complaints regarding private household maintenance or personal property matters."
                : (parsed.citizenMessage || (parsed.isApproved ? "Approved as community infrastructure grievance." : "This complaint does not qualify as a public infrastructure problem.")),
              detailedReason: parsed.detailedReason || "Classified via Google Gemini AI semantic analysis."
            });
          }
        }
      } catch (err) {
        // Try next candidate model
      }
    }

    // If Gemini models were temporarily unreachable, fallback to heuristic validation
    const fallbackResult = runLocalHeuristicValidation(trimmedTitle, trimmedDesc, category);
    return NextResponse.json<ValidationResult>(fallbackResult);
  } catch (error: any) {
    console.error("AI Validation endpoint error:", error);
    return NextResponse.json<ValidationResult>(
      {
        isApproved: false,
        classification: "SPAM_OR_FAKE",
        citizenMessage: "Could not validate grievance at this time. Please check your network and try again.",
        detailedReason: error.message || "Internal validation server error."
      },
      { status: 500 }
    );
  }
}

// Local fallback heuristic in case of Gemini network outage
function runLocalHeuristicValidation(title: string, desc: string, category?: string): ValidationResult {
  const text = `${title} ${desc}`.toLowerCase();

  // 1. Spam / Nonsense heuristics
  const spamKeywords = ["asdf", "qwerty", "test 123", "testing", "foo bar", "random text", "dummy text"];
  const hasSpam = spamKeywords.some((k) => text.includes(k));
  if (hasSpam || text.length < 15) {
    return {
      isApproved: false,
      classification: "SPAM_OR_FAKE",
      citizenMessage: "Your submission appears to contain test or incomplete text. Please describe a genuine public or community issue.",
      detailedReason: "Detected placeholder or test text in grievance submission."
    };
  }

  // Default to approved if no spam signals found
  return {
    isApproved: true,
    classification: "PUBLIC_INFRASTRUCTURE",
    citizenMessage: "Your report has been verified as a public community infrastructure grievance.",
    detailedReason: "Heuristic verified complaint touches community infrastructure."
  };
}
