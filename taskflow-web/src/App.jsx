import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const API_URL = `${API_BASE_URL}/api/Tasks`

const statusLabels = {
  0: 'Pendente',
  1: 'Em progresso',
  2: 'Concluído',
}

const statusClasses = {
  0: 'pending',
  1: 'progress',
  2: 'complete',
}

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const completedTasks = tasks.filter((task) => Number(task.status) === 2).length

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
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">TF</span>
          <div>
            <p className="eyebrow">Painel de execução</p>
            <h1>TaskFlow</h1>
          </div>
        </div>
        <div className="date-stamp">Hoje · foco no que importa</div>
      </header>

      <section className="overview" aria-label="Resumo das tarefas">
        <div>
          <p className="section-kicker">Visão geral</p>
          <h2>Organize o próximo movimento.</h2>
        </div>
        <div className="overview-stats">
          <div className="stat-item">
            <strong>{tasks.length}</strong>
            <span>Total</span>
          </div>
          <div className="stat-item accent-stat">
            <strong>{completedTasks}</strong>
            <span>Concluídas</span>
          </div>
        </div>
      </section>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-heading">
          <span className="form-icon" aria-hidden="true">+</span>
          <div>
            <p className="section-kicker">Nova tarefa</p>
            <h2>O que precisa acontecer?</h2>
          </div>
        </div>
        <div className="form-fields">
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
            <label htmlFor="description">Descrição <span>Opcional</span></label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Adicione uma nota curta"
            />
          </div>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Adicionar tarefa'}
        </button>
      </form>

      {error && <div className="error-box" role="alert">{error}</div>}

      <section className="task-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Seu espaço de trabalho</p>
            <h2>Minhas tarefas</h2>
          </div>
          <span className="task-count">{tasks.length} {tasks.length === 1 ? 'item' : 'itens'}</span>
        </div>

        {loading ? (
          <div className="empty-state loading-state"><span className="loader" />Carregando tarefas...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-mark" aria-hidden="true">—</span>
            <strong>Nenhuma tarefa por aqui.</strong>
            <p>Comece adicionando algo que você quer tirar do caminho.</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-content">
                  <div className="task-title-row">
                    <span className={`status-dot ${statusClasses[task.status]}`} />
                    <strong>{task.title}</strong>
                  </div>
                  <p>{task.description || 'Sem descrição.'}</p>
                </div>

                <div className="task-actions">
                  <label className={`status-select ${statusClasses[task.status]}`}>
                    <span className="sr-only">Status da tarefa</span>
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
                  </label>

                  <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                    Remover
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
