const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FAKE_REVIEWS = [
  { customerName: "Anita Sharma", rating: 5, comment: "Absolutely authentic! The aroma of the Dhaniya powder takes me back to my grandmother's kitchen." },
  { customerName: "Rajesh Kumar", rating: 5, comment: "Best quality spices I've found online. The packaging is premium and the freshness is unbeatable." },
  { customerName: "Priya V.", rating: 4, comment: "Very vibrant color and flavor. Highly recommend the Red Chilli for that perfect spice kick!" },
  { customerName: "Chef Vikram", rating: 5, comment: "As a professional chef, I'm very picky. SOI spices have passed the test. Exceptional purity." }
];

async function boost() {
  console.log("🚀 Boosting SOI Data...");
  
  const products = await prisma.product.findMany({ include: { reviews: true } });
  
  for (const product of products) {
    const fakeOrders = 1100 + Math.floor(Math.random() * 800);
    const fakeRating = 4.8 + (Math.random() * 0.2);
    
    console.log(`Updating ${product.name}...`);
    
    // Update order count and rating
    await prisma.product.update({
      where: { id: product.id },
      data: { 
        orderCount: fakeOrders,
        rating: fakeRating
      }
    });

    // Add fake reviews if none exist
    if (product.reviews.length < 2) {
      const reviewsToCreate = FAKE_REVIEWS.sort(() => 0.5 - Math.random()).slice(0, 3);
      for (const rev of reviewsToCreate) {
        await prisma.review.create({
          data: {
            ...rev,
            productId: product.id,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
          }
        });
      }
    }
  }

  console.log("✅ Boost Complete! Products now look like they have thousands of orders and reviews.");
}

boost()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
