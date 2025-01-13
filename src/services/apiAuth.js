import supabase from "./supabase";
import { generateImageName } from "../utils/imageHelpers";
import { uploadImage } from "./apiStorage";

export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  const { data, error } = await supabase.auth.updateUser({
    data: { fullName },
  });

  if (error) throw new Error(error.message);

  if (!avatar) return data;

  const fileName = generateImageName(`avatar-${data.user.id}`);

  await uploadImage("avatars", fileName, avatar);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  const { data: updatedUser, error: updateAvatarPathError } =
    await supabase.auth.updateUser({
      data: { avatar: publicUrl },
    });

  if (updateAvatarPathError) throw new Error(updateAvatarPathError.message);

  return updatedUser;
}

export async function updatePassword({ password }) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}
