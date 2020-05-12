export const SampleContracts: readonly {
  readonly contractName: string;
  readonly contractSource: string;
}[] = [
  {
    contractName: 'hello-world-contract',
    contractSource: `(define-constant sender 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(define-constant recipient 'SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G)

(define-fungible-token novel-token-19)
(begin (ft-mint? novel-token-19 u12 sender))
(begin (ft-transfer? novel-token-19 u2 sender recipient))

(define-non-fungible-token hello-nft uint)
(begin (nft-mint? hello-nft u1 sender))
(begin (nft-mint? hello-nft u2 sender))
(begin (nft-transfer? hello-nft u1 sender recipient))

(define-public (test-emit-event)
    (begin
        (print "Event! Hello world")
        (ok u1)))
(begin (test-emit-event))

(define-public (test-event-types)
    (begin
        (unwrap-panic (ft-mint? novel-token-19 u3 recipient))
        (unwrap-panic (nft-mint? hello-nft u2 recipient))
        (unwrap-panic (stx-transfer? u60 tx-sender 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR))
        (unwrap-panic (stx-burn? u20 tx-sender))
        (ok u1)))

(define-map store ((key (buff 32))) ((value (buff 32))))
(define-public (get-value (key (buff 32)))
    (begin
        (match (map-get? store ((key key)))
            entry (ok (get value entry))
            (err 0))))
(define-public (set-value (key (buff 32)) (value (buff 32)))
    (begin
        (map-set store ((key key)) ((value value)))
        (ok u1)))`,
  },
  {
    contractName: 'kv-store',
    contractSource: `
    (define-map store ((key (buff 32))) ((value (buff 32))))

    (define-public (get-value (key (buff 32)))
        (match (map-get? store {key: key})
            entry (ok (get value entry))
            (err 0)))
    
    (define-public (set-value (key (buff 32)) (value (buff 32)))
        (begin
            (map-set store {key: key} {value: value})
            (ok u1)))`,
  },
  {
    contractName: 'status',
    contractSource: `(define-map statuses
  (
    (author principal)
  )
  (
    (status (buff 512))
  )
)

(define-read-only (get-status (author principal))
  (begin
    (print author)
    (default-to ""
      (get status (map-get? statuses {author: author}))
    )
  )
)

(define-public (write-status!
    (status (buff 512))
  )
  (begin
    (print tx-sender)
    (print status)
    (map-set statuses
      ((author tx-sender))
      ((status status))
    )
    (ok status)
  )
)`,
  },
  {
    contractName: 'stream',
    contractSource: `;; hello world

(define-public (say-hi)
  (ok "hello world")
)

(define-public (echo-number (val int))
  (ok val)
)

;; streams

(define-map streams
  ((id uint))
  (
    (start-block uint)
    (recipient principal)
    (sender principal)
  )
)

(define-data-var next-stream-id uint u1)

(define-public (make-stream
    (recipient principal)
  )
  (begin
    (map-set streams 
      ((id (var-get next-stream-id)))
      (
        (start-block block-height)
        (recipient recipient)
        (sender tx-sender)
      )
    )
    (var-set next-stream-id (+ (var-get next-stream-id) u1))
    (ok 'true)
  )
)

(define-public (get-stream
    (stream-id uint)
  )
  (
    ok
    (unwrap-panic
      (map-get? streams (tuple (id stream-id)))
    )
  )
)`,
  },
];
