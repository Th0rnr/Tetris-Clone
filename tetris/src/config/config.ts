interface Config {
  supabase: {
    url: string;
    anonKey: string;
  };
}

export const config: Config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
};

if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error("Missing required Supabase environment variables");
}
