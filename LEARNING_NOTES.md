# Brew Buddy - Learning Notes

A running log of concepts, vocabulary, and technical knowledge we cover while building together.

---

## Database & Backend (Supabase/PostgreSQL)

### Row Level Security (RLS)
A Supabase/PostgreSQL feature that controls *who* can access *which* rows in a table. Without it, anyone with your Supabase keys could read/write all data.

**How it works:**
1. `ALTER TABLE brew_logs ENABLE ROW LEVEL SECURITY;` — turns on the protection
2. Then you create **policies** — rules that define access

**Example policy:**
```sql
CREATE POLICY "Users can view own logs" ON brew_logs
  FOR SELECT USING (auth.uid() = user_id);
```

This says: "For SELECT (reading) operations, only return rows where the `user_id` column matches the currently logged-in user (`auth.uid()`)."

So even if someone tries to query all logs, they'll only get *their* logs back. The database enforces this automatically.

---

### UUID (Universally Unique Identifier)
A 128-bit random ID like `550e8400-e29b-41d4-a716-446655440000`. 

We use these instead of auto-incrementing numbers (1, 2, 3...) because:
- They're impossible to guess
- They can be generated anywhere (client or server)
- No collisions even across distributed systems

---

### Foreign Key
A column that links to another table's primary key.

```sql
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
```

This links `user_id` to Supabase's built-in `auth.users` table. 

`ON DELETE CASCADE` means: if a user deletes their account, all their brew logs get deleted too. Other options include:
- `ON DELETE SET NULL` — set the foreign key to NULL
- `ON DELETE RESTRICT` — prevent deletion if references exist

---

## Frontend (React)

*More concepts will be added as we encounter them...*

---

## CSS & Styling

*More concepts will be added as we encounter them...*

---

## Git & Deployment

*More concepts will be added as we encounter them...*
