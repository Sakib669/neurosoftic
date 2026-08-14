# 🎯 Neurosoftic Project - Complete Structure & Architecture

## 📋 Project Overview

**Neurosoftic** is a **full-stack e-commerce platform** built with **Next.js 16** (App Router), **Prisma ORM**, **PostgreSQL**, and **NextAuth.js**. It's a comprehensive B2C marketplace with multi-role admin capabilities, inventory management, payments, and shipping integration.

### Technology Stack
- **Frontend**: React 19, Next.js 16, TailwindCSS, Shadcn/Base UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js 5 (beta), Credentials & OAuth
- **Payment**: SSLCommerz (Bangladesh payment gateway)
- **Shipping**: Steadfast (Bangladesh courier)
- **Media**: Cloudinary
- **State Management**: Zustand
- **Validation**: Zod
- **Forms**: React Hook Form

---

## 📁 Project Folder Structure

```
neurosoftic/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page
│   │   ├── globals.css              # Global styles
│   │
│   │   ├── (storefront)/             # Customer-facing routes (group)
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── cart/                # Shopping cart
│   │   │   ├── checkout/            # Checkout flow
│   │   │   ├── products/            # Product listing
│   │   │   ├── search/              # Search functionality
│   │   │   └── wishlist/            # Wishlist management
│   │
│   │   ├── account/                  # Customer account routes (protected)
│   │   │   ├── page.tsx             # Account dashboard
│   │   │   ├── profile/             # Profile management
│   │   │   ├── orders/              # Order history
│   │   │   │   └── [orderNumber]/   # Order details
│   │   │   └── address/             # Address management
│   │
│   │   ├── admin/                    # Admin dashboard (protected)
│   │   │   ├── page.tsx             # Admin dashboard
│   │   │   ├── products/            # Product management
│   │   │   │   ├── page.tsx         # Product list
│   │   │   │   ├── new/             # Create product
│   │   │   │   └── [productId]/
│   │   │   │       ├── edit/        # Edit product
│   │   │   │       └── variants/    # Manage variants
│   │   │   ├── orders/              # Order management
│   │   │   │   └── [orderNumber]/   # Order details
│   │   │   ├── users/               # User management
│   │   │   ├── inventory/           # Stock management
│   │   │   ├── reports/             # Analytics & reports
│   │   │   ├── audit-logs/          # Audit trail
│   │   │   ├── cms/                 # CMS (Homepage builder)
│   │   │   └── settings/            # Theme & branding
│   │
│   │   ├── auth/                     # Authentication
│   │   │   ├── login/               # Login page
│   │   │   ├── register/            # Registration
│   │   │   └── error/               # Auth error
│   │
│   │   └── api/                      # REST API Routes
│   │       ├── auth/                # NextAuth routes
│   │       ├── account/             # User account endpoints
│   │       │   ├── profile          # Profile CRUD
│   │       │   ├── addresses        # Address CRUD
│   │       │   └── wishlist         # Wishlist endpoints
│   │       ├── admin/               # Admin-only endpoints
│   │       │   ├── products         # Product CRUD
│   │       │   ├── variants         # Variant CRUD
│   │       │   ├── orders           # Order management
│   │       │   ├── users            # User management
│   │       │   ├── inventory        # Stock adjustment
│   │       │   └── theme            # Theme configuration
│   │       ├── orders/              # Order endpoints
│   │       │   └── [orderId]/shipment
│   │       ├── payment/             # Payment endpoints
│   │       │   ├── initiate         # Start payment
│   │       │   └── callback         # Payment webhook
│   │       ├── search/              # Full-text search
│   │       └── upload/              # File upload
│   │
│   ├── components/                   # Reusable React components
│   │   ├── ui/                      # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (20+ UI primitives)
│   │   │
│   │   ├── admin/                   # Admin-specific components
│   │   │   ├── Sidebar.tsx          # Admin navigation
│   │   │   ├── ProductForm.tsx      # Product creation/edit
│   │   │   ├── ImageUpload.tsx      # Image upload widget
│   │   │   └── EditProductForm.tsx  # Edit form variant
│   │   │
│   │   ├── shared/                  # Shared components
│   │   │   ├── Header.tsx           # Top navigation
│   │   │   ├── CartIcon.tsx         # Cart badge
│   │   │   ├── WishlistIcon.tsx     # Wishlist badge
│   │   │   ├── CartView.tsx         # Cart drawer/modal
│   │   │   └── SignOutButton.tsx    # Logout button
│   │   │
│   │   ├── storefront/              # Storefront components
│   │   │   ├── ProductCard.tsx      # Product tile
│   │   │   └── sections/            # Homepage sections
│   │   │       ├── HeroSection.tsx
│   │   │       ├── CategoryGrid.tsx
│   │   │       └── ProductCarousel.tsx
│   │   │
│   │   └── sign-in.tsx              # Sign-in form
│   │
│   ├── lib/                         # Utility functions & services
│   │   ├── db.ts                    # Prisma client instance
│   │   ├── utils.ts                 # Helper utilities (classnames, etc)
│   │   ├── hash.ts                  # Password hashing
│   │   ├── password.ts              # Password verification
│   │   ├── barcode.ts               # Barcode generation
│   │   ├── cloudinary.ts            # Cloudinary integration
│   │   ├── zod.ts                   # Zod schema utilities
│   │   │
│   │   ├── actions/                 # Server Actions
│   │   │   └── auth.ts              # Auth server actions (registration)
│   │   │
│   │   ├── services/                # Business logic layer
│   │   │   ├── adminService.ts      # Admin operations (users, stats, etc)
│   │   │   ├── productService.ts    # Product CRUD & creation
│   │   │   ├── variantService.ts    # Product variant management
│   │   │   ├── inventoryService.ts  # Stock management
│   │   │   ├── orderService.ts      # Order operations
│   │   │   ├── orderAdminService.ts # Admin order view
│   │   │   ├── customerService.ts   # Customer profile & addresses
│   │   │   ├── paymentService.ts    # Payment processing
│   │   │   ├── courierService.ts    # Shipping integration
│   │   │   ├── searchService.ts     # Full-text search
│   │   │   ├── reportService.ts     # Analytics & reports
│   │   │   ├── auditService.ts      # Audit logging
│   │   │   ├── cmsService.ts        # Homepage sections
│   │   │   ├── themeService.ts      # Theme configuration
│   │   │   ├── wishlistService.ts   # Wishlist operations
│   │   │   └── homepageService.ts   # Homepage data
│   │   │
│   │   ├── providers/               # Third-party integrations
│   │   │   ├── paymentProvider.ts   # Payment gateway interface
│   │   │   ├── sslcommerz.ts        # SSLCommerz implementation
│   │   │   ├── courierProvider.ts   # Courier interface
│   │   │   └── steadfast.ts         # Steadfast implementation
│   │   │
│   │   ├── validators/              # Zod validation schemas
│   │   │   └── product.ts           # Product validation
│   │   │
│   │   └── store/                   # Client-side state (Zustand)
│   │       ├── cart.ts              # Cart store (persisted)
│   │       └── wishlist.ts          # Wishlist store (persisted)
│   │
│   └── generated/                   # Generated files
│       └── prisma/                  # Prisma client
│
├── prisma/
│   ├── schema.prisma                # Database schema
│   ├── seed.ts                      # Database seeding
│   └── migrations/                  # Database migrations
│
├── public/                          # Static assets
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── next.config.ts                   # Next.js config
├── postcss.config.mjs               # PostCSS config
├── tailwind.config.mjs              # Tailwind config
├── eslint.config.mjs                # ESLint config
├── components.json                  # Shadcn config
├── auth.ts                          # NextAuth configuration
└── README.md

```

---

## 🗄️ Database Schema

### Core Entities

#### 1. **Users & Authentication**
- `User` → Customer/Admin with roles (SUPER_ADMIN, ADMIN, CATALOG_MANAGER, etc.)
- `Account` → OAuth/social login accounts
- `Session` → Session management

#### 2. **Products & Inventory**
- `Product` → Main product entity (name, description, status)
- `ProductVariant` → SKU, pricing, variants (size, color, etc)
- `ProductAttribute` → Links variants to attribute values
- `AttributeGroup` → Groups (Size, Color, etc)
- `AttributeValue` → Individual values (S, M, L or Red, Blue)
- `Media` → Product images/videos
- `Inventory` → Stock quantity per variant per warehouse
- `InventoryMovement` → Stock adjustment history
- `Category` → Product categories
- `Brand` → Brand information

#### 3. **Orders & Payments**
- `Order` → Main order (customer, total, status, dates)
- `OrderItem` → Individual items in order
- `OrderAddress` → Shipping & billing addresses
- `OrderStatusHistory` → Status changes with timestamps
- `Payment` → Payment records (method, amount, status)
- `Shipment` → Courier shipment tracking

#### 4. **Customer**
- `CustomerProfile` → Extended customer info
- `Address` → Saved addresses (default, multiple)
- `Review` → Product reviews
- `CartItem` → Cart contents
- `WishlistItem` → Wishlist items

#### 5. **CMS & Configuration**
- `HomepageSection` → Dynamic homepage sections
- `ThemeConfig` → Customizable theme settings

#### 6. **Admin & Audit**
- `AuditLog` → All admin actions logged
- `Notification` → User notifications
- `Warehouse` → Inventory warehouses
- `CourierProvider` → Shipping providers

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

## 📡 API Routes Summary

### Public/Customer Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/search` | POST | Full-text product search |
| `/api/upload` | POST | Image upload to Cloudinary |
| `/api/payment/initiate` | POST | Start SSLCommerz payment |
| `/api/payment/callback` | POST | Payment webhook handler |
| `/api/orders/[id]` | GET | Get order details (protected) |

### Customer Account Routes (Protected - /account/**)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/account/profile` | GET/PATCH | View/update profile |
| `/api/account/addresses` | GET/POST | Get/create addresses |
| `/api/account/addresses/[id]` | PATCH/DELETE | Update/delete address |
| `/api/account/wishlist` | GET/POST/DELETE | Wishlist operations |

### Admin Routes (Protected - /admin/**)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/users` | GET/PATCH | User management |
| `/api/admin/products` | GET/POST | Product CRUD |
| `/api/admin/products/[id]` | PATCH/DELETE | Update/delete product |
| `/api/admin/products/[id]/variants` | POST | Add variant |
| `/api/admin/variants/[id]` | PATCH/DELETE | Update/delete variant |
| `/api/admin/inventory` | GET/PATCH | Stock management |
| `/api/admin/orders` | GET | All orders (filtered) |
| `/api/admin/orders/[id]/status` | PATCH | Update order status |
| `/api/admin/orders/[id]/shipment` | POST | Create shipment |
| `/api/admin/theme` | GET/PATCH/POST | Theme CRUD & reset |
| `/api/admin/audit-logs` | GET | Audit trail |

---

## 🔐 Authentication & Authorization

**Method**: NextAuth.js 5 (beta)

**Providers:**
- Credentials (email + password)
- OAuth ready (Google, Facebook, etc.)

**Session Handling:**
- Database sessions stored in `Session` table
- User roles: 9 roles (SUPER_ADMIN, ADMIN, CATALOG_MANAGER, etc.)

**Middleware Protection:**
- Customer routes: Check `session?.user?.id`
- Admin routes: Check `session?.user?.role` includes admin privilege
- Redirect to `/auth/login` if not authenticated

---

## 🚀 Key Features & How They Connect

### 1. **Multi-Role Access Control**
- Roles defined in Prisma: SUPER_ADMIN, ADMIN, CATALOG_MANAGER, etc.
- API routes validate user role before allowing access
- Admin sidebar dynamically shows/hides menu items based on role

### 2. **Product Variants & Attributes**
- One Product can have many Variants (SKU-based)
- Each Variant can have multiple Attributes (Size, Color, etc.)
- Inventory tracked per Variant per Warehouse
- Pricing can differ per variant (regular price vs. sale price)

### 3. **Order Lifecycle**
- Status progression: PENDING_PAYMENT → CONFIRMED → PROCESSING → PACKED → READY_FOR_PICKUP → SHIPPED → DELIVERED
- Each status change creates OrderStatusHistory entry
- Inventory is "reserved" when order created, released when cancelled
- Full audit trail of all changes

### 4. **Inventory Management**
- Two-part system: Inventory.quantity (total) + Inventory.reserved (allocated to orders)
- InventoryMovement tracks all adjustments (reasons: restock, damage, order fulfillment, etc.)
- Low stock alerts on admin dashboard
- Automatic generation of barcodes for tracking

### 5. **Payment Integration**
- SSLCommerz API integration for online payments
- Supports COD (Cash on Delivery) for unpaid orders
- Webhook callback to handle payment success/failure
- Payment records tracked in Payment table

### 6. **Shipping Integration**
- Steadfast API integration for courier shipments
- Automatic consignment creation with tracking number
- Supports multiple courier providers (extensible)
- Order status auto-updated to READY_FOR_PICKUP

### 7. **Client-Side Caching**
- Cart: Zustand store + localStorage (no server state)
- Wishlist: Guest wishlist in localStorage, logged-in wishlist in DB
- Automatic sync on login

### 8. **Full-Text Search**
- PostgreSQL native full-text search (plainto_tsquery)
- Searches product name, description, shortDescription
- Ranked results by relevance
- Max 50 results

### 9. **CMS (Homepage Builder)**
- Dynamic homepage sections stored in DB
- Supported section types: hero, category_grid, product_carousel
- Sortable sections for custom layout
- Theme customization (colors, fonts, border radius)

### 10. **Audit Logging**
- Every admin action logged: user, action, entity, timestamp
- Used for compliance, debugging, user activity tracking
- Displayed in /admin/audit-logs

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

