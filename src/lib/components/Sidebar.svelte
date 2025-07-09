<script module lang="ts">
	export let openSidebar = () => {};
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { cubicIn } from 'svelte/easing';

	interface Props {
		userRole: string | undefined;
	}

	let { userRole }: Props = $props();

	// model
	let visible = $state(false);
	let sidebarItems = [
		{ name: 'Dashboard', path: '/dashboard', icon: 'material-symbols:dashboard-outline-rounded' },
		{ name: 'Permits', path: '/permits/all', icon: 'clarity:details-line' },
		{ name: 'Residents', path: '/residents', icon: 'uit:house-user' },
		{ name: 'Cars', path: '/cars', icon: 'la:car-side' },
		{ name: 'Visitors', path: '/visitors/active', icon: 'material-symbols:badge-outline' }
	];

	// events
	openSidebar = () => {
		if (visible) {
			return;
		}
		window.addEventListener('keydown', closeOnEscape);

		//this prevents scrolling of the main window on larger screens
		document.body.style.overflow = 'hidden';

		visible = true;
	};

	function closeSidebar() {
		if (!visible) {
			return;
		}

		window.removeEventListener('keydown', closeOnEscape);

		document.body.style.overflow = '';

		visible = false;
	}

	function closeOnEscape(ev: KeyboardEvent) {
		if (ev.key == 'Escape') closeSidebar();
	}

	// helpers
	function getTopLevel(route: string): string {
		if (!route) {
			return '';
		}
		const trimmedStart = route[0] === '/' ? route.slice(1) : route;
		return trimmedStart.split('/')[0];
	}

	// animations
	function horizontalSlide(node: HTMLElement, { delay = 0 } = {}) {
		const style = getComputedStyle(node);
		return {
			delay,
			duration: 400,
			easing: cubicIn,
			css: (t: number) => `
        overflow: hidden;
        width: ${t * parseFloat(style.width)}px;
        padding-right: ${t * parseFloat(style.paddingRight)}px;`
		};
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 z-10 bg-gray-800 opacity-25"
		onclick={closeSidebar}
		onkeypress={closeSidebar}
	></div>
	<nav transition:horizontalSlide|global class="fixed z-20 flex min-h-full flex-col bg-white">
		<button class="text-left" onclick={closeSidebar}>
			<iconify-icon icon="mingcute:close-line" style="color:#6d6d6d" width="15" height="15"
			></iconify-icon>
		</button>
		{#each sidebarItems as sidebarItem}
			{#if userRole !== 'resident' || sidebarItem.name !== 'Residents'}
				<div
					class="sidebar-wrapper"
					class:active={getTopLevel(page.url.pathname) === getTopLevel(sidebarItem.path)}
				>
					<a
						href={sidebarItem.path}
						class="sidebar-link"
						class:active={getTopLevel(page.url.pathname) === getTopLevel(sidebarItem.path)}
						onclick={closeSidebar}
					>
						<iconify-icon
							class="circle"
							class:active={getTopLevel(page.url.pathname) === getTopLevel(sidebarItem.path)}
							icon={sidebarItem.icon}
						></iconify-icon>
						<span>{sidebarItem.name}</span>
					</a>
				</div>
			{/if}
		{/each}
	</nav>
{/if}

<style>
	nav {
		box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.06);
		border-radius: 0px 18px 18px 0px;
		margin-bottom: 25px;
		padding-top: 10px;
		padding-left: 25px;
	}

	a {
		text-decoration: none;
		color: #6d6d6d;
	}

	.sidebar-link {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 0.75rem;
	}

	.sidebar-wrapper {
		padding-top: 12.5px;
		padding-bottom: 12.5px;
		margin-top: 12.5px;
		margin-bottom: 12.5px;
	}

	.circle {
		background-color: #f0f0f0;
		border-radius: 50px;
		padding: 10px;
		color: #8a8a8a;
		margin: 0 10px;
	}

	.sidebar-wrapper.active {
		border-right: solid #13d380;
	}

	iconify-icon.active {
		background-color: #13d380;
		color: white;
	}

	a.active {
		color: #13d380;
	}

	span {
		padding-right: 40px;
	}
</style>
