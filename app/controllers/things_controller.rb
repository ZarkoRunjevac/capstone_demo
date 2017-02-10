class ThingsController < ApplicationController
  before_action :set_thing, only: [:show, :update, :destroy]
  wrap_parameters :thing, include: ["name", "description", "notes"]
  before_action :authenticate_user!, only: [:create, :update, :destroy]

  def index
    @things = Thing.all
  end


  def show

  end

  def create
    @thing = Thing.new(thing_params)

    if @thing.save
      render json: @thing, status: :created, location: @thing
    else
      render json: {errors:@thing.errors.messages}, status: :bad_request
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
