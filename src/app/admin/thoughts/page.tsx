'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/client';
import { logger } from '@/lib/utils';
import type { Thought } from '@/types';

export default function AdminThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ text: '', author: '', backgroundUrl: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const q = query(collection(db(), COLLECTIONS.thoughts), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (s) => {
      setThoughts(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Thought, 'id'>) })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  function beginEdit(t: Thought) {
    setEditing(t.id);
    setDraft({ text: t.text, author: t.author, backgroundUrl: t.backgroundUrl ?? '' });
  }

  function beginCreate() {
    setCreating(true);
    setEditing(null);
    setDraft({ text: '', author: 'Modaksha', backgroundUrl: '/assets/thoughts/sunrise.svg' });
  }

  async function save() {
    if (creating) {
      await addDoc(collection(db(), COLLECTIONS.thoughts), {
        text: draft.text.trim(),
        author: draft.author.trim() || 'Modaksha',
        backgroundUrl: draft.backgroundUrl.trim() || '/assets/thoughts/sunrise.svg',
        order: thoughts.length + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else if (editing) {
      await updateDoc(doc(db(), COLLECTIONS.thoughts, editing), {
        text: draft.text.trim(),
        author: draft.author.trim() || 'Modaksha',
        backgroundUrl: draft.backgroundUrl.trim(),
        updatedAt: Date.now(),
      });
    }
    logger.info('Thought saved');
    setEditing(null);
    setCreating(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this thought?')) return;
    await deleteDoc(doc(db(), COLLECTIONS.thoughts, id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-cream-50">Thoughts</h1>
          <p className="text-cream-200/60 text-sm mt-1">{thoughts.length} total</p>
        </div>
        {!editing && !creating && (
          <button type="button" onClick={beginCreate} className="btn-primary">
            + Add Thought
          </button>
        )}
      </div>

      {(editing || creating) && (
        <div className="p-6 rounded-2xl bg-earth-800/40 border border-cream-100/10 mb-6 space-y-4">
          <label className="block">
            <span className="block text-cream-200/70 text-xs uppercase tracking-wider mb-2">Quote</span>
            <textarea rows={3} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} className="adm-input" />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-cream-200/70 text-xs uppercase tracking-wider mb-2">Author</span>
              <input value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} className="adm-input" />
            </label>
            <label className="block">
              <span className="block text-cream-200/70 text-xs uppercase tracking-wider mb-2">Background URL</span>
              <input value={draft.backgroundUrl} onChange={(e) => setDraft({ ...draft, backgroundUrl: e.target.value })} className="adm-input" />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={save} disabled={!draft.text.trim()} className="btn-primary disabled:opacity-50">
              {creating ? 'Create' : 'Save'}
            </button>
            <button type="button" onClick={() => { setEditing(null); setCreating(false); }} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl shimmer bg-earth-800/40" />
          ))}
        </div>
      ) : thoughts.length === 0 ? (
        <div className="py-20 text-center text-cream-200/60 border border-dashed border-cream-100/10 rounded-2xl">
          No thoughts yet.
        </div>
      ) : (
        <div className="space-y-3">
          {thoughts.map((t) => (
            <div key={t.id} className="p-5 rounded-2xl bg-earth-800/40 border border-cream-100/10">
              <div className="flex items-start gap-4">
                <div className="text-saffron-400 font-serif text-3xl opacity-50">"</div>
                <div className="flex-1">
                  <p className="font-serif text-xl text-cream-50 leading-snug mb-2">{t.text}</p>
                  <div className="text-cream-200/50 text-xs">— {t.author}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => beginEdit(t)} className="px-3 py-1.5 rounded-lg bg-cream-100/10 hover:bg-cream-100/20 text-cream-100 text-xs">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        :global(.adm-input) {
          width: 100%;
          background-color: rgba(58, 36, 16, 0.6);
          border: 1px solid rgba(245, 230, 211, 0.1);
          border-radius: 0.75rem;
          padding: 0.625rem 1rem;
          color: rgb(245, 230, 211);
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.adm-input:focus) { border-color: #D2691E; }
      `}</style>
    </div>
  );
}
