import { getAuthAdminHeader, getAuthClientHeader } from "../hooks/useHttpRequest.js";
import { API_URL_ADMIN, API_URL_CLIENT } from "../lib/const.js";
import type { Category, ImageZip, Product } from "./types.js";

export class DataImageImport {
    notify: ((txt: string) => void) = () => { };

    images: ImageZip[] = [];

    categories: Category[] = [];
    products: Product[] = [];

    fetchPageLimit: number = 1000;

    constructor(images: any) {
        this.images = images;
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

    async import() {
        await this.init();

        this.notify(`import d'image`);

        for (let i = 0; i < this.products.length; i++) {
            const product = this.products[i];

            if (!product) {
                continue;
            }

            this.makeProduct(product);
            const pImages: File[] = this.getImages(product);

            try {
                await this.importImageOfProduct(product, pImages);
            } catch (error) {
                this.notify(`impossible d'importer l'image du produit: ${product.sku}`);
            }
        }

        this.notify(`import d'image terminer`);
    }

    getImages(product: Product): File[] {
        const result: File[] = [];

        for (let i = 0; i < this.images.length; i++) {
            const image = this.images[i];
            if (!image) {
                continue;
            }

            let nameParts = image.name.split("/");
            let nameEndPart = nameParts[nameParts.length - 1];
            let extBegin = nameEndPart?.lastIndexOf(".");

            let name: string | undefined = "";

            if (extBegin && extBegin > 0) {
                name = nameEndPart?.substring(0, extBegin);
            } else {
                name = nameEndPart;
            }

            if (name != product.sku) {
                continue;
            }

            const res = new File([image.blob], name);

            result.push(res);
        }

        return result;
    }

    // manampy category iany lo atreto
    makeProduct(product: Product) {

        product.categories = [];

        for (let i = 0; i < this.categories.length; i++) {
            const curCategory = this.categories[i];

            if (curCategory?.ids_products == null || curCategory?.ids_products == undefined) {
                continue;
            }

            for (let j = 0; j < curCategory.ids_products.length; j++) {

                if (curCategory.ids_products[j] == product?.id) {
                    product.categories.push(curCategory.id);
                    break;
                }

            }
        }
    }

    async importImageOfProduct(product: Product, imageFiles: File[]): Promise<void> {
        if (!product) return;
        if (imageFiles.length <= 0) {
            this.notify(`aucun image trouver pour produit: ${product.sku}`);
            return;
        }

        // console.log(product);

        const formData = new FormData();

        formData.append("_method", "PUT");

        formData.append("new", "1");
        formData.append("meta_description", "meta desc");
        formData.append("channel", "default");
        if (product.special_price) {
            formData.append("special_price", String(product.special_price));
        }
        // prix promo fona n miasa ra null tony
        formData.append("special_price_from", "2000-01-01");
        formData.append("special_price_to", "2000-01-01");
        //
        formData.append("meta_keywords", "meta keyword");
        formData.append("brand", "17");
        if (product.price) {
            formData.append("price", String(product.price));
        }
        if (product.name) {
            formData.append("name", product.name);
        }
        if (product.cost) {
            formData.append("cost", String(product.cost));
        }
        formData.append("guest_checkout", "1");
        formData.append("featured", "1");
        if (product.sku) {
            formData.append("url_key", product.sku);
            formData.append("sku", product.sku);
            formData.append("meta_title", product.sku);
        }
        formData.append("status", "1");
        formData.append("visible_individually", "1");
        formData.append("weight", "10");
        formData.append("product_number", "");
        formData.append("short_description", "short desc");
        // formData.append("locale", "all"); // lasa tsy miditra n name sy description ra misy anty
        formData.append("manage_stock", "1");
        formData.append("description", "desc");
        // formData.append("inventories[1]", String(productCsv.stock_initial)); // tsy kitiana de tsy miova n stock

        if (product.categories) {
            formData.append("categories[]", product.categories.join(","));
        }

        for (let i = 0; i < imageFiles.length; i++) {
            const curFile = imageFiles[i];
            if (!curFile) {
                continue;
            }
            formData.append("images[files][]", curFile);
        }

        // for (const pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }

        let authHeader = getAuthAdminHeader();

        await fetch(`${API_URL_ADMIN}/catalog/products/${product?.id}`, {
            method: "POST",
            headers: {
                Authorization: authHeader.Authorization
            },
            body: formData
        })

        this.notify("image " + product.sku + " importer");
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

    setNotify(notify: any) {
        this.notify = notify;
    }


    logState() {
        console.log("------------------ log state begin --------------------");

        console.log("------------------ log state end    --------------------");
    }
}
