import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

/**
 * Hàm chấm điểm bài viết IELTS Writing
 */
export async function scoreWritingTask(testTitle: string, question: string, essay: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert IELTS Writing Examiner. 
      Score the following IELTS Writing essay based on the official 4 criteria:
      1. Task Response (TR)
      2. Coherence and Cohesion (CC)
      3. Lexical Resource (LR)
      4. Grammatical Range and Accuracy (GRA)

      TEST TITLE: ${testTitle}
      QUESTION: ${question}
      STUDENT ESSAY: ${essay}

      Return the response in STRICT JSON format with the following keys:
      {
        "overall_band": number,
        "criteria": {
          "TR": { "score": number, "feedback": "string" },
          "CC": { "score": number, "feedback": "string" },
          "LR": { "score": number, "feedback": "string" },
          "GRA": { "score": number, "feedback": "string" }
        },
        "general_comment": "string",
        "detailed_feedback": [
          { "original_text": "string", "correction": "string", "explanation": "string", "type": "grammar" | "vocabulary" | "style" }
        ],
        "estimated_word_count": number
      }

      Provide constructive, professional feedback in VIETNAMESE for the feedback and comments sections, but keep technical terms like Band scores and Criteria names in English.
      Ensure the detailed_feedback focuses on the most critical errors that affect the band score.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Làm sạch text nếu AI trả về markdown code blocks
    const jsonString = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini Scoring Error:", error);
    throw new Error("Không thể chấm điểm bài viết vào lúc này. Vui lòng thử lại sau.");
  }
}

/**
 * Hàm AI tự động tạo đề thi IELTS (Reading hoặc Writing)
 */
export async function generateIELTSTest(type: "reading" | "writing", topicOrUrl: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = type === "reading" 
      ? `Create a complete IELTS Academic Reading Test. 
         TOPIC/SOURCE: ${topicOrUrl}
         REQUIREMENTS:
         1. A high-quality academic passage (approx 800 words).
         2. 10-13 questions including Multiple Choice and True/False/Not Given.
         3. A clear Answer Key with explanations.
         
         Return in STRICT JSON format:
         {
           "title": "string",
           "content": "string (the passage)",
           "questions": [
             { "id": 1, "text": "string", "options": ["A", "B", "C", "D"], "answer": "string", "explanation": "string", "type": "multiple_choice" }
           ],
           "difficulty": "easy" | "medium" | "hard"
         }`
      : `Create an IELTS Writing Task 2 question.
         TOPIC: ${topicOrUrl}
         Return in STRICT JSON format:
         {
           "title": "string",
           "content": "string (the question prompt)",
           "difficulty": "medium"
         }`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    const jsonString = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Không thể tạo đề thi tự động. Vui lòng thử lại.");
  }
}

/**
 * Hàm AI bóc tách đề thi từ nội dung HTML thô của website khác
 */
export async function parseIELTSFromHtml(type: "reading" | "writing", htmlContent: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Extract an IELTS ${type} test from the following raw text/HTML content.
         RAW CONTENT: ${htmlContent.substring(0, 15000)}
         
         REQUIREMENTS:
         1. Identify the Title, Passage Content (for reading), and all Questions.
         2. Format exactly into the standard IELTS JSON structure we use.
         3. If answers are present, include them in the explanation or answer field.

         Return in STRICT JSON format:
         {
           "title": "string",
           "content": "string",
           "questions": [
             { "id": 1, "text": "string", "options": ["A", "B", "C", "D"], "answer": "string", "explanation": "string", "type": "multiple_choice" }
           ],
           "difficulty": "medium"
         }`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    const jsonString = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error("Không thể bóc tách nội dung từ trang web này.");
  }
}
