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
        <div className="container">
            {/* Messages Area */}
            <div className="message">
                {messages.map(message => (
                    <div key={message.id} className={`mess-col ${message.type === MessageType.USER ? 'items-end' : 'items-start'}`}>
                        {/* Message Bubble */}
                        <div className={`max ${message.type === MessageType.USER
                            }`}>
                            <p className="break-words">{message.text}</p>

                            {/* Language Detection */}
                            {message.detectedLanguage && (
                                <p className="text">
                                    Detected Language: {languages.find(l => l.code === message.detectedLanguage)?.name || message.detectedLanguage}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {message.actions?.length > 0 && (
                            <div className="mt">
                                {message.actions.includes('summarize') && (
                                    <button
                                        onClick={() => handleSummarize(message.id)}
                                        disabled={isProcessing}
                                        className="majof"
                                    >
                                        Summarize 
                                    </button>
                                )}
                                {message.actions.includes('translate') && (
                                    <div className="inline">
                                        <select
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                            className="rounded"
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
                                            className="main"
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
            <div className="input">
                <div className="main">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message..."
                        className=""
                        rows={5}
                        aria-label="Message input"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isProcessing || !inputText.trim()}
                        className="btn"
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