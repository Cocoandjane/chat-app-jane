import React from 'react'

export default function EditChat() {
    return (
        <div className="w-48 text-sm font-medium text-gray-900 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <button type="button" class="py-2 px-4 w-full font-medium text-left border-b border-gray-200 cursor-pointer hover:rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                Archive chat
            </button>
            <button type="button" class="py-2 px-4 w-full font-medium text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                Delete chat
            </button>
            <button  disabled type="button" class="py-2 px-4 w-full font-medium text-left bg-gray-100 rounded-b-lg cursor-not-allowed dark:bg-gray-600 dark:text-gray-400">
                Mute notification
            </button>
            <button  disabled type="button" class="py-2 px-4 w-full font-medium text-left bg-gray-100 rounded-b-lg cursor-not-allowed dark:bg-gray-600 dark:text-gray-400">
                Pin chat
            </button>
            <button  disabled type="button" class="py-2 px-4 w-full font-medium text-left bg-gray-100 rounded-b-lg cursor-not-allowed dark:bg-gray-600 dark:text-gray-400">
               Mark as unread
            </button>
        </div>
    )
}
