import { Promotion } from "@/types";

export const PROMOTIONS: Promotion[] = [
    {
        id: 'promo-1',
        title: 'Colección de Archivo 2026',
        description: 'Descubre las piezas definitivas del minimalismo moderno.',
        image: '/images/products/signature-black-orig.png',
        active: true,
        type: 'hero',
        ctaText: 'Ver Ahora',
        ctaLink: '/productos'
    },
    {
        id: 'announcement-bar',
        title: 'Envío Gratis en Pedidos Superiores a $3,500 MXN',
        description: '',
        image: '',
        active: true,
        type: 'bar'
    }
];
