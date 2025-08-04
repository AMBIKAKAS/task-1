export default function TodoList({ todos, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 shadow-md"
        >
          <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
            {todo.title}
          </h2>
          <p className="text-sm text-gray-800 dark:text-gray-300 mb-3">
            {todo.description}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(todo.id)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
