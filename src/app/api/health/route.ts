import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Tabloları kontrol et
    const checks = {
      users: false,
      categories: false,
      listings: false,
      conversations: false,
      messages: false,
      notifications: false,
      favorites: false,
    };

    // Users tablosu
    const { error: usersError } = await supabase
      .from("users")
      .select("id")
      .limit(1);
    checks.users = !usersError;

    // Categories tablosu
    const { error: categoriesError } = await supabase
      .from("categories")
      .select("id")
      .limit(1);
    checks.categories = !categoriesError;

    // Listings tablosu
    const { error: listingsError } = await supabase
      .from("listings")
      .select("id")
      .limit(1);
    checks.listings = !listingsError;

    // Conversations tablosu
    const { error: conversationsError } = await supabase
      .from("conversations")
      .select("id")
      .limit(1);
    checks.conversations = !conversationsError;

    // Messages tablosu
    const { error: messagesError } = await supabase
      .from("messages")
      .select("id")
      .limit(1);
    checks.messages = !messagesError;

    // Notifications tablosu
    const { error: notificationsError } = await supabase
      .from("notifications")
      .select("id")
      .limit(1);
    checks.notifications = !notificationsError;

    // Favorites tablosu
    const { error: favoritesError } = await supabase
      .from("favorites")
      .select("id")
      .limit(1);
    checks.favorites = !favoritesError;

    const allTablesExist = Object.values(checks).every(Boolean);

    return NextResponse.json({
      success: true,
      allTablesExist,
      tables: checks,
      errors: {
        users: usersError?.message,
        categories: categoriesError?.message,
        listings: listingsError?.message,
        conversations: conversationsError?.message,
        messages: messagesError?.message,
        notifications: notificationsError?.message,
        favorites: favoritesError?.message,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
