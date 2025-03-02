<!-- eslint-disable vuejs-accessibility/no-autofocus -->
<template>
  <div class="d-d-grid d-gg16 d-g-cols6 d-mt32 d-mb16 d-p16 d-bgc-secondary d-bar8">
    <div class="d-gc4">
      <dt-input
        id="search-input"
        ref="searchRef"
        v-model="search"
        autofocus
        aria-label="Search icon"
        label="Find an icon"
        class="d-input d-input-icon--left d-input-icon--right"
        type="text"
        autocomplete="off"
        @keyup="searchIcon"
      >
        <template #leftIcon>
          <dt-icon name="search" size="300" />
        </template>
        <template #rightIcon>
          <dt-button
            v-if="!isSearchEmpty"
            id="search-input-button-close"
            kind="muted"
            importance="clear"
            size="xs"
            circle
            aria-label="Clear filters"
            @click="resetSearch"
          >
            <template #icon>
              <dt-icon name="close" size="200" />
            </template>
          </dt-button>
        </template>
      </dt-input>
    </div>
    <div class="d-gc2">
      <div class="d-label">
        <label for="Dialtone--SelectCategory"> Category</label>
      </div>
      <div class="d-select">
        <select
          id="Dialtone--SelectCategory"
          v-model="selectedCategory"
          class="d-select__input d-tt-capitalize"
        >
          <option
            value=""
            selected
          >
            All
          </option>
          <option
            v-for="(_, category) in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
    </div>
  </div>
  <div
    v-for="(icons, category) in filteredIconsList"
    :key="category"
    class="d-mb16"
  >
    <div
      class="d-headline--lg d-tt-capitalize d-mb4"
      v-text="category"
    />
    <div class="d-gl-docsite-icons">
      <icon-popover
        v-for="(keywords, name) in icons"
        :id="`in-${name}`"
        :key="name"
        v-model="isPopoverOpen[name]"
        :icon-name="name"
        :category="category"
        :keywords="keywords"
        @click="selectIcon({ name, keywords, category })"
      />
    </div>
  </div>
  <div v-if="!hasSearchResults" class="d-body d-fc-tertiary d-p16 d-pt0 d-ta-center">
    <span>No results found for</span>
    <strong class="d-fw-semibold">
      &OpenCurlyDoubleQuote;{{ search }}&CloseCurlyDoubleQuote;
    </strong>
  </div>
  <dt-modal
    v-if="selectedIcon"
    :show="isModalOpen"
    :close-button-props="{ ariaLabel: 'Close' }"
    size="full"
    content-class="d-wmx100p d-pr32"
    @update:show="isModalOpen = false"
  >
    <template #header>
      <span
        class="d-tt-capitalize"
        v-text="selectedIcon.name"
      />
    </template>
    <icon-popover-content
      :icon-name="selectedIcon.name"
      :keywords="selectedIcon.keywords"
      :category="selectedIcon.category"
    />
  </dt-modal>
</template>

<script setup>
import { categories } from '@dialpad/dialtone-icons/keywords-icons.json';
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import IconPopover from '../baseComponents/IconPopover.vue';
import IconPopoverContent from '../baseComponents/IconPopoverContent.vue';
import { debounce } from '../common/utilities';

const selectedCategory = ref('');
const search = ref(null);
const searching = ref(false);
const searchRef = ref(null);
const isMobile = ref(false);
const isModalOpen = ref(false);
const isPopoverOpen = ref({});
const filteredIconsList = ref({});
const selectedIcon = ref(undefined);

const searchIcon = () => {
  debounce(() => {
    searching.value = true;
    resetCategory();
    filterIconList();

    // Update URL with search parameter
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('icon_name')) {
      queryParams.delete('icon_name');
    }
    if (search.value) {
      queryParams.set('search', search.value);
    } else {
      queryParams.delete('search');
    }
    history.pushState(null, null, `?${queryParams.toString()}${window.location.hash}`);
  });
};

const resetSearch = () => {
  searching.value = false;
  search.value = null;
  resetCategory();
  searchRef.value.focus();
  filterIconList();

  // Remove search parameter from URL
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.delete('search');
  history.pushState(null, null, `?${queryParams.toString()}${window.location.hash}`);
};

const resetCategory = () => {
  selectedCategory.value = '';
};

const isSearchEmpty = computed(() => !search.value || search.value.trim().length === 0);

const hasSearchResults = computed(() => Object.keys(filteredIconsList.value).length > 0);

/**
 * Filters the icon list coming from @dialpad/dialtone-icons
 * Iterates over the categories and filter's by the selected category or bypass it by selecting
 * 'All categories' option.
 * In each category, iterate over the icons and filter by the search text or bypass it if the search in empty
 * If category has icons after filter, gets added to the categories Object.
 *
 * The filteredIconsList gets updated with a freezed object to improve performance.
 * @returns void
 */
const filterIconList = () => {
  const regex = new RegExp(search.value, 'i');
  const filteredIcons = Object.keys(categories)
    .filter(category => category.includes(selectedCategory.value))
    .reduce((acc, category) => {
      const filteredCategory = Object.entries(categories[category])
        .filter(([name, keywords]) => {
          if (!search.value) return true;
          return regex.test(name) || regex.test(keywords.join(' '));
        })
        .reduce((acc, [name, _]) => Object.assign(acc, { [name]: Object.freeze(categories[category][name]) }), {});

      if (Object.keys(filteredCategory).length) {
        Object.assign(acc, { [category]: Object.freeze(filteredCategory) });
      }
      return acc;
    }, {});

  filteredIconsList.value = Object.freeze(filteredIcons);
};

const selectIcon = (icon) => {
  selectedIcon.value = icon;
  if (isMobile.value) isModalOpen.value = true;
  else isPopoverOpen.value[icon.name] = !isPopoverOpen.value[icon.name];
};

const scrollToIcon = async (iconName) => {
  if (isMobile.value) {
    const iconsList = filteredIconsList.value;
    for (const category of Object.keys(iconsList)) {
      if (iconsList[category][iconName]) {
        selectIcon({ name: iconName, keywords: iconsList[category][iconName], category });
        break;
      }
    }
    isModalOpen.value = true;
  } else {
    isPopoverOpen.value[iconName] = !isPopoverOpen.value[iconName];
    await nextTick();
    const iconElement = document.getElementById(`in-${iconName}`); // Scroll to the opened popover
    if (iconElement) {
      // there is a style in dialtone-docs.less setting scroll-behavior: smooth, so
      // we need to first set it to auto to avoid having the scroll animation
      document.documentElement.style.scrollBehavior = 'auto';
      iconElement.scrollIntoView({ behavior: 'instant' });
      await nextTick();
      // set the scroll behavior to smooth again
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }
};

watch(selectedCategory, (newCategory) => {
  if (newCategory === 'all' && searching.value) return;
  searching.value = false;
  filterIconList();
});

onMounted(() => {
  isMobile.value = window.outerWidth <= 980;
  // Check for existing search parameter in URL
  const queryParams = new URLSearchParams(window.location.search);
  const searchParam = queryParams.get('search');
  if (searchParam !== null) {
    search.value = searchParam;
  }
  filterIconList();
  // Open the popover if iconName has something
  const initialIconName = new URLSearchParams(window.location.search).get('icon_name');
  if (initialIconName) {
    scrollToIcon(initialIconName);
  }
});
</script>

<style scoped>
  /* more or less a hack, 🤷‍♂️ */
  #search-input-button-close {
    margin-right: var(--dt-size-350-negative);
  }
</style>
