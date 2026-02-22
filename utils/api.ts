import { supabase } from './supabase';

export const api = {
  // ─── Categories ───────────────────────────────────────────────
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  async createCategory(cat: { name: string; icon?: string; color?: string }) {
    const { data, error } = await supabase
      .from('categories')
      .insert(cat)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, cat: { name?: string; icon?: string; color?: string }) {
    const { data, error } = await supabase
      .from('categories')
      .update(cat)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },

  // ─── Courses ──────────────────────────────────────────────────
  async getCourses(categoryId?: string) {
    let query = supabase
      .from('courses')
      .select('*, categories(name, color, icon)')
      .order('created_at', { ascending: false });
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getCourseById(id: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*, categories(name, color, icon)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createCourse(course: {
    name: string;
    category_id: string;
    category?: string;
    sub_category?: string;
    duration?: string;
    eligibility?: string;
    fees?: string;
    entrance_exam?: string;
    location?: string;
    provider?: string;
    course_link?: string;
    image_url?: string;
  }) {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCourse(id: string, course: any) {
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCourse(id: string) {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;
  },

  // ─── Saved Courses ────────────────────────────────────────────
  async getSavedCourses(userId: string) {
    const { data, error } = await supabase
      .from('saved_courses')
      .select('*, courses(*, categories(name, color, icon))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async saveCourse(userId: string, courseId: string) {
    const { error } = await supabase
      .from('saved_courses')
      .insert({ user_id: userId, course_id: courseId });
    if (error) throw error;
  },

  async unsaveCourse(userId: string, courseId: string) {
    const { error } = await supabase
      .from('saved_courses')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);
    if (error) throw error;
  },

  async isCourseSaved(userId: string, courseId: string) {
    const { data } = await supabase
      .from('saved_courses')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();
    return !!data;
  },

  // ─── Admin Roles ──────────────────────────────────────────────
  async isAdmin(userId: string) {
    const { data } = await supabase
      .from('admin_roles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    return !!data;
  },

  // ─── Profiles ─────────────────────────────────────────────────
  async getProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return data;
  },

  async upsertProfile(userId: string, fullName: string) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, full_name: fullName });
    if (error) throw error;
  },
};
