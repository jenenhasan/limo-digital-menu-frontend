// ---------------------------------------------------------------
// PER-CLIENT SETTINGS
// This is the one file you change when you fork this template for
// a new restaurant. Give each client a unique, url-safe slug —
// it's the row key in the shared Supabase table, so it must not
// collide with any other client's slug.
// ---------------------------------------------------------------
export const RESTAURANT_SLUG = "limo-ristorante";

// Staff PIN for the built-in editor. This is a UI convenience gate,
// not real security — anyone with the anon Supabase key could write
// to the table directly. See README.md "Security notes" before
// selling this for a client who cares about that.
export const STAFF_PIN = "1234";
