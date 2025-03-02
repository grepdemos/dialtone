<template>
  <fieldset
    class="d-input-group__fieldset"
    :data-qa="dataQaGroup"
  >
    <legend
      v-if="$slots.legend || legend"
      :class="['d-label', legendClass]"
      v-bind="legendChildProps"
      :data-qa="dataQaGroupLegend"
    >
      <!-- @slot slot for Input Group Legend -->
      <slot name="legend">
        {{ legend }}
      </slot>
    </legend>
    <!-- @slot slot for Input Group Components -->
    <slot />
    <dt-validation-messages
      :validation-messages="formattedMessages"
      :show-messages="showMessages"
      :class="messagesClass"
      :data-qa="dataQaGroupMessages"
      v-bind="messagesChildProps"
    />
  </fieldset>
</template>

<script>
import { InputGroupMixin } from '@/common/mixins/input_group';
import { DtValidationMessages } from '../validation_messages';

/**
 * Input Groups are convenience components for a grouping of related inputs.
 * While each input within the group could be independent, the `v-model` on the group
 * provides a convenient interface for determining the current state of the group.
 * @see https://dialtone.dialpad.com/components/input_group.html
 */
export default {
  name: 'DtInputGroup',

  components: { DtValidationMessages },

  mixins: [InputGroupMixin],

  props: {
    /**
     * A data qa tag for the input group
     */
    dataQaGroup: {
      type: String,
      default: 'input-group',
    },

    /**
     * A data qa tag for the input group legend
     */
    dataQaGroupLegend: {
      type: String,
      default: 'input-group-legend',
    },

    /**
     * A data qa tag for the input group messages
     */
    dataQaGroupMessages: {
      type: String,
      default: 'input-group-messages',
    },
  },

  emits: [
    /**
     * Native input event
     *
     * @event input
     */
    'input',
  ],

  data () {
    return {
      internalValue: this.value,
      // wrap values in object to make reactive
      provideObj: {
        value: this.value,
      },
    };
  },

  watch: {
    value (newValue) {
      this.internalValue = newValue;
    },

    /*
     * watching value to support 2 way binding for slotted inputs.
     * need this to pass value to slotted inputs if modified outside
     * input group.
     */
    internalValue (newInternalValue) {
      this.provideObj.value = newInternalValue;
    },
  },

  methods: {
    getMessageKey (type, index) {
      return `input-group-message-${type}-${index}-${this.id}`;
    },
  },
};
</script>
