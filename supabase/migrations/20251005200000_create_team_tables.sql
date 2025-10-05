-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  lead_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Departments policies
CREATE POLICY "Users can view departments"
  ON public.departments FOR SELECT
  USING (true);

CREATE POLICY "Users can create departments"
  ON public.departments FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their departments"
  ON public.departments FOR UPDATE
  USING (auth.uid() = created_by OR auth.uid() = lead_id);

CREATE POLICY "Users can delete their departments"
  ON public.departments FOR DELETE
  USING (auth.uid() = created_by OR auth.uid() = lead_id);

-- Create roles table
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  permissions JSONB,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Roles policies
CREATE POLICY "Users can view roles"
  ON public.roles FOR SELECT
  USING (true);

CREATE POLICY "Users can create roles"
  ON public.roles FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their roles"
  ON public.roles FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their roles"
  ON public.roles FOR DELETE
  USING (auth.uid() = created_by);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'removed')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, department_id)
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team members policies
CREATE POLICY "Users can view team members"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Users can create team members"
  ON public.team_members FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update team members"
  ON public.team_members FOR UPDATE
  USING (auth.uid() = created_by OR auth.uid() = user_id);

CREATE POLICY "Users can delete team members"
  ON public.team_members FOR DELETE
  USING (auth.uid() = created_by OR auth.uid() = user_id);

-- Add updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system roles
INSERT INTO public.roles (id, name, description, is_system_role, permissions) VALUES
('00000000-0000-0000-0000-000000000001', 'Owner', 'Full access, billing, delete workspace', true, '{
  "meetings": {"create": true, "edit": true, "delete": true, "view": true},
  "recordings": {"access": true, "download": true, "delete": true},
  "ai": {"use": true, "view": true},
  "analytics": {"view": true, "export": true},
  "team": {"invite": true, "remove": true, "edit": true},
  "billing": {"view": true, "edit": true}
}'),
('00000000-0000-0000-0000-000000000002', 'Admin', 'Manage members, settings, all meetings', true, '{
  "meetings": {"create": true, "edit": true, "delete": true, "view": true},
  "recordings": {"access": true, "download": true, "delete": true},
  "ai": {"use": true, "view": true},
  "analytics": {"view": true, "export": true},
  "team": {"invite": true, "remove": true, "edit": true},
  "billing": {"view": false, "edit": false}
}'),
('00000000-0000-0000-0000-000000000003', 'Manager', 'Manage team meetings, view reports', true, '{
  "meetings": {"create": true, "edit": true, "delete": false, "view": true},
  "recordings": {"access": true, "download": true, "delete": false},
  "ai": {"use": true, "view": true},
  "analytics": {"view": true, "export": false},
  "team": {"invite": true, "remove": false, "edit": false},
  "billing": {"view": false, "edit": false}
}'),
('00000000-0000-0000-0000-000000000004', 'Member', 'Create meetings, basic features', true, '{
  "meetings": {"create": true, "edit": true, "delete": false, "view": true},
  "recordings": {"access": true, "download": false, "delete": false},
  "ai": {"use": true, "view": false},
  "analytics": {"view": false, "export": false},
  "team": {"invite": false, "remove": false, "edit": false},
  "billing": {"view": false, "edit": false}
}'),
('00000000-0000-0000-0000-000000000005', 'Guest', 'View-only, limited meeting access', true, '{
  "meetings": {"create": false, "edit": false, "delete": false, "view": true},
  "recordings": {"access": false, "download": false, "delete": false},
  "ai": {"use": false, "view": false},
  "analytics": {"view": false, "export": false},
  "team": {"invite": false, "remove": false, "edit": false},
  "billing": {"view": false, "edit": false}
}');