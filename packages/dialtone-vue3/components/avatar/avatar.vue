<template>
  <component
    :is="clickable ? 'button' : 'div'"
    :id="id"
    :class="avatarClasses"
    data-qa="dt-avatar"
    @click="handleClick"
  >
    <div
      ref="canvas"
      :class="[
        canvasClass,
        'd-avatar__canvas',
        { 'd-avatar--image-loaded': imageLoadedSuccessfully },
      ]"
    >
      <img
        v-if="showImage"
        ref="avatarImage"
        class="d-avatar__image"
        data-qa="dt-avatar-image"
        :src="imageSrc"
        :alt="imageAlt"
      >
      <div
        v-else-if="isIconType"
        :class="[iconClass, AVATAR_KIND_MODIFIERS.icon]"
        :aria-label="clickable ? iconAriaLabel : ''"
        :data-qa="iconDataQa"
        :role="clickable ? 'button' : ''"
      >
        <!-- @slot Slot for avatar icon. It will display if no imageSrc is provided -->
        <slot
          name="icon"
          :icon-size="iconSize || AVATAR_ICON_SIZES[size]"
        />
      </div>
      <span
        v-else
        :class="[AVATAR_KIND_MODIFIERS.initials]"
      >
        {{ formattedInitials }}
      </span>
    </div>
    <div
      v-if="hasOverlayIcon || overlayText"
      :class="overlayClasses"
    >
      <!-- @slot Slot for overlay icon. -->
      <slot
        v-if="hasOverlayIcon"
        name="overlayIcon"
      />
      <p
        v-else-if="overlayText"
        class="d-avatar__overlay-text"
      >
        {{ overlayText }}
      </p>
    </div>
    <span
      v-if="showGroup"
      class="d-avatar__count"
      data-qa="dt-avatar-count"
    >{{ formattedGroup }}</span>
    <dt-presence
      v-if="presence && !showGroup"
      :presence="presence"
      :class="[
        'd-avatar__presence',
        AVATAR_PRESENCE_SIZE_MODIFIERS[size],
      ]"
      v-bind="presenceProps"
      data-qa="dt-presence"
    />
  </component>
</template>

<script>
import { getUniqueString, getRandomElement, hasSlotContent } from '@/common/utils';
import { DtPresence } from '../presence';
import {
  AVATAR_KIND_MODIFIERS,
  AVATAR_SIZE_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_RANDOM_COLORS,
  AVATAR_GROUP_VALIDATOR,
  AVATAR_ICON_SIZES,
} from './avatar_constants';
import { ICON_SIZE_MODIFIERS } from '@/components/icon/icon_constants.js';
import { extractInitialsFromName } from './utils';

/**
 * An avatar is a visual representation of a user or object.
 * @see https://dialtone.dialpad.com/components/avatar.html
 */
export default {
  name: 'DtAvatar',
  components: { DtPresence },

  inheritAttrs: false,

  props: {
    /**
     * Id of the avatar content wrapper element
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     * Pass in a seed to get the random color generation based on that string. For example if you pass in a
     * user ID as the string it will return the same randomly generated colors every time for that user.
     */
    seed: {
      type: String,
      default: undefined,
    },

    /**
     * Set the avatar background to a specific color. If undefined will randomize the color which can be deterministic
     * if the seed prop is set.
     */
    color: {
      type: String,
      default: undefined,
    },

    /**
     * The size of the avatar
     * @values xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: 'md',
      validator: (size) => Object.keys(AVATAR_SIZE_MODIFIERS).includes(size),
    },

    /**
     * Used to customize the avatar container
     */
    avatarClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Set classes on the avatar canvas. Wrapper around the core avatar image.
     */
    canvasClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Pass through classes. Used to customize the avatar icon
     */
    iconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Determines whether to show the presence indicator for
     * Avatar - accepts PRESENCE_STATES values: 'busy', 'away', 'offline',
     * or 'active'. By default, it's null and nothing is shown.
     * @values null, busy, away, offline, active
     */
    presence: {
      type: String,
      default: AVATAR_PRESENCE_STATES.NONE,
      validator: (state) => {
        return Object.values(AVATAR_PRESENCE_STATES).includes(state);
      },
    },

    /**
     * A set of props to be passed into the presence component.
     */
    presenceProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Determines whether to show a group avatar.
     * Limit to 2 digits max, more than 99 will be rendered as “99+”.
     * if the number is 1 or less it would just show the regular avatar as if group had not been set.
     */
    group: {
      type: Number,
      default: undefined,
      validator: (group) => AVATAR_GROUP_VALIDATOR(group),
    },

    /**
     * The text that overlays the avatar
     */
    overlayText: {
      type: String,
      default: '',
    },

    /**
     * Used to customize the avatar overlay
     */
    overlayClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Source of the image
     */
    imageSrc: {
      type: String,
      default: '',
    },

    /**
     * Alt attribute of the image, required if imageSrc is provided.
     * Can be set to '' (empty string) if the image is described
     * in text nearby
     */
    imageAlt: {
      type: String,
      default: undefined,
    },

    /**
     * Icon size to be displayed on the avatar
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    iconSize: {
      type: String,
      default: '',
      validator: (size) => !size || Object.keys(ICON_SIZE_MODIFIERS).includes(size),
    },

    /**
     * Full name used to extract initials.
     */
    fullName: {
      type: String,
      default: '',
    },

    /**
     * Makes the avatar focusable and clickable,
     * emits a click event when clicked.
     */
    clickable: {
      type: Boolean,
      default: false,
    },

    /**
     * Descriptive label for the icon.
     * To avoid a11y issues, set this prop if clickable and iconName are set.
     */
    iconAriaLabel: {
      type: String,
      default: undefined,
    },
  },

  emits: [
    /**
     * Avatar click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  data () {
    return {
      AVATAR_SIZE_MODIFIERS,
      AVATAR_KIND_MODIFIERS,
      AVATAR_PRESENCE_SIZE_MODIFIERS,
      AVATAR_ICON_SIZES,
      imageLoadedSuccessfully: null,
      formattedInitials: '',
      initializing: false,
      hasSlotContent,
    };
  },

  computed: {
    isIconType () {
      return hasSlotContent(this.$slots.icon);
    },

    hasOverlayIcon () {
      return hasSlotContent(this.$slots.overlayIcon);
    },

    iconDataQa () {
      return 'dt-avatar-icon';
    },

    avatarClasses () {
      return [
        'd-avatar',
        AVATAR_SIZE_MODIFIERS[this.validatedSize],
        this.avatarClass,
        {
          'd-avatar--group': this.showGroup,
          [`d-avatar--color-${this.getColor()}`]: !this.isIconType,
          'd-avatar--clickable': this.clickable,
        },
      ];
    },

    overlayClasses () {
      return [
        'd-avatar__overlay',
        this.overlayClass,
        { 'd-avatar__overlay-icon': this.hasOverlayIcon },
      ];
    },

    showGroup () {
      return AVATAR_GROUP_VALIDATOR(this.group);
    },

    formattedGroup () {
      return this.group > 99 ? '99+' : this.group;
    },

    validatedSize () {
      // TODO: Group only supports xs size for now. Remove this when we support other sizes.
      return this.group ? 'xs' : this.size;
    },

    showImage () {
      return this.imageLoadedSuccessfully !== false && this.imageSrc;
    },
  },

  watch: {
    fullName: {
      immediate: true,
      handler () {
        this.formatInitials();
      },
    },

    size: {
      immediate: true,
      handler () {
        this.formatInitials();
      },
    },

    group: {
      immediate: true,
      handler () {
        this.formatInitials();
      },
    },

    imageSrc (newSrc) {
      this.imageLoadedSuccessfully = null;
      if (!newSrc) return;

      this.validateProps();
      this.setImageListeners();
    },
  },

  mounted () {
    this.validateProps();
    this.setImageListeners();
  },

  methods: {
    async setImageListeners () {
      await this.$nextTick();
      const el = this.$refs.avatarImage;
      if (!el) return;

      el.addEventListener('load', () => this._loadedImageEventHandler(el), { once: true });
      el.addEventListener('error', () => this._erroredImageEventHandler(el), { once: true });
    },

    formatInitials () {
      const initials = extractInitialsFromName(this.fullName);

      if (this.validatedSize === 'xs') {
        this.formattedInitials = '';
      } else if (this.validatedSize === 'sm') {
        this.formattedInitials = initials[0];
      } else {
        this.formattedInitials = initials;
      }
    },

    getColor () {
      return this.color ?? getRandomElement(AVATAR_RANDOM_COLORS, this.seed);
    },

    _loadedImageEventHandler (el) {
      this.imageLoadedSuccessfully = true;
      el.classList.remove('d-d-none');
    },

    _erroredImageEventHandler (el) {
      this.imageLoadedSuccessfully = false;
      el.classList.add('d-d-none');
    },

    validateProps () {
      if (this.imageSrc && this.imageAlt === undefined) {
        console.error('image-alt required if image-src is provided. Can be set to "" (empty string) if the image is described in text nearby');
      }
    },

    handleClick (e) {
      if (!this.clickable) return;
      this.$emit('click', e);
    },
  },
};
</script>

<style lang="less">
//TODO: Move these classes to dialtone and document.
.d-avatar--image-loaded {
  background-color: transparent;
  background-image: unset;
}

.d-avatar__count {
  z-index: var(--zi-base);
}

.d-avatar__presence {
  z-index: var(--zi-base);
}

.d-avatar__overlay {
  background-color: var(--dt-color-surface-contrast-opaque);
  opacity: var(--dt-opacity-900);
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dt-size-radius-circle);
  z-index: var(--zi-base);
}

.d-avatar__overlay-icon {
  color: var(--dt-color-foreground-primary-inverted);
  width: 100%;
}

.d-avatar__overlay-text {
  color: var(--dt-color-foreground-primary-inverted);
  font-weight: var(--dt-font-weight-bold);
  font-size: var(--dt-font-size-200);
  width: 100%;
  text-align: center;
}

.d-avatar--clickable {
  --avatar-color-border: transparent;

  cursor: pointer;
  padding: 0;
  background-color: transparent;

  border-radius: var(--dt-size-radius-circle);
  border: var(--dt-size-border-100) solid var(--avatar-color-border);

  &:focus-visible {
    outline: none;
    box-shadow: var(--dt-shadow-focus);
  }

  &:hover {
    --avatar-color-border: var(--dt-color-border-default);
  }

  &:active {
    --avatar-color-border: var(--dt-color-border-moderate);

    transform: scale(0.98);
  }
}
</style>
