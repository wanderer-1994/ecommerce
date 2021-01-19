let api_get_endpoints = [   // 5
    `${domain}/api/category`,
    `${domain}/api/product-user?searchName=cu%20sac%20hoco&category=/usb-the-nho&prod_id=0023&page=2`,
    `${domain}/api/product-admin`,
    `${domain}/api/order-user?user_tel=0388034543&since=123456&upto=123578`,
    `${domain}/api/order-admin?since=123456&upto=123578&searchText=0388034543&searchStatus=đã%20tiếp%20nhận`, // require admin auth
    `${domain}/api/user-admin`,
    `${domain}/api/user-user?user_tel=0388034543`,
    `${domain}/api/admin`,
]

let api_post_endpoints = [  // 7
    // products:    {prod_link, category}
    // categories:  {category_path, category_name, priority}
    // users:       {user_tel, user_name, user_address, user_location, completed_order}
    // admin:       {admin_tel, admin_pas, admin_name}
    `${domain}/api/category`,           // {categories: [categories]}               - require admin auth
    `${domain}/api/product`,            // {products: [products]}                   - require admin auth
    `${domain}/api/product/initiate`,   // {prod_ids: []}                           - require admin auth
    `${domain}/api/product/update`,     // {is_all: true, prod_ids[]}               - require admin auth
    `${domain}/api/order`,              // {products: [product], user: {user}}
    `${domain}/api/user`,               // {users: [users]}                         - require admin auth
    `${domain}/api/admin`,              // {admins: [admins] }                      - require admin auth
    `${domain}/api/admin/auth`,         // {admin_cookie, admin_pas, admin_tel] }   - require admin auth
    `${domain}/api/admin/unauth`,       // {admin_cookie, admin_pas, admin_tel] }   - require admin auth
    `${domain}/api/cart-validate`,      // {prod_ids: prod_ids}
    `${domain}/api/access-announce`     // {machineKey: machineKey, lastAccess: lastAccess}
]

let api_put_endpoints = [   // 5
    `${domain}/api/category`,           // {categories: [categories]}               - require admin auth
    `${domain}/api/product`,            // {products: [products]}                   - require admin auth
    `${domain}/api/product-supinfo`,    // {product_ids: [product_id]}              - require admin auth
    `${domain}/api/product-initprod`,   // {product_ids: [product_id]}              - require admin auth
    `${domain}/api/order`,              // {orders: [products and user_info]}       - require admin auth
    `${domain}/api/order-userwarranty`, // {record_id: record_id}
    `${domain}/api/user`,               // {users: [users]}                         - require admin auth
    `${domain}/api/admin`               // {admins: [admins] }                      - require admin auth
]

let api_delete_endpoints = [    // 4
    `${domain}/api/category`,           // {categories: [categories]}               - require admin auth
    `${domain}/api/product`,            // {prod_ids: []}                           - require admin auth
    `${domain}/api/user`,               // {user_ids: []}                           - require admin auth
    `${domain}/api/admin`               // {admin_ids: [] }                         - require admin auth
]