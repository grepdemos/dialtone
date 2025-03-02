<template>
  <component
    :is="elementType"
    ref="collapsible"
    v-on="$listeners"
  >
    <!-- Element for capturing keypress events -->
    <div
      :id="!ariaLabelledBy && labelledBy"
      ref="anchor"
      :class="anchorClass"
    >
      <!-- @slot Slot for the anchor element that toggles the collapsible content -->
      <slot
        name="anchor"
        :attrs="{
          'aria-controls': id,
          'aria-expanded': isOpen.toString(),
          'role': 'button',
        }"
      >
        <dt-button
          importance="clear"
          kind="muted"
          :aria-controls="id"
          :aria-expanded="`${isOpen}`"
          :style="{
            'width': maxWidth,
          }"
          @click="defaultToggleOpen"
        >
          <dt-icon-chevron-down
            v-if="isOpen"
            class="d-collapsible__icon"
            size="300"
          />
          <dt-icon-chevron-right
            v-else
            class="d-collapsible__icon"
            size="300"
          />
          <span
            class="d-collapsible__anchor-text"
            :title="anchorText"
          >
            {{ anchorText }}
          </span>
        </dt-button>
      </slot>
    </div>
    <dt-collapsible-lazy-show
      :id="id"
      ref="contentWrapper"
      :aria-hidden="`${!isOpen}`"
      :aria-labelledby="labelledBy"
      :aria-label="ariaLabel"
      :show="isOpen"
      :element-type="contentElementType"
      :class="contentClass"
      :style="{
        'max-height': maxHeight,
        'max-width': maxWidth,
      }"
      data-qa="dt-collapsible--content"
      tabindex="-1"
      appear
      v-on="$listeners"
      @after-leave="onLeaveTransitionComplete"
      @after-enter="onEnterTransitionComplete"
    >
      <!-- @slot Slot for the collapsible element that is expanded by the anchor -->
      <slot
        name="content"
      />
    </dt-collapsible-lazy-show>
  </component>
</template>

<script>
import { getUniqueString } from '@/common/utils';
import DtCollapsibleLazyShow from './collapsible_lazy_show.vue';
import { DtButton } from '@/components/button';
import { DtLazyShow } from '@/components/lazy_show';
import { DtIconChevronDown, DtIconChevronRight } from '@dialpad/dialtone-icons/vue2';

/**
 * A collapsible is a component consisting of an interactive anchor that toggled the expandable/collapsible element.
 * @see https://dialtone.dialpad.com/components/collapsible.html
 */
export default {
  name: 'DtCollapsible',

  components: {
    DtButton,
    DtCollapsibleLazyShow,
    DtLazyShow,
    DtIconChevronDown,
    DtIconChevronRight,
  },

  props: {
    /**
     * Text that is displayed on the anchor if nothing is passed in the slot.
     * Ignored if the anchor slot is used.
     */
    anchorText: {
      type: String,
      default: null,
    },

    /**
     * Controls whether the collapsible is shown. Leaving this null will have the collapsible start
     * expanded and trigger on click by default. If you set this value, the default trigger
     * behavior will be disabled, and you can control it as you need.
     * Supports .sync modifier
     * @values null, true, false
     */
    open: {
      type: Boolean,
      default: null,
    },

    /**
     * The id of the content wrapper.
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     * HTML element type (tag name) of the root element of the component.
     */
    elementType: {
      type: String,
      default: 'div',
    },

    /**
     * HTML element type (tag name) of the content wrapper element.
     */
    contentElementType: {
      type: String,
      default: 'div',
    },

    /**
     * Additional class name for the anchor wrapper element.
     */
    anchorClass: {
      type: [String, Array, Object],
      default: null,
    },

    /**
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: null,
    },

    /**
     * The maximum width of the anchor and collapsible element.
     * Possible units rem|px|%|em
     */
    maxWidth: {
      type: String,
      default: null,
    },

    /**
     * The maximum height of the collapsible element.
     * Possible units rem|px|%|em
     */
    maxHeight: {
      type: String,
      default: null,
    },

    /**
     * Label on the collapsible content. Should provide this or ariaLabelledBy but not both.
     */
    ariaLabel: {
      type: String,
      default: null,
    },

    /**
     * Id of the element that labels the collapsible content. Defaults to the anchor element.
     * Should provide this or ariaLabel but not both.
     */
    ariaLabelledBy: {
      type: String,
      default: null,
    },
  },

  emits: [
    /**
     * Event fired to sync the open prop with the parent component
     * @event update:open
     */
    'update:open',

    /**
     * Event fired when the content is shown or hidden
     *
     * @event opened
     * @type {Boolean}
     */
    'opened',
  ],

  data () {
    return {
      isOpen: true,
    };
  },

  computed: {
    labelledBy () {
      // aria-labelledby should be set only if aria-labelledby is passed as a prop, or if
      // there is no aria-label and the labelledby should point to the anchor
      return this.ariaLabelledBy || (!this.ariaLabel && getUniqueString('DtCollapsible__anchor'));
    },
  },

  watch: {
    open: {
      handler: function (open) {
        if (open !== null) {
          this.isOpen = open;
        }
      },

      immediate: true,
    },
  },

  mounted () {
    this.validateProperAnchor();
  },

  methods: {
    onLeaveTransitionComplete () {
      this.$emit('opened', false);
      if (this.open !== null) {
        this.$emit('update:open', false);
      }
    },

    onEnterTransitionComplete () {
      this.$emit('opened', true, this.$refs.content);
      if (this.open !== null) {
        this.$emit('update:open', true);
      }
    },

    defaultToggleOpen () {
      if (this.open === null) {
        this.toggleOpen();
      }
    },

    toggleOpen () {
      this.isOpen = !this.isOpen;
    },

    validateProperAnchor () {
      if (!this.anchorText && !this.$scopedSlots.anchor) {
        console.error('anchor text and anchor slot content cannot both be falsy');
      }
    },
  },
};
</script>
