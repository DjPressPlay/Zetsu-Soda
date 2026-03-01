import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateSodaImage(canName: string, category: string) {
  const colorThemes: Record<string, string> = {
    analytics: "Electric Blue and Cyan",
    automation: "Deep Purple and Neon Violet",
    apps: "Emerald Green and Lime",
    niche: "Vibrant Orange and Gold",
  };

  const theme = colorThemes[category] || "Multi-color Neon";

  const prompt = `A high-quality, realistic 3D render of a soda can. 
  The can has 'ZETSU SODA' written in a bold, stylized, futuristic font. 
  Above it, in smaller text, it says 'A FOR ATOMIC EDITION'. 
  The can features a stylized geometric logo in the center. 
  There are fresh fruit slices (like orange and lime) splashing in water or soda around the bottom half of the can. 
  The can is covered in realistic condensation droplets. 
  The background is a vibrant, colorful bokeh of lights. 
  The primary color theme of the can and background should be ${theme}. 
  The overall aesthetic is energetic, premium, and futuristic. 
  This specific flavor is called '${canName}'.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
  return null;
}
