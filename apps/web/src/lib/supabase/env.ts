type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

const missingEnvMessage =
  "Supabase gelistirme ortam degiskenleri eksik. apps/web/.env.local icine NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY eklenmelidir.";

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(missingEnvMessage);
  }

  return {
    url,
    publishableKey,
  };
}
