"""
ReelForge AI — Video / Script Generator
========================================
Uses OpenAI (if configured) to generate viral short-form video scripts.
Falls back to template-based generation when no API key is set.
"""

import os
import json
import random
from typing import Optional

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# ─── TEMPLATE SCRIPTS ───────────────────────────────────────────────────────

HOOKS = {
    "motivation": [
        "Here's the ONE thing separating winners from everyone else...",
        "If you want to change your life in 30 days, watch this NOW...",
        "95% of people will NEVER reach their goals — here's why...",
        "The uncomfortable truth that will transform your mindset today...",
    ],
    "finance": [
        "Here's the SHOCKING truth about money nobody tells you...",
        "How I went from $0 to $10K/month — the exact blueprint...",
        "Stop making these 3 money mistakes RIGHT NOW...",
        "The financial secret the wealthy use that schools don't teach...",
    ],
    "education": [
        "This one fact will completely change how you see the world...",
        "Scientists just discovered something that defies everything we knew...",
        "The most fascinating thing you'll learn today — guaranteed...",
        "Did you know this? Most people have NO idea...",
    ],
    "health": [
        "Stop doing this one thing that's slowly destroying your health...",
        "The morning habit doctors don't want you to know about...",
        "I tried this for 30 days and the results were unbelievable...",
        "This simple change added years to my life — here's how...",
    ],
    "technology": [
        "AI is about to change EVERYTHING — are you ready?",
        "This technology will replace 50% of jobs by 2030...",
        "The future is here and most people are completely unprepared...",
        "This app is making people thousands of dollars from their phones...",
    ],
    "comedy": [
        "POV: You're explaining this to someone who just doesn't get it...",
        "Things that happen in every single workplace ever...",
        "When you realize this is actually your whole personality...",
        "Nobody talks about how relatable this actually is...",
    ],
    "news": [
        "Breaking: This just happened and it's bigger than you think...",
        "The story everyone is talking about — here's what actually happened...",
        "This news changes everything — here's what it means for YOU...",
        "What mainstream media isn't telling you about this story...",
    ],
    "cooking": [
        "The easiest recipe that will impress EVERYONE at the dinner table...",
        "Chef's secret: This one ingredient changes everything...",
        "I made this for 30 days straight — here's what happened...",
        "Stop wasting money on takeout — make this in 10 minutes instead...",
    ],
    "travel": [
        "I spent 3 months in this country and it changed my life...",
        "The travel hack that saves me $500 on every trip...",
        "This hidden destination is better than [popular place] — trust me...",
        "Things nobody tells you before visiting this country...",
    ],
    "business": [
        "The business model making people $10K/month from their laptops...",
        "I quit my 9-5 using this strategy — here's exactly how...",
        "Most entrepreneurs fail because of THIS one mistake...",
        "The side hustle that generated $50K in 90 days...",
    ],
}

BODY_TEMPLATES = {
    "motivation": """\
Point 1: The biggest lie society tells you is that success requires talent.
It doesn't. It requires CONSISTENCY — showing up when you don't feel like it.

Point 2: Research from Stanford shows that people who track their progress
are 3x more likely to reach their goals. Start tracking TODAY.

Point 3: The compound effect is real. 1% better every day = 37x better in a year.
Small actions, repeated daily, create massive results.\
""",
    "finance": """\
Point 1: 78% of Americans live paycheck to paycheck — not because they earn too little,
but because they haven't learned the RULES of money.

Point 2: Wealthy people make money work for them. They invest in assets — stocks,
real estate, businesses — while everyone else buys liabilities.

Point 3: The first $10K is the hardest. After that, compound interest takes over.
Start investing even $50/month. Your future self will thank you.\
""",
    "default": """\
Point 1: Most people overlook this, but it's one of the most important things
you need to understand in today's world.

Point 2: The research backs this up — when you implement this consistently,
you start seeing results within 21-30 days.

Point 3: Here's the simple, actionable step you can take right now to start.
Don't overthink it. Just start.\
""",
}

CTAS = [
    "Follow for more content like this every day.",
    "Drop a comment — have you tried this? Let me know your results.",
    "Share this with someone who needs to hear it today.",
    "Save this for later — you'll want to come back to it.",
    "Like + Follow if this gave you value. More coming daily.",
]

OUTROS = [
    "Stay consistent. Small actions, compounded daily, create extraordinary results.",
    "Remember: your future self is watching. Make them proud.",
    "The best time to start was yesterday. The second best time is RIGHT NOW.",
    "Progress over perfection. Every single day.",
]


def generate_script_template(topic: str, niche: str, duration: int) -> str:
    """Generate a viral script using templates."""
    hooks = HOOKS.get(niche, HOOKS["motivation"])
    hook = random.choice(hooks)
    body = BODY_TEMPLATES.get(niche, BODY_TEMPLATES["default"])
    cta = random.choice(CTAS)
    outro = random.choice(OUTROS)

    # Adjust length based on duration
    word_target = {15: 60, 30: 120, 60: 250}.get(duration, 120)

    script = f"""HOOK (0-3 sec):
{hook}

MAIN CONTENT:
Topic: {topic}

{body}

CALL TO ACTION:
{cta}

OUTRO:
{outro}

---
📊 Estimated duration: ~{duration} seconds
🎯 Word count: ~{word_target} words
🔥 Optimized for: {niche.title()} niche
"""
    return script


def generate_script_openai(topic: str, niche: str, duration: int, voice: str) -> Optional[str]:
    """Generate a script using OpenAI GPT."""
    if not OPENAI_AVAILABLE or not OPENAI_API_KEY:
        return None

    try:
        client = OpenAI(api_key=OPENAI_API_KEY)

        word_count = {15: 50, 30: 100, 60: 220}.get(duration, 100)

        prompt = f"""You are a viral short-form video script writer specializing in the {niche} niche.

Create a compelling {duration}-second faceless video script about: "{topic}"

Requirements:
- Start with a POWERFUL hook (first 3 seconds must grab attention)
- Keep it approximately {word_count} words for a {duration}-second video
- Write for voice narration — conversational, punchy, no jargon
- Include 2-3 key points with real, actionable value
- End with a strong call-to-action (like, follow, comment)
- Optimize for virality: use pattern interrupts, curiosity gaps, and emotional triggers
- Voice style: {voice} ({"warm and friendly" if voice in ["nova","shimmer"] else "deep and authoritative" if voice in ["echo","onyx"] else "balanced and natural"})

Format the script clearly with sections:
HOOK: (0-3 seconds)
CONTENT: (main points)
CTA: (call to action)
OUTRO: (closing)

Write only the script, no meta-commentary."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600,
            temperature=0.8,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"OpenAI script generation failed: {e}")
        return None


def generate_video_script(
    topic: str,
    niche: str = "motivation",
    duration: int = 30,
    voice: str = "nova",
    style: str = "cinematic",
) -> dict:
    """
    Main entry point for script generation.
    Tries OpenAI first, falls back to templates.
    """
    # Try AI generation
    script = generate_script_openai(topic, niche, duration, voice)

    # Fall back to template
    if not script:
        script = generate_script_template(topic, niche, duration)

    return {
        "topic": topic,
        "niche": niche,
        "duration": duration,
        "voice": voice,
        "style": style,
        "script": script,
        "word_count": len(script.split()),
        "estimated_duration_sec": duration,
        "generated_by": "openai" if (OPENAI_AVAILABLE and OPENAI_API_KEY and script != generate_script_template(topic, niche, duration)) else "template",
    }
