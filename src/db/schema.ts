import {
  pgTable,
  serial,
  text,
  numeric,
  boolean,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  nameEn: text('name_en').notNull(),
  nameAr: text('name_ar').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  nameEn: text('name_en').notNull(),
  nameAr: text('name_ar').notNull(),
  descriptionEn: text('description_en'),
  descriptionAr: text('description_ar'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  image: text('image'),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  author: text('author').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Cart Items
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: integer('quantity').notNull().default(1),
});

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone'),
  status: text('status').notNull().default('pending'),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'set null' }),
  quantity: integer('quantity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

// Feature Settings
export const featureSettings = pgTable('feature_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  enabled: boolean('enabled').notNull().default(true),
});

// Wishlist
export const wishlistItems = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
