import { NextResponse } from "next/server";

interface DiagnosticQuestion {
  id: string;
  question: string;
  placeholder?: string;
}

const FALLBACK_QUESTIONS: Record<string, DiagnosticQuestion[]> = {
  "Water & Sanitation": [
    {
      id: "q1",
      question: "What is the color of the water (clean, yellowish, reddish, or muddy)?",
      placeholder: "e.g., Water looks yellowish and turns red after keeping in a bucket"
    },
    {
      id: "q2",
      question: "Does the water have any bad smell or strange taste (salty, bitter, metallic)?",
      placeholder: "e.g., Has a foul smell and metallic/sour taste"
    },
    {
      id: "q3",
      question: "Does the water leave yellow or white marks/crust on utensils, taps, or clothes when it dries?",
      placeholder: "e.g., Leaves hard white crust on steel pots and taps"
    },
    {
      id: "q4",
      question: "Where is this water coming from (community handpump, open well, or borewell) and does it dry up in summer?",
      placeholder: "e.g., 2 community handpumps, water dries up from April to June"
    }
  ],
  "Clean Energy & Microgrid": [
    {
      id: "q1",
      question: "How many hours of electricity do you usually get in a day in your village?",
      placeholder: "e.g., Only 3 to 4 hours, mostly late at night"
    },
    {
      id: "q2",
      question: "Is the problem frequent power cuts, very low voltage, or no electricity line at all?",
      placeholder: "e.g., Very low voltage, bulbs stay dim and motor won't turn on"
    },
    {
      id: "q3",
      question: "What important daily work stops when there is no power (drinking water pump, school, clinic, lights)?",
      placeholder: "e.g., Drinking water pump cannot run and dispensary has no light"
    },
    {
      id: "q4",
      question: "Is there open community ground or a Panchayat Bhawan roof available for installing solar lights?",
      placeholder: "e.g., Yes, open roof of primary school and Panchayat Bhawan"
    }
  ],
  "Agri-Tech & Forest Produce": [
    {
      id: "q1",
      question: "Which crop, vegetable, fruit, or forest produce (like Mahua, Lac, Tomato) is getting damaged?",
      placeholder: "e.g., Mahua flowers and tomatoes"
    },
    {
      id: "q2",
      question: "How does the produce get spoiled (rotting from heat/rain, insect attack, or lack of storage)?",
      placeholder: "e.g., Rots quickly within 2 days because there is no cool shed"
    },
    {
      id: "q3",
      question: "Approximately how much produce gets wasted or sold at throwaway loss each season?",
      placeholder: "e.g., About 15 to 20 quintals across our tola"
    },
    {
      id: "q4",
      question: "How far do farmers have to travel to reach the nearest market (haat/mandi) to sell it?",
      placeholder: "e.g., Around 18 km on an unpaved mud road"
    }
  ],
  "Tribal Healthcare": [
    {
      id: "q1",
      question: "What common sickness are people in your village suffering from (fever, stomach pain, diarrhea, joint pain)?",
      placeholder: "e.g., Children frequently have diarrhea and stomach pain"
    },
    {
      id: "q2",
      question: "Are pregnant women, mothers, or young children getting sick more often?",
      placeholder: "e.g., Yes, infants and mothers face weakness and fever"
    },
    {
      id: "q3",
      question: "How far is the nearest government clinic, hospital, or dispensary from your village?",
      placeholder: "e.g., Nearest PHC is 12 km away, no ambulance available"
    },
    {
      id: "q4",
      question: "Does the local health center have a working refrigerator to keep medicines and vaccines cold?",
      placeholder: "e.g., No refrigerator, health worker has to bring ice packs from block"
    }
  ],
  "Mining Safety & Dust Control": [
    {
      id: "q1",
      question: "Is dust settling on your houses, crops, drinking water pots, or trees?",
      placeholder: "e.g., Thick black/white dust covers all leaves, roofs, and open water"
    },
    {
      id: "q2",
      question: "What time of the day or night is the dust and heavy truck noise at its worst?",
      placeholder: "e.g., Continuously from evening 6 PM till early morning"
    },
    {
      id: "q3",
      question: "Are children or elderly people in the village having persistent coughing or breathing trouble?",
      placeholder: "e.g., Many children have continuous cough and eye irritation"
    },
    {
      id: "q4",
      question: "How close is the mine, stone crusher, or haul road to your homes?",
      placeholder: "e.g., About 300 meters from the outer houses of the village"
    }
  ],
  "Rural Infrastructure & Wildlife Safety": [
    {
      id: "q1",
      question: "What is the exact condition of the road, culvert, or bridge (broken, full of mud, washed away)?",
      placeholder: "e.g., Wooden culvert broke during monsoon and road is washed away"
    },
    {
      id: "q2",
      question: "Does your village get cut off from the main town or hospital during the rainy season?",
      placeholder: "e.g., Yes, during heavy rain water flows over the culvert for 2-3 days"
    },
    {
      id: "q3",
      question: "If wild animals (like elephants or boars) enter the village, at what time and which crop do they damage?",
      placeholder: "e.g., Elephant herd enters around 9 PM and damages paddy crops and huts"
    },
    {
      id: "q4",
      question: "How many families or school students use this path or crossing every day?",
      placeholder: "e.g., About 80 school children and 200 villagers daily"
    }
  ],
  "Default": [
    {
      id: "q1",
      question: "What does this problem look like, smell like, or feel like on the ground?",
      placeholder: "e.g., Smells foul, looks dirty, or causes direct daily trouble"
    },
    {
      id: "q2",
      question: "During which time of the day or season is this problem at its worst?",
      placeholder: "e.g., Every morning, or during heavy summer/monsoon"
    },
    {
      id: "q3",
      question: "About how many families or houses in your village are facing this trouble?",
      placeholder: "e.g., Around 50 to 60 households"
    },
    {
      id: "q4",
      question: "Has anyone in the village tried to fix it earlier, and what happened?",
      placeholder: "e.g., Local repair was done last year but broke again within a month"
    }
  ]
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, district, block, panchayat } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        questions: getFallbackQuestions(category),
        source: "fallback"
      });
    }

    const prompt = `You are an assistant for rural citizens in Jharkhand submitting a problem.
The citizen provided these details:
- Title: ${title || "Community Issue"}
- Category: ${category || "General"}
- Location: ${panchayat ? `${panchayat} Panchayat, ` : ""}${block ? `${block} Block, ` : ""}${district ? `${district} District` : "Jharkhand"}
- Description: ${description || "No description provided"}

TASK:
Generate exactly 4 very simple, practical, everyday clarification questions for rural villagers to answer.

CRITICAL RULES:
1. LANGUAGE REQUIREMENT: You MUST write ONLY in plain, simple ENGLISH. Do NOT use Hindi, Hinglish, or Romanized Hindi. Every question and placeholder must be in 100% English.
2. Use extremely simple, clear, everyday English words that are very easy to read and answer.
3. DO NOT use technical terms, engineering jargon, or complex words (NEVER use words like "parameters", "remediation", "specifications", "infrastructure", "scope", "indicators").
4. Ask about direct, sensory observations:
   - For water: ask about water color (yellow, red, muddy), bad smell, strange taste (salty, bitter), stains on utensils or buckets, and water source (handpump, well).
   - For electricity: ask how many hours electricity is available, low voltage, lights or pumps stopping.
   - For farming/crops: ask what specific crop is getting damaged, whether it is rotting or drying, and distance to the market.
   - For health: ask what symptoms people have (cough, fever, stomach pain), and distance to the nearest clinic.
   - For dust/mining: ask where the dust falls, if people are coughing, and how close trucks or mines are.
   - For roads/animals: ask if the road is muddy or broken, what animals come, and what time of day.
5. Keep questions short, polite, direct, and completely in English.

OUTPUT FORMAT:
Respond ONLY with a valid JSON object matching this schema with NO markdown formatting and NO code fences (all text MUST be in English):
{
  "questions": [
    {
      "id": "q1",
      "question": "Simple direct question here?",
      "placeholder": "Simple example answer..."
    },
    {
      "id": "q2",
      "question": "Simple direct question here?",
      "placeholder": "Simple example answer..."
    },
    {
      "id": "q3",
      "question": "Simple direct question here?",
      "placeholder": "Simple example answer..."
    },
    {
      "id": "q4",
      "question": "Simple direct question here?",
      "placeholder": "Simple example answer..."
    }
  ]
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
              temperature: 0.2,
              responseMimeType: "application/json"
            }
          }),
          signal: AbortSignal.timeout(9000)
        });

        if (!geminiRes.ok) {
          continue;
        }

        const data = await geminiRes.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidate) {
          const cleanedText = candidate.replace(/```json/gi, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanedText);

          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            return NextResponse.json({
              questions: parsed.questions,
              source: "gemini"
            });
          }
        }
      } catch (err) {
        // Try next model
      }
    }

    return NextResponse.json({
      questions: getFallbackQuestions(category),
      source: "fallback"
    });
  } catch (error: any) {
    return NextResponse.json(
      { questions: getFallbackQuestions("Default"), source: "fallback" },
      { status: 200 }
    );
  }
}

function getFallbackQuestions(category?: string): DiagnosticQuestion[] {
  if (!category) return FALLBACK_QUESTIONS["Default"];
  for (const key of Object.keys(FALLBACK_QUESTIONS)) {
    if (category.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(category.toLowerCase())) {
      return FALLBACK_QUESTIONS[key];
    }
  }
  return FALLBACK_QUESTIONS["Default"];
}
