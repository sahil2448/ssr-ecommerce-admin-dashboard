export function parseBasicAuth(authHeader: string | null) {
  if (!authHeader?.startsWith("Basic ")) return null;
  const base64 = authHeader.slice("Basic ".length);

  // Works in Edge runtime (middleware)
  const decoded = atob(base64);
  const idx = decoded.indexOf(":");
  if (idx === -1) return null;

  return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
}

export function isValidAdmin(user?: string, pass?: string) {
  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
}
