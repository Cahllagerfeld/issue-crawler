<script lang="ts">
  import PackageVersion from './package-version.svelte';
</script>

<footer class="mt-auto w-full bg-skin-off-background py-4">
  <div class="mx-auto flex w-[90%] max-w-[1440px] items-center justify-between">
    <PackageVersion />

    <ul class="flex list-none items-center justify-center gap-8">
      <li>
        <a
          data-test-id="discord-btn"
          class="transition duration-200 hover:text-[#7289da] active:text-primary-100"
          href="http://discord.eddiehub.org"
          target="_blank"
          rel="noreferrer"
          aria-label="Discord"><i class="fa-brands fa-discord fa-xl" title="Discord" /></a
        >
      </li>
      <li>
        <a
          data-test-id="github-btn"
          target="_blank"
          rel="noreferrer"
          class="transition duration-200 hover:text-[#333333] active:text-primary-100 dark:hover:text-[#fafafa]"
          href="http://github.eddiehub.org"
          aria-label="Github"><i class="fa-brands fa-github fa-xl" title="Github" /></a
        >
      </li>
      <li>
        <a
          data-test-id="linkedin-btn"
          target="_blank"
          rel="noreferrer"
          class="transition duration-200 hover:text-[#0e76a8] active:text-primary-100"
          href="http://linkedin.com/company/eddiehub"
          aria-label="LinkedIn"><i class="fab fa-linkedin fa-xl" title="LinkedIn" /></a
        >
      </li>
    </ul>
  </div>
</footer>
