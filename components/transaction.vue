<template>
  <div class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        
        <div>{{transaction.description}}</div>
        
      </div>
      <div>
        <UBadge color="white" v-if="transaction.category">{{transaction.category}}</UBadge>
       
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UButton color="white" variant="ghost" trailing-icon="i-heroicons-pencil-square-20-solid" class="text-gray-400"/>
        
        <UButton color="white" variant="ghost" trailing-icon="i-heroicons-trash-20-solid" class="text-gray-400" @click="deleteTransaction" :loading="isLoading"/>
      
       <!-- <UDropdown :items="items" :popper="{ placement: 'bottom-start' }" trailing-icon="i-heroicons-ellipsis-horizontal">
           <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading" />
         </UDropdown> -->
      </div>
    </div>
  </div>
</template>
<script setup>
const toast = useToast()
const supabase = useSupabaseClient()

const emit = defineEmits(["transactionDeleted"]);
const props = defineProps({
    transaction: Object
})
const isIncome = computed(()=> props.transaction.type === 'Income')

const icon = computed(
    () => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
)
const iconColor = computed(
    () => isIncome.value ? 'text-green-600' : 'text-red-600'
)
const {currency} = useCurrency(props.transaction.amount)
const isLoading = ref(false)

const deleteTransaction = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase.from("transactions").delete().eq("id", props.transaction.id);
    if (error) throw error;

    toast.add({
      title: "Transaction deleted",
      icon: "i-heroicons-check-circle",
      color: "green",
    });

    emit("transactionDeleted", props.transaction.id); // Notify parent to update list
  } catch (error) {
    toast.add({
      title: "Error in deleting the transaction",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};


// const items = ref([
//     [{
//         label: 'Edit',
//         icon: 'i-heroicons-pencil-square-20-solid',
//         click: () => console.log('Edit')
//     },
//     {
//         label: 'Delete',
//         icon: 'i-heroicons-trash-20-solid',
//         click: () => deleteTransaction
//     }]
// ])

</script>
