import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://bscmrxrevjemsfdwzdqb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzY21yeHJldmplbXNmZHd6ZHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMDA2OTAsImV4cCI6MjA1MDc3NjY5MH0.9ak2taugucdYHqD8dQ3qb86cprRFxi19aiDZMLBeRNg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
