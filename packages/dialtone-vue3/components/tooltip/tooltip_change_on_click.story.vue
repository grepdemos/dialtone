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
        :fallback-placements="$attrs.fallbackPlacements"
        :offset="$attrs.offset"
        :sticky="$attrs.sticky"
        :content-class="$attrs.contentClass"
        :transition="$attrs.transition"
        :show.sync="$attrs.show"
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
            @click="handleClick"
          >
            {{ $attrs.anchor }}
          </dt-button>
        </template>
        {{ isButtonActive ? 'Remove from starred' : 'Add to starred' }}
      </dt-tooltip>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import DtTooltip from './tooltip.vue';
import { DtButton } from '../button';
const buttonActive = ref(false);
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

    isButtonActive () {
      return buttonActive.value;
    },
  },

  methods: {
    handleClick () {
      buttonActive.value = !buttonActive.value;
    },
  },
};
</script>
