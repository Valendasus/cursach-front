import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
	base: '/cursach-front/',
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				catalog: resolve(__dirname, 'catalog.html'),
				equipment: resolve(__dirname, 'equipment.html'),
				booking: resolve(__dirname, 'booking.html'),
				contacts: resolve(__dirname, 'contacts.html'),
			},
		},
	},
})
