<template>
  <dt-tooltip
    :id="id"
    :offset="[0, 24]"
  >
    <template #anchor>
      <span
        :class="{ 'dt-recipe-callbar-button--disabled': disabled }"
      >
        <dt-button
          :importance="buttonImportance"
          kind="muted"
          icon-position="top"
          :aria-disabled="disabled"
          :aria-label="ariaLabel"
          :label-class="callbarButtonTextClass"
          :width="buttonWidth"
          :class="callbarButtonClass"
          v-bind="$attrs"
          v-on="callbarButtonListeners"
        >
          <slot />
          <template #icon>
            <slot name="icon" />
          </template>
        </dt-button>
      </span>
    </template>
    <slot name="tooltip" />
  </dt-tooltip>
</template>

<script>
import { CALLBAR_BUTTON_VALID_WIDTH_SIZE } from './callbar_button_constants';
import { DtButton } from '@/components/button';
import { DtTooltip } from '@/components/tooltip';
import utils, { extractVueListeners } from '@/common/utils';

export default {
  name: 'DtRecipeCallbarButton',

  components: { DtButton, DtTooltip },

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
     * Determines whether the button should be disabled
     * default is false.
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the button is a circle or not.
     * @values true, false
     * @see https://dialtone.dialpad.com/components/button/
     */
    circle: {
      type: Boolean,
      default: false,
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
     * The fill and outline of the button associated with its visual importance.
     * @values clear, outlined, primary
     */
    importance: {
      type: String,
      default: '',
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

  computed: {
    callbarButtonClass () {
      return [
        this.buttonClass,
        'dt-recipe-callbar-button',
        'd-px0',
        {
          'dt-recipe-callbar-button--circle': this.circle,
          'dt-recipe-callbar-button--active': this.active,
          'dt-recipe-callbar-button--danger': this.danger,
          'd-btn--disabled d-bgc-transparent': this.disabled,
          'd-fc-primary': !this.disabled,
        }];
    },

    callbarButtonTextClass () {
      return [
        'd-fs-100 lg:d-d-none md:d-d-none sm:d-d-none',
        this.textClass,
      ];
    },

    buttonWidth () {
      switch (this.buttonWidthSize) {
        case 'sm':
          return '4.5rem';
        case 'md':
          return '6rem';
        default:
          return '8.4rem';
      }
    },

    buttonImportance () {
      if (this.importance) {
        return this.importance;
      }
      return this.circle ? 'outlined' : 'clear';
    },

    callbarButtonListeners () {
      return {
        ...extractVueListeners(this.$attrs),
        click: (event) => this.$emit('click', event),
      };
    },
  },
};
</script>

<style lang="less">
.dt-recipe-callbar-button:not(.dt-recipe-callbar-button--circle) {
  line-height: var(--dt-font-line-height-300);
}

.dt-recipe-callbar-button--circle {
  border-radius: var(--dt-size-radius-circle);
}

.dt-recipe-callbar-button.d-btn[disabled] {
  background-color: unset;
  opacity: .5;
}

.dt-recipe-callbar-button--circle.d-btn[disabled] {
  border-color: unset;
}

.dt-recipe-callbar-button--active,
.dt-recipe-callbar-button--active:hover {
  .base-button__icon {
    color: var(--primary-color);
  }
}

.dt-recipe-callbar-button--disabled {
  cursor: not-allowed;
}
</style>
