/**
 * Stripe checkout + PDF paths — edit the LINKS and DOWNLOADS objects below.
 *
 * Live site: https://www.myfiveravens.com
 *
 * Stripe Dashboard (each Payment Link → after payment / confirmation):
 *   Redirect customers to your website:
 *     Part 1:    https://www.myfiveravens.com/thank-you-part1.html
 *     Full PDF: https://www.myfiveravens.com/thank-you-full-ebook.html
 *
 * Host your PDFs at the paths in DOWNLOADS (upload the folder `downloads/` with your files).
 * PDF filenames are gitignored so they are not committed by mistake.
 *
 * Security: thank-you URLs are public. For stricter delivery, use Stripe webhooks or email with unique links.
 */
(function () {
  /** Paste each Payment Link URL from Stripe (starts with https://buy.stripe.com/… or checkout…) */
  var LINKS = {
    part1Checkout: "https://buy.stripe.com/fZu5kC6ku88i5cO1o67IY01",
    fullCheckout: "https://buy.stripe.com/dRm28q6kucoy48K7Mu7IY00",
  };

  /** Files you upload to /downloads/ on your host (relative to site root). */
  var DOWNLOADS = {
    part1Pdf: "downloads/permanent-scars-part1.pdf",
    fullPdf: "downloads/permanent-scars-full.pdf",
  };

  function readyStripe(url) {
    return (
      typeof url === "string" &&
      /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com)\//.test(url.trim())
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var partBtn = document.getElementById("mfr-stripe-part1");
    if (partBtn && readyStripe(LINKS.part1Checkout)) {
      var u = LINKS.part1Checkout.trim();
      partBtn.setAttribute("href", u);
      partBtn.setAttribute("rel", "noopener noreferrer");
      partBtn.removeAttribute("aria-disabled");
    }

    var fullBtn = document.getElementById("mfr-stripe-full");
    if (fullBtn && readyStripe(LINKS.fullCheckout)) {
      var v = LINKS.fullCheckout.trim();
      fullBtn.setAttribute("href", v);
      fullBtn.setAttribute("rel", "noopener noreferrer");
      fullBtn.removeAttribute("aria-disabled");
    }

    var dlPart = document.getElementById("mfr-download-part1");
    if (dlPart) {
      dlPart.setAttribute("href", DOWNLOADS.part1Pdf);
      dlPart.setAttribute("download", "");
    }

    var dlFull = document.getElementById("mfr-download-full");
    if (dlFull) {
      dlFull.setAttribute("href", DOWNLOADS.fullPdf);
      dlFull.setAttribute("download", "");
    }
  });
})();
