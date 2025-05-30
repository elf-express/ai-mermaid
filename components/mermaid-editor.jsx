"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";

// 新增的流式內容顯示組件
function StreamingDisplay({ content, isStreaming }) {
  const contentRef = useRef(null);
  
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content]);
  
  if (!isStreaming && !content) return null;
  
  return (
    <div className="mb-2 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">AI生成</h3>
        {isStreaming && (
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="animate-pulse mr-1 h-2 w-2 rounded-full bg-green-500"></div>
            正在生成...
          </div>
        )}
      </div>
      <div 
        ref={contentRef} 
        className="border rounded-md p-3 h-[120px] overflow-y-auto font-mono text-sm bg-muted/50"
      >
        {content || "等待生成..."}
      </div>
    </div>
  );
}

export function MermaidEditor({ code, onChange, streamingContent, isStreaming }) {
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    
    if (success) {
      setCopied(true);
      toast.success("已複製到剪貼板");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } else {
      toast.error("複製失敗");
    }
  };

  return (
    <div className="flex flex-col h-[320px] md:h-[480px]">
      {/* 流式內容顯示區域 */}
      <StreamingDisplay 
        content={streamingContent}
        isStreaming={isStreaming}
      />
      
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Mermaid 語法</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!code}
          className="h-8 gap-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              已複製
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              複製語法
            </>
          )}
        </Button>
      </div>
      <Textarea
        value={code}
        onChange={handleChange}
        placeholder="生成的 Mermaid 語法將顯示在這裏..."
        className="flex-1 min-h-0 font-mono text-sm mermaid-editor overflow-y-auto resize-none"
      />
    </div>
  );
} 