import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, adminApi } from '@/integrations/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  Users, FileText, LayoutTemplate, Shield, BarChart3, Plus, Pencil, Trash2,
  Search, LogOut, Crown, TrendingUp, UserPlus, FolderOpen, Settings, Eye
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at?: string;
}

interface CVData {
  id: string;
  title: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalCvs: number;
  recentUsers: number;
  recentCvs: number;
  totalAdmins: number;
  activeTemplates: number;
}

type AdminTab = 'overview' | 'users' | 'cvs' | 'templates';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  // Search
  const [userSearch, setUserSearch] = useState('');
  const [cvSearch, setCvSearch] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');

  // Dialogs
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showEditTemplate, setShowEditTemplate] = useState<Template | null>(null);

  // Form states
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'user' });
  const [editUserData, setEditUserData] = useState({ full_name: '', email: '', role: '', password: '' });
  const [newTemplate, setNewTemplate] = useState({ name: '', slug: '', description: '', category: 'professional', sort_order: 0 });
  const [editTemplateData, setEditTemplateData] = useState({ name: '', slug: '', description: '', category: '', sort_order: 0, is_active: true });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statsData, usersData, cvsData, templatesData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getCvs(),
        adminApi.getTemplates(),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
      setCvs(cvsData.cvs);
      setTemplates(templatesData.templates);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authApi.isAuthenticated()) {
          navigate('/auth');
          return;
        }
        const { user } = await authApi.getMe();
        if (user.role !== 'admin') {
          navigate('/dashboard');
          return;
        }
        setCurrentUser(user);
        await loadData();
      } catch {
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate, loadData]);

  const handleLogout = () => {
    authApi.logout();
    navigate('/auth');
  };

  // User CRUD
  const handleCreateUser = async () => {
    setFormError(''); setFormSuccess(''); setSubmitting(true);
    try {
      await adminApi.createUser(newUser);
      setFormSuccess('User berhasil dibuat');
      setShowCreateUser(false);
      setNewUser({ email: '', password: '', full_name: '', role: 'user' });
      await loadData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!showEditUser) return;
    setFormError(''); setFormSuccess(''); setSubmitting(true);
    try {
      await adminApi.updateUser(showEditUser.id, editUserData);
      setFormSuccess('User berhasil diupdate');
      setShowEditUser(null);
      await loadData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await adminApi.deleteUser(id);
      setFormSuccess('User berhasil dihapus');
      setShowDeleteConfirm(null);
      await loadData();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDeleteCv = async (id: string) => {
    try {
      await adminApi.deleteCv(id);
      setFormSuccess('CV berhasil dihapus');
      setShowDeleteConfirm(null);
      await loadData();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  // Template CRUD
  const handleCreateTemplate = async () => {
    setFormError(''); setFormSuccess(''); setSubmitting(true);
    try {
      await adminApi.createTemplate(newTemplate);
      setFormSuccess('Template berhasil dibuat');
      setShowCreateTemplate(false);
      setNewTemplate({ name: '', slug: '', description: '', category: 'professional', sort_order: 0 });
      await loadData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!showEditTemplate) return;
    setFormError(''); setFormSuccess(''); setSubmitting(true);
    try {
      await adminApi.updateTemplate(showEditTemplate.id, editTemplateData);
      setFormSuccess('Template berhasil diupdate');
      setShowEditTemplate(null);
      await loadData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTemplate = async (id: string) => {
    try {
      await adminApi.toggleTemplate(id);
      await loadData();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await adminApi.deleteTemplate(id);
      setFormSuccess('Template berhasil dihapus');
      setShowDeleteConfirm(null);
      await loadData();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const openEditUser = (user: User) => {
    setEditUserData({ full_name: user.full_name, email: user.email, role: user.role, password: '' });
    setShowEditUser(user);
  };

  const openEditTemplate = (template: Template) => {
    setEditTemplateData({
      name: template.name, slug: template.slug, description: template.description,
      category: template.category, sort_order: template.sort_order, is_active: template.is_active
    });
    setShowEditTemplate(template);
  };

  // Filters
  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredCvs = cvs.filter(c =>
    c.title?.toLowerCase().includes(cvSearch.toLowerCase()) ||
    c.user_email?.toLowerCase().includes(cvSearch.toLowerCase())
  );

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
    t.category?.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Memuat Admin Panel...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: BarChart3 },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'cvs' as AdminTab, label: 'CVs', icon: FileText },
    { id: 'templates' as AdminTab, label: 'Templates', icon: LayoutTemplate },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{currentUser?.full_name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'users' && 'Manajemen Users'}
            {activeTab === 'cvs' && 'Manajemen CVs'}
            {activeTab === 'templates' && 'Manajemen Templates'}
          </h2>
          <p className="text-slate-400 mt-1">
            {activeTab === 'overview' && 'Ringkasan sistem CV-Craft AI'}
            {activeTab === 'users' && 'Kelola semua pengguna sistem'}
            {activeTab === 'cvs' && 'Kelola semua CV yang tersimpan'}
            {activeTab === 'templates' && 'Kelola template CV yang tersedia'}
          </p>
        </div>

        {/* Status Messages */}
        {formError && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {formError}
            <button onClick={() => setFormError('')} className="float-right text-red-400 hover:text-red-300">✕</button>
          </div>
        )}
        {formSuccess && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            {formSuccess}
            <button onClick={() => setFormSuccess('')} className="float-right text-green-400 hover:text-green-300">✕</button>
          </div>
        )}

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Users</p>
                      <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
                      <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> +{stats.recentUsers} minggu ini
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total CVs</p>
                      <p className="text-3xl font-bold text-white mt-1">{stats.totalCvs}</p>
                      <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> +{stats.recentCvs} minggu ini
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Active Templates</p>
                      <p className="text-3xl font-bold text-white mt-1">{stats.activeTemplates}</p>
                      <p className="text-xs text-slate-500 mt-1">{stats.totalAdmins} admin terdaftar</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                      <LayoutTemplate className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription>Aksi cepat untuk manajemen sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    className="h-auto py-4 bg-blue-600 hover:bg-blue-700 flex flex-col gap-2"
                    onClick={() => { setActiveTab('users'); setShowCreateUser(true); }}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Tambah User Baru</span>
                  </Button>
                  <Button
                    className="h-auto py-4 bg-purple-600 hover:bg-purple-700 flex flex-col gap-2"
                    onClick={() => setActiveTab('users')}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Kelola Users</span>
                  </Button>
                  <Button
                    className="h-auto py-4 bg-yellow-600 hover:bg-yellow-700 flex flex-col gap-2"
                    onClick={() => setActiveTab('templates')}
                  >
                    <FolderOpen className="h-5 w-5" />
                    <span>Kelola Templates</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Users Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-400">Email</TableHead>
                      <TableHead className="text-slate-400">Nama</TableHead>
                      <TableHead className="text-slate-400">Role</TableHead>
                      <TableHead className="text-slate-400">Terdaftar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.slice(0, 5).map((user) => (
                      <TableRow key={user.id} className="border-slate-800">
                        <TableCell className="text-slate-200">{user.email}</TableCell>
                        <TableCell className="text-slate-300">{user.full_name || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className={user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{formatDate(user.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Cari user..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateUser(true)}>
                <Plus className="h-4 w-4 mr-2" /> Tambah User
              </Button>
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-400">Email</TableHead>
                      <TableHead className="text-slate-400">Nama</TableHead>
                      <TableHead className="text-slate-400">Role</TableHead>
                      <TableHead className="text-slate-400">Terdaftar</TableHead>
                      <TableHead className="text-slate-400 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-8">Tidak ada user ditemukan</TableCell></TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="text-slate-200 font-medium">{user.email}</TableCell>
                          <TableCell className="text-slate-300">{user.full_name || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}
                              className={user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}>
                              {user.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">{formatDate(user.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400" onClick={() => openEditUser(user)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400"
                                onClick={() => setShowDeleteConfirm({ type: 'user', id: user.id, name: user.email })}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <p className="text-sm text-slate-500">Total: {filteredUsers.length} user</p>
          </div>
        )}

        {/* ==================== CVS TAB ==================== */}
        {activeTab === 'cvs' && (
          <div className="space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Cari CV..."
                value={cvSearch}
                onChange={(e) => setCvSearch(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-700 text-slate-200"
              />
            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-400">Judul CV</TableHead>
                      <TableHead className="text-slate-400">Pemilik</TableHead>
                      <TableHead className="text-slate-400">Email</TableHead>
                      <TableHead className="text-slate-400">Dibuat</TableHead>
                      <TableHead className="text-slate-400">Diupdate</TableHead>
                      <TableHead className="text-slate-400 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCvs.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">Tidak ada CV ditemukan</TableCell></TableRow>
                    ) : (
                      filteredCvs.map((cv) => (
                        <TableRow key={cv.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="text-slate-200 font-medium">{cv.title || 'Untitled'}</TableCell>
                          <TableCell className="text-slate-300">{cv.user_name || '-'}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{cv.user_email}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{formatDate(cv.created_at)}</TableCell>
                          <TableCell className="text-slate-400 text-sm">{formatDate(cv.updated_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400"
                                onClick={() => navigate(`/editor?cv=${cv.id}`)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400"
                                onClick={() => setShowDeleteConfirm({ type: 'cv', id: cv.id, name: cv.title || 'Untitled' })}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <p className="text-sm text-slate-500">Total: {filteredCvs.length} CV</p>
          </div>
        )}

        {/* ==================== TEMPLATES TAB ==================== */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Cari template..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={() => setShowCreateTemplate(true)}>
                <Plus className="h-4 w-4 mr-2" /> Tambah Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className={`bg-slate-900 border-slate-800 ${!template.is_active ? 'opacity-60' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs border-slate-700">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={template.is_active}
                          onCheckedChange={() => handleToggleTemplate(template.id)}
                        />
                        <span className="text-sm text-slate-400">{template.is_active ? 'Aktif' : 'Nonaktif'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400" onClick={() => openEditTemplate(template)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400"
                          onClick={() => setShowDeleteConfirm({ type: 'template', id: template.id, name: template.name })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Slug: {template.slug} · Order: {template.sort_order}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-sm text-slate-500">Total: {filteredTemplates.length} template</p>
          </div>
        )}
      </main>

      {/* ==================== DIALOGS ==================== */}

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Tambah User Baru</DialogTitle>
            <DialogDescription>Buat akun pengguna baru untuk sistem</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-slate-300">Email</Label><Input value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" placeholder="user@email.com" /></div>
            <div><Label className="text-slate-300">Password</Label><Input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" placeholder="Min. 6 karakter" /></div>
            <div><Label className="text-slate-300">Nama Lengkap</Label><Input value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" placeholder="John Doe" /></div>
            <div>
              <Label className="text-slate-300">Role</Label>
              <Select value={newUser.role} onValueChange={v => setNewUser({...newUser, role: v})}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCreateUser(false)}>Batal</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateUser} disabled={submitting}>
              {submitting ? 'Membuat...' : 'Buat User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!showEditUser} onOpenChange={() => setShowEditUser(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User</DialogTitle>
            <DialogDescription>Ubah informasi pengguna {showEditUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-slate-300">Nama Lengkap</Label><Input value={editUserData.full_name} onChange={e => setEditUserData({...editUserData, full_name: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" /></div>
            <div><Label className="text-slate-300">Email</Label><Input value={editUserData.email} onChange={e => setEditUserData({...editUserData, email: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" /></div>
            <div>
              <Label className="text-slate-300">Role</Label>
              <Select value={editUserData.role} onValueChange={v => setEditUserData({...editUserData, role: v})}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-slate-300">Password Baru (opsional)</Label><Input type="password" value={editUserData.password} onChange={e => setEditUserData({...editUserData, password: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" placeholder="Kosongkan jika tidak diubah" /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEditUser(null)}>Batal</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdateUser} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Tambah Template Baru</DialogTitle>
            <DialogDescription>Buat template CV baru</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-slate-300">Nama Template</Label><Input value={newTemplate.name} onChange={e => setNewTemplate({...newTemplate, name: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" placeholder="Modern Pro" /></div>
            <div><Label className="text-slate-300">Slug</Label><Input value={newTemplate.slug} onChange={e => setNewTemplate({...newTemplate, slug: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" placeholder="modern-pro" /></div>
            <div><Label className="text-slate-300">Deskripsi</Label><Input value={newTemplate.description} onChange={e => setNewTemplate({...newTemplate, description: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" placeholder="Template CV modern..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Kategori</Label>
                <Select value={newTemplate.category} onValueChange={v => setNewTemplate({...newTemplate, category: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-slate-300">Urutan</Label><Input type="number" value={newTemplate.sort_order} onChange={e => setNewTemplate({...newTemplate, sort_order: parseInt(e.target.value) || 0})} className="bg-slate-800 border-slate-700 text-slate-200" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCreateTemplate(false)}>Batal</Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={handleCreateTemplate} disabled={submitting}>
              {submitting ? 'Membuat...' : 'Buat Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={!!showEditTemplate} onOpenChange={() => setShowEditTemplate(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Template</DialogTitle>
            <DialogDescription>Ubah template {showEditTemplate?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-slate-300">Nama</Label><Input value={editTemplateData.name} onChange={e => setEditTemplateData({...editTemplateData, name: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" /></div>
            <div><Label className="text-slate-300">Slug</Label><Input value={editTemplateData.slug} onChange={e => setEditTemplateData({...editTemplateData, slug: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" /></div>
            <div><Label className="text-slate-300">Deskripsi</Label><Input value={editTemplateData.description} onChange={e => setEditTemplateData({...editTemplateData, description: e.target.value})} className="bg-slate-800 border-slate-700 text-slate-200" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Kategori</Label>
                <Select value={editTemplateData.category} onValueChange={v => setEditTemplateData({...editTemplateData, category: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-slate-300">Urutan</Label><Input type="number" value={editTemplateData.sort_order} onChange={e => setEditTemplateData({...editTemplateData, sort_order: parseInt(e.target.value) || 0})} className="bg-slate-800 border-slate-700 text-slate-200" /></div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={editTemplateData.is_active} onCheckedChange={v => setEditTemplateData({...editTemplateData, is_active: v})} />
              <Label className="text-slate-300">Template Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEditTemplate(null)}>Batal</Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={handleUpdateTemplate} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong className="text-red-400">{showDeleteConfirm?.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)}>Batal</Button>
            <Button variant="destructive" onClick={() => {
              if (showDeleteConfirm?.type === 'user') handleDeleteUser(showDeleteConfirm.id);
              else if (showDeleteConfirm?.type === 'cv') handleDeleteCv(showDeleteConfirm.id);
              else if (showDeleteConfirm?.type === 'template') handleDeleteTemplate(showDeleteConfirm.id);
            }}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}