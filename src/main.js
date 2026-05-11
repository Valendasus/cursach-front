const DATA_URL = './data/equipment.json'
const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest/RUB'

const CURRENCY_SYMBOLS = {
	RUB: 'руб',
	USD: '$',
	EUR: '€',
}

let currencyRates = { RUB: 1 }
let currentCurrency = 'RUB'
let catalogState = null
let equipmentState = null
let homeState = null

const formatPrice = value => {
	const rate = currencyRates[currentCurrency] || 1
	const converted = value * rate
	const formatter = new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: currentCurrency,
		maximumFractionDigits: currentCurrency === 'RUB' ? 0 : 2,
	})
	return `${formatter.format(converted)} / день`
}

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
      <article class="card">
		<div class="card-tag">${CATEGORY_LABELS[item.category] || item.category}</div>
        <h3>${item.name}</h3>
        <p class="card-meta">${item.type} • ${item.power}</p>
        <p class="card-desc">${item.description}</p>
        <div class="card-row">
          <span class="price">${formatPrice(item.priceDay)}</span>
					<span class="status ${item.status}">${STATUS_LABELS[item.status] || item.status}</span>
        </div>
				<a class="btn btn-ghost" href="/equipment.html?id=${item.id}">Подробнее</a>
      </article>
    `,
		)
		.join('')
}

const renderEquipment = (item, container) => {
	if (!item || !container) return
	container.innerHTML = `
		<div class="detail-hero">
			<div>
				<p class="eyebrow">${CATEGORY_LABELS[item.category] || item.category} техника</p>
				<h1>${item.name}</h1>
				<p class="lead">${item.description}</p>
				<div class="detail-tags">
					<span>${item.type}</span>
					<span>${item.power}</span>
					<span>${item.location}</span>
				</div>
			</div>
			<div class="detail-panel">
				<p class="price">${formatPrice(item.priceDay)}</p>
				<p class="status ${item.status}">${STATUS_LABELS[item.status] || item.status}</p>
				<a class="btn" href="/booking.html?id=${item.id}">Забронировать</a>
				<p class="note">Доставка в течение 24 часов по городу.</p>
			</div>
		</div>
		<section class="detail-grid">
			<div class="detail-card">
				<h3>Ключевые характеристики</h3>
				<ul>
					${item.features.map(feature => `<li>${feature}</li>`).join('')}
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

	catalogState = {
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

	equipmentState = {
		item,
		container,
	}

	renderEquipment(item, container)
}

const updatePrices = () => {
	if (homeState?.items && homeState?.list) {
		renderCatalog(homeState.items, homeState.list)
	}
	if (catalogState?.applyFilters) {
		catalogState.applyFilters()
	}
	if (equipmentState?.item && equipmentState?.container) {
		renderEquipment(equipmentState.item, equipmentState.container)
	}
}

const initCurrency = async () => {
	const select = document.querySelector('[data-currency]')
	if (!select) return

	const saved = localStorage.getItem('currency')
	if (saved && CURRENCY_SYMBOLS[saved]) {
		currentCurrency = saved
		select.value = saved
	}

	select.addEventListener('change', () => {
		currentCurrency = select.value
		localStorage.setItem('currency', currentCurrency)
		updatePrices()
	})

	try {
		const response = await fetch(CURRENCY_API_URL)
		if (!response.ok) return
		const data = await response.json()
		if (data?.rates) {
			currencyRates = {
				RUB: 1,
				USD: data.rates.USD,
				EUR: data.rates.EUR,
			}
			updatePrices()
		}
	} catch {
		// Use fallback rates
	}
}

const initHomePage = async () => {
	const list = document.querySelector('[data-home-list]')
	if (!list) return

	const data = await getData()
	const items = data.slice(0, 3)
	homeState = {
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
			<h3>Сводка заявки</h3>
			<p><strong>Клиент:</strong> ${payload.name}</p>
			<p><strong>Телефон:</strong> ${payload.phone}</p>
			<p><strong>Техника:</strong> ${payload.equipment}</p>
			<p><strong>Даты:</strong> ${payload.start} — ${payload.end}</p>
			<p><strong>Доставка:</strong> ${payload.delivery}</p>
			<p class="note">Подтвердим наличие в течение 30 минут.</p>
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
