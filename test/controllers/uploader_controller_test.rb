require 'test_helper'

class UploaderControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get uploader_edit_url
    assert_response :success
  end

end
