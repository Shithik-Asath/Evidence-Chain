import { supabase } from '../lib/supabase';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export const contactService = {
  // Submit contact form
  async submitContactForm(contactData: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(contactData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to submit contact form: ${error.message}`);
    }

    return data;
  },

  // Get all contact messages (for admin use)
  async getAllMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch contact messages: ${error.message}`);
    }

    return data || [];
  }
};