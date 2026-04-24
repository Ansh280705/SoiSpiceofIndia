import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Authentication ────────────────────────────────────────────────────────

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ success: true, email: admin.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Products ──────────────────────────────────────────────────────────────

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { reviews: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Reviews ────────────────────────────────────────────────────────────────

app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const { rating, comment, customerName } = req.body;
    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        customerName,
        productId: req.params.id
      }
    });

    // Update product average rating
    const productReviews = await prisma.review.findMany({
      where: { productId: req.params.id }
    });
    const avgRating = productReviews.reduce((a, b) => a + b.rating, 0) / productReviews.length;

    await prisma.product.update({
      where: { id: req.params.id },
      data: { rating: avgRating }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/reviews/:id/reply', async (req, res) => {
  try {
    const { adminReply } = req.body;
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { adminReply }
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {

  try {
    const review = await prisma.review.delete({ where: { id: req.params.id } });
    
    // Recalculate rating
    const productReviews = await prisma.review.findMany({
      where: { productId: review.productId }
    });
    const avgRating = productReviews.length > 0 
      ? productReviews.reduce((a, b) => a + b.rating, 0) / productReviews.length 
      : 0;

    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: avgRating }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Orders ────────────────────────────────────────────────────────────────

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = await prisma.order.create({
      data: {
        ...req.body,
        orderNumber: `SOI-${Math.floor(100000 + Math.random() * 900000)}`
      }
    });

    // Increment order count for products
    const cart = req.body.cart || [];
    for (const item of cart) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { orderCount: { increment: item.quantity } }
        });
      }
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

