import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StatisticsClient } from "./statistics-client";

export const dynamic = 'force-dynamic';

interface OpeningStats {
  opening_id: string | null;
  custom_opening_id: string | null;
  opening_name: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;
  last_practiced: string;
}

export default async function StatisticsPage() {
  const supabase = await createServerSupabaseClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view your statistics</div>;
  }

  // Fetch all user progress
  const { data: progressData, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      opening:openings(id, name, eco),
      custom_opening:custom_openings(id, name)
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching progress:', error);
  }

  // Calculate overall statistics
  const totalAttempts = progressData?.reduce(
    (sum, p) => sum + p.correct_count + p.incorrect_count,
    0
  ) || 0;

  const correctAttempts = progressData?.reduce(
    (sum, p) => sum + p.correct_count,
    0
  ) || 0;

  const overallAccuracy = totalAttempts > 0
    ? Math.round((correctAttempts / totalAttempts) * 100)
    : 0;

  // Group by opening
  const openingStatsMap = new Map<string, OpeningStats>();

  progressData?.forEach((progress: any) => {
    const opening = progress.opening || progress.custom_opening;
    if (!opening) return;

    const key = progress.opening_id || progress.custom_opening_id || 'unknown';
    
    if (!openingStatsMap.has(key)) {
      openingStatsMap.set(key, {
        opening_id: progress.opening_id,
        custom_opening_id: progress.custom_opening_id,
        opening_name: opening.name,
        total_attempts: 0,
        correct_attempts: 0,
        accuracy: 0,
        last_practiced: progress.last_practiced,
      });
    }

    const stats = openingStatsMap.get(key)!;
    stats.total_attempts += progress.correct_count + progress.incorrect_count;
    stats.correct_attempts += progress.correct_count;
    
    // Update last practiced if more recent
    if (new Date(progress.last_practiced) > new Date(stats.last_practiced)) {
      stats.last_practiced = progress.last_practiced;
    }
  });

  // Calculate accuracy for each opening
  const openingStats: OpeningStats[] = Array.from(openingStatsMap.values()).map(stats => ({
    ...stats,
    accuracy: stats.total_attempts > 0
      ? Math.round((stats.correct_attempts / stats.total_attempts) * 100)
      : 0,
  }));

  // Sort by total attempts (most practiced first)
  openingStats.sort((a, b) => b.total_attempts - a.total_attempts);

  // Calculate practice streak
  const sortedByDate = [...(progressData || [])].sort(
    (a, b) => new Date(b.last_practiced).getTime() - new Date(a.last_practiced).getTime()
  );

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (sortedByDate.length > 0) {
    const uniqueDates = new Set(
      sortedByDate.map(p => new Date(p.last_practiced).toDateString())
    );
    const sortedDates = Array.from(uniqueDates).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    let checkDate = new Date(today);
    for (const dateStr of sortedDates) {
      const practiceDate = new Date(dateStr);
      practiceDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((checkDate.getTime() - practiceDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0 || diffDays === 1) {
        currentStreak++;
        checkDate = new Date(practiceDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return (
    <StatisticsClient
      overallStats={{
        totalAttempts,
        correctAttempts,
        incorrectAttempts: totalAttempts - correctAttempts,
        overallAccuracy,
        currentStreak,
        totalOpeningsPracticed: openingStats.length,
      }}
      openingStats={openingStats}
    />
  );
}