// 更新前端调用
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL + "/api/deepseek";

interface ChatMsg {
  id: number;
  role: "user" | "bot";
  text: string;
  isError?: boolean;
  isEgg?: boolean;
}

// 可选参数接口
interface SendMessageOptions {
  character?: string; // 角色ID，默认 "kati"
  additionalPrompt?: string; // 额外指令，最多200字符（后端限制）
  temperature?: number; // 温度参数 0-2，默认0.7
}

/**
 * 发送消息到后端DeepSeek接口
 * @param inputMessage 用户输入的消息
 * @param history 历史聊天记录
 * @param optionsOrCharacter 可选参数对象 或 角色ID字符串（兼容旧调用）
 * @returns AI回复文本
 */
export async function sendMessageToHui(
  inputMessage: string,
  history: ChatMsg[],
  optionsOrCharacter: string | SendMessageOptions = "kati"
): Promise<string> {
  try {
    // 处理参数兼容性：如果第二个参数是字符串，则当作 character；否则当作 options 对象
    let options: SendMessageOptions;
    if (typeof optionsOrCharacter === "string") {
      options = { character: optionsOrCharacter };
    } else {
      options = optionsOrCharacter || {};
    }

    const { character = "kati", additionalPrompt, temperature } = options;

    const requestBody: any = {
      inputMessage,
      history,
      character,
    };

    // 仅在提供了额外参数时才添加到请求体，避免传递 undefined
    if (additionalPrompt !== undefined) {
      requestBody.additionalPrompt = additionalPrompt;
    }
    if (temperature !== undefined) {
      requestBody.temperature = temperature;
    }

    const response = await axios.post(`${API_BASE}/chat`, requestBody);

    if (response.data.error) {
      throw new Error(response.data.message);
    }

    return response.data.data.response;
  } catch (error: any) {
    console.error("API调用错误:", error);
    return "error";
  }
}

// 获取可用角色列表
export async function getAvailableCharacters() {
  const response = await axios.get(`${API_BASE}/characters`);
  return response.data.data;
}
