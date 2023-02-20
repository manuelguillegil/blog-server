-- DEPRECATED. Used only for a base design

DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Post;

CREATE TABLE Usuario (
  id        Integer NOT NULL PRIMARY KEY,
  usuario   VARCHAR(64),
  email     VARCHAR(64),
  clave     VARCHAR(64)
);

CREATE TABLE Post (
  id                 Integer NOT NULL PRIMARY KEY,
  usuario_id         Integer,
  title              VARCHAR(64),
  qualification      Integer,
  created_at         Timestamptz NOT NULL DEFAULT NOW(),
  updated_at         Timestamptz NOT NULL DEFAULT NOW(),
  deleted_at         Timestamptz, 
  content            VARCHAR(128)
);

ALTER TABLE Post
  ADD CONSTRAINT usuario_fk
  FOREIGN KEY (usuario_id)
  REFERENCES Usuario(id)
  ON DELETE SET NULL;
