export const statusContract = {
  name: 'status',
  source: `;; status contract

(define-map statuses
  principal
  { status: (buff 512) }
)

(define-read-only (get-status (author principal))
  (begin
    (print author)
    (default-to 0x (get status (map-get? statuses author)))
  )
)

(define-public (write-status (status (buff 512)))
  (begin
    (print tx-sender)
    (print status)
    (map-set statuses tx-sender { status: status })
    (ok status)
  )
)
`,
};
