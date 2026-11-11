/*
 * All of the site's content lives here: intro, places, roles, projects and skills.
 *
 * Every fact comes from Lorenzo. A field he hasn't supplied yet is a `placeholder(...)`
 * describing what is needed; it renders visibly as a placeholder (see Fact.tsx), so
 * nothing invented reaches the site. Replace placeholders only with facts Lorenzo gives.
 */

/** A missing fact. `needs` says what Lorenzo still has to supply. */
export type Placeholder = { readonly kind: 'placeholder'; readonly needs: string }

/** Text shown on the site: either a fact from Lorenzo or a placeholder for one. */
export type Text = string | Placeholder

export function placeholder(needs: string): Placeholder {
  return { kind: 'placeholder', needs }
}

export function isPlaceholder(value: unknown): value is Placeholder {
  return typeof value === 'object' && value !== null && (value as Placeholder).kind === 'placeholder'
}

export type Intro = {
  name: Text
  oneLine: Text
  more: Text
  photo?: string
}

export type Place = {
  id: string
  city: Text
  country: Text
  years: Text
  /** Where to point the globe. `null` until Lorenzo confirms the place. */
  coords: [lon: number, lat: number] | null
  /** Roles and projects from this time, by id, so each fact is written once. */
  items: Array<{ roleId: string } | { projectId: string }>
}

export type Role = {
  id: string
  org: Text
  title: Text
  years: Text
}

export type Project = {
  id: string
  /** Stable route name: the project lives at `/projects/<slug>`. Don't change it when rewording the name. */
  slug: string
  name: Text
  oneLine: Text
  story: Text
  tech: Text[]
  links: Array<{ label: Text; url: string }>
  image?: string
  /** Used to list projects newest first. */
  date: Text
}

/** Skills grouped by kind, for example languages, tools and spoken languages. */
export type SkillGroup = {
  kind: Text
  skills: Text[]
}

export type Content = {
  intro: Intro
  places: Place[]
  roles: Role[]
  projects: Project[]
  skills: SkillGroup[]
}

export const content: Content = {
  intro: {
    name: placeholder('name'),
    oneLine: placeholder('one-line description'),
    more: placeholder('one or two more sentences about Lorenzo'),
  },
  places: [
    {
      id: 'placeholder-place',
      city: placeholder('city'),
      country: placeholder('country'),
      years: placeholder('years lived there'),
      coords: null,
      items: [{ roleId: 'placeholder-role' }, { projectId: 'placeholder-project' }],
    },
  ],
  roles: [
    {
      id: 'placeholder-role',
      org: placeholder('organisation'),
      title: placeholder('role title'),
      years: placeholder('years'),
    },
  ],
  projects: [
    {
      id: 'placeholder-project',
      slug: 'placeholder-project',
      name: placeholder('project name'),
      oneLine: placeholder('one-line description'),
      story: placeholder('what it did and why it mattered'),
      tech: [placeholder('tech used')],
      links: [],
      date: placeholder('date'),
    },
  ],
  skills: [
    {
      kind: placeholder('kind of skill, e.g. languages'),
      skills: [placeholder('skill')],
    },
  ],
}

export function findProject(slug: string): Project | undefined {
  return content.projects.find((project) => project.slug === slug)
}
