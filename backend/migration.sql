-- CreateEnum
CREATE TYPE "Role" AS ENUM ('grand_depot', 'petit_depot', 'transporteur', 'client', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('actif', 'suspendu', 'en_attente_validation');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('biere', 'jus', 'eau', 'soft');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('en_attente', 'confirmee', 'en_livraison', 'livree', 'annulee');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('mobile_money', 'especes', 'credit');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('assignee', 'en_route', 'arrivee', 'completee');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "nom" TEXT NOT NULL,
    "ville" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "statut" "UserStatus" NOT NULL DEFAULT 'en_attente_validation',
    "est_disponible" BOOLEAN NOT NULL DEFAULT true,
    "kycDocUrl" TEXT,
    "kycSelfieUrl" TEXT,
    "kycNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "distributeur_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" "ProductCategory" NOT NULL,
    "contenance" TEXT NOT NULL,
    "prix_unitaire" DOUBLE PRECISION NOT NULL,
    "stock_disponible" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "distributeur_id" TEXT,
    "transporteur_id" TEXT,
    "statut" "OrderStatus" NOT NULL DEFAULT 'en_attente',
    "montant_total" DOUBLE PRECISION NOT NULL,
    "mode_paiement" "PaymentMethod" NOT NULL,
    "lat_livraison" DOUBLE PRECISION NOT NULL,
    "lng_livraison" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "commande_id" TEXT NOT NULL,
    "transporteur_id" TEXT NOT NULL,
    "statut" "DeliveryStatus" NOT NULL DEFAULT 'assignee',
    "lat_actuelle" DOUBLE PRECISION,
    "lng_actuelle" DOUBLE PRECISION,
    "heure_depart" TIMESTAMP(3),
    "heure_arrivee" TIMESTAMP(3),
    "signature_client" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_commande_id_key" ON "Delivery"("commande_id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_distributeur_id_fkey" FOREIGN KEY ("distributeur_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_distributeur_id_fkey" FOREIGN KEY ("distributeur_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_transporteur_id_fkey" FOREIGN KEY ("transporteur_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_transporteur_id_fkey" FOREIGN KEY ("transporteur_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

