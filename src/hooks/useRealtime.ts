import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type EvidenceRecord = Database['public']['Tables']['evidence_records']['Row'];
type CaseRecord = Database['public']['Tables']['case_records']['Row'];

export const useRealtimeEvidence = () => {
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchEvidence = async () => {
      const { data, error } = await supabase
        .from('evidence_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setEvidence(data);
      }
      setLoading(false);
    };

    fetchEvidence();

    // Set up real-time subscription
    const channel = supabase
      .channel('evidence_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'evidence_records'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvidence(prev => [payload.new as EvidenceRecord, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEvidence(prev => 
              prev.map(item => 
                item.id === payload.new.id ? payload.new as EvidenceRecord : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setEvidence(prev => 
              prev.filter(item => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { evidence, loading };
};

export const useRealtimeCases = () => {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchCases = async () => {
      const { data, error } = await supabase
        .from('case_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setCases(data);
      }
      setLoading(false);
    };

    fetchCases();

    // Set up real-time subscription
    const channel = supabase
      .channel('case_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'case_records'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCases(prev => [payload.new as CaseRecord, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCases(prev => 
              prev.map(item => 
                item.id === payload.new.id ? payload.new as CaseRecord : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setCases(prev => 
              prev.filter(item => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { cases, loading };
};