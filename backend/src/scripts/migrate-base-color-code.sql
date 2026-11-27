-- Run before deploying the Produtos schema that accepts editable palette codes.
-- Cast existing values as text and keep the old enum type in place.
BEGIN;
SET LOCAL lock_timeout = '5s';

DO $$
DECLARE
  column_type text;
BEGIN
  SELECT udt_name INTO column_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'produtos_cores' AND column_name = 'codigo';

  IF column_type = 'enum_produtos_cores_codigo' THEN
    ALTER TABLE public.produtos_cores
      ALTER COLUMN codigo TYPE varchar USING codigo::varchar;
  ELSIF column_type IS DISTINCT FROM 'varchar' THEN
    RAISE EXCEPTION 'Unexpected type for produtos_cores.codigo: %', column_type;
  END IF;
END
$$;

COMMIT;
