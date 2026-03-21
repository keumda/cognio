import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const [results, emails] = await Promise.all([
    supabaseAdmin.from("test_results").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("emails").select("id", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    participants: results.count || 0,
    waitlist: emails.count || 0,
  });
}
