'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatRupiah } from '@/lib/helpers';
import { useToast } from '@/components/Toast';

interface Category { id: number; name: string; }
interface Pkg {
  id: number; name: string; description: string;
  price: number; stock: number; isActive: boolean;
  imageUrl?: string; categoryId: number;
  category?: { id: number; name: string };
}

const emptyForm = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '', isActive: true };

export default function AdminPackagesPage() {
  const toast = useToast();
  const [list, setList] = useState<Pkg[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(emptyForm);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    Promise.all([api.get<Pkg[]>('/packages'), api.get<Category[]>('/categories')])
      .then(([pkgs, cats]) => { setList(pkgs); setCategories(cats); })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p: Pkg) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), stock: String(p.stock), imageUrl: p.imageUrl || '', categoryId: String(p.categoryId), isActive: p.isActive });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: parseInt(form.price), stock: parseInt(form.stock), categoryId: parseInt(form.categoryId) };
    try {
      if (editing) {
        await api.put(`/packages/${editing.id}`, payload);
        toast.success('Paket diupdate');
      } else {
        await api.post('/packages', payload);
        toast.success('Paket ditambahkan');
      }
      closeForm();
      load();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus paket "${name}"? Aksi ini tidak bisa dibalik.`)) return;
    try {
      await api.delete(`/packages/${id}`);
      toast.success('Paket dihapus');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const toggleActive = async (p: Pkg) => {
    try {
      await api.put(`/packages/${p.id}`, { isActive: !p.isActive });
      toast.success(p.isActive ? 'Paket dinonaktifkan' : 'Paket diaktifkan');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value });
  };

  return (
    <div className="container">
      <div className="page-header"><h1>Kelola Paket</h1><p>Tambah, ubah, atau nonaktifkan paket menu catering</p></div>
      <div className="page-content">
        <div style={{ marginBottom: 20, textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={openNew}>+ Tambah Paket</button>
        </div>

        {loading ? (
          <div className="loading"><span className="spinner"></span>Memuat...</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Paket</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Status</th><th>Aksi</th></tr></thead>
             <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ display: 'block', color: '#3d2817' }}>{p.name}</strong>
                      <small style={{ color: '#6b5443' }}>
                        {p.description?.slice(0, 50)}{p.description?.length > 50 ? '...' : ''}
                      </small>
                    </td>
                    <td style={{ color: '#3d2817' }}>{p.category?.name || '-'}</td>
                    <td style={{ color: '#3d2817' }}><strong>{formatRupiah(p.price)}</strong></td>
                    <td style={{ color: '#3d2817' }}>{p.stock}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${p.isActive ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => toggleActive(p)}
                      >
                        {p.isActive ? '✅ AKTIF' : '❌ NONAKTIF'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id, p.name)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={`modal-overlay${showForm ? ' active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}>
        <div className="modal">
          <div className="modal-header">
            <h3 className="modal-title">{editing ? 'Edit Paket' : 'Tambah Paket Baru'}</h3>
            <button className="modal-close" onClick={closeForm}>×</button>
          </div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nama Paket *</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi *</label>
              <textarea className="form-input" name="description" value={form.description} onChange={handleChange} rows={3} required></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Harga (Rp) *</label>
                <input className="form-input" name="price" type="number" value={form.price} onChange={handleChange} required min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Stok *</label>
                <input className="form-input" name="stock" type="number" value={form.stock} onChange={handleChange} required min={0} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select className="form-input" name="categoryId" value={form.categoryId} onChange={handleChange} required>
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">URL Gambar (opsional)</label>
              <input className="form-input" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
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
