import React from 'react'
// Icones dos selos de confianca, mesmos caminhos (Tabler) que o componente Icon do
// site usa, para a previa do admin bater com a home. So o subconjunto curado em
// SELO_ICON_OPTIONS (home-model). Icone desconhecido nao renderiza (prevstandard).
const paths: Record<string, string> = {
  'building-factory-2': '<path d="M3 21h18" /> <path d="M5 21v-12l5 4v-4l5 4h4" /> <path d="M19 21v-8l-1.436 -9.574a.5 .5 0 0 0 -.495 -.426h-1.145a.5 .5 0 0 0 -.494 .418l-1.43 8.582" /> <path d="M9 17h1" /> <path d="M14 17h1" />',
  'package': '<path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /> <path d="M12 12l8 -4.5" /> <path d="M12 12l0 9" /> <path d="M12 12l-8 -4.5" /> <path d="M16 5.25l-8 4.5" />',
  'truck-delivery': '<path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /> <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /> <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /> <path d="M3 9l4 0" />',
  'certificate': '<path d="M15 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /> <path d="M13 17.5v4.5l2 -1.5l2 1.5v-4.5" /> <path d="M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -1 1.73" /> <path d="M6 9l12 0" /> <path d="M6 12l3 0" /> <path d="M6 15l2 0" />',
  'shield-check': '<path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" /> <path d="M15 19l2 2l4 -4" />',
  'award': '<path d="M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" /> <path d="M12 15l3.4 5.89l1.598 -3.233l3.598 .232l-3.4 -5.889" /> <path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889" />',
  'medal': '<path d="M12 4v3m-4 -3v6m8 -6v6" /> <path d="M12 18.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5z" />',
  'recycle': '<path d="M12 17l-2 2l2 2" /> <path d="M10 19h9a2 2 0 0 0 1.75 -2.75l-.55 -1" /> <path d="M8.536 11l-.732 -2.732l-2.732 .732" /> <path d="M7.804 8.268l-4.5 7.794a2 2 0 0 0 1.506 2.89l1.141 .024" /> <path d="M15.464 11l2.732 .732l.732 -2.732" /> <path d="M18.196 11.732l-4.5 -7.794a2 2 0 0 0 -3.256 -.14l-.591 .976" />',
  'leaf': '<path d="M5 21c.5 -4.5 2.5 -8 7 -10" /> <path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z" />',
  'clock': '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /> <path d="M12 7v5l3 3" />',
  'coin': '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" /> <path d="M12 7v10" />',
  'headset': '<path d="M4 14v-3a8 8 0 1 1 16 0v3" /> <path d="M18 19c0 1.657 -2.686 3 -6 3" /> <path d="M4 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z" /> <path d="M15 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z" />',
  'briefcase': '<path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /> <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /> <path d="M12 12l0 .01" /> <path d="M3 13a20 20 0 0 0 18 0" />',
  'check': '<path d="M5 12l5 5l10 -10" />',
}
export function HomeIcon({ name }: { name: string }) {
  const value = paths[name]
  return value ? <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: value }} /> : null
}
