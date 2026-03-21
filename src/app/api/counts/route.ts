import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// 최소 표시 숫자 (초기에 너무 낮아 보이지 않도록)
const FLOOR = {
  participants: 127,
  waitlist: 127,
};

export async function GET() {
  const [results, emails] = await Promise.all([
    supabaseAdmin.from("test_results").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("emails").select("id", { count: "exact", head: true }),
  ]);

  const dbParticipants = results.count || 0;
  const dbWaitlist = emails.count || 0;

  return NextResponse.json({
    participants: Math.max(FLOOR.participants, dbParticipants),
    waitlist: Math.max(FLOOR.waitlist, dbWaitlist),
  });
}
