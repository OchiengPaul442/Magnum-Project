"use client";

import React from "react";

import PageHeader from "@/components/layout/page-header";
import DetailGrid from "@/components/shared/detail-grid";
import ErrorState from "@/components/shared/error-state";
import LoadingScreen from "@/components/shared/loading-screen";
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

interface CardDetailPageProps {
  params: { cardId: string };
}

export default function CardDetailPage({ params }: CardDetailPageProps) {
  const { cardId } = params;
  const { data, error, isLoading, mutate } = useDetailData<CardDetail>(
    `/api/admin/cards/${cardId}/`,
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState />;
  }

  const card = data?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Card Detail"
        subtitle="Card profile and assignment status."
        actions={
          <>
            <AssignCardDialog cardId={cardId} onSuccess={() => mutate()} />
            <ReplaceCardDialog cardId={cardId} onSuccess={() => mutate()} />
            <UpdateCardStatusDialog
              cardId={cardId}
              onSuccess={() => mutate()}
            />
          </>
        }
      />
      <DetailGrid
        title="Card Profile"
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
