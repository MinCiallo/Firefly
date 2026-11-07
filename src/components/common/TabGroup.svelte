<script lang="ts">
import type { Snippet } from "svelte";

// 标签页代码组组件（MDX 中使用）
//
// 为什么需要它：`::: code-group`（markdown directive）和 `::: tip`（Docusaurus 风格
// 提醒框）都使用 `:::` 容器语法，micromark-directive 规定父子容器的冒号数必须不同，
// 所以 `::: tip` 里嵌套 `::: code-group` 无法解析。改用 MDX 组件即可在提醒框内正常使用
// 代码组，也方便日后扩展更多 UI 组件。
//
// 用法（.mdx）：
//   <TabGroup labels={["js", "py"]} client:load>
//     ```js
//     console.log(1)
//     ```
//     ```py
//     print(1)
//     ```
//   </TabGroup>

interface Props {
	labels: string[];
	children?: Snippet;
}

let { labels, children }: Props = $props();
const groupId = $props.id();
let active = $state(0);

function onTabKeydown(event: KeyboardEvent, index: number) {
	let next = index;
	if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
	else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
	else if (event.key === "Home") next = 0;
	else if (event.key === "End") next = tabs.length - 1;
	else return;
	event.preventDefault();
	active = next;
	container?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
}
let container: HTMLDivElement | undefined;

const tabs = $derived(Array.isArray(labels) ? labels : []);

// 根据 active 切换代码块显示（hydrate 后生效）
$effect(() => {
	if (!container) return;
	const group = container.querySelector(".code-group-blocks");
	if (!group) return;
	// Astro 会把框架组件的 children 包在 <astro-slot> 里，需要穿透一层取真实代码块
	const source =
		group.children.length === 1 &&
		group.firstElementChild?.tagName === "ASTRO-SLOT"
			? group.firstElementChild
			: group;
	const blocks = Array.from(source.children) as HTMLElement[];
	blocks.forEach((block, i) => {
		block.style.display = tabs.length === 0 || i === active ? "" : "none";
		block.id = `${groupId}-panel-${i}`;
		block.setAttribute("role", "tabpanel");
		block.setAttribute("aria-labelledby", `${groupId}-tab-${i}`);
		block.tabIndex = 0;
	});
});
</script>

<div class="code-group" bind:this={container}>
	<div class="code-group-tabs" role="tablist" aria-label="内容分组">
		{#each tabs as label, i}
			<button
				class="code-group-tab"
				class:active={i === active}
				role="tab"
				id={`${groupId}-tab-${i}`}
				aria-controls={`${groupId}-panel-${i}`}
				tabindex={i === active ? 0 : -1}
				onkeydown={(event) => onTabKeydown(event, i)}
				aria-selected={i === active}
				onclick={() => (active = i)}
				type="button"
			>
				{label}
			</button>
		{/each}
	</div>
	<div class="code-group-blocks">
		{@render children?.()}
	</div>
</div>

<style>
	.code-group {
		margin: 1rem 0;
	}
	.code-group-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		border-bottom: 1px solid var(--line-divider);
	}
	.code-group-tab {
		padding: 0.4rem 0.8rem;
		font-size: 0.875rem;
		color: var(--btn-content);
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		transition:
			color var(--duration-normal) var(--ease-standard),
			border-color var(--duration-normal) var(--ease-standard);
	}
	.code-group-tab:hover {
		color: var(--primary);
	}
	.code-group-tab.active {
		color: var(--primary);
		border-bottom-color: var(--primary);
	}
</style>
