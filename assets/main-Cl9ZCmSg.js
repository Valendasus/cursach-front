(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`./data/equipment.json`,t=`https://open.er-api.com/v6/latest/RUB`,n={RUB:`руб`,USD:`$`,EUR:`€`},r={RUB:1},i=`RUB`,a=null,o=null,s=null,c=e=>{let t=e*(r[i]||1);return`${new Intl.NumberFormat(`ru-RU`,{style:`currency`,currency:i,maximumFractionDigits:i===`RUB`?0:2}).format(t)} / день`},l={industrial:`промышленная`,household:`бытовая`},u={available:`свободно`,busy:`занято`},d=async()=>{let t=await fetch(e);return t.ok?t.json():[]},f=()=>{let e=document.querySelector(`[data-menu-toggle]`),t=document.querySelector(`[data-nav]`);!e||!t||(e.addEventListener(`click`,()=>{document.body.classList.toggle(`nav-open`)}),t.querySelectorAll(`a`).forEach(e=>{e.addEventListener(`click`,()=>{document.body.classList.remove(`nav-open`)})}))},p=()=>{let e=document.querySelector(`[data-year]`);e&&(e.textContent=String(new Date().getFullYear()))},m=(e,t)=>{t&&(t.innerHTML=e.map(e=>`
      <article class="card">
		<div class="card-tag">${l[e.category]||e.category}</div>
        <h3>${e.name}</h3>
        <p class="card-meta">${e.type} • ${e.power}</p>
        <p class="card-desc">${e.description}</p>
        <div class="card-row">
          <span class="price">${c(e.priceDay)}</span>
					<span class="status ${e.status}">${u[e.status]||e.status}</span>
        </div>
				<a class="btn btn-ghost" href="/equipment.html?id=${e.id}">Подробнее</a>
      </article>
    `).join(``))},h=(e,t)=>{!e||!t||(t.innerHTML=`
		<div class="detail-hero">
			<div>
				<p class="eyebrow">${l[e.category]||e.category} техника</p>
				<h1>${e.name}</h1>
				<p class="lead">${e.description}</p>
				<div class="detail-tags">
					<span>${e.type}</span>
					<span>${e.power}</span>
					<span>${e.location}</span>
				</div>
			</div>
			<div class="detail-panel">
				<p class="price">${c(e.priceDay)}</p>
				<p class="status ${e.status}">${u[e.status]||e.status}</p>
				<a class="btn" href="/booking.html?id=${e.id}">Забронировать</a>
				<p class="note">Доставка в течение 24 часов по городу.</p>
			</div>
		</div>
		<section class="detail-grid">
			<div class="detail-card">
				<h3>Ключевые характеристики</h3>
				<ul>
					${e.features.map(e=>`<li>${e}</li>`).join(``)}
				</ul>
			</div>
			<div class="detail-card">
				<h3>Сервис включен</h3>
				<ul>
					<li>Инструктаж или обучение оператора</li>
					<li>Плановая проверка состояния</li>
					<li>Страхование по запросу</li>
				</ul>
			</div>
		</section>
	`)},g=async()=>{let e=document.querySelector(`[data-catalog-list]`);if(!e)return;let t=document.querySelector(`[data-filter]`),n=document.querySelector(`[data-availability]`),r=await d(),i=()=>{let i=t?.value||`all`,a=n?.value||`all`;m(r.filter(e=>{let t=i===`all`||e.category===i,n=a===`all`||e.status===a;return t&&n}),e)};a={applyFilters:i},t?.addEventListener(`change`,i),n?.addEventListener(`change`,i),i()},_=async()=>{let e=document.querySelector(`[data-equipment-detail]`);if(!e)return;let t=await d(),n=new URLSearchParams(window.location.search).get(`id`),r=t.find(e=>e.id===n)||t[0];if(!r){e.innerHTML=`<p>Данные по технике временно недоступны.</p>`;return}o={item:r,container:e},h(r,e)},v=()=>{s?.items&&s?.list&&m(s.items,s.list),a?.applyFilters&&a.applyFilters(),o?.item&&o?.container&&h(o.item,o.container)};f(),p(),(async()=>{let e=document.querySelector(`[data-home-list]`);if(!e)return;let t=(await d()).slice(0,3);s={items:t,list:e},m(t,e)})(),g(),_(),(async()=>{let e=document.querySelector(`[data-booking-form]`),t=document.querySelector(`[data-booking-summary]`);if(!e||!t)return;let n=e.querySelector(`input[name="equipment"]`),r=new URLSearchParams(window.location.search).get(`id`);if(n&&r){let e=(await d()).find(e=>e.id===r);e&&(n.value=e.name)}e.addEventListener(`submit`,n=>{n.preventDefault();let r=new FormData(e),i=Object.fromEntries(r.entries());t.innerHTML=`
			<h3>Сводка заявки</h3>
			<p><strong>Клиент:</strong> ${i.name}</p>
			<p><strong>Телефон:</strong> ${i.phone}</p>
			<p><strong>Техника:</strong> ${i.equipment}</p>
			<p><strong>Даты:</strong> ${i.start} — ${i.end}</p>
			<p><strong>Доставка:</strong> ${i.delivery}</p>
			<p class="note">Подтвердим наличие в течение 30 минут.</p>
		`,e.reset()})})(),(async()=>{let e=document.querySelector(`[data-currency]`);if(!e)return;let a=localStorage.getItem(`currency`);a&&n[a]&&(i=a,e.value=a),e.addEventListener(`change`,()=>{i=e.value,localStorage.setItem(`currency`,i),v()});try{let e=await fetch(t);if(!e.ok)return;let n=await e.json();n?.rates&&(r={RUB:1,USD:n.rates.USD,EUR:n.rates.EUR},v())}catch{}})();