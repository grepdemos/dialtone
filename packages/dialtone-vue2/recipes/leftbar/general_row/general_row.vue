<template>
  <div
    :class="leftbarGeneralRowClasses"
    data-qa="dt-leftbar-row"
  >
    <a
      class="dt-leftbar-row__primary"
      :data-qa="'data-qa' in $attrs ? $attrs['data-qa'] : 'dt-leftbar-row-link'"
      :aria-label="getAriaLabel"
      :title="description"
      :href="'href' in $attrs ? $attrs.href : 'javascript:void(0)'"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div
        class="dt-leftbar-row__alpha"
      >
        <div
          v-if="isTyping"
          class="dt-leftbar-row__is-typing"
        >
          <span /><span /><span />
        </div>
        <slot
          v-else
          name="left"
        >
          <dt-recipe-leftbar-general-row-icon
            :type="getIcon"
            :color="color"
            :icon-size="iconSize"
            data-qa="dt-leftbar-row-icon"
          />
        </slot>
      </div>
      <div
        class="dt-leftbar-row__label"
        :style="`flex-basis: ${labelWidth}`"
      >
        <slot name="label">
          <dt-emoji-text-wrapper
            class="dt-leftbar-row__description"
            data-qa="dt-leftbar-row-description"
            size="200"
          >
            {{ description }}
          </dt-emoji-text-wrapper>
        </slot>
      </div>
    </a>
    <div
      v-if="hasActions"
      class="dt-leftbar-row__omega"
    >
      <dt-tooltip
        v-if="dndText"
        placement="top"
        :message="dndTextTooltip"
      >
        <template #anchor>
          <div
            ref="dt-leftbar-row-dnd"
            class="dt-leftbar-row__dnd"
            data-qa="dt-leftbar-row-dnd"
          >
            {{ dndText }}
          </div>
        </template>
      </dt-tooltip>
      <div
        v-if="activeVoiceChat"
        class="dt-leftbar-row__active-voice"
      >
        <dt-icon-waveform
          size="300"
        />
      </div>
      <dt-tooltip
        v-else-if="showUnreadCount || showUnreadMentionCount"
        :message="unreadCountTooltip"
        placement="top"
      >
        <template #anchor>
          <dt-badge
            v-if="showUnreadCount"
            kind="count"
            type="bulletin"
            data-qa="dt-leftbar-row-unread-badge"
            :class="['dt-leftbar-row__unread-badge', {
              'dt-leftbar-row__unread-count-badge':
                shouldApplyCustomStyleForCountBadge,
            }]"
          >
            {{ unreadCount }}
          </dt-badge>
          <dt-badge
            v-if="showUnreadMentionCount"
            kind="count"
            type="bulletin"
            data-qa="dt-leftbar-row-unread-mention-badge"
            :class="['dt-leftbar-row__unread-badge',
                     { 'dt-leftbar-row__unread-mention-count-badge': shouldApplyCustomStyleForCountBadge },
                     { 'dt-leftbar-row__unread-mention-only-count-badge': shouldApplyCustomStyleForMentionOnly },
            ]"
          >
            {{ unreadMentionCount }}
          </dt-badge>
        </template>
      </dt-tooltip>
      <div
        v-if="hasCallButton"
        class="dt-leftbar-row__action"
        data-qa="dt-leftbar-row-action"
      >
        <dt-tooltip
          :message="callButtonTooltip"
          placement="top"
        >
          <template #anchor>
            <dt-button
              class="dt-leftbar-row__action-button"
              data-qa="dt-leftbar-row-action-call-button"
              :circle="true"
              size="xs"
              kind="inverted"
              :aria-label="callButtonTooltip"
              @focus="actionFocused = true"
              @blur="actionFocused = false"
              @click.stop="$emit('call', $event)"
            >
              <template #icon>
                <dt-icon-phone
                  size="200"
                />
              </template>
            </dt-button>
          </template>
        </dt-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable max-lines */
import {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR,
  LEFTBAR_GENERAL_ROW_ICON_SIZES,
} from './general_row_constants';
import { DtBadge } from '@/components/badge';
import { DtIconPhone, DtIconWaveform } from '@dialpad/dialtone-icons/vue2';
import { DtButton } from '@/components/button';
import { DtTooltip } from '@/components/tooltip';
import DtEmojiTextWrapper from '@/components/emoji_text_wrapper/emoji_text_wrapper.vue';
import DtRecipeLeftbarGeneralRowIcon from './leftbar_general_row_icon.vue';
import { safeConcatStrings } from '@/common/utils';

export default {
  name: 'DtRecipeGeneralRow',

  components: {
    DtEmojiTextWrapper,
    DtBadge,
    DtButton,
    DtTooltip,
    DtIconPhone,
    DtIconWaveform,
    DtRecipeLeftbarGeneralRowIcon,
  },

  inheritAttrs: false,

  props: {
    /**
     * Determines the icon to show.
     * If type is contact center, the color prop must be provided and will determine the color of the icon
     */
    type: {
      type: String,
      default: 'inbox',
      validator: (type) => {
        return Object.values(LEFTBAR_GENERAL_ROW_TYPES).includes(type);
      },
    },

    /**
     * Will be read out by a screen reader upon focus of this row. If not defined "description" will be read.
     */
    ariaLabel: {
      type: String,
      default: '',
    },

    /**
     * Text displayed next to the icon. Required. Even if you are overriding this field using the label slot
     * you still must input this as it will be displayed as the "title" attribute for the row.
     */
    description: {
      type: String,
      required: true,
    },

    /**
     * Determines the color of the contact center icon
     */
    color: {
      type: String,
      default: null,
      validator: (color) => {
        return Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS).includes(color);
      },
    },

    /**
     * The channel setting, either 'mention' or 'always'.
     * @values 'mention', 'always', null.
     */
    channelSetting: {
      type: String,
      default: null,
    },

    /**
     * Styles the row with an increased font weight to convey it has unreads. This must be true to see
     * the unread count badge.
     */
    hasUnreads: {
      type: Boolean,
      default: false,
    },

    /**
     * Number of unread messages
     */
    unreadCount: {
      type: String,
      default: null,
    },

    /**
     * Number of unread mention messages
     */
    unreadMentionCount: {
      type: String,
      default: null,
    },

    /**
     * Text shown when the unread count is hovered.
     */
    unreadCountTooltip: {
      type: String,
      default: '',
    },

    /**
     * Determines if the row is selected
     */
    selected: {
      type: Boolean,
      default: false,
    },

    /**
     * Gives a faded style to be used when muted
     */
    muted: {
      type: Boolean,
      default: false,
    },

    /**
     * Shows styling to represent an active voice chat. This will display over unreadCount.
     */
    activeVoiceChat: {
      type: Boolean,
      default: false,
    },

    /**
     * Acronym used to represent "Do not Disturb" state. If entered will display the entered text alongside
     * unreadCount.
     */
    dndText: {
      type: String,
      default: '',
    },

    /**
     * Text shown in tooltip when you hover the dndText
     */
    dndTextTooltip: {
      type: String,
      default: '',
    },

    /**
     * Whether the row should have a call button. Usually only applicable to individual contact rows.
     */
    hasCallButton: {
      type: Boolean,
      default: false,
    },

    /**
     * Text shown when the call button is hovered.
     */
    callButtonTooltip: {
      type: String,
      default: '',
    },

    /**
     * Shows an "is typing" animation over the avatar when true.
     */
    isTyping: {
      type: Boolean,
      default: false,
    },

    /**
     * Sets the size of the icon.
     */
    iconSize: {
      type: String,
      default: '300',
      validator: (size) => {
        return LEFTBAR_GENERAL_ROW_ICON_SIZES.includes(size);
      },
    },
  },

  emits: [
    /**
     * Native click event on the row itself
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Call button clicked
     *
     * @event call
     * @type {PointerEvent | KeyboardEvent}
     */
    'call',
  ],

  data () {
    return {
      actionFocused: false,
      labelWidth: '100%',
    };
  },

  computed: {
    leftbarGeneralRowClasses () {
      return [
        'dt-leftbar-row',
        {
          'dt-leftbar-row--no-action': !this.hasCallButton,
          'dt-leftbar-row--has-unread': this.hasUnreads,
          'dt-leftbar-row--unread-count': this.showUnreadCount || this.showUnreadMentionCount,
          'dt-leftbar-row--selected': this.selected,
          'dt-leftbar-row--muted': this.muted,
          'dt-leftbar-row--action-focused': this.actionFocused,
        },
      ];
    },

    getIcon () {
      switch (this.type) {
        case LEFTBAR_GENERAL_ROW_TYPES.CHANNELS:
          if (this.hasUnreads) return 'channel unread';
          break;
        case LEFTBAR_GENERAL_ROW_TYPES.LOCKED_CHANNEL:
          if (this.hasUnreads) return 'locked channel unread';
          break;
      }
      return this.type;
    },

    getAriaLabel () {
      return this.ariaLabel
        ? this.ariaLabel
        : safeConcatStrings([this.description, this.unreadCountTooltip, this.dndTextTooltip]);
    },

    hasActions () {
      return this.dndText || this.activeVoiceChat || this.showUnreadCount || this.hasCallButton ||
        this.showUnreadMentionCount;
    },

    showUnreadCount () {
      return !!this.unreadCount && this.hasUnreads;
    },

    showUnreadMentionCount () {
      return !!this.unreadMentionCount && this.hasUnreads;
    },

    hasUnreadCount () {
      return this.unreadCount !== null;
    },

    hasUnreadMentionCount () {
      return this.unreadMentionCount !== null;
    },

    shouldApplyCustomStyleForCountBadge () {
      return this.hasUnreadCount && this.hasUnreadMentionCount;
    },

    /**
     * When a channel in 'always' setting, meaning the user should see both unread count and unread mention count,
     * if there are only mention messages, we should apply the theme design tokens var(--dt-theme-mention-color-[background||foreground]-strong).
     * @returns {boolean}
     */
    shouldApplyCustomStyleForMentionOnly () {
      return this.channelSetting === 'always' && !this.hasUnreadCount && this.hasUnreadMentionCount;
    },
  },

  watch: {
    $props: {
      immediate: true,
      deep: true,
      async handler () {
        this.validateProps();
        await this.$nextTick();
        this.adjustLabelWidth();
      },
    },
  },

  mounted () {
    this.resizeObserver = new ResizeObserver(this.adjustLabelWidth);
    this.resizeObserver.observe(this.$el);
    this.adjustLabelWidth();
  },

  beforeDestroy: function () {
    this.resizeObserver.disconnect();
  },

  methods: {
    validateProps () {
      if (this.type === LEFTBAR_GENERAL_ROW_TYPES.CONTACT_CENTER &&
        !Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS).includes(this.color)) {
        console.error(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR);
      }
    },

    adjustLabelWidth () {
      const labelWidth = this.$el?.querySelector('.dt-leftbar-row__primary')?.clientWidth || 0;
      const omegaWidth = this.$el?.querySelector('.dt-leftbar-row__omega')?.clientWidth || 0;
      const alphaWidth = this.$el?.querySelector('.dt-leftbar-row__alpha')?.clientWidth || 0;
      const paddings = 16;
      this.labelWidth = labelWidth - (omegaWidth + alphaWidth + paddings) + 'px';
    },
  },
};
</script>

<style lang="less" scoped>
@import "../style/leftbar_row.less";
</style>
