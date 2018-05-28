class PlaysController < ApplicationController
  def index
    @play = Play.new
    @plays = Play.try(:all).try(:reverse)
    respond_to do |format|
      format.html  # index.html.erb
    end
  end

  def create 
    respond_to do |format|
      format.js {
        params.fetch(:play, false) && Play.create(play_params) 
      }
      format.html {
        params.fetch(:play, false) && Play.create(play_params) 
        redirect_to plays_path
      }
    end
  end

  private
    def play_params
      params.require(:play).permit(:time, :image_url)
    end
end
