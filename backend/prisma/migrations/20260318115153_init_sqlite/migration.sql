-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ville" TEXT,
    "lat" REAL,
    "lng" REAL,
    "statut" TEXT NOT NULL DEFAULT 'en_attente_validation',
    "est_disponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "distributeur_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "contenance" TEXT NOT NULL,
    "prix_unitaire" REAL NOT NULL,
    "stock_disponible" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_distributeur_id_fkey" FOREIGN KEY ("distributeur_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_id" TEXT NOT NULL,
    "distributeur_id" TEXT,
    "transporteur_id" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "montant_total" REAL NOT NULL,
    "mode_paiement" TEXT NOT NULL,
    "lat_livraison" REAL NOT NULL,
    "lng_livraison" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_distributeur_id_fkey" FOREIGN KEY ("distributeur_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_transporteur_id_fkey" FOREIGN KEY ("transporteur_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire" REAL NOT NULL,
    CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commande_id" TEXT NOT NULL,
    "transporteur_id" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'assignee',
    "lat_actuelle" REAL,
    "lng_actuelle" REAL,
    "heure_depart" DATETIME,
    "heure_arrivee" DATETIME,
    "signature_client" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Delivery_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Delivery_transporteur_id_fkey" FOREIGN KEY ("transporteur_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_commande_id_key" ON "Delivery"("commande_id");
