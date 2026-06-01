(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`./data/equipment.json`,t=`https://open.er-api.com/v6/latest/RUB`,n={RUB:`руб`,USD:`$`,EUR:`€`},r=class{constructor(){this.catalog=null,this.equipment=null,this.home=null}},i=class{constructor(e,t){this.apiUrl=e,this.symbols=t,this.rates={RUB:1},this.currentCurrency=`RUB`}formatPrice(e){let t=e*(this.rates[this.currentCurrency]||1);return`${new Intl.NumberFormat(`ru-RU`,{style:`currency`,currency:this.currentCurrency,maximumFractionDigits:this.currentCurrency===`RUB`?0:2}).format(t)} / день`}setCurrency(e){this.symbols[e]&&(this.currentCurrency=e,localStorage.setItem(`currency`,e))}async loadRates(){try{let e=await fetch(this.apiUrl);if(!e.ok)return;let t=await e.json();t?.rates&&(this.rates={RUB:1,USD:t.rates.USD,EUR:t.rates.EUR})}catch{}}async init(e,t){let n=localStorage.getItem(`currency`);n&&this.symbols[n]&&(this.currentCurrency=n,e.value=n),e.addEventListener(`change`,()=>{this.setCurrency(e.value),t()}),await this.loadRates(),t()}},a=new r,o=new i(t,n),s=e=>o.formatPrice(e),c={industrial:`промышленная`,household:`бытовая`},l={available:`свободно`,busy:`занято`},u=async()=>{let t=await fetch(e);return t.ok?t.json():[]},d=()=>{let e=document.querySelector(`[data-menu-toggle]`),t=document.querySelector(`[data-nav]`);!e||!t||(e.addEventListener(`click`,()=>{document.body.classList.toggle(`nav-open`)}),t.querySelectorAll(`a`).forEach(e=>{e.addEventListener(`click`,()=>{document.body.classList.remove(`nav-open`)})}))},f=()=>{let e=document.querySelector(`[data-year]`);e&&(e.textContent=String(new Date().getFullYear()))},p=(e,t)=>{t&&(t.innerHTML=e.map(e=>`
      <article class="card catalog-card">
		<div class="card-tag catalog-card__tag">${c[e.category]||e.category}</div>
        <h3 class="catalog-card__title">${e.name}</h3>
        <p class="card-meta catalog-card__meta">${e.type} • ${e.power}</p>
        <p class="card-desc catalog-card__desc">${e.description}</p>
        <div class="card-row catalog-card__row">
			  <span class="price catalog-card__price">${s(e.priceDay)}</span>
					<span class="status status--${e.status} ${e.status} catalog-card__status">${l[e.status]||e.status}</span>
        </div>
				<a class="btn btn--ghost btn-ghost catalog-card__link" href="./equipment.html?id=${e.id}">Подробнее</a>
      </article>
    `).join(``))},m=(e,t)=>{!e||!t||(t.innerHTML=`
		<div class="detail detail__hero">
			<div class="detail__content">
				<p class="eyebrow detail__eyebrow">${c[e.category]||e.category} техника</p>
				<h1 class="detail__title">${e.name}</h1>
				<p class="lead detail__lead">${e.description}</p>
				<div class="detail-tags detail__tags">
					<span class="detail__tag">${e.type}</span>
					<span class="detail__tag">${e.power}</span>
					<span class="detail__tag">${e.location}</span>
				</div>
			</div>
			<div class="detail-panel detail__panel">
				<p class="price detail__price">${s(e.priceDay)}</p>
				<p class="status status--${e.status} ${e.status} detail__status">${l[e.status]||e.status}</p>
				<a class="btn detail__button" href="./booking.html?id=${e.id}">Забронировать</a>
				<p class="note detail__note">Доставка в течение 24 часов по городу.</p>
			</div>
		</div>
		<section class="detail-grid detail__grid">
			<div class="detail-card detail__card">
				<h3>Ключевые характеристики</h3>
				<ul>
					${e.features.map(e=>`<li>${e}</li>`).join(``)}
				</ul>
			</div>
			<div class="detail-card detail__card">
				<h3>Сервис включен</h3>
				<ul>
					<li>Инструктаж или обучение оператора</li>
					<li>Плановая проверка состояния</li>
					<li>Страхование по запросу</li>
				</ul>
			</div>
		</section>
	`)},h=async()=>{let e=document.querySelector(`[data-catalog-list]`);if(!e)return;let t=document.querySelector(`[data-filter]`),n=document.querySelector(`[data-availability]`),r=await u(),i=()=>{let i=t?.value||`all`,a=n?.value||`all`;p(r.filter(e=>{let t=i===`all`||e.category===i,n=a===`all`||e.status===a;return t&&n}),e)};a.catalog={applyFilters:i},t?.addEventListener(`change`,i),n?.addEventListener(`change`,i),i()},g=async()=>{let e=document.querySelector(`[data-equipment-detail]`);if(!e)return;let t=await u(),n=new URLSearchParams(window.location.search).get(`id`),r=t.find(e=>e.id===n)||t[0];if(!r){e.innerHTML=`<p>Данные по технике временно недоступны.</p>`;return}a.equipment={item:r,container:e},m(r,e)},_=()=>{a.home?.items&&a.home?.list&&p(a.home.items,a.home.list),a.catalog?.applyFilters&&a.catalog.applyFilters(),a.equipment?.item&&a.equipment?.container&&m(a.equipment.item,a.equipment.container)};d(),f(),(async()=>{let e=document.querySelector(`[data-home-list]`);if(!e)return;let t=(await u()).slice(0,3);a.home={items:t,list:e},p(t,e)})(),h(),g(),(async()=>{let e=document.querySelector(`[data-booking-form]`),t=document.querySelector(`[data-booking-summary]`);if(!e||!t)return;let n=e.querySelector(`input[name="equipment"]`),r=new URLSearchParams(window.location.search).get(`id`);if(n&&r){let e=(await u()).find(e=>e.id===r);e&&(n.value=e.name)}e.addEventListener(`submit`,n=>{n.preventDefault();let r=new FormData(e),i=Object.fromEntries(r.entries());t.innerHTML=`
			<h3 class="booking-summary__title">Сводка заявки</h3>
			<p class="booking-summary__row"><strong>Клиент:</strong> ${i.name}</p>
			<p class="booking-summary__row"><strong>Телефон:</strong> ${i.phone}</p>
			<p class="booking-summary__row"><strong>Техника:</strong> ${i.equipment}</p>
			<p class="booking-summary__row"><strong>Даты:</strong> ${i.start} — ${i.end}</p>
			<p class="booking-summary__row"><strong>Доставка:</strong> ${i.delivery}</p>
			<p class="note booking-summary__note">Подтвердим наличие в течение 30 минут.</p>
		`,e.reset()})})(),(async()=>{let e=document.querySelector(`[data-currency]`);e&&await o.init(e,_)})();