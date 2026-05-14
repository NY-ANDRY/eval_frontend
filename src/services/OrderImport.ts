import { getAuthClientHeader } from "../hooks/useHttpRequest.js";
import { API_URL_CLIENT } from "../lib/const.js";
import type { DataImport } from "./DataImport.js";
import type { ClientCsv, LoginStorage, OrderCsv } from "./types.js";

export class OrderImport {
    dataImport: DataImport;
    loginStores: LoginStorage[] = [];

    constructor(dataImport: DataImport) {
        this.dataImport = dataImport;
    }

    async import() {
        if (this.dataImport.ordersCsv.length <= 0) {
            this.notify("aucun order a importer");
        }
        this.notify(`import de ${this.dataImport.ordersCsv.length} orders`);

        await this.resetLoginStore();
        console.log(this.loginStores);


        this.notify(`import de ${this.dataImport.ordersCsv.length} orders terminer`);
    }

    async importOrder(orderCsv: OrderCsv | undefined) {
        if (!orderCsv) return;


    }

    async resetLoginStore() {
        this.loginStores = [];

        for (let i = 0; i < this.dataImport.ordersCsv.length; i++) {
            const order = this.dataImport.ordersCsv[i];

            const clientInfo: ClientCsv | null = this.getInfo(order?.client);
            if (clientInfo == null) {
                continue;
            }

            const loginRes = await fetch(`${API_URL_CLIENT}/customer/login`, {
                method: "POST",
                headers: getAuthClientHeader(),
                body: JSON.stringify({
                    email: clientInfo.email,
                    password: clientInfo.pwd,
                    device_name: "web"
                })
            });
            const loginResData = await loginRes.json();

            const ls: LoginStorage = {
                email: loginResData.data.email,
                token: loginResData.token
            };
            
            this.loginStores.push(ls);
        }

    }

    getInfo(clientEmail: string | undefined): ClientCsv | null {
        for (let i = 0; i < this.dataImport.clientsCsv.length; i++) {
            const clientCsv = this.dataImport.clientsCsv[i];

            if (clientCsv && clientCsv.email == clientEmail) {
                return clientCsv;
            }
        }
        return null;
    }

    notify(txt: string) {
        this.dataImport.notify(txt);
    }
}