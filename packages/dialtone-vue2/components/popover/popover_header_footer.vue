<template>
  <div
    data-qa="dt-popover-header-footer"
    :class="{
      'd-popover__header': type === 'header',
      'd-popover__footer': type === 'footer',
    }"
  >
    <div
      v-if="$slots.content"
      data-qa="dt-popover-header-footer-content"
      :class="[{
        'd-popover__header__content': type === 'header',
        'd-popover__footer__content': type === 'footer',
      }, contentClass]"
    >
      <!-- @slot Slot for main content -->
      <slot name="content" />
    </div>
    <dt-button
      v-if="showCloseButton"
      ref="popover__close-button"
      data-qa="dt-popover-close"
      :class="{
        'd-popover__header__close-button': type === 'header',
        'd-popover__footer__close-button': type === 'footer',
      }"
      importance="outlined"
      kind="muted"
      circle
      v-bind="closeButtonProps"
      @click="$emit('close')"
    >
      <template #icon>
        <dt-icon-close
          size="300"
        />
      </template>
    </dt-button>
  </div>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtIconClose } from '@dialpad/dialtone-icons/vue2';

export default {
  name: 'PopoverHeaderFooter',
  components: {
    DtButton,
    DtIconClose,
  },

  props: {
    // eslint-disable-next-line vue/require-default-prop
    type: {
      type: String,
      validator: function (value) {
        return ['header', 'footer'].includes(value);
      },
    },

    /**
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Determines visibility for close button
     * @values true, false
     */
    showCloseButton: {
      type: Boolean,
      default: false,
    },

    /**
     * A set of props to be passed into the popover's header close button.
     * Requires an 'ariaLabel' property.
     */
    closeButtonProps: {
      type: Object,
      default: () => {},
    },
  },

  emits: [
    /**
     * Emitted when popover is closed
     *
     * @event close
     * @type { Boolean }
     */
    'close',
  ],

  methods: {
    focusCloseButton () {
      const closeButton = this.$refs['popover__close-button']?.$el;
      closeButton?.focus();
    },
  },
};
</script>
