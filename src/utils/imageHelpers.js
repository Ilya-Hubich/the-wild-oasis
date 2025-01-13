import { supabaseUrl } from "../services/supabase";

export function isUploadedImage(image) {
  return image.startsWith?.(supabaseUrl);
}

export function generateImageName(imageName) {
  return `${imageName}-${Math.random()}`.replaceAll("/", "");
}

export function getImagePath(bucket, imageName) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${imageName}`;
}
