import { slugify } from "@/lib/slug";

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
  "Adele", "Metallica", "Rammstein", "Imagine Dragons", "Red Hot Chili Peppers",
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
