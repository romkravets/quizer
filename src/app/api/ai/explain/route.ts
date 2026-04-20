import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const MAX_BODY_SIZE = 4096;

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
    return NextResponse.json(
      { error: 'Request too large' },
      { status: 413 }
    );
  }

  let body: {
    question: string;
    correctAnswer: string;
    userAnswer: string;
    region: string;
    isCorrect: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { question, correctAnswer, userAnswer, region, isCorrect } = body;

  if (!question || !correctAnswer || !region) {
    return NextResponse.json(
      { error: 'Missing required fields: question, correctAnswer, region' },
      { status: 400 }
    );
  }

  // Sanitize inputs
  const sanitized = {
    question: String(question).slice(0, 500),
    correctAnswer: String(correctAnswer).slice(0, 200),
    userAnswer: String(userAnswer || '').slice(0, 200),
    region: String(region).slice(0, 50),
    isCorrect: Boolean(isCorrect),
  };

  try {
    const client = new Anthropic({ apiKey });

    const prompt = `Ти — експерт з географії та історії України. Користувач відповів на питання квізу про ${sanitized.region}.

Питання: ${sanitized.question}
Правильна відповідь: ${sanitized.correctAnswer}
Відповідь користувача: ${sanitized.userAnswer}
Чи правильно: ${sanitized.isCorrect ? 'Так' : 'Ні'}

Дай коротке пояснення (2-3 речення) ЧОМУ саме ця відповідь правильна, та один цікавий факт про це місто/область. Якщо є історичний контекст — додай його.

Відповідай у JSON форматі:
{
  "explanation": "чому ця відповідь правильна",
  "funFact": "цікавий факт про місто/область",
  "historicalContext": "історичний контекст (якщо є, інакше null)"
}

Відповідай виключно українською мовою. Тільки JSON, нічого іншого.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    let parsed: { explanation: string; funFact: string; historicalContext?: string | null };
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        explanation: text,
        funFact: '',
        historicalContext: null,
      };
    }

    return NextResponse.json({
      explanation: String(parsed.explanation || ''),
      funFact: String(parsed.funFact || ''),
      historicalContext: parsed.historicalContext ? String(parsed.historicalContext) : null,
    });
  } catch (error) {
    console.error('AI explain error:', error);
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 502 }
    );
  }
}
