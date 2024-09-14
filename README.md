# Progetto programmazione Avanzata A.A. 2023/2024 - Sistema di Gestione Parcheggi

## 1. Indice
1. [Indice](#1-indice)
2. [Obiettivo](#2-obiettivo)
3. [Struttura del Progetto](#3-struttura-del-progetto)
   - [3.1 Diagramma dei Casi d'Uso](#31-diagramma-dei-casi-duso)
   - [3.2 Diagramma ER](#32-diagramma-er)
   - [3.3 Pattern Utilizzati](#33-pattern-utilizzati)
   - [3.4 Diagrammi delle Sequenze](#34-diagrammi-delle-sequenze)
   - [3.5 Struttura delle Directory](#35-struttura-delle-directory)
4. [API Routes](#4-api-routes)
5. [Utilizzo](#5-utilizzo)
6. [Strumenti Impiegati](#6-strumenti-impiegati)
7. [Autori](#7-autori)

## 2. Obiettivo
Il sistema ha lo scopo di gestire il calcolo del costo dei parcheggi per veicoli di diverse tipologie, in base ai transiti tra varchi di ingresso e uscita. Ogni parcheggio può avere più varchi e i costi variano a seconda del tipo di veicolo, della fascia oraria e del giorno della settimana. Il sistema deve registrare i transiti (data, ora, targa, varco) e controllare la disponibilità dei posti, rifiutando l'ingresso se non ci sono spazi liberi.

Il progetto include funzionalità CRUD per la gestione di:

- Parcheggi e varchi.
- Tariffe per parcheggio.
- Transiti (ingresso o uscita), con la possibilità di creare automaticamente la fattura per l'utente.

Il sistema prevede inoltre la creazione di rotte per:

- Ottenere lo stato dei transiti in base alle targhe e a un intervallo temporale, con esportazione in formato CSV o PDF.
- Generare statistiche per l'operatore, come il fatturato e il numero medio di posti liberi per fascia oraria.
- Fornire statistiche sui transiti distinti per tipologia di veicolo e fascia oraria.

Tutte le rotte sono protette tramite autenticazione JWT, e l'applicazione è sviluppata in TypeScript.

## 3. Struttura del Progetto
Il progetto è un back-end realizzato con Node.js e Express per gestire le API, utilizzando Sequelize per l'interazione con il database PostgreSQL. La struttura del codice è organizzata in moduli per controller, modelli, middleware e DAO, garantendo una gestione chiara e manutenibile delle varie funzionalità.

### 3.1 Diagramma dei Casi d'Uso
Il diagramma dei casi d'uso mostra i tre attori principali: **Automobilista**, **Varco** e **Operatore**. L'automobilista può visualizzare lo stato dei propri transiti e esportarli in formato CSV o PDF. L'operatore, invece, ha funzioni più ampie, come la gestione dei parcheggi, varchi e tariffe, l'inserimento e modifica dei transiti, e la generazione automatica delle fatture. L'operatore può inoltre visualizzare statistiche dettagliate sul fatturato e sui posti liberi dei parcheggi, con la possibilità di filtrare i dati per intervalli temporali e ottenere report in vari formati.
Infine il varco può solo inserire i transiti in ingresso che quelli in uscita. 
In figura è mostrato il diagramma:
![alt text](<immagini/diagramma dei casi d'uso.png>)

### 3.2 Diagramma ER
Il diagramma ER rappresenta un sistema di gestione parcheggi basato su Postgres.
Gli **utenti** possono possedere veicoli, ricevere fatture e gestire parcheggi, varchi e tariffe. I **veicoli** sono associati agli utenti e classificati per tipo. I **parcheggi** hanno varchi e una capacità limitata, con **tariffe** variabili in base a tipologia di veicolo, giorno della settimana e fascia oraria.
I **transiti** registrano il passaggio dei veicoli attraverso i varchi, includendo orari di ingresso/uscita e l'importo calcolato secondo la tariffa applicata. Le **fatture** sono generate per gli utenti in base ai transiti effettuati.
In sintesi, il modello relazionale collega utenti, veicoli, transiti e tariffe per gestire in modo efficiente il sistema di parcheggio.
In figura è mostrato il diagramma ER:
![alt text](<immagini/diagramma ER.png>)

[![](https://mermaid.ink/img/pako:eNqNVVFv2jAQ_iuRn2lV1naCvKEOOtStrWi6hwkpMs4lnJbYke1Ua4H_s_-xPzY7ISE4ZK1fIOfv7r777mxvCBMREJ-A_II0kTRbcs-s52B6H0y9TfVlF3LtYeQ93h1MSkvkicdFBh0jE8lJuyxEKirrrvr5MZ3fPHx7cHO9ADIDDU_n1FQm1CUXFhq4Bm9219nRmItwH7LZ3xMI5o8PYQ-L09kjUEziGwoOR5EeJ4ubr9Pb23knTk4lW0OSYF9Bx2JZF0ZzylA7VeZCaQwjVLnguMIUj7U0BLpKmty9OhpdDsaVEClQ7q0wQgm2PprC_wpxlZws5rPZxCVgmoVxTF0KcSqoUTjLhdTiI1ne66ddwIvMM36Si1CB1phRTp3tmCqGNBTS8OrsgbGlEMZgdH45ntRgMbl_mgcdgbWkXKHuaBxRDYYA2D9lOidXWUTt_CFdWofCFaXpsrvRUt9p12wSBM-LyTszb6soK-hhGGqhO2PSPYwm59HVst2enYlNc_p9b0nMbCuECJbkFLJma5ESGbz04FqH0EIT20jFesDVgbE4JniMSWGadBJYj7aF2sKV7gPWQ2KREMdmBosS2rkirMO2TWHdhHRQTn6a5ymyVtBaxPcotLE7YbJvjy8_i__7x4uwuhea-E3A3bZ0OlDOqVLUy0HW4Q_QffwW70K1ONftrHFtzshZWtg5IAOSgcwoRuaJKsd0SfQazFVJLC6i8peNuDM4Wmjx9MoZ8bUsYECkKJI18WOaKvNV5HaM909cY80p_ylEVruYT-JvyG_ij8fnV8PR1fjyYng5ur4akFfiX-wG5K1EX5yPqzW6Hg-Hnz-NRgMCkTnD8nv1mJZv6u4fOFoyKw?type=png)](https://mermaid.live/edit#pako:eNqNVVFv2jAQ_iuRn2lV1naCvKEOOtStrWi6hwkpMs4lnJbYke1Ua4H_s_-xPzY7ISE4ZK1fIOfv7r777mxvCBMREJ-A_II0kTRbcs-s52B6H0y9TfVlF3LtYeQ93h1MSkvkicdFBh0jE8lJuyxEKirrrvr5MZ3fPHx7cHO9ADIDDU_n1FQm1CUXFhq4Bm9219nRmItwH7LZ3xMI5o8PYQ-L09kjUEziGwoOR5EeJ4ubr9Pb23knTk4lW0OSYF9Bx2JZF0ZzylA7VeZCaQwjVLnguMIUj7U0BLpKmty9OhpdDsaVEClQ7q0wQgm2PprC_wpxlZws5rPZxCVgmoVxTF0KcSqoUTjLhdTiI1ne66ddwIvMM36Si1CB1phRTp3tmCqGNBTS8OrsgbGlEMZgdH45ntRgMbl_mgcdgbWkXKHuaBxRDYYA2D9lOidXWUTt_CFdWofCFaXpsrvRUt9p12wSBM-LyTszb6soK-hhGGqhO2PSPYwm59HVst2enYlNc_p9b0nMbCuECJbkFLJma5ESGbz04FqH0EIT20jFesDVgbE4JniMSWGadBJYj7aF2sKV7gPWQ2KREMdmBosS2rkirMO2TWHdhHRQTn6a5ymyVtBaxPcotLE7YbJvjy8_i__7x4uwuhea-E3A3bZ0OlDOqVLUy0HW4Q_QffwW70K1ONftrHFtzshZWtg5IAOSgcwoRuaJKsd0SfQazFVJLC6i8peNuDM4Wmjx9MoZ8bUsYECkKJI18WOaKvNV5HaM909cY80p_ylEVruYT-JvyG_ij8fnV8PR1fjyYng5ur4akFfiX-wG5K1EX5yPqzW6Hg-Hnz-NRgMCkTnD8nv1mJZv6u4fOFoyKw)
### 3.3 Pattern Utilizzati
**DAO (Data Access Object)**
 Il pattern DAO viene utilizzato per isolare la logica di accesso ai dati dal resto dell'applicazione. Consente di eseguire operazioni CRUD (Create, Read, Update, Delete) in modo modulare e organizzato, rendendo il codice più manutenibile e testabile. In pratica, fornisce un'interfaccia per interagire con il database, separando la logica di business dalla persistenza dei dati.

**Factory**
 Il pattern Factory è utilizzato per creare oggetti senza esporre la logica di instanziazione al codice cliente. Definisce un'interfaccia o una classe base per creare oggetti, delegando la decisione su quale classe concreta istanziare. È utile per evitare l'uso diretto del costruttore e gestire meglio la complessità nella creazione degli oggetti.

**Repository**
 Il Repository Pattern fornisce un'interfaccia per l'accesso ai dati a livello di dominio, nascondendo i dettagli della persistenza. Astrarre l'accesso ai dati tramite repository consente di manipolare gli oggetti di dominio senza preoccuparsi delle operazioni specifiche del database, rendendo più facile sostituire o modificare la logica di accesso ai dati in futuro.

**Singleton**
 Il Singleton garantisce che una classe abbia una sola istanza e fornisce un punto globale di accesso a quell'istanza. Questo pattern viene usato quando è necessario un controllo centralizzato, come la gestione di una connessione al database, per evitare la creazione di più istanze che potrebbero compromettere le risorse.

**Model-View-Controller (MVC)**
 Questo pattern suddivide l'applicazione in tre componenti principali: il Model gestisce i dati e la logica di business, la View si occupa della presentazione visiva dei dati, e il Controller funge da intermediario, gestendo le richieste dell'utente e orchestrando le interazioni tra il Model e la View. L'MVC promuove una chiara separazione delle responsabilità, semplificando la manutenzione e l'estensibilità dell'applicazione.
### 3.4 Diagrammi delle Sequenze
[Inserire qui una breve descrizione e i diagrammi delle sequenze principali]

### 3.5 Struttura delle Directory
L’architettura dei servizi determina la configurazione complessiva del progetto. La struttura del progetto include i seguenti componenti:

progetto
├── src/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   ├── db/
│   ├── ext/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   └── app.ts
├── .dockerignore
├── .env
├── docker-compose.yml
└── Dockerfile

## 4. API Routes

### Parcheggi

### Transiti

### Tariffe

### Statistiche

## 5. Utilizzo

### Requisiti

### Configurazione
1. Clona il repository:
   ```bash
   git clone https://github.com/Mauro0503/Progetto_programmazione_avanzata_2024.git
   cd Progetto_programmazione_avanzata_2024
   ```

2. Crea un file `.env` nella root del progetto con le seguenti variabili:
   ```
   JWT_SECRET=<tuo_jwt_secret>
   DB_HOST=<indirizzo_db>
   DB_USER=<username_db>
   DB_PASSWORD=<password_db>
   DB_NAME=<nome_db>
   ```

3. Avvia l'applicazione con Docker:

4. Accedi all'applicazione su `http://localhost:3000`.

### Migrazioni e Seed del Database

### Testing

## 6. Strumenti Impiegati
- **Node.js e Express**: Framework per il backend.
- **Sequelize**: ORM per interagire con il database.
- **PostgreSQL**: Database relazionale.
- **TypeScript**: Linguaggio di programmazione.
- **JWT**: Autenticazione tramite token.
- **Docker e Docker Compose**: Contenitori e orchestrazione.

