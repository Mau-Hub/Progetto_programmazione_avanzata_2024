-- Definisce il tipo ENUM per la colonna "ruolo" nella tabella "Utenti"
CREATE TYPE ruolo_enum AS ENUM ('operatore', 'automobilista', 'varco');

-- Definisce il tipo ENUM per la colonna "tipo" nella tabella "Varco"
CREATE TYPE tipo_enum AS ENUM ('INGRESSO', 'USCITA');

-- Definisce il tipo ENUM per la colonna "fascia_oraria" nella tabella "Tariffe"
CREATE TYPE fascia_oraria_enum AS ENUM ('DIURNA', 'NOTTURNA');

-- Definisce il tipo ENUM per la colonna "giorno_settimana" nella tabella "Tariffe"
CREATE TYPE giorno_settimana_enum AS ENUM ('LUNEDI', 'MARTEDI', 'MERCOLEDI', 'GIOVEDI', 'VENERDI', 'SABATO', 'DOMENICA');

-- Definisce il tipo ENUM per la colonna "feriale_festivo" nella tabella "Tariffe"
CREATE TYPE feriale_festivo_enum AS ENUM ('FERIALE', 'FESTIVO');

-- Crea la tabella Utenti
CREATE TABLE IF NOT EXISTS "Utenti" (
  "id" SERIAL PRIMARY KEY,
  "nome" VARCHAR(50) NOT NULL,
  "ruolo" ruolo_enum NOT NULL,  
  "username" VARCHAR(100) UNIQUE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Creazione della tabella Parcheggio 
CREATE TABLE IF NOT EXISTS "Parcheggio" (
  "id" SERIAL PRIMARY KEY,
  "nome" VARCHAR(100) NOT NULL,
  "capacita" INTEGER NOT NULL,
  "posti_disponibili" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Crea la tabella Tipo_Veicolo
CREATE TABLE IF NOT EXISTS "Tipo_Veicolo" (
  "id" SERIAL PRIMARY KEY,
  "nome" VARCHAR(50) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Crea la tabella Veicoli
CREATE TABLE IF NOT EXISTS "Veicoli" (
  "id" SERIAL PRIMARY KEY,
  "targa" VARCHAR(20) NOT NULL UNIQUE,
  "id_tipo_veicolo" INTEGER NOT NULL,
  "id_utente" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("id_tipo_veicolo") REFERENCES "Tipo_Veicolo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_utente") REFERENCES "Utenti" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crea la tabella Varco
CREATE TABLE IF NOT EXISTS "Varco" (
  "id" SERIAL PRIMARY KEY,
  "tipo" tipo_enum NOT NULL,
  "bidirezionale" BOOLEAN NOT NULL DEFAULT FALSE,
  "id_parcheggio" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("id_parcheggio") REFERENCES "Parcheggio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crea la tabella Tariffe
CREATE TABLE IF NOT EXISTS "Tariffe" (
  "id" SERIAL PRIMARY KEY,
  "id_tipo_veicolo" INTEGER NOT NULL,
  "importo" FLOAT NOT NULL,
  "fascia_oraria" fascia_oraria_enum NOT NULL,  
  "feriale_festivo" feriale_festivo_enum NOT NULL, 
  "id_parcheggio" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("id_tipo_veicolo") REFERENCES "Tipo_Veicolo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_parcheggio") REFERENCES "Parcheggio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crea la tabella Transiti
CREATE TABLE IF NOT EXISTS "Transiti" (
  "id" SERIAL PRIMARY KEY,
  "ingresso" TIMESTAMP WITH TIME ZONE NOT NULL,
  "uscita" TIMESTAMP WITH TIME ZONE,
  "id_veicolo" INTEGER NOT NULL,
  "id_varco_ingresso" INTEGER NOT NULL,
  "id_varco_uscita" INTEGER,
  "id_tariffa" INTEGER,
  "importo" FLOAT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("id_veicolo") REFERENCES "Veicoli" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_varco_ingresso") REFERENCES "Varco" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_varco_uscita") REFERENCES "Varco" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_tariffa") REFERENCES "Tariffe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crea la tabella Fatture
CREATE TABLE IF NOT EXISTS "Fatture" (
  "id" SERIAL PRIMARY KEY,
  "data" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "importo_totale" FLOAT NOT NULL,
  "id_utente" INTEGER NOT NULL,
  "id_transito" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("id_utente") REFERENCES "Utenti" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_transito") REFERENCES "Transiti" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);


-- Inserimento dei dati iniziali

-- Utenti di esempio
INSERT INTO "Utenti" ("nome", "ruolo", "username", "createdAt", "updatedAt") VALUES
('Admin', 'operatore', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('John Doe', 'automobilista', 'john', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Varco1', 'varco', 'varco1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserimento dei dati iniziali per Parcheggio
INSERT INTO "Parcheggio" ("nome", "capacita", "posti_disponibili", "createdAt", "updatedAt") VALUES
('Parcheggio Centro', 100, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Parcheggio Stazione', 50, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Tipi di veicolo
INSERT INTO "Tipo_Veicolo" ("nome", "createdAt", "updatedAt") VALUES
('CityCar', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Berlina', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SUV', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Veicoli di esempio
INSERT INTO "Veicoli" ("targa", "id_tipo_veicolo", "id_utente", "createdAt", "updatedAt") VALUES
('AB123CD', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('XY789ZW', 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Varchi di esempio
INSERT INTO "Varco" ("tipo", "bidirezionale", "id_parcheggio", "createdAt", "updatedAt") VALUES
('INGRESSO', FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('USCITA', FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('INGRESSO', TRUE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Tariffe di esempio
INSERT INTO "Tariffe" ("id_tipo_veicolo", "importo", "fascia_oraria", "feriale_festivo", "id_parcheggio", "createdAt", "updatedAt") VALUES
(1, 2.5, 'DIURNA', 'FERIALE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1.5, 'DIURNA', 'FESTIVO', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 3.0, 'NOTTURNA', 'FERIALE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Transiti di esempio
INSERT INTO "Transiti" 
("ingresso", "uscita", "id_veicolo", "id_varco_ingresso", "id_varco_uscita", "id_tariffa", "importo", "createdAt", "updatedAt") 
VALUES
(CURRENT_TIMESTAMP - INTERVAL '2 HOURS', CURRENT_TIMESTAMP - INTERVAL '1 HOUR', 1, 1, 2, 1, 2.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(CURRENT_TIMESTAMP - INTERVAL '1 HOUR', NULL, 2, 1, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- -- Fatture di esempio
INSERT INTO "Fatture" ("data", "importo_totale", "id_utente", "id_transito", "createdAt", "updatedAt") VALUES
(CURRENT_TIMESTAMP - INTERVAL '1 HOUR', 2.5, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);