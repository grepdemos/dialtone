<template>
  <dt-button
    id="sr-only-close-button"
    data-qa="dt-sr-only-close-button"
    class="d-vi-visible-sr"
    :aria-label="visuallyHiddenCloseLabel"
    @click="close"
    @keydown.space.prevent.stop="close"
  >
    <dt-icon-close />
  </dt-button>
</template>

<script>
import { DtIconClose } from '@dialpad/dialtone-icons/vue2';
import { DtButton } from '@/components/button';

export default {
  name: 'SrOnlyCloseButton',
  components: {
    DtIconClose,
    DtButton,
  },

  props: {
    /**
     * Label for the visually hidden close button
     * Required if visuallyHiddenClose is set to `true`
     */
    visuallyHiddenCloseLabel: {
      type: String,
      default: null,
    },
  },

  emits: ['close'],

  methods: {
    close () {
      this.$emit('close');
    },
  },
};
</script>
