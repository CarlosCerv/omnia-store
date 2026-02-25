import { PrismaClient } from '@prisma/client'
import { PRODUCTS } from '../src/lib/products'
import { PROMOTIONS } from '../src/lib/promotions'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Seed Products
    console.log('📦 Seeding products...')
    for (const p of PRODUCTS) {
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: {
                name: p.name,
                price: p.price,
                category: p.category,
                image: p.image,
                images: p.images,
                description: p.description,
                badge: p.badge,
                colors: p.colors as any,
                sizes: p.sizes,
            },
            create: {
                slug: p.slug,
                name: p.name,
                price: p.price,
                category: p.category,
                image: p.image,
                images: p.images,
                description: p.description,
                badge: p.badge,
                colors: p.colors as any,
                sizes: p.sizes,
            },
        })
    }

    // Seed Promotions
    console.log('📢 Seeding promotions...')
    for (const promo of PROMOTIONS) {
        // Assuming type matches our schema 'hero', 'bar', 'card'
        await prisma.promotion.create({
            data: {
                title: promo.title,
                description: promo.description,
                image: promo.image,
                active: promo.active,
                type: promo.type,
                ctaText: promo.ctaText,
                ctaLink: promo.ctaLink,
            }
        })
    }

    console.log('✅ Seed completed successfully.')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
