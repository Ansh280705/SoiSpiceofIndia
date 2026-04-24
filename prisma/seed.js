import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const DEFAULT_PRODUCTS = [
  {
    name: "Red Chilli Powder",
    description: "Pure, vibrant, and ethically sourced. No artificial colors. Sourced from Bediya – Asia's 2nd largest chilli hub.",
    category: "Pure Spices",
    image: null,
    imageKey: "red_chilli_signature",
    accent: "#a52a2a",
    prices: { "50g": 25, "100g": 45, "250g": 120 },
  },
  {
    name: "Turmeric Powder",
    description: "Golden purity with high curcumin content. GI-tagged Erode Turmeric – Natural health in every pinch.",
    category: "Pure Spices",
    image: null,
    imageKey: "turmeric_signature",
    accent: "#d2691e",
    prices: { "50g": 25, "100g": 45, "250g": 130 },
  },
  {
    name: "Coriander Powder",
    description: "Fragrant and earthy. Sourced from Kumbhraj – processed to keep the natural aroma intact.",
    category: "Pure Spices",
    image: null,
    imageKey: "coriander_signature",
    accent: "#e6b800",
    prices: { "50g": 20, "100g": 40, "250g": 90 },
  },
];

async function main() {
  console.log('Seeding products...');
  for (const product of DEFAULT_PRODUCTS) {
    // Check if product already exists to avoid duplicates during multiple seeds
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  console.log('Seeding admin...');
  const adminEmail = "admin@soi.com";
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: "soi@admin2024", // Note: In production, hash this!
      }
    });
    console.log('Admin user created.');
  } else {
    console.log('Admin user already exists.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
