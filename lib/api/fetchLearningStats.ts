// lib/api/fetchLearningStats.ts

export async function fetchLearningStats(userId: string) {
  try {
    const res = await fetch(`/api/users/${userId}/stats`);
    if (!res.ok) {
      throw new Error(`Failed to fetch learning stats: ${res.status}`);
    }

    const data = await res.json();
    return data.stats;
  } catch (err) {
    console.error('🔥 fetchLearningStats error:', err);
    throw err;
  }
}
