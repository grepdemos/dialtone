<template>
  <dt-stack
    direction="row"
    class="d-datepicker__month-year"
    gap="300"
  >
    <dt-stack
      as="nav"
      direction="row"
      gap="200"
      class="d-datepicker__nav"
    >
      <dt-tooltip
        :message="prevYearLabel"
        placement="top"
        :fallback-placements="['top-start', 'auto']"
      >
        <template #anchor>
          <dt-button
            id="prevYearButton"
            :ref="el => { if (el) setDayRef(el) }"
            size="xs"
            importance="clear"
            kind="muted"
            :circle="true"
            class="d-datepicker__nav-btn"
            type="button"
            :aria-label="`${changeToLabel} ${prevYearLabel} ${selectYear - 1}`"
            @click="changeYear(-1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon-chevrons-left
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
      <dt-tooltip
        :message="prevMonthLabel"
        placement="top"
        :fallback-placements="['top-end', 'auto']"
      >
        <template #anchor>
          <dt-button
            id="prevMonthButton"
            :ref="el => { if (el) setDayRef(el) }"
            size="xs"
            importance="clear"
            kind="muted"
            :circle="true"
            class="d-datepicker__nav-btn"
            type="button"
            :aria-label="
              `${changeToLabel} ${prevMonthLabel} ${formattedMonth(selectMonth - 1, INTL_MONTH_FORMAT, locale)}`
            "
            @click="changeMonth(-1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon-chevron-left
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
    </dt-stack>
    <div
      id="calendar-heading"
      class="d-datepicker__month-year-title"
    >
      {{ formattedMonth(selectMonth, INTL_MONTH_FORMAT, locale) }}

      {{ selectYear }}
    </div>
    <dt-stack
      as="nav"
      direction="row"
      gap="200"
      class="d-datepicker__nav"
    >
      <dt-tooltip
        :message="nextMonthLabel"
        placement="top"
        :fallback-placements="['top-start', 'auto']"
      >
        <template #anchor>
          <dt-button
            id="nextMonthButton"
            :ref="el => { if (el) setDayRef(el) }"
            size="xs"
            importance="clear"
            kind="muted"
            :circle="true"
            class="d-datepicker__nav-btn"
            type="button"
            :aria-label="
              `${changeToLabel} ${nextMonthLabel} ${formattedMonth(selectMonth + 1, INTL_MONTH_FORMAT, locale)}`
            "
            @click="changeMonth(1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon-chevron-right
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
      <dt-tooltip
        :message="nextYearLabel"
        placement="top"
        :fallback-placements="['top-end', 'auto']"
      >
        <template #anchor>
          <dt-button
            id="nextYearButton"
            :ref="el => { if (el) setDayRef(el) }"
            size="xs"
            importance="clear"
            kind="muted"
            :circle="true"
            class="d-datepicker__nav-btn"
            type="button"
            :aria-label="`${changeToLabel} ${nextYearLabel} ${selectYear + 1}`"
            @click="changeYear(1)"
            @keydown="handleKeyDown($event)"
          >
            <dt-icon-chevrons-right
              size="200"
            />
          </dt-button>
        </template>
      </dt-tooltip>
    </dt-stack>
  </dt-stack>
</template>

<script setup>
import { DtIconChevronLeft, DtIconChevronsLeft, DtIconChevronRight, DtIconChevronsRight } from '@dialpad/dialtone-icons/vue3';
import { DtStack } from '@/components/stack';
import { DtButton } from '@/components/button';
import { DtTooltip } from '@/components/tooltip';
import { INTL_MONTH_FORMAT } from '../datepicker_constants';
import { onMounted } from 'vue';
import { useMonthYearPicker } from '@/components/datepicker/composables/useMonthYearPicker.js';

const props = defineProps({
  locale: {
    type: String,
    required: true,
  },

  prevMonthLabel: {
    type: String,
    required: true,
  },

  nextMonthLabel: {
    type: String,
    required: true,
  },

  prevYearLabel: {
    type: String,
    required: true,
  },

  nextYearLabel: {
    type: String,
    required: true,
  },

  changeToLabel: {
    type: String,
    required: true,
  },

  selectedDate: {
    type: Date,
    required: true,
  },
});
const emits = defineEmits([
  /**
     * Will retrieve the calendar days of the given date
     *
     * @event calendar-days
     * @type {Array}
     */
  'calendar-days',

  /**
     * Will focus first day in calendar
     *
     * @event focus-first-day
     */
  'focus-first-day',

  /**
     * Will focus last day in calendar
     *
     * @event focus-last-day
     */
  'focus-last-day',

  /**
     * Will close the datepicker
     *
     * @event close-datepicker
     */
  'close-datepicker',
]);

const {
  selectMonth,
  selectYear,
  formattedMonth,
  setDayRef,
  focusMonthYearPicker,
  handleKeyDown,
  changeMonth,
  changeYear,
  goToNextMonth,
  goToPrevMonth,
} = useMonthYearPicker(props, emits);

onMounted(() => {
  focusMonthYearPicker();
});

defineExpose({
  focusMonthYearPicker,
  goToNextMonth,
  goToPrevMonth,
});
</script>
