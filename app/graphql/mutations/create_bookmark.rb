# frozen_string_literal: true

module Mutations
  class CreateBookmark < BaseMutation
    # arguments passed to the `resolve` method
    argument :url, String, required: true
    argument :title, String, required: false
    argument :notes, String, required: false

    # return type from the mutation
    field :bookmark, Types::BookmarkType, null: true
    field :errors, [String], null: true

    def resolve(url:, title: nil, notes: nil)
      bookmark = Bookmark.new(url: url, title: title, notes: notes)
      if bookmark.save
        { bookmark: bookmark, errors: [] }
      else
        { bookmark: nil, errors: bookmark.errors.full_messages }
      end
    end
  end
end
