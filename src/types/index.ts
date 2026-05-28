export type ContactChannel = 'linkedin' | 'github' | 'email'

export type ProjectPreview = 'vr' | 'jam' | 'systems' | 'prototype' | 'narrative'

export interface SiteData {
  displayName: string
  legalName: string
  tagline: string
  email: string
  github: string
  githubUrl: string
  linkedin: string
  bio: string
  codingLanguages: string[]
  gameEngines: string[]
  resumePdf: string
  contactPrimary: ContactChannel[]
}

export interface MenuItemData {
  id: string
  label: string
  route: string
  cyan: 1 | 2 | 3
  offsetX: number
  offsetY: number
  rotate: number
  actionHint: string
  confirmHint: string
}

export interface MenuData {
  items: MenuItemData[]
}

export interface ProjectDetailFields {
  role: string
  systems: string[]
  summary: string
  howItWorks: string
  improvements: string
  partsMade: string[]
}

export interface FeaturedProject extends ProjectDetailFields {
  slug: string
  name: string
  description: string
  tags: string[]
  featured: boolean
  preview?: ProjectPreview
}

export interface ProjectsData {
  featured: FeaturedProject[]
}

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  topics?: string[]
  homepage: string | null
}

export interface MergedProject extends FeaturedProject {
  html_url: string
  stargazers_count: number
  language: string | null
  fromApi: boolean
}

export interface TimelineEntry {
  year: string
  title: string
  subtitle: string
  description: string
}

export interface GalleryItem {
  id: string
  title: string
  src: string
  alt: string
}

export interface SkillGroup {
  name: string
  skills: { name: string; level: number }[]
}

export interface SkillsData {
  groups: SkillGroup[]
}

export type RouteBackdropKey =
  | '/'
  | '/projects'
  | '/resume'
  | '/contact'
