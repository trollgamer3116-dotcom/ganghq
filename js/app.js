(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* starfield + nebula */
const cv=$('#stars'),cx=cv.getContext('2d');let W,H,st=[];
function size(){W=cv.width=innerWidth*devicePixelRatio;H=cv.height=innerHeight*devicePixelRatio;st=Array.from({length:Math.min(400,W*H/6000|0)},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random()*.9+.1,t:Math.random()*6}))}
function draw(t){cx.clearRect(0,0,W,H);
 const g=cx.createRadialGradient(W*.7+Math.sin(t/9000)*W*.05,H*.35,0,W*.7,H*.35,W*.5);g.addColorStop(0,'rgba(124,77,255,.18)');g.addColorStop(.5,'rgba(79,227,224,.05)');g.addColorStop(1,'transparent');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 for(const s of st){const a=.5+.5*Math.sin(t/700+s.t);cx.fillStyle=`rgba(${s.z>.8?'245,199,106':'233,232,255'},${a*s.z})`;cx.fillRect(s.x,s.y,s.z*2.2,s.z*2.2);if(!RM){s.y+=s.z*.3;if(s.y>H)s.y=0}}
 if(!RM)requestAnimationFrame(draw)}
addEventListener('resize',()=>{size();if(RM)draw(0)});size();RM?draw(0):requestAnimationFrame(draw);
/* procedural avatars */
function avatar(c){const shapes={
 crown:`<path d="M60 80 L80 40 L100 70 L120 30 L140 70 L160 40 L180 80 Z" fill="${c.color}"/>`,
 reactor:`<circle cx="120" cy="60" r="34" fill="none" stroke="${c.color}" stroke-width="6"/><circle cx="120" cy="60" r="16" fill="#fff"/>`,
 flame:`<path d="M120 15 C150 50 160 70 120 105 C80 70 90 50 120 15Z" fill="${c.color}"/><path d="M120 45 C135 65 135 80 120 95 C105 80 105 65 120 45Z" fill="#fff" opacity=".7"/>`,
 halo:`<ellipse cx="120" cy="40" rx="45" ry="12" fill="none" stroke="${c.color}" stroke-width="5"/><circle cx="120" cy="80" r="20" fill="${c.color}" opacity=".6"/>`,
 staff:`<line x1="120" y1="15" x2="120" y2="110" stroke="${c.color}" stroke-width="5"/><circle cx="120" cy="25" r="14" fill="#4fe3e0"/>`,
 spark:`<path d="M120 10 L130 50 L170 60 L130 70 L120 110 L110 70 L70 60 L110 50Z" fill="${c.color}"/>`,
 star:`<circle cx="120" cy="60" r="30" fill="${c.color}" opacity=".85"/><circle cx="108" cy="55" r="4" fill="#111"/><circle cx="132" cy="55" r="4" fill="#111"/><path d="M110 70 Q120 78 130 70" stroke="#111" stroke-width="3" fill="none"/>`,
 gear:`<circle cx="120" cy="60" r="28" fill="none" stroke="${c.color}" stroke-width="12" stroke-dasharray="10 6"/><circle cx="120" cy="60" r="10" fill="${c.color}"/>`,
 eyes:`<circle cx="95" cy="60" r="22" fill="${c.color}"/><circle cx="145" cy="60" r="22" fill="${c.color}"/><circle cx="95" cy="60" r="8" fill="#111"/><circle cx="145" cy="60" r="8" fill="#111"/>`};
 return `<svg viewBox="0 0 240 120" aria-hidden="true"><defs><radialGradient id="g${c.id}"><stop offset="0" stop-color="${c.color}" stop-opacity=".45"/><stop offset="1" stop-color="#0d1236"/></radialGradient></defs><rect width="240" height="120" fill="url(#g${c.id})"/>${shapes[c.shape]}</svg>`}
/* roster */
$('#grid').innerHTML=CAST.map(c=>`<button class="card glass reveal" role="listitem" style="--c:${c.color}" data-id="${c.id}">${avatar(c)}<h3>${esc(c.name)}</h3><p>${esc(c.role)}</p><span class="tag">Threat ${c.threat}${c.threat>100?' (illegal)':''}</span></button>`).join('');
const dlg=$('#panel');
$('#grid').addEventListener('click',e=>{const b=e.target.closest('.card');if(!b)return;const c=CAST.find(x=>x.id===b.dataset.id);
 $('#panelBody').innerHTML=`${avatar(c)}<h2 id="pName" style="color:${c.color};margin:.4rem 0 0">${esc(c.name)}</h2><p class="sub">${esc(c.role)}</p><p>${esc(c.bio)}</p>
 <h3>Threat level: ${c.threat}/100</h3><div class="meter" role="meter" aria-valuenow="${c.threat}" aria-valuemin="0" aria-valuemax="100"><i style="width:${Math.min(100,c.threat)}%"></i></div>
 <h3>Signature quotes</h3>${c.quotes.map(q=>`<blockquote>${esc(q)}</blockquote>`).join('')}
 <h3>Running grudges</h3><ul>${c.grudges.map(g=>`<li>${esc(g)}</li>`).join('')}</ul>`;
 dlg.showModal()});
$('#closePanel').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
/* lore */
const KEY='ganghq-lore';const mine=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}};
function renderLore(){const all=[...LORE.filter(l=>!l.extra),...mine().map(l=>({...l,mine:1})),...LORE.filter(l=>l.extra)];
 $('#timeline').innerHTML=all.map(l=>`<li class="glass reveal in ${l.mine?'mine':''}"><div class="meta">${esc(l.date)}${l.extra?' · minor':''}${l.mine?' · added by you':''} · ${esc(l.who||'unknown suspects')}</div><h3>${esc(l.title)}</h3><p>${esc(l.text)}</p></li>`).join('')
 +`<li class="glass reveal in"><h3>🔥 Transformation Ladder</h3><p class="sub">Click to make Aarav escalate. Vegeta is not consenting.</p><button class="btn gold" id="ascend" type="button">Ascend</button> <span id="formOut" aria-live="polite"></span><div class="meter" style="margin-top:.8rem"><i id="formBar" style="width:0"></i></div></li>
 <li class="glass reveal in"><h3>🗿🔔 Bidding Game: Rules Card + Debt Simulator</h3><ul><li>Bid. Highest bid wins. That rule is the only innocent one.</li><li>Loans allowed. Debt carries over. Forever.</li><li>Ring the bell 🔔 and the pot doubles (so does your debt).</li><li>Copy tickets copy someone else's bid. Coin rewinds undo one round. Morally.</li><li>Debt above <b>1,000</b> sends you to <b>ZENO COURT</b>.</li></ul><button class="btn ghost" id="loan" type="button">Take a loan (+150)</button> <button class="btn ghost" id="bell" type="button">Ring bell 🔔 (×2)</button> <button class="btn ghost" id="rewind" type="button">Coin rewind</button><p id="debt" aria-live="polite">Debt: 0 coins. Tony is cautiously optimistic.</p></li>`;
 bindWidgets()}
let lvl=0,debt=0,prev=0;
function bindWidgets(){$('#ascend').onclick=()=>{lvl=(lvl+1)%(FORMS.length+1);const f=FORMS[lvl-1];$('#formOut').textContent=f?`${f[0]}: ${f[1]}`:'Base form. Vegeta exhales for the first time in weeks.';$('#formBar').style.width=(lvl/FORMS.length*100)+'%';updVeg()};
 const show=()=>{$('#debt').innerHTML=debt>1000?`Debt: ${debt} coins. 👁️👁️ <b>ZENO COURT IS IN SESSION.</b> "Silence." (If you are Aarav: ":D", case dismissed.)`:`Debt: ${debt} coins. ${debt>400?'Tony is breathing into a paper bag.':'Tony is cautiously optimistic.'}`};
 $('#loan').onclick=()=>{prev=debt;debt+=150;show()};$('#bell').onclick=()=>{prev=debt;debt=Math.max(1,debt)*2;show()};$('#rewind').onclick=()=>{debt=prev;show()}}
renderLore();
$('#loreForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const l={date:new Date().toLocaleDateString(),title:f.get('title').trim(),who:f.get('who').trim(),text:f.get('text').trim()};
 if(!l.title||!l.text)return;localStorage.setItem(KEY,JSON.stringify([...mine(),l]));e.target.reset();renderLore();$('#formMsg').textContent='Committed to canon. Vados has already judged it.'});
$('#clearLore').onclick=()=>{localStorage.removeItem(KEY);renderLore();$('#formMsg').textContent='Your additions were erased. The Zenos approve.'};
/* status */
const M=[
 {k:'ctx',n:'Context window remaining',f:()=>`${(60+Math.random()*30).toFixed(1)}%`,note:'Mostly consumed by the Bulma saga recap'},
 {k:'veg',n:"Vegeta's dignity",f:()=>`${Math.max(0,12-lvl).toFixed(0)}%`,note:'Drops with each Aarav transformation',bad:1},
 {k:'rb',n:'Rendering budget',f:()=>`${(Math.random()*4+94).toFixed(1)}% used`,note:'Project Nocturne ate the rest',bad:1},
 {k:'tea',n:"Grand Priest's tea reserves",f:()=>`${(Math.random()*3).toFixed(0)} cups`,note:'Aarav was here. GP is proud.'},
 {k:'zeno',n:'Zeno mood',f:()=>':D',note:'Only because Aarav is online'},
 {k:'tabs',n:'Open Chrome tabs',f:()=>40+(Math.random()*8|0),note:'Tony audit pending',bad:1},
 {k:'part',n:'Partner group calendar sync',f:()=>'4/4 ❤️',note:'Bulma, Vados, Marcarita, Kusu: all synced'},
 {k:'cap',n:'Captcha win rate (Vegeta)',f:()=>'0.0%',note:'Do not bring this up',bad:1}];
$('#metrics').innerHTML=M.map(m=>`<div class="metric glass reveal"><div class="n"><span class="dot ${m.bad?'bad':''}"></span>${m.n}</div><div class="v" id="m-${m.k}">${m.f()}</div><div class="note">${m.note}</div></div>`).join('');
function updVeg(){$('#m-veg').textContent=M[1].f()}
if(!RM)setInterval(()=>M.forEach(m=>{if(m.k!=='veg')$('#m-'+m.k).textContent=m.f()}),2500);
/* reveal */
const io='IntersectionObserver' in window&&!RM?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1}):null;
document.querySelectorAll('.reveal').forEach(el=>io?io.observe(el):el.classList.add('in'));
})();
