"use client";

import { useState } from "react";
import { X, Package, Tag, Layers, DollarSign } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
  isActive: boolean;
  images: { url: string; key: string }[];
  createdAt: string;
};

export function ProductDetailDialog({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
      >
        View
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
<div className="w-full max-w-4xl rounded-lg bg-card shadow-2xl border my-8 max-h-[90vh] overflow-y-auto"> 
             <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Product Details</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-lg border overflow-hidden bg-muted/30">
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[selectedImage]?.url}
                      alt={product.name}
                      className="w-full h-80 object-contain"
                    />
                  ) : (
                    <div className="w-full h-80 flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="h-16 w-16 mb-2" />
                      <span className="text-sm">No image available</span>
                    </div>
                  )}
                </div>

                {product.images?.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((img, i) => (
                      <button
                        key={img.key}
                        onClick={() => setSelectedImage(i)}
                        className={`flex-shrink-0 h-20 w-20 rounded-md border-2 overflow-hidden transition-all cursor-pointer ${
                          i === selectedImage ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                        }`}
                      >
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.stock === 0
                          ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          : product.stock <= 5
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">Price</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₹{product.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">SKU</div>
                      <div className="text-sm font-medium">{product.sku}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">Category</div>
                      <div className="text-sm font-medium">{product.category}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Description</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t text-xs text-muted-foreground">
                  Created: {new Date(product.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
