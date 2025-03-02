<template>
  <div
    class="dt-recipe--callbar-button-with-popover"
  >
    <dt-recipe-callbar-button
      :aria-label="ariaLabel"
      :disabled="disabled"
      :active="active"
      :danger="danger"
      :button-class="buttonClass"
      :button-width-size="buttonWidthSize"
      :text-class="textClass"
      class="dt-recipe--callbar-button-with-popover--main-button"
      @click="buttonClick"
    >
      <slot
        slot="icon"
        name="icon"
      />
      <slot
        slot="tooltip"
        name="tooltip"
      />
      <slot />
    </dt-recipe-callbar-button>
    <dt-popover
      v-if="showArrowButton"
      :id="id"
      :modal="false"
      :open="open"
      :placement="placement"
      :initial-focus-element="initialFocusElement"
      :show-close-button="showCloseButton"
      :offset="offset"
      padding="none"
      class="dt-recipe--callbar-button-with-popover--popover-wrapper"
      :dialog-class="['dt-recipe--callbar-button-with-popover--popover', contentClass]"
      header-class="d-d-flex d-ai-center d-fw-normal d-px12"
      v-bind="$attrs"
      :open-popover="showPopover"
      @opened="onModalIsOpened"
    >
      <template #anchor>
        <dt-button
          circle
          importance="clear"
          size="lg"
          :class="['dt-recipe--callbar-button-with-popover--arrow',
                   { 'dt-recipe--callbar-button-with-popover--arrow--large': !isCompactMode }]"
          width="2rem"
          :aria-label="arrowButtonLabel"
          :active="open"
          @click="arrowClick"
        >
          <template #icon>
            <dt-icon-chevron-up
              class="dt-recipe--callbar-button-with-popover--arrow__icon"
              size="200"
            />
          </template>
        </dt-button>
      </template>
      <slot
        slot="content"
        name="content"
      />
      <slot
        slot="headerContent"
        name="headerContent"
      />
      <slot
        slot="footerContent"
        name="footerContent"
      />
    </dt-popover>
  </div>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtPopover } from '@/components/popover';
import { DtIconChevronUp } from '@dialpad/dialtone-icons/vue2';
import { DtRecipeCallbarButton, CALLBAR_BUTTON_VALID_WIDTH_SIZE } from '../callbar_button';
import utils, { warnIfUnmounted } from '@/common/utils';

export default {
  name: 'DtRecipeCallbarButtonWithPopover',

  components: { DtRecipeCallbarButton, DtPopover, DtButton, DtIconChevronUp },

  /* inheritAttrs: false is generally an option we want to set on library
    components. This allows any attributes passed in that are not recognized
    as props to be passed down to another element or component using v-bind:$attrs
    more info: https://vuejs.org/v2/api/#inheritAttrs */
  inheritAttrs: false,

  props: {
    /**
     * Id for the item.
     */
    id: {
      type: String,
      default () {
        return utils.getUniqueString();
      },
    },

    /**
     * Aria label for the button. If empty, it takes its value from the default slot.
     */
    ariaLabel: {
      type: String,
      default: null,
      validator: (label) => {
        return label || this.$slots.default;
      },
    },

    /**
     * Aria label for the arrow. Cannot be empty.
     */
    arrowButtonLabel: {
      type: String,
      required: true,
      validator: (label) => {
        return !!label;
      },
    },

    /**
     * The direction the popover displays relative to the anchor.
     * @values 'bottom', 'bottom-start', 'bottom-end',
     *         'right', 'right-start', 'right-end',
     *         'left', 'left-start', 'left-end',
     *         'top', 'top-start', 'top-end'
     * @default 'top'
     */
    placement: {
      type: String,
      default: 'top',
    },

    /**
     *  Displaces the content box from its anchor element
     *  by the specified number of pixels.
     *  <a
     *    class="d-link"
     *    href="https://atomiks.github.io/tippyjs/v6/all-props/#offset"
     *    target="_blank"
     *  >
     *    Tippy.js docs
     *  </a>
     */
    offset: {
      type: Array,
      default: () => [0, 16],
    },

    /**
     * The element that is focused when the popover is opened. This can be an
     * HTMLElement within the popover, a string starting with '#' which will
     * find the element by ID. 'first' which will automatically focus
     * the first element, or 'dialog' which will focus the dialog window itself.
     * If the dialog is modal this prop cannot be 'none'.
     */
    initialFocusElement: {
      type: String,
      default: 'first',
    },

    /**
     * Determines visibility for close button
     */
    showCloseButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines whether the button should be disabled
     * default is false.
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Forces showing the arrow, even if the button is disabled.
     * default is false
     * @values true, false
     */
    forceShowArrow: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether the button should have active styling
     * default is false.
     * @values true, false
     * @see https://dialtone.dialpad.com/components/button/
     */
    active: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether the button should have danger styling
     * default is false.
     * @values true, false
     * @see https://dialtone.dialpad.com/components/button/
     */
    danger: {
      type: Boolean,
      default: false,
    },

    /**
     * Additional class name for the button wrapper element.
     */
    buttonClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the button text.
     */
    textClass: {
      type: [String, Array, Object],
      default: '',
    },

    /*
     * Width size. Valid values are: 'xl', 'lg', 'md' and 'sm'.
     */
    buttonWidthSize: {
      type: String,
      default: 'xl',
      validator: size => CALLBAR_BUTTON_VALID_WIDTH_SIZE.includes(size),
    },

    /**
     * Additional class name for the popover content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * To auto open the modal popover.
     */
    openPopover: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Emitted when the arrow is clicked
     */
    'arrow-click',

    /**
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Emitted when modal popover is opened or closed.
     */
    'opened',
  ],

  data () {
    return {
      open: false,
    };
  },

  computed: {
    showArrowButton () {
      return this.forceShowArrow || !this.disabled;
    },

    isCompactMode () {
      return this.buttonWidthSize === 'sm' || this.buttonWidthSize === 'md';
    },

    showPopover () {
      if (!this.openPopover || this.open) {
        this.syncOpenState();
        return false;
      }

      return this.toggleOpen();
    },
  },

  mounted () {
    warnIfUnmounted(this.$el, this.$options.name);
  },

  methods: {
    arrowClick (ev) {
      this.$emit('arrow-click', ev);
      return this.toggleOpen();
    },

    toggleOpen () {
      return (this.open = !this.open);
    },

    syncOpenState () {
      this.open = this.openPopover;
    },

    buttonClick (ev) {
      // If no listener for the click event, the button click opens the popover
      // the same as if the arrow was clicked.
      if (!this.$listeners.click) {
        this.arrowClick(ev);
      } else {
        this.$emit('click', ev);
      }
    },

    onModalIsOpened (isOpened) {
      this.open = isOpened;
      this.$emit('opened', isOpened);
    },
  },

};
</script>

<style lang="less">
.dt-recipe--callbar-button-with-popover--arrow {
  margin-top: var(--dt-space-350-negative);
  margin-left: calc(var(--dt-space-300-negative) * 5);
  width: var(--dt-size-500);
  height: var(--dt-size-500);
  padding: var(--dt-space-400);
  border-radius: var(--dt-size-300);

  &.d-btn--active {
    background: var(--dt-color-surface-moderate-opaque);
  }

  &--large {
    margin-left: var(--dt-space-550-negative);
  }

  &__icon {
    color: var(--dt-color-black-800);
  }
}

.dt-recipe--callbar-button-with-popover--popover {
  .d-popover__header {
    background: var(--dt-color-surface-contrast);
    color: var(--dt-color-foreground-primary-inverted);

    .d-btn {
      color: var(--dt-color-foreground-primary-inverted);
    }
  }
}

.dt-recipe--callbar-button-with-popover--button .d-tab--selected::after,
.dt-recipe--callbar-button-with-popover--button .d-tab--selected:hover::after {
  --tab--bgc: var(--dt-color-surface-contrast);
}
.dt-recipe--callbar-button-with-popover--button .tab-group {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dt-recipe--callbar-button-with-popover--button .tab-content {
  flex: 1 1 100%;
  overflow-y: auto;
}

.dt-recipe--callbar-button-with-popover {
  display: flex;
  align-items: center;
}
</style>
