import timelineData from '../../data/timeline.json'
import type { TimelineEntry } from '../../types'

const entries = timelineData.entries as TimelineEntry[]

export function Timeline() {
  return (
    <ol className="timeline">
      {entries.map((entry) => (
        <li key={`${entry.year}-${entry.title}`} className="timeline__item">
          <span className="timeline__year">{entry.year}</span>
          <h4 className="timeline__title">{entry.title}</h4>
          <p className="timeline__subtitle">{entry.subtitle}</p>
          <p className="panel-lead">{entry.description}</p>
        </li>
      ))}
    </ol>
  )
}
