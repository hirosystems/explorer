export const fungibleTokenContract = {
  name: 'fungible-token-contract',
  source: `(define-fungible-token example-token)

;; get the token balance of owner
(define-read-only (balance-of (owner principal))
  (begin
    (ok (ft-get-balance example-token owner))))

;; returns the total number of tokens
(define-read-only (total-supply)
  (ok (ft-get-supply example-token)))

;; returns the token name
(define-read-only (name)
  (ok "Example Token"))

;; the symbol or "ticker" for this token
(define-read-only (symbol)
  (ok "EXAMPLE"))

;; the number of decimals used
(define-read-only (decimals)
  (ok u8))

;; Transfers tokens to a recipient
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (if (is-eq tx-sender sender)
    (ft-transfer? example-token amount sender recipient)
    (err u4)))

;; Mint this token to a few people when deployed
(ft-mint? example-token u100000000000000 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA)
(ft-mint? example-token u100000000000000 'ST1TWA18TSWGDAFZT377THRQQ451D1MSEM69C761)
(ft-mint? example-token u12345 'ST50GEWRE7W5B02G3J3K19GNDDAPC3XPZPYQRQDW)`,
};
