import { createClient } from "@/utils/supabase/server";

export default async function Leaderboard() {
  const supabase = await createClient();
  const { data: high_scores } = await supabase.from("high_scores").select();

  return <pre>{JSON.stringify(high_scores, null, 2)}</pre>;
}
