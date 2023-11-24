import { Injectable } from '@nestjs/common';

import {
  ALL_PERMISSION as ALL_PERMISSION_BRANCH_CATEGORY,
  CREATE_PERMISSION as CREATE_PERMISSION_BRANCH_CATEGORY,
  DELETE_PERMISSION as DELETE_PERMISSION_BRANCH_CATEGORY,
  READ_PERMISSION as READ_PERMISSION_BRANCH_CATEGORY,
  UPDATE_PERMISSION as UPDATE_PERMISSION_BRANCH_CATEGORY,
} from '../../../libs/database/src/lib/common/permissions/branch-category.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_BRANCH_GROUP,
  CREATE_PERMISSION as CREATE_PERMISSION_BRANCH_GROUP,
  DELETE_PERMISSION as DELETE_PERMISSION_BRANCH_GROUP,
  READ_PERMISSION as READ_PERMISSION_BRANCH_GROUP,
  UPDATE_PERMISSION as UPDATE_PERMISSION_BRANCH_GROUP,
} from '../../../libs/database/src/lib/common/permissions/branch-group.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_BRANCH,
  CREATE_PERMISSION as CREATE_PERMISSION_BRANCH,
  DELETE_PERMISSION as DELETE_PERMISSION_BRANCH,
  READ_PERMISSION as READ_PERMISSION_BRANCH,
  UPDATE_PERMISSION as UPDATE_PERMISSION_BRANCH,
} from '../../../libs/database/src/lib/common/permissions/branch.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_CATEGORY,
  CREATE_PERMISSION as CREATE_PERMISSION_CATEGORY,
  DELETE_PERMISSION as DELETE_PERMISSION_CATEGORY,
  READ_PERMISSION as READ_PERMISSION_CATEGORY,
  UPDATE_PERMISSION as UPDATE_PERMISSION_CATEGORY,
} from '../../../libs/database/src/lib/common/permissions/category.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_BANK,
  CREATE_PERMISSION as CREATE_PERMISSION_BANK,
  DELETE_PERMISSION as DELETE_PERMISSION_BANK,
  READ_PERMISSION as READ_PERMISSION_BANK,
  UPDATE_PERMISSION as UPDATE_PERMISSION_BANK,
} from '../../../libs/database/src/lib/common/permissions/category.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_CITY,
  CREATE_PERMISSION as CREATE_PERMISSION_CITY,
  DELETE_PERMISSION as DELETE_PERMISSION_CITY,
  READ_PERMISSION as READ_PERMISSION_CITY,
  UPDATE_PERMISSION as UPDATE_PERMISSION_CITY,
} from '../../../libs/database/src/lib/common/permissions/city.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_CONTENT,
  CREATE_PERMISSION as CREATE_PERMISSION_CONTENT,
  DELETE_PERMISSION as DELETE_PERMISSION_CONTENT,
  READ_PERMISSION as READ_PERMISSION_CONTENT,
  UPDATE_PERMISSION as UPDATE_PERMISSION_CONTENT,
} from '../../../libs/database/src/lib/common/permissions/content.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_COUNTRY,
  CREATE_PERMISSION as CREATE_PERMISSION_COUNTRY,
  DELETE_PERMISSION as DELETE_PERMISSION_COUNTRY,
  READ_PERMISSION as READ_PERMISSION_COUNTRY,
  UPDATE_PERMISSION as UPDATE_PERMISSION_COUNTRY,
} from '../../../libs/database/src/lib/common/permissions/country.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_COUPON,
  CREATE_PERMISSION as CREATE_PERMISSION_COUPON,
  DELETE_PERMISSION as DELETE_PERMISSION_COUPON,
  READ_PERMISSION as READ_PERMISSION_COUPON,
  UPDATE_PERMISSION as UPDATE_PERMISSION_COUPON,
} from '../../../libs/database/src/lib/common/permissions/coupon.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_DEPARTMENT,
  CREATE_PERMISSION as CREATE_PERMISSION_DEPARTMENT,
  DELETE_PERMISSION as DELETE_PERMISSION_DEPARTMENT,
  READ_PERMISSION as READ_PERMISSION_DEPARTMENT,
  UPDATE_PERMISSION as UPDATE_PERMISSION_DEPARTMENT,
} from '../../../libs/database/src/lib/common/permissions/department.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_DISCOUNT,
  CREATE_PERMISSION as CREATE_PERMISSION_DISCOUNT,
  DELETE_PERMISSION as DELETE_PERMISSION_DISCOUNT,
  READ_PERMISSION as READ_PERMISSION_DISCOUNT,
  UPDATE_PERMISSION as UPDATE_PERMISSION_DISCOUNT,
} from '../../../libs/database/src/lib/common/permissions/discount.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP,
  CREATE_PERMISSION as CREATE_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP,
  DELETE_PERMISSION as DELETE_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP,
  READ_PERMISSION as READ_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP,
  UPDATE_PERMISSION as UPDATE_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP,
} from '../../../libs/database/src/lib/common/permissions/menu-template-product-group.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_MENU_TEMPLATE_PRODUCT,
  CREATE_PERMISSION as CREATE_PERMISSION_MENU_TEMPLATE_PRODUCT,
  DELETE_PERMISSION as DELETE_PERMISSION_MENU_TEMPLATE_PRODUCT,
  READ_PERMISSION as READ_PERMISSION_MENU_TEMPLATE_PRODUCT,
  UPDATE_PERMISSION as UPDATE_PERMISSION_MENU_TEMPLATE_PRODUCT,
} from '../../../libs/database/src/lib/common/permissions/menu-template-product.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_MENU_TEMPLATE,
  CREATE_PERMISSION as CREATE_PERMISSION_MENU_TEMPLATE,
  DELETE_PERMISSION as DELETE_PERMISSION_MENU_TEMPLATE,
  READ_PERMISSION as READ_PERMISSION_MENU_TEMPLATE,
  UPDATE_PERMISSION as UPDATE_PERMISSION_MENU_TEMPLATE,
} from '../../../libs/database/src/lib/common/permissions/menu-template.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_MERCHANT_EMPLOYEE,
  CREATE_PERMISSION as CREATE_PERMISSION_MERCHANT_EMPLOYEE,
  DELETE_PERMISSION as DELETE_PERMISSION_MERCHANT_EMPLOYEE,
  READ_PERMISSION as READ_PERMISSION_MERCHANT_EMPLOYEE,
  UPDATE_PERMISSION as UPDATE_PERMISSION_MERCHANT_EMPLOYEE,
} from '../../../libs/database/src/lib/common/permissions/merchant-employee.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_MERCHANT,
  CREATE_PERMISSION as CREATE_PERMISSION_MERCHANT,
  DELETE_PERMISSION as DELETE_PERMISSION_MERCHANT,
  READ_PERMISSION as READ_PERMISSION_MERCHANT,
  UPDATE_PERMISSION as UPDATE_PERMISSION_MERCHANT,
} from '../../../libs/database/src/lib/common/permissions/merchant.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_ONBOARDING,
  CREATE_PERMISSION as CREATE_PERMISSION_ONBOARDING,
  DELETE_PERMISSION as DELETE_PERMISSION_ONBOARDING,
  READ_PERMISSION as READ_PERMISSION_ONBOARDING,
  UPDATE_PERMISSION as UPDATE_PERMISSION_ONBOARDING,
} from '../../../libs/database/src/lib/common/permissions/onboarding.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_ORDER,
  CREATE_PERMISSION as CREATE_PERMISSION_ORDER,
  DELETE_PERMISSION as DELETE_PERMISSION_ORDER,
  READ_PERMISSION as READ_PERMISSION_ORDER,
  UPDATE_PERMISSION as UPDATE_PERMISSION_ORDER,
} from '../../../libs/database/src/lib/common/permissions/order.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_PRODUCT_GROUP,
  CREATE_PERMISSION as CREATE_PERMISSION_PRODUCT_GROUP,
  DELETE_PERMISSION as DELETE_PERMISSION_PRODUCT_GROUP,
  READ_PERMISSION as READ_PERMISSION_PRODUCT_GROUP,
  UPDATE_PERMISSION as UPDATE_PERMISSION_PRODUCT_GROUP,
} from '../../../libs/database/src/lib/common/permissions/product-group.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_PRODUCT,
  CREATE_PERMISSION as CREATE_PERMISSION_PRODUCT,
  DELETE_PERMISSION as DELETE_PERMISSION_PRODUCT,
  READ_PERMISSION as READ_PERMISSION_PRODUCT,
  UPDATE_PERMISSION as UPDATE_PERMISSION_PRODUCT,
} from '../../../libs/database/src/lib/common/permissions/product.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_RATING_SCALE,
  CREATE_PERMISSION as CREATE_PERMISSION_RATING_SCALE,
  DELETE_PERMISSION as DELETE_PERMISSION_RATING_SCALE,
  READ_PERMISSION as READ_PERMISSION_RATING_SCALE,
  UPDATE_PERMISSION as UPDATE_PERMISSION_RATING_SCALE,
} from '../../../libs/database/src/lib/common/permissions/rating-scale.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_RATING,
  CREATE_PERMISSION as CREATE_PERMISSION_RATING,
  DELETE_PERMISSION as DELETE_PERMISSION_RATING,
  READ_PERMISSION as READ_PERMISSION_RATING,
  UPDATE_PERMISSION as UPDATE_PERMISSION_RATING,
} from '../../../libs/database/src/lib/common/permissions/rating.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_RESERVATION,
  CREATE_PERMISSION as CREATE_PERMISSION_RESERVATION,
  DELETE_PERMISSION as DELETE_PERMISSION_RESERVATION,
  READ_PERMISSION as READ_PERMISSION_RESERVATION,
  UPDATE_PERMISSION as UPDATE_PERMISSION_RESERVATION,
} from '../../../libs/database/src/lib/common/permissions/reservation.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_SHOPPEX_EMPLOYEE,
  CREATE_PERMISSION as CREATE_PERMISSION_SHOPPEX_EMPLOYEE,
  DELETE_PERMISSION as DELETE_PERMISSION_SHOPPEX_EMPLOYEE,
  READ_PERMISSION as READ_PERMISSION_SHOPPEX_EMPLOYEE,
  UPDATE_PERMISSION as UPDATE_PERMISSION_SHOPPEX_EMPLOYEE,
} from '../../../libs/database/src/lib/common/permissions/shoppex-employee.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_TABLE,
  CREATE_PERMISSION as CREATE_PERMISSION_TABLE,
  DELETE_PERMISSION as DELETE_PERMISSION_TABLE,
  READ_PERMISSION as READ_PERMISSION_TABLE,
  UPDATE_PERMISSION as UPDATE_PERMISSION_TABLE,
} from '../../../libs/database/src/lib/common/permissions/table.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_TAG,
  CREATE_PERMISSION as CREATE_PERMISSION_TAG,
  DELETE_PERMISSION as DELETE_PERMISSION_TAG,
  READ_PERMISSION as READ_PERMISSION_TAG,
  UPDATE_PERMISSION as UPDATE_PERMISSION_TAG,
} from '../../../libs/database/src/lib/common/permissions/tag.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_TICKET_TAG_REASON,
  CREATE_PERMISSION as CREATE_PERMISSION_TICKET_TAG_REASON,
  DELETE_PERMISSION as DELETE_PERMISSION_TICKET_TAG_REASON,
  READ_PERMISSION as READ_PERMISSION_TICKET_TAG_REASON,
  UPDATE_PERMISSION as UPDATE_PERMISSION_TICKET_TAG_REASON,
} from '../../../libs/database/src/lib/common/permissions/ticket-tag-reason.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_TICKET_TAG,
  CREATE_PERMISSION as CREATE_PERMISSION_TICKET_TAG,
  DELETE_PERMISSION as DELETE_PERMISSION_TICKET_TAG,
  READ_PERMISSION as READ_PERMISSION_TICKET_TAG,
  UPDATE_PERMISSION as UPDATE_PERMISSION_TICKET_TAG,
} from '../../../libs/database/src/lib/common/permissions/ticket-tag.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_TRANSACTION,
  CREATE_PERMISSION as CREATE_PERMISSION_TRANSACTION,
  DELETE_PERMISSION as DELETE_PERMISSION_TRANSACTION,
  READ_PERMISSION as READ_PERMISSION_TRANSACTION,
  UPDATE_PERMISSION as UPDATE_PERMISSION_TRANSACTION,
} from '../../../libs/database/src/lib/common/permissions/transaction.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_VEHICLE_BRAND,
  CREATE_PERMISSION as CREATE_PERMISSION_VEHICLE_BRAND,
  DELETE_PERMISSION as DELETE_PERMISSION_VEHICLE_BRAND,
  READ_PERMISSION as READ_PERMISSION_VEHICLE_BRAND,
  UPDATE_PERMISSION as UPDATE_PERMISSION_VEHICLE_BRAND,
} from '../../../libs/database/src/lib/common/permissions/vehicle-brand.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_VEHICLE_MODEL,
  CREATE_PERMISSION as CREATE_PERMISSION_VEHICLE_MODEL,
  DELETE_PERMISSION as DELETE_PERMISSION_VEHICLE_MODEL,
  READ_PERMISSION as READ_PERMISSION_VEHICLE_MODEL,
  UPDATE_PERMISSION as UPDATE_PERMISSION_VEHICLE_MODEL,
} from '../../../libs/database/src/lib/common/permissions/vehicle-model.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_VEHICLE_YEAR,
  CREATE_PERMISSION as CREATE_PERMISSION_VEHICLE_YEAR,
  DELETE_PERMISSION as DELETE_PERMISSION_VEHICLE_YEAR,
  READ_PERMISSION as READ_PERMISSION_VEHICLE_YEAR,
  UPDATE_PERMISSION as UPDATE_PERMISSION_VEHICLE_YEAR,
} from '../../../libs/database/src/lib/common/permissions/vehicle-year.permissions';
import {
  ALL_PERMISSION as ALL_PERMISSION_VEHICLE,
  CREATE_PERMISSION as CREATE_PERMISSION_VEHICLE,
  DELETE_PERMISSION as DELETE_PERMISSION_VEHICLE,
  READ_PERMISSION as READ_PERMISSION_VEHICLE,
  UPDATE_PERMISSION as UPDATE_PERMISSION_VEHICLE,
} from '../../../libs/database/src/lib/common/permissions/vehicle.permissions';

@Injectable()
export class DashboardPermissionService {
  async getAllPermissionsForShoppexEmployee() {
    const permissions = [
      {
        name: 'تصنيف المنتجات',
        translation: [
          {
            _lang: 'en',
            name: 'product category',
          },
        ],
        create: CREATE_PERMISSION_CATEGORY.value,
        read: READ_PERMISSION_CATEGORY.value,
        update: UPDATE_PERMISSION_CATEGORY.value,
        delete: DELETE_PERMISSION_CATEGORY.value,
        all: ALL_PERMISSION_CATEGORY.value,
      },
      {
        name: 'تصنيف الفرع',
        translation: [
          {
            _lang: 'en',
            name: 'branch category',
          },
        ],
        create: CREATE_PERMISSION_BRANCH_CATEGORY.value,
        read: READ_PERMISSION_BRANCH_CATEGORY.value,
        update: UPDATE_PERMISSION_BRANCH_CATEGORY.value,
        delete: DELETE_PERMISSION_BRANCH_CATEGORY.value,
        all: ALL_PERMISSION_BRANCH_CATEGORY.value,
      },
      {
        name: 'الفرع',
        translation: [
          {
            _lang: 'en',
            name: 'branch',
          },
        ],
        create: CREATE_PERMISSION_BRANCH.value,
        read: READ_PERMISSION_BRANCH.value,
        update: UPDATE_PERMISSION_BRANCH.value,
        delete: DELETE_PERMISSION_BRANCH.value,
        all: ALL_PERMISSION_BRANCH.value,
      },
      {
        name: 'المتجر',
        translation: [
          {
            _lang: 'en',
            name: 'merchant',
          },
        ],
        create: CREATE_PERMISSION_MERCHANT.value,
        read: READ_PERMISSION_MERCHANT.value,
        update: UPDATE_PERMISSION_MERCHANT.value,
        delete: DELETE_PERMISSION_MERCHANT.value,
        all: ALL_PERMISSION_MERCHANT.value,
      },
      {
        name: 'الدولة',
        translation: [
          {
            _lang: 'en',
            name: 'country',
          },
        ],
        create: CREATE_PERMISSION_COUNTRY.value,
        read: READ_PERMISSION_COUNTRY.value,
        update: UPDATE_PERMISSION_COUNTRY.value,
        delete: DELETE_PERMISSION_COUNTRY.value,
        all: ALL_PERMISSION_COUNTRY.value,
      },
      {
        name: 'المدينة',
        translation: [
          {
            _lang: 'en',
            name: 'city',
          },
        ],
        create: CREATE_PERMISSION_CITY.value,
        read: READ_PERMISSION_CITY.value,
        update: UPDATE_PERMISSION_CITY.value,
        delete: DELETE_PERMISSION_CITY.value,
        all: ALL_PERMISSION_CITY.value,
      },
      {
        name: 'المحتوي',
        translation: [
          {
            _lang: 'en',
            name: 'content',
          },
        ],
        create: CREATE_PERMISSION_CONTENT.value,
        read: READ_PERMISSION_CONTENT.value,
        update: UPDATE_PERMISSION_CONTENT.value,
        delete: DELETE_PERMISSION_CONTENT.value,
        all: ALL_PERMISSION_CONTENT.value,
      },
      {
        name: 'الادارة',
        translation: [
          {
            _lang: 'en',
            name: 'department',
          },
        ],
        create: CREATE_PERMISSION_DEPARTMENT.value,
        read: READ_PERMISSION_DEPARTMENT.value,
        update: UPDATE_PERMISSION_DEPARTMENT.value,
        delete: DELETE_PERMISSION_DEPARTMENT.value,
        all: ALL_PERMISSION_DEPARTMENT.value,
      },
      {
        name: 'الاعداد',
        translation: [
          {
            _lang: 'en',
            name: 'on-boarding',
          },
        ],
        create: CREATE_PERMISSION_ONBOARDING.value,
        read: READ_PERMISSION_ONBOARDING.value,
        update: UPDATE_PERMISSION_ONBOARDING.value,
        delete: DELETE_PERMISSION_ONBOARDING.value,
        all: ALL_PERMISSION_ONBOARDING.value,
      },
      {
        name: 'الطلبات',
        translation: [
          {
            _lang: 'en',
            name: 'order',
          },
        ],
        create: CREATE_PERMISSION_ORDER.value,
        read: READ_PERMISSION_ORDER.value,
        update: UPDATE_PERMISSION_ORDER.value,
        delete: DELETE_PERMISSION_ORDER.value,
        all: ALL_PERMISSION_ORDER.value,
      },
      {
        name: 'مستوي التقييم',
        translation: [
          {
            _lang: 'en',
            name: 'rating scale',
          },
        ],
        create: CREATE_PERMISSION_RATING_SCALE.value,
        read: READ_PERMISSION_RATING_SCALE.value,
        update: UPDATE_PERMISSION_RATING_SCALE.value,
        delete: DELETE_PERMISSION_RATING_SCALE.value,
        all: ALL_PERMISSION_RATING_SCALE.value,
      },
      {
        name: 'التقييمات',
        translation: [
          {
            _lang: 'en',
            name: 'rating',
          },
        ],
        create: CREATE_PERMISSION_RATING.value,
        read: READ_PERMISSION_RATING.value,
        update: UPDATE_PERMISSION_RATING.value,
        delete: DELETE_PERMISSION_RATING.value,
        all: ALL_PERMISSION_RATING.value,
      },
      {
        name: 'الحجوزات',
        translation: [
          {
            _lang: 'en',
            name: 'reservation',
          },
        ],
        create: CREATE_PERMISSION_RESERVATION.value,
        read: READ_PERMISSION_RESERVATION.value,
        update: UPDATE_PERMISSION_RESERVATION.value,
        delete: DELETE_PERMISSION_RESERVATION.value,
        all: ALL_PERMISSION_RESERVATION.value,
      },
      {
        name: 'تاج',
        translation: [
          {
            _lang: 'en',
            name: 'tag',
          },
        ],
        create: CREATE_PERMISSION_TAG.value,
        read: READ_PERMISSION_TAG.value,
        update: UPDATE_PERMISSION_TAG.value,
        delete: DELETE_PERMISSION_TAG.value,
        all: ALL_PERMISSION_TAG.value,
      },
      {
        name: 'اسباب تاج التيكت',
        translation: [
          {
            _lang: 'en',
            name: 'ticket tag reason',
          },
        ],
        create: CREATE_PERMISSION_TICKET_TAG_REASON.value,
        read: READ_PERMISSION_TICKET_TAG_REASON.value,
        update: UPDATE_PERMISSION_TICKET_TAG_REASON.value,
        delete: DELETE_PERMISSION_TICKET_TAG_REASON.value,
        all: ALL_PERMISSION_TICKET_TAG_REASON.value,
      },
      {
        name: 'تاج التيكت',
        translation: [
          {
            _lang: 'en',
            name: 'ticket tag',
          },
        ],
        create: CREATE_PERMISSION_TICKET_TAG.value,
        read: READ_PERMISSION_TICKET_TAG.value,
        update: UPDATE_PERMISSION_TICKET_TAG.value,
        delete: DELETE_PERMISSION_TICKET_TAG.value,
        all: ALL_PERMISSION_TICKET_TAG.value,
      },
      {
        name: 'العمولات',
        translation: [
          {
            _lang: 'en',
            name: 'transaction',
          },
        ],
        create: CREATE_PERMISSION_TRANSACTION.value,
        read: READ_PERMISSION_TRANSACTION.value,
        update: UPDATE_PERMISSION_TRANSACTION.value,
        delete: DELETE_PERMISSION_TRANSACTION.value,
        all: ALL_PERMISSION_TRANSACTION.value,
      },
      {
        name: 'الاضافات',
        translation: [
          {
            _lang: 'en',
            name: 'product group',
          },
        ],
        create: CREATE_PERMISSION_PRODUCT_GROUP.value,
        read: READ_PERMISSION_PRODUCT_GROUP.value,
        update: UPDATE_PERMISSION_PRODUCT_GROUP.value,
        delete: DELETE_PERMISSION_PRODUCT_GROUP.value,
        all: ALL_PERMISSION_PRODUCT_GROUP.value,
      },
      {
        name: 'المنتجات',
        translation: [
          {
            _lang: 'en',
            name: 'products',
          },
        ],
        create: CREATE_PERMISSION_PRODUCT.value,
        read: READ_PERMISSION_PRODUCT.value,
        update: UPDATE_PERMISSION_PRODUCT.value,
        delete: DELETE_PERMISSION_PRODUCT.value,
        all: ALL_PERMISSION_PRODUCT.value,
      },
      {
        name: 'البنك',
        translation: [
          {
            _lang: 'en',
            name: 'banks',
          },
        ],
        create: CREATE_PERMISSION_BANK.value,
        read: READ_PERMISSION_BANK.value,
        update: UPDATE_PERMISSION_BANK.value,
        delete: DELETE_PERMISSION_BANK.value,
        all: ALL_PERMISSION_BANK.value,
      },
      {
        name: 'نقطة التجمع',
        translation: [
          {
            _lang: 'en',
            name: 'branch group',
          },
        ],
        create: CREATE_PERMISSION_BRANCH_GROUP.value,
        read: READ_PERMISSION_BRANCH_GROUP.value,
        update: UPDATE_PERMISSION_BRANCH_GROUP.value,
        delete: DELETE_PERMISSION_BRANCH_GROUP.value,
        all: ALL_PERMISSION_BRANCH_GROUP.value,
      },
      {
        name: 'الطاولة',
        translation: [
          {
            _lang: 'en',
            name: 'table',
          },
        ],
        create: CREATE_PERMISSION_TABLE.value,
        read: READ_PERMISSION_TABLE.value,
        update: UPDATE_PERMISSION_TABLE.value,
        delete: DELETE_PERMISSION_TABLE.value,
        all: ALL_PERMISSION_TABLE.value,
      },
      {
        name: 'نموذج المنيو',
        translation: [
          {
            _lang: 'en',
            name: 'menu template',
          },
        ],
        create: CREATE_PERMISSION_MENU_TEMPLATE.value,
        read: READ_PERMISSION_MENU_TEMPLATE.value,
        update: UPDATE_PERMISSION_MENU_TEMPLATE.value,
        delete: DELETE_PERMISSION_MENU_TEMPLATE.value,
        all: ALL_PERMISSION_MENU_TEMPLATE.value,
      },
      {
        name: 'نموذج الفرع للمنتج',
        translation: [
          {
            _lang: 'en',
            name: 'menu template product',
          },
        ],
        create: CREATE_PERMISSION_MENU_TEMPLATE_PRODUCT.value,
        read: READ_PERMISSION_MENU_TEMPLATE_PRODUCT.value,
        update: UPDATE_PERMISSION_MENU_TEMPLATE_PRODUCT.value,
        delete: DELETE_PERMISSION_MENU_TEMPLATE_PRODUCT.value,
        all: ALL_PERMISSION_MENU_TEMPLATE_PRODUCT.value,
      },
      {
        name: 'نموذج الفرع لاضافات المنتج',
        translation: [
          {
            _lang: 'en',
            name: 'menu template product group',
          },
        ],
        create: CREATE_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP.value,
        read: READ_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP.value,
        update: UPDATE_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP.value,
        delete: DELETE_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP.value,
        all: ALL_PERMISSION_MENU_TEMPLATE_PRODUCT_GROUP.value,
      },
      {
        name: 'الخصومات',
        translation: [
          {
            _lang: 'en',
            name: 'product discount',
          },
        ],
        create: CREATE_PERMISSION_DISCOUNT.value,
        read: READ_PERMISSION_DISCOUNT.value,
        update: UPDATE_PERMISSION_DISCOUNT.value,
        delete: DELETE_PERMISSION_DISCOUNT.value,
        all: ALL_PERMISSION_DISCOUNT.value,
      },
      {
        name: 'موظف شوبكس',
        translation: [
          {
            _lang: 'en',
            name: 'shoppex employee',
          },
        ],
        create: CREATE_PERMISSION_SHOPPEX_EMPLOYEE.value,
        read: READ_PERMISSION_SHOPPEX_EMPLOYEE.value,
        update: UPDATE_PERMISSION_SHOPPEX_EMPLOYEE.value,
        delete: DELETE_PERMISSION_SHOPPEX_EMPLOYEE.value,
        all: ALL_PERMISSION_SHOPPEX_EMPLOYEE.value,
      },
      {
        name: 'موظف الفرع',
        translation: [
          {
            _lang: 'en',
            name: 'merchant employee',
          },
        ],
        create: CREATE_PERMISSION_MERCHANT_EMPLOYEE.value,
        read: READ_PERMISSION_MERCHANT_EMPLOYEE.value,
        update: UPDATE_PERMISSION_MERCHANT_EMPLOYEE.value,
        delete: DELETE_PERMISSION_MERCHANT_EMPLOYEE.value,
        all: ALL_PERMISSION_MERCHANT_EMPLOYEE.value,
      },
      {
        name: 'الكوبونات',
        translation: [
          {
            _lang: 'en',
            name: 'coupon',
          },
        ],
        create: CREATE_PERMISSION_COUPON.value,
        read: READ_PERMISSION_COUPON.value,
        update: UPDATE_PERMISSION_COUPON.value,
        delete: DELETE_PERMISSION_COUPON.value,
        all: ALL_PERMISSION_COUPON.value,
      },
      {
        name: 'موديل السيارة',
        translation: [
          {
            _lang: 'en',
            name: 'vehicle model',
          },
        ],
        create: CREATE_PERMISSION_VEHICLE_MODEL.value,
        read: READ_PERMISSION_VEHICLE_MODEL.value,
        update: UPDATE_PERMISSION_VEHICLE_MODEL.value,
        delete: DELETE_PERMISSION_VEHICLE_MODEL.value,
        all: ALL_PERMISSION_VEHICLE_MODEL.value,
      },
      {
        name: 'علامة السيارة',
        translation: [
          {
            _lang: 'en',
            name: 'vehicle brand',
          },
        ],
        create: CREATE_PERMISSION_VEHICLE_BRAND.value,
        read: READ_PERMISSION_VEHICLE_BRAND.value,
        update: UPDATE_PERMISSION_VEHICLE_BRAND.value,
        delete: DELETE_PERMISSION_VEHICLE_BRAND.value,
        all: ALL_PERMISSION_VEHICLE_BRAND.value,
      },
      {
        name: 'سنة السيارة',
        translation: [
          {
            _lang: 'en',
            name: 'vehicle year',
          },
        ],
        create: CREATE_PERMISSION_VEHICLE_YEAR.value,
        read: READ_PERMISSION_VEHICLE_YEAR.value,
        update: UPDATE_PERMISSION_VEHICLE_YEAR.value,
        delete: DELETE_PERMISSION_VEHICLE_YEAR.value,
        all: ALL_PERMISSION_VEHICLE_YEAR.value,
      },
      {
        name: 'السيارة',
        translation: [
          {
            _lang: 'en',
            name: 'vehicle',
          },
        ],
        create: CREATE_PERMISSION_VEHICLE.value,
        read: READ_PERMISSION_VEHICLE.value,
        update: UPDATE_PERMISSION_VEHICLE.value,
        delete: DELETE_PERMISSION_VEHICLE.value,
        all: ALL_PERMISSION_VEHICLE.value,
      },
    ];
    return permissions;
  }

  async getAllPermissionsForMerchantEmployee() {
    const permissions = [
      {
        name: 'الفرع',
        translation: [
          {
            _lang: 'en',
            name: 'branch',
          },
        ],
        create: CREATE_PERMISSION_BRANCH.value,
        read: READ_PERMISSION_BRANCH.value,
        update: UPDATE_PERMISSION_BRANCH.value,
        delete: DELETE_PERMISSION_BRANCH.value,
        all: ALL_PERMISSION_BRANCH.value,
      },
      {
        name: 'المتجر',
        translation: [
          {
            _lang: 'en',
            name: 'merchant',
          },
        ],
        create: CREATE_PERMISSION_MERCHANT.value,
        read: READ_PERMISSION_MERCHANT.value,
        update: UPDATE_PERMISSION_MERCHANT.value,
        delete: DELETE_PERMISSION_MERCHANT.value,
        all: ALL_PERMISSION_MERCHANT.value,
      },
      {
        name: 'الطلبات',
        translation: [
          {
            _lang: 'en',
            name: 'order',
          },
        ],
        create: CREATE_PERMISSION_ORDER.value,
        read: READ_PERMISSION_ORDER.value,
        update: UPDATE_PERMISSION_ORDER.value,
        delete: DELETE_PERMISSION_ORDER.value,
        all: ALL_PERMISSION_ORDER.value,
      },
      {
        name: 'التقييمات',
        translation: [
          {
            _lang: 'en',
            name: 'rating',
          },
        ],
        create: CREATE_PERMISSION_RATING.value,
        read: READ_PERMISSION_RATING.value,
        update: UPDATE_PERMISSION_RATING.value,
        delete: DELETE_PERMISSION_RATING.value,
        all: ALL_PERMISSION_RATING.value,
      },
      {
        name: 'المنتجات',
        translation: [
          {
            _lang: 'en',
            name: 'products',
          },
        ],
        create: CREATE_PERMISSION_PRODUCT.value,
        read: READ_PERMISSION_PRODUCT.value,
        update: UPDATE_PERMISSION_PRODUCT.value,
        delete: DELETE_PERMISSION_PRODUCT.value,
        all: ALL_PERMISSION_PRODUCT.value,
      },
      {
        name: 'الاضافات',
        translation: [
          {
            _lang: 'en',
            name: 'product group',
          },
        ],
        create: CREATE_PERMISSION_PRODUCT_GROUP.value,
        read: READ_PERMISSION_PRODUCT_GROUP.value,
        update: UPDATE_PERMISSION_PRODUCT_GROUP.value,
        delete: DELETE_PERMISSION_PRODUCT_GROUP.value,
        all: ALL_PERMISSION_PRODUCT_GROUP.value,
      },
      {
        name: 'الخصومات',
        translation: [
          {
            _lang: 'en',
            name: 'product discount',
          },
        ],
        create: CREATE_PERMISSION_DISCOUNT.value,
        read: READ_PERMISSION_DISCOUNT.value,
        update: UPDATE_PERMISSION_DISCOUNT.value,
        delete: DELETE_PERMISSION_DISCOUNT.value,
        all: ALL_PERMISSION_DISCOUNT.value,
      },
      {
        name: 'الحجوزات',
        translation: [
          {
            _lang: 'en',
            name: 'reservation',
          },
        ],
        create: CREATE_PERMISSION_RESERVATION.value,
        read: READ_PERMISSION_RESERVATION.value,
        update: UPDATE_PERMISSION_RESERVATION.value,
        delete: DELETE_PERMISSION_RESERVATION.value,
        all: ALL_PERMISSION_RESERVATION.value,
      },
      {
        name: 'الطاولة',
        translation: [
          {
            _lang: 'en',
            name: 'table',
          },
        ],
        create: CREATE_PERMISSION_TABLE.value,
        read: READ_PERMISSION_TABLE.value,
        update: UPDATE_PERMISSION_TABLE.value,
        delete: DELETE_PERMISSION_TABLE.value,
        all: ALL_PERMISSION_TABLE.value,
      },
      {
        name: 'العمولات',
        translation: [
          {
            _lang: 'en',
            name: 'transaction',
          },
        ],
        create: CREATE_PERMISSION_TRANSACTION.value,
        read: READ_PERMISSION_TRANSACTION.value,
        update: UPDATE_PERMISSION_TRANSACTION.value,
        delete: DELETE_PERMISSION_TRANSACTION.value,
        all: ALL_PERMISSION_TRANSACTION.value,
      },
      {
        name: 'موظف الفرع',
        translation: [
          {
            _lang: 'en',
            name: 'merchant employee',
          },
        ],
        create: CREATE_PERMISSION_MERCHANT_EMPLOYEE.value,
        read: READ_PERMISSION_MERCHANT_EMPLOYEE.value,
        update: UPDATE_PERMISSION_MERCHANT_EMPLOYEE.value,
        delete: DELETE_PERMISSION_MERCHANT_EMPLOYEE.value,
        all: ALL_PERMISSION_MERCHANT_EMPLOYEE.value,
      },
      {
        name: 'الكوبونات',
        translation: [
          {
            _lang: 'en',
            name: 'coupon',
          },
        ],
        create: CREATE_PERMISSION_COUPON.value,
        read: READ_PERMISSION_COUPON.value,
        update: UPDATE_PERMISSION_COUPON.value,
        delete: DELETE_PERMISSION_COUPON.value,
        all: ALL_PERMISSION_COUPON.value,
      },
    ];
    return permissions;
  }
}
