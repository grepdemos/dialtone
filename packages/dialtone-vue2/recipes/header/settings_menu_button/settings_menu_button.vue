<template>
  <dt-button
    v-if="updateAvailable"
    importance="outlined"
    size="xs"
    icon-position="right"
    class="settings-menu-button-update"
    :aria-label="ariaLabel"
    v-on="$listeners"
  >
    <slot />
    <template #icon>
      <dt-icon-more-vertical
        size="300"
      />
    </template>
  </dt-button>
  <dt-button
    v-else
    importance="clear"
    kind="inverted"
    class="settings-menu-button"
    :aria-label="ariaLabel"
    v-on="$listeners"
  >
    <template #icon>
      <dt-icon-more-vertical
        size="300"
      />
    </template>
  </dt-button>
</template>

<script>
import DtButton from '@/components/button/button.vue';
import { DtIconMoreVertical } from '@dialpad/dialtone-icons/vue2';

export default {
  name: 'DtRecipeSettingsMenuButton',

  components: {
    DtButton,
    DtIconMoreVertical,
  },

  props: {
    /**
     * Determines whether the button should display the update state
     * default is false
     * @values true, false
     */
    updateAvailable: {
      type: Boolean,
      default: false,
    },

    /**
     * Aria label
     */
    ariaLabel: {
      type: String,
      required: true,
    },
  },

  emits: [
    /**
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

};
</script>

<style scoped lang="less">
.settings-menu-button {
  padding: var(--dt-space-0);
  border-radius: var(--dt-size-550);
  height: var(--dt-size-600);
  width: var(--dt-size-550);
  color: var(--dt-theme-topbar-button-color-foreground);
  background-color: var(--dt-theme-topbar-button-color-background);

  &:hover {
    background-color: var(--dt-theme-topbar-button-color-background-hover);
    color: var(--dt-theme-topbar-button-color-foreground-hover);
  }

  &:active {
    background-color: var(--dt-theme-topbar-button-color-background-active);
  }
}

.settings-menu-button-update {
  background-color: hsla(var(--dt-color-blue-200-hsl) / 25%);
  color: var(--dt-color-blue-500);
  border-color: hsla(var(--dt-color-blue-200-hsl) / 25%);
  border-radius: var(--dt-size-radius-pill);
  height: var(--dt-size-600);

  &:hover {
    background-color: hsla(var(--dt-color-blue-200-hsl) / 50%);
    color: var(--dt-theme-topbar-button-color-foreground-hover);
  }
}
</style>
