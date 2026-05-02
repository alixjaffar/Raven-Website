(function () {
  "use strict";

  var cfg = window.MFR_SITE_REVIEWS || {};
  var url = (cfg.supabaseUrl || "").trim();
  var key = (cfg.supabaseAnonKey || "").trim();
  var TABLE = "site_reviews";

  function configured() {
    return url && key && url.indexOf("YOUR_") === -1 && key.indexOf("YOUR_") === -1;
  }

  function api(path, options) {
    return fetch(url + path, options).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error(t || res.statusText);
        });
      }
      if (res.status === 204) return null;
      return res.json();
    });
  }

  function headersGet() {
    return {
      apikey: key,
      Authorization: "Bearer " + key,
    };
  }

  function headersPost() {
    return {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };
  }

  function cardEl(row) {
    var fig = document.createElement("figure");
    fig.className = "testimonial-card";
    var bq = document.createElement("blockquote");
    bq.textContent = "\u201C" + String(row.comment || "").trim() + "\u201D";
    var cap = document.createElement("figcaption");
    var nameP = document.createElement("p");
    nameP.className = "byline-name";
    nameP.textContent = String(row.name || "").trim() || "Reader";
    var roleP = document.createElement("p");
    roleP.className = "byline-role";
    var role = String(row.role || "").trim();
    roleP.textContent = role || "Reader";
    cap.appendChild(nameP);
    cap.appendChild(roleP);
    fig.appendChild(bq);
    fig.appendChild(cap);
    return fig;
  }

  function renderGrid(grid, rows) {
    grid.innerHTML = "";
    if (!rows || !rows.length) {
      var empty = document.createElement("p");
      empty.className = "reviews-empty";
      empty.textContent = "No comments yet — yours can be first.";
      grid.appendChild(empty);
      return;
    }
    rows.forEach(function (row) {
      grid.appendChild(cardEl(row));
    });
  }

  function init() {
    var grid = document.getElementById("reviews-grid");
    var loading = document.getElementById("reviews-loading");
    var errEl = document.getElementById("reviews-error");
    var form = document.getElementById("review-form");
    var banner = document.getElementById("review-sent");
    var submitBtn = form && form.querySelector('[type="submit"]');

    if (!grid || !form) return;

    function showErr(msg) {
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.hidden = false;
    }
    function clearErr() {
      if (errEl) errEl.hidden = true;
    }

    if (!configured()) {
      if (loading) loading.hidden = true;
      showErr(
        "Reviews need a quick database hook-up: in reviews.html, set MFR_SITE_REVIEWS with your Supabase project URL and anon key (see the comment on that page)."
      );
      form.setAttribute("aria-disabled", "true");
      submitBtn.disabled = true;
      renderGrid(grid, []);
      return;
    }

    clearErr();
    api("/rest/v1/" + TABLE + "?select=*&order=created_at.desc", {
      method: "GET",
      headers: headersGet(),
    })
      .then(function (rows) {
        if (loading) loading.hidden = true;
        renderGrid(grid, rows);
      })
      .catch(function () {
        if (loading) loading.hidden = true;
        showErr("Could not load comments. Check that the Supabase table and row-level policies are set up.");
        renderGrid(grid, []);
      });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErr();

      var hp = form.querySelector(".reviews-hp");
      if (hp && hp.value) return;

      var name = (form.querySelector("#review-name") || {}).value || "";
      var role = (form.querySelector("#review-role") || {}).value || "";
      var comment = (form.querySelector("#review-quote") || {}).value || "";

      if (!name.trim() || !comment.trim()) return;

      var body = {
        name: name.trim(),
        role: role.trim() || null,
        comment: comment.trim(),
      };

      if (submitBtn) submitBtn.disabled = true;
      api("/rest/v1/" + TABLE, {
        method: "POST",
        headers: headersPost(),
        body: JSON.stringify(body),
      })
        .then(function (rows) {
          var row = rows && rows[0];
          if (row) {
            var emptyNote = grid.querySelector(".reviews-empty");
            if (emptyNote) emptyNote.remove();
            grid.insertBefore(cardEl(row), grid.firstChild);
          } else {
            return api("/rest/v1/" + TABLE + "?select=*&order=created_at.desc", {
              method: "GET",
              headers: headersGet(),
            }).then(function (all) {
              renderGrid(grid, all);
            });
          }
          form.reset();
          if (banner) {
            banner.hidden = false;
            banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        })
        .catch(function () {
          showErr("Could not post your comment. Check the Supabase insert policy and your network connection.");
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
