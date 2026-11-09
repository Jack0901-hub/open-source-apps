/* List + detail for the open-source catalog. One data file, two pages. */
(function () {
  "use strict";

  var PAGE = 24;
  var KEY_LANG = "ebook-vault-lang";
  var KEY_THEME = "ebook-vault-theme";
  var CATALOG = window.OPEN_SOURCE_CATALOG || [];
  var INDEX = CATALOG.map(searchText);
  var state = { platform: "all", cat: "", shown: PAGE };
  var COLORS = [
    ["#4c1d95", "#7c3aed"],
    ["#1e3a5f", "#2563eb"],
    ["#7c2d12", "#c2410c"],
    ["#14532d", "#15803d"],
    ["#831843", "#be185d"],
    ["#1f2937", "#4b5563"]
  ];

  var DICT = {
    zh: {
      docTitle: "开源软件 · 书海拾贝",
      brand: "书海拾贝",
      home: "首页",
      books: "书籍",
      papers: "论文",
      software: "Mac 软件",
      openSource: "开源软件",
      lora: "LoRA",
      helpButton: "帮助",
      githubHotHint: "GitHub 热门开源",
      footerLead: "本站发布的内容若侵犯到您的权益，",
      footerContact: "请联系我们",
      footerTail: "，我们将及时处理！",
      footerNote: "书籍与论文由网络公开资源整理，软件来自网络公开分享；本站不存储、不复制、不传播任何文件。",
      searchPlaceholder: "搜索软件名称、简介、许可证或类别",
      searchAria: "搜索开源软件",
      filtersAria: "平台与类别",
      lead: "共 {n} 款开源软件",
      count: "当前显示 {shown} / {total} 款",
      loadMore: "加载更多（已显示 {shown} / {total}）",
      emptyTitle: "没有找到相关软件",
      emptyHint: "试试更短的名称，或换一个平台。",
      emptyReset: "清空搜索",
      missingTitle: "没有找到这个软件",
      missingHint: "这个链接不在当前目录里。",
      backToList: "返回开源软件目录",
      category: "类别",
      allCategories: "全部类别",
      about: "简介",
      noDescription: "目录里没有单独的简介。",
      platform: "平台",
      license: "许可证",
      stars: "Star",
      version: "版本",
      released: "发布时间",
      download: "下载",
      downloadLater: "下载链接稍后补充",
      openPage: "打开下载页",
      quarkSource: "夸克网盘",
      ctSource: "城通网盘",
      codeLine: "提取码：{code}",
      copyCode: "复制提取码",
      copied: "已复制 ✓",
      copyFail: "复制失败",
      modalClose: "关闭",
      project: "项目主页",
      website: "官网",
      details: "详情",
      platAll: "全部",
      platBoth: "双平台",
      platMac: "Mac",
      platWin: "Windows",
      spineBoth: "双平台",
      spineMac: "Mac",
      spineWin: "Win",
      platformBoth: "Mac、Windows",
      platformMac: "Mac",
      platformWin: "Windows",
      loadFail: "目录没有载入。"
    },
    en: {
      docTitle: "Open Source · Ebook Vault",
      brand: "Ebook Vault",
      home: "Home",
      books: "Books",
      papers: "Papers",
      software: "Mac Software",
      openSource: "Open Source",
      lora: "LoRA",
      helpButton: "Help",
      githubHotHint: "GitHub Trending",
      footerLead: "If any content infringes your rights, ",
      footerContact: "contact us",
      footerTail: ", and we will handle it promptly.",
      footerNote: "Books and papers are compiled from public resources; apps are shared publicly. We do not host, copy or distribute any files.",
      searchPlaceholder: "Search name, description, license, or category",
      searchAria: "Search open-source software",
      filtersAria: "Platform and category",
      lead: "{n} open-source apps",
      count: "Showing {shown} / {total}",
      loadMore: "Load more (showing {shown} / {total})",
      emptyTitle: "No matching software",
      emptyHint: "Try a shorter name, or another platform.",
      emptyReset: "Clear search",
      missingTitle: "This app was not found",
      missingHint: "That link is not in the current catalog.",
      backToList: "Back to open source",
      category: "Category",
      allCategories: "All categories",
      about: "About",
      noDescription: "The catalog has no separate description.",
      platform: "Platforms",
      license: "License",
      stars: "Stars",
      version: "Version",
      released: "Released",
      download: "Download",
      downloadLater: "Download link coming later",
      openPage: "Open page",
      quarkSource: "Quark Drive",
      ctSource: "Ctfile",
      codeLine: "Code: {code}",
      copyCode: "Copy code",
      copied: "Code copied",
      copyFail: "Copy failed",
      modalClose: "Close",
      project: "Project page",
      website: "Website",
      details: "Details",
      platAll: "All",
      platBoth: "Mac & Windows",
      platMac: "Mac",
      platWin: "Windows",
      spineBoth: "Both",
      spineMac: "Mac",
      spineWin: "Win",
      platformBoth: "Mac and Windows",
      platformMac: "Mac",
      platformWin: "Windows",
      loadFail: "The catalog did not load."
    }
  };

  function lang() {
    return document.documentElement.getAttribute("data-site-lang") === "en" ? "en" : "zh";
  }

  function t(key) {
    var pack = DICT[lang()] || DICT.zh;
    return pack[key] != null ? pack[key] : (DICT.zh[key] || "");
  }

  function fill(template, vars) {
    return String(template).replace(/\{(\w+)\}/g, function (_, key) {
      return vars[key] != null ? String(vars[key]) : "";
    });
  }

  function num(value) {
    return Number(value || 0).toLocaleString("en-US");
  }

  function searchText(item) {
    var bits = [
      item.name, item.zh, item.en, item.license, item.cat, item.tags,
      item.repo, item.version, item.site, item.platform
    ];
    if (item.platform === "mac" || item.platform === "both") bits.push("mac macos 苹果");
    if (item.platform === "win" || item.platform === "both") bits.push("windows win 微软");
    if (item.platform === "both") bits.push("双平台 both");
    return bits.join("\n").toLowerCase();
  }

  function blurb(item) {
    if (!item) return "";
    if (lang() === "zh") return item.zh || item.en || "";
    return item.en || item.zh || "";
  }

  function platformLabel(key) {
    if (key === "both") return t("platformBoth");
    if (key === "mac") return t("platformMac");
    if (key === "win") return t("platformWin");
    return "";
  }

  function chipLabel(key) {
    if (key === "both") return t("platBoth");
    if (key === "mac") return t("platMac");
    if (key === "win") return t("platWin");
    return t("platAll");
  }

  function detailHref(id) {
    return "open-source-app.html?id=" + encodeURIComponent(id);
  }

  function findItem(id) {
    var i;
    for (i = 0; i < CATALOG.length; i += 1) {
      if (CATALOG[i].id === id) return CATALOG[i];
    }
    return null;
  }

  function colors(id) {
    var hash = 0;
    var i;
    for (i = 0; i < id.length; i += 1) hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
    return COLORS[hash % COLORS.length];
  }

  function mark(name) {
    var text = String(name || "").trim();
    var parts;
    if (!text) return "•";
    if (/[\u4e00-\u9fff]/.test(text.charAt(0))) return text.slice(0, 1);
    parts = text.split(/[^A-Za-z0-9]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    return text.slice(0, 2).toUpperCase();
  }

  function avatarUrl(item) {
    var id = String(item && item.id || "");
    var cut = id.indexOf("--");
    var owner = cut > 0 ? id.slice(0, cut) : "";
    var ext;
    if (!/^[A-Za-z0-9_.-]+$/.test(owner)) return "";
    ext = window.OPEN_SOURCE_AVATARS && window.OPEN_SOURCE_AVATARS[owner];
    if (ext !== "jpg" && ext !== "png") return "";
    return "assets/open-source-avatars/" + owner + "." + ext;
  }

  function mountAvatar(slot, item) {
    var letters = document.createElement("span");
    var url = avatarUrl(item);
    var img;
    letters.className = "os-avatar-fallback";
    letters.setAttribute("aria-hidden", "true");
    letters.textContent = mark(item && item.name);
    slot.appendChild(letters);
    if (!url) return;
    img = document.createElement("img");
    img.className = "os-avatar";
    img.alt = item.name || "";
    img.src = url;
    img.addEventListener("error", function () { img.remove(); });
    slot.appendChild(img);
  }

  function releaseDate(item) {
    var raw = String(item && (item.released || item.published || item.date) || "").trim();
    var match = raw.match(/^(\d{4})[-/.](\d{2})[-/.](\d{2})/);
    var month;
    var day;
    if (!match) return "";
    month = Number(match[2]);
    day = Number(match[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return "";
    return match[1] + "-" + match[2] + "-" + match[3];
  }

  function applyChrome() {
    var pack = DICT[lang()] || DICT.zh;
    var button = document.getElementById("lang-toggle");
    document.documentElement.lang = lang() === "en" ? "en" : "zh-CN";
    document.documentElement.setAttribute("data-site-lang", lang());
    if (!document.body.dataset.itemTitle) document.title = pack.docTitle;
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
      var key = el.getAttribute("data-i18n");
      if (pack[key] != null) el.textContent = pack[key];
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-placeholder]"), function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (pack[key] != null) el.setAttribute("placeholder", pack[key]);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-aria]"), function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (pack[key] == null) return;
      el.setAttribute("aria-label", pack[key]);
      if (el.classList.contains("header-github-hot")) el.setAttribute("title", pack[key]);
    });
    if (button) {
      var toEn = lang() !== "en";
      button.textContent = toEn ? "EN" : "中";
      button.setAttribute("aria-label", toEn ? "Switch to English" : "切换到中文");
      button.setAttribute("title", toEn ? "Switch to English" : "切换到中文");
    }
  }

  function bindChrome() {
    var langButton = document.getElementById("lang-toggle");
    var themeButton = document.getElementById("theme-toggle");
    function paintTheme(theme) {
      var dark = theme === "dark";
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
      if (themeButton) {
        themeButton.textContent = dark ? "☀️" : "🌙";
        themeButton.setAttribute("aria-pressed", dark ? "true" : "false");
      }
    }
    paintTheme(document.documentElement.getAttribute("data-theme") || "dark");
    if (themeButton) {
      themeButton.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        paintTheme(next);
        try { localStorage.setItem(KEY_THEME, next); } catch (e) {}
      });
    }
    if (langButton) {
      langButton.addEventListener("click", function () {
        var next = lang() === "en" ? "zh" : "en";
        document.documentElement.setAttribute("data-site-lang", next);
        try { localStorage.setItem(KEY_LANG, next); } catch (e) {}
        applyChrome();
        syncHeaderOffset();
        if (document.body.getAttribute("data-page") === "detail") renderDetail();
        else renderList(false);
        refreshDownloadDialog();
      });
    }
    applyChrome();
    syncHeaderOffset();
    window.addEventListener("resize", syncHeaderOffset);
    if (window.ResizeObserver) {
      var bar = document.querySelector(".topbar");
      if (bar) {
        try { new ResizeObserver(syncHeaderOffset).observe(bar); } catch (e) {}
      }
    }
  }

  function syncHeaderOffset() {
    var bar = document.querySelector(".topbar");
    if (!bar) return;
    var height = Math.ceil(bar.getBoundingClientRect().height);
    if (height > 0) document.documentElement.style.setProperty("--header-h", height + "px");
  }

  function categories() {
    var counts = Object.create(null);
    var names = [];
    CATALOG.forEach(function (item) {
      if (!item.cat) return;
      if (!counts[item.cat]) names.push(item.cat);
      counts[item.cat] = (counts[item.cat] || 0) + 1;
    });
    names.sort(function (a, b) { return a.localeCompare(b, "zh"); });
    return names.map(function (name) { return { key: name, count: counts[name] }; });
  }

  function onPlatform(item, key) {
    if (!key || key === "all") return true;
    if (key === "both") return item.platform === "both";
    if (key === "mac") return item.platform === "mac" || item.platform === "both";
    if (key === "win") return item.platform === "win" || item.platform === "both";
    return false;
  }

  function platformCount(key) {
    if (key === "all") return CATALOG.length;
    return CATALOG.filter(function (item) { return onPlatform(item, key); }).length;
  }

  function queryText() {
    var input = document.getElementById("q");
    return input && input.value ? input.value.trim().toLowerCase() : "";
  }

  function matchedItems() {
    var query = queryText();
    var tokens = query ? query.split(/\s+/).filter(Boolean) : [];
    var out = [];
    CATALOG.forEach(function (item, index) {
      if (!onPlatform(item, state.platform)) return;
      if (state.cat && item.cat !== state.cat) return;
      var hay = INDEX[index];
      var ok = tokens.every(function (token) { return hay.indexOf(token) >= 0; });
      if (ok) out.push(item);
    });
    return out;
  }

  function renderFilters() {
    var box = document.getElementById("os-platforms");
    var select = document.getElementById("os-cat");
    var lead = document.getElementById("os-lead");
    var keys = ["all", "mac", "win", "both"];
    if (lead) lead.textContent = fill(t("lead"), { n: num(CATALOG.length) });
    if (box) {
      box.innerHTML = "";
      keys.forEach(function (key) {
        var button = document.createElement("button");
        var text = document.createElement("span");
        var count = document.createElement("span");
        button.type = "button";
        button.className = "chip" + (state.platform === key ? " active" : "");
        button.setAttribute("data-platform", key);
        button.setAttribute("aria-pressed", state.platform === key ? "true" : "false");
        text.className = "chip-text";
        text.textContent = chipLabel(key);
        count.className = "chip-count";
        count.textContent = String(platformCount(key));
        button.appendChild(text);
        button.appendChild(count);
        box.appendChild(button);
      });
    }
    if (select) {
      var previous = state.cat;
      select.innerHTML = "";
      var all = document.createElement("option");
      all.value = "";
      all.textContent = t("allCategories");
      select.appendChild(all);
      categories().forEach(function (cat) {
        var option = document.createElement("option");
        option.value = cat.key;
        option.textContent = cat.key + " (" + cat.count + ")";
        select.appendChild(option);
      });
      select.value = previous;
      if (select.value !== previous) {
        state.cat = "";
        select.value = "";
      }
    }
  }

  function renderCard(item) {
    var pair = colors(item.id);
    var href = detailHref(item.id);
    var card = document.createElement("article");
    var top = document.createElement("div");
    var cover = document.createElement("div");
    var main = document.createElement("div");
    var title = document.createElement("h3");
    var link = document.createElement("a");
    var text = blurb(item);
    var meta = document.createElement("p");
    var author = document.createElement("span");
    var bits = [];
    var linked = hasRealDownload(item);
    var actions = document.createElement("div");
    var dl = document.createElement("button");
    card.className = "card" + (linked ? " is-downloadable" : "");
    card._item = item;
    card.setAttribute("data-href", href);
    card.style.setProperty("--c1", pair[0]);
    card.style.setProperty("--c2", pair[1]);
    top.className = "card-top";
    cover.className = "card-cover os-avatar-slot";
    mountAvatar(cover, item);
    main.className = "card-main";
    title.className = "card-title";
    link.href = href;
    link.textContent = item.name || "";
    title.appendChild(link);
    main.appendChild(title);
    if (text) {
      var blurbEl = document.createElement("p");
      blurbEl.className = "os-blurb";
      blurbEl.textContent = text;
      main.appendChild(blurbEl);
    }
    if (item.license) bits.push(item.license);
    if (platformLabel(item.platform)) bits.push(platformLabel(item.platform));
    meta.className = "card-meta";
    author.className = "card-author";
    author.textContent = bits.join(" · ");
    meta.appendChild(author);
    if (item.stars != null) {
      var stars = document.createElement("span");
      stars.className = "card-size";
      stars.textContent = "★ " + num(item.stars);
      meta.appendChild(stars);
    }
    main.appendChild(meta);
    top.appendChild(cover);
    top.appendChild(main);
    card.appendChild(top);
    actions.className = "card-actions";
    dl.type = "button";
    dl.className = linked ? "btn download" : "btn download is-empty";
    dl.textContent = t("download");
    dl.setAttribute("aria-haspopup", "dialog");
    dl.setAttribute("aria-label", t("download") + " " + (item.name || ""));
    actions.appendChild(dl);
    card.appendChild(actions);
    return card;
  }

  function renderList(reset) {
    var grid = document.getElementById("grid");
    var empty = document.getElementById("empty");
    var more = document.getElementById("load-more");
    var count = document.getElementById("count-wrap");
    var items;
    var visible;
    if (!grid) return;
    if (reset !== false) state.shown = PAGE;
    renderFilters();
    if (!CATALOG.length) {
      grid.innerHTML = "";
      if (empty) {
        empty.hidden = false;
        var failTitle = document.getElementById("empty-title");
        var failHint = document.getElementById("empty-hint");
        if (failTitle) failTitle.textContent = t("loadFail");
        if (failHint) failHint.textContent = "";
      }
      if (more) more.hidden = true;
      if (count) count.hidden = true;
      return;
    }
    items = matchedItems();
    visible = items.slice(0, state.shown);
    grid.innerHTML = "";
    visible.forEach(function (item) { grid.appendChild(renderCard(item)); });
    if (count) {
      count.hidden = items.length === 0;
      count.innerHTML = "";
      count.textContent = fill(t("count"), { shown: num(visible.length), total: num(items.length) });
    }
    if (empty) empty.hidden = items.length !== 0;
    if (more) {
      more.hidden = items.length <= state.shown;
      more.textContent = fill(t("loadMore"), { shown: num(visible.length), total: num(items.length) });
    }
  }

  function addFact(list, label, value) {
    if (!value) return;
    var dt = document.createElement("dt");
    var dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    list.appendChild(dt);
    list.appendChild(dd);
  }

  function fmtSize(bytes) {
    var n = Number(bytes || 0);
    if (!n) return "";
    if (n >= 1024 * 1024 * 1024) return (n / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    if (n >= 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + " MB";
    if (n >= 1024) return (n / 1024).toFixed(0) + " KB";
    return n + " B";
  }

  function downloadsFor(item) {
    var all = window.OPEN_SOURCE_DOWNLOADS || {};
    return item && item.id ? all[item.id] || null : null;
  }

  function realUrl(value) {
    var url = String(value == null ? "" : value).trim();
    if (!/^https?:\/\//i.test(url)) return "";
    return url;
  }

  function sourceOf(url) {
    var href = String(url || "").toLowerCase();
    if (href.indexOf("quark.cn") !== -1) return "quark";
    if (href.indexOf("ctfile.com") !== -1) return "ctfile";
    return "";
  }

  function fileRecord(file) {
    var url = realUrl(file && file.url);
    return {
      name: String(file && file.name || "").trim(),
      size: fmtSize(file && file.size),
      source: sourceOf(url),
      url: url,
      pwd: String(file && file.pwd || "").trim()
    };
  }

  function recordsFor(item) {
    var dl = downloadsFor(item);
    var groups = [];
    [["mac", t("platMac")], ["win", t("platWin")]].forEach(function (pair) {
      var files = (dl && dl[pair[0]]) || [];
      var rows = [];
      files.forEach(function (file) {
        var rec = fileRecord(file);
        if (rec.source || rec.url || rec.pwd || rec.name || rec.size) rows.push(rec);
      });
      if (rows.length) groups.push({ label: pair[1], rows: rows });
    });
    return groups;
  }

  function hasRealDownload(item) {
    return recordsFor(item).some(function (group) {
      return group.rows.some(function (rec) { return !!rec.url; });
    });
  }

  function copyToClipboard(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { fallbackCopy(text, done); });
      return;
    }
    fallbackCopy(text, done);
  }

  function fallbackCopy(text, done) {
    var area = document.createElement("textarea");
    var ok = false;
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(area);
    done(ok);
  }

  function sourceLabel(source) {
    if (source === "quark") return t("quarkSource");
    if (source === "ctfile") return t("ctSource");
    return "";
  }

  function appendFileRow(container, rec) {
    var row = document.createElement("div");
    var info = document.createElement("div");
    var actions = document.createElement("div");
    var label = sourceLabel(rec.source);
    var name;
    var code;
    var open;
    var copy;
    var later;
    row.className = "dl-link";
    info.className = "dl-link-info";
    if (label) {
      name = document.createElement("span");
      name.className = "dl-link-name";
      name.textContent = label;
      info.appendChild(name);
    }
    if (rec.pwd) {
      code = document.createElement("span");
      code.className = "dl-link-code";
      code.textContent = fill(t("codeLine"), { code: rec.pwd });
      info.appendChild(code);
    }
    row.appendChild(info);
    actions.className = "dl-link-actions";
    if (rec.url) {
      open = document.createElement("a");
      open.className = "btn primary";
      open.href = rec.url;
      open.target = "_blank";
      open.rel = "noopener nofollow noindex";
      open.textContent = t("openPage");
      actions.appendChild(open);
      if (rec.pwd) {
        copy = document.createElement("button");
        copy.type = "button";
        copy.className = "btn copy";
        copy.setAttribute("data-copy-code", rec.pwd);
        copy.textContent = t("copyCode");
        actions.appendChild(copy);
      }
    } else {
      later = document.createElement("span");
      later.className = "dl-link-code";
      later.textContent = t("downloadLater");
      actions.appendChild(later);
    }
    row.appendChild(actions);
    container.appendChild(row);
    return true;
  }

  function fileClusters(rows) {
    var clusters = [];
    var index = Object.create(null);
    rows.forEach(function (rec) {
      var key = rec.name + "\n" + rec.size;
      if (index[key] == null) {
        index[key] = clusters.length;
        clusters.push({ name: rec.name, size: rec.size, rows: [] });
      }
      clusters[index[key]].rows.push(rec);
    });
    return clusters;
  }

  function appendFileFacts(line, file) {
    if (file.name) {
      var name = document.createElement("span");
      name.className = "os-dl-filename";
      name.textContent = file.name;
      line.appendChild(name);
    }
    if (file.size) {
      var size = document.createElement("span");
      size.className = "os-dl-filesize";
      size.textContent = file.size;
      line.appendChild(size);
    }
  }

  function fillDownloadLinks(container, item) {
    var wrote = false;
    recordsFor(item).forEach(function (group) {
      var clusters = fileClusters(group.rows);
      var shared = clusters.length === 1;
      var head = document.createElement("p");
      var plat = document.createElement("span");
      head.className = "dl-meta";
      plat.className = "os-dl-plat";
      plat.textContent = group.label;
      head.appendChild(plat);
      if (shared) appendFileFacts(head, clusters[0]);
      container.appendChild(head);
      clusters.forEach(function (cluster) {
        if (!shared && (cluster.name || cluster.size)) {
          var sub = document.createElement("p");
          sub.className = "dl-meta os-dl-file";
          appendFileFacts(sub, cluster);
          container.appendChild(sub);
        }
        cluster.rows.forEach(function (rec) {
          if (appendFileRow(container, rec)) wrote = true;
        });
      });
    });
    return wrote;
  }

  function placeholderLine() {
    var pending = document.createElement("p");
    pending.className = "dl-empty os-pending";
    pending.textContent = t("downloadLater");
    return pending;
  }

  var downloadModal = null;
  var downloadOpener = null;

  function ensureDownloadModal() {
    var overlay;
    var panel;
    var close;
    var title;
    var links;
    if (downloadModal) return downloadModal;
    overlay = document.createElement("div");
    overlay.className = "dl-overlay";
    overlay.hidden = true;
    panel = document.createElement("div");
    panel.className = "dl-modal";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.tabIndex = -1;
    close = document.createElement("button");
    close.type = "button";
    close.className = "dl-close";
    close.textContent = "×";
    title = document.createElement("h2");
    title.className = "dl-title";
    title.id = "os-dl-title";
    links = document.createElement("div");
    links.className = "dl-links";
    panel.setAttribute("aria-labelledby", "os-dl-title");
    panel.appendChild(close);
    panel.appendChild(title);
    panel.appendChild(links);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    function closeModal() {
      overlay.hidden = true;
      document.documentElement.classList.remove("dl-open");
      if (downloadOpener && downloadOpener.focus) {
        try { downloadOpener.focus(); } catch (err) {}
      }
    }
    close.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function (event) {
      if (!overlay.hidden && event.key === "Escape") closeModal();
    });
    downloadModal = {
      overlay: overlay,
      title: title,
      links: links,
      close: close,
      closeModal: closeModal,
      item: null
    };
    return downloadModal;
  }

  function paintDownloadDialog(modal, item) {
    var wrote;
    modal.item = item;
    modal.title.textContent = item && item.name ? item.name : t("download");
    modal.close.setAttribute("aria-label", t("modalClose"));
    modal.links.textContent = "";
    wrote = item ? fillDownloadLinks(modal.links, item) : false;
    if (!wrote) modal.links.appendChild(placeholderLine());
  }

  function openDownloadDialog(item, opener) {
    var modal;
    if (!item) return;
    modal = ensureDownloadModal();
    downloadOpener = opener || document.activeElement;
    paintDownloadDialog(modal, item);
    modal.overlay.hidden = false;
    document.documentElement.classList.add("dl-open");
    modal.close.focus();
  }

  function refreshDownloadDialog() {
    if (!downloadModal || downloadModal.overlay.hidden || !downloadModal.item) return;
    paintDownloadDialog(downloadModal, downloadModal.item);
  }

  function renderDetail() {
    var root = document.getElementById("detail");
    var missing = document.getElementById("missing");
    var crumb = document.getElementById("crumb-name");
    var item = state.item;
    var text;
    var hero;
    var icon;
    var copy;
    var about;
    var factsWrap;
    var facts;
    var download;
    if (!root) return;
    root.innerHTML = "";
    if (!item) {
      root.hidden = true;
      if (missing) missing.hidden = false;
      document.title = t("docTitle");
      if (crumb) crumb.textContent = "";
      return;
    }
    if (missing) missing.hidden = true;
    root.hidden = false;
    document.title = item.name + " · " + t("docTitle");
    if (crumb) crumb.textContent = item.name;
    text = blurb(item);
    hero = document.createElement("header");
    hero.className = "detail-hero";
    icon = document.createElement("div");
    icon.className = "soft-icon os-mark os-avatar-slot";
    mountAvatar(icon, item);
    copy = document.createElement("div");
    var heading = document.createElement("h1");
    heading.textContent = item.name || "";
    copy.appendChild(heading);
    var badges = document.createElement("div");
    badges.className = "badges";
    [platformLabel(item.platform), item.license, item.stars != null ? "★ " + num(item.stars) : "", item.version || ""].forEach(function (label) {
      if (!label) return;
      var badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = label;
      badges.appendChild(badge);
    });
    copy.appendChild(badges);
    hero.appendChild(icon);
    hero.appendChild(copy);
    root.appendChild(hero);
    var stack = document.createElement("div");
    stack.className = "detail-body";
    root.appendChild(stack);

    about = document.createElement("section");
    about.className = "block";
    var aboutTitle = document.createElement("h2");
    aboutTitle.textContent = t("about");
    about.appendChild(aboutTitle);
    var summary = document.createElement("p");
    summary.className = "os-summary";
    summary.textContent = text || t("noDescription");
    about.appendChild(summary);
    stack.appendChild(about);

    factsWrap = document.createElement("section");
    factsWrap.className = "block";
    facts = document.createElement("dl");
    facts.className = "os-facts";
    addFact(facts, t("platform"), platformLabel(item.platform));
    addFact(facts, t("license"), item.license || "");
    addFact(facts, t("stars"), item.stars != null ? num(item.stars) : "");
    addFact(facts, t("version"), item.version || "");
    addFact(facts, t("released"), releaseDate(item));
    addFact(facts, t("category"), item.cat || "");
    factsWrap.appendChild(facts);
    stack.appendChild(factsWrap);

    download = document.createElement("section");
    download.className = "block";
    download.id = "download";
    var downloadTitle = document.createElement("h2");
    downloadTitle.textContent = t("download");
    download.appendChild(downloadTitle);
    var dlLinks = document.createElement("div");
    dlLinks.className = "dl-links";
    if (fillDownloadLinks(dlLinks, item)) download.appendChild(dlLinks);
    else download.appendChild(placeholderLine());
    stack.appendChild(download);
  }

  function bindList() {
    var input = document.getElementById("q");
    var box = document.getElementById("os-platforms");
    var select = document.getElementById("os-cat");
    var more = document.getElementById("load-more");
    var reset = document.getElementById("empty-reset");
    var grid = document.getElementById("grid");
    if (input) {
      input.addEventListener("input", function () { renderList(true); });
      document.addEventListener("keydown", function (event) {
        if (event.key === "/" && document.activeElement !== input && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          input.focus();
        }
        if (event.key === "Escape" && document.activeElement === input) {
          input.value = "";
          renderList(true);
          input.blur();
        }
      });
    }
    if (box) {
      box.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-platform]");
        if (!button) return;
        state.platform = button.getAttribute("data-platform") || "all";
        renderList(true);
      });
    }
    if (select) {
      select.addEventListener("change", function () {
        state.cat = select.value || "";
        renderList(true);
      });
    }
    if (more) {
      more.addEventListener("click", function () {
        state.shown += PAGE;
        renderList(false);
      });
    }
    if (reset) {
      reset.addEventListener("click", function () {
        if (input) input.value = "";
        state.platform = "all";
        state.cat = "";
        renderList(true);
        if (input) input.focus();
      });
    }
    if (grid) {
      grid.addEventListener("click", function (event) {
        var card = event.target.closest(".card[data-href]");
        var downloadButton;
        if (!card) return;
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        downloadButton = event.target.closest(".btn.download");
        if (downloadButton && card.contains(downloadButton)) {
          event.preventDefault();
          event.stopPropagation();
          openDownloadDialog(card._item, downloadButton);
          return;
        }
        if (event.target.closest("a, button")) return;
        window.location.href = card.getAttribute("data-href");
      });
    }
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".btn.copy[data-copy-code]");
    var code;
    var old;
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    code = button.getAttribute("data-copy-code") || "";
    if (!code) return;
    old = button.textContent;
    copyToClipboard(code, function (ok) {
      button.textContent = ok ? t("copied") : t("copyFail");
      setTimeout(function () {
        if (button.textContent === t("copied") || button.textContent === t("copyFail")) button.textContent = old;
      }, 1500);
    });
  });

  bindChrome();
  if (document.body.getAttribute("data-page") === "detail") {
    var params = new URLSearchParams(window.location.search);
    state.item = findItem(params.get("id") || "");
    renderDetail();
  } else {
    bindList();
    renderList(true);
  }
})();
