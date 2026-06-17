/**
 * Real, simple European Portuguese passages the learner can load with one tap.
 * Chosen to show off the signature EP sounds (nasal ão, hushing final s, the
 * ghost vowel ɨ, uvular r) across everyday registers: a greeting, a café order,
 * a street sign, a proverb, and a children's rhyme.
 */

export interface ExamplePassage {
  /** Short label for the chip. */
  label: string
  /** The Portuguese text loaded into the reader. */
  text: string
  /** Plain-English gloss, shown as a subtle hint. */
  gloss: string
}

export const EXAMPLE_PASSAGES: ExamplePassage[] = [
  {
    label: 'Greeting',
    text: 'Olá! Bom dia. Como está?',
    gloss: 'Hello! Good morning. How are you?',
  },
  {
    label: 'Café',
    text: 'Um café e um pastel de nata, se faz favor.',
    gloss: 'A coffee and a custard tart, please.',
  },
  {
    label: 'Street sign',
    text: 'Empurre a porta. Saída de emergência.',
    gloss: 'Push the door. Emergency exit.',
  },
  {
    label: 'Proverb',
    text: 'Mais vale um pássaro na mão que dois a voar.',
    gloss: 'A bird in the hand is worth two in the bush.',
  },
  {
    label: 'Rhyme',
    text: 'O balão do João sobe, sobe pelo céu fora.',
    gloss: "João's balloon rises, rises up through the sky.",
  },
  {
    label: 'Tongue twister',
    text: 'O rato roeu a rolha da garrafa do rei da Rússia.',
    gloss: "The mouse gnawed the cork of the Russian king's bottle.",
  },
]
