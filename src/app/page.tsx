"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ThemeToggle from "@/components/ui/theme-toggle";
import ChatMessage, { Message } from "@/components/chat/message";
import ChatInput from "@/components/chat/chat-input";
import { grokClient } from "@/lib/api/grok";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function Home() {
  const [messages, setMessages] = useLocalStorage<Message[]>("chat-history", []);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log("isLoading state changed:", isLoading);
  }, [isLoading]);
  
  useEffect(() => {
    console.log("Messages state changed:", messages);
  }, [messages]);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const messagesRef = useRef<Message[]>([]);
  
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim() || isLoading) return;
    
    console.log("Sending message:", content);
    
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now()
    };
    
    const loadingMessage: Message = {
      id: "loading",
      role: "assistant",
      content: "",
      timestamp: Date.now()
    };
    
    // messagesRefを使用して最新の状態を取得
    const currentMessages = messagesRef.current;
    const newMessages = [...currentMessages, userMessage, loadingMessage];
    
    setMessages(newMessages);
    setIsLoading(true);
    
    const messageHistory = currentMessages.concat(userMessage);
    
    grokClient.sendMessage(messageHistory)
      .then(response => {
        console.log("Response received:", response);
        
        const latestMessages = messagesRef.current;
        
        const updatedMessages = latestMessages.map(msg =>
          msg.id === "loading" ? { ...response, id: uuidv4() } : msg
        );
        
        console.log("Updating messages with response:", updatedMessages);
        setMessages(() => updatedMessages as Message[]);
      })
      .catch(error => {
        console.error("メッセージ送信エラー:", error);
        
        const latestMessages = messagesRef.current;
        
        const updatedMessages = latestMessages.map(msg =>
          msg.id === "loading" ? {
            id: uuidv4(),
            role: "assistant",
            content: "申し訳ありません。エラーが発生しました。しばらくしてからもう一度お試しください。",
            timestamp: Date.now()
          } : msg
        );
        
        console.log("Updating messages with error:", updatedMessages);
        setMessages(() => updatedMessages as Message[]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isLoading, setMessages]); // messagesを依存配列から削除し、代わりにmessagesRefを使用

  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      if (typeof resetTranscript === 'function') {
        resetTranscript();
      }
      startListening();
    }
  }, [isListening, startListening, stopListening, resetTranscript]);

  const lastProcessedTranscriptRef = useRef("");
  const stableSendMessage = useRef((content: string) => {
    if (content.trim()) {
      handleSendMessage(content);
    }
  });
  
  useEffect(() => {
    if (transcript && 
        !isListening && 
        transcript !== lastProcessedTranscriptRef.current && 
        browserSupportsSpeechRecognition) {
      
      lastProcessedTranscriptRef.current = transcript;
      
      const timeoutId = setTimeout(() => {
        stableSendMessage.current(transcript);
        if (typeof resetTranscript === 'function') {
          resetTranscript();
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [transcript, isListening, browserSupportsSpeechRecognition, resetTranscript]);
  

  const clearHistory = () => {
    if (window.confirm("会話履歴をクリアしますか？")) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Grok AI チャットボット</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearHistory}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="会話履歴をクリア"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        {/* 会話がない場合の初期メッセージ */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-blue-500 dark:text-blue-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Grok AIにチャットしてみましょう</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              質問、会話、アイデアについて話しかけてください。Grok AIがお手伝いします。
            </p>
            {browserSupportsSpeechRecognition && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                マイクアイコンをクリックして音声入力を使用することもできます。
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {messages.map(message =>
              message.id === "loading" ? (
                <ChatMessage key={message.id} message={message} isLoading={true} />
              ) : (
                <ChatMessage key={message.id} message={message} />
              )
            )}
          </div>
        )}
      </main>

      {/* 入力フォーム */}
      <footer className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <div className="container mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onToggleVoiceInput={browserSupportsSpeechRecognition ? toggleVoiceInput : undefined}
            isListening={isListening}
          />
        </div>
      </footer>
    </div>
  );
}
