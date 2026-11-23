// Builds front.html — a one-page newspaper front page (1024x1024) from stories.json.
// Original design for the news-image-20261123 make.fun entry: Editorial High-Craft
// archetype, ink on paper, one red accent, hairline rules, no gradients.
import { readFileSync, writeFileSync } from 'node:fs';

const S = JSON.parse(readFileSync(new URL('./stories.json', import.meta.url), 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Compact digest story: bold serif headline inline with a sans dek.
const story = (st) => `
      <article class="story"><p><b class="sh">${esc(st.h)}</b> — ${esc(st.d)}</p></article>`;

// Stacked lead story for a section: kicker + big headline + dek.
const leadStory = (kicker, st) => `
      <article class="leadstory">
        <div class="kicker sm">${esc(kicker)}</div>
        <h4>${esc(st.headline)}</h4>
        <p>${esc(st.dek)}</p>
      </article>`;

const section = (name, inner) => `
    <section class="col-section">
      <h3><span class="sq"></span>${esc(name)}</h3>
      ${inner}
    </section>`;

const market = (m) => `<span class="mk"><b>${m[0]}</b> ${m[1]} <i class="${m[2].startsWith('-') ? 'dn' : 'up'}">${m[2].startsWith('-') ? '▼' : '▲'} ${m[2].slice(1)}</i></span>`;

const war = S.sections[0], politics = S.sections[1], world = S.sections[2], money = S.sections[3], sport = S.sections[4];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1024px; height: 1024px; }
  body {
    font-family: "Liberation Serif", "DejaVu Serif", Georgia, serif;
    background: #f6f1e6; color: #16130e;
    padding: 15px 30px 9px 30px;
    display: flex; flex-direction: column;
  }
  .kicker {
    font-family: "Liberation Sans", sans-serif; font-weight: 700;
    letter-spacing: .18em; color: #9e1b1b; text-transform: uppercase;
  }

  /* ---------- masthead ---------- */
  .toprow {
    display: flex; justify-content: space-between; align-items: baseline;
    font-family: "Liberation Sans", sans-serif; font-size: 10.5px; letter-spacing: .14em;
    text-transform: uppercase; padding-bottom: 6px; border-bottom: 1px solid #16130e;
  }
  .toprow .c { font-weight: 700; }
  h1.masthead { text-align: center; font-size: 43px; font-weight: 700; letter-spacing: .045em; line-height: 1.05; padding: 5px 0 1px 0; white-space: nowrap; }
  .strap { text-align: center; font-family: "Liberation Sans", sans-serif; font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: #4c463a; padding-bottom: 6px; }
  .doublerule { border-top: 3.5px solid #16130e; border-bottom: 1px solid #16130e; height: 3px; margin-bottom: 9px; }

  /* ---------- lead ---------- */
  .leadrow { display: flex; gap: 22px; }
  .lead { flex: 1 1 auto; }
  .lead .kicker { font-size: 11px; margin-bottom: 4px; }
  .lead h2 { font-size: 26.5px; line-height: 1.09; font-weight: 700; }
  .lead .dek { font-size: 12.2px; line-height: 1.3; color: #2c2822; margin-top: 7px; text-align: justify; }
  .afterbox { flex: 0 0 250px; border: 1.5px solid #16130e; padding: 8px 12px 6px 12px; align-self: flex-start; }
  .afterbox h5, .sidebox h5 {
    font-family: "Liberation Sans", sans-serif; font-size: 10.5px; letter-spacing: .16em;
    text-transform: uppercase; border-bottom: 1px solid #16130e; padding-bottom: 4px; margin-bottom: 6px;
  }
  .afterbox .ai { margin-bottom: 6px; }
  .afterbox .ai:last-child { margin-bottom: 1px; }
  .afterbox h6 { font-size: 12.4px; line-height: 1.18; font-weight: 700; }
  .afterbox p { font-family: "Liberation Sans", sans-serif; font-size: 9.9px; line-height: 1.27; color: #3a362e; margin-top: 2px; }

  /* ---------- markets strip ---------- */
  .markets {
    margin-top: 9px; background: #16130e; color: #f6f1e6;
    font-family: "Liberation Sans", sans-serif; font-size: 11.5px;
    display: flex; justify-content: space-between; align-items: center; padding: 5px 14px;
  }
  .markets .mk i { font-style: normal; font-weight: 700; }
  .markets .dn { color: #ff9c8a; }
  .markets .up { color: #9fd89a; }

  /* ---------- main grid ---------- */
  .grid { display: flex; gap: 20px; margin-top: 9px; flex: 1; min-height: 0; }
  .gridcol { flex: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .col-section h3 {
    font-family: "Liberation Sans", sans-serif; font-size: 11.5px; font-weight: 700;
    letter-spacing: .17em; text-transform: uppercase; display: flex; align-items: center; gap: 7px;
    border-bottom: 2.5px solid #16130e; padding-bottom: 2px; margin-bottom: 4px;
  }
  .col-section h3 .sq { width: 8px; height: 8px; background: #9e1b1b; flex: 0 0 auto; }
  .story { padding-bottom: 2px; margin-bottom: 2px; border-bottom: 1px dotted #8d8674; }
  .story:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .story p { font-family: "Liberation Sans", sans-serif; font-size: 9.9px; line-height: 1.22; color: #33302a; }
  .story .sh { font-family: "Liberation Serif", serif; font-size: 12px; font-weight: 700; color: #16130e; }
  .leadstory { padding-bottom: 5px; margin-bottom: 5px; border-bottom: 1px solid #16130e; }
  .leadstory .kicker.sm { font-size: 9.5px; margin-bottom: 2px; }
  .leadstory h4 { font-size: 15px; line-height: 1.15; font-weight: 700; }
  .leadstory p { font-family: "Liberation Sans", sans-serif; font-size: 10.1px; line-height: 1.26; color: #2c2822; margin-top: 3px; }

  /* ---------- side boxes (column B) ---------- */
  .sidebox { border: 1.5px solid #16130e; padding: 8px 12px 7px 12px; }
  .sidebox .bi { font-family: "Liberation Sans", sans-serif; font-size: 10px; line-height: 1.26; color: #2c2822; padding-bottom: 3px; margin-bottom: 3px; border-bottom: 1px dotted #8d8674; }
  .sidebox .bi:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .nums { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; }
  .num .n { font-size: 14px; font-weight: 700; color: #9e1b1b; line-height: 1.05; }
  .num .t { font-family: "Liberation Sans", sans-serif; font-size: 9px; line-height: 1.18; color: #3a362e; }

  footer {
    margin-top: 7px; border-top: 1px solid #16130e; padding-top: 4px;
    display: flex; justify-content: space-between;
    font-family: "Liberation Sans", sans-serif; font-size: 9.8px; letter-spacing: .12em;
    text-transform: uppercase; color: #4c463a;
  }
</style>
</head>
<body>
  <div class="toprow">
    <span>${esc(S.date)}</span>
    <span class="c">40 Stories · One Image</span>
    <span>Antalya — Kyiv — Washington — Tokyo</span>
  </div>
  <h1 class="masthead">THE DAILY LEDGER</h1>
  <div class="strap">The World's News in One Image</div>
  <div class="doublerule"></div>

  <div class="leadrow">
    <article class="lead">
      <div class="kicker">${esc(S.lead.kicker)}</div>
      <h2>${esc(S.lead.headline)}</h2>
      <p class="dek">${esc(S.lead.dek)}</p>
    </article>
    <aside class="afterbox">
      <h5>After Antalya</h5>
      ${S.lead.aftermath.map((a) => `<div class="ai"><h6>${esc(a.h)}</h6><p>${esc(a.d)}</p></div>`).join('')}
    </aside>
  </div>

  <div class="markets">${S.markets.map(market).join('')}</div>

  <div class="grid">
    <div class="gridcol">
      ${section(war.name, leadStory(S.third.kicker, S.third) + war.stories.map(story).join(''))}
      ${section(money.name, money.stories.map(story).join(''))}
    </div>
    <div class="gridcol">
      ${section(politics.name, leadStory(S.second.kicker, S.second) + politics.stories.map(story).join(''))}
      <aside class="sidebox">
        <h5>In Brief</h5>
        ${S.briefs.map((b) => `<div class="bi">${esc(b)}</div>`).join('')}
      </aside>
      <aside class="sidebox">
        <h5>The Day in Numbers</h5>
        <div class="nums">${S.numbers.map((n) => `<div class="num"><div class="n">${esc(n[0])}</div><div class="t">${esc(n[1])}</div></div>`).join('')}</div>
      </aside>
    </div>
    <div class="gridcol">
      ${section(world.name, world.stories.map(story).join(''))}
      ${section(sport.name, sport.stories.map(story).join(''))}
    </div>
  </div>

  <footer>
    <span>Compiled from Monday's reporting</span>
    <span>All stories dated 23 November 2026 (UTC)</span>
    <span>Printed in one page</span>
  </footer>
</body>
</html>`;

writeFileSync(new URL('./front.html', import.meta.url), html);
const count = 3 + S.lead.aftermath.length + S.sections.reduce((n, s) => n + s.stories.length, 0) + S.briefs.length;
console.log('front.html written; stories on page:', count);
