# Progetto esame programmazione Avanzata A.A. 2023/2024 

## Indice
1. [Indice](#indice)
2. [Obiettivo](#obiettivo)
3. [Struttura del Progetto](#struttura-del-progetto)
   - [3.1 Diagramma dei Casi d'Uso](#diagramma-dei-casi-duso)
   - [3.2 Diagramma ER](#diagramma-er)
   - [3.3 Pattern Utilizzati](#pattern-utilizzati)
   - [3.4 Diagrammi delle Sequenze](#diagrammi-delle-sequenze)
   - [3.5 Struttura delle Directory](#struttura-delle-directory)
4. [API Routes](Api-routes)
5. [Utilizzo](#Utilizzo)
6. [Strumenti Impiegati](#Strumenti-impiegati)
7. [Autori](#Autori)

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

### Diagramma dei Casi d'Uso
Il diagramma dei casi d'uso viene mostrato in figura, nel quale è possibile notare i tre attori principali: **Automobilista**, **Varco** e **Operatore**. L'automobilista può visualizzare lo stato dei propri transiti e esportarli in formato CSV o PDF. L'operatore ha funzioni più ampie come la gestione dei parcheggi, varchi e tariffe, l'inserimento e modifica dei transiti, e la generazione automatica delle fatture. L'operatore può inoltre visualizzare statistiche dettagliate sul fatturato e sui posti liberi dei parcheggi, con la possibilità di filtrare i dati per intervalli temporali e ottenere report in vari formati.
Infine il varco può solo inserire i transiti in ingresso che quelli in uscita. 

![alt text](<immagini/casi d'uso diagramma.png>)

### Diagramma ER
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
![alt text](<immagini/diagramma ER.png>)

### Pattern Utilizzati

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

### 3.4 Diagrammi delle Sequenze
I diagrammi delle sequenze sono strumenti fondamentali per visualizzare le interazioni tra diversi oggetti in un sistema, tracciando il flusso di messaggi di richiesta e risposta. Questi diagrammi sono particolarmente utili per comprendere come le entità comunichino tra loro e per rappresentare chiaramente i processi di interazione all'interno di un sistema basato su rotte API.

Nel contesto del sistema in sviluppo, che include numerose rotte per le operazioni CRUD (Create, Read, Update, Delete), si è scelto di focalizzarsi sui diagrammi delle rotte più complesse e significative. Sono inclusi diagrammi per le rotte di tipo GET e/o POST, oltre a quelle PUT, mentre le rotte DELETE per l'eliminazione sono state escluse a causa della loro somiglianza tra loro. Questo approccio consente di mantenere il focus sui processi più rilevanti e complessi, offrendo una visione chiara e concisa delle principali dinamiche di comunicazione del sistema.



## 4. API Routes

### Parcheggi

### Varchi

### Tariffe

### Transiti

### Statistiche

## 5. Utilizzo

### Requisiti

### Configurazione
1. Clona il repository:


2. 

3. Avvia l'applicazione con Docker:

4. Accedi all'applicazione su `http://localhost:3000`.


### Testing

## 6. Strumenti Impiegati
- **Node.js e Express**: Framework per il backend.
- **Sequelize**: ORM per interagire con il database.
- **PostgreSQL**: Database relazionale.
- **TypeScript**: Linguaggio di programmazione.
- **JWT**: Autenticazione tramite token.
- **Docker e Docker Compose**: Contenitori e orchestrazione.

