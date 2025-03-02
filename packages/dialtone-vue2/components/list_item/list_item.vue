<template>
  <component
    :is="elementType"
    :id="id"
    :class="['dt-list-item', {
      'dt-list-item--focusable': isFocusable,
      'dt-list-item--highlighted': isHighlighted,
      'dt-list-item--static': !isHoverable,
    }]"
    :tabindex="isFocusable ? 0 : -1"
    :role="role"
    :aria-selected="role === 'listitem' ? undefined : isHighlighted"
    v-on="listItemListeners"
  >
    <component
      :is="listItemType"
      v-if="listItemType"
    >
      <template
        v-for="(_, slotName) in $slots"
        #[slotName]
      >
        <!-- @slot named slots for custom list items -->
        <slot :name="slotName" />
      </template>
      <template
        v-if="selected"
        #selected
      >
        <dt-icon-check
          size="400"
          class="dt-list-item--selected-icon"
        />
      </template>
    </component>
    <!-- @slot slot for the main content -->
    <slot v-else />
  </component>
</template>

<script>
import {
  LIST_ITEM_TYPES,
  LIST_ITEM_NAVIGATION_TYPES,
} from './list_item_constants';
import utils from '@/common/utils';
import { DtIconCheck } from '@dialpad/dialtone-icons/vue2';
import { DtItemLayout } from '@/components/item_layout';

const ROLES = ['listitem', 'menuitem', 'option'];

/**
 * A list item is an element that can be used to represent individual items in a list.
 * @see https://dialtone.dialpad.com/components/list_item.html
 */
export default {
  name: 'DtListItem',

  components: {
    DtItemLayout,
    DtIconCheck,
  },

  /**
   * Value provided from keyboard_list_navigation.js using id prop.
   */
  inject: {
    highlightId: { default: null },
  },

  props: {
    /**
     * Id for the item.
     */
    id: {
      type: String,
      default () { return utils.getUniqueString(); },
    },

    /**
     * String to use for the item's role.
     */
    role: {
      type: String,
      default: 'listitem',
      validator: (role) => (ROLES).includes(role),
    },

    /**
     * HTML element type (tag name) of the content wrapper element.
     */
    elementType: {
      type: String,
      default: 'li',
    },

    /**
     * The type of child list item to use.
     * @values default, custom
     */
    type: {
      type: String,
      default: LIST_ITEM_TYPES.DEFAULT,
      validator: (t) => Object.values(LIST_ITEM_TYPES).includes(t),
    },

    /**
     * The type of navigation that this component should support.
     * - "arrow-keys" for items that are navigated with UP/DOWN keys.
     * - "tab" for items that are navigated using the TAB key.
     * - "none" for static items that are not interactive.
     * @values arrow-keys, tab, none
     */
    navigationType: {
      type: String,
      default: LIST_ITEM_NAVIGATION_TYPES.NONE,
      validator: (t) => Object.values(LIST_ITEM_NAVIGATION_TYPES).includes(t),
    },

    /**
     * Applies selected styles to the list item
     */
    selected: {
      type: Boolean,
      default: false,
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

    /**
     * Key down event
     *
     * @event keydown
     * @type {KeyboardEvent}
     */
    'keydown',

    /**
     * Native mouse move event
     *
     * @event mousemove
     * @type {MouseEvent}
     */
    'mousemove',

    /**
     * Native mouse leave event
     *
     * @event mouseleave
     * @type {MouseEvent}
     */
    'mouseleave',
  ],

  data () {
    return {
      injected: false,
      mouseHighlighted: false,
    };
  },

  computed: {
    listItemType () {
      switch (this.type) {
        case LIST_ITEM_TYPES.DEFAULT:
          return DtItemLayout;
        default:
          return null;
      }
    },

    listItemListeners () {
      return {
        ...this.$listeners,
        keydown: event => {
          if (['enter', 'space'].includes(event.code.toLowerCase())) {
            this.onClick(event);
          }
          this.$emit('keydown', event);
        },

        mousemove: event => {
          this.onMouseHover(event);
          this.$emit('mousemove', event);
        },

        mouseleave: event => {
          this.onMouseLeave(event);
          this.$emit('mouseleave', event);
        },
      };
    },

    /**
     * For keyboard navigation, whether this item is currently highlighted.
     * An injected highlightId will override the default mouseover highlight.
     */
    isHighlighted () {
      if (this.isHoverable) {
        return this.highlightId && this.highlightId() ? this.id === this.highlightId() : this.mouseHighlighted;
      }
      return false;
    },

    isFocusable () {
      // Navigation type has to be set to "tab".
      return this.navigationType === LIST_ITEM_NAVIGATION_TYPES.TAB;
    },

    /**
     * Whether to apply hover styles.
     */
    isHoverable () {
      return this.navigationType !== LIST_ITEM_NAVIGATION_TYPES.NONE;
    },
  },

  methods: {
    onClick (e) {
      this.$emit('click', e);
    },

    onMouseHover () {
      this.mouseHighlighted = true;
    },

    onMouseLeave () {
      this.mouseHighlighted = false;
    },
  },
};
</script>

<style lang="less">
.dt-list-item {
  list-style: none;
  background-color: var(--dt-action-color-background-muted-default);

  &:not(.dt-list-item--static) {
    cursor: pointer;
    border-radius: var(--dt-size-radius-300);
  }

  &--focusable:focus,
  &--focusable:focus-within,
  &--highlighted {
    background-color: var(--dt-action-color-background-muted-hover);
  }

  &--highlighted:active {
    background-color: var(--dt-action-color-background-muted-active);
  }

  &--selected-icon {
    margin-left: var(--dt-space-400);
  }

  :focus-visible {
    outline: none;
    box-shadow: var(--dt-shadow-focus);
  }
}
</style>
