import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
const router = express.Router();
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
// Store conversation history
const conversationHistory = new Map();
// Helper function to fetch file from URL and convert to base64
async function fetchFileAsBase64(fileUrl) {
    try {
        console.log('🔍 Attempting to fetch file from URL:', fileUrl);
        const response = await fetch(fileUrl);
        console.log('📥 Fetch response status:', response.status, response.statusText);
        console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        const buffer = await response.buffer();
        console.log('📦 File buffer size:', buffer.length, 'bytes');
        const base64Data = buffer.toString('base64');
        console.log('🔄 Base64 conversion completed, length:', base64Data.length);
        const contentType = response.headers.get('content-type') || '';
        let mimeType = contentType;
        if (!mimeType) {
            if (fileUrl.toLowerCase().includes('.pdf')) {
                mimeType = 'application/pdf';
            }
            else if (fileUrl.toLowerCase().includes('.jpg') || fileUrl.toLowerCase().includes('.jpeg')) {
                mimeType = 'image/jpeg';
            }
            else if (fileUrl.toLowerCase().includes('.png')) {
                mimeType = 'image/png';
            }
            else if (fileUrl.toLowerCase().includes('.txt')) {
                mimeType = 'text/plain';
            }
            else {
                mimeType = 'application/octet-stream';
            }
        }
        console.log('✅ Detected MIME type:', mimeType);
        return { data: base64Data, mimeType };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Error fetching file:', errorMessage);
        throw error;
    }
}
// Updated helper function to get user's files from Supabase with proper debugging
async function getUserFiles(userId) {
    try {
        console.log('🔍 Fetching files for userId:', userId);
        const { data: files, error } = await supabase
            .from('records')
            .select('file_url, created_at, id, filename, summary')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        console.log('📊 Supabase query result:');
        console.log('  - Error:', error);
        console.log('  - Files count:', files?.length || 0);
        console.log('  - Files data:', JSON.stringify(files, null, 2));
        if (error) {
            console.error('❌ Supabase error:', error);
            return [];
        }
        // Log each file URL for debugging
        if (files && files.length > 0) {
            files.forEach((file, index) => {
                console.log(`📁 File ${index + 1}:`);
                console.log(`  - ID: ${file.id}`);
                console.log(`  - Filename: ${file.filename}`);
                console.log(`  - File URL: ${file.file_url}`);
                console.log(`  - Created: ${file.created_at}`);
            });
        }
        else {
            console.log('📭 No files found for user:', userId);
        }
        return files || [];
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Error fetching user files:', errorMessage);
        return [];
    }
}
// Function to check if user is asking about files and analyze them
async function analyzeUserFilesIfRequested(message, userId, model, chat) {
    // Keywords that might indicate user wants file analysis
    const fileKeywords = [
        'my file', 'my files', 'my report', 'my reports', 'my lab', 'my test',
        'uploaded file', 'my document', 'my documents', 'analyze my', 'check my',
        'my results', 'my prescription', 'my x-ray', 'my scan', 'my blood test',
        'file', 'document', 'report', 'analyze', 'test'
    ];
    const messageText = message.toLowerCase();
    const isFileRequest = fileKeywords.some(keyword => messageText.includes(keyword));
    console.log('🔍 File request check:');
    console.log('  - Message:', messageText);
    console.log('  - Is file request:', isFileRequest);
    console.log('  - Matched keywords:', fileKeywords.filter(keyword => messageText.includes(keyword)));
    if (!isFileRequest) {
        console.log('❌ User is not asking about files');
        return null; // User is not asking about files
    }
    console.log('✅ User is asking about files, fetching...');
    // Fetch user's files
    const userFiles = await getUserFiles(userId);
    if (userFiles.length === 0) {
        console.log('📭 No files found for user');
        return "I don't see any uploaded files in your records. Please upload your medical documents first, then I'll be happy to analyze them for you.";
    }
    // For simplicity, analyze the most recent file
    const mostRecentFile = userFiles[0];
    console.log('🎯 Analyzing most recent file:');
    console.log('  - File ID:', mostRecentFile.id);
    console.log('  - Filename:', mostRecentFile.filename);
    console.log('  - File URL:', mostRecentFile.file_url);
    console.log('  - Summary:', mostRecentFile.summary);
    // **IMPORTANT: Print the file URL that AI will try to access**
    console.log('🌐 FILE URL FOR AI ANALYSIS:', mostRecentFile.file_url);
    try {
        console.log('🔄 Starting file analysis...');
        const { data: base64Data, mimeType } = await fetchFileAsBase64(mostRecentFile.file_url);
        const fileAnalysisPrompt = `Please analyze this medical file and provide insights based on the user's question: "${message}"
        
        File information: ${mostRecentFile.filename || 'Medical file'} ${mostRecentFile.summary ? `- ${mostRecentFile.summary}` : ''}`;
        console.log('🤖 Sending to Gemini AI for analysis...');
        console.log('📝 Analysis prompt:', fileAnalysisPrompt);
        const result = await chat.sendMessage([
            {
                text: fileAnalysisPrompt
            },
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            }
        ]);
        const response = result.response.text();
        console.log('✅ AI analysis completed successfully');
        console.log('📤 AI response length:', response.length);
        return response;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('❌ Error analyzing file:', errorMessage);
        if (errorStack) {
            console.error('❌ Error stack:', errorStack);
        }
        console.error('❌ Error details:', {
            message: errorMessage,
            stack: errorStack
        });
        return "I found your uploaded file but couldn't analyze it right now. Please make sure the file is properly uploaded and accessible. Error details: " + errorMessage;
    }
}
// Main message route
router.post('/message', async (req, res) => {
    try {
        const { message, userId, conversationType = 'medical' } = req.body;
        console.log('📥 Received message request:');
        console.log('  - Message:', message);
        console.log('  - User ID:', userId);
        console.log('  - Conversation Type:', conversationType);
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
        // Enhanced system prompt for file analysis
        const systemPrompt = `You are Diagno AI, a helpful, empathetic medical assistant created by Diagno Easy. Your job is to:

1. Provide reliable, simple, and first-level health information to users based on their symptoms or concerns
2. **Analyze medical documents, lab reports, prescriptions, and health-related files when users ask about their uploaded files**
3. Share short health and wellness tips as needed (e.g., hydration, rest, light diet)
4. Encourage users to consult with a real doctor for diagnosis or treatment — you are NOT a replacement for a licensed medical professional

When analyzing medical files (lab reports, prescriptions, X-rays, etc.):
- Extract key medical information clearly
- Explain technical terms in simple language  
- Highlight any concerning values or findings
- Always recommend consulting with a healthcare professional for interpretation
- Provide context about what the results might mean in general terms

If the conversation context makes it relevant, tell users about Diagno Easy's services, such as:
- 24/7 Emergency Ambulance Booking
- Doctor at Home Service
- Online Doctor Consultation  
- Lab Tests at Home
- Medical Equipment at Home

IMPORTANT RULES:
- Use proper spacing and formatting in your response
- When appropriate, include **bold headings** (e.g., **File Analysis**, **Key Findings**, **Recommendations**)
- Separate sections using line breaks for mobile readability
- Never make definitive diagnoses
- Always remind users to consult a professional for medical interpretation
- Be kind, conversational, and supportive in tone`;
        // Initial system conversation
        const formattedHistory = [
            {
                role: 'user',
                parts: [{ text: systemPrompt }],
            },
            {
                role: 'model',
                parts: [{ text: "Understood. I'm Diagno AI, your health assistant from Diagno Easy. I can help with health questions and analyze your uploaded medical documents. How can I assist you today?" }],
            }
        ];
        // Add recent conversation history
        const recentHistory = userHistory.slice(-8);
        for (const msg of recentHistory) {
            formattedHistory.push({
                role: msg.role,
                parts: msg.parts
            });
        }
        const chat = model.startChat({
            history: formattedHistory,
        });
        let aiResponse;
        let responseType = 'health_advice';
        console.log('🔄 Processing message...');
        // Check if user is asking about their files and analyze if needed
        const fileAnalysisResult = await analyzeUserFilesIfRequested(message, userId, model, chat);
        if (fileAnalysisResult) {
            console.log('📁 File analysis completed');
            aiResponse = fileAnalysisResult;
            responseType = 'file_analysis';
        }
        else {
            console.log('💬 Regular chat response');
            // Regular chat response
            const result = await chat.sendMessage(message);
            aiResponse = result.response.text();
        }
        // Add AI response to history
        userHistory.push({
            role: 'model',
            parts: [{ text: aiResponse }],
            timestamp: new Date()
        });
        // Limit history size
        if (userHistory.length > 10) {
            userHistory.splice(0, userHistory.length - 10);
        }
        console.log('✅ Response sent successfully');
        res.json({
            response: aiResponse,
            type: responseType,
            timestamp: new Date()
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ AI Chat Error:', errorMessage);
        res.status(500).json({
            error: 'Failed to process message',
            fallback: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
        });
    }
});
// Enhanced debug endpoint
router.get('/debug/files/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('🔍 Debug: Checking files for userId:', userId);
        const files = await getUserFiles(userId);
        // Test file accessibility
        const fileAccessibility = [];
        for (const file of files) {
            try {
                const response = await fetch(file.file_url, { method: 'HEAD' });
                fileAccessibility.push({
                    id: file.id,
                    filename: file.filename,
                    url: file.file_url,
                    accessible: response.ok,
                    status: response.status,
                    contentType: response.headers.get('content-type')
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                fileAccessibility.push({
                    id: file.id,
                    filename: file.filename,
                    url: file.file_url,
                    accessible: false,
                    error: errorMessage
                });
            }
        }
        res.json({
            userId,
            filesFound: files.length,
            files,
            fileAccessibility
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Debug files error:', errorMessage);
        res.status(500).json({
            error: 'Failed to fetch files for debugging'
        });
    }
});
// Keep existing routes...
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
router.delete('/history/:userId', (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            error: 'UserId is required'
        });
    }
    conversationHistory.delete(userId);
    res.json({
        message: 'Conversation history cleared successfully',
        timestamp: new Date()
    });
});
export default router;
