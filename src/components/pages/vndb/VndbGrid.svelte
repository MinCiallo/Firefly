<script lang="ts">
import { onMount } from "svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { VndbUlistEntry } from "@/types/vndb";
import {
	buildVndbTabs,
	fetchVndbUlist,
	getVndbItemsForTab,
	type VndbTab,
} from "@/utils/vndb-utils";
import TabNav from "./TabNav.svelte";
import VndbSection from "./VndbSection.svelte";

interface Props {
	tabs?: VndbTab[];
	initialActiveTab?: string;
	vndbData?: Record<string, VndbUlistEntry[]>;
	vnBaseUrl?: string;
	blurNsfw?: boolean;
	fetchConfig?: {
		userId: string;
		apiUrl: string;
		apiToken?: string;
		vnBaseUrl: string;
		pagination: { limit: number; delay: number; maxTotal: number };
		blurNsfw: boolean;
	};
}

const {
	tabs: staticTabs,
	initialActiveTab,
	vndbData: staticData,
	vnBaseUrl,
	fetchConfig,
	blurNsfw,
}: Props = $props();

const hasStaticData = $derived(!!(staticTabs && staticTabs.length > 0));

let activeTab = $state("");
let loading = $state(false);
let bgRefreshing = $state(false);
let error = $state(false);
let errorTitle = $state("");
let errorDesc = $state("");
let dynamicTabs = $state<VndbTab[]>([]);
let dynamicData = $state<Record<string, VndbUlistEntry[]>>({});

// 优先使用后台刷新数据，否则用静态数据
const tabs = $derived(dynamicTabs.length > 0 ? dynamicTabs : (staticTabs || []));
const vndbData = $derived(
	dynamicTabs.length > 0 ? dynamicData : (staticData || {})
);

$effect(() => {
	if (initialActiveTab) {
		activeTab = initialActiveTab;
	}
});

function handleTabChange(tabId: string) {
	activeTab = tabId;
}

async function loadDynamicData() {
	if (!fetchConfig) return;
	const { userId, apiUrl, apiToken, pagination } = fetchConfig;
	const { limit, delay, maxTotal } = pagination;
	const allItems: VndbUlistEntry[] = [];
	let page = 1;

	try {
		while (true) {
			if (maxTotal > 0 && allItems.length >= maxTotal) break;
			const data = await fetchVndbUlist({
				apiUrl,
				userId,
				apiToken,
				results: limit,
				page,
			});
			const batch = data.results || [];
			allItems.push(...batch);
			if (!data.more || batch.length === 0) break;
			page += 1;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		if (allItems.length === 0) {
			loading = false;
			bgRefreshing = false;
			error = true;
			errorTitle = i18n(I18nKey.vndbNoData);
			errorDesc = i18n(I18nKey.vndbNoDataDescription);
			return;
		}

		// 和静态数据对比，有变化才更新
		const staticIds = new Set((staticData?.all || []).map((item) => item.id));
		const dynamicIds = new Set(allItems.map((item) => item.id));
		const hasChanges = allItems.length !== (staticData?.all?.length || 0)
			|| ![...staticIds].every((id) => dynamicIds.has(id));

		if (hasChanges || !hasStaticData) {
			// 保留静态数据中已有的本地封面 URL
			const localCoverMap = new Map<string, string | null>();
			for (const item of staticData?.all || []) {
				const url = item.vn?.image?.url;
				if (url && url.startsWith("/vndb-covers/")) {
					localCoverMap.set(item.id, url);
				}
			}
			for (const item of allItems) {
				const localUrl = localCoverMap.get(item.id);
				if (localUrl && item.vn?.image) {
					item.vn.image.url = localUrl;
				}
			}

			const newTabs = buildVndbTabs(allItems);
			const newData: Record<string, VndbUlistEntry[]> = { all: allItems };
			dynamicTabs = newTabs;
			dynamicData = newData;
			if (!hasStaticData) {
				activeTab = newTabs[0]?.id || "all";
			}
		}

		loading = false;
		bgRefreshing = false;
	} catch (e) {
		console.error("[VNDB] 后台刷新失败:", e);
		// 后台刷新失败不影响静态数据展示
		bgRefreshing = false;
		loading = false;
		// 只有在完全没有静态数据时才显示错误
		if (!hasStaticData) {
			error = true;
			errorTitle = i18n(I18nKey.vndbFetchError);
			errorDesc = i18n(I18nKey.vndbFetchErrorDesc);
		}
	}
}

onMount(async () => {
	if (hasStaticData) {
		// 有静态数据：先渲染，后台静默刷新
		if (fetchConfig) {
			bgRefreshing = true;
			await loadDynamicData();
		}
	} else if (fetchConfig) {
		// 无静态数据：显示 loading，拉取数据
		loading = true;
		error = false;
		await loadDynamicData();
	}
});
</script>

{#if loading && !hasStaticData}
  <!-- 无静态数据时的骨架屏 -->
  <div class="border-b border-(--line-divider) mb-3">
    <div class="flex min-w-max space-x-8">
      {#each [1, 2, 3, 4] as _}
        <div class="h-10 w-20 bg-(--btn-regular-bg) rounded animate-pulse"></div>
      {/each}
    </div>
  </div>
  <div class="flex flex-wrap gap-1.5 mb-4">
    {#each [1, 2, 3, 4] as _}
      <div class="h-7 w-16 bg-(--btn-regular-bg) rounded-full animate-pulse"></div>
    {/each}
  </div>
  <div class="bangumi-masonry grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as _}
      <div class="rounded-xl overflow-hidden">
        <div class="aspect-2/3 bg-(--btn-regular-bg) animate-pulse"></div>
      </div>
    {/each}
  </div>
  <div class="mt-6 flex items-center justify-center gap-3">
    <div class="w-11 h-11 bg-(--btn-regular-bg) rounded-lg animate-pulse"></div>
    <div class="w-16 h-8 bg-(--btn-regular-bg) rounded animate-pulse"></div>
    <div class="w-11 h-11 bg-(--btn-regular-bg) rounded-lg animate-pulse"></div>
  </div>
{:else if error && !hasStaticData}
  <div class="text-center py-16">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-(--btn-regular-bg) rounded-full mb-6 border border-(--line-divider)">
      <span class="text-[2rem] text-red-500">&#9888;</span>
    </div>
    <h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">{errorTitle}</h2>
    <p class="text-black/60 dark:text-white/60 mb-4 max-w-md mx-auto">{errorDesc}</p>
  </div>
{:else if tabs.length > 0}
  <!-- 后台刷新提示条 -->
  {#if bgRefreshing}
    <div class="mb-3 px-3 py-1.5 bg-(--btn-regular-bg) rounded-lg text-xs text-(--btn-content) flex items-center gap-2">
      <span class="inline-block w-3 h-3 border-2 border-(--primary) border-t-transparent rounded-full animate-spin"></span>
      {i18n(I18nKey.vndbRefreshing)}
    </div>
  {/if}

  <TabNav {tabs} {activeTab} onTabChange={handleTabChange} />

  {#each tabs as tab (tab.id)}
    <VndbSection
      sectionId={tab.id}
      items={getVndbItemsForTab(vndbData.all || [], tab.id)}
      isActive={tab.id === activeTab}
      itemsPerPage={24}
      {vnBaseUrl}
      blurNsfw={blurNsfw ?? fetchConfig?.blurNsfw ?? true}
    />
  {/each}
{/if}