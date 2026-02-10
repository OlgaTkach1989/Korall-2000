import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def try_llm_reply(message, language="de", context_text=""):
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return None, "missing_api_key"

    base_url = os.getenv("OPENAI_BASE_URL", "https://api.groq.com/openai/v1").rstrip("/")
    model = os.getenv("OPENAI_MODEL", "llama-3.1-8b-instant")
    endpoint = f"{base_url}/chat/completions"

    lang_label = "German" if language == "de" else "English"
    system_prompt = (
        "You are a shop assistant for Korall 2000 (packaging products). "
        f"Always answer in {lang_label}. "
        "If language is German, write natural German with umlauts (ä, ö, ü) and ß when appropriate. "
        "Be concise, practical, and do not invent unavailable data. "
        "If order status is requested, ask for order number when missing. "
        "If shipping is asked, mention: shipping is 4 EUR, free from 100 EUR subtotal. "
        "If user asks for products, suggest checking the products page and mention examples from context if available."
    )

    if context_text:
        system_prompt = f"{system_prompt}\n\nContext:\n{context_text}"

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        "temperature": 0.3,
        "max_tokens": 260,
    }

    req = Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
            "User-Agent": "Korall2000-Chatbot/1.0 (+Django)",
        },
        method="POST",
    )

    try:
        with urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except HTTPError as err:
        detail = ""
        try:
            body = err.read().decode("utf-8", errors="ignore")
            parsed = json.loads(body)
            if isinstance(parsed, dict):
                detail = (
                    parsed.get("error", {}).get("code")
                    or parsed.get("error", {}).get("message")
                    or ""
                )
        except Exception:
            if "body" in locals():
                detail = body[:180].replace("\n", " ").strip()
            else:
                detail = ""
        suffix = f"_{detail}" if detail else ""
        return None, f"http_error_{err.code}{suffix}"
    except URLError:
        return None, "network_error"
    except TimeoutError:
        return None, "timeout"
    except json.JSONDecodeError:
        return None, "invalid_json"

    choices = data.get("choices") or []
    if not choices:
        return None, "empty_choices"

    content = choices[0].get("message", {}).get("content", "").strip()
    if not content:
        return None, "empty_content"
    return content, None
