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

### Design System
A set of reusable styles that ensure consistency across your app. Instead of picking random font sizes each time, you define them once:

```css
.ds-card-title { font-size: 1.5rem; color: #ffffff; }
.ds-card-body { font-size: 1.25rem; color: #d1d5db; }
.ds-card-meta { font-size: 1.125rem; color: #9ca3af; }
.ds-card-footer { font-size: 1rem; color: #6b7280; }
```

Then use them everywhere: `<h3 className="ds-card-title">`. If you want to change all titles later, you only edit one place.

---

### CSS Transforms
Modify an element's shape/position without affecting layout:

- `transform: skewX(-10deg)` — slants into a parallelogram
- `transform: rotate(45deg)` — rotates
- `transform: scale(1.5)` — enlarges
- `transform: translateY(-10px)` — moves up

You can combine them: `transform: skewX(-10deg) scale(1.1);`

---

### box-shadow (Glow Effects)
Creates shadows/glows around elements:

```css
box-shadow: 0 0 10px 2px rgba(251, 146, 60, 0.5);
/*          │ │  │    │   └── color with opacity
            │ │  │    └────── spread (how far it extends)
            │ │  └─────────── blur (softness)
            │ └────────────── vertical offset
            └──────────────── horizontal offset */
```

For glows, use `0 0` offset so it's centered, and pick a bright color with transparency.

---

## Web App / PWA (Progressive Web App)

### Apple Touch Icon
When users "Add to Home Screen" from Safari, iOS looks for special meta tags:

```html
<!-- The icon image (180x180px recommended) -->
<link rel="apple-touch-icon" href="images/app-icon.png">

<!-- Makes it open fullscreen like a native app (no Safari UI) -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- Controls the status bar appearance -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- The name shown under the icon -->
<meta name="apple-mobile-web-app-title" content="Brew Buddy">
```

**Icon tips:**
- 180x180px PNG works best for iOS
- Use a solid background (iOS won't add one)
- Keep it simple — it's small on the home screen

---

## JavaScript APIs

### Web Share API
Lets users share content using the native OS share sheet (iMessage, SMS, WhatsApp, email, etc.):

```javascript
if (navigator.share) {
  await navigator.share({
    text: 'Check out this coffee!',
    title: 'My Brew',
    url: 'https://example.com'  // optional
  });
} else {
  // Fallback for desktop - copy to clipboard
  await navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
}
```

**Requirements:**
- Only works on mobile browsers (iOS Safari, Android Chrome)
- Must be HTTPS (or localhost for testing)
- Must be triggered by user action (click/tap)

Always check `if (navigator.share)` first and provide a fallback!

---

## Git & Deployment

*More concepts will be added as we encounter them...*
