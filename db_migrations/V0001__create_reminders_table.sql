
CREATE TABLE IF NOT EXISTS t_p77851095_intuitive_eating_app.reminders (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) DEFAULT 'Пользователь',
    reminder_time VARCHAR(5) NOT NULL,
    label VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_email ON t_p77851095_intuitive_eating_app.reminders(email);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON t_p77851095_intuitive_eating_app.reminders(active);
