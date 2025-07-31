'use client'

import { useEffect, useState } from 'react'
import {
  Container, TextField, Button, List, ListItem,
  ListItemText, Checkbox, IconButton, Typography, CircularProgress
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editedTitle, setEditedTitle] = useState('')

  const fetchTodos = async () => {
    const res = await axios.get('/api/todos')
    setTodos(res.data)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      await axios.post('/api/todos', { title })
      setTitle('')
      await fetchTodos()
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (id, completed) => {
    await axios.patch(`/api/todos/${id}`, { completed: !completed })
    fetchTodos()
  }

  const deleteTodo = async (id) => {
    await axios.delete(`/api/todos/${id}`)
    fetchTodos()
  }

  const startEditing = (id, currentTitle) => {
    setEditingId(id)
    setEditedTitle(currentTitle)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditedTitle('')
  }

  const saveEdit = async (id) => {
    if (!editedTitle.trim()) return
    await axios.patch(`/api/todos/${id}`, { title: editedTitle })
    setEditingId(null)
    setEditedTitle('')
    fetchTodos()
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5, color: 'black' }}>
      <Typography variant="h4" gutterBottom align="center">
        Todo List
      </Typography>

      <TextField
        fullWidth
        label="New Todo"
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={addTodo}
        sx={{ bgcolor: 'black', height: '40px' }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add'}
      </Button>

      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{ gap: 1 }}
            secondaryAction={
              <>
                {editingId === todo.id ? (
                  <>
                    <Button size="small" variant='contained' onClick={() => saveEdit(todo.id)}>Save</Button>
                    <Button size="small" variant='contained' sx={{ml:1}} color="error" onClick={cancelEditing}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button size="small" variant='contained' onClick={() => startEditing(todo.id, todo.title)}>Edit</Button>
                    <IconButton edge="end" onClick={() => deleteTodo(todo.id)}>
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  </>
                )}
              </>
            }
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
            />
            {editingId === todo.id ? (
              <TextField
                size="small"
                sx={{width:'300px'}}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                fullWidth
              />
            ) : (
              <ListItemText primary={todo.title} />
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  )
}
