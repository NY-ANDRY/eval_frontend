import { getAuthAdminHeader } from "../hooks/useHttpRequest.js";
import { API_URL_ADMIN, API_URL_CLIENT } from "../lib/const.js";
import type { Category, Product } from "./types.js";

export class DataRemove {
    notify: ((txt: string) => void) = () => { };

    categories: Category[] = [];
    products: Product[] = [];

    fetchPageLimit: number = 1000;

    constructor() {
    }

    async init() {
        await this.resetCategory();
        await this.resetProduct();
        await this.resetCategoriesProducts();
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

    async resetCategoriesProducts() {
        for (let i = 0; i < this.categories.length; i++) {
            const category = this.categories[i]
            if (!category) {
                continue;
            }

            await this.resetCategoryProduct(category);
        }
    }

    async resetCategoryProduct(category: Category) {
        let page = 1;

        let breakk = false;
        while (!breakk) {
            breakk = true;

            const pRes = await fetch(`${API_URL_CLIENT}/products?category_id=${category?.id}&page=${page}&limit=${this.fetchPageLimit}`);
            const pResData = await pRes.json();

            category.ids_products = [];
            for (let j = 0; j < pResData.data.length; j++) {
                category.ids_products.push(pResData.data[j].id);
            }

            if (pResData.data && pResData.data.length >= this.fetchPageLimit) {
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

    async remove() {
        await this.init();

    }

    setNotify(notify: any) {
        this.notify = notify;
    }


    logState() {
        console.log("------------------ log state begin --------------------");

        console.log("------------------ log state end    --------------------");
    }
}
