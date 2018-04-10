class Api::MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    MessageBus.publish "/chat_channel"
  end
end
