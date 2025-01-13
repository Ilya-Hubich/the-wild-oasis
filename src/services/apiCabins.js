import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}

export async function createCabin(newCabin) {
  const imageName = getImageName(newCabin);
  const imagePath = getImagePath(newCabin, imageName);

  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  try {
    await uploadCabinImage(imageName, newCabin.image);
  } catch (e) {
    await deleteCabin(data.id);
    throw new Error(
      "Cabin image could not be created and the cabin was not created"
    );
  }

  return data;
}

export async function editCabin(newCabin) {
  const isImageUploaded = hasUploadedImage(newCabin);
  const imageName = getImageName(newCabin);
  const imagePath = getImagePath(newCabin, imageName);

  const { data, error } = await supabase
    .from("cabins")
    .update({ ...newCabin, image: imagePath })
    .eq("id", newCabin.id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be updated");
  }

  if (isImageUploaded) return data;

  try {
    await uploadCabinImage(imageName, newCabin.image);
  } catch (e) {
    throw new Error("Cabin image could not be updated");
  }

  return data;
}

function hasUploadedImage(newCabin) {
  return newCabin.image.startsWith?.(supabaseUrl);
}

function getImageName(newCabin) {
  return `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
}

function getImagePath(newCabin, imageName) {
  const hasImagePath = hasUploadedImage(newCabin);

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  return imagePath;
}

async function uploadCabinImage(name, file) {
  const { data, error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(name, file);

  if (storageError) {
    console.error(storageError);
    throw new Error("Cabin image could not be created");
  }

  return data;
}
