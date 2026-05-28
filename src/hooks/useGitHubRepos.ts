import { useEffect, useState } from 'react'
import projectsData from '../data/projects.json'
import siteData from '../data/site.json'
import { inferPreview } from '../lib/inferPreview'
import type { GitHubRepo, MergedProject, ProjectPreview } from '../types'

const FEATURED_SLUGS = projectsData.featured.map((p) => p.slug)

function mergeRepo(
  featured: (typeof projectsData.featured)[number],
  api?: GitHubRepo
): MergedProject {
  return {
    ...featured,
    preview: featured.preview as ProjectPreview | undefined,
    html_url: api?.html_url ?? `${siteData.githubUrl}/${featured.slug}`,
    stargazers_count: api?.stargazers_count ?? 0,
    language: api?.language ?? null,
    fromApi: Boolean(api),
  }
}

export function useGitHubRepos() {
  const [projects, setProjects] = useState<MergedProject[]>(() =>
    projectsData.featured.map((f) => mergeRepo(f))
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${siteData.github}/repos?sort=updated&per_page=100`
        )
        if (!res.ok) throw new Error(`GitHub API ${res.status}`)
        const repos: GitHubRepo[] = await res.json()
        if (cancelled) return

        const byName = new Map(repos.map((r) => [r.name, r]))
        const featured = FEATURED_SLUGS.map((slug) => {
          const meta = projectsData.featured.find((p) => p.slug === slug)!
          return mergeRepo(meta, byName.get(slug))
        })

        const featuredSet = new Set(FEATURED_SLUGS)
        const rest = repos
          .filter((r) => !featuredSet.has(r.name) && !r.name.startsWith('.'))
          .slice(0, 12)
          .map(
            (r): MergedProject => ({
              slug: r.name,
              name: r.name,
              description: r.description ?? 'No description provided.',
              tags: r.language ? [r.language] : [],
              featured: false,
              preview: inferPreview(r.language ? [r.language] : [], r.language, r.name),
              role: '',
              systems: [],
              summary: r.description ?? 'No description provided.',
              howItWorks: '',
              improvements: '',
              partsMade: [],
              html_url: r.html_url,
              stargazers_count: r.stargazers_count,
              language: r.language,
              fromApi: true,
            })
          )

        setProjects([...featured, ...rest])
        setError(null)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load repos')
          setProjects(projectsData.featured.map((f) => mergeRepo(f)))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { projects, loading, error }
}
