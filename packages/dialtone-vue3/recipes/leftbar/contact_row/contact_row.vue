<template>
  <dt-recipe-general-row
    :unread-count="unreadCount"
    :description="contactDescription"
    :has-unreads="hasUnreads"
    :selected="selected"
    :has-call-button="hasCallButton"
    :muted="muted"
    :is-typing="isTyping"
    :call-button-tooltip="callButtonTooltip"
    :unread-count-tooltip="unreadCountTooltip"
    v-bind="$attrs"
    data-qa="contact-row"
    v-on="contactRowListeners"
    @call="$emit('call', $event)"
  >
    <template #left>
      <dt-avatar
        :full-name="name"
        :image-src="avatarSrc"
        :color="avatarColor"
        image-alt=""
        size="sm"
        :seed="avatarSeed"
        :presence="avatarPresence"
      >
        <template
          v-if="noInitials"
          #icon
        >
          <dt-icon-user
            size="200"
          />
        </template>
      </dt-avatar>
    </template>
    <template #label>
      <dt-emoji-text-wrapper
        class="dt-leftbar-row__description"
        data-qa="dt-leftbar-row-description"
        size="200"
      >
        {{ name }}
      </dt-emoji-text-wrapper>
      <div class="dt-leftbar-row__status">
        <span
          v-if="presenceText"
          data-qa="dt-leftbar-row-presence-text"
          :class="['dt-leftbar-row__meta-context', presenceColorClass]"
        >
          {{ presenceText }}
        </span>
        <dt-emoji-text-wrapper
          v-if="userStatus"
          size="100"
          element-type="span"
          data-qa="dt-leftbar-row-user-status"
          class="dt-leftbar-row__meta-custom"
        >
          {{ userStatus }}
        </dt-emoji-text-wrapper>
      </div>
    </template>
  </dt-recipe-general-row>
</template>

<script>
import { DtRecipeGeneralRow } from '@/recipes/leftbar/general_row';
import DtEmojiTextWrapper from '@/components/emoji_text_wrapper/emoji_text_wrapper.vue';
import DtAvatar from '@/components/avatar/avatar.vue';
import { extractVueListeners, safeConcatStrings } from '@/common/utils';
import { DtIconUser } from '@dialpad/dialtone-icons/vue3';

export default {
  name: 'DtRecipeContactRow',

  components: {
    DtAvatar,
    DtRecipeGeneralRow,
    DtEmojiTextWrapper,
    DtIconUser,
  },

  inheritAttrs: false,

  props: {
    /**
     * Optional avatar image url.
     * If not provided it will use the initial of the name.
     */
    avatarSrc: {
      type: String,
      default: '',
    },

    /**
     * Determines whether to show the presence indicator for
     * Avatar - accepts PRESENCE_STATES values: 'busy', 'away', 'offline',
     * or 'active'. By default, it's null and nothing is shown.
     * defer validation to avatar component.
     * @values null, busy, away, offline, active
     */
    avatarPresence: {
      type: String,
      default: null,
    },

    /**
     * Avatar seed, set this to the user's ID to get the same avatar background gradient each time it is displayed.
     */
    avatarSeed: {
      type: String,
      default: null,
    },

    /**
     * Avatar color to display if `avatarSrc` is empty.
     */
    avatarColor: {
      type: String,
      default: null,
    },

    /**
     * Text describing the user's presence, such as "in a meeting"
     */
    presenceText: {
      type: String,
      default: '',
    },

    /**
     * Name of the contact
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * Status as set by the user.
     */
    userStatus: {
      type: String,
      default: '',
    },

    /**
     * Gives a faded style to be used when muted
     */
    muted: {
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
     * Styles the row with an increased font weight to convey it has unreads. This must be true to see
     * the unread count badge.
     */
    hasUnreads: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines if the row is selected
     */
    selected: {
      type: Boolean,
      default: false,
    },

    /**
     * Initials will never be shown. Instead it will show a "User" icon.
     */
    noInitials: {
      type: Boolean,
      default: false,
    },

    /**
     * Shows an "is typing" animation over the avatar when true.
     */
    isTyping: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the contact row should display a call button when hovered.
     */
    hasCallButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Text shown when the call button is hovered.
     */
    callButtonTooltip: {
      type: String,
      default: '',
    },

    /**
     * Text shown when the unread count is hovered.
     */
    unreadCountTooltip: {
      type: String,
      default: '',
    },
  },

  emits: [
    /**
     * Call button clicked
     *
     * @event call
     * @type {PointerEvent | KeyboardEvent}
     */
    'call',
  ],

  computed: {
    presenceColorClass () {
      switch (this.avatarPresence) {
        case 'active':
          return 'd-fc-success';
        case 'busy':
          return 'd-fc-critical';
        case 'away':
          return 'd-fc-warning';
        default:
          return undefined;
      }
    },

    contactRowListeners () {
      return extractVueListeners(this.$attrs);
    },

    contactDescription () {
      return safeConcatStrings([this.name, this.presenceText, this.userStatus]);
    },
  },
};
</script>
