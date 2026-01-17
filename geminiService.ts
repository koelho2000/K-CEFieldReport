
import { GoogleGenAI, Type } from "@google/genai";

export interface PhotoAnalysisResult {
  caption: string;
  suggestedCategory: string;
  estimatedCost?: string;
}

export const analyzeFieldPhoto = async (base64Image: string): Promise<PhotoAnalysisResult> => {
  // Always create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: "Analisa esta fotografia de uma auditoria energética de um edifício em Portugal. Identifica o objeto técnico (ex: chiller, luminária LED, janela, isolamento). Gera uma legenda técnica curta em Português. Sugere uma categoria entre: Envolvente, Produção Térmica, Distribuição, Iluminação, Outros. Estima também o custo unitário aproximado de substituição ou reparação deste elemento em Euros (€) baseado em valores médios de mercado para serviços/manutenção técnica. Se não for aplicável, indica 'N/A'."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            suggestedCategory: { type: Type.STRING },
            estimatedCost: { type: Type.STRING, description: "Custo estimado em €" }
          },
          required: ["caption", "suggestedCategory", "estimatedCost"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro na análise da imagem:", error);
    return { caption: "Imagem capturada no local", suggestedCategory: "Geral", estimatedCost: "N/A" };
  }
};
