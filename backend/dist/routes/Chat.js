import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
const router = express.Router();
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Store conversation history (in production, use a database)
const conversationHistory = new Map();
router.post('/message', async (req, res) => {
    try {
        const { message, userId, conversationType = 'medical' } = req.body;
        if (!message || !userId) {
            return res.status(400).json({
                error: 'Message and userId are required'
            });
        }
        // Get or create conversation history for user
        if (!conversationHistory.has(userId)) {
            conversationHistory.set(userId, []);
        }
        const userHistory = conversationHistory.get(userId);
        // Add user message to history
        userHistory.push({
            role: 'user',
            parts: [{ text: message }],
            timestamp: new Date()
        });
        // Use Gemini 1.5 Flash model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        // Build context for medical conversations
        // Build context for medical conversations
        const systemPrompt = `You are Diagno AI, a helpful, empathetic medical assistant created by Diagno Easy. Your job is to:
1. Provide reliable, simple, and first-level health information to users based on their symptoms or concerns
2. Share short health and wellness tips as needed (e.g., hydration, rest, light diet)
3. Encourage users to consult with a real doctor for diagnosis or treatment — you are NOT a replacement for a licensed medical professional
4. If the conversation context makes it relevant, tell users about Diagno Easy's services, such as:

   - 24/7 Emergency Ambulance Booking
   - 24/7 Hearse Van Service
   - Doctor at Home Service
   - Online Doctor Consultation
   - Lab Tests at Home
   - Medical Procedures (minor or specialized)
   - Medical Equipment at Home

Only mention services when relevant. For example:
- If a user reports chest pain, dizziness, shortness of breath, or any severe symptom, recommend an ambulance or immediate medical attention.
- If the user has stomach pain or fever, suggest a doctor at home or lab test if appropriate.
- If they mention medical devices (e.g., oxygen, wheelchair), mention the equipment rental service.
- If they ask questions about home tests or diagnostics, mention the lab test at home service.
- If they mention death or someone passed away, gently mention hearse van service.

IMPORTANT RULES:
- Use proper spacing and formatting in your response.
- When appropriate, include **bold headings** (e.g., **Symptoms**, **What You Can Do**, **Diagno Easy Can Help**).
- Separate sections using line breaks so it's easier to read on mobile.
- Never promote services unnecessarily or forcefully. Only bring them up when the user is clearly talking about or needing something health-service related.
- Be kind, conversational, and supportive in tone.
- Never make diagnoses or suggest medications.
- Always remind users to consult a professional when symptoms are serious or unclear.
- Limit your answers to what a virtual assistant can safely say.
- If a user is in crisis, encourage them to seek immediate help and offer relevant emergency services.`;
        // Initial system conversation (AI acknowledging setup)
        const formattedHistory = [
            {
                role: 'user',
                parts: [{ text: systemPrompt }],
            },
            {
                role: 'model',
                parts: [{ text: "Understood. I'm Diagno AI, your health assistant from Diagno Easy. I'm here to help with your health questions and guide you to relevant services when needed. How can I assist you today?" }],
            }
        ];
        // Add recent conversation history (ONLY role and parts, no timestamp/metadata)
        const recentHistory = userHistory.slice(-10);
        for (const msg of recentHistory) {
            formattedHistory.push({
                role: msg.role,
                parts: msg.parts
            });
        }
        const chat = model.startChat({
            history: formattedHistory,
        });
        // Generate AI response
        const result = await chat.sendMessage(message);
        const aiResponse = result.response.text();
        // Add AI response to history
        userHistory.push({
            role: 'model',
            parts: [{ text: aiResponse }],
            timestamp: new Date()
        });
        // Limit history size (keep last 10 messages for better performance)
        if (userHistory.length > 10) {
            userHistory.splice(0, userHistory.length - 10);
        }
        res.json({
            response: aiResponse,
            type: 'health_advice',
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({
            error: 'Failed to process message',
            fallback: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
        });
    }
});
// Get conversation history
router.get('/history/:userId', (req, res) => {
    const { userId } = req.params;
    const history = conversationHistory.get(userId) || [];
    res.json({
        history: history.map((msg) => ({
            role: msg.role,
            text: msg.parts[0].text,
            timestamp: msg.timestamp
        }))
    });
});
// Update the existing DELETE route in chat.ts
// Clear conversation history
router.delete('/history/:userId', (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            error: 'UserId is required'
        });
    }
    // Clear the conversation history for the user
    conversationHistory.delete(userId);
    res.json({
        message: 'Conversation history cleared successfully',
        timestamp: new Date()
    });
});
// Optional: Add a new endpoint to archive conversations before clearing
router.post('/archive/:userId', (req, res) => {
    const { userId } = req.params;
    const history = conversationHistory.get(userId) || [];
    // Here you could save to a database for chat history preservation
    // For now, we'll just return the history that would be archived
    conversationHistory.delete(userId);
    res.json({
        message: 'Conversation archived and cleared',
        archivedMessages: history.length,
        timestamp: new Date()
    });
});
export default router;
