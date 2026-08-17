import { getSessionToken } from "./authService";

const API_BASE = `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/progress`;

// problemType must be one of: "NEETCODE" | "CSES" | "STRIVER"
// (NEETCODE covers both Neetcode 150 and Blind 75, since they share the same table)

export async function getProgress(problemType) {
  const token = getSessionToken();
  if (!token) return [];

  const url = problemType ? `${API_BASE}?type=${problemType}` : API_BASE;
  const res = await fetch(url, {
    headers: { "X-Session-Token": token },
  });

  if (!res.ok) {
    throw new Error("failed to load progress");
  }
  return res.json();
}

export async function updateProgress(problemType, problemId, changes) {
  const token = getSessionToken();
  if (!token) throw new Error("not logged in");

  const res = await fetch(`${API_BASE}/${problemType}/${problemId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Token": token,
    },
    body: JSON.stringify(changes), // { solved?: boolean, markedForRevision?: boolean }
  });

  if (!res.ok) {
    throw new Error("failed to update progress");
  }
  return res.json();
}

// Aggregated totals across every sheet — pulled fresh from the DB each call,
// so this is a good sanity check that progress survives logout/login.
// Shape: { questionsCompleted: {total, neetcode150, blind75, striver, cses},
//          markedForRevision: {total, neetcode150, blind75, striver, cses} }
export async function getProgressSummary() {
  const token = getSessionToken();
  if (!token) return null;

  const res = await fetch(`${API_BASE}/summary`, {
    headers: { "X-Session-Token": token },
  });

  if (!res.ok) {
    throw new Error("failed to load progress summary");
  }
  return res.json();
  // -> { totalSolved, totalMarkedForRevision, solvedByType: { NEETCODE, CSES, STRIVER } }
}

// Convenience: turns the raw progress array into a lookup map keyed by problemId,
// so components can do `progressMap[problem.id]?.solved` instead of scanning an array.
export function toProgressMap(progressList) {
  const map = {};
  for (const p of progressList) {
    map[p.problemId] = { solved: p.solved, markedForRevision: p.markedForRevision };
  }
  return map;
}