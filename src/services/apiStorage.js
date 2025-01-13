import supabase from "./supabase";

export async function uploadImage(bucket, name, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(name, file);

  if (error) throw new Error(error.message);

  return data;
}
