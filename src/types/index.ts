/**
 * OMNIA Core Type Definitions
 */

export interface Product {
    slug: string;
    name: string;
    price: number;
    category: string;
    image: string;
    images: string[];
    description: string;
    badge?: string;
    colors: Color[];
    sizes: string[];
}

export interface Color {
    name: string;
    hex: string;
    border?: boolean;
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    image: string;
    active: boolean;
    type: 'hero' | 'bar' | 'card';
    ctaText?: string;
    ctaLink?: string;
}

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    date: string;
    total: number;
    status: 'Pendiente' | 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado';
    items: OrderItem[];
}

export interface OrderItem {
    productSlug: string;
    productName: string;
    quantity: number;
    price: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    totalOrders: number;
    totalSpent: number;
    joined: string;
}
