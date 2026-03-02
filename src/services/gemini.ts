import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const imageCache: Record<string, string | null> = {};
const pendingRequests: Record<string, Promise<string | null>> = {};

export async function generateSodaImage(canName: string, category: string) {
  const cacheKey = `${canName}-${category}`;
  
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey];
  }

  if (pendingRequests[cacheKey]) {
    return pendingRequests[cacheKey];
  }

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

  const request = (async () => {
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
          const url = `data:image/png;base64,${part.inlineData.data}`;
          imageCache[cacheKey] = url;
          return url;
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    } finally {
      delete pendingRequests[cacheKey];
    }
    return null;
  })();

  pendingRequests[cacheKey] = request;
  return request;
}

export async function remixSodaPrompt(currentPrompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Remix the following AI component prompt to be a slightly different but still atomic and functional version. Keep it concise and in a similar style.
      
      Current Prompt: ${currentPrompt}`,
      config: {
        systemInstruction: "You are a creative component designer. Your goal is to provide a fresh, slightly modified version of an existing component prompt while keeping it functional and atomic.",
      },
    });

    return response.text || currentPrompt;
  } catch (error) {
    console.error("Error remixing prompt:", error);
    return currentPrompt;
  }
}

export async function pourSodaPrompt(currentPrompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Expand the following AI component prompt into a much more detailed, professional, and feature-rich version. Add specific technical details, accessibility requirements, and advanced styling instructions.
      
      Current Prompt: ${currentPrompt}`,
      config: {
        systemInstruction: "You are a senior UI engineer. Your goal is to take a simple component prompt and 'pour' it into a highly detailed, production-ready specification.",
      },
    });

    return response.text || currentPrompt;
  } catch (error) {
    console.error("Error pouring prompt:", error);
    return currentPrompt;
  }
}
