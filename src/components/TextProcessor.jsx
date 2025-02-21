import React, { useState } from 'react';
import { Send, Type } from 'lucide-react';

// Message type definition for TypeScript-like clarity
const MessageType = {
    USER: 'user',
    SYSTEM: 'system'
};

const TextProcessor = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isProcessing, setIsProcessing] = useState(false);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'es', name: 'Spanish' },
        { code: 'ru', name: 'Russian' },
        { code: 'tr', name: 'Turkish' },
        { code: 'fr', name: 'French' }
    ];

    // Mock API functions (replace with actual Chrome AI API calls)
    const detectLanguage = async (text) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { language: 'en', confidence: 0.9 };
    };

    const summarizeText = async (text) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `Summary: ${text.substring(0, 100)}...`;
    };

    const translateText = async (text, targetLang) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `Translated to ${targetLang}: ${text.substring(0, 100)}...`;
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        try {
            setIsProcessing(true);

            // Add user message
            const newMessage = {
                id: Date.now(),
                type: MessageType.USER,
                text: inputText,
                actions: []
            };

            // Detect language
            const langResult = await detectLanguage(inputText);
            newMessage.detectedLanguage = langResult.language;

            // Add summarize button if text is > 150 chars and in English
            if (inputText.length > 150 && langResult.language === 'en') {
                newMessage.actions.push('summarize');
            }

            // Add translate action for all messages
            newMessage.actions.push('translate');

            setMessages(prev => [...prev, newMessage]);
            setInputText('');
        } catch (error) {
            console.error('Error processing message:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSummarize = async (messageId) => {
        try {
            setIsProcessing(true);
            const message = messages.find(m => m.id === messageId);
            if (!message) return;

            const summary = await summarizeText(message.text);

            const summaryMessage = {
                id: Date.now(),
                type: MessageType.SYSTEM,
                text: summary,
                parentId: messageId,
                isSummary: true
            };

            setMessages(prev => [...prev, summaryMessage]);
        } catch (error) {
            console.error('Error summarizing:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTranslate = async (messageId) => {
        try {
            setIsProcessing(true);
            const message = messages.find(m => m.id === messageId);
            if (!message) return;

            const translation = await translateText(message.text, selectedLanguage);

            const translationMessage = {
                id: Date.now(),
                type: MessageType.SYSTEM,
                text: translation,
                parentId: messageId,
                isTranslation: true
            };

            setMessages(prev => [...prev, translationMessage]);
        } catch (error) {
            console.error('Error translating:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                    <div key={message.id} className={`flex flex-col ${message.type === MessageType.USER ? 'items-end' : 'items-start'}`}>
                        {/* Message Bubble */}
                        <div className={`max-w-[80%] rounded-lg p-4 ${message.type === MessageType.USER
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 border'
                            }`}>
                            <p className="break-words">{message.text}</p>

                            {/* Language Detection */}
                            {message.detectedLanguage && (
                                <p className="text-sm mt-2 opacity-75">
                                    Detected Language: {languages.find(l => l.code === message.detectedLanguage)?.name || message.detectedLanguage}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {message.actions?.length > 0 && (
                            <div className="mt-2 space-x-2">
                                {message.actions.includes('summarize') && (
                                    <button
                                        onClick={() => handleSummarize(message.id)}
                                        disabled={isProcessing}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                    >
                                        Summarize
                                    </button>
                                )}
                                {message.actions.includes('translate') && (
                                    <div className="inline-flex space-x-2">
                                        <select
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                            className="rounded border p-2"
                                        >
                                            {languages.map(lang => (
                                                <option key={lang.code} value={lang.code}>
                                                    {lang.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleTranslate(message.id)}
                                            disabled={isProcessing}
                                            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                                        >
                                            Translate
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
                <div className="flex space-x-2 max-w-4xl mx-auto">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 resize-none border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        aria-label="Message input"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isProcessing || !inputText.trim()}
                        className="px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                        aria-label="Send message"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextProcessor;