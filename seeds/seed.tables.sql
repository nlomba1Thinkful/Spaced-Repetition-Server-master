BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
    (
    2,
    'richie',
    'richie',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'German', 1),
   (2, 'German', 2);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'Danke', 'thank you', 2),
  (2, 1, 'Ja', 'yes', 3),
  (3, 1, 'Nein', 'no', 4),
  (4, 1, 'Bitte', 'you''re welcome', 5),
  (5, 1, 'Entschuldigen Sie', 'excuse me', 6),
  (6, 1, 'Es tut mir leid', 'i''m sorry', 7),
  (7, 1, 'Wo', 'where', 8),
  (8, 1, 'Guten Morgen', 'good morning', 9),
  (9, 1, 'Guten Abend', 'good evening', 10),
  (10, 1, 'Auf Wiedersehen', 'goodbye', null),
  (11, 2, 'Danke', 'thank you', 2),
  (12, 2, 'Ja', 'yes', 3),
  (13, 2, 'Nein', 'no', 4),
  (14, 2, 'Bitte', 'you''re welcome', 5),
  (15, 2, 'Entschuldigen Sie', 'excuse me', 6),
  (16, 2, 'Es tut mir leid', 'i''m sorry', 7),
  (17, 2, 'Wo', 'where', 8),
  (18, 2, 'Guten Morgen', 'good morning', 9),
  (19, 2, 'Guten Abend', 'good evening', 10),
  (20, 2, 'Auf Wiedersehen', 'goodbye', null);

UPDATE "language" SET head = 1 WHERE id = 1;
UPDATE "language" SET head = 11 WHERE id = 2;
-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
