import { getAuthClientHeader } from "../hooks/useHttpRequest.js";
import { API_URL_CLIENT } from "../lib/const.js";
import type { DataImport } from "./DataImport.js";
import type { ClientCsv, OrderCsv } from "./types.js";

export class OrderImport {
    dataImport: DataImport;

    constructor(dataImport: DataImport) {
        this.dataImport = dataImport;
    }

    async import(orderCsv: OrderCsv[]) {
        if (orderCsv.length <= 0) {
            this.notify("aucun order a importer");
        }
        this.notify(`import de ${orderCsv.length} orders`);



        this.notify(`import de ${orderCsv.length} orders terminer`);
    }

    async importOrder(orderCsv: OrderCsv | undefined) {
        if (!orderCsv) return;


    }


    notify(txt: string) {
        this.dataImport.notify(txt);
    }
}