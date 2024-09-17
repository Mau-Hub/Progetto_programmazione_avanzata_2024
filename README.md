# Progetto esame programmazione Avanzata A.A. 2023/2024 

## Indice
1. [Obiettivo](#obiettivo)
2. [Struttura del Progetto](#struttura-del-progetto)
   - [Diagramma dei Casi d'Uso](#diagramma-dei-casi-duso)
   - [Diagramma ER](#diagramma-er)
   - [Pattern Utilizzati](#pattern-utilizzati)
   - [Diagrammi delle Sequenze](#diagrammi-delle-sequenze)
3. [API Routes](#api-routes)
4. [Configurazione e avvio](#configurazione-e-avvio)
5. [Autori](#autori)


## Obiettivo
Il sistema è progettato per gestire il calcolo dei costi di parcheggio per autoveicoli di diverse categorie, basandosi sui transiti tra varchi di ingresso e uscita.
Le caratteristiche principali includono che ogni parcheggio può avere più varchi e i costi variano a seconda del tipo di veicolo, della fascia oraria e del giorno della settimana. Il sistema deve registrare i transiti (data, ora, targa, varco) e controllare la disponibilità dei posti, rifiutando l'ingresso se non ci sono spazi liberi.

Il progetto include funzionalità CRUD per la gestione di:

- Parcheggi e varchi.
- Tariffe per parcheggio.
- Transiti (ingresso o uscita), con la possibilità di creare automaticamente la fattura per l'utente.

Il sistema prevede inoltre la creazione di rotte per:

- Consultazione dello stato dei transiti filtrati in base alle targhe e a un intervallo temporale, con esportazione in formato CSV o PDF.
- Generare statistiche per l'operatore, come il fatturato dei parcheggi e il numero medio di posti liberi per fascia oraria.
- Fornire statistiche sui transiti distinti per tipologia di veicolo e fascia oraria.

La sicurezza è garantita in tutte le rotte tramite autenticazione JWT, assicurando un accesso controllato e sicure alle funzionalità del sistema.

## Struttura del Progetto
Il progetto è  implementato come un'applicazione back-end impiegando tecnologie come:
- Framework: Node.js e Express per gestire le API
- ORM: Sequelize per l'interazione con il database
- Database: PostgreSQL per la persistenza dei dati.

La struttura del codice è organizzata in moduli distinti:
- Controllers: per la gestione della logica di business
- Models: per la definizione della struttura dei dati
- Middleware: per l'elaborazione delle richieste e l'autenticazione
- DAO (Data Access Objects): per l'interazione con il database

Questa struttura modulare facilita la manutenzione, la scalabilità e l'estensibilità del sistema, permettendo una gestione efficace delle diverse funzionalità richieste.

L’architettura dei servizi determina la configurazione complessiva del progetto. La struttura del progetto include i seguenti componenti:

```
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
```

## Diagramma dei Casi d'Uso
Il diagramma dei casi d'uso viene mostrato in figura, nel quale è possibile notare i tre attori principali: **Automobilista**, **Varco** e **Operatore**. L'automobilista può visualizzare lo stato dei propri transiti e esportarli in formato CSV o PDF. L'operatore ha funzioni più ampie come la gestione dei parcheggi, varchi e tariffe, l'inserimento e modifica dei transiti, e la generazione automatica delle fatture. L'operatore può inoltre visualizzare statistiche dettagliate sul fatturato e sui posti liberi dei parcheggi, con la possibilità di filtrare i dati per intervalli temporali e ottenere report in vari formati.
Infine il varco può solo inserire i transiti in ingresso che quelli in uscita. 

![alt text](<immagini/casi d'uso diagramma.png>)

## Diagramma ER
Il diagramma ER rappresenta la struttura del database per gestire i transiti di veicoli in parcheggi e la relativa fatturazione. Le principali entità coinvolte sono l'utente (che può essere un automobilista o un operatore), i veicoli, i parcheggi, i varchi, le tariffe, i transiti e le fatture. Ciascuna entità è descritta da una serie di attributi e collegata ad altre entità per gestire le relazioni chiave nel sistema.

- **UTENTE**: L'entità rappresenta sia l'automobilista che l'operatore. Gli automobilisti possiedono veicoli e questi veicoli effettuano transiti. Gli operatori, invece, gestiscono i parcheggi, configurano i varchi e impostano le tariffe.

- **VEICOLO**: Collegato a un utente (automobilista), ogni veicolo può essere di una certa categoria (ad esempio, citycar o berlina). I transiti vengono effettuati dai veicoli nei parcheggi attraverso dei varchi.

- **TIPO_VEICOLO**: Descrive il tipo del veicolo ( citycar, berlina e suv ).

- **PARCHEGGIO**: Ogni parcheggio ha una capacità e può ospitare vari autoveicoli. È collegato a più varchi per l'ingresso e l'uscita dei veicoli. 

- **VARCO**: Un varco rappresenta un punto di ingresso o uscita per i veicoli all'interno di un parcheggio. Può essere bidirezionale. 

- **TARIFFA**: Le tariffe variano in base al parcheggio, alla tipologia di veicolo, alla fascia oraria e se è un giorno feriale o festivo.

- **TRANSITO**: Rappresenta il passaggio di un veicolo attraverso un varco. Include i dettagli dell'ingresso e dell'uscita, la tariffa applicata e l'importo calcolato. 

- **FATTURA**: Le fatture vengono generate per gli automobilisti, includendo i transiti effettuati in un determinato periodo. 

In figura è mostrato il diagramma ER:
![alt text](<immagini/diagrammaER.png>)

## Pattern Utilizzati

### Data Access Object (DAO)

Nel progetto è stato adottato il pattern **Data Access Object (DAO)** per gestire l'accesso al database in modo strutturato e modulare. In un contesto in cui sono presenti più entità il DAO ne facilita l'interazione con il database, permettendo di eseguire operazioni CRUD (Create, Read, Update, Delete) su ciascuna di queste entità in maniera indipendente e organizzata.

Questo approccio consente di separare la logica di business dalla logica di persistenza dei dati, garantendo una maggiore manutenibilità del codice. Ogni DAO rappresenta un'interfaccia che definisce metodi per accedere a specifici dati, ad esempio i dettagli di un veicolo o le informazioni sui transiti in un parcheggio.

L'implementazione concreta di ogni DAO contiene la logica per interagire con il database, utilizzando Sequelize per semplificare la mappatura tra classi e tabelle del database. Questo garantisce che le entità possano essere gestite in modo indipendente, con operazioni di lettura, scrittura e aggiornamento facilmente estensibili.

L'adozione del pattern DAO si dimostra particolarmente efficace in questo progetto per diversi motivi:
- **Modularità**: ogni entità ha il suo DAO specifico, che ne gestisce le operazioni sul database. Questo rende il codice più facilmente modificabile e testabile.
- **Riutilizzabilità**: il codice del DAO può essere richiamato da altre componenti, come il sistema di gestione transiti, semplificando la logica di accesso ai dati.
- **Astrazione**: separare la logica di accesso ai dati dal resto dell'applicazione consente di mantenere il codice più pulito e comprensibile, oltre a facilitare eventuali cambiamenti futuri nel sistema di persistenza (ad esempio, cambiando database o ORM).

Nel contesto del progetto, i DAO sono stati implementati per gestire tutte le operazioni di accesso ai dati per ogni entità principale, garantendo una solida struttura di accesso ai dati distribuita in maniera chiara.

### Factory

Nel progetto, il pattern **Factory** viene utilizzato per gestire la generazione di errori HTTP personalizzati. Questo pattern permette di isolare la logica di creazione degli errori all'interno di una classe dedicata, che genera l'errore corretto in base al tipo richiesto. Ciò semplifica la gestione degli errori, centralizzando la logica in un unico punto e rendendo il codice più flessibile e manutenibile.

All'interno del sistema, il pattern è stato implementato nella classe `ErrorGenerator`, che crea istanze personalizzate della classe `CustomHttpError` in base al tipo di errore applicativo. In questo modo, il codice cliente può generare errori specifici, come `RESOURCE_NOT_FOUND`, `INVALID_INPUT` o `AUTH_FAILED`, senza dover conoscere i dettagli della loro creazione. Questa strategia non solo semplifica l'aggiunta di nuovi tipi di errore in futuro, ma migliora la manutenibilità e riusabilità del codice.

Inoltre, la Factory fa uso della libreria `http-status-codes` per associare in modo efficiente ogni tipo di errore a uno status HTTP appropriato, incapsulando tutta la logica di gestione degli errori in un'unica classe. Questo approccio facilita la gestione centralizzata degli errori, rendendo più semplice aggiornare o estendere il comportamento degli errori senza dover modificare il codice in più punti del progetto.

### Repository

Il pattern **Repository** è stato implementato per centralizzare la logica di accesso ai dati e fornire un'interfaccia uniforme alle altre componenti dell'applicazione. Questo pattern astrae l'accesso ai dati, nascondendo i dettagli tecnici su come i dati vengono recuperati o salvati, semplificando così la gestione delle entità.

Il Repository consente di manipolare le entità come collezioni in memoria, fornendo metodi per l'aggiunta, la rimozione e il recupero degli oggetti. Dietro le quinte, utilizza i DAO per eseguire le operazioni di persistenza effettiva sul database.

Rispetto ai DAO, che operano direttamente sulle tabelle e gestiscono le CRUD di base, il Repository offre un livello di astrazione più elevato, orchestrando queste operazioni. Questa struttura rende l'accesso ai dati flessibile e modulare, permettendo di modificare o sostituire la logica di persistenza senza impattare il resto dell'applicazione.

### Singleton

Nel progetto è stato adottato il pattern **Singleton** per garantire che alcune risorse condivise, come la connessione al database, vengano istanziate una sola volta nell'intero ciclo di vita dell'applicazione. Il **Singleton** assicura che ci sia un'unica istanza della risorsa e che questa sia accessibile globalmente, riducendo il rischio di creare più connessioni che potrebbero portare a problemi di concorrenza o inefficienza nell'uso delle risorse.

Il pattern viene implementato tramite un metodo che verifica se l'istanza esiste già: in caso contrario, la crea e la restituisce. Questo garantisce che ogni parte dell'applicazione utilizzi la stessa istanza, migliorando la gestione delle risorse e semplificando l'accesso a componenti centralizzate, come il database.

Grazie all'uso del **Singleton**, l'applicazione ottiene una maggiore efficienza e un controllo più semplice su componenti condivise, limitando la duplicazione delle risorse.
ettere le risorse.

### Model-View-Controller (MVC)

Nel progetto è stato scelto il pattern **Model-View-Controller (MVC)** per organizzare in modo chiaro la struttura dell'applicazione. Questo pattern separa la gestione dei dati, la logica di business e la presentazione, favorendo una maggiore manutenibilità e modularità del sistema.

Il **Model** si occupa della rappresentazione dei dati e della gestione della logica applicativa. Nel contesto del progetto, i dati vengono gestiti tramite **Sequelize**, un framework ORM che facilita l'interazione con il database, rendendo più semplice la gestione delle operazioni sui dati senza occuparsi direttamente dei dettagli del database stesso.

Il **Controller** è il componente che riceve le richieste e interagisce con il Model per eseguire operazioni come la creazione, lettura, aggiornamento e cancellazione dei dati. In questo progetto, i Controller svolgono un ruolo chiave nell'elaborare le richieste API e nel coordinare le operazioni con i dati, restituendo le risposte appropriate sotto forma di JSON.

Nonostante il progetto sia orientato principalmente al backend, e quindi non preveda una componente **View** tradizionale, la visualizzazione dei dati è stata comunque resa possibile attraverso strumenti come **Postman**, il quale permette di testare le API e visualizzare le risposte generate dal backend, fornendo una rappresentazione in formato JSON dei dati gestiti.

L'adozione di questo pattern ha permesso di mantenere una chiara separazione delle responsabilità, garantendo che ciascuna parte del sistema fosse indipendente e facilmente manutenibile.

## Diagrammi delle Sequenze

I diagrammi delle sequenze sono strumenti fondamentali per visualizzare le interazioni tra diversi oggetti in un sistema, tracciando il flusso di messaggi di richiesta e risposta. Questi diagrammi sono particolarmente utili per comprendere come le entità comunichino tra loro e per rappresentare chiaramente i processi di interazione all'interno di un sistema basato su rotte API.
Nel contesto del sistema in sviluppo, che include numerose rotte per le operazioni CRUD (Create, Read, Update, Delete), si è scelto di focalizzarsi sui diagrammi delle rotte più complesse e significative. Sono inclusi diagrammi per le rotte di tipo GET e/o POST, oltre a quelle PUT, mentre le rotte DELETE per l'eliminazione sono state escluse a causa della loro somiglianza tra loro. Questo approccio consente di mantenere il focus sui processi più rilevanti e complessi, offrendo una visione chiara e concisa delle principali dinamiche di comunicazione del sistema.

- POST /login
Il diagramma di sequenze illustra il processo di autenticazione di un utente utilizzando un token JWT. Il client inizia inviando una richiesta HTTP POST all'endpoint `/login`, includendo un token JWT nell'header di autorizzazione. Il router di Express riceve questa richiesta e passa il token al middleware di autenticazione.
Il middleware di autenticazione si occupa di verificare la validità del token inviandolo al servizio di verifica JWT. Se il token è valido, il middleware conferma l'autenticazione e il router prosegue recuperando i dati dell'utente associato al token dal database. Una volta ottenuti i dati, il router invia queste informazioni al client, completando il processo di autenticazione.
In caso di token invalido, il middleware di autenticazione segnala l'errore al router. Il gestore degli errori si occupa quindi di restituire un messaggio di errore al client, indicando che l'autenticazione è fallita a causa di un token non valido. Questo diagramma copre anche la gestione degli errori per garantire che il client riceva una risposta adeguata in caso di problemi con il token o con l'autenticazione.

![alt text](<immagini/postLogin.png>)

- GET /parcheggiobyID

Il diagramma di sequenze descrive il flusso per ottenere i dettagli di un parcheggio attraverso una richiesta HTTP GET all'endpoint `/parcheggio/:id`. Il processo inizia quando il client invia la richiesta al router di Express. Il router inoltra la richiesta a un middleware di autorizzazione per verificare se l'utente ha il ruolo necessario per accedere ai dettagli del parcheggio. Se l'utente ha il ruolo autorizzato, la richiesta viene poi passata a un middleware di validazione.
Il middleware di validazione verifica che l'ID del parcheggio fornito nella richiesta sia nel formato corretto. Se l'ID è valido, la richiesta prosegue verso il ParcheggioController. Il ParcheggioController è responsabile di comunicare con il ParcheggioDao per recuperare i dettagli del parcheggio dal database.
Una volta ottenuti i dati dal ParcheggioDao, il ParcheggioController restituisce queste informazioni al router, che infine le invia al client come risposta. Se il processo ha successo, il client riceve i dettagli del parcheggio richiesto.
Il diagramma include anche la gestione degli errori per garantire una risposta adeguata in caso di problemi. Gli errori gestiti includono l'assenza di autorizzazione del ruolo, ID non valido, parcheggio non trovato e eventuali errori del server, assicurando che il client riceva un messaggio chiaro in caso di fallimenti durante il processo.

![alt text](<immagini/getParcheggioID.png>)

- GET /allVarchi

Il diagramma di sequenze illustra il processo per ottenere l'elenco di tutti i varchi attraverso una richiesta HTTP GET all'endpoint `/varchi`. Il flusso inizia quando il client invia una richiesta al router di Express. Il router, dopo aver ricevuto la richiesta, passa il controllo a un middleware di autorizzazione per verificare se l'utente ha il ruolo adeguato per accedere alle informazioni sui varchi.
Se l'utente è autorizzato, la richiesta viene inoltrata al VarcoController. Il VarcoController è incaricato di interagire con il VarcoDao per recuperare i dati relativi ai varchi dal database. Una volta che il VarcoDao ha ottenuto l'elenco completo dei varchi dal database, restituisce questi dati al VarcoController.
Il VarcoController poi trasmette l'elenco dei varchi al router, che infine invia la risposta completa al client. Questo diagramma prevede anche la gestione degli errori: se l'utente non è autorizzato, viene restituito un messaggio di accesso negato. Inoltre, se ci sono problemi nel recupero dei dati, viene gestito un errore e comunicato al client, assicurando che riceva un'informativa adeguata in caso di malfunzionamenti.

![alt text](<immagini/getAllVarchi.png>)

- PUT /updateTransito

Il diagramma di sequenze descrive il flusso per gestire l'uscita di un transito tramite una richiesta HTTP PUT all'endpoint `/transito/:id/uscita`. Dopo che il client invia la richiesta, il router di Express verifica se l'utente ha il ruolo di 'operatore' tramite un middleware di autorizzazione. Se l'autorizzazione è confermata, il router passa la richiesta al TransitoController per gestire l'uscita.
Il TransitoController prima recupera il transito corrispondente all'ID fornito, interpellando il TransitoDao che esegue una query sul database. Una volta ottenuto il transito, il controller calcola la tariffa basata sul tempo di ingresso e uscita, consultando il TariffaDao che a sua volta interroga il database per ottenere la tariffa.
Con i dati aggiornati, il TransitoController aggiorna il transito nel database con i dettagli dell'uscita e l'importo calcolato, e conferma l'aggiornamento al router. Infine, il router restituisce al client la risposta con il transito aggiornato.
La gestione degli errori è prevista per i casi di accesso negato, transito non trovato e errori nel calcolo della tariffa, con risposte adeguate fornite al client per ciascun caso.

![alt text](<immagini/putTransito.png>)

## API Routes
La tabella sottostante elenca tutte le rotte disponibili nella collection, specificando i livelli di accesso autorizzati e fornendo una descrizione del loro scopo. E a seguire ne verranno mostrate alcune per fornire una panoramica del funzionamento. 

| Tipo     | Rotta                               | Autenticazione | Autorizzazione              |
|----------|-------------------------------------|----------------|-----------------------------|
| `POST`   | `/api/parcheggio`                   | Sì             | Operatore                   |
| `GET`    | `/parcheggio/id`                    | Sì             | Operatore                   |
| `GET`    | `/api/parcheggi`                    | Sì             | Operatore                   |
| `PUT`    | `/api/parcheggio/id`                | Sì             | Operatore                   |
| `DELETE` | `/api/parcheggio/id`                | Sì             | Operatore                   |
| `POST`   | `/api/varco`                        | Sì             | Operatore                   |
| `GET`    | `/api/varco/id`                     | Sì             | Operatore                   |
| `GET`    | `/api/varchi`                       | Sì             | Operatore                   |
| `PUT`    | `/api/varco/id`                     | Sì             | Operatore                   |
| `POST`   | `/api/tariffa`                      | Sì             | Operatore                   |
| `GET`    | `/api/tariffa/id`                   | Sì             | Operatore                   |
| `GET`    | `/api/tariffe`                      | Sì             | Operatore                   |
| `PUT`    | `/api/tariffa/id`                   | Sì             | Operatore                   |
| `DELETE` | `/api/tariffa/id`                   | Sì             | Operatore                   |
| `POST`   | `/api/transito`                     | Sì             | Operatore, Varco            |
| `GET`    | `/api/transito/id`                  | Sì             | Operatore                   |
| `PUT`    | `/api/transito/id/uscita`           | Sì             | Operatore                   |
| `DELETE` | `/api/transito/id`                  | Sì             | Operatore                   |
| `GET`    | `/api/transiti/export`              | Sì             | Operatore, Automobilista    |
| `GET`    | `/api/statistiche`                  | Sì             | Operatore                   |
| `GET`    | `/api/statistiche/parcheggio`       | Sì             | Operatore                   |
| `POST`   | `/api/login`                        | No             | Operatore, Varco, Automobilista |

### Parcheggio

*Rotta:*
```bash
POST api/parcheggio
```
*Body Richiesta:*

```json
{
  "nome": "Stamira",
  "capacita": 60,
  "varchi": [
    {
      "tipo": "USCITA",
      "bidirezionale": true
    }
  ]
}
```
*Risposta:*
```json
{
    "id": 5,
    "nome": "Stamira",
    "capacita": 60,
    "posti_disponibili": 60,
    "createdAt": "2024-09-17T08:37:03.721Z",
    "updatedAt": "2024-09-17T08:37:03.721Z"
}
```
### ParcheggiobyID
*Rotta:*
```bash
GET api/parcheggio/id
```
*Risposta:*
```json
{
    "id": 1,
    "nome": "Parcheggio Centro",
    "capacita": 100,
    "posti_disponibili": 97,
    "createdAt": "2024-09-14T08:12:28.722Z",
    "updatedAt": "2024-09-15T09:35:33.393Z"
}
```

### allVarchi
*Rotta:*
```bash
GET api/varchi
```
*Risposta:*
```json
[
    {
        "id": 1,
        "tipo": "INGRESSO",
        "bidirezionale": false,
        "id_parcheggio": 1,
        "createdAt": "2024-09-14T08:12:28.729Z",
        "updatedAt": "2024-09-14T08:12:28.729Z"
    },
    {
        "id": 2,
        "tipo": "USCITA",
        "bidirezionale": false,
        "id_parcheggio": 1,
        "createdAt": "2024-09-14T08:12:28.729Z",
        "updatedAt": "2024-09-14T08:12:28.729Z"
    },
    {
        "id": 3,
        "tipo": "INGRESSO",
        "bidirezionale": true,
        "id_parcheggio": 2,
        "createdAt": "2024-09-14T08:12:28.729Z",
        "updatedAt": "2024-09-14T08:12:28.729Z"
    }
]
```

### updateTariffa
*Rotta:*
```bash
PUT /api/tariffa/id
```
*Richiesta:*
```json
{
  "id_tipo_veicolo": 3,
  "importo": 4,
  "fascia_oraria": "NOTTURNA",
  "feriale_festivo": "FERIALE",
  "id_parcheggio": 2
}
```
*Risposta:*
```json
{
    "id": 7,
    "id_tipo_veicolo": 3,
    "importo": 4,
    "fascia_oraria": "NOTTURNA",
    "feriale_festivo": "FERIALE",
    "id_parcheggio": 2,
    "updatedAt": "2024-09-17T08:42:14.254Z",
    "createdAt": "2024-09-17T08:42:14.254Z"
}
```
### updateTransito
*Rotta:*
```bash
PUT /api/transito/id/ingresso o uscita
```
*Richiesta:*
```json
{
    "id_varco_uscita": 2
}
```
*Risposta:*
```json
{
    "id": 23,
    "ingresso": "2024-09-17T08:48:09.007Z",
    "uscita": "2024-09-17T08:50:38.786Z",
    "id_veicolo": 16,
    "id_varco_ingresso": 1,
    "id_varco_uscita": 2,
    "id_tariffa": 8,
    "importo": 0.3328422222222222
}
```
### getExport
*Rotta:*
```bash
GET api/transiti/export
```
*Richiesta:*
```json
{
  "targhe": ["AB123CD"],
  "from": "2024-09-01T00:00:00.000Z",
  "to": "2024-09-30T23:59:59.999Z",
  "formato": "csv"
}
```
*Risposta:*
Se il formato richiesto è in csv, la risposta sarà la seguente:
![alt text](<immagini/csvExport.jpg>)

### getStatistiche
*Rotta:*
```bash
GET api/statistiche
```
*Richiesta:*
```json
{
  "from": "2024-09-01T00:00:00.000Z",
  "to": "2024-09-30T23:59:59.999Z",
  "formato": "pdf"
}
```
*Risposta:*
Se il formato richiesto è in pdf, la risposta sarà la seguente:
![alt text](<immagini/reportStatistiche.jpg>)

### getStatisticheParcheggio
*Rotta:*
```bash
GET api/statistiche/parcheggio
```
*Richiesta:*
```json
{
  "idParcheggio": 1,
  "from": "2024-09-01T00:00:00.000Z",
  "to": "2024-09-30T23:59:59.999Z",
}
```
*Risposta:*
```json
{
    "numeroTotaleTransiti": 5,
    "transitiPerTipoVeicolo": {
        "1": 2,
        "2": 3
    },
    "transitiPerFasciaOraria": {
        "DIURNA": 3,
        "NOTTURNA": 2
    },
    "fatturatoTotale": 16.599169305555556
}
```
## Configurazione e Avvio

Per utilizzare l'applicazione, basta seguire i seguenti passi. Assicurarsi di avere installato Docker e Postman sul proprio sistema prima di procedere:

### Clona il repository
Clonare il repository GitHub nella macchina locale eseguendo il seguente comando:
```bash
git clone https://github.com/Mauro0503/Progetto_programmazione_avanzata_2024.git
```
2. All'interno della directory del progetto, è presente un file di configurazione ```.env``` da importare.

3. Importare la collection Postman contenuta nel file: `CollectionParcheggio.postman_collection.json`

4. Avviare l'applicazione con Docker tramite il comando:
```bash
docker-compose up --build 
```
5. Una volta che Docker avrà avviato correttamente l'applicazione, sarà possibile accedervi all'indirizzo: `http://localhost:3000`.

Le rotte API mostrate nella sezione [API Routes](#api-routes) possono essere testate tramite Postman, utilizzando la collection `CollectionParcheggio.postman_collection.json` e l'environment `Parcheggio.postman_environment.json`.

## Autori