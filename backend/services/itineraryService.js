import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateItineraryWithGemini = async (prompt) => {
  try {
    console.log('🔹 Gemini API called (Text Mode)');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
    throw error;
  }
};

export const generateJsonItinerary = async (prompt) => {
  try {
    console.log('🔹 Gemini API called (JSON Mode)');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    console.log('🔹 Raw Gemini Response:', text);

    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const jsonResponse = JSON.parse(text);
    return jsonResponse;
  } catch (error) {
    console.error('❌ Gemini JSON Error:', error.message);
    throw new Error('Failed to generate valid JSON itinerary');
  }
};
