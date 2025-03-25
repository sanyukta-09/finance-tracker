<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>
  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      color="green"
      title="Income"
      :amount="incomeTotal"
      :last-amount="prevIncomeTotal"
      :loading="isPending"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :last-amount="prevExpenseTotal"
      :loading="isPending"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="3000"
      :loading="isPending"
    />
    <Trend
      color="red"
      title="Savings"
      :amount="4000"
      :last-amount="4100"
      :loading="isPending"
    />
  </section>
  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} and {{ expenseCount }} expense in this period
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" @saved="refresh"/>
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="() => (isOpen = true)"
      />
    </div>
  </section>
  <section v-if="!isPending">
    <div
      v-for="(transactionOnDay, date) in byDate"
      :key="date"
      class="mb-10"
    >
      <daily-transaction-summary
        :date="date"
        :transactions="transactionOnDay"
      />
      <Transaction
        v-for="transaction in transactionOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @transactionDeleted="refresh()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>
<script setup>
import { transactionViewOptions } from "~/constants";


const selectedView = ref(transactionViewOptions[0]);
const isOpen = ref(false);

const {current, previous} = useSelectedTimePeriod(selectedView)
const {isPending, refresh, transactions: {
  incomeCount,
  incomeTotal,
  expenseCount,
  expenseTotal,
  grouped: {
    byDate
  }
}} = useFetchTransactions(current)
await refresh()

const {refresh: refreshPrevious, transactions: {
  incomeTotal: prevIncomeTotal,
  expenseTotal: prevExpenseTotal
}} = useFetchTransactions(previous)

await refreshPrevious()

</script>
