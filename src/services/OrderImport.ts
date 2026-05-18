import { getAuthAdminHeader, getAuthClientHeader } from "../hooks/useHttpRequest.js";
import { API_URL_ADMIN, API_URL_CLIENT, HOST_URL } from "../lib/const.js";
import type { DataImport } from "./DataImport.js";
import type { ClientCsv, LoginStorage, OrderCsv } from "./types.js";

export class OrderImport {
    dataImport: DataImport;
    loginStores: LoginStorage[] = [];

    constructor(dataImport: DataImport) {
        this.dataImport = dataImport;
    }

    async import() {
        this.dataImport.init();

        const ordersCsv = this.dataImport.ordersCsv;
        if (ordersCsv.length <= 0) {
            this.notify("aucun order a importer");
        }
        this.notify(`import de ${ordersCsv.length} orders`);

        await this.resetLoginStore();

        let nbOk = 0;
        for (let i = 0; i < ordersCsv.length; i++) {
            const orderCsv = ordersCsv[i];
            try {
                this.notify(`import achat de ${orderCsv?.client} commencer`);
                await this.importOrder(orderCsv);
                nbOk++;
                this.notify(`import achat de ${orderCsv?.client} terminer. i: ${i+1}`);
            } catch (error) {
                this.notify(`import achat de ${orderCsv?.client} terminer avec erreur. ${i+1} / ${ordersCsv.length}`);
            }
        }

        this.notify(`import de ${ordersCsv.length} orders terminer: ${nbOk}/${ordersCsv.length}`);
    }

    async importOrder(orderCsv: OrderCsv | undefined) {
        if (!orderCsv) return;

        const curToken = this.getToken(orderCsv.client);

        if (curToken == null) {
            this.notify(`token non trouver pour ${orderCsv.client}`);
            return;
        }

        await this.makeCart(orderCsv, curToken);

        await this.saveAddress(orderCsv, curToken);
        await this.saveShipping(orderCsv, curToken);
        await this.savePayment(orderCsv, curToken);
        const order = await this.saveOrder(orderCsv, curToken);

        if (orderCsv.status.trim() == "pending") {
            // 

            //
        } else if (orderCsv.status.trim() == "completed") {
            // 
            await this.setOrderCompleted(order);
            // 
        }

        await this.updateDateHeure(order, orderCsv);
    }

    async updateDateHeure(order: any, orderCsv: OrderCsv) {

        const [day, month, year] = orderCsv.date.split("/");
        const dateTime = `${year}-${month}-${day} ${orderCsv.heure}:00`;

        await fetch(`${HOST_URL}/adapt/order_update_date`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: order.id,
                date: dateTime
            })
        });
    }

    async setOrderCompleted(order: any) {
        // throw new Error("Method not implemented.");
        await this.doShipment(order);
        await this.doPayment(order);
    }

    async doPayment(order: any) {
        let payItems: any = {};
        for (let i = 0; i < order.items.length; i++) {
            const item = order.items[i];
            payItems[item.id] = item.qty_ordered
        }
        const dataToSend = {
            "invoice": {
                "items": payItems
            },
            "can_create_transaction": 1
        };

        await fetch(`${API_URL_ADMIN}/sales/invoices/${order.id}`, {
            method: "POST",
            headers: getAuthAdminHeader(),
            body: JSON.stringify(dataToSend)
        });
    }

    async doShipment(order: any) {
        let shipmentItems: any = {};
        for (let i = 0; i < order.items.length; i++) {
            const item = order.items[i];
            shipmentItems[item.id] = {
                "1": item.qty_ordered
            }
        }
        const dataToSend = {
            "shipment": {
                "carrier_title": "DHL Shipment",
                "track_number": "12345",
                "source": 1,
                "total_qty": order.total_qty_ordered,
                "items": shipmentItems
            }
        };

        await fetch(`${API_URL_ADMIN}/sales/shipments/${order.id}`, {
            method: "POST",
            headers: getAuthAdminHeader(),
            body: JSON.stringify(dataToSend)
        });
    }

    async saveOrder(orderCsv: OrderCsv, token: string): Promise<string> {
        const dataToSend = {
            "payment": {
                "method": "cashondelivery"
            }
        };

        const res = await fetch(`${API_URL_CLIENT}/customer/checkout/save-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(dataToSend)
        });

        const resData = await res.json();
        return resData.data.order;
    }

    async savePayment(orderCsv: OrderCsv, token: string) {
        const dataToSend = {
            "payment": {
                "method": "cashondelivery"
            }
        };

        await fetch(`${API_URL_CLIENT}/customer/checkout/save-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(dataToSend)
        });
    }

    async saveShipping(orderCsv: OrderCsv, token: string) {
        const dataToSend = {
            "shipping_method": "free_free"
        };

        await fetch(`${API_URL_CLIENT}/customer/checkout/save-shipping`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(dataToSend)
        });
    }

    async saveAddress(orderCsv: OrderCsv, token: string) {
        const dataToSend = {
            "billing": {
                "address": [
                    "ya man"
                ],
                "save_as_address": false,
                "use_for_shipping": true,
                "first_name": orderCsv.client,
                "last_name": orderCsv.client,
                "email": orderCsv.client,
                "company_name": "company",
                "city": "bro city",
                "state": "bro state",
                "country": "ZW",
                "postcode": 70072,
                "phone": 9871234560
            }
        };

        await fetch(`${API_URL_CLIENT}/customer/checkout/save-address`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(dataToSend)
        });
    }

    async makeCart(orderCsv: OrderCsv, token: string) {

        if (!Array.isArray(orderCsv.achat)) {
            this.notify(`achat n'est pas encore un tableau`);
            return;
        }

        await fetch(`${API_URL_CLIENT}/customer/cart/remove`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
            })
        });

        for (let i = 0; i < orderCsv.achat.length; i++) {
            const curOrder = orderCsv.achat[i];
            const curProduct = this.dataImport.getProductBySku(curOrder?.sku ?? "");

            if (curProduct == null) {
                this.notify(`produit non trouvee lors simulation panier`);
                continue;
            }

            await fetch(`${API_URL_CLIENT}/customer/cart/add/${curProduct?.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    "product_id": curProduct?.id,
                    "is_buy_now": 0,
                    "quantity": curOrder?.qtt
                })
            });
        }
    }

    getToken(email: string): string | null {

        for (let i = 0; i < this.loginStores.length; i++) {
            const curStore = this.loginStores[i];

            if (curStore?.email == email) {
                return curStore.tokenBearer;
            }
        }

        return null;
    }

    async resetLoginStore() {
        this.loginStores = [];

        for (let i = 0; i < this.dataImport.ordersCsv.length; i++) {
            const order = this.dataImport.ordersCsv[i];
            if (!order) {
                continue;
            }
            let exist = this.getToken(order.client);
            if (exist != null) {
                continue;
            }

            const clientInfo: ClientCsv | null = this.getFileLocalInformation(order?.client);
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
            let tokenB = `Bearer ${loginResData.token}`;

            const ls: LoginStorage = {
                email: loginResData.data.email,
                tokenBearer: tokenB
            };

            this.loginStores.push(ls);
        }

    }

    getFileLocalInformation(email: string | undefined): ClientCsv | null {
        for (let i = 0; i < this.dataImport.clientsCsv.length; i++) {
            const clientCsv = this.dataImport.clientsCsv[i];

            if (clientCsv && clientCsv.email == email) {
                return clientCsv;
            }
        }
        return null;
    }

    notify(txt: string) {
        this.dataImport.notify(txt);
    }
}