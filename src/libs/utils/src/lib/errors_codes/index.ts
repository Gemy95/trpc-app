enum ERROR_CODES {
  err_file_url_not_correct = 'err_file_url_not_correct', // Throw error when deleting file from AWS and url is not found

  // Throw err and replace {{item}} with corrosponding module
  // Throw not found exception if ID does not match any ID in DB
  /**
   * replace {{item}}
   * Branch | City | Merchant | Country | Request | User |
   * Order | Product | ProductCategory | ProductGroup |
   * Reservation | Tag | Table | Category etc...
   */
  err_not_found = 'err_{{item}}_not_found',
  err_merchant_not_found = 'err_merchant_not_found',
  err_merchant_employee_not_found = 'err_merchant_employee_not_found',
  err_branch_not_found = 'err_branch_not_found',
  err_city_not_found = 'err_city_not_found',
  err_country_not_found = 'err_country_not_found',
  err_order_not_found = 'err_order_not_found',
  err_product_not_found = 'err_product_not_found',
  err_product_category_not_found = 'err_product_category_not_found',
  err_product_group_not_found = 'err_product_group_not_found',
  err_reservation_not_found = 'err_reservation_not_found',
  err_tag_not_found = 'err_tag_not_found',
  err_table_not_found = 'err_table_not_found',
  err_category_not_found = 'err_category_not_found',
  err_user_not_found = 'err_user_not_found',
  err_phone_number_not_found = 'err_phone_number_not_found',
  err_email_not_found = 'err_email_not_found',
  err_address_not_found = 'err_address_not_found',
  err_content_not_found = 'err_content_not_found',
  err_department_not_found = 'err_department_not_found',
  err_discount_not_found = 'err_discount_not_found',
  err_distance_not_found = 'err_distance_not_found',
  err_rating_scale_not_found = 'err_rating_scale_not_found',
  err_ticket_tag_not_found = 'err_ticket_tag_not_found',
  err_ticket_tag_reason_not_found = 'err_ticket_tag_reason_not_found',
  err_request_not_found = 'err_request_not_found',
  err_transaction_not_found = 'err_transaction_not_found',
  err_favorite_not_found = 'err_favorite_not_found',
  err_setting_not_found = 'err_setting_not_found',
  // Throw already in use if data already exist in DB
  /**
   * replace {{item}}
   * Email | Mobile | Table etc...
   */
  err_already_in_use = 'err_{{item}}_already_in_use',
  err_email_already_in_use = 'err_email_already_in_use',
  err_phone_number_already_in_use = 'err_phone_number_already_in_use',

  // Throw already in use if data already exist in DB
  /**
   * replace {{item}}
   * Email | Mobile | Table etc...
   */
  err_already_exists = 'err_{{item}}_already_exists',
  err_distance_already_exists = 'err_distance_already_exists',
  err_table_already_exists = 'err_table_already_exists',
  err_favorite_already_exists = 'err_favorite_already_exists',
  err_request_already_exists = 'err_request_already_exists',
  err_setting_already_exists = 'err_setting_already_exists',
  // Throw Failed to created if operation failed
  /**
   * replace {{item}}
   * Address | Discount | Order | Rating etc...
   */
  err_failed_to_create = 'err_failed_to_create_{{item}}',
  err_failed_to_create_address = 'err_failed_to_create_address',
  err_failed_to_create_discount = 'err_failed_to_create_discount',
  err_failed_to_create_order = 'err_failed_to_create_order',
  err_failed_to_create_rating = 'err_failed_to_create_rating',
  err_failed_to_create_request = 'err_failed_to_create_request',
  err_failed_to_create_merchant = 'err_failed_to_create_merchant',

  // Throw Failed to send if operation failed
  /**
   * replace {{item}}
   * Notification | Email | Sms etc...
   */
  err_failed_to_send = 'err_failed_to_send_{{item}}',
  err_failed_to_send_email = 'err_failed_to_send_email',
  err_failed_to_send_sms = 'err_failed_to_send_sms',
  err_failed_to_send_notification = 'err_failed_to_send_notification',

  // Throw Failed to fetch data
  /**
   * replace {{item}}
   * Address | Discount | etc...
   */
  err_failed_to_list = 'err_failed_to_list_{{item}}',
  err_failed_to_list_addresses = 'err_failed_to_list_addresses',
  err_failed_to_list_discounts = 'err_failed_to_list_discounts',
  err_failed_to_list_images = 'err_failed_to_list_images',

  err_failed_to_fetch_order = 'err_failed_to_fetch_order',

  // Throw Failed to update data
  /**
   * replace {{item}}
   * Address | Discount | etc...
   */
  err_failed_to_update = 'err_failed_to_update_{{item}}',
  err_failed_to_update_product = 'err_failed_to_update_product',
  err_failed_to_update_request = 'err_failed_to_update_request',

  // Throw Failed to delete data
  /**
   * replace {{item}}
   * Address | Discount | etc...
   */
  err_failed_to_delete = 'err_failed_to_delete_{{item}}',
  err_failed_to_delete_images = 'err_failed_to_delete_images',
  err_failed_to_delete_tag = 'err_failed_to_delete_tag',
  // Throw param must be a mongo Id
  /**
   * replace {{item}}
   * BranchId| MerchantId | CategoryId | etc...
   */
  err_must_be_mongo_id = '{{item}}_err_must_be_mongo_id',

  // OTP Errors
  err_otp_request_exceeded = 'err_otp_request_exceeded', // Throw error if user requested more than 3 otp
  err_wrong_otp_remaining = 'err_wrong_otp_remaining', // Throw error if otp is wrong and replace number of remaining tries
  err_otp_expired = 'err_otp_expired', // Throw error if otp is expired

  // Authorization Errors
  err_password_does_not_match = 'err_password_does_not_match', // Throw error if password does not match
  err_mobile_number_or_password_not_correct = 'err_mobile_number_or_password_not_correct', // Throw error if mobile or password is incorrect
  err_mobile_not_verified = 'err_mobile_not_verified', // Throw error if mobile number is not verified
  err_email_not_verified = 'err_email_not_verified', // Throw error if email number is not verified
  err_access_denied = 'err_access_denied', // Throw error if user not found on change password
  err_auth_token_is_missing = 'err_auth_token_is_missing', // Throw Error if user has no token attached to request headears
  err_auth_token_is_invalid = 'err_auth_token_is_invalid', // Throw Error if user token is expired or not valid

  // Others
  err_invalid_update_status = 'err_invalid_update_status', // Throw this if update status is invalid or already exist
  err_user_account_is_deleted = 'err_user_account_is_deleted', // Throw this if user account is deleted

  err_status_inactive = 'err_{{item}}_status_inactive', // Throw this if status is inactive
  err_category_status_inactive = 'err_category_status_inactive', // Throw this if status is inactive

  err_not_in_review = 'err_{{item}}_not_in_review', // Throw this if product
  err_product_not_in_review = 'err_product_not_in_review', // Throw this if product

  err_branch_currently_offline = 'err_branch_currently_offline', // Throw this branch is not accepting orders or offline
  must_use_only_english_numbers = 'must_use_only_english_numbers', // Throw this if mobile is not english numbers

  // Content Types Updates (1 Dec - 22)
  err_content_type_exist = 'err_content_type_exist', // Throw this if content type already exist
  otp_must_be_longer_than_or_equal_to_6_characters = 'otp_must_be_longer_than_or_equal_to_6_characters',

  // Boarding Errors (3 Dec - 22)
  boarding_enum_already_exist = 'boarding_enum_already_exist', // Throw this if enum already exist
  boarding_steps_must_be_4_or_less = 'boarding_steps_must_be_4_or_less', // Throw this if steps more than 4
  unknow_error = 'unknow_error', // Throw this if steps more than 4
  boarding_not_found_with_this_id = 'boarding_not_found_with_this_id', // Throw this if steps more than 4

  err_city_not_enabled_reservation = 'err_city_not_enabled_reservation',
  err_product_quantity_not_enough = 'err_product_quantity_not_enough',

  err_reservation_setting_is_disabled = 'err_reservation_setting_is_disabled',
  err_reservation_day_is_not_found_in_reservation_setting = 'err_reservation_day_is_not_found_in_reservation_setting',
  err_reservation_day_is_not_available = 'err_reservation_day_is_not_available',
  err_reservation_day_is_disable = 'err_reservation_day_is_disable',
  err_reservation_hour_is_disable = 'err_reservation_hour_is_disable',
  err_reservation_hour_is_not_found_in_day = 'err_reservation_hour_is_not_found_in_day',
  err_reservation_setting_capacity_and_waiting_list_is_full = 'err_reservation_setting_capacity_and_waiting_list_is_full',
  err_reservation_time_is_not_more_than_or_equal_one_hour_as_minimum = 'err_reservation_time_is_not_more_than_or_equal_one_hour_as_minimum',

  err_bank_not_found = 'err_bank_not_found',

  err_branch_already_has_subscription_date = 'err_branch_already_has_subscription_date',

  err_merchant_has_not_bank_account = 'err_merchant_has_not_bank_account',

  err_merchant_is_banned = 'err_merchant_is_banned',

  err_branch_group_not_found = 'err_branch_group_not_found',

  err_menu_template_not_found = 'err_menu_template_not_found',

  err_menu_template_product_not_found = 'err_menu_template_product_not_found',

  err_you_select_date_type_custom_without_date_range = 'err_you_select_date_type_custom_without_date_range',

  err_menu_template_product_group_not_found = 'err_menu_template_product_group_not_found',

  err_order_branch_is_not_approved = 'err_order_branch_is_not_approved',
  err_order_product_is_not_approved = 'err_order_product_is_not_approved',
  err_order_product_is_not_ready_for_production = 'err_order_product_is_not_ready_for_production',

  err_payment_unable_to_process_your_refund = 'err_payment_unable_to_process_your_refund',

  err_payment_paytabs_transaction_not_found = 'err_payment_paytabs_transaction_not_found',

  err_mobile_must_be_valid_number = 'err_mobile_must_be_valid_number',
  err_order_branch_is_not_has_self_delivery = 'err_order_branch_is_not_has_self_delivery',
  err_order_must_has_driver_for_self_delivery = 'err_order_must_has_driver_for_self_delivery',
  err_order_driver_not_found = 'err_order_driver_not_found',
  err_order_driver_must_be_delivery_job = 'err_order_driver_must_be_delivery_job',

  err_client_longitude_latitude_must_be_send = 'err_client_longitude_latitude_must_be_send',
  err_order_price_is_less_than_minimum = 'err_order_price_is_less_than_minimum',
  err_order_price_is_less_than_minimum_delivery_price = 'err_order_price_is_less_than_minimum_delivery_price',

  err_self_delivery_must_has_store_delivery_fee = 'err_self_delivery_must_has_store_delivery_fee',

  err_max_size_exceeded_for_file = 'err_max_size_exceeded_for_file',
  err_only_images_are_allowed = 'err_only_images_are_allowed',

  err_menu_template_already_exists = 'err_menu_template_already_exists',
  err_user_account_deleted = 'err_user_account_deleted',

  err_user_account_already_is_active = 'err_user_account_already_is_active',
  err_merchant_is_rejected = 'err_merchant_is_rejected',

  err_user_can_not_cancel_delete_account_after_one_week = 'err_user_can_not_cancel_delete_account_after_one_week',

  err_forbidden_resource = 'err_forbidden_resource',

  err_merchant_menu_upload_is_already_exists = 'err_merchant_menu_upload_is_already_exists',

  err_merchant_status_is_not_approved = 'err_merchant_status_is_not_approved',

  err_wrong_time_format = 'err_wrong_time_format',

  err_reservation_tables_has_not_enough_capacity = 'err_reservation_tables_has_not_enough_capacity',

  err_reservation_date_time_less_than_now = 'err_reservation_date_time_less_than_now',

  err_reservation_already_exists_during_this_time = 'err_reservation_already_exists_during_this_time',

  err_setting_not_exists = 'err_setting_not_exists',

  err_user_reset_temp_password_from_before = 'err_user_reset_temp_password_from_before',

  err_temp_password_does_not_match = 'err_temp_password_does_not_match',

  err_coupon_not_found = 'err_coupon_not_found',

  err_coupon_must_has_discount_amount_or_free_delivery = 'err_coupon_must_has_discount_amount_or_free_delivery',

  err_coupon_already_exists = 'err_coupon_already_exists',

  err_coupon_expired_at_is_before_valid_from_date = 'err_coupon_expired_at_is_before_valid_from_date',

  err_coupon_branch_not_matched = 'err_coupon_branch_not_matched',

  err_coupon_order_type_not_matched = 'err_coupon_order_type_not_matched',

  err_coupon_valid_from_date_greater_than_now = 'err_coupon_valid_from_date_greater_than_now',

  err_coupon_is_expired = 'err_coupon_is_expired',

  err_coupon_is_not_active = 'err_coupon_is_not_active',

  err_coupon_max_use_per_client = 'err_coupon_max_use_per_client',

  err_coupon_must_be_for_new_client = 'err_coupon_must_be_for_new_client',

  err_coupon_client_orders_count_less_than_current_count = 'err_coupon_client_orders_count_less_than_current_count',

  err_coupon_is_not_match_branch = 'err_coupon_is_not_match_branch',

  err_coupon_is_not_match_product = 'err_coupon_is_not_match_product',

  err_client_not_found = 'err_client_not_found',

  err_coupon_code_already_exists = 'err_coupon_code_already_exists',

  err_coupon_order_items_prices_less_than_lowest_cart_price = 'err_coupon_order_items_prices_less_than_lowest_cart_price',

  err_coupon_max_use_per_clients = 'err_coupon_max_use_per_clients',

  err_delivery_provider_not_found = 'err_delivery_provider_not_found',

  err_vehicle_number_already_exists = 'err_vehicle_number_already_exists',

  err_vehicle_not_found = 'err_vehicle_not_found',

  err_vehicle_year_already_exists = 'err_vehicle_year_already_exists',

  err_vehicle_year_not_found = 'err_vehicle_year_not_found',

  err_vehicle_model_already_exists = 'err_vehicle_model_already_exists',

  err_vehicle_model_not_found = 'err_vehicle_model_not_found',

  err_vehicle_brand_already_exists = 'err_vehicle_brand_already_exists',

  err_vehicle_brand_not_found = 'err_vehicle_brand_not_found',

  err_driver_not_found = 'err_driver_not_found',
  err_driver_is_rejected = 'err_driver_is_rejected',
  err_driver_is_banned = 'err_driver_is_banned',
  err_driver_is_pending = 'err_driver_is_pending',

  err_provider_employee_not_found = 'err_provider_employee_not_found',

  err_wrong_authentication_code = 'err_wrong_authentication_code',

  err_auth_token_is_expired = 'err_auth_token_is_expired',
}

export default ERROR_CODES;
