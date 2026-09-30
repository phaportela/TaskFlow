import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const API_URL = `${API_BASE_URL}/api/Tasks`

const statusLabels = {
  0: 'Pendente',
  1: 'Em progresso',
  2: 'Concluído',
}

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadTasks = async () => {
    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Não foi possível carregar as tarefas.')
      }

      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadInitialTasks = async () => {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Não foi possível carregar as tarefas.')
        }

        const data = await response.json()
        setTasks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadInitialTasks()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('O título é obrigatório.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Erro ao criar tarefa.')
      }

      setTitle('')
      setDescription('')
      await loadTasks()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (task, nextStatus) => {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: Number(nextStatus),
        }),
      })

      if (!response.ok) {
        throw new Error('Não foi possível atualizar a tarefa.')
      }

      await loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Não foi possível remover a tarefa.')
      }

      await loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>TaskFlow</h1>
      </header>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="title">Título</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Estudar C#"
          />
        </div>

        <div className="field-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descreva a tarefa"
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Adicionar tarefa'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}

      <section className="task-section">
        <h2>Minhas tarefas</h2>

        {loading ? (
          <p>Carregando tarefas...</p>
        ) : tasks.length === 0 ? (
          <p>Nenhuma tarefa cadastrada.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-content">
                  <strong>{task.title}</strong>
                  <p>{task.description || 'Sem descrição.'}</p>
                </div>

                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(event) => handleStatusChange(task, event.target.value)}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default App
