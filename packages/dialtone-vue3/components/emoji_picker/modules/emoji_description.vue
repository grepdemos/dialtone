<template>
  <div class="d-emoji-picker__data">
    <img
      v-if="emoji"
      class="d-icon d-icon--size-500"
      :alt="emoji.name"
      :aria-label="emoji.name"
      :title="emoji.name"
      :src="`${CDN_URL + emoji.unicode_character}.png`"
    >
    <div>{{ emoji?.name }}</div>
  </div>
</template>

<script setup>
import { CDN_URL } from '@/components/emoji_picker/emoji_picker_constants';

defineProps({
  /**
   * Emoji data
   * @type {Object}
   * @default null
   */
  emoji: {
    type: Object,
    default: null,
  },
});
</script>
