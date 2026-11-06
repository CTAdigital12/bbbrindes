import React from 'react'

/**
 * Logo BB Brindes para a tela de login (admin.components.graphics.Logo).
 * Marca (duas bolinhas encostadas) + wordmark "BB Brindes" no verde profundo.
 */
export default function BrandLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg
        width="72"
        height="36"
        viewBox="0 0 48 24"
        role="img"
        aria-label="BB Brindes"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#004431" />
        <circle cx="36" cy="12" r="12" fill="#51ad46" />
        <text
          x="12"
          y="16.6"
          textAnchor="middle"
          fontFamily="Poppins, Arial, sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="#ffffff"
        >
          B
        </text>
        <text
          x="36"
          y="16.6"
          textAnchor="middle"
          fontFamily="Poppins, Arial, sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="#ffffff"
        >
          B
        </text>
      </svg>
      <span
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: '#004431',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        BB Brindes
      </span>
    </div>
  )
}
