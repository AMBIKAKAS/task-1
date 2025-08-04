import { useEffect, useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import DarkModeToggle from './components/DarkModeToggle'

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=6')
      .then(res => res.json())
      .then(data => {
        const withDescriptions = data.map(todo => ({
          ...todo,
          description: 'Sample description',
        }))
        setTodos(withDescriptions)
      })
  }, [])

  const handleAddOrUpdate = () => {
    if (!title.trim()) return
    if (editId) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === editId ? { ...todo, title, description } : todo
        )
      )
      setEditId(null)
    } else {
      const newTodo = {
        id: Date.now(),
        title,
        description,
      }
      setTodos([newTodo, ...todos])
    }

    setTitle('')
    setDescription('')
  }

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleEdit = (id) => {
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
      setEditId(id)
      setTitle(todo.title)
      setDescription(todo.description)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-repeat dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="w-full px-4 py-8 lg:px-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow">
            ToDo Do App
          </h1>
          <DarkModeToggle />
        </div>

        <p className="text-md text-gray-700 dark:text-gray-300 mb-6">
          Organize your tasks efficiently — built with React + Tailwind + API
        </p>

        <TodoForm
          title={title}
          description={description}
          setTitle={setTitle}
          setDescription={setDescription}
          handleAddOrUpdate={handleAddOrUpdate}
          isEditing={!!editId}
        />

        <TodoList todos={todos} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
    </div>
  )
}
