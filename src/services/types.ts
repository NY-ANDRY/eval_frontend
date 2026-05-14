export interface ProductCsv {
    type: string;
    sku: string;
    name: string;
    Categorie: string;
    prix_vente: number;
    prix_achat: number;
    prix_promo: number;
    stock_initial: number;
}

export interface ClientCsv {
    nom: string;
    prenom: string;
    email: string;
    pwd: string;
}

export interface OrderItemCsv {
    sku: string;
    qtt: number;
}

export interface OrderCsv {
    date: string;
    heure: string;
    client: string;
    achat: OrderItemCsv[] | string;
    status: string;
}

export interface Category {
    id: string,
    name: string,
    slug: string,
    display_mode: string,
    description: string,
    status: string,
    created_at: string,
    updated_at: string,

    ids_products: string[] | null | undefined
}

export interface Product {
    id: string,
    name: string,
    sku: string,
    price: string,
    cost: string,
    special_price: string,
    categories: string[]
}

export interface Customer {
    id: string,
    email: string,
    name: string,
    first_name: string,
}

export interface LoginStorage {
    email: string,
    token: string,
}

export interface ImageZip {
    name: string;
    url: string;
    blob: Blob;
}