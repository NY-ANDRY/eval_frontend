import { getAuthAdminHeader } from "../hooks/useHttpRequest.js";
import { API_URL_ADMIN } from "../lib/const.js";
import type { DataImport } from "./DataImport.js";
import type { Category, Product, ProductCsv } from "./types.js";

export class ProductImport {
    dataImport: DataImport;

    constructor(dataImport: DataImport) {
        this.dataImport = dataImport;
    }

    async import() {
        const productsCsv = this.dataImport.productsCsv;
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
        let prod: Product | null = this.getProductBySku(productCsv.sku);

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

        const formData = new FormData();

        formData.append("_method", "PUT");

        formData.append("new", "1");
        formData.append("meta_description", "meta desc");
        formData.append("channel", "default");
        formData.append("special_price", String(productCsv.prix_promo));
        formData.append("meta_keywords", "meta keyword");
        formData.append("brand", "17");
        formData.append("price", String(productCsv.prix_vente));
        formData.append("name", productCsv.name);
        formData.append("cost", String(productCsv.prix_achat));
        formData.append("guest_checkout", "1");
        formData.append("featured", "1");
        formData.append("url_key", productCsv.sku);
        formData.append("status", "1");
        formData.append("visible_individually", "1");
        formData.append("weight", "10");
        formData.append("product_number", "");
        formData.append("short_description", "short desc");
        // formData.append("locale", "all"); // lasa tsy miditra n name sy description ra misy anty
        formData.append("manage_stock", "1");
        formData.append("description", "desc");
        formData.append("sku", productCsv.sku);
        formData.append("meta_title", productCsv.sku);
        formData.append("inventories[1]", String(productCsv.stock_initial));

        formData.append("categories[]", curCategories.toString());

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

    getProductBySku(sku: string): Product | null {

        for (let i = 0; i < this.dataImport.products.length; i++) {
            const element = this.dataImport.products[i];
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
        await this.dataImport.resetCategory();

        return resData.data;
    }

    getCategoryOf(productCsv: ProductCsv): Category | null {

        for (let i = 0; i < this.dataImport.categories.length; i++) {
            const category = this.dataImport.categories[i];

            if (category?.name == productCsv.Categorie) {
                return category;
            }
        }

        return null;
    }

    notify(txt: string) {
        this.dataImport.notify(txt);
    }
}
