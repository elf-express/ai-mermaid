import { cleanText } from "@/lib/utils";

export async function POST(request) {
  try {
    const { text, diagramType, aiConfig, accessPassword } = await request.json();

    if (!text) {
      return Response.json({ error: "請提供文本內容" }, { status: 400 });
    }

    const cleanedText = cleanText(text);
    
    let finalConfig;
    
    // 步驟1: 檢查是否有完整的aiConfig
    const hasCompleteAiConfig = aiConfig?.apiUrl && aiConfig?.apiKey && aiConfig?.modelName;
    
    if (hasCompleteAiConfig) {
      // 如果有完整的aiConfig，直接使用
      finalConfig = {
        apiUrl: aiConfig.apiUrl,
        apiKey: aiConfig.apiKey,
        modelName: aiConfig.modelName
      };
    } else {
      // 步驟2: 如果沒有完整的aiConfig，則檢驗accessPassword
      if (accessPassword) {
        // 步驟3: 如果傳入了accessPassword，驗證是否有效
        const correctPassword = process.env.ACCESS_PASSWORD;
        const isPasswordValid = correctPassword && accessPassword === correctPassword;
        
        if (!isPasswordValid) {
          // 如果密碼無效，直接報錯
          return Response.json({ 
            error: "訪問密碼無效" 
          }, { status: 401 });
        }
      }
      
      // 如果沒有傳入accessPassword或者accessPassword有效，使用環境變數配置
      finalConfig = {
        apiUrl: process.env.AI_API_URL || process.env.NEXT_PUBLIC_AI_API_URL,
        apiKey: process.env.AI_API_KEY || process.env.NEXT_PUBLIC_AI_API_KEY,
        modelName: process.env.AI_MODEL_NAME || process.env.NEXT_PUBLIC_AI_MODEL_NAME
      };
    }

    // 檢查最終配置是否完整
    if (!finalConfig.apiUrl || !finalConfig.apiKey || !finalConfig.modelName) {
      return Response.json({ 
        error: "AI配置不完整，請在設置中配置API URL、API Key和模型名稱" 
      }, { status: 400 });
    }

    // 構建 prompt 根據圖表類型
    let systemPrompt = `
    目的和目標：
* 理解用戶提供的文件的結構和邏輯關係。
* 準確地將文件內容和關係轉化為符合mermaid語法的圖表代碼。
* 確保圖表中包含文件的所有關鍵元素和它們之間的聯繫。

行為和規則：
1. 分析文件：
a) 仔細閱讀和分析用戶提供的文件內容。
b) 識別文件中的不同元素（如概念、實體、步驟、流程等）。
c) 理解這些元素之間的各種關係（如從屬、包含、流程、因果等）。
d) 識別文件中蘊含的邏輯結構和流程。
2. 圖表生成：
    `
    
    if (diagramType && diagramType !== "auto") {
      systemPrompt += `a) 請特別生成 ${diagramType} 類型的圖表。`;
    } else {
      systemPrompt += `a) 根據分析結果，選擇最適合表達文件結構的mermaid圖表類型（流程圖、時序圖、類圖中的一種）。`;
    }

    systemPrompt += `
    b) 使用正確的mermaid語法創建圖表代碼，充分參考下面的Mermaid 語法特殊字元說明："""
* Mermaid 的核心特殊字元主要用於**定義圖表結構和關係**。
* 要在節點 ID 或標籤中**顯示**特殊字元(如括號，引號）或包含**空格**，最常用方法是用**雙引號 \`""\`** 包裹。
* 在標籤文本（引號內）中顯示 HTML 特殊字元 (\`<\`, \`>\`, \`&\`) 或 \`#\` 等，應使用 **HTML 實體編碼**。
* 使用 \`%%\` 進行**注釋**。
* 序號之後不要跟進空格，比如\`1. xxx\`應該改成\`1.xxx\`
* 用不同的背景色以區分不同層級或是從屬的元素\`
`

systemPrompt+=`
c) 確保圖表清晰、易於理解，準確反映文件的內容和邏輯。

d) 不要使用<artifact>標籤包裹代碼，而是直接以markdown格式返回代碼。
`

systemPrompt += `
3. 細節處理：
a) 避免遺漏文件中的任何重要細節或關係。
b) 生成的圖表代碼應可以直接複製並黏貼到支持mermaid語法的工具或平台中使用。
整體語氣：
* 保持專業和嚴謹的態度。
* 清晰、準確地表達圖表的內容。
* 在需要時，可以提供簡短的解釋或建議。
`

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: cleanedText,
      },
    ];

    // 構建API URL
    const url = finalConfig.apiUrl.includes("v1") || finalConfig.apiUrl.includes("v3") 
      ? `${finalConfig.apiUrl}/chat/completions` 
      : `${finalConfig.apiUrl}/v1/chat/completions`;
    
    console.log('Using AI config:', { 
      url, 
      modelName: finalConfig.modelName,
      hasApiKey: !!finalConfig.apiKey,
    });

    // 創建一個流式響應
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 發送請求到 AI API (開啟流式模式)
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${finalConfig.apiKey}`,
            },
            body: JSON.stringify({
              model: finalConfig.modelName,
              messages,
              stream: true, // 開啟流式輸出
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("AI API Error:", response.status, errorText);
            controller.enqueue(encoder.encode(JSON.stringify({ 
              error: `AI服務返回錯誤 (${response.status}): ${errorText || 'Unknown error'}` 
            })));
            controller.close();
            return;
          }

          // 讀取流式響應
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let mermaidCode = "";
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // 解析返回的數據塊
            const chunk = decoder.decode(value, { stream: true });
            
            // 處理數據行
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6);
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content || '';
                  if (content) {
                    mermaidCode += content;
                    // 發送給用戶端
                    controller.enqueue(encoder.encode(JSON.stringify({ 
                      chunk: content,
                      done: false 
                    })));
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e);
                }
              }
            }
          }
          
          // 提取代碼塊中的內容（如果有代碼塊標記）
          const codeBlockMatch = mermaidCode.match(/```(?:mermaid)?\s*([\s\S]*?)```/);
          const finalCode = codeBlockMatch ? codeBlockMatch[1].trim() : mermaidCode;

          // 這裡插入 parseMermaidToExcalidraw 呼叫
          // 假設 parseMermaidToExcalidraw 是 async 並已正確引入
          // const { elements, files } = await parseMermaidToExcalidraw(finalCode);

          // 發送完成信號
          controller.enqueue(encoder.encode(JSON.stringify({ 
            mermaidCode: finalCode,
            // elements, // 若要回傳可加上
            // files,    // 若要回傳可加上
            done: true 
          })));
          
        } catch (error) {
          console.error("Streaming Error:", error);
          controller.enqueue(encoder.encode(JSON.stringify({ 
            error: `處理請求時發生錯誤: ${error.message}`, 
            done: true 
          })));
        } finally {
          controller.close();
        }
      }
    });

    // 返回流式響應
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return Response.json(
      { error: `處理請求時發生錯誤: ${error.message}` }, 
      { status: 500 }
    );
  }
}
