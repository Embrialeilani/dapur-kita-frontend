'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';

interface Category { id: number; name: string; description?: string; }

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [list, setList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.get<Category[]>('/categories')
      .then(setList)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm({ name: '', description: '' }); setShowForm(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, form);
        toast.success('Kategori diupdate');
      } else {
        await api.post('/categories', form);
        toast.success('Kategori ditambahkan');
      }
      closeForm();
      load();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus kategori "${name}"? Semua paket dalam kategori ini juga akan terpengaruh.`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Kategori dihapus');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Kelola Kategori</h1>
        <p>Tambah atau ubah kategori paket menu</p>
      </div>
      <div className="page-content">
        <div style={{ marginBottom: 20, textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={openNew}>+ Tambah Kategori</button>
        </div>

        {loading ? (
          <div className="loading"><span className="spinner"></span>Memuat...</div>
        ) : list.length === 0 ? (
          <div className="empty-state"><h3>Belum ada kategori</h3></div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>#</th><th>Nama Kategori</th><th>Deskripsi</th><th>Aksi</th></tr></thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.description || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(c)}>✏️ Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id, c.name)}>🗑️ Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <div className={`modal-overlay${showForm ? ' active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}>
        <div className="modal">
          <div className="modal-header">
            <h3 className="modal-title">{editing ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
            <button className="modal-close" onClick={closeForm}>×</button>
          </div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nama Kategori *</label>
              <input className="form-input" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi</label>
              <input className="form-input" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><span className="spinner"></span> Menyimpan...</> : (editing ? 'Update' : 'Tambah')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeForm}>Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
