import { NextRequest, NextResponse } from 'next/server';

// In-memory store for free trial tracking (persists until server restart)
// In production, use Redis or a database
const trialUsage = new Map<string, { count: number; lastUsed: number }>();

const FREE_LIMIT = 1; // 1 free optimization per IP
const COOLDOWN_HOURS = 24; // Reset after 24 hours

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return '127.0.0.1';
}

// GET: Check if user has free trials remaining
export async function GET(req: NextRequest) {
  const ip = getClientIP(req);
  const usage = trialUsage.get(ip);

  if (!usage) {
    return NextResponse.json({ canUse: true, remaining: FREE_LIMIT, used: 0 });
  }

  // Check cooldown
  const hoursSinceLastUse = (Date.now() - usage.lastUsed) / (1000 * 60 * 60);
  if (hoursSinceLastUse >= COOLDOWN_HOURS) {
    trialUsage.delete(ip);
    return NextResponse.json({ canUse: true, remaining: FREE_LIMIT, used: 0 });
  }

  const remaining = Math.max(0, FREE_LIMIT - usage.count);
  return NextResponse.json({
    canUse: remaining > 0,
    remaining,
    used: usage.count,
    resetInHours: Math.ceil(COOLDOWN_HOURS - hoursSinceLastUse),
  });
}

// POST: Record a trial usage
export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const usage = trialUsage.get(ip);

  if (usage) {
    const hoursSinceLastUse = (Date.now() - usage.lastUsed) / (1000 * 60 * 60);
    if (hoursSinceLastUse >= COOLDOWN_HOURS) {
      trialUsage.delete(ip);
    } else if (usage.count >= FREE_LIMIT) {
      return NextResponse.json({
        success: false,
        error: 'Free trial limit reached. Sign up for unlimited access!',
        resetInHours: Math.ceil(COOLDOWN_HOURS - hoursSinceLastUse),
      }, { status: 429 });
    }
  }

  const current = trialUsage.get(ip) || { count: 0, lastUsed: 0 };
  trialUsage.set(ip, { count: current.count + 1, lastUsed: Date.now() });

  return NextResponse.json({
    success: true,
    remaining: Math.max(0, FREE_LIMIT - current.count - 1),
  });
}
