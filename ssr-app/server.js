import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const VIEWS_DIR  = path.join(__dirname, "views");
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_FILE  = path.join(__dirname, "data", "users.json");

app.set("view engine", "ejs");
app.set("views", VIEWS_DIR);
app.use("/public", express.static(PUBLIC_DIR));

const toInt = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

function loadUsers() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function filterUsers(users, q) {
  if (!q) return users;
  const s = q.trim().toLowerCase();
  return users.filter(u =>
    u.name.toLowerCase().includes(s) ||
    u.email.toLowerCase().includes(s) ||
    u.role.toLowerCase().includes(s)
  );
}

function paginate(items, page = 1, pageSize = 4) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * pageSize;
  return { page: p, pages, total, slice: items.slice(start, start + pageSize) };
}

app.get("/", (req, res) => {
  const q        = req.query.q ?? "";
  const page     = toInt(req.query.page, 1);
  const pageSize = toInt(req.query.pageSize, 4);

  const filtered = filterUsers(loadUsers(), q);
  const { page: p, pages, total, slice } = paginate(filtered, page, pageSize);

  res.render("index", { users: slice, q, page: p, pages, total, pageSize });
});

app.get("/user/:id", (req, res) => {
  const users = loadUsers();
  const u = users.find(x => String(x.id) === String(req.params.id));
  if (!u) return res.status(404).send("Usuário não encontrado");
  res.render("detail", { user: u });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SSR server listening on http://localhost:${PORT}`);
});
