<template>
  <div
    v-show="!hidePanel"
    :id="`dt-panel-${id}`"
    role="tabpanel"
    :tabindex="isFirstElementFocusable ? -1 : 0"
    :aria-labelledby="`dt-tab-${tabId}`"
    :aria-hidden="`${hidePanel}`"
    :class="tabPanelClass"
    data-qa="dt-tab-panel"
  >
    <!-- @slot Default slot for Tab Panel -->
    <slot v-show="!hidden" />
  </div>
</template>

<script>
import Modal from '@/common/mixins/modal';

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialtone.dialpad.com/components/tabs.html
 */
export default {
  name: 'DtTabPanel',

  mixins: [Modal],

  inject: ['groupContext'],

  props: {
    /**
     * Id of the panel
     */
    id: {
      type: String,
      required: true,
    },

    /**
     * Id of the associated tab
     */
    tabId: {
      type: String,
      required: true,
    },

    /**
    * If true, hides the tab content
     * @values true, false
    */
    hidden: {
      type: Boolean,
      default: false,
    },

    /**
     * Used to customize the tab element
     */
    tabPanelClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  data () {
    return {
      isFirstElementFocusable: false,
    };
  },

  computed: {
    hidePanel () {
      return this.groupContext.selected !== this.id || this.hidden;
    },
  },

  async mounted () {
    const firstFocusableElement = await this.getFirstFocusableElement(this.$el);

    if (!firstFocusableElement) {
      this.isFirstElementFocusable = false;
    } else {
      // If the first focusable element isn't the first element in the panel,
      // then we need to set the panel tabindex to 0.
      // See notes in https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
      this.isFirstElementFocusable = this.isFirstElementOfPanel(firstFocusableElement);
    }
  },

  methods: {
    isFirstElementOfPanel (element) {
      let current = element;
      let isFirstElement = true;

      while (current) {
        if (current.previousElementSibling !== null) {
          isFirstElement = false;
          break;
        }
        current = current.parentNode !== this.$el ? current.parentNode : null;
      }

      return isFirstElement;
    },
  },
};
</script>
