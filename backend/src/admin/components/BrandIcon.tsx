import React from 'react'

/**
 * Marca compacta BB no topo do painel (admin.components.graphics.Icon).
 * O slot do Icon e pequeno/quadrado, entao o logo largo de 2 bolinhas era
 * cortado. Aqui vai um "B" unico num circulo verde profundo (favicon-style),
 * que encaixa em qualquer tamanho. O logo completo "BB Brindes" fica no Logo
 * (tela de login), que tem espaco.
 */
export default function BrandIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="BB Brindes"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#004431" />
      <text
        x="12"
        y="16.8"
        textAnchor="middle"
        fontFamily="Poppins, Arial, sans-serif"
        fontSize="15"
        fontWeight="700"
        fill="#ffffff"
      >
        B
      </text>
    </svg>
  )
}
