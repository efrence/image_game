class ImagesController < ApplicationController

  def get_random
    @uploads = Uploader.all
    images = flat_images
    respond_to do |format|
      format.json {
        render json: images.sample(images_params[:number].to_i)
      }
    end
  end

  private
    def flat_images
      images = []
      @uploads.each do |upload|
        upload.images.each do |image|
          images << image.url
        end
      end
      images
    end

    def images_params
      params.permit(:number)
    end
end
