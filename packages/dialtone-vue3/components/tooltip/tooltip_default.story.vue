<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <div
    :class="[
      'd-fl-center d-fd-column d-pt64',
      {
        'd-bgc-purple-600 d-pb64': $attrs.inverted,
      },
    ]"
  >
    <div class="d-pt16">
      <dt-tooltip
        :id="$attrs.id"
        :placement="$attrs.placement"
        :inverted="$attrs.inverted"
        :message="$attrs.message"
        :theme="$attrs.theme"
        :fallback-placements="$attrs.fallbackPlacements"
        :offset="$attrs.offset"
        :sticky="$attrs.sticky"
        :content-class="$attrs.contentClass"
        :transition="$attrs.transition"
        :show="showTooltip"
        :enabled="$attrs.enabled"
        :delay="$attrs.delay"
        :external-anchor="$attrs.externalAnchor"
        v-bind="$attrs"
        @shown="$attrs.onShown"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
            :kind="buttonKind"
          >
            {{ $attrs.anchor }}
          </dt-button>
        </template>
        <template v-if="defaultSlot">
          {{ defaultSlot }}
        </template>
      </dt-tooltip>
    </div>
  </div>
</template>

<script>
import DtTooltip from './tooltip.vue';
import { DtButton } from '../button';

export default {
  name: 'TooltipDefault',
  components: {
    DtTooltip,
    DtButton,
  },

  inheritAttrs: false,

  computed: {
    buttonKind () {
      return this.$attrs.inverted ? 'inverted' : 'default';
    },

    showTooltip () {
      return this.$attrs.globalShow ?? this.$attrs.show;
    },
  },
};
</script>

<style>
.tippy-box[data-theme~='purple'] > .tippy-svg-arrow {
  fill: var(--dt-color-purple-200);
}
.tippy-box[data-theme~='purple'] > .d-tooltip {
  background-color: var(--dt-color-purple-200);
}
</style>
