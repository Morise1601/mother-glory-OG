-- Converted files are published through the protected server upload route.
-- Storage writes/deletes use the service role after application permission checks;
-- this migration grants no browser upload or delete access.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-media', 'site-media', true, 104857600, ARRAY['image/webp', 'video/webm'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cms-media', 'cms-media', false, 104857600, ARRAY['image/webp', 'video/webm'])
ON CONFLICT (id) DO NOTHING;
