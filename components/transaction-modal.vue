<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add transaction </template>
      <UForm :state="state" :schema="schema" ref="form" @submit="save">
        <UFormGroup
          :required="true"
          label="Transaction type"
          name="type"
          class="mb-4"
          
        >
          <USelectMenu
            placeholder="Select the transaction type"
            :options="transactionType"
            v-model="state.type"
          />
        </UFormGroup>
        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
          />
        </UFormGroup>
        <UFormGroup
          label="Transaction date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>
        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>
        <UFormGroup
          :required="true"
          label="Category"
          name="category"
          class="mb-4"
          v-if="state.type === 'Expense'"
        >
          <USelectMenu
            placeholder="Category"
            :options="categories"
            v-model="state.category"
            
          />
        </UFormGroup>
        <UButton :loading="isLoading" type="submit" color="black" variant="solid" label="Save"/>
      </UForm>
    </UCard>
  </UModal>
</template>
<script setup>
import { categories, transactionType } from "~/constants";
import {z} from 'zod'
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'saved']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if(!value) resetForm()
    emit("update:modelValue", value)
  },
});

const defaultSchema = z.object({
  created_at: z.string().min(1, "Transaction date is required"),
  description: z.string().optional(),
  // amount: z.number().positive()
})

const incomeSchema = z.object({
  type: z.literal('Income')
})
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories)
})
const investmentSchema = z.object({
  type: z.literal('Investment')
})
const savingSchema = z.object({
  type: z.literal('Saving')
})
const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
  defaultSchema
)

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const toast = useToast()
const save = async()=>{
  console.log('Hi')
  if(form.value.errors.length) {
    console.log('Hi2')
    return}
  isLoading.value = true
  try{
    console.log(state.value)
    const {error} = await supabase.from('transactions')
    .upsert({...state.value})

    if(!error){
      toast.add({
        title: 'Transaction saved',
        'icon': 'i-heroicons-check-circle'
      })
      isOpen.value = false
      emit('saved')
      return
    }
    throw error
  } catch (e) {
    toast.add({
      title: 'Transaction not saved',
      description: e.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } 
  finally {
    isLoading.value =false
  }
}
const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
}
const state = ref({
  ...initialState
});
const resetForm = () => {
  Object.assign(state.value, initialState)
  form.value.clear()
}
</script>
