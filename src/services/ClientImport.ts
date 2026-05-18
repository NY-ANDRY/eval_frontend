import { getAuthClientHeader } from "../hooks/useHttpRequest.js";
import { API_URL_CLIENT } from "../lib/const.js";
import type { DataImport } from "./DataImport.js";
import type { ClientCsv } from "./types.js";

export class ClientImport {
    dataImport: DataImport;

    constructor(dataImport: DataImport) {
        this.dataImport = dataImport;
    }

    async import() {
        const clientsCsv = this.dataImport.clientsCsv;
        if (clientsCsv.length <= 0) {
            this.notify("aucun client a importer");
        }
        this.notify(`import de ${clientsCsv.length} clients`);

        let nbOk = 0;
        for (let i = 0; i < clientsCsv.length; i++) {
            if (clientsCsv[i] != undefined) {
                try {
                    await this.importClient(clientsCsv[i]);
                    nbOk++;
                } catch (error: any) {
                    this.notify(`client ${clientsCsv[i]?.email} non importer`);
                }
            }
        }

        this.notify(`import de ${clientsCsv.length} clients terminer. ${nbOk}/${clientsCsv.length}`);
    }

    async importClient(clientCsv: ClientCsv | undefined) {
        if (!clientCsv) return;

        await fetch(`${API_URL_CLIENT}/customer/register`, {
            method: "POST",
            headers: getAuthClientHeader(),
            body: JSON.stringify(
                {
                    "first_name": clientCsv.nom,
                    "last_name": clientCsv.prenom,
                    "email": clientCsv.email,
                    "password": clientCsv.pwd,
                    "password_confirmation": clientCsv.pwd,
                }
            )
        });
    }


    notify(txt: string) {
        this.dataImport.notify(txt);
    }
}