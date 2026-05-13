import { getAuthAdminHeader } from "../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../lib/const.js";
import type { Category, ClientCsv, OrderCsv, OrderItemCsv, Product, ProductCsv } from "./types.js";

export class DataImport {
    notify: ((txt: string) => void) = () => { };

    products: ProductCsv[] = [];
    clients: ClientCsv[] = [];
    orders: OrderCsv[] = [];

    categories: Category[] = [];
    productsCache: Product[] = [];

    constructor(productsData: any, clientsData: any, ordersData: any) {
        this.setProducts(productsData);
        this.setClients(clientsData);
        this.setOrders(ordersData);
    }

    async init() {
        await this.resetCategory();
        await this.resetProductCache();
    }

    async resetCategory() {
        let page = 1;
        this.categories = [];

        let breakk = false;
        while (!breakk) {
            breakk = true;

            const res = await fetch(`${API_URL_ADMIN}/catalog/categories?page=${page}&limit=100`,
                {
                    headers: getAuthAdminHeader()
                }
            );
            const data = await res.json();

            for (let i = 0; i < data.data.length; i++) {
                this.categories.push(data.data[i]);
            }

            if (data.data && data.data.length >= 100) {
                breakk = false;
            };
            page++;
        }
    }
    async resetProductCache() {
        let page = 1;
        this.productsCache = [];

        let breakk = false;
        while (!breakk) {
            breakk = true;

            const res = await fetch(`${API_URL_ADMIN}/catalog/products?page=${page}&limit=100`,
                {
                    headers: getAuthAdminHeader()
                }
            );
            const data = await res.json();

            for (let i = 0; i < data.data.length; i++) {
                this.productsCache.push(data.data[i]);
            }

            if (data.data && data.data.length >= 100) {
                breakk = false;
            };
            page++;
        }
    }

    async import() {
        await this.init();

        if (this.products) {
            await this.importProducts(this.products);
        }
    }

    async importProducts(productsCsv: ProductCsv[]) {
        if (productsCsv.length <= 0) {
            this.notify("aucun produit a importer");
        }
        this.notify(`import de ${productsCsv.length} produits`);

        for (let i = 0; i < productsCsv.length; i++) {
            if (productsCsv[i] != undefined) {
                await this.importProduct(productsCsv[i]);
            }
        }

        this.notify(`import de ${productsCsv.length} produits terminer`);
    }

    async importProduct(productCsv: ProductCsv | undefined): Promise<void> {
        if (!productCsv) return;
        let prod: Product | null = this.getCachedProductBySku(productCsv.sku);

        if (prod == null) {
            const p1 = await fetch(`${API_URL_ADMIN}/catalog/products`, {
                method: "POST",
                headers: getAuthAdminHeader(),
                body: JSON.stringify({
                    type: "simple",
                    attribute_family_id: 1,
                    sku: productCsv.sku
                })
            });
            const p1Data = await p1.json();
            prod = p1Data.data;
        }

        const curCategories = await this.getOrCreateCategoriesIdsOf(productCsv);

        // const formData = new FormData();
        // formData.append("_method", "_PUT");
        // formData.append("sku", productCsv.sku);
        // formData.append("name", productCsv.name);
        // formData.append("url_key", productCsv.sku);
        // formData.append("short_description", "short desc");
        // formData.append("description", "desc");
        // formData.append("price", String(productCsv.prix_vente));
        // formData.append("cost", String(productCsv.prix_achat));
        // formData.append("special_price", String(productCsv.prix_promo));
        // formData.append("categories", productCsv.Categorie);

        // const p2 = await fetch(`${API_URL_ADMIN}/catalog/products/${prod?.id}`, {
        //     method: "POST",
        //     headers: getAuthAdminHeader(),
        //     body: JSON.stringify({
        //         _method: 'PUT',
        //         sku: prod?.sku,
        //         name: productCsv.name,
        //         url_key: prod?.sku,
        //         short_description: "short desc",
        //         description: "desc",
        //         price: Number(productCsv.prix_vente),
        //         cost: Number(productCsv.prix_achat),
        //         special_price: Number(productCsv.prix_promo),
        //         categories: curCategories,
        //     })
        // });
        const formData = new FormData();

        // méthode update Laravel / Bagisto
        formData.append("_method", "PUT");

        // champs principaux
        formData.append("new", "1");
        formData.append("meta_description", "meta desc");
        formData.append("channel", "default");
        formData.append("special_price", String(productCsv.prix_promo));
        formData.append("meta_keywords", "meta keyword");
        formData.append("brand", "17");
        formData.append("price", String(productCsv.prix_vente));
        formData.append("name", productCsv.sku);
        formData.append("cost", String(productCsv.prix_achat));
        formData.append("guest_checkout", "1");
        formData.append("featured", "1");
        formData.append("url_key", productCsv.sku);
        formData.append("status", "1");
        formData.append("visible_individually", "1");
        formData.append("weight", "10");
        formData.append("product_number", "");
        formData.append("short_description", "short desc");
        formData.append("locale", "all");
        formData.append("manage_stock", "1");
        formData.append("description", "desc");
        formData.append("sku", productCsv.sku);
        formData.append("meta_title", productCsv.sku);

        // tableau categories[]
        formData.append("categories[]", "43");

        let authHeader = getAuthAdminHeader();
        await fetch(`${API_URL_ADMIN}/catalog/products/${prod?.id}`, {
            method: "POST",
            headers: {
                Authorization: authHeader.Authorization
            },
            body: formData
        })

        this.notify("produit " + productCsv.sku + " importer");
    }

    getCachedProductBySku(sku: string): Product | null {

        for (let i = 0; i < this.productsCache.length; i++) {
            const element = this.productsCache[i];
            if (element?.sku == sku) {
                return element;
            }

        }

        return null;
    }

    async getOrCreateCategoriesIdsOf(productCsv: ProductCsv): Promise<number[]> {
        const result: number[] = [];

        let ctg = this.getCategoryOf(productCsv);
        if (ctg == null) {
            ctg = await this.createCtg(productCsv.Categorie);
        }

        if (ctg) {
            result.push(Number(ctg?.id));
        }

        if (result.length <= 0) {
            this.notify("aucun category trouver pour " + productCsv.sku);
        }
        return result;
    }

    async createCtg(categorie: string): Promise<Category | null> {

        const attributes: string[] = ["11"];

        this.notify("ctg -- " + categorie);
        const reqBody = {
            locale: "all",
            name: categorie,
            position: 1,
            display_mode: "products_and_description",
            description: "category: " + categorie,
            attributes: attributes,
            slug: categorie
        };

        const res1 = await fetch(`${API_URL_ADMIN}/catalog/categories`, {
            method: "POST",
            headers: getAuthAdminHeader(),
            body: JSON.stringify(reqBody)
        });
        if (res1.status != 200) {
            this.notify("erreur creation category: " + categorie);
            return null;
        }

        const resData = await res1.json();
        await this.resetCategory();

        return resData.data;
    }

    getCategoryOf(productCsv: ProductCsv): Category | null {

        for (let i = 0; i < this.categories.length; i++) {
            const category = this.categories[i];

            if (category?.name == productCsv.Categorie) {
                return category;
            }
        }

        return null;
    }

    setNotify(notify: any) {
        this.notify = notify;
    }

    setProducts(productsData: any) {
        this.products = productsData.data;
    }

    setClients(clientsData: any) {
        this.clients = clientsData.data;
    }

    setOrders(ordersData: any) {
        this.orders = ordersData.data;

        this.orders?.forEach(order => {
            if (typeof order.achat === "string") {
                order.achat = this.makeOrderItem(order.achat);
            }
        });
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

    logState() {
        console.log("------------------ log state begin --------------------");

        console.log("this.products = " + JSON.stringify(this.products, null, 2));
        console.log("this.clients = " + JSON.stringify(this.clients, null, 2));
        console.log("this.orders = " + JSON.stringify(this.orders, null, 2));

        console.log("------------------ log state end    --------------------");
    }
}
