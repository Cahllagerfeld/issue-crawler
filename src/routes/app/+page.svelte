<script lang="ts">
  import LoadMore from '$lib/components/load-more.svelte';
  import Toggle from '$lib/components/toggle.svelte';
  import Seo from '$lib/components/seo.svelte';

  import { goto, disableScrollHandling, afterNavigate } from '$app/navigation';
  import type { PageData } from './$types';
  import { query } from '$lib/constants.json';
  import Loader from '$lib/components/loader.svelte';
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import { fetchIssues } from '$lib/data';
  import IssueCard from '$lib/components/issue-card.svelte';
  import Filter from '$lib/components/filter.svelte';
  import Search from '$lib/components/search.svelte';
  import Modal from '$lib/components/modal.svelte';
  import { para } from './getparam';
  export let data: PageData;

  let { checked } = data;

  let searchString = '';

  if (!checked) checked = false;

  let selectedLabels: string[] = para();
  let misss = false;

  $: issues = createInfiniteQuery({
    queryKey: ['issues', { global: checked }],
    queryFn: ({ pageParam }) => fetchIssues(checked ? query.global : query.org, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo.hasNextPage) return lastPage.pageInfo.endCursor;
      return undefined;
    },
  });

  afterNavigate(() => {
    disableScrollHandling();
  });

  const onChangeHandler = async () => {
    if (checked) {
      await goto('?global=true', { noScroll: true });
      selectedLabels = [];
      return;
    }
    await goto('?global=false', { noScroll: true });
    selectedLabels = [];
  };

  const onFilterClear = () => {
    selectedLabels = [];
  };

  $: {
    if (typeof window !== 'undefined' && misss) {
      const labelsParam = selectedLabels.length > 0 ? selectedLabels.join(',') : '';
      const currentQuery = new URLSearchParams(window.location.search);
      if (labelsParam) {
        currentQuery.set('filter', labelsParam);
      } else {
        currentQuery.delete('filter');
      }
      history.replaceState(null, '', `?${currentQuery.toString()}`);
    }
    misss = true;
  }

  $: filteredResponse = $issues.data?.pages?.flatMap((page) => {
    return page.edges
      .filter((edge) => {
        const labels = edge.node.labels.edges.map((node) => node.node.name);
        return selectedLabels.every((label) => labels.includes(label));
      })
      .filter((edge) => {
        if (searchString === '') {
          return true;
        }
        const title = edge.node.title.toLowerCase();
        return title.includes(searchString.trim().toLowerCase());
      });
  });

  // SEO Parameters
  const title = 'Dashboard | Good First Issue Finder';
  const metadescription =
    'Find good first issues by either querying the EddieHub organization or the community';
</script>

<Seo {title} {metadescription} />

<div class="flex flex-col items-center justify-center">
  <div class="mb-4">
    <div class="justify-self-center">
      <Toggle
        id="toggle"
        bind:checked
        labelLeft="EddieHub"
        labelRight="GitHub"
        on:change={onChangeHandler}
      />
    </div>
  </div>
  <div class="flex justify-center">
    <Search bind:searchTerm={searchString} />
    <div class="flex items-center justify-center">
      <Modal clearFilter={onFilterClear} title="Filters" amount={selectedLabels}>
        <Filter
          bind:group={selectedLabels}
          tags={$issues.data?.pages?.flatMap((page) => page.labels) || []}
        />
      </Modal>
    </div>
  </div>
</div>

{#if $issues.isInitialLoading}
  <div class="mt-8 flex items-center justify-center gap-4">
    <Loader background="off-background" /> Loading...
  </div>
{:else if filteredResponse}
  {#if filteredResponse.length < 1}
    <div class="mt-4 text-center">Unfortunately, there were no issues found.</div>
  {:else}
    <div class="mb-4 mt-6 space-y-4">
      {#each filteredResponse as edge}
        <IssueCard issue={edge.node} />
      {/each}
    </div>
    {#if $issues.hasNextPage}
      <div class="flex items-center justify-center">
        <LoadMore isDisabled={$issues.isFetchingNextPage} on:load={() => $issues.fetchNextPage()} />
      </div>
    {/if}
  {/if}
{/if}
