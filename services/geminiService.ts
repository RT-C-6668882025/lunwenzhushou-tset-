import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是“论文结构与风格优化助手”，一位专业的学术编辑和结构规划师。你的目标是帮助用户高效地生成严谨、逻辑清晰的论文框架，并将初步草稿修改成地道、自然的学术文本，去除明显的“AI痕迹”。
你必须始终保持严谨、专业的学术语气。
`;

export interface OutlineParams {
  topic: string;
  type: string;
  mainArguments: string;
  requirements: string;
}

export interface StyleParams {
  goal: string;
  text: string;
}

export const generatePaperOutline = async (params: OutlineParams): Promise<string> => {
  const prompt = `
功能模式： 生成框架
我的主题是： ${params.topic}
论文类型： ${params.type}
主要论点/假设： ${params.mainArguments}
特殊要求： ${params.requirements || "无"}

请根据上述信息，生成一个三级标题（章、节、小节）的详细框架。请严格遵循标准的学术论文结构。
格式要求如下：
## 📊 论文框架生成结果

🎯 论文主题：${params.topic}

第一章 ...
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced for creativity and structure
      },
    });
    return response.text || "无法生成内容，请重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("生成框架失败，请检查网络或稍后重试。");
  }
};

export const refineAcademicStyle = async (params: StyleParams): Promise<string> => {
  const prompt = `
功能模式： 风格修正
修正目标： ${params.goal}
需要修正的文本段落：
${params.text}

请扮演一位专业的学术编辑，执行以下修正任务：
1. 消除冗余词汇： 移除如“可以明确的是”、“显而易见地”等空洞、不必要的修饰语。
2. 转换僵硬表达： 将“AI腔”的结构（如过度使用被动语态、长句堆砌）转换为更简洁、更符合中文学术习惯的表达。
3. 提升专业性： 将日常或笼统的词语替换为准确的学术术语。
4. 保持原意不变。

请提供“修正后的文本”和“修正分析”两个部分，格式如下：
## ✍️ 风格修正结果

修正后的文本：
[在此处输出修正后的、地道自然的学术文本]

修正分析 (供参考)：
 * [原句片段] → [修正说明]
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6, // Slightly lower for precision editing
      },
    });
    return response.text || "无法生成内容，请重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("风格修正失败，请检查网络或稍后重试。");
  }
};
