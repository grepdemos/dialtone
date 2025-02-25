<template>
  <button
    :class="['dt-leftbar-unread-pill', `dt-leftbar-unread-pill--${kind}`]"
    type="button"
    data-qa="dt-leftbar-unread-pill"
    v-on="$listeners"
  >
    <dt-icon-arrow-up
      v-if="direction === 'up'"
      size="300"
    />
    <dt-icon-arrow-down
      v-else
      size="300"
    />
    <span data-qa="dt-leftbar-unread-pill__label">
      <slot />
    </span>
  </button>
</template>

<script>
import { DtIconArrowUp, DtIconArrowDown } from '@dialpad/dialtone-icons/vue2';
import { UNREAD_PILL_DIRECTIONS, UNREAD_PILL_KINDS } from './unread_pill_constants';
export default {
  name: 'DtRecipeUnreadPill',

  components: {
    DtIconArrowUp,
    DtIconArrowDown,
  },

  props: {
    /**
     * The kind of unread pill which determines the styling
     * @values 'mentions', 'messages'
     **/
    kind: {
      type: String,
      required: true,
      validator: (kind) => UNREAD_PILL_KINDS.includes(kind),
    },

    /**
     * The direction of the arrow icon
     * @values 'up', 'down'
     **/
    direction: {
      type: String,
      required: true,
      validator: (dir) => UNREAD_PILL_DIRECTIONS.includes(dir),
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

<style lang="less">
.dt-leftbar-unread-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--dt-space-200) var(--dt-space-500) var(--dt-space-200) var(--dt-space-400);
  gap: var(--dt-space-300);
  font-size: var(--dt-font-size-100);
  box-shadow: var(--dt-shadow-medium);
  border-radius: var(--dt-size-radius-pill);
  border: none;
  line-height: var(--dt-font-line-height-600);
  cursor: pointer;

  &--mentions {
    font-weight: var(--dt-font-weight-bold);
    background-color: var(--dt-theme-mention-color-background);
    color: var(--dt-theme-mention-color-foreground);
  }

  &--messages {
    background-color: var(--dt-color-surface-contrast);
    color: var(--dt-color-foreground-secondary-inverted);
  }
}
</style>
