import { slugify } from "@/lib/slug";
import type { Concert } from "@/types";

function eventKey(concert: Concert): string {
  const venue = slugify(concert.venue);
  if (!venue) return "";
  return [concert.artist.slug, concert.countryCode, concert.date, concert.dateEnd ?? "", venue].join("|");
}

export function mergeConcertSources(live: Concert[], curated: Concert[]): Concert[] {
  const imported = new Map<string, Concert[]>();
  for (const concert of live) {
    const key = eventKey(concert);
    if (!key) continue;
    const matches = imported.get(key);
    if (matches) matches.push(concert);
    else imported.set(key, [concert]);
  }

  const additional = curated.filter((concert) => {
    const matches = imported.get(eventKey(concert)) ?? [];
    return matches.length !== 1
      || (concert.time && matches[0].time && concert.time.slice(0, 5) !== matches[0].time.slice(0, 5));
  });
  return [...live, ...additional];
}
