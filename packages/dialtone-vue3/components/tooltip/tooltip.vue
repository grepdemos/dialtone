<template>
  <div data-qa="dt-tooltip-container">
    <!-- disabling as the below events are for capturing events from interactive
         elements within the span rather than on the span itself -->
    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
    <span
      v-if="!externalAnchor"
      ref="anchor"
      data-qa="dt-tooltip-anchor"
      @focusin="onEnterAnchor"
      @focusout="onLeaveAnchor"
      @mouseenter="onEnterAnchor"
      @mouseleave="onLeaveAnchor"
      @keydown.esc="onLeaveAnchor"
    >
      <!-- @slot Slot for the anchor element -->
      <slot
        name="anchor"
      />
    </span>
    <div
      :id="id"
      ref="content"
      data-qa="dt-tooltip"
      :class="[
        'd-tooltip',
        {
          [ TOOLTIP_KIND_MODIFIERS.inverted ]: inverted,
        },
        contentClass,
      ]"
    >
      <!-- In case when transitionend event doesn't work correct (for ex. tooltip component with custom trigger) -->
      <!-- after-leave event can be used instead of transitionend -->
      <!-- @slot Slot for the content, defaults to message prop -->
      <slot>
        {{ message }}
      </slot>
    </div>
  </div>
</template>

<script>
import {
  TOOLTIP_KIND_MODIFIERS,
  TOOLTIP_DIRECTIONS,
  TOOLTIP_STICKY_VALUES,
  TOOLTIP_DELAY_MS,
} from './tooltip_constants.js';
import {
  POPOVER_APPEND_TO_VALUES,
} from '../popover/popover_constants';
import { flushPromises, getUniqueString, hasSlotContent, warnIfUnmounted } from '@/common/utils';
import {
  createTippy,
  getAnchor,
  getPopperOptions,
} from '@/components/popover/tippy_utils';

/**
 * A tooltip is a floating label that briefly explains an action, function, or an element.
 * Its content is exclusively text and shouldn't be vital information for users.
 * If richer media is desired, consider using a popover instead.
 * @see https://dialtone.dialpad.com/components/tooltip.html
 */
export default {
  name: 'DtTooltip',

  props: {
    /**
     * The id of the tooltip
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     * If the popover does not fit in the direction described by "placement",
     * it will attempt to change its direction to the "fallbackPlacements"
     * if defined, otherwise it will automatically position to a new location
     * as it sees best fit. See
     * <a
     *   class="d-link"
     *   href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements"
     *   target="_blank"
     * >
     *   Popper.js docs
     * </a>
     * */
    fallbackPlacements: {
      type: Array,
      default: () => ['auto'],
    },

    /**
     * If true, applies inverted styles to the tooltip
     * @values true, false
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     *  Displaces the tooltip from its reference element
     *  by the specified number of pixels. See
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
      default: () => [0, 12],
    },

    /**
     * The direction the popover displays relative to the anchor. See
     * <a
     *   class="d-link"
     *   href="https://atomiks.github.io/tippyjs/v6/all-props/#placement"
     *   target="_blank"
     * >
     *   Tippy.js docs
     * </a>
     * @values top, top-start, top-end,
     * right, right-start, right-end,
     * left, left-start, left-end,
     * bottom, bottom-start, bottom-end,
     * auto, auto-start, auto-end
     */
    placement: {
      type: String,
      default: 'top',
      validator (placement) {
        return TOOLTIP_DIRECTIONS.includes(placement);
      },
    },

    /**
     * If the tooltip sticks to the anchor. This is usually not needed, but can be needed
     * if the reference element's position is animating, or to automatically update the popover
     * position in those cases the DOM layout changes the reference element's position.
     * `true` enables it, `reference` only checks the "reference" rect for changes and `popper` only
     * checks the "popper" rect for changes. See
     * <a
     *   class="d-link"
     *   href="https://atomiks.github.io/tippyjs/v6/all-props/#sticky"
     *   target="_blank"
     * >
     *   Tippy.js docs
     * </a>
     * @values true, false, reference, popper
     */
    sticky: {
      type: [Boolean, String],
      default: true,
      validator: (sticky) => {
        return TOOLTIP_STICKY_VALUES.includes(sticky);
      },
    },

    /**
     * Sets the element to which the tooltip is going to append to.
     * 'body' will append to the nearest body (supports shadow DOM).
     * This prop is not reactive, must be set on initial render.
     * @values 'body', 'parent', HTMLElement,
     */
    appendTo: {
      type: [HTMLElement, String],
      default: 'body',
      validator: appendTo => {
        return POPOVER_APPEND_TO_VALUES.includes(appendTo) ||
            (appendTo instanceof HTMLElement);
      },
    },

    /**
     * Additional css classes for the tooltip content element.
     * Can accept all of String, Object, and Array, i.e. has the
     * same api as Vue's built-in handling of the class attribute.
     */
    contentClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * A provided message for the tooltip content
     */
    message: {
      type: String,
      default: '',
    },

    /**
     * Controls whether hover/focus causes the tooltip to appear.
     * Cannot be combined with the show prop. show value will be ignored.
     * by default this is true, if you override with false, the tooltip will never show up.
     */
    enabled: {
      type: Boolean,
      default: true,
    },

    /**
     * Controls whether the tooltip is shown. Leaving this null will have the tooltip trigger on mouseover by default.
     * If you set this value, the default mouseover behavior will be disabled and you can control it as you need.
     * Supports .sync modifier
     * @values null, true, false
     */
    show: {
      type: Boolean,
      default: null,
    },

    /**
     * Whether the tooltip should have a transition effect (fade).
     */
    transition: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether the tooltip will have a delay when being focused or moused over.
     * @values true, false
     */
    delay: {
      type: Boolean,
      default: true,
    },

    /**
     * Set a custom theme on the tooltip. See https://atomiks.github.io/tippyjs/v6/themes/
     */
    theme: {
      type: String,
      default: null,
    },

    /**
     * External anchor id to use in those cases the anchor can't be provided via the slot.
     * For instance, using the combobox's input as the anchor for the popover.
     */
    externalAnchor: {
      type: String,
      default: null,
    },
  },

  emits: [
    /**
     * Emitted when tooltip is shown or hidden
     *
     * @event shown
     * @type {Boolean}
     */
    'shown',

    /**
     * Sync show value
     *
     * @event update:show
     */
    'update:show',
  ],

  data () {
    return {
      TOOLTIP_KIND_MODIFIERS,
      hasSlotContent,
      tip: null,

      inTimer: null,

      // Internal state for whether the tooltip is shown. Changing the prop
      // will update this.
      internalShow: false,

      // this is where the placement currently is, this can be different than
      // the placement prop when there is not enough available room for the tip
      // to display and it uses a fallback placement.
      currentPlacement: this.placement,
    };
  },

  computed: {
    // eslint-disable-next-line complexity
    tippyProps () {
      return {
        offset: this.offset,
        delay: this.delay ? TOOLTIP_DELAY_MS : false,
        placement: this.placement,
        sticky: this.sticky,
        theme: this.inverted ? 'inverted' : this.theme,
        animation: this.transition ? 'fade' : false,
        // onShown only triggers when transition is truthy
        onShown: (tooltipInstance) => this.onShow(tooltipInstance, 'onShown'),
        // onShown will always be called, but it will be called before the animation is complete
        onShow: (tooltipInstance) => this.onShow(tooltipInstance, 'onShow'),
        onHidden: this.onHide,

        popperOptions: getPopperOptions({
          fallbackPlacements: this.fallbackPlacements,
          hasHideModifierEnabled: true,
          onChangePlacement: this.onChangePlacement,
        }),
      };
    },

    anchor () {
      return this.externalAnchor ? document.body.querySelector(this.externalAnchor) : getAnchor(this.$refs.anchor);
    },
  },

  watch: {

    tippyProps: {
      handler: 'setProps',
      deep: true,
    },

    show: {
      handler: function (show) {
        if (show !== null && this.enabled) {
          this.internalShow = show;
        }
      },

      immediate: true,
    },

    internalShow (value) {
      if (value) {
        this.setProps();
        this.tip.show();
      } else {
        this.tip.hide();
      }
    },

    sticky (sticky) {
      this.tip.setProps({
        sticky,
      });
    },
  },

  async mounted () {
    if (!this.enabled && this.show != null) {
      console.warn('Tooltip: You cannot use both the enabled and show props at the same time.');
      console.warn('The show prop will be ignored.');
    }

    this.tip = createTippy(this.anchor, this.initOptions());
    if (this.externalAnchor) {
      await flushPromises();
      this.addExternalAnchorEventListeners();
    }
    warnIfUnmounted(this.$el, this.$options.name);
  },

  beforeUnmount () {
    this.externalAnchor && this.removeExternalAnchorEventListeners();

    if (this.anchor?._tippy) {
      this.tip?.destroy();
    }
  },

  methods: {
    calculateAnchorZindex () {
      // if a modal is currently active render at modal-element z-index, otherwise at tooltip z-index
      if (this.$el.getRootNode()
        .querySelector('.d-modal[aria-hidden="false"], .d-modal--transparent[aria-hidden="false"]') ||
        // Special case because we don't have any dialtone drawer component yet. Render at 651 when
        // anchor of popover is within a drawer.
        this.$el.closest('.d-zi-drawer')) {
        return 651;
      } else {
        return 400;
      }
    },

    hasVisibleFocus () {
      return this.anchor.matches(':focus-visible');
    },

    onEnterAnchor (e) {
      if (!this.enabled) return;
      if (this.delay && this.inTimer === null) {
        this.inTimer = setTimeout(() => {
          this.triggerShow(e);
        }, TOOLTIP_DELAY_MS);
      } else {
        this.triggerShow(e);
      }
    },

    triggerShow (e) {
      if (e.type === 'focusin') {
        // only show tooltips on visible focus when triggered via focus.
        // when the user is using the mouse they only want tooltips to display
        // on mouseover.
        //
        // Example: anchor of a popover is a button with tooltip.
        // closing it with the mouse would trigger the tooltip to display as
        // the anchor is focused on close. Not what we want.
        if (this.show === null && this.hasVisibleFocus()) {
          this.internalShow = true;
        }
      } else {
        if (this.show === null) this.internalShow = true;
      }
    },

    onLeaveAnchor (e) {
      if (e.type === 'keydown' && e.code !== 'Escape') return;

      clearTimeout(this.inTimer);
      this.inTimer = null;
      this.triggerHide();
    },

    triggerHide () {
      if (this.show === null) this.internalShow = false;
    },

    onChangePlacement (placement) {
      this.currentPlacement = placement;
    },

    onHide () {
      this.tip?.unmount();
      this.$emit('shown', false);
      if (this.show !== null) {
        this.$emit('update:show', false);
      }
    },

    onShow (tooltipInstance, callingMethod) {
      if (!this.tooltipHasContent(tooltipInstance)) {
        return false;
      }
      if (this.transition && callingMethod === 'onShow') {
        return;
      }
      this.$emit('shown', true);
      if (this.show !== null) {
        this.$emit('update:show', true);
      }
    },

    setProps () {
      if (this.tip && this.tip.setProps) {
        this.tip.setProps({
          ...this.tippyProps,
          // these need to be set here rather than in tippyProps because they are non-reactive
          appendTo: this.appendTo === 'body' ? this.anchor?.getRootNode()?.querySelector('body') : this.appendTo,
          zIndex: this.calculateAnchorZindex(),
        });
      }
    },

    onMount () {
      this.setProps();
    },

    tooltipHasContent (tooltipInstance) {
      // don't show tooltip when no content
      if (tooltipInstance.props.content.textContent.trim().length === 0) {
        return false;
      }
      return true;
    },

    // set initial options here. If any of the options need to dynamically change, they should be put in
    // tippyProps instead.
    initOptions () {
      const template = this.$refs.content;
      return {
        content: template,
        arrow: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="7"><path d="M 14.5,7 8,0 1.5,7 Z"/></svg>',
        // transition duration - same as our custom fade delay in dialtone-globals.less
        duration: 180,
        interactive: false,
        trigger: 'manual',
        hideOnClick: false,
        // disable tooltip from displaying on touch devices
        touch: false,
        onMount: this.onMount,
        showOnCreate: this.internalShow,
        popperOptions: getPopperOptions({
          hasHideModifierEnabled: true,
        }),
      };
    },

    addExternalAnchorEventListeners () {
      ['focusin', 'mouseenter'].forEach(listener => {
        this.anchor?.addEventListener(listener, (event) => this.onEnterAnchor(event));
      });
      ['focusout', 'mouseleave', 'keydown'].forEach(listener => {
        this.anchor?.addEventListener(listener, (event) => this.onLeaveAnchor(event));
      });
    },

    removeExternalAnchorEventListeners () {
      ['focusin', 'mouseenter'].forEach(listener => {
        this.anchor?.removeEventListener(listener, (event) => this.onEnterAnchor(event));
      });
      ['focusout', 'mouseleave', 'keydown'].forEach(listener => {
        this.anchor?.removeEventListener(listener, (event) => this.onLeaveAnchor(event));
      });
    },
  },
};
</script>

<style lang="less">
@import 'tippy.js/dist/svg-arrow.css';

.tippy-box[data-reference-hidden] {
  visibility: hidden;
  pointer-events: none;
}

.tippy-box > .tippy-svg-arrow {
  fill: var(--dt-color-surface-contrast);
}

.tippy-box[data-theme~='inverted'] > .tippy-svg-arrow {
  fill: var(--dt-color-surface-moderate);
}

.tippy-box[data-animation='fade'][data-state='hidden'] {
  opacity: 0;
}
</style>
