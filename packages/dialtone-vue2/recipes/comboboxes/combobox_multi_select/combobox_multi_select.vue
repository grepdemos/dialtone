<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <dt-recipe-combobox-with-popover
    ref="comboboxWithPopover"
    :label="label"
    :show-list="showList"
    :max-height="listMaxHeight"
    :max-width="listMaxWidth"
    :popover-offset="popoverOffset"
    :has-suggestion-list="hasSuggestionList"
    :visually-hidden-close-label="visuallyHiddenCloseLabel"
    :visually-hidden-close="visuallyHiddenClose"
    content-width="anchor"
    :append-to="appendTo"
    :transition="transition"
    @select="onComboboxSelect"
    @highlight="comboboxHighlight"
  >
    <template #input="{ onInput }">
      <span
        ref="inputSlotWrapper"
        class="combobox__input-wrapper"
        @focusin="handleInputFocusIn"
        @focusout="handleInputFocusOut"
      >
        <span
          ref="chipsWrapper"
          :class="['combobox__chip-wrapper', chipWrapperClass]"
        >
          <dt-chip
            v-for="({ item, key }) in selectedItemsWithKeys"
            ref="chips"
            :key="key"
            :label-class="['d-chip__label']"
            :class="['combobox__chip', { 'combobox__chip--truncate': !!chipMaxWidth }]"
            :style="{ maxWidth: chipMaxWidth }"
            :close-button-props="{ ariaLabel: 'close' }"
            :size="CHIP_SIZES[size]"
            v-on="chipListeners"
            @keyup.backspace="onChipRemove(item)"
            @close="onChipRemove(item)"
          >
            {{ item }}
          </dt-chip>
        </span>

        <dt-input
          ref="input"
          v-model="value"
          class="combobox__input"
          :input-class="{ 'd-fc-transparent': hideInputText }"
          :aria-label="label"
          :label="labelVisible ? label : ''"
          :description="description"
          :placeholder="inputPlaceHolder"
          :show-messages="showInputMessages"
          :messages="inputMessages"
          :size="size"
          v-on="inputListeners"
          @input="onInput"
        />

        <dt-validation-messages
          :validation-messages="maxSelectedMessage"
          :show-messages="showValidationMessages"
        />
      </span>
    </template>

    <!-- @slot slot for popover header -->
    <template
      v-if="$slots.header"
      #header
    >
      <div ref="header">
        <slot name="header" />
      </div>
    </template>

    <!-- @slot slot for popover list -->
    <template #list>
      <div
        ref="list"
        @mousedown.prevent
      >
        <slot
          v-if="!loading"
          name="list"
        />
        <div
          v-else
          class="combobox__list--loading"
        >
          {{ loadingMessage }}
        </div>
      </div>
    </template>

    <!-- @slot slot for popover footer -->
    <template
      v-if="$slots.footer"
      #footer
    >
      <div ref="footer">
        <slot name="footer" />
      </div>
    </template>
  </dt-recipe-combobox-with-popover>
</template>

<script>
/* eslint-disable max-lines */
import DtRecipeComboboxWithPopover from '@/recipes/comboboxes/combobox_with_popover/combobox_with_popover.vue';
import DtInput from '@/components/input/input.vue';
import DtChip from '@/components/chip/chip.vue';
import DtValidationMessages from '@/components/validation_messages/validation_messages.vue';
import { validationMessageValidator } from '@/common/validators';
import {
  POPOVER_APPEND_TO_VALUES,
} from '@/components/popover/popover_constants';
import {
  MULTI_SELECT_SIZES,
  CHIP_SIZES,
  CHIP_TOP_POSITION,
} from './combobox_multi_select_constants';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'DtRecipeComboboxMultiSelect',

  components: {
    DtRecipeComboboxWithPopover,
    DtInput,
    DtChip,
    DtValidationMessages,
  },

  mixins: [SrOnlyCloseButtonMixin],

  props: {
    /**
     * String to use for the input label.
     */
    label: {
      type: String,
      required: true,
    },

    /**
     * Determines visibility of input label.
     * @values true, false
     */
    labelVisible: {
      type: Boolean,
      default: true,
    },

    /**
     * Description for the input
     */
    description: {
      type: String,
      default: '',
    },

    /**
     * Input placeholder
     */
    placeholder: {
      type: String,
      default: 'Select one or start typing',
    },

    /**
     * Input validation messages
     */
    inputMessages: {
      type: Array,
      default: () => [],
      validator: inputMessages => {
        return validationMessageValidator(inputMessages);
      },
    },

    /**
     * Show input validation message
     */
    showInputMessages: {
      type: Boolean,
      default: true,
    },

    // @TODO: https://dialpad.atlassian.net/browse/DP-52324
    // type: {
    //   type: String,
    //   values: ['input', 'select'],
    //   default: 'select',
    // },

    /**
     * Determines if the list is loading
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * The message when the list is loading
     */
    loadingMessage: {
      type: String,
      default: 'loading...',
    },

    /**
     * Determines when to show the list element and also controls the aria-expanded attribute.
     * Leaving this null will have the combobox trigger on input focus by default.
     * If you set this value, the default trigger behavior will be disabled and you can
     * control it as you need.
     */
    showList: {
      type: Boolean,
      default: null,
    },

    /**
     * Determines maximum height for the popover before overflow.
     * Possible units rem|px|em
     */
    listMaxHeight: {
      type: String,
      default: '300px',
    },

    /**
     * The selected items
     */
    selectedItems: {
      type: Array,
      default: function () { return []; },
    },

    /**
     * Would be the maximum number of selections you can make. 0 is unlimited
     */
    maxSelected: {
      type: Number,
      default: 0,
    },

    /**
     * Max select message when the max selections is exceeded with the structure:
     * `[{"message": string, "type": VALIDATION_MESSAGE_TYPES }]`
     */
    maxSelectedMessage: {
      type: Array,
      default: function () { return []; },
    },

    /**
     * Displays the list when the combobox is focused, before the user has typed anything.
     * When this is enabled the list will not close after selection.
     */
    hasSuggestionList: {
      type: Boolean,
      default: true,
    },

    /**
     * Size of the chip, one of `xs`, `sm`, `md`
     */
    size: {
      type: String,
      default: 'md',
      validator: (t) => Object.values(MULTI_SELECT_SIZES).includes(t),
    },

    /**
     * Sets the element to which the popover is going to append to.
     * 'body' will append to the nearest body (supports shadow DOM).
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
     * Named transition when the content display is toggled.
     * @see DtLazyShow
     */
    transition: {
      type: String,
      default: 'fade',
    },

    /**
     * Determines whether the combobox should collapse to a single when losing focus.
     * @type {boolean}
     */
    collapseOnFocusOut: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines maximum width for the popover before overflow.
     * Possible units rem|px|em
     */
    listMaxWidth: {
      type: String,
      default: '',
    },

    /**
    * Amount of reserved space (in px) on the right side of the input
    * before the chips and the input caret jump to the next line.
    * default is 64
    */
    reservedRightSpace: {
      type: Number,
      default: 64,
    },

    /**
     * Determines the maximum width of a single chip. If the text within this chip exceeds the value
     * it will be truncated with ellipses.
     * Possible units rem|px|em
     */
    chipMaxWidth: {
      type: String,
      default: '',
    },
  },

  emits: [
    /**
     * Native input event
     *
     * @event input
     * @type {String }
     */
    'input',

    /**
     * Event fired when item selected
     *
     * @event select
     * @type {Number}
     */
    'select',

    /**
     * Event fired when item removed
     *
     * @event remove
     * @type {String}
     */
    'remove',

    /**
     * Event fired when max selected items limit is reached
     *
     * @event max-selected
     * @type {Object}
     */
    'max-selected',

    /**
     * Native keyup event
     *
     * @event keyup
     * @type {KeyboardEvent}
      */
    'keyup',

    /**
     * Event fired when combobox item is highlighted
     *
     * @event combobox-highlight
     * @type {Object}
     */
    'combobox-highlight',
  ],

  data () {
    return {
      value: '',
      popoverOffset: [0, 4],
      showValidationMessages: false,
      resizeWindowObserver: null,
      initialInputHeight: null,
      CHIP_SIZES,
      inputFocused: false,
      hideInputText: false,
    };
  },

  computed: {
    inputPlaceHolder () {
      return this.selectedItems?.length > 0 ? '' : this.placeholder;
    },

    chipListeners () {
      return {
        ...this.$listeners,
        keyup: event => {
          this.onChipKeyup(event);
          this.$emit('keyup', event);
        },
      };
    },

    inputListeners () {
      return {
        ...this.$listeners,
        input: event => {
          this.$emit('input', event);
          if (this.hasSuggestionList) {
            this.showComboboxList();
          }
        },

        keyup: event => {
          this.onInputKeyup(event);
          this.$emit('keyup', event);
        },

        click: event => {
          if (this.hasSuggestionList) {
            this.showComboboxList();
          }
        },
      };
    },

    selectedItemsWithKeys () {
      return this.selectedItems.map(selectedItem => ({
        item: selectedItem,
        key: getUniqueString(selectedItem),
      }));
    },

    chipWrapperClass () {
      return {
        [`combobox__chip-wrapper-${this.size}--collapsed`]: !this.inputFocused && this.collapseOnFocusOut,
      };
    },
  },

  watch: {
    selectedItems: {
      async handler () {
        this.initSelectedItems();
      },
    },

    chipMaxWidth: {
      async handler () {
        this.initSelectedItems();
      },
    },

    async label () {
      await this.$nextTick();
      // Adjust the chips position if label changed
      this.setChipsTopPosition();
    },

    async description () {
      await this.$nextTick();
      // Adjust the chips position if description changed
      this.setChipsTopPosition();
    },

    size: {
      async handler () {
        await this.$nextTick();
        const input = this.getInput();
        this.revertInputPadding(input);
        this.initialInputHeight = input.getBoundingClientRect().height;
        this.setInputPadding();
        this.setChipsTopPosition();
      },
    },
  },

  mounted () {
    this.setInitialInputHeight();
    // Recalculate chip position and input padding when resizing window
    this.resizeWindowObserver = new ResizeObserver(async () => {
      this.setChipsTopPosition();
      this.setInputPadding();
    });
    this.resizeWindowObserver.observe(document.body);

    this.initSelectedItems();
  },

  beforeDestroy () {
    this.resizeWindowObserver?.unobserve(document.body);
  },

  methods: {
    comboboxHighlight (highlightIndex) {
      this.$emit('combobox-highlight', highlightIndex);
    },

    async initSelectedItems () {
      await this.$nextTick();
      this.setInputPadding();
      this.setChipsTopPosition();
      this.setInputMinWidth();
      this.checkMaxSelected();
    },

    onChipRemove (item) {
      this.$emit('remove', item);
      this.$refs.input?.focus();
    },

    onComboboxSelect (i) {
      this.value = '';
      this.$emit('select', i);
    },

    showComboboxList () {
      if (this.showList != null) { return; }
      this.$refs.comboboxWithPopover?.showComboboxList();
    },

    closeComboboxList () {
      if (this.showList != null) { return; }
      this.$refs.comboboxWithPopover?.closeComboboxList();
    },

    getChipButtons () {
      return this.$refs.chips && this.$refs.chips.map(chip => chip.$el.querySelector('button'));
    },

    getChips () {
      return this.$refs.chips && this.$refs.chips.map(chip => chip.$el);
    },

    getLastChipButton () {
      return this.$refs.chips && this.getChipButtons()[this.getChipButtons().length - 1];
    },

    getLastChip () {
      return this.$refs.chips && this.getChips()[this.getChips().length - 1];
    },

    getFirstChip () {
      return this.$refs.chips && this.getChips()[0];
    },

    getInput () {
      return this.$refs.input?.$refs.input;
    },

    onChipKeyup (event) {
      const key = event.code?.toLowerCase();
      if (key === 'arrowleft') {
        // Move to the previous chip
        this.navigateBetweenChips(event.target, true);
      } else if (key === 'arrowright') {
        if (event.target.id === this.getLastChipButton().id) {
          // Move to the input if it's the last chip
          this.moveFromChipToInput();
        } else {
          // Move to the next chip
          this.navigateBetweenChips(event.target, false);
        }
      }
    },

    onInputKeyup (event) {
      const key = event.code?.toLowerCase();
      // If the cursor is at the start of the text,
      // press 'backspace' or 'left' focuses the last chip
      if (this.selectedItems.length > 0 && event.target.selectionStart === 0) {
        if (key === 'backspace' || key === 'arrowleft') {
          this.moveFromInputToChip();
        }
      }
    },

    moveFromInputToChip () {
      this.getLastChipButton().focus();
      this.$refs.input?.blur();
      this.closeComboboxList();
    },

    moveFromChipToInput () {
      this.getLastChipButton().blur();
      this.$refs.input?.focus();
      this.showComboboxList();
    },

    navigateBetweenChips (target, toLeft) {
      const from = this.getChipButtons().indexOf(target);
      const to = toLeft ? from - 1 : from + 1;
      if (to < 0 || to >= this.$refs.chips?.length) {
        return;
      }
      this.getChipButtons()[from].blur();
      this.getChipButtons()[to].focus();
      this.closeComboboxList();
    },

    setChipsTopPosition () {
      // To place the chips in the input box
      // The chip "top" position should be the same line as the input box
      const input = this.getInput();
      if (!input) return;
      const inputSlotWrapper = this.$refs.inputSlotWrapper;
      const top = input.getBoundingClientRect().top -
                  inputSlotWrapper.getBoundingClientRect().top;
      const chipsWrapper = this.$refs.chipsWrapper;
      chipsWrapper.style.top = (top - CHIP_TOP_POSITION[this.size]) + 'px';
    },

    setInputPadding () {
      const lastChip = this.getLastChip();
      const input = this.getInput();
      const chipsWrapper = this.$refs.chipsWrapper;
      if (!input) return;
      this.revertInputPadding(input);
      this.popoverOffset = [0, 4];
      if (!lastChip) return;
      // Avoid adding extra padding when the input is not focused if collapseOnFocusOut is true
      // This ensures the input returns to its original state when resizing
      if (this.collapseOnFocusOut && !this.inputFocused) return;

      // Get the position of the last chip
      // The input cursor should be the same "top" as that chip and next besides it
      const left = lastChip.offsetLeft + this.getFullWidth(lastChip);
      const spaceLeft = input.getBoundingClientRect().width - left;
      // input.style.paddingLeft = left + 'px';

      if (spaceLeft > this.reservedRightSpace) {
        input.style.paddingLeft = left + 'px';
      } else {
        input.style.paddingLeft = '4px';
      }

      // Get the chip wrapper height minus the 4px padding
      const chipsWrapperHeight = chipsWrapper.getBoundingClientRect().height - 4;
      const lastChipHeight = lastChip.getBoundingClientRect().height - 4;

      // Get lastChip offsetTop plus 2px of the input padding.
      const top = spaceLeft > this.reservedRightSpace
        ? lastChip.offsetTop + 2
        : (chipsWrapperHeight + lastChipHeight - 9);

      input.style.paddingTop = `${top}px`;
    },

    revertInputPadding (input) {
      input.style.paddingLeft = '';
      input.style.paddingTop = '';
      input.style.paddingBottom = '';
    },

    getFullWidth (el) {
      const styles = window.getComputedStyle(el);
      return el.offsetWidth + parseInt(styles.marginLeft) + parseInt(styles.marginRight);
    },

    setInputMinWidth () {
      // Ensure the width of the input is "slightly bigger" than the width of a single chip
      const firstChip = this.getFirstChip();
      const input = this.getInput();
      if (!input) return;
      if (firstChip) {
        // Add 4px buffer for typing room
        input.style.minWidth = (this.getFullWidth(firstChip) + 4) + 'px';
      } else {
        input.style.minWidth = '';
      }
    },

    checkMaxSelected () {
      if (this.maxSelected === 0) return;
      if (this.selectedItems.length > this.maxSelected) {
        this.showValidationMessages = true;
        this.$emit('max-selected');
      } else {
        this.showValidationMessages = false;
      }
    },

    setInitialInputHeight () {
      const input = this.getInput();
      if (!input) return;
      this.initialInputHeight = input.getBoundingClientRect().height;
    },

    async handleInputFocusIn () {
      this.inputFocused = true;
      if (this.collapseOnFocusOut) {
        await this.$nextTick();
        this.setInputPadding();
        this.hideInputText = false;
      }
    },

    async handleInputFocusOut () {
      this.inputFocused = false;
      if (this.collapseOnFocusOut) {
        const input = this.getInput();
        if (!input) return;
        // Hide the input text when is not on first line
        if (!input.style.paddingTop) {
          return;
        }
        this.hideInputText = true;
        this.revertInputPadding(input);
      }
    },
  },
};
</script>

<style scoped lang="less">
.combobox__input-wrapper {
  position: relative;
  display: block;
}

.combobox__chip-wrapper {
  position: absolute;
  margin-left: var(--dt-space-200);
  margin-right: var(--dt-space-200);
  padding-left: var(--dt-space-100);
  max-width: calc(var(--dt-size-100-percent) - var(--dt-space-400));
  max-height: initial;
  overflow-y: visible;
}

.combobox__chip-wrapper-md--collapsed {
  max-height: 2.8rem;
  overflow-y: hidden;
}

.combobox__chip-wrapper-sm--collapsed,
.combobox__chip-wrapper-xs--collapsed {
  max-height: 2.5rem;
  overflow-y: hidden;
}

.combobox__chip {
  margin-top: var(--dt-space-300);
  margin-left: var(--dt-space-200);
  margin-right: var(--dt-space-200);
  z-index: var(--zi-base1);
  max-width: var(--dt-size-100-percent);
}

.combobox__input {
  flex-grow: 1;
}

.combobox__list--loading {
  text-align: center;
  padding-top: var(--dt-space-500);
  padding-bottom: var(--dt-space-500);
}

.combobox__chip--truncate {
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
