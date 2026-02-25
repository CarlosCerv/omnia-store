"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
    slug: string;
    name: string;
    price: number;
    image: string;
    color: string;
    size: string;
    quantity: number;
}

interface CartContextValue {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (slug: string, color: string, size: string) => void;
    updateQuantity: (slug: string, color: string, size: string, quantity: number) => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find(
                (i) => i.slug === item.slug && i.color === item.color && i.size === item.size
            );
            if (existing) {
                return prev.map((i) =>
                    i === existing ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsOpen(true);
    };

    const removeFromCart = (slug: string, color: string, size: string) => {
        setItems((prev) => prev.filter((i) => !(i.slug === slug && i.color === color && i.size === size)));
    };

    const updateQuantity = (slug: string, color: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(slug, color, size);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.slug === slug && i.color === color && i.size === size ? { ...i, quantity } : i))
        );
    };

    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                openCart: () => setIsOpen(true),
                closeCart: () => setIsOpen(false),
                addToCart,
                removeFromCart,
                updateQuantity,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
