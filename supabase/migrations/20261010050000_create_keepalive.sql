
CREATE OR REPLACE FUNCTION public.keepalive()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'status', 'ok',
    'message', 'Supabase funcionando'
  );
$$;

REVOKE ALL ON FUNCTION public.keepalive()
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.keepalive()
TO anon;
