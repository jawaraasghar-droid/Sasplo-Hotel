/**
 * Saspolo Admin Gateway — Cloudflare Worker
 *
 * Sits between the admin panel (admin.html) and GitHub. Holds the GitHub
 * token server-side so it never reaches a browser, and refuses everything
 * unless the correct admin password is supplied with the request.
 *
 * Deploy: paste this file into a new Cloudflare Worker (see SETUP-ADMIN.md),
 * then add these settings (Worker → Settings → Variables and Secrets):
 *
 *   GITHUB_TOKEN    (Secret) fine-grained token, ONLY the Saspolo repo,
 *                   ONLY "Contents: Read and write" permission
 *   ADMIN_PASSWORD  (Secret) the password the panel will ask for
 *   REPO            (Text)   e.g. "yourusername/saspolo-hotel"
 *   BRANCH          (Text)   usually "main"
 *   ALLOWED_ORIGIN  (Text)   your site's address, e.g. "https://yourusername.github.io"
 *                            (use "*" only while testing locally)
 *
 * Security model:
 *  - No password → every request refused.
 *  - Even with the password, only the content paths listed below can be
 *    read or written. The panel, this gateway, and everything else are
 *    untouchable regardless of what a client tries.
 */

const ALLOWED_PATHS = [
  /^assets\/images\/(gallery|hero|backgrounds|rooms)\/[\w.\- ]+\.(jpg|jpeg|png|webp)$/i,
  /^assets\/images\/(logo|favicon|apple-touch-icon)\.png$/,
  /^assets\/js\/data\/(gallery-data|rooms-data|reviews-data)\.js$/,
  /^assets\/js\/site-config\.js$/,
  /^assets\/js\/i18n\/en\.js$/,
  /^(index|rooms|booking|gallery|about|facilities|attractions|contact)\.html$/,
];

// Images bigger than this are refused — the panel compresses before upload,
// so anything larger means something went wrong.
const MAX_FILE_BYTES = 2 * 1024 * 1024;

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  };
}

function json(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) },
  });
}

function pathAllowed(path) {
  return (
    typeof path === "string" &&
    !path.includes("..") &&
    ALLOWED_PATHS.some((re) => re.test(path))
  );
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    const supplied = request.headers.get("X-Admin-Password") || "";
    if (!env.ADMIN_PASSWORD || supplied !== env.ADMIN_PASSWORD) {
      return json({ error: "Wrong password" }, 401, env);
    }

    const url = new URL(request.url);

    // Simple health/login check used by the panel's login screen
    if (url.pathname === "/ping") {
      return json({ ok: true, repo: env.REPO }, 200, env);
    }

    const path = url.searchParams.get("path");
    if (!pathAllowed(path)) {
      return json({ error: "That file is not editable through the panel" }, 400, env);
    }

    const branch = env.BRANCH || "main";
    const ghUrl = `https://api.github.com/repos/${env.REPO}/contents/${path}`;
    const ghHeaders = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "saspolo-admin-gateway",
    };

    if (request.method === "GET") {
      const r = await fetch(`${ghUrl}?ref=${branch}`, { headers: ghHeaders });
      if (r.status === 404) return json({ error: "File not found", notFound: true }, 404, env);
      if (!r.ok) return json({ error: `GitHub error ${r.status}` }, 502, env);
      const data = await r.json();
      return json({ sha: data.sha, contentBase64: (data.content || "").replace(/\n/g, "") }, 200, env);
    }

    if (request.method === "PUT") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Bad request body" }, 400, env);
      }
      const { contentBase64, sha, message, author } = body || {};
      if (!contentBase64) return json({ error: "No content supplied" }, 400, env);
      if (contentBase64.length > MAX_FILE_BYTES * 1.4) {
        return json({ error: "File too large — must be under 2 MB" }, 413, env);
      }

      const commit = {
        message: `[admin] ${message || "Update " + path}${author ? " — by " + author : ""}`,
        content: contentBase64,
        branch,
      };
      if (sha) commit.sha = sha; // present when updating an existing file

      const r = await fetch(ghUrl, {
        method: "PUT",
        headers: { ...ghHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(commit),
      });
      if (!r.ok) {
        const detail = await r.text();
        return json({ error: `GitHub rejected the change (${r.status})`, detail: detail.slice(0, 300) }, 502, env);
      }
      const data = await r.json();
      return json({ ok: true, sha: data.content ? data.content.sha : null }, 200, env);
    }

    return json({ error: "Method not allowed" }, 405, env);
  },
};
