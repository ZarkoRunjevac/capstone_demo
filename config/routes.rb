Rails.application.routes.draw do

  mount_devise_token_auth_for 'User', at: 'auth'

  root "ui#index"
  get "/ui"=>'ui#index'
  get "/ui#"=>'ui#index'

  scope :api, defaults: {format: :json} do
    resources :foos, except: [:new, :edit]
    resources :bars, except: [:new, :edit]
  end

end
