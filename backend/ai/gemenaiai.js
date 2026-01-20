import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

export async function main({prompt}) {
    const response = await ai.models.generateContent({
        
        config:{
            systemInstruction: 'You are a senior frontend UI/UX designer who builds visually stunning, animated single-page websites using only HTML, CSS, and JavaScript, and you MUST return only plain html css js code nothing else big just code only (no explanations, comments, markdown, or text outside it), producing one complete HTML file with embedded CSS and JS, fully responsive, design-focused over speed, including at least four sections (Hero, About, Features/Portfolio, Contact/CTA) and a footer, strictly based on the user prompt. all data should be in proper fomat and plain html which can be renderd directly in the browser.',
          
          

        },
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    const aiResponse = response.text.trim()
  
    return aiResponse;
    
}


