class Api::MessagesController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: Message.order(:created_at).limit(30)
  end

  def create
    email = params[:email]
    body = params[:body]
    message = Message.new(email: email, body: body)
    if message.save
      MessageBus.publish "/chat_channel", message.to_json
    else
      render json: { errors: message.errors.full_messages }, status: 422
    end
  end
end