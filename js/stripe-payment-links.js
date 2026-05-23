/**
 * Stripe checkout + full-ebook PDF (Part 1 / $5 product removed for now).
 *
 * Live site: https://www.myfiveravens.com
 *
 * Full ebook ($12.99) — Stripe Payment Link confirmation:
 *   Set “Redirect customers to your website” to:
 *     https://www.myfiveravens.com/thank-you-full-ebook.html
 *
 * Email with download link:
 *   Stripe sends a receipt to the buyer’s email automatically. Use Stripe Dashboard settings
 *   (confirmation / customer emails) or a Zapier/Make step to attach or link your hosted PDF URL.
 *   The thank-you page below also offers an immediate PDF download as a backup.
 *
 * Full-book PDF URL (for emails or Zapier): https://www.myfiveravens.com/downloads/permanent-scars-full.pdf
 */
(function () {
  /** Live Payment Link for the full ebook only */
  var LINKS = {
    fullCheckout: "https://buy.stripe.com/dRm28q6kucoy48K7Mu7IY00",
  };

  var DOWNLOADS = {
    fullPdf: "/downloads/permanent-scars-full.pdf",
  };

  function readyStripe(url) {
    return (
      typeof url === "string" &&
      /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com)\//.test(url.trim())
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var fullBtn = document.getElementById("mfr-stripe-full");
    if (fullBtn && readyStripe(LINKS.fullCheckout)) {
      var v = LINKS.fullCheckout.trim();
      fullBtn.setAttribute("href", v);
      fullBtn.setAttribute("rel", "noopener noreferrer");
      fullBtn.removeAttribute("aria-disabled");
    }

    var dlFull = document.getElementById("mfr-download-full");
    if (dlFull) {
      dlFull.setAttribute("href", DOWNLOADS.fullPdf);
      dlFull.setAttribute("download", "permanent-scars-full.pdf");
    }
  });
})();
