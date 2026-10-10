CREATE TABLE "public"."cotizaciones" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "nombre"         character varying(100)   NOT NULL,
  "email"          character varying(255)   NOT NULL,
  "mensaje"        text                     NOT NULL,
  "estado"         character varying(20)    NOT NULL DEFAULT 'pendiente'::character varying,
  "fecha_creacion" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "cotizaciones_estado_valido"
    CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'contactado'::character varying, 'cerrado'::character varying])::text[]))),
  CONSTRAINT "cotizaciones_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."cotizaciones"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."cotizaciones" FROM "anon", "authenticated";

REVOKE ALL ON TABLE "public"."cotizaciones" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."cotizaciones" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."cotizaciones" TO "service_role";

