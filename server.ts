import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface ServerUserRecord {
  id: string;
  username: string;
  location: string;
  chaptersRead: number;
  versesRead: number;
  streakDays: number;
  score: number;
  avatar: string;
  badge: string;
  lastActive: number;
  isRealUser?: boolean;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent storage path
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "shared-leaderboard.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial friends from screenshots + initial state
const INITIAL_USERS: Record<string, ServerUserRecord> = {
  "pethuraj_seed": {
    id: "pethuraj_seed",
    username: "PETHURAJ",
    location: "CHENNAI",
    chaptersRead: 6,
    versesRead: 193,
    streakDays: 1,
    score: 393,
    avatar: "📖",
    badge: "தொடங்கியவர்",
    lastActive: Date.now() - 60000,
    isRealUser: true,
  },
  "david_seed": {
    id: "david_seed",
    username: "தாவீது_07",
    location: "சென்னை",
    chaptersRead: 1,
    versesRead: 22,
    streakDays: 1,
    score: 97,
    avatar: "⭐",
    badge: "தொடங்கியவர்",
    lastActive: Date.now() - 120000,
    isRealUser: true,
  }
};

function loadUsers(): Record<string, ServerUserRecord> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return { ...INITIAL_USERS, ...parsed };
    }
  } catch (err) {
    console.error("Error reading leaderboard db file:", err);
  }
  return { ...INITIAL_USERS };
}

function saveUsers(users: Record<string, ServerUserRecord>) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving leaderboard db file:", err);
  }
}

let usersStore: Record<string, ServerUserRecord> = loadUsers();

function calculateScore(verses: number, chapters: number, streak: number): number {
  return (verses * 1) + (chapters * 25) + (streak * 50);
}

function getUserBadge(chaptersRead: number): string {
  if (chaptersRead >= 1189) return 'முழு வேதாகமம்';
  if (chaptersRead >= 800) return 'வேத மாவீரர்';
  if (chaptersRead >= 400) return 'சுடரொளி';
  if (chaptersRead >= 150) return 'நற்செய்தியாளர்';
  if (chaptersRead >= 50) return 'வேத வாசிப்பாளர்';
  if (chaptersRead >= 1) return 'தொடங்கியவர்';
  return 'புதிய விசுவாசி';
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// GET all live believers on leaderboard
app.get("/api/leaderboard", (_req, res) => {
  const usersList = Object.values(usersStore);
  
  // Sort descending by score
  usersList.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.chaptersRead !== a.chaptersRead) return b.chaptersRead - a.chaptersRead;
    return b.versesRead - a.versesRead;
  });

  // Assign ranks
  const ranked = usersList.map((u, index) => ({
    ...u,
    rank: index + 1,
  }));

  res.json({
    success: true,
    users: ranked,
    count: ranked.length,
    updatedAt: Date.now()
  });
});

// POST sync user reading progress & profile
app.post("/api/leaderboard/sync", (req, res) => {
  try {
    const {
      id,
      username,
      location,
      chaptersRead = 0,
      versesRead = 0,
      streakDays = 1,
      avatar = "📖",
    } = req.body;

    if (!id || !username) {
      res.status(400).json({ error: "id and username are required" });
      return;
    }

    const calculatedScore = calculateScore(versesRead, chaptersRead, streakDays);
    const badge = getUserBadge(chaptersRead);

    usersStore[id] = {
      id,
      username: String(username).trim().slice(0, 30),
      location: String(location || "").trim().slice(0, 40),
      chaptersRead: Math.max(0, Number(chaptersRead) || 0),
      versesRead: Math.max(0, Number(versesRead) || 0),
      streakDays: Math.max(1, Number(streakDays) || 1),
      score: calculatedScore,
      avatar: avatar || "📖",
      badge,
      lastActive: Date.now(),
      isRealUser: true,
    };

    saveUsers(usersStore);

    // Return the updated ranked list
    const usersList = Object.values(usersStore);
    usersList.sort((a, b) => b.score - a.score);
    const ranked = usersList.map((u, index) => ({
      ...u,
      rank: index + 1,
    }));

    res.json({
      success: true,
      user: usersStore[id],
      users: ranked,
      count: ranked.length,
    });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ error: "Failed to sync progress" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tamil Bible Reading server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
