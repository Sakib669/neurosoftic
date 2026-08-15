# 🎯 Neurosoftic Project - Complete Structure & Architecture

## 📋 Project Overview

**Neurosoftic** is a **full-stack, enterprise-grade e-commerce platform** built with **Next.js 16** (App Router), **Prisma ORM**, **PostgreSQL**, and **NextAuth.js v5-beta**. It's a comprehensive B2C marketplace with multi-role admin capabilities (9 roles), advanced inventory management, payment integration, shipping automation, and content management system.

### Technology Stack
- **Framework**: Next.js 16.3.0 (App Router, Server Components)
- **Frontend**: React 19.2.8, TailwindCSS 4.3.3, Base UI 1.7.0
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL + Prisma ORM 7.9.1
- **Authentication**: NextAuth.js v5.0.0-beta.32 (Credentials, OAuth ready)
- **State Management**: Zustand 5.0.14
- **Form Management**: React Hook Form 7.85.0
- **Data Validation**: Zod 4.4.3
- **Payment Gateway**: SSLCommerz (Bangladesh)
- **Shipping Provider**: Steadfast API (Bangladesh courier)
- **Media Management**: Cloudinary SDK 2.10.0
- **Charts & Analytics**: Recharts 3.10.1
- **UI Components**: Shadcn UI (custom integration with Base UI)
- **HTTP Client**: Axios 1.19.0
- **Password Hashing**: bcryptjs 3.0.3
- **Barcode Generation**: bwip-js 4.11.2
- **PDF Generation**: pdfkit 0.19.1
- **Query Management**: TanStack React Query 5.101.4
- **Animation**: Framer Motion 13.1.0
- **Date Utilities**: date-fns 4.4.0
- **Database Adapter**: Prisma Adapter for PostgreSQL 7.9.1

---

## 📁 Project Folder Structure

```
neurosoftic/
├── src/
│   ├── app/                                    # Next.js 16 App Router
│   │   ├── layout.tsx                         # Root layout wrapper
│   │   ├── page.tsx                           # Landing/home page
│   │   ├── globals.css                        # Global TailwindCSS styles
│   │
│   │   ├── (storefront)/                       # Route group: Customer-facing pages
│   │   │   ├── layout.tsx                     # Storefront layout (Header, Footer)
│   │   │   ├── page.tsx                       # Storefront homepage
│   │   │   ├── cart/
│   │   │   │   └── page.tsx                   # Shopping cart page
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx                   # Checkout flow
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                   # Product listing with filters
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx               # Product details page
│   │   │   ├── search/
│   │   │   │   └── page.tsx                   # Search results page
│   │   │   └── wishlist/
│   │   │       └── page.tsx                   # Wishlist page
│   │
│   │   ├── account/                            # Route group: Customer account (Protected)
│   │   │   ├── layout.tsx                     # Account sidebar layout
│   │   │   ├── page.tsx                       # Account dashboard
│   │   │   ├── profile/
│   │   │   │   └── page.tsx                   # Edit profile
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                   # Order history
│   │   │   │   └── [orderNumber]/
│   │   │   │       └── page.tsx               # Order details & tracking
│   │   │   ├── address/
│   │   │   │   └── page.tsx                   # Manage addresses
│   │   │   └── wishlist/
│   │   │       └── page.tsx                   # Wishlist management
│   │
│   │   ├── admin/                              # Route group: Admin dashboard (Protected)
│   │   │   ├── layout.tsx                     # Admin sidebar layout
│   │   │   ├── page.tsx                       # Admin dashboard & KPIs
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                   # Product list (table)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx               # Create new product
│   │   │   │   └── [productId]/
│   │   │   │       ├── page.tsx               # View product
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx           # Edit product
│   │   │   │       └── variants/
│   │   │   │           └── page.tsx           # Manage variants
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                   # Order management
│   │   │   │   └── [orderNumber]/
│   │   │   │       └── page.tsx               # Order fulfillment details
│   │   │   ├── users/
│   │   │   │   └── page.tsx                   # User management & roles
│   │   │   ├── inventory/
│   │   │   │   └── page.tsx                   # Stock management & adjustments
│   │   │   ├── reports/
│   │   │   │   └── page.tsx                   # Sales analytics & KPIs
│   │   │   ├── audit-logs/
│   │   │   │   └── page.tsx                   # Admin action audit trail
│   │   │   ├── cms/
│   │   │   │   └── page.tsx                   # Homepage content builder
│   │   │   └── settings/
│   │   │       └── page.tsx                   # Theme & branding customization
│   │
│   │   ├── auth/                               # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx                   # Login form
│   │   │   ├── register/
│   │   │   │   └── page.tsx                   # Registration form
│   │   │   └── error/
│   │   │       └── page.tsx                   # Auth error page
│   │
│   │   └── api/                                # REST API Routes
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts               # NextAuth endpoints (login, callback, logout)
│   │       │
│   │       ├── account/                       # Customer account endpoints (Protected)
│   │       │   ├── profile/
│   │       │   │   ├── route.ts               # GET/PATCH profile
│   │       │   │   └── [...methods]/          # Explicit method handlers
│   │       │   ├── addresses/
│   │       │   │   ├── route.ts               # GET/POST addresses
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts           # PATCH/DELETE address
│   │       │   └── wishlist/
│   │       │       ├── route.ts               # GET/POST/DELETE wishlist
│   │       │       └── [variantId]/
│   │       │           └── route.ts           # Toggle wishlist item
│   │       │
│   │       ├── admin/                         # Admin-only endpoints (Protected)
│   │       │   ├── users/
│   │       │   │   └── route.ts               # GET/PATCH users, update roles
│   │       │   ├── products/
│   │       │   │   ├── route.ts               # GET/POST products
│   │       │   │   └── [id]/
│   │       │   │       ├── route.ts           # PATCH/DELETE product
│   │       │   │       └── variants/
│   │       │   │           └── route.ts       # POST variant
│   │       │   ├── variants/
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts           # PATCH/DELETE variant
│   │       │   ├── orders/
│   │       │   │   ├── route.ts               # GET orders
│   │       │   │   └── [id]/
│   │       │   │       ├── status/
│   │       │   │       │   └── route.ts       # PATCH order status
│   │       │   │       └── shipment/
│   │       │   │           └── route.ts       # POST create shipment
│   │       │   ├── inventory/
│   │       │   │   ├── route.ts               # GET inventory
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts           # PATCH adjust stock
│   │       │   ├── theme/
│   │       │   │   └── route.ts               # GET/PATCH/POST theme config
│   │       │   ├── audit-logs/
│   │       │   │   └── route.ts               # GET audit logs
│   │       │   └── reports/
│   │       │       └── route.ts               # GET analytics data
│   │       │
│   │       ├── orders/
│   │       │   ├── route.ts                   # POST create order
│   │       │   └── [id]/
│   │       │       └── route.ts               # GET order (protected)
│   │       │
│   │       ├── payment/
│   │       │   ├── initiate/
│   │       │   │   └── route.ts               # POST start payment (SSLCommerz)
│   │       │   └── callback/
│   │       │       └── route.ts               # POST payment webhook (SSLCommerz callback)
│   │       │
│   │       ├── search/
│   │       │   └── route.ts                   # GET/POST full-text search
│   │       │
│   │       └── upload/
│   │           └── route.ts                   # POST file upload (Cloudinary)
│   │
│   ├── components/                             # Reusable React Components
│   │   │
│   │   ├── ui/                                # Shadcn UI base components (20+)
│   │   │   ├── accordion.tsx                  # Collapsible sections
│   │   │   ├── avatar.tsx                     # User avatars
│   │   │   ├── badge.tsx                      # Labels & tags
│   │   │   ├── button.tsx                     # CTAs
│   │   │   ├── card.tsx                       # Container
│   │   │   ├── checkbox.tsx                   # Checkbox input
│   │   │   ├── dialog.tsx                     # Modal dialog
│   │   │   ├── dropdown-menu.tsx              # Dropdown actions
│   │   │   ├── input.tsx                      # Text input
│   │   │   ├── label.tsx                      # Form label
│   │   │   ├── select.tsx                     # Dropdown select
│   │   │   ├── separator.tsx                  # Visual divider
│   │   │   ├── sheet.tsx                      # Side drawer
│   │   │   ├── skeleton.tsx                   # Loading placeholder
│   │   │   ├── slider.tsx                     # Range slider
│   │   │   ├── switch.tsx                     # Toggle switch
│   │   │   ├── table.tsx                      # Data table
│   │   │   ├── tabs.tsx                       # Tab navigation
│   │   │   └── toast.tsx                      # Notification toast
│   │   │
│   │   ├── admin/                             # Admin-specific components
│   │   │   ├── Sidebar.tsx                    # Admin navigation with role-based menu
│   │   │   ├── ProductForm.tsx                # Create/edit product form (wrapper)
│   │   │   ├── ImageUpload.tsx                # Cloudinary image uploader
│   │   │   └── EditProductForm.tsx            # Product edit form variant
│   │   │
│   │   ├── shared/                            # Shared across storefront & account
│   │   │   ├── Header.tsx                     # Top navigation bar with search
│   │   │   ├── CartIcon.tsx                   # Cart badge (mini cart trigger)
│   │   │   ├── WishlistIcon.tsx               # Wishlist heart icon
│   │   │   ├── CartView.tsx                   # Cart drawer/modal content
│   │   │   ├── SignOutButton.tsx              # Logout button
│   │   │   └── Footer.tsx                     # Footer with links
│   │   │
│   │   ├── storefront/                        # Customer-facing components
│   │   │   ├── ProductCard.tsx                # Product tile/card
│   │   │   └── sections/                      # Homepage section components
│   │   │       ├── HeroSection.tsx            # Banner/hero
│   │   │       ├── CategoryGrid.tsx           # Category showcase
│   │   │       └── ProductCarousel.tsx        # Product slider
│   │   │
│   │   └── sign-in.tsx                        # Sign-in form component
│   │
│   ├── lib/                                   # Utility functions & business logic
│   │   ├── db.ts                              # Prisma client singleton
│   │   ├── utils.ts                           # Helper utilities (classNames, formatting)
│   │   ├── hash.ts                            # Password hashing (bcryptjs)
│   │   ├── password.ts                        # Password verification
│   │   ├── barcode.ts                         # Barcode generation (bwip-js)
│   │   ├── cloudinary.ts                      # Cloudinary SDK initialization
│   │   ├── theme.ts                           # Theme utilities
│   │   ├── zod.ts                             # Zod schema utilities
│   │   │
│   │   ├── actions/                           # Server Actions
│   │   │   └── auth.ts                        # Auth server actions (registration, login)
│   │   │
│   │   ├── services/                          # Business logic layer (16 services)
│   │   │   ├── adminService.ts                # Admin operations (users, stats, dashboard)
│   │   │   ├── productService.ts              # Product CRUD & creation
│   │   │   ├── variantService.ts              # Product variant management
│   │   │   ├── inventoryService.ts            # Stock management & adjustments
│   │   │   ├── orderService.ts                # Order creation & customer operations
│   │   │   ├── orderAdminService.ts           # Order management (admin view/fulfillment)
│   │   │   ├── customerService.ts             # Customer profile & address operations
│   │   │   ├── paymentService.ts              # Payment processing & webhooks
│   │   │   ├── courierService.ts              # Shipping integration & tracking
│   │   │   ├── searchService.ts               # Full-text product search
│   │   │   ├── reportService.ts               # Analytics & KPI aggregation
│   │   │   ├── auditService.ts                # Admin action logging
│   │   │   ├── cmsService.ts                  # Homepage sections management
│   │   │   ├── themeService.ts                # Theme configuration CRUD
│   │   │   ├── wishlistService.ts             # Wishlist operations
│   │   │   └── homepageService.ts             # Homepage data aggregation
│   │   │
│   │   ├── providers/                         # Third-party integrations
│   │   │   ├── paymentProvider.ts             # Payment gateway interface (abstract)
│   │   │   ├── sslcommerz.ts                  # SSLCommerz implementation
│   │   │   ├── courierProvider.ts             # Courier interface (abstract)
│   │   │   └── steadfast.ts                   # Steadfast API implementation
│   │   │
│   │   ├── validators/                        # Zod validation schemas
│   │   │   └── product.ts                     # Product & variant validation
│   │   │
│   │   └── store/                             # Client-side state (Zustand)
│   │       ├── cart.ts                        # Cart store (persisted to localStorage)
│   │       └── wishlist.ts                    # Guest wishlist store (persisted)
│   │
│   └── generated/                             # Auto-generated files
│       └── prisma/
│           ├── browser.ts                     # Prisma client for browser
│           ├── client.ts                      # Prisma client for Node.js
│           ├── commonInputTypes.ts            # Input type definitions
│           ├── enums.ts                       # Database enums
│           ├── models.ts                      # Model type definitions
│           ├── internal/                      # Prisma internals
│           └── models/                        # Model-specific types
│
├── prisma/
│   ├── schema.prisma                          # Complete database schema (19 core models + 5 supporting)
│   ├── seed.ts                                # Database seeding script
│   ├── car-seed.ts                            # Car/product demo data
│   └── migrations/
│       ├── migration_lock.toml                # Migration lock file
│       ├── 20260812192233_init/
│       │   └── migration.sql                  # Initial schema migration
│       └── 20260814111826_add_search_index/
│           └── migration.sql                  # Full-text search index migration
│
├── public/                                    # Static assets
│   └── [Static files, favicons, etc.]
│
├── Configuration Files
├── package.json                               # NPM dependencies & scripts
├── tsconfig.json                              # TypeScript configuration
├── next.config.ts                             # Next.js configuration
├── auth.ts                                    # NextAuth.js configuration (Credentials & OAuth)
├── postcss.config.mjs                         # PostCSS configuration
├── tailwind.config.mjs                        # TailwindCSS v4 configuration
├── eslint.config.mjs                          # ESLint configuration
├── components.json                            # Shadcn component registry
├── prisma.config.ts                           # Prisma client options
├── proxy.ts                                   # Proxy configuration (if needed)
├── .env.local                                 # Environment variables (not tracked)
├── .gitignore
│
├── Documentation
├── PROJECT_STRUCTURE.md                       # This file
├── README.md                                  # Project README
├── AGENTS.md                                  # Custom agent definitions
└── CLAUDE.md                                  # Claude model preferences
```

### Key Structural Decisions

1. **App Router with Route Groups**: Using Next.js 16 route groups `(storefront)`, `(admin)`, `(account)` for better organization
2. **API Routes Organization**: Nested routes following resource hierarchy `/api/[resource]/[id]/[action]`
3. **Service Layer Pattern**: Business logic isolated in services, reusable across API routes
4. **Provider Pattern**: Third-party integrations abstracted behind interfaces (PaymentProvider, CourierProvider)
5. **Zustand for State**: Client-side cart and wishlist with localStorage persistence
6. **Prisma Transactions**: Multi-step operations (order creation, inventory reservation) wrapped in transactions
7. **Type Safety**: Full TypeScript coverage with Zod validation at API boundaries

---

## 🗄️ Database Schema

### Complete Entity List (19 Core Models + 5 Supporting Models)

#### 1. **Users, Authentication & Authorization (3 Models)**
- `User` → Customer/Admin with 9 roles (SUPER_ADMIN, ADMIN, CATALOG_MANAGER, INVENTORY_MANAGER, ORDER_MANAGER, CUSTOMER_SUPPORT, MARKETING_MANAGER, ACCOUNTS, CUSTOMER)
- `Account` → OAuth/credentials authentication records
- `Session` → Session management for authenticated users

#### 2. **Customer Profile & Addresses (2 Models)**
- `CustomerProfile` → Extended customer info with default address
- `Address` → Saved addresses (shipping/billing, default selection)

#### 3. **Catalog: Categories, Brands, Collections (3 Models)**
- `Category` → Hierarchical categories with parent-child relations, 2-digit prefix for barcodes
- `Brand` → Brand information with logo and description
- `Collection` → Time-based collections with date range support

#### 4. **Products, Variants & Media (5 Models)**
- `Product` → Main product entity (name, description, status, SEO fields)
- `ProductVariant` → SKU-based variants with individual pricing (regular, sale, cost), weight, barcode
- `ProductTag` → Flexible tagging system for products
- `ProductCollection` → Junction table for product-collection relationships
- `Media` → Product images/videos with Cloudinary URLs, mobile optimization support
- `VariantMedia` → Junction table linking variants to specific media

#### 5. **Attributes & Variants Association (3 Models)**
- `AttributeGroup` → Attribute categories (Size, Color, Material, etc.)
- `AttributeValue` → Individual attribute values (S, M, L; Red, Blue; etc.)
- `VariantAttribute` → Junction table linking variants to attribute values

#### 6. **Inventory & Warehouses (3 Models)**
- `Warehouse` → Multiple warehouse support for stock distribution
- `Inventory` → Stock tracking per variant per warehouse (quantity, reserved, reorder level)
- `InventoryMovement` → Complete audit trail of all stock adjustments

#### 7. **Orders, Payments & Shipments (6 Models)**
- `Order` → Main order entity (order number, status, payment status, totals, dates)
- `OrderItem` → Individual order line items with snapshot pricing
- `OrderStatusHistory` → Complete order state transition history
- `Payment` → Payment records with provider, transaction ID, metadata
- `CourierProvider` → Shipping provider configuration (Steadfast, Pathao, etc.)
- `Shipment` → Courier shipment tracking with consignment ID and tracking number

#### 8. **Reviews, Ratings & Notifications (2 Models)**
- `Review` → Product reviews with 1-5 rating, verified purchase flag, images
- `Notification` → User notifications (order status, promotions, alerts)

#### 9. **Cart & Wishlist (2 Models)**
- `CartItem` → Persisted shopping cart items (database backup to localStorage)
- `WishlistItem` → Wishlist items linked to CustomerProfile

#### 10. **Promotions & Coupons (1 Model)**
- `Coupon` → Promotional codes with type (PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING), usage limits, date ranges

#### 11. **CMS & Content Management (3 Models)**
- `HomepageSection` → Dynamic homepage sections (hero, category_grid, product_carousel) with JSON config
- `ThemeConfig` → Customizable theme settings (colors, fonts, border radius) stored as JSON
- `Menu` → Navigation menu items stored as JSON array
- `CMSPage` → Static content pages (about, privacy policy, T&C) with SEO fields

#### 12. **Audit & Logging (2 Models)**
- `AuditLog` → Complete audit trail of all admin actions (user, action type, entity, metadata)
- `WebhookLog` → Incoming webhook logs from payment and courier providers

---

## 🔄 Communication Flow Architecture

### 1. **User Authentication Flow**
```
Login Page (UI)
    ↓
/app/auth/login (NextAuth Provider)
    ↓
/api/auth/[...nextauth] (NextAuth Handler)
    ↓
Database (User lookup, password verify)
    ↓
Session Created → Stored in Session table
    ↓
Redirect to Dashboard
```

**Components Involved:**
- [auth.ts](auth.ts) → NextAuth configuration
- `LoginPage` → Form submission to `signIn()` provider
- NextAuth automatically handles session management

---

### 2. **Product Management Flow (Admin)**

```
Admin → Product Form (ProductForm.tsx)
    ↓
User uploads image → ImageUpload.tsx
    ↓
POST /api/upload (Cloudinary)
    ↓
Returns image URL → Stored in form
    ↓
Form submission → POST /api/admin/products
    ↓
API Route validates data → Calls productService.createProduct()
    ↓
productService (Business Logic)
    ├─ Check slug uniqueness
    ├─ Generate barcode
    ├─ Create Product
    ├─ Create default Variant
    ├─ Create Inventory record
    └─ Create AuditLog
    ↓
Database (Prisma transaction)
    ↓
Returns created product → Toast notification → Redirect to products list
```

**Key Services:**
- [productService.ts](src/lib/services/productService.ts) → `createProduct()`, `updateProduct()`
- [variantService.ts](src/lib/services/variantService.ts) → Variant operations
- [auditService.ts](src/lib/services/auditService.ts) → Log audit entry

---

### 3. **Storefront - Product Browsing Flow**

```
Homepage (page.tsx)
    ↓
Server-side data fetching
    ├─ await getActiveHomepageSections() → cmsService
    ├─ await getFeaturedCategories() → homepageService
    └─ await getFeaturedProducts() → homepageService
    ↓
Dynamic section rendering
    ├─ HeroSection.tsx
    ├─ CategoryGrid.tsx
    └─ ProductCarousel.tsx
    ↓
ProductCard.tsx component
    ├─ Displays product name, image, price
    └─ Links to /products/[slug]
```

**Data Flow:**
- Database (Product, Category, HomepageSection)
  ↓
- Services (homepageService, cmsService)
  ↓
- Page Component (SSR)
  ↓
- Reusable Components (ProductCard, sections)
  ↓
- Browser

---

### 4. **Shopping Cart Flow (Client-side State)**

```
ProductCard (Add to Cart)
    ↓
useCart hook (Zustand store) - cartStore
    ├─ Local state: items[]
    ├─ Action: addItem(), removeItem(), updateQuantity()
    └─ Persisted to localStorage (neurosoftic-cart)
    ↓
CartIcon badge updates
    ↓
Cart page reads from store
    ↓
Checkout button → Navigate to /checkout
```

**No database interaction until checkout!**
- Store: [cart.ts](src/lib/store/cart.ts)
- Component: `CartIcon.tsx`, `CartView.tsx`

---

### 5. **Order Creation & Payment Flow**

```
Checkout Page
    ↓
User selects shipping address, payment method
    ↓
POST /api/orders/create
    ↓
orderService.createOrder()
    ├─ Reserve inventory
    ├─ Create Order record
    ├─ Create OrderItems
    ├─ Set status: PENDING_PAYMENT
    └─ Create OrderStatusHistory
    ↓
Returns orderId → Redirect to payment initiation
    ↓
POST /api/payment/initiate
    ↓
paymentService.initiatePayment()
    ├─ Calls paymentProvider (getPaymentProvider)
    └─ sslcommerz.ts → Integrates with SSLCommerz API
    ↓
Returns redirect URL to SSLCommerz gateway
    ↓
External Payment Gateway (Customer enters card details)
    ↓
Payment Success/Failure
    ↓
POST /api/payment/callback (Webhook)
    ↓
paymentService.handlePaymentSuccess()
    ├─ Create Payment record
    ├─ Update Order.paymentStatus = PAID
    ├─ Update Order.status = CONFIRMED
    └─ Create OrderStatusHistory
    ↓
Redirect to success page with order confirmation
```

**Services Involved:**
- [orderService.ts](src/lib/services/orderService.ts)
- [paymentService.ts](src/lib/services/paymentService.ts)
- [sslcommerz.ts](src/lib/providers/sslcommerz.ts)

---

### 6. **Order Fulfillment Flow (Admin)**

```
Admin Dashboard → Orders page
    ↓
GET /admin/orders
    ↓
orderAdminService.getAllOrders() → Returns list with filters
    ↓
Table displays orders with status, customer, total
    ↓
Admin clicks order → Order detail page
    ↓
orderAdminService.getOrderByNumber(orderNumber)
    ├─ Includes: items, addresses, payments, shipment
    └─ Returns complete order with relations
    ↓
Admin updates status (PROCESSING → PACKED → READY_FOR_PICKUP)
    ↓
POST /api/admin/orders/[orderId]/status
    ↓
orderAdminService.updateOrderStatus()
    ├─ Updates Order.status
    ├─ Creates OrderStatusHistory entry
    ├─ If CANCELLED: releases reserved inventory
    └─ Creates AuditLog
    ↓
Admin creates shipment (READY_FOR_PICKUP → SHIPPED)
    ↓
POST /api/admin/orders/[orderId]/shipment
    ↓
courierService.createShipmentForOrder()
    ├─ Calls courierProvider (steadfast)
    └─ steadfast.ts → Integrates with Steadfast API
    ↓
Returns tracking number, consignment ID
    ↓
Updates Shipment record
    ↓
Sends tracking email to customer
```

**Key Services:**
- [orderAdminService.ts](src/lib/services/orderAdminService.ts)
- [courierService.ts](src/lib/services/courierService.ts)
- [steadfast.ts](src/lib/providers/steadfast.ts)

---

### 7. **Inventory Management Flow**

```
Admin → Inventory page
    ↓
GET /admin/inventory
    ↓
inventoryService.getAllInventory()
    ↓
Displays all SKUs, quantities, warehouse locations
    ↓
Admin adjusts stock (e.g., +10 units, reason: "Restock")
    ↓
PATCH /api/admin/inventory/[inventoryId]
    ↓
inventoryService.adjustInventory()
    ├─ Update Inventory.quantity
    ├─ Create InventoryMovement record
    └─ Create AuditLog
    ↓
Updates UI, shows new quantity
    ↓
Low stock alerts appear in dashboard
    ├─ adminService.getLowStockProducts()
    └─ Shows items below reorderLevel
```

**Services:**
- [inventoryService.ts](src/lib/services/inventoryService.ts)
- [adminService.ts](src/lib/services/adminService.ts)

---

### 8. **Search Flow**

```
Customer types in search box
    ↓
POST /api/search (or GET with query param)
    ↓
searchService.searchProducts(query)
    ├─ Uses PostgreSQL full-text search (plainto_tsquery)
    ├─ Searches: name, description, shortDescription
    ├─ Returns ranked results
    └─ Max 50 results
    ↓
Returns array of SearchProduct objects
    ↓
Search page displays results
    ↓
Each result links to /products/[slug]
```

**Service:**
- [searchService.ts](src/lib/services/searchService.ts)

---

### 9. **Wishlist Flow**

#### For Logged-in Users:
```
ProductCard "Add to Wishlist" button
    ↓
POST /api/account/wishlist
    ↓
wishlistService.addToWishlist(userId, variantId)
    ├─ Check CustomerProfile exists
    └─ Upsert WishlistItem
    ↓
Toast: "Added to wishlist"
    ↓
Heart icon fills
    ↓
GET /account/wishlist
    ↓
wishlistService.getWishlistItems(userId)
    ↓
Displays wishlist page
```

#### For Guest Users:
```
ProductCard "Add to Wishlist" button
    ↓
useGuestWishlist hook (Zustand) - wishlistStore
    ├─ Toggles item in local state
    └─ Persisted to localStorage (neurosoftic-wishlist)
    ↓
Guest can view items during session
    ↓
On login: Items synced to database
```

**Services & Store:**
- [wishlistService.ts](src/lib/services/wishlistService.ts)
- [wishlist.ts](src/lib/store/wishlist.ts) (Zustand store)

---

### 10. **Admin User Management Flow**

```
Admin → Users page
    ↓
GET /admin/users
    ↓
adminService.getAllUsers()
    ↓
UsersManager.tsx displays table
    ↓
Admin clicks "Edit Role" button
    ↓
Dialog opens with role selector
    ↓
User selects new role (e.g., CATALOG_MANAGER)
    ↓
PATCH /api/admin/users (userId, role)
    ↓
adminService.updateUserRole(userId, newRole)
    ├─ Updates User.role
    └─ Creates AuditLog
    ↓
Updates table
    ↓
Creates AuditLog entry with: action=ROLE_CHANGE, entity=User
```

**Services:**
- [adminService.ts](src/lib/services/adminService.ts)
- [auditService.ts](src/lib/services/auditService.ts)

---

### 11. **Theme Customization Flow**

```
Admin → Settings page
    ↓
GET /admin/settings
    ↓
themeService.getThemeConfig()
    ├─ Fetches all ThemeConfig records from DB
    └─ Returns object: { primary: "#...", secondary: "#...", ... }
    ↓
ThemeSettingsForm displays color picker, font selectors
    ↓
Admin changes primary color
    ↓
PATCH /api/admin/theme { key: "primary", value: "#000666" }
    ↓
themeService.updateThemeConfig(key, value)
    ├─ Upsert ThemeConfig record
    └─ Create AuditLog
    ↓
Creates/updates ThemeConfig entry in DB
    ↓
Applied globally via CSS variables or inline styles
```

**Service:**
- [themeService.ts](src/lib/services/themeService.ts)

---

### 12. **Analytics & Reporting Flow**

```
Admin → Reports page
    ↓
GET /admin/reports
    ↓
Parallel data fetching
    ├─ reportService.getSalesSummary()
    │  └─ Aggregates: total revenue, order count, avg order value
    ├─ reportService.getTopProducts()
    │  └─ Groups OrderItems by variantId, sums quantities
    └─ reportService.getOrderStatusBreakdown()
       └─ Counts orders per status
    ↓
Displays KPI cards, charts
    ├─ Total Revenue card
    ├─ Orders count
    ├─ Top Selling Products table
    └─ Order Status breakdown
```

**Service:**
- [reportService.ts](src/lib/services/reportService.ts)

---

## 📡 API Routes Summary (25+ Endpoints)

### Authentication Routes
| Route | Method | Purpose | Protection |
|-------|--------|---------|-----------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth callback, login, logout | Public |

### Public/Customer Routes
| Route | Method | Purpose | Protection |
|-------|--------|---------|-----------|
| `/api/search` | GET/POST | Full-text product search | Public |
| `/api/upload` | POST | Image upload to Cloudinary | Public |
| `/api/orders/[id]` | GET | Get order details | Protected (Customer) |
| `/api/payment/initiate` | POST | Start SSLCommerz payment | Protected (Customer) |
| `/api/payment/callback` | POST | Payment webhook handler | Verified Signature |

### Customer Account Routes (Protected)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/account/profile` | GET/PATCH | View/update customer profile |
| `/api/account/addresses` | GET/POST | List/create addresses |
| `/api/account/addresses/[id]` | PATCH/DELETE | Update/delete address |
| `/api/account/wishlist` | GET/POST/DELETE | Get/add/remove wishlist items |
| `/api/account/wishlist/[variantId]` | POST/DELETE | Toggle single wishlist item |

### Admin Routes (Protected - Role-based)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/users` | GET/PATCH | Get all users / update user role |
| `/api/admin/products` | GET/POST | List products / create new product |
| `/api/admin/products/[id]` | PATCH/DELETE | Update/delete product |
| `/api/admin/products/[id]/variants` | POST | Add variant to product |
| `/api/admin/variants/[id]` | PATCH/DELETE | Update/delete variant |
| `/api/admin/inventory` | GET/PATCH | View inventory / adjust stock |
| `/api/admin/inventory/[id]` | PATCH | Adjust stock with reason |
| `/api/admin/orders` | GET | List all orders (filtered, paginated) |
| `/api/admin/orders/[id]/status` | PATCH | Update order status |
| `/api/admin/orders/[id]/shipment` | POST | Create shipment with courier |
| `/api/admin/theme` | GET/PATCH/POST | Get/update/reset theme config |
| `/api/admin/audit-logs` | GET | View admin action audit trail |
| `/api/admin/reports` | GET | Get sales analytics & KPIs |

### Request/Response Flow
- All routes validate authentication via NextAuth session
- Admin routes additionally validate user role (SUPER_ADMIN, ADMIN, CATALOG_MANAGER, etc.)
- Request validation via Zod schemas at API boundary
- Error responses follow standard format with HTTP status codes
- Responses include metadata (timestamps, pagination, etc.)

---

## 🔐 Authentication & Authorization

### NextAuth.js Configuration (v5.0.0-beta.32)

**Session Strategy**: JWT (JSON Web Token)
- Session stored in JWT token
- Database sessions via Prisma Adapter
- Auto-refresh token management
- Expires at configurable interval

**Providers Implemented:**
1. **Credentials Provider** (Email + Password)
   - Email/password validation via Zod
   - Password hashing with bcryptjs
   - User lookup from PostgreSQL
   - Password verification on login

2. **OAuth Providers** (Ready to implement)
   - Google OAuth support enabled
   - Facebook OAuth support enabled
   - Other providers easily configurable

**User Roles (9 Tiers):**
- `SUPER_ADMIN` → Full system access
- `ADMIN` → Full admin access
- `CATALOG_MANAGER` → Product & inventory management
- `INVENTORY_MANAGER` → Stock management only
- `ORDER_MANAGER` → Order management & fulfillment
- `CUSTOMER_SUPPORT` → Customer service access
- `MARKETING_MANAGER` → CMS & promotions
- `ACCOUNTS` → Financial & reporting
- `CUSTOMER` → Customer/shopper (default)

**Session Flow:**
```
Login Request
    ↓
/api/auth/signin (NextAuth endpoint)
    ↓
Credentials Provider validates email/password
    ↓
User lookup in database
    ↓
Password verification (bcryptjs)
    ↓
JWT token created with user data
    ↓
Session cookie set (httpOnly, secure)
    ↓
Redirect to /dashboard or referrer
```

**Authentication Middleware:**
- All API routes check `auth()` at handler start
- Admin routes additionally check user role
- Redirect to `/auth/login` if not authenticated
- Role validation prevents unauthorized access

**Security Features:**
- Passwords hashed with bcryptjs
- CSRF protection via NextAuth
- Secure session cookies (httpOnly, sameSite)
- JWT token validation on every request
- Role-based access control (RBAC) at API level
- Audit logging of all sensitive operations

---

## 🚀 Key Features & How They Connect

### 1. **Multi-Role Access Control (9 Roles)**
- Roles defined in Prisma enum
- API middleware validates role on every admin request
- Admin sidebar dynamically shows/hides menu items based on role
- Fine-grained permissions: CATALOG_MANAGER can't access financial reports
- Audit trail logs role changes and sensitive actions

### 2. **Product Catalog & Variants (SKU-based)**
- One Product can have unlimited Variants (different SKUs)
- Each Variant has individual pricing: regular, sale, cost
- Variants linked to AttributeGroups (Size, Color, etc.)
- Product lifecycle: DRAFT → PENDING → ACTIVE → INACTIVE → ARCHIVED
- Media handling: Primary image, multiple images, mobile-optimized URLs
- Barcode generation: Category prefix + sequential number

### 3. **Order Lifecycle (14 Status Stages)**
```
DRAFT → PENDING_PAYMENT → CONFIRMED → PROCESSING → PACKED 
→ READY_FOR_PICKUP → SHIPPED → IN_TRANSIT → OUT_FOR_DELIVERY 
→ DELIVERED OR CANCELLED/RETURNED/REFUNDED/PAYMENT_FAILED
```
- Each status change creates OrderStatusHistory record
- Inventory reserved at order creation, released if cancelled
- Full audit trail: who changed status, when, from what to what
- Supports partial fulfillment and returns

### 4. **Advanced Inventory Management**
- Two-part tracking: `quantity` (total) + `reserved` (allocated)
- Multi-warehouse support with location-based stock
- Automatic barcode generation per variant
- Reorder levels and low-stock alerts
- Complete InventoryMovement audit trail (reason, reference ID)
- Supports reasons: order_placed, restock, adjustment, return, damage, etc.

### 5. **Payment Integration (SSLCommerz + COD)**
- **SSLCommerz API Integration** for online payments
- Card payments: Visa, MasterCard, AmEx
- Mobile wallet: bKash, Nagad, Rocket
- **Cash on Delivery (COD)** for offline payments
- Webhook callback handling for payment status updates
- Transaction ID tracking and verification
- Payment records with provider, amount, status, metadata
- Supports partial & refunded payments

### 6. **Shipping Integration (Steadfast + Extensible)**
- **Steadfast API integration** for Bangladesh couriers
- Automatic consignment creation with tracking number
- Multiple courier provider support (extensible)
- Shipment status tracking
- Webhook handling for delivery updates
- CourierProvider configuration table for multi-provider support

### 7. **Search & Discovery**
- **PostgreSQL full-text search** (plainto_tsquery)
- Searches: product name, description, shortDescription, tags
- Ranked results by relevance
- Max 50 results per search
- Instant search via `/api/search`

### 8. **CMS & Homepage Builder**
- Dynamic homepage sections stored in database
- Section types: hero, category_grid, product_carousel
- Sortable sections for custom layout
- Time-based sections: startDate, endDate
- Theme customization: colors, fonts, border-radius, etc.
- Static pages: About Us, Privacy Policy, T&C

### 9. **Client-Side State Management (Zustand)**
- **Cart**: Persisted to localStorage, no server state until checkout
- **Wishlist**: 
  - Logged-in users: Database-backed via WishlistItem
  - Guest users: localStorage-backed, synced to DB on login
- Real-time badge updates via Zustand hooks
- Automatic localStorage persistence

### 10. **Promotions & Coupons**
- Coupon types: PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING
- Minimum spend requirements and max discount caps
- Date-based validity (startDate, endDate)
- Usage limits per coupon
- Applied at checkout
- Stored in Order for reference

### 11. **Reviews & Ratings**
---

## 🧬 Development Setup & Commands

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL 13+
- npm or yarn package manager

### Installation & Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run postinstall

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your database and API credentials

# Run database migrations
npx prisma migrate dev

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

### NPM Scripts

```json
{
  "dev": "next dev",           // Start dev server (http://localhost:3000)
  "build": "next build",       // Build for production
  "start": "next start",       // Start production server
  "lint": "eslint",            // Run ESLint
  "postinstall": "prisma generate" // Auto-generate Prisma client
}
```

### Prisma Commands

```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Reset database (wipe all data)
npx prisma migrate reset

# View database in UI
npx prisma studio

# Generate Prisma client
npx prisma generate

# Seed database
npm run seed  # or npx tsx prisma/seed.ts
```

---

## 🌍 Environment Variables (.env.local)

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/neurosoftic

# NextAuth
NEXTAUTH_SECRET=<your-random-secret>
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=<google-oauth-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
FACEBOOK_APP_ID=<facebook-app-id>
FACEBOOK_APP_SECRET=<facebook-app-secret>

# SSLCommerz Payment Gateway
NEXT_PUBLIC_SSLCOMMERZ_STORE_ID=<store-id>
SSLCOMMERZ_STORE_PASSWORD=<store-password>
NEXT_PUBLIC_SSLCOMMERZ_API_URL=https://sandbox.sslcommerz.com  # or production URL

# Steadfast Courier
STEADFAST_API_KEY=<steadfast-api-key>
STEADFAST_API_URL=https://api-staging.steadfast.io  # or production URL

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📦 Key Dependencies & Versions

### Core Framework & Runtime
- **next** (16.3.0): React framework with App Router
- **react** (19.2.8): UI library
- **react-dom** (19.2.8): React DOM renderer

### Database & ORM
- **@prisma/client** (7.9.1): Type-safe database client
- **prisma** (7.9.1): ORM and migration tool
- **pg** (8.23.0): PostgreSQL driver
- **@auth/prisma-adapter** (2.11.3): Prisma adapter for NextAuth
- **@prisma/adapter-pg** (7.9.1): PostgreSQL adapter for Prisma

### Authentication
- **next-auth** (5.0.0-beta.32): Authentication framework
- **bcryptjs** (3.0.3): Password hashing

### Styling & UI
- **tailwindcss** (4.3.3): CSS framework
- **@tailwindcss/postcss** (4.3.3): PostCSS plugin for Tailwind
- **postcss** (8.5.26): CSS processing
- **class-variance-authority** (0.7.1): CSS class utility
- **clsx** (2.1.1): Conditional classNames
- **tailwind-merge** (3.6.0): Merge Tailwind classes
- **tailwindcss-animate** (1.0.7): Animation utilities
- **@base-ui/react** (1.7.0): Headless UI components

### Form & Validation
- **react-hook-form** (7.85.0): Form state management
- **@hookform/resolvers** (5.7.1): Zod resolver for RHF
- **zod** (4.4.3): Schema validation

### HTTP & APIs
- **axios** (1.19.0): HTTP client

### Media & Uploads
- **cloudinary** (2.10.0): Image upload and management
- **bwip-js** (4.11.2): Barcode generation

### State Management & Query
- **zustand** (5.0.14): Lightweight state management
- **@tanstack/react-query** (5.101.4): Server state management

### Data & Utilities
- **date-fns** (4.4.0): Date manipulation
- **lucide-react** (1.31.0): Icon library
- **pdfkit** (0.19.1): PDF generation
- **framer-motion** (13.1.0): Animation library
- **recharts** (3.10.1): React charts library

### Build & Development
- **typescript** (5): TypeScript compiler
- **eslint** (9): Code linting
- **@types/node** (20): Node.js type definitions
- **@types/react** (19): React type definitions
- **@types/react-dom** (19): React DOM type definitions
- **@types/bcryptjs** (2.4.6): bcryptjs type definitions
- **@types/pg** (8.21.0): PostgreSQL type definitions

### Configuration & Utilities
- **dotenv** (17.4.2): Environment variable loader
- **tsx** (4.23.12): TypeScript executor
- **eslint-config-next** (16.3.0): Next.js ESLint config
- **shadcn** (4.17.0): UI component CLI
- **install** (0.13.0): NPM package installer

---

## 🚀 Deployment Checklist

### Before Deployment
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URL
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure production API URLs (SSLCommerz, Steadfast, Cloudinary)
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Run `npm run build` to verify build succeeds
- [ ] Test payment flow with production credentials
- [ ] Test shipping integration with production credentials

### Deployment Platforms
- **Vercel**: Recommended (built by Next.js creators)
- **AWS**: EC2 with custom setup
- **DigitalOcean**: App Platform or Droplet
- **Railway**: Simple deployment
- **Render**: Easy setup with PostgreSQL

### Post-Deployment
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry)
- [ ] Enable HTTPS
- [ ] Configure CORS for third-party APIs
- [ ] Set up automated backups
- [ ] Monitor database performance
- [ ] Enable rate limiting on public endpoints

---

## 🎯 Summary: How Components Work Together

1. **UI Layer** → React Server Components & Client Components
2. **State Management** → Zustand for client-side cart/wishlist
3. **API Layer** → Next.js route handlers with NextAuth validation
4. **Business Logic** → 16 services encapsulating workflows
5. **External Integrations** → Provider pattern for payment & shipping
6. **Data Access** → Prisma ORM with transactions
7. **Database** → PostgreSQL with 24 models and full-text search

**Key Principle**: Clear separation of concerns with unidirectional data flow:
```
UI Component → Server/Client State (Zustand) → API Route 
→ Service Layer → Provider Layer → Prisma ORM → PostgreSQL
                  ↑
                  └─ (Response back up the chain)
```

**Benefits:**
- ✅ Maintainability: Each layer has clear responsibility
- ✅ Testability: Services can be tested independently
- ✅ Scalability: New features added to layers without affecting others
- ✅ Security: Auth & authorization at API boundary
- ✅ Reusability: Services used by multiple API routes
- ✅ Transaction Support: Complex operations wrapped in DB transactions
- ✅ Type Safety: Full TypeScript coverage with Zod validation

---

## 📝 Notes

- **Bangladesh Focus**: Optimized for SSLCommerz and Steadfast APIs
- **Extensible**: Easy to add new payment gateways and courier providers
- **Enterprise Ready**: Audit logging, role-based access, transaction management
- **Performance**: Server components, request deduplication, caching strategies
- **SEO Optimized**: Meta tags, structured data, URL slugs
- **Accessible**: Base UI components, keyboard navigation, ARIA labels

---

## 🛠️ Service Layer Architecture (Business Logic)

All business logic is encapsulated in services located in `src/lib/services/`. Each service handles a specific domain and is reusable across API routes.

### Service Overview (16 Services)

| Service | Purpose | Key Methods |
|---------|---------|-------------|
| `adminService.ts` | Admin dashboard stats, user management | `getAllUsers()`, `updateUserRole()`, `getLowStockProducts()`, `getDashboardStats()` |
| `productService.ts` | Product CRUD, creation, slug validation | `createProduct()`, `updateProduct()`, `getProductBySlug()`, `getAllProducts()` |
| `variantService.ts` | Variant management, SKU generation | `createVariant()`, `updateVariant()`, `deleteVariant()` |
| `inventoryService.ts` | Stock management, movements | `getInventory()`, `adjustInventory()`, `createMovement()` |
| `orderService.ts` | Customer order creation, status | `createOrder()`, `getOrderByNumber()`, `getUserOrders()` |
| `orderAdminService.ts` | Admin order view, fulfillment | `getAllOrders()`, `updateOrderStatus()`, `getOrderForAdmin()` |
| `customerService.ts` | Customer profile, addresses | `getCustomerProfile()`, `createAddress()`, `updateAddress()` |
| `paymentService.ts` | Payment processing, webhooks | `initiatePayment()`, `handlePaymentCallback()`, `getPaymentStatus()` |
| `courierService.ts` | Shipping integration | `createShipmentForOrder()`, `getShipmentStatus()`, `trackShipment()` |
| `searchService.ts` | Full-text search | `searchProducts()` |
| `reportService.ts` | Analytics, KPIs | `getSalesSummary()`, `getTopProducts()`, `getOrderStatusBreakdown()` |
| `auditService.ts` | Audit logging | `logAction()`, `getAuditLogs()` |
| `cmsService.ts` | Homepage content | `getActiveHomepageSections()`, `updateSection()` |
| `themeService.ts` | Theme configuration | `getThemeConfig()`, `updateThemeConfig()`, `resetTheme()` |
| `wishlistService.ts` | Wishlist operations | `addToWishlist()`, `removeFromWishlist()`, `getWishlistItems()` |
| `homepageService.ts` | Homepage data aggregation | `getFeaturedProducts()`, `getFeaturedCategories()` |

### Provider Layer (Third-party Integrations)

| Provider | Purpose | Implementation |
|----------|---------|-----------------|
| `paymentProvider.ts` | Abstract payment interface | SSLCommerz (Bangladesh) |
| `courierProvider.ts` | Abstract courier interface | Steadfast (Bangladesh) |

**Design Pattern**: Each provider implements an interface, allowing easy addition of new providers (Pathao, TigerParcel, etc.)

### Transaction Management

- Prisma transactions wrap multi-step operations
- Order creation: Create Order → Create OrderItems → Reserve Inventory → Create StatusHistory (atomic)
- Payment success: Create Payment → Update Order status → Update Payment Status (atomic)
- Automatic rollback if any step fails

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS APP (FRONTEND & BACKEND)             │
└─────────────────────────────────────────────────────────────────┘
            ↓
    ┌───────────────────────────────────────────┐
    │  React Components (Pages & Shared)        │
    │  - ProductCard, CartIcon, ProductForm     │
    └───────────────────────────────────────────┘
            ↓ (onClick, onChange, onSubmit)
    ┌───────────────────────────────────────────┐
    │  Zustand Stores (Client-side State)       │
    │  - useCart (persisted to localStorage)    │
    │  - useGuestWishlist (persisted)           │
    └───────────────────────────────────────────┘
            ↓ (if needs server data)
    ┌───────────────────────────────────────────┐
    │  Next.js API Routes (/api/*)              │
    │  - Validates request (role, auth)         │
    │  - Calls service layer                    │
    └───────────────────────────────────────────┘
            ↓
    ┌───────────────────────────────────────────┐
    │  Service Layer (Business Logic)           │
    │  - productService, orderService, etc.     │
    │  - Implements complex workflows           │
    │  - Manages transactions                   │
    └───────────────────────────────────────────┘
            ↓
    ┌───────────────────────────────────────────┐
    │  Provider Layer (Integrations)            │
    │  - sslcommerz, steadfast                  │
    │  - Cloudinary, Third-party APIs           │
    └───────────────────────────────────────────┘
            ↓
    ┌───────────────────────────────────────────┐
    │  Prisma ORM                               │
    │  - Query builder, type-safe               │
    │  - Transaction support                    │
    └───────────────────────────────────────────┘
            ↓
    ┌───────────────────────────────────────────┐
    │  PostgreSQL Database                      │
    │  - 20+ tables, relations, constraints     │
    │  - Full-text search indexes               │
    └───────────────────────────────────────────┘
```

---

## 🎯 Summary: How Components Work Together

1. **UI Layer** → React components, forms, tables
2. **State Management** → Zustand for client-side carts/wishlist
3. **API Layer** → Next.js route handlers, authentication middleware
4. **Business Logic** → Services encapsulate complex workflows
5. **External Integrations** → Providers abstract third-party APIs
6. **Data Access** → Prisma handles all DB queries
7. **Database** → PostgreSQL with full relational schema

**Key Principle**: Clear separation of concerns with unidirectional data flow:
```
UI Component → API Route → Service → Provider → Database
                  ↑
                  └─ (Response back up the chain)
```

This ensures:
- ✅ Maintainability
- ✅ Testability
- ✅ Scalability
- ✅ Security (auth & authorization at API level)
- ✅ Code reusability (services used by multiple API routes)
- ✅ Transaction support (complex multi-step operations)

