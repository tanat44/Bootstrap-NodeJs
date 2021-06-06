export interface BaseProduct {
    name: string;
    quantity: number;
    unit: string;
}

export interface Product extends BaseProduct {
    id: number;
}

export interface Products {
    [key: number]: Product
}