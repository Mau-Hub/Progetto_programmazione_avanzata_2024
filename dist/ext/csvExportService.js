"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_csv_1 = require("fast-csv");
class CsvService {
    generaCsv(transiti) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const csv = yield (0, fast_csv_1.writeToString)(transiti, {
                    headers: true,
                });
                return csv;
            }
            catch (error) {
                console.error('Errore nella generazione del CSV:', error);
                throw new Error('Errore nella generazione del CSV');
            }
        });
    }
}
exports.default = new CsvService();
