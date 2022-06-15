import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false
		}),

		prerender: {
			// This can be false if you're using a fallback (i.e. SPA mode)
			default: false,
			entries: []
		}
	}
};

export default config;
