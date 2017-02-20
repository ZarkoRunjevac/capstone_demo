class ThingsController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper
  before_action :set_thing, only: [:show, :update, :destroy]
  wrap_parameters :thing, include: ["name", "description", "notes"]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  def index
    authorize Thing
    things = policy_scope(Thing.all)
    @things = ThingPolicy.merge(things)
  end


  def show
    authorize @thing
    things = ThingPolicy::Scope.new(current_user,
                                    Thing.where(:id=>@thing.id))
                 .user_roles(false)
    @thing = ThingPolicy.merge(things).first
  end

  def create
    authorize Thing
    @thing = Thing.new(thing_params)

    User.transaction do
      if @thing.save
        role=current_user.add_role(Role::ORGANIZER,@thing)
        @thing.user_roles << role.role_name
        role.save!
        render :show, status: :created, location: @thing
      else
        render json: {errors:@thing.errors.messages}, status: :unprocessable_entity
      end
    end
  end


  def update
    @thing = Thing.find(params[:id])

    if @thing.update(thing_params)
      head :no_content
    else
      render json: {errors:@thing.errors.messages}, status: :unprocessable_entity
    end
  end

  # DELETE /things/1
  # DELETE /things/1.json
  def destroy
    @thing.destroy

    head :no_content
  end

  private

    def set_thing
      @thing = Thing.find(params[:id])
    end

    def thing_params
      params.require(:thing).permit(:name, :description, :notes)
      # params.require(:thing).tap {|p|
      #   p.require(:name) #throws ActionController::ParameterMissing
      # }.permit(:name, :description, :notes)
    end
end
