
import { GoogleGenAI } from "@google/genai";

// Standard initialization of GoogleGenAI using process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJobDescription = async (title: string, company: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional job description for a "${title}" position at "${company}". Focus on requirements and benefits suitable for Filipino remote workers. Include a warm, encouraging tone.`,
      config: {
        temperature: 0.7,
      }
    });
    // Directly accessing the .text property of GenerateContentResponse
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service.";
  }
};

export const suggestResumeImprovements = async (bio: string, skills: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this freelancer profile. Bio: "${bio}". Skills: ${skills.join(', ')}. Provide 3 actionable tips to make this profile more attractive to international employers hiring Filipino talent.`,
    });
    // Directly accessing the .text property of GenerateContentResponse
    return response.text || "No suggestions available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not fetch suggestions.";
  }
};
