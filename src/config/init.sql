-- File SQL per le migrazioni per la creazione delle tabelle 

-- Crea la tabella Utenti
CREATE TABLE "Utenti" (
  "id" SERIAL PRIMARY KEY,
  "nome" VARCHAR(50) NOT NULL,
  "ruolo" ENUM('operatore', 'automobilista', 'varco') NOT NULL,
  "jwt_token" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Crea la tabella Parcheggio
CREATE TABLE "Parcheggio" (
  "id" SERIAL PRIMARY KEY,
  "nome" VARCHAR(100) NOT NULL,
  "capacita" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Crea la tabella Tipo_Veicolo
CREATE TABLE "Tipo_Veicolo" (
  "id" SERIAL PRIMARY KEY,
  "nome" VARCHAR(50) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Crea la tabella Veicoli
CREATE TABLE "Veicoli" (
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
CREATE TABLE "Varco" (
  "id" SERIAL PRIMARY KEY,
  "tipo" ENUM('INGRESSO', 'USCITA') NOT NULL,
  "bidirezionale" BOOLEAN NOT NULL DEFAULT FALSE,
  "id_parcheggio" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("id_parcheggio") REFERENCES "Parcheggio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crea la tabella Tariffe
CREATE TABLE "Tariffe" (
  "id" SERIAL PRIMARY KEY,
  "id_tipo_veicolo" INTEGER NOT NULL,
  "importo" FLOAT NOT NULL,
  "fascia_oraria" ENUM('DIURNA', 'NOTTURNA') NOT NULL,
  "giorno_settimana" ENUM('LUNEDI', 'MARTEDI', 'MERCOLEDI', 'GIOVEDI', 'VENERDI', 'SABATO', 'DOMENICA', 'FERIALE', 'FESTIVO') NOT NULL,
  "id_parcheggio" INTEGER NOT NULL,
  "id_utente" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("id_tipo_veicolo") REFERENCES "Tipo_Veicolo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_parcheggio") REFERENCES "Parcheggio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_utente") REFERENCES "Utenti" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crea la tabella Transiti
CREATE TABLE "Transiti" (
  "id" SERIAL PRIMARY KEY,
  "ingresso" TIMESTAMP WITH TIME ZONE NOT NULL,
  "uscita" TIMESTAMP WITH TIME ZONE,
  "id_veicolo" INTEGER NOT NULL,
  "id_varco_ingresso" INTEGER NOT NULL,
  "id_varco_uscita" INTEGER,
  "id_tariffa" INTEGER NOT NULL,
  "id_posto" INTEGER NOT NULL,
  "importo" FLOAT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("id_veicolo") REFERENCES "Veicoli" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_varco_ingresso") REFERENCES "Varco" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_varco_uscita") REFERENCES "Varco" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_tariffa") REFERENCES "Tariffe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crea la tabella Fatture
CREATE TABLE "Fatture" (
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


-- Dati di esempio per l'inserimento dei dati iniziali

-- Inserisci utenti di esempio
INSERT INTO "Utenti" ("nome", "ruolo", "jwt_token", "createdAt", "updatedAt") VALUES
('Admin', 'operatore', 'admin_token', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('John Doe', 'automobilista', 'john_token', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Varco1', 'varco', 'varco1_token', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserisci parcheggi di esempio
INSERT INTO "Parcheggio" ("nome", "capacita", "createdAt", "updatedAt") VALUES
('Parcheggio Centro', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Parcheggio Stazione', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserisci tipi di veicolo
INSERT INTO "Tipo_Veicolo" ("nome", "createdAt", "updatedAt") VALUES
('Auto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Moto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Furgone', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserisci veicoli di esempio
INSERT INTO "Veicoli" ("targa", "id_tipo_veicolo", "id_utente", "createdAt", "updatedAt") VALUES
('AB123CD', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('XY789ZW', 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserisci varchi di esempio
INSERT INTO "Varco" ("tipo", "bidirezionale", "id_parcheggio", "createdAt", "updatedAt") VALUES
('INGRESSO', FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('USCITA', FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('INGRESSO', TRUE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserisci tariffe di esempio
INSERT INTO "Tariffe" ("id_tipo_veicolo", "importo", "fascia_oraria", "giorno_settimana", "id_parcheggio", "id_utente", "createdAt", "updatedAt") VALUES
(1, 2.5, 'DIURNA', 'FERIALE', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1.5, 'DIURNA', 'FERIALE', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 3.0, 'NOTTURNA', 'FERIALE', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Inserisci transiti di esempio
INSERT INTO "Transiti" ("ingresso", "uscita", "id_veicolo", "id_varco_ingresso", "id_varco_uscita", "id_tariffa", "id_posto", "importo", "createdAt", "updatedAt") VALUES
(CURRENT_TIMESTAMP - INTERVAL '2 HOURS', CURRENT_TIMESTAMP - INTERVAL '1 HOUR', 1, 1, 2, 1, 1, 2.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(CURRENT_TIMESTAMP - INTERVAL '1 HOUR', NULL, 2, 1, NULL, 2, 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- -- Inserisci fatture di esempio
INSERT INTO "Fatture" ("data", "importo_totale", "id_utente", "id_transito", "createdAt", "updatedAt") VALUES
(CURRENT_TIMESTAMP - INTERVAL '1 HOUR', 2.5, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);