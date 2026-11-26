import { normalizeText, slugify } from "@/lib/slug";

/**
 * Топовые мировые артисты в порядке примерной глобальной популярности.
 * Используется для двух целей:
 *  1) Какие концерты подгружать из Ticketmaster (lib/ticketmaster).
 *  2) Карусель «Топовые мировые артисты сейчас в туре» на главной —
 *     порядок и состав берутся отсюда (отсекает трибьюты и случайные акты).
 *
 * Порядок ВАЖЕН: карусель показывает первых из этого списка, у кого есть
 * предстоящие концерты. Самые известные — в начале.
 */
export const TOP_WORLD_ARTISTS: string[] = [
  // Мегазвёзды
  "Taylor Swift", "The Weeknd", "Bad Bunny", "Drake", "Billie Eilish",
  "Coldplay", "Ed Sheeran", "Beyoncé", "Kendrick Lamar", "Dua Lipa",
  "Bruno Mars", "Harry Styles", "Travis Scott", "Post Malone", "Olivia Rodrigo",
  "SZA", "Lady Gaga", "Doja Cat", "Karol G", "Sabrina Carpenter",
  "Adele", "Metallica", "Rammstein", "Imagine Dragons", "Red Hot Chili Peppers", "Maroon 5",
  "BLACKPINK", "BTS", "Stray Kids", "TWICE", "SEVENTEEN", "ENHYPEN",
  "J Balvin", "Shakira", "Ariana Grande", "Justin Bieber", "Rihanna", "Linkin Park",
  // Очень популярные
  "Arctic Monkeys", "Foo Fighters", "Katy Perry", "Nicki Minaj", "Tyler, The Creator",
  "Pink", "Twenty One Pilots", "Green Day", "Muse", "Tame Impala",
  "Charli XCX", "Chappell Roan", "Tate McRae", "Peso Pluma", "Rosalía",
  "Shawn Mendes", "Lana Del Rey", "Sam Smith", "Camila Cabello", "Justin Timberlake",
  "Lorde", "Troye Sivan", "Cardi B", "Megan Thee Stallion", "21 Savage",
  "A$AP Rocky", "Frank Ocean", "Childish Gambino", "J. Cole", "Rauw Alejandro",
  // Рок / альтернатива / метал
  "Radiohead", "The Killers", "Hozier", "Pearl Jam", "The 1975",
  "Florence + The Machine", "Royal Blood", "Queens of the Stone Age", "The Smashing Pumpkins",
  "Pixies", "Interpol", "Placebo", "System of a Down", "Slipknot",
  "Iron Maiden", "Tool", "Avenged Sevenfold", "Ghost", "Gojira", "Bring Me The Horizon",
  // Электроника / танцевальное
  "Gorillaz", "Depeche Mode", "The Chemical Brothers", "Disclosure", "ODESZA",
  "Fred again..", "Calvin Harris", "David Guetta", "Swedish House Mafia", "Eric Prydz",
  "Bicep", "Boys Noize", "Justice", "The Prodigy", "Underworld",
  // Инди
  "The National", "Bon Iver", "Vampire Weekend", "Glass Animals", "alt-J",
  "Phoenix", "Two Door Cinema Club", "Foals", "LCD Soundsystem", "Caribou",
];

// slug → позиция в списке (для ранжирования карусели)
export const topArtistRank: Map<string, number> = new Map(
  TOP_WORLD_ARTISTS.map((name, i) => [slugify(name), i]),
);

// Основное имя для Ticketmaster и варианты для поиска по афише.
const cisAliases: Record<string, string[]> = {
  "Little Big": ["Литл Биг"],
  "AIGEL": ["АИГЕЛ"],
  "Bi-2": ["Би-2", "Bi2"],
  "Mumiy Troll": ["Мумий Тролль"],
  "Noize MC": ["Нойз МС", "Нойз МЦ"],
  "Monetochka": ["Монеточка"],
  "Oxxxymiron": ["Оксимирон"],
  "Max Korzh": ["Макс Корж", "Maks Korzh"],
  "Skryptonite": ["Скриптонит", "Scriptonite"],
  "Poshlaya Molly": ["Пошлая Молли", "Poshlaya Molli", "Poshlaia Molli"],
  "Kasta": ["Каста"],
  "Morgenshtern": ["Моргенштерн", "Alisher"],
  "Splean": ["Сплин"],
  "Mashina Vremeni": ["Машина времени"],
  "Aquarium": ["Аквариум"],
  "Ivan Dorn": ["Иван Дорн"],
  "Max Barskih": ["Макс Барских", "Max Barsky"],
  "Loboda": ["Лобода", "Светлана Лобода"],
  "Artem Pivovarov": ["Артём Пивоваров", "Артем Пивоваров"],
  "Okean Elzy": ["Океан Ельзи", "Океан Эльзы"],
};

export const TOP_CIS_ARTISTS = Object.keys(cisAliases);
const cisNames = new Map(
  Object.entries(cisAliases).flatMap(([name, aliases]) =>
    [name, ...aliases].map((alias): [string, string] => [slugify(alias), name]),
  ),
);

const cisArtistRank = new Map(
  [...new Set(["Max Korzh", "Morgenshtern", "Skryptonite", "Bi-2", "Noize MC", "Poshlaya Molly",
    "Monetochka", "Oxxxymiron", "Little Big", ...TOP_CIS_ARTISTS].map(canonicalArtistSlug))]
    .map((slug, index) => [slug, TOP_WORLD_ARTISTS.length + index]),
);

export function compareArtistPopularity(a: string, b: string): number {
  const rank = (slug: string) => topArtistRank.get(slug) ?? cisArtistRank.get(slug) ?? Number.MAX_SAFE_INTEGER;
  return rank(a) - rank(b);
}

export function canonicalArtistSlug(name: string): string {
  const slug = slugify(name);
  const canonical = cisNames.get(slug);
  return canonical ? slugify(canonical) : slug;
}

export function matchesArtist(name: string, slug: string, query: string): boolean {
  const canonical = cisNames.get(canonicalArtistSlug(slug));
  const aliases = canonical ? [canonical, ...cisAliases[canonical]] : [];
  return [name, ...aliases].some((term) => normalizeText(term).includes(query));
}
