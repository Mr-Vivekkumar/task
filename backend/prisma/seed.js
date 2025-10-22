import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    console.log('Seeding database...');
    const users = [
        { email: 'admin@example.com', password: 'Admin#123' },
        { email: 'manager@example.com', password: 'Manager#123' },
        { email: 'user@example.com', password: 'User#123' },
    ];
    for (const u of users) {
        const hash = await bcrypt.hash(u.password, 10);
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: { email: u.email, passwordHash: hash },
        });
    }
    const categoryNames = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports'];
    const categories = await Promise.all(categoryNames.map((name) => prisma.category.upsert({ where: { name }, update: {}, create: { name } })));
    function randomPrice(min = 5, max = 500) {
        return Number((Math.random() * (max - min) + min).toFixed(2));
    }
    const productPrefixes = ['Ultra', 'Smart', 'Pro', 'Eco', 'Classic', 'Prime'];
    const productItems = ['Phone', 'Shoes', 'Watch', 'Lamp', 'Book', 'Ball', 'Bag', 'Headphones'];
    const productsData = Array.from({ length: 60 }, (_, i) => {
        const prefix = productPrefixes[Math.floor(Math.random() * productPrefixes.length)];
        const item = productItems[Math.floor(Math.random() * productItems.length)];
        const name = `${prefix} ${item} ${i + 1}`;
        const category = categories[Math.floor(Math.random() * categories.length)];
        return {
            name,
            image: null,
            price: randomPrice(),
            categoryId: category.id,
        };
    });
    const batchSize = 20;
    for (let i = 0; i < productsData.length; i += batchSize) {
        const batch = productsData.slice(i, i + batchSize);
        await prisma.product.createMany({ data: batch, skipDuplicates: true });
    }
    console.log('Seed complete.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map