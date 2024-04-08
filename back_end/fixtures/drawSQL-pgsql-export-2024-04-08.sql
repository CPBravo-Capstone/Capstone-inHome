CREATE TABLE "user"(
    "id" BIGINT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "birth_date" BIGINT NOT NULL
);
ALTER TABLE
    "user" ADD PRIMARY KEY("id");
ALTER TABLE
    "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");
COMMENT
ON COLUMN
    "user"."email" IS 'make equal to email';
COMMENT
ON COLUMN
    "user"."role" IS 'Tenant or Landlord';
CREATE TABLE "property"(
    "id" BIGINT NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "apt" BIGINT NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "zip" BIGINT NOT NULL,
    "vacant" BOOLEAN NOT NULL,
    "landlord" BIGINT NOT NULL,
    "tenant" BIGINT NOT NULL
);
ALTER TABLE
    "property" ADD PRIMARY KEY("id");
ALTER TABLE
    "property" ADD CONSTRAINT "property_apt_unique" UNIQUE("apt");
ALTER TABLE
    "property" ADD CONSTRAINT "property_state_unique" UNIQUE("state");
ALTER TABLE
    "property" ADD CONSTRAINT "property_zip_unique" UNIQUE("zip");
COMMENT
ON COLUMN
    "property"."landlord" IS 'foreign key';
CREATE TABLE "apartment"(
    "id" BIGINT NOT NULL,
    "bedroom" BIGINT NOT NULL,
    "bathroom" BIGINT NOT NULL
);
ALTER TABLE
    "apartment" ADD PRIMARY KEY("id");
ALTER TABLE
    "property" ADD CONSTRAINT "property_apt_foreign" FOREIGN KEY("apt") REFERENCES "apartment"("id");
ALTER TABLE
    "property" ADD CONSTRAINT "property_tenant_foreign" FOREIGN KEY("tenant") REFERENCES "user"("id");
ALTER TABLE
    "property" ADD CONSTRAINT "property_landlord_foreign" FOREIGN KEY("landlord") REFERENCES "user"("id");