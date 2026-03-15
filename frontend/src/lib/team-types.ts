export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  linkedin_url?: string | null;
  github_url?: string | null;
};
