class Api::TypingController < ApplicationController
  before_action :authenticate_user!

  def status
    MessageBus.publish '/typing', { typing: params[:typing], id: current_user_id }
  end
end
