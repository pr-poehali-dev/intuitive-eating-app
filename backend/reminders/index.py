"""
Управление напоминаниями о приёмах пищи.
GET  / — получить список напоминаний по email
POST / — сохранить напоминание (создать или обновить)
POST /send — отправить тестовое уведомление на email
DELETE / — удалить напоминание по id
"""
import json
import os
import psycopg2
import urllib.request
import urllib.error
from datetime import datetime

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Email",
    "Content-Type": "application/json",
}

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p77851095_intuitive_eating_app")


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def send_email(to_email: str, subject: str, html: str):
    api_key = os.environ.get("RESEND_API_KEY", "")
    if not api_key:
        return {"error": "RESEND_API_KEY not set"}

    payload = json.dumps({
        "from": "НутриМайнд <onboarding@resend.dev>",
        "to": [to_email],
        "subject": subject,
        "html": html,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"error": e.read().decode()}


def reminder_email_html(user_name: str, label: str, reminder_time: str) -> str:
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Golos Text',Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#FF6B6B,#845EF7);padding:32px 32px 24px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">🌸</div>
      <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">НутриМайнд</h1>
      <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:14px;">Интуитивное питание</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#374151;font-size:16px;margin:0 0 8px;">Привет, <strong>{user_name}</strong>! 👋</p>
      <h2 style="color:#1f2937;font-size:20px;margin:0 0 16px;">{label}</h2>
      <div style="background:#f3f0ff;border-radius:16px;padding:16px 20px;margin-bottom:24px;">
        <p style="color:#845EF7;font-size:15px;margin:0;font-weight:600;">⏰ Время: {reminder_time}</p>
      </div>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Сейчас хороший момент, чтобы проверить свой уровень голода. 
        Оцени себя по шкале от 1 до 10 и сделай запись в дневнике. 🎯
      </p>
      <div style="background:linear-gradient(135deg,#FF6B6B20,#845EF720);border-radius:16px;padding:16px;margin-bottom:24px;">
        <p style="color:#374151;font-size:13px;margin:0;font-style:italic;">
          💫 «Доверяй своему телу — оно знает, что ему нужно»
        </p>
      </div>
      <p style="color:#9ca3af;font-size:12px;margin:0;text-align:center;">
        Это автоматическое напоминание из приложения НутриМайнд
      </p>
    </div>
  </div>
</body>
</html>
"""


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # POST /send — отправить тестовое письмо
    if method == "POST" and path.endswith("/send"):
        email = body.get("email", "")
        user_name = body.get("user_name", "Пользователь")
        label = body.get("label", "Время проверить голод")
        reminder_time = body.get("time", "")

        if not email:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "email required"})}

        html = reminder_email_html(user_name, label, reminder_time)
        result = send_email(email, f"🌸 НутриМайнд: {label}", html)

        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"ok": True, "result": result})}

    # GET / — список напоминаний по email
    if method == "GET":
        params = event.get("queryStringParameters") or {}
        email = params.get("email", "")
        if not email:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "email required"})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, email, user_name, reminder_time, label, active FROM {SCHEMA}.reminders WHERE email = %s ORDER BY reminder_time",
            (email,)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        reminders = [
            {"id": r[0], "email": r[1], "user_name": r[2], "time": r[3], "label": r[4], "active": r[5]}
            for r in rows
        ]
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"reminders": reminders})}

    # POST / — сохранить напоминание
    if method == "POST":
        email = body.get("email", "")
        user_name = body.get("user_name", "Пользователь")
        reminder_time = body.get("time", "")
        label = body.get("label", "Напоминание")
        active = body.get("active", True)

        if not email or not reminder_time:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "email and time required"})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"""INSERT INTO {SCHEMA}.reminders (email, user_name, reminder_time, label, active)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
                RETURNING id""",
            (email, user_name, reminder_time, label, active)
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        reminder_id = row[0] if row else None
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"ok": True, "id": reminder_id})}

    # DELETE / — удалить напоминание
    if method == "DELETE":
        reminder_id = body.get("id")
        email = body.get("email", "")
        if not reminder_id:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "id required"})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"DELETE FROM {SCHEMA}.reminders WHERE id = %s AND email = %s",
            (reminder_id, email)
        )
        conn.commit()
        cur.close()
        conn.close()

        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": CORS_HEADERS, "body": json.dumps({"error": "Method not allowed"})}
