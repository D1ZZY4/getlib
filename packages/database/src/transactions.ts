/**
 * @getlib/database - transaction boundary helper.
 *
 * Rules:
 * - Never call external providers (network, embeddings, crawlers) from
 *   inside the callback; open transactions must stay short.
 * - Keep tenant/project scope explicit at the call site.
 */
export interface Transactable<Tx> {
  transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T>;
}

export function withTransaction<Tx, T>(
  db: Transactable<Tx>,
  fn: (tx: Tx) => Promise<T>,
): Promise<T> {
  return db.transaction(fn);
}
