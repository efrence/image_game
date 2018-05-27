Rails.application.routes.draw do
  resources :uploaders, only: [:index, :create]
  get "get_random_images/:number", to: "images#get_random"
  root "uploaders#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
