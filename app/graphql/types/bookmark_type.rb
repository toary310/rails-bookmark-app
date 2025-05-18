# frozen_string_literal: true

module Types
  class BookmarkType < Types::BaseObject
    field :id, ID, null: false
    field :url, String, null: false
    field :title, String, null: true
    field :notes, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
