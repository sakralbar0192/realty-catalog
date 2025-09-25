import { ref, computed, readonly } from 'vue'
import type { SortField, SortDirection } from '~/components/PropertyTable.vue'

export function useSorting() {
  const sortField = ref<SortField | null>(null)
  const sortDirection = ref<SortDirection>('asc')

  const currentSort = computed(() => ({
    field: sortField.value,
    direction: sortDirection.value,
  }))

  const isSortedBy = (field: SortField) => sortField.value === field

  const getSortDirection = (field: SortField): SortDirection | null => {
    return sortField.value === field ? sortDirection.value : null
  }

  const toggleSort = (field: SortField) => {
    if (sortField.value === field) {
      // Toggle direction if same field
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      // New field, start with ascending
      sortField.value = field
      sortDirection.value = 'asc'
    }
  }

  const setSort = (field: SortField | null, direction: SortDirection = 'asc') => {
    sortField.value = field
    sortDirection.value = direction
  }

  const clearSort = () => {
    sortField.value = null
    sortDirection.value = 'asc'
  }

  const getSortIcon = (field: SortField): string => {
    if (!isSortedBy(field)) {
      return 'chevron-up-down' // Neutral icon
    }
    return sortDirection.value === 'asc' ? 'arrow-up' : 'arrow-down'
  }

  const getAriaSort = (field: SortField): 'ascending' | 'descending' | undefined => {
    if (!isSortedBy(field)) {
      return undefined
    }
    return sortDirection.value === 'asc' ? 'ascending' : 'descending'
  }

  return {
    sortField: readonly(sortField),
    sortDirection: readonly(sortDirection),
    currentSort,
    isSortedBy,
    getSortDirection,
    toggleSort,
    setSort,
    clearSort,
    getSortIcon,
    getAriaSort,
  }
}
