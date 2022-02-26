import { useState, useEffect, useMemo } from 'react'
import { AssignmentDetail, AssignmentItem, Actions } from '@/components'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useAuthContext } from '@/contexts/AuthContext'
import {
  List,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  TextField,
  InputAdornment,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRouter } from 'next/router'
import styles from '@/styles/Assignments.module.scss'
import { destroyCookie } from 'nookies'
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridFilterModel,
  GridSortModel,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import Search from '@mui/icons-material/Search'
import Assignment from '@/types/Assignment'
import FilterAlt from '@mui/icons-material/FilterAlt'

export default function Assignments() {
  const router = useRouter()

  const titre: string = 'Assignments'

  const { assignments, loading, nbPages, page, setPage, deleteAssignment } =
    useAssignmentsContext()
  const { username } = useAuthContext()
  const defaultSelected = router.query.id ? router.query.id.toString() : null
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

  useEffect(() => {
    updateUrl()
  }, [page, selectedId])

  function updateUrl() {
    const url = new URL(window.location.href)

    if (selectedId !== null) url.searchParams.set('id', selectedId)
    else url.searchParams.delete('id')
    if (page !== null) {
      if (page === 0) url.searchParams.delete('page')
      else url.searchParams.set('page', page.toString())
    }

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

  function filterChange(model: GridFilterModel) {
    console.log(model)
  }

  const [sortModel, setSortModel] = useState<GridSortModel>([])

  useEffect(() => {
    console.log(sortModel)
  }, [sortModel])

  return (
    <div className={`${styles.Assignments} ${loading ? styles.loading : ''}`}>
      <AssignmentDetail
        assignmentId={selectedId}
        setSelectedId={setSelectedId}
        open={openModale}
        setModal={setOpenModale}
      />

      <div className={styles.head}>
        <h1>{titre}</h1>
        <div>
          {username}
          <IconButton
            color="error"
            onClick={() => {
              destroyCookie(null, 'user')
              location.reload()
            }}
          >
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
      <Actions />

      <div className={styles.overlay} data-overlay>
        {/* <List className={styles.list}>
          {assignments.map((assignment, index) => (
            <AssignmentItem
              key={index}
              assignment={assignment}
              changeSelected={changeSelected}
            />
          ))}
        </List> */}
        <TextField
          label="Recherche"
          variant="filled"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <IconButton>
                    <FilterAlt />
                  </IconButton>
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
              '.MuiDataGrid-row:last-child > DIV': {
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
            sortModel={sortModel}
            onSortModelChange={(model: GridSortModel) => setSortModel(model)}
            onFilterModelChange={(model: GridFilterModel) =>
              filterChange(model)
            }
            onPageChange={(p: number) => setPage(p)}
            loading={loading}
            
          />
        </div>
      </div>

      <Dialog open={deleting} onClose={() => setDeleting(false)}>
        <DialogTitle>Suppression: {deletingAssignment?.nom}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet assignement ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(false)}>Annuler</Button>
          <Button onClick={() => remove()} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
