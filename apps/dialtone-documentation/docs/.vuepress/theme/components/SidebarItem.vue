<template>
  <dt-collapsible
    element-type="li"
    max-width="100%"
    :open="item.link ? isOpen : true"
    class="dt-sidebar-item"
  >
    <template #anchor="{ attrs }">
      <dt-stack
        direction="row"
        class="d-ps-relative"
      >
        <router-link
          v-slot="{ navigate, isExactActive }"
          :to="item.link ?? ''"
          custom
        >
          <dt-button
            v-bind="attrs"
            importance="clear"
            kind="muted"
            label-class="d-jc-flex-start"
            icon-position="right"
            :class="[
              'd-bar-pill d-w100p d-fw-normal d-us-none d-td-none d-fc-primary',
              {
                'd-headline--eyebrow d-fw-semibold d-fc-secondary d-bgc-transparent d-c-default': !item.link,
                'd-btn--active d-fw-medium': isActiveLink(isExactActive, item.link),
              },
            ]"
            @click="handleAnchorClick(navigate, item.link)"
          >
            {{ item.text }}
            <template #icon="{ iconSize }">
              <dt-icon
                v-if="item.link"
                :name="isOpen ? 'chevron-down' : 'chevron-right'"
                :size="iconSize"
              />
            </template>
          </dt-button>
        </router-link>
      </dt-stack>
    </template>
    <template #content>
      <dt-stack
        as="ul"
        :class="{ 'd-pl8': nested }"
        gap="200"
      >
        <li
          v-for="(subItem, index) in subItems"
          :key="subItem.text"
        >
          <sidebar-item v-if="subItem.children" :item="subItem" nested />
          <router-link
            v-else-if="!subItem.planned"
            v-slot="{ navigate, isExactActive }"
            :to="subItem.link"
            custom
          >
            <dt-button
              importance="clear"
              kind="muted"
              label-class="d-jc-flex-start"
              :class="[
                'd-bar-pill d-w100p d-fw-normal d-us-none d-td-none d-fc-primary',
                {
                  'd-btn--active d-fw-medium': isActiveLink(isExactActive, subItem.link),
                  'd-mt2': (index === 0 && nested), // add margin top to first nested item
                },
              ]"
              @click="navigate"
            >
              {{ subItem.text }}
            </dt-button>
          </router-link>
          <div
            v-else
            class="d-btn d-w100p d-jc-flex-start d-fw-normal d-fc-disabled h:d-bgc-transparent d-c-default"
          >
            {{ subItem.text }}
            <dt-badge
              v-if="subItem.planned"
              class="d-fw-normal d-ml4"
            >
              Planned
            </dt-badge>
          </div>
        </li>
      </dt-stack>
    </template>
  </dt-collapsible>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  isSinglePage: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: () => {},
  },
  nested: {
    type: Boolean,
    default: false,
  },
});
const subItems = computed(() => {
  return props.item?.children || [];
});
const route = useRoute();
const hash = ref(route.hash);
const isOpen = ref(false);

watch(route, (newRoute) => {
  hash.value = newRoute.hash;
  isOpen.value = false;
}, { flush: 'pre', immediate: true, deep: true });

onMounted(() => {
  if (route.path === props.item.link) {
    isOpen.value = true;
  }
});

// isExactActive from the router-link doesn't work with hashes,
// that's why we need to check for the hash if it's a single page
const isActiveLink = (isExactActive, link) => {
  if (!link) return false;
  const active = props.isSinglePage ? hash.value === link : isExactActive;
  if (route.path === link) { isOpen.value = active; }
  return active;
};

function handleAnchorClick (navigate, link) {
  isOpen.value = true;
  if (!link) return;
  navigate();
}
</script>

<style lang="less" scoped>
.dt-sidebar-item {
  width: var(--dt-size-100-percent);
}
</style>
