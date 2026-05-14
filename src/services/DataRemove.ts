import { getAuthAdminHeader } from "../hooks/useHttpRequest.js";
import { API_URL_ADMIN, API_URL_CLIENT } from "../lib/const.js";
import type { Category, Customer, Product } from "./types.js";

export class DataRemove {
    notify: ((txt: string) => void) = () => { };

    categories: Category[] = [];
    products: Product[] = [];
    customers: Customer[] = [];

    fetchPageLimit: number = 1000;

    constructor() {
    }

    async init() {
        await this.resetCustomer();
        await this.resetCategory();
        await this.resetProduct();
        await this.resetCategoriesProducts();
    }

    async resetCustomer() {
        let page = 1;
        this.customers = [];

        let breakk = false;
        while (!breakk) {
            breakk = true;

            const res = await fetch(`${API_URL_ADMIN}/customers?page=${page}&limit=${this.fetchPageLimit}`,
                {
                    headers: getAuthAdminHeader()
                }
            );
            const data = await res.json();

            for (let i = 0; i < data.data.length; i++) {
                this.customers.push(data.data[i]);
            }

            if (data.data && data.data.length >= this.fetchPageLimit) {
                breakk = false;
            };
            page++;
        }
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

        await this.removeProducts();
        await this.removeCategories();

        await this.removeFromApi();

        await this.removeCustomers();
    }

    async removeFromApi() {
        this.notify(`suppression depuis api en cours`);
        await fetch(`http://127.0.0.1:3008/reset_data`, {
            method: "POST"
        });
        this.notify(`suppression depuis api terminer`);
    }

    async removeProducts() {
        const idsProducts: string[] = this.getAllProductsIds();
        if (idsProducts.length <= 0) {
            this.notify(`aucun produit a effacer`);
            return;
        }
        this.notify(`suppression des produits [${idsProducts}] en cours`);

        await fetch(`${API_URL_ADMIN}/catalog/products/mass-destroy`, {
            method: "POST",
            headers: getAuthAdminHeader(),
            body: JSON.stringify({
                indices: idsProducts
            })
        });

        this.notify(`produits [${idsProducts}] supprimer`);
    }

    getAllProductsIds(): string[] {
        const result: string[] = [];

        for (let i = 0; i < this.products.length; i++) {
            const product = this.products[i];

            if (product && product.id) {
                result.push(product.id);
            }
        }

        return result;
    }

    async removeCategories() {
        const idsCategories: string[] = this.getAllCategoriesIds();
        this.notify(`suppression des categories [${idsCategories}] en cours`);

        await fetch(`${API_URL_ADMIN}/catalog/categories/mass-destroy`, {
            method: "POST",
            headers: getAuthAdminHeader(),
            body: JSON.stringify({
                indices: idsCategories
            })
        });

        this.notify(`categories [${idsCategories}] supprimer`);
    }

    getAllCategoriesIds(): string[] {
        const result: string[] = [];

        for (let i = 0; i < this.categories.length; i++) {
            const category = this.categories[i];

            if (category && category.id) {
                result.push(category.id);
            }
        }

        return result;
    }

    async removeCustomers() {
        const idsCustomers: string[] = this.getAllCutomersIds();
        if (idsCustomers.length <= 0) {
            this.notify(`aucun client a effacer`);
            return;
        }
        this.notify(`suppression des clients [${idsCustomers}] en cours`);

        await fetch(`${API_URL_ADMIN}/customers/mass-destroy`, {
            method: "POST",
            headers: getAuthAdminHeader(),
            body: JSON.stringify({
                indices: idsCustomers
            })
        });

        this.notify(`clients [${idsCustomers}] supprimer`);
    }

    getAllCutomersIds(): string[] {
        const result: string[] = [];

        for (let i = 0; i < this.customers.length; i++) {
            const customer = this.customers[i];

            if (customer && customer.id) {
                result.push(customer.id);
            }
        }

        return result;
    }

    setNotify(notify: any) {
        this.notify = notify;
    }


    logState() {
        console.log("------------------ log state begin --------------------");

        console.log("------------------ log state end    --------------------");
    }
}
