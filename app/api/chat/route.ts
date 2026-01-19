import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Fallback responses when API is unavailable
const fallbackResponses = [
  "I'm here to help! While I'm currently in demo mode, I can still chat with you. What would you like to discuss?",
  "That's an interesting question! In a full implementation, I'd connect to an AI service to provide detailed answers.",
  "Thanks for your message! I'm a demo chatbot showcasing the UI. For full AI capabilities, add your Gemini API key to the environment variables.",
  "I appreciate your question! This is a demonstration of the chat interface. Feel free to explore the features like creating new conversations, editing titles, and more.",
  "Hello! I'm SimpleChat's demo assistant. Configure your GEMINI_API_KEY in .env.local for AI-powered responses!",
];

function getFallbackResponse(): string {
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if Gemini API key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
      } catch (apiError) {
        console.error('Gemini API error:', apiError);
        // Fall through to fallback responses
      }
    }

    // Use intelligent fallback responses based on message content
    let response = getFallbackResponse();
    
    // Add some basic response logic
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = "Hello! 👋 Welcome to SimpleChat! I'm your AI assistant. How can I help you today?\n\n💡 Tip: Add your GEMINI_API_KEY to .env.local for full AI-powered responses!";
    } else if (lowerMessage.includes('how are you')) {
      response = "I'm doing great, thank you for asking! 😊 I'm here and ready to assist you with anything you need. What's on your mind?";
    } else if (lowerMessage.includes('what can you do') || lowerMessage.includes('help')) {
      response = "I can help you with a variety of tasks! Here's what I can assist with:\n\n• Answering questions and providing information\n• Having friendly conversations\n• Explaining concepts in simple terms\n• Brainstorming ideas with you\n\nJust type your question or topic, and I'll do my best to help!";
    } else if (lowerMessage.includes('thank')) {
      response = "You're welcome! 😊 I'm always happy to help. Is there anything else you'd like to know or discuss?";
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      response = "Goodbye! 👋 It was great chatting with you. Feel free to come back anytime you have questions or just want to chat!";
    } else if (lowerMessage.includes('weather')) {
      response = "I don't have access to real-time weather data in demo mode, but with a Gemini API key configured, I could help you with weather-related questions! ☀️🌧️";
    } else if (lowerMessage.includes('joke')) {
      response = "Here's one for you: Why do programmers prefer dark mode? Because light attracts bugs! 😄🐛";
    } else if (lowerMessage.includes('name')) {
      response = "I'm SimpleChat, your friendly AI assistant! I was created to demonstrate a modern chat interface with features like conversation management and local storage persistence.";
    }

    // Simulate a slight delay to feel more natural
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}
