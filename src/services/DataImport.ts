import { getAuthAdminHeader } from "../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../lib/const.js";
import { ClientImport } from "./ClientImport.js";
import { OrderImport } from "./OrderImport.js";
import { ProductImport } from "./ProductImport.js";
import type { Category, ClientCsv, OrderCsv, OrderItemCsv, Product, ProductCsv } from "./types.js";

export class DataImport {
    notify: ((txt: string) => void) = () => { };

    productsCsv: ProductCsv[] = [];
    clientsCsv: ClientCsv[] = [];
    ordersCsv: OrderCsv[] = [];

    categories: Category[] = [];
    products: Product[] = [];

    productImport: ProductImport;
    clientImport: ClientImport;
    orderImport: OrderImport;

    importProduct: boolean = true;
    importClient: boolean = true;
    importOrder: boolean = true;

    fetchPageLimit: number = 1000;

    constructor(productsData: any, clientsData: any, ordersData: any) {
        this.setProducts(productsData);
        this.setClients(clientsData);
        this.setOrders(ordersData);

        this.productImport = new ProductImport(this);
        this.clientImport = new ClientImport(this);
        this.orderImport = new OrderImport(this);
    }

    async init() {
        await this.resetCategory();
        await this.resetProduct();
    }

    async resetCategory() {
        let page = 1;
        this.categories = [];

        let breakk = false;
        while (!breakk) {
            breakk = true;

            const res = await fetch(`${API_URL_ADMIN}/catalog/categories?page=${page}&limit=${this.fetchPageLimit}`,
                {
                    headers: getAuthAdminHeader()
                }
            );
            const data = await res.json();

            for (let i = 0; i < data.data.length; i++) {
                this.categories.push(data.data[i]);
            }

            if (data.data && data.data.length >= this.fetchPageLimit) {
                breakk = false;
            };
            page++;
        }
    }
    async resetProduct() {
        let page = 1;
        this.products = [];

        let breakk = false;
        while (!breakk) {
            breakk = true;

            const res = await fetch(`${API_URL_ADMIN}/catalog/products?page=${page}&limit=${this.fetchPageLimit}`,
                {
                    headers: getAuthAdminHeader()
                }
            );
            const data = await res.json();

            for (let i = 0; i < data.data.length; i++) {
                this.products.push(data.data[i]);
            }

            if (data.data && data.data.length >= this.fetchPageLimit) {
                breakk = false;
            };
            page++;
        }
    }

    async import() {
        await this.init();

        if (this.productsCsv && this.importProduct) {
            try {
                await this.productImport.import();
            } catch (error) {
                this.notify(`erreur import produit`);
                console.log(error);
            }
        }
        if (this.clientImport && this.importClient) {
            try {
                await this.clientImport.import();
            } catch (error) {
                this.notify(`erreur import client`);
                console.log(error);
            }
        }
        if (this.orderImport && this.importOrder) {
            try {
                await this.orderImport.import();
            } catch (error) {
                this.notify(`erreur import orders`);
                console.log(error);
            }
        }

    }

    setNotify(notify: any) {
        this.notify = notify;
    }

    setProducts(productsData: any) {
        let curProducts = productsData.data;

        if (curProducts.length <= 0) {
            throw new Error(`aucun produit trouver`);
        }

        const expectedKeys = [
            "type",
            "sku",
            "name",
            "Categorie",
            "prix_vente",
            "prix_achat",
            "prix_promo",
            "stock_initial"
        ];

        this.checkKeys(expectedKeys, curProducts[0], "products");

        const toBePositif = [
            "prix_vente",
            "prix_achat",
            "prix_promo",
            "stock_initial"
        ];

        this.checkPositifValue(curProducts, toBePositif);

        this.productsCsv = curProducts;
    }

    setClients(clientsData: any) {
        let curClients = clientsData.data;

        if (curClients.length <= 0) {
            throw new Error(`aucun produit trouver`);
        }

        const expectedKeys = [
            "nom",
            "prenom",
            "email",
            "pwd"
        ];

        this.checkKeys(expectedKeys, curClients[0], "client");

        this.clientsCsv = curClients;
    }

    setOrders(ordersData: any) {
        let curOrders = ordersData.data;

        if (curOrders.length <= 0) {
            throw new Error(`aucun produit trouver`);
        }

        const expectedKeys = [
            "date",
            "heure",
            "client",
            "achat",
            "status"
        ];

        this.checkKeys(expectedKeys, curOrders[0], "orders");

        this.ordersCsv = curOrders;

        this.ordersCsv?.forEach(order => {

            this.checkDateFormat(order.date);

            if (typeof order.achat === "string") {
                // order.achat = this.makeOrderItem(order.achat);
                // order.achat = this.makeOrderItemIteration(order.achat);
                order.achat = this.makeOrderItemToJson(order.achat);
            }
        });
    }

    checkPositifValue(object: any[], keys: string[]) {
        object.forEach((obj, obj_index) => {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (!key) {
                    throw new Error(`cle vide: ${key}`);
                }
                const val = Number(obj[key]);
                if (val < 0) {
                    throw new Error(`${key} doit etre toujour positif: ${val} => index: ${obj_index}`);
                    
                }
            }
        })
    }

    checkDateFormat(date: string) {
        const parts = date.split("/");

        if (
            parts.length !== 3 ||
            parts[0]?.length !== 2 ||
            parts[1]?.length !== 2 ||
            parts[2]?.length !== 4
        ) {
            throw new Error(`format de date invalide: DD/MM/YYYY -> ${date}`);
        }

        const day = Number(parts[0]);
        const month = Number(parts[1]);
        const year = Number(parts[2]);

        if (
            isNaN(day) || isNaN(month) || isNaN(year) ||
            day < 1 || day > 31 || month < 1 || month > 12
        ) {
            throw new Error(`format de date invalide: DD/MM/YYYY -> ${date}`);
        }
    }

    checkKeys(expectedKeys: string[], object: any, dataName: string = "data") {
        const keys = Object.keys(object);

        for (let i = 0; i < expectedKeys.length; i++) {
            if (keys[i] !== expectedKeys[i]) {
                throw new Error(
                    `${dataName}: colonne ${i} non valide: ${expectedKeys[i]} -> ${keys[i]}`
                );
            }
        }
    }

    // stringOrderItem: {["sk-l";1],["sk-m";2]}
    makeOrderItem(stringOrderItem: string): OrderItemCsv[] {
        const result: OrderItemCsv[] = [];

        let begin = stringOrderItem.indexOf('[');
        let end = stringOrderItem.indexOf(']');
        let rest = stringOrderItem;

        while (begin >= 0 && end >= 0) {
            let txt = rest.substring(begin, end + 1); // txt: ["sk-l";1]

            txt = txt.slice(1, txt.length - 1); // txt: "sk-l";1

            let parts = txt.split(";"); // parts: ['"sk-l"', '1']

            let sku = parts[0]?.substring(1, parts[0].length - 1) ?? ""; //sku: 'sk-l'
            let qtt = Number(parts[1]); // qtt: 1
            const orderItem: OrderItemCsv = {
                sku: sku,
                qtt: qtt
            };
            result.push(orderItem);

            rest = rest.slice(end + 1, rest.length);
            begin = rest.indexOf('[');
            end = rest.indexOf(']');
        }

        return result;
    }

    // stringOrderItem: {["sk-l";1],["sk-m";2]}
    // rehefa manamoly n doneee
    makeOrderItemIteration(stringOrderItem: string): OrderItemCsv[] {
        const result: OrderItemCsv[] = [];

        let leftChar = "[";
        let rightChar = "]";
        let ileft = null;
        let iright = null;
        let insideOfString = false;
        let stringBegin = '"';

        for (let i = 0; i < stringOrderItem.length; i++) {
            const char = stringOrderItem[i];

            if (insideOfString) {
                if (char == stringBegin) {
                    insideOfString = false;
                }
                continue;
            }

            if (char == stringBegin) {
                insideOfString = true;
                continue;
            }
            if (char == leftChar) {
                ileft = i;
            }
            if (ileft != null && char == rightChar) {
                iright = i;
            }

            if (ileft != null && iright != null) {
                //
                let txt = stringOrderItem.substring(ileft, iright + 1); // txt: ["sk-l";1]

                txt = txt.slice(1, txt.length - 1); // txt: "sk-l";1

                let parts = txt.split(";"); // parts: ['"sk-l"', '1']

                let sku = parts[0]?.substring(1, parts[0].length - 1) ?? ""; //sku: 'sk-l'
                let qtt = Number(parts[1]); // qtt: 1
                const orderItem: OrderItemCsv = {
                    sku: sku,
                    qtt: qtt
                };
                result.push(orderItem);
                // 
                ileft = null;
                iright = null;
            }

        }

        return result;
    }


    // stringOrderItem: {["sk-l";1],["sk-m";2]}
    makeOrderItemToJson(stringOrderItem: string): OrderItemCsv[] {
        const result: OrderItemCsv[] = [];

        let newStr = stringOrderItem;
        if (newStr.startsWith("{") && newStr.endsWith("}")) {
            newStr = newStr.substring(1, newStr.length - 1);
        }
        newStr = newStr.replaceAll(";", ":");
        newStr = newStr.replaceAll("[", "{");
        newStr = newStr.replaceAll("]", "}");

        let jsonValue = JSON.parse(`[${newStr}]`);
        console.log(jsonValue);


        jsonValue.forEach((el: any) => {
            const keys = Object.keys(el);
            if (keys.length <= 0) {
                return;
            }
            const key = keys[0];
            const value = el[key ?? ""];

            result.push({
                sku: key ?? "",
                qtt: value ?? 0
            });
        });

        console.log(result);


        return result;
    }

    getProductBySku(sku: string): Product | null {

        for (let i = 0; i < this.products.length; i++) {
            const element = this.products[i];
            if (element?.sku == sku) {
                return element;
            }
        }

        return null;
    }

    logState() {
        console.log("------------------ log state begin --------------------");

        console.log("this.products = " + JSON.stringify(this.productsCsv, null, 2));
        console.log("this.clients = " + JSON.stringify(this.clientsCsv, null, 2));
        console.log("this.orders = " + JSON.stringify(this.ordersCsv, null, 2));

        console.log("------------------ log state end    --------------------");
    }
}
