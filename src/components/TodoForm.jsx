export default function TodoForm({
  title,
  description,
  setTitle,
  setDescription,
  handleAddOrUpdate,
  isEditing
}) {
  return (
    <div className="mb-8 flex flex-col items-center">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-3 rounded bg-gray-100 dark:bg-gray-800 text-black-900 dark:text-white border border-gray-300 dark:border-gray-700"
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 mb-3 rounded bg-gray-100 dark:bg-gray-800 text-black-900 dark:text-white border border-gray-300 dark:border-gray-700"
      />
      <button
        onClick={handleAddOrUpdate}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isEditing ? 'Update Task' : 'Add Task'}
      </button>
    </div>
  )
}
