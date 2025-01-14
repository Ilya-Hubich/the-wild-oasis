import supabase from "./supabase";

export async function getGuests({ filter }) {
  let query = supabase.from("guests").select("*");

  if (filter) {
    query = query[filter.method || "eq"](filter.field, filter.value);
  }

  const { data: guests, error } = await query;

  if (error) throw new Error(error);

  return guests;
}
