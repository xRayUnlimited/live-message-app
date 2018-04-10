class Api::MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    MessageBus.publish "/chat_channel", { email: params[:email], body: params[:body]}
  end
end
