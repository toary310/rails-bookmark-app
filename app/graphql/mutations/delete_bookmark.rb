# frozen_string_literal: true

module Mutations
  class DeleteBookmark < BaseMutation
    argument :id, ID, required: true

    field :deleted_id, ID, null: true
    field :errors, [String], null: true

    def resolve(id:)
      bookmark = Bookmark.find_by(id: id)

      unless bookmark
        return { deleted_id: nil, errors: ['Bookmark not found'] }
      end

      if bookmark.destroy
        { deleted_id: id, errors: [] }
      else
        # Normally, destroy shouldn't fail and populate errors unless there are callbacks preventing it.
        # However, it's good practice to handle potential failures.
        { deleted_id: nil, errors: bookmark.errors.full_messages.presence || ['Failed to delete bookmark'] }
      end
    end
  end
end
