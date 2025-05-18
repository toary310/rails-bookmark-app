# frozen_string_literal: true

module Mutations
  class UpdateBookmark < BaseMutation
    argument :id, ID, required: true
    argument :url, String, required: false
    argument :title, String, required: false
    argument :notes, String, required: false

    field :bookmark, Types::BookmarkType, null: true
    field :errors, [String], null: true

    def resolve(id:, **args)
      bookmark = Bookmark.find_by(id: id)

      unless bookmark
        return { bookmark: nil, errors: ['Bookmark not found'] }
      end

      update_params = args.compact # Remove nil values, so we only update provided fields

      if bookmark.update(update_params)
        { bookmark: bookmark, errors: [] }
      else
        { bookmark: nil, errors: bookmark.errors.full_messages }
      end
    end
  end
end
