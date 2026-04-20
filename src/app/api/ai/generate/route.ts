import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const MAX_BODY_SIZE = 2048;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI service not configured' },
      { status: 503 }
    );
  }

  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }

  let body: { region: string; count?: number; difficulty?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { region, count = 5, difficulty = 'medium' } = body;

  if (!region) {
    return NextResponse.json(
      { error: 'Missing required field: region' },
      { status: 400 }
    );
  }

  const sanitizedRegion = String(region).slice(0, 50);
  const sanitizedCount = Math.min(Math.max(1, Number(count) || 5), 10);
  const validDifficulties = ['easy', 'medium', 'hard'];
  const sanitizedDifficulty = validDifficulties.includes(String(difficulty))
    ? difficulty
    : 'medium';

  try {
    const client = new Anthropic({ apiKey });

    const prompt = `Ти — експерт з географії, культури та історії України. Згенеруй ${sanitizedCount} питань для квізу про ${sanitizedRegion} область/місто.

Складність: ${sanitizedDifficulty}
- easy: загальновідомі факти
- medium: цікаві факти, які знає більшість місцевих
- hard: маловідомі факти для справжніх знавців

Кожне питання має бути:
- Про географію, історію, культуру, архітектуру або відомих людей цього регіону
- Мати 4 варіанти відповідей
- Одна правильна відповідь (індекс 1-4)
- Коротке пояснення правильної відповіді

Відповідай у JSON масиві:
[
  {
    "question": "текст питання",
    "answers": ["варіант 1", "варіант 2", "варіант 3", "варіант 4"],
    "correctAnswer": 1,
    "explanation": "пояснення",
    "difficulty": "${sanitizedDifficulty}"
  }
]

Відповідай виключно українською мовою. Тільки JSON масив.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '[]';

    let questions: Array<{
      question: string;
      answers: string[];
      correctAnswer: number;
      explanation: string;
      difficulty: string;
    }>;

    try {
      questions = JSON.parse(text);
      if (!Array.isArray(questions)) {
        questions = [];
      }
    } catch {
      questions = [];
    }

    // Validate and sanitize each question
    const validated = questions
      .filter(
        (q) =>
          q.question &&
          Array.isArray(q.answers) &&
          q.answers.length === 4 &&
          typeof q.correctAnswer === 'number' &&
          q.correctAnswer >= 1 &&
          q.correctAnswer <= 4
      )
      .map((q) => ({
        question: String(q.question),
        answers: q.answers.map(String),
        correctAnswer: q.correctAnswer,
        explanation: String(q.explanation || ''),
        difficulty: String(q.difficulty || sanitizedDifficulty),
      }));

    return NextResponse.json({ questions: validated });
  } catch (error) {
    console.error('AI generate error:', error);
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 502 }
    );
  }
}
