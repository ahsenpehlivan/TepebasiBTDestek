import Link from "next/link";
import { notFound } from "next/navigation";

import { TicketDetailActions } from "@/components/tickets/ticket-detail-actions";
import {
  ticketPriorityLabels,
  ticketStatusLabels,
} from "@/lib/constants/ticket-labels";
import {
  formatTicketDateTime,
  getTicketCategoryLabel,
} from "@/lib/tickets/formatters";
import { loadTicketDetail } from "@/lib/tickets/queries";

import styles from "./ticket-detail.module.css";

type TicketDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function DetailBadge({
  label,
  value,
  kind,
}: {
  label: string;
  value: string;
  kind: "status" | "priority";
}) {
  return (
    <div className={styles.badgeWrap}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.badge} data-kind={kind} data-value={value}>
        {kind === "status"
          ? ticketStatusLabels[value as keyof typeof ticketStatusLabels]
          : ticketPriorityLabels[value as keyof typeof ticketPriorityLabels]}
      </span>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const { id } = await params;
  const { ticket, comments, history, assignees, hasError } =
    await loadTicketDetail(id);

  if (hasError) {
    return (
      <section className={styles.messageCard}>
        <h1>Ticket detayi su anda yuklenemedi</h1>
        <p>
          Ticket detayi okunurken bir sorun olustu. Supabase erisimini kontrol edip
          sayfayi yenileyin.
        </p>
        <Link href="/tickets" className={styles.backLink}>
          Ticket listesine don
        </Link>
      </section>
    );
  }

  if (!ticket) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <section className={styles.heroCard}>
        <Link href="/tickets" className={styles.backLink}>
          Ticket listesine don
        </Link>

        <div className={styles.heroHeader}>
          <div>
            <span className={styles.eyebrow}>Ticket Detayi</span>
            <h1>
              #{ticket.ticketNumber} - {ticket.title}
            </h1>
            <p>{ticket.description}</p>
          </div>

          <div className={styles.badgeRow}>
            <DetailBadge label="Durum" value={ticket.status} kind="status" />
            <DetailBadge label="Oncelik" value={ticket.priority} kind="priority" />
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Ticket Ozeti</h2>
          <dl className={styles.detailList}>
            <div>
              <dt>Kategori</dt>
              <dd>{getTicketCategoryLabel(ticket.category)}</dd>
            </div>
            <div>
              <dt>Olusturan</dt>
              <dd>{ticket.createdByName ?? "Belirsiz"}</dd>
            </div>
            <div>
              <dt>Birim</dt>
              <dd>{ticket.departmentName ?? "Belirsiz"}</dd>
            </div>
            <div>
              <dt>Atanan</dt>
              <dd>{ticket.assignedToName ?? "Atanmamis"}</dd>
            </div>
            <div>
              <dt>Olusturulma</dt>
              <dd>{formatTicketDateTime(ticket.createdAt)}</dd>
            </div>
            <div>
              <dt>Son Guncelleme</dt>
              <dd>{formatTicketDateTime(ticket.updatedAt)}</dd>
            </div>
            <div>
              <dt>Atama Zamani</dt>
              <dd>{ticket.assignedAt ? formatTicketDateTime(ticket.assignedAt) : "Yok"}</dd>
            </div>
            <div>
              <dt>Hedef Tarih</dt>
              <dd>{ticket.dueAt ? formatTicketDateTime(ticket.dueAt) : "Belirtilmedi"}</dd>
            </div>
            <div>
              <dt>Cozum Zamani</dt>
              <dd>
                {ticket.resolvedAt ? formatTicketDateTime(ticket.resolvedAt) : "Yok"}
              </dd>
            </div>
            <div>
              <dt>Kapanis Zamani</dt>
              <dd>{ticket.closedAt ? formatTicketDateTime(ticket.closedAt) : "Yok"}</dd>
            </div>
          </dl>
        </article>

        <article className={styles.card}>
          <h2>Cihaz Ozeti</h2>
          {ticket.device ? (
            <dl className={styles.detailList}>
              <div>
                <dt>Envanter Etiketi</dt>
                <dd>{ticket.device.assetTag}</dd>
              </div>
              <div>
                <dt>Marka / Model</dt>
                <dd>
                  {ticket.device.brand} {ticket.device.model}
                </dd>
              </div>
              <div>
                <dt>Cihaz Tipi</dt>
                <dd>{ticket.device.deviceType}</dd>
              </div>
              <div>
                <dt>Cihaz Durumu</dt>
                <dd>{ticket.device.status}</dd>
              </div>
              <div>
                <dt>Not</dt>
                <dd>{ticket.device.notes ?? "Ek not bulunmuyor."}</dd>
              </div>
            </dl>
          ) : (
            <p className={styles.helperText}>
              Bu ticket icin iliskili cihaz kaydi bulunmuyor.
            </p>
          )}
        </article>
      </section>

      <TicketDetailActions
        ticketId={ticket.id}
        currentStatus={ticket.status}
        currentAssigneeId={ticket.assignedToId}
        assignees={assignees}
      />

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Yorumlar</h2>
          {comments.length === 0 ? (
            <p className={styles.helperText}>Bu ticket icin henuz yorum bulunmuyor.</p>
          ) : (
            <div className={styles.stack}>
              {comments.map((comment) => (
                <article key={comment.id} className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <strong>{comment.authorName ?? "Belirsiz Kullanici"}</strong>
                    <span
                      className={styles.commentBadge}
                      data-internal={comment.isInternal ? "true" : "false"}
                    >
                      {comment.isInternal ? "Ic Not" : "Genel Yorum"}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                  <time>{formatTicketDateTime(comment.createdAt)}</time>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className={styles.card}>
          <h2>Durum Gecmisi</h2>
          {history.length === 0 ? (
            <p className={styles.helperText}>Durum gecmisi kaydi bulunamadi.</p>
          ) : (
            <ol className={styles.historyList}>
              {history.map((item) => (
                <li key={item.id} className={styles.historyItem}>
                  <strong>{ticketStatusLabels[item.newStatus]}</strong>
                  <span>
                    {item.oldStatus
                      ? `${ticketStatusLabels[item.oldStatus]} -> ${ticketStatusLabels[item.newStatus]}`
                      : "Ilk ticket olusturma"}
                  </span>
                  <span>{item.changedByName ?? "Belirsiz Kullanici"}</span>
                  <time>{formatTicketDateTime(item.createdAt)}</time>
                  {item.note ? <p>{item.note}</p> : null}
                </li>
              ))}
            </ol>
          )}
        </article>
      </section>
    </div>
  );
}
