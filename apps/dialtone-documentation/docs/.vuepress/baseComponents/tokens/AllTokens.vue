<template>
  <tokens-bar
    v-model:search="searchCriteria"
    v-model:format="format"
    v-model:theme="theme"
    v-model:brand="brand"
    @filter="filterTokens"
  />
  <div v-if="noSearchResults" class="d-body d-fc-tertiary d-p16 d-ta-center">
    No results found for
    <strong class="d-fw-semibold"> &OpenCurlyDoubleQuote;{{ searchCriteria }}&CloseCurlyDoubleQuote;</strong>
  </div>
  <token-tree v-else :node="filteredTokens" :category="null" :level="2" :theme="theme" />
</template>

<script setup>
import { capitalize, computed, ref, onBeforeMount } from 'vue';
import TokenTree from './TokenTree.vue';
import TokensBar from './TokensBar.vue';
import { addTokensToStructure } from './utilities';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

const route = useRoute();
const format = ref(route.query.format || 'CSS');
const theme = ref(route.query.theme || 'light');
const brand = ref(route.query.brand || 'dp');
const searchCriteria = ref(route.query.search || null);
const processedTokens = {}; // is set beforeMount and never changes
const filteredTokens = ref({}); // same as processedTokens but filtered by format, theme and search
const filteredHeaders = ref([]); // to fill the dynamic table of contents

const filterTokens = () => {
  if (!searchCriteria.value) {
    filteredTokens.value = structuredClone(processedTokens[format.value][brandThemeKey.value]);
    updateHeaders();
    return;
  }

  // Replace '/' and '-' characters for ' ' to allow to search by the name shown in Figma:
  // typography/label/md-plain should match var(--dt-typography-label-plain)
  // or dtTypographyLabelMdPlain
  const searchValues = searchCriteria.value.replace(/\/|-/g, ' ').split(' ');
  const searchRegexArray = searchValues.map(value => value.replace(/\(/, '\\(').replace(/\)/, '\\)')); // escape parenthesis
  const regexArray = searchRegexArray.map(searchRegex => new RegExp(searchRegex, 'i'));
  filteredTokens.value = filterTokenNode(processedTokens[format.value][brandThemeKey.value], null, regexArray);
  updateHeaders();
};

const filterTokenNode = (node, name, regexArray) => {
  const subNodesRet = {};
  let childrenRet = [];
  const matchingRegex = [];
  const nonMatchingRegex = [];
  regexArray.forEach(regex => {
    if (regex.test(name)) matchingRegex.push(regex);
    else nonMatchingRegex.push(regex);
  });
  // If the name matches all the terms, return the entire node
  if (nonMatchingRegex.length === 0) {
    return node;
    // else return the children that match
  } else if (node._children) {
    childrenRet = node._children.filter(token => !token.hidden).filter(token => {
      const { name: tokenName, tokenValue, keywords } = token;
      return nonMatchingRegex.every(regex => regex.test(tokenName) || regex.test(tokenValue) || regex.test(keywords));
    });
  }
  // look for other categories in the same level and filter recursively
  Object.keys(node).forEach(key => {
    if (key !== '_children') {
      const subNode = filterTokenNode(node[key], key, nonMatchingRegex);
      if (subNode !== null) subNodesRet[key] = subNode;
    }
  });
  if (Object.keys(subNodesRet).length > 0 || childrenRet.length > 0) {
    return {
      _children: childrenRet,
      ...subNodesRet,
    };
  }
  return null;
};

const noSearchResults = computed(() => filteredTokens.value === null);
const brandThemeKey = computed(() => `${brand.value}-${theme.value}`);

const updateHeaders = () => {
  if (filteredTokens.value === null) return [];
  filteredHeaders.value = updateHeadersRecursively(filteredTokens.value, null);
  window.filteredHeaders = filteredHeaders.value;
};

const updateHeadersRecursively = (node, category) => {
  return Object.keys(node)
    .filter(subNodeKey => subNodeKey !== '_children')
    .map(subNodeKey => {
      return {
        title: capitalize(subNodeKey),
        level: 2,
        slug: category === null ? subNodeKey : `${category}-${subNodeKey}`,
        get link () {
          return `#${this.slug}`;
        },
        children: updateHeadersRecursively(node[subNodeKey], category === null ? subNodeKey : category),
      };
    });
};

onBeforeMount(() => {
  addTokensToStructure(processedTokens);
  filterTokens();
});

onBeforeRouteLeave(() => {
  window.filteredHeaders = null;
});
</script>
