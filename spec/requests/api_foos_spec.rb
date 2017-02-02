require 'rails_helper'

RSpec.describe "Foo Api", type: :request do
  include_context "db_cleanup", :transaction

  describe "GET /api_foos" do
    it "works! (now write some real specs)" do
      get foos_path
      expect(response).to have_http_status(200)
    end
  end
end
