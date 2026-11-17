import React from 'react'

// Aviso de modo somente-leitura. Aparece quando o usuario nao tem permissao de
// escrita na tela (canSave=false, calculado a partir do access control real da
// colecao/global: um visualizador nao cria nem edita). Os campos e botoes ja vem
// desabilitados pelo mesmo canSave; este aviso so explica o porque.
export function ReadOnlyNotice({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <p className="bb-readonly" role="status">
      Você está no modo somente leitura. Seu perfil (visualizador) pode consultar, mas não salvar alterações.
    </p>
  )
}
