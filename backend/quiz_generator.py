"""
Quiz generation using OpenAI GPT-4o.
(Preserved from original QuizAPP — compatible with StudyQuizAI)
"""

import os
import json
import random
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_quiz(
    chunks: list[str],
    num_questions: int = 5,
    difficulty: str = "medium",
) -> dict:
    """
    Generate a multiple-choice quiz from text chunks.
    Each question has 4 options with per-option explanations.
    """
    # If multiple chunks, sample a subset to keep prompt size manageable
    if len(chunks) > 3:
        selected_chunks = random.sample(chunks, min(3, len(chunks)))
    else:
        selected_chunks = chunks

    combined_text = "\n\n---\n\n".join(selected_chunks)

    # Truncate if still too long
    max_text_length = 8000
    if len(combined_text) > max_text_length:
        combined_text = combined_text[:max_text_length]

    prompt = f"""You are an expert quiz generator. Based on the following text, generate exactly {num_questions} multiple-choice questions at {difficulty} difficulty level.

TEXT:
{combined_text}

REQUIREMENTS:
1. Each question must have exactly 4 options
2. Exactly one option must be correct
3. Each option must have an explanation (why it's correct or why it's wrong)
4. Include a brief concept_summary for each question
5. Questions should test understanding, not just memorization
6. For {difficulty} difficulty:
   - easy: straightforward recall questions
   - medium: application and understanding questions  
   - hard: analysis, synthesis, and critical thinking questions

Return ONLY valid JSON in this exact format (no markdown, no backticks):
{{
  "questions": [
    {{
      "question": "What is...?",
      "concept_summary": "Brief explanation of the concept being tested",
      "options": [
        {{
          "text": "Option A text",
          "is_correct": false,
          "explanation": "This is incorrect because..."
        }},
        {{
          "text": "Option B text", 
          "is_correct": true,
          "explanation": "This is correct because..."
        }},
        {{
          "text": "Option C text",
          "is_correct": false,
          "explanation": "This is incorrect because..."
        }},
        {{
          "text": "Option D text",
          "is_correct": false,
          "explanation": "This is incorrect because..."
        }}
      ]
    }}
  ]
}}"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "You are an expert educational quiz generator. Always return valid JSON only.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=4000,
    )

    content = response.choices[0].message.content.strip()

    # Clean up response if it has markdown formatting
    if content.startswith("```"):
        content = content.split("\n", 1)[1]  # Remove first line
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

    quiz = json.loads(content)

    # Shuffle option order for each question
    for q in quiz.get("questions", []):
        random.shuffle(q.get("options", []))

    return quiz
