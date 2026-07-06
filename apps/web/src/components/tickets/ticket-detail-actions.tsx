"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  assignTicketAction,
  createTicketCommentAction,
  type TicketActionState,
  updateTicketStatusAction,
} from "@/app/(protected)/tickets/actions";
import {
  ticketStatusLabels,
  ticketStatusOptions,
} from "@/lib/constants/ticket-labels";
import { roleLabels } from "@/lib/constants/role-labels";
import type { TicketAssigneeOption, TicketStatus } from "@/types/domain";

import styles from "./ticket-detail-actions.module.css";

const initialActionState: TicketActionState = {
  error: null,
  success: null,
};

type TicketDetailActionsProps = {
  ticketId: string;
  currentStatus: TicketStatus;
  currentAssigneeId: string | null;
  assignees: TicketAssigneeOption[];
};

function ActionMessage({ state }: { state: TicketActionState }) {
  if (state.error) {
    return (
      <p className={styles.errorMessage} role="alert">
        {state.error}
      </p>
    );
  }

  if (state.success) {
    return <p className={styles.successMessage}>{state.success}</p>;
  }

  return null;
}

export function TicketDetailActions({
  ticketId,
  currentStatus,
  currentAssigneeId,
  assignees,
}: TicketDetailActionsProps) {
  const router = useRouter();
  const commentFormRef = useRef<HTMLFormElement>(null);
  const [assignState, assignFormAction, assignPending] = useActionState(
    assignTicketAction,
    initialActionState,
  );
  const [statusState, statusFormAction, statusPending] = useActionState(
    updateTicketStatusAction,
    initialActionState,
  );
  const [commentState, commentFormAction, commentPending] = useActionState(
    createTicketCommentAction,
    initialActionState,
  );

  useEffect(() => {
    if (assignState.success || statusState.success || commentState.success) {
      router.refresh();
    }
  }, [assignState.success, commentState.success, router, statusState.success]);

  useEffect(() => {
    if (commentState.success) {
      commentFormRef.current?.reset();
    }
  }, [commentState.success]);

  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <div>
          <span className={styles.eyebrow}>Teknik Islemler</span>
          <h2>Atama, durum ve yorum yonetimi</h2>
        </div>
        <p>
          Bu formlar yalnizca technician ve admin kullanicilar icin aciktir. Tum
          islemler mevcut RLS ve trigger kurallari ile dogrulanir.
        </p>
      </header>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h3>Ticket atama</h3>
          <form action={assignFormAction} className={styles.form}>
            <input type="hidden" name="ticketId" value={ticketId} />
            <label className={styles.field}>
              <span>Atanacak kullanici</span>
              <select
                name="assignedTo"
                defaultValue={currentAssigneeId ?? assignees[0]?.id ?? ""}
              >
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.fullName} - {roleLabels[assignee.role]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={assignPending || assignees.length === 0}
            >
              {assignPending ? "Atama kaydediliyor..." : "Atamayi Kaydet"}
            </button>
            <ActionMessage state={assignState} />
          </form>
        </article>

        <article className={styles.card}>
          <h3>Durum degisikligi</h3>
          <form action={statusFormAction} className={styles.form}>
            <input type="hidden" name="ticketId" value={ticketId} />
            <label className={styles.field}>
              <span>Yeni durum</span>
              <select name="status" defaultValue={currentStatus}>
                {ticketStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {ticketStatusLabels[status]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={statusPending}
            >
              {statusPending ? "Durum kaydediliyor..." : "Durumu Guncelle"}
            </button>
            <ActionMessage state={statusState} />
          </form>
        </article>

        <article className={`${styles.card} ${styles.commentCard}`}>
          <h3>Yorum ekle</h3>
          <form ref={commentFormRef} action={commentFormAction} className={styles.form}>
            <input type="hidden" name="ticketId" value={ticketId} />
            <label className={styles.field}>
              <span>Yorum metni</span>
              <textarea
                name="content"
                rows={5}
                placeholder="Teknik durum, kullanici bilgilendirmesi veya cozum notunu yazin."
                required
              />
            </label>

            <label className={styles.checkbox}>
              <input type="checkbox" name="isInternal" />
              <span>Ic not olarak ekle</span>
            </label>

            <button
              type="submit"
              className={styles.primaryButton}
              disabled={commentPending}
            >
              {commentPending ? "Yorum ekleniyor..." : "Yorum Ekle"}
            </button>
            <ActionMessage state={commentState} />
          </form>
        </article>
      </div>
    </section>
  );
}
