import type { DocumentViewClientProps, DocumentViewServerProps, ListViewClientProps, ListViewServerProps } from 'payload'
const LIST_KEYS = ['AfterList', 'AfterListTable', 'BeforeList', 'BeforeListTable', 'Description', 'listMenuItems', 'Table', 'beforeActions', 'collectionSlug', 'columnState', 'disableBulkDelete', 'disableBulkEdit', 'disableQueryPresets', 'enableRowSelections', 'hasCreatePermission', 'hasDeletePermission', 'hasTrashPermission', 'listPreferences', 'newDocumentURL', 'preferenceKey', 'queryPreset', 'queryPresetPermissions', 'renderedFilters', 'resolvedFilterOptions', 'viewType'] as const satisfies readonly (keyof ListViewClientProps)[]
const EDIT_KEYS = ['BeforeDocumentControls', 'Description', 'EditMenuItems', 'LivePreview', 'PreviewButton', 'PublishButton', 'SaveButton', 'SaveDraftButton', 'Status', 'UnpublishButton', 'Upload', 'UploadControls', 'documentSubViewType', 'formState', 'viewType'] as const satisfies readonly (keyof DocumentViewClientProps)[]
function clientProps<T, K extends keyof T>(props: T, keys: readonly K[]): Pick<T, K> {
  return Object.fromEntries(keys.map(key => [key, props[key]])) as Pick<T, K>
}
// Somente props cliente sao serializadas; req, payload, user e permissoes ficam no servidor.
export function nativeListProps(props: ListViewServerProps): ListViewClientProps { return clientProps(props, LIST_KEYS) }
export function nativeEditProps(props: DocumentViewServerProps): DocumentViewClientProps { return clientProps(props, EDIT_KEYS) }
