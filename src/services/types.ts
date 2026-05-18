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

    // ids_products: string[] | null | undefined
}

export interface Product {
    id: string,
    name: string,
    sku: string,
    price: string,
    cost: string,
    special_price: string,
    categories: Category[]
}

export interface Customer {
    id: string,
    email: string,
    name: string,
    first_name: string,
}

export interface LoginStorage {
    email: string,
    tokenBearer: string,
}

export interface ImageZip {
    name: string;
    url: string;
    blob: Blob;
}

export interface Order {
    id: string;
    customer_email: string;
    discount_amount: string;
    discount_invoiced: string;
    discount_percent: string;
    discount_refunded: string;
    grand_total: string;
    grand_total_invoiced: string;
    grand_total_refunded: string;
    invoices: any[];
    items: OrderItem[];
    shipments: any[];
    status: string;
    status_label: string;
    sub_total: string;
    total_item_count: number;
    total_qty_ordered: number;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    product_id: string;

    grant_total: number;

    qty_canceled: number;
    qty_invoiced: number;
    qty_ordered: number;
    qty_refunded: number;
    qty_shipped: number;
    sku: string;
    total: string;
    total_invoiced: string;
    total_weight: string;

    base_grant_total: string;
    base_price: string;
    base_total: string;
    base_total_invoiced: string;
}