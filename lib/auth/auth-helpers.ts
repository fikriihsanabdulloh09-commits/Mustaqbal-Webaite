import { createClient } from '@/lib/supabase';

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Check if user is admin
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', data.user?.id)
    .maybeSingle();

  if (!adminUser) {
    await supabase.auth.signOut();
    throw new Error('User is not authorized as admin');
  }

  return { user: data.user, adminUser };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return { user, adminUser };
}

export async function checkAdminRole(requiredRole: 'admin' | 'editor' | 'viewer' = 'viewer') {
  const current = await getCurrentUser();

  if (!current?.adminUser) return false;

  const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };
  const userLevel = roleHierarchy[current.adminUser.role as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole];

  return userLevel >= requiredLevel;
}
