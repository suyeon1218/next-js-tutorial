'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // 해당 부분
  try {
    const { data, error } = await supabase
      .from('invoices') // 테이블명 (실제 테이블명으로 변경)
      .insert([
        {
          customer_id: customerId,
          amount: amountInCents,
          status: status,
          date: date,
        },
      ]);

    if (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to create invoice.');
    }

    console.log('Invoice created successfully:', data);
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw new Error('Failed to create invoice.');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;

  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        customer_id: customerId,
        amount: amountInCents,
        status: status,
      })
      .eq('id', id);
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw new Error('Failed to update invoice.');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw new Error('Failed to delete invoice.');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
