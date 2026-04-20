"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import ContentLoader from "@/components/shared/content-loader";
import StatusBadge from "@/components/shared/status-badge";
import { useDetailData } from "@/hooks/use-list-data";
import AssignCardDialog from "@/components/cards/assign-card-dialog";
import ReplaceCardDialog from "@/components/cards/replace-card-dialog";
import UpdateCardStatusDialog from "@/components/cards/update-card-status-dialog";

interface CardDetail {
  id: string;
  card_id?: string;
  card_number?: string;
  card_serial_number?: string;
  student_name?: string;
  school_name?: string;
  status?: string;
  expiration_date?: string;
  created_at?: string;
}

export default function CardDetailPage() {
  const router = useRouter();
  const routeParams = useParams<{ cardId?: string | string[] }>();
  const cardId = Array.isArray(routeParams.cardId)
    ? (routeParams.cardId[0] ?? null)
    : (routeParams.cardId ?? null);
  const { data, error, isLoading, mutate } = useDetailData<CardDetail>(
    cardId ? `/api/admin/cards/${cardId}` : null,
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorState />;
  }

  const card = data?.data;

  return (
    <div className="space-y-6">
      <DetailGrid
        title="Card Detail"
        subtitle="Card profile and assignment status."
        onClose={() => router.push("/cards")}
        actions={
          <>
            <AssignCardDialog
              cardId={cardId ?? ""}
              onSuccess={() => mutate()}
            />
            <ReplaceCardDialog
              cardId={cardId ?? ""}
              onSuccess={() => mutate()}
            />
            <UpdateCardStatusDialog
              cardId={cardId ?? ""}
              onSuccess={() => mutate()}
            />
          </>
        }
        className="rounded-2xl border-border/60 bg-card p-4 shadow-sm sm:p-6"
        fields={[
          { label: "UUID", value: card?.id },
          { label: "Card ID", value: card?.card_id },
          { label: "Card Number", value: card?.card_number },
          { label: "Serial", value: card?.card_serial_number },
          { label: "Student", value: card?.student_name },
          { label: "School", value: card?.school_name },
          { label: "Status", value: <StatusBadge status={card?.status} /> },
          { label: "Expires", value: card?.expiration_date },
          { label: "Created", value: card?.created_at },
        ]}
      />
    </div>
  );
}
