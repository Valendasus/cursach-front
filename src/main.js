const DATA_URL = './data/equipment.json'
const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest/RUB'

const CURRENCY_SYMBOLS = {
	RUB: 'руб',
	USD: '$',
	EUR: '€',
}

class PageState {
	constructor() {
		this.catalog = null
		this.equipment = null
		this.home = null
	}
}

class CurrencyService {
	constructor(apiUrl, symbols) {
		this.apiUrl = apiUrl
		this.symbols = symbols
		this.rates = { RUB: 1 }
		this.currentCurrency = 'RUB'
	}

	formatPrice(value) {
		const rate = this.rates[this.currentCurrency] || 1
		const converted = value * rate
		const formatter = new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: this.currentCurrency,
			maximumFractionDigits: this.currentCurrency === 'RUB' ? 0 : 2,
		})
		return `${formatter.format(converted)} / день`
	}

	setCurrency(currency) {
		if (!this.symbols[currency]) return
		this.currentCurrency = currency
		localStorage.setItem('currency', currency)
	}

	async loadRates() {
		try {
			const response = await fetch(this.apiUrl)
			if (!response.ok) return
			const data = await response.json()
			if (data?.rates) {
				this.rates = {
					RUB: 1,
					USD: data.rates.USD,
					EUR: data.rates.EUR,
				}
			}
		} catch {
			// Use fallback rates
		}
	}

	async init(select, onChange) {
		const saved = localStorage.getItem('currency')
		if (saved && this.symbols[saved]) {
			this.currentCurrency = saved
			select.value = saved
		}

		select.addEventListener('change', () => {
			this.setCurrency(select.value)
			onChange()
		})

		await this.loadRates()
		onChange()
	}
}

const pageState = new PageState()
const currencyService = new CurrencyService(CURRENCY_API_URL, CURRENCY_SYMBOLS)

const formatPrice = value => currencyService.formatPrice(value)

const CATEGORY_LABELS = {
	industrial: 'промышленная',
	household: 'бытовая',
}

const STATUS_LABELS = {
	available: 'свободно',
	busy: 'занято',
}

const getData = async () => {
	const response = await fetch(DATA_URL)
	if (!response.ok) {
		return []
	}
	return response.json()
}

const initMenu = () => {
	const toggle = document.querySelector('[data-menu-toggle]')
	const nav = document.querySelector('[data-nav]')
	if (!toggle || !nav) return

	toggle.addEventListener('click', () => {
		document.body.classList.toggle('nav-open')
	})

	nav.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			document.body.classList.remove('nav-open')
		})
	})
}

const initFooterYear = () => {
	const year = document.querySelector('[data-year]')
	if (year) {
		year.textContent = String(new Date().getFullYear())
	}
}

const renderCatalog = (items, target) => {
	if (!target) return
	target.innerHTML = items
		.map(
			item => `
      <article class="card catalog-card">
		<div class="card-tag catalog-card__tag">${CATEGORY_LABELS[item.category] || item.category}</div>
        <h3 class="catalog-card__title">${item.name}</h3>
        <p class="card-meta catalog-card__meta">${item.type} • ${item.power}</p>
        <p class="card-desc catalog-card__desc">${item.description}</p>
        <div class="card-row catalog-card__row">
			  <span class="price catalog-card__price">${formatPrice(item.priceDay)}</span>
					<span class="status status--${item.status} ${item.status} catalog-card__status">${STATUS_LABELS[item.status] || item.status}</span>
        </div>
				<a class="btn btn--ghost btn-ghost catalog-card__link" href="./equipment.html?id=${item.id}">Подробнее</a>
      </article>
    `,
		)
		.join('')
}

const renderEquipment = (item, container) => {
	if (!item || !container) return
	container.innerHTML = `
		<div class="detail detail__hero">
			<div class="detail__content">
				<p class="eyebrow detail__eyebrow">${CATEGORY_LABELS[item.category] || item.category} техника</p>
				<h1 class="detail__title">${item.name}</h1>
				<p class="lead detail__lead">${item.description}</p>
				<div class="detail-tags detail__tags">
					<span class="detail__tag">${item.type}</span>
					<span class="detail__tag">${item.power}</span>
					<span class="detail__tag">${item.location}</span>
				</div>
			</div>
			<div class="detail-panel detail__panel">
				<p class="price detail__price">${formatPrice(item.priceDay)}</p>
				<p class="status status--${item.status} ${item.status} detail__status">${STATUS_LABELS[item.status] || item.status}</p>
				<a class="btn detail__button" href="./booking.html?id=${item.id}">Забронировать</a>
				<p class="note detail__note">Доставка в течение 24 часов по городу.</p>
			</div>
		</div>
		<section class="detail-grid detail__grid">
			<div class="detail-card detail__card">
				<h3>Ключевые характеристики</h3>
				<ul>
					${item.features.map(feature => `<li>${feature}</li>`).join('')}
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
	`
}

const initCatalogPage = async () => {
	const list = document.querySelector('[data-catalog-list]')
	if (!list) return

	const filter = document.querySelector('[data-filter]')
	const availability = document.querySelector('[data-availability]')
	const data = await getData()

	const applyFilters = () => {
		const category = filter?.value || 'all'
		const status = availability?.value || 'all'

		const filtered = data.filter(item => {
			const categoryOk = category === 'all' || item.category === category
			const statusOk = status === 'all' || item.status === status
			return categoryOk && statusOk
		})

		renderCatalog(filtered, list)
	}

	pageState.catalog = {
		applyFilters,
	}

	filter?.addEventListener('change', applyFilters)
	availability?.addEventListener('change', applyFilters)

	applyFilters()
}

const initEquipmentPage = async () => {
	const container = document.querySelector('[data-equipment-detail]')
	if (!container) return

	const data = await getData()
	const params = new URLSearchParams(window.location.search)
	const id = params.get('id')
	const item = data.find(entry => entry.id === id) || data[0]

	if (!item) {
		container.innerHTML = '<p>Данные по технике временно недоступны.</p>'
		return
	}

	pageState.equipment = {
		item,
		container,
	}

	renderEquipment(item, container)
}

const updatePrices = () => {
	if (pageState.home?.items && pageState.home?.list) {
		renderCatalog(pageState.home.items, pageState.home.list)
	}
	if (pageState.catalog?.applyFilters) {
		pageState.catalog.applyFilters()
	}
	if (pageState.equipment?.item && pageState.equipment?.container) {
		renderEquipment(pageState.equipment.item, pageState.equipment.container)
	}
}

const initCurrency = async () => {
	const select = document.querySelector('[data-currency]')
	if (!select) return

	await currencyService.init(select, updatePrices)
}

const initHomePage = async () => {
	const list = document.querySelector('[data-home-list]')
	if (!list) return

	const data = await getData()
	const items = data.slice(0, 3)
	pageState.home = {
		items,
		list,
	}

	renderCatalog(items, list)
}

const initBookingPage = async () => {
	const form = document.querySelector('[data-booking-form]')
	const summary = document.querySelector('[data-booking-summary]')
	if (!form || !summary) return

	const equipmentField = form.querySelector('input[name="equipment"]')
	const params = new URLSearchParams(window.location.search)
	const id = params.get('id')
	if (equipmentField && id) {
		const data = await getData()
		const item = data.find(entry => entry.id === id)
		if (item) {
			equipmentField.value = item.name
		}
	}

	form.addEventListener('submit', event => {
		event.preventDefault()
		const formData = new FormData(form)
		const payload = Object.fromEntries(formData.entries())

		summary.innerHTML = `
			<h3 class="booking-summary__title">Сводка заявки</h3>
			<p class="booking-summary__row"><strong>Клиент:</strong> ${payload.name}</p>
			<p class="booking-summary__row"><strong>Телефон:</strong> ${payload.phone}</p>
			<p class="booking-summary__row"><strong>Техника:</strong> ${payload.equipment}</p>
			<p class="booking-summary__row"><strong>Даты:</strong> ${payload.start} — ${payload.end}</p>
			<p class="booking-summary__row"><strong>Доставка:</strong> ${payload.delivery}</p>
			<p class="note booking-summary__note">Подтвердим наличие в течение 30 минут.</p>
		`

		form.reset()
	})
}

initMenu()
initFooterYear()
initHomePage()
initCatalogPage()
initEquipmentPage()
initBookingPage()
initCurrency()
