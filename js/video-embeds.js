/**
 * Fills [data-video-embed] placeholders on videos.html.
 * Set data-youtube-id="VIDEO_ID" (from YouTube → Share → Embed) or data-vimeo-id for Vimeo.
 * Leave IDs empty for a harmless “Coming soon” message until clips are wired.
 */
(function () {
  function buildIframe(attrs) {
    var title = attrs.title || "Embedded video";
    var common =
      ' loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" title="' +
      title.replace(/"/g, "&quot;") +
      '"';
    if (attrs.youtubeId) {
      var y =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(attrs.youtubeId.trim()) +
        "?rel=0";
      return (
        '<iframe class="video-embed-frame"' +
        common +
        ' src="' +
        y +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>'
      );
    }
    if (attrs.vimeoId) {
      var v = "https://player.vimeo.com/video/" + encodeURIComponent(attrs.vimeoId.trim());
      return '<iframe class="video-embed-frame"' + common + ' src="' + v + '"></iframe>';
    }
    return (
      '<p class="video-pending-msg">Edited segment placeholder — paste a YouTube or Vimeo embed ID into <code>data-youtube-id</code> / <code>data-vimeo-id</code> on this block in videos.html.</p>'
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-video-embed]").forEach(function (node) {
      var title = node.getAttribute("data-title") || "Video";
      var yt = (node.getAttribute("data-youtube-id") || "").trim();
      var vm = (node.getAttribute("data-vimeo-id") || "").trim();
      node.innerHTML = buildIframe({ title: title, youtubeId: yt, vimeoId: vm });
    });
  });
})();
