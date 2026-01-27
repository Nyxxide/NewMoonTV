import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CONFIG (relative to this script file) ----
const REPOS_REL = "../serverJsonData/repos.json";

// Where to write the generated JSON.
// Option A (recommended): write into your repo and let nginx serve it.
const OUT_REL = "../webJsonData/GIT_ITEMS.json";

// Option B: write directly into nginx web root instead (uncomment + set):
// const OUT_ABS = "/var/www/NewMoonTV/webJsonData/GIT_ITEMS.json";

// Optional token to avoid unauthenticated rate limits (60/hr).
// Put it in /etc/newmoontv/github.env and source it in cron.
const TOKEN = process.env.GITHUB_TOKEN || null;

// ----------------------------------------------

// Small helper: safe JSON read with nicer error
async function readJson(absPath) {
    try {
        const raw = await fs.readFile(absPath, "utf8");
        return JSON.parse(raw);
    } catch (e) {
        throw new Error(`Failed to read/parse JSON: ${absPath}\n${e.message}`);
    }
}

// Robustly parse owner/repo from a GitHub URL (handles trailing slash)
function parseOwnerRepo(githubUrl) {
    const u = new URL(githubUrl);
    const parts = u.pathname.replace(/^\/+/, "").replace(/\/+$/, "").split("/");
    const owner = parts[0];
    const repo = parts[1];
    if (!owner || !repo) throw new Error(`Bad GitHub URL: ${githubUrl}`);
    return { owner, repo };
}

async function ghJson(apiPath) {
    const res = await fetch(`https://api.github.com${apiPath}`, {
        headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "midman-git-items",
            ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
        },
    });

    // Handle rate limit / auth errors more clearly
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        const ratelimitRemaining = res.headers.get("x-ratelimit-remaining");
        const ratelimitReset = res.headers.get("x-ratelimit-reset");
        const resetHuman =
            ratelimitReset ? new Date(Number(ratelimitReset) * 1000).toISOString() : null;

        let extra = "";
        if (res.status === 403 && ratelimitRemaining === "0") {
            extra = `\nRate limited. Resets at: ${resetHuman}`;
        }

        throw new Error(`GitHub API ${res.status} for ${apiPath}${extra}\n${text}`);
    }

    return res.json();
}

function daysBetween(nowMs, pastMs) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((nowMs - pastMs) / msPerDay);
}

async function main() {
    const reposPath = path.resolve(__dirname, REPOS_REL);

    // If using OUT_ABS, use that; otherwise write to OUT_REL inside repo
    const outPath =
        typeof OUT_ABS !== "undefined"
            ? OUT_ABS
            : path.resolve(__dirname, OUT_REL);

    const baseItems = await readJson(reposPath);
    if (!Array.isArray(baseItems)) {
        throw new Error(`repos.json must be an array of repo objects: ${reposPath}`);
    }

    const now = Date.now();

    // Fetch in parallel (faster). For a *lot* of repos, you’d add concurrency limiting.
    const enriched = await Promise.all(
        baseItems.map(async (item) => {
            if (!item?.url) throw new Error(`Missing url in repos.json item: ${JSON.stringify(item)}`);

            const { owner, repo } = parseOwnerRepo(item.url);
            const repoInfo = await ghJson(`/repos/${owner}/${repo}`);

            const lastUpdatedMs = Date.parse(repoInfo.updated_at);
            const daysSinceUpdate = Number.isFinite(lastUpdatedMs)
                ? daysBetween(now, lastUpdatedMs)
                : null;

            return {
                // your original fields (from repos.json)
                id: item.id,
                title: item.title,
                img: item.img,
                url: item.url,
                status: item.status,

                // computed fields
                lastUpdated: Number.isFinite(lastUpdatedMs) ? lastUpdatedMs : 0,
                stars: repoInfo.stargazers_count ?? 0,

                // optional extra fields (nice for UI/debug)
                updatedAtIso: repoInfo.updated_at ?? null,
                daysSinceUpdate,
                fetchedAt: now,
            };
        })
    );

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(enriched, null, 2) + "\n", "utf8");

    console.log(`Wrote ${outPath} (${enriched.length} repos) at ${new Date(now).toISOString()}`);
}

main().catch((err) => {
    console.error(err?.stack || err);
    process.exit(1);
});
