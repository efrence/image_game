class UploadersController < ApplicationController
  def index
    @upload = Uploader.new
    @uploads = Uploader.try(:all).try(:reverse)
    respond_to do |format|
      format.html  # index.html.erb
    end
  end

  def create
    params.fetch(:uploader, false) && Uploader.create(uploader_params) 
    redirect_to uploaders_path
  end

  private
    def uploader_params
      params.require(:uploader).permit( {images: []})
    end
end
