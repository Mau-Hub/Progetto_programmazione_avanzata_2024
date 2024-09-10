"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationRoute_1 = __importDefault(require("./routes/authenticationRoute"));
const parcheggioRoutes_1 = __importDefault(require("./routes/parcheggioRoutes"));
const varcoRoutes_1 = __importDefault(require("./routes/varcoRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const authenticationMiddleware_1 = require("./middleware/authenticationMiddleware");
const tariffeRoutes_1 = __importDefault(require("./routes/tariffeRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware per il parsing del JSON
app.use(express_1.default.json());
// Middleware per il parsing di URL-encoded bodies
app.use(express_1.default.urlencoded({ extended: true }));
// ...
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Route di autenticazione (non protette)
app.use('/api', authenticationRoute_1.default);
// Applica il middleware di autenticazione a tutte le altre route /api
app.use('/api', authenticationMiddleware_1.authenticationMiddleware);
// Collegamento delle route del parcheggio (ora protette dall'autenticazione)
app.use('/api', parcheggioRoutes_1.default);
app.use('/api', varcoRoutes_1.default);
app.use('/api', tariffeRoutes_1.default);
// Middleware per la gestione degli errori
app.use(errorHandler_1.errorHandler);
// Gestione delle route non trovate
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
// Collegamento delle route del parcheggio
app.use('/api', parcheggioRoutes_1.default);
// Middleware per la gestione degli errori
app.use(errorHandler_1.errorHandler);
// TODO: MODIFICARE
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
app.listen(port, () => {
    console.log('Server is running at http://localhost:${port}');
    console.log('Port number:', port);
});
exports.default = app;
