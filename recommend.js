/* =========================================================
   ココロ診断 - 共通レコメンド／ナビ（全診断ページ共通）
   使い方：各診断ページの </body> 直前に↓を1行入れるだけ
     <script src="/recommend.js" defer></script>
   新しい診断を追加したら、下の QUIZZES 配列に1行足すだけで
   全ページのおすすめに自動反映されます。
   ========================================================= */
(function () {
  "use strict";

  // ---- 全診断リスト（新規追加はここに1行足すだけ） ----
  var CAT = {
    work:   { name: "職場",     color: "#3B6FD4" },
    pers:   { name: "性格",     color: "#9B5DE5" },
    love:   { name: "恋愛",     color: "#E5557F" },
    money:  { name: "お金",     color: "#D69A2D" },
    mental: { name: "メンタル", color: "#2BA179" }
  };

  var QUIZZES = [
    { slug: "shachiku-quiz",      title: "社畜タイプ診断",          cat: "work"   },
    { slug: "monster-quiz",       title: "職場モンスター診断",      cat: "work"   },
    { slug: "kyuryodorobo",       title: "給料泥棒診断",            cat: "work"   },
    { slug: "tenshoku-iiwake",    title: "転職の言い訳診断",        cat: "work"   },
    { slug: "oshikatsu",          title: "推し活タイプ診断",        cat: "pers"   },
    { slug: "neko-quiz",          title: "隠れネコ科診断",          cat: "pers"   },
    { slug: "menhera",            title: "隠れメンヘラ診断",        cat: "pers"   },
    { slug: "haraguroi",          title: "腹黒度チェック",          cat: "pers"   },
    { slug: "mayonaka",           title: "真夜中テンション診断",    cat: "pers"   },
    { slug: "kyoto-urabe",        title: "京都人度チェック",        cat: "pers"   },
    { slug: "kaeruka",            title: "蛙化現象チェック",        cat: "love"   },
    { slug: "torisetsu",          title: "トリセツメーカー",        cat: "love"   },
    { slug: "hitori",             title: "おひとり様適性診断",      cat: "love"   },
    { slug: "honmei-tsugou",      title: "本命？都合のいい人診断",  cat: "love"   },
    { slug: "menhera-hoihoi",     title: "メンヘラホイホイ度",      cat: "love"   },
    { slug: "renai-hensachi",     title: "恋愛偏差値テスト",        cat: "love"   },
    { slug: "mudazukai",          title: "無駄遣いモンスター診断",  cat: "money"  },
    { slug: "takarakuji-hametsu", title: "宝くじ破滅度チェック",    cat: "money"  },
    { slug: "battery-quiz",       title: "心の充電残量診断",        cat: "mental" },
    { slug: "kuuki",              title: "空気読みすぎ診断",        cat: "mental" }
  ];

  // ---- 現在のページの slug を URL から判定（自分自身は除外する） ----
  function currentSlug() {
    var parts = window.location.pathname.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "";
  }

  // ---- 配列をシャッフルして n 件取り出す（current を除外） ----
  function pickRandom(n, exclude) {
    var pool = QUIZZES.filter(function (q) { return q.slug !== exclude; });
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    return pool.slice(0, n);
  }

  function go(slug) { window.location.href = "/" + slug + "/"; }

  // ---- スタイル（ks- 接頭辞で各診断のCSSと干渉しない） ----
  function injectStyle() {
    if (document.getElementById("ks-rec-style")) return;
    var css =
    '.ks-rec{box-sizing:border-box;max-width:560px;margin:34px auto 8px;padding:0 16px;' +
      'font-family:"Noto Sans JP",system-ui,sans-serif;}' +
    '.ks-rec *{box-sizing:border-box;}' +
    '.ks-rec-inner{background:#fff;border:1px solid #e7e1d7;border-radius:18px;' +
      'padding:20px 18px 18px;box-shadow:0 14px 34px -22px rgba(35,33,43,.4);}' +
    '.ks-rec-h{font-weight:700;font-size:15px;color:#23212b;margin:0 0 14px;' +
      'display:flex;align-items:center;gap:7px;}' +
    '.ks-rec-h::before{content:"";width:7px;height:7px;border-radius:50%;' +
      'background:linear-gradient(135deg,#8B5CF6,#EC4899);}' +
    '.ks-rec-cards{display:flex;flex-direction:column;gap:9px;margin-bottom:15px;}' +
    '.ks-card{display:flex;align-items:center;gap:10px;text-decoration:none;' +
      'border:1px solid #ece7df;border-radius:12px;padding:13px 14px;background:#faf8f4;' +
      'transition:border-color .18s,background .18s,transform .1s;}' +
    '.ks-card:hover{background:#fff;border-color:#d8cfc2;transform:translateY(-1px);}' +
    '.ks-card:active{transform:scale(.99);}' +
    '.ks-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}' +
    '.ks-ct{font-size:11px;font-weight:700;color:#938e9c;flex-shrink:0;min-width:46px;}' +
    '.ks-tt{font-weight:700;font-size:14.5px;color:#23212b;flex:1;line-height:1.4;}' +
    '.ks-go{color:#b3acbd;font-size:16px;flex-shrink:0;}' +
    '.ks-rec-btns{display:flex;flex-direction:column;gap:9px;}' +
    '.ks-btn{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;' +
      'border:none;cursor:pointer;font-family:inherit;font-weight:700;font-size:15px;' +
      'padding:14px 18px;border-radius:13px;text-decoration:none;transition:filter .2s,transform .1s,background .2s;}' +
    '.ks-btn:active{transform:translateY(1px);}' +
    '.ks-btn-primary{color:#fff;background:linear-gradient(120deg,#8B5CF6,#EC4899);' +
      'box-shadow:0 12px 24px -14px rgba(139,92,246,.85);}' +
    '.ks-btn-primary:hover{filter:brightness(1.05);}' +
    '.ks-btn-ghost{color:#56525f;background:transparent;border:1.5px solid #e0d9cf;}' +
    '.ks-btn-ghost:hover{background:#faf8f4;color:#23212b;}' +
    '@media (prefers-reduced-motion:reduce){.ks-rec *{transition:none!important;}}';
    var s = document.createElement("style");
    s.id = "ks-rec-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ---- おすすめカード2枚を描画 ----
  function renderCards(container, slug) {
    var picks = pickRandom(2, slug);
    container.innerHTML = "";
    picks.forEach(function (q) {
      var c = CAT[q.cat] || { name: "", color: "#999" };
      var a = document.createElement("a");
      a.className = "ks-card";
      a.href = "/" + q.slug + "/";
      a.innerHTML =
        '<span class="ks-dot" style="background:' + c.color + '"></span>' +
        '<span class="ks-ct" style="color:' + c.color + '">' + c.name + '</span>' +
        '<span class="ks-tt">' + q.title + '</span>' +
        '<span class="ks-go">→</span>';
      container.appendChild(a);
    });
  }

  // ---- ナビ・ブロックを生成して本文末尾に追加 ----
  function build() {
    var slug = currentSlug();
    injectStyle();

    var sec = document.createElement("section");
    sec.className = "ks-rec";
    sec.setAttribute("aria-label", "ほかの診断");
    sec.innerHTML =
      '<div class="ks-rec-inner">' +
        '<p class="ks-rec-h">ほかの診断もどうぞ</p>' +
        '<div class="ks-rec-cards" id="ksRecCards"></div>' +
        '<div class="ks-rec-btns">' +
          '<button type="button" class="ks-btn ks-btn-primary" id="ksRandom">🎲 ランダムで次の診断へ</button>' +
          '<a class="ks-btn ks-btn-ghost" href="/">🏠 診断トップに戻る</a>' +
        '</div>' +
      '</div>';

    var host = document.querySelector("main") || document.body;
    host.appendChild(sec);

    renderCards(sec.querySelector("#ksRecCards"), slug);

    sec.querySelector("#ksRandom").addEventListener("click", function () {
      var pick = pickRandom(1, slug)[0];
      if (pick) go(pick.slug);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
