<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold"
  >
    <div class="flex items-center justify-between">
      {{ date }}
    </div>
    <div class="flex items-center justify-end mr-16">
      {{ currency }}
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  date: String,
  transactions: Array,
});

const sum = computed(() =>
  props.transactions.reduce(
    (total, transaction) =>
      transaction.type === "Income" ? total + transaction.amount : total - transaction.amount,
    0
  )
);

const { currency } = useCurrency(sum.value);
</script>
