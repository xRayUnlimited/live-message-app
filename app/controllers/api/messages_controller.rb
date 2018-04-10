class Api::MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    email = params[:email]
    body = params[:body]
    if message = Message.create(email: email, body: body)
      MessageBus.publish "/chat_channel", { email: params[:email], body: params[:body]}
    else
      render json: { errors: message.errors.full_messages }, status: 422
    end
  end
end
