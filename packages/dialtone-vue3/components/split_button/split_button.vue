<template>
  <span
    data-qa="dt-split-button"
    class="d-split-btn"
    :style="{ width }"
  >
    <split-button-alpha
      v-bind="alphaButtonProps"
      ref="alphaButton"
      @click="$emit('alpha-clicked')"
    >
      <template #icon="{ size: iconSize }">
        <!-- @slot Alpha (left) button icon slot -->
        <slot
          name="alphaIcon"
          :size="iconSize"
        />
      </template>
      <!-- @slot Default content slot -->
      <slot name="default" />
    </split-button-alpha>
    <!-- @slot Omega (right) content slot, overrides omega button styling and functionality completely -->
    <slot name="omega">
      <dt-dropdown
        v-if="$slots.dropdownList"
        :placement="dropdownPlacement"
        @click="isDropdownOpen = true"
        @opened="open => isDropdownOpen = open"
      >
        <template #anchor="attrs">
          <split-button-omega
            v-bind="{ ...attrs, ...omegaButtonProps }"
            :active="isDropdownOpen"
            @click="$emit('omega-clicked')"
          >
            <template #icon="{ size: iconSize }">
              <!-- @slot Omega (right) button icon slot -->
              <slot
                name="omegaIcon"
                :size="iconSize"
              />
            </template>
          </split-button-omega>
        </template>
        <template #list="{ close }">
          <!-- @slot Built-in dropdown content slot, use of dt-list-item is highly recommended here. -->
          <slot
            name="dropdownList"
            :close="close"
          />
        </template>
      </dt-dropdown>

      <split-button-omega
        v-else
        v-bind="omegaButtonProps"
        @click="$emit('omega-clicked')"
      >
        <template #icon="{ size: iconSize }">
          <!-- @slot Omega (right) button icon slot -->
          <slot
            name="omegaIcon"
            :size="iconSize"
          />
        </template>
      </split-button-omega>
    </slot>
  </span>
</template>

<script>
import {
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_SIZE_MODIFIERS,
  ICON_POSITION_MODIFIERS,
} from '@/components/button';
import SplitButtonAlpha from './split_button-alpha.vue';
import SplitButtonOmega from './split_button-omega.vue';
import { DtDropdown } from '@/components/dropdown';
import { hasSlotContent, warnIfUnmounted } from '@/common/utils';

export default {
  name: 'DtSplitButton',

  components: {
    SplitButtonOmega,
    DtDropdown,
    SplitButtonAlpha,
  },

  inheritAttrs: false,

  props: {
    /**
     * Determines whether the alpha button should have active styling
     * @values true, false
     */
    alphaActive: {
      type: Boolean,
      default: false,
    },

    /**
     * Descriptive label for the alpha button
     */
    alphaAriaLabel: {
      type: String,
      default: null,
    },

    /**
     * The position of the icon slot within the alpha button.
     * @values left, right, top, bottom
     */
    alphaIconPosition: {
      type: String,
      default: 'left',
      validator: (position) => Object.keys(ICON_POSITION_MODIFIERS).includes(position),
    },

    /**
     * Used to customize the alpha label container
     */
    alphaLabelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Whether the alpha button should display a loading animation or not.
     * @values true, false
     */
    alphaLoading: {
      type: Boolean,
      default: false,
    },

    /**
     * Text shown in tooltip when you hover the alpha button,
     * required if no content is passed to default slot
     */
    alphaTooltipText: {
      type: String,
      default: undefined,
    },

    /**
     * Determines whether a screenreader reads live updates of
     * the button content to the user while the button
     * is in focus.
     * @values true, false
     */
    assertiveOnFocus: {
      type: Boolean,
      default: false,
    },

    /**
     * HTML button disabled attribute
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank">
     *  (Reference)
     * </a>
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * The direction the dropdown displays relative to the anchor.
     * @values top, top-start, top-end, right, right-start, right-end, left, left-start, left-end, bottom, bottom-start, bottom-end, auto, auto-start, auto-end
     */
    dropdownPlacement: {
      type: String,
      default: 'bottom-end',
    },

    /**
     * The fill and outline of the button associated with its visual importance.
     * @values clear, outlined, primary
     */
    importance: {
      type: String,
      default: 'primary',
      validator: (i) => Object.keys(BUTTON_IMPORTANCE_MODIFIERS).includes(i),
    },

    /**
     * The color of the button.
     * @values default, muted, danger, inverted
     */
    kind: {
      type: String,
      default: 'default',
      validator: (k) => Object.keys(BUTTON_KIND_MODIFIERS).includes(k),
    },

    /**
     * Determines whether the omega button should have active styling
     * @values true, false
     */
    omegaActive: {
      type: Boolean,
      default: false,
    },

    /**
     * Descriptive label for the omega button
     */
    omegaAriaLabel: {
      type: String,
      default: null,
    },

    /**
     * Element ID, useful in case you need to reference the button
     * as an external anchor for popover.
     */
    omegaId: {
      type: String,
      default: undefined,
    },

    /**
     * Text shown in tooltip when you hover the omega button,
     * required as it is an icon only button
     */
    omegaTooltipText: {
      type: String,
      default: undefined,
    },

    /**
     * The size of the button.
     * @values xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: 'md',
      validator: (s) => Object.keys(BUTTON_SIZE_MODIFIERS).includes(s),
    },

    /**
     * Button width, accepts
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/CSS/width" target="_blank">
     *   CSS width attribute
     * </a>
     * values
     */
    width: {
      type: String,
      default: null,
    },
  },

  emits: [
    /**
     * Native alpha button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'alpha-clicked',

    /**
     * Native omega button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'omega-clicked',
  ],

  data () {
    return {
      isDropdownOpen: false,
    };
  },

  computed: {
    alphaButtonProps () {
      return {
        active: this.alphaActive,
        ariaLabel: this.alphaAriaLabel,
        assertiveOnFocus: this.assertiveOnFocus,
        disabled: this.disabled,
        iconPosition: this.alphaIconPosition,
        labelClass: this.alphaLabelClass,
        loading: this.alphaLoading,
        importance: this.importance,
        kind: this.kind,
        size: this.size,
        tooltipText: this.alphaTooltipText,
        class: this.$attrs.class,
      };
    },

    omegaButtonProps () {
      return {
        id: this.omegaId,
        active: this.omegaActive,
        ariaLabel: this.omegaAriaLabel,
        disabled: this.disabled,
        importance: this.importance,
        kind: this.kind,
        size: this.size,
        tooltipText: this.omegaTooltipText,
        class: this.$attrs.class,
      };
    },
  },

  created () {
    this.validateProps();
  },

  updated () {
    this.validateProps();
  },

  mounted () {
    warnIfUnmounted(this.$el, this.$options.name);
  },

  methods: {
    validateProps () {
      this.validateAlphaButtonProps();
      this.validateOmegaButtonProps();
    },

    validateAlphaButtonProps () {
      if (hasSlotContent(this.$slots.default)) return;

      if (hasSlotContent(this.$slots.alphaIcon) && !this.alphaTooltipText) {
        console.warn('alpha-tooltip-text prop must be set if alpha button has an icon only');
      }
    },

    validateOmegaButtonProps () {
      if (hasSlotContent(this.$slots.omega)) return;

      if (!this.omegaTooltipText) {
        console.warn('omega-tooltip-text prop is required as it is an icon-only button');
      }
    },
  },
};
</script>
