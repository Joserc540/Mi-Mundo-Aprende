"""Generate reviewed narrative variants offline.

The script deliberately does not publish generated text. Every update is marked
PENDING_TEACHER_REVIEW so a teacher must approve it before production use.
"""
import json
import os
from typing import Any

import psycopg
from openai import OpenAI

SYSTEM_PROMPT = """Eres un pedagogo experto en el CNEB de Perú para 4.° de primaria.
Reescribe el problema en los universos ki_warriors, super_league y block_builders,
además de neutral. Nunca cambies cifras, operaciones ni respuesta. Usa frases
cortas, máximo 35 palabras por enunciado, y no uses marcas registradas.
Devuelve exclusivamente JSON con las llaves neutral, ki_warriors, super_league,
block_builders."""


def generate_variants(client: OpenAI, text: str) -> dict[str, str]:
    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.3,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
    )
    content = response.choices[0].message.content
    if not content:
        raise ValueError("The model returned an empty response")
    result: Any = json.loads(content)
    required = {"neutral", "ki_warriors", "super_league", "block_builders"}
    if set(result) != required or not all(isinstance(value, str) for value in result.values()):
        raise ValueError("The model response does not match the required schema")
    return result


def main() -> None:
    database_url = os.environ["DATABASE_URL"]
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, question_text FROM questions "
                "WHERE narrative_variants = '{}'::jsonb OR narrative_variants IS NULL"
            )
            questions = cursor.fetchall()
            for question_id, question_text in questions:
                variants = generate_variants(client, question_text)
                cursor.execute(
                    "UPDATE questions SET narrative_variants = %s::jsonb, "
                    "validation_status = 'PENDING_TEACHER_REVIEW' WHERE id = %s",
                    (json.dumps(variants), question_id),
                )
        connection.commit()


if __name__ == "__main__":
    main()
