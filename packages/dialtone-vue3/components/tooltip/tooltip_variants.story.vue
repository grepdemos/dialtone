<!-- eslint-disable vue/no-bare-strings-in-template -->
<template>
  <div
    id="forms-radio--variants-container"
    class="d-pt128 d-px64"
  >
    <div class="d-d-flex d-jc-center d-w100p d-mb64 d-mt32">
      <dt-button
        id="external-tooltip-anchor"
        importance="outlined"
      >
        External anchor
      </dt-button>
    </div>
    <!-- Arrow Description -->
    <div
      v-for="(rowDirection, i) in TOOLTIP_DIRECTIONS"
      :key="i"
      class="d-mb128 d-d-flex d-jc-center d-ai-center"
    >
      <div
        v-for="direction in rowDirection"
        :key="direction"
      >
        <dt-tooltip
          v-if="direction !== null"
          :transition="$attrs.transition"
          :placement="direction"
          :message="localMessage"
          :show="$attrs.showTooltip"
          class="d-mx64"
        >
          <template #anchor>
            <dt-button
              importance="outlined"
              class="d-w128"
            >
              {{ direction }}
            </dt-button>
          </template>
        </dt-tooltip>
      </div>
    </div>
    <div class="d-d-flex d-jc-center d-ai-center d-w100p">
      <div id="circle-button-tooltip-label">
        Circle button tooltip
      </div>
      <dt-tooltip
        class="d-ml4"
        :transition="transition"
        :message="localMessage"
        :show="$attrs.showTooltip"
      >
        <template #anchor>
          <dt-button
            aria-labelledby="circle-button-tooltip-label"
            circle
            importance="outlined"
          >
            <template #icon>
              <dt-icon
                name="dp-phone"
                size="300"
              />
            </template>
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-d-flex d-jc-center d-w100p">
      <!-- Text -->
      <dt-tooltip
        class="d-mb64 d-mt64"
        :transition="$attrs.transition"
        :message="localMessage"
        :show="$attrs.showTooltip"
      >
        <template #anchor>
          <dt-button link>
            Link Tooltip
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-d-flex d-jc-center d-w100p">
      <!-- Open state -->
      <dt-tooltip
        class="d-mb64 d-mt32"
        :transition="$attrs.transition"
        :message="localMessage"
        :show="show1"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
            @click="show1 = !show1"
          >
            Open on click
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-d-flex d-jc-center d-w100p">
      <!-- Custom Theme -->
      <dt-tooltip
        class="d-mb64 d-mt32"
        theme="purple"
        :transition="$attrs.transition"
        :message="localMessage"
        :show="$attrs.showTooltip"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
          >
            Custom Theme
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-bgc-purple-600 d-pt64 d-d-flex d-jc-center">
      <div class="d-py64">
        <!-- Inverted state -->
        <dt-tooltip
          :inverted="true"
          :transition="$attrs.transition"
          :message="localMessage"
          :show="$attrs.showTooltip"
        >
          <template #anchor>
            <dt-button
              kind="inverted"
              importance="outlined"
            >
              Inverted
            </dt-button>
          </template>
        </dt-tooltip>
      </div>
    </div>
    <dt-tooltip
      :transition="transition"
      external-anchor="#external-tooltip-anchor"
      :show="$attrs.showTooltip"
    >
      This is a tooltip with external anchor, the actual dt-tooltip component
      is at the end of this page
    </dt-tooltip>
  </div>
</template>

<script>
import DtTooltip from './tooltip.vue';
import { DtButton } from './../button';
import { DtIcon } from './../icon';
import { TOOLTIP_DIRECTIONS } from './tooltip_constants';

function sliceIntoChunks (arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export default {
  name: 'TooltipVariants',
  components: { DtTooltip, DtIcon, DtButton },
  data () {
    return {
      TOOLTIP_DIRECTIONS: sliceIntoChunks(this.$attrs.customDirections || TOOLTIP_DIRECTIONS, 3),

      localMessage: `This is a simple tooltip. The tooltip can be positioned in multiple areas too!`,
      show1: this.$attrs.showTooltip ?? false,
    };
  },
};
</script>

<style>
.tippy-box[data-theme~='purple'] > .tippy-svg-arrow {
  fill: var(--dt-color-purple-200);
}
.tippy-box[data-theme~='purple'] .d-tooltip {
  background-color: var(--dt-color-purple-200);
  color: var(--dt-color-foreground-primary);
}
</style>
