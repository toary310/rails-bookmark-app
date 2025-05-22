import axios from "axios";
import { Message, MessageRole } from "../../components/chat/message";

const API_URL = process.env.NEXT_PUBLIC_GROK_API_URL || "https://api.x.ai";

type GrokRequestBody = {
  messages: {
    role: MessageRole;
    content: string;
  }[];
  model: string;
  temperature: number;
  max_tokens: number;
  stream: boolean;
}

interface GrokResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: MessageRole;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const grokClient = {
  async sendMessage(messages: Message[]): Promise<Message> {
    try {
      if (process.env.NEXT_PUBLIC_GROK_API_KEY === 'your_grok_api_key_here') {
        console.log("APIキーが設定されていないため、モックレスポンスを返します");
        
        const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
        const userContent = lastUserMessage?.content || '';
        
        return {
          id: `mock-${Date.now()}`,
          role: "assistant",
          content: getMockResponse(userContent),
          timestamp: Date.now()
        };
      }
      
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await axios.post<GrokResponse>(
        `${API_URL}/v1/chat/completions`,
        {
          messages: apiMessages,
          model: "grok-1",
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        } as GrokRequestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROK_API_KEY}`
          }
        }
      );

      const responseMessage: Message = {
        id: response.data.id,
        role: "assistant",
        content: response.data.choices[0].message.content,
        timestamp: Date.now()
      };

      return responseMessage;
    } catch (error) {
      console.error("Grok API error:", error);
      return {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "申し訳ありません。エラーが発生しました。しばらくしてからもう一度お試しください。",
        timestamp: Date.now()
      };
    }
  }
};

function getMockResponse(userMessage: string): string {
  if (userMessage.includes('こんにちは') || userMessage.includes('はじめまして')) {
    return 'こんにちは！Grok AIアシスタントです。どのようにお手伝いできますか？';
  }
  
  if (userMessage.includes('できること') || userMessage.includes('何ができる')) {
    return '私はGrok AIアシスタントです。質問に答えたり、情報提供したり、会話を楽しんだりすることができます。また、プログラミング、科学、歴史、文化など様々なトピックについてお話しできます。';
  }
  
  if (userMessage.includes('天気')) {
    return '申し訳ありませんが、現在のリアルタイムデータにアクセスできないため、正確な天気情報を提供できません。天気予報サービスやアプリをご利用ください。';
  }
  
  if (userMessage.includes('ありがとう')) {
    return 'どういたしまして！他に何かお手伝いできることがあれば、お気軽にお尋ねください。';
  }
  
  return `ご質問ありがとうございます。これはモックレスポンスです。実際のGrok APIを使用するには、有効なAPIキーを.env.localファイルに設定してください。\n\nあなたのメッセージ: "${userMessage}"`;
}
