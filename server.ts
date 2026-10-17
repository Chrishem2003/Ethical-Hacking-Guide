import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Mock lab container store (in memory)
interface ActiveLab {
  id: string;
  user_id: string;
  image: string;
  lesson_slug: string;
  status: 'running' | 'stopped';
  created_at: number;
  expires_at: number;
  ip_address: string;
  ws_url: string;
}

const activeLabs = new Map<string, ActiveLab>();

// Image allowlist as requested in prompt
const ALLOWED_IMAGES = [
  'hackforge/dvwa',
  'hackforge/metasploitable2',
  'hackforge/juice-shop',
  'hackforge/kali-toolbox',
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'HACKFORGE by Chrishem',
    version: '2.6.0',
    hasAiKey: Boolean(apiKey),
    active_labs_count: activeLabs.size,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/courses and /api/curriculum
app.get('/api/courses', (req, res) => {
  try {
    const curriculumPath = path.resolve(__dirname, 'content', 'curriculum.json');
    if (fs.existsSync(curriculumPath)) {
      const data = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
      return res.json({ courses: data });
    }
    return res.json({ courses: [] });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to read curriculum' });
  }
});

// LAB ORCHESTRATION ENDPOINTS: /api/labs/start & /api/labs/stop
app.post('/api/labs/start', (req, res) => {
  const { lesson_slug, image = 'hackforge/metasploitable2', user_id = 'user_demo' } = req.body;

  if (!ALLOWED_IMAGES.includes(image)) {
    return res.status(400).json({
      error: `Image '${image}' is not in the authorized Hackforge allowlist.`,
      allowed: ALLOWED_IMAGES,
    });
  }

  const labId = `lab-${Date.now().toString(36)}`;
  const now = Date.now();
  const ttlMs = 60 * 60 * 1000; // 60-min TTL

  const newLab: ActiveLab = {
    id: labId,
    user_id,
    image,
    lesson_slug: lesson_slug || 'lab-sandbox',
    status: 'running',
    created_at: now,
    expires_at: now + ttlMs,
    ip_address: '192.168.56.102',
    ws_url: `wss://labs.hackforge.dev/ws/${lesson_slug || 'sandbox'}?token=${labId}`,
  };

  activeLabs.set(labId, newLab);

  return res.json({
    status: 'started',
    lab: newLab,
    sandbox: {
      ram_limit: '512MB',
      cpu_quota: 0.5,
      isolated_network: 'hackforge_sandbox_net',
      ttl_seconds: 3600,
    },
  });
});

app.post('/api/labs/stop', (req, res) => {
  const { lab_id } = req.body;
  if (lab_id && activeLabs.has(lab_id)) {
    activeLabs.delete(lab_id);
    return res.json({ status: 'stopped', lab_id });
  }
  return res.json({ status: 'stopped', lab_id: 'default' });
});

app.get('/api/labs/active', (_req, res) => {
  return res.json({
    active_labs: Array.from(activeLabs.values()),
    count: activeLabs.size,
  });
});

// QUIZ SUBMISSION ENDPOINT: /api/quizzes/submit
app.post('/api/quizzes/submit', (req, res) => {
  const { lesson_slug, answers } = req.body;
  // Answers format: { 0: 1, 1: 2, ... }
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  // Calculate score
  const total = Object.keys(answers).length || 5;
  const score = total; // Mock calculation
  const passed = score >= Math.ceil(total * 0.8);

  return res.json({
    lesson_slug,
    score,
    total,
    passed,
    xp_awarded: passed ? 250 : 0,
    message: passed ? 'Knowledge check passed! Lesson unlocked.' : 'Score below 80% threshold.',
  });
});

// AI Cyber Mentor endpoint
app.post('/api/mentor', async (req, res) => {
  try {
    const { message, chapterTitle, contextCode, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      return res.json({
        reply: `### [HACKFORGE Cyber Mentor - Offline Knowledge Base]
**Regarding:** "${message}"

- Always ensure testing takes place within the **hackforge/metasploitable2** or **hackforge/dvwa** sandbox.
- When running Nmap, use \`-sC -sV\` for service detection and script scanning.
- In Active Directory environments, remember that Kerberoasting queries registered SPNs using \`GetUserSPNs.py\`.
- All activities adhere strictly to CFAA, GDPR, and signed Rules of Engagement (ROE).`,
      });
    }

    const systemPrompt = `You are Chrishem's AI Offensive Security & Penetration Testing Educator at HACKFORGE.
Your role: Teach ethical hacking, penetration testing, and security auditing from zero to professional with absolute technical accuracy, no fluff, and zero sanitized hesitation.
Always provide real runnable commands, precise flags, realistic terminal outputs, and clear defensive remediation advice.
Frame everything within authorized penetration testing and responsible disclosure.
Current Lesson Context: ${chapterTitle || 'HACKFORGE Curriculum'}.
${contextCode ? `Relevant Code/Snippet:\n\`\`\`\n${contextCode}\n\`\`\`` : ''}`;

    const contents: any[] = [];
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const entry of conversationHistory.slice(-6)) {
        contents.push({
          role: entry.role === 'user' ? 'user' : 'model',
          parts: [{ text: entry.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.35,
      },
    });

    return res.json({
      reply: response.text || 'No response generated. Please retry.',
    });
  } catch (error: any) {
    console.error('Error in /api/mentor:', error);
    return res.status(500).json({
      error: 'Failed to process AI mentor request',
      details: error?.message || 'Unknown error',
    });
  }
});

// Mount Vite in development, or serve static dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[HACKFORGE Server] listening on http://0.0.0.0:${PORT} (Node ${process.version})`);
  });
}

startServer();
