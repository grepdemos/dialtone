<template>
  <node-view-wrapper class="dt-message-input-meeting-pill">
    <dt-item-layout
      class="dt-message-input-meeting-pill__layout"
      unstyled
    >
      <template #left>
        <div class="dt-message-input-meeting-pill__icon">
          <dt-icon-video
            size="400"
          />
        </div>
      </template>
      {{ node.attrs.text }}
      <template #right>
        <div class="dt-message-input-meeting-pill__close">
          <dt-button
            circle
            :aria-label="node.attrs['close-button-aria-label']"
            size="xs"
            importance="clear"
            @click="close"
          >
            <template #icon>
              <dt-icon-close
                size="300"
              />
            </template>
          </dt-button>
        </div>
      </template>
    </dt-item-layout>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { DtItemLayout } from '@/components/item_layout';
import { DtIconClose, DtIconVideo } from '@dialpad/dialtone-icons/vue3';
import { DtButton } from '@/components/button';

export default {
  name: 'MeetingPill',

  components: {
    NodeViewWrapper,
    DtItemLayout,
    DtIconClose,
    DtButton,
    DtIconVideo,
  },

  props: nodeViewProps,

  emits: ['meeting-pill-close'],

  methods: {
    close (e) {
      this.$parent.$emit('meeting-pill-close', e);
    },
  },
};
</script>

<style lang="less">
.dt-message-input-meeting-pill {
  display: inline-block;

  &__layout {
    gap: var(--dt-space-400);
    grid-template-areas: 'left content right';
    grid-template-columns: minmax(0, max-content) 1fr minmax(0, max-content);
    align-items: center;
    max-width: var(--dt-size-905);
    padding-left: var(--dt-space-400);
    padding-right: var(--dt-space-400);
    padding-top: var(--dt-space-200);
    padding-bottom: var(--dt-space-200);
    border: var(--dt-size-border-100) solid var(--dt-color-border-default);
    border-radius: var(--dt-size-radius-300);
    font: var(--dt-typography-headline-md);
  }

  &__icon {
    display: flex;
    align-items: center;
    padding: var(--dt-space-350);
  }

  &__close {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
