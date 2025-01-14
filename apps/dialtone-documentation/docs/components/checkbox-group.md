---
title: Checkbox group
description: Checkbox groups are convenient components for a grouping of related Checkboxes.
status: ready
thumb: true
image: assets/images/components/checkbox-group.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-checkbox-group--default
---

Checkbox Groups are typically paired with a legend which identifies the group. If no legend is provided then it is expected that an `aria-label` will be given in order to provide an invisible label to screen readers. Each Checkbox Group should contain one or more Checkboxes which users can make selections from.

<code-well-header>
  <dt-checkbox-group
    name="fruits-checkbox-group"
    class="d-input-group__fieldset"
    legend="Fruits"
    :selectedValues="[]"
  >
    <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
    <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
    <dt-checkbox value="other"><span>Other</span></dt-checkbox>
  </dt-checkbox-group>
</code-well-header>

## Variants

### Default

<code-well-header>
  <dt-checkbox-group
    name="fruits-checkbox-group"
    class="d-input-group__fieldset"
    legend="Fruits"
    :selectedValues="[]"
  >
    <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
    <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
    <dt-checkbox value="other"><span>Other</span></dt-checkbox>
  </dt-checkbox-group>
</code-well-header>

<code-example-tabs
htmlCode='
<fieldset
  class="d-input-group__fieldset"
  legend="Fruits"
  name="fruits-checkbox-group"
>
  <legend class="d-label">
    Fruits
  </legend>
  <div>
    <label>
      <div class="d-checkbox-group">
        <div class="d-checkbox__input">
          <input
            type="checkbox"
            name="fruits-checkbox-group"
            class="d-checkbox"
            value="apple"
          >
        </div>
        <div class="d-checkbox__copy d-checkbox__label">
          <div class="">
            <span>Apple</span>
          </div>
        </div>
      </div>
    </label>
  </div>
  <div>
    <label>
      <div class="d-checkbox-group">
        <div class="d-checkbox__input">
          <input
            type="checkbox"
            name="fruits-checkbox-group"
            class="d-checkbox"
            value="banana"
          >
        </div>
        <div class="d-checkbox__copy d-checkbox__label">
          <div class="">
            <span>Banana</span>
          </div>
        </div>
      </div>
    </label>
  </div>
  <div>
    <label>
      <div class="d-checkbox-group">
        <div class="d-checkbox__input">
          <input
            type="checkbox"
            name="fruits-checkbox-group"
            class="d-checkbox"
            value="other"
          >
        </div>
        <div class="d-checkbox__copy d-checkbox__label">
          <div class="">
            <span>Other</span>
          </div>
        </div>
      </div>
    </label>
  </div>
</fieldset>
'
vueCode='
<dt-checkbox-group
  name="fruits-checkbox-group"
  class="d-input-group__fieldset"
  legend="Fruits"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
'
showHtmlWarning />

### With selected values

<code-well-header>
  <dt-checkbox-group
    name="my-group-name"
    legend="My Legend"
    :selected-values="['option1']"
    ref="with-selected-values"
  >
    <dt-checkbox
      value="option1"
      label="Option 1"
    />
    <dt-checkbox
      value="option2"
      label="Option 2"
    />
  </dt-checkbox-group>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs['with-selected-values']"
vueCode='
<dt-checkbox-group
  name="my-group-name"
  legend="My Legend"
  :selected-values="[`option1`]"
>
  <dt-checkbox
    value="option1"
    label="Option 1"
  />
  <dt-checkbox
    value="option2"
    label="Option 2"
  />
</dt-checkbox-group>
'
/>

### Disabled

<code-well-header>
  <dt-checkbox-group
    name="my-group-name"
    legend="My Legend"
    disabled
    ref="example-disabled"
  >
    <dt-checkbox
      value="option1"
      label="Option 1"
    />
    <dt-checkbox
      value="option2"
      label="Option 2"
    />
  </dt-checkbox-group>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs['example-disabled']"
vueCode='
<dt-checkbox-group
  name="my-group-name"
  legend="My Legend"
  disabled
>
  <dt-checkbox
    value="option1"
    label="Option 1"
  />
  <dt-checkbox
    value="option2"
    label="Option 2"
  />
</dt-checkbox-group>
'
/>

### With validation states

<code-well-header>
  <div class="d-stack16">
    <div>
      <dt-checkbox-group
        name="checkbox-group-with-success-message"
        legend="Fruits"
        class="d-input-group__fieldset"
        :messages='[{"message":"Success validation message","type":"success"}]'
      >
        <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
        <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
        <dt-checkbox value="other"><span>Other</span></dt-checkbox>
      </dt-checkbox-group>
    </div>
    <div>
      <dt-checkbox-group
        name="checkbox-group-with-warning-message"
        legend="Fruits"
        class="d-input-group__fieldset"
        :messages='[{"message":"Warning validation message","type":"warning"}]'
      >
        <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
        <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
        <dt-checkbox value="other"><span>Other</span></dt-checkbox>
      </dt-checkbox-group>
    </div>
    <div>
      <dt-checkbox-group
      name="checkbox-group-with-error-message"
      legend="Fruits"
      class="d-input-group__fieldset"
      :messages='[{"message":"Error validation message","type":"error"}]'
      >
        <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
        <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
        <dt-checkbox value="other"><span>Other</span></dt-checkbox>
      </dt-checkbox-group>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<fieldset
  class="d-input-group__fieldset"
  legend="Fruits"
  name="fruits-checkbox-group"
>
  <legend class="d-label">
    Fruits
  </legend>
  <div>
    <label>
      <div class="d-checkbox-group">
        <div class="d-checkbox__input">
          <input
            type="checkbox"
            name="fruits-checkbox-group"
            class="d-checkbox"
            value="apple"
          >
        </div>
        <div class="d-checkbox__copy d-checkbox__label">
          <div class="">
            <span>Apple</span>
          </div>
        </div>
      </div>
    </label>
  </div>
  <div>
    <label>
      <div class="d-checkbox-group">
        <div class="d-checkbox__input">
          <input
            type="checkbox"
            name="fruits-checkbox-group"
            class="d-checkbox"
            value="banana"
          >
        </div>
        <div class="d-checkbox__copy d-checkbox__label">
          <div class="">
            <span>Banana</span>
          </div>
        </div>
      </div>
    </label>
  </div>
  <div>
    <label>
      <div class="d-checkbox-group">
        <div class="d-checkbox__input">
          <input
            type="checkbox"
            name="fruits-checkbox-group"
            class="d-checkbox"
            value="other"
          >
        </div>
        <div class="d-checkbox__copy d-checkbox__label">
          <div class="">
            <span>Other</span>
          </div>
        </div>
      </div>
    </label>
  </div>
  <div class="base-input__messages d-validation-message__container">
    <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--success d-validation-message--success">
      <p>Success validation message.</p>
    </div>
  </div>
</fieldset>
'
vueCode='
<dt-checkbox-group
  name="fruits-checkbox-group"
  class="d-input-group__fieldset"
  legend="Fruits"
  validation-state="success"
  :messages="[{ message: `Success validation message.`, type: `success` }]"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
<dt-checkbox-group
  name="fruits-checkbox-group"
  class="d-input-group__fieldset"
  legend="Fruits"
  validation-state="warning"
  :messages="[{ message: `Warning validation message.`, type: `warning` }]"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
<dt-checkbox-group
  name="fruits-checkbox-group"
  class="d-input-group__fieldset"
  legend="Fruits"
  validation-state="error"
  :messages="[{ message: `Error validation message.`, type: `error` }]"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
'
showHtmlWarning />

### With validation messages hidden

<code-well-header>
  <dt-checkbox-group
    name="my-group-name"
    legend="My Legend"
    :messages="[{ message: 'My Success Message', type: `success` }]"
    :show-messages="false"
    ref="with-messages-hidden"
  >
    <dt-checkbox
      value="option1"
      label="Option 1"
    />
    <dt-checkbox
      value="option2"
      label="Option 2"
    />
  </dt-checkbox-group>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs['with-messages-hidden']"
vueCode='
<dt-checkbox-group
  name="my-group-name"
  legend="My Legend"
  :messages="[{ message: `My Success Message`, type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
  :show-messages="false"
>
  <dt-checkbox
    value="option1"
    label="Option 1"
  />
  <dt-checkbox
    value="option2"
    label="Option 2"
  />
</dt-checkbox-group>
'
/>

## Vue API

<component-vue-api component-name="checkboxgroup" />
