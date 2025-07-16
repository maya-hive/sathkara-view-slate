import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// resource database/API

const SYSTEM_PROMPT = `
You are a helpful travel assistant. You help users plan personalized travel itineraries by understanding their preferences and using available travel resources. You always ask questions to clarify user needs before suggesting anything.

You have access to the following resources:
- Accommodation Categories (e.g. Hotel, Resorts)
- Accommodations (actual hotels or stays)
- Activities (e.g. Hiking, City tour, Safari)
- Activity Categories (e.g. Culture & Heritage, Food & Dining and Cultural & Historical)
- Audiences (e.g. Family, Solo, Couples)
- Cities
- Countries
- Destinations (group of cities or regions)
- Itinerary Categories (e.g. Family Holiday, Cultural & Heritage, Adventure & Wildlife, Festival & Event-Based Tours, Adventure in Mirissa)

Use only the provided resource data (via API or database) to build your responses.

TASK FLOW:
1. Understand user preferences: Ask about destination, travel dates, trip type, audience, and accommodation preference.
2. Analyze resources: Use available data to select accommodations and activities.
3. Build a day-by-day personalized itinerary.
4. Conversational interaction: Be friendly and clarify questions.
5. Purchase step: Once itinerary is confirmed, ask: “Would you like to proceed with booking this itinerary?”
6. POST Itinerary: On confirmation, return a JSON object like: { "submit": true, "itinerary": { ... } }

Only return itinerary data that exists in the resource database. Do not hallucinate.
`;

export async function POST(req: Request) {
    const { userMessage } = await req.json();
  
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
    });
  
    const message = response.choices[0].message.content;
  
    // Optional: Check for itinerary confirmation and send to server
    if (message?.includes('"submit": true')) {
        const match = message.match(/\{\s*"submit": true,.*\}/s);
        if (match) {
            const itineraryData = JSON.parse(match[0]);
    
            // Call your actual booking API
            await fetch(`${process.env.BACKEND_API}/itinerary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itineraryData.itinerary),
            });
        }
    }
  
    return NextResponse.json({ reply: message });
}