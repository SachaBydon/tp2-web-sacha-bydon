import { useState, useEffect, ChangeEvent } from 'react'
import { AssignmentDetail, Actions } from '@/components'
import { Filter, useAssignmentsContext } from '@/contexts/AssignmentsContext'
import {
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Badge,
} from '@mui/material'
import { useRouter } from 'next/router'
import styles from '@/styles/Assignments.module.scss'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'

import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import Search from '@mui/icons-material/Search'
import Assignment from '@/types/Assignment'
import FilterAlt from '@mui/icons-material/FilterAlt'
import { Close } from '@mui/icons-material'
import TopBar from './TopBar'
import DeleteModal from './DeleteModal'

export default function Assignments() {
  const router = useRouter()

  const {
    assignments,
    loading,
    nbPages,
    page,
    setPage,
    deleteAssignment,
    filters,
    setFilters,
  } = useAssignmentsContext()

  const defaultSelected = router.query.id?.toString() ?? null
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelected)
  const [openModale, setOpenModale] = useState<boolean>(
    defaultSelected !== null
  )

  const [deleting, setDeleting] = useState(false)
  const [deletingAssignment, setDeletingAssignment] =
    useState<Assignment | null>(null)

  function changeSelected(id: string | null) {
    setSelectedId(id)
    setOpenModale(true)
  }

  function viewBtn(props: any) {
    return (
      <div style={{ display: 'flex', gap: 16, paddingRight: 16 }}>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => changeSelected(props.id)}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => {
            const a = assignments.find((a) => a._id === props.id)
            if (a) {
              setDeletingAssignment(a)
              setDeleting(true)
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'nom',
      headerName: 'Nom',
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: 'dateDeRendu',
      headerName: 'Date de rendu',
      type: 'date',
      width: 150,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'rendu',
      headerName: 'Rendu',
      type: 'boolean',
      width: 75,
      headerAlign: 'left',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'actions',
      headerName: '',
      renderCell: viewBtn,
      hideSortIcons: true,
      disableColumnMenu: true,
      flex: 1,
      align: 'right',
    },
  ]

  function updateUrl(filters: Filter) {

    const url = new URL(window.location.href)

    if (filters.text.length) url.searchParams.set('text', filters.text)
    else url.searchParams.delete('text')

    if (filters.rendu !== 'none') url.searchParams.set('rendu', filters.rendu)
    else url.searchParams.delete('rendu')

    if (filters.sort.length) {
      const { field, sort } = filters.sort[0]
      url.searchParams.set('sort', `${field}-${sort}`)
    } else url.searchParams.delete('sort')

    if (page !== 0) url.searchParams.set('page', page.toString())
    else url.searchParams.delete('page')

    if (selectedId !== null) url.searchParams.set('id', selectedId)
    else url.searchParams.delete('id')

    const query =
      url.searchParams.toString() !== ''
        ? '/?' + url.searchParams.toString()
        : '/'
    window.history.pushState({ path: query }, '', query)
  }

  async function remove() {
    if (deletingAssignment?._id) {
      console.log('loading ...')
      setDeleting(false)
      await deleteAssignment(deletingAssignment._id)
      console.log('deleted !!!')
      setDeleting(false)
      setDeletingAssignment(null)
    }
  }

  function onFiltersChange(filters: Filter) {
    console.log('filters', filters)
    updateUrl(filters)
  }
  useEffect(() => {
    updateUrl(filters)
  }, [page, selectedId])

  const [filterOpen, setFilterOpen] = useState(false)

  let handler: NodeJS.Timeout | null = null
  function onDebounceSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    if (handler) clearTimeout(handler)
    handler = setTimeout(() => {
      setFilters({ ...filters, text: value })
      onFiltersChange({ ...filters, text: value })
    }, 800)
  }

  return (
    <div className={`${styles.Assignments} ${loading ? styles.loading : ''}`}>
      <AssignmentDetail
        assignmentId={selectedId}
        setSelectedId={setSelectedId}
        open={openModale}
        setModal={setOpenModale}
      />

      <div className={styles.head}>
        <h1>Assignments</h1>
        <TopBar />
      </div>
      <Actions />

      <div className={styles.overlay} data-overlay>
        <TextField
          label="Recherche"
          variant="filled"
          fullWidth
          defaultValue={(router.query.text as string) ?? ''}
          onChange={onDebounceSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <IconButton onClick={() => setFilterOpen((b) => !b)}>
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={filters.rendu === 'none'}
                    >
                      <FilterAlt />
                    </Badge>
                  </IconButton>
                  <div
                    style={{
                      position: 'absolute',
                      height: '55px',
                      // width: '200px',
                      backgroundColor: 'rgb(43 65 92)',
                      top: '56px',
                      right: 0,
                      display: filterOpen ? 'flex' : 'none',
                      zIndex: 100,
                      alignItems: 'center',
                      padding: '8px',
                    }}
                  >
                    <IconButton
                      onClick={() => setFilterOpen(false)}
                      sx={{ mr: '8px' }}
                    >
                      <Close />
                    </IconButton>
                    Rendu :
                    <FormControl
                      variant="standard"
                      sx={{ ml: '8px', minWidth: 120 }}
                    >
                      <Select
                        label="Age"
                        value={filters.rendu}
                        onChange={(e) => {
                          const rendu = e.target.value as
                            | 'none'
                            | 'true'
                            | 'false'
                          setFilters({ ...filters, rendu })
                          onFiltersChange({ ...filters, rendu })
                        }}
                      >
                        <MenuItem value="none"> </MenuItem>
                        <MenuItem value="true">Oui</MenuItem>
                        <MenuItem value="false">Non</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <Search />
                </div>
              </InputAdornment>
            ),
          }}
        />
        <div style={{ height: 'calc(100vh - 280px)', width: '100%' }}>
          <DataGrid
            rows={assignments}
            columns={columns}
            page={assignments.length ? page : 0}
            initialState={{
              pagination: {
                pageSize: 20,
              },
            }}
            rowCount={nbPages * 20}
            rowsPerPageOptions={[20]}
            disableSelectionOnClick
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.09)',
              border: 'none',
              '.MuiDataGrid-cell, .MuiDataGrid-columnHeader': {
                outline: 'none!important',
              },
              '.MuiDataGrid-booleanCell[data-value="true"]': {
                color: 'green!important',
              },
              '.MuiDataGrid-booleanCell[data-value="false"]': {
                color: 'red!important',
              },
              'div:last-child > .MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '.MuiDataGrid-footerContainer': {
                borderTop: '1px solid rgba(81, 81, 81, 1)',
              },
              '.MuiDataGrid-row:last-child > div': {
                border: 'none',
              },
              '.MuiDataGrid-columnHeaders': {
                userSelect: 'none',
              },
            }}
            getRowId={(a) => a._id}
            paginationMode="server"
            filterMode="server"
            sortingMode="server"
            sortModel={filters.sort}
            onSortModelChange={(model: GridSortModel) => {
              setFilters({ ...filters, sort: model })
              onFiltersChange({ ...filters, sort: model })
            }}
            onPageChange={(p: number) => setPage(p)}
            loading={loading}
          />
        </div>
      </div>

      <DeleteModal
        deleting={deleting}
        setDeleting={setDeleting}
        deletingAssignment={deletingAssignment}
        remove={remove}
      />
    </div>
  )
}
