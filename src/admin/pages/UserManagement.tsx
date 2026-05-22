import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ShieldAlert, Pencil, Save, X, RefreshCw, Search, Users } from 'lucide-react';
import { MockAppUser, ActionItem } from '@/data/adminMockData';

interface AdminContextType {
  usersList: MockAppUser[];
  setUsersList: React.Dispatch<React.SetStateAction<MockAppUser[]>>;
  actions: ActionItem[];
  setActions: React.Dispatch<React.SetStateAction<ActionItem[]>>;
}

export const UserManagement = () => {
  const { usersList, setUsersList, actions, setActions } = useOutletContext<AdminContextType>();
  
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<MockAppUser>>({});
  
  const [cityFilter, setCityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = usersList.filter(u => 
    (cityFilter ? u.city.toLowerCase().includes(cityFilter.toLowerCase()) : true) &&
    (searchQuery ? u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );

  const startEdit = (user: MockAppUser) => {
    setEditId(user.id);
    setForm({ ...user });
  };

  const handleSave = () => {
    setUsersList(prev => prev.map(u => u.id === editId ? { ...u, ...form } as MockAppUser : u));
    toast({ title: '✅ User updated' });
    setEditId(null);
  };

  const handleRevokeTask = (taskId: string, userId: string) => {
    // Make task public again
    setActions(prev => prev.map(a => a.id === taskId ? { ...a, assignedTo: undefined, status: 'active' } : a));
    // Remove from user
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, claimedTaskIds: u.claimedTaskIds.filter(id => id !== taskId) } : u));
    toast({ title: '✅ Task revoked and returned to public pool' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold font-inter">User Management</h2>
          <p className="text-muted-foreground text-sm">View, filter, and manage platform users.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between glass-card p-4 rounded-2xl border border-primary/20 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-9 border-primary/20"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Input 
            placeholder="Filter by City / Region..." 
            className="border-primary/20"
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
          />
        </div>
      </div>

      {editId && (
        <div className="glass-card rounded-[16px] p-6 border border-primary/20 bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-inter font-bold flex items-center gap-2"><Pencil className="w-4 h-4 text-primary" /> Edit User Profile</h3>
            <Button size="sm" variant="ghost" onClick={() => setEditId(null)}><X className="w-4 h-4" /></Button>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="border-primary/20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className="border-primary/20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">City</label>
              <Input value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} className="border-primary/20" />
            </div>
          </div>
          <Button onClick={handleSave} className="mt-4 bg-primary text-white gap-2"><Save className="w-4 h-4" /> Save Profile</Button>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden shadow-sm">
        <div className="hidden lg:grid px-6 py-4 border-b border-primary/20 bg-[#E8FBEA]/30" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 2.5fr 80px' }}>
          <span className="text-xs font-bold text-muted-foreground uppercase">User</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">City</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Joined Date</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Claimed Tasks</span>
          <span className="text-xs font-bold text-muted-foreground uppercase text-right">Actions</span>
        </div>
        <div className="divide-y divide-primary/20/50">
          {filteredUsers.map(user => (
            <div key={user.id} className="grid items-start px-6 py-4 hover:bg-[#E8FBEA]/20 transition-colors gap-4 lg:gap-0" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className="lg:col-span-1" style={{ gridArea: '1 / 1 / 2 / 2' }}>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.id} - {user.email}</p>
              </div>
              <span className="text-sm lg:col-span-1" style={{ gridArea: '1 / 2 / 2 / 3' }}>{user.city}</span>
              <span className="text-sm text-muted-foreground lg:col-span-1" style={{ gridArea: '1 / 3 / 2 / 4' }}>{user.joinedDate}</span>
              
              <div className="space-y-2 lg:col-span-1" style={{ gridArea: '1 / 4 / 2 / 5' }}>
                {user.claimedTaskIds.length === 0 && <span className="text-xs text-muted-foreground italic">No active tasks</span>}
                {user.claimedTaskIds.map(taskId => {
                  const task = actions.find(a => a.id === taskId);
                  if (!task) return null;
                  
                  return (
                    <div key={taskId} className="text-xs border border-primary/20 bg-transparent rounded-lg p-3 flex flex-col gap-2 shadow-sm">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium">{task.title}</span>
                        <Badge variant="outline" className={`shrink-0 text-[10px] ${task.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {task.status === 'in-progress' && (
                        <div className="flex justify-end mt-1">
                          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRevokeTask(taskId, user.id)}>
                            <RefreshCw className="w-3 h-3" /> Revoke / Unassign
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end lg:col-span-1" style={{ gridArea: '1 / 5 / 2 / 6' }}>
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 h-8 w-8 p-0 rounded-full" onClick={() => startEdit(user)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Users className="w-12 h-12 text-primary/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No users found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

