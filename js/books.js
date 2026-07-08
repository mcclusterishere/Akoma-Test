/* ============================================================
   The Akoma catalog — sell every book, even the ones not on
   the shelf. Search runs on the Open Library API straight from
   the visitor's browser (free, no key, no backend); every result
   orders THROUGH Akoma, so the sale never leaves the house.
   Swap ORDER_EMAIL for the shop's real orders inbox.
   ============================================================ */
(function () {
  "use strict";
  var ORDER_EMAIL = "hello@visitakoma.com"; // ← the shop's orders inbox
  var API = "https://openlibrary.org/search.json";
  var COVERS = "https://covers.openlibrary.org/b/id/";

  var $ = function (id) { return document.getElementById(id); };
  var grid = $("bkGrid");
  var mode = "all";
  var lastDocs = [];

  function esc(s) { var d = document.createElement("i"); d.textContent = s == null ? "" : s; return d.innerHTML; }

  function search(q) {
    grid.innerHTML = '<p class="bhint">Searching the stacks…</p>';
    var url = API + "?q=" + encodeURIComponent(q) +
      "&limit=24&fields=key,title,author_name,first_publish_year,cover_i,isbn,edition_count";
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      lastDocs = data.docs || [];
      render();
    }).catch(function () {
      grid.innerHTML = '<p class="bhint">The catalog didn’t answer — check your connection and try again. ' +
        'Or just ask at the counter: if it exists, we can get it.</p>';
    });
  }

  function isRare(d) { return d.first_publish_year && d.first_publish_year <= 1975; }

  function render() {
    var docs = lastDocs.filter(function (d) {
      if (mode === "rare") return isRare(d);
      if (mode === "new") return d.first_publish_year && d.first_publish_year >= 2000;
      return true;
    });
    if (!docs.length) {
      grid.innerHTML = '<p class="bhint">Nothing on that shelf' +
        (mode !== "all" ? " under this filter — try Everything" : "") +
        ". If you know it exists, ask at the counter: special orders are our sport.</p>";
      return;
    }
    grid.innerHTML = docs.map(function (d, i) {
      var by = (d.author_name || []).slice(0, 2).join(", ");
      var yr = d.first_publish_year || "";
      return '<article class="bcard">' +
        '<div class="bcard__cover">' +
        (d.cover_i ? '<img loading="lazy" src="' + COVERS + d.cover_i + '-M.jpg" alt="' + esc(d.title) + ' cover">'
                   : "<span>❤</span>") + "</div>" +
        '<div class="bcard__body">' +
        (isRare(d) ? '<span class="bcard__tag">Rare / vintage · ' + yr + "</span>" :
          (yr ? '<span class="bcard__tag" style="color:rgba(245,236,220,0.5)">' + yr + "</span>" : "")) +
        "<b>" + esc(d.title) + "</b>" +
        "<small>" + esc(by) + "</small>" +
        '<button class="bcard__order" type="button" data-i="' + i + '">Order through Akoma</button>' +
        "</div></article>";
    }).join("");
    grid.querySelectorAll(".bcard__order").forEach(function (b) {
      b.addEventListener("click", function () { openOrder(docs[+b.getAttribute("data-i")]); });
    });
  }

  /* the order sheet: v1 sends a structured email order — swap for the
     POS / IndieCommerce cart when the rail lands */
  function openOrder(d) {
    var isbn = (d.isbn || [])[0] || "";
    $("oTitle").textContent = d.title;
    $("oMeta").textContent = (d.author_name || []).join(", ") +
      (d.first_publish_year ? " · first published " + d.first_publish_year : "") +
      (isbn ? " · ISBN " + isbn : "");
    $("oGo").href = "mailto:" + ORDER_EMAIL +
      "?subject=" + encodeURIComponent("Book order — " + d.title) +
      "&body=" + encodeURIComponent(
        "I'd like to order:\n\n" +
        "Title: " + d.title + "\n" +
        "Author: " + (d.author_name || []).join(", ") + "\n" +
        (isbn ? "ISBN: " + isbn + "\n" : "") +
        (d.first_publish_year ? "First published: " + d.first_publish_year + "\n" : "") +
        "\nMy name:\nPickup or ship:\nPhone:\n");
    $("oSheet").hidden = false;
  }
  $("oX").addEventListener("click", function () { $("oSheet").hidden = true; });
  $("oSheet").addEventListener("click", function (e) { if (e.target === $("oSheet")) $("oSheet").hidden = true; });

  $("bkForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = $("bkQ").value.trim();
    if (q) search(q);
  });
  $("bkFilters").querySelectorAll(".chip").forEach(function (c) {
    c.addEventListener("click", function () {
      mode = c.getAttribute("data-mode");
      $("bkFilters").querySelectorAll(".chip").forEach(function (x) { x.classList.toggle("is-on", x === c); });
      if (lastDocs.length) render();
    });
  });

  $("yr").textContent = new Date().getFullYear();
})();
