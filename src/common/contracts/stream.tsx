export const streamContract = {
  name: 'stream',
  source: `;; stream contract

(define-constant ERR_STREAM_NOT_FOUND (err u1004))

(define-map streams
  uint
  {
    start-block: uint,
    recipient: principal,
    sender: principal,
  }
)

(define-data-var next-stream-id uint u1)

(define-public (make-stream (recipient principal))
  (let ((stream-id (var-get next-stream-id)))
    (map-set streams
      stream-id
      {
        start-block: block-height,
        recipient: recipient,
        sender: tx-sender,
      }
    )
    (ok (var-set next-stream-id (+ stream-id u1)))
  )
)

(define-public (get-stream (stream-id uint))
  (ok (unwrap! (map-get? streams stream-id) ERR_STREAM_NOT_FOUND))
)
`,
};
