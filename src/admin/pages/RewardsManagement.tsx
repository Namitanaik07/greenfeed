import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Gift, Plus, Trash2, Pencil, X, Save } from 'lucide-react';
import { RewardItem } from '@/data/adminMockData';

interface AdminContextType {
  rewards: RewardItem[];
  setRewards: React.Dispatch<React.SetStateAction<RewardItem[]>>;
}

export const RewardsManagement = () => {
  const { rewards, setRewards } = useOutletContext<AdminContextType>();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<RewardItem>>({});
  const [adding, setAdding] = useState(false);

  const resetForm = () => { setForm({}); setEditId(null); setAdding(false); };
  const genId = () => `r-${Date.now()}`;

  const startEdit = (item: RewardItem) => {
    setEditId(item.id);
    setAdding(false);
    setForm({ ...item });
  };

  const startAdd = () => { resetForm(); setAdding(true); };

  const handleDelete = (id: string) => {
    setRewards(p => p.filter(i => i.id !== id));
    toast({ title: '🗑️ Reward deleted' });
  };

  const handleSave = () => {
    const item: RewardItem = { 
      id: editId || genId(), 
      name: form.name || '', 
      description: form.description || '', 
      category: form.category || 'merchandise', 
      cost: Number(form.cost) || 0, 
      stock: Number(form.stock) || 0
    };
    
    if (editId) setRewards(p => p.map(i => i.id === editId ? item : i));
    else setRewards(p => [item, ...p]);
    
    toast({ title: editId ? '✏️ Reward updated' : '✅ Reward created' });
    resetForm();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold font-inter">Rewards Store Catalog</h2>
          <p className="text-muted-foreground text-sm">Manage the inventory of rewards available for users.</p>
        </div>
      </div>

      {(adding || editId) && (
        <div className="glass-card rounded-[16px] p-6 border border-primary/20 bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-inter font-bold flex items-center gap-2">
              {editId ? <><Pencil className="w-4 h-4 text-primary" /> Edit Reward Item</> : <><Plus className="w-4 h-4 text-primary" /> Add New Reward</>}
            </h3>
            <Button size="sm" variant="ghost" onClick={resetForm}><X className="w-4 h-4" /></Button>
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Reward Name</label>
              <Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="border-primary/20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Input value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} className="border-primary/20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Cost (Points)</label>
              <Input type="number" value={form.cost || ''} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} className="border-primary/20" />
            </div>
            <div className="space-y-1 md:col-span-3">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Input value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="border-primary/20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Stock Available</label>
              <Input type="number" value={form.stock || ''} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="border-primary/20" />
            </div>
          </div>
          <Button onClick={handleSave} className="mt-4 bg-primary text-white gap-2"><Save className="w-4 h-4" /> {editId ? 'Save Changes' : 'Publish Reward'}</Button>
        </div>
      )}

      {!adding && !editId && (
        <div className="flex justify-between items-center glass-card p-4 rounded-2xl border border-primary/20 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground ml-2">Total Items in Catalog: {rewards.length}</p>
          <Button size="sm" onClick={startAdd} className="bg-primary text-white gap-2 rounded-xl"><Plus className="w-4 h-4" /> Add Reward</Button>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden shadow-sm">
        <div className="hidden md:grid px-6 py-4 border-b border-primary/20 bg-[#E8FBEA]/30" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px' }}>
          <span className="text-xs font-bold text-muted-foreground uppercase">Reward Item</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Category</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Cost</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Stock</span>
          <span className="text-xs font-bold text-muted-foreground uppercase text-right">Actions</span>
        </div>
        <div className="divide-y divide-primary/20/50">
          {rewards.map(item => (
            <div key={item.id} className="grid items-center px-6 py-4 hover:bg-[#E8FBEA]/20 transition-colors" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px' }}>
              <div className="pr-4">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">{item.description}</p>
              </div>
              <span className="text-sm capitalize">{item.category}</span>
              <span className="text-sm font-bold text-primary">{item.cost} pts</span>
              <div>
                <Badge variant="outline" className={`${item.stock === 0 ? 'bg-red-50 text-red-600 border-red-200' : 'glass-card border-primary/20'}`}>
                  {item.stock} left
                </Badge>
              </div>
              <div className="flex gap-1 justify-end">
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 h-8 w-8 p-0 rounded-full" onClick={() => startEdit(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {rewards.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Gift className="w-12 h-12 text-primary/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No rewards in catalog.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

