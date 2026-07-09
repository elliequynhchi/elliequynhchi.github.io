// Helper to hash password using Web Crypto API (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "ellie_salt_123!"); // simple salt
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    // Ensure DB binding is present
    if (!env.DB) {
        return new Response(JSON.stringify({ error: "Database binding 'DB' is missing in Cloudflare." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return new Response(JSON.stringify({ error: "Username and password are required." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const trimmedUser = username.trim();
        if (trimmedUser.length < 3 || password.length < 4) {
            return new Response(JSON.stringify({ error: "Username must be >= 3 chars, password >= 4 chars." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (action === 'register') {
            // Check if user exists
            const existingUser = await env.DB.prepare("SELECT id FROM users WHERE username = ?")
                .bind(trimmedUser)
                .first();

            if (existingUser) {
                return new Response(JSON.stringify({ error: "Username is already taken." }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Hash password and insert
            const passwordHash = await hashPassword(password);
            await env.DB.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
                .bind(trimmedUser, passwordHash)
                .run();

            return new Response(JSON.stringify({ success: true, message: "Registration successful!" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else if (action === 'login') {
            const passwordHash = await hashPassword(password);
            const user = await env.DB.prepare("SELECT id, username FROM users WHERE username = ? AND password_hash = ?")
                .bind(trimmedUser, passwordHash)
                .first();

            if (!user) {
                return new Response(JSON.stringify({ error: "Invalid username or password." }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify({ success: true, user: user.username, message: "Login successful!" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else {
            return new Response(JSON.stringify({ error: "Invalid action." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
