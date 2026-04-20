"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import ContentLoader from "@/components/shared/content-loader";
import { useDetailData } from "@/hooks/use-list-data";

interface ItemDetail {
  id: string;
  item_id?: string;
  item_name?: string;
  item_category?: string;
  unit_of_measurement?: string;
  unit_price?: string | number;
  vendor_name?: string;
  created_at?: string;
}

export default function ItemDetailPage() {
  const router = useRouter();
  const routeParams = useParams<{ itemId?: string | string[] }>();
  const itemId = Array.isArray(routeParams.itemId)
    ? (routeParams.itemId[0] ?? null)
    : (routeParams.itemId ?? null);
  const { data, error, isLoading } = useDetailData<ItemDetail>(
    itemId ? `/api/admin/items/${itemId}` : null,
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const item = data?.data;

  return (
    <div className="space-y-6">
      <DetailGrid
        title="Item Detail"
        subtitle="Review the catalog item."
        onClose={() => router.push("/items")}
        className="rounded-2xl border-border/60 bg-card p-4 shadow-sm sm:p-6"
        fields={[
          { label: "UUID", value: item?.id },
          { label: "Item ID", value: item?.item_id },
          { label: "Item", value: item?.item_name },
          { label: "Category", value: item?.item_category },
          { label: "Unit", value: item?.unit_of_measurement },
          { label: "Unit Price", value: item?.unit_price },
          { label: "Vendor", value: item?.vendor_name },
          { label: "Created", value: item?.created_at },
        ]}
      />
    </div>
  );
}
