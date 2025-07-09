-- Migration: Make description NOT NULL with default '' in veyoyee.surveys
ALTER TABLE veyoyee.surveys
ALTER COLUMN description SET DEFAULT '',
ALTER COLUMN description SET NOT NULL;
